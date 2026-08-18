# Intent: ScratchGolf Training App

Confirmed via `interview-me` on 2026-08-18.

## Outcome

A mobile-friendly web app that walks the user through a structured golf
training curriculum (driver, approach, short game — chipping & putting),
lets them log their scores on each drill, and uses Claude to generate/adjust
a weekly training plan based on their recent score trends — aimed at
getting them to scratch (0 handicap) as fast as reasonably possible.

## User

Solo, single user (the project owner). No multi-user support needed.

## Why now

The user wants deliberate, trackable practice with intelligent guidance on
what to work on next, instead of ad hoc practice.

## Success

- From their phone, the user can see this week's plan, do a drill, log a
  score in a few taps, and view score trends over time.
- A new weekly plan is auto-generated (via Claude API) reflecting recent
  performance — not a fixed/rigid calendar.
- The UI itself feels polished and pleasant to use — clean visual design,
  smooth mobile interactions — not a bare-bones form-and-table app. This is
  a first-class requirement, not a nice-to-have.

## Constraint

- Keep it simple **architecturally**: solo personal project, free hosting
  on the user's existing Vercel account, minimal infra, existing Anthropic
  API key for weekly plan generation.
- Simplicity applies to scope and infrastructure, not to visual/UX polish —
  real effort should go into the interface looking and feeling good.

## Out of scope

- No multi-user accounts — a single shared password gate is sufficient.
- No native mobile app — mobile web / PWA only.
- No real-time per-rep AI feedback — only weekly plan regeneration.
- No hardware/GPS integrations (launch monitors, wearables, etc.).
- No content-management UI — the agent authors the starting drill
  curriculum directly.

## Likely stack (from interview, to be confirmed in spec)

- Next.js on Vercel (free tier)
- Small Postgres database (Vercel/Neon free tier) for drills, scores,
  weekly plans
- Anthropic API (user already has a key) for weekly plan generation
- Simple password-gate auth, no accounts/signup

## Next step

Hand off to `spec-driven-development` to define concrete requirements,
data model, and acceptance criteria.
