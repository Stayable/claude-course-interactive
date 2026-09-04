# claude-course-interactive — TODO

## Current Sprint
- [ ] Vercel deploy — **work happens in browser, not in this repo**. Walkthrough is in `DEPLOY.md`. User chose **Neon** for prod Postgres, **SQLite locally**. Steps remaining on user side:
  - [ ] Create Neon project; copy pooled + direct connection strings
  - [ ] Create production GitHub OAuth app (callback URL = `https://<vercel-domain>/api/auth/callback/github`)
  - [ ] Import `Stayable/claude-course-interactive` into Vercel; paste env vars (`ANTHROPIC_API_KEY`, `AUTH_SECRET`, `AUTH_GITHUB_ID`, `AUTH_GITHUB_SECRET`, `DATABASE_URL`)
  - [ ] First deploy
  - [ ] Run `DATABASE_URL="<neon-direct>" npm run db:push` locally to create tables in Neon
- [ ] Wire the "mark complete" button to actually call `/api/progress` (route exists; button currently doesn't fetch). Needed before progress tracking is meaningful.
- [ ] Verify Auth.js GitHub flow works locally before deploy (needs `AUTH_GITHUB_ID`/`SECRET` filled in `.env`).

## Backlog
- [ ] Swap "Boca Raton" in 5 lesson examples for a neutral city (Tokyo / SF) — user flagged it as a possible tell about who built the app, deferred.
- [ ] Author lessons for the next course in priority order (likely `claude-code-101` per the developer-beginner track).
- [ ] Decide what to do with orphan MDX (`content/courses/prompt-engineering-interactive/` and `content/courses/tool-use/`) — those slugs aren't in the catalog. Options: (a) repurpose under `claude-with-the-anthropic-api`, (b) delete.
- [ ] Onboarding questionnaire → recommended path UI polish (functional, needs styling pass).
- [ ] QuizAttempt persistence (each quiz submit → API write) so we can show "you got 4/5 on this lesson last time".
- [ ] Eventually rename git remote URL casing: `git remote set-url origin https://github.com/Stayable/claude-course-interactive.git` (currently lowercase, GitHub redirects work but warning shows on push).
- [ ] Long-term: move the repo off the Stayable org since the app is positioned as unaffiliated.

## In Progress
*(none)*

## Completed
- [x] Scaffold Next.js + Auth.js + Prisma app
- [x] Add CLAUDE.md scoping the project
- [x] Add `start-claude.bat` Windows launcher
- [x] Fix CLAUDE.md: source URL → Skilljar, replace stale 9-course list with verified 18, add named learning tracks
- [x] Update `lib/types.ts` taxonomy (Audience: general/developer/education/business/nonprofit; new Topic list; new Goal enum; +category/lectureCount/quizCount on Course)
- [x] Rewrite `content/courses.json` with 18 verified Skilljar courses
- [x] Update `lib/recommender.ts` GOAL_TOPIC_AFFINITY for new topics/goals; fix budget-check bug (prereq cost wasn't counted)
- [x] Update `lib/recommender.test.ts` to assert against real course ids
- [x] Update `app/onboarding/page.tsx` dropdowns to new Audience/Goal enums
- [x] Built interactive lesson primitives: `Reveal`, `SurfaceMap`, `Compare`, `TypingDemo`, `RoleSwitcher` (CSS-driven, no animation library)
- [x] Backfilled `learningObjectives` for `claude-101` in `content/courses.json`
- [x] Authored all 13 Claude 101 lessons; every route smoke-tested 200 against dev server
- [x] Extended catalog schema with `source` + `attribution` fields; added 5 Anthropic GitHub courses (CC BY-NC 4.0) alongside the 18 Skilljar courses
- [x] Built `Attribution` component used in lesson footers
- [x] Added `prefill` support to Playground + /api/claude route (assistant-turn prefill is core to the prompt-eng course)
- [x] Ported the full Prompt Engineering Interactive Tutorial (12 lessons: 9 chapters + 3 appendices) under CC BY-NC attribution; all routes smoke-tested 200
- [x] Split Prisma schema for dual provider: `schema.prisma` = postgresql (prod), `schema.local.prisma` = sqlite (local). `npm run dev` regenerates against local schema; `npm run build` regenerates against prod.
- [x] Wrote `DEPLOY.md` — full Neon + Vercel + GitHub OAuth walkthrough.
- [x] Refreshed `.env.example` to document local + prod env shapes.
- [x] Updated CLAUDE.md: dual-source catalog rules, CC BY-NC commercial restriction, dual-schema setup, Vercel + Neon as hosting decision.
- [x] `npm run build` verified clean; 5/5 vitest pass; `tsc --noEmit` clean.
- [x] Committed and pushed all session work to `origin/claude/interactive-course-webapp-y3ayM` (`16af993` + `81fcacf`).
- [x] Removed Stayable property references from app content (RAG example in lesson 12 swapped to a Northwood Public Library mini-corpus; DEPLOY.md placeholder genericized).
- [x] Added `.claude/` and `tsconfig.tsbuildinfo` to `.gitignore`.
