# Bilan : cours de SVT de seconde générale

Date : 11 novembre 2026. Branche : `claude/contenu-2de-svt-be7093` (commits locaux, sans push ni PR).

## Programme suivi

- Arrêté du 17 janvier 2019, NOR MENE1901647A, BO spécial n° 1 du 22 janvier 2019 (résumé dans `programmes/svt-2de.md`).
- **Vérification de la version en vigueur** : aucun arrêté plus récent n'a été trouvé pour la SVT de seconde (recherche du 11 novembre 2026). Contrairement aux langues vivantes (nouveau programme à la rentrée 2025) et aux mathématiques (nouveau programme publié au BO n° 14 du 2 avril 2026), le programme de SVT de 2019 reste applicable en 2026-2027. **Aucun changement à signaler.** La vérification repose sur une recherche web, pas sur un dépouillement complet des BO : à confirmer si besoin.
- Texte lu dans une copie de l'annexe hébergée par le SNES (la page du BO répond 403 aux outils automatiques).

## Fichiers produits

| Fichier | Contenu |
| --- | --- |
| `programmes/svt-2de.md` | résumé fidèle du programme, codes [N1] à [N85] et [C1] à [C68] |
| `programmes/svt-2de-plan.md` | plan en 12 chapitres, couverture des notions et capacités, points à trancher |
| `svt.json` | cours `svt-2de-gen` (GEN, 2de, SVT, `#15803d`), 12 chapitres, 1800 questions `a_relire` |
| `banques/svt-chN.json` (12) | fichiers de travail des banques, 150 questions chacun |
| `banques/svt-chN-relecture.md` (12) | corrections faites, totaux et points de doute de chaque banque |
| `validation/svt-validation.md` | rapport des contrôles automatiques |
| `validation/svt-bilan.md` | ce bilan |

## Chapitres

| N° | Titre | Durée | Sections | Questions |
| --- | --- | --- | --- | --- |
| 1 | L'organisme pluricellulaire, un ensemble de cellules spécialisées | 3 sem. | 6 | 150 |
| 2 | Le métabolisme des cellules | 2 sem. | 5 | 150 |
| 3 | Les échelles de la biodiversité | 2 sem. | 5 | 150 |
| 4 | La biodiversité change au cours du temps | 2 sem. | 5 | 150 |
| 5 | Les mécanismes de l'évolution | 3 sem. | 7 | 150 |
| 6 | L'érosion, processus et conséquences | 3 sem. | 5 | 150 |
| 7 | Sédimentation et activités humaines | 3 sem. | 6 | 150 |
| 8 | Agrosystèmes et développement durable | 4 sem. | 7 | 150 |
| 9 | Du sexe génétique à la sexualité | 3 sem. | 6 | 150 |
| 10 | Hormones et procréation humaine | 3 sem. | 6 | 150 |
| 11 | Agents pathogènes et maladies vectorielles | 2 sem. | 6 | 150 |
| 12 | Le microbiote humain et la santé | 2 sem. | 6 | 150 |
| | **Total** | **32 sem.** | **71** | **1800** |

Chaque chapitre a un résumé, un chapeau, des objectifs, des sections en HTML autorisé (encadrés `.def` et `.warn`, tableaux `.tbl`, 11 figures SVG `.fig`) et une zone « Je retiens ». Chaque banque compte 75 qcm_unique, 30 qcm_multiple, 30 vrai/faux et 15 réponses courtes, avec 60 / 60 / 30 questions de difficulté 1 / 2 / 3.

## Validation

- Le fichier du cours passe le validateur d'import ; 1,29 Mo (limite 3 Mo).
- Couleur `#15803d` : contraste 5,02:1 avec le blanc (minimum 4,5:1).
- Le nettoyage HTML ne retire rien.
- Les 12 banques sont conformes aux 17 règles de `verifierBanque`.
- Import à blanc : la charge utile d'`importer_cours` est construite ; **l'import réel en base n'a pas été fait** (pas de `.env.local` ni de base locale dans le worktree).
- Les scripts npm `banque:*` ne connaissent que `bph` et `stss` : les contrôles ont été faits avec les mêmes fonctions, appelées par un pilote externe (détails dans `svt-validation.md`). **Script à faire évoluer** : ajouter les cours de seconde à `COURS_BANQUE` (`src/lib/contenu/banque/cours.ts`) et dériver le dossier des banques du chemin du cours.

## Méthode et limites

- Même déroulé que STSS : programme, plan, rédaction de chaque chapitre, banque, relecture contre le cours, contrôle, fusion au statut `a_relire`.
- À la différence de STSS, le plan **n'a pas été validé par l'enseignant** avant la rédaction (pas d'arrêt), et la relecture de chaque banque a été faite par la même session que la rédaction. Les relectures listent les corrections faites (doublons, biais de longueur, réponses courtes redondantes, exemples douteux) et les points de doute, mais une seconde lecture humaine reste nécessaire avant de valider les questions.

## Points à trancher par l'enseignant

1. **Découpage** : 12 chapitres, avec quatre regroupements de sous-parties du programme (ch. 5, 7, 8, 9). Le séparer donnerait 16 chapitres plus courts.
2. **Ordre** : celui du programme ; on peut commencer par la géologie (ch. 6 et 7) pour profiter des sorties de terrain en début d'année.
3. **Exemples locaux** : le programme demande un paysage local (ch. 6), un sol local (ch. 8) et des risques locaux (ch. 7). Le cours utilise des exemples génériques (granite, calcaire, Bretagne, Causses, Beauce) à remplacer.
4. **Thèmes sensibles** (ch. 9 et 10) : identité, orientation sexuelle, contraception, IVG. Textes factuels et neutres, à relire en équipe avec l'infirmière scolaire.
5. **Données datées à actualiser chaque année** : repères légaux (IVG 14 semaines, Constitution 2024, AMP 2021, contraception d'urgence gratuite), chiffres OMS (VIH, paludisme), extension du moustique tigre.
6. **Questions de mémoire pure** (dates, noms propres, sigles) : signalées dans chaque relecture ; à retirer si on veut des quiz centrés sur la compréhension.
7. **Ajouts hors programme** signalés : PrEP, poudingue et brèche, horizons A/B/C, souris axéniques, Semmelweis, *Clostridioides difficile*. Tous servent des capacités du programme, mais peuvent être allégés.
