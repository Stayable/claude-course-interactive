# claude-course-interactive

Interactive companion for Anthropic's free Claude courses (https://claude.com/resources/courses).
Pick your goal, get a recommended learning path, and progress through bite-sized lessons with diagrams, quizzes, and a live Claude API playground.

See [`CLAUDE.md`](./CLAUDE.md) for product scope, locked decisions, and working rules.

## Stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS
- MDX for lessons
- Mermaid for diagrams
- Auth.js (NextAuth v5) + Prisma — GitHub OAuth, SQLite locally / Postgres in prod
- Anthropic SDK (`@anthropic-ai/sdk`) called only from `app/api/claude/route.ts`
- Vitest for the recommender

## Setup

```bash
pnpm install              # or npm/yarn
cp .env.example .env
# fill in ANTHROPIC_API_KEY, AUTH_SECRET, AUTH_GITHUB_ID, AUTH_GITHUB_SECRET

pnpm prisma db push       # creates the SQLite db
pnpm dev
```

Open http://localhost:3000.

## Required env vars

| Var                  | Purpose                                              |
| -------------------- | ---------------------------------------------------- |
| `ANTHROPIC_API_KEY`  | Server-side only. Powers the lesson playground.      |
| `AUTH_SECRET`        | `openssl rand -base64 32`                            |
| `AUTH_GITHUB_ID`     | GitHub OAuth app client id                           |
| `AUTH_GITHUB_SECRET` | GitHub OAuth app client secret                       |
| `DATABASE_URL`       | `file:./dev.db` for SQLite, `postgres://…` for prod  |

## Project layout

```
app/                     # routes (landing, onboarding, courses, lesson, api)
components/              # Diagram, Quiz, Playground, PathMap, Callout
content/courses.json     # catalog (source of truth)
content/courses/*/*.mdx  # lesson bodies
lib/                     # recommender, claude, auth, prisma, types
prisma/schema.prisma     # User, Account, Session, Progress, QuizAttempt
```

## Tests

```bash
pnpm test
```

Recommender rules are pure functions in `lib/recommender.ts` with Vitest coverage in `lib/recommender.test.ts`.

## Adding a course

1. Add a new entry to `content/courses.json` (id, title, audience, level, topics, prerequisites, summary, learningObjectives).
2. Create `content/courses/<id>/01-<lesson>.mdx`. Use `<Diagram>`, `<Quiz>`, `<Playground>`, `<Callout>` as needed.
3. Add a recommender test if the new course should change the path for some profile.

The catalog is hand-maintained. Don't scrape claude.com.
