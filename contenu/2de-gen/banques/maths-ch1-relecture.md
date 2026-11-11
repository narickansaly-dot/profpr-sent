# Relecture de la banque du chapitre 1 de mathématiques (2de) contre le cours

Relecture des 150 questions de `maths-ch1.json` contre le texte du chapitre « Nombres réels, intervalles et valeur absolue », question par question. Critères : exactitude selon le cours seul, une seule lecture possible, bonne(s) réponse(s) seules justes, explication qui justifie, niveau seconde, aucune notion hors du chapitre, variantes des réponses courtes (virgule et point décimal), règles du guide des auteurs (pas de séparateur de milliers, marge seulement sur un nombre seul), typographie (espace insécable avant « : ; ! ? »), tutoiement.

Toutes les questions sont au statut `a_relire`. Les sources vont de `maths-2de:ch1:banque:001` à `150`.

## Répartition

- Types : 75 `qcm_unique`, 30 `qcm_multiple`, 30 `vrai_faux` (15 vrais, 15 faux), 15 `reponse_courte`.
- Difficultés : 60 / 60 / 30.
- Notions (7) : Ensembles de nombres ; Appartenance et inclusion ; Rationnels et irrationnels ; Intervalles ; Intersection et réunion ; Valeur absolue et distance ; Encadrements et arrondis.

## Corrections faites pendant la rédaction

- Neuf énoncés construits sur le même modèle (« Quel est le plus petit des ensembles … qui contient x ? ») dépassaient le seuil de similarité de 0,8 : quatre ont été retirés, les autres reformulés. Les symboles (∈, ⊂, ∪, ∩, ⩽, |…|) étant ignorés par le contrôle de similarité, les énoncés qui ne différaient que par un symbole (« Comment se lit le symbole ∈ / ⊂ / ∪ ? ») ont reçu un contexte propre.
- Une question sur « 1 − √3 » demandait seulement l'ensemble ℝ ; elle porte désormais sur la justification (sinon √3 serait rationnel), plus utile.

## Points de doute

| Source (énoncé) | Doute | Proposition |
| --- | --- | --- |
| « Que vaut ]−∞ ; 2] ∩ [2 ; +∞[ ? » | La bonne réponse « {2} » utilise la notation d'un ensemble à un élément, que le cours n'écrit pas explicitement pour un réel (il l'utilise pour E = {1 ; 2 ; 3 ; 4}). | Garder, ou ajouter une phrase au cours sur la notation {a}. |
| « Pourquoi 1 − √3 n'est-il pas un nombre rationnel ? » | S'appuie sur l'irrationalité de √3, affirmée dans le cours mais non démontrée (seule celle de √2 est au programme). | Garder : le cours l'énonce comme un fait. |
| Questions sur l'arrondi d'un nombre qui se termine par 5 (« 7,25 au dixième », « 4,567 ») | La règle « 5 ou plus : on arrondit au-dessus » est celle du cours ; certains logiciels arrondissent autrement (arrondi au pair). | Garder ; la règle du cours est celle du collège. |
| « Quel décimal… à moins de 0,01 de 5/7 ≈ 0,714 » | Calcul fin (0,72 est à 0,0057 de 5/7) : cotée 3, la difficulté se défend. | Garder. |
| « Combien de décimaux ayant au plus une décimale… » | Question retirée (ambiguë : 1,10 a « une » décimale significative). | — |
| Réponses courtes décimales (« 0,375 », « 7,3 », « 1,414 ») | Comparaison numérique : « 0.375 » et « 0,375 » sont acceptés ; « ,375 » ne l'est pas. | Acceptable. |
| « Le nombre 0,0070 a deux chiffres significatifs. » | Le zéro final est significatif selon la définition du cours ; certains élèves l'ignorent. C'est l'intérêt de la question. | Garder. |

## Texte du cours

- La démonstration « 1/3 n'est pas décimal » utilise la somme des chiffres de 10ⁿ (critère de divisibilité par 3, vu au collège) et la décomposition 10ⁿ = 2ⁿ × 5ⁿ : à vérifier que le critère de divisibilité est bien acquis.
- La démonstration de l'irrationalité de √2 renvoie au chapitre 2 (« le carré d'un impair est impair ») : ordre des chapitres à garder.
- Le schéma des ensembles emboîtés et les droites graduées sont en SVG ; les crochets des intervalles sont dessinés comme du texte.
