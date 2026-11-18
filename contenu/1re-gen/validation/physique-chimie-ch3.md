# Validation de physique-chimie (1re), chapitre 3 : « Les réactions d'oxydo-réduction »

Rapport produit par script sur `contenu/1re-gen/physique-chimie.json` après fusion de la banque. Les scripts `banque:*` du dépôt ne connaissent que les cours de 1re ST2S ; les contrôles passent par un outil hors dépôt qui appelle les mêmes fonctions (`analyserImport`, `verifierBanque`, `fusionnerBanque`, `nettoyerHtml`, `versDonneesCours`) avec les quotas de 150 questions et les sources `physique-chimie-1re:chN:banque:NNN` (voir `physique-chimie-bilan.md`).

## Cours

- 6 sections, 26447 caractères de HTML, 2 figure(s) SVG, 7 objectifs, durée « 2 semaines ».
- Validateur d'import : valide. Nettoyage HTML : rien n'est retiré. Typographie (U+00A0 avant « : ; ! ? » et dans « », pas d'entité `&nbsp;`) : conforme.

## Banque de questions

- Vérificateur (17 règles, quotas 75 / 30 / 30 / 15 et 60 / 60 / 30, ± 3) : « Banque du chapitre 3 conforme : 150 questions. »
- Types : 75 `qcm_unique`, 30 `qcm_multiple` (3 à 2 bonnes réponses, 27 à 3), 30 `vrai_faux` (15 vrais, 15 faux), 15 `reponse_courte` (dont 4 avec une marge).
- Difficultés : 60 / 60 / 30 (niveaux 1 / 2 / 3).
- Bonne réponse des `qcm_unique` en position 1 à 4 : 19 / 19 / 19 / 18 ; strictement la plus longue dans 1 cas sur 75 (1 %).
- Relecture indépendante à l'aveugle : accords sans doute 150 / 150 ; désaccords : 0 ; doutes : 0. ; arbitrage détaillé dans `banques/physique-chimie-ch3-relecture.md`.
- Statuts après relecture : 150 `valide`.

Notions (9) :

| Notion | Questions |
| --- | --- |
| Oxydant, réducteur et leurs rôles | 13 |
| Transfert d'électrons | 12 |
| Couples oxydant-réducteur usuels | 13 |
| Équation d'une réaction redox | 23 |
| Demi-équation électronique | 20 |
| Bilans de matière en oxydo-réduction | 30 |
| Conservation des éléments et des charges | 12 |
| Oxydants du quotidien et couleurs | 17 |
| Métaux, acides et corrosion | 10 |
