# Relecture de la banque du chapitre 9 de SES (1re) : opinion publique

## Méthode

Relecture **indépendante et à l'aveugle** par un sous-agent relecteur : il a reçu le texte du chapitre (`texteChapitre`) et les questions **sans les réponses ni les explications**, a résolu chaque question, refait chaque calcul et vérifié les faits cités, puis signalé ambiguïtés, distracteurs défendables et variantes de réponse courte. Ses réponses ont été comparées automatiquement aux réponses attendues (`comparer.py`, mêmes règles de normalisation et de marge que la base). La banque avait été rédigée par un autre sous-agent, puis contrôlée par `verifierBanque`.

Résultat : **150 réponses identiques sur 150**, 0 écart(s), 23 remarques.

## Remarques du relecteur et décisions

| Source | Remarque | Décision |
|---|---|---|
| 011 | Le cours dit « nobles et bourgeois cultivés » : « bourgeois instruits » est une reformulation acceptable. | Gardée : reformulation fidèle au cours. |
| 021 | Nuance historique : le suffrage universel masculin a brièvement existé en 1792 (élection de la Convention) ; le distracteur 1 (« en vigueur depuis la Révolution ») reste faux, mais on pourrait préciser « en 1840 » pour lever tout doute. Rien de bloquant. | Gardée : en 1840, le suffrage est censitaire ; le cours précise désormais « de 1815 à 1848 » (un suffrage universel masculin a brièvement existé en 1792). |
| 032 | Nuance : en 1792 la Convention fut élue au suffrage universel masculin ; « avant 1848 » au sens strict n'est donc pas totalement exact, mais la réponse attendue (faux) reste défendable. Proposition : « Entre 1815 et 1848, … ». | Corrigée : « Entre 1815 et 1848, … » au lieu de « Avant 1848 ». |
| 034 | Variantes à ajouter : ["96 ans"] | Variantes vérifiées : la plupart étaient déjà acceptées (le relecteur ne voit pas la liste) ; les manquantes ont été ajoutées, à la main ou par l’enrichissement automatique des réponses numériques. |
| 053 | Variantes à ajouter : ["480 hommes"] | Variantes vérifiées : la plupart étaient déjà acceptées (le relecteur ne voit pas la liste) ; les manquantes ont été ajoutées, à la main ou par l’enrichissement automatique des réponses numériques. |
| 054 | Variantes à ajouter : ["300 personnes"] | Variantes vérifiées : la plupart étaient déjà acceptées (le relecteur ne voit pas la liste) ; les manquantes ont été ajoutées, à la main ou par l’enrichissement automatique des réponses numériques. |
| 055 | Variantes à ajouter : ["96 cadres"] | Variantes vérifiées : la plupart étaient déjà acceptées (le relecteur ne voit pas la liste) ; les manquantes ont été ajoutées, à la main ou par l’enrichissement automatique des réponses numériques. |
| 056 | Variantes à ajouter : ["340 habitants", "340 personnes"] | Variantes vérifiées : la plupart étaient déjà acceptées (le relecteur ne voit pas la liste) ; les manquantes ont été ajoutées, à la main ou par l’enrichissement automatique des réponses numériques. |
| 057 | Variantes à ajouter : ["15 %", "15%", "15 pour cent"] | Variantes vérifiées : la plupart étaient déjà acceptées (le relecteur ne voit pas la liste) ; les manquantes ont été ajoutées, à la main ou par l’enrichissement automatique des réponses numériques. |
| 058 | Variantes à ajouter : ["25 jeunes", "25 personnes"] | Variantes vérifiées : la plupart étaient déjà acceptées (le relecteur ne voit pas la liste) ; les manquantes ont été ajoutées, à la main ou par l’enrichissement automatique des réponses numériques. |
| 065 | L'attribution à la seule loi de 1977 est discutable (voir loi de 2002), mais aucun autre distracteur n'est défendable. | Le cours mentionne désormais la modification de 2002 ; la question (rôle de la Commission des sondages) reste juste. |
| 067 | Erreur de fond (cours compris) : la loi du 19 juillet 1977 interdisait à l'origine la publication des sondages électoraux pendant la SEMAINE précédant le scrutin ; c'est la loi du 19 février 2002 qui a réduit l'interdiction à la veille et au jour du scrutin. Correction : écrire « la loi de 1977, modifiée en 2002, … ». | Corrigée : « Que prévoit la loi aujourd'hui ? » ; explication datée (loi de 2002 modifiant celle de 1977). |
| 071 | L'interdiction de publication « la veille et le jour du scrutin » date de la loi de 2002 modifiant celle de 1977 (avant : une semaine). Correction : « Que prévoit aujourd'hui la loi de 1977 modifiée … ». | Corrigée : « Que prévoit aujourd'hui la loi de 1977, modifiée en 2002… ». |
| 077 | GRAVE : dans sa version initiale, la loi de 1977 interdisait justement la publication pendant la semaine précédant le scrutin ; l'affirmation est historiquement vraie. Correction : « Aujourd'hui, la loi interdit la publication… pendant toute la semaine… » (faux), ou supprimer la question. | Corrigée (grave) : dans sa version de 1977, la loi interdisait bien la publication pendant la semaine précédant le scrutin ; c'est une loi de 2002 qui a réduit l'interdiction à la veille et au jour du scrutin. Énoncé : « Aujourd'hui, la loi interdit… » (faux). Cours corrigé. |
| 078 | Variantes à ajouter : ["47 %", "47%"] | Variantes vérifiées : la plupart étaient déjà acceptées (le relecteur ne voit pas la liste) ; les manquantes ont été ajoutées, à la main ou par l’enrichissement automatique des réponses numériques. |
| 079 | Variantes à ajouter : ["45 %", "45%"] | Variantes vérifiées : la plupart étaient déjà acceptées (le relecteur ne voit pas la liste) ; les manquantes ont été ajoutées, à la main ou par l’enrichissement automatique des réponses numériques. |
| 080 | Variantes à ajouter : ["26 %", "26%"] | Variantes vérifiées : la plupart étaient déjà acceptées (le relecteur ne voit pas la liste) ; les manquantes ont été ajoutées, à la main ou par l’enrichissement automatique des réponses numériques. |
| 081 | Variantes à ajouter : ["4 points", "quatre", "quatre points"] | Variantes vérifiées : la plupart étaient déjà acceptées (le relecteur ne voit pas la liste) ; les manquantes ont été ajoutées, à la main ou par l’enrichissement automatique des réponses numériques. |
| 082 | Variantes à ajouter : ["49 %", "49%"] | Variantes vérifiées : la plupart étaient déjà acceptées (le relecteur ne voit pas la liste) ; les manquantes ont été ajoutées, à la main ou par l’enrichissement automatique des réponses numériques. |
| 083 | Fait discutable : l'article « L'opinion publique n'existe pas » est issu d'une conférence de janvier 1972 mais a été publié dans Les Temps modernes en janvier 1973. Correction : « présente en 1972 (publié en 1973) » ou accepter les deux dates. | Corrigée, ainsi que le cours : conférence de 1972, publiée en 1973 (Les Temps modernes). Énoncé : « défend en 1972 la thèse… ». |
| 088 | Le distracteur 2 n'est pas défendable, mais le cas (sans-réponse masqués) illustre aussi le conseil des défenseurs (« lire avec les sans-réponse ») : rien de bloquant. | Gardée : remarque sans problème bloquant. |
| 102 | Fait discutable : l'article « L'opinion publique n'existe pas » est issu d'une conférence de janvier 1972 mais a été publié dans Les Temps modernes en janvier 1973. Correction : « présente en 1972 (publié en 1973) » ou accepter les deux dates. Variantes à ajouter si la correction est retenue : ["1973"] | Corrigée : l'énoncé porte sur la conférence de 1972 ; 1973 (année de publication) est aussi acceptée. |
| 138 | Variantes à ajouter : ["la démocratie d'opinion", "une démocratie d'opinion", "démocratie d’opinion", "democratie d'opinion", "démocratie d opinion"] | Variantes vérifiées : la plupart étaient déjà acceptées (le relecteur ne voit pas la liste) ; les manquantes ont été ajoutées, à la main ou par l’enrichissement automatique des réponses numériques. |

Enrichissement automatique (appliqué à toutes les réponses courtes numériques) : pour un nombre seul, le convertisseur ajoute les formes avec espace des milliers, avec « % » si l'énoncé parle de pourcentage, avec « € » s'il parle d'euros, et les signes moins « - », « − » et « - » suivi d'une espace pour un nombre négatif. La virgule et le point décimaux sont déjà acceptés par la base pour un nombre seul.

## Bilan

- 150 questions : 75 `qcm_unique`, 30 `qcm_multiple`, 30 `vrai_faux` (15 vrais), 15 `reponse_courte` ; difficultés 59 / 60 / 31.
- `verifierBanque` : conforme.
- Statut : **150 validées**, aucune laissée « à relire ».

## Points de doute

Le relecteur a trouvé deux erreurs factuelles dans le cours, corrigées : la loi de 1977 interdisait la publication des sondages pendant la semaine précédant le scrutin (veille et jour du scrutin depuis 2002) ; l'article de Bourdieu, présenté en conférence en 1972, a été publié en 1973. À la suite de cette relecture, l'enrichissement automatique des réponses numériques a été restreint : il n'ajoute plus « % » ou « € » qu'aux énoncés qui demandent un résultat en % ou en euros (des effectifs comme « 480 » acceptaient à tort « 480 % ») ; les banques 2 à 9 ont été régénérées.
