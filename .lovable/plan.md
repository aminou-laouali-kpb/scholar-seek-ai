

## Phase 3 Upgrade: Admin Back-Office + DB-Driven Recommendations

Most student-facing Phase 3 work is already complete (dashboard, scholarships, admissions, saved items, next steps, application modal, matching logic). The main new work is the **admin back-office** and migrating from static data to database-driven content.

---

### 1. Database Changes (2 new tables)

**`admin_scholarships`** — replaces static `src/data/scholarships.ts` as primary data source
- `id`, `name`, `country`, `country_flag`, `programs` (text[]), `levels` (text[]), `description_en`, `description_fr`, `eligibility_en`, `eligibility_fr`, `deadline`, `funding_type`, `budget_friendly` (boolean), `status` (text: open/closed/paused), `is_featured` (boolean), `is_published` (boolean), `external_link`, `admin_notes`, `relevance_tags` (text[]), `created_at`, `updated_at`
- RLS: admins can CRUD (via `has_role`), authenticated users can SELECT where `is_published = true`

**`admin_admissions`** — replaces static `src/data/admissions.ts`
- `id`, `institution_name`, `country`, `country_flag`, `institution_type`, `programs` (text[]), `levels` (text[]), `intake`, `description_en`, `description_fr`, `why_fit_en`, `why_fit_fr`, `budget_level`, `status`, `is_featured`, `is_published`, `external_link`, `admin_notes`, `relevance_tags` (text[]), `created_at`, `updated_at`
- Same RLS pattern

Seed both tables with existing static data via migration INSERT statements.

---

### 2. New Files

| File | Purpose |
|------|---------|
| `src/hooks/useAdminRole.ts` | Hook checking `has_role(uid, 'admin')` via Supabase RPC |
| `src/pages/admin/AdminLayout.tsx` | Sidebar layout with navigation for admin pages |
| `src/pages/admin/AdminDashboard.tsx` | Overview: counts of scholarships, admissions, requests |
| `src/pages/admin/AdminScholarships.tsx` | Table list + create/edit/delete scholarships |
| `src/pages/admin/AdminAdmissions.tsx` | Table list + create/edit/delete admissions |
| `src/pages/admin/AdminRequests.tsx` | View application_intents + consultation_requests |
| `src/components/admin/ScholarshipForm.tsx` | Dialog form for scholarship CRUD |
| `src/components/admin/AdmissionForm.tsx` | Dialog form for admission CRUD |

### 3. Files to Modify

| File | Change |
|------|--------|
| `src/App.tsx` | Add admin routes under `/admin/*` with admin role guard |
| `src/lib/matching.ts` | Accept data as parameter (already does) — no change needed |
| `src/components/dashboard/ScholarshipRecommendations.tsx` | Fetch from `admin_scholarships` table instead of static import |
| `src/components/dashboard/AdmissionOpportunities.tsx` | Fetch from `admin_admissions` table instead of static import |
| `src/components/layout/Header.tsx` | Add "Admin" link visible only to admin users |

### 4. Admin Route Protection

New `AdminRoute` wrapper component that uses `useAdminRole` hook → calls `supabase.rpc('has_role', { _user_id: uid, _role: 'admin' })`. Redirects non-admins to `/dashboard`.

### 5. Admin UI Design

- Sidebar navigation: Dashboard, Scholarships, Admissions, Requests, Settings (placeholder)
- Tables with search, filter by country/status/level, sort by date
- Row actions: edit, publish/unpublish, delete
- Create/edit via dialog forms with all fields from spec
- Bilingual fields side by side (EN | FR)
- Clean, professional — uses existing shadcn components (Table, Dialog, Select, Input, Tabs)

### 6. Recommendation Engine Update

Dashboard components will fetch published scholarships/admissions from database, then pass them to existing `matchScholarships()` / `matchAdmissions()` functions. The interfaces stay compatible — just map DB columns to the existing TypeScript interfaces.

