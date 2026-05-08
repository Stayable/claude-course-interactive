import catalogData from "@/content/courses.json";
import type { Catalog, Course } from "./types";

export function getCatalog(): Catalog {
  return catalogData as Catalog;
}

export function getCourse(id: string): Course | undefined {
  return getCatalog().courses.find((c) => c.id === id);
}
