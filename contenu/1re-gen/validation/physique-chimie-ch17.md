# Validation de physique-chimie (1re), chapitre 17 : « Modèles ondulatoire et particulaire de la lumière »

Rapport produit par script sur `contenu/1re-gen/physique-chimie.json` après fusion de la banque. Les scripts `banque:*` du dépôt ne connaissent que les cours de 1re ST2S ; les contrôles passent par un outil hors dépôt qui appelle les mêmes fonctions (`analyserImport`, `verifierBanque`, `fusionnerBanque`, `nettoyerHtml`, `versDonneesCours`) avec les quotas de 150 questions et les sources `physique-chimie-1re:chN:banque:NNN` (voir `physique-chimie-bilan.md`).

## Cours

- 6 sections, 18413 caractères de HTML, 2 figure(s) SVG, 8 objectifs, durée « 2 semaines ».
- Validateur d'import : valide. Nettoyage HTML : rien n'est retiré. Typographie (U+00A0 avant « : ; ! ? » et dans « », pas d'entité `&nbsp;`) : conforme.

## Banque de questions

- Vérificateur (17 règles, quotas 75 / 30 / 30 / 15 et 60 / 60 / 30, ± 3) : « Banque du chapitre 17 conforme : 150 questions. »
- Types : 75 `qcm_unique`, 30 `qcm_multiple` (3 à 2 bonnes réponses, 27 à 3), 30 `vrai_faux` (15 vrais, 15 faux), 15 `reponse_courte` (dont 14 avec une marge).
- Difficultés : 60 / 60 / 30 (niveaux 1 / 2 / 3).
- Bonne réponse des `qcm_unique` en position 1 à 4 : 19 / 19 / 19 / 18 ; strictement la plus longue dans 1 cas sur 75 (1 %).
- Relecture indépendante à l'aveugle : accords sans doute 150 / 150 ; désaccords : 0 ; doutes : 0. ; arbitrage détaillé dans `banques/physique-chimie-ch17-relecture.md`.
- Statuts après relecture : 150 `valide`.

Notions (9) :

| Notion | Questions |
| --- | --- |
| Onde électromagnétique et célérité | 12 |
| Relation λ = c/ν | 15 |
| Domaines du spectre électromagnétique | 15 |
| Ordres de grandeur et usages | 11 |
| Photon et énergie E = h·ν | 21 |
| Électronvolt et conversions | 13 |
| Niveaux d'énergie quantifiés | 15 |
| Émission et absorption : ΔE = h·ν | 27 |
| Spectres de raies | 21 |
