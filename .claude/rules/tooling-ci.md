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
  - "docs/tech-stack/**"
  - "docs/dev-policy/**"
---

# Development tooling and CI

- Before changing branch, PR or development workflow policy, read [development policy](../../docs/dev-policy/README.md). Keep its instructions aligned with the actual hooks and workflows; [PR policy](../../docs/dev-policy/github-pr.md) owns merge verification.
- For dependency, runtime or tooling changes, read [the tech stack](../../docs/tech-stack/README.md) and follow [documentation maintenance](../../docs/tech-stack/documentation.md#updating-the-documents) in the same change.
- Before changing dependencies or pnpm configuration, read the lockfile compatibility section of [quality tooling](../../docs/quality.md). Verify GitHub's dependency graph after dependency updates; a passing Dependency Review alone does not establish that the lockfile was fully indexed.
- Before changing hooks or commit checks, read the Git hooks section of [CONTRIBUTING.md](../../CONTRIBUTING.md). Keep local checks aligned with CI and invoke repository tools through pnpm.
- Before changing release automation, read the Releases section of [CONTRIBUTING.md](../../CONTRIBUTING.md). Validate workflow edits with `actionlint` and check release status against the current PR head SHA. Review generated release changes before approving an individual waiting workflow run, retaining repository-wide execution protections.
