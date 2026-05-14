"use client";

import { useState } from "react";

export interface Role {
  name: string;
  scenarios: string[];
}

interface RoleSwitcherProps {
  roles: Role[];
  takeaway?: string;
}

export function RoleSwitcher({ roles, takeaway }: RoleSwitcherProps) {
  const [active, setActive] = useState(0);
  if (roles.length === 0) return null;
  const current = roles[active];

  return (
    <figure className="my-6 rounded-lg border border-ink-200 bg-ink-50 p-5 dark:border-ink-700 dark:bg-ink-900">
      {takeaway ? (
        <figcaption className="mb-4 text-sm font-medium text-ink-700 dark:text-ink-200">
          Takeaway: {takeaway}
        </figcaption>
      ) : null}
      <div className="flex flex-wrap gap-2">
        {roles.map((r, i) => {
          const on = i === active;
          return (
            <button
              key={r.name}
              type="button"
              onClick={() => setActive(i)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                on
                  ? "border-accent bg-accent text-white"
                  : "border-ink-200 bg-white text-ink-700 hover:border-accent dark:border-ink-700 dark:bg-ink-900 dark:text-ink-100"
              }`}
              aria-pressed={on}
            >
              {r.name}
            </button>
          );
        })}
      </div>
      <ul className="mt-4 space-y-2">
        {current.scenarios.map((s, i) => (
          <li
            key={`${current.name}-${i}`}
            className="reveal-item relative rounded-md border border-ink-200 bg-white p-3 text-sm dark:border-ink-700 dark:bg-ink-900"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            {s}
          </li>
        ))}
      </ul>
    </figure>
  );
}
