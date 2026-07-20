import { ErrorCodes, fail, ok } from "../errors.js";

export function createPolicyEngine(rules = defaultRules()) {
  const normalized = rules.map((rule, index) => Object.freeze({ id: rule.id ?? `rule-${index + 1}`, evaluate: rule.evaluate }));
  return Object.freeze({
    evaluate(context) {
      const decisions = [];
      for (const rule of normalized) {
        const decision = rule.evaluate(context);
        decisions.push(Object.freeze({ ruleId: rule.id, ...decision }));
        if (decision.ok === false) {
          return fail(decision.code ?? ErrorCodes.REQUESTER_NOT_APPROVED, decision.reason ?? "Policy check failed", {
            ruleId: rule.id,
            decisions,
          });
        }
      }
      return ok(Object.freeze({ decisions }));
    },
    listRules() {
      return normalized.map((rule) => rule.id);
    },
  });
}

export function defaultRules() {
  return [
    requesterTrustRule(0.25),
    spendLimitRule(),
    regionCompatibilityRule(),
    freshnessRule(900),
    capabilityPurposeRule(),
  ];
}

export function requesterTrustRule(minTrustScore) {
  return {
    id: "requester-trust",
    evaluate({ requester }) {
      const score = requester?.metadata?.trustScore ?? 1;
      return score >= minTrustScore
        ? { ok: true, reason: "requester trust accepted" }
        : { ok: false, code: ErrorCodes.REQUESTER_NOT_APPROVED, reason: "Requester trust score is below policy", score, minTrustScore };
    },
  };
}

export function spendLimitRule() {
  return {
    id: "spend-limit",
    evaluate({ request, quote, railPolicy }) {
      const ceiling = Math.min(request.maxPrice, railPolicy.maxSpend);
      return quote.totalPrice <= ceiling
        ? { ok: true, reason: "quote is within spend ceiling" }
        : { ok: false, code: ErrorCodes.SPEND_POLICY_EXCEEDED, reason: "Quote exceeds spend ceiling", totalPrice: quote.totalPrice, ceiling };
    },
  };
}

export function regionCompatibilityRule() {
  return {
    id: "region-compatibility",
    evaluate({ requester, capability }) {
      const requesterRegion = requester.region ?? "global";
      const providerRegion = capability.metadata?.region ?? "global";
      const accepted = providerRegion === "global" || requesterRegion === "global" || requesterRegion === providerRegion;
      return accepted
        ? { ok: true, reason: "region accepted" }
        : { ok: false, reason: "Requester region is outside provider service region", requesterRegion, providerRegion };
    },
  };
}

export function freshnessRule(maxAgeSeconds) {
  return {
    id: "freshness-window",
    evaluate({ capability }) {
      const freshness = capability.metadata?.freshnessSeconds ?? 60;
      return freshness <= maxAgeSeconds
        ? { ok: true, reason: "freshness accepted" }
        : { ok: false, reason: "Capability freshness is outside policy", freshness, maxAgeSeconds };
    },
  };
}

export function capabilityPurposeRule() {
  return {
    id: "purpose-match",
    evaluate({ request, capability }) {
      const allowed = capability.metadata?.allowedPurposes;
      if (!Array.isArray(allowed) || allowed.length === 0) return { ok: true, reason: "open purpose" };
      return allowed.includes(request.purpose)
        ? { ok: true, reason: "purpose accepted" }
        : { ok: false, reason: "Request purpose is outside capability policy", purpose: request.purpose, allowed };
    },
  };
}
