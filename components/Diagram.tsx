"use client";

import { useEffect, useRef, useState } from "react";

interface DiagramProps {
  chart: string;
  caption?: string;
  takeaway?: string;
}

let mermaidPromise: Promise<typeof import("mermaid").default> | null = null;
function loadMermaid() {
  if (!mermaidPromise) {
    mermaidPromise = import("mermaid").then((m) => {
      m.default.initialize({ startOnLoad: false, theme: "neutral", securityLevel: "strict" });
      return m.default;
    });
  }
  return mermaidPromise;
}

export function Diagram({ chart, caption, takeaway }: DiagramProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const idRef = useRef(`d-${Math.random().toString(36).slice(2)}`);

  useEffect(() => {
    let cancelled = false;
    loadMermaid()
      .then(async (mermaid) => {
        try {
          const { svg } = await mermaid.render(idRef.current, chart);
          if (!cancelled && ref.current) ref.current.innerHTML = svg;
        } catch (e) {
          if (!cancelled) setError((e as Error).message);
        }
      })
      .catch((e) => !cancelled && setError((e as Error).message));
    return () => {
      cancelled = true;
    };
  }, [chart]);

  return (
    <figure className="my-6 rounded-lg border border-ink-200 bg-ink-50 p-4 dark:border-ink-700 dark:bg-ink-900">
      {takeaway ? (
        <figcaption className="mb-3 text-sm font-medium text-ink-700 dark:text-ink-200">
          Takeaway: {takeaway}
        </figcaption>
      ) : null}
      <div ref={ref} className="overflow-x-auto" />
      {error ? <p className="text-sm text-red-600">Diagram error: {error}</p> : null}
      {caption ? (
        <figcaption className="mt-2 text-xs text-ink-400">{caption}</figcaption>
      ) : null}
    </figure>
  );
}
