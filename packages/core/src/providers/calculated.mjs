import {
  CalculationMethod,
  Coordinates,
  HighLatitudeRule,
  Madhab,
  PolarCircleResolution,
  PrayerTimes,
} from "adhan";
import { occurrenceId } from "../prayers.mjs";

const FIELDS = ["fajr", "dhuhr", "asr", "maghrib", "isha"];

const METHODS = Object.freeze({
  turkey: () => CalculationMethod.Turkey(),
  ummAlQura: () => CalculationMethod.UmmAlQura(),
  muslimWorldLeague: () => CalculationMethod.MuslimWorldLeague(),
  moonsightingCommittee: () => CalculationMethod.MoonsightingCommittee(),
  egyptian: () => CalculationMethod.Egyptian(),
  karachi: () => CalculationMethod.Karachi(),
  dubai: () => CalculationMethod.Dubai(),
  qatar: () => CalculationMethod.Qatar(),
  kuwait: () => CalculationMethod.Kuwait(),
  singapore: () => CalculationMethod.Singapore(),
  tehran: () => CalculationMethod.Tehran(),
  northAmerica: () => CalculationMethod.NorthAmerica(),
});

export function dayKey(date, timeZone = "UTC") {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${values.year}-${values.month}-${values.day}`;
}

export function calculatedPrayerDay({
  date,
  latitude,
  longitude,
  timeZone = "Europe/Istanbul",
  method = "turkey",
  madhab = "hanafi",
}) {
  const coordinates = new Coordinates(latitude, longitude);
  const factory = METHODS[method] ?? METHODS.muslimWorldLeague;
  const params = factory();
  params.madhab = madhab === "hanafi" ? Madhab.Hanafi : Madhab.Shafi;
  params.highLatitudeRule = HighLatitudeRule.recommended(coordinates);
  if (Math.abs(latitude) >= 66) params.polarCircleResolution = PolarCircleResolution.AqrabYaum;
  const times = new PrayerTimes(coordinates, date, params);
  const key = dayKey(date, timeZone);
  return FIELDS.map((prayerKey) => ({
    id: occurrenceId(key, prayerKey),
    key: prayerKey,
    dayKey: key,
    at: times[prayerKey],
    source: `calculated-${method}`,
  }));
}

export function calculatedPrayerWindow(options, centerDate = new Date()) {
  return [-1, 0, 1].flatMap((offset) => {
    const date = new Date(centerDate);
    date.setDate(date.getDate() + offset);
    return calculatedPrayerDay({ ...options, date });
  });
}
