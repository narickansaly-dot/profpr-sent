# Bilan : cours de mathématiques, seconde générale et technologique

Date : 11 novembre 2026. Branche : `claude/contenu-2de-maths-63fce4`.

## Programme suivi

- **Programme en vigueur** : arrêté du 26 février 2026, NOR **MENE2602914A**, BO n° 14 du 2 avril 2026, applicable à la rentrée 2026-2027. Il remplace l'annexe de l'arrêté du 17 janvier 2019 (BO spécial n° 1 du 22 janvier 2019) indiqué dans la commande.
- Le travail a commencé sur le programme de 2019 (chapitres 1 à 7). Après vérification, il a été mis à jour pour le programme de 2026 : résumé et plan réécrits, chapitres 8 à 11 rédigés d'après 2026, chapitres 2, 6 et 7 adaptés (voir plus bas).
- Principaux changements de 2026 : nouvelle partie « Automatismes » ; contraposée ; nombres premiers, projeté orthogonal, systèmes 2 × 2, parité des fonctions et intervalle de fluctuation 1/√n retirés ; fonction valeur absolue, ensemble de définition, tableaux de signes, équation quotient, séries en classes, **croisement de deux variables qualitatives** et **probabilités conditionnelles avec arbres** ajoutés. Détail dans `programmes/maths-2de.md`.

## Livrables

| Fichier | Contenu |
| --- | --- |
| `programmes/maths-2de.md` | Résumé codé du programme de 2026 (contenus, capacités, démonstrations, algorithmes, automatismes) et tableau des changements depuis 2019 |
| `programmes/maths-2de-plan.md` | Plan en 11 chapitres, correspondance programme → chapitres, mise à jour 2026, points à trancher |
| `maths.json` | Cours `maths-2de-gen`, filière `GEN`, niveau `2de`, matière « Mathématiques », couleur `#4338ca` (contraste 7,90:1 avec le blanc), 11 chapitres, 1 650 questions `a_relire`, 1,08 Mo |
| `banques/maths-chN.json` (11) | 150 questions par chapitre, sources `maths-2de:chN:banque:001` à `150` |
| `banques/maths-chN-relecture.md` (11) | Relecture question par question et points de doute |
| `validation/maths-chN.md` (11) | Résultats des contrôles automatiques |

## Chapitres

| N° | Titre | Sections | Questions |
| --- | --- | --- | --- |
| 1 | Nombres réels, intervalles et valeur absolue | 6 | 150 |
| 2 | Multiples, diviseurs et raisonnement | 6 | 150 |
| 3 | Algorithmique et programmation en Python | 7 | 150 |
| 4 | Puissances, racines carrées et calcul littéral | 7 | 150 |
| 5 | Inégalités, équations et inéquations | 7 | 150 |
| 6 | Vecteurs du plan et problèmes de géométrie | 8 | 150 |
| 7 | Droites du plan | 6 | 150 |
| 8 | Fonctions : représentations, fonctions de référence et signe | 7 | 150 |
| 9 | Variations, extremums et optimisation | 7 | 150 |
| 10 | Information chiffrée, statistiques et tableaux croisés | 7 | 150 |
| 11 | Probabilités et probabilités conditionnelles | 6 | 150 |
| | **Total** | **74** | **1 650** |

Chaque banque : 75 `qcm_unique`, 30 `qcm_multiple`, 30 `vrai_faux` (15 vrais, 15 faux), 15 `reponse_courte` ; difficultés 60 / 60 / 30 ; 7 à 9 notions.

## Validation

- Les 11 banques passent `verifierBanque` sans erreur ; le cours complet passe `analyserImport` ; `nettoyerHtml` ne retire rien ; `versDonneesCours` (import à blanc) construit la charge utile de 1 650 questions.
- Aucune réponse courte avec séparateur de milliers ; aucune marge (toutes les réponses numériques sont exactes) ; espaces insécables vérifiées.
- **Import réel non fait** : la base Supabase locale est partagée. Commande prévue : `npm run import:contenu -- contenu/2de-gen/maths.json`.

## Limites du HTML autorisé (formules)

- Ni MathML ni LaTeX (absents de la liste blanche de `src/lib/contenu/html.ts`). Les formules sont écrites avec `sup`, `sub`, les caractères Unicode (√, π, ⩽, ⩾, ∈, ⊂, ∩, ∪, ∅, ℝ, ℕ, ℤ, 𝔻, ℚ) et des tableaux HTML.
- **Fractions** en ligne (a/b) : pas de trait de fraction.
- **Vecteurs** : flèche combinante U+20D7 placée sur la dernière lettre (AB⃗), expliquée dans le cours ; rendu variable selon la police.
- **Code Python** : ni `pre` ni `code`, ni `font-family` ou `white-space` autorisés en style. Les programmes sont dans un `div` encadré, avec `<br>` et des espaces insécables pour l'indentation ; pas de police à chasse fixe.
- **Énoncés des questions** : texte brut affiché dans un paragraphe, sans retour à la ligne ni indice : programmes Python écrits sur une ligne, indices notés `x_A`, `P_A(B)`, exposants en caractères Unicode.
- Tableaux de variations et de signes en tableaux HTML ; courbes et figures en SVG en ligne.

## Scripts du dépôt (non modifiés)

- `scripts/verifier-banque.ts`, `fusionner-banque.ts`, `texte-chapitre.ts` lisent `contenu/1re-st2s/banques/` et n'acceptent que `--cours bph|stss` (`src/lib/contenu/banque/cours.ts`). **À faire** : ajouter une configuration par cours (dossier, préfixe, total), par exemple `--cours maths-2de` → `contenu/2de-gen/maths.json`, préfixe `maths-2de`, 150 questions.
- Suggestions pour l'affichage : une classe CSS pour le code (`div.code` en chasse fixe), une classe pour les vecteurs, et l'affichage des sauts de ligne dans les énoncés (`white-space: pre-line`).

## Points à trancher

1. **Chapitre 3 dédié à Python**, alors que le programme de 2026 demande un enseignement transversal sans séquence spécifique.
2. **Pas de chapitre « Automatismes »** : faut-il une page d'entraînement dédiée ?
3. **Nombres premiers** gardés au chapitre 2 comme rappels du collège (21 questions) : garder ou retirer.
4. **Contenus de 2019 conservés comme « pour aller plus loin »** : démonstration √(a + b) < √a + √b et illustration de (a + b)² (chapitre 4) ; mention des systèmes (chapitre 7) ; une question sur deux droites données par des équations cartésiennes (chapitre 7).
5. **Questions qui renvoient à un tableau ou une figure du cours** (« d'après le tableau du cours », « dans l'arbre du cours ») : utiles en révision, à éviter en évaluation tant que les énoncés ne peuvent pas afficher de figure.
6. Ordre et durées des chapitres (32 semaines).
7. Relecture enseignante de chaque banque (statut `a_relire`) avant validation et import.
