import type { EvaluationRequest, EvaluationResponse } from "./types.js";
import { validateRequest, validateResponse } from "./validation.js";

const ENDPOINT = "https://api.typesafe.ai/v1/systemone";
const MAX_BYTES = 2 * 1024 * 1024;

export class JevApiError extends Error {
  readonly status: number | undefined;
  constructor(message: string, status?: number) {
    super(message);
    this.name = "JevApiError";
    this.status = status;
  }
}

export interface ClientOptions {
  apiKey: string;
  timeoutMs?: number;
  fetch?: typeof globalThis.fetch;
}

export class JevClient {
  readonly #apiKey: string;
  readonly #timeoutMs: number;
  readonly #fetch: typeof globalThis.fetch;

  constructor(options: ClientOptions) {
    if (!options.apiKey.trim())
      throw new JevApiError("TYPESAFE_API_KEY is required for live evaluation");
    this.#apiKey = options.apiKey;
    this.#timeoutMs = options.timeoutMs ?? 15_000;
    if (!Number.isSafeInteger(this.#timeoutMs) || this.#timeoutMs <= 0)
      throw new JevApiError("timeoutMs must be a positive integer");
    this.#fetch = options.fetch ?? globalThis.fetch;
  }

  async evaluate(
    request: EvaluationRequest,
    options: { signal?: AbortSignal } = {},
  ): Promise<EvaluationResponse> {
    validateRequest(request);
    const body = JSON.stringify(request);
    if (new TextEncoder().encode(body).byteLength > MAX_BYTES)
      throw new JevApiError("Request exceeds local 2 MiB limit; reduce state");
    const signals = [AbortSignal.timeout(this.#timeoutMs)];
    if (options.signal) signals.push(options.signal);
    const signal = AbortSignal.any(signals);
    try {
      const response = await this.#fetch(ENDPOINT, {
        method: "POST",
        redirect: "error",
        signal,
        headers: {
          Authorization: `Bearer ${this.#apiKey}`,
          "Content-Type": "application/json",
        },
        body,
      });
      if (!response.ok) {
        await response.body?.cancel();
        throw new JevApiError(
          `Jev HTTP ${response.status}; no action was executed`,
          response.status,
        );
      }
      if (!response.body) throw new JevApiError("Jev returned an empty body");
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let bytes = 0;
      let raw = "";
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          bytes += value.byteLength;
          if (bytes > MAX_BYTES) {
            await reader.cancel();
            throw new JevApiError("Response exceeds local 2 MiB limit");
          }
          raw += decoder.decode(value, { stream: true });
        }
        raw += decoder.decode();
      } finally {
        reader.releaseLock();
      }
      let data: unknown;
      try {
        data = JSON.parse(raw);
      } catch {
        throw new JevApiError("Jev returned invalid JSON");
      }
      validateResponse(data, request);
      return data;
    } catch (error) {
      if (signal.aborted)
        throw new JevApiError("Jev evaluation cancelled or timed out");
      if (
        error instanceof JevApiError ||
        (error instanceof Error && error.name === "ValidationError")
      )
        throw error;
      throw new JevApiError(
        "Jev network request failed; no action was executed",
      );
    }
  }
}
