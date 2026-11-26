# Attendo Web

A free web app (PWA) for NIT Trichy MCA 2026-29 students: attendance per subject (75% rule),
timetable and calendar, class groups, tasks, focus timer, grades (SGPA/CGPA), friends, push
reminders. Built stage by stage from the spec. Stage 0 (Foundations) is in progress: its plan is
approved and no code exists yet.

## Map: where things live

| Folder or file | What's inside | Open it when |
|---|---|---|
| `docs/ATTENDO_WEB_SPEC.md` | The single source of truth: rules for you (section 0), stack, architecture, domain formulas, data model, features, design, security, process, stages (section 18) | Always, before planning any work |
| `seed/` | NIT Trichy data: institution, terms, courses with credits, curriculum, two academic calendars, grading. Copied unchanged; see spec 6.9 | Seeding the database, anything about courses or dates |
| `.claude/skills/apple-design/` | The Owner's motion and gesture skill (the "Apple" motion mode, spec 9.8) | Animations, gestures |
| `.claude/skills/animation-performance/` | Keeping animations cheap | Anything that moves |
| `docs/ACCOUNTS_SETUP.md` | The Owner's checklist for the free accounts, local tools and where each key goes | The Owner asks about accounts, env vars or local setup |
| `docs/stages/STATUS.md` | The handoff note: which stage and task group is done, in progress, next; Owner steps; open issues | Start and end of every session |
| `docs/stages/stage-00-plan.md` | The approved Stage 0 plan: decisions D1 to D7, versions, task groups TG1 to TG19 | Working on any Stage 0 task group |

Stage 0 adds `apps/`, `packages/`, `supabase/` and more (spec 4.2).

## Finding things (keep context small)

- Read the map first and open only the file the task needs.
- Never scan a whole folder when the map says where to look.
- Never read `docs/ATTENDO_WEB_SPEC.md` whole (about 41k tokens). List its headings with
  `grep -n '^#' docs/ATTENDO_WEB_SPEC.md`, then read only the sections the task needs.
- Never read `seed/nitt_mca_curriculum.csv` whole (about 37k tokens). Search it by course code.
- A folder with many files or its own rules gets a short `CLAUDE.md` of its own: what each file
  is, and which one to open for which kind of question.
- When a folder or key file is added, moved or renamed, update the map in the same change.

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

1. Read this file, then `docs/stages/STATUS.md`.
2. Read the spec sections the current stage lists.
3. Say which stage you're on and what's next before doing anything.
