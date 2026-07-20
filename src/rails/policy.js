export function createRuntimeRail(input) {
  return Object.freeze({
    id: requiredString(input?.id, "id"),
    label: input?.label ?? input?.id,
    network: input?.network ?? "fixture-network",
    asset: input?.asset ?? "fixture-credit",
    maxSettlementAmount: positiveNumber(input?.maxSettlementAmount, "maxSettlementAmount"),
    metadata: { ...(input?.metadata ?? {}) },
  });
}

export function createRailPolicy(input) {
  return Object.freeze({
    allowedRails: new Set(input?.allowedRails ?? []),
    maxSpend: positiveNumber(input?.maxSpend, "maxSpend"),
    requireRequesterApproval: input?.requireRequesterApproval !== false,
  });
}

export function selectRuntimeRail({ request, capability, rails, policy }) {
  const preferred = new Set(request.preferredRails ?? []);
  const supported = new Set(capability.railTags ?? []);
  const allowed = policy.allowedRails;

  const selected = rails.find((rail) => {
    return preferred.has(rail.id) && supported.has(rail.id) && allowed.has(rail.id);
  });

  if (!selected) {
    return { ok: false, reason: "no-compatible-rail" };
  }

  if (request.maxPrice > policy.maxSpend || request.maxPrice > selected.maxSettlementAmount) {
    return { ok: false, reason: "spend-policy-exceeded" };
  }

  return { ok: true, rail: selected, requesterApprovalRequired: policy.requireRequesterApproval };
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
