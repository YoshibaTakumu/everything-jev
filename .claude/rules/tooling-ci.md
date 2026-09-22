---
paths:
  - "package.json"
  - "pnpm-lock.yaml"
  - "pnpm-workspace.yaml"
  - ".node-version"
  - "tsconfig.json"
  - "biome.json"
  - ".oxlintrc.json"
  - "commitlint.config.mjs"
  - "lefthook.yml"
  - "vitest.config.mjs"
  - "Makefile"
  - ".github/**/*"
  - "release-please-config.json"
  - ".release-please-manifest.json"
  - "CHANGELOG.md"
  - "CONTRIBUTING.md"
  - "docs/quality.md"
---

# Development tooling and CI

- Before changing dependencies or pnpm configuration, read the lockfile compatibility section of [quality tooling](../../docs/quality.md). Verify GitHub's dependency graph after dependency updates; a passing Dependency Review alone does not establish that the lockfile was fully indexed.
- Before changing hooks or commit checks, read the Git hooks section of [CONTRIBUTING.md](../../CONTRIBUTING.md). Keep local checks aligned with CI and invoke repository tools through pnpm.
- Before changing release automation, read the Releases section of [CONTRIBUTING.md](../../CONTRIBUTING.md). Validate workflow edits with `actionlint` and check release status against the current PR head SHA. Review generated release changes before approving an individual waiting workflow run, retaining repository-wide execution protections.
