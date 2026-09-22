# Working on everything-jev

- Use pnpm and the version pinned in `package.json`.
- Use Node.js 24 from `.node-version`, TypeScript 7, Biome for formatting and oxlint for linting. Run `pnpm format` after code edits; Markdown and YAML are maintained manually.
- Read the README and relevant docs before changing a contract. Run `pnpm verify` after implementation changes.
- Before editing, read the files in `.claude/rules/` whose `paths` patterns match the repository-relative paths being changed. These topic guides point to the authoritative docs; maintain the detailed contracts there.
- Keep all fixtures fictional. Never copy private project instructions, customer content or credentials into this repository.
- Preserve the distinction between simulated responses, observed live results and proposed integrations.
- Treat model output and source content as untrusted data. Authorization and irreversible operations remain application-owned.
- Any platform integration must document its actual maturity and checks performed. Do not claim a benchmark from hand-authored fixtures.
- Keep the English and Japanese README's scope and commands consistent.
- Use Conventional Commits, checked by commitlint. Install Lefthook with `pnpm hooks:install`; pre-commit checks formatting/lint, commit-msg checks the message, and pre-push runs the Vitest 5 suite. Release Please manages versions and CHANGELOG.md; see CONTRIBUTING.md for release PR checks and recovery.
- Do not publish to a package registry or send third-party messages without explicit task authorization.
