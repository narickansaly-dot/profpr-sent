# Bilan : cours de mathématiques (tronc commun), première générale

Date : 17 novembre 2026. Branche : `claude/contenu-1re-maths-tc-1bb0f9`.

## Programme suivi

- **Programme en vigueur en 2026-2027** : « Programme de mathématiques intégré à l'enseignement scientifique en classe de première générale », arrêté du 26 février 2026, NOR **MENE2602916A**, BO n° 14 du 2 avril 2026, applicable à la rentrée 2026-2027. Il remplace l'annexe de l'arrêté du 6 juillet 2022. C'est l'enseignement obligatoire des élèves de première générale qui ne suivent pas la spécialité mathématiques (arrêté du 3 janvier 2023).
- **Épreuve anticipée** : note de service du 11 septembre 2026, NOR **MENE2622640N**, BO spécial n° 4 du 17 septembre 2026, qui remplace la note du 10 juin 2025 (MENE2515469N). Écrit de 2 heures, coefficient 2, **sans calculatrice** ; 1re partie (6 points) : automatismes en questions à réponses courtes ; 2e partie (14 points) : deux ou trois exercices ; 2 points pour la maîtrise de la langue.
- L'annexe PDF du programme a été lue en entier (navigateur intégré et pdf.js). Le résumé codé est dans `programmes/maths-tc-1re.md`, le plan dans `programmes/maths-tc-1re-plan.md`.

## Livrables

| Fichier | Contenu |
| --- | --- |
| `programmes/maths-tc-1re.md` | Résumé du programme 2026 (automatismes [Au1]–[Au17], contenus, capacités) et de l'épreuve anticipée |
| `programmes/maths-tc-1re-plan.md` | Plan en 10 chapitres, correspondance programme → chapitres, points à trancher |
| `maths-tc.json` | Cours `maths-tc-1re-gen`, filière `GEN`, niveau `1re`, matière « Mathématiques (tronc commun) », couleur `#3730a3` (contraste 9,93:1 avec le blanc), 10 chapitres, 79 sections, 1 500 questions, 1,29 Mo |
| `banques/maths-tc-chN.json` (10) | 150 questions par chapitre, sources `maths-tc:chN:banque:001` à `150` |
| `banques/maths-tc-chN-relecture.md` (10) | Relecture indépendante à l'aveugle, corrections, points examinés |
| `validation/maths-tc-chN.md` (10) | Contrôles automatiques, répartitions, statuts |

## Chapitres

| N° | Titre | Sections | Questions | Corrigées après relecture |
| --- | --- | --- | --- | --- |
| 1 | Pourcentages et taux d'évolution | 8 | 150 | 3 |
| 2 | Calcul algébrique, équations produit nul et signe | 8 | 150 | 7 |
| 3 | Lectures graphiques et droites | 7 | 150 | 4 |
| 4 | Statistiques à deux caractères | 8 | 150 | 3 |
| 5 | Probabilités conditionnelles et indépendance | 8 | 150 | 1 |
| 6 | Répétition d'épreuves indépendantes et simulation | 8 | 150 | 0 |
| 7 | Variation linéaire : suites arithmétiques et fonctions affines | 8 | 150 | 13 |
| 8 | Modélisation quadratique | 8 | 150 | 1 |
| 9 | Suites géométriques | 8 | 150 | 0 |
| 10 | Fonctions exponentielles et taux moyen | 8 | 150 | 5 |
| | **Total** | **79** | **1 500** | **37** |

Chaque banque : 75 `qcm_unique`, 30 `qcm_multiple`, 30 `vrai_faux` (15 vrais, 15 faux), 15 `reponse_courte` ; difficultés 60 / 60 / 30 (± 2) ; 8 ou 9 notions dont « Automatismes » (200 questions « flash » en tout, faisables de tête). Chaque chapitre se termine par une section « Automatismes : questions flash ».

## Relecture des quiz

- **Méthode** : pour chaque banque, un sous-agent distinct de l'auteur a résolu les 150 questions **sans voir les réponses attendues** (fichier masqué), en refaisant chaque calcul dans un script Python (Fraction, sympy). Une comparaison automatique a imité la normalisation de la base (casse, accents, virgule ou point, marge). Il a ensuite relu chaque question, explication et distracteur contre le texte du chapitre et le programme, corrigé, puis relancé les contrôles.
- **Résultat à l'aveugle** : 1 497 concordances sur 1 500 au premier passage. Les 3 écarts (chapitre 8 : 088, 089, 090) sont des erreurs de report du relecteur, revérifiées par la session principale : la banque était juste.
- **Aucune bonne réponse n'était fausse.** 37 questions ont été corrigées :
  - distracteur vrai à la lettre (ch. 7 : 132) ;
  - hypothèses manquantes (ch. 1 : 124, effectifs constants ; ch. 3 : 033, 043 ; ch. 5 : 132, P(B) ≠ 0 ; ch. 7 : 129, suite non définie) ;
  - distracteurs artificiels remplacés par des erreurs plausibles (ch. 2 : 038, 101 ; ch. 4 : 045, 112) ;
  - variantes de réponses courtes ajoutées (−60 et −15 avec le signe moins Unicode, 2,5 et 5/2) ;
  - barèmes et taux présentés comme fictifs (ch. 7, ch. 10) ;
  - notation ∪ harmonisée (ch. 2).
- **Texte du cours corrigé** :
  - ch. 1 : coefficient d'une baisse (0 ⩽ CM < 1, CM = 0 pour −100 %) et addition de pourcentages (seulement sur un même tout) ;
  - ch. 2 : réunions d'intervalles notées ∪ ;
  - ch. 3 : définition de « décroissante » ;
  - ch. 4 : « Onze » questions flash ;
  - ch. 7 : formulation d'une tranche du barème ;
  - ch. 10 : typographie d'une légende.
- **Statuts** : comme pour BPH et STSS (commits 67d1671 et 90bd11c), les questions relues et tranchées sont passées en **`valide`** : 1 500 questions `valide`, **aucune laissée `a_relire`**. Aucun relecteur n'a gardé de doute après correction.

## Validation

- `verifierBanque` (préfixe `maths-tc`, 150 questions) : les 10 banques sont conformes, y compris contre le cours fusionné.
- `analyserImport` : le cours complet est valide ; `nettoyerHtml` ne retire rien ; `versDonneesCours` (import à blanc, `garderStatuts`) construit la charge utile de 1 500 questions (1,12 Mo), sans base contactée.
- Réponses courtes : 150, **aucune marge** (toutes les réponses numériques sont exactes), aucun séparateur de milliers dans les réponses acceptées, espaces insécables avant « : ; ! ? » vérifiées par le contrôle (règle 14).
- **Import réel non fait** (pas de `.env.local` dans le worktree, base locale partagée). Commande prévue : `npm run import:contenu -- contenu/1re-gen/maths-tc.json`.

## Outillage (aucun script du dépôt modifié)

- Les scripts `banque:texte`, `banque:verifier` et `banque:fusionner` n'acceptent que `--cours bph|stss`, avec des chemins figés sous `contenu/1re-st2s/`. La validation a utilisé le pilote hors dépôt de la session de seconde (`pilote-banques-svt.ts`), qui appelle les mêmes fonctions (`verifierBanque`, `fusionnerBanque`, `analyserImport`, `nettoyerHtml`, `versDonneesCours`). **À faire** : une configuration par cours (fichier, dossier des banques, préfixe, total), par exemple `--cours maths-tc-1re`.
- Scripts de relecture et de finalisation (masquage, comparaison, assemblage, fusion et statuts, rapports) : dans le dossier de notes partagé des sessions de première (`maths-tc-*.py`).

## Limites du HTML autorisé

- Ni MathML ni LaTeX : formules en Unicode, `sup`, `sub`, fractions en ligne, tableaux de signes et de variations en tableaux HTML, courbes en SVG.
- Ni `pre` ni `code` : les programmes Python sont dans un `div` avec `<br>` et des espaces insécables. **Copiés tels quels dans Python, ils donnent une erreur de syntaxe** (espaces insécables). Suggestion : une classe `div.code` en chasse fixe, avec `white-space: pre` et des espaces normales.
- Les énoncés des questions sont du texte brut : indices notés P_A(B), u(n), exposants en caractères Unicode. Aucune figure n'est possible dans une question : les courbes sont décrites (« ligne brisée reliant les points… », points de passage, tableaux en ligne).

## Points à trancher

1. **Trois chapitres d'automatismes** (1 à 3) alors que le programme demande un entraînement régulier sans chapitre spécifique ; choix fait pour donner une page de référence et préparer la 1re partie de l'épreuve.
2. **Réponses courtes limitées à 15 par banque** par la règle des quotas (75 / 30 / 30 / 15), alors que la 1re partie de l'épreuve n'est faite que de réponses courtes. Une banque d'automatismes surtout en réponses courtes demanderait d'assouplir les quotas du script.
3. **Durées et ordre** : 32 semaines à 1 h 30 (4 semaines pour les chapitres 4 et 10) ; le programme laisse l'ordre libre.
4. **Taux et barèmes fictifs** (21 %, 44 %, 69 % ; barème d'impôt à 0 / 10 / 30 %) choisis pour un calcul sans calculatrice et signalés comme fictifs.
5. **Cotes de difficulté discutables** au chapitre 6 : 048, 071 et 111 sont cotées 3 pour des calculs proches de questions cotées 1 ou 2. Laissées en l'état pour garder les quotas.
6. **Quartiles** selon la convention de seconde (rang N/4 arrondi à l'entier supérieur), ch. 4.
7. **Recoupements volontaires entre chapitres** (coefficients multiplicateurs aux ch. 1, 9 et 10 ; signe d'un produit aux ch. 2 et 8) : renvois explicites. Pas de page commune avec la spécialité (`maths-spe`).
8. **Relecture enseignante facultative** : toutes les questions sont `valide` après relecture indépendante ; un enseignant peut les signaler depuis l'application.
