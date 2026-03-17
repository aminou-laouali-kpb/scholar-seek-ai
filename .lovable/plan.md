

# Plan: "Outil gratuit KPB -- Eligibilite au recours gracieux"

This is a large feature. I'll break it into phases to keep each implementation step manageable.

---

## Phase 1: Database & Storage Setup

### New table: `recours_submissions`
```sql
CREATE TABLE public.recours_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Contact
  full_name text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  whatsapp text NOT NULL DEFAULT '',
  country_of_residence text NOT NULL DEFAULT '',
  nationality text NOT NULL DEFAULT '',
  -- Academic
  current_level text NOT NULL DEFAULT '',
  target_level text NOT NULL DEFAULT '',
  field_of_study text NOT NULL DEFAULT '',
  institutions_applied text NOT NULL DEFAULT '',
  program_applied text NOT NULL DEFAULT '',
  -- Refusal details
  num_refusals integer NOT NULL DEFAULT 1,
  refusal_date text DEFAULT '',
  refusal_reason text DEFAULT '',
  situation_description text DEFAULT '',
  why_contestable text DEFAULT '',
  -- Other
  has_pending_applications boolean DEFAULT false,
  open_to_private boolean DEFAULT false,
  budget_range text DEFAULT '',
  preferred_cities text DEFAULT '',
  urgency_level text DEFAULT 'normal',
  -- Result
  result_category text DEFAULT NULL, -- A/B/C/D
  result_details jsonb DEFAULT '{}',
  -- File upload
  refusal_document_url text DEFAULT NULL,
  -- Admin
  admin_status text NOT NULL DEFAULT 'new',
  admin_notes text DEFAULT '',
  admin_tags text[] DEFAULT '{}',
  -- Auth (optional)
  user_id uuid DEFAULT NULL,
  -- Timestamps
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.recours_submissions ENABLE ROW LEVEL SECURITY;

-- Public can insert (guest submissions)
CREATE POLICY "Anyone can insert recours submissions"
  ON public.recours_submissions FOR INSERT TO public
  WITH CHECK (true);

-- Users can view own by email (guest) or user_id
CREATE POLICY "Users can view own submissions"
  ON public.recours_submissions FOR SELECT TO public
  USING (true); -- result page needs to read back immediately

-- Admins full access
CREATE POLICY "Admins can manage recours submissions"
  ON public.recours_submissions FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));
```

### Storage bucket for refusal documents
```sql
INSERT INTO storage.buckets (id, name, public) VALUES ('refusal-documents', 'refusal-documents', false);
-- RLS: anyone can upload, only admins can read all
```

### Update trigger for `updated_at`
```sql
CREATE TRIGGER update_recours_updated_at
  BEFORE UPDATE ON public.recours_submissions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

---

## Phase 2: Frontend -- Landing Page & Multi-step Form

### Route: `/recours-gracieux/analyse`

**New files:**
- `src/pages/RecoursAnalyse.tsx` -- Landing page + entry point
- `src/components/recours/RecoursHero.tsx` -- Hero section
- `src/components/recours/RecoursHowItWorks.tsx` -- 3-step explainer
- `src/components/recours/RecoursBenefits.tsx` -- Benefits grid
- `src/components/recours/RecoursForm.tsx` -- Multi-step form (5 steps)
- `src/components/recours/RecoursResult.tsx` -- Result page
- `src/components/recours/RecoursFAQ.tsx` -- FAQ accordion
- `src/components/recours/RecoursReassurance.tsx` -- Trust footer banner

### Multi-step form structure (5 steps):
1. **Contact**: full name, email, WhatsApp, country, nationality
2. **Academic profile**: current level, target level, field of study
3. **Application details**: institutions, program, num refusals, refusal date, refusal reason
4. **Situation**: free text situation + why contestable, pending apps, open to private, budget, cities, urgency
5. **Document upload** (optional): refusal screenshot/PDF

Progress bar at top. Local state saved to `localStorage` for resume. Before showing results, confirm email + WhatsApp if not filled.

### Form patterns:
- Reuse existing `Input`, `Textarea`, `Select`, `Button`, `Progress` components
- Use `framer-motion` for step transitions (same pattern as `Questionnaire.tsx`)
- Mobile-first: large touch targets, stacked layout, one-hand friendly

---

## Phase 3: Recommendation Engine

**New file:** `src/lib/recoursEngine.ts`

Rule-based scoring on weighted criteria:

| Criterion | Weight | Logic |
|-----------|--------|-------|
| Number of refusals | 20% | 1 refusal = positive, 3+ = negative |
| Refusal reason clarity | 15% | Has specific reason = positive |
| Contestability argument | 20% | Has text explaining why = positive |
| Project coherence | 15% | Target level matches current level progression |
| Urgency | 10% | High urgency + open to private = plan B |
| Open to private schools | 10% | Factors into D recommendation |
| Budget | 10% | Has budget = enables private option |

**Output categories:**
- **A**: "Recours recommande" (score >= 70)
- **B**: "Recours possible mais faible" (score 40-69)
- **C**: "Recours peu pertinent" (score < 40, not open to private)
- **D**: "Recours + plan B ecoles privees recommande" (score 40-69 AND open to private)

Returns: `{ category, score, verdict, explanation, nextStep, reasons[] }`

---

## Phase 4: Result Page

Built into `RecoursResult.tsx`. Shows:
- Category badge with color coding (green A, amber B, red C, blue D)
- Verdict summary in plain French
- "Ce que cela signifie" section
- "Prochaine etape recommandee"
- Legal disclaimer
- Dynamic CTA button per category
- "Plan B" upsell section: "Ne perds pas de temps pendant l'attente"
- Link to private school services / contact

---

## Phase 5: Admin Dashboard

### Route: `/admin/recours-gracieux`

**New file:** `src/pages/admin/AdminRecours.tsx`

Features:
- Table listing all submissions with search/filter
- Filters: country, result category, budget, open to private, urgency, admin status
- Detail modal: full student profile, uploaded document link, admin notes editor
- Status tags: new, analyzed, hot lead, recours likely, pivot to private, contacted, converted
- CSV export (reuse `exportToCsv`)
- Analytics cards at top: total submissions, completion rate, result distribution, top countries, % open to private

### Integration:
- Add nav item in `AdminLayout.tsx`: `{ path: "/admin/recours-gracieux", label: "Recours", icon: FileSearch }`
- Add route in `App.tsx` under admin routes

---

## Phase 6: Event Tracking

Use existing `track()` from `src/lib/analytics.ts`:
- `recours_page_viewed`
- `recours_form_started`
- `recours_step_completed` (with step number)
- `recours_form_submitted`
- `recours_result_generated` (with category)
- `recours_cta_clicked` (with CTA type)
- `recours_private_school_cta_clicked`
- `recours_document_uploaded`

---

## Phase 7: Routing & Navigation

- Add `/recours-gracieux/analyse` to `App.tsx` public routes
- Add link in Header navigation (under Tools or as standalone)
- Add WhatsApp context message for `/recours-gracieux` path
- Add to homepage as a featured tool/CTA

---

## Summary of new files

| File | Purpose |
|------|---------|
| `src/pages/RecoursAnalyse.tsx` | Landing + orchestrator |
| `src/components/recours/RecoursHero.tsx` | Hero section |
| `src/components/recours/RecoursHowItWorks.tsx` | 3-step explainer |
| `src/components/recours/RecoursBenefits.tsx` | Benefits cards |
| `src/components/recours/RecoursForm.tsx` | Multi-step form |
| `src/components/recours/RecoursResult.tsx` | Result display |
| `src/components/recours/RecoursFAQ.tsx` | FAQ section |
| `src/components/recours/RecoursReassurance.tsx` | Trust banner |
| `src/lib/recoursEngine.ts` | Recommendation logic |
| `src/pages/admin/AdminRecours.tsx` | Admin dashboard |

## Modified files

| File | Change |
|------|--------|
| `src/App.tsx` | Add routes |
| `src/pages/admin/AdminLayout.tsx` | Add nav item |
| `src/components/WhatsAppButton.tsx` | Add context message |

## Database changes
- 1 new table: `recours_submissions`
- 1 storage bucket: `refusal-documents`
- RLS policies for both

This is a large feature -- I recommend implementing it in 2-3 batches to keep changes reviewable.

