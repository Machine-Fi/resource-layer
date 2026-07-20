import test from "node:test";
import assert from "node:assert/strict";
import {
  createProviderRegistry,
  createRailPolicy,
  createResourceRequest,
  fixtureProviderCapabilities,
  fixtureRuntimeRails,
  selectRuntimeRail,
} from "../src/index.js";

test("selects a compatible runtime rail", () => {
  const registry = createProviderRegistry(fixtureProviderCapabilities);
  const request = createResourceRequest({
    id: "req-soil",
    requesterId: "farm-robot-01",
    resourceType: "soil-sensor-data",
    quantity: 4,
    maxPrice: 0.12,
    preferredRails: ["fixture-usdc"],
  });
  const capability = registry.findForRequest(request)[0];
  const policy = createRailPolicy({ allowedRails: ["fixture-usdc"], maxSpend: 1 });

  const selection = selectRuntimeRail({ request, capability, rails: fixtureRuntimeRails, policy });
  assert.equal(selection.ok, true);
  assert.equal(selection.rail.id, "fixture-usdc");
});
