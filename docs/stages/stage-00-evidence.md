# Stage 0 evidence

Proof for each task group and exit gate (spec 0.2 step 6). TG19 completes this file.

## TG2: monorepo, toolchain, first CI

Run locally on 27 Nov 2026 (Windows 11, Node 26.13.1, pnpm 10.34.9, gitleaks 8.30.1).

- A bad commit message is rejected by the `commit-msg` hook:
  `git commit -m "Added the monorepo stuff"` failed with commitlint `type-empty` and
  `subject-empty` ("found 2 problems"), and no commit was made.
- A staged fake key is blocked by the `pre-commit` hook: a file holding a made-up GitHub token
  (`ghp_` plus 36 random characters) was staged and `git commit -m "chore(config): fake key test"`
  failed with gitleaks reporting "leaks found: 1". The file was then unstaged and
  deleted.
- Gates: `pnpm format:check`, `pnpm lint` (zero warnings), `pnpm typecheck` (no TypeScript
  packages yet), `pnpm test` (11 preset tests pass: 4.5 boundaries, SEC-S-009, jsx-a11y on
  ESLint 10, rule 0.4.11), `pnpm knip`, `gitleaks git` over the full history (no leaks) and
  `pnpm audit --audit-level=high` (no known vulnerabilities) all pass.
- CI: the first green `ci` run is linked from the TG2 pull request.
