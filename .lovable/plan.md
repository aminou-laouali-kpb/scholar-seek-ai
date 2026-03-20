

# Plan: Restructuration du menu + Nouveau flow Recours Gracieux + Dashboard intelligent

## Analyse de ta vision

Tu veux 3 choses interconnectées :

1. **Simplifier le menu** — trop de liens actuellement (7 nav links + boutons auth)
2. **Nouveau flow recours gracieux** — page d'information riche → CTA → login obligatoire → profil → outil
3. **Dashboard intelligent** — si l'étudiant a utilisé l'outil recours, lui pousser écoles privées + bourses

---

## 1. Restructuration du Header

**Actuellement** : Accueil, Outils, Services, Partenaires, Destinations, Blog, Contact (7 items)

**Proposition** : Réduire à 5 items principaux + regrouper

| Item | Contenu |
|------|---------|
| Accueil | `/` |
| Recours Gracieux | `/recours-gracieux` (nouvelle page info) — **mis en avant avec badge** |
| Destinations | `/destinations` |
| Services | `/services` (fusionner Partenaires dedans ou via dropdown) |
| Blog | `/blog` |

- **Retirer du menu** : "Outils" (accessible depuis Destinations/Dashboard), "Partenaires" (intégrer dans Services), "Contact" (déplacer dans le footer, déjà présent)
- Le lien "Recours Gracieux" aura un style distinctif (badge "Gratuit" ou couleur accent) pour attirer l'attention
- Mobile : même simplification, menu plus aéré

---

## 2. Nouveau flow Recours Gracieux (2 pages)

### Page A : `/recours-gracieux` (nouvelle page informative publique)

Page de présentation riche et convaincante. Pas de formulaire ici. Sections :

- **Hero** : titre fort, sous-titre rassurant, illustration
- **C'est quoi un recours gracieux ?** : explication simple, sans jargon
- **Comment ça marche avec KPB** : 3 étapes visuelles (1. Teste ton éligibilité, 2. On analyse ton dossier, 3. Tu reçois ton plan d'action)
- **Qui peut faire un recours ?** : critères simples
- **Témoignages / stats** : éléments de confiance
- **FAQ détaillée** : questions courantes
- **CTA principal** : "Tester gratuitement mon dossier" → redirige vers `/recours-gracieux/analyse`

### Page B : `/recours-gracieux/analyse` (l'outil existant)

**Modification du flow** : quand l'étudiant clique sur le CTA, au lieu de lancer directement le formulaire :

1. Si **non connecté** → redirect vers `/login?redirect=/recours-gracieux/analyse`
2. Si connecté mais **profil incomplet** → redirect vers `/complete-profile?redirect=/recours-gracieux/analyse`
3. Si connecté + profil complet → accès direct au formulaire (et pré-remplir les champs depuis le profil)

**Pré-remplissage** : nom, email, WhatsApp, pays, nationalité, niveau d'études → tirés du profil existant

---

## 3. Dashboard intelligent post-recours

Quand un étudiant a soumis une analyse recours gracieux :

- **Nouveau composant** `RecoursStatusCard` sur le dashboard : résumé du résultat, CTA vers les prochaines étapes
- **Boost écoles privées** : si `open_to_private = true` ou si le résultat est C/D, la section AdmissionOpportunities est mise en avant avec un titre contextuel ("Sécurise ton plan B")
- **Boost bourses** : les bourses sont poussées plus haut avec un message adapté ("Pendant que tu attends ta réponse, explore ces bourses")
- Logique : requête `recours_submissions` pour l'utilisateur connecté, ajuster l'ordre et le messaging du dashboard

---

## Fichiers impactés

| Fichier | Changement |
|---------|-----------|
| `src/components/layout/Header.tsx` | Réduire nav à 5 items, ajouter badge "Gratuit" sur Recours |
| `src/pages/RecoursInfo.tsx` | **Nouveau** — page informative `/recours-gracieux` |
| `src/pages/RecoursAnalyse.tsx` | Modifier flow : exiger login + profil avant accès au formulaire, pré-remplir depuis profil |
| `src/components/recours/RecoursForm.tsx` | Accepter données pré-remplies en props |
| `src/pages/Dashboard.tsx` | Ajouter section recours status + boost écoles privées conditionnelle |
| `src/components/dashboard/RecoursStatusCard.tsx` | **Nouveau** — carte résumé recours sur le dashboard |
| `src/App.tsx` | Ajouter route `/recours-gracieux` (page info) |

---

## Résumé du parcours utilisateur

```text
Menu "Recours Gracieux"
  → /recours-gracieux (page info riche)
    → CTA "Tester mon dossier"
      → Pas connecté ? → /login → retour automatique
      → Profil incomplet ? → /complete-profile → retour automatique  
      → OK → /recours-gracieux/analyse (formulaire pré-rempli)
        → Résultat
          → Dashboard enrichi avec écoles privées + bourses
```

