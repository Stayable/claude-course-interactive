import { describe, it, expect } from "vitest";
import { recommendPath } from "./recommender";
import { getCatalog } from "./catalog";
import type { UserProfile } from "./types";

describe("recommendPath", () => {
  const catalog = getCatalog();

  it("returns prerequisites before their dependents", () => {
    const profile: UserProfile = {
      role: "developer",
      goal: "learn-mcp",
      experience: "intermediate",
      timeBudgetMinutes: 600,
    };
    const path = recommendPath(profile, catalog);
    const ids = path.courses.map((c) => c.id);
    for (const c of path.courses) {
      for (const prereq of c.prerequisites) {
        if (ids.includes(prereq)) {
          expect(ids.indexOf(prereq)).toBeLessThan(ids.indexOf(c.id));
        }
      }
    }
  });

  it("respects the time budget for low budgets", () => {
    const profile: UserProfile = {
      role: "developer",
      goal: "ship-with-claude-code",
      experience: "beginner",
      timeBudgetMinutes: 90,
    };
    const path = recommendPath(profile, catalog);
    expect(path.totalMinutes).toBeLessThanOrEqual(120);
    expect(path.courses.length).toBeGreaterThan(0);
  });

  it("filters out advanced courses for beginners by more than one level", () => {
    const profile: UserProfile = {
      role: "developer",
      goal: "learn-mcp",
      experience: "beginner",
      timeBudgetMinutes: 9999,
    };
    const path = recommendPath(profile, catalog);
    const advanced = path.courses.filter((c) => c.level === "advanced");
    expect(advanced.length).toBe(0);
  });

  it("recommends Claude 101 / AI Fluency for general users wanting day-to-day usage", () => {
    const profile: UserProfile = {
      role: "general",
      goal: "use-claude-day-to-day",
      experience: "beginner",
      timeBudgetMinutes: 180,
    };
    const path = recommendPath(profile, catalog);
    const ids = path.courses.map((c) => c.id);
    expect(ids).toContain("claude-101");
    expect(ids.some((id) => id.startsWith("ai-fluency") || id === "ai-capabilities-and-limitations")).toBe(true);
  });

  it("puts claude-code-101 first when goal is ship-with-claude-code", () => {
    const profile: UserProfile = {
      role: "developer",
      goal: "ship-with-claude-code",
      experience: "beginner",
      timeBudgetMinutes: 120,
    };
    const path = recommendPath(profile, catalog);
    const codeIdx = path.courses.findIndex((c) => c.id === "claude-code-101");
    expect(codeIdx).toBeGreaterThanOrEqual(0);
    // Any other Claude Code course in the path must come after claude-code-101
    const otherCodeIdxs = path.courses
      .map((c, i) => ({ id: c.id, i }))
      .filter((x) => x.id !== "claude-code-101" && x.id.startsWith("claude-code"));
    for (const { i } of otherCodeIdxs) {
      expect(codeIdx).toBeLessThan(i);
    }
  });
});
