# Relecture de la banque du chapitre 8 de mathématiques (tronc commun, 1re)

## Méthode

1. Résolution à l'aveugle des 150 questions à partir des énoncés masqués (`masquer.py 8`), sans ouvrir la banque ni le chapitre.
2. Calculs refaits dans un script Python (sympy) : images, sommets, extremums, développements, recettes et hauteurs maximales.
3. Comparaison automatique (`comparer.py 8`) avec les réponses de la banque.
4. Relecture complète des énoncés, propositions, réponses, explications, du texte du cours et contrôle de la typographie (espace insécable avant « : ; ! ? »), de la répartition des bonnes réponses et des réponses repérables par leur forme.

## Résultat de la comparaison à l'aveugle

147 concordances sur 150 au premier passage. Les 3 écarts (088, 089, 090) sont des erreurs de ma part : j'avais trouvé les bonnes réponses (088 : y = −2(x − 1)(x − 4) ; 089 : x² + x − 6 ; 090 : −2x(x − 6)) mais je les ai mal reportées en décalant les indices dans mon fichier de réponses. La banque est juste sur ces trois questions.

Aucune réponse de la banque n'est fausse. Tous les vrai/faux, QCM multiples et réponses courtes concordent.

## Questions corrigées

| Source | Problème | Décision |
| --- | --- | --- |
| maths-tc:ch8:banque:132 | R(x) = (30 − x)(200 + 10x) : trouver la racine −20 puis le milieu des racines suppose de voir le facteur 10 dans 200 + 10x, ce qui dépasse ce public sans formule −b/(2a). | Énoncé complété par la forme R(x) = −10(x − 30)(x + 20) (comme la 133 donne ses deux formes) ; explication réécrite à partir de cette forme. Réponse inchangée (5 €, indice 3). |

## Texte du cours

Aucune correction : tous les exemples (sommets, extremums, signes, tableaux, recette du concert, arche, trajectoire, questions flash) ont été vérifiés. Le cours trouve l'axe par f(x) = c et la symétrie, sans discriminant ni formule −b/(2a), conformément au programme.

## Points vérifiés sans modification

- Questions en forme développée (045, 046, 061, 068, 076, 081, 101, 106, 112, 139) : les explications trouvent l'axe en résolvant f(x) = c, sans −b/(2a).
- Aucune bonne réponse n'est repérable par sa longueur ; répartition des bonnes réponses en QCM unique : 19 / 18 / 19 / 19 (indices 0 à 3).
- Réponses courtes : variantes avec signe moins ASCII et typographique ; 150 accepte « 12.5 », la virgule étant normalisée par l'application (même convention que les chapitres précédents).
- 084 (« sans calculer d'image ») : formulation un peu forte puisque g(5) = 0 se lit directement, mais l'explication procède par symétrie et la question reste correcte.

## Questions laissées à relire

Aucune.

## Contrôles

- `verifier 8` : « Banque du chapitre 8 conforme : 150 questions. »
- `cours` : 1 chapitre, 40 277 octets, 8 sections ; nettoyage HTML : rien n'est retiré ; import à blanc construit.
- `comparer.py 8` après correction : 147 concordantes, 3 écarts (088, 089, 090), tous dus à mon erreur de report d'indices (voir ci-dessus).

## Contre-vérification par la session principale

Les trois écarts de la comparaison à l'aveugle (088, 089, 090) ont été revérifiés sans le relecteur : 088, parabole tournée vers le bas de racines 1 et 4 → y = −2(x − 1)(x − 4) ; 089, seule x² + x − 6 vaut −6 en 0 ; 090, −2 × 3 × (3 − 6) = 18. Les réponses de la banque sont justes ; les écarts viennent d'un décalage d'indices dans le fichier du relecteur.
