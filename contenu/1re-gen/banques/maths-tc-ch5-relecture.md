# Relecture de la banque du chapitre 5 de mathématiques (tronc commun, 1re)

Chapitre : « Probabilités conditionnelles et indépendance ». Banque : `maths-tc-ch5.json` (150 questions).

## Méthode

1. Résolution à l'aveugle des 150 questions à partir des énoncés et propositions seuls (réponses et explications masquées).
2. Chaque calcul refait dans un script Python, avec `fractions.Fraction` pour les probabilités et les fractions (un calcul commenté par source).
3. Comparaison automatique de mes réponses avec celles de la banque.
4. Relecture complète de toutes les questions, réponses, explications, réponses acceptées et de la typographie, puis relecture du texte du cours (toutes sections, exemples et valeurs numériques recalculés).

## Résultat de la comparaison à l'aveugle

- Concordances au premier passage : **150 sur 150**.
- Écarts : **0**.

Les pièges classiques sont bien construits et à une seule lecture : inversion P_A(B) / P_B(A), tirages avec ou sans remise, somme ou moyenne des taux au lieu des probabilités totales, sensibilité confondue avec P_T(M), confusion entre incompatibles et indépendants, Monty Hall (l'énoncé précise que l'animateur sait où est la voiture et ouvre toujours une porte à chèvre). Aucune question n'exige de calculatrice.

## Questions corrigées

| Source | Problème | Décision |
|---|---|---|
| maths-tc:ch5:banque:132 | L'énoncé demande P_B(A) sans garantir P(B) ≠ 0, alors que le cours définit l'indépendance par P_B(A) = P(A) « avec P(B) ≠ 0 » (sinon P_B(A) n'existe pas). | Énoncé complété : « Les événements A et B sont indépendants, avec P(B) ≠ 0 et P(A) = 0,3. » Réponse inchangée (0,3). |

## Texte du cours

Aucune erreur mathématique. Valeurs vérifiées : exemple du dé (P(A ∪ B) = 2/3), club (0,25), tableau croisé (0,55 ; 0,35 ; 7/11 ≈ 0,64 ; 7/12 ≈ 0,58), arbre (P(R) = 0,14, P_R(C) = 6/7 ≈ 0,86), test de dépistage (tableau 190/10/980/8 820, totaux 1 170 et 8 830, P_T(M) ≈ 0,16), indépendance (0,4 × 0,3 = 0,12 ; contre-exemple 0,6 et 0,64), pièce et dé (1/12), Monty Hall (1/3 et 2/3), automatismes (12 calculs). Aucune correction.

## Questions laissées à relire

Aucune.

## Contrôles

- `pilote.ts verifier 5` : « Banque du chapitre 5 conforme : 150 questions. »
- `pilote.ts cours` : « Cours maths-tc-1re-gen (GEN, 1re, Mathématiques (tronc commun)) : 1 chapitres, 21420 octets (3 Mo au plus). Couleur #3730a3 : contraste 9.93:1 avec le blanc, acceptée. ch5 Probabilités conditionnelles : 8 sections, 0 questions. Nettoyage HTML : rien n'est retiré. Import à blanc : charge utile construite (20910 octets) ; aucune base contactée. »
- `comparer.py 5` après correction : 150 concordantes, 0 écart.
