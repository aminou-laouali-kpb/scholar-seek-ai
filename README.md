# KPB Education — Site d'orientation

Site public de **KPB Education** pour les étudiants qui veulent étudier à l'étranger : recherche d'universités et de bourses, questionnaires d'orientation, analyse de recours et prise de contact avec un conseiller.

## Fonctionnalités

- **Bourses** : catalogue de bourses et de programmes partenaires.
- **Recherche par pays** : France, Belgique et fiches pays détaillées.
- **Questionnaire d'orientation** et **test Fulbright**.
- **Analyse de recours** pour les candidatures refusées.
- **Espace étudiant** : tableau de bord et éléments sauvegardés.
- **Blog**, pages services, partenaires et contact.
- **Back-office admin** : leads et scores, demandes de contact et de consultation, bourses, admissions, blog, utilisateurs, paramètres.

## Stack

- React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui, Framer Motion
- Supabase : PostgreSQL avec RLS et Auth
- TanStack Query, React Hook Form, Zod, Recharts

## Structure

```
src/pages/            pages publiques (Index, Scholarships, FranceFinder, BelgiumFinder,
                      Questionnaire, FulbrightTest, Blog…)
src/pages/admin/      back-office (AdminLeads, AdminScholarships, AdminBlog…)
supabase/migrations/  schéma (profils, bourses, leads, blog, questionnaires…)
```

## Démarrer en local

```bash
npm install
npm run dev
```

Variables d'environnement (fichier `.env`) :

| Variable | Rôle |
|---|---|
| `VITE_SUPABASE_URL` | URL du projet Supabase |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | clé publique (anon) Supabase |

## Origine

Projet créé avec [Lovable](https://lovable.dev) et maintenu par KPB Education.
