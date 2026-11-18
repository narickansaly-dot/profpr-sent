# Validation : HLP 1re, chapitre 5

Chapitre : « Décrire, figurer, imaginer : représenter le monde ». Contrôles automatiques du 18/11/2026, après relecture indépendante à l'aveugle et corrections.

## Commandes

Les scripts du dépôt (`banque:verifier`, `banque:fusionner`, `banque:texte`) ne connaissent que `bph` et `stss`. Les contrôles ont été lancés avec un outil hors dépôt qui appelle **les mêmes fonctions** (`verifierBanque` avec `{ prefixe: 'hlp', total: 150 }`, `fusionnerBanque`, `analyserImport`, `nettoyerHtml`, `versDonneesCours`) sur `contenu/1re-gen/`.

## Résultats

- Banque (`banques/hlp-ch5.json`) : **conforme** ; sortie : « Banque du chapitre 5 conforme : 150 questions. »
- Cours (`hlp.json`, validateur d'import) : **valide** ; ch5 Décrire, figurer, imaginer : 7 sections, 150 questions {"valide":150}
- Nettoyage HTML : rien n'est retiré (seul ajout : `tabindex` sur les tableaux).
- Import à blanc : `versDonneesCours` produit les données de `importer_cours` sans erreur. L'import réel en base n'a pas été lancé (base Supabase locale non démarrée).
- Relecture : voir `banques/hlp-ch5-relecture.md` (relecture de rédaction, relecture indépendante à l'aveugle, corrections).
- Statuts dans le cours : {'valide': 150} (aucune question laissée à relire)

## Répartition

| Contrôle | Valeur | Attendu |
| --- | --- | --- |
| Types | qcm_unique 75, qcm_multiple 30, vrai_faux 30, reponse_courte 15 | 75 / 30 / 30 / 15 (± 3) |
| Difficultés | 1 : 60, 2 : 61, 3 : 29 | 60 / 60 / 30 (± 3) |
| Position de la bonne réponse (qcm_unique) | 19 / 19 / 19 / 18 | 40 % au plus par position |
| Bonne réponse la plus longue (égalités comprises) | 22 sur 75 (29 %) | moins de 40 % |
| Vrai / faux | 15 vrais, 15 faux | 60 % au plus de chaque |

Questions par notion : Le livre imprimé et l'humanisme (18), La perspective (12), Le débat sur l'imitation (15), Inventorier le monde (17), L'idéal encyclopédique (11), Caractères et passions (16), Diderot, spectateur critique (8), Utopies et voyages imaginaires (20), Imagination et fiction (20), Interprétation et essai (13).
