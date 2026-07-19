import { createProviderCapability } from "../resources.js";
import { quoteResourceAccess } from "../quotes/quotes.js";

export function createProviderAdapter(input) {
  const capability = createProviderCapability(input.capability);
  const latencyMs = input.latencyMs ?? 50;
  const availability = input.availability ?? 0.99;
  const dataShape = Object.freeze({ ...(input.dataShape ?? {}) });
  const handlers = Object.freeze({
    quote: input.quote ?? defaultQuote,
    fulfill: input.fulfill ?? defaultFulfill,
    health: input.health ?? defaultHealth,
  });

  return Object.freeze({
    id: capability.providerId,
    capability,
    latencyMs,
    availability,
    dataShape,
    describe() {
      return Object.freeze({
        providerId: capability.providerId,
        capabilityId: capability.id,
        resourceType: capability.resourceType,
        unit: capability.unit,
        latencyMs,
        availability,
        dataShape,
      });
    },
    quote({ request, rail }) {
      return handlers.quote({ request, capability, rail, adapter: this });
    },
    fulfill({ request, grant, quote }) {
      return handlers.fulfill({ request, capability, grant, quote, adapter: this });
    },
    health() {
      return handlers.health({ capability, adapter: this });
    },
  });
}

export function createAdapterBook(adapters = []) {
  const byCapability = new Map();
  const byProvider = new Map();
  for (const adapter of adapters) {
    byCapability.set(adapter.capability.id, adapter);
    byProvider.set(adapter.id, adapter);
  }
  return Object.freeze({
    getByCapability(capabilityId) {
      return byCapability.get(capabilityId) ?? null;
    },
    getByProvider(providerId) {
      return byProvider.get(providerId) ?? null;
    },
    list() {
      return [...byCapability.values()];
    },
    describe() {
      return [...byCapability.values()].map((adapter) => adapter.describe());
    },
  });
}

function defaultQuote({ request, capability, rail }) {
  return quoteResourceAccess({ request, capability, rail });
}

function defaultFulfill({ request, capability, grant, quote }) {
  return Object.freeze({
    providerId: capability.providerId,
    requestId: request.id,
    grantId: grant.id,
    quoteId: quote.id,
    resourceType: capability.resourceType,
    unit: capability.unit,
    quantity: request.quantity,
    payload: Object.freeze({ status: "ready", resourceType: capability.resourceType }),
  });
}

function defaultHealth({ capability }) {
  return Object.freeze({ providerId: capability.providerId, capabilityId: capability.id, status: "ready" });
}
