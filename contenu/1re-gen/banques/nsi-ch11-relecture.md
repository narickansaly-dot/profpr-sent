# Relecture de la banque du chapitre 11 de NSI (transmission de données dans un réseau)

**Méthode.** Relecture indépendante à l'aveugle : un sous-agent a reçu les 150 questions **sans les réponses attendues** ni les explications, avec le texte du chapitre, et les a résolues lui-même. Il a écrit une **simulation Python du protocole du bit alterné** (émetteur, récepteur avec bit attendu, pertes choisies de paquets et d'accusés) et l'a exécutée sur 6 déroulés ; il a vérifié avec le module **ipaddress** de Python toutes les questions d'adresses et de masques, et calculé les tailles de trames et les nombres de paquets (27 vérifications). Comparaison automatique ensuite.

**Résultat.** 150 réponses identiques sur 150. Quinze remarques ; corrections dans la banque et cinq ajouts au texte du cours.

## Corrections

| Question | Remarque du relecteur | Décision |
| --- | --- | --- |
| 016 | Formulation bancale. | Reformulée. |
| 060, 150 | Adresses réservées d'un /24 (256 valeurs, 254 machines) absentes du cours. | **Cours complété** (section « Les constituants d'un réseau ») ; les questions demandent bien le nombre de valeurs du dernier octet (256). |
| 069, 105 | Usage d'UDP en direct et rôle du port absents du cours. | **Cours complété** (tableau des couches). |
| 083 | Énoncé au singulier, propositions au pluriel ; écriture hexadécimale seulement montrée par l'exemple. | Énoncé au pluriel ; **cours précisé** (« écrits en hexadécimal »). |
| 089 | « Partager équitablement » exagérait le cours. | « Partager le réseau entre plusieurs communications ». |
| 101 | « L'en-tête Ethernet change à chaque lien » absent du cours, et tous les liens ne sont pas Ethernet. | Proposition reformulée (« couche accès réseau ») ; **cours complété** (section « Encapsulation »). |
| 133 | Le blocage n'arrive que si un accusé est perdu. | Énoncé précisé. |
| 141, 146, 147 | Variantes « ARPAnet », « commutateur réseau », « Vint Cerf ». | Ajoutées. |

## Remarques sans changement

- 033 : « 232 adresses » vient du texte brut extrait pour la relecture, qui perd l'exposant ; le cours affiche bien 2<sup>32</sup>.
- 068, 134 : la traduction d'adresses (NAT) et les pare-feu lisent aussi les ports ou changent l'adresse : nuance hors programme, mentionnée en une phrase dans le cours ; les réponses restent celles du modèle étudié.

## Contrôles automatiques

- `verifierBanque` (préfixe `nsi-1re`, 150 questions) : conforme. Types 75 / 30 / 30 (15 vrais, 15 faux) / 15 ; difficultés 60 / 60 / 30 ; positions 19 / 18 / 19 / 19 ; bonne réponse strictement la plus longue dans 25 QCM sur 75 (après allongement de trente-deux distracteurs).

## Points restants

Aucun : toutes les questions peuvent passer au statut `valide`.
