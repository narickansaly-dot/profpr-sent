# Bilan : cours de SES (spécialité), première générale

Sessions du 11 au 16 novembre 2026, branche `claude/contenu-1re-ses-52bb60` (commits réguliers, aucun push, aucune PR).

## Programme suivi

- **Arrêté du 17 janvier 2019**, JO du 20 janvier 2019, **NOR MENE1901639A**, BO spécial n° 1 du 22 janvier 2019 (annexe officielle téléchargée depuis le BO et lue en entier). Résumé et objectifs recopiés dans `programmes/ses-1re.md`.
- **En vigueur en 2026-2027 : oui, sans modification.** Les arrêtés du 26 février 2026 (BO n° 14 du 2 avril 2026) ne concernent que les mathématiques ; les textes récents de SES portent sur l'épreuve du baccalauréat et le programme de terminale. Le livret SES de l'académie de Grenoble mis à jour pour la rentrée 2026 cite toujours l'arrêté de 2019.
- Plan : `programmes/ses-1re-plan.md`. Les douze questionnements du BO donnent les chapitres 1 à 12, dans l'ordre du BO ; les savoir-faire quantitatifs sont travaillés dans les chapitres et regroupés dans un chapitre 13 « boîte à outils ». Tous les objectifs du programme sont couverts.

## Cours `ses.json`

Slug `ses-1re-gen`, filière `GEN`, niveau `1re`, matière `SES`, titre « Sciences économiques et sociales (spécialité) », couleur `#0f766e` (contraste 5,47:1 avec le blanc, accepté). Fichier de 1,66 Mo (limite 3 Mo). HTML limité à la liste blanche de `src/lib/contenu/html.ts` (classes `def`, `warn`, `tbl`, `fig`) ; un graphique SVG d'offre et de demande au chapitre 1 ; données de calcul fictives et signalées comme telles.

| N° | Chapitre | Durée | Sections | Questions |
|---|---|---|---|---|
| 1 | Comment un marché concurrentiel fonctionne-t-il ? | 4 semaines | 6 | 152 |
| 2 | Comment les marchés imparfaitement concurrentiels fonctionnent-ils ? | 3 semaines | 5 | 150 |
| 3 | Quelles sont les principales défaillances du marché ? | 3 semaines | 6 | 150 |
| 4 | Comment les agents économiques se financent-ils ? | 3 semaines | 6 | 150 |
| 5 | Qu'est-ce que la monnaie et comment est-elle créée ? | 3 semaines | 5 | 150 |
| 6 | Comment la socialisation contribue-t-elle à expliquer les différences de comportement des individus ? | 3 semaines | 4 | 150 |
| 7 | Comment se construisent et évoluent les liens sociaux ? | 3 semaines | 5 | 150 |
| 8 | Quels sont les processus sociaux qui contribuent à la déviance ? | 3 semaines | 6 | 150 |
| 9 | Comment se forme et s'exprime l'opinion publique ? | 2 semaines | 4 | 150 |
| 10 | Voter : une affaire individuelle ou collective ? | 3 semaines | 5 | 150 |
| 11 | Comment l'assurance et la protection sociale contribuent-elles à la gestion des risques dans les sociétés développées ? | 3 semaines | 6 | 150 |
| 12 | Comment les entreprises sont-elles organisées et gouvernées ? | 3 semaines | 4 | 150 |
| 13 | Les outils quantitatifs de la première | au fil de l'année | 6 | 150 |
| | **Total** | | **68** | **1 952** |

Chaque banque respecte les quotas pour 150 questions (75 / 30 / 30 / 15 par type, 60 / 60 / 30 par difficulté, à ± 3) et les règles de `verifierBanque` (vrai/faux équilibrés, biais de position et de longueur, énoncés non redondants, espaces insécables). Réponses courtes numériques : nombre seul, unité et arrondi dans l'énoncé, marge seulement pour un nombre seul (0,05 pour un arrondi au dixième), variantes avec et sans espace des milliers (« 1 000 » et « 1000 » sont deux entrées), « % » ou « € » seulement quand l'énoncé demande un résultat en % ou en euros, signes moins « - » et « − » pour les taux négatifs.

## Relecture et validation des quiz

- **Rédaction** : la banque 1 a été rédigée par la session, les banques 2 à 13 par des sous-agents rédacteurs, puis contrôlées par `verifierBanque`. Les banques 2, 3, 4 et 5 en partie, puis 6 à 13, ont été rédigées par des sous-agents distincts de leurs relecteurs.
- **Relecture indépendante à l'aveugle de chaque banque** : un sous-agent relecteur reçoit le texte du chapitre et les questions sans réponses ni explications, résout chaque question et refait chaque calcul (souvent avec python3), vérifie les faits cités, signale ambiguïtés, distracteurs défendables et variantes. Ses réponses sont comparées automatiquement aux réponses attendues avec les règles de normalisation et de marge de la base. Détail question par question dans `banques/ses-chN-relecture.md`.
- **Résultats** : 1 944 réponses identiques sur 1 952 ; 8 écarts, tous examinés et attribués à des erreurs de saisie du relecteur (réponses contraires au texte explicite du cours, sans remarque, souvent sur des vrai/faux consécutifs) : réponses attendues maintenues. 276 remarques, dont une majorité de variantes de réponse courte et de calculs confirmés.
- **Corrections faites à la suite des relectures** (voir chaque fichier de relecture) :
  - erreurs de fond dans les questions : un exemple faux de PCS (infirmières du public et du privé, ch. 7), une question devenue fausse sur la loi de 1977 (ch. 9), des égalités de profit dans le tableau du coût marginal (ch. 1), une majorité en assemblée générale mal formulée (ch. 12) ;
  - ambiguïtés et distracteurs défendables reformulés, bonnes réponses repérables à leur forme ou leur longueur réécrites (dans presque toutes les banques) ;
  - plusieurs centaines de variantes de réponse courte ajoutées ;
  - **erreurs ou imprécisions du cours corrigées** : Conseil de la concurrence (et non Autorité) en 2005 (ch. 2) ; cour d'assises et cour criminelle départementale, droit du mari jusqu'en 1965 (ch. 8) ; loi de 1977 modifiée en 2002 sur la publication des sondages, article de Bourdieu publié en 1973, suffrage censitaire de 1815 à 1848 (ch. 9) ; Sécurité sociale étendue progressivement, prestations d'assistance non forfaitaires, allocations familiales modulées, gestion paritaire de l'assurance chômage (ch. 11) ; créations d'entreprises supérieures au million depuis 2022, redressement avant liquidation, entrée en Bourse des seules SA, rôle du CSE (ch. 12) ; lecture de la pente quand le prix est en ordonnée (ch. 1 et 13).
- **Statuts** : comme pour BPH et STSS (commits `67d1671` et `90bd11c`), les questions retenues après relecture sont passées en `valide` : **1 952 `valide`, 0 `a_relire`, 0 `brouillon`**. Aucune question n'est restée réellement douteuse après correction.

## Validation technique

- `analyserImport` : aucune erreur sur `ses.json` complet.
- `verifierBanque` (préfixe `ses`, total 150) : les 13 banques sont conformes.
- `nettoyerHtml` : rien n'est retiré dans les 68 sections et les 13 zones « Je retiens ».
- Import à blanc (`versDonneesCours`) : charge utile construite sans erreur. **Aucun import réel** en base (base locale partagée avec les autres sessions) : à faire avec `npm run import:contenu -- contenu/1re-gen/ses.json` (sans `--publier`, puis publication depuis `/admin`).
- Tests `vitest` de `src/lib/contenu` : 209 réussis (code non modifié).
- Rapports par chapitre : `validation/ses-ch1.md` à `ses-ch13.md`.

## Points à trancher par l'enseignant

1. **Validation sans relecture humaine.** Les 1 952 questions sont `valide` après une relecture indépendante faite par des agents, et non par un enseignant comme pour BPH et STSS. Elles seront tirées dans les quiz dès la publication. Si tu préfères une relecture humaine avant, importe le fichier en remplaçant les statuts par `a_relire` (une ligne de script), ou ne publie pas tout de suite.
2. **Le texte du cours n'a pas eu de relecture indépendante dédiée** (pas de fichiers `ses-chN-cours-relecture.md` comme pour STSS) : il a été relu indirectement par les relecteurs des banques, qui ont trouvé et fait corriger une quinzaine d'imprécisions. Une lecture par l'enseignant dans l'aperçu admin reste utile.
3. **Plan** : ordre des chapitres calqué sur le BO (le programme laisse la progression libre) ; chapitre 13 « outils quantitatifs » séparé, à étudier au fil de l'année ; il pourrait être placé ailleurs ou réparti.
4. **Faits réels datés à confirmer avec un manuel ou une source à jour** : abstention de 2022 (environ 28 % au second tour de la présidentielle, plus de 52 % au premier tour des législatives) ; amendes de 534 M€ (téléphonie mobile, 2005) et de 2,42 Md€ (Google, 2017) ; budget de l'État en déficit depuis 1975 ; hausse des taux de la BCE à partir de juillet 2022 ; environ une famille avec enfants mineurs sur quatre monoparentale ; plus d'un million de créations d'entreprises par an depuis 2022 ; marge d'erreur d'environ 3 points pour 1 000 personnes.
5. **Choix de rédaction** : convention retenue au chapitre 1 quand coût marginal et prix sont égaux (le producteur produit l'unité où Cm = prix) ; quelques questions reprennent un même fait sous des formes différentes (signalées dans les relectures, gardées car de types différents) ; la question des sigles accepte « CSP » à côté de « PCS ».

## Outillage (à signaler, non modifié)

- Les scripts `npm run banque:texte`, `banque:verifier` et `banque:fusionner` ne connaissent que `contenu/1re-st2s/` et les cours `bph` et `stss` (`src/lib/contenu/banque/cours.ts`). Pour ce cours, les mêmes fonctions de la bibliothèque (`verifierBanque`, `analyserImport`, `texteChapitre`, `nettoyerHtml`, `versDonneesCours`) ont été appelées depuis un script externe. **Il faudrait généraliser `--cours`** (chemin du fichier de cours, dossier des banques, préfixe) pour les cours de seconde et de première générales.
- Le cours a été assemblé directement depuis les banques (questions incluses avec leur statut), au lieu de `banque:fusionner`, pour pouvoir réappliquer les statuts après chaque relecture ; le résultat passe les mêmes validations.
- Outils et fichiers de travail (format compact des banques, convertisseurs, consignes de rédaction et de relecture, réponses des relecteurs) : dossier de notes partagé `ses-1re-travail/` de la session de coordination. Le format compact de la banque 1 a été perdu lors d'un effacement du dossier temporaire ; la banque 1 n'existe plus qu'au format JSON du dépôt.
