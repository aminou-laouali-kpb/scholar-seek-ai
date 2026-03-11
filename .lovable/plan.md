

## Plan: Upgrade /student-platform to a Real Product Gateway

### 1. Auto-redirect logged-in users

In `StudentPlatform.tsx`, import `useAuth` and add a redirect: if `user` exists and `!loading`, navigate to `/dashboard`.

### 2. Rewrite StudentPlatform.tsx

Replace the "Coming Soon" placeholder with a full landing page:

- **Hero section**: Bold headline, subtitle explaining value, 3 CTA buttons (Create account → `/signup`, Log in → `/login`, Talk to advisor → WhatsApp)
- **"What you can do" section**: 6 feature preview cards with icons (UserCheck, Globe, GraduationCap, Bookmark, ListChecks, HeadphonesIcon) showing: complete profile, discover destinations, scholarship recommendations, admission opportunities, save & prioritize, track next steps + advisor support
- **Dashboard preview section**: 3-4 mock preview cards showing what the dashboard looks like (profile summary, scholarship matches, next steps, saved items) — styled as visual teasers
- **Final CTA banner**: "Ready to start?" with signup + advisor buttons

### 3. Update translations in `src/i18n/translations.ts`

Replace `studentPlatform` block in both EN and FR:
- Remove `comingSoon` key
- Add new keys: `heroTitle`, `heroSubtitle`, `ctaSignup`, `ctaLogin`, `ctaAdvisor`, `whatYouCanDo`, `featureCards` (array of {title, description}), `previewTitle`, `previewSubtitle`, `finalCtaTitle`, `finalCtaSubtitle`

### Files changed

| File | Change |
|------|--------|
| `src/pages/StudentPlatform.tsx` | Full rewrite with auth redirect + landing sections |
| `src/i18n/translations.ts` | Replace `studentPlatform` translations (EN + FR) |

