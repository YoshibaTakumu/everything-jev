# Quality and security tooling

Policy and availability checked on 2026-09-22. This repository is public; recheck pricing before changing its visibility or enabling additional products.

## Repository checks

- **Biome and oxlint:** formatting and static lint in `pnpm verify`.
- **TypeScript 7 and Node 24 tests:** compilation and simulated protocol/policy checks in CI. These do not establish live Jev accuracy.
- **Dependency Review:** checks dependency changes on PRs and explicitly dispatched release PR CI. Moderate or higher known vulnerabilities fail the job. It does not enforce a license allowlist or post PR comments.
- **CodeQL:** GitHub-managed default setup for JavaScript/TypeScript and GitHub Actions, using the extended query suite and standard hosted runners. Configuration lives in GitHub repository settings, not a checked-in CodeQL workflow. Inspect Security → Code scanning and the CodeQL Actions runs for actual findings and scan status.
- **Dependabot:** weekly package/action updates plus repository-level alerts and security update PRs. Major `@types/node` version updates are ignored so types follow the supported Node 24 runtime; review this policy when changing Node versions.
- **Secret scanning and push protection:** repository settings protect against supported credential patterns. Their enabled status does not establish that every possible secret can be detected.

Dependency graph, Dependabot alerts/security updates, code scanning, and secret scanning have free public-repository options: [GitHub security features](https://docs.github.com/en/code-security/getting-started/github-security-features). [Dependency Review](https://docs.github.com/en/code-security/concepts/supply-chain-security/dependency-review) is available for public repositories. [CodeQL default setup](https://docs.github.com/en/code-security/how-tos/find-and-fix-code-vulnerabilities/configure-code-scanning/configure-code-scanning) runs on changes and a recurring schedule.

## GitHub Code Quality availability

GitHub Code Quality is a separate product from CodeQL code scanning. GitHub announced general availability on July 20, 2026 at $10 per active committer/month, with additional usage costs. The current documentation lists GitHub Team and Enterprise Cloud. The setup API for this personal public repository returned `Code quality is not available for this repository.` We have not enabled it or purchased a plan.

Sources: [GA announcement](https://github.blog/changelog/2026-07-20-github-code-quality-is-now-generally-available/), [billing](https://docs.github.com/en/billing/concepts/product-billing/github-code-quality), [enablement](https://docs.github.com/en/code-security/how-tos/maintain-quality-code/enable-code-quality).

## Additional free options under consideration

| Option | Free scope | Recommendation |
| --- | --- | --- |
| [Codecov](https://about.codecov.io/pricing/) | Free plan includes public repositories and public uploads | Next useful addition for coverage trends and changed-line coverage. Generate a coverage report first, then configure the repository integration. Not enabled. |
| [SonarQube Cloud OSS](https://docs.sonarsource.com/sonarqube-cloud/administering-sonarcloud/managing-subscription/subscription-plans) | OSS plan supports public projects, branch and PR analysis | Consider if a persistent maintainability dashboard is needed. Requires external onboarding and overlaps with oxlint/CodeQL. Not enabled. |
| [OpenSSF Scorecard](https://github.com/ossf/scorecard-action) | Open-source action; can run on standard public GitHub Actions runners | Useful when preparing for wider adoption; assess repository practices rather than model accuracy. Not enabled. |
| [Artifact attestations](https://docs.github.com/en/code-security/getting-started/github-security-features#artifact-attestations) | Public repositories on GitHub Free/Pro/Team | Add when publishing built release artifacts; current automated releases publish tags and release notes only. Not enabled. |

Prioritize Codecov after choosing meaningful coverage targets. Avoid adding multiple overlapping review bots solely because their public-repository tier is free.
