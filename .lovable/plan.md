

# Amélioration de la page Recours Gracieux : lisibilité + Hero + copywriting

## Problèmes identifiés

1. **Hero trop dense sur mobile (391px)** : le texte, le badge, le CTA et les indicateurs sont empilés dans un espace réduit avec peu de respiration
2. **Contraste faible** : `text-white/75` et `text-white/50` sur un fond gradient sombre = lisibilité insuffisante sur mobile
3. **Copywriting trop générique** : le hero ne crée pas assez d'urgence émotionnelle pour un étudiant stressé par un refus
4. **Sections trop uniformes** : alternance `bg-background` / `bg-secondary/30` sans rupture visuelle forte
5. **Padding serré** : `px-4` partout = texte trop près des bords sur petit écran

## Changements prévus

### Hero — refonte complète

- **Headline plus percutant** : passer de "Refusé sur Études en France ?" à un message en 2 temps qui crée de l'empathie puis de l'espoir
- **Sous-titre plus clair** : expliquer concrètement ce que l'outil fait en une phrase
- **Meilleur contraste** : `text-white` au lieu de `text-white/75`, sous-titre en `text-white/80`
- **Plus de padding mobile** : `py-24 md:py-32` au lieu de `py-20 md:py-28`, `px-5` au lieu de `px-4`
- **Indicateurs en badges plus lisibles** : fond `bg-white/15` au lieu de texte nu
- **CTA plus grand sur mobile** avec texte plus gros

### Copywriting — amélioration de toutes les sections

- **"C'est quoi un recours gracieux ?"** : rendre plus direct, moins académique
- **"Comment ça marche ?"** : descriptions plus courtes et actionnables
- **"Qui peut faire un recours ?"** : titre plus engageant ("Es-tu concerné(e) ?")
- **Stats section** : remplacer "4 catégories" (pas parlant) par des métriques plus convaincantes
- **CTA intermédiaire** : copywriting plus émotionnel
- **Reassurance finale** : plus de chaleur

### Lisibilité mobile

- Augmenter `px-4` → `px-5 sm:px-6` sur toutes les sections
- Augmenter les tailles de texte body : `text-sm` → `text-base` sur les descriptions
- Augmenter `leading-relaxed` → `leading-relaxed` partout (déjà là, mais vérifier)
- Cards : augmenter le padding interne `p-5` → `p-6`
- FAQ : augmenter la taille du texte des questions

## Fichier modifié

| Fichier | Changement |
|---------|-----------|
| `src/pages/RecoursInfo.tsx` | Refonte hero, copywriting amélioré, meilleure lisibilité mobile |

Un seul fichier modifié. Pas de changement de structure ni de DB.

