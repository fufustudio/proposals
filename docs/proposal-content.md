# Proposal Content

Proposal content is version-controlled JSON for the first iteration. There is
no CMS, database, browser editor, or proposal mutation API.

## Content Boundary

The content flow is intentionally one-way:

```text
src/content/proposals.json
  -> src/content/proposals.ts
  -> src/page-modules/proposals/repository.ts
  -> routes
  -> typed proposal component props
```

- `proposals.json` is the single content source.
- `proposals.ts` imports the JSON, validates it, and is marked `server-only`.
- The repository is the only proposal lookup boundary used by routes.
- Client components may import proposal types but must not import the content
  file or repository.
- Passwords and signing secrets belong in deployment environment variables,
  never proposal JSON.

Keep one JSON array while the proposal count is small. Revisit per-proposal
files only when concurrent work or file size makes the single file difficult to
maintain.

## Create Or Update A Proposal

1. Duplicate the sample proposal object in `src/content/proposals.json`.
2. Replace the fake copy only after authoritative client copy is supplied.
3. Set a unique lowercase hyphenated `slug`.
4. Set `status`, `preparedAt`, `updatedAt`, and the proposal summary.
5. Give every slide a unique `id`, label, semantic heading, layout, and at least
   one block.
6. Use existing block types before extending the content contract.
7. Add the matching proposal access code to deployment configuration.
8. Preview the access page, locked redirect, unlocked deck, and admin viewer.

Model what the content means rather than encoding temporary styling decisions
in field names. Examples include `timeline`, `pricing`, `steps`, and
`workstreams`. The renderer and CSS own presentation.

## Extending The Contract

When a real proposal needs a new semantic block:

1. Add the block to the `ProposalBlock` union in
   `src/page-modules/proposals/types.ts`.
2. Add its runtime validation in
   `src/page-modules/proposals/validation.ts`.
3. Render it exhaustively in
   `src/components/proposals/proposal-slide-blocks/index.tsx`.
4. Add valid and invalid unit-test cases.
5. Add component styles only after the content meaning is established.

The typecheck enforces that the validator's status, layout, and block-type
inventories cover their corresponding TypeScript unions.

## Media

Use local assets only when they are safe to expose by URL. The proposal password
protects page delivery, not files placed in a public asset directory. Content
that requires authenticated asset delivery needs a separate server-controlled
asset route or private object storage.

Every meaningful image needs accurate alt text. Decorative images should use an
empty alt value.

## Privacy And Status

- Public and access pages must not expose proposal identity, pricing, timeline,
  or client details.
- Proposal and admin pages remain `noindex`, `no-store`, and telemetry-free.
- Local JSON is not encrypted inside Git history or deployment artifacts.
- `accepted` is editorial metadata only in this iteration. It is not a legal
  acceptance record or auditable workflow event.
- The signed SOW and PSA remain the source of truth for an engagement.

## Verification

During editing:

```bash
npm run verify:quick
```

Before handoff:

```bash
npm run verify:proposal
npm run verify:handoff
```

The handoff command requires launch-safe environment values. It verifies that
proposal slugs exactly match configured access codes, private copy is absent
from browser chunks, and the locked and unlocked browser flows work.
