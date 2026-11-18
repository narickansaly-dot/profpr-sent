# Plan des chapitres : sciences de l'ingénieur, spécialité, 1re générale

Plan déduit du programme résumé dans `si-1re.md` (arrêté du 17 janvier 2019, NOR MENE1901640A, BO spécial n° 1 du 22 janvier 2019, toujours en vigueur en 2026-2027). Les codes `[I…]`, `[A…]`, `[M…]`, `[E…]`, `[C…]` renvoient aux lignes « 1e » de ce résumé.

**Statut** : plan établi par l'auteur le 11 novembre 2026, sans validation enseignante (points à trancher en fin de document).

## Principes du découpage

- Le programme est organisé par **compétences** (innover, analyser, modéliser, expérimenter, communiquer) et non par thèmes. Le cours regroupe les connaissances « 1e » par **domaine technique**, dans l'ordre où un élève en a besoin : le produit et son analyse, puis l'énergie (chaîne de puissance, électricité, mécanique), puis l'information (commande, communication), puis la mesure.
- Toutes les lignes « 1e » sont couvertes ; les contenus « Tale » n'apparaissent qu'en ouverture, signalée comme telle (par exemple le principe fondamental de la statique, les systèmes asservis, la programmation détaillée en Python).
- Les **chiffres** restent ceux d'un cours de première : calculs de puissance, de rendement, de rapport de réduction, de vitesse, lois de Kirchhoff, débits. Pas de calcul vectoriel au-delà de la projection dans un plan, pas de dérivée formelle (la vitesse est présentée comme une variation de position par unité de temps).
- Le **projet de 12 heures** et la compétence « Communiquer » sont traités au chapitre 1 (démarche de projet, outils collaboratifs) et réinvestis au chapitre 10 (rendre compte de résultats).
- Chaque chapitre s'appuie sur des produits contemporains tirés des thématiques du programme : trottinette et vélo à assistance électrique, fauteuil roulant électrique, portail motorisé, drone, prothèse de main, station météo connectée, bras robotisé, éclairage public intelligent.
- Durées indicatives : 32 semaines à 4 heures.

## Vue d'ensemble

| N° | Titre | Titre court | Durée | Programme |
| --- | --- | --- | --- | --- |
| 1 | Innover : de l'idée au produit | Innovation | 3 semaines | [I1], [I2], [C2] à [C5] |
| 2 | Analyser un produit avec l'ingénierie système | Ingénierie système | 3 semaines | [A1], [M5] (diagrammes) |
| 3 | Énergie, puissance et rendement | Puissance et rendement | 3 semaines | [A2], [M2] |
| 4 | La chaîne de puissance et ses composants | Chaîne de puissance | 3 semaines | [M3], [M2] (réversibilité) |
| 5 | Circuits électriques : lois et composants | Circuits électriques | 4 semaines | [M9], [M5] (circuit), [M3] (interrupteurs) |
| 6 | Modéliser un mécanisme : liaisons et actions mécaniques | Liaisons et actions | 4 semaines | [M1], [M5], [M6] |
| 7 | Mouvements : trajectoires, vitesses et lois d'entrée-sortie | Cinématique | 4 semaines | [M6], [M10] |
| 8 | Acquérir et traiter l'information : capteurs, algorithmes et états | Information et commande | 3 semaines | [M4], [M8] (capteurs) |
| 9 | Communiquer entre objets : signaux, protocoles et débits | Réseaux et protocoles | 3 semaines | [A3], [M7], [E3] |
| 10 | Mesurer et comparer les performances | Mesures et écarts | 2 semaines | [A4], [E1], [E2], [C1] |

---

## Chapitre 1 : Innover : de l'idée au produit

- **Programme** : [I1] éléments d'histoire des innovations, rompre ou améliorer l'existant ; [I2] cartes heuristiques, brainstorming, analogies, détournement d'usage, scénarios d'usage et expérience utilisateur, design d'interface et d'interaction, ergonomie ; [C2] à [C5] recherche d'information, travail collaboratif, communication adaptée ; projet de 12 heures.
- **Sections proposées** : le produit, objet matériel et jumeau numérique ; innovation incrémentale et innovation de rupture (exemples : du téléphone fixe au smartphone, de la lampe à incandescence à la LED, le vélo à assistance électrique) ; méthodes de créativité (carte heuristique, brainstorming et ses règles, analogie et biomimétisme, détournement d'usage) ; l'utilisateur au centre : scénario d'usage, expérience utilisateur, design d'interface et d'interaction, ergonomie (dimensions du corps, efforts, lisibilité, accessibilité) ; conduire un projet en équipe : étapes, rôles, espaces partagés, ENT, recherche d'information et fiabilité des sources, Fablab ; communiquer selon le public (croquis, schéma, carte mentale, diaporama, tutoriel vidéo).
- **Ouverture Tale** : méthodes agiles, veille technologique, modeleur volumique (mentionnés).

## Chapitre 2 : Analyser un produit avec l'ingénierie système

- **Programme** : [A1] diagrammes fonctionnels, exigences et critères, cas d'utilisation, analyse structurelle ; [M5] représentation graphique.
- **Sections proposées** : besoin, cahier des charges, fonction, exigence, critère, niveau, flexibilité ; le langage SysML (bases utiles seulement) ; diagramme de contexte et cas d'utilisation (acteurs, frontière du système) ; diagramme des exigences (identifiant, texte, relations « raffine », « satisfait », « dérive ») ; diagramme de définition de blocs (bdd) et diagramme de blocs internes (ibd) : blocs, ports, flux de matière, d'énergie, d'information ; chaîne d'information (acquérir, traiter, communiquer) et chaîne de puissance (alimenter, distribuer, convertir, transmettre, agir) ; analyser un produit réel (exemple fil rouge : portail motorisé ou trottinette électrique).
- **Ouverture Tale** : diagramme d'états (vu au chapitre 8), diagramme de séquence non exigé.

## Chapitre 3 : Énergie, puissance et rendement

- **Programme** : [A2] grandeurs physiques mobilisées, grandeurs d'effort et de flux, rendements et pertes ; [M2] grandeur effort, grandeur flux, énergie, puissance instantanée et moyenne.
- **Sections proposées** : formes d'énergie (électrique, mécanique, thermique, chimique, rayonnante) et unités (J, Wh, kWh) ; puissance = effort × flux : tableau des couples effort / flux (tension et intensité, force et vitesse, couple et vitesse angulaire, pression et débit volumique, écart de température et flux thermique pour mémoire) ; conversions d'unités (tr/min en rad/s, km/h en m/s, bar en Pa, L/min en m³/s) ; énergie = puissance × durée, puissance instantanée et puissance moyenne ; rendement d'un constituant et d'une chaîne (produit des rendements), pertes (effet Joule, frottements) ; énergies cinétique et potentielle de pesanteur, conservation de l'énergie, bilan énergétique ; ordres de grandeur ; repérer les flux d'énergie sur un diagramme de blocs internes.

## Chapitre 4 : La chaîne de puissance et ses composants

- **Programme** : [M3] sources parfaites de flux et d'effort, interrupteur parfait, modèles des composants de transformation, modulation, conversion, stockage ; [M2] réversibilité.
- **Sections proposées** : fonctions de la chaîne de puissance (alimenter, distribuer ou moduler, convertir, transmettre, agir) ; sources parfaites de tension et de courant (et leurs analogues mécaniques) ; stockage : batteries (capacité en Ah, énergie en Wh, tension), supercondensateurs, réservoirs ; modulation : interrupteur parfait, hacheur et rapport cyclique (valeur moyenne = α × U), variateur ; conversion : moteur à courant continu (modèle simple : E = K·Ω, C = K·I, rendement), actionneurs linéaires, vérins ; transmission : engrenages, poulies-courroie, pignon-chaîne, roue et vis sans fin, pignon-crémaillère, vis-écrou ; rapport de transmission, conservation de la puissance au rendement près ; réversibilité (moteur / génératrice, récupération d'énergie au freinage, vis sans fin irréversible).

## Chapitre 5 : Circuits électriques : lois et composants

- **Programme** : [M9] lois de Kirchhoff, lois de comportement ; [M5] circuit électrique ; [M3] interrupteurs parfaits (diode, transistor).
- **Sections proposées** : circuit, dipôle, nœud, branche, maille ; conventions récepteur et générateur, flèches de tension et de courant ; loi des nœuds et loi des mailles ; résistor (loi d'Ohm, associations série et parallèle, pont diviseur de tension) ; condensateur et bobine (comportements qualitatifs, i = C·du/dt et u = L·di/dt présentés en ouverture, énergie stockée) ; diode et transistor comme interrupteurs parfaits commandés ; puissance électrique, effet Joule ; signaux périodiques : période, fréquence, amplitude, valeur moyenne, valeur efficace (cas sinusoïdal : U = Û/√2), réseau monophasé 230 V / 50 Hz, triphasé (mention) ; superposition (ouverture).

## Chapitre 6 : Modéliser un mécanisme : liaisons et actions mécaniques

- **Programme** : [M1] hypothèses simplificatrices, modélisation plane ; [M5] schéma cinématique, graphe des liaisons et des actions mécaniques ; [M6] liaisons, torseurs d'actions mécaniques transmissibles, de contact ou à distance, réciprocité.
- **Sections proposées** : solide indéformable, classes d'équivalence ; degrés de liberté (6 dans l'espace, 3 dans le plan) ; liaisons usuelles (encastrement, pivot, glissière, pivot glissant, hélicoïdale, rotule, appui plan, linéaire annulaire, linéaire rectiligne, ponctuelle) : mouvements permis, symboles ; graphe des liaisons ; schéma cinématique (exemples : bielle-manivelle, pince, essuie-glace) ; hypothèses simplificatrices et modélisation plane ; actions mécaniques : forces (point d'application, direction, sens, intensité), moment d'une force par rapport à un point (M = F × d), couple ; action à distance (pesanteur, P = m·g) et de contact ; torseur d'action mécanique (résultante et moment, notation simple) ; actions transmissibles par une liaison parfaite (réciprocité : une liaison qui interdit un mouvement transmet l'effort correspondant) ; graphe des actions mécaniques ; principe des actions réciproques.
- **Ouverture Tale** : principe fondamental de la statique (un exemple d'équilibre simple pour montrer l'usage).

## Chapitre 7 : Mouvements : trajectoires, vitesses et lois d'entrée-sortie

- **Programme** : [M6] trajectoires et mouvement, torseurs cinématiques ; [M10] positions, vitesses et accélérations linéaires et angulaires, champ des vitesses, composition des vitesses (chaîne ouverte), loi d'entrée-sortie en chaîne fermée (fermeture géométrique).
- **Sections proposées** : référentiel, repère, trajectoire ; mouvements de translation (rectiligne, circulaire) et de rotation autour d'un axe fixe ; position, vitesse et accélération linéaires (mouvement uniforme, uniformément varié, lecture de graphes) ; grandeurs angulaires : angle, vitesse angulaire ω en rad/s, conversions, accélération angulaire ; vitesse d'un point d'un solide en rotation (v = R·ω, direction perpendiculaire au rayon) et champ des vitesses ; torseur cinématique (présentation simple : vitesse de rotation et vitesse d'un point) ; composition des vitesses en chaîne ouverte (bras de robot, grue) ; chaîne fermée et fermeture géométrique (bielle-manivelle, système vis-écrou, pignon-crémaillère) : loi d'entrée-sortie ; profil de vitesse en trapèze d'un axe motorisé.

## Chapitre 8 : Acquérir et traiter l'information : capteurs, algorithmes et états

- **Programme** : [M4] comportement séquentiel, structures algorithmiques (variables, fonctions, séquences, boucles, conditions), diagramme d'états-transitions ; [M8] capteurs.
- **Sections proposées** : chaîne d'information (acquérir, traiter, communiquer) ; capteurs : grandeur mesurée, signal de sortie logique, analogique ou numérique ; détecteurs (fin de course, présence), capteurs analogiques (température, lumière, distance), codeur ; caractéristiques (étendue de mesure, sensibilité, résolution) ; conversion analogique-numérique (résolution d'un CAN n bits : pleine échelle / 2ⁿ) ; numération binaire et hexadécimale, bit, octet ; algorithme et programme : variables et types, affectation, conditions, boucles bornées et non bornées, fonctions, en pseudo-code et en Python (sans `pre`/`code`) ; comportement séquentiel et programmation événementielle ; diagramme d'états-transitions : état, transition, événement, condition de garde, action, état initial (exemples : portail, feu de passage piéton, lampe à détecteur) ; du diagramme d'états au programme.
- **Ouverture Tale** : système asservi (consigne, mesure, écart), intelligence artificielle.

## Chapitre 9 : Communiquer entre objets : signaux, protocoles et débits

- **Programme** : [A3] protocoles, trames, encapsulation, support filaire et sans fil ; [M7] nature et caractéristiques des signaux, des données, des supports, protocole, trame, débit maximal, débit utile ; [E3] relever les grandeurs caractéristiques d'un protocole.
- **Sections proposées** : information, donnée, signal ; signaux analogiques, logiques, numériques ; transmission série et parallèle, synchrone et asynchrone ; supports filaires (paire torsadée, câble coaxial, fibre optique) et sans fil (Wi-Fi, Bluetooth, LoRa, 4G/5G) : portée, débit, consommation ; protocole, trame (en-tête, données, contrôle d'erreur), exemple de la liaison série UART (bit de start, 8 bits, parité, stop) et du bus I2C (adresse, maître, esclave) ; débit binaire (bit/s), durée d'un bit, débit maximal et débit utile, efficacité d'un protocole ; modèle en couches et encapsulation (application, transport, réseau, liaison, physique ; adresses IP et MAC en mention) ; internet des objets et réseau LoRaWAN (portée, faible débit, faible consommation).
- **Ouverture Tale** : client / serveur, modulation.

## Chapitre 10 : Mesurer et comparer les performances

- **Programme** : [A4] écarts absolu et relatif, erreurs et précision, traitement des données (tableaux, graphiques, moyennes, écarts types, incertitude), choix d'un critère ; [E1] ordre de grandeur, gamme d'appareils et capteurs, erreurs de mesure ; [E2] raccordement des appareils, sécurité ; [C1] rendre compte (tableau, graphique).
- **Sections proposées** : performances attendues, mesurées, simulées (les trois sommets de la démarche de l'ingénieur) ; appareils de mesure : multimètre (voltmètre en dérivation, ampèremètre en série), wattmètre, oscilloscope, tachymètre, dynamomètre, capteur de couple ; calibre, ordre de grandeur, sécurité (circuit hors tension pour câbler, calibre le plus grand d'abord) ; erreurs de mesure (systématique, aléatoire) ; série de mesures : moyenne, écart type, incertitude-type (u = s/√n), écriture d'un résultat avec un nombre adapté de chiffres significatifs ; écart absolu et écart relatif (en %), interprétation ; choisir un critère de comparaison ; présenter les résultats : tableau, graphique (axes, unités, légende), conclusion argumentée.
