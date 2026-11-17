# Validation : mathématiques (tronc commun, 1re), chapitre 7

Chapitre : « Variation linéaire : suites arithmétiques et fonctions affines » (8 sections). Banque : `banques/maths-tc-ch7.json`, relecture : `banques/maths-tc-ch7-relecture.md`.

## Contrôles automatiques

- `verifierBanque` (règles 1 à 15 du guide, préfixe `maths-tc`, 150 questions) : Banque du chapitre 7 conforme : 150 questions.
- `analyserImport` du cours complet : valide ; `nettoyerHtml` : rien n'est retiré ; import à blanc (`versDonneesCours`) : charge utile construite (voir `maths-tc-bilan.md`).
- Ligne du contrôle du cours : `ch7 Variation linéaire : 8 sections, 150 questions {"valide":150}`

## Répartition

| Élément | Valeur |
| --- | --- |
| Types | 75 `qcm_unique`, 30 `qcm_multiple`, 30 `vrai_faux` (15 vrais, 15 faux), 15 `reponse_courte` |
| Difficultés | 59 (1), 60 (2), 31 (3) |
| Notions | Notation et rang d'une suite (9), Définition d'une suite arithmétique (22), Terme de rang n (20), Sens de variation et représentation (17), Fonctions affines (22), Modélisation linéaire (19), Fonction affine par morceaux (13), Problèmes de seuil (11), Automatismes (17) |
| Réponses courtes avec marge | 0 |

## Relecture indépendante

- Résolution à l'aveugle par un relecteur distinct de l'auteur, calculs refaits par script, comparaison automatique : 150 concordances sur 150 au premier passage.
- Questions corrigées après relecture : 8 (détail dans le rapport de relecture).

## Statuts appliqués

- `valide` : 150 (questions relues, sans doute restant) ; `a_relire` : 0.
- Règle suivie : comme pour BPH et STSS (commits 67d1671 et 90bd11c), une question relue et tranchée passe en `valide` ; seules les questions encore douteuses restent `a_relire`.
