import test from "node:test";
import assert from "node:assert/strict";
import {
  createProviderRegistry,
  createResourceRequest,
  fixtureProviderCapabilities,
} from "../src/index.js";

test("finds provider capabilities for a resource request", () => {
  const registry = createProviderRegistry(fixtureProviderCapabilities);
  const request = createResourceRequest({
    id: "req-weather",
    requesterId: "farm-robot-01",
    resourceType: "weather-data",
    quantity: 1,
    maxPrice: 0.05,
    preferredRails: ["fixture-usdc"],
  });

  const matches = registry.findForRequest(request);
  assert.equal(matches.length, 1);
  assert.equal(matches[0].providerId, "weather-station-north-field");
});
