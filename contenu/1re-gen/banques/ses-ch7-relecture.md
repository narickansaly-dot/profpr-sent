# Relecture de la banque du chapitre 7 de SES (1re) : liens sociaux

## Méthode

Relecture **indépendante et à l'aveugle** par un sous-agent relecteur : il a reçu le texte du chapitre (`texteChapitre`) et les questions **sans les réponses ni les explications**, a résolu chaque question, refait chaque calcul et vérifié les faits cités, puis signalé ambiguïtés, distracteurs défendables et variantes de réponse courte. Ses réponses ont été comparées automatiquement aux réponses attendues (`comparer.py`, mêmes règles de normalisation et de marge que la base). La banque avait été rédigée par un autre sous-agent, puis contrôlée par `verifierBanque`.

Résultat : **150 réponses identiques sur 150**, 0 écart(s), 17 remarques.

## Remarques du relecteur et décisions

| Source | Remarque | Décision |
|---|---|---|
| 015 | Variantes à accepter : ["catégorie statistique", "une catégorie statistique", "statistiques"] | Variantes vérifiées : la plupart étaient déjà acceptées (le relecteur ne voit pas la liste) ; les manquantes ont été ajoutées, à la main ou par l’enrichissement automatique des réponses numériques. |
| 016 | Variantes à accepter : ["groupe primaire", "un groupe primaire", "primaires"] | Variantes vérifiées : la plupart étaient déjà acceptées (le relecteur ne voit pas la liste) ; les manquantes ont été ajoutées, à la main ou par l’enrichissement automatique des réponses numériques. |
| 032 | Variantes à accepter : ["lien de filiation", "la filiation", "de filiation"] | Variantes vérifiées : la plupart étaient déjà acceptées (le relecteur ne voit pas la liste) ; les manquantes ont été ajoutées, à la main ou par l’enrichissement automatique des réponses numériques. |
| 039 | Erreur de fond : dans la nomenclature réelle, une infirmière en soins généraux salariée de l'hôpital public et une salariée de clinique privée ont le même code PCS (pas de distinction public/privé pour ce métier) ; « Quel critère des PCS les distingue ? » est donc inexact. Correction : changer d'exemple (ex. un cadre de la fonction publique et un cadre d'entreprise privée, que la PCS distingue) ou reformuler « Quel critère des PCS porte sur cette différence ? ». | Corrigée (erreur de fond) : la PCS ne distingue pas les infirmières du public et du privé. Nouvel exemple : un cadre administratif d'un ministère et un cadre d'une banque privée, que la PCS sépare (cadres de la fonction publique / cadres d'entreprise). Explication précisée. |
| 046 | Variantes à accepter : ["les PCS", "la PCS", "P.C.S.", "PCS 2020", "professions et catégories socioprofessionnelles"] | Variantes vérifiées : la plupart étaient déjà acceptées (le relecteur ne voit pas la liste) ; les manquantes ont été ajoutées, à la main ou par l’enrichissement automatique des réponses numériques. |
| 062 | Variantes à accepter : ["ouvrier", "les ouvriers", "Ouvriers"] | Variantes vérifiées : la plupart étaient déjà acceptées (le relecteur ne voit pas la liste) ; les manquantes ont été ajoutées, à la main ou par l’enrichissement automatique des réponses numériques. |
| 080 | Variantes à accepter : ["5 membres", "5 ouvrières", "cinq"] | Variantes vérifiées : la plupart étaient déjà acceptées (le relecteur ne voit pas la liste) ; les manquantes ont été ajoutées, à la main ou par l’enrichissement automatique des réponses numériques. |
| 081 | Variantes à accepter : ["15", "15%", "15 pour cent", "15,0 %"] | Variantes vérifiées : la plupart étaient déjà acceptées (le relecteur ne voit pas la liste) ; les manquantes ont été ajoutées, à la main ou par l’enrichissement automatique des réponses numériques. |
| 082 | Variantes à accepter : ["35", "35%", "35 pour cent", "35,0 %"] | Variantes vérifiées : la plupart étaient déjà acceptées (le relecteur ne voit pas la liste) ; les manquantes ont été ajoutées, à la main ou par l’enrichissement automatique des réponses numériques. |
| 083 | Variantes à accepter : ["45,8", "45,8%", "45.8", "45.8 %", "45.8%"] | Variantes vérifiées : la plupart étaient déjà acceptées (le relecteur ne voit pas la liste) ; les manquantes ont été ajoutées, à la main ou par l’enrichissement automatique des réponses numériques. |
| 084 | Variantes à accepter : ["30", "30%", "30 pour cent"] | Variantes vérifiées : la plupart étaient déjà acceptées (le relecteur ne voit pas la liste) ; les manquantes ont été ajoutées, à la main ou par l’enrichissement automatique des réponses numériques. |
| 099 | Variantes à accepter : ["Émile Durkheim", "Emile Durkheim", "durkheim"] | Variantes vérifiées : la plupart étaient déjà acceptées (le relecteur ne voit pas la liste) ; les manquantes ont été ajoutées, à la main ou par l’enrichissement automatique des réponses numériques. |
| 100 | Variantes à accepter : ["solidarité mécanique", "mecanique", "la solidarité mécanique"] | Variantes vérifiées : la plupart étaient déjà acceptées (le relecteur ne voit pas la liste) ; les manquantes ont été ajoutées, à la main ou par l’enrichissement automatique des réponses numériques. |
| 116 | Variantes à accepter : ["l'individualisation", "l’individualisation"] | Variantes vérifiées : la plupart étaient déjà acceptées (le relecteur ne voit pas la liste) ; les manquantes ont été ajoutées, à la main ou par l’enrichissement automatique des réponses numériques. |
| 133 | Variantes à accepter : ["fracture numérique", "la fracture numérique", "numerique"] | Variantes vérifiées : la plupart étaient déjà acceptées (le relecteur ne voit pas la liste) ; les manquantes ont été ajoutées, à la main ou par l’enrichissement automatique des réponses numériques. |
| 144 | Énoncé ambigu : l'intégration est le point de départ, pas une situation de « basculement » ; un élève peut hésiter à la cocher. Correction : « Quelles zones Robert Castel distingue-t-il pour décrire le passage de l'intégration à la désaffiliation ? » ou retirer l'intégration des bonnes réponses en reformulant « vers quelles situations bascule-t-on ». | Corrigée : « Quelles zones Robert Castel distingue-t-il sur le chemin qui va de l'intégration à la désaffiliation ? » ; l'intégration, point de départ, est bien l'une des réponses. |
| 150 | Variantes à accepter : ["la désaffiliation", "desaffiliation"] | Variantes vérifiées : la plupart étaient déjà acceptées (le relecteur ne voit pas la liste) ; les manquantes ont été ajoutées, à la main ou par l’enrichissement automatique des réponses numériques. |

Enrichissement automatique (appliqué à toutes les réponses courtes numériques) : pour un nombre seul, le convertisseur ajoute les formes avec espace des milliers, avec « % » si l'énoncé parle de pourcentage, avec « € » s'il parle d'euros, et les signes moins « - », « − » et « - » suivi d'une espace pour un nombre négatif. La virgule et le point décimaux sont déjà acceptés par la base pour un nombre seul.

## Bilan

- 150 questions : 75 `qcm_unique`, 30 `qcm_multiple`, 30 `vrai_faux` (15 vrais), 15 `reponse_courte` ; difficultés 60 / 60 / 30.
- `verifierBanque` : conforme.
- Statut : **150 validées**, aucune laissée « à relire ».

## Points de doute

Le cours ne précise pas que les chômeurs ayant déjà travaillé sont classés selon leur dernière profession (omission signalée, sans question liée). Deux questions classent un indépendant (réparatrice de vélos, chauffeur de taxi à son compte) dans le groupe 2 par le seul critère du statut, conformément au cours. La réponse courte sur le sigle accepte aussi « CSP », ancien nom de la nomenclature.
