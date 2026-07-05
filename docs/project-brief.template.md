# Project Brief Template

Use this as the minimal user-entered intake for each design-to-site build. Leave
unknown values blank. Do not paste secret values into shared docs.

| Field             | Value |
| ----------------- | ----- |
| Project/site name |       |
| Figma link        |       |

## Environment Variables

| Field                            | Value                                               |
| -------------------------------- | --------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`           | production domain, or `http://localhost:3000`       |
| `NEXT_PUBLIC_SANITY_PROJECT_ID`  |                                                     |
| `NEXT_PUBLIC_SANITY_DATASET`     | `production`                                        |
| `NEXT_PUBLIC_SANITY_API_VERSION` | `2026-06-24`                                        |
| `SANITY_API_READ_TOKEN`          | optional; only for draft/live preview               |
| `SANITY_REVALIDATE_SECRET`       | optional; only for webhook revalidation             |
| `RESEND_API_KEY`                 | server-only; required for contact delivery          |
| `RESEND_FROM_EMAIL`              | verified sender, e.g. `Website <hello@example.com>` |
| `RESEND_TO_EMAIL`                | recipient inbox, e.g. `contact@example.com`         |
| `GOOGLE_SITE_VERIFICATION`       | optional; only for Search Console                   |

The design is authoritative for copy, palette, typography, assets, routes,
layout, and responsive behavior. The agent snapshots the completed intake to
`docs/project-brief.md`, then tracks execution in `docs/client-build-plan.md`.
