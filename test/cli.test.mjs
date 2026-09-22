import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { test } from "vitest";
import { recipes } from "../dist/index.js";

const run = (...args) =>
  spawnSync(process.execPath, ["dist/cli.js", ...args], {
    encoding: "utf8",
    env: { PATH: process.env.PATH, TYPESAFE_API_KEY: "" },
  });

test("all CLI demos run offline with explicit provenance and no execution", () => {
  const result = run("demo", "all");
  assert.equal(result.status, 0, result.stderr);
  const data = JSON.parse(result.stdout);
  assert.equal(data.length, recipes.length);
  for (const item of data) {
    assert.equal(item.mode, "offline-fixture");
    assert.equal(item.response.usage.input_tokens, 0);
    assert.equal(item.decision.executed, false);
  }
});

test("CLI lists recipes and prints inspectable requests", () => {
  assert.equal(JSON.parse(run("list").stdout).length, recipes.length);
  assert.equal(
    JSON.parse(run("inspect", "accounting").stdout).questions.route.type,
    "choice",
  );
});

test("CLI never accidentally activates live mode", () => {
  assert.equal(
    run("evaluate", "contact-filter", "--input", "examples/contact.json")
      .status,
    1,
  );
  const live = run(
    "evaluate",
    "contact-filter",
    "--input",
    "examples/contact.json",
    "--live",
  );
  assert.equal(live.status, 1);
  assert.match(live.stderr, /TYPESAFE_API_KEY is required/);
  assert.equal(run("demo", "not-a-recipe").status, 1);
  assert.equal(run("demo", "all", "--live").status, 1);
});

test("CLI metrics makes abstention visible", () => {
  const result = run("metrics", "examples/labels.json");
  assert.equal(result.status, 0, result.stderr);
  assert.equal(JSON.parse(result.stdout).coverage, 0.75);
});
