import test from "node:test";
import assert from "node:assert/strict";
import {
  activePendingOccurrence,
  createLedger,
  markActivePrayerPrayed,
  nextOccurrence,
  startAtCurrentPrayer,
} from "../src/state.mjs";

const occurrence = (id, key, at) => ({ id, key, at: new Date(at) });

const schedule = [
  occurrence("2026-10-13:isha", "isha", "2026-10-13T19:50:00+03:00"),
  occurrence("2026-10-14:fajr", "fajr", "2026-10-14T05:45:00+03:00"),
  occurrence("2026-10-14:dhuhr", "dhuhr", "2026-10-14T12:50:00+03:00"),
  occurrence("2026-10-14:asr", "asr", "2026-10-14T16:05:00+03:00"),
];

test("the oldest missed occurrence remains active across midnight", () => {
  const ledger = createLedger({ trackingStartedAt: schedule[0].at });
  const active = activePendingOccurrence(schedule, ledger, "2026-10-14T06:00:00+03:00");
  assert.equal(active.id, "2026-10-13:isha");
});

test("marking prayed never completes or promotes a future prayer", () => {
  const now = new Date("2026-10-14T06:00:00+03:00");
  const ledger = createLedger({ trackingStartedAt: schedule[0].at });
  const first = markActivePrayerPrayed({ occurrences: schedule, ledger, now });
  assert.equal(first.completed.id, "2026-10-13:isha");
  assert.equal(activePendingOccurrence(schedule, first.ledger, now).id, "2026-10-14:fajr");

  const second = markActivePrayerPrayed({ occurrences: schedule, ledger: first.ledger, now });
  assert.equal(second.completed.id, "2026-10-14:fajr");
  assert.equal(activePendingOccurrence(schedule, second.ledger, now), null);
  assert.equal(nextOccurrence(schedule, now).id, "2026-10-14:dhuhr");

  const third = markActivePrayerPrayed({ occurrences: schedule, ledger: second.ledger, now });
  assert.equal(third.reason, "nothing-due");
  assert.equal(third.ledger, second.ledger);
});

test("first launch begins at the current prayer rather than inventing old misses", () => {
  const now = new Date("2026-10-14T13:15:00+03:00");
  assert.equal(startAtCurrentPrayer(schedule, now).toISOString(), schedule[2].at.toISOString());
});
