# Programme officiel : sciences numériques et technologie, classe de seconde générale et technologique

## Référence

- **Texte** : arrêté du 17 janvier 2019 fixant le programme d'enseignement de sciences numériques et technologie de la classe de seconde générale et technologique, publié au **Bulletin officiel spécial n° 1 du 22 janvier 2019**. Entrée en vigueur à la rentrée scolaire 2019.
- **Horaire** : 1 h 30 hebdomadaire (enseignement commun de seconde).
- **Sources tentées le 10 novembre 2026** (aucune n'a pu être lue automatiquement) :
  - page du BO : https://www.education.gouv.fr/bo/19/Special1/MENE1901633A.htm (HTTP 403) ;
  - pages Eduscol « Sciences numériques et technologie » (HTTP 403 après redirection vers eduscol.education.gouv.fr) ;
  - PDF du BO spécial complet : http://cache.media.education.gouv.fr/file/SP1-MEN-22-1-2019/06/0/SP1_MEN_22_1_2019_10H40_1064060.pdf (plus de 10 Mo, trop gros pour l'outil de lecture).

> **Avertissement.** Contrairement au résumé du programme de STSS, ce document **n'a pas été recopié depuis le texte officiel** : il est reconstitué à partir de la connaissance du programme, dans sa structure (sept thèmes, contenus et capacités attendues, programmation transversale). Les intitulés des contenus et des capacités suivent le texte officiel d'aussi près que possible, mais **leur formulation exacte, les repères historiques et le NOR sont à vérifier** contre le BO avant validation. Point à trancher n° 1 du bilan.

Les codes entre crochets (`[T…]` pour les thèmes, `[C…]` pour les capacités) ne figurent pas dans le texte officiel : ils servent à la table de correspondance du plan (`snt-2de-plan.md`).

## Organisation générale

L'enseignement de SNT a pour objet de permettre d'appréhender les principaux concepts des sciences numériques et de permettre aux élèves, à partir d'un objet technologique, de comprendre le poids croissant du numérique et les enjeux qui en découlent. La numérisation généralisée des données, les nouvelles modalités de traitement ou de stockage et le développement récent d'objets et de plateformes connectés ont profondément modifié les pratiques humaines.

Le programme s'appuie sur **quatre concepts fondamentaux** de l'informatique :

- les **données**, qui représentent sous une forme numérique unifiée des informations très diverses (textes, images, sons, mesures physiques, sommes d'argent…) ;
- les **algorithmes**, qui spécifient de façon abstraite et précise des traitements à effectuer sur les données ;
- les **langages**, qui permettent de traduire les algorithmes abstraits en programmes textuels ou graphiques exécutables par les machines ;
- les **machines**, et leurs systèmes d'exploitation, qui permettent d'exécuter des programmes en enchaînant un grand nombre d'instructions simples.

Chaque thème est traité selon la même structure : une introduction et des **repères historiques** ; les **données et informations**, les **algorithmes et programmes**, les **machines** concernées ; les **impacts sur les pratiques humaines** ; un tableau **Contenus / Capacités attendues** ; des **exemples d'activités**.

### Les sept thèmes

1. [T1] Internet
2. [T2] Le Web
3. [T3] Les réseaux sociaux
4. [T4] Les données structurées et leur traitement
5. [T5] Localisation, cartographie et mobilité
6. [T6] Informatique embarquée et objets connectés
7. [T7] La photographie numérique

L'ordre des thèmes n'est pas imposé. Une **approche par projets** est recommandée : les élèves réalisent des projets, seuls ou en groupe, qui mobilisent les capacités des thèmes.

## La programmation [TP]

La programmation n'est pas un thème à part : elle est mise en œuvre dans les différents thèmes, avec le **langage Python**. Le programme fixe les notions suivantes, que les élèves doivent savoir mobiliser :

| Notions | Capacités attendues |
| --- | --- |
| Affectations, variables | [CP1] Écrire et développer des programmes pour répondre à des problèmes et modéliser des phénomènes physiques, économiques et sociaux. |
| Séquences d'instructions | (même capacité) |
| Instructions conditionnelles | (même capacité) |
| Boucles bornées et non bornées | (même capacité) |
| Définitions et appels de fonctions | (même capacité) |

## [T1] Internet

**Introduction.** Internet est un réseau de réseaux mondial, qui permet d'échanger des données entre des machines de toutes sortes grâce à des protocoles communs. Le Web n'est qu'une des applications d'Internet, au même titre que le courrier électronique ou l'échange de fichiers.

**Repères historiques** : 1969, ARPANET relie les premiers ordinateurs ; 1974, Vinton Cerf et Robert Kahn publient le protocole TCP/IP ; 1983, ARPANET adopte TCP/IP ; 1984, création du DNS ; années 1990, ouverture au grand public et développement des fournisseurs d'accès.

**Données et informations** : les données circulent découpées en paquets, chacun muni des adresses de l'expéditeur et du destinataire. **Algorithmes et programmes** : routage des paquets, protocoles de transmission. **Machines** : routeurs, serveurs, terminaux, liens physiques (fibre, cuivre, radio). **Impacts** : explosion du volume de données échangées, consommation d'énergie, neutralité du Net, usages pair-à-pair licites et illicites.

| Contenus | Capacités attendues |
| --- | --- |
| Protocole TCP/IP : paquets, routage des paquets | [C1] Distinguer le rôle des protocoles IP et TCP. [C2] Caractériser les principes du routage et ses limites. [C3] Distinguer la fiabilité de transmission et l'absence de garantie temporelle. |
| Adresses symboliques et serveurs DNS | [C4] Sur des exemples réels, retrouver une adresse IP à partir d'une adresse symbolique et inversement. |
| Réseaux pair-à-pair | [C5] Décrire l'intérêt des réseaux pair-à-pair ainsi que les usages illicites qu'on peut en faire. |
| Indépendance d'Internet par rapport au réseau physique | [C6] Caractériser quelques types de réseaux physiques : obsolètes ou actuels, rapides ou lents, filaires ou non. [C7] Caractériser l'ordre de grandeur du trafic de données sur Internet et son évolution. |

**Exemples d'activités** : illustrer le fonctionnement du routage et de TCP par des activités débranchées ou à l'aide de logiciels dédiés, en tenant compte de la destruction de paquets ; déterminer l'adresse IP d'un équipement et l'adresse du DNS sur un réseau ; analyser son réseau local pour observer ce qui y est connecté ; suivre le chemin d'un courriel en utilisant une commande du protocole IP.

## [T2] Le Web

**Introduction.** Le Web (toile ou réseau) désigne un système donnant accès à un ensemble de données (page, image, son, vidéo) reliées par des liens hypertextes et accessibles sur le réseau Internet.

**Repères historiques** : 1965, Ted Nelson invente le terme « hypertexte » ; 1989, Tim Berners-Lee propose au CERN un système de documents liés, qui deviendra le Web ; 1993, le navigateur Mosaic et la mise du Web dans le domaine public ; 1994, création du W3C ; 1998, création du moteur de recherche Google.

**Données et informations** : pages écrites en HTML et mises en forme par CSS, identifiées par des URL. **Algorithmes et programmes** : navigateurs, serveurs, moteurs de recherche (indexation, classement des pages). **Machines** : clients et serveurs. **Impacts** : accès universel à l'information, enjeux de la publication, traces et cookies, droit d'auteur.

| Contenus | Capacités attendues |
| --- | --- |
| Repères historiques | [C8] Connaître les étapes du développement du Web. |
| Notions juridiques | [C9] Connaître certaines notions juridiques (licence, droit d'auteur, droit d'usage, valeur d'un bien). |
| Hypertexte | [C10] Maîtriser les renvois d'un texte à différents contenus. |
| Langages HTML et CSS | [C11] Distinguer ce qui relève du contenu d'une page et de son style de présentation. [C12] Étudier et modifier une page HTML simple. |
| URL | [C13] Décomposer l'URL d'une page. [C14] Reconnaître les pages sécurisées. |
| Requête HTTP | [C15] Décomposer le contenu d'une requête HTTP et identifier les paramètres passés. |
| Modèle client/serveur | [C16] Inspecter le code d'une page hébergée par un serveur et distinguer ce qui est exécuté par le client et par le serveur. |
| Moteurs de recherche : principes et usages | [C17] Mener une analyse critique des résultats fournis par un moteur de recherche. [C18] Comprendre les enjeux de la publication d'informations. |
| Paramètres de sécurité d'un navigateur | [C19] Maîtriser les réglages les plus importants concernant la gestion des cookies, la sécurité et la confidentialité d'un navigateur. [C20] Sécuriser sa navigation en ligne et analyser les pages et fichiers. |

**Exemples d'activités** : construire une page Web simple contenant des liens hypertextes, la mettre en ligne ; modifier une page en changeant son contenu ou sa feuille de style ; utiliser les outils de développement du navigateur ; comparer les résultats de plusieurs moteurs de recherche ; régler les paramètres de confidentialité de son navigateur.

## [T3] Les réseaux sociaux

**Introduction.** Les réseaux sociaux sont des applications basées sur les technologies du Web qui offrent un service de mise en relation d'internautes pour développer des communautés d'intérêts.

**Repères historiques** : 1967, expérience de Stanley Milgram sur le « petit monde » ; 1995, Classmates ; 2003, LinkedIn ; 2004, Facebook ; 2006, Twitter ; 2010, Instagram ; 2011, Snapchat ; 2016, TikTok (Douyin).

**Données et informations** : profils, liens d'abonnement ou d'amitié, publications, réactions. **Algorithmes et programmes** : modélisation par des graphes, algorithmes de recommandation et de sélection des contenus. **Machines** : centres de données des plateformes. **Impacts** : identité numérique, e-réputation, bulles de filtres, modèle économique fondé sur la publicité ciblée, cyberviolence.

| Contenus | Capacités attendues |
| --- | --- |
| Identité numérique, e-réputation, identification, authentification | [C21] Connaître les principales caractéristiques des réseaux sociaux, les comparer et les situer historiquement. [C22] Paramétrer des abonnements pour assurer la confidentialité de données personnelles. |
| Réseaux sociaux existants | [C21] |
| Modèle économique des réseaux sociaux | [C23] Identifier les sources de revenus des entreprises de réseautage social. |
| Rayon, diamètre et centre d'un graphe | [C24] Déterminer ces caractéristiques sur des graphes simples. |
| Notion de « petit monde » ; expérience de Milgram | [C25] Décrire comment l'information présentée par les réseaux sociaux est conditionnée par le choix préalable de ses amis. |
| Cyberviolence | [C26] Connaître les dispositions de l'article 222-33-2-2 du code pénal. [C27] Connaître les différentes formes de cyberviolence (harcèlement, discrimination, sexting…) et les ressources disponibles pour lutter contre la cyberviolence. |

**Exemples d'activités** : construire et analyser un graphe d'amis ; calculer distances, excentricités, rayon, diamètre et centre ; comparer les conditions générales d'utilisation de plusieurs réseaux ; paramétrer un compte.

## [T4] Les données structurées et leur traitement

**Introduction.** Les données constituent la matière première de toute activité numérique. Afin de permettre leur réutilisation, il est nécessaire de les conserver de manière persistante. Les structurer correctement garantit que l'on puisse les exploiter facilement pour produire de l'information.

**Repères historiques** : 1725, Basile Bouchon commande un métier à tisser par un ruban perforé, idée reprise par Jacquard en 1801 ; 1890, Herman Hollerith traite le recensement américain avec des cartes perforées ; 1956, premier disque dur (IBM) ; 1970, Edgar F. Codd propose le modèle relationnel ; 1979, premier tableur grand public (VisiCalc) ; 2011, lancement du portail français de données ouvertes data.gouv.fr.

**Données et informations** : tables (collections d'objets), descripteurs et valeurs, formats (CSV, vCard, JSON…), métadonnées. **Algorithmes et programmes** : recherche, filtre, tri, calcul, croisement de tables. **Machines** : supports de stockage, centres de données (cloud). **Impacts** : données personnelles, RGPD, données ouvertes, consommation énergétique des centres de données.

| Contenus | Capacités attendues |
| --- | --- |
| Données | [C28] Définir une donnée personnelle. [C29] Identifier les principaux formats et représentations de données. |
| Données structurées | [C30] Identifier les différents descripteurs d'un objet. [C31] Distinguer la valeur d'une donnée de son descripteur. [C32] Utiliser un site de données ouvertes, pour sélectionner et récupérer des données. |
| Traitement de données structurées | [C33] Réaliser des opérations de recherche, filtre, tri ou calcul sur une ou plusieurs tables. |
| Métadonnées | [C34] Retrouver les métadonnées d'un fichier personnel. |
| Données dans le nuage (cloud) | [C35] Utiliser un support de stockage dans le nuage. [C36] Partager des fichiers, paramétrer des modes de synchronisation. [C37] Identifier les principales causes de la consommation énergétique des centres de données ainsi que leur ordre de grandeur. |

**Exemples d'activités** : explorer un fichier CSV avec un tableur ou un programme Python ; trier, filtrer et calculer sur une table de données ouvertes ; retrouver les métadonnées d'un fichier ; comparer les formats d'un même contact.

## [T5] Localisation, cartographie et mobilité

**Introduction.** La cartographie est essentielle pour beaucoup d'activités. Les technologies de géolocalisation par satellites, associées aux cartes numériques, ont rendu possibles des services de navigation et de mobilité utilisés chaque jour.

**Repères historiques** : 1959, l'algorithme de Dijkstra calcule un plus court chemin dans un graphe ; 1973, lancement du programme GPS par l'armée américaine ; 1995, GPS pleinement opérationnel ; 2000, fin de la dégradation volontaire du signal civil ; 2004, création d'OpenStreetMap ; 2005, Google Maps ; 2006, Géoportail ; 2016, premiers services du système européen Galileo.

**Données et informations** : coordonnées géographiques (latitude, longitude), couches de carte, trames NMEA. **Algorithmes et programmes** : calcul de position par trilatération, calcul d'itinéraire sur un graphe. **Machines** : satellites, récepteurs, serveurs de cartes. **Impacts** : nouveaux services de mobilité, suivi des déplacements, confidentialité de la position.

| Contenus | Capacités attendues |
| --- | --- |
| GPS, Galileo | [C38] Décrire le principe de fonctionnement de la géolocalisation. |
| Cartes numériques | [C39] Identifier les différentes couches d'information de Géoportail pour extraire différents types de données. [C40] Contribuer à OpenStreetMap de façon collaborative. |
| Protocole NMEA 0183 | [C41] Décoder une trame NMEA pour trouver des coordonnées géographiques. |
| Calculs d'itinéraires | [C42] Utiliser un logiciel pour calculer un itinéraire. [C43] Représenter un calcul d'itinéraire comme un problème sur un graphe. |
| Confidentialité | [C44] Régler les paramètres de confidentialité d'un téléphone pour partager ou non sa position. |

**Exemples d'activités** : décoder une trame NMEA avec un programme Python ; calculer un plus court chemin à la main sur un petit graphe ; superposer des couches sur Géoportail ; ajouter un élément sur OpenStreetMap.

## [T6] Informatique embarquée et objets connectés

**Introduction.** Embarquer l'informatique dans les objets a beaucoup d'avantages : simplifier leur fonctionnement, leur donner plus de possibilités d'usage et de sûreté, et leur permettre d'intégrer de nouvelles possibilités matérielles. Avec la connexion à Internet, ces objets deviennent des objets connectés.

**Repères historiques** : 1967, ordinateur de guidage des missions Apollo ; 1971, premier microprocesseur (Intel 4004) ; 1978, premier système d'antiblocage des roues (ABS) à commande électronique en série ; 2007, premier smartphone à écran tactile multipoint grand public ; années 2010, essor des objets connectés.

**Données et informations** : mesures des capteurs, ordres envoyés aux actionneurs. **Algorithmes et programmes** : boucle « lire les capteurs, décider, agir ». **Machines** : microcontrôleurs, cartes programmables, capteurs, actionneurs. **Impacts** : sûreté des systèmes, vie privée, sécurité des objets connectés, consommation d'énergie.

| Contenus | Capacités attendues |
| --- | --- |
| Systèmes informatiques embarqués | [C45] Identifier des algorithmes de contrôle des comportements physiques à travers les données des capteurs, l'IHM et les actions des actionneurs dans des systèmes courants. |
| Interface homme-machine (IHM) | [C46] Réaliser une IHM simple d'un objet connecté. |
| Commande d'un actionneur, acquisition des données d'un capteur | [C47] Écrire des programmes simples d'acquisition de données ou de commande d'un actionneur. |

**Exemples d'activités** : programmer une carte à microcontrôleur pour allumer une DEL selon la luminosité ; étudier le fonctionnement d'un thermostat ou d'un éclairage automatique ; réaliser une petite interface pour piloter un objet.

## [T7] La photographie numérique

**Introduction.** Les technologies de la photographie argentique ont eu une évolution très lente, liée aux progrès de l'optique, de la mécanique et de la chimie. Le numérique a bouleversé la prise de vue : l'image est captée par un capteur, puis construite et traitée par des algorithmes.

**Repères historiques** : 1826, Nicéphore Niépce réalise la première photographie connue ; 1839, présentation du daguerréotype ; 1957, première image numérisée (Russell Kirsch) ; 1969, invention du capteur CCD (Willard Boyle et George Smith) ; 1975, premier appareil photo numérique (Steven Sasson, Kodak) ; 2000, premiers téléphones équipés d'un appareil photo ; années 2010, le smartphone devient le principal appareil photo.

**Données et informations** : pixels, composantes rouge, verte et bleue, profondeur de couleur, métadonnées EXIF. **Algorithmes et programmes** : dématriçage, balance des blancs, compression, filtres. **Machines** : capteurs, processeurs d'image. **Impacts** : explosion du nombre de photos, partage, retouche, géolocalisation des images, droit à l'image.

| Contenus | Capacités attendues |
| --- | --- |
| Photosites, pixels, résolution (du capteur, de l'image), profondeur de couleur | [C48] Distinguer les photosites du capteur et les pixels de l'image en comparant les résolutions du capteur et de l'image selon les réglages de l'appareil. |
| Métadonnées EXIF | [C49] Retrouver les métadonnées d'une photographie. |
| Traitement d'image | [C50] Traiter par programme une image pour la transformer en agissant sur les trois composantes de ses pixels. |
| Rôle des algorithmes dans les appareils photo numériques | [C51] Expliciter des algorithmes associés à la prise de vue. [C52] Identifier les étapes de la construction de l'image finale. |

**Exemples d'activités** : calculer la taille d'une image non compressée ; afficher les métadonnées EXIF d'une photo ; écrire un programme qui passe une image en niveaux de gris ou en négatif.
