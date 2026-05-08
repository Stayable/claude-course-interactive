import type { ReactNode } from "react";

interface CalloutProps {
  kind?: "note" | "warn" | "tip";
  children: ReactNode;
}

const STYLES: Record<NonNullable<CalloutProps["kind"]>, string> = {
  note: "border-ink-200 bg-ink-50 text-ink-700 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-100",
  warn: "border-amber-300 bg-amber-50 text-amber-900 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-100",
  tip: "border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-100",
};

export function Callout({ kind = "note", children }: CalloutProps) {
  return (
    <div className={`my-4 rounded-md border-l-4 px-4 py-3 text-sm ${STYLES[kind]}`}>
      {children}
    </div>
  );
}
