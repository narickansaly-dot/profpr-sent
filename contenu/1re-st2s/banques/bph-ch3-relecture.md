# Relecture de la banque du chapitre 3 de BPH contre le cours

Relecture des 130 questions de `bph-ch3.json` contre le texte du chapitre (`npm run banque:texte -- 3`), question par question, sans échantillonnage, et comparaison avec les 20 questions existantes du chapitre dans `bph.json` (`bph:ch3:quiz:*` et `bph:ch3:bis:*`). Critères : exactitude selon le cours, lecture unique, bonne(s) réponse(s) seules justes, explication, niveau 1re ST2S, règles du § 3 de la spec (typographie avec espace insécable vérifiée par script).

## Questions corrigées et remplacées

| Source | Problème | Décision |
|---|---|---|
| bph:ch3:banque:001 | Doublon de la 096 (cartilage non vascularisé, donc se répare mal). | Remplacée : vrai/faux (faux, difficulté 2) « le cartilage articulaire est un tissu rugueux qui freine le glissement des os ». |
| bph:ch3:banque:003 | Doublon de la 125 (le squelette compte 206 os). | Remplacée : vrai/faux (vrai, difficulté 1) sur les os, environ 15 % de la masse du corps. |
| bph:ch3:banque:006 | Même fait que la question existante `bph:ch3:bis:7` (les ostéoblastes fabriquent le cal osseux). | Remplacée : vrai/faux (vrai, difficulté 2) sur les 4 à 8 semaines d'immobilisation chez l'adulte. |
| bph:ch3:banque:009 | L'explication citait des ostéophytes absents de l'énoncé. | Corrigée : explication limitée aux indices de l'énoncé (douleur mécanique, pincement de l'interligne). |
| bph:ch3:banque:011 | Même fait que la question existante `bph:ch3:bis:4` (muscle cardiaque strié et involontaire). | Remplacée : vrai/faux (vrai, difficulté 1) sur les cellules fusiformes non striées du muscle lisse. |
| bph:ch3:banque:018 | Distracteur « Il s'étire en poussant l'os » en partie vrai (le triceps relâché est étiré) : deux lectures possibles. | Corrigée : distracteur « Il pousse sur l'os pour aider le biceps » ; explication complétée (« un muscle ne peut que tirer »). |
| bph:ch3:banque:020 | Réponse acceptée « 3 500 » avec séparateur de milliers, contraire au guide des auteurs (partie 3). | Corrigée : « 3 500 » retirée ; l'énoncé demande d'écrire le nombre sans espace. |
| bph:ch3:banque:028 | Variante « estrogène » (singulier) absente alors que « œstrogène » et « oestrogène » y sont. | Corrigée : variante ajoutée. |
| bph:ch3:banque:036 | Distracteur « Une rupture du tendon d'Achille » hors du cours. | Corrigée : distracteur « Une fracture ouverte de la cheville », pris dans le cours. |
| bph:ch3:banque:041 | Distracteur « Le repompage du calcium par le réticulum » scientifiquement juste aussi (le repompage consomme de l'ATP) : deux bonnes réponses possibles. | Corrigée : distracteur « Le démasquage des sites de fixation de l'actine » (assuré par le calcium selon le cours) ; explication complétée. |
| bph:ch3:banque:050 | Distracteur inventé « L'hydrolyse du glucose avec O2 », qui décrit en fait la respiration cellulaire. | Corrigée : distracteur « Le stock d'ATP du muscle » (2 à 3 s selon le cours) ; explication complétée. |
| bph:ch3:banque:055 | Doublon de la 018 (le triceps se relâche quand le biceps se contracte). | Remplacée : vrai/faux (faux, difficulté 2) « un muscle peut aussi bien pousser que tirer sur un os ». |
| bph:ch3:banque:063 | « Pendant combien de temps le muscle stocke-t-il de l'ATP ? » : deux lectures (durée de stockage ou durée d'effort). | Corrigée : « Le stock d'ATP du muscle suffit pour combien de temps d'effort ? » |
| bph:ch3:banque:069 | Difficulté 3 pour un rappel direct du cours (fermentation lactique anaérobie). | Corrigée : difficulté 3 → 2. |
| bph:ch3:banque:075 | Énoncé mal construit (« dans quel type de muscle se contractent la paroi… »). | Corrigée : « Quel type de muscle forme la paroi du tube digestif et celle de la vessie ? » |
| bph:ch3:banque:076 | Doublon de la 100 (la membrane synoviale sécrète le liquide synovial). | Remplacée : vrai/faux (vrai, difficulté 1) « la symphyse pubienne est une articulation semi-mobile ». |
| bph:ch3:banque:080 | « fabriqué par les ostéoblastes » orientait vers « osseux » et redoublait la 006 d'origine et `bis:7`. | Corrigée : « Lors de la consolidation d'une fracture, quel cal se forme après le cal fibreux ? » ; explication reprise. |
| bph:ch3:banque:087 | Doublon de la 063 (stock d'ATP pour 2 à 3 s). | Remplacée : vrai/faux (vrai, difficulté 1) sur la sudation qui évacue la chaleur pendant l'effort. |
| bph:ch3:banque:098 | « premiers signes entre 3 et 5 ans » inexact : le retard de la marche, cité en premier par le cours, apparaît avant. | Corrigée : la question porte sur l'âge des chutes et des difficultés à se relever ; explication reprise. |
| bph:ch3:banque:114 | Même idée que `bph:ch3:quiz:5` (calcium et ATP indispensables) ; « consomme du calcium » est en outre discutable scientifiquement (le calcium est repompé, pas consommé). | Remplacée : vrai/faux (vrai, difficulté 1) « le muscle squelettique se contracte sur ordre du système nerveux ». |
| bph:ch3:banque:120 | Reformulation proche de `bph:ch3:quiz:9` (chromosome X, garçons, distracteur chromosome Y). | Remplacée : qcm_multiple (difficulté 2) sur la prise en charge (kinésithérapie, corticoïdes, assistance respiratoire ; distracteur ostéosynthèse). |
| bph:ch3:banque:123 | Même fait que `bph:ch3:bis:2` et `quiz:2` (le tendon relie un muscle à un os, le ligament deux os), déjà repris par la 005. | Remplacée : vrai/faux (faux, difficulté 2) « une articulation est la zone de jonction entre un muscle et un os ». |
| bph:ch3:banque:126 | Doublon de la 065 (le canal médullaire est dans la diaphyse). | Remplacée : vrai/faux (vrai, difficulté 2) « la diaphyse d'un os long est en os compact ». |

## Totaux

- Gardées sans changement : 107
- Corrigées : 12 (009, 018, 020, 028, 036, 041, 050, 063, 069, 075, 080, 098)
- Remplacées : 11 (001, 003, 006, 011, 055, 076, 087, 114, 120, 123, 126)

Répartition après relecture : types 65 / 26 / 26 / 13 (vrai/faux : 13 vrais, 13 faux) ; difficultés 53 / 52 / 25 ; `npm run banque:verifier -- 3` : « Banque du chapitre 3 conforme : 130 questions. »

Points signalés par la rédaction et jugés acceptables :

- 016 et 037 (alitement, entraînement en charge) : déduction directe de « les contraintes mécaniques stimulent les ostéoblastes ».
- 097 (sans calcium libéré) : déduction directe de « le calcium démasque les sites de fixation de l'actine ».
- 036 (rupture de ligament, donc instabilité) : rôle des ligaments et signe « instabilité » de l'entorse.
- 088 et 122 : lien entre la section « énergie » et l'adaptation à l'effort, explicite dans le cours (« apporter plus d'O2 et de glucose aux muscles »).
- Distracteurs hors texte gardés car manifestement faux : « moelle jaune » (004), « photosynthèse » (092, déjà utilisée dans `quiz:6`), « globule rouge » (127), « Il ne contient aucune cellule » (096).
- 112 : « Le tabagisme » présenté comme ne favorisant pas l'équilibre de l'os ; le cours le cite comme facteur de risque d'ostéoporose.

## Points de doute pour l'enseignant

1. **109** : une perte de 3 cm de taille rattachée à l'ostéoporose est une déduction de « vertèbres avec perte de taille » ; le cours ne décrit pas de tassement sans fracture.
2. **056** : l'ordre « chutes, perte de la marche, atteinte respiratoire et cardiaque » suit l'ordre du texte ; seul « puis » devant la perte de la marche est explicite.
3. **054** : « les stries Z se rapprochent » et « les filaments ne raccourcissent pas » se déduisent de la figure et de la théorie du glissement ; la question reste proche de `bph:ch3:quiz:4`.
4. **024** : « les voies rapides fournissent l'ATP en attendant que la respiration cellulaire prenne le relais » relie deux lignes du tableau sans que le cours énonce le relais.
5. **116** : « L'omoplate » est exclue du squelette axial ; le cours dit que les ceintures sont appendiculaires sans préciser que l'omoplate appartient à une ceinture. La bonne réponse (cage thoracique) reste sans ambiguïté.
6. **Redites d'idée** : 014 et 052 (cartilages de conjugaison jusqu'à la fin de la puberté) ; 029 et 039 (traitement d'une fracture) ; 042 et 053 (CPK) ; 018, 034 et 104 (biceps et triceps) ; 038, 066 et 085 (CRP et VS) ; 099 et `quiz:0` (rôle de l'ostéoclaste). Les énoncés diffèrent, mais le contenu se répète ; le chapitre offre peu de faits distincts sur l'os long.
7. **Difficultés** : 039, 044 et 053 sont cotées 3 pour un rappel direct (QCM à trois bonnes réponses) ; gardées pour respecter les quotas.
