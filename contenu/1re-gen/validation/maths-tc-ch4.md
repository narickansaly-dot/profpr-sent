# Validation : mathématiques (tronc commun, 1re), chapitre 4

Chapitre : « Statistiques à deux caractères » (8 sections). Banque : `banques/maths-tc-ch4.json`, relecture : `banques/maths-tc-ch4-relecture.md`.

## Contrôles automatiques

- `verifierBanque` (règles 1 à 15 du guide, préfixe `maths-tc`, 150 questions) : Banque du chapitre 4 conforme : 150 questions.
- `analyserImport` du cours complet : valide ; `nettoyerHtml` : rien n'est retiré ; import à blanc (`versDonneesCours`) : charge utile construite (voir `maths-tc-bilan.md`).
- Ligne du contrôle du cours : `ch4 Statistiques : 8 sections, 150 questions {"valide":150}`

## Répartition

| Élément | Valeur |
| --- | --- |
| Types | 75 `qcm_unique`, 30 `qcm_multiple`, 30 `vrai_faux` (15 vrais, 15 faux), 15 `reponse_courte` |
| Difficultés | 60 (1), 60 (2), 30 (3) |
| Notions | Indicateurs d'une série (20), Lecture de graphiques (18), Tableau croisé et fréquences (27), Diagrammes du croisement (10), Nuage de points et point moyen (16), Ajustement affine (17), Interpolation et extrapolation (12), Corrélation et causalité (9), Automatismes (21) |
| Réponses courtes avec marge | 0 |

## Relecture indépendante

- Résolution à l'aveugle par un relecteur distinct de l'auteur, calculs refaits par script, comparaison automatique : 150 concordances sur 150 au premier passage.
- Questions corrigées après relecture : 3 (détail dans le rapport de relecture).

## Statuts appliqués

- `valide` : 150 (questions relues, sans doute restant) ; `a_relire` : 0.
- Règle suivie : comme pour BPH et STSS (commits 67d1671 et 90bd11c), une question relue et tranchée passe en `valide` ; seules les questions encore douteuses restent `a_relire`.
