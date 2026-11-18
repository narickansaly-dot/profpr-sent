# Validation de physique-chimie (1re), chapitre 14 : « Aspects énergétiques des phénomènes mécaniques »

Rapport produit par script sur `contenu/1re-gen/physique-chimie.json` après fusion de la banque. Les scripts `banque:*` du dépôt ne connaissent que les cours de 1re ST2S ; les contrôles passent par un outil hors dépôt qui appelle les mêmes fonctions (`analyserImport`, `verifierBanque`, `fusionnerBanque`, `nettoyerHtml`, `versDonneesCours`) avec les quotas de 150 questions et les sources `physique-chimie-1re:chN:banque:NNN` (voir `physique-chimie-bilan.md`).

## Cours

- 7 sections, 21402 caractères de HTML, 2 figure(s) SVG, 9 objectifs, durée « 2 semaines ».
- Validateur d'import : valide. Nettoyage HTML : rien n'est retiré. Typographie (U+00A0 avant « : ; ! ? » et dans « », pas d'entité `&nbsp;`) : conforme.

## Banque de questions

- Vérificateur (17 règles, quotas 75 / 30 / 30 / 15 et 60 / 60 / 30, ± 3) : « Banque du chapitre 14 conforme : 150 questions. »
- Types : 75 `qcm_unique`, 30 `qcm_multiple` (9 à 2 bonnes réponses, 21 à 3), 30 `vrai_faux` (15 vrais, 15 faux), 15 `reponse_courte` (dont 15 avec une marge).
- Difficultés : 60 / 60 / 30 (niveaux 1 / 2 / 3).
- Bonne réponse des `qcm_unique` en position 1 à 4 : 19 / 19 / 19 / 18 ; strictement la plus longue dans 0 cas sur 75 (0 %).
- Relecture indépendante à l'aveugle : accords sans doute 149 / 150 ; désaccords : 0 ; accords avec doute : 1. ; arbitrage détaillé dans `banques/physique-chimie-ch14-relecture.md`.
- Statuts après relecture : 150 `valide`.

Notions (9) :

| Notion | Questions |
| --- | --- |
| Énergie cinétique | 12 |
| Produit scalaire | 8 |
| Travail d'une force constante | 18 |
| Théorème de l'énergie cinétique | 22 |
| Travail du poids et énergie potentielle | 29 |
| Frottements, forces non conservatives | 9 |
| Conservation de l'énergie mécanique | 21 |
| Variation de l'énergie mécanique | 17 |
| Exploitation de mesures (vidéo, Python) | 14 |
