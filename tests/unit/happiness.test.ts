import { describe, it, expect } from "vitest";
import { getWeekStart } from "../../src/lib/queries/happiness";

// getWeekStart finds Monday of the current week
// This is used as a unique ID for each week
describe("getWeekStart", () => {
  // All days in same week should return same Monday
  it("returns same Monday for all days in same week", () => {
    // Week of Monday Jan 12
    const tuesday = getWeekStart(new Date("2026-01-13"));
    const thursday = getWeekStart(new Date("2026-01-15"));
    const sunday = getWeekStart(new Date("2026-01-18"));

    // All should return Monday Jan 12
    expect(tuesday.getDate()).toBe(12);
    expect(thursday.getDate()).toBe(12);
    expect(sunday.getDate()).toBe(12);
  });

  // Time should be midnight for consistent comparison
  it("sets time to midnight", () => {
    const result = getWeekStart(new Date("2026-01-15T14:30:45"));

    expect(result.getHours()).toBe(0);
    expect(result.getMinutes()).toBe(0);
  });

  // Different weeks should have different Mondays
  it("returns different Mondays for different weeks", () => {
    const week1 = getWeekStart(new Date("2026-01-13")); // Week of Jan 12
    const week2 = getWeekStart(new Date("2026-01-20")); // Week of Jan 19

    expect(week1.getDate()).toBe(12);
    expect(week2.getDate()).toBe(19);
  });
});

// Score conversion tests
describe("Happiness score conversion", () => {
  // Convert 0.5-5.0 to 1-10
  it("converts from 0.5-5.0 scale to 1-10 scale", () => {
    expect(Math.round(0.5 * 2)).toBe(1);
    expect(Math.round(2.5 * 2)).toBe(5);
    expect(Math.round(5.0 * 2)).toBe(10);
  });

  // Convert 1-10 back to 0.5-5.0
  it("converts from 1-10 scale to 0.5-5.0 scale", () => {
    expect(1 / 2).toBe(0.5);
    expect(5 / 2).toBe(2.5);
    expect(10 / 2).toBe(5.0);
  });
});

// Team average tests
describe("Team happiness average", () => {
  // Normal week
  it("calculates team weekly average", () => {
    const scores = [4, 5, 3, 5, 4]; // 5 people, 1-10 scale
    const total = scores.reduce((sum, s) => sum + s / 2, 0);
    const average = total / scores.length;

    expect(average).toBeCloseTo(2.1, 1);
  });

  // Happy week
  it("calculates high happiness average", () => {
    const scores = [10, 9, 10, 9, 10];
    const total = scores.reduce((sum, s) => sum + s / 2, 0);
    const average = total / scores.length;

    expect(average).toBeCloseTo(4.8, 1);
  });

  // Low happiness
  it("calculates low happiness average", () => {
    const scores = [2, 3, 2, 4, 3];
    const total = scores.reduce((sum, s) => sum + s / 2, 0);
    const average = total / scores.length;

    expect(average).toBeCloseTo(1.4, 1);
  });
});
