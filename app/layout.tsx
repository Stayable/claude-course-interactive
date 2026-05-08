import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Interactive Claude Courses",
  description:
    "Visual, hands-on lessons that teach the content of Anthropic's Claude courses with diagrams, quizzes, and a live playground.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <header className="border-b border-ink-200 bg-white dark:border-ink-700 dark:bg-ink-900">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
            <Link href="/" className="font-semibold tracking-tight">
              Claude Courses · Interactive
            </Link>
            <nav className="flex items-center gap-4 text-sm">
              <Link href="/courses" className="hover:text-accent">All courses</Link>
              <Link href="/onboarding" className="hover:text-accent">Recommend a path</Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
        <footer className="mx-auto max-w-5xl px-4 py-8 text-xs text-ink-400">
          Independent study companion. Original courses live at{" "}
          <a href="https://claude.com/resources/courses" className="underline">
            claude.com/resources/courses
          </a>
          .
        </footer>
      </body>
    </html>
  );
}
