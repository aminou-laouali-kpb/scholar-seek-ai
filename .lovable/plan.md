

## Plan: Dark Gold Accent Color + Responsive Layout Improvements

### 1. Darken the Gold Accent Color

Current accent: `38 92% 50%` (bright gold `#f59e0b`). On white backgrounds, this lacks contrast.

Change to a darker, richer gold:
- `--accent: 40 85% 42%` (~`#c6910d`) — darker amber gold, readable on white
- `--accent-warm: 28 75% 45%` — matching warm tone
- Update `--gradient-accent` to use darker gold tones
- Ensure `--accent-foreground` is white (`0 0% 100%`) for buttons on gold backgrounds

**Files:** `src/index.css`

### 2. Responsive Layout Fixes

**Header (`Header.tsx`):**
- Reduce logo height on small screens (`h-10 md:h-14`)
- Stack right-side actions better on tablet
- Ensure mobile menu has proper padding and touch targets

**Homepage (`Index.tsx`):**
- Hero: Better mobile spacing (`py-14 md:py-32`), smaller text on mobile (`text-3xl sm:text-4xl lg:text-6xl`)
- Hero CTA buttons: Full width on mobile (`w-full sm:w-auto`)
- Hero stats: Better wrapping on small screens
- Tool cards: Single column on mobile, proper gaps
- Blog preview cards: Reduce image height on mobile
- Final CTA: Smaller text on mobile
- Ensure all sections use consistent `section-padding` with tighter mobile padding

**Questionnaire (`Questionnaire.tsx`):**
- Reduce padding on mobile (`p-5 md:p-10`)
- Ensure option buttons have adequate touch targets

**Footer (`Footer.tsx`):**
- Better mobile grid (2-col on small screens)

**Global (`index.css`):**
- Adjust `section-padding` for better mobile rhythm: `py-12 md:py-24`

### 3. Button Accent Variant Contrast

Update `button.tsx` accent variant to use the new darker gold with white text for better readability on both white and dark backgrounds.

### Files to Modify
- `src/index.css` — darker gold accent, adjusted mobile padding
- `src/pages/Index.tsx` — responsive hero, cards, CTAs
- `src/components/layout/Header.tsx` — mobile logo sizing, touch targets
- `src/components/layout/Footer.tsx` — mobile-friendly grid
- `src/pages/Questionnaire.tsx` — mobile padding
- `src/components/ui/button.tsx` — accent foreground to white

