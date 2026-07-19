import { createProviderAdapter, createAdapterBook } from "../providers/adapters.js";
import { fixtureProviderCapabilities } from "./providers.js";

const payloads = {
  "weather-data": ({ request }) => ({
    forecast: "clear-window",
    fieldRisk: "low",
    recommendedStartMinute: 35,
    samples: request.quantity,
  }),
  "soil-sensor-data": ({ request }) => ({
    moisturePercent: 41,
    nitrogenIndex: 0.72,
    samples: request.quantity,
  }),
  "route-map": ({ request }) => ({
    routeId: `route-${request.id}`,
    waypoints: ["north-pad", "ridge-line", "east-return"],
    tileBundles: request.quantity,
  }),
  "charging-slot": ({ request }) => ({
    reservationId: `dock-${request.id}`,
    minutesReserved: request.quantity * 15,
    connector: "field-dock",
  }),
  "compute-burst": ({ request }) => ({
    jobWindow: `edge-window-${request.id}`,
    computeMinutes: request.quantity,
    accelerator: "field-gpu",
  }),
  "bandwidth-grant": ({ request }) => ({
    transferWindow: `mesh-${request.id}`,
    megabytes: request.quantity,
    link: "west-ridge",
  }),
};

export const fixtureProviderAdapters = fixtureProviderCapabilities.map((capability) => createProviderAdapter({
  capability,
  latencyMs: capability.metadata?.latencyMs ?? 75,
  availability: capability.metadata?.availability ?? 0.98,
  dataShape: { resourceType: capability.resourceType, unit: capability.unit },
  fulfill({ request, capability, grant, quote }) {
    return Object.freeze({
      providerId: capability.providerId,
      requestId: request.id,
      grantId: grant.id,
      quoteId: quote.id,
      resourceType: capability.resourceType,
      unit: capability.unit,
      quantity: request.quantity,
      payload: Object.freeze(payloads[capability.resourceType]?.({ request }) ?? { status: "ready" }),
    });
  },
}));

export const fixtureAdapterBook = createAdapterBook(fixtureProviderAdapters);
