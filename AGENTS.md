# Agent Guide

Canonical instructions for Codex, Claude Code, and other coding agents working
in this repo.

## What This Is

`fufu-proposals` is a local-first private proposal app for Fufu proposal pages. It is
not a new client marketing site. Keep the scaffold ready for future
Figma-driven design and real proposal copy, but do not add real proposal
content until it is supplied.

The current route surface is intentionally small:

- `/` - proposal entry/index scaffold.
- `/proposals/[slug]/access` - password entry for a proposal.
- `/proposals/[slug]` - protected proposal reader.
- `/admin/access` - private admin password entry.
- `/admin` and `/admin/proposals/[slug]` - protected proposal utilities.
- `/api/proposal-access` - access-code form handler.
- `/api/admin-access` and `/api/admin-logout` - admin session handlers.

## Git Commit Workflow

- Prefer `git commit --amend --no-edit` for related follow-up changes, and use
  `git push --force-with-lease` if the amended commit was already pushed.

## Commands

- `npm run dev` - start the dev server at http://localhost:3000.
- `npm run verify:quick` - component structure, lint, typecheck, and unit tests.
- `npm run verify` - format check, generated CSS types, component structure,
  lint, typecheck, unit tests, and build.
- `npm run verify:proposal` - full verification plus generated-file and
  proposal-clean checks.
- `npm run launch:check` - strict production URL, access-code, secret, and
  analytics configuration checks.
- `npm run verify:handoff` - proposal verification, launch checks, and
  Playwright e2e.
- `npm run verify:release` - handoff verification plus Lighthouse CI.
- `npm run css-types` - generate CSS Module declarations.
- `npm run check:generated-clean` - fail if generated CSS type files are stale or
  untracked.
- `npm run test` - run unit tests.
- `npm run test:e2e` - run Playwright smoke/accessibility checks against the
  current production build.

Use Node.js 22 and npm 10, matching `package.json`, `.node-version`, and CI.

## Project Rules

- Keep pages thin: routes compose local content helpers, shared chrome,
  proposal components, and UI primitives.
- Proposal content lives in validated `src/content/proposals.json`.
- `src/content/proposals.ts` is the server-only loader; routes and components
  must not import proposal JSON directly.
- Client-safe proposal types and paths live in
  `src/page-modules/proposals/{types,paths}.ts`.
- Proposal fixture reads live in the server-only
  `src/page-modules/proposals/repository.ts`.
- Access-code parsing, validation, signing, and cookie verification live in
  `src/server/proposal-access.ts`.
- Proposal request gating lives in `src/server/proposal-access-gate.ts`; keep
  `src/proxy.ts` as the thin Next convention adapter.
- Proposal passwords must come from deployment environment variables. Do not
  commit real client proposal passwords.
- The sample proposal fixture is fake and exists only to test structure. Keep it
  obviously non-final.
- Proposal detail and access routes should stay `noindex`.
- Do not add public navigation, sitemap entries, public marketing-site language,
  or final client-facing claims for private proposal pages.
- Generic reusable components live flat under
  `src/components/<component>/index.tsx` with colocated `styles.module.css`
  when needed.
- `src/components/proposals` and `src/components/admin` are explicit domain
  namespaces. Shared public chrome stays flat as `site-header`, `site-footer`,
  and other named components.
- Use `Heading`, `Text`, and `Eyebrow` instead of raw shared-component heading
  and typography patterns.
- `globals.css` owns theme tokens, typography, grid helpers, shared hover
  states, and cross-page utilities.
- Component-only selectors belong in CSS Modules.
- Do not add hard-coded brand hex values in components. Promote reusable values
  to theme tokens.
- Analytics scripts mount only from the public site layout. Do not move them
  into the root layout or include proposal/admin paths in automatic telemetry.
- Keep proposal fixture imports behind a `server-only` boundary and run the
  post-build privacy scan after changing proposal data ownership.
- Low-level signed-session and access-response mechanics may be shared, but
  admin and proposal cookie names, scopes, purposes, validation, and policy
  adapters must remain separate.
- Preserve accessibility labels, focus states, alt text, form errors, and
  reduced-motion handling while restyling.

## Environment Variables

- `NEXT_PUBLIC_SITE_URL` - production domain, canonical URLs, sitemap, robots,
  and OpenGraph metadata.
- `PROPOSAL_ACCESS_CODES` - JSON map of proposal slug to password, such as
  `{"sample-proposal":"demo"}`.
- `PROPOSAL_SESSION_SECRET` - long server-only secret used to sign proposal
  access cookies.
- `ADMIN_ACCESS_CODE` and `ADMIN_SESSION_SECRET` - server-only admin access
  credentials.
- `GOOGLE_SITE_VERIFICATION` - optional Search Console token for the public
  index route.
- `NEXT_PUBLIC_VERCEL_ANALYTICS_ENABLED` - optional public-index analytics
  switch; private proposal and admin routes never mount analytics.

Local non-production runs may use the built-in sample proposal code when the
proposal access variables are missing. Production must configure them.

## When To Read More

| Change area                                           | Read first                                   |
| ----------------------------------------------------- | -------------------------------------------- |
| Architecture and route/data ownership                 | `docs/architecture.md`                       |
| Proposal access, privacy, and deployment boundaries   | `docs/security.md`                           |
| Reusable components and shared-vs-local boundaries    | `docs/component-registry.md`                 |
| Visual layout, spacing, typography, and tokens        | `docs/design-system.md`                      |
| Figma/design-to-site workflow for future content      | `docs/design-to-site.md`                     |
| Deployment and launch checks                          | `docs/launch.md`                             |
| Next.js APIs, routing, config, metadata, typed routes | Local docs in `node_modules/next/dist/docs/` |

## Do Not

- Do not add real proposal copy, pricing, timelines, client names, or assets
  before the user supplies them.
- Do not reintroduce the old generic demo content.
- Do not make proposal detail pages indexable.
- Do not commit real proposal passwords or session secrets.
- Do not bypass generated-file checks after changing CSS modules.
