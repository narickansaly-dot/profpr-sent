# Relecture de la banque du chapitre 1 de SES (1re) : marché concurrentiel

## Méthode

Relecture **indépendante et à l'aveugle** : un sous-agent relecteur a reçu le texte du chapitre (`texteChapitre`) et les 152 questions **sans les réponses ni les explications**. Il a résolu chaque question, refait chaque calcul (excès d'offre et de demande, recettes, coûts marginaux, profits, surplus en aires de triangles), et signalé ambiguïtés, distracteurs défendables et variantes de réponse courte. Ses réponses ont ensuite été comparées automatiquement aux réponses attendues (script `comparer.py`, mêmes règles de normalisation et de marge que la base).

Résultat : **151 réponses identiques sur 152**, 1 écart, 16 remarques. Aucune erreur de calcul trouvée.

## Écart

| Source | Écart | Décision |
|---|---|---|
| 136 (vrai/faux) | Le relecteur a répondu « vrai » à « Dire que l'équilibre concurrentiel est efficace signifie qu'il répartit les richesses de façon juste ». | Réponse attendue maintenue (**faux**) : le cours l'écrit en toutes lettres (encadré « Attention » : « Efficace ne veut pas dire juste »). Écart attribué à une erreur de saisie du relecteur, qui n'a fait aucune remarque sur cette question. |

## Corrections faites

| Source | Problème signalé | Correction |
|---|---|---|
| 061, 063, 064, 148 | Égalité de profit dans le tableau du cours (au prix 10, 3 et 4 unités donnent le même profit ; idem aux prix 12, 8, 6) : deux propositions défendables si l'on demande « le profit maximal ». | Énoncés reformulés : la quantité est demandée « selon la règle du cours (coût marginal égal au prix) ». Le cours précise désormais la convention (le profit est le même avec une unité de moins ; on retient la quantité où coût marginal = prix). |
| 099 | « A intérêt à produire » la 4e unité, qui ne rapporte rien de plus. | Énoncé : « quelles unités produit-il, s'il suit la règle du cours ? » ; explication précisée. |
| 146 | Unité absente (tableau en centaines d'euros) : « 200 » défendable. | « en centaines d'euros » ajouté. |
| 032 | « Prix fixé à 5 € » lisible comme un prix réglementé. | « Supposons que le prix soit momentanément de 5 € ». |
| 036 | « La demande » au lieu de « la quantité demandée ». | Corrigé. |
| 010 | Distracteur « monopsone d'acheteurs » (pléonasme, hors cours). | Remplacé par « Un marché atomistique ». |
| 133 | Vrai seulement avec un coût marginal croissant. | Condition ajoutée. |
| 151, 152 | Calcul en triangle sans dire que les courbes sont des droites. | « (représentée par une droite) » ajouté ; variantes « 400 € », « 150 € ». |
| 138, 143, 144 | Variantes de réponse courte. | Ajoutées (« monopoles », « 5,50 € », « 6 000 », « 6000 € »…). La consigne « sans espace » reste dans l'énoncé de la 144. |
| toutes les qcm_unique | Bonne réponse placée en position n mod 4 : motif devinable. | Convertisseur modifié : positions équilibrées puis mélangées au hasard (graine fixe). Répartition finale 20 / 19 / 19 / 19. |

Avant la relecture, le contrôle automatique avait aussi conduit à reformuler 8 énoncés trop proches (similarité > 0,8) et 4 distracteurs (biais de longueur).

## Bilan

- 152 questions : 77 `qcm_unique`, 30 `qcm_multiple`, 30 `vrai_faux` (14 vrais, 16 faux), 15 `reponse_courte` ; difficultés 62 / 60 / 30.
- `verifierBanque` : conforme.
- Statut : **152 validées**, aucune laissée « à relire ».

## Points de doute

Aucun point bloquant. Données chiffrées toutes fictives et internes au cours.
