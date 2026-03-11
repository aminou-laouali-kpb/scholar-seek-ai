

## Fix: Hero Text Visibility + Duplicated Badge Text

### Problems identified

1. **Text not readable on mobile**: The hero overlay gradient opacity is too low (0.75-0.82). The image bleeds through and makes white text hard to read.
2. **Duplicated "500+"**: The mobile floating badge hardcodes `500+` before `{t("hero.stats.students")}`, but the translation already includes "500+" → renders "500+ 500+ Étudiants Guidés".

### Changes — `src/pages/Index.tsx`

**Hero overlay** (line 48): Increase opacity values from 0.82/0.75/0.92 to **0.88/0.85/0.94** for a darker, more readable overlay while still showing the image subtly.

```
from-[hsl(220,72%,14%/0.88)] via-[hsl(220,65%,20%/0.85)] to-[hsl(220,72%,14%/0.94)]
```

**Mobile badge** (line 119): Remove the hardcoded "500+" prefix — the translation value already contains it.

```tsx
// Before
<p className="...">500+ {t("hero.stats.students")}</p>

// After
<p className="...">{t("hero.stats.students")}</p>
```

### Files changed

| File | Change |
|------|--------|
| `src/pages/Index.tsx` | Darken hero overlay gradient, fix duplicated badge text |

