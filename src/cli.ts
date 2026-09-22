#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import { JevClient } from "./client.js";
import { binaryMetrics, type LabelledDecision } from "./evaluation.js";
import { decide } from "./policy.js";
import { fixtureFor, getRecipe, recipes, requestFor } from "./recipes.js";
import type { Content } from "./types.js";
import { validateRequest } from "./validation.js";

const help = `everything-jev — decisions for automation harnesses

  list                          List all recipe IDs
  inspect <recipe>              Print its sample API request (offline)
  demo <recipe|all>              Run hand-authored response fixtures (offline)
  evaluate <recipe> --input <file.json> --live
                                Send the JSON state to TypeSafe's Jev API
  metrics <labels.json>         Summarize boolean labels (null = review)

Live mode requires TYPESAFE_API_KEY. State is sent to api.typesafe.ai.
Live CLI gates are unverified, so results require review. No actions execute.
Fixtures test wiring and policy, not model quality. See docs/evaluation.md.
`;

const print = (value: unknown) =>
  process.stdout.write(`${JSON.stringify(value, null, 2)}\n`);

async function readJson(path: string): Promise<unknown> {
  const content = await readFile(path, "utf8");
  if (Buffer.byteLength(content) > 2 * 1024 * 1024)
    throw new Error("Input file exceeds 2 MiB");
  try {
    return JSON.parse(content);
  } catch {
    throw new Error("Input file must contain valid JSON");
  }
}

async function main(args: string[]): Promise<void> {
  const [command, id, ...rest] = args;
  if (!command || command === "--help" || command === "help") {
    process.stdout.write(help);
    return;
  }
  if (command === "list" && args.length === 1) {
    print(
      recipes.map(({ id, title }) => ({
        id,
        title,
        status: "decision-recipe; platform-adapter-not-shipped",
      })),
    );
    return;
  }
  if (command === "metrics" && id && args.length === 2) {
    const rows = await readJson(id);
    if (
      !Array.isArray(rows) ||
      rows.some((row) => typeof row !== "object" || row === null)
    )
      throw new Error("Expected an array of labelled decisions");
    print(binaryMetrics(rows as LabelledDecision[]));
    return;
  }
  if (command === "demo" && id && args.length === 2) {
    const chosen = id === "all" ? recipes : [getRecipe(id)];
    print(
      chosen.map((recipe) => {
        const request = requestFor(recipe);
        const response = fixtureFor(recipe);
        const syntheticGates = Object.fromEntries(
          recipe.gates.map((gate) => [gate, "pass" as const]),
        );
        return {
          recipe: recipe.id,
          mode: "offline-fixture",
          notice:
            "Hand-authored answers and synthetic gates; not inference or a benchmark.",
          decision: decide(request, response, syntheticGates, {
            requiredGates: recipe.gates,
          }),
          response,
        };
      }),
    );
    return;
  }
  if (command === "inspect" && id && args.length === 2) {
    print(requestFor(getRecipe(id)));
    return;
  }
  if (
    command === "evaluate" &&
    id &&
    rest.length === 3 &&
    rest[0] === "--input" &&
    rest[1] &&
    rest[2] === "--live"
  ) {
    const recipe = getRecipe(id);
    const state = await readJson(rest[1]);
    const request = requestFor(recipe, state as Content);
    validateRequest(request);
    const client = new JevClient({
      apiKey: process.env.TYPESAFE_API_KEY ?? "",
    });
    const response = await client.evaluate(request);
    print({
      recipe: recipe.id,
      mode: "live",
      decision: decide(request, response, {}, { requiredGates: recipe.gates }),
      response,
    });
    return;
  }
  throw new Error(`Invalid arguments.\n${help}`);
}

main(process.argv.slice(2)).catch((error: unknown) => {
  process.stderr.write(
    `${error instanceof Error ? error.message : "Unexpected error"}\n`,
  );
  process.exitCode = 1;
});
