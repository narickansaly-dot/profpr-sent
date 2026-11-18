# Relecture de la banque du chapitre 2 de SES (1re) : marchés imparfaitement concurrentiels

## Méthode

Relecture **indépendante et à l'aveugle** par un sous-agent : texte du chapitre et 150 questions **sans réponses ni explications**. Il a résolu chaque question, refait les calculs (tableau du monopole, surplus 128 / 32 / 64, perte sèche 32, profits du dilemme du prisonnier) et vérifié les faits cités (amende Google de 2017 : 2,42 Md€ ; 534 M€ en 2005 pour les trois opérateurs mobiles ; brevet de 20 ans ; plafond de 10 % du chiffre d'affaires mondial). Comparaison automatique ensuite (`comparer.py`).

Résultat : **150 réponses identiques sur 150**, 0 écart, 15 remarques.

## Corrections faites

| Source | Problème signalé | Correction |
|---|---|---|
| 069 et cours | En 2005, la sanction a été prononcée par le **Conseil de la concurrence**, devenu Autorité de la concurrence en 2009 ; le cours laissait croire à l'Autorité. | Cours et explication précisés. |
| 065 | Énoncé « Que prévoit le droit… ? » suivi de propositions Oui/Non. | Énoncé : « Une entreprise enfreint-elle le droit de la concurrence par le seul fait d'occuper une position dominante ? ». |
| 054 | Distracteur « A élevé, B bas » un peu défendable (les acheteurs peuvent aller chez B). | Énoncé « pour l'ensemble des consommateurs » ; distracteur remplacé. |
| 027, 081 | Distracteur « monopole d'oligopole » artificiel. | Remplacé par « Concurrentiel » / « Le monopole concurrentiel ». |
| 136 | Calcul en triangle sans dire que la demande est une droite. | « (une droite) » ajouté ; variantes « 200 € ». |
| 132, 133, 135 | Variantes de réponse courte. | « brevet d'invention », « 12 € », « 100 000 », « 100000 € » ajoutées. |

Remarques sans changement : 131, 139, 140, 141, 144, 145 demandaient des variantes déjà acceptées (« entente » et « cartel » sont tous deux acceptés en 140). Le sigle « AdlC » (141) n'est pas ajouté : il n'est pas utilisé dans le cours.

Avant la relecture, le contrôle automatique avait conduit à reformuler 6 énoncés trop proches, à allonger 21 distracteurs (biais de longueur de 56 % ramené à 29 %) et à ajouter 5 questions faciles.

## Bilan

- 150 questions : 75 `qcm_unique`, 30 `qcm_multiple`, 30 `vrai_faux` (15 vrais), 15 `reponse_courte` ; difficultés 57 / 61 / 32.
- `verifierBanque` : conforme. Statut : **150 validées**.

## Points de doute

Aucun. Les deux exemples réels (Orange-SFR-Bouygues 2005, Google 2017) sont datés et vérifiés.
