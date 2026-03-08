

## Plan: Upgrade du formulaire d'inscription — indicatifs, pays complets, filières prédéfinies

### 3 améliorations ciblées sur `SignUp.tsx` et `translations.ts`

### 1. WhatsApp : sélecteur d'indicatif avec drapeaux

Remplacer le champ texte simple par un combo : **dropdown indicatif (drapeau + code)** + **input numéro**.

- Créer un fichier `src/data/countries.ts` contenant la liste complète des ~240 pays du monde avec : `code ISO`, `nom EN`, `nom FR`, `drapeau emoji`, `indicatif téléphonique` — triés par ordre alphabétique.
- Dans le formulaire, afficher un `Select` compact (largeur ~100px) montrant `🇨🇲 +237` à côté d'un `Input` pour le numéro local.
- La liste déroulante affiche `🇨🇲 Cameroun (+237)` pour chaque pays.
- Valeur par défaut : `+237` (Cameroun, cible principale).

### 2. Pays de naissance / résidence : tous les pays du monde avec drapeaux

Remplacer la liste limitée de ~27 pays africains par la **liste complète des pays du monde** (même source `countries.ts`), triée alphabétiquement selon la langue active.

- Chaque item affiche `🇫🇷 France` ou `🇨🇲 Cameroun`.
- Utiliser un `ScrollArea` dans le `SelectContent` pour gérer la longue liste.
- Ajouter un champ de recherche/filtre en haut du dropdown via `Command` (combobox searchable) au lieu d'un simple `Select`, pour que l'utilisateur puisse taper et filtrer rapidement.

### 3. Filière souhaitée : liste de 30 filières prédéfinies

Remplacer le champ texte libre par un **Select avec 30 filières** classées par ordre alphabétique, plus une option "Autre" avec champ texte libre.

Les 30 filières (EN/FR) couvriront : Administration des affaires, Agriculture, Architecture, Arts & Design, Biologie, Chimie, Commerce international, Communication, Comptabilité & Finance, Droit, Économie, Éducation, Génie civil, Génie informatique, Génie mécanique, Gestion hôtelière & Tourisme, Informatique / Computer Science, Langues, Marketing, Mathématiques, Médecine, Pharmacie, Physique, Relations internationales, Ressources humaines, Sciences de l'environnement, Sciences infirmières, Sciences politiques, Sociologie, Télécommunications.

+ Option "Autre (préciser)" qui affiche un champ texte.

### Fichiers

| Fichier | Action |
|---------|--------|
| `src/data/countries.ts` | **Créer** — liste complète des pays (ISO, nom EN/FR, drapeau, indicatif) |
| `src/pages/SignUp.tsx` | **Modifier** — nouveau composant téléphone, combobox pays, select filières |
| `src/i18n/translations.ts` | **Modifier** — ajouter les 30 filières EN/FR + labels associés |

### Approche technique

- Combobox pays : utiliser les composants `Popover` + `Command` (déjà installés via cmdk) pour un dropdown cherchable.
- Indicatif téléphone : même approche combobox compact.
- Filières : simple `Select` standard (30 items = gérable sans recherche, mais on peut ajouter un filtre si souhaité).

