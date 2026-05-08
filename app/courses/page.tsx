import Link from "next/link";
import { getCatalog } from "@/lib/catalog";

export default function CoursesIndex() {
  const catalog = getCatalog();
  return (
    <div className="prose-app">
      <h1>All courses</h1>
      <p className="text-sm text-ink-400">
        Catalog last synced {catalog.lastSynced}. {catalog.sourceNote}
      </p>
      <ul className="not-prose mt-6 grid gap-4 sm:grid-cols-2">
        {catalog.courses.map((c) => (
          <li
            key={c.id}
            className="rounded-lg border border-ink-200 bg-white p-4 dark:border-ink-700 dark:bg-ink-900"
          >
            <Link href={`/courses/${c.id}`} className="font-medium hover:text-accent">
              {c.title}
            </Link>
            <div className="mt-1 text-xs text-ink-400">
              {c.level} · {c.durationMinutes} min · {c.audience.join(", ")}
            </div>
            <p className="mt-2 text-sm text-ink-700 dark:text-ink-100">{c.summary}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
