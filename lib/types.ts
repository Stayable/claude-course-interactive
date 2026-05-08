export type Audience =
  | "developer"
  | "technical-builder"
  | "business-user"
  | "admin"
  | "general";

export type Level = "beginner" | "intermediate" | "advanced";

export type Topic =
  | "prompting"
  | "tool-use"
  | "mcp"
  | "agents"
  | "claude-code"
  | "evals"
  | "api"
  | "ai-fluency";

export interface Course {
  id: string;
  title: string;
  url: string;
  audience: Audience[];
  level: Level;
  durationMinutes: number;
  topics: Topic[];
  prerequisites: string[];
  summary: string;
  learningObjectives: string[];
  status?: "verified" | "unverified" | "draft";
}

export interface Catalog {
  lastSynced: string;
  sourceNote: string;
  courses: Course[];
}

export type Goal =
  | "use-claude-day-to-day"
  | "build-with-api"
  | "build-agents"
  | "ship-claude-code"
  | "evaluate-and-deploy";

export interface UserProfile {
  role: Audience;
  goal: Goal;
  experience: Level;
  timeBudgetMinutes: number;
}
