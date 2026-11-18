# Validation de physique-chimie (1re), chapitre 2 : « Composition d'un système chimique »

Rapport produit par script sur `contenu/1re-gen/physique-chimie.json` après fusion de la banque. Les scripts `banque:*` du dépôt ne connaissent que les cours de 1re ST2S ; les contrôles passent par un outil hors dépôt qui appelle les mêmes fonctions (`analyserImport`, `verifierBanque`, `fusionnerBanque`, `nettoyerHtml`, `versDonneesCours`) avec les quotas de 150 questions et les sources `physique-chimie-1re:chN:banque:NNN` (voir `physique-chimie-bilan.md`).

## Cours

- 6 sections, 32642 caractères de HTML, 3 figure(s) SVG, 8 objectifs, durée « 2 semaines ».
- Validateur d'import : valide. Nettoyage HTML : rien n'est retiré. Typographie (U+00A0 avant « : ; ! ? » et dans « », pas d'entité `&nbsp;`) : conforme.

## Banque de questions

- Vérificateur (17 règles, quotas 75 / 30 / 30 / 15 et 60 / 60 / 30, ± 3) : « Banque du chapitre 2 conforme : 150 questions. »
- Types : 75 `qcm_unique`, 30 `qcm_multiple` (3 à 2 bonnes réponses, 27 à 3), 30 `vrai_faux` (15 vrais, 15 faux), 15 `reponse_courte` (dont 14 avec une marge).
- Difficultés : 60 / 60 / 30 (niveaux 1 / 2 / 3).
- Bonne réponse des `qcm_unique` en position 1 à 4 : 18 / 19 / 19 / 19 ; strictement la plus longue dans 3 cas sur 75 (4 %).
- Relecture indépendante à l'aveugle : accords sans doute 150 / 150 ; désaccords : 0 ; doutes : 0. ; arbitrage détaillé dans `banques/physique-chimie-ch2-relecture.md`.
- Statuts après relecture : 150 `valide`.

Notions (9) :

| Notion | Questions |
| --- | --- |
| Masse molaire et constante d'Avogadro | 20 |
| Masse et quantité de matière | 12 |
| Liquides : masse volumique et densité | 11 |
| Composition d'un mélange | 10 |
| Volume molaire d'un gaz | 18 |
| Concentration et dissolution | 18 |
| Dilution | 16 |
| Couleur et spectre d'absorption | 22 |
| Loi de Beer-Lambert et étalonnage | 23 |
