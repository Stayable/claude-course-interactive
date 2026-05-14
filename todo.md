# claude-course-interactive — TODO

## Current Sprint
- [ ] Vercel deploy prep
  - [ ] Pick prod Postgres (Vercel Postgres / Neon / Supabase)
  - [ ] Create GitHub OAuth app, set `GITHUB_ID` / `GITHUB_SECRET` in Vercel env
  - [ ] Set `ANTHROPIC_API_KEY`, `NEXTAUTH_SECRET`, `DATABASE_URL` in Vercel env
  - [ ] Wire the "mark complete" button to actually call `/api/progress` and persist a Progress row
  - [ ] Verify Auth.js GitHub flow works locally before deploy

## Backlog
- [ ] Author lessons for the next course in priority order (likely `claude-code-101` per the developer-beginner track)
- [ ] Decide what to do with orphan MDX (`content/courses/prompt-engineering-interactive/` and `content/courses/tool-use/`) — those slugs aren't in the catalog. Options: (a) repurpose under `claude-with-the-anthropic-api`, (b) delete.
- [ ] Onboarding questionnaire → recommended path UI polish (functional, needs styling pass)
- [ ] QuizAttempt persistence (each quiz submit → API write) so we can show "you got 4/5 on this lesson last time"

## Completed
- [x] Scaffold Next.js + Auth.js + Prisma app
- [x] Add CLAUDE.md scoping the project
- [x] Add `start-claude.bat` Windows launcher
- [x] Fix CLAUDE.md: source URL → Skilljar, replace stale 9-course list with verified 18, add named learning tracks
- [x] Update `lib/types.ts` taxonomy (Audience: general/developer/education/business/nonprofit; new Topic list; new Goal enum; +category/lectureCount/quizCount on Course)
- [x] Rewrite `content/courses.json` with 18 verified Skilljar courses
- [x] Update `lib/recommender.ts` GOAL_TOPIC_AFFINITY for new topics/goals
- [x] Update `lib/recommender.test.ts` to assert against real course ids
- [x] Update `app/onboarding/page.tsx` dropdowns to new Audience/Goal enums
- [x] Built interactive lesson primitives: `Reveal`, `SurfaceMap`, `Compare`, `TypingDemo`, `RoleSwitcher` (CSS-driven, no animation library)
- [x] Backfilled `learningObjectives` for `claude-101` in `content/courses.json`
- [x] Authored all 13 Claude 101 lessons; every route smoke-tested 200 against dev server
- [x] Extended catalog schema with `source` + `attribution` fields; added 5 Anthropic GitHub courses (CC BY-NC 4.0) alongside the 18 Skilljar courses
- [x] Built `Attribution` component used in lesson footers
- [x] Added `prefill` support to Playground + /api/claude route (assistant-turn prefill is core to the prompt-eng course)
- [x] Ported the full Prompt Engineering Interactive Tutorial (12 lessons: 9 chapters + 3 appendices) under CC BY-NC attribution; all routes smoke-tested 200
