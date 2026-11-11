# Relecture de la banque du chapitre 3 d'histoire-géographie (2de)

Banque : `histoire-geo-ch3.json`, 150 questions au statut `a_relire` après fusion. Chapitre : « L'ouverture atlantique : les conséquences de la découverte du "Nouveau Monde" ».

## Méthode

- Questions rédigées à partir du seul texte du chapitre 3, puis relues une à une contre ce texte.
- Contrôles automatiques : `verifierBanque` (quotas de 150 questions) ; présence de chaque réponse courte dans le texte du chapitre.
- Corrections faites pendant la relecture :
  - deux réponses courtes en double avec des QCM (mita, traite), remplacées ;
  - deux énoncés de QCM multiples trop proches ;
  - un vrai/faux mal construit (énoncé vrai déclaré faux), réécrit ;
  - dix QCM dont la bonne réponse était la plus longue (biais ramené de 45 % à 32 %) ;
  - un distracteur anachronique mal formulé ;
  - un énoncé qui citait « le cours ».
- **Correction du cours** : le 12 octobre 1492, Colomb touche une île des **Bahamas**, pas les Antilles. Le tableau des voyages et les questions 106 et 136 ont été corrigés.

## Points de doute (à trancher par l'enseignant)

| Source | Doute | Proposition |
| --- | --- | --- |
| ch3:banque:043, 122 | Baisse de « 80 à 90 % » de la population amérindienne : ordre de grandeur courant, mais les estimations sont très discutées. La question 122 le dit. | Garder ; ne pas exiger le chiffre en évaluation. |
| ch3:banque:052 | « 180 tonnes d'or et 16 000 tonnes d'argent » (1503-1660) : chiffres classiques d'Earl J. Hamilton (1934), sans la contrebande. | Garder, ou rejeter si l'on juge le chiffre trop précis. |
| ch3:banque:074 | « Environ 12 millions d'Africains déportés » : ce chiffre compte les captifs embarqués (environ 12,5 millions selon la base Slave Voyages). Environ 10,7 millions arrivent vivants. | Garder ; préciser « embarqués » à l'oral si besoin. |
| ch3:banque:069 | Las Casas et la proposition d'importer des esclaves africains : le fait est attesté, mais il prête à débat (il l'a regretté dans son *Histoire des Indes*). | Garder. |
| ch3:banque:048, 125 | Les Lois nouvelles (1542) interdisent l'esclavage des Amérindiens et limitent l'encomienda ; leur application a été très partielle. | Garder. |
| ch3:banque:036 | « Selon une explication classique » : la question reprend une thèse que le cours nuance (question 061). | Garder les deux : elles se complètent. |

## Reprise du 11 novembre 2026

Un contrôle supplémentaire a été ajouté : la similarité entre l'énoncé de chaque réponse courte et celui des autres questions (seuil 0,5, ou 0,35 si la réponse est la même). Il a conduit aux corrections suivantes : quatre réponses courtes qui posaient la même question qu'un QCM (Potosí, Brésil, Tordesillas, Séville), remplacées. Deux énoncés de QCM ont été dépouillés de leur date.

## Contrôles

- `verifierBanque` : conforme, 150 questions.
- Réponses courtes : toutes présentes dans le texte du chapitre.
