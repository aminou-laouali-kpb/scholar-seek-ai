

# Next Improvements Plan

Based on the current state of the project, here are the highest-impact items remaining:

---

## 1. Admin Contact Requests Page
The `contact_requests` table exists but there's no admin page to view/manage them. The admin dashboard counts them, but admins can't read the actual messages.

**Changes:**
- Create `src/pages/admin/AdminContactRequests.tsx` — table listing all contact requests with name, email, category, message, date, and a status badge (new/read/resolved). Allow marking as read/resolved.
- Add route in `App.tsx` under admin layout
- Add nav link in `AdminLayout.tsx` sidebar

---

## 2. Admin Questionnaire Responses Page
Same issue — questionnaire responses are saved to DB but there's no way for admins to review them.

**Changes:**
- Create `src/pages/admin/AdminQuestionnaire.tsx` — table of responses with key fields (email, study level, desired country, budget, etc.) and date
- Add route + nav link

---

## 3. Email Notifications for New Leads
When someone submits a contact form or questionnaire, the team has no way to know unless they check the admin panel. Send an email notification using a backend function.

**Changes:**
- Create an edge function `supabase/functions/notify-new-lead/index.ts` that sends an email via Resend or the built-in Supabase mailer
- Add a database trigger on `contact_requests` and `questionnaire_responses` to call the function on INSERT

---

## 4. Dark Mode Support
The app uses `next-themes` (already installed) but doesn't have a theme toggle. Adding dark mode is a quick win for UX.

**Changes:**
- Add a theme toggle button in the Header (sun/moon icon)
- Wrap the app with `ThemeProvider` from `next-themes`
- Tailwind already supports `darkMode: "class"` — verify `tailwind.config.ts`

---

## 5. BlogPost Skeleton + Share Functionality
`BlogPost.tsx` still uses a spinner (line 33). Also the Share button doesn't do anything.

**Changes:**
- Replace spinner with article skeleton (title bar, content lines, sidebar)
- Wire the Share2 button to `navigator.share()` with fallback to clipboard copy + toast

---

## 6. Improve 404 Page
Add a search suggestion or link to popular pages (Tools, Scholarships, Blog) so lost visitors don't just bounce.

**Changes:**
- Update `NotFound.tsx` with links to key pages and a friendly illustration

---

## Summary

| # | Task | Files | DB |
|---|------|-------|----|
| 1 | Admin Contact Requests page | New: `AdminContactRequests.tsx`, Edit: `App.tsx`, `AdminLayout.tsx` | — |
| 2 | Admin Questionnaire page | New: `AdminQuestionnaire.tsx`, Edit: `App.tsx`, `AdminLayout.tsx` | — |
| 3 | Email notifications for leads | New edge function, DB trigger migration | Yes |
| 4 | Dark mode toggle | Edit: `Header.tsx`, `App.tsx`, `tailwind.config.ts` | — |
| 5 | BlogPost skeleton + share | Edit: `BlogPost.tsx` | — |
| 6 | Improve 404 page | Edit: `NotFound.tsx` | — |

No new dependencies needed. Items 1-2 and 4-6 are pure frontend. Item 3 requires an edge function + migration.

