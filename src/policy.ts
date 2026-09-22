import type { EvaluationRequest } from "./types.js";
import { validateResponse } from "./validation.js";

export type GateState = "pass" | "fail" | "unknown";
export interface Decision {
  status: "suggested" | "review" | "blocked";
  recommendation: string | null;
  reasons: string[];
  executed: false;
}
export interface Policy {
  requiredGates: readonly string[];
  minConfidence?: number;
  minProbability?: number;
  minMargin?: number;
  maxConcern?: number;
}

export function decide(
  request: EvaluationRequest,
  response: unknown,
  gates: Readonly<Record<string, GateState>>,
  policy: Policy,
): Decision {
  const thresholds = {
    confidence: policy.minConfidence ?? 0.8,
    probability: policy.minProbability ?? 0.75,
    margin: policy.minMargin ?? 0.2,
    concern: policy.maxConcern ?? 0.2,
  };
  if (
    Object.values(thresholds).some(
      (value) => !Number.isFinite(value) || value < 0 || value > 1,
    )
  )
    throw new RangeError("Policy thresholds must be finite values in [0, 1]");
  if (policy.requiredGates.length === 0)
    throw new RangeError("Policy must declare at least one deterministic gate");
  const result = (
    status: Decision["status"],
    reasons: string[],
    recommendation: string | null = null,
  ): Decision => ({ status, recommendation, reasons, executed: false });
  const failed = policy.requiredGates.filter(
    (key) => Object.hasOwn(gates, key) && gates[key] === "fail",
  );
  if (failed.length)
    return result(
      "blocked",
      failed.map((key) => `gate_failed:${key}`),
    );
  const unknown = policy.requiredGates.filter(
    (key) => !Object.hasOwn(gates, key) || gates[key] !== "pass",
  );
  if (unknown.length)
    return result(
      "review",
      unknown.map((key) => `gate_unverified:${key}`),
    );
  try {
    validateResponse(response, request);
  } catch {
    return result("review", ["invalid_response"]);
  }
  const route = response.answers.route;
  const concern = response.answers.concern;
  if (route?.type !== "choice" || concern?.type !== "noul")
    return result("review", ["required_answers_missing"]);
  const reasons: string[] = [];
  if (route.choice === "no_match") reasons.push("no_match");
  if (route.confidence < thresholds.confidence) reasons.push("low_confidence");
  const ranked = Object.values(route.probabilities).sort((a, b) => b - a);
  if (ranked[0]! < thresholds.probability) reasons.push("low_probability");
  if (ranked[0]! - (ranked[1] ?? 0) < thresholds.margin)
    reasons.push("ambiguous_choice");
  if (concern.noul > thresholds.concern) reasons.push("semantic_concern");
  if (reasons.length) return result("review", reasons);
  return result(
    "suggested",
    ["illustrative_policy_passed", "external_execution_not_implemented"],
    route.choice,
  );
}
