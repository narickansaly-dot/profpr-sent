# Validation : mathématiques (tronc commun, 1re), chapitre 8

Chapitre : « Modélisation quadratique » (8 sections). Banque : `banques/maths-tc-ch8.json`, relecture : `banques/maths-tc-ch8-relecture.md`.

## Contrôles automatiques

- `verifierBanque` (règles 1 à 15 du guide, préfixe `maths-tc`, 150 questions) : Banque du chapitre 8 conforme : 150 questions.
- `analyserImport` du cours complet : valide ; `nettoyerHtml` : rien n'est retiré ; import à blanc (`versDonneesCours`) : charge utile construite (voir `maths-tc-bilan.md`).
- Ligne du contrôle du cours : `ch8 Second degré : 8 sections, 150 questions {"valide":150}`

## Répartition

| Élément | Valeur |
| --- | --- |
| Types | 75 `qcm_unique`, 30 `qcm_multiple`, 30 `vrai_faux` (15 vrais, 15 faux), 15 `reponse_courte` |
| Difficultés | 60 (1), 60 (2), 30 (3) |
| Notions | Paraboles y = ax² et y = ax² + c (17), Automatismes (22), Forme factorisée et racines (16), Axe de symétrie et sommet (23), Associer courbe et expression (15), Signe d'un polynôme factorisé (13), Variations et extremum (18), Modélisation quadratique (26) |
| Réponses courtes avec marge | 0 |

## Relecture indépendante

- Résolution à l'aveugle par un relecteur distinct de l'auteur, calculs refaits par script, comparaison automatique : 147 concordances sur 150 au premier passage ; les 3 écarts (088, 089, 090) sont des erreurs de report du relecteur, revérifiées par la session principale : la banque est juste.
- Questions corrigées après relecture : 1 (132) ; détail dans le rapport de relecture.

## Statuts appliqués

- `valide` : 150 (questions relues, sans doute restant) ; `a_relire` : 0.
- Règle suivie : comme pour BPH et STSS (commits 67d1671 et 90bd11c), une question relue et tranchée passe en `valide` ; seules les questions encore douteuses restent `a_relire`.
