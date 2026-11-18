# Validation : mathématiques (tronc commun, 1re), chapitre 6

Chapitre : « Répétition d'épreuves indépendantes et simulation » (8 sections). Banque : `banques/maths-tc-ch6.json`, relecture : `banques/maths-tc-ch6-relecture.md`.

## Contrôles automatiques

- `verifierBanque` (règles 1 à 15 du guide, préfixe `maths-tc`, 150 questions) : Banque du chapitre 6 conforme : 150 questions.
- `analyserImport` du cours complet : valide ; `nettoyerHtml` : rien n'est retiré ; import à blanc (`versDonneesCours`) : charge utile construite (voir `maths-tc-bilan.md`).
- Ligne du contrôle du cours : `ch6 Épreuves répétées : 8 sections, 150 questions {"valide":150}`

## Répartition

| Élément | Valeur |
| --- | --- |
| Types | 75 `qcm_unique`, 30 `qcm_multiple`, 30 `vrai_faux` (15 vrais, 15 faux), 15 `reponse_courte` |
| Difficultés | 60 (1), 60 (2), 30 (3) |
| Notions | Automatismes (20), Épreuve de Bernoulli (15), Arbre et indépendance (18), Probabilité d'un chemin (18), Nombre de succès (22), Au moins un succès (18), Tirages avec ou sans remise (14), Simulation et grands nombres (15), Jeux historiques (10) |
| Réponses courtes avec marge | 0 |

## Relecture indépendante

- Résolution à l'aveugle par un relecteur distinct de l'auteur, calculs refaits par script, comparaison automatique : 150 concordances sur 150 au premier passage.
- Questions corrigées après relecture : 0 ; détail dans le rapport de relecture.

## Statuts appliqués

- `valide` : 150 (questions relues, sans doute restant) ; `a_relire` : 0.
- Règle suivie : comme pour BPH et STSS (commits 67d1671 et 90bd11c), une question relue et tranchée passe en `valide` ; seules les questions encore douteuses restent `a_relire`.
