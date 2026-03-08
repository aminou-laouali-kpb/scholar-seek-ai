

## Phase 3 Plan: Intelligent Student Guidance System

This is a large upgrade. I'll break it into manageable pieces that build on top of the existing codebase without removing anything.

---

### Database Changes

Create 3 new tables via migration:

**`saved_items`** — stores bookmarked scholarships/admissions/destinations
- `id`, `user_id`, `item_type` (enum: scholarship, admission, destination), `item_id` (text), `is_priority` (boolean, default false), `created_at`
- RLS: users can CRUD their own items only

**`consultation_requests`** — stores advisor/application requests
- `id`, `user_id`, `request_type` (text: application, consultation, support), `item_type`, `item_id`, `message`, `status` (text, default 'pending'), `created_at`
- RLS: users can insert/view their own

**`application_intents`** — tracks when a student starts an application flow
- `id`, `user_id`, `item_type`, `item_id`, `item_name`, `status` (text, default 'started'), `created_at`
- RLS: users can CRUD their own

Also add columns to `profiles`:
- `preferred_destinations` (text[] — array of country codes)
- `budget_sensitivity` (text — low/medium/high)
- `scholarship_interest` (boolean, default true)

---

### New Files to Create

| File | Purpose |
|------|---------|
| `src/data/scholarships.ts` | ~20 curated scholarship records with matching logic fields (country, program, level, eligibility) |
| `src/data/admissions.ts` | ~15 curated admission opportunity records with matching fields |
| `src/components/dashboard/ScholarshipRecommendations.tsx` | Scholarship cards with match %, save, start application CTAs |
| `src/components/dashboard/AdmissionOpportunities.tsx` | Admission cards with fit level, save, apply CTAs |
| `src/components/dashboard/NextSteps.tsx` | Profile-aware next steps generator |
| `src/components/dashboard/SavedItems.tsx` | Saved items list with priority toggle |
| `src/components/dashboard/ProfileSummaryCard.tsx` | Compact profile card with edit link |
| `src/components/dashboard/ApplicationModal.tsx` | Modal for "Start Application" / "Request Support" flows |
| `src/hooks/useSavedItems.ts` | Hook for save/unsave/toggle priority with Supabase |
| `src/lib/matching.ts` | Profile-based matching/scoring logic for scholarships & admissions |

### Files to Modify

| File | Changes |
|------|---------|
| `src/pages/Dashboard.tsx` | Complete restructure into sectioned layout: Profile → Next Steps → Scholarships → Admissions → Destinations → Saved Items → Advisor |
| `src/pages/CompleteProfile.tsx` | Add preferred destinations (multi-select) and budget sensitivity fields |
| `src/i18n/translations.ts` | Add ~150 new keys for all Phase 3 sections in EN + FR |
| `src/contexts/AuthContext.tsx` | Update Profile interface for new fields |

---

### Matching Logic (`src/lib/matching.ts`)

Score each scholarship/admission against the student profile:
- Country match (birth/residence/preferred destinations) → +30 points
- Program/field match → +30 points
- Study level match → +20 points
- Budget compatibility → +10 points
- Scholarship interest → +10 points

Return sorted results with match percentage and a human-readable "why it matches" sentence built from matched criteria.

### Scholarship & Admission Data

Curated static datasets (~20 scholarships, ~15 admissions) covering France, Belgium, Canada, China, USA with real-sounding entries. Each entry includes:
- `id`, `name`, `country`, `programs[]`, `levels[]`, `description` (en/fr), `eligibility` (en/fr), `deadline` (placeholder), `url` (placeholder)

### Next Steps Logic

Profile-state-driven checklist:
- No profile completed → "Complete your profile"
- No program → "Take orientation test" or "Choose your program"
- No preferred destinations → "Explore destination options"
- No saved items → "Browse scholarships" / "Save universities"
- Has saved items → "Review your saved items" / "Start an application"
- Has orientation result → "Explore programs in your field"
- Generic → "Prepare documents" / "Contact advisor"

Each step: icon, title, description, CTA button linking to the right page/action.

### Dashboard Layout (top to bottom)

1. **Hero banner** with name + profile completion % bar
2. **Next Steps** — 3-4 profile-aware action cards
3. **Scholarships** — horizontal scroll or grid, 3-6 matched cards
4. **Admissions** — grid, 3-6 matched cards
5. **Destinations & Tools** — existing section (kept as-is, slightly refined)
6. **Saved Items** — tabbed (All / Scholarships / Admissions / Destinations) with priority stars
7. **Advisor CTA** — bottom sticky or section

### Application Modal

When clicking "Start Application" or "Request Support":
- Modal with item details recap
- Form: message, preferred contact method
- Saves to `application_intents` or `consultation_requests`
- Shows confirmation + WhatsApp fallback link

---

### Technical Notes

- All new components use existing design system (card styles, accent colors, motion animations)
- All text uses `t()` from LanguageContext — no hardcoded strings
- Saved items use optimistic UI via the `useSavedItems` hook
- Scholarship/admission data is static for now but structured for future API replacement
- Mobile-first: all grids collapse to single column, horizontal scroll for card carousels

