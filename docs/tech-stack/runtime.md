# Runtime and build

## In use

| Technology | Role and reason in this repository | Source of truth |
| --- | --- | --- |
| Node.js | Runs the library, CLI and tests; built-in HTTP and cancellation APIs keep the runtime dependency surface small | [.node-version](../../.node-version), [engine requirement](../../package.json), [client](../../src/client.ts) |
| TypeScript and Node type definitions | Compile strict source into JavaScript and declarations for library consumers | [tsconfig.json](../../tsconfig.json), [development dependencies](../../package.json) |
| Native ECMAScript modules | Shared module format for the package export, CLI and tests; the build emits directly to `dist/` | [package exports and scripts](../../package.json), [public entry](../../src/index.ts), [CLI entry](../../src/cli.ts) |
| pnpm | Pins development tools and resolves reproducible installs from the committed lockfile | [packageManager](../../package.json), [lockfile](../../pnpm-lock.yaml), [workspace settings](../../pnpm-workspace.yaml) |

The package declares no runtime dependencies. Runtime validation is implemented in [src/validation.ts](../../src/validation.ts); its contract is in [Client and CLI](../api.md). The repository does not use a web framework, bundler or database. Persistent storage and service executors belong to the consuming application; see [architecture](../architecture.md).

## Installed but unused

No direct development dependency is currently identified as unused: compiler/types are covered above, and the remaining tools are covered by [quality and delivery](quality-delivery.md). Transitive lockfile entries are not separate adoption decisions.

## When changing this area

Follow [tooling rules](../../.claude/rules/tooling-ci.md) and the [contributor setup](../../CONTRIBUTING.md). In particular, consult the [pnpm lockfile compatibility note](../quality.md#pnpm-lockfile-compatibility) before changing resolution settings. Verify the library declarations and CLI through `pnpm verify` when changing runtime or build behavior.
