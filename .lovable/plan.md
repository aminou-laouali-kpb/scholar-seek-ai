

## Plan: Improve Admin Dashboard Accuracy

### Problem
The admin dashboard is missing key stats:
- **Partner Programs**: 90 records in DB, not shown
- **Users**: 1 profile in DB, not shown

Current stats shown: Scholarships (18), Admissions (27), Intents (0), Consultations (0), Blog Posts (0) — these are accurate but the dashboard lacks the two most important metrics given the app's focus on partner schools.

### Changes — `src/pages/admin/AdminDashboard.tsx`

1. Add `partner_programs` count query and `profiles` count query to the existing `Promise.all`
2. Add two new stat cards: **Partner Programs** (with `School` icon) and **Registered Users** (with `Users` icon)
3. Update the grid to `lg:grid-cols-4` (already set) — 7 cards will flow naturally
4. Reorder cards to put the most important metrics first: Partner Programs, Users, Scholarships, Admissions, Intents, Consultations, Blog Posts

### No database changes needed
All queries already work with existing RLS policies (admin role has SELECT on all tables).

