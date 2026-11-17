# Validation de physique-chimie (1re), chapitre 13 : « Aspects énergétiques des phénomènes électriques »

Rapport produit par script sur `contenu/1re-gen/physique-chimie.json` après fusion de la banque. Les scripts `banque:*` du dépôt ne connaissent que les cours de 1re ST2S ; les contrôles passent par un outil hors dépôt qui appelle les mêmes fonctions (`analyserImport`, `verifierBanque`, `fusionnerBanque`, `nettoyerHtml`, `versDonneesCours`) avec les quotas de 150 questions et les sources `physique-chimie-1re:chN:banque:NNN` (voir `physique-chimie-bilan.md`).

## Cours

- 6 sections, 21739 caractères de HTML, 3 figure(s) SVG, 9 objectifs, durée « 2 semaines ».
- Validateur d'import : valide. Nettoyage HTML : rien n'est retiré. Typographie (U+00A0 avant « : ; ! ? » et dans « », pas d'entité `&nbsp;`) : conforme.

## Banque de questions

- Vérificateur (17 règles, quotas 75 / 30 / 30 / 15 et 60 / 60 / 30, ± 3) : « Banque du chapitre 13 conforme : 150 questions. »
- Types : 75 `qcm_unique`, 30 `qcm_multiple` (4 à 2 bonnes réponses, 26 à 3), 30 `vrai_faux` (15 vrais, 15 faux), 15 `reponse_courte` (dont 15 avec une marge).
- Difficultés : 60 / 60 / 30 (niveaux 1 / 2 / 3).
- Bonne réponse des `qcm_unique` en position 1 à 4 : 19 / 19 / 19 / 18 ; strictement la plus longue dans 2 cas sur 75 (3 %).
- Relecture indépendante à l'aveugle : accords sans doute 150 / 150 ; désaccords : 0 ; doutes : 0. ; arbitrage détaillé dans `banques/physique-chimie-ch13-relecture.md`.
- Statuts après relecture : 150 `valide`.

Notions (9) :

| Notion | Questions |
| --- | --- |
| Porteurs de charge | 10 |
| Intensité et débit de charges | 17 |
| Modèle de la source réelle | 13 |
| Caractéristique d'une source | 12 |
| Conséquences de la résistance interne | 8 |
| Puissance et énergie électriques | 21 |
| Ordres de grandeur de puissances | 9 |
| Effet Joule | 30 |
| Bilan de puissance et rendement | 30 |
