# Relecture de la banque du chapitre 4 de mathématiques (tronc commun, 1re)

Chapitre 4 : « Statistiques à deux caractères ». Banque : `contenu/1re-gen/banques/maths-tc-ch4.json` (150 questions).

## Méthode

1. Résolution à l'aveugle des 150 questions à partir des énoncés et propositions seuls (sans réponses ni explications).
2. Chaque calcul refait dans un script Python (`fractions.Fraction`), quartiles selon la convention de seconde (Q1 = plus petite valeur telle qu'au moins 25 % des valeurs lui sont inférieures ou égales).
3. Comparaison automatique avec les réponses de la banque.
4. Relecture complète des énoncés, propositions, réponses, explications et du texte du cours, avec le programme (`contenu/1re-gen/programmes/maths-tc-1re.md`).

## Résultat de la comparaison à l'aveugle

150 concordances sur 150 au premier passage, aucun écart.

## Doutes signalés par l'auteur

- **Automatismes hors chapitre** (135 milieu d'un segment, 136 et 145 taux d'évolution) : conservés. Le programme rattache les automatismes de seconde (géométrie repérée, évolutions) et propres à la première ([Au2] calculer un taux d'évolution) à la partie transversale ; ce sont des questions flash légitimes, faisables de tête.
- **Quartiles** : le cours fixe la convention de seconde (rang N/4 arrondi à l'entier supérieur) ; les questions 004, 005, 011 et 033 la suivent et les explications la montrent. Les distracteurs « 4 » (004) et « 12,5 » (005) correspondent aux conventions concurrentes, ce qui est un bon piège.
- **Distracteurs peu crédibles** : « 0,2 % » (045) et « x = 2,5 » (112) remplacés (voir tableau).

## Questions corrigées

| Source | Problème | Décision |
|---|---|---|
| maths-tc:ch4:banque:045 | Distracteur « 0,2 % » peu crédible (confusion décimal/pourcentage grossière). | Remplacé par « 25 % » (80/320, erreur de dénominateur plausible) ; explication complétée. Bonne réponse inchangée (20 %, position 2). |
| maths-tc:ch4:banque:070 | Bonne réponse rédigée lourdement (« mais il fallait le calculer »), repérable à sa longueur. | Reformulée : « La ville a une plus grande part de cyclistes : environ 17 % contre 10 %. » Position inchangée. |
| maths-tc:ch4:banque:112 | Distracteur « x = 2,5 » peu crédible (simple recopie du coefficient). | Remplacé par « x = 25 » (arrêt à 2,5x = 25) ; explication complétée. Bonne réponse inchangée (x = 10, position 0). |

Rien d'autre à corriger : réponses exactes, explications justes et chiffrées, contenus présents dans le cours et le programme, tout faisable sans calculatrice, aucune référence à une figure du cours, typographie conforme (espaces insécables présentes). Réponses courtes : variantes suffisantes (décimaux au point, normalisés par l'application ; 148 accepte « 1/8 » et « 0.125 » ; 150 accepte les deux signes moins).

## Texte du cours

- Section « Automatismes : questions flash » : l'introduction annonce « Dix questions » alors que la liste en compte onze. Corrigé en « Onze questions » dans `chapitres/ch4.json` et `cours-ch4.json`.
- Vérifiés sans erreur : exemples résolus (moyenne, quartiles, angles, tableau croisé, point moyen G(3,5 ; 20), droite de Mayer y = 4x + 6, moindres carrés y ≈ 3,89x + 6,4 recalculée, extrapolations).

## Questions laissées à relire

Aucune.

## Contrôles

- `pilote.ts verifier 4` : « Banque du chapitre 4 conforme : 150 questions. »
- `pilote.ts cours` : 1 chapitre, 29 411 octets, contraste 9,93:1 accepté, nettoyage HTML : rien retiré, import à blanc construit.
- `comparer.py 4` après correction : 150 concordantes, 0 écart.
