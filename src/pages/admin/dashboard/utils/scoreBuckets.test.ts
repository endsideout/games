import { describe, it, expect } from "vitest";
import { buildScoreDistributionFromScores } from "./scoreBuckets";

describe("buildScoreDistributionFromScores", () => {
  it("returns empty for no scores", () => {
    expect(buildScoreDistributionFromScores([])).toEqual([]);
  });

  it("single-value spread uses one bucket labeled as that score", () => {
    expect(buildScoreDistributionFromScores([5, 5, 5])).toEqual([{ range: "5", count: 3 }]);
  });

  it("uses bucket size 5 when spread <= 20", () => {
    const out = buildScoreDistributionFromScores([0, 20]);
    expect(out.some((b) => b.count > 0)).toBe(true);
    expect(out.reduce((s, b) => s + b.count, 0)).toBe(2);
  });

  it("uses bucket size 10 when spread between 21 and 50", () => {
    const out = buildScoreDistributionFromScores([0, 30]);
    expect(out.reduce((s, b) => s + b.count, 0)).toBe(2);
  });

  it("uses bucket size 20 when spread > 50", () => {
    const out = buildScoreDistributionFromScores([0, 60]);
    expect(out.reduce((s, b) => s + b.count, 0)).toBe(2);
  });
});
