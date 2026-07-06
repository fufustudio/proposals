# Component Registry

Use this registry when deciding whether a proposal design should use UI
primitives, proposal components, route-local code, or new shared components.

Selection order:

1. Use UI primitives for page structure and repeated controls.
2. Use proposal components for proposal-specific reader/access surfaces.
3. Use route-local CSS Modules for one-off composition.
4. Add a new shared component only when the pattern repeats or owns behavior.

## Layout

- `Section` owns vertical rhythm, tone, and major page bands.
- `Container` owns gutters and max width.
- `site-grid` and grid helpers own cross-page alignment.
- Page-specific CSS Modules own unusual composition that appears on one route.
- Add a new layout component only when the same structure appears in multiple
  routes or proposal sections.

## Proposal Components

- `ProposalAccessForm` owns the password form markup for proposal access.
- `ProposalReader` maps local proposal data into the generic presentation layer.
- `ProposalDeck` owns slide progress, active-slide state, hash syncing,
  keyboard navigation, and previous/next controls for the horizontal deck.
- `ProposalSlideBlocks` renders reusable proposal deck blocks: cover, text,
  numbered rows, pillars, sitemap columns, workstreams, timeline, pricing,
  add-ons, care plan, steps, disclosures, CTA, and media placeholders. Keep this
  renderer exhaustive when adding block types.
- Keep proposal components semantic and reusable. Add more specific components
  only after the real proposal structure repeats enough to justify them.

## Buttons And Links

- Use `buttonClasses()` for button-like CTAs.
- Use `Button` and `ButtonLink` when a reusable primitive is clearer than a raw
  element plus classes.
- Use `ActionGroup` for repeated CTA groups.
- Use `TextLink` for inline or understated navigation.
- Reusable link props should use the shared `PatternHref` shape so typed routes,
  URL objects, hash links, and external URL strings are accepted consistently.

## Media

- Use `next/image` for meaningful images.
- Use `ImageFrame` for stable recipe-level image regions.
- Keep SVG icons in components only when they are part of a reusable UI
  primitive; otherwise export assets intentionally.

## Forms

- Use `FormField` for reusable field labeling, descriptions, errors, and
  accessible described-by wiring.
- Keep proposal access submission behavior inside the route-level form target.
- Preserve password labels, error states, and HttpOnly cookie behavior.

## When To Create A New Component

Create a new shared component when:

- the design repeats the pattern in at least two places.
- the pattern has meaningful behavior, state, or accessibility requirements.
- a component makes a data boundary clearer.

Keep code route-local when:

- the layout appears once.
- the styling depends heavily on a single page composition.
- extracting it would create a generic wrapper with no reusable behavior.
