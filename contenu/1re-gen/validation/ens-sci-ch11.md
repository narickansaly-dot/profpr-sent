# Validation d'enseignement scientifique (1re), chapitre 11 : « Son et musique »

Rapport produit par script le 16/11/2026, sur `contenu/1re-gen/ens-sci.json` après fusion de la banque. Les scripts `banque:*` du dépôt ne connaissent que les cours de 1re ST2S : les contrôles ont été lancés par un script hors dépôt qui appelle les mêmes fonctions (`analyserImport`, `verifierBanque`, `fusionnerBanque`, `nettoyerHtml`, `versDonneesCours`) avec les quotas de 150 questions (voir `ens-sci-bilan.md`).

## Cours

- 7 sections, 21970 caractères de HTML hors figures (38129 avec), 3 figures SVG, 7 objectifs, durée « 3 semaines ».
- Validateur d'import : valide. Nettoyage HTML : rien n'est retiré. Typographie : U+00A0, aucune entité `&nbsp;`.

## Banque de questions

- Vérificateur (`verifierBanque`, 17 règles, quotas 75 / 30 / 30 / 15 et 60 / 60 / 30, ± 3) : « Banque du chapitre 11 conforme : 150 questions. »
- Types : 74 `qcm_unique`, 30 `qcm_multiple` (12 à 2 bonnes réponses, 18 à 3), 31 `vrai_faux` (17 vrais, 14 faux), 15 `reponse_courte` (dont 1 avec une marge).
- Difficultés : 60 / 60 / 30 (niveaux 1 / 2 / 3).
- Bonne réponse des `qcm_unique` en position 1 à 4 : 18 / 19 / 18 / 19 ; strictement la plus longue dans 4 cas sur 74 (5 %).
- Statuts : 150 `valide`, 0 `a_relire`.

## Relecture indépendante à l'aveugle

Un sous-agent, sans accès aux réponses ni aux explications, a résolu les 150 questions à partir du seul texte du chapitre, en refaisant chaque calcul ; ses réponses ont été comparées automatiquement à la banque, puis chaque écart et chaque remarque ont été examinés et corrigés. Détail : `banques/ens-sci-ch11-relecture.md`.

- Concordance initiale : **150/150**.
- Écarts : **0**.
- Remarques (questions concordantes commentées ou à confiance < 3) : **30**.
- Répartition des 30 remarques :
  - erreurs de la banque : 0 ;
  - ambiguïtés de formulation : 5 (070, 115, 132, 135, 144) ;
  - distracteurs défendables ou peu crédibles : 1 (048) ;
  - variantes de réponse courte manquantes : 1 (008) ;
  - erreurs du relecteur ou remarques sans suite : 23. Ce sont des calculs vérifiés et justes (017, 027, 032, 038, 065, 073, 074, 108, 110, 118, 130), des confirmations sans demande (011, 014, 037, 045, 094, 111, 150), des variantes déjà acceptées (046 « le timbre », 059 « 83 dB », 063 « 10⁴ » et « 10^4 », 103 « une octave » et « l'octave » ; quelques variantes de plus ont été ajoutées par prudence), et la 033, où « 1 650 » avec une espace n'est pas ajouté : l'énoncé demande d'écrire le nombre sans espace, conformément au guide des auteurs (partie 3).

Questions laissées à relire : aucune.

Notions (9) :

| Notion | Questions |
| --- | --- |
| Son pur et signal sinusoïdal | 20 |
| Son composé et spectre | 20 |
| Hauteur et timbre | 10 |
| Intensité et niveau sonore | 28 |
| Cordes vibrantes | 17 |
| Instruments à vent | 7 |
| Intervalles et octave | 19 |
| Gammes | 17 |
| Histoire de l'acoustique | 12 |
