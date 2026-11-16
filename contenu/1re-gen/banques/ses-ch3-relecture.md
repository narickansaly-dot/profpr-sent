# Relecture de la banque du chapitre 3 de SES (1re) : défaillances du marché

## Méthode

Relecture **indépendante et à l'aveugle** par un sous-agent relecteur : il a reçu le texte du chapitre (`texteChapitre`) et les questions **sans les réponses ni les explications**, a résolu chaque question, refait chaque calcul et vérifié les faits cités, puis signalé ambiguïtés, distracteurs défendables et variantes de réponse courte. Ses réponses ont été comparées automatiquement aux réponses attendues (`comparer.py`, mêmes règles de normalisation et de marge que la base). La banque avait été rédigée par un autre sous-agent, puis contrôlée par `verifierBanque`.

Résultat : **150 réponses identiques sur 150**, 0 écart(s), 16 remarques.

## Remarques du relecteur et décisions

| Source | Remarque | Décision |
|---|---|---|
| 007 | Indice formel : la bonne réponse est la seule qui ne commence pas par « Parce que ». Correction : « Parce qu'elle suppose des conditions qui ne sont pas toujours réunies dans la réalité ». | Corrigée : la bonne réponse commence aussi par « Parce qu'elle… ». |
| 102 | Distracteur discutable : le bonus-malus est aussi présenté par les économistes comme un outil contre la sélection adverse (la tarification selon la sinistralité révèle le risque). Le cours le range seulement sous l'aléa moral ; garder, mais préciser « selon le cours » dans l'énoncé. | Énoncé « Selon le cours, quels instruments… » : le cours range le bonus-malus parmi les réponses à l'aléa moral. |
| 136 | Variantes à ajouter : « 70 000 », « 70000 € », « 70 000 € ». | Variantes vérifiées : la plupart étaient déjà acceptées (le relecteur ne voit pas la liste) ; les manquantes ont été ajoutées, à la main ou par l’enrichissement automatique des réponses numériques. |
| 137 | Variantes à ajouter : « 7 000 », « 7000 € », « 7 000 € ». | Variantes vérifiées : la plupart étaient déjà acceptées (le relecteur ne voit pas la liste) ; les manquantes ont été ajoutées, à la main ou par l’enrichissement automatique des réponses numériques. |
| 138 | Variantes à ajouter : « George Akerlof », « akerlof ». | Variantes vérifiées : la plupart étaient déjà acceptées (le relecteur ne voit pas la liste) ; les manquantes ont été ajoutées, à la main ou par l’enrichissement automatique des réponses numériques. |
| 139 | Variantes à ajouter : « la franchise », « une franchise ». | Variantes vérifiées : la plupart étaient déjà acceptées (le relecteur ne voit pas la liste) ; les manquantes ont été ajoutées, à la main ou par l’enrichissement automatique des réponses numériques. |
| 140 | Variantes à ajouter : « biens collectifs », « un bien collectif », « bien public », « bien public pur » (le cours donne ce synonyme). | Variantes vérifiées : la plupart étaient déjà acceptées (le relecteur ne voit pas la liste) ; les manquantes ont été ajoutées, à la main ou par l’enrichissement automatique des réponses numériques. |
| 141 | Variantes à ajouter : « une externalité », « externalite », « externalités ». | Variantes vérifiées : la plupart étaient déjà acceptées (le relecteur ne voit pas la liste) ; les manquantes ont été ajoutées, à la main ou par l’enrichissement automatique des réponses numériques. |
| 143 | Variantes à ajouter : « 25 000 », « 25000 € », « 25 000 € ». | Variantes vérifiées : la plupart étaient déjà acceptées (le relecteur ne voit pas la liste) ; les manquantes ont été ajoutées, à la main ou par l’enrichissement automatique des réponses numériques. |
| 144 | Variantes à ajouter : « 9 000 », « 9000 € », « 9 000 € ». | Variantes vérifiées : la plupart étaient déjà acceptées (le relecteur ne voit pas la liste) ; les manquantes ont été ajoutées, à la main ou par l’enrichissement automatique des réponses numériques. |
| 145 | Variantes à ajouter : « un bien commun », « biens communs ». | Variantes vérifiées : la plupart étaient déjà acceptées (le relecteur ne voit pas la liste) ; les manquantes ont été ajoutées, à la main ou par l’enrichissement automatique des réponses numériques. |
| 146 | Variantes à ajouter : « lemon », « les lemons », « des lemons ». | Variantes vérifiées : la plupart étaient déjà acceptées (le relecteur ne voit pas la liste) ; les manquantes ont été ajoutées, à la main ou par l’enrichissement automatique des réponses numériques. |
| 147 | Variantes à ajouter : « pollueur payeur », « principe pollueur-payeur », « le pollueur-payeur ». | Variantes vérifiées : la plupart étaient déjà acceptées (le relecteur ne voit pas la liste) ; les manquantes ont été ajoutées, à la main ou par l’enrichissement automatique des réponses numériques. |
| 148 | Variantes à ajouter : « 2 000 », « 2000 € », « 2 000 € ». | Variantes vérifiées : la plupart étaient déjà acceptées (le relecteur ne voit pas la liste) ; les manquantes ont été ajoutées, à la main ou par l’enrichissement automatique des réponses numériques. |
| 149 | Variantes à ajouter : « 250 000 », « 250000 € », « 250 000 € ». | Variantes vérifiées : la plupart étaient déjà acceptées (le relecteur ne voit pas la liste) ; les manquantes ont été ajoutées, à la main ou par l’enrichissement automatique des réponses numériques. |
| 150 | Le cours ne traite que le cas 50/50 ; ici il faut une moyenne pondérée ((3×10 000 + 6 000) ÷ 4 = 9 000), non vue dans le cours. Ajouter un indice (« moyenne pondérée par le nombre de voitures ») ou la garder comme question difficile. Variantes : « 9 000 », « 9000 € », « 9 000 € ». | Indice ajouté dans l'énoncé (« moyenne pondérée par le nombre de voitures ») ; la moyenne pondérée est un savoir-faire du programme (chapitre 13). Difficulté 3 maintenue. |

Enrichissement automatique (appliqué à toutes les réponses courtes numériques) : pour un nombre seul, le convertisseur ajoute les formes avec espace des milliers, avec « % » si l'énoncé parle de pourcentage, avec « € » s'il parle d'euros, et les signes moins « - », « − » et « - » suivi d'une espace pour un nombre négatif. La virgule et le point décimaux sont déjà acceptés par la base pour un nombre seul.

## Bilan

- 150 questions : 75 `qcm_unique`, 30 `qcm_multiple`, 30 `vrai_faux` (15 vrais), 15 `reponse_courte` ; difficultés 60 / 60 / 30.
- `verifierBanque` : conforme.
- Statut : **150 validées**, aucune laissée « à relire ».

## Points de doute

Aucun. Faits vérifiés par le relecteur : Akerlof 1970, Hardin 1968, Ostrom prix Nobel 2009.
