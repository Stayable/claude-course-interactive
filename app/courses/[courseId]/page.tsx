import { notFound } from "next/navigation";
import Link from "next/link";
import { getCourse } from "@/lib/catalog";
import { listLessons } from "@/lib/lessons";

interface Params {
  params: Promise<{ courseId: string }>;
}

export default async function CoursePage({ params }: Params) {
  const { courseId } = await params;
  const course = getCourse(courseId);
  if (!course) notFound();

  const lessons = await listLessons(courseId);

  return (
    <div className="prose-app">
      <p className="text-sm text-ink-400">
        <Link href="/courses" className="hover:text-accent">All courses</Link>
        {" · "}
        <a href={course.url} className="hover:text-accent">Original on claude.com</a>
      </p>
      <h1>{course.title}</h1>
      <p className="text-sm text-ink-400">
        {course.level} · {course.durationMinutes} min · {course.audience.join(", ")}
      </p>
      <p>{course.summary}</p>

      <h2>What you'll learn</h2>
      <ul>
        {course.learningObjectives.map((o) => (
          <li key={o}>{o}</li>
        ))}
      </ul>

      <h2>Lessons</h2>
      {lessons.length === 0 ? (
        <p className="text-sm text-ink-400">
          Lessons for this course are still being written. Check back soon.
        </p>
      ) : (
        <ol className="not-prose space-y-2">
          {lessons.map((l, i) => (
            <li key={l.id}>
              <Link
                href={`/courses/${course.id}/${l.id}`}
                className="block rounded-md border border-ink-200 px-3 py-2 hover:border-accent dark:border-ink-700"
              >
                <span className="font-mono text-xs text-ink-400">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="ml-2 font-medium">{l.title}</span>
              </Link>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
