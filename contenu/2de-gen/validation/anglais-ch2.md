# Validation anglais, chapitre 2 : « Living between generations »

Rapport des contrôles automatiques, établi le 10 novembre 2026. La relecture question par question est dans `banques/anglais-ch2-relecture.md` ; **aucune question n'est validée** : toutes restent `a_relire` jusqu'à la relecture de l'enseignant.

## Résultat

- **Banque** (`banques/anglais-ch2.json`) : conforme aux 14 règles de `verifierBanque` (`src/lib/contenu/banque/verifier.ts`), configuration `{ prefixe: 'anglais', total: 150 }` : « Banque du chapitre 2 conforme : 150 questions. »
- **Fusion** dans `anglais.json` : 150 questions du chapitre, toutes présentes dans la banque (identiques) ; une seconde fusion n'ajoute rien (fusion rejouable).
- **Statuts dans le cours** : 150 questions `a_relire`, aucune `valide`.
- **Cours** : `analyserImport` sans erreur ; 7 sections ; `nettoyerHtml` ne retire rien (il ajoute seulement `tabindex="0"` aux tableaux défilants, comme pour STSS).

## Répartitions

| Contrôle | Valeur | Attendu |
| --- | --- | --- |
| Types (qcm_unique / qcm_multiple / vrai_faux / reponse_courte) | 75 / 30 / 30 / 15 | 75 / 30 / 30 / 15 (± 3) |
| Difficultés (1 / 2 / 3) | 60 / 60 / 30 | 60 / 60 / 30 (± 3) |
| Vrai / faux | 16 vrais, 14 faux | 60 % au plus de chaque |
| Position de la bonne réponse (qcm_unique, 1 à 4) | 19 / 19 / 19 / 18 | 40 % au plus par position |
| Bonne réponse la plus longue | 28 sur 75 (37 %) | moins de 40 % |
| qcm_multiple à 2 / 3 bonnes réponses | 18 / 12 | 2 ou 3, avec « Coche toutes les réponses exactes. » |
| Réponses courtes | 15 questions, 24 réponses acceptées au total | variantes (contractions, ' et ’, article) |

## Notions (10)

| Notion | Questions |
| --- | --- |
| Indian diaspora | 16 |
| Housing and class | 15 |
| Climate and generations | 15 |
| Family vocabulary | 16 |
| Housing and environment words | 16 |
| Present perfect or preterite | 20 |
| For, since and ago | 15 |
| Used to and would | 13 |
| Possessives | 11 |
| Quantifiers | 13 |

## Comment rejouer ces contrôles

Les scripts `banque:*` du dépôt ne connaissent que `bph` et `stss` (`src/lib/contenu/banque/cours.ts`) et lisent `contenu/1re-st2s/banques/` : ils ne peuvent pas être lancés tels quels sur ce cours. Les contrôles ont été faits avec un banc hors dépôt qui appelle les **mêmes fonctions** (`verifierBanque`, `fusionnerBanque`, `analyserImport`, `nettoyerHtml`). Voir `anglais-bilan.md` pour le changement de script proposé.
