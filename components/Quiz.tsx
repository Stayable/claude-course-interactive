"use client";

import { useState } from "react";

export interface QuizChoice {
  text: string;
  correct?: boolean;
  explanation?: string;
}

interface QuizProps {
  question: string;
  choices: QuizChoice[];
  multi?: boolean;
}

export function Quiz({ question, choices, multi = false }: QuizProps) {
  const [picked, setPicked] = useState<Set<number>>(new Set());
  const [submitted, setSubmitted] = useState(false);

  function toggle(i: number) {
    if (submitted) return;
    const next = new Set(picked);
    if (multi) {
      next.has(i) ? next.delete(i) : next.add(i);
    } else {
      next.clear();
      next.add(i);
    }
    setPicked(next);
  }

  const allCorrect =
    submitted &&
    choices.every((c, i) => Boolean(c.correct) === picked.has(i));

  return (
    <div className="my-6 rounded-lg border border-ink-200 bg-white p-4 dark:border-ink-700 dark:bg-ink-900">
      <p className="font-medium">{question}</p>
      <ul className="mt-3 space-y-2">
        {choices.map((c, i) => {
          const isPicked = picked.has(i);
          const showResult = submitted;
          const correctness = showResult
            ? c.correct
              ? "border-green-500 bg-green-50 dark:bg-green-950"
              : isPicked
                ? "border-red-500 bg-red-50 dark:bg-red-950"
                : "border-ink-200 dark:border-ink-700"
            : isPicked
              ? "border-accent bg-accent/10"
              : "border-ink-200 dark:border-ink-700";
          return (
            <li key={i}>
              <button
                type="button"
                onClick={() => toggle(i)}
                className={`w-full rounded-md border px-3 py-2 text-left text-sm transition ${correctness}`}
              >
                <span className="font-medium">{c.text}</span>
                {showResult && c.explanation ? (
                  <span className="mt-1 block text-xs text-ink-400">{c.explanation}</span>
                ) : null}
              </button>
            </li>
          );
        })}
      </ul>
      <div className="mt-3 flex items-center gap-3">
        <button
          type="button"
          disabled={picked.size === 0 || submitted}
          onClick={() => setSubmitted(true)}
          className="rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-white disabled:opacity-50"
        >
          Check
        </button>
        {submitted ? (
          <button
            type="button"
            onClick={() => {
              setSubmitted(false);
              setPicked(new Set());
            }}
            className="text-sm text-ink-400 underline"
          >
            Try again
          </button>
        ) : null}
        {submitted ? (
          <span className={`text-sm ${allCorrect ? "text-green-700" : "text-red-700"}`}>
            {allCorrect ? "Correct" : "Not quite"}
          </span>
        ) : null}
      </div>
    </div>
  );
}
