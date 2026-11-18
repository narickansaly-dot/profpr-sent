# Plan des chapitres : spécialité mathématiques, première générale

Plan déduit du programme en vigueur, résumé dans `maths-spe-1re.md` : arrêté du 26 février 2026 (NOR MENE2602917A, BO n° 14 du 2 avril 2026), applicable à la rentrée 2026-2027. Codes `[N…]`, `[C…]`, `[D…]`, `[A…]`, `[Au…]` définis dans `maths-spe-1re.md`.

**Statut** : proposition, à valider par l'enseignant (voir « Points à trancher »).

## Principes du découpage

- Un chapitre par section du programme ; la dérivation (la plus longue) est coupée en deux (point de vue local, point de vue global), les suites aussi (modes de génération et limites intuitives ; suites arithmétiques et géométriques). Le programme précise que son découpage « n'est pas un plan de cours » ; l'ordre retenu est celui d'une progression courante : suites et second degré d'abord (réactivation de la 2de), puis dérivation, exponentielle (qui s'appuie sur les suites géométriques et la dérivation), trigonométrie, géométrie, probabilités.
- Parties transversales, sans chapitre propre :
  - **Listes en Python** (seule notion nouvelle d'algorithmique) : section du chapitre 1, puis réinvesties (termes de suites, sécantes, simulations, lois de probabilité).
  - **Vocabulaire ensembliste et logique** : section du chapitre 3 (statut des égalités et des lettres, condition nécessaire ou suffisante, équivalence) et section du chapitre 6 (quantificateurs, négation, contre-exemple, raisonnement par contraposée ou par l'absurde) ; réinvesti partout.
  - **Automatismes** : rappelés là où ils servent (évolutions au chapitre 2, produit nul et signe au chapitre 3, lectures graphiques et droites aux chapitres 4 et 6, tableaux croisés et arbres au chapitre 11, indicateurs statistiques au chapitre 12) et forment une bonne part des questions de difficulté 1.
- Durées indicatives : 32 semaines à 4 heures.

## Vue d'ensemble

| N° | Titre | Titre court | Durée | Partie du programme |
| --- | --- | --- | --- | --- |
| 1 | Suites numériques : modes de génération, variations, limites | Suites | 3 semaines | Suites [N3], [N4], [N7], [N8] ; listes Python |
| 2 | Suites arithmétiques et suites géométriques | Suites arithmétiques et géométriques | 3 semaines | Suites [N5], [N6] ; évolutions [Au1] |
| 3 | Second degré : équations, factorisation et signe | Second degré | 4 semaines | Équations, polynômes du second degré ; logique |
| 4 | Dérivation : nombre dérivé et tangente | Nombre dérivé | 3 semaines | Dérivation, point de vue local |
| 5 | Fonction dérivée et calcul de dérivées | Fonction dérivée | 2 semaines | Dérivation, point de vue global |
| 6 | Variations, extremums et courbes | Variations | 3 semaines | Variations et courbes ; logique (quantificateurs) |
| 7 | Fonction exponentielle | Exponentielle | 3 semaines | Fonction exponentielle |
| 8 | Trigonométrie | Trigonométrie | 2 semaines | Trigonométrie |
| 9 | Produit scalaire | Produit scalaire | 3 semaines | Calcul vectoriel et produit scalaire |
| 10 | Géométrie repérée : droites, projeté orthogonal, cercles | Géométrie repérée | 2 semaines | Géométrie repérée |
| 11 | Probabilités conditionnelles et indépendance | Probabilités conditionnelles | 2 semaines | Probabilités conditionnelles et indépendance ; [Au5] |
| 12 | Variables aléatoires réelles | Variables aléatoires | 2 semaines | Variables aléatoires ; expérimentations ; [Au4] |

## Contenu des chapitres

- **Ch. 1** — [N2], [N3], [N4], [N7], [N8], [C10] à [C16], [C19], [A1] (termes, seuil), [A2], [A3]. Sections : notion de suite et notations ; suite définie explicitement ; suite définie par récurrence ; suites et motifs (nombres figurés, dénombrements) ; représentation graphique ; sens de variation ; idée de limite ; listes en Python et algorithmes de suites.
- **Ch. 2** — [N5], [N6], [C17], [C18], [D1] à [D3], [A1] (sommes, seuil) ; [Au1]. Sections : suites arithmétiques ; terme général et lien avec les fonctions affines ; somme 1 + 2 + … + n ; suites géométriques et évolutions à taux constant ; terme général ; somme 1 + q + … + qⁿ ; variations et comportement ; modéliser (capital, population, croissance linéaire ou exponentielle).
- **Ch. 3** — [N9], [N10], [C20] à [C23], [D4] ; [C3], [C5], [C6] ; [Au2]. Sections : fonction polynôme du second degré ; forme factorisée, racines, somme et produit ; forme canonique et complétion du carré ; discriminant et résolution ; factorisation et signe ; choisir la bonne forme ; vocabulaire logique.
- **Ch. 4** — [N11] à [N14], [N19] (et [D6]), [C24] à [C28], [D5], [A4] ; [Au3]. Sections : taux de variation et sécante ; nombre dérivé ; tangente et lecture graphique ; équation de la tangente ; approximation linéaire ; interprétations (vitesse, coût marginal) ; points de non-dérivabilité (racine carrée et valeur absolue en 0) ; sécantes en Python.
- **Ch. 5** — [N15] à [N18], [C29], [D7], [D8]. Sections : fonction dérivée ; dérivées des fonctions de référence ; dérivée de xⁿ (n ∈ ℤ) ; somme et produit par un réel ; produit ; inverse et quotient ; notations dy/dx et méthodes.
- **Ch. 6** — [N20] à [N22], [C30] à [C33], [A5] ; [C2], [C7], [C8], [C9]. Sections : signe de la dérivée et variations ; tableau de variations ; extremums et tangente horizontale ; second degré et dérivation ; optimisation ; inégalités et position relative de deux courbes ; fonctions paires et impaires ; quantificateurs et raisonnements ; méthode de Newton.
- **Ch. 7** — [N23] à [N25], [C34] à [C37], [A6], [A7]. Sections : définition ; propriétés algébriques ; nombre e et notation eˣ ; signe, variations, courbe ; fonctions t ↦ e^(kt) ; suites géométriques et modèles exponentiels ; méthode d'Euler et approximation de e.
- **Ch. 8** — [N26] à [N28], [C38], [C39], [D9], [A8]. Sections : radian et longueur d'arc ; enroulement et cercle trigonométrique ; cosinus et sinus d'un réel ; valeurs remarquables (avec démonstrations) ; angles associés ; équations simples par lecture du cercle ; méthode d'Archimède.
- **Ch. 9** — [N29] à [N32], [C40] à [C42], [D10], [D11]. Sections : rappels sur les vecteurs ; produit scalaire et projection orthogonale ; formule avec le cosinus ; propriétés (symétrie, bilinéarité) ; base orthonormée et coordonnées ; normes et identités ; formule d'Al-Kashi ; MA⃗ · MB⃗ et cercle de diamètre [AB] ; choisir une méthode.
- **Ch. 10** — [N33] à [N35], [C43] à [C47]. Sections : vecteur normal ; équation de droite par un point et un vecteur normal ; droites perpendiculaires ; projeté orthogonal et distance d'un point à une droite ; équation de cercle ; reconnaître un cercle ; étudier une configuration.
- **Ch. 11** — [N36] à [N39], [C48] à [C51], [A9] ; [Au5]. Sections : rappels (probabilité conditionnelle, tableau, arbre) ; partitions et probabilités totales ; indépendance ; deux épreuves indépendantes ; répétition d'épreuves de Bernoulli (n ⩽ 4) ; Monte-Carlo.
- **Ch. 12** — [N40] à [N44], [C52] à [C60], [A10], [A11] ; [Au4]. Sections : variable aléatoire ; loi ; espérance ; variance et écart type ; linéarité et transformation affine ; König-Huygens ; jeux équitables et décisions ; simulation et échantillons.

**Bilan** : tous les contenus, capacités, démonstrations et exemples d'algorithme de l'annexe de 2026 ont un chapitre principal. Les approfondissements sont signalés « Pour aller plus loin » quand ils sont cités (Hanoï, somme des carrés, emprunt ; polynôme de degré 3 ; loi des sinus).

## Points à trancher

1. Ordre des chapitres et durées (programme sans ordre imposé).
2. Pas de chapitre « Automatismes » ni « Logique » : faut-il une page d'entraînement dédiée dans l'application ?
3. Coupure de la dérivation en deux chapitres (4 et 5) et des suites en deux chapitres (1 et 2).
4. Recouvrement possible avec le cours de mathématiques du tronc commun (enseignement scientifique) traité par une autre session (`maths-tc`) : suites, fonctions exponentielle, probabilités. Aucune coordination de contenu n'a été faite.
