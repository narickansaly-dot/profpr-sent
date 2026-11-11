# Validation de physique-chimie (2de), chapitre 10 : « Émission et perception d'un son »

Rapport produit par script le 11 novembre 2026, sur `contenu/2de-gen/physique-chimie.json` après fusion de la banque. Les scripts `banque:*` du dépôt ne connaissent que les cours de 1re ST2S ; les contrôles ont été lancés avec un script hors dépôt qui appelle les mêmes fonctions (`analyserImport`, `verifierBanque`, `fusionnerBanque`, `nettoyerHtml`, `versDonneesCours`) avec les quotas de 150 questions (voir `physique-chimie.md`).

## Cours

- 6 sections, 20672 caractères de HTML, 7 objectifs, durée « 2 semaines ».
- Validateur d'import : valide. Typographie (U+00A0, pas d'entité `&nbsp;`, pas de figure) : conforme. Nettoyage HTML : rien n'est retiré.
- Relecture indépendante : 7 corrections, détaillées dans `banques/physique-chimie-ch10-cours-relecture.md`.

## Banque de questions

- Vérificateur (17 règles, quotas 75 / 30 / 30 / 15 et 60 / 60 / 30, ± 3) : « Banque du chapitre 10 conforme : 150 questions. »
- Types : 75 `qcm_unique`, 30 `qcm_multiple` (20 à 2 bonnes réponses, 10 à 3), 30 `vrai_faux` (15 vrais, 15 faux), 15 `reponse_courte` (dont 3 avec une marge).
- Difficultés : 60 / 61 / 29 (niveaux 1 / 2 / 3).
- Bonne réponse des `qcm_unique` en position 1 à 4 : 19 / 19 / 19 / 18 ; strictement la plus longue dans 27 cas sur 75 (36 %).
- Statut : les 150 questions sont `a_relire` : aucune n'est tirée dans un quiz avant la validation de l'enseignant.
- Relecture contre le cours : 132 gardées, 3 corrigées, 15 remplacées (`banques/physique-chimie-ch10-relecture.md`, qui liste aussi les points de doute).

Notions (12) :

| Notion | Questions |
| --- | --- |
| Vibration et caisse de résonance | 12 |
| Émetteur, milieu, récepteur | 8 |
| Propagation et milieu matériel | 7 |
| Vitesse du son | 18 |
| Mesure de la vitesse du son | 8 |
| Période et fréquence | 24 |
| Chaîne de mesure, microcontrôleur | 6 |
| Domaines de fréquences | 9 |
| Hauteur et timbre | 14 |
| Amplitude et intensité sonore | 8 |
| Niveau d'intensité sonore | 16 |
| Dangers du bruit | 20 |
