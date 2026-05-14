"use client";

import { useEffect, useState } from "react";

interface CompareProps {
  leftLabel: string;
  rightLabel: string;
  left: string[];
  right: string[];
  takeaway?: string;
}

export function Compare({
  leftLabel,
  rightLabel,
  left,
  right,
  takeaway,
}: CompareProps) {
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
      <div className="grid gap-4 sm:grid-cols-2">
        <Column label={leftLabel} items={left} mounted={mounted} tone="good" />
        <Column
          label={rightLabel}
          items={right}
          mounted={mounted}
          tone="care"
          startDelay={left.length * 80}
        />
      </div>
    </figure>
  );
}

function Column({
  label,
  items,
  mounted,
  tone,
  startDelay = 0,
}: {
  label: string;
  items: string[];
  mounted: boolean;
  tone: "good" | "care";
  startDelay?: number;
}) {
  const accent =
    tone === "good"
      ? "before:bg-emerald-500"
      : "before:bg-amber-500";
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">
        {label}
      </p>
      <ul className="mt-2 space-y-1.5">
        {items.map((t, i) => (
          <li
            key={t}
            className={`relative pl-5 text-sm transition-all duration-500 ease-out before:absolute before:left-0 before:top-2 before:h-1.5 before:w-1.5 before:rounded-full ${accent} ${
              mounted ? "translate-x-0 opacity-100" : "-translate-x-1 opacity-0"
            }`}
            style={{ transitionDelay: `${startDelay + i * 80}ms` }}
          >
            {t}
          </li>
        ))}
      </ul>
    </div>
  );
}
