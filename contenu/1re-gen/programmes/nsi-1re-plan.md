# Plan des chapitres : NSI (spécialité), première générale

Plan déduit du programme résumé dans `nsi-1re.md` (arrêté du 17 janvier 2019, NOR MENE1901633A, BO spécial n° 1 du 22 janvier 2019, toujours en vigueur en 2026-2027). Les capacités sont citées avec leur code (`[D1]`, `[G2]`…) défini dans `nsi-1re.md`.

**Statut** : proposition, à valider par l'enseignant.

## Principes du découpage

- Le programme n'est pas un plan de cours : les huit rubriques sont regroupées en **11 chapitres** de taille comparable, dans un ordre qui va des données vers les algorithmes puis vers les machines et les réseaux.
- La rubrique **Histoire de l'informatique** [H1] est transversale : chaque chapitre a une section « Repères historiques » (ou un paragraphe daté) sur ses propres notions (Boole, Shannon, Turing, von Neumann, ASCII, Unicode, Berners-Lee, Cerf et Kahn, Unix…).
- **Python d'abord** pour les chapitres de programmation (4 à 8), mais les chapitres 1 à 3 (représentation des données) ne supposent que les bases vues en 2de (SNT et mathématiques).
- **Projets** : le programme réserve au moins un quart de l'horaire aux projets. Ils ne sont pas des chapitres du cours ; chaque chapitre propose des idées d'activités dans son texte.
- **Durées indicatives** : 4 h par semaine, environ 32 semaines dont un quart en projets, soit 2 à 3 semaines de cours par chapitre.
- **Code Python** : le HTML autorisé ne contient ni `pre` ni `code`. Les programmes sont dans un `div class="code"` encadré, une instruction par ligne (`br`), l'indentation faite d'espaces insécables (quatre par niveau). Dans les questions (texte brut sur une ligne), un programme court est écrit sur une ligne avec des points-virgules ou décrit en mots.

## Vue d'ensemble

| N° | Titre | Titre court | Durée | Capacités |
| --- | --- | --- | --- | --- |
| 1 | Écrire les entiers naturels en base 2, 10 et 16 | Bases | 2 semaines | [D1], [D2] (entiers positifs), [H1] |
| 2 | Entiers relatifs, nombres flottants et textes | Relatifs, flottants, textes | 3 semaines | [D2], [D3], [D5], [H1] |
| 3 | Booléens, expressions logiques et circuits | Booléens | 2 semaines | [D4], [A1] (circuits combinatoires), [H1] |
| 4 | Programmer en Python : constructions, fonctions, spécification et tests | Programmer | 3 semaines | [L1], [L2], [L3], [L4], [L5], [H1] |
| 5 | Types construits : p-uplets, tableaux et dictionnaires | Types construits | 3 semaines | [C1], [C2], [C3] |
| 6 | Traitement de données en tables | Tables | 2 semaines | [T1], [T2], [T3], [T4] |
| 7 | Parcours, tris et recherche dichotomique | Tris et dichotomie | 3 semaines | [G1], [G2], [G4], [L3] |
| 8 | Algorithmes gloutons et k plus proches voisins | Gloutons et k-ppv | 2 semaines | [G3], [G5] |
| 9 | Le Web : interactions, client-serveur et formulaires | Web | 2 semaines | [W1], [W2], [W3], [W4] |
| 10 | Architecture des machines, systèmes d'exploitation et périphériques | Machines et OS | 3 semaines | [A1], [A3], [A4], [H1] |
| 11 | Transmission de données dans un réseau | Réseaux | 2 semaines | [A2], [H1] |

Total : 27 semaines de cours ; le reste de l'année va aux projets.

## Chapitre 1 : Écrire les entiers naturels en base 2, 10 et 16

- Le bit, l'octet ; unités (ko, Ko, kio) seulement comme repère.
- Écriture positionnelle en base 10, puis en base b ; base 2 (binaire) et base 16 (hexadécimal, chiffres A à F).
- Conversions : base 2 → base 10 (somme des puissances), base 10 → base 2 (divisions successives ou soustraction des puissances), base 2 ↔ base 16 (paquets de 4 bits), base 16 → base 10.
- Nombre de bits nécessaires pour écrire n ; plus grand entier sur n bits (2ⁿ − 1) ; taille de la somme et du produit de deux entiers.
- Addition binaire posée, retenues, dépassement sur un nombre fixe de bits.
- En Python : bin, hex, int(…, 2), notations 0b et 0x ; entiers de taille arbitraire.
- Repères : Leibniz et le binaire (1703).

## Chapitre 2 : Entiers relatifs, nombres flottants et textes

- Entiers relatifs : limite du « bit de signe » naïf ; **complément à 2** sur n bits ; méthode « inverser les bits puis ajouter 1 » ; intervalle −2ⁿ⁻¹ à 2ⁿ⁻¹ − 1 ; tailles 8, 16, 32, 64 bits ; dépassement.
- Flottants : écriture binaire des nombres à virgule (0,25 = 0,01 en base 2 ; 0,1 a une écriture infinie) ; principe signe, mantisse, exposant (sans IEEE-754 exigible) ; 0.1 + 0.2 != 0.3 ; comparer avec une tolérance.
- Textes : ASCII (7 bits, 128 caractères), ISO-8859-1 (8 bits, latin), Unicode (points de code) et UTF-8 (1 à 4 octets) ; ord, chr, encode, decode ; « mojibake » et conversion d'un fichier.
- Repères : ASCII (1963), Unicode (1991), norme IEEE 754 (1985).

## Chapitre 3 : Booléens, expressions logiques et circuits

- Valeurs booléennes, opérateurs not, and, or ; tables de vérité ; xor.
- Expressions booléennes ; dresser une table ; priorités ; lois de De Morgan (en exemple).
- Évaluation séquentielle (paresseuse) de and et or en Python.
- Portes logiques et circuits combinatoires ; demi-additionneur et additionneur complet ; addition binaire.
- Repères : George Boole (1854), Claude Shannon (1938).

## Chapitre 4 : Programmer en Python : constructions, fonctions, spécification et tests

- Constructions élémentaires : séquence, affectation, conditionnelle, boucles bornées et non bornées, appel de fonction.
- Fonctions : paramètres, return, variables locales ; prototype ; docstring.
- Spécification : préconditions, postconditions, assertions (assert).
- Tests : jeux de tests, cas limites ; un test réussi ne prouve pas la correction.
- Bibliothèques : import, documentation (help), modules math et random.
- Diversité des langages : même programme en Python, C, JavaScript ; paradigmes ; langages de description (HTML) et de requêtes (SQL) qui ne sont pas des langages de programmation.
- Repères : Ada Lovelace (1843), Fortran (1957), C (1972), Python (1991).

## Chapitre 5 : Types construits : p-uplets, tableaux et dictionnaires

- p-uplets (tuple) : création, accès, immuabilité, fonction qui renvoie un p-uplet, affectation multiple.
- Tableaux (list) : index, len, modification, parcours par indice et par élément, append ; construction par compréhension ; tableaux de tableaux et a[i][j] ; piège de la copie.
- Dictionnaires : clés et valeurs, ajout d'une entrée, test d'appartenance, keys(), values(), items(), parcours ; p-uplets nommés représentés par des dictionnaires ; données EXIF.

## Chapitre 6 : Traitement de données en tables

- Table, enregistrement, descripteurs ; fichiers CSV et texte tabulé ; import avec le module csv (DictReader) ; conversion des types.
- Recherche selon des critères (and, or, not) ; sélection et projection ; doublons ; tests de cohérence (domaine de valeurs).
- Tri selon une colonne : sorted avec key, reverse.
- Fusion de deux tables (concaténation, jointure sur un descripteur commun).
- Données ouvertes.

## Chapitre 7 : Parcours, tris et recherche dichotomique

- Parcours séquentiel : occurrence, extremum, moyenne ; coût linéaire.
- Tri par sélection et tri par insertion : principe, déroulé, programme, invariant de boucle, terminaison, coût quadratique dans le pire cas.
- Recherche dichotomique dans un tableau trié : programme, variant de boucle, terminaison, coût logarithmique.
- Comparaison des coûts sur des données nombreuses.

## Chapitre 8 : Algorithmes gloutons et k plus proches voisins

- Problèmes d'optimisation ; méthode gloutonne (choix localement optimal) ; rendu de monnaie (systèmes canoniques et non canoniques) ; sac à dos (glouton par valeur, par rapport valeur/poids) ; le glouton ne donne pas toujours l'optimum.
- Algorithme des k plus proches voisins : données étiquetées, distance, choix de k, vote majoritaire ; apprentissage supervisé ; influence de k ; limites.

## Chapitre 9 : Le Web : interactions, client-serveur et formulaires

- Rappels de 2de : URL, HTML, CSS, HTTP.
- Composants graphiques (bouton, champ, case à cocher, liste), événements (click, input, change, mouseover…), gestionnaires d'événements en JavaScript ; description (HTML) et comportement (JavaScript).
- Client-serveur : requête, réponse, codes d'état ; ce qui s'exécute côté client et côté serveur ; pages statiques et dynamiques ; cookies.
- Formulaires : action, method, name ; GET (paramètres dans l'URL) et POST (dans le corps) ; HTTPS et chiffrement.

## Chapitre 10 : Architecture des machines, systèmes d'exploitation et périphériques

- Modèle de von Neumann : mémoire unique, processeur (UAL, unité de commande, registres), bus, entrées-sorties ; cycle chargement-décodage-exécution ; langage machine et assembleur simplifié ; monoprocesseur et multicœur.
- Système d'exploitation : rôles ; libres et propriétaires ; commandes de base (pwd, ls, cd, mkdir, cp, mv, rm, cat, chmod) ; arborescence, chemins absolus et relatifs ; droits rwx pour utilisateur, groupe, autres.
- Périphériques, capteurs et actionneurs ; IHM d'un système embarqué.
- Repères : Turing (1936), von Neumann (1945), ENIAC, premiers ordinateurs à programme enregistré (1948), Intel 4004 (1971), Unix (1969), Linux (1991).

## Chapitre 11 : Transmission de données dans un réseau

- Réseau local, commutateur, routeur, carte réseau, adresse IP, masque, adresse MAC (en repère).
- Découpage en paquets ; encapsulation par couches (application, transport, réseau, liaison) ; TCP et IP.
- Pertes de paquets ; accusés de réception ; protocole du bit alterné ; limites.
- Simulation d'un réseau (Filius) ; commandes ping, ipconfig.
- Repères : ARPANET (1969), TCP/IP (1974-1983), Web (1989).

## Correspondance programme → chapitres

| Capacité | Chapitres |
| --- | --- |
| [H1] | 1, 2, 3, 4, 10, 11 (et repères ailleurs) |
| [D1] | 1 |
| [D2] | 1 (nombre de bits), 2 (complément à 2) |
| [D3] | 2 |
| [D4] | 3 |
| [D5] | 2 |
| [C1], [C2], [C3] | 5 |
| [T1] à [T4] | 6 |
| [W1] à [W4] | 9 |
| [A1] | 3 (circuits), 10 |
| [A2] | 11 |
| [A3], [A4] | 10 |
| [L1] à [L5] | 4 (et 5 à 8) |
| [G1], [G2], [G4] | 7 |
| [G3], [G5] | 8 |

## Points à trancher

1. Ordre des chapitres (le programme laisse le choix) ; certains enseignants commencent par Python.
2. Place des projets, non traités par le cours.
3. Chapitre 9 : le programme ne demande pas d'expertise en JavaScript ; le cours montre quelques lignes à lire, pas à écrire.
