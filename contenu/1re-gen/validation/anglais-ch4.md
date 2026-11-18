# Validation anglais LVA 1re, chapitre 4 : « Science and responsibility »

Rapport des contrôles automatiques et de la relecture indépendante (16 novembre 2026). Le détail des corrections est dans `banques/anglais-ch4-relecture.md`.

## Résultat

- **Banque** (`banques/anglais-ch4.json`) : conforme aux 14 règles de `verifierBanque` (`src/lib/contenu/banque/verifier.ts`), configuration `{ prefixe: 'anglais', total: 150 }` : « Banque du chapitre 4 conforme : 150 questions. »
- **Relecture indépendante** : un sous-agent qui n'avait pas écrit la banque a répondu aux 150 questions sans voir les réponses attendues (`masquer.py`), puis a comparé (`comparer.py`) et relu toutes les questions ; voir le rapport de relecture.
- **Fusion** dans `anglais.json` : 150 questions du chapitre, identiques à la banque relue.
- **Statuts dans le cours** : {'valide': 150} ; questions laissées `a_relire` : aucune.
- **Cours** : `analyserImport` sans erreur ; 7 sections ; `nettoyerHtml` ne retire rien (il ajoute seulement `tabindex="0"` aux tableaux défilants).

## Répartitions

| Contrôle | Valeur | Attendu |
| --- | --- | --- |
| Types (qcm_unique / qcm_multiple / vrai_faux / reponse_courte) | 75 / 30 / 30 / 15 | 75 / 30 / 30 / 15 (± 3) |
| Difficultés (1 / 2 / 3) | 60 / 60 / 30 | 60 / 60 / 30 (± 3) |
| Vrai / faux | 15 vrais, 15 faux | 60 % au plus de chaque |
| Position de la bonne réponse (qcm_unique, 1 à 4) | 19 / 19 / 19 / 18 | 40 % au plus par position |
| Bonne réponse la plus longue | 16 sur 75 (21 %) | moins de 40 % |
| qcm_multiple à 2 / 3 bonnes réponses | 22 / 8 | 2 ou 3, avec « Coche toutes les réponses exactes. » |
| Réponses courtes | 15 questions, 25 réponses acceptées | variantes (contractions, ' et ’, article, orthographes) |

## Notions (9)

| Notion | Questions |
| --- | --- |
| Who owns space? | 20 |
| Energy in Scotland | 19 |
| The quest for the perfect human | 20 |
| Space and energy vocabulary | 18 |
| Science and ethics vocabulary | 17 |
| Conditionals | 17 |
| Inversion | 11 |
| Modals of probability | 14 |
| Linking words | 14 |

## Comment rejouer ces contrôles

Les scripts `banque:*` du dépôt ne connaissent que `bph` et `stss` (`src/lib/contenu/banque/cours.ts`) et lisent `contenu/1re-st2s/banques/` : ils ne s'appliquent pas tels quels à ce cours. Les contrôles ont été faits avec un banc hors dépôt qui appelle les **mêmes fonctions** (`verifierBanque`, `fusionnerBanque`, `analyserImport`, `nettoyerHtml`). Voir `anglais-bilan.md`.
