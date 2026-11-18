# Relecture de la banque du chapitre 8 d'enseignement scientifique (1re)

Relecture indépendante à l'aveugle : un sous-agent a résolu les 150 questions de `ens-sci-ch8.json` (calculs refaits) sans voir les réponses ; ses réponses ont été comparées automatiquement à celles de la banque, puis chaque écart et chaque remarque ont été examinés un par un contre le texte du chapitre 8 (« La forme de la Terre »).

## Résultat de la relecture à l'aveugle

- Concordance initiale : **150/150**.
- Écarts : **0**.
- Remarques (questions concordantes commentées ou à confiance < 3) : **34**.
- Répartition des 34 remarques :
  - erreurs de la banque : 1 (116, distracteur « Tout cercle passant par les deux pôles », qui est en fait juste) ;
  - ambiguïtés de formulation : 2 (032, 035) ;
  - distracteurs défendables ou qui trahissent la réponse : 3 (014, 018, 129) ;
  - variantes ou tolérances de réponse courte : 11 (046, 049, 050, 096, 097, 098, 100, 146, 147, 148, 150) ; pour 097, 100 et 150, la marge relative acceptait déjà le résultat obtenu avec π ≈ 3,14 : seule l'explication est précisée ;
  - erreurs du relecteur ou remarques sans suite : 17. Ce sont des calculs vérifiés et justes (023, 059, 060, 075, 079, 084, 095, 099, 113, 114, 122, 123, 124, 132, 135, 149) et une remarque sans conséquence (010 : l'Égypte n'est pas citée dans le cours, mais la question repose sur « vers le sud », qui l'est).

## Corrections faites

| Source | Problème | Décision |
|---|---|---|
| ens-sci:ch8:banque:014 | Distracteur « Un bâton vertical porte une ombre de 7,2° » : une ombre n'a pas d'angle, et 7,2° concerne Alexandrie. | Remplacé par « Un bâton vertical porte une ombre très allongée ». |
| ens-sci:ch8:banque:018 | La parenthèse « (rayons parallèles) » de la bonne réponse la signalait. | Bonne réponse reformulée : « Ce sont deux angles alternes-internes, donc égaux » (elle n'est pas la plus longue). |
| ens-sci:ch8:banque:032 | « Résultat exprimé en kilomètres » poussait à ne cocher que l'incertitude sur le stade. | Énoncé : « Quelles raisons rendent incertain le résultat d'Ératosthène ? » ; les trois bonnes réponses sont inchangées. |
| ens-sci:ch8:banque:035 | « Il fait nuit à Tokyo quand il fait jour à Paris » : un élève pouvait objecter qu'un Soleil-projecteur sur une Terre plate l'expliquerait aussi. | Remplacé par « Des étoiles différentes sont visibles selon la latitude » (juste, argument du cours) ; explication réécrite. |
| ens-sci:ch8:banque:046 | Variantes demandées. | « gnomon », « un gnomon », « le gnomon », « gnomons » étaient déjà acceptés ; ajout de « gnomon vertical ». |
| ens-sci:ch8:banque:049 | Réponse avec espace ou unité. | Ajout de « 39960 km » et « 39 960 km » (« 39 960 » était déjà accepté). |
| ens-sci:ch8:banque:050 | Variantes du nom de Magellan. | Ajout de « Ferdinand Magellan », « Ferdinand de Magellan », « Fernand Magellan », « Fernão de Magalhães ». |
| ens-sci:ch8:banque:096 | Variantes. | Ajout de « triangulation plane », « la triangulation plane », « triangulations » (« la triangulation » était déjà acceptée). |
| ens-sci:ch8:banque:097 | Résultat avec π = 3,14 (6 369). | Déjà accepté par la marge relative de 0,2 % ; l'explication le précise. |
| ens-sci:ch8:banque:098 | Réponse avec virgule ou unité. | « 11,3 » était déjà accepté ; ajout de « 11,3 km », « 11.3 km », « 11,29 », « 11.29 ». |
| ens-sci:ch8:banque:100 | Résultat avec π = 3,14 (10 908). | Déjà accepté par la marge relative de 0,5 % ; l'explication le précise. |
| ens-sci:ch8:banque:116 | Le distracteur « Tout cercle passant par les deux pôles » est juste : un cercle de la sphère qui passe par deux points diamétralement opposés est un grand cercle. Deux réponses défendables. | Remplacé par « Tout cercle qui passe par le pôle Nord » (faux : un petit cercle peut passer par ce point) ; explication complétée. |
| ens-sci:ch8:banque:129 | La proposition fausse « séparées de 1 112 km exactement » se trahissait par « exactement ». | Remplacée par « Leur distance le long du parallèle vaut 1 112 km » ; l'explication donne le calcul (10 × 111,2 km le long d'un méridien, environ 744 km le long du parallèle 48° N). |
| ens-sci:ch8:banque:146 | Variantes. | Ajout de « orthodromies », « arc de grand cercle », « l'arc de grand cercle », « un arc de grand cercle ». |
| ens-sci:ch8:banque:147 | Variantes. | Ajout de « Greenwich près de Londres », « Greenwich, près de Londres », « Greenwich (Royaume-Uni) ». |
| ens-sci:ch8:banque:148 | Variantes. | « la latitude » était déjà acceptée ; ajout de « latitudes ». |
| ens-sci:ch8:banque:150 | Résultat avec π = 3,14 (20 005). | Déjà accepté par la marge relative de 1 % ; l'explication le précise. |

Le cours (chapitre 8) n'a pas été modifié.

## Totaux

- 150 questions, sources `ens-sci:ch8:banque:001` à `150`, sans statut.
- Types : 75 qcm_unique, 30 qcm_multiple, 30 vrai_faux (14 vrais, 16 faux), 15 reponse_courte.
- Difficultés : 57 / 61 / 32.
- Positions des bonnes réponses des qcm_unique : 17 / 19 / 20 / 19 (indices 0 à 3).
- La bonne réponse des qcm_unique est strictement la plus longue dans 13 cas sur 75 (17 %).
- Contrôle (`verifierBanque`, mêmes règles que `npm run banque:verifier`) : « Banque du chapitre 8 conforme : 150 questions. » ; nettoyage HTML du chapitre : rien n'est retiré.

## Questions laissées à relire

Aucune.

## Points de doute pour l'enseignant

1. **Longueur du stade** : le cours retient une fourchette de 157,5 m à 185 m (environ 39 400 km ou 46 250 km pour le méridien d'Ératosthène). Les manuels citent parfois d'autres valeurs (157,5 m, 159 m, 185 m).
2. **Rayon terrestre** : rayon moyen 6 371 km ; rayons équatorial 6 378 km et polaire 6 357 km ; méridien d'environ 40 000 km (40 008 km mesuré). Certains manuels prennent R = 6 400 km : les questions de calcul donnent toujours R dans l'énoncé.
3. **Delambre et Méchain** : bases d'environ 12 km près de Melun et de Perpignan, arc Dunkerque-Barcelone d'un peu plus de 1 000 km, erreurs de latitude de Méchain : détails historiques à aligner sur le manuel.
4. **Contenus au-delà du strict programme** : la loi des sinus (triangulation) et le rayon d'un parallèle r = R × cos φ sont dans le cours et utilisés par quelques questions de difficulté 3 ; à retirer si la classe ne les a pas vus en mathématiques.
5. **Valeurs d'illustration** : Paris (48,9° N, 2,3° E, altitude de 35 à 131 m), Everest (moins de 9 km), Afrique environ 14 fois plus étendue que le Groenland ; questions s'appuyant sur des données fournies dans l'énoncé (Mars, Lune, Station spatiale à 400 km).
