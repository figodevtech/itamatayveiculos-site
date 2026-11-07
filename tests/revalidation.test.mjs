import test from "node:test";
import assert from "node:assert/strict";
import { parseRevalidationEvent, getRevalidationTargets } from "../lib/revalidation.ts";

test("vehicle publication invalidates detail, every list and shorts", () => {
  const targets = getRevalidationTargets(parseRevalidationEvent({
    eventId: "change:123", topics: ["vehicles"], vehicleIds: [42, 42, 99],
  }));
  assert.deepEqual(new Set(targets.tags), new Set(["catalog", "shorts", "vehicle:42", "vehicle:99"]));
  for (const path of ["/", "/veiculos", "/veiculos/repasses", "/shorts", "/veiculos/42", "/veiculos/99"]) {
    assert.ok(targets.paths.includes(path));
  }
});

test("banner and settings updates do not evict vehicle data", () => {
  assert.deepEqual(getRevalidationTargets(parseRevalidationEvent({
    eventId: "marketing", topics: ["banners", "settings"], vehicleIds: [],
  })), { tags: ["banners", "settings"], paths: ["/"] });
});

test("rejects untrusted topics, malformed IDs, oversized batches and invalid envelopes", () => {
  const valid = { eventId: "123", topics: ["vehicles"], vehicleIds: [1] };
  for (const invalid of [null, [], { ...valid, eventId: "../layout" },
    { ...valid, topics: ["anything"] }, { ...valid, topics: [] },
    { ...valid, vehicleIds: [] }, { ...valid, vehicleIds: ["1"] },
    { ...valid, vehicleIds: [-1] }, { ...valid, vehicleIds: [1.5] },
    { ...valid, vehicleIds: [Number.MAX_SAFE_INTEGER + 1] },
    { ...valid, vehicleIds: Array.from({length:501}, (_, index) => index+1) },
  ]) assert.throws(() => parseRevalidationEvent(invalid));
});
