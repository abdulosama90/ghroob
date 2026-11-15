export const PRAYERS = Object.freeze([
  { key: "fajr", ar: "الفجر", en: "Fajr" },
  { key: "dhuhr", ar: "الظهر", en: "Dhuhr" },
  { key: "asr", ar: "العصر", en: "Asr" },
  { key: "maghrib", ar: "المغرب", en: "Maghrib" },
  { key: "isha", ar: "العشاء", en: "Isha" },
]);

export const PRAYER_KEYS = Object.freeze(PRAYERS.map(({ key }) => key));

export function prayerByKey(key) {
  return PRAYERS.find((prayer) => prayer.key === key) ?? null;
}

export function occurrenceId(dayKey, prayerKey) {
  if (!dayKey || !PRAYER_KEYS.includes(prayerKey)) {
    throw new TypeError("A valid day and prayer key are required.");
  }
  return `${dayKey}:${prayerKey}`;
}
