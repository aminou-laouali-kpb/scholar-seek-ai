

## Activity Log for Admin User Management

### Current State
- Admin login (`/admin/login`) and user management (`/admin/users`) are correctly implemented
- Database has `profiles`, `application_intents`, `consultation_requests`, `saved_items` tables that track user actions
- Auth logs from the analytics API are currently empty (no login events yet to display)
- Only 1 user exists so far (your admin account)

### What We'll Build

A new **`activity_logs`** table to track user activities (logins, profile completions, page visits to key sections). Plus an "Activity" tab in the AdminUsers page detail dialog showing a timeline of each user's actions.

### Database Changes

1. **Create `activity_logs` table:**
```sql
CREATE TABLE public.activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action text NOT NULL,           -- e.g. 'login', 'profile_completed', 'orientation_completed', 'saved_item', 'application_intent'
  details jsonb DEFAULT '{}',     -- flexible metadata
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Admins can read all logs
CREATE POLICY "Admins can view all activity logs"
ON public.activity_logs FOR SELECT TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Users can insert their own logs
CREATE POLICY "Users can insert own activity logs"
ON public.activity_logs FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Users can read their own logs
CREATE POLICY "Users can view own activity logs"
ON public.activity_logs FOR SELECT TO authenticated
USING (auth.uid() = user_id);
```

2. **Add index** on `(user_id, created_at DESC)` for fast lookups.

### Code Changes

**New file: `src/hooks/useActivityLog.ts`**
- A simple hook: `useActivityLog()` returns a `logActivity(action, details?)` function
- Inserts into `activity_logs` with the current user's ID

**Modified: `src/contexts/AuthContext.tsx`**
- After successful auth state change (login), log a `'login'` activity

**Modified: `src/pages/CompleteProfile.tsx`**
- After profile save, log `'profile_completed'`

**Modified: `src/pages/Orientation.tsx`**
- After selecting a field, log `'orientation_completed'` with the chosen field

**Modified: `src/pages/admin/AdminUsers.tsx`**
- Add a Tabs component to the user detail dialog: "Profile" (existing) + "Activity" (new)
- Activity tab fetches from `activity_logs` for that user, displays a vertical timeline with action name, details, and timestamp
- Shows "last active" date on the user table row

### Technical Details
- Activity logging is fire-and-forget (no `await` blocking UI)
- The `details` JSONB column stores flexible metadata (e.g. `{ field: "engineering" }` for orientation)
- Timeline UI uses simple `div` elements with a vertical line, no extra dependencies

