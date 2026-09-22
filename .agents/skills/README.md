# Repository skills

The skills live in `.agents/skills/`; `.claude/skills` is a relative symlink to this directory.

## Upstream skills

These seven skills are vendored from [mattpocock/skills](https://github.com/mattpocock/skills) at commit [`c55ee46073ed923f86ce59a5eb3b6d895095d1b7`](https://github.com/mattpocock/skills/tree/c55ee46073ed923f86ce59a5eb3b6d895095d1b7), with their supporting files unchanged.

| Local directory | Upstream path |
| --- | --- |
| `grilling` | `skills/productivity/grilling` |
| `handoff` | `skills/productivity/handoff` |
| `diagnosing-bugs` | `skills/engineering/diagnosing-bugs` |
| `resolving-merge-conflicts` | `skills/engineering/resolving-merge-conflicts` |
| `tdd` | `skills/engineering/tdd` |
| `triage` | `skills/engineering/triage` |
| `writing-for-agents` | `skills/productivity/writing-for-agents` |

The upstream MIT license is preserved in [LICENSE](LICENSE). When updating, review the upstream changes, copy each complete skill directory, and update the source commit here.

## Issue workflow skills

These three skills are adapted from user-provided sources with explicit permission to publish. They are maintained here as project adaptations, separately from the unchanged upstream skills above.

| Skill | Purpose |
| --- | --- |
| [sequencing-issues](sequencing-issues/SKILL.md) | Read native Issue dependencies, identify the frontier, and apply authorized relationship changes. |
| [draining-frontier](draining-frontier/SKILL.md) | Estimate and execute waves of Issue work, with verification and integration within the authorized scope. |
| [monitoring-frontier](monitoring-frontier/SKILL.md) | Report progress, blockers and observation gaps without starting implementation. |

The adaptations remove private execution history, environment-specific details and references to unavailable skills or documents. The three skills refer to each other and to this repository's contribution instructions. Estimates use locally observed evidence; monitoring requires an actual scheduler setup only when recurring execution is requested.

## Project guides

| Skill | Purpose |
| --- | --- |
| [what-is-jev](what-is-jev/SKILL.md) | Explain Jev, assess suitable architectures and limitations, guide setup, and find official documentation. |

`what-is-jev` is an independently maintained guide, not an official TypeSafe skill. Its references distinguish official specifications from local implementation choices and include a dated inventory of the official documentation.
