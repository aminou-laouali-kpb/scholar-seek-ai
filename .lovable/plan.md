

# Implementation Plan: 4 High-Impact Improvements

## 1. Fix Signup Flow — "Check Your Email" Page

**Problem:** After signup, the app navigates to `/dashboard` or `/orientation` before email is confirmed, causing a redirect loop back to `/login`.

**Changes:**
- Create `src/pages/CheckEmail.tsx` — a simple page telling the user to check their inbox, with a "Back to Login" link
- Add `/check-email` route in `App.tsx` (public, no auth required)
- In `SignUp.tsx`, replace `navigate("/dashboard")` and `navigate("/orientation")` with `navigate("/check-email")`
- The profile update after signup will likely fail silently (user not confirmed yet), so move the extended profile data into `user_metadata` on signup, and have the `handle_new_user` trigger pull it into the profiles table

**Login — Forgot Password:**
- In `Login.tsx`, wire the forgot password button to call `supabase.auth.resetPasswordForEmail(email, { redirectTo: origin + '/reset-password' })`
- Create `src/pages/ResetPassword.tsx` — detects `type=recovery` in URL hash, shows new password form, calls `updateUser({ password })`
- Add `/reset-password` route in `App.tsx`

## 2. Functional Contact Form

**Database:** Create a `contact_requests` table (no auth required for insert):
```sql
CREATE TABLE public.contact_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  category text NOT NULL DEFAULT '',
  message text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.contact_requests ENABLE ROW LEVEL SECURITY;
-- Anyone can submit
CREATE POLICY "Anyone can insert contact requests" ON public.contact_requests FOR INSERT TO public WITH CHECK (true);
-- Only admins can read
CREATE POLICY "Admins can manage contact requests" ON public.contact_requests FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'));
```

**Code (`Contact.tsx`):**
- Add form state, validation (zod), and submit handler that inserts into `contact_requests`
- Show success toast on submit
- Add the contact requests count to Admin Dashboard

## 3. Loading Skeletons

**Pages to add skeleton loaders:**
- `Partners.tsx` — replace the spinner with a grid of skeleton cards (school card shape)
- `Blog.tsx` — already has a spinner; replace with skeleton article cards
- `Dashboard.tsx` components (`ScholarshipRecommendations`, `AdmissionOpportunities`, `SavedItems`) — add skeleton states while data loads

Use the existing `Skeleton` component from `src/components/ui/skeleton.tsx`. Create a reusable `CardSkeleton` component for consistency.

## 4. Dynamic Scholarships Page

**Current state:** `Scholarships.tsx` is static — just lists scholarship types from translations and links to the scholarship test.

**New design:**
- Fetch from `admin_scholarships` table (already has 18 published records with country, levels, deadline, funding_type, etc.)
- Add search bar + filters (country, level, funding type, status)
- Display scholarship cards showing: name, country + flag, deadline, funding type badge, levels, description
- Each card has a "Learn More" expand or link to external_link
- Keep the CTA section for the scholarship test at the bottom
- Add skeleton loading state

**No database changes needed** — `admin_scholarships` already has public SELECT for published records (requires authenticated role though, so unauthenticated users will need the anon policy added).

**Database:** Add anon/public read policy:
```sql
CREATE POLICY "Public can read published scholarships" ON public.admin_scholarships FOR SELECT TO public USING (is_published = true);
```

Same for `admin_admissions`:
```sql
CREATE POLICY "Public can read published admissions" ON public.admin_admissions FOR SELECT TO public USING (is_published = true);
```

---

**Summary of files to create/modify:**
- **Create:** `CheckEmail.tsx`, `ResetPassword.tsx`
- **Modify:** `SignUp.tsx`, `Login.tsx`, `Contact.tsx`, `Scholarships.tsx`, `App.tsx`, `AdminDashboard.tsx`
- **Create:** `CardSkeleton.tsx` shared component
- **Modify for skeletons:** `Partners.tsx`, `Blog.tsx`, dashboard sub-components
- **Database:** 1 migration (contact_requests table + 2 public read policies for scholarships/admissions)

