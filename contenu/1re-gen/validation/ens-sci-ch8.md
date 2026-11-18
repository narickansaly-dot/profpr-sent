# Validation d'enseignement scientifique (1re), chapitre 8 : « La forme de la Terre »

Rapport produit par script le 16/11/2026, sur `contenu/1re-gen/ens-sci.json` après fusion de la banque. Les scripts `banque:*` du dépôt ne connaissent que les cours de 1re ST2S : les contrôles ont été lancés par un script hors dépôt qui appelle les mêmes fonctions (`analyserImport`, `verifierBanque`, `fusionnerBanque`, `nettoyerHtml`, `versDonneesCours`) avec les quotas de 150 questions (voir `ens-sci-bilan.md`).

## Cours

- 7 sections, 21498 caractères de HTML hors figures (29386 avec), 5 figures SVG, 7 objectifs, durée « 3 semaines ».
- Validateur d'import : valide. Nettoyage HTML : rien n'est retiré. Typographie : U+00A0, aucune entité `&nbsp;`.

## Banque de questions

- Vérificateur (`verifierBanque`, 17 règles, quotas 75 / 30 / 30 / 15 et 60 / 60 / 30, ± 3) : « Banque du chapitre 8 conforme : 150 questions. »
- Types : 75 `qcm_unique`, 30 `qcm_multiple` (15 à 2 bonnes réponses, 15 à 3), 30 `vrai_faux` (14 vrais, 16 faux), 15 `reponse_courte` (dont 7 avec une marge).
- Difficultés : 57 / 61 / 32 (niveaux 1 / 2 / 3).
- Bonne réponse des `qcm_unique` en position 1 à 4 : 17 / 19 / 20 / 19 ; strictement la plus longue dans 13 cas sur 75 (17 %).
- Statuts : 150 `valide`, 0 `a_relire`.

## Relecture indépendante à l'aveugle

Un sous-agent, sans accès aux réponses ni aux explications, a résolu les 150 questions à partir du seul texte du chapitre, en refaisant chaque calcul ; ses réponses ont été comparées automatiquement à la banque, puis chaque écart et chaque remarque ont été examinés et corrigés. Détail : `banques/ens-sci-ch8-relecture.md`.

- Concordance initiale : **150/150**.
- Écarts : **0**.
- Remarques (questions concordantes commentées ou à confiance < 3) : **34**.
- Répartition des 34 remarques :
  - erreurs de la banque : 1 (116, distracteur « Tout cercle passant par les deux pôles », qui est en fait juste) ;
  - ambiguïtés de formulation : 2 (032, 035) ;
  - distracteurs défendables ou qui trahissent la réponse : 3 (014, 018, 129) ;
  - variantes ou tolérances de réponse courte : 11 (046, 049, 050, 096, 097, 098, 100, 146, 147, 148, 150) ; pour 097, 100 et 150, la marge relative acceptait déjà le résultat obtenu avec π ≈ 3,14 : seule l'explication est précisée ;
  - erreurs du relecteur ou remarques sans suite : 17. Ce sont des calculs vérifiés et justes (023, 059, 060, 075, 079, 084, 095, 099, 113, 114, 122, 123, 124, 132, 135, 149) et une remarque sans conséquence (010 : l'Égypte n'est pas citée dans le cours, mais la question repose sur « vers le sud », qui l'est).

Questions laissées à relire : aucune.

Notions (9) :

| Notion | Questions |
| --- | --- |
| Preuves de la rotondité | 13 |
| Une sphère presque parfaite | 6 |
| Savoir et croyance | 6 |
| Méthode d'Ératosthène | 27 |
| Triangulation et définition du mètre | 23 |
| Rayon et longueur du méridien | 13 |
| Distance à l'horizon | 15 |
| Latitude, longitude, altitude | 25 |
| Grand cercle et plus court chemin | 22 |
