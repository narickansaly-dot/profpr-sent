# Validation de physique-chimie (1re), chapitre 11 : « Le fluide au repos »

Rapport produit par script sur `contenu/1re-gen/physique-chimie.json` après fusion de la banque. Les scripts `banque:*` du dépôt ne connaissent que les cours de 1re ST2S ; les contrôles passent par un outil hors dépôt qui appelle les mêmes fonctions (`analyserImport`, `verifierBanque`, `fusionnerBanque`, `nettoyerHtml`, `versDonneesCours`) avec les quotas de 150 questions et les sources `physique-chimie-1re:chN:banque:NNN` (voir `physique-chimie-bilan.md`).

## Cours

- 6 sections, 25609 caractères de HTML, 3 figure(s) SVG, 8 objectifs, durée « 2 semaines ».
- Validateur d'import : valide. Nettoyage HTML : rien n'est retiré. Typographie (U+00A0 avant « : ; ! ? » et dans « », pas d'entité `&nbsp;`) : conforme.

## Banque de questions

- Vérificateur (17 règles, quotas 75 / 30 / 30 / 15 et 60 / 60 / 30, ± 3) : « Banque du chapitre 11 conforme : 150 questions. »
- Types : 75 `qcm_unique`, 30 `qcm_multiple` (16 à 2 bonnes réponses, 14 à 3), 30 `vrai_faux` (15 vrais, 15 faux), 15 `reponse_courte` (dont 15 avec une marge).
- Difficultés : 60 / 60 / 30 (niveaux 1 / 2 / 3).
- Bonne réponse des `qcm_unique` en position 1 à 4 : 19 / 19 / 19 / 18 ; strictement la plus longue dans 2 cas sur 75 (3 %).
- Relecture indépendante à l'aveugle : accords sans doute 148 / 150 ; désaccords : 0 ; accords avec doute : 2. ; arbitrage détaillé dans `banques/physique-chimie-ch11-relecture.md`.
- Statuts après relecture : 150 `valide`.

Notions (10) :

| Notion | Questions |
| --- | --- |
| Échelles de description d'un fluide | 10 |
| Masse volumique | 8 |
| Pression et unités | 11 |
| Température et agitation thermique | 6 |
| Force pressante | 31 |
| Loi de Mariotte | 24 |
| Loi fondamentale de la statique | 29 |
| Atmosphère et vases communicants | 9 |
| Mesure d'une pression | 10 |
| Exploitation de mesures | 12 |
