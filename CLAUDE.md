# Attendo Web

A free web app (PWA) for NIT Trichy MCA 2026-29 students: attendance per subject (75% rule),
timetable and calendar, class groups, tasks, focus timer, grades (SGPA/CGPA), friends, push
reminders. Built stage by stage from the spec. Nothing is built yet: Stage 0 sets up the code.

## Map: where things live

| Folder or file | What's inside | Open it when |
|---|---|---|
| `docs/ATTENDO_WEB_SPEC.md` | The single source of truth: rules for you (section 0), stack, architecture, domain formulas, data model, features, design, security, process, stages (section 18) | Always, before planning any work |
| `seed/` | NIT Trichy data: institution, terms, courses with credits, curriculum, two academic calendars, grading. Copied unchanged; see spec 6.9 | Seeding the database, anything about courses or dates |
| `.claude/skills/apple-design/` | The Owner's motion and gesture skill (the "Apple" motion mode, spec 9.8) | Animations, gestures |
| `.claude/skills/animation-performance/` | Keeping animations cheap | Anything that moves |
| `docs/ACCOUNTS_SETUP.md` | The Owner's checklist for the free accounts and where each key goes | The Owner asks about accounts or env vars |
| `docs/stages/STATUS.md` | Created in Stage 0: which stage is done, in progress, next | Start of every session |

Stage 0 adds `apps/`, `packages/`, `supabase/` and more (spec 4.2). Update this map in the same
change that adds, moves or renames a folder or key file.

## Rules (full list: spec section 0)

- Follow the stage protocol in spec 0.2: plan first, wait for the Owner's approval, then build.
- One stage at a time. Never start the next stage until the current one is accepted.
- Never commit secrets or `.env` files. Never ask the Owner to paste secret values in chat:
  name the variable and where it goes (spec 20.1); the Owner enters it in the dashboard.
- Never skip a test or a gate to make a build pass.
- Only free-tier services (spec 3). If something would cost money, stop and ask.
- Ask the Owner questions in chat, never inside the spec or other files.
- The audience is one batch: MCA Semester I, then Semester II from 4 Jan 2027 (spec 1.2).

## Start of every session

1. Read this file, then `docs/stages/STATUS.md` (once it exists).
2. Read the spec sections the current stage lists.
3. Say which stage you're on and what's next before doing anything.
