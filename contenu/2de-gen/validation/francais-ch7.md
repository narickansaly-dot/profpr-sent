# Validation : français 2de, chapitre 7

Chapitre : « Le verbe : temps, aspects, modes et concordance ». Contrôles automatiques du 10 novembre 2026, avant relecture par l'enseignant.

## Commandes

Les scripts du dépôt (`banque:verifier`, `banque:fusionner`, `banque:texte`) ne connaissent que `bph` et `stss` et lisent `contenu/1re-st2s/`. Les contrôles ont donc été lancés avec un petit outil hors dépôt qui appelle **les mêmes fonctions** (`verifierBanque` avec la configuration `{ prefixe: 'francais', total: 150 }`, `fusionnerBanque`, `analyserImport`, `versDonneesCours`) sur `contenu/2de-gen/`.

## Résultats

- Banque (`banques/francais-ch7.json`) : **conforme** ; sortie : « Banque du chapitre 7 conforme : 149 questions. »
- Cours (`francais.json`, validateur d'import) : **valide** ; ch7 Le verbe : temps, aspects, modes et concordance : 6 sections, 149 questions {"a_relire":149}
- Import à blanc : `versDonneesCours` produit les données de `importer_cours` sans erreur. L'import réel en base n'a pas été lancé (il demande une base Supabase locale démarrée).
- Statuts dans le cours : {'a_relire': 149}

## Répartition

| Contrôle | Valeur | Attendu |
| --- | --- | --- |
| Types | qcm_unique 74, qcm_multiple 30, vrai_faux 30, reponse_courte 15 | 75 / 30 / 30 / 15 (± 3) |
| Difficultés | 1 : 58, 2 : 61, 3 : 30 | 60 / 60 / 30 (± 3) |
| Position de la bonne réponse (qcm_unique) | 18 / 19 / 19 / 18 | 40 % au plus par position |
| Bonne réponse la plus longue | 29 sur 74 (39 %) | moins de 40 % |
| Vrai / faux | 16 vrais, 14 faux | 60 % au plus de chaque |

Questions par notion : Identifier une forme verbale (16), Valeurs du présent (15), Temps du passé (18), Futur et conditionnel (18), Aspect (17), Subjonctif et impératif (13), Modalisation (13), Concordance des temps (15), Discours indirect (12), Récit et discours (12).
