# Relecture de la banque du chapitre 4 de SES (1re) : financement des agents économiques

## Méthode

Relecture **indépendante et à l'aveugle** par un sous-agent relecteur : il a reçu le texte du chapitre (`texteChapitre`) et les questions **sans les réponses ni les explications**, a résolu chaque question, refait chaque calcul et vérifié les faits cités, puis signalé ambiguïtés, distracteurs défendables et variantes de réponse courte. Ses réponses ont été comparées automatiquement aux réponses attendues (`comparer.py`, mêmes règles de normalisation et de marge que la base). La banque avait été rédigée par un autre sous-agent, puis contrôlée par `verifierBanque`.

Résultat : **149 réponses identiques sur 150**, 1 écart(s), 16 remarques.

## Écarts

| Source | Écart | Décision |
|---|---|---|
| 084 | relecteur=1 attendu=[0] | Réponse attendue maintenue (180) : investissement 300, épargne brute 300 × 40 % = 120, besoin de financement 300 − 120 = 180. Le relecteur a choisi 120 (l'épargne brute), sans remarque : erreur de lecture de sa part. |

## Remarques du relecteur et décisions

| Source | Remarque | Décision |
|---|---|---|
| 008 | Variantes à accepter : "140 000", "140000 €", "140 000 €", "140000 euros" | Variantes ajoutées : liste complétée, ou enrichissement automatique des réponses numériques (« % », « € », espace des milliers, signe moins typographique). |
| 009 | Variantes à accepter : "3 000", "3000 €", "3 000 €", "3000 euros". Remarque secondaire : le cours définit l'investissement des ménages comme l'achat d'un logement ; « travaux dans son logement » sort légèrement de cette définition (acceptable en comptabilité nationale, mais on peut écrire « achat d'un logement » ou préciser « gros travaux »). | Corrigée : « apport pour l'achat d'un logement », conforme à la définition du cours ; variantes numériques ajoutées. |
| 028 | Variantes à accepter : "300 €", "300 euros", "300€" | Variantes ajoutées : liste complétée, ou enrichissement automatique des réponses numériques (« % », « € », espace des milliers, signe moins typographique). |
| 029 | Variantes à accepter : "42 000", "42000 €", "42 000 €", "42000 euros" | Variantes ajoutées : liste complétée, ou enrichissement automatique des réponses numériques (« % », « € », espace des milliers, signe moins typographique). |
| 044 | Variantes à accepter : "4 %", "4%", "4,0" | Variantes ajoutées : liste complétée, ou enrichissement automatique des réponses numériques (« % », « € », espace des milliers, signe moins typographique). |
| 045 | Variantes à accepter : "−3", "- 3", "-3 %", "-3%", "−3 %" (signe moins ASCII et Unicode). | Variantes ajoutées : liste complétée, ou enrichissement automatique des réponses numériques (« % », « € », espace des milliers, signe moins typographique). |
| 046 | Variantes à accepter : "-2.5", "−2,5", "−2.5", "- 2,5", "-2,5 %", "-2,5%", "−2,5 %" (virgule/point et signe moins ASCII/Unicode). | Variantes ajoutées : liste complétée, ou enrichissement automatique des réponses numériques (« % », « € », espace des milliers, signe moins typographique). |
| 064 | Variantes à accepter : "90 €", "90 euros", "90€" | Variantes ajoutées : liste complétée, ou enrichissement automatique des réponses numériques (« % », « € », espace des milliers, signe moins typographique). |
| 065 | Variantes à accepter : "15 %", "15%" | Variantes ajoutées : liste complétée, ou enrichissement automatique des réponses numériques (« % », « € », espace des milliers, signe moins typographique). |
| 066 | Variantes à accepter : "15 %", "15%" | Variantes ajoutées : liste complétée, ou enrichissement automatique des réponses numériques (« % », « € », espace des milliers, signe moins typographique). |
| 086 | Variantes à accepter : "350 milliers d'euros", "350 000", "350000" (si l'élève convertit en euros, à accepter ou à interdire explicitement dans l'énoncé). | Variantes « 350 milliers », « 350 milliers d'euros » ajoutées ; l'énoncé demande la réponse en milliers d'euros, « 350000 » n'est pas accepté. |
| 087 | Variantes à accepter : "80 %", "80%" | Variantes ajoutées : liste complétée, ou enrichissement automatique des réponses numériques (« % », « € », espace des milliers, signe moins typographique). |
| 088 | Variantes à accepter : "125 %", "125%" | Variantes ajoutées : liste complétée, ou enrichissement automatique des réponses numériques (« % », « € », espace des milliers, signe moins typographique). |
| 091 | Option « cotisations sociales de ses salariés » : correctement fausse selon le cours (déjà déduites avant l'EBE), mais piège réel ; l'explication doit rappeler que les cotisations font partie de la rémunération des salariés retirée de la VA. | Explication vérifiée : elle rappelle déjà que les cotisations font partie de la rémunération des salariés retirée de la valeur ajoutée avant l'EBE ; précisée. |
| 130 | Variantes à accepter : "−40", "- 40", "-40 milliards", "−40 milliards" Ne pas accepter « 40 » seul (perte du signe), ou préciser « déficit de 40 » dans le feedback. | Variantes du signe moins ajoutées ; « 40 » seul reste refusé (le solde est négatif). |
| 131 | Variantes à accepter : "+30", "+ 30", "30 milliards", "+30 milliards" | « +30 » est accepté par la comparaison numérique de la base ; « 30 milliards » non ajouté (l'énoncé demande l'unité). |

Enrichissement automatique (appliqué à toutes les réponses courtes numériques) : pour un nombre seul, le convertisseur ajoute les formes avec espace des milliers, avec « % » si l'énoncé parle de pourcentage, avec « € » s'il parle d'euros, et les signes moins « - », « − » et « - » suivi d'une espace pour un nombre négatif. La virgule et le point décimaux sont déjà acceptés par la base pour un nombre seul.

## Bilan

- 150 questions : 75 `qcm_unique`, 30 `qcm_multiple`, 30 `vrai_faux` (15 vrais), 15 `reponse_courte` ; difficultés 59 / 60 / 31.
- `verifierBanque` : conforme.
- Statut : **150 validées**, aucune laissée « à relire ».

## Points de doute

Aucun. Faits vérifiés : budget de l'État en déficit chaque année depuis 1975, TVA première recette de l'État.
