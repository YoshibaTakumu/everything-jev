# Security policy

Security fixes target the latest released version. This is an early toolkit release and has not received an independent security audit.

Use GitHub's **Report a vulnerability** flow under this repository's Security tab for a sensitive report. Include the affected version, reproduction steps, impact and a minimal sanitized example. Never include a working API key or private customer data. Private vulnerability reporting is enabled for this repository.

For a non-sensitive bug, open a normal issue. This community project has no guaranteed response SLA. If a provider credential has leaked, revoke it with the provider immediately; opening a report does not revoke it.

Read [the security design](docs/security.md) before connecting the decision layer to external actions. A policy result is not proof of authorization, and Jev is not the security boundary.
