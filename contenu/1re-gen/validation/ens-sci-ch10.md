# Validation d'enseignement scientifique (1re), chapitre 10 : « La Terre dans l'Univers »

Rapport produit par script le 16/11/2026, sur `contenu/1re-gen/ens-sci.json` après fusion de la banque. Les scripts `banque:*` du dépôt ne connaissent que les cours de 1re ST2S : les contrôles ont été lancés par un script hors dépôt qui appelle les mêmes fonctions (`analyserImport`, `verifierBanque`, `fusionnerBanque`, `nettoyerHtml`, `versDonneesCours`) avec les quotas de 150 questions (voir `ens-sci-bilan.md`).

## Cours

- 7 sections, 19915 caractères de HTML hors figures (30247 avec), 3 figures SVG, 7 objectifs, durée « 3 semaines ».
- Validateur d'import : valide. Nettoyage HTML : rien n'est retiré. Typographie : U+00A0, aucune entité `&nbsp;`.

## Banque de questions

- Vérificateur (`verifierBanque`, 17 règles, quotas 75 / 30 / 30 / 15 et 60 / 60 / 30, ± 3) : « Banque du chapitre 10 conforme : 150 questions. »
- Types : 75 `qcm_unique`, 30 `qcm_multiple` (21 à 2 bonnes réponses, 9 à 3), 30 `vrai_faux` (16 vrais, 14 faux), 15 `reponse_courte` (dont 6 avec une marge).
- Difficultés : 60 / 60 / 30 (niveaux 1 / 2 / 3).
- Bonne réponse des `qcm_unique` en position 1 à 4 : 18 / 19 / 19 / 19 ; strictement la plus longue dans 9 cas sur 75 (12 %).
- Statuts : 150 `valide`, 0 `a_relire`.

## Relecture indépendante à l'aveugle

Un sous-agent, sans accès aux réponses ni aux explications, a résolu les 150 questions à partir du seul texte du chapitre, en refaisant chaque calcul ; ses réponses ont été comparées automatiquement à la banque, puis chaque écart et chaque remarque ont été examinés et corrigés. Détail : `banques/ens-sci-ch10-relecture.md`.

- Concordance initiale : **150/150**.
- Écarts : **0**.
- Remarques (questions concordantes commentées ou à confiance < 3) : **35**.
- Répartition des 35 remarques :
  - erreurs de la banque : 0 ;
  - ambiguïtés de formulation : 8 (007, 083, 094, 098, 100, 111, 135, 138) ;
  - distracteurs défendables : 0 ;
  - variantes de réponse courte manquantes ou à compléter : 8 (047, 048, 050, 096, 097, 099, 146, 147) ; pour 050 et 099, la variante citée (« quatre », « rotation synchrone ») était déjà acceptée, d'autres ont été ajoutées ;
  - erreurs du relecteur ou remarques sans suite : 19. Ce sont des calculs vérifiés et justes (008, 105, 117, 119, 120, 121, 124, 126, 132, 134, 143, 145, 148), des questions jugées correctes par le relecteur lui-même (029, 066, 078, 093), et deux nombres demandés « sans espace » pour lesquels l'écriture « 1 700 » ou « 1 500 » n'est pas ajoutée, conformément au guide (149, 150).

Questions laissées à relire : aucune.

Notions (11) :

| Notion | Questions |
| --- | --- |
| Référentiels et orbite terrestre | 17 |
| Géocentrisme et héliocentrisme | 19 |
| Arguments historiques | 14 |
| Phases de la Lune | 26 |
| Rotation synchrone de la Lune | 11 |
| Lune : origine et croyances | 10 |
| Eau liquide et zone d'habitabilité | 14 |
| Exoplanètes | 8 |
| Répartition de l'eau sur Terre | 10 |
| Volume d'une réserve d'eau | 10 |
| Ressource en eau et stress hydrique | 11 |
