# Relecture de la banque du chapitre 6 d'histoire-géographie (1re)

Banque : `histoire-geo-ch6.json`, 150 questions au statut `a_relire` après fusion. Chapitre : « La mise en œuvre du projet républicain ».

## Méthode

- Questions rédigées à partir du seul texte du chapitre 6 (7 sections), puis relues contre ce texte : chaque réponse courte figure dans le chapitre, aucun énoncé ne donne la réponse d'une autre question.
- Relecture indépendante à l'aveugle : un sous-agent a résolu les 150 questions sans voir les réponses attendues.
- Comparaison automatique de ses réponses avec les réponses attendues (écarts et remarques).
- Contrôles `verifierBanque` (quotas 75 / 30 / 30 / 15 et 60 / 60 / 30, positions, biais de longueur, espaces insécables).
- L'ordre des propositions a été mélangé après la rédaction pour casser un cycle fixe des bonnes réponses (contenu inchangé).

## Résultat de la relecture indépendante

Accord sur **150 questions sur 150** : **0 écart**, **5 remarques**.

| Source | Constat du relecteur | Décision |
| --- | --- | --- |
| ch6:banque:091 | La date de l'inscription de la devise sur les édifices n'est pas dans le chapitre, alors que l'énoncé parle du « début des années 1880 ». | **Corrigée** : l'énoncé devient « Quels symboles la IIIe République adopte-t-elle ? », sans date. |
| ch6:banque:118 | Quasi-doublon avec 037 (l'instruction morale et civique remplace l'instruction religieuse) et la proposition « catéchisme » de 089. | **Remplacée** : vrai/faux faux sur le niveau visé par les lois Ferry (école primaire, et non enseignement supérieur). |
| ch6:banque:132 | « Les églises restent propriété des communes » : formulation trop absolue (les cathédrales appartiennent à l'État). | **Corrigée** : l'énoncé porte sur ce que permet la loi de 1907 (le culte sans associations cultuelles), sans affirmation sur la propriété. |
| ch6:banque:135 | Quasi-doublon avec 074 (pourquoi les radicaux refusent le vote des femmes). | **Remplacée** : vrai/faux faux sur Hubertine Auclert (son refus de l'impôt ne lui donne pas le droit de vote). La proposition fausse voisine de 104 (« Elle obtient le vote des femmes en 1881 ») a été remplacée par « Elle fonde L'Aurore » pour éviter un recoupement. |
| ch6:banque:142 | Plusieurs formulations possibles du certificat d'études. | **Maintenue** : toutes les variantes sont déjà acceptées (avec et sans « primaires », avec et sans article, « CEP ») ; ajout de « le CEP ». |

## Corrections du texte du chapitre

Aucune après la relecture. Pendant la rédaction, le chapitre a été ramené à 7 sections et environ 13 100 caractères de HTML.

## Points de doute

| Source | Doute | Proposition |
| --- | --- | --- |
| ch6:banque:026 | « Que révèle l'adoption de l'amendement Wallon à une voix ? » : question d'interprétation (« la République s'impose de justesse »), défendable mais simplificatrice. | Garder. |
| ch6:banque:041 | « Pourquoi l'école républicaine est-elle laïque ? » : la réponse attendue (former des citoyens hors de l'influence de l'Église) relie deux passages du chapitre. | Garder. |
| ch6:banque:121 | Foule des funérailles de Hugo : « près de deux millions » est une estimation des contemporains ; l'énoncé ne demande pas de chiffre. | Garder. |
| Chapitre | Morts de la Semaine sanglante : le chapitre donne une fourchette (7 000 à 20 000) ; aucune question n'exige de chiffre. | Garder. |

## Contrôles

- `verifierBanque` : conforme, 150 questions.
- Biais de longueur : la bonne réponse est strictement la plus longue dans 22 QCM à réponse unique sur 75 (29,3 %).
- Positions des bonnes réponses des QCM à réponse unique : 19 / 19 / 19 / 18.
- Vrai/faux : 15 vrais, 15 faux.
- Réponses courtes : toutes présentes dans le texte du chapitre.
