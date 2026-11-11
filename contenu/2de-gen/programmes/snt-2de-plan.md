# Plan des chapitres : sciences numériques et technologie, 2de générale

Plan déduit du programme résumé dans `snt-2de.md` (arrêté du 17 janvier 2019, BO spécial n° 1 du 22 janvier 2019). Les capacités sont citées avec leur code `[C…]` défini dans `snt-2de.md`.

**Statut** : proposition, **à valider par l'enseignant** (le résumé du programme lui-même est à vérifier contre le BO, voir son avertissement).

## Principes du découpage

- **Un chapitre par thème du programme** (sept chapitres), dans l'ordre du texte officiel, qui n'impose pas de progression.
- **Un chapitre 1 consacré à la programmation en Python.** Le programme ne fait pas de la programmation un thème, mais il fixe des notions (variables, conditions, boucles, fonctions) que tous les thèmes mobilisent. Les placer en tête donne aux élèves les outils pour lire et écrire les petits programmes des chapitres suivants (décodage d'une trame NMEA, traitement d'image, commande d'un actionneur…). Chaque chapitre de thème contient ensuite une section « En Python » qui réinvestit ces notions.
- **Durées indicatives** : 1 h 30 par semaine, 32 semaines au total, soit 4 semaines par chapitre.
- **Code Python** : le HTML autorisé ne contient ni `pre` ni `code`. Les programmes sont présentés dans un encadré `div class="def code"` (titre « Python »), une instruction par ligne (`br`), l'indentation faite d'espaces insécables (quatre par niveau). Voir le point à trancher n° 2 du bilan.

## Vue d'ensemble

| N° | Titre | Titre court | Durée | Partie du programme |
| --- | --- | --- | --- | --- |
| 1 | Programmer en Python | Python | 4 semaines | La programmation [TP] |
| 2 | Internet | Internet | 4 semaines | [T1] |
| 3 | Le Web | Web | 4 semaines | [T2] |
| 4 | Les réseaux sociaux | Réseaux sociaux | 4 semaines | [T3] |
| 5 | Les données structurées et leur traitement | Données | 4 semaines | [T4] |
| 6 | Localisation, cartographie et mobilité | Localisation | 4 semaines | [T5] |
| 7 | Informatique embarquée et objets connectés | Objets connectés | 4 semaines | [T6] |
| 8 | La photographie numérique | Photographie | 4 semaines | [T7] |

---

## Chapitre 1 : Programmer en Python

- **Capacités** : [CP1].
- **Objectifs** : utiliser des variables et l'affectation ; écrire une séquence d'instructions ; écrire une instruction conditionnelle ; écrire une boucle bornée et une boucle non bornée ; définir et appeler une fonction.

**Sections**

1. **Algorithmes, langages et programmes.** Les quatre concepts du programme (données, algorithmes, langages, machines) ; ce qu'est un programme Python ; `print`, `input`.
2. **Variables et affectation.** Nom, valeur, type (`int`, `float`, `str`, `bool`) ; l'affectation `=` ; opérations (`+ - * / // % **`) ; conversion `int()`, `float()`, `str()`.
3. **Séquences d'instructions.** L'ordre compte ; suivre l'état des variables dans un tableau ; échange de deux variables.
4. **Instructions conditionnelles.** `if`, `elif`, `else` ; comparaisons et opérateurs `and`, `or`, `not` ; indentation.
5. **Boucles bornées et non bornées.** `for i in range(…)` ; `while` ; accumulateur et compteur ; éviter la boucle infinie.
6. **Fonctions.** Définir (`def`, paramètres, `return`), appeler ; intérêt (réutiliser, découper un problème) ; modéliser un phénomène simple.

## Chapitre 2 : Internet

- **Capacités** : [C1] à [C7].
- **Objectifs** : distinguer Internet et le Web ; expliquer le découpage en paquets et le routage ; distinguer les rôles de IP et TCP ; retrouver une adresse IP grâce au DNS ; décrire le pair-à-pair et ses usages ; caractériser les réseaux physiques et l'ordre de grandeur du trafic.

**Sections**

1. **Un réseau de réseaux.** Définition, repères historiques, Internet et ses applications (Web, courriel…).
2. **Adresses IP et paquets.** Adresse IPv4 et IPv6, paquets, en-tête.
3. **Les protocoles IP et TCP.** Rôle de chacun, accusés de réception, réémission ; fiabilité sans garantie de délai.
4. **Le routage.** Routeurs, tables de routage, chemins multiples, limites (pannes, congestion, durée de vie d'un paquet).
5. **Le DNS.** Adresses symboliques, résolution de noms, hiérarchie des domaines.
6. **Pair-à-pair, réseaux physiques et trafic.** Client-serveur et pair-à-pair, usages licites et illicites ; types de liaisons ; ordre de grandeur du trafic et de l'énergie.

## Chapitre 3 : Le Web

- **Capacités** : [C8] à [C20].
- **Objectifs** : situer les étapes du Web ; utiliser l'hypertexte ; distinguer contenu (HTML) et style (CSS) ; décomposer une URL et reconnaître une page sécurisée ; décomposer une requête HTTP ; distinguer client et serveur ; analyser les résultats d'un moteur de recherche ; régler son navigateur ; connaître les notions juridiques.

**Sections**

1. **Naissance et développement du Web.** Repères historiques ; Web et Internet.
2. **Hypertexte, HTML et CSS.** Balises, liens, contenu et style.
3. **URL et HTTP.** Décomposer une URL, requête et réponse, méthodes GET et POST, paramètres, codes de réponse, HTTPS.
4. **Le modèle client/serveur.** Ce qui s'exécute côté serveur et côté client ; pages statiques et dynamiques ; inspecter une page.
5. **Les moteurs de recherche.** Exploration, indexation, classement ; analyse critique ; enjeux de la publication.
6. **Sécurité, confidentialité et droit.** Cookies, historique, navigation privée, traqueurs ; droit d'auteur, licences, droit d'usage.

## Chapitre 4 : Les réseaux sociaux

- **Capacités** : [C21] à [C27].
- **Objectifs** : caractériser et comparer des réseaux sociaux ; gérer son identité numérique et sa confidentialité ; expliquer le modèle économique ; modéliser un réseau par un graphe et en calculer rayon, diamètre et centre ; expliquer le « petit monde » et l'effet du choix des amis ; reconnaître la cyberviolence et savoir où trouver de l'aide.

**Sections**

1. **Des réseaux sociaux variés.** Définition, repères historiques, caractéristiques et comparaison.
2. **Identité numérique et confidentialité.** Identité numérique, e-réputation, identification, authentification, paramétrage.
3. **Le modèle économique.** Gratuité, publicité ciblée, données personnelles.
4. **Modéliser un réseau par un graphe.** Sommets, arêtes, graphe orienté ou non ; distance, excentricité, rayon, diamètre, centre.
5. **Petit monde et bulles de filtres.** Expérience de Milgram ; algorithmes de recommandation ; effet du choix des amis.
6. **La cyberviolence.** Formes, article 222-33-2-2 du code pénal, ressources (3018).

## Chapitre 5 : Les données structurées et leur traitement

- **Capacités** : [C28] à [C37].
- **Objectifs** : définir une donnée et une donnée personnelle ; identifier des formats ; distinguer descripteur et valeur ; lire une table et un fichier CSV ; rechercher, filtrer, trier, calculer, croiser des tables ; retrouver des métadonnées ; utiliser le cloud et estimer sa consommation d'énergie.

**Sections**

1. **Des données partout.** Donnée, information, repères historiques, donnée personnelle et RGPD.
2. **Structurer les données.** Objet, descripteur, valeur, table, collection ; formats CSV, vCard, JSON.
3. **Traiter une table.** Rechercher, filtrer, trier, calculer ; croiser deux tables ; en Python.
4. **Données ouvertes et métadonnées.** Open data, data.gouv.fr ; métadonnées d'un fichier.
5. **Les données dans le nuage.** Stockage, partage, synchronisation ; centres de données et énergie.

## Chapitre 6 : Localisation, cartographie et mobilité

- **Capacités** : [C38] à [C44].
- **Objectifs** : repérer un lieu par ses coordonnées ; expliquer le principe de la géolocalisation par satellites ; décoder une trame NMEA ; utiliser les couches d'une carte numérique et contribuer à une carte collaborative ; modéliser un itinéraire par un graphe ; régler le partage de sa position.

**Sections**

1. **Se repérer sur la Terre.** Latitude, longitude, repères historiques.
2. **La géolocalisation par satellites.** GPS, Galileo ; temps de trajet, distance, trilatération ; précision.
3. **La trame NMEA 0183.** Structure de la trame GGA, conversion des coordonnées.
4. **Les cartes numériques.** Couches, Géoportail, OpenStreetMap.
5. **Calculer un itinéraire.** Graphe pondéré, plus court chemin, Dijkstra (principe).
6. **Mobilité et confidentialité.** Services de mobilité, traces de déplacement, réglages.

## Chapitre 7 : Informatique embarquée et objets connectés

- **Capacités** : [C45] à [C47].
- **Objectifs** : définir un système embarqué et un objet connecté ; identifier capteurs, actionneurs, IHM et algorithme de contrôle ; écrire un programme d'acquisition ou de commande ; réaliser une IHM simple ; mesurer les enjeux (sûreté, sécurité, vie privée).

**Sections**

1. **L'informatique dans les objets.** Définitions, repères historiques, exemples.
2. **Capteurs, actionneurs, microcontrôleur.** La chaîne d'information et la chaîne d'action.
3. **L'algorithme de contrôle.** Boucle lire / décider / agir ; seuils, hystérésis ; exemples courants.
4. **Programmer un système embarqué.** Acquisition, commande, en Python.
5. **Interface homme-machine.** Rôle, exemples, IHM simple d'un objet connecté.
6. **Objets connectés : enjeux.** Internet des objets, sûreté, sécurité, vie privée, énergie.

## Chapitre 8 : La photographie numérique

- **Capacités** : [C48] à [C52].
- **Objectifs** : situer l'évolution de la photographie ; distinguer photosites et pixels ; calculer définition, taille et poids d'une image ; coder une couleur en RVB ; retrouver les métadonnées EXIF ; traiter une image par programme ; expliciter les étapes de la construction de l'image.

**Sections**

1. **De l'argentique au numérique.** Repères historiques.
2. **Capteur et photosites.** Fonctionnement du capteur, filtre de Bayer, résolution du capteur.
3. **Pixels, définition et couleurs.** Pixel, définition, résolution d'impression, RVB, profondeur de couleur, poids.
4. **Les métadonnées EXIF.** Contenu, lecture, enjeux.
5. **Les algorithmes de l'appareil photo.** Dématriçage, balance des blancs, exposition, mise au point, HDR, compression.
6. **Traiter une image par programme.** Niveaux de gris, négatif, filtres, en Python.
