# Validation : mathématiques (tronc commun, 1re), chapitre 10

Chapitre : « Fonctions exponentielles et taux moyen » (8 sections). Banque : `banques/maths-tc-ch10.json`, relecture : `banques/maths-tc-ch10-relecture.md`.

## Contrôles automatiques

- `verifierBanque` (règles 1 à 15 du guide, préfixe `maths-tc`, 150 questions) : Banque du chapitre 10 conforme : 150 questions.
- `analyserImport` du cours complet : valide ; `nettoyerHtml` : rien n'est retiré ; import à blanc (`versDonneesCours`) : charge utile construite (voir `maths-tc-bilan.md`).
- Ligne du contrôle du cours : `ch10 Exponentielles : 8 sections, 150 questions {"valide":150}`

## Répartition

| Élément | Valeur |
| --- | --- |
| Types | 75 `qcm_unique`, 30 `qcm_multiple`, 30 `vrai_faux` (15 vrais, 15 faux), 15 `reponse_courte` |
| Difficultés | 60 (1), 62 (2), 28 (3) |
| Notions | Définition de x ↦ aˣ (17), Propriétés algébriques (19), Exposant 1/n et racines (19), Variations et courbe (19), Taux d'évolution moyen (22), Fractions de période (17), Ordres de grandeur et seuil (17), Automatismes (20) |
| Réponses courtes avec marge | 0 |

## Relecture indépendante

- Résolution à l'aveugle par un relecteur distinct de l'auteur, calculs refaits par script, comparaison automatique : 150 concordances sur 150 au premier passage.
- Questions corrigées après relecture : 5 (021, 097, 100, 101, 118) ; détail dans le rapport de relecture.

## Statuts appliqués

- `valide` : 150 (questions relues, sans doute restant) ; `a_relire` : 0.
- Règle suivie : comme pour BPH et STSS (commits 67d1671 et 90bd11c), une question relue et tranchée passe en `valide` ; seules les questions encore douteuses restent `a_relire`.
