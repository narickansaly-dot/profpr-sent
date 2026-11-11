# Validation de physique-chimie (2de), chapitre 11 : « Vision et image »

Rapport produit par script le 11 novembre 2026, sur `contenu/2de-gen/physique-chimie.json` après fusion de la banque. Les scripts `banque:*` du dépôt ne connaissent que les cours de 1re ST2S ; les contrôles ont été lancés avec un script hors dépôt qui appelle les mêmes fonctions (`analyserImport`, `verifierBanque`, `fusionnerBanque`, `nettoyerHtml`, `versDonneesCours`) avec les quotas de 150 questions (voir `physique-chimie.md`).

## Cours

- 7 sections, 21996 caractères de HTML, 7 objectifs, durée « 4 semaines ».
- Validateur d'import : valide. Typographie (U+00A0, pas d'entité `&nbsp;`, pas de figure) : conforme. Nettoyage HTML : rien n'est retiré.
- Relecture indépendante : 10 corrections, détaillées dans `banques/physique-chimie-ch11-cours-relecture.md`.

## Banque de questions

- Vérificateur (17 règles, quotas 75 / 30 / 30 / 15 et 60 / 60 / 30, ± 3) : « Banque du chapitre 11 conforme : 150 questions. »
- Types : 75 `qcm_unique`, 30 `qcm_multiple` (17 à 2 bonnes réponses, 13 à 3), 30 `vrai_faux` (15 vrais, 15 faux), 15 `reponse_courte` (dont 8 avec une marge).
- Difficultés : 60 / 60 / 30 (niveaux 1 / 2 / 3).
- Bonne réponse des `qcm_unique` en position 1 à 4 : 19 / 19 / 19 / 18 ; strictement la plus longue dans 16 cas sur 75 (21 %).
- Statut : les 150 questions sont `a_relire` : aucune n'est tirée dans un quiz avant la validation de l'enseignant.
- Relecture contre le cours : 133 gardées, 13 corrigées, 4 remplacées (`banques/physique-chimie-ch11-relecture.md`, qui liste aussi les points de doute).

Notions (10) :

| Notion | Questions |
| --- | --- |
| Propagation rectiligne | 8 |
| Vitesse de la lumière | 14 |
| Longueur d'onde et radiations | 14 |
| Spectres d'émission | 16 |
| Indice optique | 10 |
| Lois de Snell-Descartes | 20 |
| Dispersion | 14 |
| Lentille convergente | 17 |
| Image et grandissement | 24 |
| L'œil | 13 |
