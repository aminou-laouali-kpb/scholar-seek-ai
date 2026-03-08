

## Plan: Student Platform Phase 2 + Country Pages + WhatsApp CTA

This is a large update covering 4 areas: enhanced signup/onboarding, orientation tool, country detail pages, and WhatsApp integration.

### 1. Enhanced SignUp Page (`src/pages/SignUp.tsx`)

Expand from basic 5 fields to full onboarding form:
- First name & Last name (as on passport — label will say so)
- Email address
- WhatsApp number (with country code selector or free input)
- Country of birth (dropdown)
- Country of residence (dropdown)
- Current study level (dropdown: High school, Bachelor, Master, PhD, Other)
- Desired program / field of study (text input + checkbox "I don't know my program yet")
- Password + Confirm password

When "I don't know my program yet" is checked, hide the program field and show a note: "After signup, you'll be guided through our orientation tool."

Store all answers in local state (no backend yet). On submit, navigate to `/dashboard` or `/orientation` depending on whether they need orientation.

### 2. Orientation Tool (`src/pages/Orientation.tsx` — NEW)

A multi-step personality/interest quiz (6-8 questions) to help students identify a suitable study field. Questions like:
- What subjects interest you most? (Sciences, Arts, Business, Technology, Health, Law, Social Sciences)
- Do you prefer working with people, data, or ideas?
- What's your ideal work environment? (Office, Lab, Outdoors, Creative studio)
- What matters most in a career? (Salary, Impact, Creativity, Stability)
- Do you enjoy math/analytical thinking?
- Are you drawn to leadership or specialized expertise?

Result: Map answers to 3-4 recommended fields (e.g., "Engineering & Technology", "Business & Management", "Health Sciences", "Arts & Humanities") with descriptions. User picks one → saved to profile state → redirected to dashboard.

Add route `/orientation` in `App.tsx`.

### 3. Expanded Dashboard (`src/pages/Dashboard.tsx`)

Restructure dashboard cards to anticipate Phase 3 modules:
- **My Profile** — view/edit profile data
- **My Orientation Result** — shows recommended field (or CTA to take orientation if not done)
- **Recommended Scholarships** — placeholder "Coming soon" with teaser
- **Ongoing Admissions** — placeholder "Coming soon"
- **Next Actions** — checklist placeholder
- **Contact Advisor** — WhatsApp CTA to `https://wa.me/33768674292`

### 4. Country Detail Pages (`src/pages/CountryDetail.tsx` — NEW)

One dynamic page component for all countries, driven by route param `/destinations/:country`.

Each country gets rich content from translations:
- Hero with flag, country name, tagline
- Key stats (universities count, avg tuition, language, popular fields)
- Why study there (3-4 bullet points)
- Popular universities list
- Admission requirements summary
- Student life section
- **CTA logic:**
  - Belgium → `/tools/belgium`
  - France → `/tools/france`
  - Scholarships-related → `/tools/scholarship-test`
  - Canada, USA, UK, Germany, Spain, Turkey, UAE → `https://wa.me/33768674292`
  - Secondary CTA always → WhatsApp

Add UAE/Dubai as 9th destination.

Update `Destinations.tsx` to link each card to `/destinations/:country`.

### 5. WhatsApp Number Update

Replace all `https://wa.me/1234567890` with `https://wa.me/33768674292` across:
- `src/pages/Questionnaire.tsx` (2 occurrences)
- `src/pages/Index.tsx` (hero CTA2)
- `src/pages/Contact.tsx`
- New country pages
- Dashboard advisor card

### 6. Add Floating WhatsApp Button (`src/components/WhatsAppButton.tsx` — NEW)

Fixed bottom-right floating button visible on all pages, linking to `https://wa.me/33768674292`. Added in `App.tsx` alongside Header/Footer.

### 7. Translation Updates (`src/i18n/translations.ts`)

Add EN + FR translations for:
- Expanded signup fields (passport note, WhatsApp, country dropdowns, study level, program field, "I don't know" option)
- Orientation tool (all questions, options, results)
- Updated dashboard card keys
- Country detail page content (9 countries with stats, bullet points, universities)
- WhatsApp floating button tooltip

### Files Modified
- `src/pages/SignUp.tsx` — expanded onboarding form
- `src/pages/Dashboard.tsx` — restructured modules
- `src/pages/Questionnaire.tsx` — fix WhatsApp link
- `src/pages/Destinations.tsx` — link cards to detail pages
- `src/App.tsx` — add routes for `/orientation`, `/destinations/:country`
- `src/i18n/translations.ts` — all new translations
- `src/pages/Index.tsx` — fix WhatsApp link on hero CTA2

### New Files
- `src/pages/Orientation.tsx` — personality quiz for program discovery
- `src/pages/CountryDetail.tsx` — dynamic country presentation page
- `src/components/WhatsAppButton.tsx` — floating WhatsApp CTA

