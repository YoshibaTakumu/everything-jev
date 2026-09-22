---
id: memory
title: Memory eligibility
status: implemented
updated: 2026-09-22
---

# Memory eligibility

## Definition and vocabulary

A memory record is caller-supplied text with identity, scope, provenance, consent and lifetime information. **Eligibility** means that the supplied record meets the helper's retrieval preconditions; it does not mean that the text is relevant, correct or safe. The **scope** names the tenant, principal and project requesting access.

## Relationships

- An application store supplies records and authoritative scope. [Security](../security.md) owns authentication and data-access boundaries.
- Semantic ranking may only consider records that remain after eligibility filtering. The memory [recipe](recipe.md) illustrates a separate decision about retention; it does not persist records.
- [Architecture](../architecture.md#state-memory-and-evidence) owns retention design and evidence provenance across the harness.

## Implementation and data

[src/memory.ts](../../src/memory.ts) owns `MemoryRecord`, `MemoryScope` and `eligibleMemories()`. Field types and predicates belong to that implementation; callers supply records, scope and the evaluation time.

## Rules and outcomes

- `eligibleMemories()` throws if scope identifiers are empty or the supplied time is not finite.
- Identity validation happens across all supplied records before filtering: an empty or duplicate memory ID causes the entire call to throw, including duplicates outside the requested scope.
- A record is included only when all scope identifiers match exactly, consent is explicitly given, revocation is explicitly false, and text and provenance are nonempty.
- Creation/expiry times must be finite. Creation at the supplied time is eligible; expiry at that time is already ineligible. Future-created and expired records are excluded.
- Ineligible records are omitted, not converted into policy decisions. The helper preserves the input order of eligible records and returns copies, so editing a returned record does not edit its input record.

These rules are enforced by `eligibleMemories()` over the supplied snapshot. It does not authenticate scope, enforce database row permissions, save/revoke/delete records, resolve contradictions, detect secrets or perform semantic search. A concurrent store change requires application-owned revalidation.

## Boundaries and verification

[test/core.test.mjs](../../test/core.test.mjs) exercises exact scope, consent, revocation, provenance, future creation, expiry boundary, non-finite expiry, duplicate IDs and output-copy isolation. This is a deterministic filter test, not a test of durable memory storage or retrieval quality.

## Open questions

None for the current filter contract. Storage, correction and retention policies belong to the adopting application.
