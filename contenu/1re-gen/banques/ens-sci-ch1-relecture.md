# Relecture de la banque du chapitre 1 d'enseignement scientifique (1re)

Relecture indépendante à l'aveugle : un sous-agent a résolu les 150 questions de `ens-sci-ch1.json` (« Les éléments chimiques : de la nucléosynthèse à la radioactivité ») avec le seul texte du chapitre, en refaisant les calculs et sans voir les réponses ; ses réponses ont été comparées automatiquement à celles de la banque, puis chaque écart et chaque remarque ont été examinés.

## Résultat de la relecture à l'aveugle

- Concordance initiale : **150/150**.
- Écarts : **0**.
- Remarques (concordantes commentées ou de confiance inférieure à 3) : **34**.
- Répartition des remarques :
  - erreurs de la banque : 0 ;
  - ambiguïtés : 1 (099, écriture scientifique non normalisée) ;
  - distracteurs défendables : 1 (056) ;
  - faits absents du texte du cours : 2 (048, 051 : pourcentages du corps humain présents seulement dans la figure) ;
  - variantes de réponses courtes manquantes : 9 (030, 045, 060, 106, 107, 123, 124, 137, 150) ;
  - erreurs du relecteur : 0 ;
  - remarques sans correction nécessaire : 21 (calculs confirmés ou commentaires de niveau : 015, 035, 037, 044, 054, 055, 078, 086, 089, 091, 092, 094, 097, 101, 108, 114, 116, 119, 129, 140, 143).

## Corrections faites

| Source | Problème | Décision |
|---|---|---|
| ens-sci:ch1:banque:048 | La proportion d'oxygène (65 % en masse) n'était donnée que par la figure 1, pas dans le texte. | Cours corrigé : les proportions en masse de l'Univers (H 74 %, He 24 %), de la Terre (Fe 32 %, O 30 %, Si 15 %, Mg 14 %) et du corps humain (O 65 %, C 18 %, H 10 %, N 3 %) sont écrites dans le texte de la section « L'abondance des éléments ». |
| ens-sci:ch1:banque:051 | Même dépendance à la seule figure (secteur de 234° = 65 %). | Couvert par la même correction du cours. |
| ens-sci:ch1:banque:056 | « Des diagrammes circulaires » pour comparer plusieurs milieux : défendable mais discutable, le cours conseillant les barres empilées pour la comparaison. | Énoncé réécrit (« représenter des proportions dont la somme fait 100 % ») ; propositions justes : « Un diagramme circulaire (en secteurs) » et « Des barres empilées jusqu'à 100 % » ; explication complétée. |
| ens-sci:ch1:banque:099 | Proposition « 0,6 × 10⁸ » en écriture scientifique non normalisée. | Remplacée par « 6,0 × 10⁷ » ; explication réécrite en écriture normalisée (2,4 × 10⁸, 1,2 × 10⁸, 6,0 × 10⁷, 3,0 × 10⁷). |
| ens-sci:ch1:banque:030 | Variante avec article partitif absente. | Ajout de « de l'hydrogène » (les accents et la casse sont déjà ignorés). |
| ens-sci:ch1:banque:045 | Réponse écrite sous la forme « A = 3 » refusée. | Ajout de « A = 3 » et « A=3 ». |
| ens-sci:ch1:banque:060 | « 12,6 kg » et l'arrondi « 13 » refusés. | Ajout de « 12,6 kg », « 12.6 kg », « 12,6kg » ; marge absolue portée de 0,3 à 0,5 (13 accepté) ; explication le précise. |
| ens-sci:ch1:banque:106 | « 1 milliard » ou le nombre écrit en entier refusés. | Ajout de « 1 milliard », « un milliard », « 1000000000 ». |
| ens-sci:ch1:banque:107 | Unité tapée (« 10,6 ans ») refusée ; précision attendue non dite. | Ajout de « 10,6 ans », « 10.6 ans » ; énoncé complété par « (au dixième près) ». |
| ens-sci:ch1:banque:123 | « 17 190 » avec espace et « 17190 ans » refusés. | Ajout de « 17190 ans », « 17 190 », « 17 190 ans ». |
| ens-sci:ch1:banque:124 | « 5 730 » avec espace et « 5730 ans » refusés. | Ajout de « 5730 ans », « 5 730 », « 5 730 ans ». |
| ens-sci:ch1:banque:137 | Variantes au pluriel et avec article incomplètes. | Ajout de « des traceurs », « les traceurs », « un traceur radioactif ». |
| ens-sci:ch1:banque:150 | « 80 jours » refusé. | Ajout de « 80 jours » et « 80 j ». |

Le cours a aussi été raccourci de quelques phrases sans question associée (une phrase de conclusion sur la construction du savoir, la mention des tonnes de minerai traitées par les Curie, une phrase de radiothérapie resserrée).

## Totaux

- 150 questions, sources `ens-sci:ch1:banque:001` à `150`.
- Types : 75 qcm_unique, 30 qcm_multiple, 30 vrai_faux (17 vrais, 13 faux), 15 reponse_courte.
- Difficultés : 63 / 59 / 28.
- Positions des bonnes réponses des qcm_unique : 19 / 19 / 18 / 19.
- La bonne réponse des qcm_unique est la plus longue dans 14 cas sur 75 (19 %).
- Contrôle du pilote (mêmes règles que `banque:verifier`) : « Banque du chapitre 1 conforme : 150 questions. » ; nettoyage HTML du cours : rien n'est retiré.

## Questions laissées à relire

Aucune.

## Points de doute pour l'enseignant

1. **Abondances en masse** (Univers H 74 %, He 24 % ; Terre Fe 32 %, O 30 %, Si 15 %, Mg 14 % ; corps humain O 65 %, C 18 %, H 10 %, N 3 % ; croûte O 46 %, Si 28 % ; en nombre d'atomes, corps humain H 62 %, O 24 %, C 12 %, N 1 %, Univers H 92 %, He 8 %) : valeurs arrondies qui varient selon les manuels ; l'écart magnésium / silicium dans la Terre n'est que d'un point.
2. **Hydrogène et Terre** : le programme cite l'hydrogène parmi les éléments principaux de la Terre ; le cours explique qu'il est peu abondant en masse dans la planète entière mais très présent en surface (eau des océans).
3. **Nombre d'éléments** : « environ 90 éléments naturels » dans la section sur les noyaux, « la centaine d'éléments » dans l'encadré repris du programme.
4. **Demi-vies retenues** : carbone 14 5 730 ans (certains manuels donnent 5 700 ans), technétium 99m 6 h, fluor 18 110 min, iode 131 8 jours, radon 222 3,8 jours, cobalt 60 5,3 ans, césium 137 30 ans, radium 226 1 600 ans, uranium 238 4,5 milliards d'années, polonium 214 164 µs.
5. **Ordres de grandeur divers** : matière ordinaire ≈ 5 % de l'Univers ; activité du corps humain ≈ 8 000 Bq ; limite de la datation au carbone 14 ≈ 50 000 ans ; Ötzi ≈ 5 300 ans ; ITER : environ 150 millions de degrés, une trentaine de pays.
6. **Histoire** : le mot « radioactivité » est attribué à Marie Curie dans le cours ; selon les sources, il l'est au couple Curie.
7. **Désintégration α et fission** : le cours distingue explicitement les deux (encadré « Attention ») ; la question 042 porte sur ce point, subtil pour des non-spécialistes.
8. **Longueur du cours** : environ 41 000 caractères de HTML, dont environ 10 000 pour les trois figures SVG, au-dessus de la cible de 15 000 à 22 000 ; la sous-partie 1.1 compte 12 exigibles et une part d'histoire des sciences.
