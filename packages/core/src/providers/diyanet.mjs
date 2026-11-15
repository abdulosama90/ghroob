import { occurrenceId } from "../prayers.mjs";

const KEYS = ["fajr", "dhuhr", "asr", "maghrib", "isha"];

/**
 * Converts an authenticated Diyanet response into Salah Screen occurrences.
 * Network access and credentials stay in the host app so the core never stores
 * or publishes household secrets.
 */
export function normalizeDiyanetDay({ dayKey, times }) {
  if (!dayKey || !times) throw new TypeError("Diyanet dayKey and times are required.");
  return KEYS.map((key) => {
    const at = new Date(times[key]);
    if (Number.isNaN(at.getTime())) throw new TypeError(`Invalid Diyanet ${key} time.`);
    return {
      id: occurrenceId(dayKey, key),
      key,
      dayKey,
      at,
      source: "diyanet",
    };
  });
}

export function createDiyanetProvider({ loadDay }) {
  if (typeof loadDay !== "function") {
    throw new TypeError("A credential-aware loadDay function is required.");
  }
  return {
    name: "diyanet",
    async getDay(dayKey) {
      return normalizeDiyanetDay({ dayKey, times: await loadDay(dayKey) });
    },
  };
}
