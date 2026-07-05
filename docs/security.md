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
- Successful access creates a signed HttpOnly cookie scoped to the matching
  `/proposals/[slug]` path.
- Access cookies do not store the proposal password.
- Analytics events must never include proposal titles, client names, access
  codes, pricing, or customer identifiers.

## Environment Boundaries

- `PROPOSAL_ACCESS_CODES` must be configured in production as a JSON slug-to-code
  map.
- `PROPOSAL_SESSION_SECRET` must be a long random server-only value in
  production.
- Real proposal passwords, pricing, client names, and private proposal copy must
  not be committed.
- Local non-production runs may use the fake sample proposal fallback.

## Launch Checks

- Run `npm run verify:proposal`.
- Run `npm run verify:handoff` when browser checks are required.
- Confirm production proposal access env vars are configured before sharing any
  real proposal URL.
- Confirm proposal detail URLs return `noindex` metadata and are absent from the
  sitemap.
- Review whether the eventual proposal content requires a broader privacy policy
  or client data handling note.
