---
id: issue-frontier
title: Issue frontier
status: implemented
updated: 2026-09-22
---

# Issue frontier

## Definition and vocabulary

An issue node is a caller-supplied snapshot of a task's identity, status and blockers. A **blocker** is a dependency that must be complete before that task can be considered. The **frontier** is the set of open nodes whose blockers are all done; inclusion is eligibility for consideration, not permission to dispatch.

## Relationships

- The application tracker adapter supplies the graph and authoritative status mapping. [Harness integration](../harness.md#issue-scheduling-example) owns tracker revisions, leases and dispatch.
- A readiness [recipe](recipe.md) can assess eligible candidates; the [decision policy](decision.md) still requires independently supplied gates.
- The repository's [Issue workflow skills](../../.agents/skills/README.md#issue-workflow-skills) are agent procedures. They are not clients called by the graph helper.

## Implementation and data

[src/sequencing.ts](../../src/sequencing.ts) owns `IssueNode`, its supported statuses, dependency representation and `frontier()`. Status values are input facts; the function does not transition an issue or write back to a tracker.

## Rules and outcomes

- `frontier()` rejects empty/duplicate IDs, unsupported status values and duplicate dependencies.
- It validates the whole graph before selecting candidates: missing referenced nodes and cycles cause the call to throw, even when the invalid part would not produce an eligible candidate. A self-dependency is a cycle.
- Only open nodes with every blocker marked done are eligible. An open node with no blockers is eligible; running and done nodes are excluded.
- The result contains IDs in the implementation's default string sort order, not priority order. An empty graph returns an empty frontier; invalid graphs do not silently become empty results.

All rules are enforced by `frontier()` on its input snapshot. It neither removes blockers nor ranks urgency, checks capacity, acquires leases or starts workers. The application must recheck mutable tracker facts before dispatch.

## Boundaries and verification

[test/core.test.mjs](../../test/core.test.mjs) checks blocked/running/completed exclusion, cycles, missing blockers, duplicate identities and an empty graph. [examples/harness.mjs](../../examples/harness.mjs) composes the frontier with a fixture decision and demonstrates review when the tracker-revision gate is missing. These checks do not establish a live tracker integration or distributed scheduler.

## Open questions

None for the current graph contract. Tracker mappings, priority and scheduling ownership belong to the adopting application.
