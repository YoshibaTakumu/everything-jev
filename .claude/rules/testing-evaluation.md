---
paths:
  - "test/**/*.mjs"
  - "vitest.config.mjs"
  - "src/evaluation.ts"
  - "docs/evaluation.md"
  - "examples/labels.json"
---

# Tests and evaluation

- Before changing tests or their configuration, read the test workflow in [CONTRIBUTING.md](../../CONTRIBUTING.md). Tests exercise built `dist` entry points, so use `pnpm test` to rebuild before running them.
- Keep HTTP tests on injected simulated transport and CLI tests isolated from developer credentials. Check observable results, including rejected inputs and failure paths, without live provider calls.
- Before changing metrics, policy thresholds or performance claims, read [evaluation](../../docs/evaluation.md). Verify review-case denominators and undefined-ratio behavior for metric changes; tie quality claims to the documented evidence requirements.
