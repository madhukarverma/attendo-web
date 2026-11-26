## What and why

<!-- What changes, and why. Link the stage plan task group. -->

## Requirement IDs

<!-- Every ID this PR implements, for example ATT-F-010, SEC-S-028. "None" with a reason if none. -->

## Screenshots or recordings

<!-- UI changes only: light and dark, phone and desktop. -->

## Test evidence

<!-- Tests added or changed, each naming its IDs, and the local gate results (15.5). -->

## Migration notes

<!-- New migrations, and why each is backward compatible. "None" if none. -->

## Rollback

<!-- How to undo this safely. -->

## Changeset

<!-- A changeset for user-facing changes, or "No changeset: <reason>". -->

## Review checklist (15.6)

- [ ] Requirements: implements exactly the IDs listed, nothing extra.
- [ ] Tests: tests name the IDs, with allow and deny cases for permissions.
- [ ] Input and access: inputs validated on client and server; permission checked on the server; no service-role use outside `server/internal`.
- [ ] States: every new screen has loading, empty, error and content states.
- [ ] Content: strings in `messages/en.json`; no em dashes; error codes used.
- [ ] Accessibility: keyboard reachable, visible focus, labels, contrast, motion respects the mode.
- [ ] Performance: no new heavy dependency; bundle budget kept; no N+1.
- [ ] Docs: `CLAUDE.md` map, ADRs, error codes, help or FAQ updated if needed; the migration is backward compatible.
