# Validation d'enseignement scientifique (1re), chapitre 1 : « Les éléments chimiques : de la nucléosynthèse à la radioactivité »

Rapport produit par script le 16/11/2026, sur `contenu/1re-gen/ens-sci.json` après fusion de la banque. Les scripts `banque:*` du dépôt ne connaissent que les cours de 1re ST2S : les contrôles ont été lancés par un script hors dépôt qui appelle les mêmes fonctions (`analyserImport`, `verifierBanque`, `fusionnerBanque`, `nettoyerHtml`, `versDonneesCours`) avec les quotas de 150 questions (voir `ens-sci-bilan.md`).

## Cours

- 8 sections, 31090 caractères de HTML hors figures (41219 avec), 3 figures SVG, 8 objectifs, durée « 3 semaines ».
- Validateur d'import : valide. Nettoyage HTML : rien n'est retiré. Typographie : U+00A0, aucune entité `&nbsp;`.

## Banque de questions

- Vérificateur (`verifierBanque`, 17 règles, quotas 75 / 30 / 30 / 15 et 60 / 60 / 30, ± 3) : « Banque du chapitre 1 conforme : 150 questions. »
- Types : 75 `qcm_unique`, 30 `qcm_multiple` (8 à 2 bonnes réponses, 22 à 3), 30 `vrai_faux` (17 vrais, 13 faux), 15 `reponse_courte` (dont 4 avec une marge).
- Difficultés : 63 / 59 / 28 (niveaux 1 / 2 / 3).
- Bonne réponse des `qcm_unique` en position 1 à 4 : 19 / 19 / 18 / 19 ; strictement la plus longue dans 14 cas sur 75 (19 %).
- Statuts : 150 `valide`, 0 `a_relire`.

## Relecture indépendante à l'aveugle

Un sous-agent, sans accès aux réponses ni aux explications, a résolu les 150 questions à partir du seul texte du chapitre, en refaisant chaque calcul ; ses réponses ont été comparées automatiquement à la banque, puis chaque écart et chaque remarque ont été examinés et corrigés. Détail : `banques/ens-sci-ch1-relecture.md`.

- Concordance initiale : **150/150**.
- Écarts : **0**.
- Remarques (concordantes commentées ou de confiance inférieure à 3) : **34**.
- Répartition des remarques :
  - erreurs de la banque : 0 ;
  - ambiguïtés : 1 (099, écriture scientifique non normalisée) ;
  - distracteurs défendables : 1 (056) ;
  - faits absents du texte du cours : 2 (048, 051 : pourcentages du corps humain présents seulement dans la figure) ;
  - variantes de réponses courtes manquantes : 9 (030, 045, 060, 106, 107, 123, 124, 137, 150) ;
  - erreurs du relecteur : 0 ;
  - remarques sans correction nécessaire : 21 (calculs confirmés ou commentaires de niveau : 015, 035, 037, 044, 054, 055, 078, 086, 089, 091, 092, 094, 097, 101, 108, 114, 116, 119, 129, 140, 143).

Questions laissées à relire : aucune.

Notions (10) :

| Notion | Questions |
| --- | --- |
| Noyaux et éléments chimiques | 14 |
| Nucléosynthèse stellaire | 16 |
| Fusion et fission | 15 |
| Abondance des éléments | 15 |
| Histoire de la radioactivité | 12 |
| Radioactivité et hasard | 14 |
| Demi-vie et décroissance | 22 |
| Datation radioactive | 16 |
| Radioactivité en médecine | 13 |
| Précautions et radioprotection | 13 |
