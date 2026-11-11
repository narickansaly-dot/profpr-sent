# Validation de physique-chimie (2de), chapitre 1 : « Mesure et incertitudes »

Rapport produit par script le 11 novembre 2026, sur `contenu/2de-gen/physique-chimie.json` après fusion de la banque. Les scripts `banque:*` du dépôt ne connaissent que les cours de 1re ST2S ; les contrôles ont été lancés avec un script hors dépôt qui appelle les mêmes fonctions (`analyserImport`, `verifierBanque`, `fusionnerBanque`, `nettoyerHtml`, `versDonneesCours`) avec les quotas de 150 questions (voir `physique-chimie.md`).

## Cours

- 5 sections, 17925 caractères de HTML, 6 objectifs, durée « 2 semaines ».
- Validateur d'import : valide. Typographie (U+00A0, pas d'entité `&nbsp;`, pas de figure) : conforme. Nettoyage HTML : rien n'est retiré.
- Relecture indépendante : 5 corrections, détaillées dans `banques/physique-chimie-ch1-cours-relecture.md`.

## Banque de questions

- Vérificateur (17 règles, quotas 75 / 30 / 30 / 15 et 60 / 60 / 30, ± 3) : « Banque du chapitre 1 conforme : 150 questions. »
- Types : 75 `qcm_unique`, 30 `qcm_multiple` (24 à 2 bonnes réponses, 6 à 3), 30 `vrai_faux` (14 vrais, 16 faux), 15 `reponse_courte` (dont 1 avec une marge).
- Difficultés : 59 / 61 / 30 (niveaux 1 / 2 / 3).
- Bonne réponse des `qcm_unique` en position 1 à 4 : 19 / 19 / 19 / 18 ; strictement la plus longue dans 17 cas sur 75 (23 %).
- Statut : les 150 questions sont `a_relire` : aucune n'est tirée dans un quiz avant la validation de l'enseignant.
- Relecture contre le cours : 140 gardées, 10 corrigées, 0 remplacées (`banques/physique-chimie-ch1-relecture.md`, qui liste aussi les points de doute).

Notions (12) :

| Notion | Questions |
| --- | --- |
| Grandeur, valeur et unité | 8 |
| Mesures indépendantes | 5 |
| Variabilité de la mesure | 12 |
| Histogramme | 13 |
| Moyenne | 8 |
| Écart-type | 10 |
| Incertitude-type | 21 |
| Instrument et protocole | 12 |
| Chiffres significatifs | 19 |
| Écriture scientifique | 8 |
| Résultat avec incertitude | 14 |
| Comparaison à une référence | 20 |
