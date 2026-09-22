# Client and CLI

## Supported protocol

`JevClient.evaluate()` sends one request to TypeSafe's evaluation endpoint. It supports the three typed question families and their documented response fields. The default recipe model is pinned to `jev-1.13.0`; use `requestFor(recipe, state, model)` for an explicit alternative. The actual returned model is preserved in the result. Model aliases are not reproducibility guarantees. [API reference](https://docs.typesafe.ai/api), [models](https://docs.typesafe.ai/models).

The client rejects non-JSON state, cycles, deeply nested data, unsafe prototype keys, invalid question sizes, missing/extra answers, unknown selected candidates, non-finite values, inconsistent distributions, and invalid token counts. Distribution sums and score means allow an absolute rounding tolerance of 0.001. New upstream protocol behavior may require a validator update.

Local request and streamed response limits are 2 MiB each. These are application byte limits, not model token limits. The request validator does not tokenize input. Consult the pinned model's context limits and reduce long documents before sending them.

The timeout defaults to 15 seconds and covers response-body reading. Pass `{ signal }` to `evaluate()` to support caller cancellation. The client disables redirects, avoids logging payloads, discards HTTP error bodies, and exposes HTTP status through `JevApiError.status`. There are no automatic retries; callers may add bounded backoff for transient failures. A timeout may still have incurred provider usage.

## Commands

| Command                                        | Behavior                                                          |
| ---------------------------------------------- | ----------------------------------------------------------------- |
| `pnpm jev list`                                | List IDs and implementation status                                |
| `pnpm jev inspect <id>`                        | Print the default request without network I/O                     |
| `pnpm jev demo <id\|all>`                      | Apply policy to hand-authored fixtures and synthetic gates        |
| `pnpm jev evaluate <id> --input <path> --live` | Evaluate JSON state using the live API; gates remain unknown      |
| `pnpm jev metrics <path>`                      | Compute metrics over boolean labels; null predictions mean review |

Argument order is intentional and strict. Unknown flags fail instead of silently changing execution mode. JSON goes to stdout; diagnostics go to stderr. Errors exit with status 1. Review and block are valid decision data, not process failures: consumers must inspect the JSON `status` rather than treat exit code 0 as approval.

Live state uses the same predefined candidate IDs as the selected recipe. To evaluate different browser targets, accounts, layouts or document paragraphs, construct a custom recipe or request in application code. Do not pass arbitrary candidates in state and expect the fixed demo rubric to discover them.

## Secrets and output

The CLI reads `TYPESAFE_API_KEY` from the process environment only. Optionally copy `.env.example` to a gitignored `.env` and use Node's explicit env-file loading:

```sh
node --env-file=.env dist/cli.js evaluate contact-filter --input examples/contact.json --live
```

Never put a key in an issue, fixture, command argument or committed file. The client does not log requests. The CLI prints model answers, which may still contain sensitive labels or reflected text from a live service; handle stdout as application data and avoid public CI logs for private inputs. `inspect` prints its sample state deliberately. Provider retention, processing location and contractual terms must be reviewed separately; this toolkit does not claim zero retention.

## Package use

`pnpm build` produces JavaScript and declarations in `dist/`. The package export is `dist/index.js`; the command entry is `dist/cli.js`. The public repository is the distribution channel for v0.1.0. There is no published registry package to install yet.

The test suite injects a fake `fetch` implementation to test the protocol without credentials or a billable request. That injection point is for trusted application/test code. Runtime dependencies are zero; development dependencies are locked with pnpm.
