

## Plan: Unify Partner Schools into One Searchable Catalog

### Approach

Migrate the 14 hardcoded OMNES and IGENSIA schools into the `partner_programs` database table, then rewrite the Partners page to render a single unified catalog section with shared filters — replacing the current three separate sections.

### Database Migration

Insert OMNES (6 schools) and IGENSIA (8 schools) into `partner_programs` table. Each legacy school becomes one row with:
- `school_name`, `school_slug` from the hardcoded data
- `program_name` = school domains (EN summary)
- `degree_level` = joined levels
- `city`/`country` extracted from campus field
- `tuition_amount` from fees
- `country` = "France" (Monaco for IUM)
- `partner_status` = "partner"
- `program_family` = "Omnes Education" or "Igensia Education" (to preserve grouping identity)
- `status` = "open", `is_published` = true

### Frontend Changes — `src/pages/Partners.tsx`

1. **Remove** the `omnesSchools` and `igensiaSchools` hardcoded arrays and the `LegacySchoolCard` component
2. **Remove** the two separate Omnes/Igensia `<section>` blocks (lines 190-213)
3. **Move** the search/filter bar and the grouped school list up to replace all three sections with one unified catalog section titled "Our Partner Schools & Programs"
4. The filter dropdowns for country and level will now include France/Monaco from OMNES/IGENSIA entries
5. Add a "Network" filter (optional) using `program_family` to let users filter by education group (Omnes, Igensia, etc.)
6. Keep the hero, benefits, deadline banner, and CTA sections unchanged

### Files Changed

| File | Change |
|------|--------|
| `supabase/migrations/...` | Insert 14 OMNES + IGENSIA school records |
| `src/pages/Partners.tsx` | Remove hardcoded arrays and legacy sections; single unified catalog with filters |

