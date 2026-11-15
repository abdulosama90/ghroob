import test from "node:test";
import assert from "node:assert/strict";
import { createBrowserStore } from "../src/storage.mjs";

function memoryStorage(entries = {}) {
  const values = new Map(Object.entries(entries));
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
  };
}

test("the Ghroob store can migrate state saved under the previous project name", () => {
  const previous = { onboardingCompleted: true, settings: { country: "TR" } };
  const storage = memoryStorage({
    "salah-screen:state:v1": JSON.stringify(previous),
  });

  const store = createBrowserStore(storage);
  assert.deepEqual(store.load(), previous);

  store.save(previous);
  assert.deepEqual(JSON.parse(storage.getItem("ghroob:state:v1")), previous);
});
