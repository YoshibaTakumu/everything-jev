# Agent workflow

Read this when modifying instruction entry points, reusable skills or handing off ongoing work. Existing [repository skill provenance](../../.agents/skills/README.md) remains authoritative for upstream versus project-maintained content.

## Put instructions at their owner

| Material | Place |
| --- | --- |
| Repository-wide or directory entry trigger | Root or directory `AGENTS.md` |
| A rule selected by changed file paths | `.claude/rules/`, linked from applicable `AGENTS.md` for other agents |
| Workflow policy | This directory, routed through its [index](README.md) |
| Domain vocabulary and behavior | [Domain documents](../domain/README.md) |
| Reusable multi-step procedure | A relevant existing skill; add a new skill only when there is a concrete repeatable use |
| One-off plan, scratch data or handoff | Task conversation or gitignored `local/` notes |

Use [writing-for-agents](../../.agents/skills/writing-for-agents/SKILL.md) when editing agent-facing material. Make triggers specific enough to find the right reference, keep completion conditions observable and avoid duplicating the referenced contract. Verify relative links and rule paths from their documented roots.

## Skills and tool access

Maintain project skill content in `.agents/skills/`; `.claude/skills` is its relative symlink. Keep the symlink and verify discovery links when adding or moving skills. Consult the [skill inventory](../../.agents/skills/README.md) before editing vendored content: preserve its licensing and source revision, and keep project adaptations distinguishable from unchanged upstream skills.

A procedure that mentions GitHub, a scheduler or a provider is not evidence of installed access. Verify the available tool and scope before using it, and report unavailable capabilities. Successful skill lookup or prose review is not an end-to-end execution test. Updates should exercise the relevant trigger/reference path and, where feasible, a bounded representative use without unauthorized external effects.

## Handoff

Before transferring a long-running task, save its goal, decisions, constraints, current owner, active workers (if any), workspace, branch, exact revision, completed checks, unresolved work and next action. The optional [task brief](_template/task-brief.md) provides those fields. Keep credentials and private payloads out of public handoff material.

Once the receiving task has the material and ownership, the previous owner stops edits, worker operations and merges. Preserve existing artifacts and active work. This policy does not start workers or recurring monitors by itself; those depend on the task's authorization and available execution environment.
