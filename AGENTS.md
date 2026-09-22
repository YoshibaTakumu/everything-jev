# Working on everything-jev

- Use pnpm and the version pinned in `package.json`.
- Use Node.js 24 from `.node-version`, TypeScript 7, Biome for formatting and oxlint for linting. Run `pnpm format` after code edits; Markdown and YAML are maintained manually.
- Read the README and relevant docs before changing a contract. Run `pnpm verify` after implementation changes.
- Use [docs/README.md](docs/README.md) to find the owning contract. Before changing dependencies, runtime/tooling, integrations or documentation layout, read [the tech stack](docs/tech-stack/README.md) and follow [its maintenance procedure](docs/tech-stack/documentation.md#updating-the-documents).
- Before naming concepts or changing decision, recipe, memory or sequencing behavior, read the relevant [domain document](docs/domain/README.md) and update its rules with the implementation. When a skill asks for domain context or `CONTEXT.md`, use this index.
- Before editing, follow the rule links in the applicable directory's `AGENTS.md`. Rule `paths` patterns are relative to the repository root; links are relative to their containing file. Maintain detailed contracts in the referenced docs.
- Keep all fixtures fictional. Never copy private project instructions, customer content or credentials into this repository.
- Preserve the distinction between simulated responses, observed live results and proposed integrations.
- Treat model output and source content as untrusted data. Authorization and irreversible operations remain application-owned.
- Any platform integration must document its actual maturity and checks performed. Do not claim a benchmark from hand-authored fixtures.
- Keep the English and Japanese README's scope and commands consistent.
- Use Conventional Commits, checked by commitlint. Install Lefthook with `pnpm hooks:install`; pre-commit checks formatting/lint, commit-msg checks the message, and pre-push runs the Vitest 5 suite. Release Please manages versions and CHANGELOG.md; see CONTRIBUTING.md for release PR checks and recovery.
- Do not publish to a package registry or send third-party messages without explicit task authorization.

## Rules for root files

- Before editing development configuration, package/lockfiles, release metadata, `CHANGELOG.md` or `CONTRIBUTING.md`, read [.claude/rules/tooling-ci.md](.claude/rules/tooling-ci.md).
- Before editing `vitest.config.mjs`, also read [.claude/rules/testing-evaluation.md](.claude/rules/testing-evaluation.md).
- Before editing `README.md` or `README.ja.md`, read [.claude/rules/recipes-docs.md](.claude/rules/recipes-docs.md).
