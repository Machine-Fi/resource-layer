import { ErrorCodes, fail, ok } from "../errors.js";

export function createRailLedger({ railId, openingBalances = {} }) {
  let sequence = 0;
  const balances = new Map(Object.entries(openingBalances));
  const authorizations = new Map();
  const entries = [];

  function balanceOf(machineId) {
    return balances.get(machineId) ?? 0;
  }

  function credit(machineId, amount, reason = "credit") {
    const next = round(balanceOf(machineId) + amount);
    balances.set(machineId, next);
    entries.push(entry({ kind: "credit", machineId, amount, reason }));
    return next;
  }

  function authorize({ authorizationId, requesterId, providerId, amount, quoteId }) {
    if (amount <= 0) return fail(ErrorCodes.SETTLEMENT_NOT_AUTHORIZED, "Settlement amount must be positive", { amount });
    if (balanceOf(requesterId) < amount) {
      return fail(ErrorCodes.SETTLEMENT_NOT_AUTHORIZED, "Requester balance is below authorization amount", {
        requesterId,
        available: balanceOf(requesterId),
        amount,
      });
    }
    const auth = Object.freeze({
      id: authorizationId,
      railId,
      requesterId,
      providerId,
      quoteId,
      amount,
      status: "authorized",
    });
    authorizations.set(authorizationId, auth);
    entries.push(entry({ kind: "authorize", authorizationId, requesterId, providerId, amount, quoteId }));
    return ok(auth);
  }

  function capture(authorizationId) {
    const auth = authorizations.get(authorizationId);
    if (!auth || auth.status !== "authorized") {
      return fail(ErrorCodes.SETTLEMENT_NOT_AUTHORIZED, "Authorization is not available for capture", { authorizationId });
    }
    balances.set(auth.requesterId, round(balanceOf(auth.requesterId) - auth.amount));
    balances.set(auth.providerId, round(balanceOf(auth.providerId) + auth.amount));
    const captured = Object.freeze({ ...auth, status: "captured" });
    authorizations.set(authorizationId, captured);
    entries.push(entry({ kind: "capture", authorizationId, amount: auth.amount }));
    return ok(captured);
  }

  function snapshot() {
    return Object.freeze({
      railId,
      balances: Object.freeze(Object.fromEntries(balances.entries())),
      authorizations: Object.freeze([...authorizations.values()]),
      entries: Object.freeze([...entries]),
    });
  }

  function entry(input) {
    sequence += 1;
    return Object.freeze({ sequence, railId, ...input });
  }

  return Object.freeze({ railId, balanceOf, credit, authorize, capture, snapshot });
}

export function createLedgerBook(ledgers = []) {
  const map = new Map(ledgers.map((ledger) => [ledger.railId, ledger]));
  return Object.freeze({
    get(railId) {
      return map.get(railId) ?? null;
    },
    list() {
      return [...map.values()];
    },
    snapshot() {
      return Object.freeze(Object.fromEntries([...map.entries()].map(([railId, ledger]) => [railId, ledger.snapshot()])));
    },
  });
}

function round(value) {
  return Number(value.toFixed(8));
}
