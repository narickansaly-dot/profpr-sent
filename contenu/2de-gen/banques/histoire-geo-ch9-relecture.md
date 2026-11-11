# Relecture de la banque du chapitre 9 d'histoire-géographie (2de)

Banque : `histoire-geo-ch9.json`, 150 questions au statut `a_relire` après fusion. Chapitre : « Sociétés et environnements : risques et ressources sous pression ».

## Méthode

- Questions rédigées à partir du seul texte du chapitre 9, puis relues une à une contre ce texte.
- Les faits demandés en réponse courte ont été choisis avant la rédaction des QCM, pour éviter les doublons.
- Contrôles automatiques :
  - `verifierBanque` (quotas de 150 questions) ;
  - présence de chaque réponse courte dans le texte du chapitre ;
  - similarité entre les réponses courtes et les autres énoncés.
- Corrections faites pendant la relecture :
  - une question manquante ajoutée ;
  - vingt et un QCM dont la bonne réponse était la plus longue : le biais passe de 59 % à 33 % ;
  - les variantes « 80 % » et « 70 % » ont été ajoutées aux réponses courtes chiffrées ;
  - un énoncé trop proche d'une réponse courte (définition du développement durable) a été reformulé.

## Points de doute (à trancher par l'enseignant)

| Sujet | Doute | Proposition |
| --- | --- | --- |
| Haïti, 2010 | « Plus de 200 000 morts » : les estimations vont de 100 000 à plus de 300 000 selon les sources. | Garder la formulation prudente du cours. |
| Japon, 2011 | « Environ 18 000 morts et disparus ». | Garder. |
| Hausse des températures | « Plus de 1 °C » depuis la fin du XIXe siècle : la moyenne de la dernière décennie est d'environ 1,2 °C. L'année 2024 a dépassé 1,5 °C. | Garder « plus de 1 °C » ; à actualiser. |
| Accès à l'eau potable | « Plus de 2 milliards » de personnes sans eau potable sûre (OMS-UNICEF : 2,2 milliards en 2022, environ 2,1 milliards en 2024). | Garder. |
| Arctique | Réchauffement « trois à quatre fois plus rapide » que la moyenne : fourchette des études récentes. | Garder. |
| Énergies fossiles et eau | « Environ 80 % » de l'énergie mondiale ; répartition de l'eau en 70 / 20 / 10 % : ordres de grandeur. | Garder, en ne demandant que des ordres de grandeur. |
| Réponses courtes chiffrées | « 2022 », « 80 », « 70 » : questions de mémoire sur des chiffres. | Garder ou rejeter selon le niveau d'exigence. |

## Contrôles

- `verifierBanque` : conforme, 150 questions.
- Réponses courtes : toutes présentes dans le texte du chapitre.
