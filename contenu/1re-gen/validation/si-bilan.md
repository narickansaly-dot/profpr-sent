# Bilan : cours de sciences de l'ingénieur (spécialité), première générale

Date : 17 novembre 2026. Branche : `claude/contenu-1re-si-252c14`.

## Programme suivi

- **Programme en vigueur** : arrêté du 17 janvier 2019, NOR **MENE1901640A**, BO spécial n° 1 du 22 janvier 2019 (programme de première et terminale ; entrée en vigueur en première à la rentrée 2019).
- **Vérification 2025-2026** : aucun arrêté de 2025 ou de 2026 ne modifie ce programme. Le seul texte récent est la note de service du 21 septembre 2026, NOR **MENE2624106N** (BO n° 38 du 8 octobre 2026), qui organise l'épreuve pratique de terminale à compter de la session 2027 ; elle ne change pas les contenus de première.
- Le cours traite **toutes les lignes « 1e »** du programme (codes `[I…]`, `[A…]`, `[M…]`, `[E…]`, `[C…]` de `programmes/si-1re.md`) ; les contenus « Tale » n'apparaissent qu'en ouverture signalée (« Pour aller plus loin », « En terminale »).

## Livrables

| Fichier | Contenu |
| --- | --- |
| `programmes/si-1re.md` | Résumé codé du programme (préambule, 5 compétences, tableaux « 1e » / « Tale », contextes) et vérification 2025-2026 |
| `programmes/si-1re-plan.md` | Plan en 10 chapitres, correspondance programme → chapitres, sections prévues |
| `si.json` | Cours `si-1re-gen`, filière `GEN`, niveau `1re`, matière « Sciences de l'ingénieur », couleur `#475569` (contraste **7,58:1** avec le blanc, accepté), 10 chapitres, 75 sections, 50 figures SVG, **1 500 questions `valide`**, 1,68 Mo (3 Mo au plus) |
| `banques/si-chN.json` (10) | 150 questions par chapitre, sources `si-1re:chN:banque:001` à `150` (préfixe `si-1re` : `question.source` est unique dans toute la base) |
| `banques/si-chN-relecture.md` (10) | Relecture indépendante : résolution à l'aveugle, calculs refaits par script, comparaison, corrections, points de doute, remarques sur le cours |
| `validation/si-chN.md` (10) | Résultats des contrôles automatiques par chapitre |

## Chapitres

| N° | Titre | Durée | Sections | Figures SVG | Questions |
| --- | --- | --- | --- | --- | --- |
| 1 | Innover : de l'idée au produit | 3 semaines | 7 | 4 | 150 |
| 2 | Analyser un produit avec l'ingénierie système | 3 semaines | 7 | 5 | 150 |
| 3 | Énergie, puissance et rendement | 3 semaines | 7 | 4 | 150 |
| 4 | La chaîne de puissance et ses composants | 3 semaines | 7 | 6 | 150 |
| 5 | Circuits électriques : lois et composants | 4 semaines | 7 | 6 | 150 |
| 6 | Modéliser un mécanisme : liaisons et actions mécaniques | 4 semaines | 8 | 5 | 150 |
| 7 | Mouvements : trajectoires, vitesses et lois d'entrée-sortie | 4 semaines | 8 | 5 | 150 |
| 8 | Acquérir et traiter l'information : capteurs, algorithmes et états | 3 semaines | 8 | 5 | 150 |
| 9 | Communiquer entre objets : signaux, protocoles et débits | 3 semaines | 8 | 6 | 150 |
| 10 | Mesurer et comparer les performances | 2 semaines | 8 | 4 | 150 |
| | **Total** | **32 semaines** | **75** | **50** | **1 500** |

Chaque banque : 75 `qcm_unique`, 30 `qcm_multiple` (29 au chapitre 9), 30 `vrai_faux` (15 vrais, 15 faux), 15 `reponse_courte` (16 au chapitre 9) ; difficultés 60 / 60 / 30 à ± 2 près ; 8 à 10 notions ; bonne réponse des `qcm_unique` répartie 19 / 19 / 19 / 18. Environ 40 % des questions des chapitres 3, 4, 5, 7, 9 et 10 sont des calculs.

## Méthode de vérification des quiz

1. **Auteur** : chaque banque a été écrite contre le texte de son chapitre, avec un script qui recalcule toutes les réponses numériques et vérifie qu'un seul choix est juste (et que les distracteurs calculés correspondent à des erreurs typiques).
2. **Relecteur indépendant** (un sous-agent par banque, qui n'a pas écrit la banque) : résolution des 150 questions **sans voir les réponses** (fichier masqué produit par script), calculs refaits par un second script, comparaison automatique avec la banque, relecture complète des 150 questions avec leurs explications, corrections, puis nouveau passage du vérificateur et de la comparaison.
3. **Statut** : aucune question n'est restée douteuse ; les 1 500 questions sont passées en `valide`, statut que le dépôt applique au contenu relu (BPH et STSS, commits 67d1671 et 90bd11c). Après fusion, `si.json` a été comparé champ par champ aux banques : aucun écart.

## Résultats des relectures

| Chapitre | Désaccords à l'aveugle | Nature | Questions corrigées |
| --- | --- | --- | --- |
| 1 | 0 | — | 7 (1 question à distracteurs hors cours, 6 doublons remplacés) |
| 2 | 0 | — | 3 (1 distracteur défendable, 2 explications) |
| 3 | 0 | — | 9 (5 distracteurs artificiels, 1 défendable, rappel du milliwatt ; 2 alignées sur la correction du cours) |
| 4 | 0 | — | 8 (1 distracteur défendable, 1 énoncé précisé, 3 longueurs rééquilibrées, 1 explication ; 2 alignées sur la correction du cours) |
| 5 | 0 | — | 6 (vrai/faux qui doublaient une proposition de QCM) |
| 6 | 0 | — | 2 (1 doublon, 1 liaison non nommée) |
| 7 | 1 | erreur du relecteur (la banque avait raison) | 5 (3 doublons de fond, 1 marge ajoutée sur « 3,14 », 1 distracteur) |
| 8 | 0 | — | 13 (doublons de fond, 1 formulation ambiguë, 2 distracteurs équivalents) |
| 9 | 0 | — | 5 (portée du BLE, 1 doublon, 3 distracteurs artificiels) |
| 10 | 0 | — | 16 (doublons de fond surtout, 1 marge resserrée) |
| **Total** | **1** | **aucune réponse fausse dans les banques** | **74** |

Avant la relecture, les auteurs avaient eux-mêmes corrigé quelques défauts (renvois à une frise du cours, explication de distracteur fausse, réponse courte « 1/3 » non numérique, marges trop larges).

**Correction du cours** issue des relectures : chapitres 3 et 4, « le rendement global est toujours plus petit que le plus petit des rendements » devient « inférieur ou égal au plus petit des rendements (strictement inférieur dès que deux constituants ont des pertes) ». Autres chapitres : rien à signaler ; tous les exemples résolus ont été recalculés.

## Validation automatique

- Les 10 banques passent `verifierBanque` (préfixe `si-1re`, 150 questions). Contrôles en plus : aucune réponse acceptée avec séparateur de milliers, aucune marge sur une réponse non numérique.
- Le cours complet passe `analyserImport`. `nettoyerHtml` ne retire rien (hors l'ajout normal de `tabindex="0"`). Pas d'entité `&nbsp;`, pas d'espace normale avant `: ; ! ?`, ni `pre`, `code`, `h1` ou `h2`.
- **Import à blanc** : `versDonneesCours` construit la charge utile de 1 500 questions (1,51 Mo) sans contacter de base.
- **Import réel non fait** (pas de `.env.local` dans le worktree, base locale partagée). Commande prévue : `npm run import:contenu -- contenu/1re-gen/si.json`.

## Scripts du dépôt (non modifiés)

- Sur cette branche, `npm run banque:texte|verifier|fusionner` n'acceptent que `--cours bph|stss`. Les contrôles ont été lancés par un outil hors dépôt qui appelle les mêmes fonctions (copie dans le dossier de notes partagé, `si-outils/si-outil.ts`). Une autre session a rendu ces scripts génériques (`--cours 1re-gen/<matière> --prefixe <matière>-1re`, branche de l'espagnol) : une fois fusionnée, `--cours 1re-gen/si --prefixe si-1re` devrait convenir.

## Limites du HTML autorisé

- Ni MathML ni LaTeX : formules avec `sub`, `sup` et caractères Unicode ; fractions en ligne ; vecteurs avec la flèche combinante.
- Programmes Python dans un encadré `div.def` avec `<br>` et espaces insécables pour l'indentation (ni `pre` ni `code`), sans police à chasse fixe. Suggestion d'affichage : une classe `div.code`.
- Énoncés des questions en texte brut : exposants et indices en Unicode, pas de figure.

## Points à trancher

1. **Découpage par domaine technique** (énergie, électricité, mécanique, information, mesure), alors que le programme est rédigé par compétences. Durées indicatives (32 semaines) à ajuster à la progression de l'équipe, qui inclut le **projet de 12 heures** (présenté au chapitre 1, non séquencé).
2. **Longueur des chapitres** : 38 000 à 55 000 caractères de HTML (figures SVG comprises), au-dessus de la cible de départ (20 000 à 30 000). Contenu jugé utile ; à alléger si l'affichage est trop long.
3. **Ouvertures « terminale »** présentes dans le cours et interrogées par quelques questions : équilibre d'une barrière par les moments (chapitre 6, questions 140, 146 et 150), superposition (chapitre 5, un vrai/faux), relations i = C·du/dt et u = L·di/dt (chapitre 5), accélération normale R·ω² (chapitre 7). À retirer des quiz pour s'en tenir strictement aux contenus « 1e ».
4. **Questions un peu au-delà des exemples du cours**, mais faisables avec lui : nombre minimal de bits (chapitres 8 et 9), `False and True` (chapitre 8), octet d'adresse I2C (chapitre 9 : 086, 089, 092), énergie restituée par un supercondensateur entre deux tensions (chapitre 5).
5. **Réponse courte binaire** (chapitre 8, « 11100011 ») : comparée comme texte ; « 1110 0011 » ou « 0b11100011 » seraient refusés.
6. **Questions qui rappellent un exemple précis du cours** (fauteuil roulant comparé, scénario de Lucie au chapitre 1, séries de mesures du chapitre 10) : le contexte est redonné dans l'énoncé ; utiles en révision.
7. **Questions de remplacement** écrites par les relecteurs (une cinquantaine) : résolues par leur auteur et passées au vérificateur, mais sans seconde relecture indépendante.
8. **Validation sans enseignant** : comme demandé, les 1 500 questions sont `valide` après une relecture automatisée indépendante. Un enseignant de SI peut vouloir en contrôler un échantillon (par exemple les questions de difficulté 3) avant publication.
9. **Seuils et exemples chiffrés** du cours (VAE 250 W et 25 km/h, effort d'ouverture d'une porte 50 N, hauteur des commandes 0,90 à 1,30 m, portée du BLE) : valeurs usuelles, à confronter au manuel de l'établissement.
