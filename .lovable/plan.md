

# Phase 3.3: Launch-Readiness Pass

Refinement-only. No rebuilds. Builds on Phase 3.2.

---

## Group 1: Homepage Upgrade

**File:** `src/pages/Index.tsx`, `src/i18n/translations.ts`

- Add a **Student Platform promo section** between "Why KPB" and "Testimonials" — a banner-style section highlighting the free student platform with CTAs: "Create My Account" → `/signup`, "Explore the Platform" → `/student-platform`
- Add a **"Destinations at a Glance"** compact row with country flags linking to `/destinations/:country` between How It Works and Services — improves internal linking and destination discoverability
- Update hero CTAs: primary → "Create My Account" (`/signup`), keep WhatsApp secondary. Add a tertiary ghost link: "Explore our tools" → `/tools`
- Update translations for both EN/FR for the new sections and revised CTA labels

---

## Group 2: Student Platform Gateway Overhaul

**File:** `src/pages/StudentPlatform.tsx`, `src/i18n/translations.ts`

The current page is decent but needs to feel more launch-ready and product-driven:

- **Add "How It Works" section** (3 steps: Sign up → Complete profile → Get matched) between feature cards and dashboard preview
- **Add trust/reassurance strip** below hero: "Free account", "No commitment", "Guided by KPB advisors" as pill badges
- **Improve dashboard preview cards** to feel more concrete — add mock data labels (e.g., "3 scholarships matched", "2 next steps pending")
- **Add "For Parents" reassurance blurb** near final CTA: "Parents, your child is in good hands. KPB guides every step."
- Remove any "coming soon" language from translations (`dashboard.cards.scholarships`, `dashboard.cards.admissions` still say "coming soon")
- Update translations for both languages

---

## Group 3: Public-to-App Conversion Flow

**Files:** `src/pages/Scholarships.tsx`, `src/pages/CountryDetail.tsx`, `src/pages/Destinations.tsx`, `src/pages/Partners.tsx`

Add a **conversion banner** at the bottom of key public pages (before footer):
- Scholarships page → "Want personalized scholarship matches? Create your free account" → `/signup`
- CountryDetail → "Ready to study in {country}? Start your journey" → `/signup` or tool link
- Destinations listing → Add "Create your account to get matched" CTA after country grid
- Partners page → Already has CTAs; add a "Not sure which school? Let us match you" section after catalog pointing to `/signup`

Also on Scholarships page:
- Add "Sign up for personalized matches" as a subtle inline CTA between filter bar and results
- Link scholarship test CTA more prominently

---

## Group 4: Destination Pages Polish

**File:** `src/pages/CountryDetail.tsx`, `src/i18n/translations.ts`

- Add **"KPB Partner Schools in {country}"** section between admissions and student life — links to `/partners` filtered by country
- Add **"Related Scholarships"** section linking to `/scholarships` 
- Improve final CTA section: use benefit-driven heading like "Start Your {country} Journey Today" instead of just repeating "Start Your Application"
- Add internal link to `/student-platform` as a tertiary CTA: "Or create your free account for guided support"
- Add SEOHead component (currently missing)

---

## Group 5: Bilingual Copy Polish + "Coming Soon" Cleanup

**File:** `src/i18n/translations.ts`

- Remove "coming soon" from `dashboard.cards.scholarships` and `dashboard.cards.admissions` descriptions (these features are live)
- Update `studentPlatform.finalCtaSubtitle` from "Join thousands" to "Join 500+" (consistent with actual stats)
- Polish `hero.statLabels` — add proper FR labels if missing
- Update `scholarshipsPage.subtitle` to be more action-oriented: "Browse available scholarships and find funding for your studies" / FR equivalent
- Ensure all new copy added in Groups 1-4 has bilingual translations

---

## Group 6: Mobile & Visual Polish

**Files:** `src/pages/StudentPlatform.tsx`, `src/pages/CountryDetail.tsx`, `src/pages/Index.tsx`

- StudentPlatform hero CTAs: make buttons full-width on mobile (already `flex-col` on sm, verify sizing)
- CountryDetail: ensure stats grid doesn't overflow on mobile (2-col grid looks fine, verify text truncation)
- Scholarship cards: verify badge overflow on small screens — add `flex-wrap` if needed
- Partners program rows: verify mobile stacking works (already has `flex-col lg:flex-row`)
- Add `scroll-mt-20` to key sections for smooth anchor navigation

---

## Group 7: SEO & Internal Linking

**Files:** `src/pages/CountryDetail.tsx`, `src/pages/Destinations.tsx`, `src/components/layout/Footer.tsx`

- Add `SEOHead` to `CountryDetail.tsx` with country-specific title/description
- Add `SEOHead` to `Destinations.tsx` (already present, verify quality)
- Footer: add links to `/partners` and `/student-platform` for better internal linking
- Add `rel="noopener"` consistently on all external links (most already have it, verify)

---

## Files Summary

| Group | Files Modified |
|-------|---------------|
| 1 | `Index.tsx`, `translations.ts` |
| 2 | `StudentPlatform.tsx`, `translations.ts` |
| 3 | `Scholarships.tsx`, `CountryDetail.tsx`, `Destinations.tsx`, `Partners.tsx` |
| 4 | `CountryDetail.tsx`, `translations.ts` |
| 5 | `translations.ts` |
| 6 | `StudentPlatform.tsx`, `CountryDetail.tsx`, `Index.tsx` |
| 7 | `CountryDetail.tsx`, `Destinations.tsx`, `Footer.tsx` |

No database changes. No new dependencies. No new files created. Pure refinement pass across ~8 files.

