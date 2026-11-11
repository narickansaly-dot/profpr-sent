# Validation : français 2de, chapitre 2

Chapitre : « Le langage poétique : vers, rimes et figures ». Contrôles automatiques du 10 novembre 2026, avant relecture par l'enseignant.

## Commandes

Les scripts du dépôt (`banque:verifier`, `banque:fusionner`, `banque:texte`) ne connaissent que `bph` et `stss` et lisent `contenu/1re-st2s/`. Les contrôles ont donc été lancés avec un petit outil hors dépôt qui appelle **les mêmes fonctions** (`verifierBanque` avec la configuration `{ prefixe: 'francais', total: 150 }`, `fusionnerBanque`, `analyserImport`, `versDonneesCours`) sur `contenu/2de-gen/`.

## Résultats

- Banque (`banques/francais-ch2.json`) : **conforme** ; sortie : « Banque du chapitre 2 conforme : 150 questions. »
- Cours (`francais.json`, validateur d'import) : **valide** ; ch2 Le langage poétique : vers, rimes et figures : 7 sections, 150 questions {"a_relire":150}
- Import à blanc : `versDonneesCours` produit les données de `importer_cours` sans erreur. L'import réel en base n'a pas été lancé (il demande une base Supabase locale démarrée).
- Statuts dans le cours : {'a_relire': 150}

## Répartition

| Contrôle | Valeur | Attendu |
| --- | --- | --- |
| Types | qcm_unique 75, qcm_multiple 30, vrai_faux 30, reponse_courte 15 | 75 / 30 / 30 / 15 (± 3) |
| Difficultés | 1 : 60, 2 : 60, 3 : 30 | 60 / 60 / 30 (± 3) |
| Position de la bonne réponse (qcm_unique) | 19 / 19 / 19 / 18 | 40 % au plus par position |
| Bonne réponse la plus longue | 27 sur 75 (36 %) | moins de 40 % |
| Vrai / faux | 16 vrais, 14 faux | 60 % au plus de chaque |

Questions par notion : Compter les syllabes (24), Les mètres (11), La rime (20), Rythme et enjambements (14), Strophes et sonnet (16), Sonorités (10), Figures d'analogie (12), Figures d'opposition (10), Insistance et atténuation (14), Figures de substitution (9), Analyser un procédé (10).
