# Validation de physique-chimie (1re), chapitre 4 : « Avancement et bilan de matière »

Rapport produit par script sur `contenu/1re-gen/physique-chimie.json` après fusion de la banque. Les scripts `banque:*` du dépôt ne connaissent que les cours de 1re ST2S ; les contrôles passent par un outil hors dépôt qui appelle les mêmes fonctions (`analyserImport`, `verifierBanque`, `fusionnerBanque`, `nettoyerHtml`, `versDonneesCours`) avec les quotas de 150 questions et les sources `physique-chimie-1re:chN:banque:NNN` (voir `physique-chimie-bilan.md`).

## Cours

- 6 sections, 23902 caractères de HTML, 2 figure(s) SVG, 8 objectifs, durée « 2 semaines ».
- Validateur d'import : valide. Nettoyage HTML : rien n'est retiré. Typographie (U+00A0 avant « : ; ! ? » et dans « », pas d'entité `&nbsp;`) : conforme.

## Banque de questions

- Vérificateur (17 règles, quotas 75 / 30 / 30 / 15 et 60 / 60 / 30, ± 3) : « Banque du chapitre 4 conforme : 150 questions. »
- Types : 75 `qcm_unique`, 30 `qcm_multiple` (12 à 2 bonnes réponses, 18 à 3), 30 `vrai_faux` (15 vrais, 15 faux), 15 `reponse_courte` (dont 13 avec une marge).
- Difficultés : 60 / 60 / 30 (niveaux 1 / 2 / 3).
- Bonne réponse des `qcm_unique` en position 1 à 4 : 19 / 19 / 19 / 18 ; strictement la plus longue dans 2 cas sur 75 (3 %).
- Relecture indépendante à l'aveugle : accords sans doute 148 / 150 ; désaccords : 0 ; accords avec doute : 2. ; arbitrage détaillé dans `banques/physique-chimie-ch4-relecture.md`.
- Statuts après relecture : 150 `valide`.

Notions (8) :

| Notion | Questions |
| --- | --- |
| Évolution d'un système chimique | 22 |
| Avancement et tableau d'avancement | 23 |
| Avancement maximal et réactif limitant | 24 |
| Composition de l'état final | 21 |
| Mélange stœchiométrique | 17 |
| Transformation totale ou non totale | 19 |
| Bilan de matière avec Python | 15 |
| Quantités initiales d'un bilan | 9 |
