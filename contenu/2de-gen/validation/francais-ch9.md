# Validation : français 2de, chapitre 9

Chapitre : « Commentaire, contraction de texte et essai ». Contrôles automatiques du 10 novembre 2026, avant relecture par l'enseignant.

## Commandes

Les scripts du dépôt (`banque:verifier`, `banque:fusionner`, `banque:texte`) ne connaissent que `bph` et `stss` et lisent `contenu/1re-st2s/`. Les contrôles ont donc été lancés avec un petit outil hors dépôt qui appelle **les mêmes fonctions** (`verifierBanque` avec la configuration `{ prefixe: 'francais', total: 150 }`, `fusionnerBanque`, `analyserImport`, `versDonneesCours`) sur `contenu/2de-gen/`.

## Résultats

- Banque (`banques/francais-ch9.json`) : **conforme** ; sortie : « Banque du chapitre 9 conforme : 149 questions. »
- Cours (`francais.json`, validateur d'import) : **valide** ; ch9 Commentaire, contraction de texte et essai : 6 sections, 149 questions {"a_relire":149}
- Import à blanc : `versDonneesCours` produit les données de `importer_cours` sans erreur. L'import réel en base n'a pas été lancé (il demande une base Supabase locale démarrée).
- Statuts dans le cours : {'a_relire': 149}

## Répartition

| Contrôle | Valeur | Attendu |
| --- | --- | --- |
| Types | qcm_unique 74, qcm_multiple 30, vrai_faux 30, reponse_courte 15 | 75 / 30 / 30 / 15 (± 3) |
| Difficultés | 1 : 59, 2 : 59, 3 : 31 | 60 / 60 / 30 (± 3) |
| Position de la bonne réponse (qcm_unique) | 18 / 19 / 19 / 18 | 40 % au plus par position |
| Bonne réponse la plus longue | 28 sur 74 (38 %) | moins de 40 % |
| Vrai / faux | 17 vrais, 13 faux | 60 % au plus de chaque |

Questions par notion : Analyser un texte (12), Registres (17), Problématique (10), Introduction et conclusion (14), Développement du commentaire (16), Contraction de texte (22), Essai (16), Relations logiques (21), Nuancer une opinion (9), Explication et dissertation (12).
