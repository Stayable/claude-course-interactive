import { promises as fs } from "node:fs";
import path from "node:path";

export interface LessonRef {
  id: string;
  title: string;
}

const CONTENT_ROOT = path.join(process.cwd(), "content", "courses");

export async function listLessons(courseId: string): Promise<LessonRef[]> {
  const dir = path.join(CONTENT_ROOT, courseId);
  let entries: string[];
  try {
    entries = await fs.readdir(dir);
  } catch {
    return [];
  }
  const lessons: LessonRef[] = [];
  for (const f of entries) {
    if (!f.endsWith(".mdx")) continue;
    const id = f.replace(/\.mdx$/, "");
    const raw = await fs.readFile(path.join(dir, f), "utf8");
    const titleMatch = raw.match(/^#\s+(.+)$/m);
    lessons.push({ id, title: titleMatch?.[1] ?? id });
  }
  return lessons.sort((a, b) => a.id.localeCompare(b.id));
}
