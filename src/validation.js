import { ErrorCodes, fail, ok } from "./errors.js";

export function assertString(value, field) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${field} is required`);
  }
  return value.trim();
}

export function assertPositiveNumber(value, field) {
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
    throw new Error(`${field} must be a positive number`);
  }
  return value;
}

export function validateMachineSession(session) {
  const missing = [];
  if (!session?.machineId) missing.push("machineId");
  if (!session?.role) missing.push("role");
  if (missing.length) {
    return fail(ErrorCodes.INVALID_MACHINE_SESSION, "Machine session is missing required fields", { missing });
  }
  return ok(session);
}

export function validateResourceRequest(request) {
  const missing = [];
  for (const field of ["id", "requesterId", "resourceType", "quantity", "maxPrice"]) {
    if (request?.[field] === undefined || request?.[field] === null || request?.[field] === "") missing.push(field);
  }
  if (missing.length) {
    return fail(ErrorCodes.INVALID_RESOURCE_REQUEST, "Resource request is missing required fields", { missing });
  }
  if (request.quantity <= 0 || request.maxPrice <= 0) {
    return fail(ErrorCodes.INVALID_RESOURCE_REQUEST, "Resource request quantity and max price must be positive", {
      quantity: request.quantity,
      maxPrice: request.maxPrice,
    });
  }
  return ok(request);
}

export function validateProviderCapability(capability) {
  const missing = [];
  for (const field of ["id", "providerId", "resourceType", "unit"]) {
    if (capability?.[field] === undefined || capability?.[field] === null || capability?.[field] === "") missing.push(field);
  }
  if (missing.length) {
    return fail(ErrorCodes.INVALID_PROVIDER_CAPABILITY, "Provider capability is missing required fields", { missing });
  }
  return ok(capability);
}

export function uniqueBy(items, keyFn) {
  const seen = new Set();
  const out = [];
  for (const item of items) {
    const key = keyFn(item);
    if (!seen.has(key)) {
      seen.add(key);
      out.push(item);
    }
  }
  return out;
}
