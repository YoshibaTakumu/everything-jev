# Cookbook: 22 decision recipes

Run `pnpm jev inspect <id>` to inspect a request and `pnpm jev demo <id>` to exercise its fixture. All entries are implemented in [src/recipes.ts](../src/recipes.ts). Each defines a bounded Choice question, a concern Noul, required deterministic gates, fictional state and a hand-authored response. SEO also demonstrates a Score rubric.

**Maturity for every entry:** executable decision example; external platform adapter not shipped; live quality not measured. The same generic policy is intentionally visible across recipes. This does not imply that identical thresholds are appropriate for different domains.

## Development

### `harness-routing`

Repository rules and task evidence → choose inspect, implement or verify → harness dispatch. Load the full applicable instruction chain before constructing state. Limit tools by workspace, budget and task scope. A model selecting `verify` does not prove that tests were run: use captured process results and artifacts. See [harness.md](harness.md).

### `semantic-lint`

AST extraction → bounded code/rule candidate → semantic rule selection → evidence-bound diagnostic. Cheap deterministic rules should remove impossible candidates first. Preserve file path, source revision, rule version and exact spans. Report only what the supplied code supports, inspect surrounding context for false positives, and keep enforcement severity in repository-owned policy. The [jev-lint project](https://github.com/mizchi/jev-lint) is a research reference; this package does not embed its implementation.

### `code-review`

Diff + relevant caller context + check results → prioritize review areas → gather evidence → verify finding → reviewer. Jev can reduce the search space for a larger coding agent or human. Bind findings to the reviewed head SHA; drop or rerun stale findings after new commits. Code compilation, regression tests, tenant boundaries, review approval and merge authorization remain independent. This recipe classifies a review lead, not a complete review report.

### `security`

Proposed operation + data flow → review queue → deterministic tool/destination/credential checks. The included fixture selects an exfiltration review queue; it never authorizes the suspicious upload. Jev may help triage risk but cannot be a universal prompt-injection firewall. Enforce data access, egress, shell restrictions and credential scope in code or a sandbox.

### `agent-manager`

Worker telemetry + artifact deltas → continue, request evidence or investigate a stall → scheduler intervention. Model judgments are useful for ambiguous progress, but task completion must be established by required checks and delivered artifacts. Use leases, cancellation, budgets and bounded worker concurrency. The package does not start background workers or call Devin/CodeRabbit services.

### `issue-sequencing`

Authoritative tracker dependency graph → [`frontier()`](../src/sequencing.ts) → Jev readiness check → scheduler. Only open issues whose blockers are done enter the frontier. Cycles and missing dependencies are rejected. Model-estimated urgency can rank eligible work; it cannot remove a blocker, create capacity or override a lock. Implement tracker revision checks and atomic task leases before dispatch. `node examples/harness.mjs` demonstrates a missing-revision review.

## Knowledge and interaction

### `note-tagging`

Note title and bounded text + existing taxonomy → one candidate topic → tag suggestion. Use independent yes/no decisions or repeated bounded selection for multi-label tagging, with a limit and deduplication in code. Match the document revision before writing. A note-tagging pattern does not establish a supported note.com connector; platform authentication, API availability and write behavior need their own adapter.

### `memory`

Explicit user statement → session-only, durable-preference candidate or discard → scoped store. For retrieval, first enforce scope/expiry with [`eligibleMemories()`](../src/memory.ts), then rank eligible records semantically. Short-term context, personal preferences and long-term project facts need distinct retention and correction policies. Jev does not retain the user's memory between requests. The included helper does not provide a database, vector search, deduplication, contradiction handling or deletion service.

### `browser-target`

DOM/accessibility observation → candidate ID and permitted action pairs → selection → refreshed observation. Enumerate candidates rather than ask a model to invent selectors. Match the selected element's supported action and origin, and guard against stale nodes. The researched [Stagehand PR #2953](https://github.com/browserbase/stagehand/pull/2953) describes an **experimental** integration and was open on 2026-09-22; it is not evidence that Stagehand v4 as a whole is implemented with Jev.

### `typing-game`

Local game observation → phase selection → externally transcribed text → deterministic keystrokes. Jev may select start/type/wait, but the actual character stream should come from a trusted transcription and a typing adapter. The fixture illustrates this division of labor. A working Jev-powered Sushi-da implementation and its performance were not verified here. Check the game's permitted automation context before building an adapter.

### `desktop-target`

OS accessibility tree or text extracted from a screenshot → observed target IDs → supported action → post-action snapshot. Coordinate clicks alone are fragile; prefer stable accessibility handles when available. Never infer that an export or destructive confirmation is approved because its button was selected. The [agent-desktop project](https://github.com/lahfir/agent-desktop) provides a related public design, not a bundled dependency.

### `voice-routing`

Streaming ASR → final or stable utterance → optional intent/path selection → response generation or approved cached phrase → TTS. Jev contributes a routing decision; it does not create speech. Measure end-to-end latency with and without the extra call, including buffering and network time. Implement interruption, partial-transcript handling, human handoff and audio consent in the voice application.

## Business operations

### `seo-aieo`

Query + page excerpt + verified evidence → editorial improvement and rubric score → revised content → actual search/citation measurements. Jev can assess intent fit, specificity and evidence gaps. It cannot establish a ranking or citation probability merely by scoring content. AI search optimization terminology varies: AIEO, AEO and GEO are related labels, not one universal measurable objective. Use search-engine documentation and real analytics, and do not invent special markup requirements.

### `line-replies`

Verified webhook → authoritative account/recipient context → FAQ draft, support handoff or preference update → LINE/Lstep adapter. Keep one defined owner for incoming events, deduplicate webhook retries, and enforce each send operation's current platform rules. Generate answer text through a separate templating or language-model step. Consent withdrawal should update authoritative suppression state before any further marketing. No reply is sent by the recipe.

### `email-marketing`

Consented events → lifecycle segment → draft campaign or workflow transition → ESP. Jev can propose a segment, content variant or next action. The ESP and application enforce subscription status, suppression lists, frequency caps, recipient identity and delivery. Recheck suppression immediately before enqueue/send; a stale segment must never reactivate an unsubscribed recipient. The fixture does not connect to an email provider.

### `contact-filter`

Server-side form validation/rate controls → message-purpose classification → support inbox, business queue or reversible quarantine. Classify the behavior and relevance, not whether “AI wrote it.” Keep a path for false positives and do not permanently delete messages solely on a semantic score. Verify anti-abuse tokens on the server and measure missed legitimate enquiries separately from nuisance volume.

### `accounting`

Invoice extraction + supplier identity + chart of accounts + approved prior examples → account suggestion → accountant review → posting API. Real account IDs must come from the company's master data. Totals, rounding, tax rules, duplicate detection, company scope, period locks and journal balance belong in deterministic code. Related historical examples may help, but chronological evaluation is necessary to avoid leakage. This recipe neither calculates tax nor posts, pays or reconciles anything.

### `legal-review`

Clause extraction + definitions/cross-references + versioned playbook → review category or issue candidate → cited evidence → qualified review. Detecting a clause is different from establishing its legal effect or approving an agreement. Missing exceptions, jurisdiction or contract context require review. The fixture demonstrates topic triage only; it does not provide a legal opinion or jurisdiction-specific compliance check.

## Documents and media

### `google-docs`

Document revision + stable paragraph/range mapping → editorial target → preview → revision-checked update. Keep extracted-text indices aligned with the API representation, including suggestions when relevant. Use an Apps Script sidebar or separate review UI for recommendations. Google Docs suggestion-writing capabilities may depend on Developer Preview access; do not assume universal availability. Drive comment anchors and Docs editing ranges are different mechanisms.

### `powerpoint`

Extracted slide text + content rule → review action → PowerPoint add-in or PPTX editing adapter → rendered visual QA. Text-only inference cannot inspect clipping, contrast, image content or final typography. Keep slide IDs and revisions, and verify changes in the renderer users will consume. Jev can choose a content review target; native editing APIs or a deck library perform the modification.

### `slides-as-code`

Structured content → registered layout ID → deterministic template → PptxGenJS or Slidev → render and inspect. Validate content size and assets before selecting layouts, then verify overflow and editability after rendering. Slidev's ordinary PPTX export and its editable export have different behavior; consult the current exporter documentation. This package chooses a layout in a fixture, but does not bundle those libraries or generate a presentation file.

### `video-editing`

ASR and visual analysis → candidate segments/timecodes → selection → editorial preview → Premiere UXP or another editor → render and watch. Jev cannot directly evaluate raw video with the current text-oriented interface. Preserve speaker meaning, trim handles, media rights, synchronization and project revisions. Editing speed depends on preprocessing, API coverage, project complexity and rendering; a quick classifier does not establish a fast complete video workflow.

## Build an adapter

Use the [architecture](architecture.md) and [security boundaries](security.md) as an implementation contract. Add a scoped observation method, authoritative gate computation, a preview, revision-checked execution and outcome verification. Test those with service-specific fixtures and a controlled integration environment. Promote an integration's maturity only after that evidence exists; a recipe and a URL are not a connector.
