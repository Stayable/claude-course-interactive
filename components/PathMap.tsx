import Link from "next/link";
import type { Course } from "@/lib/types";

interface PathMapProps {
  courses: Course[];
  totalMinutes: number;
  rationale: string;
}

export function PathMap({ courses, totalMinutes, rationale }: PathMapProps) {
  if (courses.length === 0) {
    return (
      <div className="rounded-lg border border-ink-200 bg-ink-50 p-6 text-sm text-ink-700 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-100">
        {rationale}
      </div>
    );
  }
  return (
    <div className="space-y-4">
      <p className="text-sm text-ink-400">
        {rationale} Estimated time: {totalMinutes} minutes.
      </p>
      <ol className="space-y-3">
        {courses.map((c, i) => (
          <li
            key={c.id}
            className="rounded-lg border border-ink-200 bg-white p-4 dark:border-ink-700 dark:bg-ink-900"
          >
            <div className="flex items-baseline justify-between gap-3">
              <div>
                <span className="text-xs font-mono text-ink-400">{String(i + 1).padStart(2, "0")}</span>
                <Link
                  href={`/courses/${c.id}`}
                  className="ml-2 font-medium hover:text-accent"
                >
                  {c.title}
                </Link>
              </div>
              <span className="text-xs text-ink-400">
                {c.level} · {c.durationMinutes} min
              </span>
            </div>
            <p className="mt-1 text-sm text-ink-700 dark:text-ink-100">{c.summary}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
