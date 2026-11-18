# Validation LLCER anglais, chapitre 6 : « Confronting difference »

Rapport des contrôles du 12 novembre 2026. La relecture question par question est dans `banques/llcer-anglais-ch6-relecture.md`.

## Résultat

- **Banque** (`banques/llcer-anglais-ch6.json`) : conforme aux règles de `verifierBanque` (`src/lib/contenu/banque/verifier.ts`), configuration `{ prefixe: 'llcer-anglais', total: 150 }` : « Banque du chapitre 6 conforme : 150 questions. »
- **Relecture indépendante à l'aveugle** : concordance 150 / 150 ; remarques traitées (voir le fichier de relecture).
- **Fusion** dans `llcer-anglais.json` : 150 questions dans le chapitre, toutes issues de la banque ; une seconde fusion n'ajoute rien.
- **Statuts dans le cours** : 150 `valide`.
- **Cours** : `analyserImport` sans erreur ; 7 sections ; `nettoyerHtml` ne retire rien (il ajoute seulement `tabindex="0"` aux tableaux défilants).

## Répartitions

| Contrôle | Valeur | Attendu |
| --- | --- | --- |
| Types (qcm_unique / qcm_multiple / vrai_faux / reponse_courte) | 75 / 30 / 30 / 15 | 75 / 30 / 30 / 15 (± 3) |
| Difficultés (1 / 2 / 3) | 58 / 62 / 30 | 60 / 60 / 30 (± 3) |
| Vrai / faux | 17 vrais, 13 faux | 60 % au plus de chaque |
| Position de la bonne réponse (qcm_unique, 1 à 4) | 18 / 19 / 19 / 19 | 40 % au plus par position |
| Bonne réponse la plus longue | 21 sur 75 (28 %) | moins de 40 % |
| qcm_multiple à 2 / 3 bonnes réponses | 3 / 27 | 2 ou 3, avec « Coche toutes les réponses exactes. » |
| Réponses courtes | 15 questions, 32 réponses acceptées | variantes (article, ' et ’, prénom + nom) |

## Notions (9)

| Notion | Questions |
| --- | --- |
| To Kill a Mockingbird | 26 |
| Colonial encounters | 18 |
| Divided communities | 18 |
| Clashes of values | 12 |
| Translation and mediation | 16 |
| Vocabulary of prejudice | 14 |
| Articles and uncountables | 16 |
| False friends | 16 |
| -ing forms in translation | 14 |

## Comment rejouer ces contrôles

Les scripts `banque:*` ne connaissent que `bph` et `stss` (`src/lib/contenu/banque/cours.ts`) : les contrôles ont été faits avec un banc hors dépôt qui appelle les mêmes fonctions (`verifierBanque`, `fusionnerBanque`, `analyserImport`, `nettoyerHtml`, `versDonneesCours`). Voir `llcer-anglais-bilan.md`.
