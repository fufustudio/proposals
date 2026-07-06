# Deploy And Launch

## Deploy

1. Import the GitHub repo in Vercel.
2. Add production environment variables.
3. Confirm the preview deployment builds.
4. Configure the production domain.
5. Redeploy after environment changes. Vercel does not apply changed env vars to
   an already-built deployment.

## Vercel Environment Variables

| Variable                   | Required | Example                      | Notes                                                |
| -------------------------- | -------- | ---------------------------- | ---------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`     | Yes      | `https://proposals.example`  | Used for metadata, canonicals, sitemap, and robots.  |
| `PROPOSAL_ACCESS_CODES`    | Yes      | `{"sample-proposal":"demo"}` | Server-only JSON map of slug to password.            |
| `PROPOSAL_SESSION_SECRET`  | Yes      | long random secret           | Server-only signing secret for access cookies.       |
| `ADMIN_ACCESS_CODE`        | Yes      | long private passcode        | Server-only passcode for `/admin`.                   |
| `ADMIN_SESSION_SECRET`     | Yes      | long random secret           | Server-only signing secret for admin access cookies. |
| `GOOGLE_SITE_VERIFICATION` | Optional | token                        | Search Console verification for the public index.    |

Redeploy after adding or changing any Vercel env var.

## Pre-Launch Checks

- Run `npm run verify:working` during active development.
- Run `npm run verify:proposal`.
- Run `npm run verify:handoff` when Playwright browser checks are required.
- Confirm `/`, `/sitemap.xml`, `/robots.txt`, and `/opengraph-image` load.
- Confirm `/robots.txt` disallows `/admin/` and `/proposals/`.
- Confirm proposal access works with production env vars.
- Confirm no real passwords or proposal details are committed in local fixtures.
