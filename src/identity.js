const MACHINE_ROLES = new Set(["requester", "provider"]);

export function createMachineSession(input) {
  const session = {
    machineId: requiredString(input?.machineId, "machineId"),
    role: requiredString(input?.role, "role"),
    label: input?.label ?? input?.machineId,
    runtime: input?.runtime ?? "machinefi-runtime",
    region: input?.region ?? "global",
    capabilities: Array.isArray(input?.capabilities) ? [...input.capabilities] : [],
    metadata: { ...(input?.metadata ?? {}) },
  };

  if (!MACHINE_ROLES.has(session.role)) {
    throw new Error(`Unknown machine role: ${session.role}`);
  }

  return Object.freeze(session);
}

export function isRequester(session) {
  return session?.role === "requester";
}

export function isProvider(session) {
  return session?.role === "provider";
}

function requiredString(value, field) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${field} is required`);
  }
  return value.trim();
}
