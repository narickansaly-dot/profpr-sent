# Validation d'enseignement scientifique (1re), chapitre 2 : « Des édifices ordonnés : les cristaux »

Rapport produit par script le 16/11/2026, sur `contenu/1re-gen/ens-sci.json` après fusion de la banque. Les scripts `banque:*` du dépôt ne connaissent que les cours de 1re ST2S : les contrôles ont été lancés par un script hors dépôt qui appelle les mêmes fonctions (`analyserImport`, `verifierBanque`, `fusionnerBanque`, `nettoyerHtml`, `versDonneesCours`) avec les quotas de 150 questions (voir `ens-sci-bilan.md`).

## Cours

- 8 sections, 25108 caractères de HTML hors figures (41490 avec), 3 figures SVG, 7 objectifs, durée « 3 semaines ».
- Validateur d'import : valide. Nettoyage HTML : rien n'est retiré. Typographie : U+00A0, aucune entité `&nbsp;`.

## Banque de questions

- Vérificateur (`verifierBanque`, 17 règles, quotas 75 / 30 / 30 / 15 et 60 / 60 / 30, ± 3) : « Banque du chapitre 2 conforme : 150 questions. »
- Types : 75 `qcm_unique`, 30 `qcm_multiple` (19 à 2 bonnes réponses, 11 à 3), 30 `vrai_faux` (15 vrais, 15 faux), 15 `reponse_courte` (dont 4 avec une marge).
- Difficultés : 60 / 59 / 31 (niveaux 1 / 2 / 3).
- Bonne réponse des `qcm_unique` en position 1 à 4 : 19 / 19 / 19 / 18 ; strictement la plus longue dans 22 cas sur 75 (29 %).
- Statuts : 150 `valide`, 0 `a_relire`.

## Relecture indépendante à l'aveugle

Un sous-agent, sans accès aux réponses ni aux explications, a résolu les 150 questions à partir du seul texte du chapitre, en refaisant chaque calcul ; ses réponses ont été comparées automatiquement à la banque, puis chaque écart et chaque remarque ont été examinés et corrigés. Détail : `banques/ens-sci-ch2-relecture.md`.

- Concordance initiale : **150/150**.
- Écarts : **0**.
- Remarques (questions concordantes commentées) : **27**.
- Répartition des remarques :
  - erreurs de la banque (réponse ou calcul faux) : 0 ;
  - ambiguïtés corrigées : 5 (048, 098 et 150 : arrondi non précisé ; 053 : « masse atomique » ; 025 : arrondi différent de celui du cours) ;
  - énoncé ou explication à améliorer : 3 (012 : maille irréaliste ; 022 : réseau hors cours ; 084 : explication approximative) ;
  - distracteurs défendables : 0 ;
  - variantes manquantes : 0 (047, 049, 096, 097, 100 et 147 acceptaient déjà les variantes signalées ; 050 : le point décimal est accepté par la comparaison numérique) ;
  - erreurs du relecteur : 1 (149 : accepter « 32 768 » avec espace irait contre la règle du guide, qui interdit tout séparateur de milliers dans une réponse acceptée ; l'énoncé précise « sans espace ») ;
  - simples confirmations de calcul ou de raisonnement, sans action : 11 (045, 052, 063, 075, 082, 094, 095, 115, 120, 132, 139).

Questions laissées à relire : aucune.

Notions (12) :

| Notion | Questions |
| --- | --- |
| État cristallin | 13 |
| Maille et motif | 14 |
| Réseaux cubiques | 12 |
| Masse volumique | 19 |
| Polymorphisme | 16 |
| Minéraux et roches | 14 |
| Échelles de la matière | 10 |
| Cristaux du vivant | 15 |
| Solides amorphes et verre | 11 |
| Refroidissement des roches | 13 |
| Histoire de la cristallographie | 9 |
| Science et société | 4 |
