# Programme officiel : enseignement de spécialité de mathématiques, classe de première générale

## Référence

- **Texte en vigueur** : arrêté du 26 février 2026 relatif au programme d'enseignement de spécialité de mathématiques de la classe de première de la voie générale, NOR : **MENE2602917A**. L'annexe remplace celle de l'arrêté du 17 janvier 2019 (BO spécial n° 1 du 22 janvier 2019) ; application **à la rentrée de l'année scolaire 2026-2027**.
- **Bulletin officiel** : BO n° 14 du 2 avril 2026.
- **Page du BO** : https://www.education.gouv.fr/bo/2026/Hebdo14/MENE2602917A
- **Annexe lue (PDF, 11 pages)** : « Annexe – Programme d'enseignement de spécialité de mathématiques de la classe de première de la voie générale » (fichier `…-515408.pdf` sur education.gouv.fr). Texte extrait avec pdf.js dans le navigateur intégré, le 11 novembre 2026.
- **Textes voisins** (traités par d'autres sessions) : mathématiques intégrées à l'enseignement scientifique de 1re (NOR MENE2602916A, même BO) ; programme de 2de (NOR MENE2602914A, même BO).
- **Horaire** : 4 heures hebdomadaires (grille de la voie générale ; non fixé par l'annexe) ; le plan retient 32 semaines.

Le texte ci-dessous reprend l'annexe pour la structure, les contenus, les capacités attendues, les démonstrations et les exemples d'algorithme. Ajouts qui ne figurent pas dans le texte officiel : les codes entre crochets (`[N…]` contenus, `[C…]` capacités, `[D…]` démonstrations, `[A…]` algorithmes, `[Au…]` automatismes), qui servent au plan. Les approfondissements possibles (non obligatoires) sont cités sans code.

## Préambule (résumé)

- **Intentions** : consolider les acquis de la seconde, développer le goût des mathématiques et l'expérience de l'abstraction ; développer les interactions avec les autres spécialités ; préparer les choix de terminale (spécialité, éventuellement avec mathématiques expertes, ou option mathématiques complémentaires). Le programme réactive les notions de seconde et ajoute « un nombre raisonnable de nouvelles notions ».
- **Six compétences** : chercher, modéliser, représenter, raisonner, calculer, communiquer. La résolution de problèmes est le cadre privilégié ; elle s'appuie sur des **automatismes**, installés par des activités rituelles (calcul mental ou réfléchi, numérique ou littéral).
- **Autres points** : diversité des activités ; calcul sous toutes ses formes ; logiciels (calculatrice, tableur, géométrie dynamique, Python) ; évaluation à visée formative ; place de l'oral (préparation de l'épreuve orale terminale) ; trace écrite qui distingue conjecture, définition, propriété admise ou démontrée, démonstration, théorème ; travail personnel avec retour individualisé ; les professeurs précisent le cadre d'usage des outils d'intelligence artificielle.
- **Organisation** : quatre parties thématiques (« Algèbre », « Analyse », « Géométrie », « Probabilités et statistiques ») et trois parties transversales (« Vocabulaire ensembliste et logique », « Algorithmique et programmation », « Automatismes »). Le découpage « n'est pas un plan de cours ». Quelques démonstrations exemplaires ; des approfondissements possibles, « en aucun cas obligatoires » ; des items « Histoire des mathématiques ».

---

## Parties transversales

### Vocabulaire ensembliste et logique

- [N1] Élément, sous-ensemble, ensemble vide, appartenance, inclusion, réunion, intersection, complémentaire ; symboles ∅, ∈, ⊂, ∩, ∪, {…} ; ensembles de nombres et intervalles ; couple, produit cartésien ; complémentaire noté Ā ou E \ A ; Card(A).
- [C1] Lire et écrire des propositions avec « et », « ou ».
- [C2] Mobiliser un contre-exemple pour montrer qu'une proposition est fausse.
- [C3] Formuler une implication, une équivalence, et les mobiliser dans un raisonnement simple.
- [C4] Formuler la réciproque d'une implication, la contraposée.
- [C5] Employer « condition nécessaire », « condition suffisante ».
- [C6] Identifier le statut des égalités (identité, équation) et des lettres (variable, inconnue, paramètre).
- [C7] Utiliser les quantificateurs (∀ et ∃ non exigibles) ; repérer les quantifications implicites.
- [C8] Formuler la négation de propositions quantifiées.
- [C9] Raisonnements par disjonction des cas, par l'absurde, par contraposée.

### Algorithmique et programmation

- Consolidation : variables et types, affectation (← en langage naturel), instruction conditionnelle, boucles, fonctions ; accent sur la **programmation modulaire**. Langage naturel ou Python.
- **Seule notion nouvelle : la liste** [N2], mise en lien avec la notion d'ensemble ; on se limite aux listes (pas d'autres collections).
- [C10] Générer une liste (en extension, par ajouts successifs, en compréhension).
- [C11] Manipuler les éléments d'une liste (ajouter, supprimer…) et leurs indices.
- [C12] Parcourir une liste.
- [C13] Itérer sur les éléments d'une liste.

### Automatismes

Pas de chapitre spécifique : entraînement régulier sur tout le cycle terminal, privilégiant l'activité mentale. S'ajoutent aux automatismes de seconde, qui sont entretenus.

- [Au1] **Évolutions et variations** : appliquer un taux d'évolution (valeur finale ou initiale) ; calculer un taux d'évolution en pourcentage ; taux équivalent à des évolutions successives ; taux réciproque.
- [Au2] **Calcul numérique et algébrique** : équation produit nul ; signe d'une expression du premier degré, d'une expression factorisée du second degré ; développer, factoriser, réduire une expression simple.
- [Au3] **Fonctions et représentations** : résoudre graphiquement f(x) = k, f(x) < k… ; signe ou tableau de variations lus sur un graphique ; tracer une droite (équation réduite, ou point et coefficient directeur) ; lire l'équation réduite ; coefficient directeur à partir de deux points.
- [Au4] **Statistiques** : lire graphiques, histogrammes, diagrammes (barres, circulaire, boîte) ; passer du graphique aux données ; calculer et interpréter des indicateurs.
- [Au5] **Probabilités** : probabilités conditionnelles à partir d'un tableau croisé ou d'un arbre pondéré ; distinguer P(A ∩ B), P_A(B), P_B(A).

---

## Algèbre

Objectifs : suites présentées d'un point de vue principalement algébrique, comme modèles de systèmes discrets ; définition par récurrence ; passage d'un mode de génération à un autre ; évolution à taux fixe ↔ suite géométrique (rapport de deux termes consécutifs) ; sensibilisation **intuitive** à la limite (toute formalisation exclue ; calculs numériques, algorithmes de seuil). Second degré : réactiver la fonction carré et les identités ; diversifier les registres ; forme canonique dans des cas simples par complétion du carré x² + 2ax = (x + a)² − a² (le calcul de la forme canonique dans le cas général n'est pas attendu) ; factorisation directe (racines apparentes, coefficient de x nul, racines entières trouvées par somme et produit) ; lien avec la dérivée, la translation x ↦ f(x − m) et la variance.

### Suites numériques, modèles discrets

- [N3] Modes de génération : explicite u_n = f(n), récurrence u_{n+1} = f(u_n), par un algorithme, par des motifs géométriques.
- [N4] Notations u(n), u_n, (u(n)), (u_n).
- [N5] Suites arithmétiques : définition, terme général ; évolutions à accroissements constants ; lien avec les fonctions affines ; calcul de 1 + 2 + … + n.
- [N6] Suites géométriques : définition, terme général ; évolutions à taux constant ; lien avec la fonction exponentielle ; calcul de 1 + q + … + qⁿ.
- [N7] Sens de variation d'une suite.
- [N8] Sur des exemples, introduction intuitive de la limite finie ou infinie, ou de l'absence de limite.
- [C14] Passer entre langue naturelle, registre algébrique et registre graphique.
- [C15] Modéliser une situation générant une suite ; relation explicite ou de récurrence pour un motif géométrique, un dénombrement.
- [C16] Calculer des termes (explicite, récurrence, algorithme).
- [C17] Suite arithmétique ou géométrique : terme général, somme de termes consécutifs, sens de variation.
- [C18] Modéliser une croissance linéaire par une suite arithmétique, une croissance exponentielle par une suite géométrique.
- [C19] Conjecturer, dans des cas simples, la limite éventuelle d'une suite.
- [D1] Terme général d'une suite arithmétique, d'une suite géométrique. [D2] Calcul de 1 + 2 + … + n. [D3] Calcul de 1 + q + … + qⁿ.
- [A1] Calcul de termes, de sommes, de seuil. [A2] Factorielle. [A3] Liste des premiers termes : Syracuse, Fibonacci.
- Approfondissements : tour de Hanoï ; somme des n premiers carrés, cubes ; emprunt par annuités constantes.

### Équations, fonctions polynômes du second degré

- [N9] Fonction polynôme du second degré sous forme factorisée : racines, signe, somme et produit des racines.
- [N10] Forme canonique ; discriminant ; factorisation éventuelle ; résolution de l'équation du second degré ; signe.
- [C20] Signe d'un polynôme du second degré sous forme factorisée.
- [C21] Déterminer les polynômes du second degré s'annulant en deux réels distincts.
- [C22] Factoriser en diversifiant les stratégies : racine évidente, somme et produit, identité remarquable, formules générales.
- [C23] Choisir la forme adaptée (développée, canonique, factorisée) pour un problème (équation, inéquation, optimisation, variations).
- [D4] Résolution de l'équation du second degré.
- Approfondissements : polynôme du troisième degré avec une racine connue ; factorisation de xⁿ − 1, xⁿ − aⁿ ; deux nombres de somme s et de produit p, racines de x² − sx + p.

---

## Analyse

Objectifs : dérivée (point de vue local et global) et fonction exponentielle. Le nombre dérivé est introduit à partir de la perception intuitive de la limite du taux de variation, **sans définition formelle** : graphiques, calcul algébrique du taux de variation (second degré, inverse), calcul numérique de f(a + h) − f(a) pour h proche de 0 (a = 1 ; carré, inverse, racine carrée). Interprétations : pente de sécante et de tangente, vitesse moyenne et instantanée, coût marginal. Notations Δy/Δx et dy/dx signalées. Exponentielle : exemples d'utilisation (intérêts, dilution, décroissance radioactive) ; parallèle évolution géométrique discrète / exponentielle continue.

### Dérivation

- [N11] Point de vue local : taux de variation ; sécantes.
- [N12] Nombre dérivé comme limite du taux de variation ; notation f′(a).
- [N13] Tangente comme « limite des sécantes » ; pente ; équation y = f(a) + f′(a)(x − a).
- [N14] Approximation linéaire : fonction affine tangente ; f(a + h) ≈ f(a) + f′(a)h.
- [N15] Point de vue global : fonction dérivable sur un intervalle, fonction dérivée.
- [N16] Dérivées des fonctions carré, cube, inverse, racine carrée.
- [N17] Opérations : somme, produit, inverse, quotient.
- [N18] Pour n ∈ ℤ, dérivée de x ↦ xⁿ.
- [N19] Valeur absolue : étude de la dérivabilité en 0.
- [C24] Calculer un taux de variation, la pente d'une sécante.
- [C25] Interpréter le nombre dérivé en contexte (pente, vitesse instantanée, coût marginal).
- [C26] Lire graphiquement un nombre dérivé ; construire la tangente connaissant le nombre dérivé.
- [C27] Déterminer l'équation d'une tangente.
- [C28] Calculer une valeur approchée de f(a + h).
- [C29] Dans des cas simples, calculer une dérivée avec les opérations.
- [D5] Équation de la tangente. [D6] La racine carrée n'est pas dérivable en 0. [D7] Dérivées du carré et de l'inverse. [D8] Dérivée d'un produit.
- [A4] Liste des coefficients directeurs des sécantes pour un pas donné.

### Variations et courbes représentatives des fonctions

- [N20] Fonctions paires, impaires : représentations algébrique et graphique, traduction géométrique.
- [N21] Lien entre sens de variation et signe de la dérivée sur un intervalle ; caractérisation des fonctions constantes.
- [N22] Nombre dérivé en un extremum, tangente.
- [C30] Étudier les variations d'une fonction ; déterminer les extremums.
- [C31] Résoudre un problème d'optimisation.
- [C32] Exploiter les variations pour établir une inégalité ; position relative de deux courbes.
- [C33] Étudier un polynôme du second degré avec la dérivation : variations, extremum, allure selon le signe de a.
- [A5] Méthode de Newton (cas favorables).

### Fonction exponentielle

- [N23] Définition : unique fonction dérivable sur ℝ telle que f′ = f et f(0) = 1 (existence et unicité admises) ; notation exp(x).
- [N24] exp(x + y) = exp(x) exp(y) ; exp(x) exp(−x) = 1 ; nombre e ; notation eˣ.
- [N25] Signe, sens de variation, courbe ; lien avec les suites géométriques.
- [C34] Transformer une expression avec les propriétés algébriques.
- [C35] Pour a réel, dérivée de t ↦ e^(at).
- [C36] Pour k > 0, représenter t ↦ e^(−kt) et t ↦ e^(kt).
- [C37] Modéliser une croissance ou décroissance exponentielle (capital à taux fixe, décroissance radioactive).
- [A6] Méthode d'Euler. [A7] Valeur approchée de e avec la suite (1 + 1/n)ⁿ.
- Approfondissements : unicité ; démonstration de exp(x + y) = exp(x) exp(y) ; positivité et croissance.

### Trigonométrie

- [N26] Cercle trigonométrique ; longueur d'arc ; radian.
- [N27] Enroulement de la droite sur le cercle ; image d'un réel.
- [N28] Cosinus et sinus d'un réel ; lien avec le triangle rectangle ; valeurs remarquables.
- [C38] Placer un point sur le cercle trigonométrique.
- [C39] Par lecture du cercle, cosinus et sinus des angles associés à x pour des valeurs remarquables.
- [D9] Calcul de cos π/4, sin π/4, cos π/3, sin π/3.
- [A8] Approximation de π par la méthode d'Archimède.

---

## Géométrie

Objectifs : nouveaux outils métriques (produit scalaire) ; géométrie repérée enrichie pour traiter l'orthogonalité ; pratique conservée du calcul vectoriel en géométrie non repérée.

### Calcul vectoriel et produit scalaire

- [N29] Produit scalaire par la projection orthogonale et par la formule avec le cosinus ; caractérisation de l'orthogonalité.
- [N30] Bilinéarité, symétrie ; en base orthonormée, expression du produit scalaire et de la norme, critère d'orthogonalité ; coordonnées dans une base orthonormée comme produits scalaires avec les vecteurs de la base.
- [N31] Développement de ‖u + v‖² et ‖u − v‖² ; formule d'Al-Kashi.
- [N32] Transformation de MA⃗ · MB⃗.
- [C40] Démontrer une orthogonalité, calculer un angle, une longueur.
- [C41] Choisir la méthode de calcul du produit scalaire (projection, coordonnées, normes et angle, normes seules).
- [C42] Résoudre un problème géométrique avec le produit scalaire.
- [D10] Formule d'Al-Kashi. [D11] Ensemble des points M tels que MA⃗ · MB⃗ = 0.
- Approfondissements : loi des sinus ; concourance des hauteurs ; médianes et centre de gravité.

### Géométrie repérée (repère orthonormé)

- [N33] Vecteur normal à une droite ; (a ; b) est normal à ax + by + c = 0.
- [N34] Projection orthogonale d'un point sur une droite.
- [N35] Équation de cercle.
- [C43] Équation cartésienne d'une droite connaissant un point et un vecteur normal.
- [C44] Coordonnées du projeté orthogonal d'un point sur une droite.
- [C45] Équation d'un cercle de centre et rayon donnés.
- [C46] Reconnaître une équation de cercle ; centre et rayon.
- [C47] Utiliser un repère pour étudier une configuration.
- Approfondissements : points équidistants de l'axe des abscisses et d'un point ; intersection d'un cercle ou d'une parabole avec une droite parallèle à un axe.

---

## Probabilités et statistiques

Objectifs : formaliser l'indépendance (P_B(A) = P(A), avec P(B) ≠ 0) ; introduire la variable aléatoire, l'espérance, la variance, l'écart type ; distinguer modèle et réalité ; relier statistique descriptive (sous-population, proportion, moyenne, écart type, fréquences conditionnelles) et probabilités (événement, probabilité, espérance, écart type, probabilités conditionnelles) par le tirage au sort équiprobable dans une population.

### Probabilités conditionnelles et indépendance

- [N36] Indépendance de deux événements.
- [N37] Partition de l'univers (système complet) ; formule des probabilités totales.
- [N38] Succession de deux épreuves indépendantes ; arbre ou tableau.
- [N39] Pour n ⩽ 4, répétition de n épreuves de Bernoulli indépendantes et identiques (par un arbre ; la loi binomiale n'est pas citée par l'annexe de 1re).
- [C48] Calculer une probabilité avec la formule des probabilités totales (cas simples).
- [C49] Utiliser ou justifier l'indépendance.
- [C50] Représenter deux épreuves indépendantes par un arbre ou un tableau.
- [C51] Pour n ⩽ 4, arbre de la répétition d'épreuves de Bernoulli pour calculer des probabilités.
- [A9] Méthode de Monte-Carlo : aire sous la parabole, estimation de π.
- Approfondissements : succession de plusieurs épreuves indépendantes ; marches aléatoires.

### Variables aléatoires réelles

Univers finis, variables réelles ; variable aléatoire comme fonction numérique définie sur l'univers.

- [N40] Variable aléatoire réelle : modélisation ; fonction définie sur l'univers à valeurs réelles.
- [N41] Loi d'une variable aléatoire.
- [N42] Espérance, variance, écart type.
- [N43] Linéarité de l'espérance.
- [N44] Formule de König-Huygens.
- [C52] Interpréter et utiliser {X = a}, {X ⩽ a}, P(X = a), P(X ⩽ a).
- [C53] Modéliser avec une variable aléatoire.
- [C54] Déterminer une loi de probabilité.
- [C55] Calculer espérance, variance, écart type.
- [C56] Utiliser l'espérance dans un problème (mise d'un jeu équitable…).
- [A10] Algorithme renvoyant espérance, variance ou écart type. [A11] Fréquence des lettres d'un texte.
- Approfondissement : étude de x ↦ E((X − x)²).

### Expérimentations

- [C57] Simuler une variable aléatoire (Python ou tableur).
- [C58] Lire, comprendre, écrire une fonction Python renvoyant la moyenne d'un échantillon de taille n.
- [C59] Étudier la distance entre moyenne d'échantillon et espérance.
- [C60] Simuler N échantillons de taille n (espérance μ, écart type σ) ; proportion des cas où |m − μ| ⩽ 2σ/√n.

---

## Comparaison avec le programme de 2019

L'annexe de 2019 n'a pas été relue ligne à ligne pour ce dossier. Points saillants du texte de 2026, à confirmer par l'enseignant : partie « Automatismes » nouvelle ; logique enrichie (condition nécessaire ou suffisante, statut des égalités et des lettres, négation de propositions quantifiées, contraposée) ; fonctions paires et impaires ; dérivée d'un quotient et de l'inverse, de xⁿ pour n ∈ ℤ ; somme et produit des racines ; coordonnées par produits scalaires avec la base ; formule de König-Huygens ; partitions de l'univers ; répétition d'épreuves de Bernoulli limitée à n ⩽ 4.
