# Validation de physique-chimie (1re), chapitre 1 : « Mesure et incertitudes »

Rapport produit par script sur `contenu/1re-gen/physique-chimie.json` après fusion de la banque. Les scripts `banque:*` du dépôt ne connaissent que les cours de 1re ST2S ; les contrôles passent par un outil hors dépôt qui appelle les mêmes fonctions (`analyserImport`, `verifierBanque`, `fusionnerBanque`, `nettoyerHtml`, `versDonneesCours`) avec les quotas de 150 questions et les sources `physique-chimie-1re:chN:banque:NNN` (voir `physique-chimie-bilan.md`).

## Cours

- 6 sections, 28646 caractères de HTML, 3 figure(s) SVG, 6 objectifs, durée « 1 semaine ».
- Validateur d'import : valide. Nettoyage HTML : rien n'est retiré. Typographie (U+00A0 avant « : ; ! ? » et dans « », pas d'entité `&nbsp;`) : conforme.

## Banque de questions

- Vérificateur (17 règles, quotas 75 / 30 / 30 / 15 et 60 / 60 / 30, ± 3) : « Banque du chapitre 1 conforme : 150 questions. »
- Types : 75 `qcm_unique`, 30 `qcm_multiple` (6 à 2 bonnes réponses, 24 à 3), 30 `vrai_faux` (17 vrais, 13 faux), 15 `reponse_courte` (dont 11 avec une marge).
- Difficultés : 60 / 60 / 30 (niveaux 1 / 2 / 3).
- Bonne réponse des `qcm_unique` en position 1 à 4 : 19 / 19 / 19 / 18 ; strictement la plus longue dans 9 cas sur 75 (12 %).
- Relecture indépendante à l'aveugle : accords sans doute 148 / 150 ; désaccords : 0 ; accords avec doute : 2. ; arbitrage détaillé dans `banques/physique-chimie-ch1-relecture.md`.
- Statuts après relecture : 150 `valide`.

Notions (12) :

| Notion | Questions |
| --- | --- |
| Variabilité de la mesure | 9 |
| Histogramme | 8 |
| Moyenne et écart-type | 9 |
| Incertitude-type de type A | 13 |
| Instrument et protocole | 8 |
| Type B par lecture de graduation | 18 |
| Type B pour un appareil numérique | 13 |
| Type B pour la verrerie | 9 |
| Chiffres significatifs | 13 |
| Écriture du résultat | 21 |
| Comparaison à une référence | 16 |
| Erreurs systématiques et améliorations | 13 |
