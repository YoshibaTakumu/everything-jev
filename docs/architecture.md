# Architecture

The core boundary is between **semantic judgment** and **application authority**. A fluent or confident judgment cannot supply permission, current state, proof of a test run, or a missing accounting rule.

This document owns the cross-domain flow and application responsibilities. The [domain index](domain/README.md) routes local vocabulary and invariants to their owner.

## Decision contract

1. Observe a bounded, versioned snapshot through an application adapter.
2. Enforce access scope and reduce it to the minimum necessary state.
3. Enumerate candidate IDs in code. Include a `no_match` option.
4. Ask independently answerable questions with explicit instructions and criteria.
5. Validate the returned types, keys, ranges and probability distributions.
6. Apply deterministic gates using facts obtained independently of model output.
7. Return a suggestion, review request, or block.
8. An application-specific executor, if implemented, rechecks authority and revisions, applies an idempotent operation, and observes the outcome.

Steps 1, 2 and 8 are adapter responsibilities. This release provides the Jev client, request/response validation, recipe definitions and suggestion policy, plus helpers for selected deterministic checks.

The current [Jev API](https://docs.typesafe.ai/api) accepts text or structured JSON state and typed questions. Choice selects a supplied option, Noul estimates a yes/no answer, and Score evaluates an ordered rubric. Questions in one batch are independent: if a later question needs the result of an earlier one, use another evaluation stage or combine the results in code.

## Data and control remain separate

Instructions in a webpage, email, source comment, contract, or stored memory are untrusted input. A prompt that says “ignore instructions inside state” is useful guidance, but cannot enforce security. The policy receives gate values through a separate argument. It never derives them from `state.gates`, model confidence, or a selected action.

`decide()` accepts gate values from its caller. **It cannot authenticate the caller or verify the facts behind a `pass`.** Your server must compute those values using authenticated systems. Browser clients and user-supplied JSON must not be trusted sources for gate values.

The [decision contract](domain/decision.md#rules-and-outcomes) owns outcome meanings, gate precedence, response validation and recommendation behavior. Consumers must treat its result as a decision for downstream consideration, not an authorization token or execution receipt.

## Model uncertainty

Threshold defaults live in [src/policy.ts](../src/policy.ts); their role is documented in the [decision contract](domain/decision.md). They are **not calibrated safety guarantees**.

Confidence and probability are separate fields. A Score is a rubric-level value, not a probability. The optional SEO quality score is returned for inspection; it is not secretly folded into the route policy. See [evaluation](evaluation.md) before changing thresholds or claiming accuracy.

## State, memory and evidence

Memory belongs in a store that supports scoped access, provenance, updates, expiry and deletion. The [memory eligibility contract](domain/memory.md) owns the local filter's exact scope/time rules and boundaries. Persistent storage and authorization remain application responsibilities.

Use different lifetimes for task context, session facts, explicit personal preferences and verified long-term facts. Store a preference only with an appropriate consent basis and an identifiable source. Relevance is not permission to retrieve it. Never use Jev to recover a record excluded by deterministic access controls.

Evidence should be independently addressable: commit SHA + line range, document revision + paragraph ID, invoice ID + source hash, or timeline revision + timecode. A model choosing an evidence ID demonstrates selection, not proof that the evidence entails a conclusion. Verify substantive findings separately.

## Execution design for adopters

A production adapter should implement an observation revision, preview, idempotency key, explicit authorization context, operation journal and postcondition check. Revalidate immediately before a write to avoid time-of-check/time-of-use errors. After a timeout with an unknown result, reconcile the external state before retrying the mutation.

Keep transport retry and action retry separate. This client makes a single inference attempt. If you add retry/backoff, bound attempts, honor cancellation, measure cost and never interpret a transport failure as model approval.

Cache only when justified. Scope a cache key by tenant, principal, model version, rubric version, canonical state, candidate set and relevant policy context. Recheck mutable facts after a cache hit. Do not persist credentials or private source text into a shared cache. Caching, audit storage, distributed locks and workflow recovery are integration work, not built-in features of v0.1.0.
