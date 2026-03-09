

## Plan : Blog Admin complet + SEO renforcé

### 1. Table `blog_posts` en base de données

Nouvelle table avec :
- `id`, `slug` (unique, pour URLs SEO)
- `title_fr`, `title_en`, `content_fr`, `content_en` (texte riche / markdown)
- `excerpt_fr`, `excerpt_en` (résumé pour cartes + meta description)
- `category`, `tags` (array)
- `cover_image_url` (pour OG image)
- `meta_title_fr`, `meta_title_en`, `meta_description_fr`, `meta_description_en` (champs SEO dédiés)
- `author_name`, `reading_time_minutes`
- `is_published`, `published_at`, `created_at`, `updated_at`
- RLS : lecture publique (published), CRUD admin

### 2. Admin Blog (`/admin/blog`)

Nouveau fichier `src/pages/admin/AdminBlog.tsx` :
- Liste des articles avec statut (brouillon/publié), date, catégorie
- Recherche + filtres
- Boutons publier/dépublier, supprimer
- Import/export CSV (même pattern que AdminScholarships)

Nouveau fichier `src/components/admin/BlogPostForm.tsx` :
- Formulaire complet : titre FR/EN, contenu FR/EN (textarea markdown), excerpt FR/EN
- Champs SEO dédiés : meta title, meta description, slug (auto-généré depuis le titre, éditable)
- Catégorie, tags, image de couverture (URL), temps de lecture
- Switch publié/brouillon
- Preview du rendu SEO (simulation snippet Google)

Ajout dans `AdminLayout.tsx` : lien "Blog" dans la sidebar admin.
Ajout dans `App.tsx` : route `/admin/blog`.

### 3. Page Blog publique dynamique

Réécrire `src/pages/Blog.tsx` :
- Fetch depuis `blog_posts` (published only)
- Filtrage par catégorie fonctionnel
- Recherche fonctionnelle (titre + excerpt)
- Pagination (9 articles par page)
- Cartes avec image de couverture, excerpt, date, temps de lecture

Nouveau fichier `src/pages/BlogPost.tsx` :
- Route `/blog/:slug`
- Fetch article par slug
- Rendu du contenu markdown
- Meta tags dynamiques via `document.title` + meta tags injection
- Structured data JSON-LD (Article schema)
- Boutons partage social
- Articles liés en bas de page

Ajout dans `App.tsx` : route `/blog/:slug`.

### 4. SEO global

**Nouveau composant `src/components/SEOHead.tsx`** :
- Composant réutilisable qui injecte dynamiquement `<title>`, `<meta description>`, `<meta og:*>`, `<meta twitter:*>` via `document.head`
- Utilisé sur chaque page publique avec des meta adaptés

**Fichier `public/sitemap.xml`** (statique pour les pages fixes) :
- `/`, `/services`, `/destinations`, `/scholarships`, `/partners`, `/blog`, `/contact`, `/about`, `/faq`, `/testimonials`, `/tools`

**Mise à jour `public/robots.txt`** :
- Ajouter `Sitemap: https://votre-domaine.com/sitemap.xml`
- Bloquer `/admin`, `/dashboard`, `/login`, `/signup`

### 5. Dashboard admin : compteur blog

Ajouter le compteur "Blog Posts" dans `AdminDashboard.tsx`.

### Fichiers impactés

| Fichier | Action |
|---------|--------|
| Migration SQL | Créer table `blog_posts` + RLS |
| `src/pages/admin/AdminBlog.tsx` | Nouveau — CRUD articles |
| `src/components/admin/BlogPostForm.tsx` | Nouveau — formulaire article + SEO |
| `src/pages/admin/AdminLayout.tsx` | Ajouter lien Blog sidebar |
| `src/pages/Blog.tsx` | Réécrire — dynamique depuis DB |
| `src/pages/BlogPost.tsx` | Nouveau — page article individuel |
| `src/components/SEOHead.tsx` | Nouveau — meta tags dynamiques |
| `src/App.tsx` | Ajouter routes `/blog/:slug` + `/admin/blog` |
| `src/pages/admin/AdminDashboard.tsx` | Ajouter compteur blog |
| `public/sitemap.xml` | Nouveau |
| `public/robots.txt` | Mise à jour |

