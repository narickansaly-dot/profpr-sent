# Validation : mathématiques (tronc commun, 1re), chapitre 5

Chapitre : « Probabilités conditionnelles et indépendance » (8 sections). Banque : `banques/maths-tc-ch5.json`, relecture : `banques/maths-tc-ch5-relecture.md`.

## Contrôles automatiques

- `verifierBanque` (règles 1 à 15 du guide, préfixe `maths-tc`, 150 questions) : Banque du chapitre 5 conforme : 150 questions.
- `analyserImport` du cours complet : valide ; `nettoyerHtml` : rien n'est retiré ; import à blanc (`versDonneesCours`) : charge utile construite (voir `maths-tc-bilan.md`).
- Ligne du contrôle du cours : `ch5 Probabilités conditionnelles : 8 sections, 150 questions {"valide":150}`

## Répartition

| Élément | Valeur |
| --- | --- |
| Types | 75 `qcm_unique`, 30 `qcm_multiple`, 30 `vrai_faux` (15 vrais, 15 faux), 15 `reponse_courte` |
| Difficultés | 60 (1), 61 (2), 29 (3) |
| Notions | Automatismes (20), Rappels de probabilités (16), Probabilité conditionnelle (20), Tableau croisé d'effectifs (22), Arbre pondéré (20), Probabilités totales (16), Tests de dépistage (16), Indépendance (20) |
| Réponses courtes avec marge | 0 |

## Relecture indépendante

- Résolution à l'aveugle par un relecteur distinct de l'auteur, calculs refaits par script, comparaison automatique : 150 concordances sur 150 au premier passage.
- Questions corrigées après relecture : 1 (132) ; détail dans le rapport de relecture.

## Statuts appliqués

- `valide` : 150 (questions relues, sans doute restant) ; `a_relire` : 0.
- Règle suivie : comme pour BPH et STSS (commits 67d1671 et 90bd11c), une question relue et tranchée passe en `valide` ; seules les questions encore douteuses restent `a_relire`.
