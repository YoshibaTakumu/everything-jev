import assert from "node:assert/strict";
import { test } from "node:test";
import {
  JevApiError,
  JevClient,
  fixtureFor,
  getRecipe,
  requestFor,
} from "../dist/index.js";

const recipe = getRecipe("note-tagging");
const request = requestFor(recipe);
const fixture = fixtureFor(recipe);

test("client sends exact protocol and returns a validated response", async () => {
  let calls = 0;
  const client = new JevClient({
    apiKey: "fixture-secret",
    fetch: async (url, init) => {
      calls++;
      assert.equal(url, "https://api.typesafe.ai/v1/systemone");
      assert.equal(init.method, "POST");
      assert.equal(init.redirect, "error");
      assert.equal(init.headers.Authorization, "Bearer fixture-secret");
      assert.deepEqual(JSON.parse(init.body), request);
      assert.ok(init.signal instanceof AbortSignal);
      return Response.json(fixture);
    },
  });
  assert.deepEqual(await client.evaluate(request), fixture);
  assert.equal(calls, 1);
  assert.equal(JSON.stringify(client), "{}");
});

for (const status of [401, 422, 429, 529])
  test(`HTTP ${status} is sanitized and not automatically retried`, async () => {
    let calls = 0;
    const client = new JevClient({
      apiKey: "fixture-secret",
      fetch: async () => {
        calls++;
        return new Response("private server body fixture-secret", { status });
      },
    });
    await assert.rejects(
      client.evaluate(request),
      (error) =>
        error instanceof JevApiError &&
        error.status === status &&
        !error.message.includes("fixture-secret") &&
        !error.message.includes("private server"),
    );
    assert.equal(calls, 1);
  });

test("malformed and oversized bodies cannot reach consumers", async () => {
  for (const response of [
    new Response("not JSON"),
    Response.json({ answers: {} }),
    new Response("x".repeat(2 * 1024 * 1024 + 1)),
  ]) {
    const client = new JevClient({
      apiKey: "test",
      fetch: async () => response,
    });
    await assert.rejects(client.evaluate(request));
  }
});

test("invalid requests fail before network I/O", async () => {
  let calls = 0;
  const client = new JevClient({
    apiKey: "test",
    fetch: async () => {
      calls++;
      return Response.json(fixture);
    },
  });
  await assert.rejects(client.evaluate({ ...request, questions: {} }));
  await assert.rejects(
    client.evaluate({ ...request, state: "x".repeat(2 * 1024 * 1024) }),
  );
  assert.equal(calls, 0);
});

test("network errors never echo transport internals or credentials", async () => {
  const client = new JevClient({
    apiKey: "fixture-secret",
    fetch: async () => {
      throw new Error("Bearer fixture-secret internal-host");
    },
  });
  await assert.rejects(
    client.evaluate(request),
    (error) =>
      error.message === "Jev network request failed; no action was executed",
  );
});

test("caller cancellation is honored", async () => {
  const controller = new AbortController();
  controller.abort();
  const client = new JevClient({
    apiKey: "test",
    fetch: async (_, init) => {
      init.signal.throwIfAborted();
      return Response.json(fixture);
    },
  });
  await assert.rejects(
    client.evaluate(request, { signal: controller.signal }),
    /cancelled or timed out/,
  );
});

test("timeout covers waiting for response body", async () => {
  const client = new JevClient({
    apiKey: "test",
    timeoutMs: 10,
    fetch: async (_, init) => {
      return new Response(
        new ReadableStream({
          start(controller) {
            init.signal.addEventListener(
              "abort",
              () => controller.error(new Error("aborted")),
              { once: true },
            );
          },
        }),
      );
    },
  });
  const keepAlive = setTimeout(() => {}, 1000);
  try {
    await assert.rejects(client.evaluate(request), /cancelled or timed out/);
  } finally {
    clearTimeout(keepAlive);
  }
});

test("client requires a key and bounded timeout", () => {
  assert.throws(() => new JevClient({}), /TYPESAFE_API_KEY is required/);
  assert.throws(() => new JevClient({ apiKey: " " }));
  assert.throws(() => new JevClient({ apiKey: "test", timeoutMs: NaN }));
});
