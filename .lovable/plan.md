

## Plan : Filtre partenaires KPB + Page Partenariats

### 1. Filtre "Écoles partenaires KPB" dans AdmissionOpportunities

**Fichier modifié : `src/components/dashboard/AdmissionOpportunities.tsx`**

- Ajouter un champ `relevanceTags` au mapping des données DB (déjà disponible dans `admin_admissions.relevance_tags`)
- Mettre à jour l'interface `AdmissionOpportunity` dans `src/data/admissions.ts` pour inclure `relevanceTags?: string[]`
- Ajouter un toggle/bouton filtre "Écoles partenaires KPB" au-dessus de la grille
- Quand activé, filtrer les résultats pour ne garder que ceux dont `relevanceTags` contient `"partner"`
- Badge visuel "Partenaire KPB" sur les cartes des écoles partenaires

### 2. Nouvelle page `/partners` — Partenariats Omnes & Igensia

**Nouveau fichier : `src/pages/Partners.tsx`**

Page publique présentant les deux groupes partenaires avec :

- Hero section avec titre et présentation du partenariat KPB
- Section **Omnes Education** : logo/description du groupe, grille des 6 écoles (ECE, ESCE, HEIP, INSEEC, IUM, Sup de Pub) avec domaines, campus, avantages
- Section **Igensia Education** : description du groupe, grille des 8 écoles (ICD, IGS-RH, ESAM, ISCPA, FFOLLOZZ, IPI, ABS Paris, IMIS) avec domaines, campus, avantages
- Avantages du partenariat KPB : admission simplifiée, accompagnement personnalisé, date limite 1er août 2025
- CTA vers WhatsApp advisor + lien vers dashboard

**Fichier modifié : `src/App.tsx`**
- Ajouter route `/partners` dans les routes publiques

**Fichier modifié : `src/components/layout/Header.tsx`**
- Ajouter lien "Partenaires" dans la navigation (ou sous "Services")

### 3. Mises à jour de données

**Fichier modifié : `src/data/admissions.ts`**
- Ajouter `relevanceTags` optionnel à l'interface `AdmissionOpportunity`
- Ajouter `relevanceTags: ["partner", "omnes-education"]` ou `["partner", "igensia-education"]` aux 14 entrées partenaires existantes

### Résumé des fichiers

| Fichier | Action |
|---------|--------|
| `src/data/admissions.ts` | Ajouter `relevanceTags` à l'interface + aux 14 écoles partenaires |
| `src/components/dashboard/AdmissionOpportunities.tsx` | Ajouter filtre partenaires + badge + mapping `relevanceTags` |
| `src/pages/Partners.tsx` | Nouvelle page dédiée partenariats |
| `src/App.tsx` | Ajouter route `/partners` |
| `src/components/layout/Header.tsx` | Ajouter lien navigation "Partenaires" |

