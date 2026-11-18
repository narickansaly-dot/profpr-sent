# Validation de physique-chimie (1re), chapitre 9 : « Combustions et énergie chimique »

Rapport produit par script sur `contenu/1re-gen/physique-chimie.json` après fusion de la banque. Les scripts `banque:*` du dépôt ne connaissent que les cours de 1re ST2S ; les contrôles passent par un outil hors dépôt qui appelle les mêmes fonctions (`analyserImport`, `verifierBanque`, `fusionnerBanque`, `nettoyerHtml`, `versDonneesCours`) avec les quotas de 150 questions et les sources `physique-chimie-1re:chN:banque:NNN` (voir `physique-chimie-bilan.md`).

## Cours

- 6 sections, 25503 caractères de HTML, 2 figure(s) SVG, 7 objectifs, durée « 2 semaines ».
- Validateur d'import : valide. Nettoyage HTML : rien n'est retiré. Typographie (U+00A0 avant « : ; ! ? » et dans « », pas d'entité `&nbsp;`) : conforme.

## Banque de questions

- Vérificateur (17 règles, quotas 75 / 30 / 30 / 15 et 60 / 60 / 30, ± 3) : « Banque du chapitre 9 conforme : 150 questions. »
- Types : 75 `qcm_unique`, 30 `qcm_multiple` (2 à 2 bonnes réponses, 28 à 3), 30 `vrai_faux` (15 vrais, 15 faux), 15 `reponse_courte` (dont 8 avec une marge).
- Difficultés : 60 / 60 / 30 (niveaux 1 / 2 / 3).
- Bonne réponse des `qcm_unique` en position 1 à 4 : 19 / 19 / 19 / 18 ; strictement la plus longue dans 0 cas sur 75 (0 %).
- Relecture indépendante à l'aveugle : accords sans doute 149 / 150 ; désaccords : 0 ; accords avec doute : 1. ; arbitrage détaillé dans `banques/physique-chimie-ch9-relecture.md`.
- Statuts après relecture : 150 `valide`.

Notions (8) :

| Notion | Questions |
| --- | --- |
| Combustibles fossiles et biosourcés | 13 |
| Équation de combustion complète | 20 |
| Oxydo-réduction, combustion incomplète | 15 |
| Énergie molaire de réaction | 16 |
| Pouvoir calorifique massique | 25 |
| Énergies de liaison | 28 |
| Mesure d'un pouvoir calorifique | 18 |
| Risques et enjeux des combustions | 15 |
