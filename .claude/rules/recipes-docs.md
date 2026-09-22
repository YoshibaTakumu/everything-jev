---
paths:
  - "src/recipes.ts"
  - "examples/**/*"
  - "docs/cookbook.md"
  - "docs/domain/recipe.md"
  - "README.md"
  - "README.ja.md"
---

# Recipes and public documentation

- Before adding or changing a recipe, read the [recipe contract](../../docs/domain/recipe.md), the Recipes section of [CONTRIBUTING.md](../../CONTRIBUTING.md) and its entry in [the cookbook](../../docs/cookbook.md). Treat the request, fixture, required gates, tests and cookbook entry as one change; update the domain contract when shared recipe behavior changes.
- When recipe IDs, counts or usage change, update the cookbook and both READMEs together, then exercise the affected offline demo. Keep candidate IDs in the declared request contract rather than expecting arbitrary state fields to redefine them; see [the CLI contract](../../docs/api.md).
- For changes to reported capabilities or evaluation results, check the evidence categories in [evaluation](../../docs/evaluation.md) before updating public claims.
