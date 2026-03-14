

# Phase 3.1: Platform Optimization Pass

This is a refinement-only pass. No rebuilds, no removals, no new architecture.

---

## Overview

14 improvement areas distilled into 7 implementation groups, touching ~20 files. No new database tables needed. No new dependencies.

---

## Group 1: Match Quality Labels + Better Recommendation Reasons

**Files:** `src/lib/matching.ts`, `src/components/dashboard/ScholarshipRecommendations.tsx`, `src/components/dashboard/AdmissionOpportunities.tsx`

Add a `matchLabel` field to match results based on percentage thresholds:
- 70%+ → "Strong match" / "Tres bon match"
- 45%+ → "Good fit" / "Bon match"  
- Below → "Worth exploring" / "A explorer"

Display as a colored badge replacing the raw percentage. Green for strong, blue for good, neutral for explore.

Improve reason phrasing in `matching.ts` to be more natural:
- "Matches your preferred destination" → "This scholarship is available in your preferred country"
- "Aligns with your field of study" → "Covers programs related to your field"
- "Available for your study level" → "Open to students at your current level"
- Same treatment for French versions

---

## Group 2: Dashboard Copy, Empty States, and Visual Hierarchy

**Files:** `src/pages/Dashboard.tsx`, `src/components/dashboard/ProfileSummaryCard.tsx`, `src/components/dashboard/SavedItems.tsx`, `src/components/dashboard/ScholarshipRecommendations.tsx`, `src/components/dashboard/AdmissionOpportunities.tsx`

**Dashboard headings** — make benefit-driven:
- "Scholarships Recommended for Your Profile" → "Scholarships You Could Qualify For"
- "Admission Opportunities Matching Your Profile" → "Universities Accepting Students Like You"
- "Destination Tools for Your Profile" → "Find the Right University for Your Goals"
- "My Saved Items" → "Your Shortlist"

**Empty states** — add helpful guidance instead of blank areas:
- SavedItems currently returns `null` when empty → show a card: "You haven't saved anything yet. Browse scholarships or admissions below and bookmark the ones that interest you."
- ScholarshipRecommendations with 0 results → "Complete your profile to unlock personalized scholarship matches."
- AdmissionOpportunities with 0 results (non-partner filter) → "No matches yet. Update your profile or explore all admissions."

**ProfileSummaryCard** — add a gentle nudge when completion < 100%: "Complete your profile for better recommendations"

---

## Group 3: Smarter Next Steps Ordering

**File:** `src/components/dashboard/NextSteps.tsx`

Current logic shows undone steps in static order. Make it profile-aware:

Priority ordering rules:
1. If profile incomplete → "Complete your profile" first
2. If no program/orientation → "Choose your study program" second
3. If scholarship_interest is true and no saved scholarships → "Browse scholarships" higher
4. If has preferred destinations → deprioritize "Explore destinations"
5. If has saved items → add new step: "Review your shortlist and take action"
6. If advanced (profile complete + has saves + has destinations) → prioritize "Start application" and "Talk to advisor"

Also improve step descriptions to be more encouraging and action-oriented.

---

## Group 4: CTA Hierarchy Refinement

**Files:** `src/components/dashboard/ScholarshipRecommendations.tsx`, `src/components/dashboard/AdmissionOpportunities.tsx`, `src/pages/Partners.tsx`, `src/components/dashboard/SavedItems.tsx`

**Scholarship/Admission cards:**
- Primary CTA: "Check Eligibility" (instead of "Start Application" which sounds premature)
- Secondary: Save button stays
- Tertiary: "Talk to Advisor" as ghost button (already present on admissions, add to scholarships)

**Partner catalog:**
- Change "Apply" → "Get Started" or "Request Info"
- Add fallback text for missing tuition: "Tuition to confirm — contact KPB" instead of just "Contact advisor"
- Add fallback for generic eligibility: "Latest requirements available with KPB"

**Saved Items:**
- Add a CTA per item: small "View" or "Act on this" link
- When items exist, add a summary action: "Ready to move forward? Talk to an advisor about your shortlist"

---

## Group 5: Status Badges Consistency + Partner Catalog Polish

**Files:** `src/pages/Partners.tsx`, `src/pages/Scholarships.tsx`, `src/pages/admin/AdminScholarships.tsx`, `src/pages/admin/AdminAdmissions.tsx`

Create a shared `StatusBadge` component or inline consistent styling:
- `open` → green badge
- `rolling` → blue badge  
- `opening_soon` → amber badge
- `closed` → red/gray badge
- `paused` → gray badge
- `to_confirm` → amber outline badge
- `contact_us` → accent outline badge

Apply consistently across admin tables and student-facing cards.

**Partner catalog improvements:**
- Better mobile card layout (stack tuition info below program name on small screens)
- Show scholarship availability clearly: "Scholarships available" as a small green tag when `scholarship_available === "Yes"`
- Show application intake more prominently

---

## Group 6: Admin UX Polish

**Files:** `src/pages/admin/AdminDashboard.tsx`, `src/pages/admin/AdminScholarships.tsx`, `src/pages/admin/AdminAdmissions.tsx`, `src/pages/admin/AdminPartnerPrograms.tsx`

**AdminDashboard:**
- Add quick-action links on each stat card (click "Scholarships: 12" → goes to /admin/scholarships)
- Add "recent activity" summary: latest 5 application intents or consultation requests
- Add filter for "new this week" contact/questionnaire count

**Admin tables:**
- Add featured star indicator in table rows (yellow star icon for featured items)
- Add status filter options: `rolling`, `opening_soon`, `to_confirm` alongside existing `open/closed/paused`
- Better empty states: "No scholarships yet. Add your first scholarship to start matching students."
- Clearer distinction: show admin_notes as a muted italic row beneath the main row when present

---

## Group 7: Analytics Hooks + Bilingual/Mobile Polish

**Files:** `src/lib/analytics.ts` (new), multiple components

**Analytics readiness** — create a lightweight `track` utility:
```typescript
// src/lib/analytics.ts
export function track(event: string, properties?: Record<string, unknown>) {
  // Placeholder: log to console in dev, ready for GA/Mixpanel/Posthog
  if (import.meta.env.DEV) console.log('[analytics]', event, properties);
  // Future: window.gtag?.('event', event, properties);
}
```

Add `track()` calls at key points:
- `onboarding_completed` in CompleteProfile
- `orientation_completed` in Orientation
- `recommendation_clicked` in scholarship/admission cards
- `item_saved` / `item_unsaved` in useSavedItems
- `application_started` in ApplicationModal
- `whatsapp_clicked` on WhatsApp buttons
- `admin_publish` / `admin_unpublish` in admin tables

**Bilingual polish** — spot fixes:
- "fit" → "compatibilite" on admission cards (already good)
- Partner catalog: ensure all status labels have both EN/FR
- Empty states: ensure all new copy has both languages

**Mobile polish:**
- Partner catalog program rows: stack vertically on mobile instead of flex-row
- Dashboard recommendation cards: ensure badges don't overflow on small screens
- Admin mobile nav: already exists, verify status badges are readable

---

## Summary of Files Changed

| Group | Files Modified | Files Created |
|-------|---------------|---------------|
| 1 | `matching.ts`, `ScholarshipRecommendations.tsx`, `AdmissionOpportunities.tsx` | — |
| 2 | `Dashboard.tsx`, `ProfileSummaryCard.tsx`, `SavedItems.tsx` | — |
| 3 | `NextSteps.tsx` | — |
| 4 | `ScholarshipRecommendations.tsx`, `AdmissionOpportunities.tsx`, `Partners.tsx`, `SavedItems.tsx` | — |
| 5 | `Partners.tsx`, `Scholarships.tsx`, `AdminScholarships.tsx`, `AdminAdmissions.tsx` | — |
| 6 | `AdminDashboard.tsx`, `AdminScholarships.tsx`, `AdminAdmissions.tsx` | — |
| 7 | Multiple (hook calls) | `src/lib/analytics.ts` |

**No database changes.** No new dependencies. No architecture changes. Pure refinement.

