# Architecture

This starter is a minimal Next.js App Router application with Sanity support for
client builds and local fallbacks for credential-free development.

## Request Flow

1. Routes in `src/app/(site)` compose site chrome, reusable UI primitives,
   section recipes, and local content.
2. `src/lib/cms.ts` returns local defaults until Sanity credentials are configured.
3. `src/app/(site)/layout.tsx` loads site settings once for shared chrome and structured data.
4. Optional Sanity Studio is mounted at `/studio` outside the public route group.

## Core Directories

- `src/app/` - routes, route groups, metadata, sitemap, robots, OpenGraph image, Studio route.
- `src/components/ui/` - low-level primitives such as buttons, containers,
  section wrappers, form fields, links, image frames, and copy helpers.
- `src/components/sections/` - reusable page-section recipes for basic
  brochure, service, and content sites.
- `src/components/site/` - shared site chrome such as header, footer, and
  chrome-specific helpers.
- `src/content/` - tiny local defaults and examples.
- `src/lib/` - env, SEO, CMS helpers, image helpers, theme mirror.
- `src/sanity/` - Sanity schema, Studio structure, client helpers.
- `scripts/` - generated-file checks, component validation, template guard, CMS utilities.

## Ownership Rules

- Pages own composition.
- UI primitives own reusable controls and layout atoms.
- Section recipes own repeated page-section composition.
- Site components own shared chrome.
- `src/lib` owns cross-route logic.
- `src/content` owns local examples and defaults.
- `src/sanity` owns the Sanity CMS shape.

Do not duplicate content constants in JSX. If content is reused, move it to
`src/content` as a local fallback and model it in Sanity for client builds.

## Default Data Boundary

The starter must work without live CMS credentials. `getSiteSettings()` returns
local defaults until Sanity is configured. Client builds should configure
Sanity by default.
