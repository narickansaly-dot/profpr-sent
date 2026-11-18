# Validation de physique-chimie (1re), chapitre 8 : « Structure et synthèse des espèces organiques »

Rapport produit par script sur `contenu/1re-gen/physique-chimie.json` après fusion de la banque. Les scripts `banque:*` du dépôt ne connaissent que les cours de 1re ST2S ; les contrôles passent par un outil hors dépôt qui appelle les mêmes fonctions (`analyserImport`, `verifierBanque`, `fusionnerBanque`, `nettoyerHtml`, `versDonneesCours`) avec les quotas de 150 questions et les sources `physique-chimie-1re:chN:banque:NNN` (voir `physique-chimie-bilan.md`).

## Cours

- 7 sections, 60892 caractères de HTML, 4 figure(s) SVG, 8 objectifs, durée « 3 semaines ».
- Validateur d'import : valide. Nettoyage HTML : rien n'est retiré. Typographie (U+00A0 avant « : ; ! ? » et dans « », pas d'entité `&nbsp;`) : conforme.

## Banque de questions

- Vérificateur (17 règles, quotas 75 / 30 / 30 / 15 et 60 / 60 / 30, ± 3) : « Banque du chapitre 8 conforme : 150 questions. »
- Types : 75 `qcm_unique`, 30 `qcm_multiple` (12 à 2 bonnes réponses, 18 à 3), 30 `vrai_faux` (15 vrais, 15 faux), 15 `reponse_courte` (dont 5 avec une marge).
- Difficultés : 60 / 60 / 30 (niveaux 1 / 2 / 3).
- Bonne réponse des `qcm_unique` en position 1 à 4 : 19 / 19 / 19 / 18 ; strictement la plus longue dans 0 cas sur 75 (0 %).
- Relecture indépendante à l'aveugle : accords sans doute 149 / 150 ; désaccords : 1 ; doutes : 0. ; arbitrage détaillé dans `banques/physique-chimie-ch8-relecture.md`.
- Statuts après relecture : 150 `valide`.

Notions (11) :

| Notion | Questions |
| --- | --- |
| Formules brute et semi-développée | 14 |
| Formule topologique et géométrie | 10 |
| Isomères | 6 |
| Chaînes saturées et alcanes | 15 |
| Nomenclature des alcanes | 15 |
| Groupes caractéristiques et familles | 13 |
| Nom d'une molécule à un groupe | 17 |
| Spectroscopie infrarouge | 20 |
| Étapes d'un protocole de synthèse | 10 |
| Montage de chauffage à reflux | 8 |
| Rendement d'une synthèse | 22 |
