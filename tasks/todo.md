# Task List: ScratchGolf Training App

See `tasks/plan.md` for architecture decisions and phase overview.
See `SPEC.md` for the full specification.

## Phase 1: Foundation

### Task 1: Scaffold the Next.js project

**Description:** Create the Next.js (App Router) + TypeScript + Tailwind
project skeleton and get it deployed to Vercel as a placeholder.

**Acceptance criteria:**
- [x] `npx create-next-app` project exists with TypeScript + Tailwind + App Router
- [x] Basic layout (`app/layout.tsx`) with mobile-first viewport meta and a
      placeholder home page
- [x] Project pushed and connected to Vercel, deploys successfully

**Verification:**
- [x] Build succeeds: `npm run build`
- [x] Manual check: deployed URL loads on a phone browser — confirmed by user

**Dependencies:** None

**Files likely touched:**
- `app/layout.tsx`, `app/page.tsx`, `package.json`, `tailwind.config.ts`,
  `tsconfig.json`

**Estimated scope:** Small

---

### Task 2: Prisma schema + Postgres (Neon) connection

**Description:** Add Prisma, define the `Drill`, `ScoreLog`, `WeeklyPlan`
models from `SPEC.md`, connect to a Neon Postgres database via Vercel's
integration, and run the initial migration.

**Acceptance criteria:**
- [x] `prisma/schema.prisma` matches the data model in `SPEC.md`
- [x] `DATABASE_URL` configured (`.env.example` documents it; real Neon DB
      created and connected via Vercel Storage)
- [x] Initial migration applied; `lib/db.ts` exports a singleton Prisma client
      (Prisma 7 changed the client constructor to require a driver
      adapter — used `@prisma/adapter-neon`, see commit)

**Verification:**
- [x] `npx prisma migrate dev` runs clean — verified against a throwaway
      local Postgres instance; migration SQL matches SPEC.md's data model
      exactly
- [x] Manual check: tables created in the real Neon DB — this sandbox
      can't reach Postgres directly (HTTPS-only egress), so the user ran
      the migration SQL via Neon's own SQL Editor instead; confirmed
      "statement executed successfully"

**Dependencies:** Task 1

**Files likely touched:**
- `prisma/schema.prisma`, `lib/db.ts`, `.env.example`

**Estimated scope:** Small

---

### Task 3: Password-gate auth

**Description:** Implement the single shared-password auth flow: login
page, API route that checks `APP_PASSWORD` and sets a signed HTTP-only
session cookie, and middleware that protects all other routes.

**Acceptance criteria:**
- [x] `/login` page with a password field
- [x] `POST /api/auth/login` validates against `APP_PASSWORD` and sets a
      signed session cookie on success, returns an error on failure
- [x] Middleware (now `proxy.ts` — Next.js 16 renamed the convention)
      redirects unauthenticated requests to any other route to `/login`
- [x] A logout action clears the cookie

**Verification:**
- [x] Build succeeds: `npm run build`
- [x] Manual check: wrong password rejected (401), correct password
      grants access and persists across requests (200), logout clears it,
      next request redirects to `/login` (307) — verified end-to-end
      against a running dev server

**Dependencies:** Task 1

**Files likely touched:**
- `app/login/page.tsx`, `app/api/auth/login/route.ts`,
  `app/api/auth/logout/route.ts`, `proxy.ts`, `lib/session.ts`

**Estimated scope:** Medium

---

## Checkpoint: Foundation
- [x] `npm run build` succeeds
- [x] App deploys to Vercel and shows a placeholder home page
- [x] Visiting any page redirects to `/login` when unauthenticated
- [x] Correct password sets a session cookie and grants access
- [x] **Reviewed with human — confirmed working live on phone browser**

**Foundation phase complete.** App is live on Vercel with a real Neon
Postgres database, migrated and connected. Ready for Phase 2.

---

## Phase 2: Core Features

### Task 4: Curriculum seed data + drill library browse page

**Description:** Author an initial drill curriculum (driver, approach,
chipping, putting) as a Prisma seed script, and build a browse page
listing drills grouped by skill area.

**Acceptance criteria:**
- [x] Seed script creates a reasonable initial set of drills per skill
      area (each with name, description, instructions, scoreLabel) —
      13 drills across the 4 skill areas
- [x] `/drills` page lists drills grouped/filterable by skill area
- [x] Tapping a drill navigates to its detail page (stub is fine for now,
      built out in Task 5)

**Verification:**
- [x] `npx prisma db seed` runs clean — verified by running the seed
      logic directly against a throwaway local Postgres instance (this
      sandbox can't reach Neon's serverless driver locally, so verified
      query/schema correctness with a temporary, uncommitted pg adapter
      swap rather than the shipped Neon adapter); all 13 drills inserted
- [x] Manual check: `/drills` renders all seeded drills grouped by skill
      area, and `/drills/[id]` renders real drill content — verified via
      a real running dev server (login, fetch, grep for actual content),
      not just a build check

**Dependencies:** Task 2, Task 3

**Files likely touched:**
- `prisma/seed.ts`, `app/drills/page.tsx`, `components/DrillList.tsx`

**Estimated scope:** Medium

---

### Task 5: Drill detail page + score logging

**Description:** Build the drill detail page (instructions + scoring
format) and the score-logging form, wired to a new API route.

**Acceptance criteria:**
- [x] `/drills/[id]` shows the drill's instructions and scoring format
- [x] A form logs a score in 2 inputs (value + optional note)
- [x] `POST /api/scores` creates a `ScoreLog` linked to the drill
- [x] Newly logged scores appear on the page (recent-scores list, 10 max)

**Verification:**
- [x] Build succeeds: `npm run build`
- [x] Manual check: logged real scores via HTTP against a throwaway
      Postgres instance, confirmed they persist and render (value +
      note), confirmed 400 (missing value) and 404 (bad drillId) paths

**Dependencies:** Task 4

**Files likely touched:**
- `app/drills/[id]/page.tsx`, `app/api/scores/route.ts`,
  `components/ScoreLogForm.tsx`

**Estimated scope:** Medium

---

### Task 6: Trends view

**Description:** Add a view of score trends over time, both per-drill and
aggregated per skill area.

**Acceptance criteria:**
- [x] Per-drill trend visible on the drill detail page (inline SVG chart
      of `ScoreLog.value` over `loggedAt`, no new dependency)
- [x] A `/trends` page shows drills grouped by skill area, each with its
      own trend (kept per-drill rather than blended into one number per
      area, since drills in the same area use incompatible units)
- [x] Renders sensibly with zero, one, and many data points

**Verification:**
- [x] Build succeeds: `npm run build`; `npm test` passes (6 tests,
      TDD - RED caught a real bug in the identical-values edge case
      before GREEN)
- [x] Manual check: verified all three states (0/1/4 scores) against a
      throwaway Postgres instance on both `/trends` and the drill
      detail page

**Dependencies:** Task 5

**Files likely touched:**
- `app/trends/page.tsx`, `components/TrendChart.tsx`,
  `app/api/scores/route.ts` (add a GET/aggregate handler if needed)

**Estimated scope:** Medium

---

### Task 7: Home screen + weekly plan display

**Description:** Build the home screen that shows the current
`WeeklyPlan` (summary + focus items), with a sensible empty state when
none exists yet.

**Acceptance criteria:**
- [x] `/` shows the latest `WeeklyPlan`'s summary and focus items
      (drill, target, why) when one exists
- [x] Shows an empty state with a call-to-action when no plan exists yet
- [x] Each focus item links to its drill

**Verification:**
- [x] Build succeeds: `npm run build`
- [x] Manual check: verified against a throwaway Postgres instance —
      empty state renders with no WeeklyPlan row; after inserting one
      referencing real drills, summary/names/links/reps/notes all
      render correctly

**Dependencies:** Task 4

**Files likely touched:**
- `app/page.tsx`, `components/WeeklyPlanCard.tsx`

**Estimated scope:** Small

---

### Task 8: Plan-regeneration nudge logic + banner

**Description:** Implement the pure nudge-threshold function from
`SPEC.md` and surface it as a banner on the home screen.

**Acceptance criteria:**
- [x] `lib/planNudge.ts` exports a function taking the last plan's
      `generatedAt` (or `null`) and the count of `ScoreLog`s logged since,
      returning whether to nudge (per SPEC.md: `daysSinceLastPlan >= 7` OR
      `newScoreLogsSinceLastPlan >= 10`, always true if no plan exists)
- [x] Home screen shows a banner/badge when the nudge is active, with a
      link/button to regenerate (button present but inert - wired in Task 9)

**Verification:**
- [x] Unit test: `npm test` covers no-plan, time-threshold (both sides of
      the boundary), volume-threshold (both sides), and both-thresholds
      cases — 7 tests, TDD
- [x] Manual check: verified against a throwaway Postgres instance across
      3 real scenarios (fresh plan, 8-day-old plan, 12 new scores) —
      banner appeared/disappeared exactly as expected each time

**Dependencies:** Task 7

**Files likely touched:**
- `lib/planNudge.ts`, `lib/planNudge.test.ts`, `components/PlanNudgeBanner.tsx`

**Estimated scope:** Small

---

### Task 9: Plan regeneration via Anthropic API

**Description:** Implement the "Regenerate plan" action: a server route
that gathers recent score history and the drill library, calls the
Anthropic API to produce a new weekly plan, validates the response shape,
and stores it as a new `WeeklyPlan`.

**Acceptance criteria:**
- [x] `POST /api/plan/regenerate` builds a prompt from recent `ScoreLog`s
      and the `Drill` library, calls the Anthropic API server-side (key
      never sent to the client)
- [x] Response is validated against an expected shape (Zod schema:
      narrative summary + list of `{drillId, focusNote, targetReps}`,
      plus a check that every drillId is real); on validation failure,
      returns a 502 error instead of storing malformed data
- [x] On success, stores a new `WeeklyPlan` and the home screen reflects it
- [x] "Regenerate" button on the home screen (nudge banner + empty-state
      "Generate my first plan") triggers this and shows a loading state

**Verification:**
- [x] Unit test: `buildPlanPrompt` tested with drill/score inputs (no live
      API call in tests) — 5 tests
- [x] Manual check: trigger regeneration for real, confirm a sensible plan
      is generated and displayed — **confirmed live by the user**: a real
      balanced starter plan generated across all 4 skill areas, with
      benchmark-aware reasoning in every focus item (e.g. "scratch golfers
      find the sweet zone on 8-9 of 10"), exactly as designed

**Dependencies:** Task 8

**Files likely touched:**
- `app/api/plan/regenerate/route.ts`, `lib/anthropic.ts`,
  `lib/buildPlanPrompt.ts`, `lib/buildPlanPrompt.test.ts`,
  `components/WeeklyPlanCard.tsx`

**Estimated scope:** Medium

---

## Checkpoint: Core Features
- [x] End-to-end flow works: log in → browse drills (36, organized by
      skill area and difficulty tier) → regenerate plan → real
      benchmark-aware AI plan generated and displayed. Confirmed live by
      the user in production.
- [x] **Reviewed with human** — hit and resolved several real production
      issues along the way (see below), all fixed and verified live.

**Core Features phase complete.** Notable issues found and fixed during
this phase, beyond the original task list:
- Vercel serverless function default timeout (10s) was too short for
  Claude's response time — fixed with `maxDuration = 60`.
- Error handling in the regenerate route only caught Anthropic SDK
  errors, not all failures — widened to a catch-all with real error
  messages surfaced to the UI.
- Two separate Vercel projects existed for this repo; `ANTHROPIC_API_KEY`
  was only in one. Resolved by confirming the correct project.
- The correct project's `DATABASE_URL` had been set manually and pointed
  at a stale/wrong database rather than being linked via Vercel's Storage
  integration — reconnected properly.
- Per user request, upgraded the curriculum (13 → 36 drills, added
  difficulty tiers and scratch-golfer benchmarks) and the plan-generation
  prompt to reason about benchmark comparison and tier progression.

---

## Phase 3: Polish

### Task 10: Mobile UI / aesthetic polish pass

**Description:** Pass over every screen built in Phase 2 for visual
polish — spacing, typography, color system, touch target sizing,
transitions — since SPEC.md treats this as a first-class requirement, not
cosmetic-only.

**Acceptance criteria:**
- [ ] Consistent spacing/typography scale applied across all screens
- [ ] Touch targets sized appropriately for mobile (buttons, inputs)
- [ ] A coherent color palette (not default Tailwind grays/blues) fitting
      a golf/training aesthetic
- [ ] No layout breakage at common phone widths (375px–430px)

**Verification:**
- [ ] Manual check: walk through every screen on an actual phone browser

**Dependencies:** Task 9

**Files likely touched:**
- `app/globals.css`, `tailwind.config.ts`, most `components/*`

**Estimated scope:** Medium

---

### Task 11: Unit tests for core logic

**Description:** Fill in any remaining test coverage gaps for the
project's core logic per `SPEC.md`'s Testing Strategy (nudge logic and
prompt construction are covered in Tasks 8–9; this task covers any
scoring/aggregation helpers used by the trends view).

**Acceptance criteria:**
- [ ] Aggregation helpers used in Task 6 have unit tests
- [ ] `npm test` passes with no skipped/pending tests

**Verification:**
- [ ] `npm test` passes
- [ ] `npx tsc --noEmit` passes

**Dependencies:** Task 6

**Files likely touched:**
- `lib/*.test.ts`

**Estimated scope:** Small

---

### Task 12: Deployment finalization

**Description:** Finalize the production deployment: confirm all env vars
are set on Vercel, do a full smoke test against the production URL from
an actual phone.

**Acceptance criteria:**
- [ ] `APP_PASSWORD`, `DATABASE_URL`, `ANTHROPIC_API_KEY` all set in
      Vercel project settings (not committed to the repo)
- [ ] Production build succeeds and deploys
- [ ] Full user flow smoke-tested on the live URL from a phone

**Verification:**
- [ ] Manual check: complete login → browse → log score → trends →
      regenerate plan flow on the deployed URL

**Dependencies:** Task 10, Task 11

**Files likely touched:**
- None (configuration only)

**Estimated scope:** Small

---

## Checkpoint: Complete
- [ ] All Success Criteria in `SPEC.md` are met
- [ ] `npm test` and `npx tsc --noEmit` pass
- [ ] Manually verified on an actual phone browser, not just responsive
      devtools
- [ ] Ready for review
