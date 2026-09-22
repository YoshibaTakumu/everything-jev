# Quality and delivery

## In use

| Technology | Role | Implementation/configuration |
| --- | --- | --- |
| Biome | Formatting; its linter and assist are disabled | [biome.json](../../biome.json) |
| oxlint | Static lint; repository scripts fail on warnings | [.oxlintrc.json](../../.oxlintrc.json), [scripts](../../package.json) |
| Vitest | Tests compiled library/CLI behavior in Node with simulated transport | [vitest.config.mjs](../../vitest.config.mjs), [tests](../../test/) |
| Lefthook | Runs local checks before commit and push | [lefthook.yml](../../lefthook.yml) |
| commitlint and its Conventional Commits preset | Validate messages used by contributors and release automation | [commitlint.config.mjs](../../commitlint.config.mjs) |
| GitHub Actions | Enforces verification, commit checks and dependency review independently of local hooks | [CI workflow](../../.github/workflows/ci.yml) |
| Release Please | Maintains release PRs, versions, changelog, tags and release notes | [release workflow](../../.github/workflows/release-please.yml), [configuration](../../release-please-config.json) |
| Dependabot | Declares scheduled dependency updates | [dependabot.yml](../../.github/dependabot.yml) |

The split keeps formatting, lint, type checking and behavioral checks explicit. [Contributing](../../CONTRIBUTING.md) owns setup commands, hook behavior, required verification and release recovery. Markdown and YAML are maintained manually; `pnpm verify` does not check Markdown links or technical prose.

Repository-managed security settings, their dated observations and lockfile indexing constraints belong to [quality tooling](../quality.md). Check current GitHub settings/runs before claiming those controls are active; a document alone is not evidence of a completed scan.

## Installed but unused

None among the tools listed above.

## Proposed / not enabled

Coverage reporting and additional hosted analysis options are tracked in [quality tooling](../quality.md#additional-free-options-under-consideration). They are not adopted merely by appearing in that list. Registry publishing is not part of the current release workflow; see [Releases](../../CONTRIBUTING.md#releases).

Tests establish simulated protocol and policy behavior. [Evaluation](../evaluation.md) owns the distinction between those checks and live model-quality evidence.
