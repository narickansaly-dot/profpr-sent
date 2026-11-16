# Validation d'enseignement scientifique (1re), chapitre 4 : « Le rayonnement solaire »

Rapport produit par script le 16/11/2026, sur `contenu/1re-gen/ens-sci.json` après fusion de la banque. Les scripts `banque:*` du dépôt ne connaissent que les cours de 1re ST2S : les contrôles ont été lancés par un script hors dépôt qui appelle les mêmes fonctions (`analyserImport`, `verifierBanque`, `fusionnerBanque`, `nettoyerHtml`, `versDonneesCours`) avec les quotas de 150 questions (voir `ens-sci-bilan.md`).

## Cours

- 8 sections, 26216 caractères de HTML hors figures (34476 avec), 3 figures SVG, 8 objectifs, durée « 3 semaines ».
- Validateur d'import : valide. Nettoyage HTML : rien n'est retiré. Typographie : U+00A0, aucune entité `&nbsp;`.

## Banque de questions

- Vérificateur (`verifierBanque`, 17 règles, quotas 75 / 30 / 30 / 15 et 60 / 60 / 30, ± 3) : « Banque du chapitre 4 conforme : 150 questions. »
- Types : 75 `qcm_unique`, 30 `qcm_multiple` (15 à 2 bonnes réponses, 15 à 3), 30 `vrai_faux` (16 vrais, 14 faux), 15 `reponse_courte` (dont 12 avec une marge).
- Difficultés : 60 / 60 / 30 (niveaux 1 / 2 / 3).
- Bonne réponse des `qcm_unique` en position 1 à 4 : 19 / 19 / 19 / 18 ; strictement la plus longue dans 3 cas sur 75 (4 %).
- Statuts : 150 `valide`, 0 `a_relire`.

## Relecture indépendante à l'aveugle

Un sous-agent, sans accès aux réponses ni aux explications, a résolu les 150 questions à partir du seul texte du chapitre, en refaisant chaque calcul ; ses réponses ont été comparées automatiquement à la banque, puis chaque écart et chaque remarque ont été examinés et corrigés. Détail : `banques/ens-sci-ch4-relecture.md`.

- Concordance initiale : **150/150**.
- Écarts : **0**.
- Remarques (questions concordantes commentées ou à confiance < 3) : **42**.
- Répartition des 42 remarques :
  - erreurs de la banque : 1 (052, distracteur qui classait 78 µm dans les micro-ondes) ;
  - ambiguïtés de formulation : 5 (025, 038, 071, 116, 127) ;
  - distracteurs défendables : 0 ;
  - variantes de réponse courte manquantes : 10 (029, 030, 061, 062, 063, 078, 108, 120, 134, 150) ;
  - erreurs du relecteur ou remarques sans suite : 26. Ce sont des calculs vérifiés et justes (021, 022, 028, 037, 050, 051, 057, 068, 075, 076, 082, 083, 088, 093, 122, 123), des variantes déjà couvertes par la normalisation ou par la marge (015, 045, 077, 133), des questions faciles mais correctes (008, 023, 104, 117, 139) et la notation ⁰₁e du positon (006), qui est celle des manuels.

Questions laissées à relire : aucune.

Notions (10) :

| Notion | Questions |
| --- | --- |
| Fusion de l'hydrogène dans le Soleil | 15 |
| Équivalence masse-énergie | 15 |
| Ondes électromagnétiques | 15 |
| Corps noir et loi de Wien | 18 |
| Loi de Stefan | 15 |
| Inclinaison et puissance reçue | 15 |
| Variations journalières et saisons | 15 |
| Latitude et zones climatiques | 12 |
| Moyennes de températures | 14 |
| Rayonnement solaire et santé | 16 |
