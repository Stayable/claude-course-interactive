"use client";

import { useEffect, useRef, useState } from "react";

interface TypingDemoProps {
  prompt: string;
  response: string;
  charMs?: number;
  label?: string;
}

export function TypingDemo({
  prompt,
  response,
  charMs = 18,
  label = "What a Claude reply looks like",
}: TypingDemoProps) {
  const [shown, setShown] = useState("");
  const [running, setRunning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function play() {
    if (timerRef.current) clearTimeout(timerRef.current);
    setShown("");
    setRunning(true);
    let i = 0;
    const tick = () => {
      i += 1;
      setShown(response.slice(0, i));
      if (i < response.length) {
        timerRef.current = setTimeout(tick, charMs);
      } else {
        setRunning(false);
      }
    };
    tick();
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div className="my-6 overflow-hidden rounded-lg border border-ink-200 bg-white dark:border-ink-700 dark:bg-ink-900">
      <div className="flex items-center justify-between border-b border-ink-200 px-3 py-2 text-xs uppercase tracking-wide text-ink-400 dark:border-ink-700">
        <span>{label}</span>
        <span>Mock — no API call</span>
      </div>
      <div className="space-y-3 p-4 text-sm">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">
            You
          </p>
          <p className="mt-1 leading-relaxed">{prompt}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">
            Claude
          </p>
          <p className="mt-1 leading-relaxed whitespace-pre-wrap">
            {shown}
            {running ? (
              <span
                className="ml-0.5 inline-block h-3 w-1.5 translate-y-px animate-pulse bg-accent align-middle"
                aria-hidden
              />
            ) : null}
          </p>
        </div>
      </div>
      <div className="border-t border-ink-200 px-3 py-2 dark:border-ink-700">
        <button
          type="button"
          onClick={play}
          disabled={running}
          className="rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-white disabled:opacity-50"
        >
          {running ? "Streaming..." : shown ? "Replay" : "Play"}
        </button>
      </div>
    </div>
  );
}
