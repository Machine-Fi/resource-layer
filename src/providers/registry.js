import { createProviderCapability, matchesCapability } from "../resources.js";

export function createProviderRegistry(capabilities = []) {
  const records = new Map();
  for (const capability of capabilities) {
    const normalized = createProviderCapability(capability);
    records.set(normalized.id, normalized);
  }

  return {
    register(capability) {
      const normalized = createProviderCapability(capability);
      records.set(normalized.id, normalized);
      return normalized;
    },
    get(capabilityId) {
      return records.get(capabilityId) ?? null;
    },
    list() {
      return [...records.values()];
    },
    findForRequest(request) {
      return [...records.values()].filter((capability) => matchesCapability(request, capability));
    },
  };
}
