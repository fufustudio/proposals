# Performance

The proposal scaffold starts with minimal local content and no heavy visual
assets.

## Images

- Use `next/image` for meaningful images when real proposal design assets are
  added.
- Provide useful alt text for meaningful images.
- Give fixed-format media stable dimensions with aspect ratios or explicit
  width/height.
- Avoid large CSS background images unless the final design requires them.

## Layout Stability

- Reserve stable space for proposal metadata, section controls, and future media.
- Avoid swapping access form states with dramatically different heights.
- Check long client names, long section titles, and currency/price labels before
  handoff.

## Verification

```bash
npm run verify:release
```

Use Lighthouse results as a signal, then confirm real proposal pages manually on
mobile and desktop.
