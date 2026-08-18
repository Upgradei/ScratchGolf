# Task List: ScratchGolf Training App

See `tasks/plan.md` for architecture decisions and phase overview.
See `SPEC.md` for the full specification.

## Phase 1: Foundation

### Task 1: Scaffold the Next.js project

**Description:** Create the Next.js (App Router) + TypeScript + Tailwind
project skeleton and get it deployed to Vercel as a placeholder.

**Acceptance criteria:**
- [ ] `npx create-next-app` project exists with TypeScript + Tailwind + App Router
- [ ] Basic layout (`app/layout.tsx`) with mobile-first viewport meta and a
      placeholder home page
- [ ] Project pushed and connected to Vercel, deploys successfully

**Verification:**
- [ ] Build succeeds: `npm run build`
- [ ] Manual check: deployed URL loads on a phone browser

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
- [ ] `prisma/schema.prisma` matches the data model in `SPEC.md`
- [ ] `DATABASE_URL` configured (local `.env` for dev, Vercel env var for prod)
- [ ] Initial migration applied; `lib/db.ts` exports a singleton Prisma client

**Verification:**
- [ ] `npx prisma migrate dev` runs clean
- [ ] Manual check: `npx prisma studio` shows the three empty tables

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
- [ ] `/login` page with a password field
- [ ] `POST /api/auth/login` validates against `APP_PASSWORD` and sets a
      signed session cookie on success, returns an error on failure
- [ ] Middleware redirects unauthenticated requests to any other route to
      `/login`
- [ ] A logout action clears the cookie

**Verification:**
- [ ] Build succeeds: `npm run build`
- [ ] Manual check: wrong password rejected, correct password grants
      access and persists across a page reload

**Dependencies:** Task 1

**Files likely touched:**
- `app/login/page.tsx`, `app/api/auth/login/route.ts`, `middleware.ts`,
  `lib/session.ts`

**Estimated scope:** Medium

---

## Checkpoint: Foundation
- [ ] `npm run build` succeeds
- [ ] App deploys to Vercel and shows a placeholder home page
- [ ] Visiting any page redirects to `/login` when unauthenticated
- [ ] Correct password sets a session cookie and grants access
- [ ] **Review with human before proceeding**

---

## Phase 2: Core Features

### Task 4: Curriculum seed data + drill library browse page

**Description:** Author an initial drill curriculum (driver, approach,
chipping, putting) as a Prisma seed script, and build a browse page
listing drills grouped by skill area.

**Acceptance criteria:**
- [ ] Seed script creates a reasonable initial set of drills per skill
      area (each with name, description, instructions, scoreLabel)
- [ ] `/drills` page lists drills grouped/filterable by skill area
- [ ] Tapping a drill navigates to its detail page (stub is fine for now,
      built out in Task 5)

**Verification:**
- [ ] `npx prisma db seed` runs clean
- [ ] Manual check: `/drills` renders all seeded drills on a phone-width
      viewport

**Dependencies:** Task 2, Task 3

**Files likely touched:**
- `prisma/seed.ts`, `app/drills/page.tsx`, `components/DrillList.tsx`

**Estimated scope:** Medium

---

### Task 5: Drill detail page + score logging

**Description:** Build the drill detail page (instructions + scoring
format) and the score-logging form, wired to a new API route.

**Acceptance criteria:**
- [ ] `/drills/[id]` shows the drill's instructions and scoring format
- [ ] A form logs a score in ≤3 inputs (value + optional note)
- [ ] `POST /api/scores` creates a `ScoreLog` linked to the drill
- [ ] Newly logged scores appear on the page (e.g. a recent-scores list)

**Verification:**
- [ ] Build succeeds: `npm run build`
- [ ] Manual check: log a score, confirm it persists (reload the page,
      check `prisma studio`)

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
- [ ] Per-drill trend visible on the drill detail page (simple line/points
      chart of `ScoreLog.value` over `loggedAt`)
- [ ] A `/trends` page (or section) shows aggregated trends per skill area
- [ ] Renders sensibly with zero, one, and many data points

**Verification:**
- [ ] Build succeeds: `npm run build`
- [ ] Manual check: log several scores for one drill, confirm the trend
      chart updates and looks correct

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
- [ ] `/` shows the latest `WeeklyPlan`'s summary and focus items
      (drill, target, why) when one exists
- [ ] Shows an empty state with a call-to-action when no plan exists yet
- [ ] Each focus item links to its drill

**Verification:**
- [ ] Build succeeds: `npm run build`
- [ ] Manual check: with an empty DB, empty state renders; after manually
      inserting a `WeeklyPlan` row, it renders correctly

**Dependencies:** Task 4

**Files likely touched:**
- `app/page.tsx`, `components/WeeklyPlanCard.tsx`

**Estimated scope:** Small

---

### Task 8: Plan-regeneration nudge logic + banner

**Description:** Implement the pure nudge-threshold function from
`SPEC.md` and surface it as a banner on the home screen.

**Acceptance criteria:**
- [ ] `lib/planNudge.ts` exports a function taking the last plan's
      `generatedAt` (or `null`) and the count of `ScoreLog`s logged since,
      returning whether to nudge (per SPEC.md: `daysSinceLastPlan >= 7` OR
      `newScoreLogsSinceLastPlan >= 10`, always true if no plan exists)
- [ ] Home screen shows a banner/badge when the nudge is active, with a
      link/button to regenerate (wired in Task 9)

**Verification:**
- [ ] Unit test: `npm test -- planNudge` covers no-plan, time-threshold,
      volume-threshold, and neither-threshold cases
- [ ] Manual check: banner appears/disappears correctly as test data changes

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
- [ ] `POST /api/plan/regenerate` builds a prompt from recent `ScoreLog`s
      and the `Drill` library, calls the Anthropic API server-side (key
      never sent to the client)
- [ ] Response is validated against an expected shape (narrative summary +
      list of `{drillId, focusNote, targetReps}`); on validation failure,
      returns an error instead of storing malformed data
- [ ] On success, stores a new `WeeklyPlan` and the home screen reflects it
- [ ] "Regenerate" button on the home screen (from Task 8's banner or
      always-visible) triggers this and shows a loading state

**Verification:**
- [ ] Unit test: prompt-construction function tested with mocked drill/score
      inputs (no live API call in tests)
- [ ] Manual check: trigger regeneration for real, confirm a sensible plan
      is generated and displayed

**Dependencies:** Task 8

**Files likely touched:**
- `app/api/plan/regenerate/route.ts`, `lib/anthropic.ts`,
  `lib/buildPlanPrompt.ts`, `lib/buildPlanPrompt.test.ts`,
  `components/WeeklyPlanCard.tsx`

**Estimated scope:** Medium

---

## Checkpoint: Core Features
- [ ] End-to-end flow works on a phone-width browser: log in → browse
      drills → log a score → see it reflected in trends → see the nudge
      appear once thresholds are crossed → regenerate plan → see new plan
- [ ] **Review with human before proceeding**

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
