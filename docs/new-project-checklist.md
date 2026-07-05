# New Project Checklist

Use this when creating a project from `fufustudio/fufu-starter`.

## First Hour

- Create the new repo with GitHub's "Use this template" flow.
- Rename `package.json` `name`, README title, and `SITE_NAME`.
- Copy `.env.example` to `.env.local`.
- Set `NEXT_PUBLIC_SITE_URL` for local or preview work.
- Run `npm install`.
- Run `npm run dev` and check the starter route: `/`.

## Product Shape

- For design-led builds, snapshot intake into `docs/project-brief.md`, create a live build plan from `docs/client-build-plan.template.md`, and follow `docs/design-to-site.md`.
- Provide Figma MCP frame or layer links when possible. If using screenshots, include exported assets and document assumptions.
- Configure Sanity for the client project. Keep local fallbacks working until credentials are available.
- Add real routes and route metadata.
- Replace starter fallback content and mirror reusable/editable content in Sanity.
- Add real brand tokens in `src/app/globals.css` and mirror core values in `src/lib/theme.ts`.
- Add favicon and real visual assets only when the project needs them.

## Route Replacement Checklist

- Update `src/app/(site)` with the actual public route set.
- Update `src/content` for local content or remove unused starter content.
- Update header and footer navigation in `src/lib/site-defaults.ts`.
- Update `src/app/sitemap.ts`.
- Update route metadata and OpenGraph requirements.
- Update `tests/e2e/site-smoke.spec.ts` when routes are removed, renamed, or added.
- Remove unused starter route folders, components, content, and tests.

## Sanity Setup

- Create a Sanity project and dataset.
- Add `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, and `NEXT_PUBLIC_SANITY_API_VERSION`.
- Add local and deployed origins in Sanity CORS settings.
- Open `/studio` and confirm login works.
- Run `SANITY_DRY_RUN=1 npm run sanity:seed`.
- Run `npm run sanity:seed` only if the starter `siteSettings` and `home`
  content are still useful.
- Run `npm run verify:content` after the live dataset should be valid.

## Optional Forms And Analytics

- Choose the form provider or replace the starter handler.
- For Resend contact delivery, add `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, and
  `RESEND_TO_EMAIL` as server-only environment variables.
- Verify the sending domain in Resend before production delivery.
- Confirm `inquiry_submitted` tracks only after a real successful submission.
- Add or rename analytics events near the component that fires them.

## Before Launch

- Configure deployment environment variables.
- Configure the production domain.
- Confirm changed routes, env vars, asset sources, Sanity changes, forms, analytics events, tests run, responsive QA, and known gaps are documented in the handoff.
- Run `npm run verify:working` during active development.
- Run `npm run verify:template`.
- Run `npm run verify:handoff` for client-site handoff when Playwright is ready.
- Run `npm run verify:ci` for browser and accessibility coverage.
- Run `npm run verify:release` for performance-sensitive launches.
- Search for placeholder copy and unfinished TODOs.
- Confirm sitemap, robots, OpenGraph image, metadata, forms, analytics, and responsive layouts.

## Template Repo

For the starter itself, enable GitHub template mode in repository settings:

- Repository settings.
- General.
- Template repository.
- Check the box.
