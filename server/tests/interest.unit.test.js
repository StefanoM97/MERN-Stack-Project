import { calculateReuseScore } from "../src/services/interestService.js";

describe("interest scoring", () => {
  it("returns a bounded score", () => {
    const score = calculateReuseScore({
      ebay: { totalListings: 500, sampleSize: 10 },
      youtube: { totalViews: 1_000_000 },
      internal: {
        matchingItemCount: 10,
        matchingPublicCount: 5,
        matchingSchoolCount: 2,
        searchCount: 20
      }
    });
    expect(score).toBeGreaterThan(0);
    expect(score).toBeLessThanOrEqual(100);
  });

  it("returns zero for no signals", () => {
    expect(calculateReuseScore({
      ebay: null,
      youtube: null,
      internal: { matchingItemCount: 0, matchingPublicCount: 0, matchingSchoolCount: 0, searchCount: 0 }
    })).toBe(0);
  });
});
