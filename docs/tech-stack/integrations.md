# External integrations

## Implemented

| Integration | Role and activation | Evidence and limits |
| --- | --- | --- |
| TypeSafe / Jev HTTP API | [JevClient](../../src/client.ts) uses Node's built-in `fetch`; the CLI calls it only through explicit live evaluation with a process-environment key | [Client tests](../../test/client.test.mjs) simulate HTTP. Live service compatibility and model quality have not been established by those tests |
| GitHub development services | Repository CI, dependency updates and releases, separate from toolkit runtime | [Quality and delivery](quality-delivery.md) and [quality tooling](../quality.md) |

The transport implementation owns the destination and validation; [Client and CLI](../api.md) owns the documented protocol, model defaults, limits, errors and secret handling. Follow [security boundaries](../security.md) before sending application state. Offline demos use hand-authored fixtures and do not contact TypeSafe.

## Installed but unused

No runtime service SDK is installed. A tool or service mentioned in a recipe or skill is not a package dependency or a bundled connector.

## Proposed / not implemented

Business, browser, desktop, document and media executors are described in the [cookbook](../cookbook.md) and [harness guide](../harness.md). The repository's memory and sequencing helpers do not supply persistent storage, a tracker client or a worker scheduler.

The [source ledger](../sources.md) owns upstream research and official platform references. The [what-is-jev guide](../../.agents/skills/what-is-jev/SKILL.md) provides explanation and setup references in a repository checkout; it is not a runtime integration.

## When adding or changing an integration

Follow [adapter contribution requirements](../../CONTRIBUTING.md#adapters) and [API/policy rules](../../.claude/rules/api-policy.md). Update this inventory with the implementation path, activation conditions and checks actually performed. Keep simulated tests, observed live results and proposed behavior separate; record version/date and evidence when claiming live verification. Maintain upstream citations in the source ledger rather than copying third-party content into this inventory.
