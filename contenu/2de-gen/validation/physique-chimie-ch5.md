# Validation de physique-chimie (2de), chapitre 5 : « Les transformations physiques »

Rapport produit par script le 11 novembre 2026, sur `contenu/2de-gen/physique-chimie.json` après fusion de la banque. Les scripts `banque:*` du dépôt ne connaissent que les cours de 1re ST2S ; les contrôles ont été lancés avec un script hors dépôt qui appelle les mêmes fonctions (`analyserImport`, `verifierBanque`, `fusionnerBanque`, `nettoyerHtml`, `versDonneesCours`) avec les quotas de 150 questions (voir `physique-chimie.md`).

## Cours

- 5 sections, 19797 caractères de HTML, 6 objectifs, durée « 2 semaines ».
- Validateur d'import : valide. Typographie (U+00A0, pas d'entité `&nbsp;`, pas de figure) : conforme. Nettoyage HTML : rien n'est retiré.
- Relecture indépendante : 7 corrections, détaillées dans `banques/physique-chimie-ch5-cours-relecture.md`.

## Banque de questions

- Vérificateur (17 règles, quotas 75 / 30 / 30 / 15 et 60 / 60 / 30, ± 3) : « Banque du chapitre 5 conforme : 150 questions. »
- Types : 75 `qcm_unique`, 30 `qcm_multiple` (14 à 2 bonnes réponses, 16 à 3), 30 `vrai_faux` (16 vrais, 14 faux), 15 `reponse_courte` (dont 5 avec une marge).
- Difficultés : 59 / 61 / 30 (niveaux 1 / 2 / 3).
- Bonne réponse des `qcm_unique` en position 1 à 4 : 19 / 19 / 19 / 18 ; strictement la plus longue dans 12 cas sur 75 (16 %).
- Statut : les 150 questions sont `a_relire` : aucune n'est tirée dans un quiz avant la validation de l'enseignant.
- Relecture contre le cours : 135 gardées, 9 corrigées, 6 remplacées (`banques/physique-chimie-ch5-relecture.md`, qui liste aussi les points de doute).

Notions (9) :

| Notion | Questions |
| --- | --- |
| Six changements d'état | 24 |
| Cycle de l'eau, vie courante | 8 |
| Équation d'un changement d'état | 14 |
| Modèle microscopique | 13 |
| Conservation de la masse, volume | 10 |
| Fusion et dissolution | 21 |
| Endothermique, exothermique | 23 |
| Énergie massique et Q = m × L | 31 |
| Applications des échanges d'énergie | 6 |
