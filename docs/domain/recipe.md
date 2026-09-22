---
id: recipe
title: Recipe
status: implemented
updated: 2026-09-22
---

# Recipe

## Definition and vocabulary

A recipe is an executable example of a bounded decision: a rubric, candidate descriptions, a concern question, gate names and fictional input. A **sample** is the default input state. A **fixture** is a hand-authored response used to exercise local wiring; it is not a provider result.

## Relationships

- `requestFor()` converts a recipe into the request defined by the [API contract](../api.md).
- Gate names identify application facts required by the [decision policy](decision.md); declaring a name does not obtain or verify that fact.
- The [cookbook](../cookbook.md) owns use-case guidance and adapter requirements. The [integration inventory](../tech-stack/integrations.md) owns adoption status.

## Implementation and data

[src/recipes.ts](../../src/recipes.ts) owns `Recipe`, the catalog, `getRecipe()`, `requestFor()` and `fixtureFor()`. Fields, candidate IDs and sample contents belong there. The default model is owned by [src/types.ts](../../src/types.ts).

## Rules and outcomes

- `getRecipe()` throws for an unknown ID and returns an isolated clone for a known ID. Catalog IDs must be unique; the catalog test enforces this.
- `requestFor()` builds a route Choice with the recipe's options and an explicit `no_match` candidate, plus a concern Noul. Recipes with a score rubric also produce a quality Score question.
- Replacing state changes the information to evaluate, not the declared rubric or candidate set. Callers needing different candidates construct a custom recipe/request; [Client and CLI](../api.md) owns the CLI-specific behavior.
- `fixtureFor()` builds a simulated response from the fixture choice and rubric. Its model marker identifies fixture data, and token usage is synthetic. It performs no inference or external operation.
- Request/fixture generation does not itself validate arbitrary custom recipes. Use the exported request/response validators; built-in catalog checks exercise those contracts for each recipe.

## Boundaries and verification

[test/core.test.mjs](../../test/core.test.mjs) validates each catalog request/fixture, checks its suggested candidate with simulated gates, verifies missing gates require review, and checks ID uniqueness and clone isolation. [test/cli.test.mjs](../../test/cli.test.mjs) covers command behavior. An executable recipe does not establish a working platform connector or measured inference quality.

For additions, follow [recipe contribution rules](../../CONTRIBUTING.md#recipes), update the cookbook and keep public README scope consistent. Samples remain fictional.

## Open questions

None for the current recipe contract. Per-platform executors remain application integration work.
