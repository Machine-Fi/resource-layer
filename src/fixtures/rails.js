import { createRuntimeRail } from "../rails/policy.js";

export const fixtureRuntimeRails = [
  createRuntimeRail({
    id: "fixture-usdc",
    label: "Fixture stable settlement rail",
    network: "local-ledger",
    asset: "USD-credit",
    maxSettlementAmount: 25,
  }),
  createRuntimeRail({
    id: "fixture-sol",
    label: "Fixture Solana settlement rail",
    network: "local-solana-sim",
    asset: "SOL-credit",
    maxSettlementAmount: 10,
  }),
];
