# Sanity CMS

Sanity is the baseline CMS for client builds. The starter still keeps local
fallbacks so default local development and CI can run before live Sanity
credentials are configured.

## Documents

- `siteSettings` - singleton for shared site facts.
- `page` - repeatable generic page content.
- `service` - repeatable offering or feature content.
- `post` - repeatable article-style content.

## Rules

- Use `defineType`, `defineField`, and `defineArrayMember`.
- Let Sanity generate IDs for repeatable documents.
- Use explicit IDs only for true singletons such as `siteSettings`.
- Keep fields semantic. Avoid layout knobs unless the project intentionally needs editor-controlled layout.
- Keep GROQ queries static and parseable by Sanity TypeGen.

## Setup

```bash
cp .env.example .env.local
```

Fill:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2026-06-24
```

Then:

```bash
npm run dev
```

Open `/studio`.

## Seed And Validation

```bash
SANITY_DRY_RUN=1 npm run sanity:seed
npm run sanity:seed
npm run verify:content
```

`SANITY_DRY_RUN=1 npm run sanity:seed` is a no-network preview of the writes the
script would make. It should work without Sanity project access.

The seed script upserts only the `siteSettings` singleton by explicit ID and
creates the `home` page document by slug when missing. Other repeatable
documents are not seeded in the reusable starter.

If Studio reports missing array keys after API-created content:

```bash
npm run sanity:repair-keys
```

## Production Sanity Path

Default local development and CI must still work without live CMS credentials.
For production-grade authoring, use this path:

- Create a standalone Studio beside the Next app for new projects. Keep the
  embedded `/studio` route only for lightweight starter use or existing
  projects that intentionally want it.
- Add local, preview, and production app URLs to Sanity CORS origins with
  credentials enabled.
- Add `SANITY_API_READ_TOKEN` only when draft content, live preview, or Visual
  Editing is required. Use a Viewer token.
- Add `SANITY_REVALIDATE_SECRET` only when webhooks revalidate paths or tags.
- Add `defineLive` in a project-specific `src/sanity/lib/live.ts`, render
  `<SanityLive />` in the public app layout, and render `<VisualEditing />` only
  when Draft Mode is enabled.
- Add a Draft Mode route using `defineEnableDraftMode` when the Presentation
  Tool or preview links need to enter draft mode.
- Keep metadata and static params clean of draft/Stega data. Disable Stega for
  SEO queries and fetch published content for static params.
- Include `_key` in array projections and use `_key` as React keys for arrays
  that may be edited visually.
- Use path or tag revalidation webhooks only after deciding the content update
  model. Time-based revalidation is enough for many simple marketing sites.

This production path should be implemented per client project; do not make live
credentials required for the starter's default verification commands.
