<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes - APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Agent Guide

Canonical instructions for Codex, Claude Code, and other coding agents working in this repo.

## What This Is

`fufu-starter` is a lightweight Fufu house-style starter. It should enforce consistent structure, verification, styling, and data-boundary patterns while staying light on product/domain assumptions.

The default app is intentionally small: `/`, optional `/studio`, `/api/contact`, and metadata routes. Do not turn the starter into a fake business website. Add examples only when they teach a reusable implementation pattern.

## Design-To-Site Workflow

When building from a Figma file, Claude design file, screenshot, or design brief:

- Use `docs/design-to-site.md` as the canonical process runbook.
- Snapshot intake into `docs/project-brief.md` before making product decisions that cannot be inferred from the repo or design.
- Create and maintain `docs/client-build-plan.md` or `.agent/client-build-plan.md` before major edits.
- Prefer Figma MCP frame or layer links; record assumptions when working from screenshots.
- Treat design copy as authoritative and Sanity as the client-build content baseline. Keep local fallbacks only so development and CI work before credentials are configured.
- Replace unused starter examples with project-specific routes and content.
- Verify desktop and mobile behavior before handoff, then report changed routes, env vars, assets, Sanity changes, tests run, browser QA, and known gaps.

## Commands

- `npm run dev` - start the dev server at http://localhost:3000.
- `npm run verify:quick` - fast edit loop: component structure, lint, typecheck, and unit tests.
- `npm run verify:working` - active development gate: generated CSS/Sanity types, component structure, format check, lint, typecheck, unit tests, and build.
- `npm run verify:template` - full starter handoff path without live CMS credentials.
- `npm run verify:handoff` - client-site final gate: template verification plus Playwright e2e.
- `npm run verify:ci` - CI parity with Playwright browser install and e2e checks.
- `npm run verify:release` - CI tier plus Lighthouse CI.
- `npm run template:clean` - fail on forbidden old client strings.
- `npm run typecheck` - run Next route type generation and TypeScript.
- `npm run typegen` - generate Sanity schema/query types.
- `npm run css-types` - generate CSS Module declarations.
- `npm run check:generated` - fail if generated files are stale or untracked.
- `npm run test` - run unit tests.
- `npm run test:e2e` - run Playwright smoke/accessibility checks against the current production build.
- `npm run verify:content` - live Sanity content validation after a client project configures Sanity.

Use Node.js 22 and npm 10, matching `package.json`, `.node-version`, and CI.

## When To Read More

| Change area                                                      | Read first                                        |
| ---------------------------------------------------------------- | ------------------------------------------------- |
| New repo setup                                                   | `docs/new-project-checklist.md`                   |
| Website from a design file or brief                              | `docs/design-to-site.md`                          |
| Required project/design inputs                                   | `docs/project-brief.template.md`                  |
| Long-running client build checklist                              | `docs/client-build-plan.template.md`              |
| Choosing existing components and shared-vs-local boundaries      | `docs/component-registry.md`                      |
| Pattern recipe APIs, section props, optional UI libraries        | `docs/pattern-library.md`                         |
| Architecture, data boundaries, route ownership                   | `docs/architecture.md`                            |
| Visual layout, spacing, typography, buttons, responsive behavior | `docs/design-system.md`                           |
| Sanity schemas, seed data, content validation                    | `docs/cms.md`                                     |
| Forms, analytics events, conversion tracking                     | `docs/forms-analytics.md`                         |
| Security, privacy, CSP, cookies, secrets, abuse controls         | `docs/security.md`                                |
| Images, loading behavior, Lighthouse, Core Web Vitals            | `docs/performance.md`                             |
| Deployment and launch checks                                     | `docs/launch.md`                                  |
| Template customization and final starter cleanup                 | `docs/template-customization.md`                  |
| Next.js APIs, routing, config, metadata, typed routes            | Local Next docs in `node_modules/next/dist/docs/` |

## Project Rules

- Pages compose content, data helpers, and reusable components. They should stay thin.
- Reusable components live under `src/components/**/index.tsx` with colocated `styles.module.css` when needed.
- `src/components/ui` owns low-level primitives. `src/components/sections` owns reusable page-section recipes. `src/components/site` owns shared site chrome.
- `globals.css` owns theme tokens, typography, grid helpers, shared hover states, and cross-page utilities.
- Component-only selectors belong in CSS Modules.
- Do not add hard-coded brand hex values in components. Promote reusable values to theme tokens.
- Use `Section`, `Container`, `PageHeader`, `SectionHeading`, `TextLink`, `Button`, `ButtonLink`, `ActionGroup`, and section recipes before creating new layout/button patterns.
- Keep text and examples minimal in the starter. Prefer typed extension points over placeholder content.
- Client builds use Sanity by default. Keep local fallbacks so default local dev and CI still work before live Sanity credentials are configured.
- Keep `.env.example`, README, and docs in sync when adding configuration.
- Run `npm run verify:template` before handoff.

## Sanity

Sanity config lives in `sanity.config.ts`; schema lives in `src/sanity/schemaTypes/`.

Current baseline model:

- Singleton: `siteSettings`
- Repeatable: `page`, `service`, `post`

Use `defineType`, `defineField`, and `defineArrayMember`. Let Sanity generate IDs for repeatable documents. Explicit IDs are reserved for true singletons such as `siteSettings`.

## Forms And Analytics

The contact form is a client component in `src/components/site/contact-form/index.tsx`. It validates name, email, and message fields, validates email shape, includes honeypots, submits through the server-side Resend route when configured, and tracks successful human submissions with `inquiry_submitted`.

Vercel Analytics events should stay close to the interaction surface that fires them.

## Do Not

- Do not reintroduce old client-specific content, assets, domains, IDs, or domain-specific copy.
- Do not add broad fake content just to make the starter look full.
- Do not bypass generated-file checks after changing CSS modules or Sanity schemas.
- Do not make live CMS credentials required for default CI.
- Do not remove accessibility labels, focus states, alt text, or reduced-motion handling while restyling.
