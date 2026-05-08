import { notFound } from "next/navigation";
import Link from "next/link";
import { getCourse } from "@/lib/catalog";
import { LessonProgressButton } from "@/components/LessonProgressButton";

interface Params {
  params: Promise<{ courseId: string; lessonId: string }>;
}

export default async function LessonPage({ params }: Params) {
  const { courseId, lessonId } = await params;
  const course = getCourse(courseId);
  if (!course) notFound();

  let Lesson: React.ComponentType;
  try {
    Lesson = (await import(`@/content/courses/${courseId}/${lessonId}.mdx`)).default;
  } catch {
    notFound();
  }

  return (
    <article className="prose-app">
      <p className="text-sm text-ink-400">
        <Link href={`/courses/${courseId}`} className="hover:text-accent">
          {course.title}
        </Link>
      </p>
      <Lesson />
      <hr className="my-8 border-ink-200 dark:border-ink-700" />
      <LessonProgressButton courseId={courseId} lessonId={lessonId} />
    </article>
  );
}
