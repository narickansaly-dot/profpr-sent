# Validation anglais LVA 1re, chapitre 2 : « Diversity and inclusion »

Rapport des contrôles automatiques et de la relecture indépendante (16 novembre 2026). Le détail des corrections est dans `banques/anglais-ch2-relecture.md`.

## Résultat

- **Banque** (`banques/anglais-ch2.json`) : conforme aux 14 règles de `verifierBanque` (`src/lib/contenu/banque/verifier.ts`), configuration `{ prefixe: 'anglais', total: 150 }` : « Banque du chapitre 2 conforme : 150 questions. »
- **Relecture indépendante** : un sous-agent qui n'avait pas écrit la banque a répondu aux 150 questions sans voir les réponses attendues (`masquer.py`), puis a comparé (`comparer.py`) et relu toutes les questions ; voir le rapport de relecture.
- **Fusion** dans `anglais.json` : 150 questions du chapitre, identiques à la banque relue.
- **Statuts dans le cours** : {'valide': 150} ; questions laissées `a_relire` : aucune.
- **Cours** : `analyserImport` sans erreur ; 7 sections ; `nettoyerHtml` ne retire rien (il ajoute seulement `tabindex="0"` aux tableaux défilants).

## Répartitions

| Contrôle | Valeur | Attendu |
| --- | --- | --- |
| Types (qcm_unique / qcm_multiple / vrai_faux / reponse_courte) | 75 / 30 / 30 / 15 | 75 / 30 / 30 / 15 (± 3) |
| Difficultés (1 / 2 / 3) | 60 / 61 / 29 | 60 / 60 / 30 (± 3) |
| Vrai / faux | 15 vrais, 15 faux | 60 % au plus de chaque |
| Position de la bonne réponse (qcm_unique, 1 à 4) | 19 / 19 / 19 / 18 | 40 % au plus par position |
| Bonne réponse la plus longue | 12 sur 75 (16 %) | moins de 40 % |
| qcm_multiple à 2 / 3 bonnes réponses | 17 / 13 | 2 ou 3, avec « Coche toutes les réponses exactes. » |
| Réponses courtes | 15 questions, 23 réponses acceptées | variantes (contractions, ' et ’, article, orthographes) |

## Notions (9)

| Notion | Questions |
| --- | --- |
| Housing and social mix | 16 |
| The US Supreme Court | 18 |
| First Peoples and politics | 16 |
| Discrimination vocabulary | 18 |
| Law and justice vocabulary | 18 |
| Passive voice | 20 |
| Relative clauses | 16 |
| Whose, who and whom | 12 |
| Want someone to do | 16 |

## Comment rejouer ces contrôles

Les scripts `banque:*` du dépôt ne connaissent que `bph` et `stss` (`src/lib/contenu/banque/cours.ts`) et lisent `contenu/1re-st2s/banques/` : ils ne s'appliquent pas tels quels à ce cours. Les contrôles ont été faits avec un banc hors dépôt qui appelle les **mêmes fonctions** (`verifierBanque`, `fusionnerBanque`, `analyserImport`, `nettoyerHtml`). Voir `anglais-bilan.md`.
