# Starter Sync Ledger

This repository is a specialized derivative of
`fufustudio/fufu-starter`. Use this ledger to keep reusable conventions aligned
without importing public-site or CMS behavior into private proposal routes.

## Audited Baseline

- Starter commit: `9cf680ac5fc9b1ae283bab8fb73fb79a2662fa2e`
- Audited: 2026-07-26
- Starter commits reviewed: `9c20f9c` through `9cf680a`

The baseline means the proposal app was reviewed against that starter state; it
does not mean every file should be byte-identical.

## Keep In Sync

- Node/npm versions and core Next/React tooling.
- Prettier, ESLint, lint-staged, Husky, agent hooks, and CI command hierarchy.
- Flat shared component conventions and generic component APIs.
- `src/config` ownership for environment, SEO, site identity, and theme values.
- Route-local page composition and direct route-layout ownership.
- `Heading`, `Text`, `Eyebrow`, `JsonLd`, error, skip-link, and accessibility
  patterns.
- Typed analytics contracts and destination adapters.
- Playwright structure, Lighthouse thresholds, generated-file checks, editor
  defaults, and launch verification style.

## Adapt In This Repository

- `src/components/admin` and `src/components/proposals` remain explicit domain
  namespaces.
- Proposal data is local and server-only rather than CMS-backed.
- Automatic telemetry mounts only in `src/app/(home)/layout.tsx`.
- Access configuration is cross-checked against local proposal slugs.
- Admin and proposal auth share low-level mechanics but retain distinct policy,
  cookie, redirect, and signed-purpose adapters.
- Browser-bundle privacy scanning is part of `npm run verify`.

## Intentional Exclusions

- Sanity, Studio, Portable Text, draft mode, TypeGen, and CMS image helpers.
- Contact, email, CRM, provider registry, GA4, and consent UI.
- Public marketing navigation, breadcrumbs, and marketing routes.
- `cacheComponents` while authorization remains cookie/request-bound.
- Experimental global not-found and multiple root layouts.
- Starter development-server reuse in Playwright; auth tests use an isolated
  production server.

## Future Sync Procedure

1. Record the current baseline above.
2. Review starter commits from that baseline to its new head.
3. Compare tooling/config first, then shared components, then runtime/tests.
4. Classify each change as exact sync, proposal adaptation, or exclusion.
5. Run `npm run verify`, launch checks with fake launch-safe credentials, and
   Playwright before updating the baseline.

## Known Follow-Ups

- Select and configure a distributed rate-limit provider before sharing real
  proposal content broadly.
- Track the latest stable Next.js release for patched nested PostCSS and Sharp
  dependencies; do not use npm's suggested Next 9 downgrade.
