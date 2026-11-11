# Validation : français 2de, chapitre 6

Chapitre : « Classes, fonctions, accords et lexique ». Contrôles automatiques du 10 novembre 2026, avant relecture par l'enseignant.

## Commandes

Les scripts du dépôt (`banque:verifier`, `banque:fusionner`, `banque:texte`) ne connaissent que `bph` et `stss` et lisent `contenu/1re-st2s/`. Les contrôles ont donc été lancés avec un petit outil hors dépôt qui appelle **les mêmes fonctions** (`verifierBanque` avec la configuration `{ prefixe: 'francais', total: 150 }`, `fusionnerBanque`, `analyserImport`, `versDonneesCours`) sur `contenu/2de-gen/`.

## Résultats

- Banque (`banques/francais-ch6.json`) : **conforme** ; sortie : « Banque du chapitre 6 conforme : 150 questions. »
- Cours (`francais.json`, validateur d'import) : **valide** ; ch6 Classes, fonctions, accords et lexique : 6 sections, 150 questions {"a_relire":150}
- Import à blanc : `versDonneesCours` produit les données de `importer_cours` sans erreur. L'import réel en base n'a pas été lancé (il demande une base Supabase locale démarrée).
- Statuts dans le cours : {'a_relire': 150}

## Répartition

| Contrôle | Valeur | Attendu |
| --- | --- | --- |
| Types | qcm_unique 75, qcm_multiple 30, vrai_faux 30, reponse_courte 15 | 75 / 30 / 30 / 15 (± 3) |
| Difficultés | 1 : 58, 2 : 61, 3 : 31 | 60 / 60 / 30 (± 3) |
| Position de la bonne réponse (qcm_unique) | 19 / 19 / 19 / 18 | 40 % au plus par position |
| Bonne réponse la plus longue | 24 sur 75 (32 %) | moins de 40 % |
| Vrai / faux | 16 vrais, 14 faux | 60 % au plus de chaque |

Questions par notion : Classes grammaticales (17), Fonctions dans la phrase (21), Fonctions dans le groupe nominal (11), Accords dans le groupe nominal (10), Couleurs, nombres, demi, nu, tout (19), Accord du verbe et du sujet (16), Accord du participe passé (17), Formation des mots (14), Relations et sens des mots (17), Niveaux de langue (8).
