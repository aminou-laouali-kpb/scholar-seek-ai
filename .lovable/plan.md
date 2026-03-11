

## Plan: Premium Mobile-First Homepage Redesign

Inspired by the Yocket/LeapScholar/LeverageEdu references — immersive hero with the hero image visible on mobile, better screen ratios, stronger visual hierarchy, and punchier CTAs.

### Changes to `src/pages/Index.tsx`

**Hero section overhaul (mobile-first):**
- Show the hero image on mobile too (currently `hidden lg:block`) — use it as a full-bleed background image with dark overlay, similar to Yocket/LeverageEdu style
- Larger, bolder headline with the accent highlight on a separate line
- Tighter, punchier subtitle
- Full-width stacked CTA buttons on mobile with better sizing
- Stats row displayed as a horizontal pill/badge strip below CTAs
- Floating "500+ students" badge visible on mobile too (repositioned)

**Tools section:**
- On mobile, show as a horizontal scrollable carousel (2 visible) instead of stacked grid — reduces scroll fatigue
- Or keep grid but limit to 2 columns on mobile with smaller cards

**How it works:**
- Horizontal step indicators on mobile instead of 3 stacked blocks — more compact

**Testimonials:**
- Horizontal scroll on mobile (single card visible at a time) instead of stacked

**General mobile improvements:**
- Reduce section padding on mobile (`py-10` instead of `py-12`)
- Tighter spacing between sections
- Larger touch targets for CTAs
- Better visual rhythm — alternating section backgrounds already exist, keep them

### Changes to `src/index.css`

- Add a `.shadow-hero` utility if not present (already exists as CSS var)
- Possible new utility for hero overlay

### No translation changes needed
Current hero copy is already strong. No new i18n keys required.

### Files changed

| File | Change |
|------|--------|
| `src/pages/Index.tsx` | Full hero redesign (mobile image, layout, CTAs), mobile-optimized sections |
| `src/index.css` | Minor utility additions if needed |

