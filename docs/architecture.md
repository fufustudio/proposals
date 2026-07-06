# Architecture

This app is a small Next.js App Router site for private proposal pages. It uses
local typed proposal fixtures until real proposal copy, design, and a final
content source are supplied.

## Request Flow

1. Public routes in `src/app/(site)` render the index, while proposal routes in
   `src/app/(proposal)` render the access screen and protected proposal reader.
2. `src/proxy.ts` is the thin Next Proxy convention file. It delegates proposal
   access decisions to `src/server/proposal-access-gate.ts` and admin access
   decisions to `src/server/admin-access-gate.ts`.
3. `src/app/api/proposal-access/route.ts` validates a per-proposal password and
   sets a signed HttpOnly cookie scoped to that proposal path.
4. `src/app/api/admin-access/route.ts` validates the admin passcode and sets a
   separate signed HttpOnly cookie scoped to `/admin`.
5. `src/features/proposals/index.ts` reads validated local proposal JSON through
   `src/content/proposals.ts`.
6. `src/server/proposal-access.ts` and `src/server/admin-access.ts` own their
   respective env parsing, password checks, redirect sanitization, token
   signing, and cookie verification.

## Core Directories

- `src/app/` - routes, metadata, sitemap, robots, OpenGraph image, and API
  handlers.
- `src/components/ui/` - low-level primitives such as buttons, containers,
  section wrappers, form fields, links, image frames, and copy helpers.
- `src/components/admin/` - private admin list, access, and JSON viewer
  surfaces.
- `src/components/proposals/` - proposal-specific reader and access surfaces.
- `src/components/site/` - shared site chrome.
- `src/content/` - local proposal fixtures.
- `src/features/proposals/` - proposal domain types, local data lookup, and
  proposal route path helpers.
- `src/server/` - server-only proposal access helpers and proxy gate logic.
- `src/lib/` - app-wide env, SEO, theme mirror, and generic utilities.
- `scripts/` - generated-file checks, component validation, and scaffold
  cleanup checks.

## Ownership Rules

- Pages own composition.
- UI primitives own reusable controls and layout atoms.
- Proposal components own proposal-specific presentation.
- Site components own shared chrome.
- `src/features/proposals` owns proposal-specific shared domain logic.
- `src/server` owns password, cookie, and request-gating logic.
- `src/lib` owns app-wide utilities that are not proposal-domain specific.
- `src/content` owns local fixture data.
- Admin routes are private utility surfaces. Keep them noindex, omitted from
  public navigation, and backed by local JSON until a real content source is
  selected.

Do not duplicate proposal content constants in JSX. If content is reused, move
it to `src/content/proposals.json` and keep the route composition thin.
