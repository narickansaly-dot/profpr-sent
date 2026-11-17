# Relecture de la banque du chapitre 10 (spécialité maths, 1re) : géométrie repérée

Banque : `maths-spe-ch10.json`, 150 questions, sources `maths-spe-1re:ch10:banque:001` à `150`.

## Méthode

1. **Rédaction** : chaque question recalculée avec sympy (équations, points, vecteurs normaux ou directeurs, projetés, distances, centres, rayons) ; bonnes réponses justes et distracteurs faux ; dans chaque QCM qui propose des équations, aucune paire de propositions proportionnelles (une équation de droite est définie à un facteur près).
2. **Relecture indépendante** : un second agent a reçu les 150 énoncés **sans les réponses ni les explications**, les a résolus en refaisant chaque calcul avec sympy et a vérifié l'absence de distracteur proportionnel à la bonne réponse (questions 005, 039, 042 à 047, 062, 135, 140 en particulier).
3. **Comparaison automatique** de ses réponses avec les réponses attendues.

## Résultat

- **149 / 150 réponses concordantes**, 1 désaccord, 0 doute signalé.

| Question | Désaccord | Décision |
| --- | --- | --- |
| 148 (vrai/faux : « 3x + 4y − 25 = 0 est la tangente au cercle de centre O et de rayon 5 au point (4 ; 3) ») | Le relecteur a répondu « vrai » | **Réponse attendue confirmée (faux)** : 3 × 4 + 4 × 3 − 25 = −1 ≠ 0, le point (4 ; 3) n'est pas sur la droite (vérifié par script). Cette droite est la tangente en (3 ; 4). L'erreur du relecteur (inversion des coordonnées) est exactement celle que la question vise ; l'explication la corrige. Maintenue. |

Le relecteur note aussi qu'à la question 012, l'équation proportionnelle −2x + 4y − 6 = 0 fait partie des bonnes réponses attendues : c'est voulu (QCM multiple « quelles équations représentent la même droite »).

## Points de doute du rédacteur

- La formule de la distance |ax₀ + by₀ + c|/√(a² + b²) et la parabole (points équidistants d'une droite et d'un point) sont dans une section « Pour aller plus loin ».
- Questions 087 et 149 (distances) : se résolvent par le projeté, plus vite avec la formule.
- Les réponses courtes demandent un coefficient c en fixant la forme de l'équation dans l'énoncé.

## Statut

Aucune question douteuse : les 150 questions passent en `valide`.
