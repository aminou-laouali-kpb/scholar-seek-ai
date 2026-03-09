
## Admin User Management Page + Dedicated Admin Login

### What We're Building

1. **Admin Users Page** (`/admin/users`) — A full user management page where admins can:
   - See all registered users in a table (name, email, join date, profile status)
   - Click into a user to view their full profile details in a side panel/modal
   - Manage roles: promote to admin, demote back to user, with a toggle button

2. **Dedicated Admin Login** (`/admin/login`) — A separate, minimal login page for admins only:
   - Email/password only (no Google, no "sign up" link — admins aren't self-registered)
   - After login, checks if the user has the admin role; if not, shows an error and signs them out
   - Redirects to `/admin` on success
   - The `AdminRoute` wrapper in `App.tsx` will redirect unauthenticated users to `/admin/login` instead of `/login`

---

### Database Changes

We need one new RLS policy on `user_roles` so admins can INSERT/UPDATE/DELETE roles for other users (currently no such policy exists):

```sql
-- Allow admins to manage all roles
CREATE POLICY "Admins can manage roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));
```

We also need admins to be able to read all profiles to power the user list (policy already exists: "Admins can view all profiles"). No schema changes needed.

---

### Files to Create / Modify

**New files:**
- `src/pages/admin/AdminLogin.tsx` — standalone admin login page (dark, branded, no Header/Footer)
- `src/pages/admin/AdminUsers.tsx` — user management page with table + profile modal + role toggle

**Modified files:**
- `src/App.tsx` — add `/admin/login` route (public, outside `AdminRoute`), change `AdminRoute` to redirect to `/admin/login`
- `src/pages/admin/AdminLayout.tsx` — add "Users" nav item + logout button in sidebar
- `supabase/migrations/` — add migration for new `user_roles` RLS policy

---

### Key Technical Details

**AdminUsers page** — fetches `profiles` joined with `user_roles`:
```
profiles (all, admin-readable) + user_roles (admin-readable)
→ combined per user: name, email, role, join date, profile status
```
Since we can't join across `auth.users` directly from the client, we use `profiles` (which stores email/name) + `user_roles`.

Role toggle: calls `supabase.from('user_roles').upsert(...)` to add admin role, or `.delete()` to remove it. The existing `has_role` function is used for the check.

**AdminLogin page** — after `signInWithPassword`, immediately checks `has_role(uid, 'admin')` via an RPC call. If false, signs the user back out and shows "Access denied — admin accounts only."

**App.tsx change** — `AdminRoute` redirects to `/admin/login` instead of `/login`, and `/admin/login` is a public route placed before the `AdminRoute` wrapper.
