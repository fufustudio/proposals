# Component Registry

Use this registry when deciding whether a design should use UI primitives,
section recipes, route-local code, or new shared components. Prefer existing
patterns before creating new shared UI.

Selection order:

1. Use UI primitives for page structure and repeated controls.
2. Use section recipes for recognizable brochure, service, and content sections.
3. Use route-local CSS Modules for one-off composition.
4. Add a new shared component only when the pattern repeats or owns behavior.

## Layout

- `Section` owns vertical rhythm, tone, and major page bands.
- `Container` owns gutters and max width.
- `site-grid` and `grid-*` helpers own cross-page alignment.
- Section recipes expose `className`, `containerClassName`, and `sectionSize`
  for project composition only. Prefer route-local CSS for one-off visual
  deviations instead of growing recipe props.
- Page-specific CSS Modules own unusual composition that appears on one route.
- Add a new layout component only when the same structure appears on multiple
  routes or sections.

## Page Headers And Section Copy

- `PageHeader` is for route-level titles and intros.
- `SectionHeading` is for reusable section labels, headings, and intro copy.
- Native headings keep document structure; do not pick heading levels only for
  visual size.
- Use `.eyebrow`, `.body-*`, and heading utilities from `globals.css` when a
  shared text treatment is enough.

## Buttons And Links

- Use `buttonClasses()` for button-like CTAs.
- Use `Button` and `ButtonLink` when a reusable primitive is clearer than a
  raw element plus classes.
- Use `ActionGroup` for section-level CTA lists, especially when analytics
  events are attached.
- Use `TrackedLink` only when a standalone non-button link needs analytics.
- Use `TextLink` for inline or understated navigation.
- Reusable link props should use the shared `PatternHref` shape so typed routes,
  URL objects, hash links, and external URL strings are accepted consistently.
- Add a new button variant only when more than one surface needs it.

## Section Recipes

Use `docs/pattern-library.md` for detailed APIs.
That file also records when to add optional libraries such as Radix, React Aria,
CVA, `tailwind-merge`, or a styled UI kit.

- `HeroSection` is for first-screen route intros.
- `SplitSection` is for repeated media-and-copy sections.
- `CardGridSection` is for services, values, resources, and feature lists.
- `StepsSection` is for process and how-it-works content.
- `StatsSection` is for compact proof points.
- `FaqSection` is for native disclosure-based question lists.
- `CtaSection` is for focused conversion bands.
- `RichTextSection` wraps Sanity or local Portable Text body copy.

## Media

- Use `next/image` for meaningful images.
- Use `BackgroundImageLayer` for Sanity-backed cover imagery with hotspot and
  blur support.
- Use `ImageFrame` for stable recipe-level image regions.
- Use `PatternImage` pass-through fields for quality, blur placeholders, and
  object position before introducing recipe-specific image props.
- Use stable dimensions, `aspect-ratio`, or constrained wrappers for fixed
  media regions.
- Keep SVG icons in components only when they are part of a reusable UI
  primitive; otherwise export assets intentionally.

## Forms

- Use `FormField` for reusable field labeling, descriptions, errors, and
  accessible described-by wiring.
- Keep provider-specific submission behavior inside the route-level form
  component unless multiple forms share the same provider.
- Preserve honeypots, validation, success/error states, and analytics events.

## Content Boundaries

- Use `src/content` for local defaults and reused copy.
- Use `src/lib` for cross-route data helpers, SEO, env parsing, image helpers,
  and CMS boundaries.
- Use `src/sanity` for Sanity schema, Studio structure, and client helpers.
- Use `src/components/site` for shared site chrome such as header, footer, and
  chrome-specific sentinels.
- Keep one-off page copy in a route only when it will not be reused or edited in
  Sanity.

## When To Create A New Component

Create a new shared component when:

- the design repeats the pattern in at least two places.
- the pattern has meaningful behavior, state, or accessibility requirements.
- a component makes a data boundary clearer.
- the component belongs to the starter as a reusable implementation pattern.

Keep code route-local when:

- the layout appears once.
- the styling depends heavily on a single page composition.
- extracting it would create a generic wrapper with no reusable behavior.
