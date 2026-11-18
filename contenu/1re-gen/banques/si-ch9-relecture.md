# Relecture indépendante de la banque du chapitre 9 de SI (1re générale)

Méthode : résolution à l'aveugle des 150 questions (énoncés et propositions sans réponses), calculs refaits par script Python (nombre de valeurs 2ⁿ, hexadécimal, quantités de données par jour, durées série/parallèle, propagation dans la fibre, bits de parité, décodage UART b0 en premier, débits et durées de bit, octet d'adresse I2C avec bit R/W, durées d'échange I2C à 9 bits par octet, conversions bit/octet, efficacités 8N1/8E1/8N2/7N1, encapsulation, règle des 1 % de LoRaWAN), comparaison automatique avec la banque, puis relecture complète des 150 questions avec leur réponse et leur explication.

Résultat de la phase 1 : 0 désaccord sur 150 (donc 0 erreur de la banque, 0 ambiguïté, 0 erreur du relecteur). Tous les résultats numériques de la banque (bonnes réponses et distracteurs calculés) sont confirmés par le script.

## Questions corrigées

| Source | Problème | Correction |
|---|---|---|
| si-1re:ch9:banque:004 | Distracteur « 10 000 valeurs » (10⁴) peu naturel, ajouté pour équilibrer les longueurs. | Remplacé par « 100 valeurs » (confusion avec 10²) ; explication ajustée. La bonne réponse reste en position 3 et devient la plus longue, ce qui reste sans effet sur la banque (7 QCM sur 75, soit 9 %, sous le seuil de 25 %). |
| si-1re:ch9:banque:043 | Bonne réponse « Sa portée de quelques mètres suffit » : le cours donne au BLE une portée de 10 m à quelques dizaines de mètres ; un bon élève pouvait juger la proposition fausse. | « Sa portée d'une dizaine de mètres suffit, le téléphone est à côté ». |
| si-1re:ch9:banque:052 | Doublon de fond de la 065 (champ qui intéresse l'application : les données utiles). | Nouvel énoncé : le récepteur refait un calcul sur les bits reçus et le compare à un champ de la trame ; lequel ? Bonne réponse « Le champ de contrôle d'erreur », gardée en position 2 ; distracteurs préambule, en-tête, marque de fin. Explication réécrite. |
| si-1re:ch9:banque:086 | Distracteur « 0x480 » : ce n'est même pas un octet, proposition artificielle. | Remplacé par « 0x24 » (adresse décalée vers la droite au lieu de la gauche) ; explication complétée (0x48 = oubli du bit R/W). |
| si-1re:ch9:banque:088 | Distracteur « 1 125 µs » (simple erreur de puissance de 10, peu naturelle). | Remplacé par « 100 µs » (oubli des acquittements : 5 × 8 = 40 bits à 400 kbit/s) ; explication ajustée. |

Points d'attention signalés par l'auteur et vérifiés :
- Octet d'adresse I2C (086, 089, 092) : le cours ne montre que 0x40 → 0x80/0x81, mais il donne la méthode (adresse écrite sur 7 bits, bit R/W ajouté à droite, regroupement par 4 bits en hexadécimal) ; la généralisation est faisable avec le cours seul et correspond bien à des niveaux 2 et 3. Valeurs vérifiées : 0x90, 0xB9, 0xED. Gardées.
- 033 : la variante « semi-duplex » n'apparaît pas dans le cours, mais c'est un synonyme exact ; l'accepter ne peut pénaliser personne. Gardée.
- SPI (024 et 025) : le cours cite le bus SPI comme exemple de liaison synchrone ; 025 ne demande rien de plus. 024 mentionne seulement le fil SCL dans un distracteur. Conformes.
- « 1 024 adresses » (085) : distracteur gardé, il correspond à une confusion réelle avec les 10 bits du convertisseur (tableau du cours).

## Totaux

- Gardées sans changement : 145 ; corrigées : 5 (1 énoncé de QCM remplacé, 1 bonne réponse reformulée, 3 distracteurs remplacés).
- Types : 75 QCM à réponse unique, 29 QCM à réponses multiples, 30 vrai/faux, 16 réponses courtes (dans la tolérance de ± 3).
- Difficultés : 60 / 60 / 30 (niveaux 1 / 2 / 3).
- Vrai/faux : 15 vrais, 15 faux.
- Position de la bonne réponse des QCM à réponse unique : 19 / 19 / 19 / 18 (positions 0 / 1 / 2 / 3).
- Notions : 9, de 16 à 18 questions chacune.
- Vérificateur : « Banque du chapitre 9 conforme : 150 questions ; types 75/29/30/16 ; difficultés 60/60/30 ; vrai/faux 15 vrais. »

## Points de doute

Aucun.

## Cours

Rien à signaler sur le fond : les exemples résolus recalculés (station météo 1 440 octets par jour, octet en série/parallèle, fibre de 10 km, lettre C en parité paire, UART à 9 600 et 115 200 bit/s, lecture 0x41 à l'oscilloscope, lecture I2C de 2 octets à 0x40, efficacités 8N1 et 8E1, photo du drone, encapsulation 66 octets, règle des 1 % LoRaWAN) sont justes. Remarques de forme, probablement dues à l'extraction texte et à vérifier dans le rendu : exposants aplatis (« 2n », « 27 », « 103 », « 2 × 108 m/s ») et programme Python `duree_uart` sans indentation.
