# Relecture de la banque du chapitre 10 de NSI (machines, système d'exploitation, périphériques)

**Méthode.** Relecture indépendante à l'aveugle : un sous-agent a reçu les 150 questions **sans les réponses attendues** ni les explications, avec le texte du chapitre, et les a résolues lui-même. Il a écrit un **simulateur Python du langage machine du cours** (registres, mémoire, compteur de programme, nombre d'exécutions de chaque instruction) et **exécuté chaque programme** des énoncés ; il a vérifié en Python les conversions rwx ↔ octal, les effets de chmod et les temps sur plusieurs cœurs (33 contrôles), puis fait **10 tests en shell réel** dans un dossier temporaire (mkdir, cd, touch, cp, mv, rm, chmod, ls -l, pwd, cd refusé sans droit x). Les tests shell ont tourné sous macOS : même comportement que Linux pour ces commandes. Comparaison automatique ensuite.

**Résultat.** 150 réponses identiques sur 150. Douze remarques ; corrections dans la banque et deux ajouts au texte du cours.

## Corrections

| Question | Remarque du relecteur | Décision |
| --- | --- | --- |
| 062 | Énoncé confus (« SUB R0, R0, #1… » puis une règle absente du cours). | Réécrit ; **cours complété** : ADD et SUB ne prennent que des registres, seul MOV accepte une constante (#). |
| 067 | La syntaxe combinée chmod g+w,o-r n'était pas dans le cours. | **Cours complété** (section « Droits et permissions »). |
| 090 | « Les autres peuvent l'exécuter » avec --x : vrai pour un binaire, faux pour un script (il faut aussi r). | Proposition reformulée : « Les autres ont le droit x sur ce fichier ». |
| 097 | Une proposition vraie (GPU) ne répondait pas à « Quel gain… ». | Énoncé reformulé : « Que sait-on du calcul parallèle sur plusieurs cœurs ? ». |
| 147, 149, 150 | Variantes « CO », « PC », « -rwxr-x--x », « 8 s ». | Ajoutées. |

## Remarques sans changement

- 014 : Linux est au sens strict un noyau ; le cours parle de distributions GNU/Linux. Usage courant, gardé.
- 139 (« ALU »), 141 (« Neumann »), 144 (« /home/lina/ »), 146 (« Linus Torvalds ») : variantes déjà acceptées.

## Contrôles automatiques

- `verifierBanque` (préfixe `nsi-1re`, 150 questions) : conforme. Types 75 / 30 / 30 (15 vrais, 15 faux) / 15 ; difficultés 60 / 60 / 30 ; positions 19 / 19 / 18 / 19 ; bonne réponse strictement la plus longue dans 29 QCM sur 75 (après allongement de seize distracteurs).

## Points restants

Aucun : toutes les questions peuvent passer au statut `valide`.
