# Performance

The starter keeps performance work straightforward by starting with minimal content and no heavy visual assets.

## Images

- Use `next/image` for meaningful images and above-the-fold media.
- Use `BackgroundImageLayer` only when a project needs cover-style responsive imagery.
- Avoid large CSS background images.
- Provide useful alt text for meaningful images.
- Keep Sanity-hosted images flowing through `src/lib/next-image-loader.ts`.

## Layout Stability

- Give fixed-format media stable dimensions.
- Avoid swapping form states with wildly different heights.
- Reserve space for interactive elements that appear after hydration.

## Verification

```bash
npm run verify:release
```

Use Lighthouse results as a signal, then confirm real pages manually on mobile and desktop.
