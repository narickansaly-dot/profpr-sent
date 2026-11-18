# Relecture de la banque du chapitre 6 de SES (1re) : socialisation et différences de comportement

## Méthode

Relecture **indépendante et à l'aveugle** par un sous-agent relecteur : il a reçu le texte du chapitre (`texteChapitre`) et les questions **sans les réponses ni les explications**, a résolu chaque question, refait chaque calcul et vérifié les faits cités, puis signalé ambiguïtés, distracteurs défendables et variantes de réponse courte. Ses réponses ont été comparées automatiquement aux réponses attendues (`comparer.py`, mêmes règles de normalisation et de marge que la base). La banque avait été rédigée par un autre sous-agent, puis contrôlée par `verifierBanque`.

Résultat : **147 réponses identiques sur 150**, 3 écart(s), 24 remarques.

## Écarts

| Source | Écart | Décision |
|---|---|---|
| 132 | relecteur=False attendu=True | Réponse attendue maintenue (vrai) : le cours l'écrit, et le relecteur confirme lui-même dans son rapport qu'Annie Ernaux a reçu le prix Nobel en 2022. Les écarts 132, 133 et 134 sont trois vrai/faux consécutifs : décalage d'une ligne dans la saisie du relecteur. |
| 133 | relecteur=True attendu=False | Réponse attendue maintenue (faux) : le cours cite un membre de la famille, un enseignant, des amis, l'ordre de la vie familiale « même sans diplôme ». Décalage de saisie (voir 132). |
| 134 | relecteur=False attendu=True | Réponse attendue maintenue (vrai) : le cours cite « un enseignant, un éducateur ou un entraîneur ». Décalage de saisie (voir 132). |

## Remarques du relecteur et décisions

| Source | Remarque | Décision |
|---|---|---|
| 002 | Indice de longueur : la bonne réponse est nettement plus courte que les trois distracteurs (longs et absolus), ce qui la désigne sans lecture du cours. Allonger la bonne réponse ou raccourcir les distracteurs. | Corrigée : bonne réponse allongée pour qu'elle ne se repère plus à sa brièveté face à des distracteurs longs et absolus. |
| 020 | Indice de longueur : la bonne réponse est nettement plus courte que les trois distracteurs (longs et absolus), ce qui la désigne sans lecture du cours. Allonger la bonne réponse ou raccourcir les distracteurs. | Corrigée : bonne réponse allongée pour qu'elle ne se repère plus à sa brièveté face à des distracteurs longs et absolus. |
| 022 | Indice de longueur : la bonne réponse est nettement plus courte que les trois distracteurs (longs et absolus), ce qui la désigne sans lecture du cours. Allonger la bonne réponse ou raccourcir les distracteurs. | Corrigée : bonne réponse allongée pour qu'elle ne se repère plus à sa brièveté face à des distracteurs longs et absolus. |
| 041 | Indice de longueur : la bonne réponse est nettement plus courte que les trois distracteurs (longs et absolus), ce qui la désigne sans lecture du cours. Allonger la bonne réponse ou raccourcir les distracteurs. | Corrigée : bonne réponse allongée pour qu'elle ne se repère plus à sa brièveté face à des distracteurs longs et absolus. |
| 042 | Indice de longueur : la bonne réponse est nettement plus courte que les trois distracteurs (longs et absolus), ce qui la désigne sans lecture du cours. Allonger la bonne réponse ou raccourcir les distracteurs. | Corrigée : bonne réponse allongée pour qu'elle ne se repère plus à sa brièveté face à des distracteurs longs et absolus. |
| 043 | Indice de longueur : la bonne réponse est nettement plus courte que les trois distracteurs (longs et absolus), ce qui la désigne sans lecture du cours. Allonger la bonne réponse ou raccourcir les distracteurs. | Corrigée : bonne réponse allongée pour qu'elle ne se repère plus à sa brièveté face à des distracteurs longs et absolus. |
| 052 | Indice de longueur : la bonne réponse est nettement plus courte que les trois distracteurs (longs et absolus), ce qui la désigne sans lecture du cours. Allonger la bonne réponse ou raccourcir les distracteurs. | Corrigée : bonne réponse allongée pour qu'elle ne se repère plus à sa brièveté face à des distracteurs longs et absolus. |
| 110 | Formulation absolue (« n'ont pas les mêmes vacances ») : vrai au sens du cours mais un élève peut objecter que deux enfants de milieux différents peuvent avoir les mêmes vacances. Proposer : « ne vivent pas, en général, les mêmes expériences (vacances, activités extrascolaires) ». | Corrigée : « En général, … ne vivent pas les mêmes expériences de vacances et d'activités extrascolaires ». |
| 115 | Peut prêter à débat chez un élève (« une exception contredit-elle la règle ? »). Réponse Faux défendable grâce à « tendances, pas des destins » ; ajouter dans l'explication que c'est une trajectoire improbable qui ne contredit pas une tendance statistique. | Explication complétée : une trajectoire improbable ne contredit pas une tendance statistique. |
| 136 | Variantes : ["la socialisation"] | Variantes vérifiées : la plupart étaient déjà acceptées (le relecteur ne voit pas la liste) ; les manquantes ont été ajoutées, à la main ou par l’enrichissement automatique des réponses numériques. |
| 137 | Variantes : ["interioriser", "s'intérioriser"] | Variantes vérifiées : la plupart étaient déjà acceptées (le relecteur ne voit pas la liste) ; les manquantes ont été ajoutées, à la main ou par l’enrichissement automatique des réponses numériques. |
| 138 | Variantes : ["l'habitus", "un habitus"] | Variantes vérifiées : la plupart étaient déjà acceptées (le relecteur ne voit pas la liste) ; les manquantes ont été ajoutées, à la main ou par l’enrichissement automatique des réponses numériques. |
| 139 | Réponse attendue ambiguë : le cours emploie aussi « ambitions » (introduction : « écarts de comportements, de goûts et d'ambitions »). Variantes : ["aspiration", "les aspirations", "ambitions", "les ambitions"] ; ou préciser « mot employé par le cours dans la partie sur l'anticipation de l'avenir ». | Variantes « ambitions », « les ambitions », « ambition » ajoutées (le cours emploie aussi ce mot). |
| 140 | Variantes : ["études courtes", "des études courtes", "courte", "courtes", "etudes courtes"] | Variantes vérifiées : la plupart étaient déjà acceptées (le relecteur ne voit pas la liste) ; les manquantes ont été ajoutées, à la main ou par l’enrichissement automatique des réponses numériques. |
| 141 | Variantes : ["differenciee", "socialisation différenciée", "socialisation différenciée selon le sexe", "différenciée selon le sexe"] | Variantes vérifiées : la plupart étaient déjà acceptées (le relecteur ne voit pas la liste) ; les manquantes ont été ajoutées, à la main ou par l’enrichissement automatique des réponses numériques. |
| 142 | Variantes : ["famille homoparentale", "homoparentale", "homoparental"] | Variantes vérifiées : la plupart étaient déjà acceptées (le relecteur ne voit pas la liste) ; les manquantes ont été ajoutées, à la main ou par l’enrichissement automatique des réponses numériques. |
| 143 | Variantes : ["famille recomposée", "recomposee", "recomposé"] | Variantes vérifiées : la plupart étaient déjà acceptées (le relecteur ne voit pas la liste) ; les manquantes ont été ajoutées, à la main ou par l’enrichissement automatique des réponses numériques. |
| 144 | Variantes : ["socialisation primaire", "primaire"] | Variantes vérifiées : la plupart étaient déjà acceptées (le relecteur ne voit pas la liste) ; les manquantes ont été ajoutées, à la main ou par l’enrichissement automatique des réponses numériques. |
| 145 | Variantes : ["socialisations secondaires", "secondaire", "secondaires"] | Variantes vérifiées : la plupart étaient déjà acceptées (le relecteur ne voit pas la liste) ; les manquantes ont été ajoutées, à la main ou par l’enrichissement automatique des réponses numériques. |
| 146 | Variantes : ["socialisation politique", "la socialisation politique"] | Variantes vérifiées : la plupart étaient déjà acceptées (le relecteur ne voit pas la liste) ; les manquantes ont été ajoutées, à la main ou par l’enrichissement automatique des réponses numériques. |
| 147 | Variantes : ["le mariage", "un mariage"] | Variantes vérifiées : la plupart étaient déjà acceptées (le relecteur ne voit pas la liste) ; les manquantes ont été ajoutées, à la main ou par l’enrichissement automatique des réponses numériques. |
| 148 | Variantes : ["l'homme pluriel", "homme-pluriel", "un homme pluriel"] | Variantes vérifiées : la plupart étaient déjà acceptées (le relecteur ne voit pas la liste) ; les manquantes ont été ajoutées, à la main ou par l’enrichissement automatique des réponses numériques. |
| 149 | Variantes : ["transfuges de classe", "transfuge", "transfuge de classe", "des transfuges"] | Variantes vérifiées : la plupart étaient déjà acceptées (le relecteur ne voit pas la liste) ; les manquantes ont été ajoutées, à la main ou par l’enrichissement automatique des réponses numériques. |
| 150 | Variantes : ["Ernaux", "annie ernaux"] | Variantes vérifiées : la plupart étaient déjà acceptées (le relecteur ne voit pas la liste) ; les manquantes ont été ajoutées, à la main ou par l’enrichissement automatique des réponses numériques. |

Enrichissement automatique (appliqué à toutes les réponses courtes numériques) : pour un nombre seul, le convertisseur ajoute les formes avec espace des milliers, avec « % » si l'énoncé parle de pourcentage, avec « € » s'il parle d'euros, et les signes moins « - », « − » et « - » suivi d'une espace pour un nombre négatif. La virgule et le point décimaux sont déjà acceptés par la base pour un nombre seul.

## Bilan

- 150 questions : 75 `qcm_unique`, 30 `qcm_multiple`, 30 `vrai_faux` (15 vrais), 15 `reponse_courte` ; difficultés 60 / 60 / 30.
- `verifierBanque` : conforme.
- Statut : **150 validées**, aucune laissée « à relire ».

## Points de doute

Aucun. Faits vérifiés par le relecteur : Ernaux prix Nobel 2022, Berger et Kellner, une famille avec enfants mineurs sur quatre monoparentale, mère dans plus de huit cas sur dix.
