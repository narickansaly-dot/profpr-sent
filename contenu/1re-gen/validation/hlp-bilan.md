# Bilan : cours de HLP (humanités, littérature et philosophie), première générale

Cours `contenu/1re-gen/hlp.json` : slug `hlp-1re-gen`, filière `GEN`, niveau `1re`, matière « HLP », titre « Humanités, littérature et philosophie, première générale », couleur `#86198f` (contraste 8,24:1 avec le blanc, au-dessus du minimum de 4,5:1).

## Programme suivi

- **Texte** : arrêté du 17 janvier 2019, NOR : MENE1901578A, BO spécial n° 1 du 22 janvier 2019 ; annexe lue dans le PDF officiel (`programmes/hlp-1re.md`).
- **En vigueur en 2026-2027** : vérifié le 11 novembre 2026. Aucun arrêté de 2025 ou de 2026 ne modifie le programme de première. Seule nouveauté : la note de service du 11 septembre 2026 (NOR : MENE2622659N, BO spécial n° 4 du 17 septembre 2026) redéfinit l'**épreuve terminale** à partir de la session 2027 (interprétation littéraire ou philosophique ; essai littéraire ou philosophique). Le cours en tient compte dans la dernière section de chaque chapitre.
- **Plan** : six chapitres, un par entrée du programme (`programmes/hlp-1re-plan.md`).

## Chapitres et questions

| N° | Chapitre | Entrée | Sections | Questions | Types (U / M / V / R) | Difficultés (1 / 2 / 3) | Relecture à l'aveugle | Questions retouchées |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | L'art de la parole : naissance et règles de la rhétorique | S1, l'art de la parole | 8 | 150 | 75 / 30 / 30 / 15 | 60 / 61 / 29 | 150 / 150 | 9 |
| 2 | L'autorité de la parole : qui a le droit de dire vrai ? | S1, l'autorité de la parole | 8 | 150 | 75 / 30 / 30 / 15 | 62 / 60 / 28 | 150 / 150 | 9 |
| 3 | Les séductions de la parole : plaire, émouvoir, tromper | S1, les séductions de la parole | 8 | 150 | 75 / 30 / 30 / 15 | 60 / 61 / 29 | 150 / 150 | 11 |
| 4 | Découverte du monde et pluralité des cultures | S2, découverte du monde | 7 | 150 | 75 / 30 / 30 / 15 | 60 / 60 / 30 | 150 / 150 | 11 |
| 5 | Décrire, figurer, imaginer : représenter le monde | S2, décrire, figurer, imaginer | 7 | 150 | 75 / 30 / 30 / 15 | 60 / 61 / 29 | 150 / 150 | 9 |
| 6 | L'homme et l'animal | S2, l'homme et l'animal | 8 | 150 | 75 / 30 / 30 / 15 | 61 / 59 / 30 | 150 / 150 | 9 |
| | **Total** | | **46** | **900** | | | **900 / 900** | **58** |

**Statuts** : les 900 questions sont `valide` dans `hlp.json` ; aucune n'est laissée `a_relire`, car aucun doute réel n'est resté sans réponse après la relecture indépendante. Les doutes de forme ou de choix éditorial sont listés plus bas (points à trancher) : l'enseignant peut repasser une question en relecture depuis `/admin`.

## Comment les quiz ont été vérifiés

1. **Rédaction** : chaque banque a été écrite à partir du seul texte du chapitre, puis relue par son auteur (`banques/hlp-chN-relecture.md`, partie « Corrections faites pendant la rédaction »).
2. **Relecture indépendante à l'aveugle** : pour chaque chapitre, un relecteur distinct a reçu le texte du cours et les 150 questions **sans les réponses attendues ni les explications**, a répondu à chacune, puis une comparaison automatique a confronté ses réponses aux réponses attendues. Résultat : **aucun écart sur les 900 questions**. Le relecteur a aussi signalé ses doutes (distracteurs défendables, énoncés ambigus, forme qui trahit la réponse, variantes de réponses courtes, faits discutables) : 167 doutes au total.
3. **Corrections** : chaque doute a été tranché (corrigé ou gardé avec sa raison) dans la partie « Relecture indépendante » de chaque `-relecture.md`. Les corrections gardent la source, le type, la difficulté et la position de la bonne réponse.
4. **Statut** : comme pour BPH et STSS (commits 67d1671 et 90bd11c), les questions relues et retenues passent en `valide` ; n'aurait été laissée `a_relire` qu'une question au doute réel non levé (voir plus bas).

## Erreurs corrigées

**Dans le cours** (signalées par les relecteurs, corrigées dans `hlp.json`) :

- ch. 1 : universités médiévales « nées vers 1200 » (Bologne est traditionnellement datée de 1088) → « qui s'organisent aux XIIe et XIIIe siècles » ; « Ils prolongent les trois preuves d'Aristote » → « On peut les rapprocher » ; virgule fautive après « Quintilien (Ier siècle) ».
- ch. 2 : *eirôneia* glosé « interrogation feinte » → « dissimulation », « ignorance feinte » ; Jean de Meun « invente » Faux Semblant → « met en scène » ; le *Ménexène* présenté comme « pastiche ironique » → lecture ironique donnée comme interprétation ; Detienne « historien » → « helléniste ».
- ch. 3 : chaîne de l'inspiration dans l'*Ion* : elle part de la Muse.
- ch. 4 : Koyré, *Du monde clos à l'univers infini* (1957 en anglais, 1962 en français) ; Sepúlveda « juriste » → « humaniste et théologien » ; *Lettres persanes* : fin du règne de Louis XIV **et Régence** ; Micromégas vient « d'une planète de l'étoile Sirius » ; Montaigne a interrogé l'un des Indiens de Rouen.
- ch. 5 : Diderot « fonde » la critique d'art → « l'un des fondateurs » (La Font de Saint-Yenne publie dès 1747) ; *De pictura* : version italienne l'année suivante (1436).
- ch. 6 : tableau des critères : Rousseau « de degré pour l'entendement, de nature pour la liberté » ; Bentham : « question secondaire : seule compte la capacité de souffrir ».

**Dans les banques** (58 questions retouchées, détail dans chaque `-relecture.md`) : distracteurs défendables (logographes exclus de l'assemblée, La Mettrie comme adversaire de Descartes, « il le flatte » chez Renart…), distracteurs absurdes ou éliminables par la forme (dates invraisemblables, « dans L'Homme-machine de La Mettrie » proposé pour Voltaire), bonnes réponses repérables par leur longueur ou leur formulation, énoncés imprécis (« étapes de la préparation » qui excluait l'action ; l'Évangile de Jean écrit en grec, *verbum* étant la traduction latine), et variantes de réponses courtes ajoutées (Theut, exordium, Yahous, βάρβαρος, kósmos, ordre des Prêcheurs…).

## Validation

- **Banques** : les six fichiers `banques/hlp-chN.json` sont conformes à `verifierBanque` (quotas de STSS : 150 questions, 75 / 30 / 30 / 15, 60 / 60 / 30, tolérance ± 3) ; rapports détaillés dans `validation/hlp-chN.md`.
- **Cours** : `analyserImport` ne renvoie aucune erreur ; `nettoyerHtml` ne retire rien des 46 sections et des 6 « Je retiens » ; l'import à blanc (`versDonneesCours`) produit les données de `importer_cours`. Taille : 840 774 octets (3 Mo au plus).
- **Import réel** : non lancé (pas de base Supabase locale dans le worktree). À faire : `npm run import:contenu -- contenu/1re-gen/hlp.json`.
- **Après fusion**, relancer `verifierBanque` sur une banque déjà fusionnée signale des doublons avec les questions du chapitre (elles sont identiques) : c'est attendu, la fusion est rejouable.

## Scripts du dépôt : changements à prévoir (non faits)

Comme pour les cours de seconde, `banque:verifier`, `banque:fusionner` et `banque:texte` ne connaissent que `bph` et `stss` (`src/lib/contenu/banque/cours.ts`, `lireCoursArgument`) et lisent `contenu/1re-st2s/banques/` en dur. Proposition : ajouter une entrée `hlp` (fichier `contenu/1re-gen/hlp.json`, préfixe `hlp`, total 150) et dériver le dossier des banques du chemin du cours. Les contrôles ont été faits avec un outil hors dépôt qui appelle exactement les mêmes fonctions.

## Points à trancher

1. **Plan en six chapitres** (un par entrée), sans chapitre de méthode : la méthode de l'interprétation et de l'essai est en fin de chapitre.
2. **Prolongements hors période** (Austin, Bentham, Darwin, Lévi-Strauss, Code civil, Koyré, Fumaroli, Detienne) : gardés courts et présentés comme tels.
3. **Écarts avec la bibliographie officielle** : le BO date le *Metalogicon* de 1148 (on retient en général 1159 : date omise dans le cours), *La Cité du Soleil* de 1604 (rédigée vers 1602, publiée en 1623 : le cours dit « au début du XVIIe siècle »), *Gulliver* de 1735 (1726 dans le cours) ; graphies « Jean de Meun » et « Mme d'Aulnoy » retenues.
4. **Citations données de mémoire, à collationner sur une édition** : Bossuet, *Oraison funèbre d'Henriette-Anne d'Angleterre* ; Diderot, *Paradoxe sur le comédien* ; numérotations de Pascal (Lafuma / Brunschvicg) et de Cicéron (*Du meilleur genre d'orateurs*, § 3). Dates à vérifier : « Discours à Madame de La Sablière » daté de 1679 ; Malebranche 1674-1675 (BO : 1674-1678) ; passages de Montaigne II, 12 cités sans date d'édition.
5. **Questions de repères** (dates, attributions) : 4 à 7 % de dates pures par banque ; à réduire si l'enseignant préfère l'analyse.
6. **Paires de questions proches** (justes, mais l'une peut aider à répondre à l'autre dans un même quiz), signalées dans les `-relecture.md` : par exemple ch. 6, 105 et 111 (« agent libre ») ; ch. 3, 010 et 011 (Ulysse et la règle) ; ch. 2, Phénix et l'ambassade.
7. **Distracteurs pris hors du cours** dans quelques questions du chapitre 2 (le *Criton*, des fables, « Lève-toi, marche ») : faux sans ambiguïté, gardés.
8. **Variantes larges de réponses courtes** (« Thot » pour Theuth, « chat » pour « chatte », « Linnaeus ») : acceptées pour ne pas pénaliser un élève qui a compris.
