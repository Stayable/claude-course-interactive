import type { Catalog, Course, Goal, Topic, UserProfile } from "./types";

const GOAL_TOPIC_AFFINITY: Record<Goal, Topic[]> = {
  "use-claude-day-to-day": ["ai-fluency", "prompting"],
  "build-with-api": ["api", "prompting", "tool-use"],
  "build-agents": ["agents", "tool-use", "mcp", "prompting"],
  "ship-claude-code": ["claude-code", "prompting"],
  "evaluate-and-deploy": ["evals", "prompting", "api"],
};

const LEVEL_RANK: Record<Course["level"], number> = {
  beginner: 0,
  intermediate: 1,
  advanced: 2,
};

function audienceMatches(course: Course, profile: UserProfile): boolean {
  if (course.audience.includes("general")) return true;
  return course.audience.includes(profile.role);
}

function levelAllowed(course: Course, profile: UserProfile): boolean {
  return LEVEL_RANK[course.level] <= LEVEL_RANK[profile.experience] + 1;
}

function affinityScore(course: Course, profile: UserProfile): number {
  const affinityTopics = GOAL_TOPIC_AFFINITY[profile.goal] ?? [];
  let score = 0;
  for (const t of course.topics) {
    const idx = affinityTopics.indexOf(t);
    if (idx >= 0) score += affinityTopics.length - idx;
  }
  if (audienceMatches(course, profile)) score += 1;
  return score;
}

function topoSort(courses: Course[]): Course[] {
  const byId = new Map(courses.map((c) => [c.id, c]));
  const visited = new Set<string>();
  const out: Course[] = [];

  function visit(id: string) {
    if (visited.has(id)) return;
    const c = byId.get(id);
    if (!c) return;
    visited.add(id);
    for (const prereq of c.prerequisites) {
      if (byId.has(prereq)) visit(prereq);
    }
    out.push(c);
  }

  for (const c of courses) visit(c.id);
  return out;
}

export interface RecommendedPath {
  courses: Course[];
  totalMinutes: number;
  rationale: string;
}

export function recommendPath(
  profile: UserProfile,
  catalog: Catalog,
): RecommendedPath {
  const eligible = catalog.courses.filter(
    (c) => audienceMatches(c, profile) && levelAllowed(c, profile),
  );

  const scored = eligible
    .map((c) => ({ course: c, score: affinityScore(c, profile) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);

  const picked: Course[] = [];
  const pickedIds = new Set<string>();
  let mins = 0;

  for (const { course } of scored) {
    if (mins + course.durationMinutes > profile.timeBudgetMinutes && picked.length > 0) {
      continue;
    }
    if (pickedIds.has(course.id)) continue;
    picked.push(course);
    pickedIds.add(course.id);
    mins += course.durationMinutes;
    for (const prereq of course.prerequisites) {
      const p = catalog.courses.find((c) => c.id === prereq);
      if (p && !pickedIds.has(p.id)) {
        picked.push(p);
        pickedIds.add(p.id);
        mins += p.durationMinutes;
      }
    }
  }

  const ordered = topoSort(picked);

  return {
    courses: ordered,
    totalMinutes: ordered.reduce((s, c) => s + c.durationMinutes, 0),
    rationale: buildRationale(profile, ordered),
  };
}

function buildRationale(profile: UserProfile, courses: Course[]): string {
  if (courses.length === 0) {
    return "No course in the catalog matches your profile yet. Try widening your time budget or experience level.";
  }
  const goalText: Record<Goal, string> = {
    "use-claude-day-to-day": "use Claude effectively day to day",
    "build-with-api": "build with the Claude API",
    "build-agents": "build agents with Claude",
    "ship-claude-code": "ship code with Claude Code",
    "evaluate-and-deploy": "evaluate and deploy Claude in production",
  };
  return `Based on your goal to ${goalText[profile.goal]} as a ${profile.role} at the ${profile.experience} level, this path covers prerequisites first and builds toward your goal.`;
}
