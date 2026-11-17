# Relecture de la banque du chapitre 10 de mathématiques (tronc commun, 1re)

Chapitre : « Fonctions exponentielles et taux moyen ». Banque : `maths-tc-ch10.json` (150 questions).

## Méthode

1. Résolution à l'aveugle des 150 questions sur la version masquée (énoncés et propositions, sans réponses ni explications), y compris les vrai/faux et les QCM à réponses multiples.
2. Recalcul de chaque question chiffrée dans un script Python (`ch10-calculs.py`, un calcul commenté par source), notes prises avant toute comparaison.
3. Comparaison automatique avec la banque (`comparer.py`).
4. Relecture complète de toutes les questions, réponses et explications, puis du texte du cours : exactitude, programme (aˣ pour a > 0 et x ⩾ 0, exposant 1/n, taux moyen ; ni e ni logarithme), faisabilité sans calculatrice, valeurs approchées fournies, présentation des taux choisis pour tomber juste, réponses courtes, typographie.

## Résultat de la comparaison à l'aveugle

- 150 concordances sur 150 au premier passage ; 0 écart.
- Points relevés à l'aveugle puis vérifiés : 124 (numérotation des jours, sans ambiguïté puisque « le premier jour » compte 10 personnes) ; 127 (« environ 4 » pour 1,97² ≈ 3,88, acceptable) ; 106 (faisable de tête avec 1,05² = 1,1025) ; 051 (encadrement par 2³ et 3³) ; 097, 100, 101 (taux de 21 % et 44 % non signalés comme fictifs, corrigé).

## Questions corrigées

| Source | Problème | Décision |
|---|---|---|
| maths-tc:ch10:banque:021 | L'exemple de l'explication n'utilisait que des exposants entiers, alors que l'énoncé porte sur les exposants non entiers. | Exemple remplacé : 4^0,5 × 4^1,5 = 2 × 8 = 16 = 4². |
| maths-tc:ch10:banque:097 | Placement à 21 % par an présenté comme réaliste. | Ajout de « (taux fictif) » dans l'énoncé, comme en 107 et 110 et dans le cours. |
| maths-tc:ch10:banque:100 | Placement à 44 % par an présenté comme réaliste. | Ajout de « (taux fictif) ». |
| maths-tc:ch10:banque:101 | Placement à 21 % par an présenté comme réaliste. | Ajout de « (taux fictif) ». |
| maths-tc:ch10:banque:118 | L'explication disait que 10 ans « correspondrait » aux intérêts simples, sans calcul (et à 10 ans le capital atteint 6 000 € sans le dépasser). | Explication précisée : 3 000 + 10 × 300 = 6 000, modèle des intérêts simples, qui n'est pas celui de l'énoncé. |

Aucune bonne réponse n'a changé. Les autres taux « ronds » (hausses de prix ou de loyer de 21 %, 44 %, 69 % en deux ans) décrivent des situations hypothétiques sans prétendre à des données réelles : laissés tels quels. Toutes les valeurs non calculables de tête sont fournies dans l'énoncé (√1,2 ≈ 1,095 ; 1,62^(1/4) ≈ 1,128 ; 0,5^0,5 ≈ 0,707 ou 0,71 ; 1,06^(1/12) ≈ 1,0049 ; 1,1⁷, 1,1⁸, 1,2⁴, 0,8⁴, 1,07¹⁰ ; 2^(1/3) ≈ 1,26). Les réponses courtes ont des valeurs exactes (aucune marge nécessaire) et la consigne de forme est dans l'énoncé.

## Texte du cours

Aucune erreur mathématique. Une correction typographique dans `chapitres/ch10.json` et `cours-ch10.json` : double espace avant le deux-points dans la légende de la première figure (« (en rouge)  : » devient « (en rouge) : » avec une seule espace insécable).

Remarque sans correction : le programme Python de la section « seuils » utilise des espaces insécables (avant « : » et pour l'indentation) ; c'est un affichage, mais un élève qui le copierait tel quel dans un éditeur Python obtiendrait une erreur de syntaxe.

## Questions laissées à relire

Aucune.

## Contrôles

- `pilote.ts verifier 10` : « Banque du chapitre 10 conforme : 150 questions. »
- `pilote.ts cours` : 1 chapitre, 30 352 octets ; couleur #3730a3 acceptée (contraste 9,93:1) ; ch10, 8 sections ; nettoyage HTML : rien n'est retiré ; import à blanc construit (29 982 octets), aucune base contactée.
- `comparer.py 10` après correction : 150 concordantes, 0 écart.
