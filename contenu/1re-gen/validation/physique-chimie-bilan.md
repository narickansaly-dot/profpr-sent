# Bilan : cours de physique-chimie, spécialité de première générale

Cours `contenu/1re-gen/physique-chimie.json` : slug `physique-chimie-1re-gen`, filière `GEN`, niveau `1re`, matière « Physique-chimie », titre « Physique-chimie, spécialité de première générale », couleur `#c2410c` (contraste 5,18:1 avec le blanc, au-dessus de 4,5:1). Rédigé du 11 au 17 novembre 2026 : programme officiel, plan, rédaction de chaque chapitre, banque de 150 questions par chapitre, vérificateur, relecture indépendante à l'aveugle de chaque banque, arbitrage, fusion, statuts.

## Programme suivi

- Arrêté du 17 janvier 2019, **NOR MENE1901635A**, BO spécial n° 1 du 22 janvier 2019 (annexe PDF lue sur education.gouv.fr).
- **En vigueur pour 2026-2027** : aucun arrêté de 2025 ou 2026 ne le remplace ni ne le modifie (les nouveaux textes de 2025-2026 concernent les langues vivantes et les mathématiques). La page Éduscol de physique-chimie (voie GT) renvoie toujours à ce texte.
- Résumé : `programmes/physique-chimie-1re.md` (47 notions [N1 à N47], 119 capacités [C1 à C119]). Plan et table de correspondance : `programmes/physique-chimie-1re-plan.md` (47 notions et 119 capacités couvertes, aucun hors-programme).

## Chapitres et questions

| N° | Chapitre | Sections | Figures SVG | HTML (caractères) | Questions | Relecture à l'aveugle : accords sans doute | Questions corrigées | Corrections du cours |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Mesure et incertitudes | 6 | 3 | 28 646 | 150 | 148 | 1 | 6 |
| 2 | Composition d'un système chimique | 6 | 3 | 32 642 | 150 | 150 | 0 | 1 |
| 3 | Les réactions d'oxydo-réduction | 6 | 2 | 26 447 | 150 | 150 | 0 | 2 |
| 4 | Avancement et bilan de matière | 6 | 2 | 23 902 | 150 | 148 | 3 | 0 |
| 5 | Le titrage colorimétrique | 6 | 2 | 24 056 | 150 | 148 | 1 | 1 |
| 6 | Schéma de Lewis, géométrie et polarité | 6 | 6 | 46 151 | 150 | 150 | 0 | 0 |
| 7 | Cohésion, dissolution et extraction | 6 | 4 | 44 401 | 150 | 148 | 2 | 1 |
| 8 | Structure et synthèse des espèces organiques | 7 | 4 | 60 892 | 150 | 149 | 0 | 2 |
| 9 | Combustions et énergie chimique | 6 | 2 | 25 503 | 150 | 149 | 0 | 1 |
| 10 | Interactions fondamentales et champs | 6 | 3 | 26 424 | 150 | 145 | 1 | 2 |
| 11 | Le fluide au repos | 6 | 3 | 25 609 | 150 | 148 | 0 | 1 |
| 12 | Mouvement et deuxième loi de Newton | 7 | 3 | 21 898 | 150 | 150 | 0 | 2 |
| 13 | Aspects énergétiques des phénomènes électriques | 6 | 3 | 21 739 | 150 | 150 | 0 | 1 |
| 14 | Aspects énergétiques des phénomènes mécaniques | 7 | 2 | 21 402 | 150 | 149 | 0 | 1 |
| 15 | Les ondes mécaniques | 6 | 3 | 21 572 | 150 | 149 | 0 | 0 |
| 16 | Images et couleurs | 7 | 3 | 21 480 | 150 | 149 | 0 | 1 |
| 17 | Modèles ondulatoire et particulaire de la lumière | 6 | 2 | 18 413 | 150 | 150 | 0 | 1 |
| | **Total** | **106** | **50** | | **2 550** | **2 530** | **8** | **23** |

Chaque banque compte 75 `qcm_unique`, 30 `qcm_multiple`, 30 `vrai_faux` et 15 `reponse_courte`, avec 60 / 60 / 30 questions de difficulté 1 / 2 / 3 ; bonnes réponses des `qcm_unique` réparties 19 / 19 / 19 / 18 (18 / 19 / 19 / 19 au chapitre 2) ; vrai/faux équilibrés (15 vrais sur 30, 17 au chapitre 1). Le détail par chapitre est dans `validation/physique-chimie-chN.md`, et chaque écart avec sa décision dans `banques/physique-chimie-chN-relecture.md`.

## Vérification des quiz

Pour chaque banque :

1. **Calculs de l'auteur vérifiés par script** : chaque réponse chiffrée est recalculée (et, selon le chapitre, l'ajustement des équations, les formules brutes, les comptes d'électrons et de doublets, les signes des mesures algébriques) ; zéro écart avant la relecture.
2. **Relecture indépendante à l'aveugle** : un sous-agent distinct de l'auteur a résolu les 150 questions à partir des seuls énoncés et propositions (`pc.ts aveugle N`, sans réponse ni explication) et du texte du cours sans les figures, avec ses propres calculs par script, et a signalé tout doute (ambiguïté, distracteur défendable, donnée manquante, question hors du cours, dépendance à une figure).
3. **Comparaison automatique** (`pc.ts comparer N`) puis **arbitrage** de chaque écart, consigné dans le fichier `-relecture.md`.

Résultat sur les 17 banques : 2 530 accords sans doute sur 2 550, et 20 écarts examinés :

- **4 désaccords**, tous des erreurs du relecteur après vérification (ch. 5 : 032 et 129 ; ch. 8 : 148 ; ch. 10 : 149). La 032 a tout de même été reformulée pour lever toute hésitation.
- **16 accords avec doute** : 4 ont conduit à corriger la question (ch. 1 : 146 ; ch. 4 : 061 et 150 ; ch. 10 : 120, distracteur défendable) ; 3 à compléter le cours (ch. 10 : 039, 055, 088, somme vectorielle des forces de plusieurs charges) ; les 9 autres étaient sans objet (arrondi couvert par la marge, ou proposition déjà attendue).
- En plus, 3 questions corrigées sur les doutes des auteurs ou une erreur du cours (ch. 4 : 087 ; ch. 7 : 072 et 074, solubilité du sel).

**Statuts** : suivant la pratique du dépôt pour les questions relues (commits `67d1671` et `90bd11c`, BPH et STSS), les questions retenues après relecture passent en `valide`. Les **2 550 questions sont `valide`** : aucune n'est restée réellement douteuse après arbitrage (les doutes réparables ont été corrigés). Aucune n'est `a_relire` ni `brouillon`.

## Validation technique

| Contrôle | Résultat |
| --- | --- |
| Validateur d'import (`analyserImport`, celui de `/admin/import`) | cours valide : 17 chapitres, 2 550 questions |
| Taille du fichier | 2 883 872 octets (limite 3 145 728 octets, soit 3 Mo) |
| Couleur (`couleurCoursAcceptable`) | acceptée, 5,18:1 |
| Nettoyage HTML (`nettoyerHtml`) | rien n'est retiré, dans aucune section ni « Je retiens » |
| Typographie | U+00A0 avant « : ; ! ? » et dans « », aucune entité `&nbsp;` |
| Identifiants SVG (marqueurs de flèches) | uniques dans tout le cours (préfixe `fl-chN-`) |
| `verifierBanque` (17 règles, quotas de 150) | les 17 banques sont conformes |
| Fusion (`fusionnerBanque`) | 17 × 150 questions ajoutées ; rejouer la fusion n'ajoute rien |
| Sources | 2 550 sources uniques `physique-chimie-1re:chN:banque:NNN` |
| Réponses courtes | aucun séparateur de milliers ; marges seulement sur des nombres seuls |
| Import à blanc (`versDonneesCours`) | charge utile construite (2 596 320 octets), aucune base contactée |

**Import réel non fait** : le worktree n'a pas de `.env.local` et aucune base Supabase locale ne tournait. À faire :

```bash
npm run import:contenu -- contenu/1re-gen/physique-chimie.json --garder-statuts
```

(sans `--publier` pour garder le cours en brouillon le temps de le regarder dans `/admin`, ou avec `--publier` pour le mettre en ligne).

## Changement de script à prévoir (non fait)

`npm run banque:texte|verifier|fusionner` n'acceptent que `--cours bph|stss` et lisent en dur `contenu/1re-st2s/banques/` (`src/lib/contenu/banque/cours.ts`, `scripts/*-banque.ts`). Il faudrait accepter un cours quelconque (fichier, préfixe de source, dossier des banques, total). En attendant, les contrôles sont passés par un outil hors dépôt (`pc.ts`, dans le dossier de notes partagé) qui appelle les mêmes fonctions de `src/lib/contenu`. Les sessions des autres matières ont fait le même constat.

## Points à trancher par l'enseignant

1. **Plan non validé** : 17 chapitres, rédigés sans arrêt intermédiaire. Regroupements possibles : 3 et 4, 4 et 5, 10 et 11, 16 et 17.
2. **Taille du fichier** : 2,88 Mo pour une limite de 3 Mo. Ajouter des questions ou des figures obligera à alléger ailleurs (les chapitres 6, 7 et 8 dépassent 44 000 caractères de HTML) ou à scinder le cours.
3. **Affichage de deux caractères combinants, à vérifier dans l'application** (police Nunito) : la flèche de vecteur U+20D7 (v⃗, F⃗, E⃗, dans le texte des chapitres 10, 12 et 14 ; elle a été retirée des figures SVG des chapitres suivants, car elle s'affichait en carré dans un rendu de test) et la barre de mesure algébrique U+0305 (O̅A̅, chapitre 16). Si l'affichage est mauvais, les remplacer par « vecteur v » et « mesure algébrique OA ».
4. **Conventions à aligner sur le manuel de la classe** :
   - incertitude-type de type B : u = (1 graduation)/√12 pour une lecture simple, tolérance/√3 pour la verrerie ; arrondi de u par excès, à deux chiffres quand le premier est 1 ou 2 (ch. 1) ;
   - volume molaire 24,0 L·mol⁻¹ à 20 °C (ch. 2 et 4 ; les énoncés donnent toujours la valeur) ;
   - Na⁺ dessiné sans doublet ; seuil de liaison polarisée Δχ ≥ 0,4 (S–H non polarisée) (ch. 6) ;
   - « dioxygène » exigé, « oxygène » refusé en réponse courte (ch. 9, question 011) ;
   - convention non centrée v⃗ᵢ ≈ MᵢMᵢ₊₁/Δt et Δv⃗ᵢ = v⃗ᵢ₊₁ − v⃗ᵢ (ch. 12), alors que le chapitre 14 calcule une vitesse centrée sur un pointage (le texte le signale) ;
   - niveaux d'énergie de l'hydrogène arrondis : λ calculées 658 / 488 nm contre 656 / 486 nm mesurées (ch. 17, signalé dans le cours).
5. **Questions au bord du programme, gardées** (données dans l'énoncé) : couples oxydant-réducteur hors liste (ch. 3 et 5), acide éthanoïque et H₃O⁺ (ch. 4, 119), points d'équilibre entre deux charges ou deux astres (ch. 10, 055 et 088), ester nommé (ch. 8, 134), quelques valeurs réelles hors du cours (températures d'ébullition, électronégativité du potassium).
6. **Figures** : 50 schémas SVG en ligne utilisant les classes de couleur du thème ; ils ont été relus sur un rendu, surtout en thème clair. À regarder dans l'application, en thème sombre et sur téléphone.
7. **Relecture du cours** : chaque relecteur à l'aveugle a aussi relevé les erreurs du texte du cours (23 corrections au total) ; ce n'est pas une relecture complète du cours par un enseignant.

## Fichiers

- `contenu/1re-gen/programmes/physique-chimie-1re.md`, `physique-chimie-1re-plan.md`
- `contenu/1re-gen/physique-chimie.json` (cours et 2 550 questions validées)
- `contenu/1re-gen/banques/physique-chimie-chN.json` et `physique-chimie-chN-relecture.md` (N = 1 à 17)
- `contenu/1re-gen/validation/physique-chimie-chN.md` (N = 1 à 17) et ce bilan
