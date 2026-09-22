# Contributing

Use Node.js 24.x (`.node-version`) and the pnpm version declared in `package.json`.

```sh
pnpm install --frozen-lockfile
pnpm build
pnpm demo
pnpm verify
```

Run `pnpm format` after edits. Biome formats JavaScript, TypeScript, and JSON; Markdown and YAML are maintained manually. Generated output and local data are excluded. oxlint owns lint rules; Biome's linter and assist are disabled to keep their responsibilities separate.

`pnpm lint` checks source, tests, and examples and fails on warnings. `pnpm lint:fix` applies available safe fixes. `pnpm verify` runs the formatter check, oxlint, the TypeScript 7 build, and tests.

Tests use Node's built-in test runner and simulated HTTP responses; do not add a real provider key to CI. Keep the runtime dependency surface small and commit lockfile changes with dependency updates.

## Recipes

Add a recipe to `src/recipes.ts` with a specific question, explicit candidate descriptions, a `no_match` path, a concern question, required gate names, fictional state and a hand-authored fixture choice. Test the meaningful failure cases and update the cookbook and bilingual README counts. A fixture is not a benchmark: state its origin clearly.

Keep natural-language inference separate from authorization, financial arithmetic, persistence and external writes. If a deterministic rule already solves a problem reliably, use it and explain where a model adds value.

## Adapters

An adapter contribution should include the supported service/API version, scopes, data minimization, revision/identity checks, dry-run preview, idempotency behavior, failure recovery and outcome verification. Report exactly which integration checks ran. Do not call an adapter production-ready merely because its mocked request test passes.

## Releases

Use Conventional Commits when merging changes: `fix:` for patches, `feat:` for features, and `!` or a `BREAKING CHANGE:` footer for breaking changes. Before 1.0, breaking changes increment the minor version. Release Please generates version changes and `CHANGELOG.md`; do not maintain an `Unreleased` section manually.

After successful push CI on the current `main` commit, Release Please creates or updates a release PR. Review its version, changelog, and successful `CI / verify` check before merging it. Merging the release PR and passing main CI creates the `vX.Y.Z` tag and GitHub Release. This workflow does not publish to npm. The initial manifest continues from v0.1.0.

The repository must enable **Settings → Actions → General → Allow GitHub Actions to create and approve pull requests**. Default workflow permissions can remain read-only; the release job requests the required write permissions. It uses `GITHUB_TOKEN`, so it explicitly dispatches CI on the generated release branch because bot-created PRs do not trigger `pull_request` workflows. No personal access token is required.

For recovery, rerun the failed Release Please job or dispatch `release-please.yml` on `main` after checking that main CI passed. If release PR CI needs rerunning, use `gh workflow run ci.yml --ref <release-branch>`. Check Actions logs and the PR's current commit before merging; the workflow does not auto-merge release PRs.

## Evidence and reviews

Use human-readable commits and PR descriptions that explain the problem, changed behavior and validation. Cite primary sources for platform claims, distinguish observations from proposals, and document limitations. Contributions must not include customer data, private repository content, credentials or copied code with incompatible licensing.

By contributing, you agree that your contributions are provided under the repository's MIT license. Follow the [Code of Conduct](CODE_OF_CONDUCT.md). Report sensitive vulnerabilities via [SECURITY.md](SECURITY.md), not a public issue.
