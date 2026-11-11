# Bilan : cours de physique-chimie, 2de générale

Cours `contenu/2de-gen/physique-chimie.json` : slug `physique-chimie-2de-gen`, filière `GEN`, niveau `2de`, matière « Physique-chimie », couleur `#c2410c` (contraste 5,18:1 avec le blanc, au-dessus de 4,5:1). Rédigé le 10 et le 11 novembre 2026 avec la méthode de STSS : programme officiel, plan, rédaction de chaque chapitre, relecture indépendante, banque de 150 questions, vérificateur, relecture de la banque contre le cours, fusion.

## Programme

- Source : arrêté du 17 janvier 2019, NOR MENE1901634A, BO spécial n° 1 du 22 janvier 2019 (annexe PDF récupérée sur le site du ministère, identique au fichier d'Éduscol).
- **Toujours en vigueur pour 2026-2027** : Éduscol (page mise à jour en mars 2026) le range sous « Programmes en vigueur » et aucun arrêté plus récent n'a été trouvé. **Aucun changement à signaler**, contrairement aux langues vivantes.
- Résumé fidèle : `programmes/physique-chimie-2de.md` (81 notions [N1 à N81], 119 capacités [C1 à C119]). Plan et table de correspondance : `programmes/physique-chimie-2de-plan.md` (81 notions sur 81 couvertes, aucun hors-programme).

## Chapitres et questions

| N° | Chapitre | Sections | Corrections à la relecture du cours | Questions | Banque : corrigées / remplacées |
| --- | --- | --- | --- | --- | --- |
| 1 | Mesure et incertitudes | 5 | 5 | 150 | 10 / 0 |
| 2 | Corps purs, mélanges et solutions aqueuses | 6 | 9 | 150 | 6 / 2 |
| 3 | De l'atome au tableau périodique | 6 | 6 | 150 | 11 / 0 |
| 4 | Ions, molécules et quantité de matière | 6 | 5 | 150 | 8 / 2 |
| 5 | Les transformations physiques | 5 | 7 | 150 | 9 / 6 |
| 6 | Les transformations chimiques | 6 | 8 | 150 | 8 / 10 |
| 7 | Les transformations nucléaires | 5 | 8 | 150 | 15 / 3 |
| 8 | Décrire un mouvement | 6 | 10 | 150 | 7 / 2 |
| 9 | Forces et principe d'inertie | 6 | 9 | 150 | 12 / 1 |
| 10 | Émission et perception d'un son | 6 | 7 | 150 | 3 / 15 |
| 11 | Vision et image | 7 | 10 | 150 | 13 / 4 |
| 12 | Signaux et capteurs | 5 | 6 | 150 | 12 / 1 |
| | **Total** | **69** | **90** | **1 800** | **114 / 46** |

Les 1 800 questions sont au statut `a_relire` : aucune n'entre dans un quiz avant la validation de l'enseignant. Chaque chapitre a 75 `qcm_unique`, 30 `qcm_multiple`, 30 `vrai_faux` et 15 `reponse_courte` (± 1), avec 60 / 60 / 30 questions de difficulté 1 / 2 / 3 (± 3). Le détail par chapitre est dans `validation/physique-chimie-chN.md`.

## Validation

| Contrôle | Résultat |
| --- | --- |
| Validateur d'import (`analyserImport`, celui de `/admin/import`) | cours valide : 12 chapitres, 1 800 questions |
| Taille du fichier | 1 529 672 octets (3 Mo au plus) |
| Couleur (`couleurCoursAcceptable`) | acceptée, 5,18:1 |
| Nettoyage HTML (`nettoyerHtml`) | rien n'est retiré, dans aucune section |
| Typographie | U+00A0 avant « : ; ! ? » et dans « », aucune entité `&nbsp;`, aucune figure |
| `verifierBanque` (17 règles, quotas de 150) | les 12 banques sont conformes |
| Fusion (`fusionnerBanque`) | 12 × 150 questions ajoutées ; rejouer la fusion n'ajoute rien |
| Import à blanc (`versDonneesCours`) | charge utile construite (1 329 107 octets), aucune base contactée |
| Réponses courtes | pas de séparateur de milliers, pas d'unité collée à un nombre |

**Import réel non fait** : le worktree n'a pas de `.env.local` et aucune base Supabase locale ne tournait. À faire : `npm run import:contenu -- contenu/2de-gen/physique-chimie.json --garder-statuts` (sans `--publier`).

## Changement de script à prévoir (non fait)

`npm run banque:texte|verifier|fusionner` n'acceptent que `--cours bph|stss` et lisent en dur `contenu/1re-st2s/banques/` (`scripts/*-banque.ts`, `src/lib/contenu/banque/cours.ts`). Il faudrait ajouter les cours de 2de à `COURS_BANQUE` (préfixe `physique-chimie-2de`, 150 questions) et dériver le dossier des banques du fichier du cours. En attendant, la validation passe par un script hors dépôt qui appelle les mêmes fonctions. Les sessions SES et SVT ont fait le même constat.

## Points à trancher par l'enseignant

1. **Plan non validé** : la méthode STSS prévoit un arrêt pour valider le plan, puis un arrêt après le chapitre 1. Ici, tout a été rédigé sans attendre. Il y a 12 chapitres (6 à 9 visés pour STSS). Regroupements possibles : 3 et 4, 5 et 7, 8 et 9.
2. **Chapitre 7 (nucléaire)** : il est mince (3 notions). Ses questions comptent des redites, et il dépasse un peu le programme : les désintégrations servent d'exemples sans être nommées, et le bilan solaire est écrit sans neutrinos.
3. **Figures** : il n'y en a aucune, comme pour STSS. Il manque des schémas de Lewis, de circuits, de rayons et de lentilles, ainsi que des chronophotographies. Le montage à reflux et la CCM ([C55]) sont décrits par des listes. C'est le premier manque à combler pour les chapitres 4, 6, 8, 9, 11 et 12.
4. **Valeurs et conventions à aligner sur le manuel** :
   - critère de compatibilité (u ou 2u) et arrondi de u vers le haut (ch. 1) ;
   - données de l'éthanol et du cyclohexane (ch. 2) ;
   - masses des nucléons (ch. 3) ;
   - signe de L et Q, et « condensation » réservée au passage gaz → solide (ch. 5) ;
   - H⁺ plutôt que H₃O⁺, et H₂O(g) dans la combustion du méthane (ch. 6) ;
   - énergies de fission et de combustion (ch. 7) ;
   - principe d'inertie « dans le référentiel terrestre », sans « galiléen » (ch. 9) ;
   - seuil de danger à 85 ou 90 dB (ch. 10) ;
   - domaine visible 400–800 nm, et grandissement en longueurs plutôt qu'en mesures algébriques (ch. 11) ;
   - pas de sigle CTN, et loi des mailles écrite avec des tensions à double indice (ch. 12).
5. **Notions limites, à garder ou à retirer** :
   - accommodation (ch. 11) ;
   - repères « × 10 donne + 10 dB » (ch. 10) ;
   - chiffres significatifs d'un quotient (ch. 1) ;
   - ions O²⁻, Al³⁺ et composés hors liste (ch. 4) ;
   - effet de la masse sur la variation de vitesse (ch. 9).
6. **Banques** : tous les rapports de relecture signalent des **redites d'idée** (le programme de 2de offre peu de faits distincts pour 150 questions par chapitre) et quelques questions cotées 3 pour une lecture directe du cours, gardées pour respecter les quotas. La liste précise est dans chaque `banques/physique-chimie-chN-relecture.md`, section « Points de doute pour l'enseignant ».
7. **Longueur** : les chapitres 2 et 6 dépassent un peu la cible de 22 000 caractères (22 650 et 22 264). Ce n'est pas une limite technique.

## Fichiers

- `contenu/2de-gen/programmes/physique-chimie-2de.md`, `physique-chimie-2de-plan.md`
- `contenu/2de-gen/physique-chimie.json` (cours et 1 800 questions)
- `contenu/2de-gen/banques/physique-chimie-chN.json`, `-relecture.md`, `-cours-relecture.md` (N = 1 à 12)
- `contenu/2de-gen/validation/physique-chimie.md` (ce bilan) et `physique-chimie-chN.md`
