# Task lifecycle

Use this procedure when implementing or resuming a requested change. A small, bounded edit can keep its plan in the task conversation; use the optional [task brief](_template/task-brief.md) for work that needs a durable handoff.

## Start from an observable outcome

1. Identify the requested behavior, acceptance evidence and delivery point (local change, push, PR or merge) from the current request and prior authorization. Reuse an existing Issue when supplied; a direct request does not require creating one.
2. Inspect the current branch, worktree and changes using [branch policy](branch-policy.md). On resume, reconcile the saved revision with the current code, remote branch and PR; a previous progress note is not evidence of current state.
3. Read the instruction chain and use the [documentation index](../README.md) to find the owning contracts. Distinguish established requirements, implementation choices within scope and hypotheses that need a focused check. Ask only when a missing decision materially changes scope or authority; continue independent work where possible.
4. Identify affected callers, failure paths and the verification needed to establish the outcome. For dependency/integration uncertainty, run a bounded check before building on the assumption. Keep simulated results distinct from observed live behavior.

## Implement and verify

Change code, relevant tests and owning documents together. Tests should assert observable contracts and meaningful failure cases, not merely reproduce implementation details. Use [Contributing](../../CONTRIBUTING.md) for repository checks, [testing rules](../../.claude/rules/testing-evaluation.md) for test isolation, and [documentation maintenance](document-lifecycle.md#updating-the-documents) for documentation-only changes.

Record commands, results, relevant revision and any checks not run. Resolve failures caused by the change. If a required check cannot run, state the missing prerequisite and resulting uncertainty rather than claiming completion. Successful fixture tests do not establish live service compatibility or model quality; see [evaluation](../evaluation.md).

## Deliver or hand off

Review the complete change and proceed to the already requested delivery point through [PR policy](github-pr.md). Report the artifact/commit/PR, checks performed and remaining limitations. Do not label an implementation merged merely because it was pushed or a merge was queued.

When the task comes from an Issue, compare its acceptance criteria with the actual diff and evidence before claiming it is fixed. Use a closing reference only if the PR resolves the whole Issue; otherwise describe the remaining work. Issue creation, tracker relationships and Project updates stay within the requested scope.

Before a handoff, preserve the goal, decisions, constraints, worktree/branch, exact revision, verification, unresolved work and next action using [agent workflow](agent-workflow.md#handoff). Promote lasting knowledge through [document lifecycle](document-lifecycle.md#temporary-work-and-lasting-decisions).
