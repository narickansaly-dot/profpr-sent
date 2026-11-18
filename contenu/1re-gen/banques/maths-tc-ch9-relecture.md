# Relecture de la banque du chapitre 9 de mathématiques (tronc commun, 1re)

## Méthode

- Résolution à l'aveugle des 150 questions à partir de l'export sans réponses (`masquer.py 9`), sans ouvrir la banque ni le chapitre.
- Recalcul de chaque question chiffrée dans un script Python (`fractions.Fraction`, fonction de seuil par termes successifs), y compris les vrai/faux et les QCM à réponses multiples.
- Comparaison automatique (`comparer.py 9`), puis relecture complète de la banque (énoncés, propositions, réponses, explications, variantes des réponses courtes, typographie, répartition des bonnes réponses) et du texte du cours (sections, tableaux de puissances, figure SVG, automatismes, résumé, « À retenir »).

## Résultat de la comparaison à l'aveugle

- 150 concordances sur 150 au premier passage, 0 écart.
- Points notés pendant la phase à l'aveugle, levés à la relecture : 017 accepte bien « 1/5 » en plus de 0,2 (tolérant, conservé) ; 106 (102,4 mm ≈ 10 cm) et 107 (2 % de 50 000 = 1 000, piège voulu) sont sans ambiguïté ; 130 se raisonne par paliers de 4 h (16 h), comme le cours.

## Questions corrigées

| Source | Problème | Décision |
|---|---|---|
| (aucune) | | |

Vérifications faites sans constat d'erreur : premier rang (u(0) ou u(1)) toujours précisé ; problèmes de seuil à une seule lecture (sens strict « dépasse » / « moins de » explicite, valeurs de puissances fournies quand nécessaire) ; explications justes et montrant le calcul ; distracteurs indéfendables ; tout est faisable sans calculatrice ; espaces insécables avant « : ; ! ? » ; bonnes réponses des QCM uniques réparties 19/19/19/18 ; recoupements avec le chapitre 1 (coefficients multiplicateurs, puissances) limités aux automatismes.

## Texte du cours

Aucune correction. Valeurs contrôlées : tableau des puissances (dont 3¹⁰ = 59 049, 1,1⁵ ≈ 1,61, 1,1¹⁰ ≈ 2,59), exemples résolus (9 600 bactéries, 270 points, 1 102,50 €, 16 200 €, 16,2 mg, 125 noyaux, aires de Sierpinski 48/36/27 cm², rumeur 128), tableau linéaire/exponentiel et hausses de B (20 ; 24 ; 28,8 ; 34,56), seuils (4 demi-vies, 8 ans, programme Python qui affiche 8), coordonnées des points de la figure (u = 2ⁿ et v = 32 × 0,5ⁿ), automatismes.

## Questions laissées à relire

Aucune.

## Contrôles

- `verifier 9` : « Banque du chapitre 9 conforme : 150 questions. »
- `cours` : 1 chapitre, 26 472 octets ; contraste accepté ; nettoyage HTML : rien n'est retiré ; import à blanc construit, aucune base contactée.
- `comparer.py 9` : 150 concordantes, 0 écart, 0 sans réponse du relecteur.
