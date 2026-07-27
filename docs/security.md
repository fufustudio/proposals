# Security And Privacy

This app is built for private proposal sharing, not account management. The
password gate is intentionally lightweight and should be treated as an access
screen for proposal drafts, not as a full client portal.

## Security Baseline

- Security headers are configured in `next.config.ts`, including
  `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`,
  `Permissions-Policy`, a public Content Security Policy, and production-only
  HSTS.
- Proposal detail routes are excluded from indexing through route metadata,
  `robots.ts`, and sitemap omission.
- Proposal passwords are validated server-side only.
- Proposal content imports are marked `server-only`, and the production gate
  scans browser chunks for fixture markers after each build.
- Successful access creates a signed HttpOnly cookie scoped to the matching
  `/proposals/[slug]` path.
- Access cookies do not store the proposal password.
- Public and unauthenticated proposal surfaces must stay generic: no client
  names, proposal titles, summaries, pricing, or timelines in `/`, access-page
  copy, or route metadata.
- Admin access uses a separate passcode and signed HttpOnly cookie scoped to
  `/admin`; it does not reuse proposal passwords.
- Admin and proposal cookies use a shared signing primitive with distinct
  signed purposes, payload validation, lifetimes, names, and scopes.
- Private pages, access responses, and gate redirects send `no-store` and
  `X-Robots-Tag` headers. Their CSP excludes analytics destinations.
- Automatic analytics and performance telemetry are mounted only in the public
  `(home)` layout. Proposal and admin routes must remain telemetry-free.
- Any future explicit analytics events must use the typed allowlist and must
  never include proposal titles, client names, access codes, pricing, route
  slugs, or customer identifiers.

## Environment Boundaries

- `PROPOSAL_ACCESS_CODES` must be configured in production as a JSON slug-to-code
  map.
- `PROPOSAL_SESSION_SECRET` must be a long random server-only value in
  production.
- `ADMIN_ACCESS_CODE` and `ADMIN_SESSION_SECRET` must be configured in
  production before `/admin` is usable.
- `NEXT_PUBLIC_VERCEL_ANALYTICS_ENABLED` controls public-page Vercel Analytics
  only. It does not enable telemetry on proposal or admin routes.
- Proposal passwords and admin passcodes/session secrets must not be committed.
- User-supplied proposal copy may live in the local fixture while this app is
  local-first, but it must remain behind the proposal access gate and out of
  unauthenticated metadata. Reassess storage before deploying or sharing real
  client material broadly.
- Local non-production runs may use the sample proposal access-code fallback.
- Password protection is an HTTP access boundary, not encryption of server
  build artifacts or deployment storage.

## Launch Checks

- Run `npm run verify:proposal` while preparing a handoff.
- Run `npm run verify:handoff` before deployment; it includes strict environment
  validation and browser checks.
- Confirm production proposal access env vars are configured before sharing any
  real proposal URL.
- Confirm proposal detail URLs return `noindex` metadata and are absent from the
  sitemap.
- Confirm admin URLs return `noindex` metadata, are disallowed by robots, and
  are absent from the sitemap.
- Review whether the eventual proposal content requires a broader privacy policy
  or client data handling note.
- Choose a production-grade distributed rate limiter before real proposal URLs
  are shared broadly. Keep admin and proposal limit buckets separate and do not
  trust forwarding headers without a documented proxy boundary.
