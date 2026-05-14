# claude-course-interactive

Interactive webapp that teaches the content of Anthropic's free Claude courses (https://anthropic.skilljar.com/) in a more visual, hands-on, gamified way than passively reading the originals. Users pick goals, get a recommended learning path across the catalog, and progress through bite-sized lessons with diagrams, live API playgrounds, quizzes, and exercises.

## Source of truth: the course catalog

The catalog has **two sources**, both authoritative for what they cover:

1. **Skilljar** — `https://anthropic.skilljar.com/`. Anthropic's live LMS. 18 courses as of the last sync. This is the video + quiz + certificate version. We can link to it but cannot legally redistribute its content. Lessons in our app under `source: "skilljar"` courses are our own pedagogical content informed by public knowledge of the topic.
2. **Anthropic GitHub** — `https://github.com/anthropics/courses`. Open-source course notebooks released by Anthropic under **CC BY-NC 4.0**. 5 courses: `anthropic_api_fundamentals`, `prompt_engineering_interactive_tutorial`, `real_world_prompting`, `prompt_evaluations`, `tool_use`. These pre-date the consolidated Skilljar lineup and remain useful as standalone material. We **can** port these — with required attribution and only for non-commercial use.

A note on the marketing index at https://claude.com/resources/courses: it's a directory page that lags Skilljar (has been observed missing courses Skilljar lists). Don't rely on it.

Do **not** hardcode course metadata from memory or training data — it goes stale and Anthropic adds/renames courses.

### License obligations for `source: "anthropic-github"` courses

CC BY-NC 4.0 requires, on every ported lesson:
- Attribute Anthropic as the creator
- Link to the original repository
- Reference the license (CC BY-NC 4.0) with a link
- Indicate that modifications were made
- Keep the entire app **non-commercial** — no ads, no paid access, no inclusion in a paid product

The `Attribution` component (`components/Attribution.tsx`) is rendered at the bottom of every ported lesson. The `attribution` field on each `anthropic-github` course in `content/courses.json` carries the metadata. **Do not** remove either.

If we ever want to monetize this app, we must remove all `source: "anthropic-github"` content first or get separate permission from Anthropic.

### Source URLs by course type

- `source: "skilljar"` → `url` is `https://anthropic.skilljar.com/<slug>` (e.g. `/claude-101`, `/claude-code-101`).
- `source: "anthropic-github"` → `url` is `https://github.com/anthropics/courses/tree/master/<dirname>`.

Implementation rule: keep the catalog in `content/courses.json` (or `content/courses/*.md` with front-matter), and treat it as the single source consumed by the UI, the recommender, and the progress tracker. When asked to "add a course" or "refresh the catalog," update that file — never sprinkle course strings through components.

Each course entry must carry at minimum:
- `id` (stable slug matching the Skilljar URL slug, e.g. `claude-101`, `claude-code-101`, `introduction-to-claude-cowork`)
- `title` (exact title as shown on Skilljar)
- `url` (Skilljar detail page, e.g. `https://anthropic.skilljar.com/claude-101`)
- `category`: Skilljar's own tag — one of `claude-ai`, `claude-cowork`, `claude-code`, `ai-fluency`, `claude-platform`, `mcp`
- `audience`: one or more of `general`, `developer`, `education`, `business`, `nonprofit` (mirrors Skilljar's audience tagging)
- `level`: `beginner` | `intermediate` | `advanced`
- `lectureCount` (integer, as shown on Skilljar)
- `durationMinutes` (integer, parsed from Skilljar's "X min / X hr of video")
- `quizCount` (integer, 0 if none)
- `topics`: tag list (e.g. `claude-ai`, `claude-code`, `cowork`, `subagents`, `agent-skills`, `mcp`, `api`, `bedrock`, `vertex`, `ai-fluency`)
- `prerequisites`: array of course ids
- `summary` (1–2 sentences, ideally Skilljar's own blurb)
- `learningObjectives` (3–6 bullets)

Known courses as of the last manual sync from Skilljar (verify against the live page before relying on this list — names and availability change). 18 courses total:

**Claude.ai (consumer chat)**
- `claude-101` — Claude 101 — 12 lectures · 1 hr · General · Beginner

**Claude Cowork**
- `introduction-to-claude-cowork` — Introduction to Claude Cowork — Developer · Beginner

**Claude Code (terminal / CLI)**
- `claude-code-101` — Claude Code 101 — 12 lectures · 1 hr · Developer · Beginner
- `claude-code-in-action` — Claude Code in Action — 15 lectures · 1 hr · 1 quiz · Developer · Intermediate
- `introduction-to-agent-skills` — Introduction to agent skills — 6 lectures · 30 min · Developer · Beginner
- `introduction-to-subagents` — Introduction to subagents — 4 lectures · 20 min · Developer · Beginner

**AI Fluency (non-technical foundations)**
- `ai-fluency-framework-foundations` — AI Fluency: Framework & Foundations — 14 lectures · 1.1 hr · 1 quiz · General · Beginner
- `ai-capabilities-and-limitations` — AI Capabilities and Limitations — 13 lectures · 15 min · 1 quiz · General · Beginner
- `ai-fluency-for-educators` — AI Fluency for Educators — 4 lectures · 24 min · Education · Beginner
- `ai-fluency-for-students` — AI Fluency for Students — 5 lectures · 30 min · Education · Beginner
- `teaching-ai-fluency` — Teaching AI Fluency — 7 lectures · 36 min · 1 quiz · Education · Intermediate
- `ai-fluency-for-nonprofits` — AI Fluency for nonprofits — 9 lectures · 54 min · 1 quiz · Nonprofit · Beginner
- `ai-fluency-for-small-businesses` — AI Fluency for Small Businesses — Business · Beginner *(present on Skilljar; missing from the claude.com index)*

**Claude Platform (API / cloud providers)**
- `claude-with-the-anthropic-api` — Building with the Claude API — 84 lectures · 8.1 hr · 10 quizzes · Developer · Intermediate
- `claude-in-amazon-bedrock` — Claude with Amazon Bedrock — 85 lectures · 8 hr · 10 quizzes · Developer · Intermediate
- `claude-with-google-vertex` — Claude with Google Cloud's Vertex AI — 85 lectures · 8 hr · 10 quizzes · Developer · Intermediate

**MCP (Model Context Protocol)**
- `introduction-to-model-context-protocol` — Introduction to Model Context Protocol — 16 lectures · 1 hr · 1 quiz · Developer · Intermediate
- `model-context-protocol-advanced-topics` — Model Context Protocol: Advanced Topics — 15 lectures · 1.1 hr · 2 quizzes · Developer · Advanced

If you cannot verify a course is still listed on Skilljar, mark it `status: "unverified"` in the JSON rather than silently dropping or inventing one.

## Recommended learning paths (named tracks)

The recommender in `lib/recommender.ts` should encode at least these three named tracks. They map directly onto `(audience, goal)` and are the defaults presented in the onboarding questionnaire:

1. **`general-beginner`** — for non-technical learners who just want to use Claude well:
   `claude-101` → `ai-fluency-framework-foundations` *(optional: `ai-capabilities-and-limitations` as a 15-min primer first)*

2. **`developer-beginner`** — for developers ramping into Anthropic's full tooling surface (chat → files → terminal):
   `claude-101` → `introduction-to-claude-cowork` → `claude-code-101` → `claude-code-in-action` *(then optional: `introduction-to-agent-skills`, `introduction-to-subagents`)*

3. **`api-builder`** — for engineers building on top of the Claude API:
   `claude-101` *(skip if comfortable in chat)* → `ai-fluency-framework-foundations` → `claude-with-the-anthropic-api` → `introduction-to-model-context-protocol` *(then optional: `model-context-protocol-advanced-topics`)*

Audience-specific tracks (`education`, `nonprofit`, `business`) should swap the AI Fluency variant for the matching audience-specific course. Cloud-specific tracks (`claude-in-amazon-bedrock`, `claude-with-google-vertex`) are alternates to `claude-with-the-anthropic-api`, not additions — pick one based on the user's platform.

## Product shape

Three things the app must do well:

1. **Recommend a path.** Onboarding asks the user a few questions (role, goal, experience, time budget) and outputs an ordered learning path drawn from the catalog. The recommender is a pure function over `(userProfile, catalog) -> orderedCourseIds[]` — keep it in `lib/recommender.ts` so it's unit-testable without spinning up the UI. Rules-based is fine; do not introduce an LLM-based recommender unless asked.

2. **Teach interactively.** Each course is broken into lessons. A lesson is more than prose:
   - **Diagrams** for architecture/flow concepts (tool use loop, MCP client/server, agent loop, prompt-caching layers). Use Mermaid for flowcharts and a lightweight SVG/React component for custom visuals. Prefer Mermaid over hand-drawn SVG when it fits.
   - **Live playground** for prompting/tool-use/MCP lessons: editable prompt + "Run" button that calls the Claude API server-side and streams the response. Never expose the API key to the browser.
   - **Checks for understanding**: short quizzes (MCQ, fill-in, "fix this prompt") with immediate feedback, not just an end-of-course test.
   - **Apply-it exercises**: a small task the learner completes in the playground and self-checks against a rubric.

3. **Track progress.** Per-course completion %, per-lesson done/not-done, quiz scores, and a resumable "continue where you left off" entry point. Progress is stored server-side keyed to the authenticated user (Auth.js + Prisma). An anonymous user can browse but must sign in before progress persists.

## Tech defaults

Pick these unless the user says otherwise — don't relitigate every session:
- **Framework**: Next.js (App Router) + TypeScript.
- **Styling**: Tailwind CSS. Ship a clean light/dark theme; no decorative gradients or chartjunk.
- **Diagrams**: Mermaid (`mermaid` npm package) rendered client-side; custom React/SVG for anything Mermaid can't express.
- **Code blocks**: Shiki for syntax highlighting.
- **Content**: MDX for lesson bodies so diagrams, quizzes, and playground embeds can live inline as components.
- **Claude API**: `@anthropic-ai/sdk`, called only from Next.js route handlers (`app/api/claude/route.ts`). Stream responses. Default model: latest Sonnet (`claude-sonnet-4-6` at time of writing — bump when newer versions ship, see "Model selection" below).
- **State**: React Server Components for static content; `zustand` for client-side ephemeral state; server actions + Prisma for progress writes.
- **Auth**: Auth.js (NextAuth v5) with GitHub OAuth as the default provider. Email magic link can be added later. Session strategy: database (so we can join progress to user).
- **Database**: Prisma. **Two schema files**: `prisma/schema.prisma` is **postgresql** (prod, Neon); `prisma/schema.local.prisma` is **sqlite** (local dev, `file:./dev.db`). Keep them identical except for the `provider` line. Models cover `User`, `Account`, `Session`, `VerificationToken` (Auth.js standard) plus `Progress`, `QuizAttempt`. Scripts: `npm run db:push` (prod schema), `npm run db:push:local` (local sqlite schema).
- **Tests**: Vitest for `lib/` (recommender, content loaders). Playwright only if the user asks for E2E.

Keep `package.json` small. No CMS, analytics SDKs, animation libraries, or LMS frameworks unless asked.

## Repo layout (target)

```
app/
  page.tsx                    # landing + path recommender entry
  onboarding/                 # questionnaire -> recommended path
  courses/[courseId]/         # course overview
  courses/[courseId]/[lessonId]/  # lesson view (MDX)
  api/claude/route.ts         # server-side proxy to Anthropic API
components/
  Diagram.tsx                 # Mermaid wrapper
  Playground.tsx              # editable prompt + run + stream
  Quiz.tsx                    # MCQ / fill-in / rubric checks
  PathMap.tsx                 # visual of recommended path
content/
  courses.json                # catalog (source of truth)
  courses/<courseId>/<lessonId>.mdx
lib/
  recommender.ts              # pure path recommender
  progress.ts                 # localStorage progress store
  claude.ts                   # server-side SDK wrapper
```

Don't create this whole tree up front — scaffold what each task actually needs.

## Working rules for Claude in this repo

- **Don't invent course content.** If asked to write a lesson on a course you can't verify, say so and ask whether to (a) fetch the live source, (b) work from a user-provided outline, or (c) stub a placeholder marked `DRAFT`. Never present fabricated objectives, durations, or quotes from Anthropic material as authoritative.
- **Diagrams must teach.** A diagram earns its place only if it makes a concept faster to grasp than prose. Skip decorative ones. For each diagram, the lesson MDX should say in one line what the learner should take away from it.
- **Playground safety.** The `/api/claude` route must read the API key from `process.env.ANTHROPIC_API_KEY` only, never accept a key from the client, and rate-limit per session (simple in-memory limiter is fine for v1). Cap `max_tokens` and request size server-side.
- **Recommender is rules-based and testable.** Encode the rules as data (prerequisite graph + audience/level filters + topic affinity). Add a Vitest test for every new rule. Don't call the LLM to recommend.
- **Model selection.** Default to the latest Sonnet for playground calls; expose a model picker for advanced users. Never hardcode a model id in more than one place — put it in `lib/claude.ts`.
- **Branch.** All work on `claude/interactive-course-webapp-y3ayM`.
- **Output style.** Keep components small and prose tight. Lesson copy is plain English, second person, no marketing voice. No emojis unless the user asks.

## Locked decisions (do not relitigate)

1. **Progress storage**: Auth + cloud sync via Auth.js + Prisma. No localStorage-only mode.
2. **Playground**: Real Claude API via server route (`/api/claude`). `ANTHROPIC_API_KEY` server-side only. Rate-limit per session.
3. **Catalog**: Hand-maintained `content/courses.json` sourced from `anthropic.skilljar.com` (Skilljar courses) and `github.com/anthropics/courses` (CC BY-NC GitHub courses with attribution). No build-time scraping.
4. **Hosting**: Vercel. Postgres on Neon. GitHub OAuth via Auth.js. End-to-end walkthrough in `DEPLOY.md` — keep it current when the deploy story changes.
5. **Commercial use**: **Forbidden by license** for any `source: "anthropic-github"` content (CC BY-NC 4.0). The app is and stays free. If that ever changes, the ported GitHub courses must be removed or relicensed first.
