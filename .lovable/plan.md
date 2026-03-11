

## Plan: Split-Layout Hero — Solid Blue Top + Image Bottom

Replace the current full-bleed image+overlay hero with a two-part layout on mobile:

**Top portion** — solid dark blue (`hsl(220, 72%, 14%)`) background containing:
- Headline, subtitle, CTAs, stat pills
- No image behind text = guaranteed readability

**Bottom portion** — the hero image displayed as a visible photo strip with rounded corners, slight overlap into the blue section

**Desktop** — keeps the current side-by-side layout but with solid blue background instead of image overlay

### Changes — `src/pages/Index.tsx` (lines 43-126)

Replace the hero `<section>` with:

```
Mobile layout:
┌─────────────────────┐
│  solid dark blue bg  │
│                      │
│   Headline (white)   │
│   Accent highlight   │
│   Subtitle           │
│   [CTA Button]       │
│   [CTA Button]       │
│   ✦ stat ✦ stat      │
│                      │
├─────────────────────┤
│                      │
│   ┌───────────────┐  │
│   │  hero image   │  │
│   │  (rounded)    │  │
│   └───────────────┘  │
│   floating badge     │
│                      │
└─────────────────────┘
```

- Remove the absolute-positioned background image + gradient overlay
- Section gets `bg-[hsl(220,72%,14%)]` solid background
- Text content stays in a normal flow div (no z-index needed)
- Below CTAs/stats, add the hero image as a visible `<img>` with `rounded-2xl`, `shadow-hero`, slight negative margin to overlap
- Mobile floating badge sits below/over the image
- Desktop: grid layout with text left, image right (replacing the stats card)

### Files changed

| File | Change |
|------|--------|
| `src/pages/Index.tsx` | Hero section restructured to split layout |

