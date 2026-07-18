export class ResourceLayerError extends Error {
  constructor(code, message, details = {}) {
    super(message);
    this.name = "ResourceLayerError";
    this.code = code;
    this.details = Object.freeze({ ...details });
  }
}

export function ok(value, meta = {}) {
  return Object.freeze({ ok: true, value, meta: Object.freeze({ ...meta }) });
}

export function fail(code, message, details = {}) {
  return Object.freeze({
    ok: false,
    error: Object.freeze({ code, message, details: Object.freeze({ ...details }) }),
  });
}

export function unwrap(result) {
  if (result?.ok) return result.value;
  const err = result?.error ?? { code: "UNKNOWN", message: "Unknown resource layer failure" };
  throw new ResourceLayerError(err.code, err.message, err.details);
}

export const ErrorCodes = Object.freeze({
  INVALID_MACHINE_SESSION: "INVALID_MACHINE_SESSION",
  INVALID_RESOURCE_REQUEST: "INVALID_RESOURCE_REQUEST",
  INVALID_PROVIDER_CAPABILITY: "INVALID_PROVIDER_CAPABILITY",
  NO_PROVIDER_CAPABILITY: "NO_PROVIDER_CAPABILITY",
  NO_COMPATIBLE_RAIL: "NO_COMPATIBLE_RAIL",
  SPEND_POLICY_EXCEEDED: "SPEND_POLICY_EXCEEDED",
  QUOTE_EXPIRED: "QUOTE_EXPIRED",
  QUOTE_EXCEEDS_MAX_PRICE: "QUOTE_EXCEEDS_MAX_PRICE",
  REQUESTER_NOT_APPROVED: "REQUESTER_NOT_APPROVED",
  SETTLEMENT_NOT_AUTHORIZED: "SETTLEMENT_NOT_AUTHORIZED",
  ACCESS_NOT_GRANTED: "ACCESS_NOT_GRANTED",
});
