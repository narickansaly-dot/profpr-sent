# Validation : mathématiques (tronc commun, 1re), chapitre 2

Chapitre : « Calcul algébrique, équations produit nul et signe » (8 sections). Banque : `banques/maths-tc-ch2.json`, relecture : `banques/maths-tc-ch2-relecture.md`.

## Contrôles automatiques

- `verifierBanque` (règles 1 à 15 du guide, préfixe `maths-tc`, 150 questions) : Banque du chapitre 2 conforme : 150 questions.
- `analyserImport` du cours complet : valide ; `nettoyerHtml` : rien n'est retiré ; import à blanc (`versDonneesCours`) : charge utile construite (voir `maths-tc-bilan.md`).
- Ligne du contrôle du cours : `ch2 Calcul algébrique : 8 sections, 150 questions {"valide":150}`

## Répartition

| Élément | Valeur |
| --- | --- |
| Types | 75 `qcm_unique`, 30 `qcm_multiple`, 30 `vrai_faux` (15 vrais, 15 faux), 15 `reponse_courte` |
| Difficultés | 61 (1), 60 (2), 29 (3) |
| Notions | Développer et réduire (17), Identités remarquables (17), Factoriser (18), Équations du premier degré, x² = a (16), Équation produit nul (16), Signe de ax + b, inéquations (16), Tableau de signes (16), Formules et variables (14), Automatismes (20) |
| Réponses courtes avec marge | 0 |

## Relecture indépendante

- Résolution à l'aveugle par un relecteur distinct de l'auteur, calculs refaits par script, comparaison automatique : 150 concordances sur 150 au premier passage.
- Questions corrigées après relecture : 7 (038, 066, 100, 101, 103, 104, 105) ; détail dans le rapport de relecture.

## Statuts appliqués

- `valide` : 150 (questions relues, sans doute restant) ; `a_relire` : 0.
- Règle suivie : comme pour BPH et STSS (commits 67d1671 et 90bd11c), une question relue et tranchée passe en `valide` ; seules les questions encore douteuses restent `a_relire`.
