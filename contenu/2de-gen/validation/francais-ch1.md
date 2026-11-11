# Validation : français 2de, chapitre 1

Chapitre : « La poésie du Moyen Âge au XVIIIe siècle ». Contrôles automatiques du 10 novembre 2026, avant relecture par l'enseignant.

## Commandes

Les scripts du dépôt (`banque:verifier`, `banque:fusionner`, `banque:texte`) ne connaissent que `bph` et `stss` et lisent `contenu/1re-st2s/`. Les contrôles ont donc été lancés avec un petit outil hors dépôt qui appelle **les mêmes fonctions** (`verifierBanque` avec la configuration `{ prefixe: 'francais', total: 150 }`, `fusionnerBanque`, `analyserImport`, `versDonneesCours`) sur `contenu/2de-gen/`.

## Résultats

- Banque (`banques/francais-ch1.json`) : **conforme** ; sortie : « Banque du chapitre 1 conforme : 150 questions. »
- Cours (`francais.json`, validateur d'import) : **valide** ; ch1 La poésie du Moyen Âge au XVIIIe siècle : 6 sections, 150 questions {"a_relire":150}
- Import à blanc : `versDonneesCours` produit les données de `importer_cours` sans erreur. L'import réel en base n'a pas été lancé (il demande une base Supabase locale démarrée).
- Statuts dans le cours : {'a_relire': 150}

## Répartition

| Contrôle | Valeur | Attendu |
| --- | --- | --- |
| Types | qcm_unique 75, qcm_multiple 30, vrai_faux 30, reponse_courte 15 | 75 / 30 / 30 / 15 (± 3) |
| Difficultés | 1 : 59, 2 : 59, 3 : 32 | 60 / 60 / 30 (± 3) |
| Position de la bonne réponse (qcm_unique) | 19 / 19 / 19 / 18 | 40 % au plus par position |
| Bonne réponse la plus longue | 26 sur 75 (35 %) | moins de 40 % |
| Vrai / faux | 15 vrais, 15 faux | 60 % au plus de chaque |

Questions par notion : Moyen Âge et fin'amor (24), Formes fixes médiévales (11), Humanisme et école lyonnaise (16), La Pléiade (15), Ronsard, Du Bellay et carpe diem (16), Baroque (13), Préciosité (9), Classicisme (21), Poésie au XVIIIe siècle (14), Parcours, continuités, ruptures (11).
