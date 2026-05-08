"use client";

import { useState } from "react";

interface PlaygroundProps {
  initialPrompt?: string;
  system?: string;
  label?: string;
}

export function Playground({
  initialPrompt = "",
  system,
  label = "Try it",
}: PlaygroundProps) {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [output, setOutput] = useState("");
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function run() {
    setRunning(true);
    setOutput("");
    setError(null);
    try {
      const res = await fetch("/api/claude", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ prompt, system }),
      });
      if (!res.ok) {
        const detail = await res.json().catch(() => ({}));
        throw new Error(detail.error ?? `HTTP ${res.status}`);
      }
      const reader = res.body?.getReader();
      if (!reader) throw new Error("No response stream");
      const decoder = new TextDecoder();
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        setOutput((prev) => prev + decoder.decode(value, { stream: true }));
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className="my-6 rounded-lg border border-ink-200 bg-white dark:border-ink-700 dark:bg-ink-900">
      <div className="flex items-center justify-between border-b border-ink-200 px-3 py-2 text-xs uppercase tracking-wide text-ink-400 dark:border-ink-700">
        <span>{label}</span>
        <span>Claude API</span>
      </div>
      <textarea
        className="block h-32 w-full resize-y border-0 bg-transparent p-3 font-mono text-sm focus:outline-none"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Type your prompt..."
      />
      <div className="flex items-center gap-3 border-t border-ink-200 px-3 py-2 dark:border-ink-700">
        <button
          type="button"
          disabled={running || !prompt.trim()}
          onClick={run}
          className="rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-white disabled:opacity-50"
        >
          {running ? "Running..." : "Run"}
        </button>
        {error ? <span className="text-sm text-red-600">{error}</span> : null}
      </div>
      {output ? (
        <pre className="max-h-80 overflow-auto whitespace-pre-wrap border-t border-ink-200 bg-ink-50 p-3 font-mono text-sm dark:border-ink-700 dark:bg-ink-900">
          {output}
        </pre>
      ) : null}
    </div>
  );
}
