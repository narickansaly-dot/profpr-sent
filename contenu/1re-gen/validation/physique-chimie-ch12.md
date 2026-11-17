# Validation de physique-chimie (1re), chapitre 12 : « Mouvement et deuxième loi de Newton »

Rapport produit par script sur `contenu/1re-gen/physique-chimie.json` après fusion de la banque. Les scripts `banque:*` du dépôt ne connaissent que les cours de 1re ST2S ; les contrôles passent par un outil hors dépôt qui appelle les mêmes fonctions (`analyserImport`, `verifierBanque`, `fusionnerBanque`, `nettoyerHtml`, `versDonneesCours`) avec les quotas de 150 questions et les sources `physique-chimie-1re:chN:banque:NNN` (voir `physique-chimie-bilan.md`).

## Cours

- 7 sections, 21898 caractères de HTML, 3 figure(s) SVG, 8 objectifs, durée « 2 semaines ».
- Validateur d'import : valide. Nettoyage HTML : rien n'est retiré. Typographie (U+00A0 avant « : ; ! ? » et dans « », pas d'entité `&nbsp;`) : conforme.

## Banque de questions

- Vérificateur (17 règles, quotas 75 / 30 / 30 / 15 et 60 / 60 / 30, ± 3) : « Banque du chapitre 12 conforme : 150 questions. »
- Types : 75 `qcm_unique`, 30 `qcm_multiple` (15 à 2 bonnes réponses, 15 à 3), 30 `vrai_faux` (15 vrais, 15 faux), 15 `reponse_courte` (dont 15 avec une marge).
- Difficultés : 60 / 60 / 30 (niveaux 1 / 2 / 3).
- Bonne réponse des `qcm_unique` en position 1 à 4 : 19 / 19 / 19 / 18 ; strictement la plus longue dans 1 cas sur 75 (1 %).
- Relecture indépendante à l'aveugle : accords sans doute 150 / 150 ; désaccords : 0 ; doutes : 0. ; arbitrage détaillé dans `banques/physique-chimie-ch12-relecture.md`.
- Statuts après relecture : 150 `valide`.

Notions (11) :

| Notion | Questions |
| --- | --- |
| Description d'un mouvement | 10 |
| Vecteur vitesse | 14 |
| Somme et différence de vecteurs | 10 |
| Vecteur variation de vitesse | 30 |
| Variation de vitesse et forces | 22 |
| Principe d'inertie | 9 |
| Rôle de la masse | 9 |
| Chute libre | 16 |
| Mouvement circulaire uniforme | 10 |
| Freinage rectiligne | 10 |
| Programme Python | 10 |
