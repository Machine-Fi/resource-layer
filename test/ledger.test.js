import test from "node:test";
import assert from "node:assert/strict";
import { createRailLedger } from "../src/index.js";

test("rail ledger authorizes and captures settlement records", () => {
  const ledger = createRailLedger({ railId: "fixture-usdc", openingBalances: { robot: 2, provider: 0 } });
  const authorization = ledger.authorize({
    authorizationId: "auth-1",
    requesterId: "robot",
    providerId: "provider",
    amount: 0.75,
    quoteId: "quote-1",
  });
  assert.equal(authorization.ok, true);
  const capture = ledger.capture("auth-1");
  assert.equal(capture.ok, true);
  assert.equal(ledger.balanceOf("robot"), 1.25);
  assert.equal(ledger.balanceOf("provider"), 0.75);
  assert.equal(ledger.snapshot().entries.length, 2);
});
