# MachineFi Resource Layer

Machine-to-machine resource requests over multi-chain runtime rails.

MachineFi Resource Layer is a package for autonomous machines to request resources, discover provider capabilities, negotiate access, settle through selected runtime rails, and record verifiable work receipts.

## What it provides

- Machine identity and runtime sessions
- Provider capability records
- Resource request records
- Runtime rail selection primitives
- Validation helpers for machine resource flows
- Structured result and error utilities
- A path toward quotes, access grants, receipts, work records, and economic memory events

## Install

```bash
npm install @machinefi/resource-layer
```

## Quickstart

```js
import {
  createMachineSession,
  createProviderCapability,
  createResourceRequest,
  matchesCapability,
  validateResourceRequest,
} from "@machinefi/resource-layer";

const requester = createMachineSession({
  machineId: "farm-robot-17",
  role: "requester",
  runtime: "solana",
});

const weatherCapability = createProviderCapability({
  providerId: "weather-node-3",
  resourceType: "weather.forecast",
  runtimeRails: ["solana"],
  regions: ["sg"],
});

const request = createResourceRequest({
  requester,
  resourceType: "weather.forecast",
  region: "sg",
  runtimeRail: "solana",
});

const validation = validateResourceRequest(request);
const canServe = matchesCapability(weatherCapability, request);

console.log({ validation, canServe });
```

## Design posture

The package is built around MachineFi-native resource access primitives: `MachineSession`, `ProviderCapability`, `ResourceRequest`, `RuntimeRail`, `AccessGrant`, `ResourceReceipt`, `WorkRecord`, and `EconomicMemoryEvent`.

## Roadmap

MachineFi Resource Layer is shaping toward a complete resource access lifecycle:

1. A machine creates a runtime session.
2. It requests a resource for a real-world task.
3. Provider capabilities are matched against the request.
4. Runtime rail policy selects the settlement path.
5. Provider quotes are evaluated against requester rules.
6. Access grants unlock the resource.
7. Receipts and work records capture the completed exchange.
8. Economic memory gives machines a reusable history of resource outcomes.

## Test

```bash
npm test
```
