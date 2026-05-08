import Link from "next/link";
import { getCatalog } from "@/lib/catalog";

export default function HomePage() {
  const catalog = getCatalog();
  return (
    <div className="prose-app">
      <h1>Learn Claude, faster.</h1>
      <p className="text-lg text-ink-700 dark:text-ink-100">
        Anthropic publishes {catalog.courses.length} free courses on prompting,
        the API, tool use, MCP, agents, and Claude Code. This site repackages
        them as short, interactive lessons with diagrams, quizzes, and a live
        playground — and recommends a path tailored to you.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/onboarding"
          className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white"
        >
          Recommend my path
        </Link>
        <Link
          href="/courses"
          className="rounded-md border border-ink-200 px-4 py-2 text-sm font-medium hover:border-accent dark:border-ink-700"
        >
          Browse all courses
        </Link>
      </div>

      <h2>What's inside</h2>
      <ul>
        <li><strong>Diagrams</strong> for tool-use loops, MCP, agent flows, and prompt structure.</li>
        <li><strong>Quizzes</strong> after each idea so you don't just nod along.</li>
        <li><strong>A live playground</strong> wired to the Claude API for hands-on practice.</li>
        <li><strong>Progress tracking</strong> so you can stop and resume anywhere.</li>
      </ul>
    </div>
  );
}
