# Spec: ScratchGolf Training App

## Objective

A mobile-friendly personal web app that helps the user become a scratch
golfer as efficiently as possible. It provides a library of practice drills
across driver, approach, chipping, and putting; lets the user log scores
for drills as they practice; shows score trends over time; and generates a
structured weekly training plan (via the Anthropic API) based on recent
performance, triggered manually by the user.

**User:** Solo — the project owner, on their phone, typically at a range
or course.

**Success looks like:** Open the app on a phone, see this week's plan,
tap into a drill, log a score in a few taps, glance at trends whenever,
and regenerate the weekly plan when a nudge suggests it's a good time.

## Tech Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS
- Postgres via Vercel's Neon integration (free tier)
- Prisma as the ORM
- Anthropic API (`@anthropic-ai/sdk`) for weekly plan generation
- Deployed on Vercel (existing free account)
- Vitest for unit tests

## Commands

- Dev: `npm run dev`
- Build: `npm run build`
- Start (prod): `npm run start`
- Test: `npm test`
- Lint: `npm run lint`
- Type check: `npx tsc --noEmit`
- Prisma migrate (dev): `npx prisma migrate dev`
- Prisma studio: `npx prisma studio`

## Project Structure

```
app/                    → Next.js App Router pages & layouts
app/api/                → API route handlers (scores, plan generation, auth)
components/             → Reusable UI components
lib/                    → Shared utilities (db client, anthropic client, plan-nudge logic)
prisma/                 → Prisma schema and migrations
docs/intent/            → Confirmed intent docs (interview-me output)
tasks/                  → Plan and task list (planning-and-task-breakdown output)
```

## Data Model (Prisma)

```prisma
enum SkillArea {
  DRIVER
  APPROACH
  CHIPPING
  PUTTING
}

model Drill {
  id          String   @id @default(cuid())
  name        String
  skillArea   SkillArea
  description String
  instructions String
  scoreLabel  String   // e.g. "makes out of 10", "avg distance to hole (ft)"
  createdAt   DateTime @default(now())
  scoreLogs   ScoreLog[]
}

model ScoreLog {
  id        String   @id @default(cuid())
  drillId   String
  drill     Drill    @relation(fields: [drillId], references: [id])
  value     Float
  note      String?
  loggedAt  DateTime @default(now())
}

model WeeklyPlan {
  id          String   @id @default(cuid())
  generatedAt DateTime @default(now())
  summary     String   // LLM narrative ("focus on short game this week...")
  items       Json     // [{ drillId, focusNote, targetReps }]
}
```

No `User` model — single shared password via env var, no accounts.

## Auth

- One password stored as an env var (`APP_PASSWORD`).
- A login route checks the submitted password server-side and, on match,
  sets an HTTP-only, secure, signed session cookie.
- Middleware checks the cookie on every route except `/login` and redirects
  to `/login` if missing/invalid.
- No password reset, no signup, no multi-user support.

## Core Features

1. **Drill library** — Browseable by skill area (Driver / Approach /
   Chipping / Putting). Each drill has instructions and a defined scoring
   format. Seeded with an initial curriculum authored as part of this
   project (not user-editable in v1).

2. **Score logging** — From a drill's page, log a score in minimal taps
   (numeric input + optional note). Stored as a `ScoreLog` linked to the
   drill and timestamp.

3. **Trends view** — Per-drill and per-skill-area charts/trends of scores
   over time, viewable any time (not just after a plan regenerates).

4. **Weekly plan** — A `WeeklyPlan` record with a short narrative summary
   and a list of focus items (drill + target + why). Displayed on the
   home screen as "this week's plan."

5. **Manual plan regeneration with a nudge** — A "Regenerate plan" action
   the user triggers manually. The app shows a nudge (banner/badge) when
   regeneration is likely worthwhile:
   - `daysSinceLastPlan >= 7`, OR
   - `newScoreLogsSinceLastPlan >= 10`

   computed by comparing `WeeklyPlan.generatedAt` (most recent) against
   `now()` and counting `ScoreLog` rows logged after that timestamp. If no
   plan exists yet, the nudge always shows. Regeneration calls the
   Anthropic API server-side with recent score history and the current
   drill library, and stores the result as a new `WeeklyPlan`.

## Code Style

```tsx
// components/ScoreLogForm.tsx
'use client';

import { useState } from 'react';

export function ScoreLogForm({ drillId }: { drillId: string }) {
  const [value, setValue] = useState('');

  async function submit() {
    await fetch('/api/scores', {
      method: 'POST',
      body: JSON.stringify({ drillId, value: Number(value) }),
    });
  }

  return (
    <form action={submit} className="flex flex-col gap-3">
      <input
        inputMode="decimal"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="rounded-lg border border-neutral-300 px-4 py-3 text-lg"
      />
      <button className="rounded-lg bg-emerald-600 py-3 text-white">
        Log score
      </button>
    </form>
  );
}
```

- Functional components, named exports.
- Server-side data access in route handlers / server components, not
  scattered client-side fetches.
- Tailwind utility classes directly in JSX; no separate CSS files unless a
  pattern repeats 3+ times, then extract a component.
- Prisma client accessed through a single `lib/db.ts` singleton.

## Testing Strategy

- Vitest for pure logic: plan-nudge threshold calculation, any
  scoring/aggregation helpers, Anthropic prompt-construction functions
  (mocking the API call itself).
- No e2e test suite in v1 — proportionate to a solo personal project.
- Manual verification in-browser (per this repo's `run` skill / standard
  practice) for UI flows before considering a feature done.

## Boundaries

- **Always:** Run `npm test` and `npx tsc --noEmit` before considering a
  task done. Keep the Anthropic API key server-side only. Keep the UI
  mobile-first (test at phone width first).
- **Ask first:** Adding new dependencies beyond what's in this spec,
  changing the data model, changing hosting/DB provider, adding scheduled
  jobs (cron), any spend beyond free tiers.
- **Never:** Commit `.env`/secrets, expose the Anthropic API key to client
  code, add multi-user accounts/signup, build a native mobile app.

## Success Criteria

- User can log in with the shared password from a phone browser.
- User can browse drills by skill area and see instructions.
- User can log a score for a drill in ≤3 taps/inputs.
- User can view score trends for a drill and for a skill area.
- User sees a nudge when a plan regeneration is likely worthwhile, per the
  thresholds above.
- User can manually trigger plan regeneration and see a new weekly plan
  with a narrative summary and focus items.
- The UI looks and feels polished on a phone screen (this is a first-class
  requirement, not cosmetic-only).

## Open Questions

- Exact initial drill curriculum content (drill count, specific
  instructions/scoring per drill) — to be authored during implementation,
  not blocking spec approval.
- None blocking — ready for Plan phase pending your review.
