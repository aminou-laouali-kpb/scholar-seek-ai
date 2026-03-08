

## Plan: USA Tool + Destination-App Architecture + Dashboard Integration

### Summary

Three main deliverables: (1) Create the new USA Finder tool, (2) add destination tools as connected dashboard modules, (3) integrate Canada/China tools alongside existing Belgium/France tools.

### 1. New USA Finder Tool (`src/pages/USAFinder.tsx`)

Create a multi-step recommendation tool modeled after BelgiumFinder/FranceFinder but with USA-specific logic:

- **Step-based questionnaire** (6 questions): study level, desired field, budget sensitivity (low/medium/high), university vs community college preference, scholarship interest, English readiness
- **Results page**: shows 3-5 matched institution types/recommendations (e.g., "Community College → Transfer pathway", "State University — affordable", "Private Research University") with descriptions, pros, and estimated costs
- **Visual style**: same hero + features + FAQ + CTA pattern as BelgiumFinder/FranceFinder
- **USA-specific content**: explains university vs college vs community college distinction prominently in the features section
- **CTA**: primary = tool results, secondary = WhatsApp advisor

### 2. Canada Finder & China Finder Tools

Create `src/pages/CanadaFinder.tsx` and `src/pages/ChinaFinder.tsx` — same structure as BelgiumFinder (hero, features list, FAQ, advisor CTA). These are landing/info pages with a "Contact Advisor" WhatsApp CTA since full search isn't built yet, but presented as tool modules within the ecosystem.

### 3. Dashboard: Destination Tools Section

Add a new "Recommended Destinations & Tools" section to `src/pages/Dashboard.tsx` between the existing cards:

- Show 5 destination cards: France, Belgium, Canada, China, USA
- Each card: flag, country name, short profile-fit description, primary CTA → tool route, secondary CTA → WhatsApp
- Use profile data (study level, desired program) to generate simple "why it fits you" text
- Section header: bilingual "Recommended destinations and tools for your profile"

### 4. Update Country Detail Pages & CTA Logic

Update `countryToolRoutes` in `CountryDetail.tsx` to include all 5 tool destinations:
- Belgium → `/tools/belgium`
- France → `/tools/france`
- USA → `/tools/usa`
- Canada → `/tools/canada`
- China → `/tools/china`

Add `china` to the destinations list in `Destinations.tsx` (currently missing from flags).

### 5. Update Tools Page

Add USA, Canada, and China tools to `src/pages/Tools.tsx` tool list (currently only Belgium, France, Scholarship).

### 6. Routing Updates (`App.tsx`)

Add routes:
- `/tools/usa` → USAFinder
- `/tools/canada` → CanadaFinder
- `/tools/china` → ChinaFinder

### 7. Translation Updates (`translations.ts`)

Add EN + FR for:
- `tools.usa` (title, description, benefit, cta)
- `tools.canada` (title, description, benefit, cta)
- `tools.china` (title, description, benefit, cta)
- `usaFinder.*` — all quiz questions, options, results, institution type descriptions, FAQ
- `canadaFinder.*` — features, FAQ
- `chinaFinder.*` — features, FAQ
- `dashboard.destinations.*` — section title, card descriptions
- `destinationsPage.countries.china` — add China to destination grid
- Country detail data for China

### 8. USA Destination Page Enhancement

Update the USA country detail content (already exists in translations) to add a section explaining the difference between universities, colleges, and community colleges. Add this as a new section in `CountryDetail.tsx` that renders conditionally for USA.

### Files to Create
- `src/pages/USAFinder.tsx` — multi-step USA recommendation tool
- `src/pages/CanadaFinder.tsx` — Canada tool landing page
- `src/pages/ChinaFinder.tsx` — China tool landing page

### Files to Modify
- `src/App.tsx` — 3 new routes
- `src/pages/Dashboard.tsx` — add destination tools section
- `src/pages/Tools.tsx` — add 3 new tool cards
- `src/pages/CountryDetail.tsx` — expand tool routes, add USA institution types section
- `src/pages/Destinations.tsx` — add China flag
- `src/i18n/translations.ts` — all new EN/FR translations

