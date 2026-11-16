# Bilan : cours d'enseignement scientifique, première générale (tronc commun)

Cours `contenu/1re-gen/ens-sci.json` : slug `ens-sci-1re-gen`, filière `GEN`, niveau `1re`, matière « Enseignement scientifique », couleur `#6d28d9` (contraste 7,10:1 avec le blanc, au-dessus du minimum de 4,5:1). Rédigé du 11 au 16 novembre 2026 sur la branche `claude/contenu-1re-ens-sci-58d034` (commits locaux, sans push ni PR).

## Programme suivi

- **Texte en vigueur** : annexe de l'arrêté du 30 mai 2023, NOR **MENE2312806A**, **BO n° 25 du 22 juin 2023**. Elle remplace l'annexe de 2019 depuis la rentrée 2023.
- **Vérification pour 2026-2027** : la page Éduscol « Programmes et ressources en enseignement scientifique - voie G », mise à jour en octobre 2026, range toujours ce texte parmi les programmes en vigueur. Le seul texte récent est l'arrêté du 26 février 2026 (NOR MENE2602916A, BO n° 14 du 2 avril 2026). Il remplace le programme de **mathématiques intégré** à l'enseignement scientifique, mais pas le programme d'enseignement scientifique lui-même. Ce module de mathématiques relève du cours de mathématiques du tronc commun et n'est pas traité ici.
- J'ai lu le texte dans l'annexe PDF du BO, extraite avec le navigateur intégré et pdf.js. Résumé fidèle : `programmes/ens-sci-1re.md`, avec 66 savoirs [S1]–[S66] et 65 savoir-faire [F1]–[F65]. Plan : `programmes/ens-sci-1re-plan.md`.
- Le **projet expérimental et numérique** (douze heures, sujet libre) n'a pas de chapitre : ce n'est pas un contenu exigible.

## Chapitres et questions

Un chapitre par sous-partie du programme, dans l'ordre du texte officiel.

| N° | Chapitre | Programme | Sections | Figures | HTML hors figures | Questions | Remarques de relecture | Corrections |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Les éléments chimiques : de la nucléosynthèse à la radioactivité | 1.1 | 8 | 3 | 31 090 | 150 | 34 | 13 |
| 2 | Des édifices ordonnés : les cristaux | 1.2 | 8 | 3 | 25 108 | 150 | 27 | 8 |
| 3 | Une structure complexe : la cellule vivante | 1.3 | 8 | 3 | 23 635 | 150 | 33 | 10 |
| 4 | Le rayonnement solaire | 2.1 | 8 | 3 | 26 216 | 150 | 42 | 16 |
| 5 | Le bilan radiatif terrestre | 2.2 | 8 | 3 | 21 974 | 150 | 28 | 15 |
| 6 | De la photosynthèse à l'énergie des êtres vivants | 2.3 | 8 | 3 | 19 774 | 150 | 33 | 14 |
| 7 | Les sources d'énergie utilisables par l'humanité | 2.4 | 8 | 3 | 21 793 | 150 | 37 | 11 |
| 8 | La forme de la Terre | 3.1 | 7 | 5 | 21 498 | 150 | 34 | 17 |
| 9 | L'histoire de l'âge de la Terre | 3.2 | 7 | 3 | 21 980 | 150 | 51 | 23 |
| 10 | La Terre dans l'Univers | 3.3 | 7 | 3 | 19 915 | 150 | 35 | 16 |
| 11 | Son et musique | 4.1 | 7 | 3 | 21 970 | 150 | 30 | 11 |
| 12 | Le son, une information à coder | 4.2 | 8 | 3 | 21 984 | 150 | 34 | 15 |
| 13 | Entendre et protéger son audition | 4.3 | 8 | 3 | 22 069 | 150 | 40 | 14 |
| | **Total** | | **101** | **41** | | **1 950** | **458** | **183** |

Lecture des trois dernières colonnes :

- **Remarques de relecture** : questions dont la réponse concordait mais que le relecteur à l'aveugle a commentées, ou auxquelles il a répondu avec une confiance inférieure à 3.
- **Corrections** : lignes du tableau « Corrections faites » de chaque `banques/ens-sci-chN-relecture.md`. Une ligne peut regrouper plusieurs questions.

Contenu des chapitres :

- Chaque chapitre a un résumé, un chapeau, des objectifs, des sections en HTML autorisé et une zone « Je retiens ». Le HTML utilise les encadrés `.def` et `.warn`, les tableaux `.tbl` et des figures SVG en ligne `.fig`.
- Les formules sont écrites avec `sup`, `sub` et des caractères Unicode, sans MathML ni LaTeX.
- Chaque chapitre contient de l'histoire des sciences et un exemple « science et société ». Les valeurs utiles aux questions sont dans le texte, pas seulement dans les figures.

Chaque banque compte 150 questions :

- types : 75 `qcm_unique`, 30 `qcm_multiple`, 30 `vrai_faux` et 15 `reponse_courte`, à ± 1 près ;
- difficultés : 60 / 60 / 30 pour les niveaux 1 / 2 / 3, à ± 3 près ;
- 8 à 12 notions par chapitre.

Le détail par chapitre est dans `validation/ens-sci-chN.md`.

## Relecture indépendante de chaque quiz

Pour chaque banque, la méthode a été la même :

1. **Résolution à l'aveugle.** Un sous-agent distinct du rédacteur a résolu les 150 questions. Il n'avait que le texte du chapitre et les questions, sans réponses ni explications, et a refait chaque calcul avec python.
2. **Comparaison automatique** de ses réponses avec la banque.
3. **Examen par le rédacteur** de chaque écart et de chaque remarque, selon cinq catégories : erreur de la banque, ambiguïté, distracteur défendable, variante de réponse courte manquante, erreur du relecteur.
4. **Correction et nouveau contrôle** de la banque, puis compte rendu dans `banques/ens-sci-chN-relecture.md`.

Résultats :

- **Concordance initiale : 150/150 pour les 13 banques**, soit 1 950 sur 1 950. La relecture n'a révélé aucune bonne réponse fausse.
- **458 remarques examinées.** Elles ont conduit à 183 lignes de corrections. Les erreurs de fond corrigées sont les suivantes :
  - ch. 8, question 116 : le distracteur « tout cercle passant par les deux pôles » était juste, donc la question avait deux bonnes réponses ;
  - ch. 4, question 052 : distracteur mal classé (78 µm dans les « micro-ondes ») ;
  - ch. 9 : chronologie Darwin-Kelvin fausse dans le cours (Darwin retirait son calcul en 1861 « face à Kelvin », qui ne publie qu'en 1862) ;
  - ch. 12 : critère de Shannon incohérent dans le cours (inégalité stricte, mais téléphone à 8 kHz pour 4 kHz) ;
  - ch. 1, 6, 7 et 13 : faits demandés par les questions mais présents seulement dans une figure, désormais écrits dans le texte ;
  - ch. 5 : l'ozone n'absorbe que les UV les plus énergétiques ;
  - ch. 3 : l'ADN n'est pas seulement dans le noyau, et l'eau passe aussi par des protéines ;
  - ch. 9 : énoncé piégeux (« dix fois » au lieu de cinquante).
- **Le reste** :
  - variantes ajoutées aux réponses courtes (articles, pluriels, symboles, point décimal, notation scientifique) ;
  - marges ajoutées ou précisées sur les arrondis (π, 3,75 ou 4 min) ;
  - distracteurs peu crédibles remplacés ;
  - questions qui recopiaient un exemple du cours modifiées ;
  - qcm_multiple rééquilibrés entre 2 et 3 bonnes réponses (ch. 9) ;
  - quelques doublons remplacés.
- J'ai fait moi-même une correction transversale : j'ai retiré 15 variantes de réponses courtes écrites avec un séparateur de milliers (« 5 800 »), que le guide interdit. Les énoncés concernés demandent le nombre sans espace.

## Statuts

- Le dépôt passe au statut `valide` les questions relues dont les points de doute ont été tranchés (commits 67d1671 et 90bd11c ; guide, partie 2). J'ai appliqué la même règle.
- **Les 1 950 questions sont `valide`.** Aucun compte rendu de relecture ne laisse de question réellement douteuse dans « Questions laissées à relire » :
  - les doutes de fond ont été corrigés ;
  - les doutes restants portent sur des valeurs à aligner sur le manuel de la classe (liste ci-dessous) et ne rendent aucune question fausse.
- **Réserve** : la validation repose sur une relecture par des agents, pas par un enseignant. Si l'équipe veut une seconde lecture humaine avant la mise en quiz, il suffit de réimporter avec les statuts du fichier passés à `a_relire`.

## Validation technique

| Contrôle | Résultat |
| --- | --- |
| Validateur d'import (`analyserImport`, celui de `/admin/import`) | cours valide : 13 chapitres, 1 950 questions |
| Taille du fichier | 1 910 907 octets (3 Mo au plus) |
| Couleur (`couleurCoursAcceptable`) | acceptée, contraste 7,10:1 |
| Nettoyage HTML (`nettoyerHtml`) | rien n'est retiré, dans aucune section |
| Typographie | U+00A0 avant « : ; ! ? » ; aucune entité `&nbsp;` |
| `verifierBanque` (17 règles, quotas de 150) | les 13 banques sont conformes |
| Fusion (`fusionnerBanque`) | 13 × 150 questions ajoutées ; une seconde fusion n'ajoute rien |
| Cohérence banques / cours | contenu identique ; seule la valeur par défaut `marge_relative: false`, ajoutée par la fusion, diffère |
| Import à blanc (`versDonneesCours`) | charge utile `importer_cours` construite (1 694 491 octets), aucune base contactée |
| Réponses courtes | pas de séparateur de milliers ; marge seulement sur des références qui sont des nombres seuls |

**L'import réel n'a pas été fait** : le worktree n'a pas de `.env.local` et aucune base locale ne tournait. À faire, sans `--publier` :

```bash
npm run import:contenu -- contenu/1re-gen/ens-sci.json --garder-statuts
```

## Changement de script à prévoir (non fait)

Les commandes `npm run banque:texte`, `banque:verifier` et `banque:fusionner` n'acceptent que `--cours bph|stss`, avec des chemins figés sous `contenu/1re-st2s/` (`src/lib/contenu/banque/cours.ts`). Les contrôles ont donc été lancés avec un script externe qui appelle les mêmes fonctions, celui des sessions de seconde (`pilote-banques-svt.ts`).

Il faudrait ajouter les cours de 1re générale à `COURS_BANQUE` (préfixe `ens-sci`, 150 questions) et dériver le dossier des banques du chemin du cours. Les sessions de 2de ont fait le même constat.

## Points à trancher par l'enseignant

1. **Plan non validé avant rédaction.** Le cours compte 13 chapitres, un par sous-partie, soit 35 semaines selon les durées indiquées, pour 2 h par semaine : c'est beaucoup. Regroupements possibles : 11 avec 12 (son et numérisation), 9 avec 8 ou 10 (âge de la Terre). Le programme impose au moins trois thèmes et laisse l'ordre libre.
2. **Longueur des chapitres.** La cible était de 22 000 caractères de HTML hors figures. Cinq chapitres la dépassent nettement :
   - ch. 1 : 31 000 ;
   - ch. 4 : 26 200 ;
   - ch. 2 : 25 100 ;
   - ch. 3 : 23 600 ;
   - ch. 13 : 22 100.

   Ce n'est pas une limite technique : les sous-parties sont denses. Une coupe demande de vérifier les questions qui s'appuient sur chaque passage.
3. **Valeurs à aligner sur le manuel de la classe.** Le détail est dans la section « Points de doute » de chaque `-relecture.md`. Principales valeurs :
   - abondances des éléments (ch. 1) ;
   - demi-vie du carbone 14 : 5 730 ans ou 5 700 ans (ch. 1) ;
   - paramètres de maille et masses volumiques (ch. 2) ;
   - épaisseur de la membrane : 7,5 nm (ch. 3) ;
   - température de surface du Soleil : 5 800 K ; visible de 400 à 800 nm ; inclinaison de l'axe de 23,4° (ch. 4) ;
   - flux du bilan radiatif et albédos (ch. 5) ;
   - lipides à 38 kJ/g, alors que l'étiquetage européen utilise 37 kJ/g (ch. 6) ;
   - pouvoirs calorifiques et réserves fossiles (ch. 7) ;
   - longueur du stade et rayon terrestre de 6 371 km (ch. 8) ;
   - estimations de Kelvin et de Buffon (ch. 9) ;
   - répartition de l'eau, bornes de la zone d'habitabilité (0,95 à 1,4 ua) et seuils de stress hydrique (ch. 10) ;
   - échelle des niveaux sonores (ch. 11) ;
   - capacité d'un CD (ch. 12) ;
   - facteur d'amplification de l'oreille moyenne et nombre de cellules ciliées (ch. 13).
4. **Conventions à confirmer.**
   - Taux de compression défini comme la part supprimée (ch. 12).
   - Ordre de grandeur obtenu en comparant le coefficient à 5 plutôt qu'à √10 (ch. 3).
   - P = P<sub>max</sub> × cos θ, introduite alors que le programme dit seulement que la puissance « dépend de l'angle » (ch. 4).
   - T = θ + 273.
   - Préfixes décimaux pour les octets (ch. 12).
   - Repère de prévention « + 3 dB : durée divisée par 2 » (ch. 13).
5. **Contenus au-delà du strict exigible**, utilisés par quelques questions de difficulté 3 :
   - loi des sinus et rayon d'un parallèle R × cos φ (ch. 8) ;
   - formule de la corde vibrante, donnée « pour information » (ch. 11) ;
   - couple potassium 40 → argon 40, présenté de façon simplifiée (ch. 9) ;
   - compacité, donnée à titre d'information (ch. 2).
6. **Données datées à mettre à jour chaque année** :
   - nombre d'exoplanètes (« plus de 6 000 en 2025 ») ;
   - CO₂ à plus de 420 ppm ;
   - chiffres de l'OMS (sous-alimentation, obésité, audition) ;
   - réglementation sonore (décret de 2017, code du travail) ;
   - réserves fossiles.
7. **Données d'exemple inventées**, annoncées comme telles dans le cours : températures mensuelles (ch. 4), enquête sur les acouphènes (ch. 13), boulet de Buffon (ch. 9).
8. **Thèmes sensibles** traités de façon factuelle :
   - croyances « Terre jeune » et procès Scopes (ch. 9) ;
   - Terre plate (ch. 8) ;
   - lithothérapie (ch. 2) ;
   - influence de la Lune sur les naissances (ch. 10).

   À relire en équipe si besoin.

## Fichiers

- `contenu/1re-gen/programmes/ens-sci-1re.md`, `ens-sci-1re-plan.md`
- `contenu/1re-gen/ens-sci.json` : le cours, avec ses 1 950 questions `valide`
- `contenu/1re-gen/banques/ens-sci-chN.json` et `ens-sci-chN-relecture.md`, pour N de 1 à 13
- `contenu/1re-gen/validation/ens-sci-chN.md` (N de 1 à 13) et ce bilan
