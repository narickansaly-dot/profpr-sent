# Validation d'enseignement scientifique (1re), chapitre 3 : « Une structure complexe : la cellule vivante »

Rapport produit par script le 16/11/2026, sur `contenu/1re-gen/ens-sci.json` après fusion de la banque. Les scripts `banque:*` du dépôt ne connaissent que les cours de 1re ST2S : les contrôles ont été lancés par un script hors dépôt qui appelle les mêmes fonctions (`analyserImport`, `verifierBanque`, `fusionnerBanque`, `nettoyerHtml`, `versDonneesCours`) avec les quotas de 150 questions (voir `ens-sci-bilan.md`).

## Cours

- 8 sections, 23635 caractères de HTML hors figures (35269 avec), 3 figures SVG, 8 objectifs, durée « 3 semaines ».
- Validateur d'import : valide. Nettoyage HTML : rien n'est retiré. Typographie : U+00A0, aucune entité `&nbsp;`.

## Banque de questions

- Vérificateur (`verifierBanque`, 17 règles, quotas 75 / 30 / 30 / 15 et 60 / 60 / 30, ± 3) : « Banque du chapitre 3 conforme : 150 questions. »
- Types : 75 `qcm_unique`, 30 `qcm_multiple` (12 à 2 bonnes réponses, 18 à 3), 30 `vrai_faux` (17 vrais, 13 faux), 15 `reponse_courte` (dont 1 avec une marge).
- Difficultés : 58 / 62 / 30 (niveaux 1 / 2 / 3).
- Bonne réponse des `qcm_unique` en position 1 à 4 : 19 / 19 / 19 / 18 ; strictement la plus longue dans 8 cas sur 75 (11 %).
- Statuts : 150 `valide`, 0 `a_relire`.

## Relecture indépendante à l'aveugle

Un sous-agent, sans accès aux réponses ni aux explications, a résolu les 150 questions à partir du seul texte du chapitre, en refaisant chaque calcul ; ses réponses ont été comparées automatiquement à la banque, puis chaque écart et chaque remarque ont été examinés et corrigés. Détail : `banques/ens-sci-ch3-relecture.md`.

- Concordance initiale : 150/150.
- Écarts : 0.
- Remarques sur des questions concordantes : 33.
- Répartition : 0 erreur de la banque, 4 ambiguïtés (079, 100, 112, 147), 2 distracteurs défendables (047, 092), 3 variantes manquantes (018, 081, 082), 0 erreur du relecteur. Les 24 autres remarques confirment le calcul ou la réponse sans signaler de défaut (variantes déjà présentes pour 039, 059, 101, 116, 130 et 141 ; les accents sont ignorés par la comparaison).

Questions laissées à relire : aucune.

Notions (9) :

| Notion | Questions |
| --- | --- |
| Microscope et découverte de la cellule | 18 |
| Théorie cellulaire | 21 |
| Microscope électronique | 21 |
| Échelles et ordres de grandeur | 22 |
| Membrane et milieu aqueux | 19 |
| Énergie et échanges cellulaires | 16 |
| Osmose, plasmolyse, turgescence | 13 |
| Statut des virus | 11 |
| Molécules exogènes | 9 |
