/**
 * Role palette for contexts that can't read CSS variables (the OG image runs
 * in the edge runtime). Keep these values in sync with the `@theme` block in
 * `globals.css` — together they are the rebrand surface.
 */
export const theme = {
  bg: "#f6f2ea",
  fg: "#1c1a15",
  body: "#3a372f",
  surface: "#fbf8f1",
  muted: "#ddd5c8",
  accent: "#925335",
  accentSoft: "#ead9ce",
  feature: "#efe8dc",
  light: "#f6f2ea",
} as const;
