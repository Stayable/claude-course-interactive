"use client";

import { useState } from "react";
import { getCatalog } from "@/lib/catalog";
import { recommendPath } from "@/lib/recommender";
import { PathMap } from "@/components/PathMap";
import type { Audience, Goal, Level, UserProfile } from "@/lib/types";

const ROLES: { value: Audience; label: string }[] = [
  { value: "general", label: "Curious learner / general user" },
  { value: "developer", label: "Developer" },
  { value: "education", label: "Educator or student" },
  { value: "business", label: "Small business owner" },
  { value: "nonprofit", label: "Nonprofit team member" },
];

const GOALS: { value: Goal; label: string }[] = [
  { value: "use-claude-day-to-day", label: "Use Claude better day to day" },
  { value: "ship-with-claude-code", label: "Ship code with Claude Code" },
  { value: "build-with-api", label: "Build with the Claude API" },
  { value: "learn-mcp", label: "Learn the Model Context Protocol" },
  { value: "teach-ai-fluency", label: "Teach AI fluency" },
];

const LEVELS: { value: Level; label: string }[] = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

export default function OnboardingPage() {
  const [profile, setProfile] = useState<UserProfile>({
    role: "developer",
    goal: "build-with-api",
    experience: "beginner",
    timeBudgetMinutes: 240,
  });
  const [submitted, setSubmitted] = useState(false);

  const catalog = getCatalog();
  const path = submitted ? recommendPath(profile, catalog) : null;

  return (
    <div className="prose-app">
      <h1>Recommend my path</h1>
      <p>Four questions, then a path tuned to your goal and time budget.</p>

      <form
        className="not-prose grid gap-4 rounded-lg border border-ink-200 bg-white p-4 dark:border-ink-700 dark:bg-ink-900 sm:grid-cols-2"
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitted(true);
        }}
      >
        <Field label="I am a">
          <select
            value={profile.role}
            onChange={(e) => setProfile({ ...profile, role: e.target.value as Audience })}
            className="w-full rounded-md border border-ink-200 bg-transparent p-2 text-sm dark:border-ink-700"
          >
            {ROLES.map((r) => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
        </Field>
        <Field label="My goal">
          <select
            value={profile.goal}
            onChange={(e) => setProfile({ ...profile, goal: e.target.value as Goal })}
            className="w-full rounded-md border border-ink-200 bg-transparent p-2 text-sm dark:border-ink-700"
          >
            {GOALS.map((g) => (
              <option key={g.value} value={g.value}>{g.label}</option>
            ))}
          </select>
        </Field>
        <Field label="Experience with Claude">
          <select
            value={profile.experience}
            onChange={(e) => setProfile({ ...profile, experience: e.target.value as Level })}
            className="w-full rounded-md border border-ink-200 bg-transparent p-2 text-sm dark:border-ink-700"
          >
            {LEVELS.map((l) => (
              <option key={l.value} value={l.value}>{l.label}</option>
            ))}
          </select>
        </Field>
        <Field label={`Time I can spend (${profile.timeBudgetMinutes} min)`}>
          <input
            type="range"
            min={60}
            max={720}
            step={30}
            value={profile.timeBudgetMinutes}
            onChange={(e) =>
              setProfile({ ...profile, timeBudgetMinutes: Number(e.target.value) })
            }
            className="w-full"
          />
        </Field>
        <div className="sm:col-span-2">
          <button
            type="submit"
            className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white"
          >
            Build my path
          </button>
        </div>
      </form>

      {path ? (
        <section className="not-prose mt-8">
          <h2 className="mb-3 text-xl font-semibold">Your path</h2>
          <PathMap
            courses={path.courses}
            totalMinutes={path.totalMinutes}
            rationale={path.rationale}
          />
        </section>
      ) : null}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium">{label}</span>
      {children}
    </label>
  );
}
