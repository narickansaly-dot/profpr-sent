# Validation de physique-chimie (1re), chapitre 7 : « Cohésion, dissolution et extraction »

Rapport produit par script sur `contenu/1re-gen/physique-chimie.json` après fusion de la banque. Les scripts `banque:*` du dépôt ne connaissent que les cours de 1re ST2S ; les contrôles passent par un outil hors dépôt qui appelle les mêmes fonctions (`analyserImport`, `verifierBanque`, `fusionnerBanque`, `nettoyerHtml`, `versDonneesCours`) avec les quotas de 150 questions et les sources `physique-chimie-1re:chN:banque:NNN` (voir `physique-chimie-bilan.md`).

## Cours

- 6 sections, 44401 caractères de HTML, 4 figure(s) SVG, 8 objectifs, durée « 2 semaines ».
- Validateur d'import : valide. Nettoyage HTML : rien n'est retiré. Typographie (U+00A0 avant « : ; ! ? » et dans « », pas d'entité `&nbsp;`) : conforme.

## Banque de questions

- Vérificateur (17 règles, quotas 75 / 30 / 30 / 15 et 60 / 60 / 30, ± 3) : « Banque du chapitre 7 conforme : 150 questions. »
- Types : 75 `qcm_unique`, 30 `qcm_multiple` (4 à 2 bonnes réponses, 26 à 3), 30 `vrai_faux` (15 vrais, 15 faux), 15 `reponse_courte` (dont 10 avec une marge).
- Difficultés : 60 / 60 / 30 (niveaux 1 / 2 / 3).
- Bonne réponse des `qcm_unique` en position 1 à 4 : 19 / 19 / 19 / 18 ; strictement la plus longue dans 0 cas sur 75 (0 %).
- Relecture indépendante à l'aveugle : accords sans doute 148 / 150 ; désaccords : 0 ; accords avec doute : 2. ; arbitrage détaillé dans `banques/physique-chimie-ch7-relecture.md`.
- Statuts après relecture : 150 `valide`.

Notions (11) :

| Notion | Questions |
| --- | --- |
| Cohésion des solides ioniques | 8 |
| Formule statistique d'un solide ionique | 9 |
| Interactions de Van der Waals | 6 |
| Pont hydrogène | 7 |
| Températures de changement d'état | 9 |
| Étapes de la dissolution | 12 |
| Équation de dissolution | 11 |
| Concentration des ions en solution | 28 |
| Solubilité et miscibilité | 17 |
| Extraction liquide-liquide | 24 |
| Savons et espèces amphiphiles | 19 |
