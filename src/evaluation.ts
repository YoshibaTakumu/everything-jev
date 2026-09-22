export interface LabelledDecision {
  id: string;
  expected: boolean;
  predicted: boolean | null;
}

export function binaryMetrics(rows: readonly LabelledDecision[]) {
  const counts = {
    truePositive: 0,
    falsePositive: 0,
    trueNegative: 0,
    falseNegative: 0,
    reviewPositive: 0,
    reviewNegative: 0,
  };
  const seen = new Set<string>();
  for (const row of rows) {
    if (!row.id || seen.has(row.id))
      throw new Error("Evaluation IDs must be nonempty and unique");
    seen.add(row.id);
    if (
      typeof row.expected !== "boolean" ||
      !(typeof row.predicted === "boolean" || row.predicted === null)
    )
      throw new Error(
        "Evaluation labels must be boolean; null prediction means review",
      );
    if (row.predicted === null)
      row.expected ? counts.reviewPositive++ : counts.reviewNegative++;
    else if (row.predicted)
      row.expected ? counts.truePositive++ : counts.falsePositive++;
    else row.expected ? counts.falseNegative++ : counts.trueNegative++;
  }
  const ratio = (numerator: number, denominator: number) =>
    denominator === 0 ? null : numerator / denominator;
  const answered = rows.length - counts.reviewPositive - counts.reviewNegative;
  return {
    total: rows.length,
    ...counts,
    coverage: ratio(answered, rows.length),
    reviewRate: ratio(rows.length - answered, rows.length),
    precision: ratio(
      counts.truePositive,
      counts.truePositive + counts.falsePositive,
    ),
    recall: ratio(
      counts.truePositive,
      counts.truePositive + counts.falseNegative + counts.reviewPositive,
    ),
    falsePositiveRate: ratio(
      counts.falsePositive,
      counts.falsePositive + counts.trueNegative + counts.reviewNegative,
    ),
    selectiveAccuracy: ratio(
      counts.truePositive + counts.trueNegative,
      answered,
    ),
  };
}
