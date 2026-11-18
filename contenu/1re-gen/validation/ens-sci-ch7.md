# Validation d'enseignement scientifique (1re), chapitre 7 : « Les sources d'énergie utilisables par l'humanité »

Rapport produit par script le 16/11/2026, sur `contenu/1re-gen/ens-sci.json` après fusion de la banque. Les scripts `banque:*` du dépôt ne connaissent que les cours de 1re ST2S : les contrôles ont été lancés par un script hors dépôt qui appelle les mêmes fonctions (`analyserImport`, `verifierBanque`, `fusionnerBanque`, `nettoyerHtml`, `versDonneesCours`) avec les quotas de 150 questions (voir `ens-sci-bilan.md`).

## Cours

- 8 sections, 21793 caractères de HTML hors figures (34582 avec), 3 figures SVG, 8 objectifs, durée « 2 semaines ».
- Validateur d'import : valide. Nettoyage HTML : rien n'est retiré. Typographie : U+00A0, aucune entité `&nbsp;`.

## Banque de questions

- Vérificateur (`verifierBanque`, 17 règles, quotas 75 / 30 / 30 / 15 et 60 / 60 / 30, ± 3) : « Banque du chapitre 7 conforme : 150 questions. »
- Types : 75 `qcm_unique`, 30 `qcm_multiple` (14 à 2 bonnes réponses, 16 à 3), 30 `vrai_faux` (15 vrais, 15 faux), 15 `reponse_courte` (dont 1 avec une marge).
- Difficultés : 59 / 61 / 30 (niveaux 1 / 2 / 3).
- Bonne réponse des `qcm_unique` en position 1 à 4 : 19 / 19 / 19 / 18 ; strictement la plus longue dans 13 cas sur 75 (17 %).
- Statuts : 150 `valide`, 0 `a_relire`.

## Relecture indépendante à l'aveugle

Un sous-agent, sans accès aux réponses ni aux explications, a résolu les 150 questions à partir du seul texte du chapitre, en refaisant chaque calcul ; ses réponses ont été comparées automatiquement à la banque, puis chaque écart et chaque remarque ont été examinés et corrigés. Détail : `banques/ens-sci-ch7-relecture.md`.

- Concordance initiale : **150/150**.
- Écarts : **0**.
- Remarques (ou confiance inférieure à 3) : **37**.

Répartition des 37 remarques :

- erreurs de la banque : 0 ;
- ambiguïtés : 0 ;
- faits absents du texte du cours : 7 (111, 128, 105, 110, 127, 138, 146). Les pouvoirs calorifiques de la paille, du charbon et du gaz naturel ne figuraient que dans la figure 7.3 ;
- variantes de réponse courte manquantes : 5 (046, 048, 049, 149, 150) ;
- distracteur défendable : 1 (023) ;
- défauts de forme ou de pertinence pédagogique : 3 (018, 099, 142) ;
- erreurs du relecteur : 2 (097, 098). La normalisation ignore déjà les accents, donc « kerogene » et « methanisation » sont acceptés ;
- simples vérifications de calcul ou commentaires sans défaut : 19 (010, 014, 015, 031, 047, 050, 064, 095, 103, 104, 106, 108, 109, 112, 113, 129, 139, 147, 148).

Questions laissées à relire : aucune.

Notions (9) :

| Notion | Questions |
| --- | --- |
| Sources issues du Soleil | 15 |
| Sources non issues du Soleil | 11 |
| Stocks, flux et renouvelabilité | 22 |
| Histoire et vocabulaire de l'énergie | 12 |
| Formation des combustibles fossiles | 25 |
| Origine biologique des matériaux | 15 |
| Biomasse, combustion et fermentation | 10 |
| Pouvoir calorifique | 25 |
| Atouts et limites des sources | 15 |
