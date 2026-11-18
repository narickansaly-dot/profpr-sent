# Validation LLCER anglais, chapitre 1 : « Creative and visionary imagination »

Rapport des contrôles du 12 novembre 2026. La relecture question par question est dans `banques/llcer-anglais-ch1-relecture.md`.

## Résultat

- **Banque** (`banques/llcer-anglais-ch1.json`) : conforme aux règles de `verifierBanque` (`src/lib/contenu/banque/verifier.ts`), configuration `{ prefixe: 'llcer-anglais', total: 150 }` : « Banque du chapitre 1 conforme : 150 questions. »
- **Relecture indépendante à l'aveugle** : concordance 150 / 150 ; remarques traitées (voir le fichier de relecture).
- **Fusion** dans `llcer-anglais.json` : 150 questions dans le chapitre, toutes issues de la banque ; une seconde fusion n'ajoute rien.
- **Statuts dans le cours** : 150 `valide`.
- **Cours** : `analyserImport` sans erreur ; 7 sections ; `nettoyerHtml` ne retire rien (il ajoute seulement `tabindex="0"` aux tableaux défilants).

## Répartitions

| Contrôle | Valeur | Attendu |
| --- | --- | --- |
| Types (qcm_unique / qcm_multiple / vrai_faux / reponse_courte) | 75 / 30 / 30 / 15 | 75 / 30 / 30 / 15 (± 3) |
| Difficultés (1 / 2 / 3) | 61 / 58 / 31 | 60 / 60 / 30 (± 3) |
| Vrai / faux | 17 vrais, 13 faux | 60 % au plus de chaque |
| Position de la bonne réponse (qcm_unique, 1 à 4) | 19 / 18 / 19 / 19 | 40 % au plus par position |
| Bonne réponse la plus longue | 27 sur 75 (36 %) | moins de 40 % |
| qcm_multiple à 2 / 3 bonnes réponses | 8 / 22 | 2 ou 3, avec « Coche toutes les réponses exactes. » |
| Réponses courtes | 15 questions, 30 réponses acceptées | variantes (article, ' et ’, prénom + nom) |

## Notions (8)

| Notion | Questions |
| --- | --- |
| Visionary poets | 20 |
| Imagined worlds | 20 |
| Science and imagination | 20 |
| 2001: A Space Odyssey | 21 |
| Image and film analysis | 19 |
| Vocabulary of imagination | 17 |
| Conditionals | 19 |
| Wishes and unreal past | 14 |

## Comment rejouer ces contrôles

Les scripts `banque:*` ne connaissent que `bph` et `stss` (`src/lib/contenu/banque/cours.ts`) : les contrôles ont été faits avec un banc hors dépôt qui appelle les mêmes fonctions (`verifierBanque`, `fusionnerBanque`, `analyserImport`, `nettoyerHtml`, `versDonneesCours`). Voir `llcer-anglais-bilan.md`.
