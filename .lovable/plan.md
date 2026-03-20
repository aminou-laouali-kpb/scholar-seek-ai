

# Fix: Hero section invisible text on Recours Gracieux page

## Problem

The hero in `RecoursInfo.tsx` uses `bg-[var(--gradient-hero)]` — Tailwind's `bg-` prefix maps to `background-color`, but `--gradient-hero` is a `linear-gradient(...)` value which only works with the `background` shorthand property. Result: the gradient doesn't render, leaving a near-transparent background with white text on a white page.

Every other page in the app uses the utility class `gradient-hero` (defined in `index.css` as `.gradient-hero { background: var(--gradient-hero); }`) which works correctly.

## Fix

**File:** `src/pages/RecoursInfo.tsx` (line 71)

Replace:
```
<section className="relative overflow-hidden py-24 md:py-32 px-5 sm:px-6">
  <div className="absolute inset-0 bg-[var(--gradient-hero)] opacity-95" />
```

With:
```
<section className="relative overflow-hidden gradient-hero py-24 md:py-32 px-5 sm:px-6">
```

Remove the overlay `div` entirely — use the `gradient-hero` class directly on the section (same pattern as all other pages). No opacity overlay needed.

One line changed, one line removed. Instant fix.

