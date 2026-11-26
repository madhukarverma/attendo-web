# ADR-0021: Pinned versions of every tool and package

- Status: Accepted
- Date: 2026-11-27

## Context

Spec 3.1 asks for every tool and package to be pinned exactly, using the major in the 3.3 table
while that major is still supported, and the newest major otherwise, with the reason recorded
here. Unpinned versions let a build change without a commit, which breaks reproducible CI and
makes a supply-chain attack easier (SEC-S-029). The Stage 0 plan (decisions D1, D2 and D4)
settled the majors that differ from the table. Versions were checked with `pnpm view` on
27 Nov 2026.

## Decision

- Every dependency is pinned exactly (`save-exact=true` in `.npmrc`, no `^` or `~`). The lockfile
  is committed and CI installs with `pnpm install --frozen-lockfile`.
- `engine-strict=true`: installs fail on the wrong Node or pnpm.
- pnpm 10 runs no dependency install scripts except those listed in `onlyBuiltDependencies`
  (`pnpm-workspace.yaml`).
- GitHub Actions are pinned by commit SHA, with the tag in a comment. Tools CI downloads (gitleaks)
  are pinned by version and checked against the release's SHA-256.
- A package first used in a later task group or stage is pinned when it's added, and this ADR is
  updated in that pull request.

### Runtimes

| Tool | Pin | Where | Note |
|---|---|---|---|
| Node.js | 26.x | `.nvmrc`, `engines`, Vercel project setting | Newest LTS that Vercel offers (its default) |
| pnpm | 10.34.9 | `packageManager`, `engines` | D2: 10.x is still maintained, so the table's major stays |

### Installed in Stage 0 TG2

| Package | 3.3 major | Pin | Note |
|---|---|---|---|
| `typescript` | 5 | 6.0.3 | D4: 5.x has had no release since 5.9.3 (Sep 2025). 7.x is blocked until `typescript-eslint` supports it (it accepts `<6.1.0`) |
| `eslint` | 9 | 10.15.0 | 9.x maintenance ended about Aug 2026, so the newest major is used |
| `typescript-eslint` | | 8.74.0 | |
| `eslint-plugin-boundaries` | | 7.4.5 | |
| `eslint-plugin-jsx-a11y` | | 6.10.2 | Declares ESLint up to 9. It runs on 10: `packages/config/test` proves its rules fire, and `peerDependencyRules` in `pnpm-workspace.yaml` records the exception. Remove it when a release declares 10 |
| `prettier` | 3 | 3.10.1 | |
| `knip` | | 6.48.0 | |
| `husky` | | 9.1.7 | |
| `lint-staged` | | 17.6.2 | |
| `@commitlint/cli`, `@commitlint/config-conventional` | | 21.2.4 | |
| `@changesets/cli` | | 3.0.3 | |
| `turbo` | 2 | 2.11.13 | |

Supporting packages (approved with the Stage 0 plan): `@types/node` 26.6.11,
`eslint-import-resolver-typescript` 4.4.5 (lets the boundaries rule resolve TypeScript imports),
`globals` 17.14.0.

ESLint's recommended rules are read from ESLint's own rule metadata
(`eslint/use-at-your-own-risk`), so `@eslint/js` isn't added (rule 0.4.5).

### CI tools

| Tool | Pin |
|---|---|
| `actions/checkout` | v7.0.1, `3d3c42e5aac5ba805825da76410c181273ba90b1` |
| `pnpm/action-setup` | v6.1.1, `73e46992e05b19abd31f2f3c20e0e7370d762115` |
| `actions/setup-node` | v7.1.0, `949feb2413d6458794dcd2491c4babbbce0c15c1` |
| gitleaks | 8.30.1, linux x64 tarball SHA-256 `551f6fc83ea457d62a0d98237cbad105af8d557003051f41f3e7ca7b3f2470eb` |

### Planned majors (pinned when added)

| Package | 3.3 major | Planned | Note |
|---|---|---|---|
| Supabase CLI (`supabase`) | 2 | 3.x | D1: 2.x has had no release since 3.0.0. v3 targets the local stack by default and needs `--yes` for hosted changes |
| `motion` | 12 | 14.x | No 12.x release since 13.0. Added in TG8 only after checking `LazyMotion`, `domAnimation` and `m.*` still exist |
| `uuid` | 11 | 11.x | Still patched, so the table's major stays |
| `web-push` 3, `nodemailer` 7 | | decided when first used | Both majors look unmaintained |

## Consequences

- Builds are reproducible, and a version only changes through a reviewed pull request
  (Dependabot from TG15).
- Moving past a table major needs a line here with the reason.
- Pinning means updates don't arrive on their own: Dependabot and the weekly audit catch them.

## Alternatives considered

- Caret ranges with the lockfile only: the lockfile pins installs, but a fresh `pnpm add` or a
  lockfile regeneration can still move versions silently.
- Keeping the 3.3 majors for ESLint and TypeScript: both are past their last release, so they'd
  miss security and bug fixes.
