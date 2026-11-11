# Relecture de la banque du chapitre 8 d'histoire-géographie (2de)

Banque : `histoire-geo-ch8.json`, 150 questions au statut `a_relire` après fusion. Chapitre : « Tensions, mutations et crispations de la société d'ordres ».

## Méthode

- Questions rédigées à partir du seul texte du chapitre 8, puis relues une à une contre ce texte.
- Contrôles automatiques : `verifierBanque` (quotas de 150 questions) ; présence de chaque réponse courte dans le texte du chapitre.
- Corrections faites pendant la relecture :
  - **biais inverse de longueur** : à la première rédaction, la bonne réponse n'était la plus longue que dans 1 QCM sur 75. Le plus long choix était donc presque toujours faux, ce qui donnait un indice. Trente-neuf distracteurs ont été raccourcis : la bonne réponse est maintenant la plus longue dans 28 % des QCM, proche du hasard ;
  - une réponse courte qui doublait un QCM (Loyseau), réécrite ;
  - deux distracteurs trompeurs : « Bonnets rouges de 1789 » (la révolte date de 1675) et « Mme de Maintenon à la guerre ».

## Points de doute (à trancher par l'enseignant)

| Source | Doute | Proposition |
| --- | --- | --- |
| Poids des ordres (cours, tableau) | « Moins de 1 % » pour le clergé, « 1 à 2 % » pour la noblesse : estimations courantes pour 1789, discutées. Aucune question n'exige ces pourcentages, sauf les 98 % du tiers état. | Garder. |
| Famine de 1693-1694 | « Plus d'un million de morts » : les estimations sont d'environ 1,3 million. La réponse courte demande les années au format aaaa-aaaa ; une seule année (« 1693 ») serait refusée. | Ajouter « 1693 » aux réponses acceptées si l'enseignant le souhaite. |
| Paris, « environ 600 000 habitants » | Ordre de grandeur courant pour le XVIIIe siècle (550 000 à 650 000). | Garder. |
| Saint-Domingue | « Environ 500 000 esclaves » vers 1780 (environ 465 000 en 1789) : arrondi acceptable. | Garder. |
| Traite française | « Plus d'un million d'Africains déportés par des navires français » : environ 1,4 million d'embarqués selon Slave Voyages. | Garder. |
| Mme de Tencin et *De l'esprit des lois* | Elle a contribué à faire connaître l'ouvrage (achats et diffusion en 1748) ; la formulation « aide à diffuser » est prudente. | Garder. |

## Contrôles

- `verifierBanque` : conforme, 150 questions.
- Réponses courtes : toutes présentes dans le texte du chapitre.
