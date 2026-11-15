import { PRAYER_KEYS } from "./prayers.mjs";

const DAY_MS = 86_400_000;

function instant(value, label) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) throw new TypeError(`${label} must be a valid date.`);
  return date;
}

export function normalizeOccurrences(occurrences) {
  const seen = new Set();
  return occurrences
    .map((item) => {
      if (!item?.id || !PRAYER_KEYS.includes(item.key)) {
        throw new TypeError("Every occurrence needs an id and a known prayer key.");
      }
      if (seen.has(item.id)) throw new TypeError(`Duplicate prayer occurrence: ${item.id}`);
      seen.add(item.id);
      return { ...item, at: instant(item.at, `${item.id}.at`) };
    })
    .sort((a, b) => a.at - b.at);
}

export function createLedger({ trackingStartedAt = new Date(), completions = {} } = {}) {
  return {
    version: 1,
    trackingStartedAt: instant(trackingStartedAt, "trackingStartedAt").toISOString(),
    completions: { ...completions },
  };
}

export function startAtCurrentPrayer(occurrences, now = new Date()) {
  const currentTime = instant(now, "now").getTime();
  const current = normalizeOccurrences(occurrences)
    .filter((item) => item.at.getTime() <= currentTime)
    .at(-1);
  return current?.at ?? instant(now, "now");
}

export function pendingOccurrences(occurrences, ledger, now = new Date()) {
  const currentTime = instant(now, "now").getTime();
  const started = instant(ledger.trackingStartedAt, "trackingStartedAt").getTime();
  const completions = ledger.completions ?? {};
  return normalizeOccurrences(occurrences).filter((item) => (
    item.at.getTime() >= started
    && item.at.getTime() <= currentTime
    && !completions[item.id]
  ));
}

export function activePendingOccurrence(occurrences, ledger, now = new Date()) {
  return pendingOccurrences(occurrences, ledger, now)[0] ?? null;
}

export function nextOccurrence(occurrences, now = new Date()) {
  const currentTime = instant(now, "now").getTime();
  return normalizeOccurrences(occurrences).find((item) => item.at.getTime() > currentTime) ?? null;
}

export function markActivePrayerPrayed({ occurrences, ledger, now = new Date() }) {
  const completedAt = instant(now, "now");
  const active = activePendingOccurrence(occurrences, ledger, completedAt);
  if (!active) {
    return { ledger, completed: null, reason: "nothing-due" };
  }

  return {
    completed: active,
    reason: "completed",
    ledger: {
      ...ledger,
      completions: {
        ...(ledger.completions ?? {}),
        [active.id]: completedAt.toISOString(),
      },
    },
  };
}

export function pruneLedger(ledger, now = new Date(), retentionDays = 45) {
  const cutoff = instant(now, "now").getTime() - retentionDays * DAY_MS;
  const completions = Object.fromEntries(
    Object.entries(ledger.completions ?? {}).filter(([, value]) => {
      const completedAt = new Date(value).getTime();
      return Number.isFinite(completedAt) && completedAt >= cutoff;
    }),
  );
  return { ...ledger, completions };
}
