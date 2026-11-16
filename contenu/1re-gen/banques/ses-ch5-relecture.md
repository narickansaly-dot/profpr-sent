# Relecture de la banque du chapitre 5 de SES (1re) : monnaie et création monétaire

## Méthode

Relecture **indépendante et à l'aveugle** par un sous-agent relecteur : il a reçu le texte du chapitre (`texteChapitre`) et les questions **sans les réponses ni les explications**, a résolu chaque question, refait chaque calcul et vérifié les faits cités, puis signalé ambiguïtés, distracteurs défendables et variantes de réponse courte. Ses réponses ont été comparées automatiquement aux réponses attendues (`comparer.py`, mêmes règles de normalisation et de marge que la base). La banque avait été rédigée par un autre sous-agent, puis contrôlée par `verifierBanque`.

Résultat : **150 réponses identiques sur 150**, 0 écart(s), 16 remarques.

## Remarques du relecteur et décisions

| Source | Remarque | Décision |
|---|---|---|
| 054 | Variantes à accepter : "25 000", "25000 €", "25 000 €", "25000€" (consigne « sans espace » parfois ignorée, unité ajoutée). | Variantes vérifiées : la plupart étaient déjà acceptées (le relecteur ne voit pas la liste) ; les manquantes ont été ajoutées, à la main ou par l’enrichissement automatique des réponses numériques. |
| 055 | Variantes à accepter : "16 000", "16000 €", "16 000 €", "16000€" (consigne « sans espace » parfois ignorée, unité ajoutée). | Variantes vérifiées : la plupart étaient déjà acceptées (le relecteur ne voit pas la liste) ; les manquantes ont été ajoutées, à la main ou par l’enrichissement automatique des réponses numériques. |
| 056 | Variantes à accepter : "20 000", "20000 €", "20 000 €", "20000€" (consigne « sans espace » parfois ignorée, unité ajoutée). | Variantes vérifiées : la plupart étaient déjà acceptées (le relecteur ne voit pas la liste) ; les manquantes ont été ajoutées, à la main ou par l’enrichissement automatique des réponses numériques. |
| 074 | Variantes à accepter : "25 000", "25000 €", "25 000 €", "25000€" (consigne « sans espace » parfois ignorée, unité ajoutée). | Variantes vérifiées : la plupart étaient déjà acceptées (le relecteur ne voit pas la liste) ; les manquantes ont été ajoutées, à la main ou par l’enrichissement automatique des réponses numériques. |
| 075 | Pas de consigne de format. Variantes à accepter : "150 millions", "150 millions d'euros", "150 M€", "+150", "150 000 000", "150000000". | Variantes « 150 M€ », « 150000000 », « 150 000 000 » ajoutées. |
| 093 | Réponse fausse défendable d'après le cours (le taux de dépôt rémunère), mais nuance : de 2014 à 2022 le taux de la facilité de dépôt était négatif, les dépôts ne rapportaient donc rien (ils coûtaient). Proposer : « Les dépôts d'une banque commerciale à la banque centrale peuvent être rémunérés par un taux directeur. » (vrai) ou garder en l'état. | Gardée (faux) : le cours présente un taux directeur qui rémunère les dépôts des banques ; « jamais » est donc faux. La période de taux de dépôt négatif (2014-2022) n'est pas au programme ; la nuance est notée dans le bilan. |
| 130 | Variantes : "3.5", "3,5 %", "3,5%", "3.5 %", "+3,5". | Variantes vérifiées : la plupart étaient déjà acceptées (le relecteur ne voit pas la liste) ; les manquantes ont été ajoutées, à la main ou par l’enrichissement automatique des réponses numériques. |
| 131 | Variantes : "1.08", "1,080". | Variantes vérifiées : la plupart étaient déjà acceptées (le relecteur ne voit pas la liste) ; les manquantes ont été ajoutées, à la main ou par l’enrichissement automatique des réponses numériques. |
| 132 | Variantes : "115,0", "115.0". | Variantes vérifiées : la plupart étaient déjà acceptées (le relecteur ne voit pas la liste) ; les manquantes ont été ajoutées, à la main ou par l’enrichissement automatique des réponses numériques. |
| 133 | Variantes : "3 %", "3%", "3,0", "3.0", "+3". | Variantes vérifiées : la plupart étaient déjà acceptées (le relecteur ne voit pas la liste) ; les manquantes ont été ajoutées, à la main ou par l’enrichissement automatique des réponses numériques. |
| 134 | Réponse négative : variantes "−4" (signe moins typographique), "-4 %", "-4%", "- 4", "−4 %", "-4,0". Un élève peut aussi taper "4" en pensant « baisse de 4 » : préciser dans l'énoncé « (nombre négatif si baisse) ». | Énoncé précisé : « (nombre négatif en cas de baisse) » ; variantes du signe moins ajoutées. |
| 135 | Calcul : (115−125)/125 = −8 %. Mêmes variantes que pour un taux négatif : "−8", "-8 %", "-8%", "- 8", "−8 %", "-8,0". Préciser « (nombre négatif si baisse) » dans l'énoncé. | Énoncé précisé : « (nombre négatif en cas de baisse) » ; variantes du signe moins ajoutées. |
| 136 | 3,6/108 = 3,333… → 3,3. Variantes : "3.3", "3,3 %", "3,3%", "3.3 %". | Variantes vérifiées : la plupart étaient déjà acceptées (le relecteur ne voit pas la liste) ; les manquantes ont été ajoutées, à la main ou par l’enrichissement automatique des réponses numériques. |
| 137 | 4,72/118 = 0,04 → 4 %. Variantes : "4 %", "4%", "4,0", "4.0". | Variantes vérifiées : la plupart étaient déjà acceptées (le relecteur ne voit pas la liste) ; les manquantes ont été ajoutées, à la main ou par l’enrichissement automatique des réponses numériques. |
| 149 | Variantes : "1 place", "une", "une place", "-1". | Variantes déjà présentes (« 1 », « un », « une », « 1 place », « une place ») ; « -1 » non ajouté. |
| 150 | Variantes : "250 paniers". | « 250 paniers » déjà accepté. |

Enrichissement automatique (appliqué à toutes les réponses courtes numériques) : pour un nombre seul, le convertisseur ajoute les formes avec espace des milliers, avec « % » si l'énoncé parle de pourcentage, avec « € » s'il parle d'euros, et les signes moins « - », « − » et « - » suivi d'une espace pour un nombre négatif. La virgule et le point décimaux sont déjà acceptés par la base pour un nombre seul.

## Bilan

- 150 questions : 75 `qcm_unique`, 30 `qcm_multiple`, 30 `vrai_faux` (15 vrais), 15 `reponse_courte` ; difficultés 60 / 60 / 30.
- `verifierBanque` : conforme.
- Statut : **150 validées**, aucune laissée « à relire ».

## Points de doute

Aucun bloquant. Le cours dit que la banque centrale émet les billets ; les pièces sont frappées par l'État (Monnaie de Paris) : le cours ne dit rien de faux mais pourrait le préciser.
