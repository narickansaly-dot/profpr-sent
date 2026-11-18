# Validation : HLP 1re, chapitre 1

Chapitre : « L'art de la parole : naissance et règles de la rhétorique ». Contrôles automatiques du 17/11/2026, après relecture indépendante à l'aveugle et corrections.

## Commandes

Les scripts du dépôt (`banque:verifier`, `banque:fusionner`, `banque:texte`) ne connaissent que `bph` et `stss`. Les contrôles ont été lancés avec un outil hors dépôt qui appelle **les mêmes fonctions** (`verifierBanque` avec `{ prefixe: 'hlp', total: 150 }`, `fusionnerBanque`, `analyserImport`, `nettoyerHtml`, `versDonneesCours`) sur `contenu/1re-gen/`.

## Résultats

- Banque (`banques/hlp-ch1.json`) : **conforme** ; sortie : « Banque du chapitre 1 conforme : 150 questions. »
- Cours (`hlp.json`, validateur d'import) : **valide** ; ch1 L'art de la parole : 8 sections, 150 questions {"valide":150}
- Nettoyage HTML : rien n'est retiré (seul ajout : `tabindex` sur les tableaux).
- Import à blanc : `versDonneesCours` produit les données de `importer_cours` sans erreur. L'import réel en base n'a pas été lancé (base Supabase locale non démarrée).
- Relecture : voir `banques/hlp-ch1-relecture.md` (relecture de rédaction, relecture indépendante à l'aveugle, corrections).
- Statuts dans le cours : {'valide': 150} (aucune question laissée à relire)

## Répartition

| Contrôle | Valeur | Attendu |
| --- | --- | --- |
| Types | qcm_unique 75, qcm_multiple 30, vrai_faux 30, reponse_courte 15 | 75 / 30 / 30 / 15 (± 3) |
| Difficultés | 1 : 60, 2 : 61, 3 : 29 | 60 / 60 / 30 (± 3) |
| Position de la bonne réponse (qcm_unique) | 19 / 19 / 18 / 19 | 40 % au plus par position |
| Bonne réponse la plus longue (égalités comprises) | 24 sur 75 (32 %) | moins de 40 % |
| Vrai / faux | 15 vrais, 15 faux | 60 % au plus de chaque |

Questions par notion : La parole dans la cité athénienne (16), Sophistes et Isocrate (18), Platon contre la rhétorique (22), Aristote, preuves et genres (21), Rome, Cicéron et Quintilien (15), Opérations et parties du discours (17), Moyen Âge, trivium et dispute (12), L'Âge classique de l'éloquence (14), Interprétation et essai (15).
