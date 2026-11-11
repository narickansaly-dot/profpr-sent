# Relecture de la banque du chapitre 2 de SNT (Internet)

Banque `snt-ch2.json` : 150 questions (75 / 30 / 30 / 15 ; difficultés 60 / 60 / 30 ; 16 vrais et 14 faux), au statut `a_relire`. Contrôle automatique conforme. Relecture de l'auteur contre le texte du chapitre.

## Corrigées pendant la relecture

| Source | Problème | Décision |
| --- | --- | --- |
| QCM de difficulté 3 sur le TTL de 64 | Deux lectures : un paquet au TTL 64 est retransmis par 63 routeurs et détruit par le 64e ; « combien de routeurs peut-il traverser » admettait 63 ou 64. | Énoncé reformulé : « au passage de combien de routeurs son TTL atteint-il 0 ? » (64). |
| 036, 081, 082, 090, 092, 093, 098 | Énoncés trop proches selon le contrôle (« Quelles affirmations … sont exactes ? »). | Reformulés. |
| 4 QCM | Biais de longueur (41 %). | Distracteurs allongés. |

## Points de doute

1. **Ordre de grandeur du trafic** : le cours dit « centaines d'exaoctets par mois au milieu des années 2020 » et « multiplié par plusieurs dizaines en une décennie ». L'ordre de grandeur est sûr, les chiffres exacts dépendent des sources (Cisco, Ericsson, Arcep). Une question vrai/faux et un QCM multiple portent dessus.
2. **Débits indicatifs** (fibre de 1 à 8 Gbit/s, ADSL de 1 à 20 Mbit/s, 5G au-delà de 1 Gbit/s) : ce sont des valeurs commerciales françaises, qui évoluent vite. Deux questions s'appuient sur la fibre et la 5G au-delà de 1 Gbit/s.
3. **« 1983, naissance d'Internet »** : la date est conventionnelle, le cours dit « on considère souvent ». La réponse courte demande l'année d'adoption de TCP/IP par ARPANET, pas une « naissance ».
4. **Taille d'un paquet (environ 1 500 octets)** : c'est la taille maximale courante sur Ethernet, données et en-têtes compris. Les questions de calcul parlent de « 1 500 octets de données » par simplification.
5. **Domaine de premier niveau « fr »** : le cours ne parle pas de la racine (le point final implicite). C'est une simplification acceptable en seconde.
6. **Pair-à-pair et visioconférence** : le cours cite « certaines applications d'appel ». C'est vrai historiquement (Skype), moins aujourd'hui, mais aucune question ne s'appuie sur cet exemple.
