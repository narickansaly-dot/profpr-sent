# Relecture de la banque du chapitre 6 de mathématiques (2de) contre le cours

Relecture des 150 questions de `maths-ch6.json` contre le texte du chapitre « Vecteurs du plan et problèmes de géométrie », question par question. Mêmes critères qu'aux chapitres précédents ; chaque coordonnée, distance, déterminant et valeur trigonométrique a été recalculé.

## Répartition

- Types : 75 `qcm_unique`, 30 `qcm_multiple`, 30 `vrai_faux` (15 vrais, 15 faux), 15 `reponse_courte`.
- Difficultés : 60 / 60 / 30.
- Notions (9) : Translations et vecteurs ; Vecteurs égaux et parallélogramme ; Somme et relation de Chasles ; Produit par un réel ; Coordonnées d'un vecteur ; Distance et milieu ; Colinéarité et déterminant ; Projeté orthogonal ; Trigonométrie et problèmes.

## Corrections faites pendant la rédaction

- Dix questions de difficulté 3 retirées pour respecter la répartition (dont une question sur la lecture de la notation, mal cotée, et une sur le volume d'une boule, plus proche du collège).
- Explication corrigée pour « Pour un angle aigu α, quelles affirmations sont vraies ? » (cos α + sin α ≠ 1, contre-exemple α = 45°).
- Trois paires d'énoncés trop proches reformulées.

## Points de doute

| Énoncé | Doute | Proposition |
| --- | --- | --- |
| Notation des vecteurs (AB⃗, u⃗) | Le HTML autorisé ne permet pas une flèche au-dessus de deux lettres. La flèche est un caractère combinant (U+20D7) placé après la dernière lettre ; le cours l'explique. Le rendu dépend de la police : la flèche peut être légèrement décalée sur certains téléphones. | Garder ; à vérifier sur appareil. Une solution durable serait une classe CSS « vecteur » (voir le bilan). |
| « Si AB⃗ = CD⃗, quel quadrilatère est un parallélogramme ? » (réponse ABDC, difficulté 3) | Exacte, mais l'explication reste un peu technique. | Garder. |
| « Pour quelles valeurs de m les vecteurs (m ; 2) et (8 ; m) sont-ils colinéaires ? » | Conduit à m² = 16 : réinvestit le chapitre 5. | Garder (difficulté 2). |
| Réponses courtes de distance (« 10 », « 12 », « 4 ») | Valeurs entières exactes ; aucune marge nécessaire. | Conforme. |
| Valeurs remarquables (cos 30°, sin 45°…) | Rappelées dans le cours ; le programme de seconde ne les impose pas mais elles sont d'usage courant. | Garder. |

## Texte du cours

- Trois figures SVG : parallélogramme, relation de Chasles, projeté orthogonal ; les flèches utilisent un marqueur SVG (`marker`) interne, autorisé par la liste blanche.
- La démonstration du critère de colinéarité traite le cas u⃗ = 0⃗ et le cas x ≠ 0 ; le cas y ≠ 0 est signalé comme identique.

## Mise à jour d'après le programme de 2026

Le programme de 2026 retire le projeté orthogonal et la démonstration de cos² α + sin² α = 1 ; il ajoute les représentants d'un vecteur, la combinaison de deux vecteurs non colinéaires, la caractérisation vectorielle du milieu et la caractérisation de la colinéarité par la proportionnalité des coordonnées. La trigonométrie dans le triangle rectangle passe dans les automatismes.

- Section « Projeté orthogonal » remplacée par « Représentants, combinaisons et milieu » ; démonstration de cos² + sin² = 1 retirée ; proportionnalité des coordonnées ajoutée à la section sur le déterminant.
- 15 questions sur le projeté orthogonal et 3 questions sur cos² + sin² = 1 remplacées par 15 questions « Représentants et combinaisons » et 3 questions de trigonométrie (même répartition).
- Les translations restent présentées en première section comme rappel du cycle 4.
