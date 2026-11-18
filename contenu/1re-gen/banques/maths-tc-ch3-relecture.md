# Relecture de la banque du chapitre 3 de mathématiques (tronc commun, 1re)

## Méthode

1. Résolution à l'aveugle des 150 questions à partir de la version masquée (énoncés et propositions, sans réponses ni explications).
2. Calculs refaits dans un script Python (`fractions.Fraction`) : coefficients directeurs et ordonnées à l'origine, appartenance de points, intersections, et solutions de f(x) = k sur chaque ligne brisée, calculées par interpolation linéaire (un ensemble infini est signalé pour un segment horizontal).
3. Comparaison automatique avec la banque (`comparer.py`).
4. Relecture complète des questions, réponses, explications et du texte du cours.

## Résultat de la comparaison à l'aveugle

150 concordances sur 150 au premier passage, 0 écart.

Doutes de l'auteur examinés :
- Lignes brisées « reliant dans l'ordre les points… » (010, 011, 012, 018, 020, 025, 026, 031, 032, 041) : chaque description détermine une seule courbe et une seule réponse ; vérifié par le calcul.
- 026, f(x) = 3 : les solutions sont −2 et tout l'intervalle [2 ; 4]. L'énoncé « a exactement deux solutions » est donc faux sans ambiguïté, et l'explication dit bien « une infinité de solutions ». La question est conservée.

## Questions corrigées

| Source | Problème | Décision |
|---|---|---|
| maths-tc:ch3:banque:020 | Explication peu claire : « de −2 à 2… de −1 à 3 » ressemblait à des abscisses alors qu'il s'agit des valeurs de f | Explication précisée segment par segment, avec les solutions x = −2, x = 1 et x = 2,75 |
| maths-tc:ch3:banque:033 | Énoncé incomplet : la position de la courbe en dehors de [−2 ; 2] n'était pas donnée, d'où l'option sur f(x) < 1 | Ajout de « et en dessous ailleurs » |
| maths-tc:ch3:banque:043 | Même manque : l'explication déduisait la position « en dessous ailleurs » d'une simple absence d'intersection | Ajout de « et en dessous ailleurs » à l'énoncé ; explication ajustée |
| maths-tc:ch3:banque:116 | Énoncé maladroit (« quel point… ? Donne son abscisse ») alors que les propositions sont des abscisses | Reformulé : « Quelle est l'abscisse du point de la droite d'équation y = 4x − 6 dont l'ordonnée est 10 ? » ; explication complétée |

Les espaces insécables ont été rétablies dans les champs modifiés.

## Texte du cours

Une correction, dans `chapitres/ch3.json` et `cours-ch3.json` : la définition de « décroissante » est alignée sur celle de « croissante », qui disait déjà « f(x) augmente (ou reste égal) ». Elle dit maintenant « f(x) diminue (ou reste égal) ». Aucune erreur mathématique n'a été trouvée dans les exemples (figures 1 à 3, tableaux de variations et de signes, équations de droites, intersection, tarifs).

## Questions laissées à relire

Aucune.

## Contrôles

- `pilote.ts verifier 3` : « Banque du chapitre 3 conforme : 150 questions. »
- `pilote.ts cours` : 1 chapitre, 7 sections, 45 167 octets ; couleur acceptée (contraste 9,93:1) ; nettoyage HTML : rien n'est retiré ; import à blanc construit, aucune base contactée.
- `comparer.py 3` : 150 concordantes, 0 écart.
