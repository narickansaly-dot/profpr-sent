# Plan des chapitres : mathématiques, seconde générale et technologique

Plan déduit du programme officiel résumé dans `maths-2de.md` (arrêté du 17 janvier 2019, NOR MENE1901631A, BO spécial n° 1 du 22 janvier 2019). Les contenus sont cités avec leur code `[N…]`, les capacités attendues avec `[C…]`, les démonstrations avec `[D…]` et les exemples d'algorithme avec `[A…]` (codes définis dans `maths-2de.md`).

**Statut** : proposition, à valider par l'enseignant (voir « Points à trancher » en fin de document).

## Principes du découpage

- Un chapitre par sous-partie du programme, avec trois regroupements et un ajout :
  - « Utiliser le calcul littéral » est partagé en deux chapitres : le calcul (puissances, racines carrées, identités, expressions fractionnaires) au chapitre 4, les inégalités, équations et inéquations au chapitre 5 ;
  - « Manipuler les vecteurs du plan » et « Résoudre des problèmes de géométrie » forment le chapitre 6 : le projeté orthogonal et la trigonométrie s'appuient sur les distances et les coordonnées ;
  - « Fonctions de référence » et « Représenter les fonctions » forment le chapitre 8 ; le tableau de signes (capacité [C34]) est placé au chapitre 9, avec les variations et le signe des fonctions affines ;
  - « Modéliser le hasard » et « Échantillonnage » forment le chapitre 11.
- « Algorithmique et programmation » a son propre chapitre (chapitre 3), placé tôt pour que Python serve ensuite dans tous les chapitres, comme le demande le programme (« l'algorithmique a une place naturelle dans tous les champs des mathématiques »). Chaque chapitre suivant contient au moins un programme Python tiré des exemples d'algorithme officiels.
- « Vocabulaire ensembliste et logique » est transversal : les ensembles, l'appartenance, l'inclusion, l'intersection et la réunion sont posés au chapitre 1 (intervalles) ; la logique et les raisonnements (implication, réciproque, contre-exemple, absurde, disjonction des cas) au chapitre 2, où se trouvent les démonstrations d'arithmétique. Ils sont repris ensuite (ensembles de solutions, événements).
- Ordre : nombres, algorithmique, calcul, géométrie, fonctions, statistiques et probabilités. Le programme précise que « ce découpage n'est pas un plan de cours » ; l'ordre reste au choix du professeur.
- Durées indicatives : 32 semaines à 4 heures.

## Vue d'ensemble

| N° | Titre | Titre court | Durée | Partie du programme |
| --- | --- | --- | --- | --- |
| 1 | Nombres réels, intervalles et valeur absolue | Nombres réels | 3 semaines | 1.1 ; vocabulaire ensembliste |
| 2 | Multiples, diviseurs et nombres premiers | Arithmétique | 2 semaines | 1.2 ; logique et raisonnement |
| 3 | Algorithmique et programmation en Python | Python | 2 semaines | 5.1, 5.2 |
| 4 | Puissances, racines carrées et calcul littéral | Calcul littéral | 3 semaines | 1.3 (calcul) |
| 5 | Inégalités, équations et inéquations | Équations et inéquations | 3 semaines | 1.3 (inégalités, résolution) |
| 6 | Vecteurs du plan et problèmes de géométrie | Vecteurs | 4 semaines | 2.1, 2.2 |
| 7 | Droites du plan et systèmes d'équations | Droites | 3 semaines | 2.3 |
| 8 | Fonctions : généralités et fonctions de référence | Fonctions | 3 semaines | 3.1, 3.2 |
| 9 | Variations, extremums et signe d'une fonction | Variations | 3 semaines | 3.3 ; [C34] |
| 10 | Information chiffrée et statistique descriptive | Statistiques | 3 semaines | 4.1 |
| 11 | Probabilités et échantillonnage | Probabilités | 3 semaines | 4.2, 4.3 |

---

## Chapitre 1 : Nombres réels, intervalles et valeur absolue

- **Titre court** : Nombres réels — **Durée** : 3 semaines.
- **Contenus** : [N1] à [N6] ; [N54] (ensembles, ∈, ⊂, ∩, ∪).
- **Capacités** : [C1] à [C4] ; [C61] (« et », « ou » avec les intervalles).
- **Démonstrations** : [D1] 1/3 n'est pas décimal ; [D2] √2 est irrationnel (présentée ici, raisonnement par l'absurde repris au chapitre 2).
- **Algorithme** : [A1] encadrement de √2 par balayage, en langage naturel (programmé au chapitre 3).

**Objectifs** : associer un point de la droite graduée à un réel ; connaître ℕ ⊂ ℤ ⊂ 𝔻 ⊂ ℚ ⊂ ℝ ; reconnaître un irrationnel ; noter et représenter un intervalle ; utiliser intersection et réunion ; calculer une distance avec la valeur absolue ; caractériser [a − r ; a + r] par |x − a| ⩽ r ; encadrer et arrondir.

**Sections** : 1. Les ensembles de nombres. 2. Nombres rationnels et irrationnels. 3. La droite numérique et les intervalles. 4. Intersection et réunion d'intervalles. 5. Valeur absolue et distance. 6. Encadrements, arrondis et chiffres significatifs.

## Chapitre 2 : Multiples, diviseurs et nombres premiers

- **Titre court** : Arithmétique — **Durée** : 2 semaines.
- **Contenus** : [N7], [N8].
- **Capacités** : [C5], [C6] ; [C60], [C62] à [C67].
- **Démonstrations** : [D3] somme de deux multiples de a ; [D4] le carré d'un impair est impair.
- **Algorithmes** : [A2], [A3], [A4] en langage naturel (programmés au chapitre 3).

**Objectifs** : définir multiple, diviseur, pair, impair, premier ; écrire un pair 2k et un impair 2k + 1 ; décomposer en facteurs premiers ; rendre une fraction irréductible ; formuler implication, réciproque, équivalence, négation ; prouver avec un contre-exemple, par disjonction des cas, par l'absurde.

**Sections** : 1. ℕ et ℤ, multiples et diviseurs. 2. Nombres pairs et impairs. 3. Nombres premiers et décomposition. 4. Fractions irréductibles. 5. Propositions, implication et réciproque. 6. Raisonner : contre-exemple, disjonction des cas, absurde.

## Chapitre 3 : Algorithmique et programmation en Python

- **Titre court** : Python — **Durée** : 2 semaines.
- **Contenus** : [N47] à [N53].
- **Capacités** : [C52] à [C57], [C59] ; [C58] repris au chapitre 10.
- **Algorithmes** : programmation de [A1] à [A4].

**Objectifs** : déterminer le type d'une variable ; écrire une affectation, une séquence, une instruction conditionnelle ; écrire une boucle bornée et une boucle non bornée ; écrire et appeler une fonction à un ou plusieurs arguments ; utiliser une fonction qui renvoie un nombre aléatoire ; lire, compléter, modifier un programme.

**Sections** : 1. Algorithme et programme. 2. Variables, types et affectation. 3. L'instruction conditionnelle. 4. La boucle bornée for. 5. La boucle non bornée while. 6. Les fonctions. 7. Le hasard en Python.

## Chapitre 4 : Puissances, racines carrées et calcul littéral

- **Titre court** : Calcul littéral — **Durée** : 3 semaines.
- **Contenus** : [N9], [N10], [N11].
- **Capacités** : [C7], [C8], [C9].
- **Démonstrations** : [D5] √(ab) = √a × √b ; [D6] √(a + b) < √a + √b ; [D7] illustration géométrique de (a + b)².
- **Algorithme** : [A5] première puissance qui dépasse une valeur.

**Objectifs** : appliquer les règles des puissances entières relatives et l'écriture scientifique ; calculer avec les racines carrées ; développer et factoriser avec les identités remarquables ; calculer avec des expressions fractionnaires ; exprimer une variable en fonction des autres ; choisir la forme adaptée.

**Sections** : 1. Puissances entières relatives. 2. Racines carrées. 3. Développer et réduire. 4. Les identités remarquables. 5. Factoriser. 6. Expressions fractionnaires. 7. Exprimer une variable en fonction des autres.

## Chapitre 5 : Inégalités, équations et inéquations

- **Titre court** : Équations et inéquations — **Durée** : 3 semaines.
- **Contenus** : [N12], [N13].
- **Capacités** : [C10], [C11], [C12] ; [C9] repris.
- **Notions reprises** : intervalles (chapitre 1), factorisation (chapitre 4).

**Objectifs** : additionner des inégalités ; multiplier une inégalité par un réel positif ou négatif ; comparer par la différence ou le quotient ; résoudre une équation du premier degré, une équation produit nul, une équation x² = a ; résoudre une inéquation du premier degré et donner l'ensemble des solutions sous forme d'intervalle ; modéliser un problème.

**Sections** : 1. Ensemble des solutions. 2. Équations du premier degré. 3. Équations produit nul et équations x² = a. 4. Opérations sur les inégalités. 5. Comparer deux nombres. 6. Inéquations du premier degré. 7. Modéliser un problème.

## Chapitre 6 : Vecteurs du plan et problèmes de géométrie

- **Titre court** : Vecteurs — **Durée** : 4 semaines.
- **Contenus** : [N14] à [N21].
- **Capacités** : [C13] à [C22].
- **Démonstrations** : [D8] critère de colinéarité par le déterminant ; [D9] le projeté orthogonal est le point le plus proche ; [D10] cos² α + sin² α = 1.

**Objectifs** : associer un vecteur à une translation ; reconnaître des vecteurs égaux ; construire une somme, utiliser la relation de Chasles ; calculer des coordonnées, une norme, une distance, un milieu ; multiplier un vecteur par un réel ; tester la colinéarité avec le déterminant ; construire un projeté orthogonal ; utiliser cosinus, sinus et tangente dans un triangle rectangle.

**Sections** : 1. Translations et vecteurs. 2. Somme de vecteurs et relation de Chasles. 3. Produit par un réel. 4. Coordonnées dans une base orthonormée. 5. Distance et milieu. 6. Colinéarité et déterminant. 7. Projeté orthogonal. 8. Trigonométrie et problèmes de géométrie.

## Chapitre 7 : Droites du plan et systèmes d'équations

- **Titre court** : Droites — **Durée** : 3 semaines.
- **Contenus** : [N22], [N23], [N24].
- **Capacités** : [C23] à [C28].
- **Démonstration** : [D11] forme générale d'une équation de droite par le déterminant.
- **Algorithmes** : [A6] alignement de trois points ; [A7] équation d'une droite par deux points.
- **Notions reprises** : colinéarité, déterminant (chapitre 6).

**Objectifs** : déterminer un vecteur directeur ; écrire une équation cartésienne et une équation réduite ; lire et calculer une pente ; tracer une droite ; étudier l'alignement et le parallélisme ; résoudre un système de deux équations à deux inconnues ; trouver le point d'intersection de deux droites.

**Sections** : 1. Vecteur directeur. 2. Équation cartésienne. 3. Équation réduite et pente. 4. Tracer une droite, lire une équation. 5. Droites parallèles ou sécantes. 6. Systèmes de deux équations à deux inconnues.

## Chapitre 8 : Fonctions : généralités et fonctions de référence

- **Titre court** : Fonctions — **Durée** : 3 semaines.
- **Contenus** : [N25] à [N28].
- **Capacités** : [C29] à [C33], [C35].
- **Démonstration** : [D12] position relative des courbes de x, x², x³ pour x ⩾ 0.

**Objectifs** : utiliser image, antécédent, ensemble de définition ; exploiter l'équation y = f(x) d'une courbe ; reconnaître une fonction paire ou impaire ; connaître les fonctions carré, inverse, racine carrée, cube et leurs courbes ; résoudre f(x) = k, f(x) < k et f(x) = g(x) graphiquement ou algébriquement ; modéliser une situation par une fonction.

**Sections** : 1. Notion de fonction. 2. Courbe représentative. 3. Fonctions paires et impaires. 4. Les fonctions carré et cube. 5. Les fonctions inverse et racine carrée. 6. Résolutions graphiques et algébriques. 7. Modéliser par une fonction.

## Chapitre 9 : Variations, extremums et signe d'une fonction

- **Titre court** : Variations — **Durée** : 3 semaines.
- **Contenus** : [N29] à [N32].
- **Capacités** : [C34], [C36] à [C39].
- **Démonstration** : [D13] variations des fonctions carré, inverse, racine carrée.
- **Algorithmes** : [A8] approximation d'un extremum par balayage et par dichotomie ; [A9] longueur approchée d'une portion de courbe (présentée en lecture de programme).

**Objectifs** : définir fonction croissante, décroissante, monotone ; dresser et lire un tableau de variations ; déterminer maximum et minimum ; relier coefficient directeur, sens de variation et signe d'une fonction affine ; connaître les variations des fonctions de référence ; résoudre une inéquation produit ou quotient avec un tableau de signes.

**Sections** : 1. Sens de variation. 2. Tableau de variations. 3. Extremums. 4. Fonctions affines : variations et signe. 5. Variations des fonctions de référence. 6. Tableaux de signes, inéquations produit et quotient. 7. Approcher un extremum avec Python.

## Chapitre 10 : Information chiffrée et statistique descriptive

- **Titre court** : Statistiques — **Durée** : 3 semaines.
- **Contenus** : [N33] à [N39].
- **Capacités** : [C40] à [C45] ; [C58].

**Objectifs** : calculer une proportion et un pourcentage de pourcentage ; calculer variation absolue, variation relative, coefficient multiplicateur ; enchaîner des évolutions, calculer une évolution réciproque ; calculer une moyenne pondérée, utiliser la linéarité de la moyenne ; calculer médiane, quartiles, écart interquartile, écart type ; comparer deux séries ; lire une fonction Python qui calcule m, s et la proportion dans [m − 2s ; m + 2s].

**Sections** : 1. Proportions et pourcentages. 2. Pourcentage de pourcentage. 3. Évolutions et coefficient multiplicateur. 4. Évolutions successives et réciproques. 5. Moyenne pondérée et linéarité. 6. Médiane, quartiles et écart interquartile. 7. Écart type et comparaison de séries.

## Chapitre 11 : Probabilités et échantillonnage

- **Titre court** : Probabilités — **Durée** : 3 semaines.
- **Contenus** : [N40] à [N46].
- **Capacités** : [C46] à [C51].
- **Notions reprises** : intersection, réunion, complémentaire (chapitre 1) ; fonctions aléatoires en Python (chapitre 3) ; fréquences (chapitre 10).

**Objectifs** : décrire l'univers et des événements ; utiliser réunion, intersection, contraire ; définir une loi de probabilité ; calculer la probabilité d'un événement ; utiliser P(A ∪ B) + P(A ∩ B) = P(A) + P(B) ; dénombrer avec un tableau ou un arbre ; distinguer modèle et réalité ; comprendre la loi des grands nombres, la fluctuation d'échantillonnage et l'estimation par une fréquence.

**Sections** : 1. Expérience aléatoire, univers et événements. 2. Loi de probabilité. 3. Événements contraires, réunion et intersection. 4. Tableaux et arbres. 5. Modèle et fréquences observées. 6. Échantillonnage et loi des grands nombres. 7. Simuler des échantillons en Python.

---

## Table de correspondance

### Programme vers chapitres

| Code | Chapitre principal | Repris dans |
| --- | --- | --- |
| N1 à N6 | 1 | 5 (intervalles de solutions) |
| N7, N8 | 2 | 3 |
| N9 à N11 | 4 | 5 |
| N12, N13 | 5 | 9 |
| N14 à N21 | 6 | 7 |
| N22 à N24 | 7 | 9 (fonctions affines) |
| N25 à N28 | 8 | 9 |
| N29 à N32 | 9 | |
| N33 à N39 | 10 | 11 (fréquences) |
| N40 à N46 | 11 | |
| N47 à N53 | 3 | 1, 2, 4, 7, 9, 10, 11 (programmes) |
| N54 | 1 | 5, 11 |
| C1 à C4 | 1 | |
| C5, C6 | 2 | 4 |
| C7 à C9 | 4 | 5 |
| C10 à C12 | 5 | |
| C13 à C22 | 6 | |
| C23 à C28 | 7 | |
| C29 à C33, C35 | 8 | |
| C34, C36 à C39 | 9 | |
| C40 à C45 | 10 | |
| C46 à C51 | 11 | |
| C52 à C57, C59 | 3 | 11 (C59) |
| C58 | 10 | |
| C60 à C67 | 2 (C61 : 1) | tous |
| D1, D2 | 1 | 2 (D2 : raisonnement par l'absurde) |
| D3, D4 | 2 | |
| D5 à D7 | 4 | |
| D8 à D10 | 6 | |
| D11 | 7 | |
| D12 | 8 | |
| D13 | 9 | |
| A1 à A4 | 1 et 2 (langage naturel), 3 (Python) | |
| A5 | 4 | |
| A6, A7 | 7 | |
| A8, A9 | 9 | |

**Bilan** : les 54 contenus, 67 capacités, 13 démonstrations et 9 exemples d'algorithme ont chacun un chapitre principal. Aucun chapitre ne sort du programme ; les approfondissements possibles ne sont pas traités, sauf mention « pour aller plus loin » dans le cours.

## Points à trancher

1. **Place de l'algorithmique** : chapitre 3 (choix retenu) ou fil rouge sans chapitre dédié.
2. **Regroupements** : vecteurs et problèmes de géométrie dans un seul chapitre (6) ; probabilités et échantillonnage dans un seul chapitre (11).
3. **Tableau de signes** : au chapitre 9 (choix retenu), ou au chapitre 5 avec les inéquations.
4. **Durées** : 32 semaines au total, à ajuster au calendrier de l'établissement.
