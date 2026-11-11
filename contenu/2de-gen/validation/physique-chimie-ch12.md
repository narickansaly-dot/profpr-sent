# Validation de physique-chimie (2de), chapitre 12 : « Signaux et capteurs »

Rapport produit par script le 11 novembre 2026, sur `contenu/2de-gen/physique-chimie.json` après fusion de la banque. Les scripts `banque:*` du dépôt ne connaissent que les cours de 1re ST2S ; les contrôles ont été lancés avec un script hors dépôt qui appelle les mêmes fonctions (`analyserImport`, `verifierBanque`, `fusionnerBanque`, `nettoyerHtml`, `versDonneesCours`) avec les quotas de 150 questions (voir `physique-chimie.md`).

## Cours

- 5 sections, 17771 caractères de HTML, 6 objectifs, durée « 2 semaines ».
- Validateur d'import : valide. Typographie (U+00A0, pas d'entité `&nbsp;`, pas de figure) : conforme. Nettoyage HTML : rien n'est retiré.
- Relecture indépendante : 6 corrections, détaillées dans `banques/physique-chimie-ch12-cours-relecture.md`.

## Banque de questions

- Vérificateur (17 règles, quotas 75 / 30 / 30 / 15 et 60 / 60 / 30, ± 3) : « Banque du chapitre 12 conforme : 150 questions. »
- Types : 74 `qcm_unique`, 29 `qcm_multiple` (18 à 2 bonnes réponses, 11 à 3), 31 `vrai_faux` (15 vrais, 16 faux), 16 `reponse_courte` (dont 1 avec une marge).
- Difficultés : 59 / 61 / 30 (niveaux 1 / 2 / 3).
- Bonne réponse des `qcm_unique` en position 1 à 4 : 19 / 18 / 18 / 19 ; strictement la plus longue dans 16 cas sur 74 (22 %).
- Statut : les 150 questions sont `a_relire` : aucune n'est tirée dans un quiz avant la validation de l'enseignant.
- Relecture contre le cours : 137 gardées, 12 corrigées, 1 remplacées (`banques/physique-chimie-ch12-relecture.md`, qui liste aussi les points de doute).

Notions (11) :

| Notion | Questions |
| --- | --- |
| Dipôle, tension, intensité | 12 |
| Multimètre | 12 |
| Sécurité | 9 |
| Loi des nœuds | 12 |
| Loi des mailles | 14 |
| Caractéristique | 12 |
| Modéliser une caractéristique | 6 |
| Point de fonctionnement | 12 |
| Loi d'Ohm | 28 |
| Capteurs | 12 |
| Étalonnage et microcontrôleur | 21 |
