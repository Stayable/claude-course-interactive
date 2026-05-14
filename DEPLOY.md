# Deploying to Vercel

End-to-end walkthrough. Estimated time: 15 minutes the first time, 30 seconds after.

## Prerequisites

- A Vercel account ([vercel.com](https://vercel.com))
- A Neon account ([neon.tech](https://neon.tech)) — free tier is enough
- The repo pushed to GitHub (`github.com/<your-github-account>/claude-course-interactive`) — currently at `github.com/Stayable/claude-course-interactive` until moved
- An Anthropic API key

## Step 1 — Create a Neon Postgres database

1. Sign in at [neon.tech](https://neon.tech).
2. **Create Project** → pick a region close to your Vercel region (usually US East). Name: `claude-course-interactive`.
3. After creation, open the **Connection Details** panel.
4. Copy the **pooled connection string** (it includes `pgbouncer=true` or `-pooler` in the host). Save it — you'll paste it into Vercel in a moment. It looks like:
   ```
   postgres://<user>:<pwd>@<host>-pooler.<region>.aws.neon.tech/<db>?sslmode=require
   ```
5. Also copy the **direct (non-pooled)** connection string — needed for Prisma migrations.

## Step 2 — Create a GitHub OAuth app (production)

1. Go to [github.com/settings/developers](https://github.com/settings/developers) → **OAuth Apps** → **New OAuth App**.
2. Fill in:
   - **Application name**: `Claude Course Interactive`
   - **Homepage URL**: leave blank for now; we'll come back after Vercel gives us a URL.
   - **Authorization callback URL**: leave blank for now too.
3. Click **Register application**.
4. Click **Generate a new client secret**. Copy both the **Client ID** and the **Client Secret**. The secret is shown only once.

## Step 3 — Import the repo into Vercel

1. Go to [vercel.com/new](https://vercel.com/new).
2. Find `<your-github-account>/claude-course-interactive` in the GitHub list, click **Import**.
3. Framework Preset: should auto-detect **Next.js**.
4. **Environment Variables** — add these (don't deploy yet):
   - `ANTHROPIC_API_KEY` → your Anthropic key
   - `AUTH_SECRET` → output of `openssl rand -base64 32` (or use Vercel's "Generate" button if available)
   - `AUTH_GITHUB_ID` → the Client ID from Step 2
   - `AUTH_GITHUB_SECRET` → the Client Secret from Step 2
   - `DATABASE_URL` → the **pooled** Neon connection string from Step 1
5. Click **Deploy**.
6. First build will run. It will fail at first because the OAuth app callback URL isn't right yet — that's fine.

## Step 4 — Get your Vercel URL and complete the OAuth app

1. Once the deploy lands (even if the auth page errors), Vercel will show you the project URL — something like `claude-course-interactive-<random>.vercel.app`.
2. Go back to the GitHub OAuth app from Step 2.
3. Set:
   - **Homepage URL**: `https://<your-vercel-domain>`
   - **Authorization callback URL**: `https://<your-vercel-domain>/api/auth/callback/github`
4. Save.

If you have a custom domain you'll add later, you'll come back and add it as a second callback URL.

## A note on the two Prisma schemas

This repo has **two** Prisma schema files:
- `prisma/schema.prisma` — Postgres (prod, Neon). Used by `npm run build` and `npm run db:push`.
- `prisma/schema.local.prisma` — SQLite (local dev). Used by `npm run dev` and `npm run db:push:local`.

`npm run dev` automatically regenerates the Prisma client against the local SQLite schema before starting the dev server, so it Just Works locally.

`npm run build` regenerates against the Postgres schema. That's what Vercel runs, so production uses the Postgres client.

If you ever see a `Prisma Client configured for a different datasource` error, you've crossed wires — re-run `npm run dev` (regenerates for sqlite) or `npm run db:generate` (regenerates for postgres).

## Step 5 — Push the database schema

The Vercel build runs `prisma generate` but does **not** apply migrations. You need to push the schema to Neon once.

From your local machine:

```bash
# Use the DIRECT (non-pooled) Neon URL for this — pooled URLs reject DDL.
DATABASE_URL="postgres://...direct..." npm run db:push
```

This creates the User, Account, Session, Progress, QuizAttempt tables in Neon.

You only need to do this once, and again whenever the schema changes.

## Step 6 — Verify

1. Open `https://<your-vercel-domain>/`.
2. Click **Sign in** (top right, once we wire it). Choose GitHub. Authorize the OAuth app.
3. Open a lesson, click **Mark complete** (when wired). Refresh — your progress should persist.
4. Try a Playground — confirm the Anthropic API call works.

## Re-deploying

Every push to `main` triggers a Vercel deploy. To deploy a branch as a preview:

```bash
git push origin <branch-name>
```

Vercel comments on the PR with a preview URL automatically.

## Common gotchas

- **`PrismaClientInitializationError`** on Vercel: `DATABASE_URL` env var isn't set, or you used the direct URL where you should have used the pooled URL. App requests use pooled; migrations use direct.
- **OAuth redirect mismatch**: the callback URL in GitHub doesn't exactly match the Vercel URL (typos, missing `/api/auth/callback/github`).
- **`AUTH_SECRET` missing**: signing key for sessions. Generate fresh; don't reuse the local one.
- **Build fails on `prisma generate`**: usually means the schema file isn't where Prisma expects. Check that `prisma/schema.prisma` (the Postgres one) is committed.

## What's not in scope here

- Email magic-link auth (CLAUDE.md notes it can be added later)
- Production rate-limit storage (current in-memory limiter resets per serverless instance — fine for v1, replace with Redis later if needed)
- Cron jobs / scheduled tasks
- Vercel Analytics (we deliberately keep package.json small)
