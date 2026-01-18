import { describe, it, expect } from "vitest";
import {
  calculateDistribution,
  calculateAverage,
} from "../../src/lib/queries/responses";

// Survey distribution calculation tests
describe("calculateDistribution", () => {
  // Mostly positive employee feedback
  it("calculates distribution for positive employee satisfaction", () => {
    // 10 employees: mostly 4s and 5s
    const ratings = [5, 4, 5, 3, 5, 4, 5, 4, 5, 3];
    const result = calculateDistribution(ratings);

    expect(result[2]).toEqual({ rating: 3, count: 2, percentage: 20 });
    expect(result[3]).toEqual({ rating: 4, count: 3, percentage: 30 });
    expect(result[4]).toEqual({ rating: 5, count: 5, percentage: 50 });
  });

  // No responses yet
  it("handles survey with no responses", () => {
    const result = calculateDistribution([]);

    result.forEach((item) => {
      expect(item.count).toBe(0);
      expect(item.percentage).toBe(0);
    });
  });

  // Everyone gave the same rating
  it("handles unanimous responses", () => {
    const ratings = [5, 5, 5, 5];
    const result = calculateDistribution(ratings);

    expect(result[4]).toEqual({ rating: 5, count: 4, percentage: 100 });
  });
});

// Survey average calculation tests
describe("calculateAverage", () => {
  // High satisfaction
  it("calculates average for high satisfaction", () => {
    const ratings = [5, 5, 4, 5, 4]; // Average: 4.6
    expect(calculateAverage(ratings)).toBe(4.6);
  });

  // Low satisfaction
  it("calculates average for low satisfaction", () => {
    const ratings = [2, 1, 2, 3, 2]; // Average: 2.0
    expect(calculateAverage(ratings)).toBe(2);
  });

  // No responses
  it("returns 0 for empty array", () => {
    expect(calculateAverage([])).toBe(0);
  });
});

// Real survey scenario
describe("Complete survey analysis", () => {
  it("analyzes quarterly employee satisfaction survey", () => {
    // 15 employees responded
    const ratings = [5, 4, 5, 3, 4, 5, 4, 5, 4, 3, 5, 4, 5, 4, 4];

    const distribution = calculateDistribution(ratings);
    const average = calculateAverage(ratings);

    expect(distribution[2].count).toBe(2); // 2 gave rating 3
    expect(distribution[3].count).toBe(7); // 7 gave rating 4
    expect(distribution[4].count).toBe(6); // 6 gave rating 5
    expect(average).toBeCloseTo(4.27, 2); // Mostly positive
  });
});
