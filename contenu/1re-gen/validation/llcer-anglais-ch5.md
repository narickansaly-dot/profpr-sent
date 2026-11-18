# Validation LLCER anglais, chapitre 5 : « The individual and the group »

Rapport des contrôles du 12 novembre 2026. La relecture question par question est dans `banques/llcer-anglais-ch5-relecture.md`.

## Résultat

- **Banque** (`banques/llcer-anglais-ch5.json`) : conforme aux règles de `verifierBanque` (`src/lib/contenu/banque/verifier.ts`), configuration `{ prefixe: 'llcer-anglais', total: 150 }` : « Banque du chapitre 5 conforme : 150 questions. »
- **Relecture indépendante à l'aveugle** : concordance 149 / 150 (clé confirmée) ; remarques traitées (voir le fichier de relecture).
- **Fusion** dans `llcer-anglais.json` : 150 questions dans le chapitre, toutes issues de la banque ; une seconde fusion n'ajoute rien.
- **Statuts dans le cours** : 150 `valide`.
- **Cours** : `analyserImport` sans erreur ; 7 sections ; `nettoyerHtml` ne retire rien (il ajoute seulement `tabindex="0"` aux tableaux défilants).

## Répartitions

| Contrôle | Valeur | Attendu |
| --- | --- | --- |
| Types (qcm_unique / qcm_multiple / vrai_faux / reponse_courte) | 75 / 30 / 30 / 15 | 75 / 30 / 30 / 15 (± 3) |
| Difficultés (1 / 2 / 3) | 60 / 61 / 29 | 60 / 60 / 30 (± 3) |
| Vrai / faux | 18 vrais, 12 faux | 60 % au plus de chaque |
| Position de la bonne réponse (qcm_unique, 1 à 4) | 19 / 19 / 19 / 18 | 40 % au plus par position |
| Bonne réponse la plus longue | 24 sur 75 (32 %) | moins de 40 % |
| qcm_multiple à 2 / 3 bonnes réponses | 4 / 26 | 2 ou 3, avec « Coche toutes les réponses exactes. » |
| Réponses courtes | 15 questions, 24 réponses acceptées | variantes (article, ' et ’, prénom + nom) |

## Notions (8)

| Notion | Questions |
| --- | --- |
| Self and society | 16 |
| Art and the crowd | 16 |
| Lord of the Flies | 24 |
| The Importance of Being Earnest | 24 |
| Drama analysis | 18 |
| Group vocabulary | 16 |
| Relative clauses | 18 |
| Reported speech | 18 |

## Comment rejouer ces contrôles

Les scripts `banque:*` ne connaissent que `bph` et `stss` (`src/lib/contenu/banque/cours.ts`) : les contrôles ont été faits avec un banc hors dépôt qui appelle les mêmes fonctions (`verifierBanque`, `fusionnerBanque`, `analyserImport`, `nettoyerHtml`, `versDonneesCours`). Voir `llcer-anglais-bilan.md`.
