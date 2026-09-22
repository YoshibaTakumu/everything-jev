# Contributing

Use Node.js 22+ and the pnpm version declared in `package.json`.

```sh
pnpm install --frozen-lockfile
pnpm build
pnpm demo
pnpm verify
```

Run `pnpm format` after edits. Tests use Node's built-in test runner and simulated HTTP responses; do not add a real provider key to CI. Keep the runtime dependency surface small and commit lockfile changes with dependency updates.

## Recipes

Add a recipe to `src/recipes.ts` with a specific question, explicit candidate descriptions, a `no_match` path, a concern question, required gate names, fictional state and a hand-authored fixture choice. Test the meaningful failure cases and update the cookbook and bilingual README counts. A fixture is not a benchmark: state its origin clearly.

Keep natural-language inference separate from authorization, financial arithmetic, persistence and external writes. If a deterministic rule already solves a problem reliably, use it and explain where a model adds value.

## Adapters

An adapter contribution should include the supported service/API version, scopes, data minimization, revision/identity checks, dry-run preview, idempotency behavior, failure recovery and outcome verification. Report exactly which integration checks ran. Do not call an adapter production-ready merely because its mocked request test passes.

## Evidence and reviews

Use human-readable commits and PR descriptions that explain the problem, changed behavior and validation. Cite primary sources for platform claims, distinguish observations from proposals, and document limitations. Contributions must not include customer data, private repository content, credentials or copied code with incompatible licensing.

By contributing, you agree that your contributions are provided under the repository's MIT license. Follow the [Code of Conduct](CODE_OF_CONDUCT.md). Report sensitive vulnerabilities via [SECURITY.md](SECURITY.md), not a public issue.
