# Validation de physique-chimie (1re), chapitre 16 : « Images et couleurs »

Rapport produit par script sur `contenu/1re-gen/physique-chimie.json` après fusion de la banque. Les scripts `banque:*` du dépôt ne connaissent que les cours de 1re ST2S ; les contrôles passent par un outil hors dépôt qui appelle les mêmes fonctions (`analyserImport`, `verifierBanque`, `fusionnerBanque`, `nettoyerHtml`, `versDonneesCours`) avec les quotas de 150 questions et les sources `physique-chimie-1re:chN:banque:NNN` (voir `physique-chimie-bilan.md`).

## Cours

- 7 sections, 21480 caractères de HTML, 3 figure(s) SVG, 9 objectifs, durée « 3 semaines ».
- Validateur d'import : valide. Nettoyage HTML : rien n'est retiré. Typographie (U+00A0 avant « : ; ! ? » et dans « », pas d'entité `&nbsp;`) : conforme.

## Banque de questions

- Vérificateur (17 règles, quotas 75 / 30 / 30 / 15 et 60 / 60 / 30, ± 3) : « Banque du chapitre 16 conforme : 150 questions. »
- Types : 75 `qcm_unique`, 30 `qcm_multiple` (9 à 2 bonnes réponses, 21 à 3), 30 `vrai_faux` (15 vrais, 15 faux), 15 `reponse_courte` (dont 10 avec une marge).
- Difficultés : 60 / 60 / 30 (niveaux 1 / 2 / 3).
- Bonne réponse des `qcm_unique` en position 1 à 4 : 19 / 19 / 19 / 18 ; strictement la plus longue dans 2 cas sur 75 (3 %).
- Relecture indépendante à l'aveugle : accords sans doute 149 / 150 ; désaccords : 0 ; accords avec doute : 1. ; arbitrage détaillé dans `banques/physique-chimie-ch16-relecture.md`.
- Statuts après relecture : 150 `valide`.

Notions (10) :

| Notion | Questions |
| --- | --- |
| Lentille convergente et construction | 8 |
| Grandeurs algébriques | 8 |
| Relation de conjugaison | 20 |
| Grandissement et caractéristiques | 28 |
| Vergence et distance focale | 13 |
| Image virtuelle et loupe | 11 |
| Mise au point et accommodation | 12 |
| Synthèse additive et vision | 19 |
| Synthèse soustractive et filtres | 17 |
| Couleur perçue des objets | 14 |
