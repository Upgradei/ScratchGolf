# Implementation Plan: ScratchGolf Training App

Implements `SPEC.md` (approved). Tasks are recorded in `tasks/todo.md`
(no external tracker is designated in `CLAUDE.md`).

## Overview

A mobile-first Next.js app with a Postgres/Prisma backend, a single
password gate, a seeded drill curriculum, score logging, trend views, and
an Anthropic-generated weekly training plan triggered manually via a
nudge. Built foundation-first (scaffold → DB → auth), then vertical
feature slices (drills → scoring → trends → plan display → plan
regeneration), then a polish/testing/deploy phase.

## Architecture Decisions

- **Foundation before verticals:** scaffold, DB schema, and auth are true
  shared dependencies for every later task — built horizontally first,
  then each feature is a vertical slice (schema-to-UI) on top.
- **Plan generation is a server route, not a background job:** matches the
  "manual regeneration" decision in SPEC.md — keeps infra to zero moving
  parts (no cron, no queue).
- **Nudge logic lives in a pure function (`lib/planNudge.ts`):** isolates
  the only non-trivial business logic so it's unit-testable without
  spinning up the DB or UI.
- **Seed data authored as a TypeScript seed script, not admin UI:** matches
  SPEC.md's "no content-management UI" boundary — curriculum is
  code-reviewed like any other change.

## Task List

### Phase 1: Foundation

- [ ] Task 1: Scaffold the Next.js project
- [ ] Task 2: Prisma schema + Postgres (Neon) connection
- [ ] Task 3: Password-gate auth

### Checkpoint: Foundation
- [ ] `npm run build` succeeds
- [ ] App deploys to Vercel and shows a placeholder home page
- [ ] Visiting any page redirects to `/login` when unauthenticated
- [ ] Correct password sets a session cookie and grants access
- [ ] Review with human before proceeding

### Phase 2: Core Features

- [ ] Task 4: Curriculum seed data + drill library browse page
- [ ] Task 5: Drill detail page + score logging
- [ ] Task 6: Trends view
- [ ] Task 7: Home screen + weekly plan display
- [ ] Task 8: Plan-regeneration nudge logic + banner
- [ ] Task 9: Plan regeneration via Anthropic API

### Checkpoint: Core Features
- [ ] End-to-end flow works on a phone-width browser: log in → browse
      drills → log a score → see it reflected in trends → see the nudge
      appear once thresholds are crossed → regenerate plan → see new plan
- [ ] Review with human before proceeding

### Phase 3: Polish

- [ ] Task 10: Mobile UI / aesthetic polish pass
- [ ] Task 11: Unit tests for core logic
- [ ] Task 12: Deployment finalization

### Checkpoint: Complete
- [ ] All Success Criteria in `SPEC.md` are met
- [ ] `npm test` and `npx tsc --noEmit` pass
- [ ] Manually verified on an actual phone browser, not just responsive
      devtools
- [ ] Ready for review

## Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Neon/Vercel Postgres free-tier limits (connection count, storage) surprise us later | Low | Solo, low-volume usage; revisit only if it becomes a real constraint |
| Anthropic prompt produces a low-quality or malformed plan (bad JSON for `items`) | Med | Validate/parse the response server-side with a schema check; on failure, show an error rather than storing garbage |
| Aesthetic polish (Task 10) is subjective and could loop indefinitely | Med | Time-box it; ship an initial pass, iterate later based on actual usage, not endless tweaking |
| Curriculum content (drill list) authored by the agent may not match real golf-instruction best practice | Med | Treat v1 curriculum as a reasonable starting point, explicitly open to revision once the user starts using it |

## Open Questions

- None blocking. Exact drill list/instructions are authored in Task 4,
  per SPEC.md's "Open Questions" note.
