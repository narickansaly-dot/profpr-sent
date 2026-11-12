# Relecture de la banque du chapitre 6 de mathématiques (tronc commun, 1re)

Chapitre : « Répétition d'épreuves indépendantes et simulation ».

## Méthode

1. Résolution à l'aveugle des 150 questions à partir de la version masquée (énoncés et propositions seulement), sans ouvrir la banque ni le chapitre.
2. Recalcul de toutes les questions chiffrées dans un script Python (`fractions.Fraction`, dénombrement des chemins par `itertools.product`), y compris les vrai/faux et les QCM à réponses multiples.
3. Comparaison automatique avec la banque (`comparer.py`).
4. Relecture complète des énoncés, propositions, réponses, explications et du texte du cours.

## Résultat de la comparaison à l'aveugle

150 concordances sur 150 au premier passage, 0 écart.

## Questions corrigées

| Source | Problème | Décision |
|---|---|---|
| (aucune) | Aucune erreur trouvée | Banque laissée telle quelle |

## Points examinés (doutes de l'auteur)

- **092** (réponse 0,2916) : le calcul tient en deux étapes simples à partir de la valeur donnée 0,9³ = 0,729 (0,729 × 0,1 = 0,0729, puis 4 × 0,0729 = 0,2916) ; même schéma que l'automatisme 7 du cours (3 × 0,1 × 0,9² = 0,243). Faisable sans calculatrice, difficulté 3 justifiée : conservée.
- **134** (`randint(1, 6)`) : le cours l'explique explicitement (« randint(1, 6) simule le lancer d'un dé »), comme `=ALEA.ENTRE.BORNES(1;6)` : conservée.
- **130** : l'estimation 0,52 s'appuie sur la valeur 671/1296 ≈ 0,518 donnée deux fois dans le cours (simulation et pari de Méré) ; les distracteurs sont éloignés : conservée.
- **Difficultés** : répartition 60 / 60 / 30, conforme. Quelques cotes sont discutables mais non fautives, et la consigne impose de garder les difficultés : 048 (3) a la même structure que 063 (1) ; 071 (3, 0,5⁴) est proche de 054 (1, 0,5³) ; 111 (3) refait le calcul de 019 (2). À harmoniser éventuellement par échange de cotes à quota constant ; non modifié ici.

## Texte du cours

Relu en entier (définitions, tableaux, arbre, exemples résolus, simulation, jeux historiques, automatismes) : aucune erreur mathématique. Aucune correction.

## Questions laissées à relire

Aucune.

## Contrôles

- `pilote.ts verifier 6` : « Banque du chapitre 6 conforme : 150 questions. »
- `pilote.ts cours` : « ch6 Épreuves répétées : 8 sections » ; nettoyage HTML : rien n'est retiré ; import à blanc construit (25 690 octets).
- `comparer.py 6` : 150 concordantes, 0 écart.
- Typographie : espace insécable présente avant « : ; ! ? » partout (seules exceptions, normales : les points-virgules des formules de tableur dans 128 et 134).
