

# Plan: Fulbright Landing Page + Eligibility Test + Dashboard Module

## Overview

3 new pages, 1 new dashboard component, 1 new test engine. Fully bilingual (FR/EN). Conversion-focused flow: landing → login gate → dashboard with Fulbright priority module → test → result.

---

## 1. New Files

| File | Purpose |
|------|---------|
| `src/pages/FulbrightLanding.tsx` | Public landing page at `/scholarships/fulbright` |
| `src/pages/FulbrightTest.tsx` | Protected multi-step eligibility test at `/scholarships/fulbright/test` |
| `src/components/dashboard/FulbrightModule.tsx` | Priority dashboard card |
| `src/lib/fulbrightEngine.ts` | Rule-based scoring engine |

## 2. Modified Files

| File | Change |
|------|--------|
| `src/App.tsx` | Add 2 routes: `/scholarships/fulbright` (public), `/scholarships/fulbright/test` (ProtectedRoute) |
| `src/pages/Dashboard.tsx` | Add `FulbrightModule` as first section (above recours/profile) |
| `src/components/layout/Header.tsx` | No change needed — accessible via Scholarships nav or direct link |

---

## 3. Landing Page (`/scholarships/fulbright`)

Same pattern as `RecoursInfo.tsx`. Sections:

1. **Hero** — gradient-hero, powerful bilingual headline, main CTA "Tester mon éligibilité Fulbright" / "Check my Fulbright eligibility", secondary CTA "Parler à un conseiller"
2. **Value section** — 4 cards: know if your profile fits, identify strengths/gaps, get a clear plan, save time
3. **Quick Fulbright overview** — concise: US govt funded, graduate level, prestigious, selective, leadership focus
4. **"This test is for you if…"** — 6 bullet cards
5. **What the test evaluates** — 7 dimensions listed with icons + disclaimer about country variations
6. **What you get after** — result breakdown: fit level, strengths, gaps, action plan, KPB support
7. **CTA repeat** — strong mid-page and bottom CTA
8. **FAQ** — 6 questions bilingual accordion
9. **Trust disclaimer** — "This is a KPB guidance tool, not official Fulbright selection"

**CTA logic** (same as RecoursInfo): if not logged in → `/login?redirect=/scholarships/fulbright/test`, if profile incomplete → `/complete-profile?redirect=/scholarships/fulbright/test`, else → test page directly.

## 4. Fulbright Test (`/scholarships/fulbright/test`)

Protected route. Multi-step form (4 steps):

**Step 1 — Profile**: country of citizenship, country of residence, degree level, graduation status, field of study
**Step 2 — Academic**: academic performance level (GPA range), English readiness (self-assessed), clarity of study project (text)
**Step 3 — Leadership**: leadership experience (select), community engagement (select), motivation for US study (text), clarity of future goals (text)
**Step 4 — Readiness**: willingness to commit to strong application, timeline/urgency

On submit: run `fulbrightEngine`, save result to localStorage (no new DB table for V1 — keeps it simple), show result inline.

## 5. Fulbright Engine (`src/lib/fulbrightEngine.ts`)

Weighted scoring across dimensions:

| Dimension | Weight |
|-----------|--------|
| Academic level (master's ready) | 15% |
| Study project clarity | 20% |
| Leadership experience | 20% |
| English readiness | 10% |
| Community engagement | 15% |
| Motivation / US fit | 10% |
| Application readiness | 10% |

**Output categories:**
- **Strong potential** (score ≥ 75): "Profil prometteur pour Fulbright"
- **Promising, needs work** (50-74): "Profil intéressant, des améliorations possibles"
- **Early stage** (25-49): "Profil en développement, préparation nécessaire"
- **Needs significant prep** (<25): "Profil à renforcer considérablement"

Returns: `{ level, score, verdict_fr, verdict_en, strengths[], gaps[], nextSteps[] }`

## 6. Result Display

Inline on the test page after submission:
- Color-coded badge (green/amber/orange/red)
- Verdict summary
- Strengths list with checkmarks
- Gaps list with alert icons
- Personalized next steps
- CTA: "Obtenir un accompagnement KPB" / WhatsApp advisor
- Trust disclaimer

## 7. Dashboard Module (`FulbrightModule.tsx`)

Card shown at top of Dashboard (before RecourStatusCard). Appears when:
- User came from `/scholarships/fulbright` (tracked via URL param or localStorage flag)
- OR always visible as a campaign highlight (configurable)

Content:
- 🇺🇸 Fulbright badge
- "Testez votre éligibilité Fulbright" / "Check your Fulbright eligibility"
- If test already taken: show result summary + "Voir mon plan" CTA
- If not taken: "Commencer le test" CTA → `/scholarships/fulbright/test`

## 8. No Database Changes for V1

The Fulbright test result is stored in localStorage for simplicity. No new tables needed. If we want persistence later, we can add a `fulbright_submissions` table.

## 9. Event Tracking

Using existing `track()`:
- `fulbright_page_viewed`
- `fulbright_cta_clicked`
- `fulbright_test_started`
- `fulbright_test_completed` (with level)
- `fulbright_result_cta_clicked`

---

## Summary

4 new files, 2 modified files, 0 database changes. Clean, conversion-focused, bilingual, mobile-first. Same patterns as existing RecoursInfo + ScholarshipTest pages.

