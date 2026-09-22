---
paths:
  - "src/**/*.ts"
  - "docs/api.md"
  - "docs/architecture.md"
  - "docs/security.md"
  - "docs/harness.md"
---

# API and policy contracts

- Before changing HTTP transport, validation, public types or CLI behavior, read [the client and CLI contract](../../docs/api.md). Check request/response limits, cancellation, sanitized errors and CLI output/exit behavior against the changed contract.
- Before changing policy, memory eligibility or dependency sequencing, read [architecture](../../docs/architecture.md) and [security boundaries](../../docs/security.md). Verify the affected missing-fact, invalid-input and scope-boundary cases.
- Before implementing an external adapter or executor, read [the harness integration guide](../../docs/harness.md) and the Adapters section of [CONTRIBUTING.md](../../CONTRIBUTING.md). Keep the documented integration maturity aligned with the checks actually performed.
