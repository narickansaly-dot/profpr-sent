# Programme de numérique et sciences informatiques (NSI), spécialité, première générale

## Référence officielle

- **Arrêté du 17 janvier 2019** fixant le programme d'enseignement de spécialité de numérique et sciences informatiques de la classe de première de la voie générale, **NOR MENE1901633A**, JO du 20 janvier 2019, **BO spécial n° 1 du 22 janvier 2019**. Entré en vigueur à la rentrée 2019.
- **Toujours en vigueur en 2026-2027** (vérifié le 11 novembre 2026) :
  - le BO n° 14 du 2 avril 2026, qui remplace les programmes de mathématiques (2de, 1re, Tle), ne touche pas la NSI ;
  - aucun arrêté de 2025 ou de 2026 ne modifie le programme de NSI de première ;
  - la note de service du 11 septembre 2026 (NOR MENE2622643N, BO spécial n° 4 du 17 septembre 2026) redéfinit seulement l'**épreuve terminale** de NSI à partir de la session 2027 (écrit 3 h 30 coefficient 0,75, pratique 1 h coefficient 0,25). Elle remplace la note du 4 juillet 2025 (NOR MENE2516123N) et rappelle que les notions de première non approfondies en terminale « doivent être connues et mobilisables ».
- Texte de l'annexe lu dans le PDF du BO (copie déposée par le SNES, `nsi_spe_annexe_1eg_bo.pdf`) ; page du BO consultée sur education.gouv.fr.
- Horaire : 4 heures par semaine en première. Au moins **un quart de l'horaire** est réservé à des **projets** menés par groupes de deux à quatre élèves.

## Préambule (résumé)

- Enseignement **non professionnalisant** : appropriation des concepts et méthodes de l'informatique, préparation au supérieur.
- **Quatre concepts** : les **données** (représentation numérique unifiée), les **algorithmes** (traitements abstraits et précis), les **langages** (traduction des algorithmes en programmes), les **machines** (avec leurs systèmes d'exploitation, objets connectés et réseaux). Élément transversal : les **interfaces**.
- Compétences : analyser et modéliser un problème ; décomposer en sous-problèmes ; concevoir des solutions algorithmiques ; traduire en programme, spécifier, réutiliser du code, tester ; mobiliser les technologies d'acquisition, mémorisation, traitement, diffusion ; abstraction et généralisation.
- Compétences transversales : autonomie, argumentation, travail d'équipe, recherche d'information, usage responsable.
- Langage : **Python 3**. L'expertise dans un langage n'est pas un objectif de formation.
- Le programme compte **huit rubriques**, qui ne sont **pas un plan de cours**.

## Les huit rubriques (codes utilisés dans le plan)

### [H] Histoire de l'informatique (transversale)

Repères du texte : algorithmes dès l'Antiquité ; machines à calculer au XVIIe siècle ; sciences de l'information au XIXe siècle ; **1936** : concept de machine universelle ; **1948** : premiers ordinateurs ; diversification (téléphones, tablettes, serveurs…) ; **internet développé depuis 1969**.
- [H1] Situer dans le temps les principaux événements de l'histoire de l'informatique et leurs protagonistes (repères construits au fil des concepts).

### [D] Représentation des données : types et valeurs de base

- [D1] Écriture d'un entier positif dans une base b ⩾ 2 : passer d'une base à une autre (bases 2, 10 et 16 privilégiées).
- [D2] Représentation binaire d'un entier relatif : évaluer le nombre de bits nécessaires pour écrire un entier, la somme ou le produit de deux entiers ; utiliser le **complément à 2**. Tailles courantes 8, 16, 32, 64 bits ; on peut évoquer les entiers de taille arbitraire de Python.
- [D3] Représentation approximative des réels, **nombres flottants** : calculer sur quelques exemples (0.1, 0.25, 1/3) ; 0.2 + 0.1 n'est pas égal à 0.3 ; éviter de tester l'égalité de deux flottants ; aucune connaissance précise d'IEEE-754 exigible.
- [D4] Booléens : valeurs 0, 1 ; opérateurs and, or, not ; dresser la **table** d'une expression booléenne ; **xor** évoqué ; applications comme l'**addition binaire** ; caractère **séquentiel** (évaluation paresseuse) de certains opérateurs.
- [D5] Représentation d'un texte : encodages **ASCII, ISO-8859-1, Unicode** ; identifier l'intérêt des encodages ; convertir un fichier texte d'un format à un autre ; aucune connaissance précise des normes exigible.

### [C] Représentation des données : types construits

- [C1] p-uplets, p-uplets nommés : écrire une fonction qui renvoie un p-uplet.
- [C2] Tableau indexé, tableau en compréhension : lire et modifier par index ; construire par compréhension ; **tableaux de tableaux** (matrices, notation a[i][j]) ; itérer sur un tableau. Éléments de même type ; tranches non exigibles ; aspect dynamique des listes non évoqué ; pas de NumPy.
- [C3] Dictionnaires : construire une entrée ; itérer ; méthodes **keys(), values(), items()** ; exemple des données EXIF ; en Python, les p-uplets nommés sont réalisés par des dictionnaires.

### [T] Traitement de données en tables

Table = liste de p-uplets nommés partageant les mêmes descripteurs ; préparation aux bases de données (terminale), sans SGBD.
- [T1] Indexation : importer une table depuis un fichier texte tabulé ou **CSV**.
- [T2] Recherche : lignes vérifiant des critères en logique propositionnelle ; recherche de **doublons**, **tests de cohérence**.
- [T3] Tri d'une table selon une colonne (fonction de tri intégrée autorisée).
- [T4] **Fusion** de tables : construire une table en combinant deux tables ; notion de **domaine de valeurs**.

### [W] Interactions entre l'homme et la machine sur le Web

- [W1] Modalités de l'interaction, **événements** : identifier les composants graphiques d'une application Web et les événements qu'ils traitent ; distinguer description en HTML et comportement programmé (JavaScript).
- [W2] Interaction dans une page : analyser et modifier les méthodes exécutées lors d'un clic sur un bouton.
- [W3] Interaction **client-serveur**, requêtes **HTTP** et réponses : distinguer ce qui s'exécute sur le client ou le serveur et dans quel ordre ; ce qui est mémorisé côté client et retransmis ; quand et pourquoi la transmission est **chiffrée** ; passage de paramètres par HTTP.
- [W4] **Formulaire** : analyser un formulaire simple ; distinguer **GET** et **POST** ; discuter selon le type des valeurs et leur confidentialité.

### [A] Architectures matérielles et systèmes d'exploitation

- [A1] Modèle d'architecture séquentielle (**von Neumann**) : rôles et caractéristiques des constituants ; dérouler une séquence d'instructions de type **langage machine** ; monoprocesseur / multiprocesseur ; activités débranchées ; les **circuits combinatoires** réalisent des fonctions booléennes.
- [A2] Transmission de données dans un **réseau**, protocoles, architecture : intérêt du découpage en **paquets** et de l'**encapsulation** ; dérouler le protocole du **bit alterné** ; simuler ou mettre en œuvre un réseau ; lien avec TCP/IP (2de) ; constituants du réseau local.
- [A3] **Systèmes d'exploitation** : fonctions ; **commandes de base** en ligne de commande ; **droits et permissions** sur les fichiers ; systèmes libres et propriétaires ; pas d'étude théorique.
- [A4] Périphériques d'entrée-sortie, **IHM** : rôle des **capteurs et actionneurs** ; réaliser par programmation une IHM répondant à un cahier des charges (objets connectés, systèmes embarqués, robots).

### [L] Langages et programmation

- [L1] **Constructions élémentaires** : séquences, affectation, conditionnelles, boucles bornées et non bornées, appels de fonction.
- [L2] Diversité et unité des langages : repérer traits communs et particuliers ; comparer un même programme dans plusieurs langages ; styles impératif, fonctionnel, objet, logique, événementiel ; langages de description ou de requêtes qui ne sont pas des langages de programmation.
- [L3] **Spécification** : prototyper une fonction ; décrire **préconditions** et **postconditions** ; **assertions**.
- [L4] Mise au point : **jeux de tests** ; importance de la qualité et du nombre de tests ; le succès d'un jeu de tests ne garantit pas la correction.
- [L5] **Bibliothèques** : utiliser la documentation ; modularisation et réutilisation.

### [G] Algorithmique

Méthode algorithmique ; algorithmes classiques ; coût sur des données nombreuses (données ouvertes) ; **correction** par **invariant** ; **terminaison** par **variant** dès qu'il y a une boucle non bornée.
- [G1] Parcours séquentiel d'un tableau : recherche d'une occurrence, d'un extremum, calcul d'une moyenne ; **coût linéaire**.
- [G2] **Tris par insertion et par sélection** : écrire un tri ; invariant de boucle ; terminaison ; **coût quadratique** dans le pire cas.
- [G3] **k plus proches voisins** : prédire la classe d'un élément par la classe majoritaire de ses k plus proches voisins ; exemple d'algorithme d'**apprentissage**.
- [G4] **Recherche dichotomique** dans un tableau trié : terminaison par variant ; assertions ; preuve de correction présentée par le professeur.
- [G5] **Algorithmes gloutons** : résoudre un problème par un algorithme glouton (sac à dos, rendu de monnaie) ; une méthode parmi d'autres.
