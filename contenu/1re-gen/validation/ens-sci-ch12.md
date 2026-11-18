# Validation d'enseignement scientifique (1re), chapitre 12 : « Le son, une information à coder »

Rapport produit par script le 16/11/2026, sur `contenu/1re-gen/ens-sci.json` après fusion de la banque. Les scripts `banque:*` du dépôt ne connaissent que les cours de 1re ST2S : les contrôles ont été lancés par un script hors dépôt qui appelle les mêmes fonctions (`analyserImport`, `verifierBanque`, `fusionnerBanque`, `nettoyerHtml`, `versDonneesCours`) avec les quotas de 150 questions (voir `ens-sci-bilan.md`).

## Cours

- 8 sections, 21984 caractères de HTML hors figures (38139 avec), 3 figures SVG, 7 objectifs, durée « 2 semaines ».
- Validateur d'import : valide. Nettoyage HTML : rien n'est retiré. Typographie : U+00A0, aucune entité `&nbsp;`.

## Banque de questions

- Vérificateur (`verifierBanque`, 17 règles, quotas 75 / 30 / 30 / 15 et 60 / 60 / 30, ± 3) : « Banque du chapitre 12 conforme : 150 questions. »
- Types : 75 `qcm_unique`, 30 `qcm_multiple` (14 à 2 bonnes réponses, 16 à 3), 30 `vrai_faux` (15 vrais, 15 faux), 15 `reponse_courte` (dont 2 avec une marge).
- Difficultés : 59 / 62 / 29 (niveaux 1 / 2 / 3).
- Bonne réponse des `qcm_unique` en position 1 à 4 : 19 / 19 / 19 / 18 ; strictement la plus longue dans 0 cas sur 75 (0 %).
- Statuts : 150 `valide`, 0 `a_relire`.

## Relecture indépendante à l'aveugle

Un sous-agent, sans accès aux réponses ni aux explications, a résolu les 150 questions à partir du seul texte du chapitre, en refaisant chaque calcul ; ses réponses ont été comparées automatiquement à la banque, puis chaque écart et chaque remarque ont été examinés et corrigés. Détail : `banques/ens-sci-ch12-relecture.md`.

- Concordance initiale : **150/150**.
- Écarts : **0**.
- Remarques (questions concordantes commentées ou à confiance < 3) : **34**.
- Répartition des 34 remarques :
  - erreurs de la banque : 0 ;
  - ambiguïtés : 6 (009 et 085, incohérence du cours sur le critère de Shannon ; 030 et 130, listes de propositions incomplètes ; 134, formulation inhabituelle ; 135, ZIP d'un WAV) ;
  - distracteurs défendables : 0 ;
  - variantes de réponse courte manquantes : 8 (047, 049, 050, 097, 098, 100, 146, 150) ;
  - erreurs du relecteur ou remarques sans suite : 20. Ce sont des calculs vérifiés et justes (057, 058, 064, 067, 068, 078, 079, 083, 108, 113, 114, 120, 121, 129, 131, 149) et des variantes déjà acceptées, directement ou par la normalisation qui ignore la casse et les accents (048, 099, 147, 148).

Questions laissées à relire : aucune.

Notions (10) :

| Notion | Questions |
| --- | --- |
| Analogique et numérique | 17 |
| Échantillonnage | 20 |
| Quantification | 15 |
| Unités : bits et octets | 14 |
| Taille d'un fichier audio | 17 |
| Compression avec ou sans perte | 15 |
| Stockage et énergie | 15 |
| Histoire du son enregistré | 13 |
| Choix des paramètres | 10 |
| Taux de compression et débit | 14 |
