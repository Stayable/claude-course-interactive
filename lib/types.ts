export type Audience =
  | "general"
  | "developer"
  | "education"
  | "business"
  | "nonprofit";

export type Level = "beginner" | "intermediate" | "advanced";

export type Category =
  | "claude-ai"
  | "claude-cowork"
  | "claude-code"
  | "ai-fluency"
  | "claude-platform"
  | "mcp";

export type Topic =
  | "claude-ai"
  | "claude-cowork"
  | "claude-code"
  | "subagents"
  | "agent-skills"
  | "mcp"
  | "api"
  | "bedrock"
  | "vertex"
  | "ai-fluency"
  | "ai-capabilities"
  | "educators"
  | "students"
  | "nonprofit"
  | "small-business";

export type CourseSource = "skilljar" | "anthropic-github";

export interface Attribution {
  creator: string;
  originalUrl: string;
  license: string;
  licenseUrl: string;
  notes?: string;
}

export interface Course {
  id: string;
  title: string;
  url: string;
  source: CourseSource;
  category: Category;
  audience: Audience[];
  level: Level;
  lectureCount: number;
  durationMinutes: number;
  quizCount: number;
  topics: Topic[];
  prerequisites: string[];
  summary: string;
  learningObjectives: string[];
  attribution?: Attribution;
  status?: "verified" | "unverified" | "draft";
}

export interface Catalog {
  lastSynced: string;
  sourceNote: string;
  courses: Course[];
}

export type Goal =
  | "use-claude-day-to-day"
  | "ship-with-claude-code"
  | "build-with-api"
  | "learn-mcp"
  | "teach-ai-fluency";

export interface UserProfile {
  role: Audience;
  goal: Goal;
  experience: Level;
  timeBudgetMinutes: number;
}
