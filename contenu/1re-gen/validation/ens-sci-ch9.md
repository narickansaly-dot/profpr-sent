# Validation d'enseignement scientifique (1re), chapitre 9 : « L'histoire de l'âge de la Terre »

Rapport produit par script le 16/11/2026, sur `contenu/1re-gen/ens-sci.json` après fusion de la banque. Les scripts `banque:*` du dépôt ne connaissent que les cours de 1re ST2S : les contrôles ont été lancés par un script hors dépôt qui appelle les mêmes fonctions (`analyserImport`, `verifierBanque`, `fusionnerBanque`, `nettoyerHtml`, `versDonneesCours`) avec les quotas de 150 questions (voir `ens-sci-bilan.md`).

## Cours

- 7 sections, 21980 caractères de HTML hors figures (33622 avec), 3 figures SVG, 8 objectifs, durée « 2 semaines ».
- Validateur d'import : valide. Nettoyage HTML : rien n'est retiré. Typographie : U+00A0, aucune entité `&nbsp;`.

## Banque de questions

- Vérificateur (`verifierBanque`, 17 règles, quotas 75 / 30 / 30 / 15 et 60 / 60 / 30, ± 3) : « Banque du chapitre 9 conforme : 150 questions. »
- Types : 75 `qcm_unique`, 30 `qcm_multiple` (16 à 2 bonnes réponses, 14 à 3), 30 `vrai_faux` (16 vrais, 14 faux), 15 `reponse_courte` (dont 2 avec une marge).
- Difficultés : 61 / 60 / 29 (niveaux 1 / 2 / 3).
- Bonne réponse des `qcm_unique` en position 1 à 4 : 19 / 19 / 19 / 18 ; strictement la plus longue dans 1 cas sur 75 (1 %).
- Statuts : 150 `valide`, 0 `a_relire`.

## Relecture indépendante à l'aveugle

Un sous-agent, sans accès aux réponses ni aux explications, a résolu les 150 questions à partir du seul texte du chapitre, en refaisant chaque calcul ; ses réponses ont été comparées automatiquement à la banque, puis chaque écart et chaque remarque ont été examinés et corrigés. Détail : `banques/ens-sci-ch9-relecture.md`.

- Concordance initiale : **150/150**.
- Écarts : **0**.
- Remarques (questions concordantes commentées ou à confiance < 3) : **51**.
- Répartition des 51 remarques :
  - erreurs de la banque : 1 (068 : chronologie fausse, venue du cours, qui faisait retirer à Darwin son calcul « face à Kelvin » en 1861, alors que Kelvin publie en 1862) ;
  - ambiguïtés de formulation : 7 (018, 035, 043, 059, 070, 120, 130) ;
  - distracteurs défendables : 0 ;
  - variantes de réponse courte manquantes : 6 (014, 027, 056, 057, 083, 118) ;
  - questions qui reprenaient les données d'un exemple « Méthode » du cours : 2 (048, 103) ;
  - erreurs du relecteur ou remarques sans suite : 35. Ce sont des calculs vérifiés et justes (020, 040, 041, 049, 078, 091, 092, 096, 102, 106, 112, 125, 126, 127, 128, 131, 134, 135), des variantes déjà acceptées (026, 103 : « 1.4 » ; 132 : « 34 » et « 35 » étaient déjà acceptés, avec une marge de 1 ; 146 : « Charles Lyell » était déjà accepté) et des formulations correctes jugées acceptables par le relecteur lui-même (006, 013, 022, 029, 038, 054, 064, 066, 099, 100, 104, 105, 119, 149).

Questions laissées à relire : aucune.

Notions (10) :

| Notion | Questions |
| --- | --- |
| Récits, croyances et savoirs | 14 |
| Buffon et le refroidissement | 15 |
| Kelvin et la chaleur interne | 15 |
| Empilements sédimentaires | 16 |
| Darwin et le temps de l'évolution | 11 |
| Radioactivité et demi-vie | 15 |
| Datation radiométrique | 20 |
| Patterson et les météorites | 16 |
| Ordres de grandeur des durées | 13 |
| Controverse et démarches | 15 |
