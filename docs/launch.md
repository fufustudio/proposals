# Deploy And Launch

## Deploy

1. Import the GitHub repo in Vercel.
2. Add production environment variables.
3. Confirm the preview deployment builds.
4. Configure the production domain.
5. Redeploy after environment changes. Vercel does not apply changed env vars to
   an already-built deployment.

## Vercel Environment Variables

| Variable                               | Required | Example                           | Notes                                                  |
| -------------------------------------- | -------- | --------------------------------- | ------------------------------------------------------ |
| `NEXT_PUBLIC_SITE_URL`                 | Yes      | `https://proposals.example`       | HTTPS origin used for metadata, sitemap, and robots.   |
| `PROPOSAL_ACCESS_CODES`                | Yes      | `{"sample-proposal":"long-code"}` | Server-only JSON map; each code must be 8+ characters. |
| `PROPOSAL_SESSION_SECRET`              | Yes      | 32+ character random secret       | Server-only signing secret for proposal cookies.       |
| `ADMIN_ACCESS_CODE`                    | Yes      | 12+ character private passcode    | Server-only passcode for `/admin`.                     |
| `ADMIN_SESSION_SECRET`                 | Yes      | 32+ character random secret       | Server-only signing secret for admin cookies.          |
| `NEXT_PUBLIC_VERCEL_ANALYTICS_ENABLED` | Optional | `true`                            | Public routes only; defaults to enabled.               |
| `GOOGLE_SITE_VERIFICATION`             | Optional | token                             | Search Console verification for the public index.      |

Redeploy after adding or changing any Vercel env var.

## Pre-Launch Checks

- Run `npm run verify` during active development.
- Run `npm run verify:proposal`.
- Run `npm run launch:check` with the production environment loaded.
- Run `npm run verify:handoff` before deployment. It includes the launch and
  desktop/mobile Playwright checks.
- Confirm `/`, `/sitemap.xml`, `/robots.txt`, and `/opengraph-image` load.
- Confirm `/robots.txt` disallows `/admin/` and `/proposals/`.
- Confirm proposal access works with production env vars.
- Confirm `PROPOSAL_ACCESS_CODES` exactly covers the proposal slugs in
  `src/content/proposals.json`.
- Confirm analytics requests occur only on public routes, if analytics is
  enabled.
- Confirm private responses include `Cache-Control: private, no-store` and
  `X-Robots-Tag: noindex`.
- Confirm no real passwords or proposal details are committed in local fixtures.
