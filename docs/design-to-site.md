# Design To Site

Use this runbook when building a website from a Figma file, Claude design file,
screenshot set, or design brief. The goal is a complete local build with
verified desktop and mobile behavior, not automatic deployment.

Source of truth: Notion or the design link is user intake,
`docs/project-brief.md` is the repo-local normalized brief,
`docs/client-build-plan.md` is agent execution state, and the final response is
the handoff summary.

## Design Intake

- Read `AGENTS.md`, this runbook, `docs/project-brief.md` when present,
  `docs/project-brief.template.md` for expected fields,
  `docs/client-build-plan.template.md`, and `docs/component-registry.md`.
- Snapshot the completed intake into `docs/project-brief.md` before making
  product decisions that cannot be inferred from the repo or design.
- Create a live build plan by copying `docs/client-build-plan.template.md` to
  `docs/client-build-plan.md` or `.agent/client-build-plan.md`.
- Keep the live build plan current with progress, decisions, discoveries, open
  questions, verification results, and handoff notes.
- Confirm the design source:
  - Preferred: Figma MCP with frame or layer links.
  - Acceptable fallback: exported screenshots plus explicit asset files.
  - Low-fidelity fallback: screenshots only; record visual assumptions in the
    build plan and handoff.
- Stop only for missing decisions that materially affect the build, such as
  missing Sanity env values, unclear routes that cannot be inferred from Figma,
  form destinations, or required text that is not present in the design.

## Route Map

- Extract the intended public routes, shared chrome behavior, route metadata,
  sitemap expectations, and any redirects.
- Decide which starter routes are replaced, removed, or intentionally kept.
- Update route-specific tests and navigation expectations when the public route
  set changes.

## Content And Sanity Model

- Treat design copy as authoritative unless the user provides extra required
  text outside the design.
- Treat Sanity as the client-build baseline. Keep the starter's local fallback
  working only so development and CI can run before credentials are configured.
- Identify reusable content and editor-owned content from the design.
- Keep pages thin: they compose content, data helpers, and reusable components.
- Model Sanity fields semantically. Do not create fields that only describe the
  current layout, such as `redButton` or `threeColumnLayout`.

## Component Plan

- Use Figma MCP design context for variables, components, layout values,
  screenshots, assets, and responsive frames when available.
- Map the design to existing primitives first: `Section`, `Container`,
  `PageHeader`, `SectionHeading`, `TextLink`, `Button`, `ButtonLink`,
  `ActionGroup`, grid helpers, CSS Modules, and theme tokens.
- Then map recognizable brochure/content sections to
  `docs/pattern-library.md` recipes before creating route-local layouts.
- Use `docs/component-registry.md` to decide whether a pattern should be shared
  or route-local.
- Add a shared component only when multiple surfaces need it or the design
  introduces a clear reusable primitive.
- Preserve semantic headings, accessibility labels, focus states, alt text, and
  reduced-motion behavior.

## Asset Plan

- Inventory images, SVGs, icons, fonts, and video from the design before
  implementation.
- Use `next/image` for meaningful images and provide stable dimensions or
  aspect-ratio constraints.
- Record focal points, required alt text, decorative image decisions, and export
  formats in the live build plan.
- Promote reusable color, typography, and spacing decisions to theme tokens in
  `src/app/globals.css`; mirror OpenGraph-critical values in
  `src/lib/theme.ts`.

## Implementation Sequence

- Snapshot the intake source to `docs/project-brief.md`, then create
  `docs/client-build-plan.md` from design/repo discovery.
- Extract route map, shared chrome, sections, assets, forms, metadata, and
  editable content from Figma before implementation.
- Model Sanity schemas and data helpers before building page sections.
- Replace starter examples with project routes and content instead of layering a
  real site beside the demo.
- Update nav, footer, sitemap, route metadata, and route tests when the public
  route set changes.
- Keep `.env.example`, README, and relevant docs in sync when adding
  configuration.
- Update the live build plan after each major route, component, Sanity, form, or
  integration milestone.
- Use `npm run verify:quick` during the edit loop.

## Responsive QA

- Run the dev server and open every implemented route.
- Check at least one mobile viewport and one desktop viewport; add tablet checks
  when the design has tablet-specific frames.
- Compare against the design for layout, spacing, type scale, color, imagery,
  navigation, forms, and interactive states.
- Check long-copy wrapping and fixed-format UI stability.

## Accessibility QA

- Check keyboard navigation, visible focus states, labels, headings, landmarks,
  form errors, and meaningful alt text.
- Preserve `prefers-reduced-motion` behavior for animation.
- Run Playwright/axe checks when route behavior changed or before handoff for
  client sites.

## Performance QA

- Confirm meaningful images use `next/image`, stable dimensions, and sensible
  sizes.
- Avoid large unoptimized background images and unnecessary client components.
- Run `npm run verify:release` when performance matters for launch.

## Launch/Handoff

- Run `npm run verify:template` before starter handoff.
- Use `npm run verify:handoff` as the semantic final gate for client projects
  when Playwright browsers are available.
- Include handoff notes from the live build plan: changed routes, removed
  starter routes, Sanity changes, environment variables, forms, analytics,
  verification results, responsive/browser QA, known gaps, and open questions.
