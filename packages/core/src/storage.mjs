const DEFAULT_KEY = "ghroob:state:v1";
const LEGACY_KEYS = ["salah-screen:state:v1"];

export function createBrowserStore(storage = globalThis.localStorage, key = DEFAULT_KEY, legacyKeys = LEGACY_KEYS) {
  return {
    load() {
      try {
        const raw = storage?.getItem(key)
          ?? legacyKeys.map((legacyKey) => storage?.getItem(legacyKey)).find(Boolean);
        return raw ? JSON.parse(raw) : null;
      } catch {
        return null;
      }
    },
    save(value) {
      storage?.setItem(key, JSON.stringify(value));
      return value;
    },
    clear() {
      storage?.removeItem(key);
    },
  };
}

export function createMemoryStore(initialValue = null) {
  let value = initialValue;
  return {
    load: () => value,
    save(next) {
      value = structuredClone(next);
      return next;
    },
    clear() {
      value = null;
    },
  };
}
