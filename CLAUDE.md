# Project: ScratchGolf

Personal-use project. No code exists yet — this file will grow as real
decisions get made. Keep everything as simple as possible; this is not
meant to become a large or complex system.

## Tech Stack

Not decided yet. When the first real feature is being built:
- Ask what the project actually needs (personal use, likely low traffic,
  probably a single user) before proposing a stack.
- Default toward the simplest option that works — e.g. a single small
  web app or script rather than a multi-service architecture. Avoid
  frameworks/infra that add ceremony a solo personal project doesn't need.
- Once a stack is chosen, update this section with the actual
  languages/frameworks and versions in use.

## Commands

None yet — add Build/Test/Lint/Dev commands here once a stack exists.

## Code Conventions

None yet — add project-specific conventions here as they emerge (naming,
file layout, testing approach, etc.). Don't invent conventions ahead of
actual code.

## Boundaries

- Keep it simple — this is a personal project, not a production system.
  Prefer the boring, minimal solution over a "proper" enterprise one.
- Don't add dependencies, services, or infrastructure without asking first.
- Never commit `.env` files, credentials, or secrets.
- Ask before making architectural decisions (stack, database, hosting) —
  don't assume; this project has explicitly deferred those choices.
- Ask before adding CI/CD, Docker, or deployment tooling unless requested.

## Skills

This project uses the `addyosmani/agent-skills` collection, vendored under
`.agents/skills/` and available to Claude Code via `.claude/skills/`.

- Start every task by consulting `using-agent-skills` (the meta-skill) to
  route to the right workflow skill for the phase of work at hand.
- Given this project's "keep it simple" boundary, favor the lighter-weight
  skills (`incremental-implementation`, `test-driven-development`,
  `debugging-and-error-recovery`) over heavier process skills
  (`spec-driven-development`, `planning-and-task-breakdown`) unless the
  task genuinely warrants the extra ceremony.
