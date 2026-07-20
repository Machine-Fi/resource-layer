import { createRailLedger, createLedgerBook } from "../rails/ledger.js";

export const fixtureLedgerBook = createLedgerBook([
  createRailLedger({
    railId: "fixture-usdc",
    openingBalances: {
      "farm-robot-01": 10,
      "soil-sensor-grid-14": 0,
      "weather-station-north-field": 0,
      "edge-compute-bay-3": 0,
    },
  }),
  createRailLedger({
    railId: "fixture-sol",
    openingBalances: {
      "drone-7": 5,
      "rover-11": 5,
      "route-tile-provider-2": 0,
      "charging-station-east": 0,
      "mesh-router-west": 0,
    },
  }),
]);
