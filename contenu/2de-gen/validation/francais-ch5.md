# Validation : français 2de, chapitre 5

Chapitre : « Le théâtre du XVIIe au XXIe siècle ». Contrôles automatiques du 10 novembre 2026, avant relecture par l'enseignant.

## Commandes

Les scripts du dépôt (`banque:verifier`, `banque:fusionner`, `banque:texte`) ne connaissent que `bph` et `stss` et lisent `contenu/1re-st2s/`. Les contrôles ont donc été lancés avec un petit outil hors dépôt qui appelle **les mêmes fonctions** (`verifierBanque` avec la configuration `{ prefixe: 'francais', total: 150 }`, `fusionnerBanque`, `analyserImport`, `versDonneesCours`) sur `contenu/2de-gen/`.

## Résultats

- Banque (`banques/francais-ch5.json`) : **conforme** ; sortie : « Banque du chapitre 5 conforme : 148 questions. »
- Cours (`francais.json`, validateur d'import) : **valide** ; ch5 Le théâtre du XVIIe au XXIe siècle : 6 sections, 148 questions {"a_relire":148}
- Import à blanc : `versDonneesCours` produit les données de `importer_cours` sans erreur. L'import réel en base n'a pas été lancé (il demande une base Supabase locale démarrée).
- Statuts dans le cours : {'a_relire': 148}

## Répartition

| Contrôle | Valeur | Attendu |
| --- | --- | --- |
| Types | qcm_unique 72, qcm_multiple 31, vrai_faux 30, reponse_courte 15 | 75 / 30 / 30 / 15 (± 3) |
| Difficultés | 1 : 61, 2 : 60, 3 : 27 | 60 / 60 / 30 (± 3) |
| Position de la bonne réponse (qcm_unique) | 18 / 18 / 18 / 18 | 40 % au plus par position |
| Bonne réponse la plus longue | 27 sur 72 (38 %) | moins de 40 % |
| Vrai / faux | 16 vrais, 14 faux | 60 % au plus de chaque |

Questions par notion : Double énonciation et didascalies (13), Formes de la parole (15), Construction de l'action (16), Règles classiques (15), Tragédie (17), Comédie et comique (16), Théâtre du XVIIIe siècle (11), Drame romantique et XIXe siècle (14), Mythes et théâtre de l'absurde (13), Théâtre contemporain (5), Mise en scène (13).
