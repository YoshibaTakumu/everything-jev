# Security and privacy design

The package's policy is a decision helper. It is not an authorization server, prompt-injection shield, malware detector or sandbox. Its gates are only as trustworthy as the application that supplies them.

| Boundary               | Application responsibility                                                   |
| ---------------------- | ---------------------------------------------------------------------------- |
| Tenant and user access | Authenticate the caller; select rows within permitted scope before inference |
| Untrusted content      | Treat websites, messages, code comments and stored memories as data          |
| Tool execution         | Enforce tool, destination and parameter allowlists outside Jev               |
| Credentials            | Use a secret manager; never expose secrets in model state or public logs     |
| Consent                | Read authoritative communication and storage preferences                     |
| Revision control       | Reject stale snapshots immediately before writes                             |
| External writes        | Use idempotency, least privilege, audit evidence and postcondition checks    |
| Model failure          | Stop or route to review; never fall back to approval                         |

Noul risk questions can help prioritize review but cannot reliably detect every malicious prompt. Even a low concern score must not bypass an allowlist or consent check. A confident classification of an invoice, contract or contact message is not permission to pay, approve or delete it.

The HTTP client fixes the destination to TypeSafe, disables redirects and sanitizes transport errors. It does not anonymize input or guarantee provider retention rules. Perform data minimization before constructing a request, including removing personal data and secrets that are unnecessary for the decision. Consider local deterministic checks where sending data to an external model is inappropriate.

The client returns provider answers after structural validation; it is not a universal output redactor. The CLI may print labels or legend text. Handle live results according to the same access and retention policies as the input.

Bundled fixtures use fictional content. Git ignores local environment files, builds and `local/`, but `.gitignore` is not a secret scanner. Review staged files and generated artifacts before publishing contributions. Do not run live evaluations with secrets on untrusted pull requests. CI uses no provider credentials and has read-only repository permissions.

See [SECURITY.md](../SECURITY.md) for vulnerability reporting.
