# Relecture de la banque du chapitre 5 d'histoire-géographie (2de)

Banque : `histoire-geo-ch5.json`, 150 questions au statut `a_relire` après fusion. Chapitre : « L'affirmation de l'État dans le royaume de France ».

## Méthode

- Questions rédigées à partir du seul texte du chapitre 5, puis relues une à une contre ce texte.
- Contrôles automatiques : `verifierBanque` (quotas de 150 questions) ; présence de chaque réponse courte dans le texte du chapitre.
- Corrections faites pendant la relecture :
  - deux réponses courtes qui doublaient des QCM (Bossuet, édit de Fontainebleau), remplacées par des questions sur le dixième et sur les dragonnades ;
  - deux énoncés trop proches sur les académies ;
  - dix QCM dont la bonne réponse était la plus longue (biais ramené de 45 % à 33 %) ;
  - un distracteur inventé (« Le Brun de Venise »), remplacé par Le Brun, peintre de Versailles.

## Points de doute (à trancher par l'enseignant)

| Source | Doute | Proposition |
| --- | --- | --- |
| ch5:banque:035 | L'armée de Louis XIV « dépasse 300 000 hommes » en temps de guerre : les historiens donnent 300 000 à 400 000 hommes au plus fort de la guerre de la Ligue d'Augsbourg. Les distracteurs sont éloignés (3 000, 30 000, 3 millions). | Garder. |
| Cours, tableau des territoires | La Lorraine (1766) est présentée comme un « héritage » : elle revient à la France à la mort de Stanislas Leszczynski, en application du traité de Vienne (1738). Aucune question ne porte sur ce mode d'acquisition. | Préciser le cours si l'enseignant le souhaite. |
| ch5:banque:116 | Le château de Versailles était d'abord un pavillon de chasse de Louis XIII : fait exact, mais secondaire. | Garder ou rejeter. |
| ch5:banque:117 | Louis XIV limite le droit de remontrance en 1673 : date exacte, mais détail fin pour une 2de. | Garder ou rejeter selon le niveau d'exigence. |
| Questions sur Villers-Cotterêts (007 à 009, 041, 042, 062, 063) | Le cours affirme que les articles sur la langue sont « toujours en vigueur » : c'est exact (articles 110 et 111), et c'est un fait souvent évoqué. | Garder. |

## Contrôles

- `verifierBanque` : conforme, 150 questions.
- Réponses courtes : toutes présentes dans le texte du chapitre.
