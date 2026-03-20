

# Plan combiné : toutes les améliorations en attente

9 fichiers modifiés, 0 changement DB. 1 action auth config.

---

## 1. Désactiver la confirmation email

**Action** : `cloud--configure_auth` pour activer auto-confirm email signups.

**Fichier** : `src/pages/SignUp.tsx` (ligne 176)
- Remplacer `navigate("/check-email")` par `navigate("/dashboard")`
- Ajouter `toast.success("Bienvenue !")`

---

## 2. Fulbright test : liste déroulante des filières

**Fichier** : `src/pages/FulbrightTest.tsx` (lignes 279-281)
- Remplacer `<Input>` par `<Select>` avec `STUDY_PROGRAMS` de `src/data/countries.ts`
- Ajouter option "Autre" avec champ libre conditionnel
- Même pattern que `CompleteProfile.tsx`

---

## 3. Fulbright WhatsApp CTA : message pré-rempli

**Fichier** : `src/pages/FulbrightTest.tsx` (ligne 188)
- Changer `WA_LINK` ou le `href` du CTA résultat en `https://wa.me/33768674292?text=Bonjour%2C%20je%20veux%20commencer%20mon%20accompagnement%20Fulbright`

---

## 4. CTA outils : auth gate "Login puis outil"

Ajouter `useAuth` + `useNavigate` sur les CTAs principaux de 3 pages. Logic : si non connecté → `/login?redirect=[tool_path]`, sinon scroll ou rester.

| Fichier | CTA actuel | Fix |
|---------|-----------|-----|
| `src/pages/FranceFinder.tsx` | `<Button>` sans action | `onClick` avec auth gate → `/login?redirect=/tools/france` |
| `src/pages/BelgiumFinder.tsx` | `<Button>` sans action | `onClick` avec auth gate → `/login?redirect=/tools/belgium` |
| `src/pages/ScholarshipTest.tsx` | `<Button>` sans action | `onClick` avec auth gate → `/login?redirect=/tools/scholarship-test` |

---

## 5. Page Partenaires : meilleur empty state

**Fichier** : `src/pages/Partners.tsx`
- Après les filtres, si `filteredGroups.length === 0` ET `dbPrograms.length === 0`, afficher un bloc informatif :
  - "Nos écoles partenaires seront bientôt disponibles ici"
  - CTA WhatsApp "Contactez-nous pour connaître nos écoles partenaires"
- Distinguer "pas de données" vs "aucun résultat de filtre"

---

## 6. Profil : toast erreur/succès

**Fichier** : `src/pages/CompleteProfile.tsx` (lignes 186-198)
- Ajouter `toast.success("Profil enregistré !")` dans le bloc `if (!error)`
- Ajouter `toast.error(error.message)` dans un bloc `else`
- Ajouter `console.error` pour debug

---

## 7. Performance : DNS prefetch

**Fichier** : `index.html`
- Ajouter `<link rel="dns-prefetch" href="https://oxmrdmvitrpwtycnounp.supabase.co">`
- Ajouter `<link rel="preconnect" href="https://oxmrdmvitrpwtycnounp.supabase.co">`

---

## Résumé

| # | Quoi | Fichier(s) |
|---|------|-----------|
| 1 | Auto-confirm email | Auth config + `SignUp.tsx` |
| 2 | Select filières Fulbright | `FulbrightTest.tsx` |
| 3 | WhatsApp message Fulbright | `FulbrightTest.tsx` |
| 4 | Auth gate CTA outils | `FranceFinder.tsx`, `BelgiumFinder.tsx`, `ScholarshipTest.tsx` |
| 5 | Empty state partenaires | `Partners.tsx` |
| 6 | Toast profil | `CompleteProfile.tsx` |
| 7 | DNS prefetch | `index.html` |

7 corrections, 7 fichiers modifiés, 1 auth config, 0 migration DB.

