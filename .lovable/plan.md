

## Plan : Authentification Google + Complétion de profil

### Prérequis — Connexion à Lovable Cloud

Le projet n'a actuellement aucun backend. Il faut d'abord activer **Lovable Cloud** (ou connecter un projet Supabase externe). Cela fournira :
- Base de données PostgreSQL
- Auth Supabase (email + Google OAuth)
- Stockage sécurisé des profils

### Étape 1 : Activer Lovable Cloud

Je vais vous demander de connecter Lovable Cloud au projet. C'est un clic dans l'interface.

### Étape 2 : Base de données

Créer les tables :
- `profiles` — lié à `auth.users(id)` avec trigger auto-création
  - `id`, `first_name`, `last_name`, `email`, `whatsapp`, `phone_country`, `country_of_birth`, `country_of_residence`, `study_level`, `desired_program`, `dont_know_program`, `orientation_result`, `profile_completed`, `created_at`
- `user_roles` — table séparée pour les rôles (sécurité)

### Étape 3 : Auth Google

- Configurer le provider Google dans Supabase Auth
- Créer un bouton "Se connecter avec Google" sur Login et SignUp
- Après connexion Google, vérifier si `profile_completed = false` → rediriger vers une page de complétion de profil

### Étape 4 : Flux utilisateur

```text
Inscription classique (email):
  SignUp form complet → création compte + profil → Dashboard

Connexion Google (nouveau):
  Bouton Google → Auth Supabase → Vérif profil
    → Si profil incomplet → /complete-profile (nom, WhatsApp, pays, filière...)
    → Si profil complet → /dashboard

Login classique:
  Email + mot de passe → Auth Supabase → Dashboard
```

### Étape 5 : Page `/complete-profile`

Nouveau composant qui réutilise les mêmes champs que SignUp (nom passeport, WhatsApp, pays, niveau, filière) mais sans email/mot de passe (déjà fournis par Google).

### Étape 6 : Migration localStorage → Supabase

Remplacer tous les `localStorage.getItem("kpb-student-profile")` par des requêtes Supabase dans Dashboard, Orientation, etc.

### Fichiers à créer
- `src/pages/CompleteProfile.tsx` — formulaire complétion profil post-Google
- `src/integrations/supabase/` — client + types
- Migrations SQL pour `profiles` et `user_roles`

### Fichiers à modifier
- `src/pages/Login.tsx` — ajouter bouton Google
- `src/pages/SignUp.tsx` — ajouter bouton Google + logique auth Supabase
- `src/pages/Dashboard.tsx` — lire profil depuis Supabase
- `src/pages/Orientation.tsx` — sauvegarder résultat dans Supabase
- `src/App.tsx` — ajouter route `/complete-profile` + auth context

### Action requise maintenant

Pour commencer, il faut **activer Lovable Cloud** sur ce projet. Voulez-vous que je lance la connexion ?

