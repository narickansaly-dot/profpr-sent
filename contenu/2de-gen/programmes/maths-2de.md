# Programme officiel : mathématiques, classe de seconde générale et technologique

## Référence

- **Texte** : arrêté du 17 janvier 2019, « Programme d'enseignement de mathématiques de la classe de seconde générale et technologique », NOR : MENE1901631A. Entrée en vigueur à la rentrée scolaire 2019.
- **Bulletin officiel** : Bulletin officiel spécial n° 1 du 22 janvier 2019.
- **Page du BO** (non consultable automatiquement, réponse HTTP 403) : https://www.education.gouv.fr/bo/19/Special1/MENE1901631A.htm
- **URL de l'annexe lue (PDF, 16 pages, 410 341 octets)** : https://cache.media.education.gouv.fr/file/SP1-MEN-22-1-2019/95/7/spe631_annexe_1062957.pdf
- **Copie de contrôle** (même document, 16 pages) : https://www.snes.edu/IMG/pdf/maths_annexe_2egt_bo.pdf
- **Date de récupération** : 10 novembre 2026. Texte extrait avec PDFKit ; les formules dessinées comme images dans le PDF (racines carrées, fractions, flèches de vecteurs) ont été rétablies d'après leur contexte et signalées par « (formule rétablie) ».

Le texte ci-dessous reprend fidèlement l'annexe pour la structure, les contenus, les capacités attendues, les démonstrations et les exemples d'algorithme. Ajouts, qui ne figurent pas dans le texte officiel : les codes entre crochets (`[N…]` pour les contenus, `[C…]` pour les capacités attendues, `[D…]` pour les démonstrations, `[A…]` pour les exemples d'algorithme), qui servent à la table de correspondance du plan. Chaque puce « Contenus » du texte officiel donne un code `[N…]`, sans redécoupage. Les approfondissements possibles sont cités sans code : ils ne sont pas obligatoires.

## Préambule (résumé)

### Intentions majeures

La classe de seconde consolide le socle commun et prépare la transition du collège au lycée. L'enseignement des mathématiques vise à :

- consolider les acquis du collège et une culture mathématique de base, développer le goût des mathématiques ;
- préparer au choix de l'orientation (spécialité mathématiques en voie générale, série en voie technologique) ;
- assurer les bases mathématiques nécessaires à toutes les poursuites d'études au lycée.

### Six compétences mathématiques

- **chercher**, expérimenter, en particulier à l'aide d'outils logiciels ;
- **modéliser**, faire une simulation, valider ou invalider un modèle ;
- **représenter**, choisir un cadre (numérique, algébrique, géométrique…), changer de registre ;
- **raisonner**, démontrer, trouver des résultats partiels et les mettre en perspective ;
- **calculer**, appliquer des techniques et mettre en œuvre des algorithmes ;
- **communiquer** un résultat par oral ou par écrit, expliquer une démarche.

La résolution de problèmes est le cadre privilégié ; elle s'appuie sur des **automatismes** installés par des activités rituelles, notamment de calcul mental ou réfléchi, numérique ou littéral (« questions flash »).

### Autres points du préambule

- Diversité des activités (questions flash, exercices d'application, problèmes, travaux écrits hors du temps scolaire).
- Utilisation de logiciels (calculatrice, tableur, géométrie dynamique, calcul formel, Python) par le professeur, par les élèves en classe et hors de la classe.
- Évaluation variée, en lien avec les six compétences ; place de l'oral (argumentation) ; trace écrite structurée qui distingue conjecture, définition, propriété admise ou démontrée, démonstration, théorème ; travail personnel régulier.
- Lignes directrices : bienveillance et exigence, travail sur l'erreur, équilibre entre recherche, échanges, cours, exemples, exercices et rituels.

### Organisation du programme

Cinq grandes parties : « Nombres et calculs », « Géométrie », « Fonctions », « Statistiques et probabilités », « Algorithmique et programmation », plus « Vocabulaire ensembliste et logique », transversal. **Ce découpage n'est pas un plan de cours.** Le programme identifie des démonstrations exemplaires, propose des approfondissements non obligatoires et des repères d'histoire des mathématiques.

Horaire : l'annexe ne le donne pas (il est fixé par l'arrêté sur l'organisation de la classe de seconde) ; le plan retient 4 heures par semaine, sur 32 semaines.

---

## Partie 1 : Nombres et calculs

Objectifs (texte officiel, résumé) : approfondir la connaissance des ensembles de nombres ; développer le calcul numérique et algébrique ; travailler sur les inégalités ; résoudre des problèmes modélisés par des équations ou inéquations se ramenant au premier degré. Automatismes à réactiver : formes décimales exactes de 1/2, 1/4, 3/4 et des fractions k/5 pour k dans {1, 2, 3, 4} (formule rétablie), formes arrondies de 1/3 et 2/3 (formule rétablie).

Histoire : la crise des irrationnels chez les Grecs ; « nombres réels » et « nombres de la calculatrice » ; textes de Diophante, Euclide, Al-Khwarizmi, Fibonacci, Viète, Fermat, Descartes.

### 1.1 Manipuler les nombres réels

> La notion d'intervalle, présentée comme ensemble de nombres vérifiant des inégalités, est nouvelle. La notation de la valeur absolue est introduite pour exprimer la distance entre deux nombres réels et caractériser les intervalles de centre donné. Toute autre utilisation est hors programme.

Contenus :

- [N1] Ensemble ℝ des nombres réels, droite numérique.
- [N2] Intervalles de ℝ. Notations +∞ et −∞ (formule rétablie).
- [N3] Notation |a|. Distance entre deux nombres réels.
- [N4] Représentation de l'intervalle [a − r ; a + r] puis caractérisation par la condition |x − a| ⩽ r.
- [N5] Ensemble 𝔻 des nombres décimaux. Encadrement décimal d'un nombre réel à 10⁻ⁿ près.
- [N6] Ensemble ℚ des nombres rationnels. Nombres irrationnels ; exemples fournis par la géométrie, par exemple √2 et π.

Capacités attendues :

- [C1] Associer à chaque point de la droite graduée un unique nombre réel et réciproquement.
- [C2] Représenter un intervalle de la droite numérique. Déterminer si un nombre réel appartient à un intervalle donné.
- [C3] Donner un encadrement, d'amplitude donnée, d'un nombre réel par des décimaux.
- [C4] Dans le cadre de la résolution de problèmes, arrondir en donnant le nombre de chiffres significatifs adapté à la situation étudiée.

Démonstrations :

- [D1] Le nombre rationnel 1/3 n'est pas décimal (formule rétablie).
- [D2] Le nombre réel √2 est irrationnel (formule rétablie).

Exemple d'algorithme :

- [A1] Déterminer par balayage un encadrement de √2 d'amplitude inférieure ou égale à 10⁻ⁿ (formule rétablie).

Approfondissements possibles : développement décimal illimité d'un nombre réel ; périodicité du développement décimal des rationnels.

### 1.2 Utiliser les notions de multiple, diviseur et de nombre premier

Contenus :

- [N7] Notations ℕ et ℤ.
- [N8] Définition des notions de multiple, de diviseur, de nombre pair, de nombre impair.

Capacités attendues :

- [C5] Modéliser et résoudre des problèmes mobilisant les notions de multiple, de diviseur, de nombre pair, de nombre impair, de nombre premier.
- [C6] Présenter les résultats fractionnaires sous forme irréductible.

Démonstrations :

- [D3] Pour une valeur numérique de a, la somme de deux multiples de a est multiple de a.
- [D4] Le carré d'un nombre impair est impair.

Exemples d'algorithme :

- [A2] Déterminer si un entier naturel a est multiple d'un entier naturel b.
- [A3] Pour des entiers a et b donnés, déterminer le plus grand multiple de a inférieur ou égal à b.
- [A4] Déterminer si un entier naturel est premier.

### 1.3 Utiliser le calcul littéral

Contenus :

- [N9] Règles de calcul sur les puissances entières relatives, sur les racines carrées. Relation √(a²) = |a| (formule rétablie).
- [N10] Identités a² − b² = (a − b)(a + b), (a + b)² = a² + 2ab + b² et (a − b)² = a² − 2ab + b², à savoir utiliser dans les deux sens.
- [N11] Exemples simples de calcul sur des expressions algébriques, en particulier sur des expressions fractionnaires.
- [N12] Somme d'inégalités. Produit d'une inégalité par un réel positif, négatif, en liaison avec le sens de variation d'une fonction affine.
- [N13] Ensemble des solutions d'une équation, d'une inéquation.

Capacités attendues :

- [C7] Effectuer des calculs numériques ou littéraux mettant en jeu des puissances, des racines carrées, des écritures fractionnaires.
- [C8] Sur des cas simples de relations entre variables (par exemple U = RI, d = vt, S = πr², V = abc, V = πr²h), exprimer une variable en fonction des autres. Cas d'une relation du premier degré ax + by = c.
- [C9] Choisir la forme la plus adaptée (factorisée, développée réduite) d'une expression en vue de la résolution d'un problème.
- [C10] Comparer deux quantités en utilisant leur différence, ou leur quotient dans le cas positif.
- [C11] Modéliser un problème par une inéquation.
- [C12] Résoudre une inéquation du premier degré.

Démonstrations :

- [D5] Quels que soient les réels positifs a et b, on a √(ab) = √a × √b (formule rétablie).
- [D6] Si a et b sont des réels strictement positifs, √(a + b) < √a + √b (formule rétablie).
- [D7] Pour a et b réels positifs, illustration géométrique de l'égalité (a + b)² = a² + 2ab + b².

Exemple d'algorithme :

- [A5] Déterminer la première puissance d'un nombre positif donné supérieure ou inférieure à une valeur donnée.

Approfondissements possibles : développement de (a + b + c)² et de (a + b)³ ; inégalité entre moyennes géométrique et arithmétique.

---

## Partie 2 : Géométrie

Objectifs (résumé) : consolider les configurations du collège ; introduire les vecteurs du plan comme outil, notamment pour la physique ; poursuivre la géométrie repérée et introduire la notion d'ensemble de points décrit par une équation (équations de droites). Le plan est muni d'un repère orthonormé. Cadre : géométrie plane ; des activités peuvent mobiliser la géométrie dans l'espace du collège.

Histoire : rôle central de la géométrie grecque dans la naissance de la démonstration ; Descartes et la géométrie repérée.

### 2.1 Manipuler les vecteurs du plan

> On s'appuie sur la translation (cycle 4) pour introduire la notion de vecteur. […] La relation u⃗ = x i⃗ + y j⃗ est mise en évidence. La relation de Chasles est introduite pour illustrer l'addition des vecteurs, mais ne fait pas l'objet d'un travail spécifique.

Contenus :

- [N14] Vecteur associé à la translation qui transforme M en M'. Direction, sens et norme.
- [N15] Égalité de deux vecteurs. Notation u⃗. Vecteur nul.
- [N16] Somme de deux vecteurs en lien avec l'enchaînement des translations. Relation de Chasles.
- [N17] Base orthonormée. Coordonnées d'un vecteur. Expression de la norme d'un vecteur.
- [N18] Expression des coordonnées de AB⃗ en fonction de celles de A et de B (formule rétablie).
- [N19] Produit d'un vecteur par un nombre réel. Colinéarité de deux vecteurs.
- [N20] Déterminant de deux vecteurs dans une base orthonormée, critère de colinéarité. Application à l'alignement, au parallélisme.

Capacités attendues :

- [C13] Représenter géométriquement des vecteurs.
- [C14] Construire géométriquement la somme de deux vecteurs.
- [C15] Représenter un vecteur dont on connaît les coordonnées. Lire les coordonnées d'un vecteur.
- [C16] Calculer les coordonnées d'une somme de vecteurs, d'un produit d'un vecteur par un nombre réel.
- [C17] Calculer la distance entre deux points. Calculer les coordonnées du milieu d'un segment.
- [C18] Caractériser alignement et parallélisme par la colinéarité de vecteurs.
- [C19] Résoudre des problèmes en utilisant la représentation la plus adaptée des vecteurs.

Démonstration :

- [D8] Deux vecteurs sont colinéaires si et seulement si leur déterminant est nul.

Approfondissement possible : définition vectorielle des homothéties.

### 2.2 Résoudre des problèmes de géométrie

Contenus :

- [N21] Projeté orthogonal d'un point sur une droite.

Capacités attendues :

- [C20] Résoudre des problèmes de géométrie plane sur des figures simples ou complexes (triangles, quadrilatères, cercles).
- [C21] Calculer des longueurs, des angles, des aires et des volumes.
- [C22] Traiter de problèmes d'optimisation.

Démonstrations :

- [D9] Le projeté orthogonal du point M sur une droite Δ est le point de la droite Δ le plus proche du point M.
- [D10] Relation trigonométrique cos²(α) + sin²(α) = 1 dans un triangle rectangle.

Approfondissements possibles : concours des hauteurs ; aire d'un triangle ½ ab sin C (formule rétablie) ; formule d'Al-Kashi ; centre du cercle circonscrit.

### 2.3 Représenter et caractériser les droites du plan

> Au cycle 4, les élèves ont rencontré les équations de droite pour représenter les fonctions affines. En seconde, ils étendent l'étude à la forme générale des équations de droite. Dans cette section, le plan est muni d'un repère orthonormé.

Contenus :

- [N22] Vecteur directeur d'une droite.
- [N23] Équation de droite : équation cartésienne, équation réduite.
- [N24] Pente (ou coefficient directeur) d'une droite non parallèle à l'axe des ordonnées.

Capacités attendues :

- [C23] Déterminer une équation de droite à partir de deux points, un point et un vecteur directeur ou un point et la pente.
- [C24] Déterminer la pente ou un vecteur directeur d'une droite donnée par une équation ou une représentation graphique.
- [C25] Tracer une droite connaissant son équation cartésienne ou réduite.
- [C26] Établir que trois points sont alignés ou non.
- [C27] Déterminer si deux droites sont parallèles ou sécantes.
- [C28] Résoudre un système de deux équations linéaires à deux inconnues, déterminer le point d'intersection de deux droites sécantes.

Démonstration :

- [D11] En utilisant le déterminant, établir la forme générale d'une équation de droite.

Exemples d'algorithme :

- [A6] Étudier l'alignement de trois points dans le plan.
- [A7] Déterminer une équation de droite passant par deux points donnés.

Approfondissements possibles : ensemble des points équidistants d'un point et de l'axe des abscisses ; parties du plan décrites par des inégalités sur les coordonnées.

---

## Partie 3 : Fonctions

Objectifs (résumé) : consolider la notion de fonction comme dépendance d'une variable par rapport à une autre ; exploiter les registres algébrique et graphique ; étendre la panoplie des fonctions de référence ; étudier variations et extremums. Fonctions définies sur un intervalle de ℝ ; exemples possibles de fonctions définies sur ℕ (notation u(n)) ; variable t pour les phénomènes dépendant du temps. Les propriétés (parité, monotonie sur un intervalle…) sont d'abord découvertes sur les fonctions de référence ; leur formalisation est l'occasion d'un travail sur les quantificateurs.

Histoire : lente élaboration de la notion de fonction, de l'Antiquité à Dirichlet ; Newton, Leibniz, Euler.

### 3.1 Se constituer un répertoire de fonctions de référence

Contenus :

- [N25] Fonctions carré, inverse, racine carrée, cube : définitions et courbes représentatives.

Capacités attendues :

- [C29] Pour deux nombres a et b donnés et une fonction de référence f, comparer f(a) et f(b) numériquement ou graphiquement.
- [C30] Pour les fonctions affines, carré, inverse, racine carrée et cube, résoudre graphiquement ou algébriquement une équation ou une inéquation du type f(x) = k, f(x) < k.

Démonstration :

- [D12] Étudier la position relative des courbes d'équation y = x, y = x², y = x³, pour x ⩾ 0.

### 3.2 Représenter algébriquement et graphiquement les fonctions

Contenus :

- [N26] Fonction à valeurs réelles définie sur un intervalle ou une réunion finie d'intervalles de ℝ.
- [N27] Courbe représentative : la courbe d'équation y = f(x) est l'ensemble des points du plan dont les coordonnées (x, y) vérifient y = f(x).
- [N28] Fonction paire, impaire. Traduction géométrique.

Capacités attendues :

- [C31] Exploiter l'équation y = f(x) d'une courbe : appartenance, calcul de coordonnées.
- [C32] Modéliser par des fonctions des situations issues des mathématiques, des autres disciplines.
- [C33] Résoudre une équation ou une inéquation du type f(x) = k, f(x) < k, en choisissant une méthode adaptée : graphique, algébrique, logicielle.
- [C34] Résoudre une équation, une inéquation produit ou quotient, à l'aide d'un tableau de signes.
- [C35] Résoudre, graphiquement ou à l'aide d'un outil numérique, une équation ou inéquation du type f(x) = g(x), f(x) < g(x).

Approfondissement possible : étudier la parité d'une fonction dans des cas simples.

### 3.3 Étudier les variations et les extremums d'une fonction

Contenus :

- [N29] Croissance, décroissance, monotonie d'une fonction définie sur un intervalle. Tableau de variations.
- [N30] Maximum, minimum d'une fonction sur un intervalle.
- [N31] Pour une fonction affine, interprétation du coefficient directeur comme taux d'accroissement, variations selon son signe.
- [N32] Variations des fonctions carré, inverse, racine carrée, cube.

Capacités attendues :

- [C36] Relier représentation graphique et tableau de variations.
- [C37] Déterminer graphiquement les extremums d'une fonction sur un intervalle.
- [C38] Exploiter un logiciel de géométrie dynamique ou de calcul formel, la calculatrice ou Python pour décrire les variations d'une fonction donnée par une formule.
- [C39] Relier sens de variation, signe et droite représentative d'une fonction affine.

Démonstration :

- [D13] Variations des fonctions carré, inverse, racine carrée.

Exemples d'algorithme :

- [A8] Pour une fonction dont le tableau de variations est donné, algorithmes d'approximation numérique d'un extremum (balayage, dichotomie).
- [A9] Algorithme de calcul approché de longueur d'une portion de courbe représentative de fonction.

Approfondissement possible : relier les courbes des fonctions racine carrée et carré sur ℝ+.

---

## Partie 4 : Statistiques et probabilités

Objectifs (résumé) : consolider l'information chiffrée par l'étude de situations multiplicatives (proportion de proportion, évolutions successives ou réciproques) ; distinguer un pourcentage qui exprime une proportion d'un pourcentage qui exprime une évolution ; introduire moyenne pondérée, écart interquartile et écart type ; formaliser la loi de probabilité dans le cas fini avec le langage des ensembles ; une loi de probabilité est une hypothèse du modèle et ne se démontre pas ; distinguer nettement le modèle probabiliste et la situation réelle.

Histoire : problème des partis (chevalier de Méré), correspondance de Pascal et Fermat, Huygens ; problème du duc de Toscane ; Leibniz.

### 4.1 Utiliser l'information chiffrée et statistique descriptive

Contenus :

- [N33] Proportion, pourcentage d'une sous-population dans une population.
- [N34] Ensembles de référence inclus les uns dans les autres : pourcentage de pourcentage.
- [N35] Évolution : variation absolue, variation relative.
- [N36] Évolutions successives, évolution réciproque : relation sur les coefficients multiplicateurs (produit, inverse).
- [N37] Indicateurs de tendance centrale d'une série statistique : moyenne pondérée.
- [N38] Linéarité de la moyenne.
- [N39] Indicateurs de dispersion : écart interquartile, écart type.

Capacités attendues :

- [C40] Exploiter la relation entre effectifs, proportions et pourcentages.
- [C41] Traiter des situations simples mettant en jeu des pourcentages de pourcentages.
- [C42] Exploiter la relation entre deux valeurs successives et leur taux d'évolution.
- [C43] Calculer le taux d'évolution global à partir des taux d'évolution successifs. Calculer un taux d'évolution réciproque.
- [C44] Décrire verbalement les différences entre deux séries statistiques, en s'appuyant sur des indicateurs ou sur des représentations graphiques données.
- [C45] Pour des données réelles ou issues d'une simulation, lire et comprendre une fonction écrite en Python renvoyant la moyenne m, l'écart type s, et la proportion d'éléments appartenant à [m − 2s, m + 2s].

### 4.2 Modéliser le hasard, calculer des probabilités

L'ensemble des issues est fini.

Contenus :

- [N40] Ensemble (univers) des issues. Événements. Réunion, intersection, complémentaire.
- [N41] Loi (distribution) de probabilité. Probabilité d'un événement : somme des probabilités des issues.
- [N42] Relation P(A ∪ B) + P(A ∩ B) = P(A) + P(B).
- [N43] Dénombrement à l'aide de tableaux et d'arbres.

Capacités attendues :

- [C46] Utiliser des modèles théoriques de référence (dé, pièce équilibrée, tirage au sort avec équiprobabilité dans une population) en comprenant que les probabilités sont définies a priori.
- [C47] Construire un modèle à partir de fréquences observées, en distinguant nettement modèle et réalité.
- [C48] Calculer des probabilités dans des cas simples : expérience aléatoire à deux ou trois épreuves.

### 4.3 Échantillonnage

> En liaison avec la partie « Algorithmique et programmation », on définit la notion d'échantillon. L'objectif est de faire percevoir, sous une forme expérimentale, la loi des grands nombres, la fluctuation d'échantillonnage et le principe de l'estimation d'une probabilité par une fréquence observée sur un échantillon.

Contenus :

- [N44] Échantillon aléatoire de taille n pour une expérience à deux issues.
- [N45] Version vulgarisée de la loi des grands nombres : « Lorsque n est grand, sauf exception, la fréquence observée est proche de la probabilité. »
- [N46] Principe de l'estimation d'une probabilité, ou d'une proportion dans une population, par une fréquence observée sur un échantillon.

Capacités attendues :

- [C49] Lire et comprendre une fonction Python renvoyant le nombre ou la fréquence de succès dans un échantillon de taille n pour une expérience aléatoire à deux issues.
- [C50] Observer la loi des grands nombres à l'aide d'une simulation sur Python ou tableur.
- [C51] Simuler N échantillons de taille n d'une expérience aléatoire à deux issues. Si p est la probabilité d'une issue et f sa fréquence observée dans un échantillon, calculer la proportion des cas où l'écart entre p et f est inférieur ou égal à 1/√n (formule rétablie).

---

## Partie 5 : Algorithmique et programmation

> Une consolidation des acquis du cycle 4 est proposée autour de deux idées essentielles : la notion de fonction ; la programmation comme production d'un texte dans un langage informatique.

Les élèves s'exercent à décrire des algorithmes en langage naturel ou en Python, à en réaliser quelques-uns, à interpréter, compléter ou modifier des algorithmes plus complexes. Le langage choisi est **Python**. Les problèmes traités sont en relation avec les autres parties du programme et avec les autres disciplines ; exigence d'exactitude, de rigueur, de vérification.

### 5.1 Utiliser les variables et les instructions élémentaires

Contenus :

- [N47] Variables informatiques de type entier, booléen, flottant, chaîne de caractères.
- [N48] Affectation (notée ← en langage naturel).
- [N49] Séquence d'instructions.
- [N50] Instruction conditionnelle.
- [N51] Boucle bornée (for), boucle non bornée (while).

Capacités attendues :

- [C52] Choisir ou déterminer le type d'une variable (entier, flottant ou chaîne de caractères).
- [C53] Concevoir et écrire une instruction d'affectation, une séquence d'instructions, une instruction conditionnelle.
- [C54] Écrire une formule permettant un calcul combinant des variables.
- [C55] Programmer, dans des cas simples, une boucle bornée, une boucle non bornée.
- [C56] Dans des cas plus complexes : lire, comprendre, modifier ou compléter un algorithme ou un programme.

### 5.2 Notion de fonction

Contenus :

- [N52] Fonctions à un ou plusieurs arguments.
- [N53] Fonction renvoyant un nombre aléatoire. Série statistique obtenue par la répétition de l'appel d'une telle fonction.

Capacités attendues :

- [C57] Écrire des fonctions simples ; lire, comprendre, modifier, compléter des fonctions plus complexes. Appeler une fonction.
- [C58] Lire et comprendre une fonction renvoyant une moyenne, un écart type. Aucune connaissance sur les listes n'est exigée.
- [C59] Écrire des fonctions renvoyant le résultat numérique d'une expérience aléatoire, d'une répétition d'expériences aléatoires indépendantes.

---

## Vocabulaire ensembliste et logique (transversal)

> L'apprentissage des notations mathématiques et de la logique est transversal à tous les chapitres du programme.

- [N54] Élément d'un ensemble, sous-ensemble, appartenance et inclusion, réunion, intersection et complémentaire ; symboles ∈, ⊂, ∩, ∪ ; notation des ensembles de nombres et des intervalles. Notion de couple. Complémentaire d'un sous-ensemble A de E : notation Ā ou E \ A.

Les élèves apprennent en situation à :

- [C60] reconnaître ce qu'est une proposition mathématique, utiliser des variables pour écrire des propositions mathématiques ;
- [C61] lire et écrire des propositions contenant les connecteurs « et », « ou » ;
- [C62] formuler la négation de propositions simples (sans implication ni quantificateurs) ;
- [C63] mobiliser un contre-exemple pour montrer qu'une proposition est fausse ;
- [C64] formuler une implication, une équivalence logique, et les mobiliser dans un raisonnement simple ;
- [C65] formuler la réciproque d'une implication ;
- [C66] lire et écrire des propositions contenant une quantification universelle ou existentielle (les symboles ∀ et ∃ sont hors programme).

Par ailleurs, les élèves produisent des raisonnements par disjonction des cas et par l'absurde ([C67], code ajouté).

## Bilan des codes

- Contenus : [N1] à [N54] (54).
- Capacités attendues : [C1] à [C67] (67, dont [C60] à [C67] pour la logique).
- Démonstrations : [D1] à [D13] (13).
- Exemples d'algorithme : [A1] à [A9] (9).
