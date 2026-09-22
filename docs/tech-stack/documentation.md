# Documentation management

## Ownership and entry points

| Location | Owns |
| --- | --- |
| [English README](../../README.md), [Japanese README](../../README.ja.md) | Public scope, setup and entry links; keep both consistent |
| [Documentation index](../README.md) | Routes tasks to the maintained reference |
| [Tech stack index](README.md) and its topic files | Adopted technologies, role, implementation evidence and adoption status |
| [Domain documents](../domain/README.md) | Concept vocabulary, relationships and local behavioral invariants; use the domain template and maintain its index |
| [API](../api.md), [architecture](../architecture.md), [security](../security.md), [harness](../harness.md) | Transport/CLI contracts, cross-domain flow, security boundaries and harness integration |
| [Cookbook](../cookbook.md), [evaluation](../evaluation.md) | Recipe guidance and evidence requirements |
| [Contributing](../../CONTRIBUTING.md), [quality tooling](../quality.md) | Development/release workflow and tooling observations |
| [Source ledger](../sources.md) | External research, official references and qualification of claims |
| [Root AGENTS.md](../../AGENTS.md), directory AGENTS.md files, [.claude/rules](../../.claude/rules/) | Short task/path triggers that route agents to contracts and applicable rules |
| [Repository skills](../../.agents/skills/README.md) | Reusable agent workflows, provenance and project guides; `.claude/skills` links to `.agents/skills` |

Documents use repository Markdown; there is no separate documentation generator or hosting configuration. Skills and agent tooling are available in the checkout; the package file allowlist in [package.json](../../package.json) does not include `.agents` or `.claude`. Review checkout-only links if a packaged documentation site or registry distribution is introduced.

Keep technical contracts in their existing owner documents. Topic files explain adoption and link to those contracts; rules and skills route readers there. Exact dependency versions and configuration values belong to their manifest, lockfile or implementation rather than another prose copy.

## Updating the documents

1. Read the root and applicable directory `AGENTS.md` files and their linked rules. Identify the owner above before editing a contract or adding a document.
2. For a dependency addition, removal, upgrade, first use, runtime/tool change or integration change, update the corresponding tech stack topic in the same change. Record its role, implementation/configuration path and status: in use, installed but unused, or proposed/not implemented. Document a decision or limitation only when supported by repository evidence; label a recommendation as a proposal.
3. Review the tech stack index with the topic. Update its row when coverage changes; add/remove a row when adding/removing a topic. Update the documentation index and affected rule/README/skill links when navigation changes. Preserve existing contract paths where possible, and keep the two public READMEs consistent.
4. Review relative links from each changed file, including heading anchors. Resolve all new local targets; search for incoming references when moving or deleting a document. Inspect the prose manually: Biome does not format Markdown and the current CI has no Markdown link checker.
5. Verify technical claims against the named source/configuration and run the checks required for the changed behavior in [Contributing](../../CONTRIBUTING.md). For external capability or availability claims, consult current primary sources and record the date and limits of any observation. A dependency or sample is not evidence of a working integration.
6. Before commit/push, review the complete diff and all new files for credentials, private project content, customer data and local machine paths. Use fictional examples and public references. Record the actual verification performed in the commit/PR or task report.

For a new tech stack topic, use a short title, an **In use** section with role and source links, an **Installed but unused** section (explicitly say none when applicable), and **Proposed / not implemented** only when there is a concrete proposal. Include relevant maintenance/contract links. Split by distinct subject when needed rather than creating empty categories. For domain concepts, use the separate [domain maintenance procedure](../domain/README.md#create-and-maintain-a-domain-document).
