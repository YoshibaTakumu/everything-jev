# Evaluation

Separate three kinds of evidence:

| Evidence                 | What it establishes                                                      | What it does not establish                   |
| ------------------------ | ------------------------------------------------------------------------ | -------------------------------------------- |
| Unit and CLI tests       | Data contracts, policy branches, graph/scope checks and command behavior | Model quality                                |
| Simulated HTTP tests     | Client serialization, response handling, cancellation and error behavior | Live service compatibility or latency        |
| Live labelled evaluation | Observed task performance on a specified dataset/model/rubric            | Universal accuracy or external-action safety |

This release includes the first two. It does not report a live accuracy benchmark. The fixture generator assigns illustrative values, including confidence; those values are not a reconstruction of Jev's confidence calculation.

## Before changing an automation policy

1. Define the action, false-positive cost, false-negative cost and review capacity.
2. Create human-labelled cases representing the actual language and workload. Separate tenants and time periods where leakage is possible.
3. Include malformed input, prompt injection, ambiguous evidence, missing context, out-of-scope requests and stale observations.
4. Pin the model, prompt/rubric, candidate construction and preprocessing versions.
5. Split tuning and evaluation data. For accounting history or user memory, evaluate against a chronological holdout; future records must not inform earlier decisions.
6. Evaluate errors, abstention, subgroup behavior, latency and cost together. Compare against deterministic rules and a no-model baseline.
7. Run in observation mode and compare decisions to real outcomes. Only connect an executor after its authorization, concurrency, idempotency and recovery behavior are tested.

The model's self-reported confidence is not a calibrated correctness probability. English and Japanese performance should be measured separately. Do not borrow a threshold from a third-party demo and present it as a validated operating point.

## Included binary metrics

```sh
pnpm jev metrics examples/labels.json
```

Each row has `{ "id": "unique-id", "expected": true, "predicted": null }`. Expected labels are booleans; a null prediction means review. The sample file is synthetic and illustrates arithmetic only.

- **Coverage**: non-review decisions / all cases.
- **Review rate**: review decisions / all cases.
- **Precision**: true positives / predicted positives.
- **Recall**: true positives / all actual positives, including reviewed positives.
- **False-positive rate**: false positives / all actual negatives, including reviewed negatives.
- **Selective accuracy**: correct non-review decisions / all non-review decisions.

Undefined ratios return `null`, not a flattering zero or one. Counts include reviewed positives and negatives so readers can reconstruct denominators. Precision on a tiny covered subset is not enough; always publish coverage and recall alongside it. Multiclass routing, ranking, calibration and time-series drift metrics need additional evaluation tooling.

## Reproducible evidence

Store consented or sanitized case IDs, labels, model/rubric version, raw answers, policy outcome and actual downstream results in a scoped evaluation store. Keep real customer content out of public fixtures. Publish dataset provenance and failure analysis with any performance claim. Re-evaluate after model, rubric, candidate-generation or integration changes.
