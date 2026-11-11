# Validation anglais, chapitre 3 : « The past in the present »

Rapport des contrôles automatiques, établi le 10 novembre 2026. La relecture question par question est dans `banques/anglais-ch3-relecture.md` ; **aucune question n'est validée** : toutes restent `a_relire` jusqu'à la relecture de l'enseignant.

## Résultat

- **Banque** (`banques/anglais-ch3.json`) : conforme aux 14 règles de `verifierBanque` (`src/lib/contenu/banque/verifier.ts`), configuration `{ prefixe: 'anglais', total: 150 }` : « Banque du chapitre 3 conforme : 150 questions. »
- **Fusion** dans `anglais.json` : 150 questions du chapitre, toutes présentes dans la banque (identiques) ; une seconde fusion n'ajoute rien (fusion rejouable).
- **Statuts dans le cours** : 150 questions `a_relire`, aucune `valide`.
- **Cours** : `analyserImport` sans erreur ; 7 sections ; `nettoyerHtml` ne retire rien (il ajoute seulement `tabindex="0"` aux tableaux défilants, comme pour STSS).

## Répartitions

| Contrôle | Valeur | Attendu |
| --- | --- | --- |
| Types (qcm_unique / qcm_multiple / vrai_faux / reponse_courte) | 75 / 30 / 30 / 15 | 75 / 30 / 30 / 15 (± 3) |
| Difficultés (1 / 2 / 3) | 60 / 60 / 30 | 60 / 60 / 30 (± 3) |
| Vrai / faux | 17 vrais, 13 faux | 60 % au plus de chaque |
| Position de la bonne réponse (qcm_unique, 1 à 4) | 19 / 19 / 19 / 18 | 40 % au plus par position |
| Bonne réponse la plus longue | 22 sur 75 (29 %) | moins de 40 % |
| qcm_multiple à 2 / 3 bonnes réponses | 21 / 9 | 2 ou 3, avec « Coche toutes les réponses exactes. » |
| Réponses courtes | 15 questions, 24 réponses acceptées au total | variantes (contractions, ' et ’, article) |

## Notions (9)

| Notion | Questions |
| --- | --- |
| Aboriginal Australia | 18 |
| Reconciliation commissions | 18 |
| Monuments and memory | 15 |
| Heritage vocabulary | 16 |
| Danger and protection vocabulary | 14 |
| Preterite simple | 17 |
| Preterite be + -ing | 15 |
| Passive voice | 19 |
| Relative clauses | 18 |

## Comment rejouer ces contrôles

Les scripts `banque:*` du dépôt ne connaissent que `bph` et `stss` (`src/lib/contenu/banque/cours.ts`) et lisent `contenu/1re-st2s/banques/` : ils ne peuvent pas être lancés tels quels sur ce cours. Les contrôles ont été faits avec un banc hors dépôt qui appelle les **mêmes fonctions** (`verifierBanque`, `fusionnerBanque`, `analyserImport`, `nettoyerHtml`). Voir `anglais-bilan.md` pour le changement de script proposé.
