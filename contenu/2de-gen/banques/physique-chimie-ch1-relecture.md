# Relecture de la banque du chapitre 1 de physique-chimie (2de) contre le cours

Relecture des 150 questions de `physique-chimie-ch1.json` contre le texte du chapitre « Mesure et incertitudes » (`pc.ts texte 1`), question par question, sans échantillonnage. Critères : exactitude scientifique et conformité au cours, avec chaque calcul refait (valeur, unité, arrondi, marge) ; lecture unique ; bonne(s) réponse(s) seules justes et distracteurs plausibles mais faux ; explication juste et suffisante ; niveau 2de ; aucune donnée extérieure au chapitre ni question sur une donnée fictive du cours ; variantes et marges des réponses courtes ; reformulations proches, réponse lisible dans l'énoncé, bonne réponse repérable par sa longueur ou parce qu'elle recopie une phrase du cours.

## Questions corrigées et remplacées

| Source | Problème | Décision |
|---|---|---|
| physique-chimie-2de:ch1:banque:014 | Bonne réponse recopiant mot pour mot la définition du cours, nettement plus longue que les distracteurs. | Corrigée : bonne réponse reformulée (« la dispersion des valeurs obtenues en répétant la même mesure »), distracteurs allongés. |
| physique-chimie-2de:ch1:banque:020 | Distracteurs non plausibles (« le nom de l'élève », « la couleur du chronomètre »). | Corrigée : remplacés par « la valeur de référence de la grandeur » et « le nombre de chiffres significatifs du résultat » ; explication complétée. |
| physique-chimie-2de:ch1:banque:033 | Distracteurs non plausibles (« l'unité de l'instrument », « le nom de l'expérimentateur »). | Corrigée : remplacés par « la valeur de référence de la grandeur » et « la cause de la dispersion des mesures ». |
| physique-chimie-2de:ch1:banque:048 | Bonne réponse repérable par sa forme (seule à porter une parenthèse avec les notations sx et σₙ₋₁). | Corrigée : bonne réponse « Celui qui divise par N − 1 », distracteurs de longueur comparable. |
| physique-chimie-2de:ch1:banque:056 | Bonne réponse recopiant la définition du cours, deux fois plus longue que les distracteurs. | Corrigée : bonne réponse reformulée, distracteurs allongés. |
| physique-chimie-2de:ch1:banque:073 | « Arrondie au centième » : 0,063 s donne 0,06 s en arrondi usuel, mais 0,07 s si l'élève applique la règle du cours (arrondir l'incertitude-type vers le haut). Deux réponses défendables. | Corrigée : « arrondie au millième », réponse `0,063`, marge 0,001 ; explication avec √10 ≈ 3,162. |
| physique-chimie-2de:ch1:banque:088 | Explication inexacte : « les chiffres 2, 5 et 0 de la partie décimale » (2 n'est pas dans la partie décimale). | Corrigée : « les chiffres 2, 5 et 0 du nombre 2,50 ». |
| physique-chimie-2de:ch1:banque:124 | Bonne réponse recopiant la définition du cours, la plus longue. | Corrigée : bonne réponse resserrée, distracteurs allongés. |
| physique-chimie-2de:ch1:banque:141 | Redite de la 129 : même question (nombre d'incertitudes-types de l'écart) et même réponse, 6. | Corrigée : référence 7,45 s, écart 0,25 s, réponse 5. |
| physique-chimie-2de:ch1:banque:142 | Variante manquante (phrase « il est mal étalonné »). | Corrigée : variante ajoutée. |

## Totaux

- Gardées sans changement : 140
- Corrigées : 10 (014, 020, 033, 048, 056, 073, 088, 124, 141, 142)
- Remplacées : 0

Répartition après relecture : types 75 / 30 / 30 / 15 (vrai/faux : 14 vrais, 16 faux ; qcm_multiple : 24 à 2 bonnes réponses, 6 à 3) ; difficultés 59 / 61 / 30 ; bonne réponse des qcm_unique en position 0 à 3 : 19 / 19 / 19 / 18. Vérificateur (`pc.ts verifier 1`) : « Banque du chapitre 1 conforme : 150 questions. »

Points jugés acceptables :

- Tous les calculs ont été refaits (moyennes 039, 040, 041, 042, 045, 146 ; incertitudes-types 058 à 061, 063, 066, 067, 070, 072, 144, 149 ; arrondis 092, 093, 102, 113, 116, 117, 119, 123, 148 ; écarts 127, 128, 129, 137) : aucun n'est faux.
- 143 reprend les données de l'exemple de la vitesse (12,0 m en 4,1 s) : les données sont dans l'énoncé et la question porte sur la méthode d'arrondi, ce que la consigne permet.
- 125 porte sur 100 °C, valeur de référence réelle donnée par le cours, non fictive.
- 102 : un élève qui répond « 4,80 » est compté juste par la comparaison numérique, bien que la question demande le bon nombre de chiffres significatifs ; limite de l'outil, sans conséquence grave.
- 076, 090, 111 et 127 : bonne réponse un peu plus longue que les distracteurs, mais la longueur tient au contenu (capteur, précision au centième, double consigne d'arrondi, justification chiffrée).

## Points de doute pour l'enseignant

1. **050** : « Laquelle est la moins dispersée ? » attend la série A (σ = 0,2 s pour 14 s) plutôt que « les deux, car elles ont le même σ ». La réponse suit le cours (« compare l'écart-type aux valeurs mesurées »), mais un élève peut défendre que la dispersion absolue est la même ; à reformuler en « relativement aux valeurs mesurées » si tu le juges utile.
2. **127** : le distracteur « Non, car l'écart de 0,08 s est supérieur à l'incertitude-type » s'appuie sur l'exemple du cours (écart plus petit que u) ; la bonne réponse repose sur la règle « pas plus de deux incertitudes-types environ ». Le mot « environ » laisse une petite marge d'interprétation, à garder en tête.
3. **Redites d'idée** : 009, 010, 011 et 013 sur les mesures indépendantes ; 018, 022 et 024 sur la variabilité qui n'est pas une erreur ; 001 et 005 sur grandeur / instrument / unité ; 026, 036 et 037 sur la hauteur de barre (effectif) ; 031, 032 et 035 sur la forme de l'histogramme ; 049, 064 et 144 sur σ qui ne change pas avec N ; 061, 066 et 070 sur « 4 fois plus de mesures, u divisée par 2 » ; 077, 078, 081, 085 et 145 sur les dix oscillations ; 128 et 139 sur l'écart de douze incertitudes-types ; 131 et 135 sur les sources d'erreur de l'ébullition. Les formes diffèrent, mais le chapitre offre peu de faits distincts pour 150 questions.
4. **Difficultés** : 070 (vrai/faux, 100 au lieu de 25 mesures) et 101 (compter les chiffres significatifs de 0,0305 m) sont cotées 3 pour une application directe ; 003 (unité SI de la température) est cotée 2 pour un rappel. Gardées pour respecter les quotas.
5. **Distracteurs faibles restants** : 043 (« toujours égale à la plus petite valeur »), 076 (« un chronomètre plus grand »), 150 (« le nom de l'expérimentateur ») ; faciles à écarter, sans fausser la question.
