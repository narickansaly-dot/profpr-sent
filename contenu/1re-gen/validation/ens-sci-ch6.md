# Validation d'enseignement scientifique (1re), chapitre 6 : « De la photosynthèse à l'énergie des êtres vivants »

Rapport produit par script le 16/11/2026, sur `contenu/1re-gen/ens-sci.json` après fusion de la banque. Les scripts `banque:*` du dépôt ne connaissent que les cours de 1re ST2S : les contrôles ont été lancés par un script hors dépôt qui appelle les mêmes fonctions (`analyserImport`, `verifierBanque`, `fusionnerBanque`, `nettoyerHtml`, `versDonneesCours`) avec les quotas de 150 questions (voir `ens-sci-bilan.md`).

## Cours

- 8 sections, 19774 caractères de HTML hors figures (28729 avec), 3 figures SVG, 7 objectifs, durée « 3 semaines ».
- Validateur d'import : valide. Nettoyage HTML : rien n'est retiré. Typographie : U+00A0, aucune entité `&nbsp;`.

## Banque de questions

- Vérificateur (`verifierBanque`, 17 règles, quotas 75 / 30 / 30 / 15 et 60 / 60 / 30, ± 3) : « Banque du chapitre 6 conforme : 150 questions. »
- Types : 75 `qcm_unique`, 30 `qcm_multiple` (14 à 2 bonnes réponses, 16 à 3), 30 `vrai_faux` (16 vrais, 14 faux), 15 `reponse_courte` (dont 0 avec une marge).
- Difficultés : 59 / 61 / 30 (niveaux 1 / 2 / 3).
- Bonne réponse des `qcm_unique` en position 1 à 4 : 19 / 19 / 19 / 18 ; strictement la plus longue dans 12 cas sur 75 (16 %).
- Statuts : 150 `valide`, 0 `a_relire`.

## Relecture indépendante à l'aveugle

Un sous-agent, sans accès aux réponses ni aux explications, a résolu les 150 questions à partir du seul texte du chapitre, en refaisant chaque calcul ; ses réponses ont été comparées automatiquement à la banque, puis chaque écart et chaque remarque ont été examinés et corrigés. Détail : `banques/ens-sci-ch6-relecture.md`.

- Concordance initiale : **150/150**, aucun écart.
- Remarques : 33 (questions concordantes commentées ou de confiance inférieure à 3).
- Répartition : 0 erreur de la banque ; 2 faits absents du cours (longueurs d'onde) ; 4 ambiguïtés (eau produite par la photosynthèse, égalité exacte, fibres dans deux questions) ; 1 distracteur peu crédible ; 1 question de pure restitution d'un exemple du cours ; 12 variantes de réponse courte à ajouter ; 13 remarques sans conséquence (distracteur ou détail du cours absent des propositions, sans effet sur la réponse) ; 0 erreur du relecteur.

Questions laissées à relire : aucune.

Notions (10) :

| Notion | Questions |
| --- | --- |
| Photosynthèse et chloroplastes | 18 |
| Énergie solaire captée | 13 |
| Importance planétaire | 14 |
| Chaînes alimentaires | 14 |
| Respiration cellulaire | 13 |
| Nutriments et valeur énergétique | 20 |
| Bilan énergétique | 19 |
| Équilibre alimentaire | 15 |
| Déséquilibres et santé | 14 |
| Histoire des sciences | 10 |
