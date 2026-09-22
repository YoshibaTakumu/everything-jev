# Development policy

Working agreements for contributors and coding agents. Use this index when starting work, changing the development workflow or preparing a pull request. Tool commands remain in [Contributing](../../CONTRIBUTING.md); product behavior remains in [domain documents](../domain/README.md).

| When to read | Owner | Completion condition |
| --- | --- | --- |
| Start/resume work, interpret an Issue, verify or hand off a task | [Task lifecycle](task-lifecycle.md) | Scope, owning contracts, evidence and the requested delivery point are explicit |
| Create/update a branch or worktree, choose a base or clean up merged work | [Branch policy](branch-policy.md) | The correct base and owned changes are preserved; remote state is verified |
| Create/update/review or merge a PR | [Pull requests](github-pr.md) | The complete diff is reviewable and the current revision satisfies merge conditions |
| Create/reorganize documentation or finish a temporary plan | [Document lifecycle](document-lifecycle.md) | Durable knowledge has one owner, links resolve and temporary notes do not masquerade as current contracts |
| Change agent instructions/skills or transfer task ownership | [Agent workflow](agent-workflow.md) | Entry points resolve, provenance is preserved and responsibility is unambiguous |

These policies describe this repository's workflow. They do not require a GitHub Project board, a hosted review bot, a database, a separate test author or a new Issue for every direct request. Add those only for an actual adopted workflow, with its configuration and ownership documented.

## Maintain the policy

Edit the owning topic and its callers together when changing a workflow. State the trigger, action, completion evidence and handling of missing information. Link to existing contracts and executable configuration rather than copying commands or changing external settings through prose. Update this index when topic ownership changes, then follow [publication checks](document-lifecycle.md#updating-the-documents).
