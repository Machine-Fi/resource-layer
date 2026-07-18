const RESOURCE_TYPES = new Set([
  "weather-data",
  "soil-sensor-data",
  "route-map",
  "charging-slot",
  "compute-burst",
  "bandwidth-grant",
  "telemetry-feed",
]);

export function createProviderCapability(input) {
  const capability = {
    id: requiredString(input?.id, "id"),
    providerId: requiredString(input?.providerId, "providerId"),
    resourceType: requiredString(input?.resourceType, "resourceType"),
    label: input?.label ?? input?.id,
    unit: input?.unit ?? "request",
    railTags: Array.isArray(input?.railTags) ? [...input.railTags] : [],
    metadata: { ...(input?.metadata ?? {}) },
  };

  if (!RESOURCE_TYPES.has(capability.resourceType)) {
    throw new Error(`Unknown resource type: ${capability.resourceType}`);
  }

  return Object.freeze(capability);
}

export function createResourceRequest(input) {
  const request = {
    id: requiredString(input?.id, "id"),
    requesterId: requiredString(input?.requesterId, "requesterId"),
    resourceType: requiredString(input?.resourceType, "resourceType"),
    quantity: positiveNumber(input?.quantity ?? 1, "quantity"),
    maxPrice: positiveNumber(input?.maxPrice, "maxPrice"),
    preferredRails: Array.isArray(input?.preferredRails) ? [...input.preferredRails] : [],
    purpose: input?.purpose ?? "resource-access",
    metadata: { ...(input?.metadata ?? {}) },
  };

  if (!RESOURCE_TYPES.has(request.resourceType)) {
    throw new Error(`Unknown resource type: ${request.resourceType}`);
  }

  return Object.freeze(request);
}

export function matchesCapability(request, capability) {
  return request?.resourceType === capability?.resourceType;
}

export function listResourceTypes() {
  return [...RESOURCE_TYPES];
}

function requiredString(value, field) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${field} is required`);
  }
  return value.trim();
}

function positiveNumber(value, field) {
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
    throw new Error(`${field} must be a positive number`);
  }
  return value;
}
