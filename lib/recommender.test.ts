import { describe, it, expect } from "vitest";
import { recommendPath } from "./recommender";
import { getCatalog } from "./catalog";
import type { UserProfile } from "./types";

describe("recommendPath", () => {
  const catalog = getCatalog();

  it("returns prerequisites before their dependents", () => {
    const profile: UserProfile = {
      role: "developer",
      goal: "build-agents",
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
      goal: "build-with-api",
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
      goal: "build-agents",
      experience: "beginner",
      timeBudgetMinutes: 9999,
    };
    const path = recommendPath(profile, catalog);
    const advanced = path.courses.filter((c) => c.level === "advanced");
    expect(advanced.length).toBe(0);
  });

  it("recommends ai-fluency for general/business users", () => {
    const profile: UserProfile = {
      role: "business-user",
      goal: "use-claude-day-to-day",
      experience: "beginner",
      timeBudgetMinutes: 120,
    };
    const path = recommendPath(profile, catalog);
    expect(path.courses.some((c) => c.id === "ai-fluency")).toBe(true);
  });

  it("prefers claude-code course when goal is ship-claude-code", () => {
    const profile: UserProfile = {
      role: "developer",
      goal: "ship-claude-code",
      experience: "beginner",
      timeBudgetMinutes: 120,
    };
    const path = recommendPath(profile, catalog);
    expect(path.courses[0]?.id).toBe("claude-code");
  });
});
