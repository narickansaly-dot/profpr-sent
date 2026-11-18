# Relecture de la banque du chapitre 11 de SES (1re) : assurance, protection sociale et gestion des risques

## Méthode

Relecture **indépendante et à l'aveugle** par un sous-agent relecteur : il a reçu le texte du chapitre (`texteChapitre`) et les questions **sans les réponses ni les explications**, a résolu chaque question, refait chaque calcul et vérifié les faits cités, puis signalé ambiguïtés, distracteurs défendables et variantes de réponse courte. Ses réponses ont été comparées automatiquement aux réponses attendues (`comparer.py`, mêmes règles de normalisation et de marge que la base). La banque avait été rédigée par un autre sous-agent, puis contrôlée par `verifierBanque`.

Résultat : **150 réponses identiques sur 150**, 0 écart(s), 28 remarques.

## Remarques du relecteur et décisions

| Source | Remarque | Décision |
|---|---|---|
| 012 | Variantes à accepter : ["incertitude", "l'incertitude", "une incertitude", "incertitudes"] | Variantes vérifiées : la plupart étaient déjà acceptées (le relecteur ne voit pas la liste) ; les manquantes ont été ajoutées, à la main ou par l’enrichissement automatique des réponses numériques. |
| 031 | Forme : la bonne réponse est la seule proposition qui ne commence pas par « Parce que », ce qui la signale. Correction : « Parce que l'exposition aux risques varie selon les individus, les groupes sociaux et les sociétés ». | Corrigée : la bonne réponse commence aussi par « Parce que… ». |
| 053 | Variantes à accepter : ["conduites à risque", "conduite à risque", "des conduites à risque", "les conduites à risque", "une conduite à risque", "conduites à risques", "conduite à risques"] | Variantes vérifiées : la plupart étaient déjà acceptées (le relecteur ne voit pas la liste) ; les manquantes ont été ajoutées, à la main ou par l’enrichissement automatique des réponses numériques. |
| 070 | Variantes à accepter : ["aléa moral", "l'aléa moral", "un aléa moral", "alea moral", "l'alea moral", "aléas moraux"] | Variantes vérifiées : la plupart étaient déjà acceptées (le relecteur ne voit pas la liste) ; les manquantes ont été ajoutées, à la main ou par l’enrichissement automatique des réponses numériques. |
| 071 | Calcul : 2 000 − 150 = 1 850. Variantes à accepter : ["1850", "1 850", "1850 €", "1 850 €", "1850€", "1850 euros"] | Variantes vérifiées : la plupart étaient déjà acceptées (le relecteur ne voit pas la liste) ; les manquantes ont été ajoutées, à la main ou par l’enrichissement automatique des réponses numériques. |
| 085 | Variantes à accepter : ["prévention", "la prévention", "prevention", "la prevention"] | Variantes vérifiées : la plupart étaient déjà acceptées (le relecteur ne voit pas la liste) ; les manquantes ont été ajoutées, à la main ou par l’enrichissement automatique des réponses numériques. |
| 086 | Variantes à accepter : ["diversification", "la diversification", "une diversification", "diversifier"] | Variantes vérifiées : la plupart étaient déjà acceptées (le relecteur ne voit pas la liste) ; les manquantes ont été ajoutées, à la main ou par l’enrichissement automatique des réponses numériques. |
| 091 | Calcul vérifié : 5 000 ÷ 50 = 100 téléphones × 600 € = 60 000 € ; 60 000 ÷ 5 000 = 12 €. | Vérifié et juste : aucune modification. |
| 092 | Calcul vérifié : 2 % × 20 000 = 400 sinistres × 1 500 € = 600 000 € ; ÷ 20 000 = 30 €. | Vérifié et juste : aucune modification. |
| 093 | Calcul vérifié : 8 000 ÷ 200 = 40 vols × 3 000 € = 120 000 € ; ÷ 8 000 = 15 €. Le distracteur 40 € (nombre de vols) est bien pensé. | Vérifié et juste : aucune modification. |
| 094 | Calcul vérifié : 4 000 ÷ 20 = 200 × 5 000 € = 1 000 000 € ; ÷ 4 000 = 250 €. | Vérifié et juste : aucune modification. |
| 095 | Calcul vérifié : 25 000 ÷ 500 = 50 × 100 000 € = 5 000 000 € ; ÷ 25 000 = 200 €. | Vérifié et juste : aucune modification. |
| 097 | Calcul vérifié : 1 000 × 20 € = 20 000 € ; ÷ 2 000 € = 10 sinistres. | Vérifié et juste : aucune modification. |
| 098 | Calcul vérifié : 6 000 ÷ 10 = 600 × 300 € = 180 000 € ; ÷ 6 000 = 30 €. | Vérifié et juste : aucune modification. |
| 102 | Calcul vérifié : 100 sinistres × 2 000 € = 200 000 € ; prime = 20 € (et non 200 €). | Vérifié et juste : aucune modification. |
| 107 | Calcul : 200 000 ÷ 10 000 = 20. Variantes à accepter : ["20", "20 €", "20€", "20 euros"] | Variantes vérifiées : la plupart étaient déjà acceptées (le relecteur ne voit pas la liste) ; les manquantes ont été ajoutées, à la main ou par l’enrichissement automatique des réponses numériques. |
| 108 | Calcul : 500 × 4 000 = 2 000 000 ; ÷ 50 000 = 40. Variantes à accepter : ["40", "40 €", "40€", "40 euros"] | Variantes vérifiées : la plupart étaient déjà acceptées (le relecteur ne voit pas la liste) ; les manquantes ont été ajoutées, à la main ou par l’enrichissement automatique des réponses numériques. |
| 109 | Calcul : 12 000 ÷ 100 = 120 sinistres × 1 000 € = 120 000 € ; ÷ 12 000 = 10 € + 2 € de frais = 12. Variantes à accepter : ["12", "12 €", "12€", "12 euros"]. Risque : un élève qui oublie les frais tape 10 (refusé à juste titre). | Variantes vérifiées : la plupart étaient déjà acceptées (le relecteur ne voit pas la liste) ; les manquantes ont été ajoutées, à la main ou par l’enrichissement automatique des réponses numériques. |
| 110 | Calcul : 100 vols × 4 000 € = 400 000 € ; ÷ 10 000 = 40. Variantes à accepter : ["40", "40 €", "40€", "40 euros"] | Variantes vérifiées : la plupart étaient déjà acceptées (le relecteur ne voit pas la liste) ; les manquantes ont été ajoutées, à la main ou par l’enrichissement automatique des réponses numériques. |
| 111 | Variantes à accepter : ["grands nombres", "des grands nombres", "loi des grands nombres", "la loi des grands nombres", "grand nombre", "grands nombre"] | Variantes vérifiées : la plupart étaient déjà acceptées (le relecteur ne voit pas la liste) ; les manquantes ont été ajoutées, à la main ou par l’enrichissement automatique des réponses numériques. |
| 123 | Fond (mineur) : l'assurance chômage est gérée par l'Unédic, organisme paritaire (partenaires sociaux) sous fort encadrement de l'État ; son classement parmi les « pouvoirs publics » suit le cours, acceptable en 1re. | Gardée : l'assurance chômage est gérée par les partenaires sociaux sous le contrôle de l'État ; le cours le précise désormais tout en la rangeant parmi les dispositifs publics de protection. |
| 128 | Variantes à accepter : ["adverse", "sélection adverse", "la sélection adverse", "selection adverse", "antisélection", "anti-sélection"] | Variantes vérifiées : la plupart étaient déjà acceptées (le relecteur ne voit pas la liste) ; les manquantes ont été ajoutées, à la main ou par l’enrichissement automatique des réponses numériques. |
| 132 | Fond (mineur) : le minimum vieillesse (ASPA) est une allocation différentielle (complément jusqu'à un plafond) plutôt que strictement forfaitaire ; la réponse reste sans ambiguïté. | Corrigée, ainsi que le cours : le minimum vieillesse (ASPA) complète les revenus jusqu'à un minimum (allocation différentielle) ; « forfaitaire » retiré de l'énoncé et de l'explication. Deux autres questions qui qualifiaient les prestations d'assistance de « forfaitaires » ont été reformulées de la même façon. |
| 142 | Fond : exact (ordonnances d'octobre 1945). | Vérifié et juste : aucune modification. |
| 146 | Fond : réponse juste (pas de condition de cotisation), mais noter que depuis 2015 le montant des allocations familiales est modulé selon les revenus et qu'elles supposent au moins 2 enfants. | Explication complétée (à partir du deuxième enfant, montant modulé selon les revenus depuis 2015) ; le cours est précisé. |
| 148 | Variantes à accepter : ["impôts", "les impôts", "des impôts", "l'impôt", "impôt", "par les impôts", "par l'impôt", "impots", "les impots", "la fiscalité"] | Variantes vérifiées : la plupart étaient déjà acceptées (le relecteur ne voit pas la liste) ; les manquantes ont été ajoutées, à la main ou par l’enrichissement automatique des réponses numériques. |
| 149 | Variantes à accepter : ["collective", "solidarité collective", "la solidarité collective", "une solidarité collective"]. Risque : « nationale » refusé, ce qui est cohérent avec le cours. | Variantes vérifiées : la plupart étaient déjà acceptées (le relecteur ne voit pas la liste) ; les manquantes ont été ajoutées, à la main ou par l’enrichissement automatique des réponses numériques. |
| 150 | Variantes à accepter : ["contributives", "contributive", "prestations contributives", "des prestations contributives"] | Variantes vérifiées : la plupart étaient déjà acceptées (le relecteur ne voit pas la liste) ; les manquantes ont été ajoutées, à la main ou par l’enrichissement automatique des réponses numériques. |

Enrichissement automatique (appliqué à toutes les réponses courtes numériques) : pour un nombre seul, le convertisseur ajoute les formes avec espace des milliers, avec « % » si l'énoncé parle de pourcentage, avec « € » s'il parle d'euros, et les signes moins « - », « − » et « - » suivi d'une espace pour un nombre négatif. La virgule et le point décimaux sont déjà acceptés par la base pour un nombre seul.

## Bilan

- 150 questions : 75 `qcm_unique`, 30 `qcm_multiple`, 30 `vrai_faux` (15 vrais), 15 `reponse_courte` ; difficultés 60 / 60 / 30.
- `verifierBanque` : conforme.
- Statut : **150 validées**, aucune laissée « à relire ».

## Points de doute

Le cours a été précisé sur quatre points signalés par le relecteur : la Sécurité sociale créée en 1945 et étendue progressivement (et non « généralisée » dès 1945) ; les prestations d'assistance calculées selon les besoins (et non « forfaitaires ») ; les allocations familiales (dès le deuxième enfant, montant modulé selon les revenus) ; l'assurance chômage gérée par les partenaires sociaux. Trois questions vont un peu au-delà de la lettre du cours, d'après la rédactrice : la ceinture de sécurité réduit surtout la gravité des accidents ; « un assureur privé peut refuser de couvrir un risque trop élevé » reformule « laisse de côté » ; un étudiant non salarié remboursé de ses soins relève de la protection universelle. Elles restent justes.
