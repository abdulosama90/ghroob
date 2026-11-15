import test from "node:test";
import assert from "node:assert/strict";
import { countryForTimeZone, countryPreset } from "../src/providers/catalog.mjs";

test("country recommendations select a suitable starting method", () => {
  assert.equal(countryPreset("TR").method, "turkey");
  assert.equal(countryPreset("SA").method, "ummAlQura");
  assert.equal(countryPreset("GB").method, "moonsightingCommittee");
  assert.equal(countryPreset("DE").method, "muslimWorldLeague");
  assert.equal(countryPreset("PK").method, "karachi");
  assert.equal(countryPreset("OTHER").method, "muslimWorldLeague");
});

test("time zone detection suggests a country without a network lookup", () => {
  assert.equal(countryForTimeZone("Europe/Istanbul"), "TR");
  assert.equal(countryForTimeZone("Asia/Riyadh"), "SA");
  assert.equal(countryForTimeZone("Europe/London"), "GB");
  assert.equal(countryForTimeZone("Unknown/Zone", "DE"), "DE");
  assert.equal(countryForTimeZone("Unknown/Zone", "ZZ"), "OTHER");
});
