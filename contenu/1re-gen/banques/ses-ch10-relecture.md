# Relecture de la banque du chapitre 10 de SES (1re) : vote

## Méthode

Relecture **indépendante et à l'aveugle** par un sous-agent relecteur : il a reçu le texte du chapitre (`texteChapitre`) et les questions **sans les réponses ni les explications**, a résolu chaque question, refait chaque calcul et vérifié les faits cités, puis signalé ambiguïtés, distracteurs défendables et variantes de réponse courte. Ses réponses ont été comparées automatiquement aux réponses attendues (`comparer.py`, mêmes règles de normalisation et de marge que la base). La banque avait été rédigée par un autre sous-agent, puis contrôlée par `verifierBanque`.

Résultat : **147 réponses identiques sur 150**, 3 écart(s), 14 remarques.

## Écarts

| Source | Écart | Décision |
|---|---|---|
| 120 | relecteur=True attendu=False | Réponse attendue maintenue (faux) : le cours présente le cens caché de Gaxie comme un cens « invisible », lié au sentiment de compétence, « même avec le suffrage universel » ; ce n'est pas une règle légale. Le relecteur, qui n'a fait aucune remarque, a vraisemblablement inversé sa saisie. |
| 128 | relecteur=False attendu=True | Réponse attendue maintenue (vrai) : le cours rattache l'électeur stratège au vote comme acte individuel. Erreur de saisie probable (aucune remarque). |
| 129 | relecteur=True attendu=False | Réponse attendue maintenue (faux) : pour Lazarsfeld, « une personne pense politiquement comme elle est socialement ». Erreur de saisie probable (aucune remarque). |

## Remarques du relecteur et décisions

| Source | Remarque | Décision |
|---|---|---|
| 136 | Variantes à ajouter : ["90 %", "90%", "90,0", "90.0"] | Variantes vérifiées : la plupart étaient déjà acceptées (le relecteur ne voit pas la liste) ; les manquantes ont été ajoutées, à la main ou par l’enrichissement automatique des réponses numériques. |
| 137 | Variantes à ajouter : ["70 %", "70%", "70,0"] | Variantes vérifiées : la plupart étaient déjà acceptées (le relecteur ne voit pas la liste) ; les manquantes ont été ajoutées, à la main ou par l’enrichissement automatique des réponses numériques. |
| 138 | Variantes à ajouter : ["36,6 %", "36,6%", "36.6"] | Variantes vérifiées : la plupart étaient déjà acceptées (le relecteur ne voit pas la liste) ; les manquantes ont été ajoutées, à la main ou par l’enrichissement automatique des réponses numériques. |
| 139 | Variantes à ajouter : ["35 %", "35%", "35,0"] | Variantes vérifiées : la plupart étaient déjà acceptées (le relecteur ne voit pas la liste) ; les manquantes ont été ajoutées, à la main ou par l’enrichissement automatique des réponses numériques. |
| 140 | Variantes à ajouter : ["5 000", "5000 suffrages exprimés"] | Variantes vérifiées : la plupart étaient déjà acceptées (le relecteur ne voit pas la liste) ; les manquantes ont été ajoutées, à la main ou par l’enrichissement automatique des réponses numériques. |
| 141 | Variantes à ajouter : ["35 %", "35%", "35,0"] | Variantes vérifiées : la plupart étaient déjà acceptées (le relecteur ne voit pas la liste) ; les manquantes ont été ajoutées, à la main ou par l’enrichissement automatique des réponses numériques. |
| 142 | Variantes à ajouter : ["42,3 %", "42,3%", "42.3"] | Variantes vérifiées : la plupart étaient déjà acceptées (le relecteur ne voit pas la liste) ; les manquantes ont été ajoutées, à la main ou par l’enrichissement automatique des réponses numériques. |
| 143 | Variantes à ajouter : ["56,8 %", "56,8%", "56.8"] | Variantes vérifiées : la plupart étaient déjà acceptées (le relecteur ne voit pas la liste) ; les manquantes ont été ajoutées, à la main ou par l’enrichissement automatique des réponses numériques. |
| 144 | Variantes à ajouter : ["8 %", "8%", "8,0"] | Variantes vérifiées : la plupart étaient déjà acceptées (le relecteur ne voit pas la liste) ; les manquantes ont été ajoutées, à la main ou par l’enrichissement automatique des réponses numériques. |
| 145 | Variantes à ajouter : ["40 %", "40%", "40,0"] | Variantes vérifiées : la plupart étaient déjà acceptées (le relecteur ne voit pas la liste) ; les manquantes ont été ajoutées, à la main ou par l’enrichissement automatique des réponses numériques. |
| 146 | Variantes à ajouter : ["2 400"] | Variantes vérifiées : la plupart étaient déjà acceptées (le relecteur ne voit pas la liste) ; les manquantes ont été ajoutées, à la main ou par l’enrichissement automatique des réponses numériques. |
| 147 | Variantes à ajouter : ["42,7 %", "42,7%", "42.7"] | Variantes vérifiées : la plupart étaient déjà acceptées (le relecteur ne voit pas la liste) ; les manquantes ont été ajoutées, à la main ou par l’enrichissement automatique des réponses numériques. |
| 148 | Variantes à ajouter : ["le cens caché", "Cens caché", "cens cache"] | Variantes vérifiées : la plupart étaient déjà acceptées (le relecteur ne voit pas la liste) ; les manquantes ont été ajoutées, à la main ou par l’enrichissement automatique des réponses numériques. |
| 150 | Variantes à ajouter : ["variables lourdes", "les variables lourdes", "lourde"] | Variantes vérifiées : la plupart étaient déjà acceptées (le relecteur ne voit pas la liste) ; les manquantes ont été ajoutées, à la main ou par l’enrichissement automatique des réponses numériques. |

Enrichissement automatique (appliqué à toutes les réponses courtes numériques) : pour un nombre seul, le convertisseur ajoute les formes avec espace des milliers, avec « % » si l'énoncé parle de pourcentage, avec « € » s'il parle d'euros, et les signes moins « - », « − » et « - » suivi d'une espace pour un nombre négatif. La virgule et le point décimaux sont déjà acceptés par la base pour un nombre seul.

## Bilan

- 150 questions : 75 `qcm_unique`, 30 `qcm_multiple`, 30 `vrai_faux` (15 vrais), 15 `reponse_courte` ; difficultés 60 / 59 / 31.
- `verifierBanque` : conforme.
- Statut : **150 validées**, aucune laissée « à relire ».

## Points de doute

Aucun. Faits vérifiés par le relecteur : inscription d'office depuis 1997 ; abstention de 28,0 % au second tour de la présidentielle de 2022 et de 52,5 % au premier tour des législatives ; Siegfried 1913, Lazarsfeld 1944, Gaxie 1978, Michelat et Simon (1977). Les trois écarts portent sur des vrai/faux que le cours tranche explicitement ; ils sont gardés.
