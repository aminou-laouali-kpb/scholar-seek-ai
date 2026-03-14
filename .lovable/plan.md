

# Phase 3.2: Operational & Commercial Layer

Build on top of Phase 3.1 to make the platform commercially useful for KPB Education — lead tracking, scoring, admin pipeline, and behavioral feedback.

---

## Database Changes (1 migration)

**New table: `lead_scores`**
Stores computed lead heat per user with admin-managed status and notes.

```sql
CREATE TABLE public.lead_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  heat_level text NOT NULL DEFAULT 'low',        -- low, warm, hot
  admin_status text NOT NULL DEFAULT 'new',       -- new, contacted, interested, needs_follow_up, application_started, converted, closed, not_qualified
  admin_notes text DEFAULT '',
  actions_count int NOT NULL DEFAULT 0,
  strong_signals int NOT NULL DEFAULT 0,
  last_action text,
  last_action_at timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.lead_scores ENABLE ROW LEVEL SECURITY;
-- Admins full access
CREATE POLICY "Admins can manage lead scores" ON public.lead_scores FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
-- Users can read own
CREATE POLICY "Users can view own lead score" ON public.lead_scores FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_lead_scores_updated_at BEFORE UPDATE ON public.lead_scores FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

No other schema changes — we leverage the existing `activity_logs`, `saved_items`, `application_intents`, and `consultation_requests` tables.

---

## Implementation Groups

### Group 1: Enhanced Analytics Tracking
**File:** `src/lib/analytics.ts` — expand `track()` to also write to `activity_logs` when user is authenticated.

**Files touched for track calls:**
- `CompleteProfile.tsx` → `onboarding_completed`
- `Orientation.tsx` → `orientation_started`, `orientation_completed`
- `Dashboard.tsx` → destination tools → `destination_tool_opened`
- `ApplicationModal.tsx` → `application_started`, `support_requested`, `consultation_requested`
- `useSavedItems.ts` → `item_saved`, `item_unsaved`
- `WhatsAppButton.tsx` → already has `whatsapp_clicked`
- `ScholarshipRecommendations.tsx` → already has `recommendation_clicked`
- `AdmissionOpportunities.tsx` → already has `recommendation_clicked`

### Group 2: Lead Scoring Logic
**New file:** `src/lib/leadScoring.ts`

Compute heat level from activity_logs + saved_items + application_intents + consultation_requests:
- **Hot**: 3+ strong signals (application_started, support_requested, whatsapp_clicked, consultation_requested, 3+ saved items)
- **Warm**: 1-2 strong signals OR profile_completed + orientation_completed
- **Low**: everything else

**New hook:** `src/hooks/useLeadScore.ts` — computes and upserts lead score for the current user on dashboard load (fire-and-forget).

### Group 3: Admin Lead Pipeline Page
**New file:** `src/pages/admin/AdminLeads.tsx`

Table view showing all leads (join `profiles` + `lead_scores` + counts from `saved_items`, `application_intents`, `consultation_requests`):
- Columns: Name, Email, WhatsApp, Country, Destinations, Field, Level, Scholarship Interest, Saved Count, Requests, Heat Level, Admin Status, Last Action, Date
- Heat level badges: 🔴 Hot (red), 🟠 Warm (amber), ⚪ Low (gray)
- Admin status dropdown per row (inline update)
- Admin notes expandable per row
- Filters: heat level, admin status, country, destination, scholarship interest
- Search by name/email
- Export CSV
- Sort by last activity, heat, created date

**Register:** Add route in `App.tsx`, nav item in `AdminLayout.tsx` (icon: `Flame`)

### Group 4: Dashboard Behavioral Feedback
**File:** `src/components/dashboard/NextSteps.tsx`

Add behavior-aware logic using saved items data:
- If many France saves → add "Explore France tools" step higher
- If many scholarship saves → promote scholarship-related next steps
- If application_started exists → show "Track your application" step
- If consultation requested → show "Support requested — we'll be in touch" badge

**File:** `src/pages/Dashboard.tsx`
- Add a subtle "support requested" indicator when consultation exists

### Group 5: Strengthen Request Tracking
**File:** `src/components/dashboard/ApplicationModal.tsx`
- Add `track()` calls for each action type
- Log to activity_logs: `application_started`, `consultation_requested`, `support_requested`

### Group 6: Admin Activity Labels
**File:** `src/pages/admin/AdminUsers.tsx`
- Expand `ACTION_LABELS` map with all new event names for richer activity timeline display

---

## Files Summary

| Action | File |
|--------|------|
| Create | `src/lib/leadScoring.ts` |
| Create | `src/hooks/useLeadScore.ts` |
| Create | `src/pages/admin/AdminLeads.tsx` |
| Edit | `src/lib/analytics.ts` |
| Edit | `src/pages/CompleteProfile.tsx` |
| Edit | `src/pages/Orientation.tsx` |
| Edit | `src/pages/Dashboard.tsx` |
| Edit | `src/components/dashboard/ApplicationModal.tsx` |
| Edit | `src/components/dashboard/NextSteps.tsx` |
| Edit | `src/hooks/useSavedItems.ts` |
| Edit | `src/pages/admin/AdminUsers.tsx` |
| Edit | `src/pages/admin/AdminLayout.tsx` |
| Edit | `src/App.tsx` |
| DB | 1 migration (lead_scores table) |

No new dependencies. No architecture changes. Builds directly on existing tables and patterns.

