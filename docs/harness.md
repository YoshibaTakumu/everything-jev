# Integrating Jev into a development harness

This guide describes a complete integration architecture. The repository supplies the decision layer and selected helpers; your harness supplies repository adapters, workers, storage and execution. It does not modify an existing application merely by being installed.

## Multiple useful insertion points

| Insertion point   | Jev's bounded task                            | Authoritative component                                |
| ----------------- | --------------------------------------------- | ------------------------------------------------------ |
| Task intake       | Choose inspect, implement, verify or clarify  | Instruction loader and workspace resolver              |
| Context selection | Rank permitted snippets and explicit memories | Tenant/principal scope and provenance store            |
| Semantic lint     | Classify AST candidates against a named rule  | Parser, source revision, repository lint policy        |
| Code review       | Prioritize evidence-backed risks              | Diff head, test results and human review workflow      |
| Issue planning    | Assess readiness within an eligible frontier  | Native dependencies, capacities and scheduler leases   |
| Worker management | Detect ambiguous progress or likely stalls    | Artifact journal, budgets and cancellation             |
| Tool preflight    | Suggest a risk-review queue                   | Tool allowlists, credentials, destinations and sandbox |
| Output quality    | Select content/layout review targets          | Templates, builds, rendering and captured evidence     |

These can share one typed client and evaluation infrastructure while keeping separate rubrics, thresholds, data scopes and operational owners. A single “approve anything” classifier is a poor substitute for these narrower decisions.

## End-to-end execution loop

1. **Resolve scope.** Identify the repository, branch/worktree, task, actor and relevant rules. Read all instruction files from root to target. Record the code and rule revisions.
2. **Build facts.** Read actual issue relationships, test results, tool availability and resource permissions. Do not infer them from narrative updates.
3. **Constrain candidates.** Exclude inaccessible files, blocked work, expired memories and unsupported operations before inference.
4. **Evaluate.** Submit the minimal state to the relevant recipe. Bound concurrency, context size, time and spend. Keep dependent reasoning steps sequential.
5. **Decide.** Validate output and pass independently obtained gates to `decide()`. Preserve review and block outcomes. Do not silently replace an error with the most likely choice.
6. **Dispatch.** An external executor rechecks the target revision and authority, claims a lease, then applies the allowed operation with an idempotency key.
7. **Verify.** Run the required checks and inspect actual artifacts. Store outcome evidence tied to the task and revision. A worker or model claiming “done” cannot close this step.
8. **Reconcile.** On timeout, partial failure or interruption, reread external state before scheduling recovery. Release leases and respect remaining budget.

## Concrete adoption sequence

First integrate read-only intake routing and review prioritization. Record decisions alongside existing human/tool outcomes. Next implement contextual memory eligibility and native issue dependency filtering. Add semantic lint only with a documented rule scope and labelled examples. Finally connect narrow, reversible executors whose preconditions and postconditions you can test.

Observation mode is a validation phase, not the final architecture. A complete deployment additionally needs authenticated adapters, persistent job state, queue ownership, retry/reconciliation, scoped logs, operational dashboards and an incident path. Those components are specific to your system and are intentionally not represented as working connectors in this release.

## Production configuration to own

Version the model pin, prompt/rubric, taxonomy/candidate generator, thresholds and preprocessing together. Store separately per domain and language. Preserve the returned model and the exact revision of external facts for each decision.

Use application-owned records for:

- Task identity, requester, scope and current lease.
- State revision/hash and candidate IDs.
- Evaluation/rubric version, answers, token usage and latency.
- Gate facts, their source and freshness.
- Policy outcome and required reviewer.
- Operation idempotency key, execution outcome and verification artifact.

Avoid raw private payloads in broad telemetry. A request hash helps correlation but is not automatically anonymous; short or predictable inputs can be guessed.

## Issue scheduling example

```js
import { frontier } from "../dist/index.js";

const readyIds = frontier([
  { id: "schema", status: "done", blockedBy: [] },
  { id: "api", status: "open", blockedBy: ["schema"] },
  { id: "ui", status: "open", blockedBy: ["api"] },
]);
// ["api"] — only this issue may enter semantic readiness evaluation.
```

GitHub or another tracker must supply those facts. Use atomic leases to avoid two workers starting the same eligible issue. `frontier()` is a graph helper, not a distributed scheduler or priority optimizer.

## Define success honestly

Measure useful suggestions accepted, missed findings, false positives, review workload, blocked unauthorized operations, verified task completion, total latency and total cost. Report end-to-end results, not only inference speed. Compare against the harness without Jev and retain deterministic shortcuts where they work better.
