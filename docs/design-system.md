# Design System

The starter provides a restrained layout and styling contract, not a finished brand.

## Theme Tokens

Edit the `@theme` block in `src/app/globals.css` for project colors and fonts. Mirror core values in `src/lib/theme.ts` for OpenGraph image generation.

Components should reference semantic tokens such as `bg-feature`, `text-accent`, `text-light`, and `border-muted`. Do not scatter raw hex values through components.

## Typography

Fonts are loaded in `src/app/layout.tsx`. Project routes should use:

- native headings for document structure.
- `.eyebrow` for small section labels.
- `.body-*` utilities for shared text scale.
- component CSS modules for local adjustments.

Do not scale font size directly with viewport width. Keep letter spacing at `0` unless a compact label style explicitly needs spacing.

## Layout

Default composition:

```tsx
<Section size="default" tone="default">
  <Container size="xl" className="site-grid">
    ...
  </Container>
</Section>
```

- `Section` owns vertical rhythm and tone.
- `Container` owns gutters and max width.
- `site-grid` keeps cross-page alignment consistent.
- Reusable component folders own their CSS modules.
- Section recipe extension props are limited to outer section class, container
  class, and section size. Use them to fit project composition, not as a
  substitute for route-local CSS or new repeated recipes.

Use `docs/component-registry.md` with `docs/design-to-site.md` when translating a design into starter primitives.

## Buttons And Links

Use `Button`, `ButtonLink`, and `buttonClasses()` for button-like CTAs,
`ActionGroup` for section CTA rows with optional analytics events, and
`TextLink` for inline navigation. Shared link props use `PatternHref` so typed
routes, URL objects, hash links, and external URL strings work consistently. Add
a new shared button variant only when multiple surfaces need it.

## Responsive Rules

- Start single-column.
- Collapse complex grids at `md` unless the component documents another breakpoint.
- Keep tap targets comfortable.
- Do not rely on hover for essential information.
- Preserve `prefers-reduced-motion` behavior for any animation.
