# Pattern Library

The shared pattern layer is intentionally small. It supports proposal pages
without deciding final copy, imagery, or visual direction before Figma/design
intake.

## Rules

- Prefer primitives, then proposal components, then route-local CSS, then new
  shared components.
- Keep component props semantic: heading, intro, items, actions, image.
- Keep shared recipes and CTA groups as Server Components where possible.
- Do not add a generic page-builder abstraction for this phase.
- Do not add Radix, React Aria, CVA, `tailwind-merge`, or a styled UI kit by
  default.

## Shared Types

Shared recipe types live in `src/components/sections/types`.

```ts
type PatternHref = LinkProps<string>["href"] | string;

type PatternAction = {
  label: React.ReactNode;
  href: PatternHref;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  event?: string;
  external?: boolean;
  ariaLabel?: string;
};
```

Proposal data types live in `src/features/proposals/index.ts`.

Current proposal section data is intentionally generic:

```ts
type ProposalSection = {
  id: string;
  label: string;
  eyebrow?: string;
  heading: string;
  intro?: string;
  tone?: "default" | "feature" | "contrast";
  blocks?: ProposalBlock[];
  nextLabel?: string;
};

type ProposalBlock =
  | { type: "text"; body: string[] }
  | { type: "cards"; items: { title: string; body?: string }[] }
  | { type: "timeline"; items: { label: string; detail?: string }[] }
  | { type: "details"; items: { label: string; detail?: string }[] }
  | {
      type: "summary";
      items: { label: string; value: string; detail?: string }[];
    }
  | { type: "media"; label: string; aspect?: "wide" | "square" | "portrait" };
```

## UI Primitives

- `Button`, `ButtonLink`, and `buttonClasses()` share variants and sizes.
- `ActionGroup` renders CTA lists and tracks `event` values when present.
- `TrackedLink` is the low-level client bridge for analytics-tracked links.
- `ImageFrame` provides stable `next/image` regions with `landscape`,
  `portrait`, `square`, and `wide` aspect options.

## Current Section Recipes

- `HeroSection`: first-screen route intros.
- `SplitSection`: media-and-copy sections.
- `CardGridSection`: values, resources, and feature lists.
- `StepsSection`: process and how-it-works content.
- `StatsSection`: compact proof points.
- `FaqSection`: native disclosure-based question lists.
- `CtaSection`: focused conversion bands.

## Optional Libraries

Add libraries only when their specific value is needed:

- Radix: dialogs, dropdowns, popovers, tooltips, selects, tabs, menus, and
  focus-trapped overlays.
- React Aria: advanced app-like controls such as comboboxes, date pickers, or
  collection selection.
- CVA: typed class variants when a component has many meaningful variants.
- `tailwind-merge`: conflict-safe Tailwind class merging when project code
  becomes Tailwind-class heavy.
