import { describe, it, expect } from "vitest";
import { isActive, getGreeting } from "../../src/lib/utils";

// Helper for active menu item tests
describe("isActive", () => {
  it("returns true for exact match on root path", () => {
    expect(isActive("/", "/")).toBe(true);
  });

  it("returns false for non-root paths when checking root", () => {
    expect(isActive("/home", "/")).toBe(false);
  });

  it("returns true for exact match", () => {
    expect(isActive("/home", "/home")).toBe(true);
  });

  it("returns true for nested paths", () => {
    expect(isActive("/home/profile", "/home")).toBe(true);
  });

  it("returns false for different paths", () => {
    expect(isActive("/teams", "/home")).toBe(false);
  });

  it("does not match partial path names", () => {
    expect(isActive("/homestead", "/home")).toBe(false);
  });
});

// Get time-based greeting tests
describe("getGreeting", () => {
  it("returns 'Good morning' between 5:00 and 11:59", () => {
    expect(getGreeting(new Date("2026-01-18T05:00:00"))).toBe("Good morning");
    expect(getGreeting(new Date("2026-01-18T11:59:59"))).toBe("Good morning");
  });

  it("returns 'Good afternoon' between 12:00 and 17:59", () => {
    expect(getGreeting(new Date("2026-01-18T12:00:00"))).toBe("Good afternoon");
    expect(getGreeting(new Date("2026-01-18T17:59:59"))).toBe("Good afternoon");
  });

  it("returns 'Good evening' between 18:00 and 4:59", () => {
    expect(getGreeting(new Date("2026-01-18T18:00:00"))).toBe("Good evening");
    expect(getGreeting(new Date("2026-01-18T23:59:59"))).toBe("Good evening");
    expect(getGreeting(new Date("2026-01-18T00:00:00"))).toBe("Good evening");
    expect(getGreeting(new Date("2026-01-18T04:59:59"))).toBe("Good evening");
  });

  it("uses current time when no date is provided", () => {
    // This just verifies it doesn't throw
    const greeting = getGreeting();
    expect(["Good morning", "Good afternoon", "Good evening"]).toContain(
      greeting
    );
  });
});
