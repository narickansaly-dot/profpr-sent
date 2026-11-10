# Relecture de la banque du chapitre 1 de BPH contre le cours

Relecture des 130 questions de `bph-ch1.json` contre le texte du chapitre (`npm run banque:texte -- 1`), question par question, sans échantillonnage. Critères : exactitude selon le cours, lecture unique, bonne(s) réponse(s) seules justes, explication, niveau 1re ST2S, règles du § 3 de la spec (typographie avec espace insécable vérifiée par script).

## Questions corrigées et remplacées

| Source | Problème | Décision |
|---|---|---|
| bph:ch1:banque:003 | La bonne réponse « La pompe Na+/K+, qui consomme de l'ATP » reprenait la définition du transport actif : réponse trop facile à repérer (et la plus longue). Difficulté 3 non justifiée. | Corrigée : bonne réponse réduite à « La pompe Na+/K+ » ; difficulté 3 → 2. |
| bph:ch1:banque:005 | L'énoncé citait « le transport actif du sodium et du potassium », ce qui livrait une partie de la réponse. Variantes de notation manquantes. | Corrigée : énoncé reformulé sans les ions ; variantes ajoutées (« pompe Na+ / K+ », « pompe Na+K+ », « pompe Na/K »). |
| bph:ch1:banque:006 | Doublon de la 063 (« plus petit niveau capable de vivre seul »), même idée en vrai/faux. | Remplacée : vrai/faux (vrai, difficulté 1) sur la place de l'appareil entre l'organe et l'organisme. |
| bph:ch1:banque:021 | Deux lectures possibles : « Inférieure à 100/60 mmHg » désigne aussi des valeurs inférieures à 140/90, donc normales selon le cours. | Corrigée : la question porte sur le seuil de l'hypertension artérielle (140/90 mmHg), avec des valeurs seules comme distracteurs. |
| bph:ch1:banque:035 | Doublon de la 021 (pression artérielle inférieure à 140/90) et difficulté 3 pour une lecture directe du tableau. | Remplacée : vrai/faux (vrai, difficulté 3) sur le milieu intérieur, environ le tiers de l'eau de l'organisme (14 L sur 42 L). |
| bph:ch1:banque:068 | Difficulté : l'hypoglycémie est déduite du tableau (le cours ne dit pas « inférieure à 0,70 g/L »). | Corrigée : difficulté 2 → 3, pour compenser les baisses de la 003 et de la 085. |
| bph:ch1:banque:075 | Réponse lisible dans l'énoncé : « communication hormonale » → « une hormone ». Distracteur « Un nerf » qui n'est pas un messager. | Corrigée : énoncé « sécrété par une glande endocrine puis transporté par le sang » ; distracteur remplacé par « Une enzyme digestive » ; explication reprise. |
| bph:ch1:banque:085 | Difficulté 3 pour la définition de l'osmose, déjà demandée en 048. | Corrigée : difficulté 3 → 2. |
| bph:ch1:banque:107 | Réponses acceptées « 30 000 » et « 30 000 milliards » avec séparateur de milliers, contraire au guide des auteurs (partie 3). | Corrigée : réponses « 30000 » et « 30000 milliards » ; l'énoncé demande d'écrire sans espace entre les chiffres. |
| bph:ch1:banque:109 | Distracteur « Il est préparé avec de l'eau pure » défendable comme vrai (le NaCl est dissous dans de l'eau). | Corrigée : distracteur remplacé par « Il contient 9 g/L de glucose » ; explication complétée. |
| bph:ch1:banque:113 | Variantes au pluriel absentes. | Corrigée : ajout de « tissus conjonctifs » et « conjonctifs ». |
| bph:ch1:banque:121 | Reformulation proche de la 025 (O2 et CO2 par diffusion simple, mêmes distracteurs). | Remplacée : qcm_unique (difficulté 1) sur le nom de l'éclatement des hématies (hémolyse), avec l'osmose comme distracteur. |

## Totaux

- Gardées sans changement : 118
- Corrigées : 9 (003, 005, 021, 068, 075, 085, 107, 109, 113)
- Remplacées : 3 (006, 035, 121)

Répartition après relecture : types 65 / 26 / 26 / 13 (vrai/faux : 14 vrais, 12 faux) ; difficultés 51 / 55 / 24 ; `npm run banque:verifier -- 1` : « Banque du chapitre 1 conforme : 130 questions. »

Points signalés par la rédaction et jugés acceptables :

- 050 (acidose, alcalose) : lecture directe du tableau des constantes.
- 034 et 096 : les distracteurs « plan ventral » et « plan dorsal » n'existent pas dans le cours, mais « ventral » et « dorsal » y figurent comme directions ; ils restent manifestement faux.
- 049 : « une couche de cartilage » est faux pour l'estomac selon le cours, qui cite le cartilage comme tissu conjonctif ailleurs.

## Points de doute pour l'enseignant

1. **068** : « hypoglycémie » pour une glycémie à jeun inférieure à 0,70 g/L est une déduction (préfixe hypo- et borne basse du tableau) ; le cours ne fait pas lui-même le lien.
2. **087** : l'ordre épiderme, derme, hypoderme est déduit de « posé sur » et « doublé de » ; à confirmer si tu veux l'exiger dès le chapitre 1.
3. **089 et 091** : les deux justifications (« l'eau pure ferait éclater les hématies » ; on demande une grossesse car « les rayonnements ionisants peuvent abîmer l'ADN ») relient deux phrases du cours sans que celui-ci énonce le lien.
4. **061 et 082** : sécrétion d'hormone → exocytose et phagocytose → endocytose. Le cours donne ces exemples ensemble pour « endocytose et exocytose » ; l'attribution à l'une ou l'autre se déduit de « entrée ou sortie ».
5. **005** : réponses acceptées « Na+/K+ » seul et « pompe Na/K » (sans les signes +) ; à resserrer si tu veux exiger la notation exacte.
6. **Redites d'idée** : 093, 099 et 107 portent toutes sur le nombre de cellules d'un adulte ; 001, 019 et 120 sur les liquides du milieu intérieur ; 002 et 049 sur les tissus de l'estomac. Les énoncés diffèrent, mais le contenu se répète.
7. **Difficultés** : 047 et 110 sont cotées 3 pour un rappel direct du cours ; gardées pour respecter les quotas, à baisser si la répartition le permet.
