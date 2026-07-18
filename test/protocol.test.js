import test from "node:test";
import assert from "node:assert/strict";
import {
  createMachineSession,
  createProviderCapability,
  createResourceRequest,
  isRequester,
  matchesCapability,
} from "../src/index.js";

test("creates machine sessions and resource requests", () => {
  const robot = createMachineSession({ machineId: "farm-robot-01", role: "requester" });
  const capability = createProviderCapability({
    id: "weather-hourly",
    providerId: "weather-station-7",
    resourceType: "weather-data",
    railTags: ["fixture-rail"],
  });
  const request = createResourceRequest({
    id: "req-001",
    requesterId: robot.machineId,
    resourceType: "weather-data",
    quantity: 1,
    maxPrice: 0.05,
    preferredRails: ["fixture-rail"],
  });

  assert.equal(isRequester(robot), true);
  assert.equal(matchesCapability(request, capability), true);
});
