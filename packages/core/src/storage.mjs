const DEFAULT_KEY = "salah-screen:state:v1";

export function createBrowserStore(storage = globalThis.localStorage, key = DEFAULT_KEY) {
  return {
    load() {
      try {
        const raw = storage?.getItem(key);
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
