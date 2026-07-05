# Design To Proposal Site

Use this runbook when real proposal design, copy, or assets arrive from Figma,
screenshots, documents, or another source. The goal is to replace the fake
fixture with a verified private proposal experience.

## Intake

- Read `AGENTS.md`, this runbook, `docs/project-brief.md` when present,
  `docs/project-brief.template.md`, `docs/proposal-build-plan.template.md`, and
  `docs/component-registry.md`.
- Snapshot completed intake into `docs/project-brief.md` before making product
  decisions that cannot be inferred from the design or supplied copy.
- Create a live build plan by copying `docs/proposal-build-plan.template.md` to
  `docs/proposal-build-plan.md` or `.agent/proposal-build-plan.md`.
- Confirm the design source:
  - Preferred: Figma MCP frame or layer links.
  - Acceptable fallback: exported screenshots plus explicit asset files.
  - Low-fidelity fallback: screenshots only; record visual assumptions.

## Route Map

- Confirm which proposal slugs should exist.
- Keep proposal detail routes private and omitted from sitemap entries.
- Confirm whether `/` should list proposals, act as a neutral entry screen, or
  redirect to a specific proposal.

## Content Model

- Treat supplied proposal copy as authoritative.
- Keep content semantic: overview, scope, deliverables, timeline, investment,
  terms, next steps, or other real proposal concepts.
- Keep pages thin by shaping data in `src/content/proposals.ts` and rendering
  through proposal components.
- Do not encode one-off visual names into proposal data fields.

## Component Plan

- Map design frames to existing primitives first: `Section`, `Container`,
  `PageHeader`, `SectionHeading`, `TextLink`, `Button`, `ButtonLink`,
  `ActionGroup`, grid helpers, and CSS Modules.
- Use `docs/component-registry.md` to decide whether a pattern should be shared
  or route-local.
- Add a shared component only when multiple proposal surfaces need it or the
  design introduces a clear reusable primitive.
- Preserve semantic headings, accessibility labels, focus states, alt text, and
  reduced-motion behavior.

## QA

- Run the dev server and open every implemented route.
- Check at least one mobile viewport and one desktop viewport.
- Verify locked and unlocked proposal states.
- Check long-copy wrapping and fixed-format UI stability.
- Run `npm run verify:quick` during the edit loop and
  `npm run verify:handoff` before sharing.
