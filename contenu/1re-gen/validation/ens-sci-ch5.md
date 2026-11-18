# Validation d'enseignement scientifique (1re), chapitre 5 : « Le bilan radiatif terrestre »

Rapport produit par script le 16/11/2026, sur `contenu/1re-gen/ens-sci.json` après fusion de la banque. Les scripts `banque:*` du dépôt ne connaissent que les cours de 1re ST2S : les contrôles ont été lancés par un script hors dépôt qui appelle les mêmes fonctions (`analyserImport`, `verifierBanque`, `fusionnerBanque`, `nettoyerHtml`, `versDonneesCours`) avec les quotas de 150 questions (voir `ens-sci-bilan.md`).

## Cours

- 8 sections, 21974 caractères de HTML hors figures (32533 avec), 3 figures SVG, 7 objectifs, durée « 3 semaines ».
- Validateur d'import : valide. Nettoyage HTML : rien n'est retiré. Typographie : U+00A0, aucune entité `&nbsp;`.

## Banque de questions

- Vérificateur (`verifierBanque`, 17 règles, quotas 75 / 30 / 30 / 15 et 60 / 60 / 30, ± 3) : « Banque du chapitre 5 conforme : 150 questions. »
- Types : 75 `qcm_unique`, 30 `qcm_multiple` (21 à 2 bonnes réponses, 9 à 3), 30 `vrai_faux` (15 vrais, 15 faux), 15 `reponse_courte` (dont 5 avec une marge).
- Difficultés : 60 / 60 / 30 (niveaux 1 / 2 / 3).
- Bonne réponse des `qcm_unique` en position 1 à 4 : 19 / 19 / 19 / 18 ; strictement la plus longue dans 11 cas sur 75 (15 %).
- Statuts : 150 `valide`, 0 `a_relire`.

## Relecture indépendante à l'aveugle

Un sous-agent, sans accès aux réponses ni aux explications, a résolu les 150 questions à partir du seul texte du chapitre, en refaisant chaque calcul ; ses réponses ont été comparées automatiquement à la banque, puis chaque écart et chaque remarque ont été examinés et corrigés. Détail : `banques/ens-sci-ch5-relecture.md`.

- Concordance initiale : **150/150**.
- Écarts : **0**. Remarques (questions concordantes commentées) : **28**.
- Répartition des 28 remarques :
  - erreurs de la banque : 0 ;
  - ambiguïtés ou formulations à préciser : 9 (020, 039, 045, 050, 062, 100, 118, 129, et 143, quasi-doublon de 069) ;
  - distracteurs défendables : 0 ;
  - variantes de réponse courte manquantes : 3 (016, 069, 119) ;
  - erreurs du relecteur ou remarques sans suite : 16. Pour 114 et 148, les variantes signalées étaient déjà acceptées (une variante a tout de même été ajoutée à chacune). Pour 004, 008, 031, 041, 048, 060, 064, 083, 101, 102, 107, 123, 139 et 147, le relecteur a seulement confirmé le calcul ; pour 041, « 10,0 » est déjà accepté par la comparaison numérique.

Questions laissées à relire : aucune.

Notions (10) :

| Notion | Questions |
| --- | --- |
| Histoire des sciences du climat | 10 |
| Fraction captée par la Terre | 14 |
| Albédo | 27 |
| Effet de serre | 14 |
| Climat, société et esprit critique | 8 |
| Rayonnement infrarouge du sol | 18 |
| Bilan radiatif et équilibre | 13 |
| Constante solaire | 17 |
| Absorption par l'atmosphère | 16 |
| Puissance moyenne reçue | 13 |
