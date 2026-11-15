import test from "node:test";
import assert from "node:assert/strict";
import { calculatedPrayerDay } from "../src/providers/calculated.mjs";

test("the Turkey provider returns five ordered Gebze prayer occurrences", () => {
  const prayers = calculatedPrayerDay({
    date: new Date(2026, 10, 15),
    latitude: 40.8028,
    longitude: 29.4307,
    timeZone: "Europe/Istanbul",
    method: "turkey",
    madhab: "hanafi",
  });

  assert.deepEqual(prayers.map(({ key }) => key), ["fajr", "dhuhr", "asr", "maghrib", "isha"]);
  assert.ok(prayers.every(({ at, source }) => at instanceof Date && source === "calculated-turkey"));
  assert.ok(prayers.every((item, index) => index === 0 || item.at > prayers[index - 1].at));
});
