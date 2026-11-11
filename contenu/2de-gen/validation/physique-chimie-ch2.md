# Validation de physique-chimie (2de), chapitre 2 : « Corps purs, mélanges et solutions aqueuses »

Rapport produit par script le 11 novembre 2026, sur `contenu/2de-gen/physique-chimie.json` après fusion de la banque. Les scripts `banque:*` du dépôt ne connaissent que les cours de 1re ST2S ; les contrôles ont été lancés avec un script hors dépôt qui appelle les mêmes fonctions (`analyserImport`, `verifierBanque`, `fusionnerBanque`, `nettoyerHtml`, `versDonneesCours`) avec les quotas de 150 questions (voir `physique-chimie.md`).

## Cours

- 6 sections, 22651 caractères de HTML, 8 objectifs, durée « 3 semaines ».
- Validateur d'import : valide. Typographie (U+00A0, pas d'entité `&nbsp;`, pas de figure) : conforme. Nettoyage HTML : rien n'est retiré.
- Relecture indépendante : 9 corrections, détaillées dans `banques/physique-chimie-ch2-cours-relecture.md`.

## Banque de questions

- Vérificateur (17 règles, quotas 75 / 30 / 30 / 15 et 60 / 60 / 30, ± 3) : « Banque du chapitre 2 conforme : 150 questions. »
- Types : 75 `qcm_unique`, 30 `qcm_multiple` (15 à 2 bonnes réponses, 15 à 3), 30 `vrai_faux` (15 vrais, 15 faux), 15 `reponse_courte` (dont 7 avec une marge).
- Difficultés : 60 / 60 / 30 (niveaux 1 / 2 / 3).
- Bonne réponse des `qcm_unique` en position 1 à 4 : 18 / 20 / 18 / 19 ; strictement la plus longue dans 20 cas sur 75 (27 %).
- Statut : les 150 questions sont `a_relire` : aucune n'est tirée dans un quiz avant la validation de l'enseignant.
- Relecture contre le cours : 142 gardées, 6 corrigées, 2 remplacées (`banques/physique-chimie-ch2-relecture.md`, qui liste aussi les points de doute).

Notions (11) :

| Notion | Questions |
| --- | --- |
| Corps purs et mélanges | 17 |
| Changements d'état | 10 |
| Masse volumique | 19 |
| Chromatographie et tests chimiques | 18 |
| Composition d'un mélange | 12 |
| Composition de l'air | 11 |
| Solvant et soluté | 8 |
| Concentration en masse | 19 |
| Dissolution et verrerie | 9 |
| Dilution | 15 |
| Dosage par étalonnage | 12 |
