# Validation de physique-chimie (2de), chapitre 8 : « Décrire un mouvement »

Rapport produit par script le 11 novembre 2026, sur `contenu/2de-gen/physique-chimie.json` après fusion de la banque. Les scripts `banque:*` du dépôt ne connaissent que les cours de 1re ST2S ; les contrôles ont été lancés avec un script hors dépôt qui appelle les mêmes fonctions (`analyserImport`, `verifierBanque`, `fusionnerBanque`, `nettoyerHtml`, `versDonneesCours`) avec les quotas de 150 questions (voir `physique-chimie.md`).

## Cours

- 6 sections, 21870 caractères de HTML, 6 objectifs, durée « 3 semaines ».
- Validateur d'import : valide. Typographie (U+00A0, pas d'entité `&nbsp;`, pas de figure) : conforme. Nettoyage HTML : rien n'est retiré.
- Relecture indépendante : 10 corrections, détaillées dans `banques/physique-chimie-ch8-cours-relecture.md`.

## Banque de questions

- Vérificateur (17 règles, quotas 75 / 30 / 30 / 15 et 60 / 60 / 30, ± 3) : « Banque du chapitre 8 conforme : 150 questions. »
- Types : 75 `qcm_unique`, 30 `qcm_multiple` (19 à 2 bonnes réponses, 11 à 3), 30 `vrai_faux` (15 vrais, 15 faux), 15 `reponse_courte` (dont 8 avec une marge).
- Difficultés : 60 / 60 / 30 (niveaux 1 / 2 / 3).
- Bonne réponse des `qcm_unique` en position 1 à 4 : 19 / 19 / 19 / 18 ; strictement la plus longue dans 19 cas sur 75 (25 %).
- Statut : les 150 questions sont `a_relire` : aucune n'est tirée dans un quiz avant la validation de l'enseignant.
- Relecture contre le cours : 141 gardées, 7 corrigées, 2 remplacées (`banques/physique-chimie-ch8-relecture.md`, qui liste aussi les points de doute).

Notions (12) :

| Notion | Questions |
| --- | --- |
| Système | 6 |
| Échelles et ordres de grandeur | 14 |
| Référentiels | 12 |
| Relativité du mouvement | 9 |
| Composition des vitesses | 7 |
| Modèle du point | 13 |
| Position et trajectoire | 11 |
| Chronophotographie | 16 |
| Vecteur déplacement | 8 |
| Vitesse moyenne et unités | 16 |
| Vecteur vitesse | 17 |
| Mouvements rectilignes | 21 |
