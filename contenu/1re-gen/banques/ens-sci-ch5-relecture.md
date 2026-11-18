# Relecture de la banque du chapitre 5 d'enseignement scientifique (1re)

Relecture indépendante à l'aveugle : un sous-agent a résolu les 150 questions de `ens-sci-ch5.json` (« Le bilan radiatif terrestre ») sans voir les réponses, en refaisant les calculs ; ses réponses ont été comparées automatiquement à celles de la banque, puis chaque écart et chaque remarque a été examiné contre le texte du chapitre.

## Résultat de la relecture à l'aveugle

- Concordance initiale : **150/150**.
- Écarts : **0**. Remarques (questions concordantes commentées) : **28**.
- Répartition des 28 remarques :
  - erreurs de la banque : 0 ;
  - ambiguïtés ou formulations à préciser : 9 (020, 039, 045, 050, 062, 100, 118, 129, et 143, quasi-doublon de 069) ;
  - distracteurs défendables : 0 ;
  - variantes de réponse courte manquantes : 3 (016, 069, 119) ;
  - erreurs du relecteur ou remarques sans suite : 16. Pour 114 et 148, les variantes signalées étaient déjà acceptées (une variante a tout de même été ajoutée à chacune). Pour 004, 008, 031, 041, 048, 060, 064, 083, 101, 102, 107, 123, 139 et 147, le relecteur a seulement confirmé le calcul ; pour 041, « 10,0 » est déjà accepté par la comparaison numérique.

## Corrections faites

| Source | Problème | Décision |
|---|---|---|
| ens-sci:ch5:banque:016 | Variantes probables absentes (« constante solaire C »). | Ajout de « constante solaire C » et « la constante solaire C ». |
| ens-sci:ch5:banque:020 | Un élève qui arrondit 590/4 à 150 (comme le cours) trouve 112,5, refusé avec la réponse 111 seule. | Réponses 111, 112, 113 avec une marge de 2 (109 à 115) ; l'explication le signale. |
| ens-sci:ch5:banque:039 | « Plus de 420 ppm dans les années 2020 » : faux pour 2020-2022 (moyennes annuelles sous 420 ppm). | Énoncé et explication : « aujourd'hui ». Le cours est corrigé de même. Une explication de qcm_unique (« dans les années 2020 ») est corrigée aussi. |
| ens-sci:ch5:banque:045 | Le cours retient 240 W/m² ; risque de refus de 240. | 240 ajouté explicitement aux réponses (déjà couvert par la marge de 3) ; l'explication le précise. |
| ens-sci:ch5:banque:050 | « L'ozone absorbe l'essentiel du rayonnement ultraviolet » : discutable, les UV-A traversent en partie. | Énoncé : « presque tous les ultraviolets les plus énergétiques, de longueur d'onde inférieure à 0,3 µm ». Le cours est précisé (voir plus bas). |
| ens-sci:ch5:banque:062 | « Ordre de grandeur » suivi d'une valeur à deux chiffres. | Énoncé : « Quelle est environ la fraction… ». |
| ens-sci:ch5:banque:069 | Variantes possibles. | Ajout de « l'IR », « les IR », « rayonnement infrarouge », « le rayonnement infrarouge » (« infra-rouge » était déjà accepté). |
| ens-sci:ch5:banque:071 | Même réserve qu'en 050 (« l'essentiel des ultraviolets »). | Énoncé : « presque tous les ultraviolets les plus énergétiques ». |
| ens-sci:ch5:banque:100 | « Ordre de grandeur » suivi de valeurs à deux chiffres. | Énoncé : « Quelle est environ la puissance totale… ». |
| ens-sci:ch5:banque:114 | Variante « Joseph Fourier » signalée (déjà acceptée). | Ajout de « J. Fourier ». |
| ens-sci:ch5:banque:118 | Même réserve qu'en 050. | Énoncé : « absorbe presque tous les ultraviolets les plus énergétiques (λ < 0,3 µm) » ; ajout de « le gaz ozone ». |
| ens-sci:ch5:banque:119 | Variante « 30 % » absente. | Réponses 0,3, 0,30, « 30 % », « 30% », sans marge : la réponse est exacte, et une marge n'est permise que si toutes les réponses de référence sont des nombres seuls. |
| ens-sci:ch5:banque:129 | Formats refusés (« 1,35 × 10³ ») ; ambiguïté entre 1 350 et 1 360. | Énoncé : « Écris un nombre entier, sans espace ni puissance de 10. » La marge de 10 (1 340 à 1 370) est conservée et indiquée dans l'explication. |
| ens-sci:ch5:banque:143 | Quasi-doublon de 069 (domaine du rayonnement de la surface) et proche de 104. | Remplacée (qcm_unique, difficulté 1, même position de la bonne réponse) : longueur d'onde d'émission maximale du Soleil (vers 0,5 µm, loi de Wien). |
| ens-sci:ch5:banque:148 | Variantes signalées (déjà acceptées). | Ajout de « un albedo ». |

Corrections du cours (chapitre 5) :
- section « Ce que l'atmosphère absorbe » : « Ultraviolet le plus énergétique (λ < 0,3 µm) : absorption presque totale […]. Les UV de plus grande longueur d'onde (0,3 à 0,4 µm) traversent en partie l'atmosphère. » ;
- section « Des pionniers au GIEC » : « plus de 420 ppm aujourd'hui » au lieu de « dans les années 2020 ».

## Totaux

- 150 questions, sources `ens-sci:ch5:banque:001` à `150`.
- Types : 75 qcm_unique, 30 qcm_multiple, 30 vrai_faux, 15 reponse_courte.
- Difficultés : 60 / 60 / 30.
- Vrai/faux : 15 vrais, 15 faux.
- Positions des bonnes réponses des qcm_unique : 19 / 19 / 19 / 18 (positions 0 à 3).
- La bonne réponse est la plus longue dans 11 qcm_unique sur 75 (15 %).
- Contrôle (`verifierBanque`, mêmes règles que `npm run banque:verifier`) : « Banque du chapitre 5 conforme : 150 questions. » ; nettoyage HTML du cours : rien n'est retiré.

## Questions laissées à relire

Aucune.

## Points de doute pour l'enseignant

- Valeurs de flux du bilan radiatif (arrondies, elles varient selon les manuels) : 340 W/m² reçus ; 100 renvoyés ; 80 absorbés par l'atmosphère et 160 par la surface ; 400 émis par le sol, dont 360 absorbés et 40 dans la fenêtre atmosphérique ; 340 renvoyés vers le sol par l'atmosphère et 200 vers l'espace ; 100 transférés par convection et évaporation. À aligner sur le manuel de la classe.
- Données astronomiques : L = 3,83 × 10²⁶ W, d = 1,50 × 10¹¹ m et R = 6 370 km. Le calcul avec ces données donne 1,35 × 10³ W/m², contre 1 361 W/m² mesurés ; le cours attribue l'écart aux arrondis.
- Tableau des albédos (par exemple océan 0,05 à 0,10, banquise 0,50 à 0,70) : les plages varient selon les sources.
- Contributions à l'effet de serre (vapeur d'eau et nuages environ trois quarts, CO₂ environ un cinquième), déséquilibre radiatif actuel de l'ordre de 1 W/m², puissance consommée par l'humanité d'environ 2 × 10¹³ W (« environ 10 000 fois » moins que la puissance solaire interceptée) : ordres de grandeur, à confirmer avec le manuel.
- Les lois de Stefan et de Wien sont reprises du chapitre 4 (calcul de −18 °C, soit 255 K, et du maximum vers 10 µm). Vérifier que le chapitre 4 est traité avant celui-ci.
