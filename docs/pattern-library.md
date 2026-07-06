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

Current proposal slide data is intentionally deck-oriented:

```ts
type ProposalSlide = {
  id: string;
  label: string;
  eyebrow?: string;
  heading: string;
  intro?: string;
  note?: string;
  layout:
    | "cover"
    | "split"
    | "statement"
    | "grid"
    | "list"
    | "timeline"
    | "pricing"
    | "appendix";
  blocks: ProposalBlock[];
};

type ProposalBlock =
  | { type: "cover"; title: string; tagline: string; actionLabel: string }
  | { type: "text"; body: string[] }
  | { type: "numberedRows"; items: { title: string; body: string }[] }
  | {
      type: "pillars";
      items: { kicker?: string; title: string; body?: string }[];
    }
  | { type: "sitemap"; columns: { title: string; items: string[] }[] }
  | { type: "workstreams"; items: { title: string; body: string }[] }
  | {
      type: "timeline";
      items: {
        kicker?: string;
        label: string;
        detail?: string;
        milestone?: string;
      }[];
    }
  | { type: "pricing"; items: PricingOption[] }
  | {
      type: "priceList";
      items: { title: string; body: string; price: string }[];
    }
  | { type: "pricePanel"; price: string; suffix?: string; features: string[] }
  | { type: "steps"; items: { title: string; body: string }[] }
  | { type: "details"; items: { label: string; detail?: string }[] }
  | { type: "cta"; label: string; href: string }
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
