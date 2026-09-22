import type { EvaluationRequest, EvaluationResponse } from "./types.js";

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

function requireThat(condition: unknown, message: string): asserts condition {
  if (!condition) throw new ValidationError(message);
}

function record(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    (Object.getPrototypeOf(value) === Object.prototype ||
      Object.getPrototypeOf(value) === null)
  );
}

function json(
  value: unknown,
  path: string,
  parents = new Set<unknown>(),
  depth = 0,
): void {
  requireThat(depth <= 64, `${path}: nesting exceeds 64 levels`);
  if (value === null || typeof value === "string" || typeof value === "boolean")
    return;
  if (typeof value === "number") {
    requireThat(Number.isFinite(value), `${path}: number must be finite`);
    return;
  }
  requireThat(
    Array.isArray(value) || record(value),
    `${path}: expected JSON data`,
  );
  requireThat(!parents.has(value), `${path}: cyclic data`);
  parents.add(value);
  for (const [key, child] of Object.entries(value)) {
    requireThat(
      !["__proto__", "constructor", "prototype"].includes(key),
      `${path}: unsafe key`,
    );
    json(child, `${path}.${key}`, parents, depth + 1);
  }
  if (Array.isArray(value))
    requireThat(
      Object.keys(value).length === value.length,
      `${path}: sparse array`,
    );
  parents.delete(value);
}

function content(value: unknown, path: string): void {
  requireThat(
    typeof value === "string" || Array.isArray(value) || record(value),
    `${path}: expected string, object, or array`,
  );
  json(value, path);
}

function sameKeys(
  actual: Record<string, unknown>,
  expected: string[],
  path: string,
): void {
  requireThat(
    Object.keys(actual).length === expected.length &&
      expected.every((key) => Object.hasOwn(actual, key)),
    `${path}: keys must match the request`,
  );
}

function probability(value: unknown, path: string): asserts value is number {
  requireThat(
    typeof value === "number" &&
      Number.isFinite(value) &&
      value >= 0 &&
      value <= 1,
    `${path}: expected finite probability in [0, 1]`,
  );
}

function distribution(
  value: unknown,
  keys: string[],
  path: string,
): asserts value is Record<string, number> {
  requireThat(record(value), `${path}: expected probability map`);
  sameKeys(value, keys, path);
  let sum = 0;
  for (const entry of Object.values(value)) {
    probability(entry, path);
    sum += entry;
  }
  requireThat(
    Math.abs(sum - 1) <= 0.001,
    `${path}: probabilities must sum to 1`,
  );
}

export function validateRequest(
  value: unknown,
): asserts value is EvaluationRequest {
  requireThat(record(value), "request: expected object");
  requireThat(
    typeof value.model === "string" && value.model.trim().length > 0,
    "model: required",
  );
  content(value.state, "state");
  requireThat(
    record(value.questions) && Object.keys(value.questions).length > 0,
    "questions: expected nonempty map",
  );
  json(value.questions, "questions");
  for (const [id, q] of Object.entries(value.questions)) {
    requireThat(id.length > 0 && record(q), "question: expected named object");
    content(q.instructions, `${id}.instructions`);
    if (q.type === "noul") {
      if (q.criteria !== undefined) {
        requireThat(record(q.criteria), `${id}.criteria: expected object`);
        sameKeys(q.criteria, ["true", "false"], `${id}.criteria`);
        content(q.criteria.true, `${id}.criteria.true`);
        content(q.criteria.false, `${id}.criteria.false`);
      }
    } else if (q.type === "choice") {
      requireThat(record(q.criteria), `${id}.criteria: expected choice map`);
      const options = Object.entries(q.criteria);
      requireThat(
        options.length >= 1 && options.length <= 255,
        `${id}: Choice needs 1..255 options`,
      );
      for (const [key, option] of options) {
        requireThat(key.length > 0, `${id}: empty option`);
        if (option !== null) content(option, `${id}.criteria.${key}`);
      }
    } else if (q.type === "score") {
      requireThat(
        Array.isArray(q.criteria) &&
          q.criteria.length >= 2 &&
          q.criteria.length <= 10,
        `${id}: Score needs 2..10 levels`,
      );
      q.criteria.forEach((level, index) =>
        content(level, `${id}.criteria.${index}`),
      );
    } else throw new ValidationError(`${id}: unknown question type`);
  }
}

export function validateResponse(
  value: unknown,
  request: EvaluationRequest,
): asserts value is EvaluationResponse {
  validateRequest(request);
  requireThat(record(value), "response: expected object");
  requireThat(
    typeof value.model === "string" && value.model.length > 0,
    "response.model: required",
  );
  requireThat(record(value.answers), "answers: expected map");
  sameKeys(value.answers, Object.keys(request.questions), "answers");
  for (const [id, q] of Object.entries(request.questions)) {
    const a = value.answers[id];
    requireThat(record(a) && a.type === q.type, `${id}: answer type mismatch`);
    if (q.type === "noul") probability(a.noul, `${id}.noul`);
    else {
      probability(a.confidence, `${id}.confidence`);
      const keys =
        q.type === "choice"
          ? Object.keys(q.criteria)
          : q.criteria.map((_, i) => String(i));
      distribution(a.probabilities, keys, `${id}.probabilities`);
      const probabilities = a.probabilities;
      if (q.type === "choice") {
        requireThat(
          typeof a.choice === "string" && Object.hasOwn(q.criteria, a.choice),
          `${id}: unknown choice`,
        );
        const chosen = a.probabilities[a.choice]!;
        requireThat(
          Object.values(a.probabilities).every((p) => p <= chosen + 0.000001),
          `${id}: choice must have maximum probability`,
        );
      } else {
        requireThat(
          typeof a.score === "number" &&
            Number.isFinite(a.score) &&
            a.score >= 0 &&
            a.score <= keys.length - 1,
          `${id}: score outside rubric`,
        );
        const expected = keys.reduce(
          (total, key) => total + Number(key) * probabilities[key]!,
          0,
        );
        requireThat(
          Math.abs(a.score - expected) <= 0.001,
          `${id}: score inconsistent with probabilities`,
        );
        requireThat(record(a.legend), `${id}: missing legend`);
        sameKeys(a.legend, keys, `${id}.legend`);
        requireThat(
          Object.values(a.legend).every((entry) => typeof entry === "string"),
          `${id}: invalid legend`,
        );
      }
    }
  }
  requireThat(record(value.usage), "usage: expected object");
  for (const key of ["input_tokens", "output_tokens"]) {
    const n = value.usage[key];
    requireThat(
      typeof n === "number" && Number.isSafeInteger(n) && n >= 0,
      `usage.${key}: expected nonnegative integer`,
    );
  }
}
