/** Buckets completed-game scores into ranges for export and charts. */
export function buildScoreDistributionFromScores(
  scores: number[]
): Array<{ range: string; count: number }> {
  if (scores.length === 0) return [];
  const minScore = Math.min(...scores);
  const maxScore = Math.max(...scores);
  if (minScore === maxScore) {
    return [{ range: `${minScore}`, count: scores.length }];
  }
  const spread = maxScore - minScore;
  const approxBucketSize = spread <= 20 ? 5 : spread <= 50 ? 10 : 20;
  const bucketSize = Math.max(1, approxBucketSize);
  const bucketMin = Math.floor(minScore / bucketSize) * bucketSize;
  const bucketMax = Math.ceil(maxScore / bucketSize) * bucketSize;
  const buckets: { min: number; max: number; label: string }[] = [];
  for (let start = bucketMin; start <= bucketMax; start += bucketSize) {
    const end = start + bucketSize - 1;
    buckets.push({
      min: start,
      max: end,
      label: `${start}-${end}`,
    });
  }
  return buckets.map((range) => ({
    range: range.label,
    count: scores.filter((s) => s >= range.min && s <= range.max).length,
  }));
}
