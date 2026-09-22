# Contributing

Use Node.js 24.x (`.node-version`) and the pnpm version declared in `package.json`.

Install that exact pnpm version with your version manager and check `pnpm --version` before working. `pmOnFail: ignore` keeps the lockfile compatible with GitHub's dependency graph, so pnpm does not switch versions or enforce the pin itself. CI installs the declared version with `pnpm/action-setup` and explicitly checks it. See [the lockfile compatibility note](docs/quality.md#pnpm-lockfile-compatibility) before changing this setting.

```sh
pnpm install --frozen-lockfile
pnpm hooks:install
pnpm build
pnpm demo
pnpm verify
```

Run `pnpm format` after edits. Biome formats JavaScript, TypeScript, and JSON; Markdown and YAML are maintained manually. Generated output and local data are excluded. oxlint owns lint rules; Biome's linter and assist are disabled to keep their responsibilities separate.

`pnpm lint` checks source, tests, examples, and JavaScript tool configuration and fails on warnings. `pnpm lint:fix` applies available safe fixes. `pnpm verify` runs the formatter check, oxlint, the TypeScript 7 build, and Vitest 5 tests.

Tests run in Vitest's Node environment, retain Node's strict assertions, and exercise the compiled `dist` entry points and CLI with simulated HTTP responses. `pnpm test` rebuilds before each run; do not add a real provider key to CI. Keep the runtime dependency surface small and commit lockfile changes with dependency updates.

## Git hooks and commit messages

Lefthook runs formatting and lint checks at `pre-commit`, commitlint at `commit-msg`, and the build plus Vitest suite at `pre-push`. The checks do not rewrite or stage files. `pnpm-workspace.yaml` allows Lefthook's install script; `pnpm hooks:install` also installs or repairs hooks when dependencies came from a cache. CI runs the checks directly without relying on Git hooks.

Use Conventional Commits such as `fix(client): handle cancelled requests` or `feat(recipes): add a routing recipe`. commitlint uses `@commitlint/config-conventional`. To check a message file manually, run `pnpm commitlint --edit <message-file>`; to check a commit range, use `pnpm commitlint --from <base> --to <head>`.

CI checks every commit in a PR or main push range. Dispatched release-branch CI checks commits since its merge base with `main`; other manual runs check the latest commit. Release Please's generated release commit follows the same convention.

## Recipes

Add a recipe to `src/recipes.ts` with a specific question, explicit candidate descriptions, a `no_match` path, a concern question, required gate names, fictional state and a hand-authored fixture choice. Test the meaningful failure cases and update the cookbook and bilingual README counts. A fixture is not a benchmark: state its origin clearly.

Keep natural-language inference separate from authorization, financial arithmetic, persistence and external writes. If a deterministic rule already solves a problem reliably, use it and explain where a model adds value.

## Adapters

An adapter contribution should include the supported service/API version, scopes, data minimization, revision/identity checks, dry-run preview, idempotency behavior, failure recovery and outcome verification. Report exactly which integration checks ran. Do not call an adapter production-ready merely because its mocked request test passes.

## Releases

Use Conventional Commits when merging changes: `fix:` for patches, `feat:` for features, and `!` or a `BREAKING CHANGE:` footer for breaking changes. Before 1.0, breaking changes increment the minor version. Release Please generates version changes and `CHANGELOG.md`; do not maintain an `Unreleased` section manually.

After successful push CI on the current `main` commit, Release Please creates or updates a release PR. Review its version, changelog, and successful `CI / release checks` status before merging it. That status is attached to the exact release PR commit after verification and dependency review pass. Merging the release PR and passing main CI creates the `vX.Y.Z` tag and GitHub Release. This workflow does not publish to npm. The initial manifest continues from v0.1.0.

The repository must enable **Settings → Actions → General → Allow GitHub Actions to create and approve pull requests**. Default workflow permissions can remain read-only; the release job requests the required write permissions. It uses `GITHUB_TOKEN`, so it explicitly dispatches CI on the generated release branch. Bot-created PRs also create a separate `pull_request` run that requires maintainer approval; this can show `action_required` even when the dispatched `CI / release checks` passes. After reviewing the generated diff, a maintainer can approve that specific run from the PR's **Approve workflows to run** control. Keep repository-wide execution protections enabled. No personal access token is required. See [GitHub's token event behavior](https://docs.github.com/en/actions/concepts/security/github_token#when-github_token-triggers-workflow-runs).

For recovery, rerun the failed Release Please job or dispatch `release-please.yml` on `main` after checking that main CI passed. If release PR CI needs rerunning, use `gh workflow run ci.yml --ref <release-branch>`. Check Actions logs and the PR's current commit before merging; the workflow does not auto-merge release PRs.

## Evidence and reviews

Use the [documentation index](docs/README.md) to find the owner of a contract and the [tech stack](docs/tech-stack/README.md) for adopted technology. Dependency, tooling and integration changes include the corresponding topic update and index review; follow the [documentation maintenance procedure](docs/tech-stack/documentation.md#updating-the-documents), including manual link and publication checks.

Concepts and behavioral invariants live in [domain documents](docs/domain/README.md). Update the owning document with behavioral changes. For a new domain, start from its template, link implementation and relevant tests, and add an index row describing the question it owns. Keep implementation proposals distinct from observed behavior.

See [quality and security tooling](docs/quality.md) for the checks, repository settings, free OSS options, and current Code Quality availability.

Use human-readable commits and PR descriptions that explain the problem, changed behavior and validation. Cite primary sources for platform claims, distinguish observations from proposals, and document limitations. Contributions must not include customer data, private repository content, credentials or copied code with incompatible licensing.

By contributing, you agree that your contributions are provided under the repository's MIT license. Follow the [Code of Conduct](CODE_OF_CONDUCT.md). Report sensitive vulnerabilities via [SECURITY.md](SECURITY.md), not a public issue.
