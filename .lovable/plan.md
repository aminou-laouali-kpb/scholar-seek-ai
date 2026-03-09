

## Ajout des écoles partenaires Omnes Education et Igensia Education

### Ecoles identifiées

**Omnes Education** (6 écoles, extraites du CSV) :
| Ecole | Domaines principaux | Niveaux | Campus | Frais (de-à) |
|-------|---------------------|---------|--------|--------------|
| **ECE** | Informatique, IA, Cybersécurité, Ingénierie | Bachelor, Master, PGE | Paris, Lyon, Bordeaux, Toulouse, Marseille, Rennes | 8 490 – 12 450 € |
| **ESCE** | Commerce international, Finance, Marketing, Supply Chain | Bachelor, Master, PGE | Paris, Lyon | 9 650 – 12 650 € |
| **HEIP** | Relations internationales, Sciences politiques, Diplomatie | Bachelor, Master | Paris, Lyon, Bordeaux, Rennes | 9 650 – 10 690 € |
| **INSEEC** | Business, Finance, Marketing, RH, Luxe, Sport, Immobilier | Bachelor, Master, PGE | Paris, Lyon, Bordeaux, Marseille, Chambéry, Toulouse, Rennes | 8 190 – 16 650 € |
| **IUM** | Finance, Luxury Management, Sport Business | Bachelor, Master | Monaco | 15 050 – 31 950 € |
| **Sup de Pub** | Communication, Publicité, Digital, Design, Evénementiel | Bachelor, Master | Paris, Lyon, Bordeaux, Rennes, Toulouse | 8 850 – 12 050 € |

**Igensia Education** (8 écoles, extraites du fichier précédent) :
| Ecole | Domaines | Niveaux | Campus | Frais |
|-------|----------|---------|--------|-------|
| **ICD** | Business, Marketing, Management | Bachelor → MBA | Paris, Toulouse | 8 450 – 10 500 € |
| **IGS-RH** | RH, Transformation Digitale | Bachelor → Master | Paris, Lyon, Toulouse | 8 450 – 10 500 € |
| **ESAM** | Management, Finance, Droit | Bachelor → Master | Paris, Lyon | 8 450 – 10 500 € |
| **ISCPA** | Journalisme, Communication | Bachelor → Master | Paris, Lyon, Toulouse | 8 450 – 10 500 € |
| **FFOLLOZZ** | Marketing d'Influence | Bachelor | Paris | 8 450 € |
| **IPI** | Informatique, Cybersécurité, DevOps | Bachelor → Master | Paris, Lyon, Toulouse | 8 450 – 10 500 € |
| **ABSParis** | BBA, Fashion, Sports, MBA | Bachelor → MBA | Paris | 10 150 – 15 250 € |
| **IMIS** | Affaires Réglementaires | Master | Lyon | 12 500 € |

### Ce qu'on va faire

1. **Insérer 14 entrées dans `admin_admissions`** (1 par école, programmes regroupés)
   - `country: "FR"`, `country_flag: "🇫🇷"` (sauf IUM: Monaco)
   - `institution_type: "grande-ecole"`
   - `intake: "Septembre 2025 (date limite : 1er août 2025)"`
   - `budget_level: "high"`
   - `relevance_tags`: `["partner", "omnes-education"]` ou `["partner", "igensia-education"]`
   - `is_featured: true`, `is_published: true`
   - `admin_notes: "Partenaire KPB – Date limite 1er août 2025"`
   - Descriptions EN/FR adaptées par école

2. **Ajouter les entrées dans `src/data/admissions.ts`** pour le matching côté client (les 14 écoles)

### Détails techniques

- Les programmes sont mappés aux catégories existantes du matching (`business`, `engineering`, `computerScience`, `communication`, `arts`, `law`, `politicalScience`, `economics`, etc.)
- Insertion dans la base via l'outil d'insertion de données (pas de migration)
- Mise à jour du fichier statique en parallèle
- IUM sera marqué `country: "MC"` avec le drapeau Monaco `🇲🇨`

