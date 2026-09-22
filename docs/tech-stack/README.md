# Tech stack

Index of the technologies adopted by everything-jev. Read the relevant topic before changing a dependency, runtime, tool or integration. Each topic records its role, implementation/configuration evidence and adoption limits.

| Topic | Scope |
| --- | --- |
| [Runtime and build](runtime.md) | Node.js, TypeScript, pnpm, ESM and the dependency surface |
| [Quality and delivery](quality-delivery.md) | Biome, oxlint, Vitest, Git hooks, GitHub Actions and releases |
| [External integrations](integrations.md) | TypeSafe transport, simulated verification and proposed platform adapters |
| [Documentation](documentation.md) | Markdown tooling and links to the shared document lifecycle |

Exact versions belong to [package.json](../../package.json), [pnpm-lock.yaml](../../pnpm-lock.yaml), [.node-version](../../.node-version) and pinned workflow actions. Look them up there instead of copying them into this inventory. Protocol/model defaults belong to the implementation and [API contract](../api.md).

Distinguish **in use**, **installed but unused**, and **proposed/not implemented**. An implemented client tested with simulated responses is not a verified live integration. On technology changes, update the affected topic and review this index in the same change; edit its row when scope or navigation changes. Follow the [maintenance procedure](documentation.md#updating-the-documents).

For behavioral contracts, examples and research, return to the [documentation index](../README.md).
