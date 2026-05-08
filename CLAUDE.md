# claude-course-interactive

Interactive webapp that teaches the content of Anthropic's free Claude courses (https://claude.com/resources/courses) in a more visual, hands-on, gamified way than passively reading the originals. Users pick goals, get a recommended learning path across the catalog, and progress through bite-sized lessons with diagrams, live API playgrounds, quizzes, and exercises.

## Source of truth: the course catalog

The canonical list lives at https://claude.com/resources/courses and changes over time. Do **not** hardcode course metadata from memory or training data — it goes stale and Anthropic adds/renames courses.

Implementation rule: keep the catalog in `content/courses.json` (or `content/courses/*.md` with front-matter), and treat it as the single source consumed by the UI, the recommender, and the progress tracker. When asked to "add a course" or "refresh the catalog," update that file — never sprinkle course strings through components.

Each course entry must carry at minimum:
- `id` (stable slug, e.g. `prompt-engineering-interactive`)
- `title`
- `url` (link back to the original Anthropic course)
- `audience`: one or more of `developer`, `technical-builder`, `business-user`, `admin`, `general`
- `level`: `beginner` | `intermediate` | `advanced`
- `durationMinutes` (estimate)
- `topics`: tag list (e.g. `prompting`, `tool-use`, `mcp`, `agents`, `claude-code`, `evals`, `api`, `ai-fluency`)
- `prerequisites`: array of course ids
- `summary` (1–2 sentences)
- `learningObjectives` (3–6 bullets)

Known courses as of the last manual sync (verify against the live page before relying on this list — names and availability change):
- Claude with the Claude API (developer onboarding to the API)
- Prompt engineering interactive tutorial
- Real-world prompting
- Prompt evaluations
- Tool use with Claude
- Model Context Protocol (MCP)
- Claude Code in action
- Building with Claude (agents / multi-step workflows)
- AI fluency (non-technical foundations)

If you cannot verify a course is still listed, mark it `status: "unverified"` in the JSON rather than silently dropping or inventing one.

## Product shape

Three things the app must do well:

1. **Recommend a path.** Onboarding asks the user a few questions (role, goal, experience, time budget) and outputs an ordered learning path drawn from the catalog. The recommender is a pure function over `(userProfile, catalog) -> orderedCourseIds[]` — keep it in `lib/recommender.ts` so it's unit-testable without spinning up the UI. Rules-based is fine; do not introduce an LLM-based recommender unless asked.

2. **Teach interactively.** Each course is broken into lessons. A lesson is more than prose:
   - **Diagrams** for architecture/flow concepts (tool use loop, MCP client/server, agent loop, prompt-caching layers). Use Mermaid for flowcharts and a lightweight SVG/React component for custom visuals. Prefer Mermaid over hand-drawn SVG when it fits.
   - **Live playground** for prompting/tool-use/MCP lessons: editable prompt + "Run" button that calls the Claude API server-side and streams the response. Never expose the API key to the browser.
   - **Checks for understanding**: short quizzes (MCQ, fill-in, "fix this prompt") with immediate feedback, not just an end-of-course test.
   - **Apply-it exercises**: a small task the learner completes in the playground and self-checks against a rubric.

3. **Track progress.** Per-course completion %, per-lesson done/not-done, quiz scores, and a resumable "continue where you left off" entry point. Local-first (localStorage/IndexedDB) is acceptable for v1; only add auth + a backend store if the user explicitly asks.

## Tech defaults

Pick these unless the user says otherwise — don't relitigate every session:
- **Framework**: Next.js (App Router) + TypeScript.
- **Styling**: Tailwind CSS. Ship a clean light/dark theme; no decorative gradients or chartjunk.
- **Diagrams**: Mermaid (`mermaid` npm package) rendered client-side; custom React/SVG for anything Mermaid can't express.
- **Code blocks**: Shiki for syntax highlighting.
- **Content**: MDX for lesson bodies so diagrams, quizzes, and playground embeds can live inline as components.
- **Claude API**: `@anthropic-ai/sdk`, called only from Next.js route handlers (`app/api/claude/route.ts`). Stream responses. Default model: latest Sonnet (`claude-sonnet-4-6` at time of writing — bump when newer versions ship, see "Model selection" below).
- **State**: React Server Components for static content; `zustand` or React context for client-side progress; `localStorage` for persistence in v1.
- **Tests**: Vitest for `lib/` (recommender, content loaders). Playwright only if the user asks for E2E.

Avoid: heavy CMS, auth providers, databases, analytics SDKs, animation libraries, or LMS frameworks until explicitly requested. Keep `package.json` small.

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

## Open questions to confirm before major work

Ask once, then proceed:
1. Is local-only progress (localStorage) acceptable for v1, or is auth + sync required?
2. Should the playground call the real Claude API (needs key + cost) or use canned responses for v1?
3. Is the live https://claude.com/resources/courses catalog OK to scrape on a build step, or should the catalog be hand-maintained in `courses.json`?
