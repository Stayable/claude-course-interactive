"use client";

import { useEffect, useState } from "react";

interface Surface {
  name: string;
  where: string;
  good: string;
}

const SURFACES: Surface[] = [
  {
    name: "Chat",
    where: "claude.ai in a browser tab",
    good: "Quick questions, drafting, one-off reasoning.",
  },
  {
    name: "Desktop app",
    where: "Native window on Mac or Windows",
    good: "Steady, all-day use. Can see files on your computer.",
  },
  {
    name: "Cowork",
    where: "Inside the desktop app, file-aware mode",
    good: "Editing real files and projects alongside Claude.",
  },
  {
    name: "Code",
    where: "Your terminal",
    good: "Shipping software. Reads and edits a whole codebase.",
  },
];

interface SurfaceMapProps {
  takeaway?: string;
}

export function SurfaceMap({ takeaway }: SurfaceMapProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <figure className="my-6 rounded-lg border border-ink-200 bg-ink-50 p-5 dark:border-ink-700 dark:bg-ink-900">
      {takeaway ? (
        <figcaption className="mb-4 text-sm font-medium text-ink-700 dark:text-ink-200">
          Takeaway: {takeaway}
        </figcaption>
      ) : null}
      <div className="grid gap-3 sm:grid-cols-2">
        {SURFACES.map((s, i) => (
          <div
            key={s.name}
            className={`rounded-md border border-ink-200 bg-white p-3 transition-all duration-500 ease-out dark:border-ink-700 dark:bg-ink-900 ${
              mounted ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
            }`}
            style={{ transitionDelay: `${i * 140}ms` }}
          >
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-accent" aria-hidden />
              <span className="text-sm font-semibold tracking-tight">
                {s.name}
              </span>
            </div>
            <p className="mt-1 text-xs text-ink-400">{s.where}</p>
            <p className="mt-2 text-sm text-ink-700 dark:text-ink-100">
              {s.good}
            </p>
          </div>
        ))}
      </div>
    </figure>
  );
}
