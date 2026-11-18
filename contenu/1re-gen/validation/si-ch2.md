# Validation de sciences de l'ingénieur (1re générale), chapitre 2 : « Analyser un produit avec l'ingénierie système »

Rapport produit par script le 17/11/2026, sur `contenu/1re-gen/si.json` après fusion de la banque `banques/si-ch2.json`. Les scripts `banque:*` du dépôt ne connaissent pas ce cours : les contrôles ont été lancés avec un outil hors dépôt qui appelle les mêmes fonctions (`analyserImport`, `verifierBanque`, `fusionnerBanque`, `nettoyerHtml`, `versDonneesCours`), préfixe des sources `si-1re`, quotas de 150 questions.

## Cours

- Titre court « Ingénierie système », durée « 3 semaines », 7 sections, 55110 caractères de HTML, 5 figure(s) SVG, 7 objectifs.
- Validateur d'import : valide. Nettoyage HTML et typographie (U+00A0, pas d'entité `&nbsp;`, pas de `pre`/`code`) : « Nettoyage HTML et typographie : rien à signaler. »

## Banque de questions

- Vérificateur (quotas 75 / 30 / 30 / 15 et 60 / 60 / 30, ± 3) : « Banque du chapitre 2 conforme : 150 questions ; types 75/30/30/15 ; difficultés 60/60/30 ; vrai/faux 15 vrais. »
- Types : 75 `qcm_unique`, 30 `qcm_multiple` (9 à 2 bonnes réponses, 21 à 3), 30 `vrai_faux` (15 vrais, 15 faux), 15 `reponse_courte` (dont 0 avec une marge).
- Difficultés : 60 / 60 / 30 (niveaux 1 / 2 / 3).
- Bonne réponse des `qcm_unique` en position 1 à 4 : 19 / 19 / 19 / 18 ; strictement la plus longue dans 6 cas sur 75 (8 %).
- Relecture indépendante (résolution à l'aveugle, calculs refaits par script, comparaison, corrections) : `banques/si-ch2-relecture.md`.
- Statuts après relecture : 150 `valide`.

Notions (10) :

| Notion | Questions |
| --- | --- |
| Besoin, fonctions et cahier des charges | 15 |
| Critère, niveau et flexibilité | 15 |
| SysML et ses diagrammes | 15 |
| Frontière et cas d'utilisation | 15 |
| Diagramme des exigences | 15 |
| Composition et bdd | 15 |
| Ports, flux et ibd | 15 |
| Chaîne de puissance | 15 |
| Chaîne d'information | 15 |
| Analyse d'un produit réel | 15 |
