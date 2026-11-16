# Validation d'enseignement scientifique (1re), chapitre 13 : « Entendre et protéger son audition »

Rapport produit par script le 16/11/2026, sur `contenu/1re-gen/ens-sci.json` après fusion de la banque. Les scripts `banque:*` du dépôt ne connaissent que les cours de 1re ST2S : les contrôles ont été lancés par un script hors dépôt qui appelle les mêmes fonctions (`analyserImport`, `verifierBanque`, `fusionnerBanque`, `nettoyerHtml`, `versDonneesCours`) avec les quotas de 150 questions (voir `ens-sci-bilan.md`).

## Cours

- 8 sections, 22069 caractères de HTML hors figures (30494 avec), 3 figures SVG, 7 objectifs, durée « 2 semaines ».
- Validateur d'import : valide. Nettoyage HTML : rien n'est retiré. Typographie : U+00A0, aucune entité `&nbsp;`.

## Banque de questions

- Vérificateur (`verifierBanque`, 17 règles, quotas 75 / 30 / 30 / 15 et 60 / 60 / 30, ± 3) : « Banque du chapitre 13 conforme : 150 questions. »
- Types : 74 `qcm_unique`, 28 `qcm_multiple` (16 à 2 bonnes réponses, 12 à 3), 31 `vrai_faux` (16 vrais, 15 faux), 17 `reponse_courte` (dont 5 avec une marge).
- Difficultés : 61 / 60 / 29 (niveaux 1 / 2 / 3).
- Bonne réponse des `qcm_unique` en position 1 à 4 : 18 / 19 / 19 / 18 ; strictement la plus longue dans 11 cas sur 74 (15 %).
- Statuts : 150 `valide`, 0 `a_relire`.

## Relecture indépendante à l'aveugle

Un sous-agent, sans accès aux réponses ni aux explications, a résolu les 150 questions à partir du seul texte du chapitre, en refaisant chaque calcul ; ses réponses ont été comparées automatiquement à la banque, puis chaque écart et chaque remarque ont été examinés et corrigés. Détail : `banques/ens-sci-ch13-relecture.md`.

- Concordance initiale : **150/150**.
- Écarts : **0**.
- Remarques (questions concordantes commentées ou à confiance < 3) : **40**.
- Répartition des 40 remarques :
  - erreurs de la banque : 0 ;
  - ambiguïtés : 5 (029, bonne réponse « par 20 » qui coïncide avec le facteur global du cours ; 030, « 22 » calculé contre « environ 20 » dans le cours ; 092, arrondi de 3,75 min ; 126, double vitrage classé « trajet » ; 137, « n'est utile que si… ») ;
  - faits absents du texte du cours : 2 (035, l'air du conduit auditif n'était pas écrit ; 048, repères de fréquence seulement sur la figure 2) ;
  - distracteurs défendables : 0 ;
  - variantes de réponse courte manquantes : 7 (016, 063, 074, 078, 113, 139, 143) ;
  - erreurs du relecteur ou remarques sans suite : 26. Ce sont des calculs vérifiés et justes (057, 077, 081, 082, 084, 093, 094, 095, 096, 117, 118, 124, 144, 148), des lectures directes du cours (075, 080, 107, 108, 109, 114), des questions correctes commentées sans objection (014, 015, 136) et des variantes déjà couvertes par la normalisation ou par l'énoncé, qui demande d'écrire le nombre sans espace (023, 043, 056).

Questions laissées à relire : aucune.

Notions (8) :

| Notion | Questions |
| --- | --- |
| Domaine audible et seuils | 19 |
| Pathologies et audiogrammes | 16 |
| Oreille externe et moyenne | 18 |
| Cochlée et cellules ciliées | 19 |
| Cerveau et interprétation des sons | 17 |
| Niveau, durée et risque auditif | 26 |
| Protections et réglementation | 18 |
| Aides auditives et épidémiologie | 17 |
