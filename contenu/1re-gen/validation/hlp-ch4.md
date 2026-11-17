# Validation : HLP 1re, chapitre 4

Chapitre : « Découverte du monde et pluralité des cultures ». Contrôles automatiques du 17/11/2026, après relecture indépendante à l'aveugle et corrections.

## Commandes

Les scripts du dépôt (`banque:verifier`, `banque:fusionner`, `banque:texte`) ne connaissent que `bph` et `stss`. Les contrôles ont été lancés avec un outil hors dépôt qui appelle **les mêmes fonctions** (`verifierBanque` avec `{ prefixe: 'hlp', total: 150 }`, `fusionnerBanque`, `analyserImport`, `nettoyerHtml`, `versDonneesCours`) sur `contenu/1re-gen/`.

## Résultats

- Banque (`banques/hlp-ch4.json`) : **conforme** ; sortie : « Banque du chapitre 4 conforme : 150 questions. »
- Cours (`hlp.json`, validateur d'import) : **valide** ; ch4 Découverte du monde : 7 sections, 150 questions {"valide":150}
- Nettoyage HTML : rien n'est retiré (seul ajout : `tabindex` sur les tableaux).
- Import à blanc : `versDonneesCours` produit les données de `importer_cours` sans erreur. L'import réel en base n'a pas été lancé (base Supabase locale non démarrée).
- Relecture : voir `banques/hlp-ch4-relecture.md` (relecture de rédaction, relecture indépendante à l'aveugle, corrections).
- Statuts dans le cours : {'valide': 150} (aucune question laissée à relire)

## Répartition

| Contrôle | Valeur | Attendu |
| --- | --- | --- |
| Types | qcm_unique 75, qcm_multiple 30, vrai_faux 30, reponse_courte 15 | 75 / 30 / 30 / 15 (± 3) |
| Difficultés | 1 : 60, 2 : 60, 3 : 30 | 60 / 60 / 30 (± 3) |
| Position de la bonne réponse (qcm_unique) | 19 / 19 / 19 / 18 | 40 % au plus par position |
| Bonne réponse la plus longue (égalités comprises) | 19 sur 75 (25 %) | moins de 40 % |
| Vrai / faux | 15 vrais, 15 faux | 60 % au plus de chaque |

Questions par notion : Grandes découvertes et conquête (18), La controverse de Valladolid (12), Montaigne et les cannibales (18), Des coches, Léry, le bon sauvage (12), Du monde clos à l'univers infini (20), Pascal et Fontenelle devant l'infini (10), Le regard étranger (19), Robinsonnades et utopies (13), Penser la diversité des mœurs (18), Interprétation et essai (10).
