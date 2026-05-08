"use client";

import { useState } from "react";

interface Props {
  courseId: string;
  lessonId: string;
}

export function LessonProgressButton({ courseId, lessonId }: Props) {
  const [state, setState] = useState<"idle" | "saving" | "done" | "needs-auth" | "error">("idle");

  async function mark() {
    setState("saving");
    const res = await fetch("/api/progress", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ courseId, lessonId, completed: true }),
    });
    if (res.status === 401) return setState("needs-auth");
    if (!res.ok) return setState("error");
    setState("done");
  }

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={mark}
        disabled={state === "saving" || state === "done"}
        className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
      >
        {state === "done" ? "Marked complete" : "Mark complete"}
      </button>
      {state === "needs-auth" ? (
        <a href="/api/auth/signin" className="text-sm underline">
          Sign in to save progress
        </a>
      ) : null}
      {state === "error" ? (
        <span className="text-sm text-red-600">Could not save. Try again.</span>
      ) : null}
    </div>
  );
}
