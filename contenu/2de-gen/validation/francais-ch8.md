# Validation : français 2de, chapitre 8

Chapitre : « La phrase complexe et les propositions relatives ». Contrôles automatiques du 10 novembre 2026, avant relecture par l'enseignant.

## Commandes

Les scripts du dépôt (`banque:verifier`, `banque:fusionner`, `banque:texte`) ne connaissent que `bph` et `stss` et lisent `contenu/1re-st2s/`. Les contrôles ont donc été lancés avec un petit outil hors dépôt qui appelle **les mêmes fonctions** (`verifierBanque` avec la configuration `{ prefixe: 'francais', total: 150 }`, `fusionnerBanque`, `analyserImport`, `versDonneesCours`) sur `contenu/2de-gen/`.

## Résultats

- Banque (`banques/francais-ch8.json`) : **conforme** ; sortie : « Banque du chapitre 8 conforme : 149 questions. »
- Cours (`francais.json`, validateur d'import) : **valide** ; ch8 La phrase complexe et les propositions relatives : 6 sections, 149 questions {"a_relire":149}
- Import à blanc : `versDonneesCours` produit les données de `importer_cours` sans erreur. L'import réel en base n'a pas été lancé (il demande une base Supabase locale démarrée).
- Statuts dans le cours : {'a_relire': 149}

## Répartition

| Contrôle | Valeur | Attendu |
| --- | --- | --- |
| Types | qcm_unique 74, qcm_multiple 30, vrai_faux 30, reponse_courte 15 | 75 / 30 / 30 / 15 (± 3) |
| Difficultés | 1 : 58, 2 : 59, 3 : 32 | 60 / 60 / 30 (± 3) |
| Position de la bonne réponse (qcm_unique) | 18 / 19 / 19 / 18 | 40 % au plus par position |
| Bonne réponse la plus longue | 27 sur 74 (36 %) | moins de 40 % |
| Vrai / faux | 16 vrais, 14 faux | 60 % au plus de chaque |

Questions par notion : Proposition et phrase complexe (15), Juxtaposition et coordination (16), Subordination et types (18), Rapports logiques (19), Pronoms relatifs et antécédent (15), Fonction du pronom relatif (19), Types de relatives (15), Dont, auquel, duquel (19), Relative ou complétive (13).
