import test from "node:test";
import assert from "node:assert/strict";
import {
  ErrorCodes,
  createMachineSession,
  createResourceRequest,
  validateMachineSession,
  validateResourceRequest,
} from "../src/index.js";

test("validates machine sessions and resource requests", () => {
  const session = createMachineSession({ machineId: "drone-7", role: "requester" });
  const request = createResourceRequest({
    id: "req-drone-route",
    requesterId: session.machineId,
    resourceType: "route-map",
    quantity: 3,
    maxPrice: 0.5,
  });

  assert.equal(validateMachineSession(session).ok, true);
  assert.equal(validateResourceRequest(request).ok, true);

  const invalid = validateResourceRequest({ id: "bad" });
  assert.equal(invalid.ok, false);
  assert.equal(invalid.error.code, ErrorCodes.INVALID_RESOURCE_REQUEST);
});
