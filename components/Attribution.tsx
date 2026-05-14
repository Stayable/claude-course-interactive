interface AttributionProps {
  creator?: string;
  originalUrl: string;
  license?: string;
  licenseUrl?: string;
  modifications?: string;
}

export function Attribution({
  creator = "Anthropic",
  originalUrl,
  license = "CC BY-NC 4.0",
  licenseUrl = "https://creativecommons.org/licenses/by-nc/4.0/",
  modifications = "Adapted for interactive web format with diagrams, quizzes, and embedded playgrounds.",
}: AttributionProps) {
  return (
    <aside className="not-prose mt-10 rounded-md border border-ink-200 bg-ink-50 p-4 text-xs text-ink-700 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-100">
      <p className="font-semibold uppercase tracking-wider text-ink-400">
        Attribution
      </p>
      <p className="mt-1">
        Adapted from {creator}'s open-source course material at{" "}
        <a
          href={originalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent underline underline-offset-2 hover:text-accent-dark"
        >
          {originalUrl.replace(/^https?:\/\//, "")}
        </a>
        .
      </p>
      <p className="mt-1">
        Licensed under{" "}
        <a
          href={licenseUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent underline underline-offset-2 hover:text-accent-dark"
        >
          {license}
        </a>
        . Non-commercial use only.
      </p>
      <p className="mt-1 italic text-ink-400">Modifications: {modifications}</p>
    </aside>
  );
}
