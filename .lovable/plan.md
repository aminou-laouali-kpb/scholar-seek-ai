

## Plan: Update Logo, Simplify Nav, Blue Theme, Improved Copy & Questionnaire

### 1. Replace Logo
- Copy `user-uploads://logo_simple.png` to `src/assets/kpb-logo.png`
- The logo already contains "KPB Education" text, so remove the separate text span next to the logo in `Header.tsx`

### 2. Simplify Navigation (6 items)
Update `Header.tsx` navLinks to:
- Accueil (`/`)
- Nos Outils (`/tools`)
- Nos Services (`/services`)
- Les Destinations (`/destinations`)
- Blog (`/blog`)
- Contact (`/contact`)

Remove: Scholarships, Testimonials, About, FAQ from main nav (keep accessible via footer).

### 3. Blue-First Color Refinement
Update `src/index.css` to make blue more vibrant:
- Primary: `220 60% 25%` (slightly brighter navy)
- Accent: shift from pure gold to a blue-gold that complements — keep gold `38 92% 50%` but make primary blue pop more in gradients
- Hero gradient: richer blue tones

### 4. Improved Homepage Copywriting
Rewrite translations in both EN and FR:
- **FR Hero:** "Étudiez à l'étranger, on s'occupe de tout" / highlight: "avec KPB Education"
- **EN Hero:** "Study Abroad — We Handle Everything"
- **Primary CTA:** "Je commence ma procédure !" / "I Start My Process!"  → links to `/questionnaire`
- **Secondary CTA:** "Parler à un conseiller" / "Talk to an Advisor"
- Punchier section titles and descriptions throughout

### 5. Create Qualification Questionnaire
New file: `src/pages/Questionnaire.tsx`

Multi-step animated form (5 steps):
1. **Goal** — Study abroad / Find scholarships / Both
2. **Destination** — Belgium, France, Canada, UK, USA, Germany, Spain, Turkey
3. **Degree level** — Bachelor / Master / PhD / Other
4. **Budget** — Full scholarship needed / Partial funding / Self-funded
5. **Timeline** — This year / Next year / Not sure yet

**Result logic:**
- If "self-funded" + clear destination → redirect to Student Platform signup
- Otherwise → show advisor contact CTA (WhatsApp + form link)

Add route `/questionnaire` in `App.tsx`. Add all questionnaire translations in both languages.

### 6. Update Index.tsx
- Change hero primary CTA link from `/tools` to `/questionnaire`
- Update translation keys for new copy

### Files Modified
- `src/assets/kpb-logo.png` (replaced with uploaded logo)
- `src/components/layout/Header.tsx` (simplified nav, logo update)
- `src/index.css` (blue refinements)
- `src/i18n/translations.ts` (new copy, nav labels, questionnaire strings)
- `src/pages/Index.tsx` (hero CTA → `/questionnaire`)
- `src/App.tsx` (add `/questionnaire` route)
- **New:** `src/pages/Questionnaire.tsx`

