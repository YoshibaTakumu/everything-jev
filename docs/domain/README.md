---
title: Domain documentation
description: Find the owner of a concept, relationship or behavioral rule before changing it.
---

# Domain documentation

This index routes questions about everything-jev's concepts and rules to their owner. Definitions live in the linked documents; field types, accepted values and numeric limits remain in the implementation.

| Document | Owns the question | Related contracts |
| --- | --- | --- |
| [Decision](decision.md) | How do model answers and application gates produce a suggestion, review or block? | [API](../api.md), [security](../security.md) |
| [Recipe](recipe.md) | How do a rubric, candidates, sample and fixture form an executable decision example? | [Cookbook](../cookbook.md), [decision](decision.md) |
| [Memory eligibility](memory.md) | Which supplied memory records may enter semantic retrieval? | [Security](../security.md), [architecture](../architecture.md#state-memory-and-evidence) |
| [Issue frontier](issue-frontier.md) | Which nodes of a supplied dependency graph are eligible for consideration? | [Harness](../harness.md), [decision](decision.md) |

Cross-domain flow belongs to [architecture](../architecture.md); transport and CLI contracts belong to [Client and CLI](../api.md). Metric definitions and evidence requirements remain in [evaluation](../evaluation.md). Adopted tools belong to the [tech stack](../tech-stack/README.md). Platform-specific recipe ideas are catalogued in the cookbook and do not each imply an implemented domain or connector.

## Create and maintain a domain document

1. Choose one owning concept and a kebab-case filename, `docs/domain/<concept>.md`. Start from [the domain template](_template/domain.md); replace all placeholders and omit sections that do not apply.
2. Define its vocabulary and relationships, then document observable rules with the function or component that enforces each rule. Link to types/validation instead of copying field tables, enums or thresholds. Record unsupported operations as boundaries, not future promises.
3. Use `status: implemented` for behavior traced to current source; use `status: draft` for an unimplemented proposal and identify it as such in the index. This status is documentation maturity, not human approval, live verification or production readiness. Set `updated` when substantive content is checked or changed.
4. Add one index row stating the question the document owns. When a concept, state, operation or invariant changes, update its owner in the same change, review affected callers/tests and incoming links, and update this index if ownership changes. Keep proposals separate from implemented rules.
5. Follow the shared [documentation maintenance procedure](../tech-stack/documentation.md#updating-the-documents) for verification, links and publication review. Keep temporary plans, task progress and customer/private content out of these durable specifications.

The current package has no screen UI. Document its CLI in the API contract; add a separate `<concept>-ui.md` only when a real UI needs its own information, actions, states and navigation contract. There is no ADR process introduced by this directory: record local rationale beside the affected rule, and introduce a separate decision record only when a concrete cross-domain tradeoff warrants one.
