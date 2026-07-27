# Architecture

This app is a small Next.js App Router site for private proposal pages. It uses
version-controlled, runtime-validated JSON for proposal content.

## Request Flow

1. The public index lives in `src/app/(home)`, while the flattened
   `src/app/proposals` and `src/app/admin` trees own private proposal and admin
   routes.
2. `src/proxy.ts` is the thin Next Proxy convention file. It delegates proposal
   access decisions to `src/server/proposal-access-gate.ts` and admin access
   decisions to `src/server/admin-access-gate.ts`.
3. `src/app/api/proposal-access/route.ts` validates a per-proposal password and
   sets a signed HttpOnly cookie scoped to that proposal path.
4. `src/app/api/admin-access/route.ts` validates the admin passcode and sets a
   separate signed HttpOnly cookie scoped to `/admin`.
5. `src/page-modules/proposals/repository.ts` reads validated local proposal JSON
   through a `server-only` boundary.
6. `src/server/proposal-access.ts` and `src/server/admin-access.ts` own their
   respective env parsing, password checks, redirect sanitization, token
   signing, and cookie verification.

## Core Directories

- `src/app/` - routes, metadata, route-local composition, sitemap, robots,
  OpenGraph image, and API handlers.
- `src/components/` - flat generic primitives and section recipes such as
  buttons, containers, headings, public chrome, form fields, links, and image
  frames.
- `src/components/admin/` - private admin list, access, and JSON viewer
  surfaces.
- `src/components/proposals/` - proposal-specific reader and access surfaces.
- `src/analytics/` - typed, non-identifying event contracts and destinations.
- `src/config/` - runtime-wide environment, SEO, site identity, and theme
  configuration.
- `src/content/` - local proposal fixtures.
- `src/page-modules/` - route-facing page composition plus client-safe proposal
  domain types and paths, validation,
  and a server-only repository.
- `src/server/` - server-only proposal access helpers and proxy gate logic.
- `scripts/` - generated-file checks, component validation, and scaffold
  cleanup/privacy checks.

## Ownership Rules

- Pages own routing, metadata, data loading, redirects, and not-found decisions.
- One-route composition lives beside its route in a `components` folder.
- Flat generic components own reusable controls, typography, and layout atoms.
- Proposal components own proposal-specific presentation.
- `SiteHeader` and `SiteFooter` own shared public chrome; the `(home)` layout
  owns their composition, scripts, and main landmark.
- `src/page-modules/proposals` owns proposal-specific shared domain logic.
- Client modules import only proposal `types` and `paths`; fixture reads must go
  through the server-only repository.
- `src/server` owns password, cookie, signed-session, bounded-request, private
  response, and request-gating logic.
- `src/config` owns runtime-wide configuration.
- `src/content` owns local fixture data.
- Admin routes are private, read-only utility surfaces. Keep them noindex,
  omitted from public navigation, and backed by the validated local JSON
  repository.
- Automatic analytics and performance telemetry mount only from the public
  `(home)` layout. The sibling `admin` and `proposals` route trees stay outside
  that boundary.

Do not duplicate proposal content constants in JSX. If content is reused, move
it to `src/content/proposals.json` and keep the route composition thin.

The access password protects HTTP delivery; it does not encrypt proposal data
inside server deployment artifacts. `npm run privacy:check-build` verifies that
proposal fixture markers do not enter browser chunks.
