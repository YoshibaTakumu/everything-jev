# Documentation tooling

Documentation is repository Markdown. There is no separate documentation generator or hosting configuration. Markdown and YAML are maintained manually; the checks in [Contributing](../../CONTRIBUTING.md) do not validate Markdown prose or links.

Repository skills live in `.agents/skills/`, exposed through the `.claude/skills` symlink. These checkout-only directories are not in the package file allowlist in [package.json](../../package.json). Review their documentation links before introducing packaged documentation or a registry distribution.

## Ownership and entry points

[Document lifecycle](../dev-policy/document-lifecycle.md#ownership-and-entry-points) owns the document map and placement rules. [The documentation index](../README.md) routes readers to current contracts.

## Updating the documents

Follow [the shared maintenance procedure](../dev-policy/document-lifecycle.md#updating-the-documents) for updates, link verification and publication review. This heading preserves the existing entry point; the procedure is maintained in development policy.
