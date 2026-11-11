# Relecture de la banque du chapitre 4 d'histoire-géographie (2de)

Banque : `histoire-geo-ch4.json`, 150 questions au statut `a_relire` après fusion. Chapitre : « Renaissance, humanisme et réformes religieuses : les mutations de l'Europe ».

## Méthode

- Questions rédigées à partir du seul texte du chapitre 4, puis relues une à une contre ce texte.
- Contrôles automatiques : `verifierBanque` (quotas de 150 questions) ; présence de chaque réponse courte dans le texte du chapitre.
- Corrections faites pendant la relecture :
  - deux réponses courtes qui doublaient des QCM (incunables, 1517), remplacées par des questions sur la traduction de la Bible en allemand et sur Wittenberg ;
  - neuf QCM dont la bonne réponse était la plus longue (biais ramené de 43 % à 33 %) ;
  - une difficulté rééquilibrée.
- **Correction du cours** : le concile de Trente ne se réunit pas « en Italie » au sens du XVIe siècle (Trente est alors une principauté épiscopale du Saint-Empire). Le cours dit maintenant « à Trente, une ville des Alpes, aujourd'hui en Italie ». La question 116 a été alignée.

## Points de doute (à trancher par l'enseignant)

| Source | Doute | Proposition |
| --- | --- | --- |
| ch4:banque:022 | Luther « rédige » ses 95 thèses le 31 octobre 1517. L'affichage sur la porte de l'église de Wittenberg est discuté par les historiens : le cours et la banque ne l'évoquent pas. | Garder. |
| ch4:banque:032, 099 | « Plus de 250 villes » ont un atelier d'imprimeur vers 1500 : ordre de grandeur courant (250 à 280 selon les sources). | Garder. |
| ch4:banque:009 | Date de naissance d'Érasme (vers 1466-1469, discutée) : la question ne porte que sur le lieu. | Garder. |
| ch4:banque:026 | Le nom de « protestants » vient de la protestation des princes luthériens à la diète de Spire (1529) : le cours ne donne que la date. | Garder. |
| Questions sur Copernic | Copernic est cité ici (1543) et au chapitre 7 (Galilée) : les banques des deux chapitres posent des questions voisines. | Vérifier qu'elles ne tombent pas dans la même évaluation. |

## Reprise du 11 novembre 2026

Un contrôle supplémentaire a été ajouté : la similarité entre l'énoncé de chaque réponse courte et celui des autres questions (seuil 0,5, ou 0,35 si la réponse est la même). Il a conduit aux corrections suivantes : quatre réponses courtes qui posaient la même question qu'un QCM (Gutenberg, Genève, Trente, perspective), remplacées. Trois énoncés de QCM ont été dépouillés de leur date. Le vrai/faux 124 (traduction de Luther) a été inversé, car il donnait la réponse d'une réponse courte.

## Contrôles

- `verifierBanque` : conforme, 150 questions.
- Réponses courtes : toutes présentes dans le texte du chapitre.
