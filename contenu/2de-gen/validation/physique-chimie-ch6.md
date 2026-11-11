# Validation de physique-chimie (2de), chapitre 6 : « Les transformations chimiques »

Rapport produit par script le 11 novembre 2026, sur `contenu/2de-gen/physique-chimie.json` après fusion de la banque. Les scripts `banque:*` du dépôt ne connaissent que les cours de 1re ST2S ; les contrôles ont été lancés avec un script hors dépôt qui appelle les mêmes fonctions (`analyserImport`, `verifierBanque`, `fusionnerBanque`, `nettoyerHtml`, `versDonneesCours`) avec les quotas de 150 questions (voir `physique-chimie.md`).

## Cours

- 6 sections, 22264 caractères de HTML, 7 objectifs, durée « 4 semaines ».
- Validateur d'import : valide. Typographie (U+00A0, pas d'entité `&nbsp;`, pas de figure) : conforme. Nettoyage HTML : rien n'est retiré.
- Relecture indépendante : 8 corrections, détaillées dans `banques/physique-chimie-ch6-cours-relecture.md`.

## Banque de questions

- Vérificateur (17 règles, quotas 75 / 30 / 30 / 15 et 60 / 60 / 30, ± 3) : « Banque du chapitre 6 conforme : 150 questions. »
- Types : 75 `qcm_unique`, 30 `qcm_multiple` (15 à 2 bonnes réponses, 15 à 3), 30 `vrai_faux` (15 vrais, 15 faux), 15 `reponse_courte` (dont 1 avec une marge).
- Difficultés : 60 / 60 / 30 (niveaux 1 / 2 / 3).
- Bonne réponse des `qcm_unique` en position 1 à 4 : 19 / 19 / 19 / 18 ; strictement la plus longue dans 23 cas sur 75 (31 %).
- Statut : les 150 questions sont `a_relire` : aucune n'est tirée dans un quiz avant la validation de l'enseignant.
- Relecture contre le cours : 132 gardées, 8 corrigées, 10 remplacées (`banques/physique-chimie-ch6-relecture.md`, qui liste aussi les points de doute).

Notions (12) :

| Notion | Questions |
| --- | --- |
| Système chimique | 5 |
| Réactifs et produits | 10 |
| Équation de réaction | 10 |
| Ajustement et conservation | 18 |
| Espèce spectatrice | 10 |
| Équations à connaître | 21 |
| Réactif limitant | 22 |
| Limitant et état final | 8 |
| Effets thermiques | 15 |
| Suivi de température | 8 |
| Synthèse et reflux | 12 |
| Chromatographie CCM | 11 |
