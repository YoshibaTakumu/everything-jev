---
id: decision
title: Decision
status: implemented
updated: 2026-09-22
---

# Decision

## Definition and vocabulary

A decision is the local policy outcome for a typed model answer and independently supplied application facts. A **gate** is a named deterministic prerequisite supplied by the caller. A **recommendation** is a selected candidate offered for downstream consideration; it does not grant permission or execute an operation.

## Relationships

- A [recipe](recipe.md) supplies the route/concern questions and required gate names used by the bundled examples.
- The [API contract](../api.md) owns request/response validation and transport behavior. The local policy consumes that request and a response, but does not call the provider itself.
- An external executor applies the [security boundaries](../security.md) and [harness contract](../harness.md) before acting on a recommendation.

## Implementation and data

[src/policy.ts](../../src/policy.ts) owns `GateState`, `Policy`, `Decision` and `decide()`, including threshold defaults and reason identifiers. [src/types.ts](../../src/types.ts) owns typed requests and answers; [src/validation.ts](../../src/validation.ts) owns structural validation.

## Rules and outcomes

`decide()` evaluates in this order; the first returning branch determines the outcome:

1. Reject invalid policy configuration by throwing: thresholds must satisfy the implementation's constraints and at least one deterministic gate must be declared.
2. Return `blocked` if a required gate has an own-property failure. This takes precedence over unknown gates and answer validation.
3. Return `review` if any required gate lacks an own-property pass. Missing, unknown and inherited gate values cannot grant a pass.
4. Validate the response against the request. Invalid answers return `review`; a valid response without the required route Choice and concern Noul also returns `review`.
5. Return `review` for no supported match, insufficient confidence/probability/margin or excessive concern, using the policy's thresholds.
6. Otherwise return `suggested` with the route's selected candidate. Only this outcome carries a recommendation; the other outcomes carry `null`.

Every outcome has `executed: false`. These are results of a function call, not persisted workflow states. Gate precedence can mask a malformed answer in the reported reasons; the HTTP client validates its own responses before returning them.

`decide()` receives gates separately from untrusted state and cannot authenticate their source. Caller-owned authorization remains essential even when every gate is marked as passed. The optional quality Score does not participate in route policy. Defaults are illustrative, not calibrated safety guarantees; [evaluation](../evaluation.md) owns calibration and evidence requirements.

## Boundaries and verification

[test/core.test.mjs](../../test/core.test.mjs) exercises failed and inherited gates, missing authority despite injected state, malformed responses, no-match/ambiguity/concern/confidence review paths and invalid configuration. Fixture success establishes local policy behavior, not live model quality or permission to act.

## Open questions

None for the current helper contract. Threshold calibration and executor authority belong to the adopting application.
