# Deploy And Launch

## Deploy

1. Import the GitHub repo in Vercel.
2. Add production environment variables.
3. Confirm the preview deployment builds.
4. Configure the production domain.
5. Redeploy after environment changes. Vercel does not apply changed env vars to
   an already-built deployment.

## Vercel Environment Variables

| Variable                         | Required                        | Example                       | Notes                                               |
| -------------------------------- | ------------------------------- | ----------------------------- | --------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`           | Yes                             | `https://www.example.com`     | Used for metadata, canonicals, sitemap, and robots. |
| `NEXT_PUBLIC_SANITY_PROJECT_ID`  | For live CMS                    | `your-project-id`             | Leave unset only for starter/local fallback work.   |
| `NEXT_PUBLIC_SANITY_DATASET`     | For live CMS                    | `production`                  | Match the Sanity dataset.                           |
| `NEXT_PUBLIC_SANITY_API_VERSION` | For live CMS                    | `2026-06-24`                  | Keep pinned per project.                            |
| `SANITY_API_READ_TOKEN`          | Optional                        | Viewer token                  | Add only for draft/live preview features.           |
| `SANITY_REVALIDATE_SECRET`       | Optional                        | generated secret              | Add only when webhooks revalidate content.          |
| `RESEND_API_KEY`                 | For production message delivery | `re_...`                      | Server-only.                                        |
| `RESEND_FROM_EMAIL`              | For production message delivery | `Website <hello@example.com>` | Must use a verified sending domain.                 |
| `RESEND_TO_EMAIL`                | For production message delivery | `contact@example.com`         | Recipient inbox for inquiries.                      |
| `GOOGLE_SITE_VERIFICATION`       | Optional                        | token                         | Search Console verification.                        |

Redeploy after adding or changing any Vercel env var.

## Pre-Launch Checks

- Run `npm run verify:working` during active development.
- Run `npm run verify:template`.
- Run `npm run verify:handoff` for client-site handoff when Playwright is ready.
- Run `npm run verify:ci` for browser checks.
- Run `npm run verify:release` when performance matters.
- Confirm the actual public route set, `/sitemap.xml`, `/robots.txt`, and `/opengraph-image` load.
- Confirm forms, analytics, metadata, and responsive layouts.
- Confirm Resend has a verified sending domain when contact delivery is enabled.
- Review `docs/security.md`, including the privacy policy and cookie consent notes.
