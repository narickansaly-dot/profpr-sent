# Relecture de la banque du chapitre 14 de SVT (1re) contre le cours

Banque `svt-ch14.json` : 150 questions sur le chapitre 14 (« Cancers et résistance aux antibiotiques »).

## Méthode

1. Rédaction du chapitre puis de la banque, en quatre parties fusionnées par script.
2. Auto-relecture de chaque question contre le texte brut du chapitre : une seule bonne réponse, information présente dans le texte, aucune question qui donne la réponse d'une autre (recherche automatique des réponses courtes citées dans d'autres énoncés ou propositions). Une dizaine de questions ont été reformulées à ce stade, et des distracteurs ont été allongés pour réduire le biais de longueur.
3. Relecture indépendante : un sous-agent a résolu les 150 questions avec le seul texte du chapitre, sans voir les réponses attendues.
4. Comparaison automatique de ses réponses avec les réponses attendues, puis arbitrage de chaque écart et de chaque remarque.

## Relecture indépendante

Taux d'accord initial : 150/150 (aucun écart). Quatorze remarques ont été traitées.

| Source | Écart ou remarque | Décision |
|---|---|---|
| svt:ch14:banque:010 | Le chapitre n'affirme l'origine à partir d'une seule cellule que pour le cancer, pas pour toute tumeur (bénigne comprise). | Énoncé précisé : « Les cellules d'une tumeur maligne (un cancer) sont toutes : ». Explication reformulée d'après la définition du cancer. |
| svt:ch14:banque:024 | Piège des effectifs différents (10⁶ et 10⁷) : la correction doit l'expliquer. | Explication détaillée : conversion 2 pour 10⁶ = 20 pour 10⁷, rapport 80 / 20 = 4, et pourquoi 40 est faux. |
| svt:ch14:banque:038 | 60 % est une valeur prise dans la fourchette 40 à 70 % du texte ; calcul juste. | Gardée sans modification : la valeur est donnée dans l'énoncé. |
| svt:ch14:banque:063 | Les positions identiques sont aussi un argument du texte ; pas d'ambiguïté réelle. | Gardée : seule la proposition retenue montre que des colonies jamais exposées étaient résistantes ; les autres propositions sont fausses. |
| svt:ch14:banque:090 | S = 15 mm est à la limite des valeurs critiques : piège à expliquer. | Explication détaillée : « résistante » vaut seulement en dessous de 15 mm, et 15 mm est sous les 20 mm du seuil « sensible », donc S est intermédiaire. |
| svt:ch14:banque:112 | Faux, car 8 % est la part de l'alcool ; le tabac cause environ un cancer sur cinq. | Accord ; aucune modification. |
| svt:ch14:banque:131 | Piège sur l'exposant (10 et non 100). | Explication complétée : 10⁹ × 10⁻⁸ = 10⁹ / 10⁸ = 10. |
| svt:ch14:banque:140 | Accepter « benzo[a]pyrène », « benzo(a)pyrène » et « benzopyrène ». | Ces variantes étaient déjà acceptées ; ajout des formes sans accent (« benzo[a]pyrene », « benzo(a)pyrene »). |
| svt:ch14:banque:141 | Accepter « 0,25 » et « 1 sur 4 ». | Déjà acceptées (avec « 1/4 », « un quart », « 25 % »). Aucune modification. |
| svt:ch14:banque:143 | Accepter « autoclave » au singulier comme au pluriel. | Ajout de « autoclaves » et « des autoclaves ». |
| svt:ch14:banque:145 | Accepter « Pénicillium » et « pénicillium ». | Déjà acceptées (la comparaison ignore les accents et la casse). Aucune modification. |
| svt:ch14:banque:148 | Calcul 2⁶ = 64 non écrit tel quel, mais raisonnement identique à celui du texte (2³⁰). | Explication détaillée génération par génération, avec le renvoi au calcul 2³⁰ ≈ 10⁹ du chapitre. |
| svt:ch14:banque:149 | Accepter « Une seule santé » avec ou sans article ni guillemets, et « One Health ». | Variantes ajoutées : « seule santé », « la seule santé », « one health » (en plus des formes déjà acceptées). |
| svt:ch14:banque:150 | Le texte écrit « environ 5 500 » : accepter « environ 5500 ». | Variante « environ 5500 » ajoutée ; la marge numérique de 500 est gardée pour les réponses chiffrées seules. |

## Totaux

- 150 questions ; types 75 qcm_unique / 30 qcm_multiple / 30 vrai_faux / 15 reponse_courte.
- Vrai/faux : 15 vrais, 15 faux.
- Difficultés : 60 (niveau 1), 60 (niveau 2), 30 (niveau 3).
- Biais de longueur : la bonne réponse est la plus longue dans 20 qcm_unique sur 75.
- Contrôle (`verifierBanque`) : « Banque du chapitre 14 conforme : 150 questions. »

## Questions laissées à relire

Aucune question ne reste douteuse : les questions modifiées ont une réponse unique, écrite dans le chapitre ou calculable à partir de lui. Point à signaler à l'enseignant : les chiffres de santé publique (environ 400 000 cas et 150 000 décès de cancer par an en France ; décès dus à l'antibiorésistance estimés pour 2015 et 2019 ; part des SARM) sont des ordres de grandeur datés, à actualiser.

À relire : aucune
