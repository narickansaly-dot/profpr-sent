# Relecture indépendante de la banque du chapitre 10 de SI (1re générale)

Méthode : résolution à l'aveugle des 150 questions à partir du seul texte du chapitre (énoncés et propositions sans réponses ni explications), tous les calculs refaits par script Python (puissances, conversions tr/min → rad/s, oscilloscope, précision « ±(p % + n digits) », moyennes, écarts types avec division par n − 1, incertitudes-types, chiffres significatifs, écarts absolus et relatifs avec la bonne référence, autonomies par kilogramme), comparaison automatique avec la banque, puis relecture complète des 150 questions avec leur réponse et leur explication (exactitude, lecture unique, distracteurs indéfendables, conformité au cours, unités et chiffres significatifs, marges, variantes des réponses courtes, doublons de fond, typographie).

Résultat de la phase 1 : 0 désaccord sur 150 (dont 0 erreur de la banque, 0 ambiguïté, 0 erreur du relecteur). Toutes les bonnes réponses et toutes les valeurs des distracteurs commentées dans les explications ont été retrouvées (par exemple 083 : s = 0,163 A avec n − 1, 0,141 A avec n ; 084 : u = 0,082 A, 0,071 A avec n ; 064 : 2,334 A à 2,466 A).

## Questions corrigées

Aucune erreur scientifique ni de calcul. Les corrections portent sur des doublons de fond (un vrai/faux ou une proposition qui donne la réponse d'une autre question si les deux tombent dans le même quiz), une marge trop large et deux réponses courtes reprenant les données d'autres questions. Chaque vrai/faux remplacé garde son type, sa difficulté, sa notion et sa valeur ; le QCM modifié garde sa bonne réponse en position 3.

| Source | Problème | Correction |
|---|---|---|
| si-1re:ch10:banque:014 | « La performance attendue figure dans le cahier des charges » : même fait que 001, 018 et 019. | Remplacée (vrai, difficulté 1) : un écart mesuré-simulé de 1 % montre en général un bon modèle. |
| si-1re:ch10:banque:017 | « Un modèle validé permet de tester d'autres solutions sans prototype » : donne les propositions 0 et 1 de la 013. | Remplacée (vrai, difficulté 2) : la valeur mesurée dépend des conditions d'essai (masse du cycliste, état de charge). |
| si-1re:ch10:banque:019 | Réponse « cahier des charges » donnée par l'énoncé de la 018, la 001, la 014 et de nombreux énoncés. | Nouvelle question : simulation 66 km, essai 58 km, le modèle est-il optimiste ou pessimiste ? (« optimiste » et variantes). |
| si-1re:ch10:banque:035 | « Un voltmètre se branche en série » : même fait que 020 et 032 (proposition 1). | Remplacée (faux, difficulté 1) : un tachymètre mesure le couple d'un moteur. |
| si-1re:ch10:banque:036 | Énonce le raccordement du wattmètre, réponse de la 030 (propositions 1 et 4). | Remplacée (vrai, difficulté 1) : un oscilloscope affiche une tension en fonction du temps. |
| si-1re:ch10:banque:053 | « Changer la fonction sous tension » : donne la proposition 3 de la 048. | Remplacée (faux, difficulté 1) : au lycée, les bancs fonctionnent en général sous 230 V. |
| si-1re:ch10:banque:072 | « Répéter élimine une erreur systématique » : donne la proposition 3 de la 071 et recoupe 059 et 060. | Remplacée (faux, difficulté 1) : une virgule mal placée est une erreur aléatoire (c'est une faute). |
| si-1re:ch10:banque:073 | Résolution 0,01 V sur le calibre 20 V : doublon de 043, 050 et 055, et hors de sa notion (erreurs de mesure). | Remplacée (vrai, difficulté 1) : l'environnement peut être une source d'erreurs de mesure. |
| si-1re:ch10:banque:090 | « L'écart type a l'unité de la grandeur » : donne les propositions 2 et 3 de la 088. | Remplacée (vrai, difficulté 1) : une valeur à plus de trois écarts types de la moyenne est suspecte. |
| si-1re:ch10:banque:091 | « L'écart type diminue quand n augmente » : donne les propositions 1 et 2 de la 087. | Remplacée (faux, difficulté 2) : dans l'écart type expérimental, on divise par n. |
| si-1re:ch10:banque:092 | « Avec 4 fois plus de mesures, u est divisée par 2 » : reprend mot pour mot la proposition 0 de la 087. | Remplacée (vrai, difficulté 2) : le rapport s / x̄ en % permet de comparer des dispersions. |
| si-1re:ch10:banque:131 | « Référence = valeur simulée pour valider un modèle » : donne la réponse de la 119. | Remplacée (faux, difficulté 2) : 3 % de 60 km font 3 km (en réalité 1,8 km). |
| si-1re:ch10:banque:135 | Réponse (axes avec grandeur et unité) donnée par la proposition 1 de la 143. | Nouvelle question sur le titre d'un tableau de mesures (« ce qui a été mesuré et dans quelles conditions », position 3). |
| si-1re:ch10:banque:149 | Même calcul et même résultat (15 Wh/km) que la 147. | Données changées : 420 Wh pour 35 km, réponse 12. |
| si-1re:ch10:banque:150 | Données identiques à l'exemple du cours et à la batterie B de la 144 (20 min, 380 g). | Données changées : 21 min pour 450 g, 46,7 → 47 (marge 0,5 conservée). |
| si-1re:ch10:banque:095 | Marge de 0,01 sur un résultat arrondi au centième (s = 0,316 W) : acceptait 0,31 et 0,33, qui ne sont pas des arrondis honnêtes. | Marge ramenée à 0,005 (accepte 0,32 et 0,316). |

## Totaux

- Gardées sans changement : 134
- Corrigées : 16 (014, 017, 019, 035, 036, 053, 072, 073, 090, 091, 092, 095, 131, 135, 149, 150), dont 11 vrais/faux remplacés, 1 qcm_unique et 4 réponses courtes.

Répartition finale : types 75 / 30 / 30 / 15 ; difficultés 60 / 59 / 31 (inchangées, dans la tolérance) ; vrai/faux : 15 vrais, 15 faux ; position de la bonne réponse des qcm_unique : 19 / 19 / 19 / 18 ; notions : 17 à 19 questions chacune.

Dernière ligne du vérificateur : « Banque du chapitre 10 conforme : 150 questions ; types 75/30/30/15 ; difficultés 60/59/31 ; vrai/faux 15 vrais. »

Comparaison après corrections : 0 désaccord (les réponses du relecteur aux trois réponses courtes modifiées, 019, 149 et 150, ont été mises à jour).

## Points de doute

Aucune question laissée « à relire ». Remarques mineures, sans correction :

- 012 (rôle des trois écarts) reprend le triangle du cours, comme 003, 004, 005 et 119 : recoupement inévitable sur la notion centrale, sans reprise littérale d'une bonne réponse de QCM unique.
- 088 et 089 utilisent la même série (14,35 s ; 0,19 s), issue du cours, pour deux questions différentes : jugé acceptable.
- 109 (zéros à gauche non significatifs) énonce la règle utile pour 096, 101 et 113, sans en donner la réponse.
- 042 : 15 A a pour ordre de grandeur 10 A selon la définition du cours (puissance de 10 la plus proche), cohérent avec l'exemple de la trottinette.

## Cours

Rien à signaler : les exemples résolus du chapitre ont été recalculés (oscilloscope T = 0,5 ms, f = 2 kHz, 6 V, α = 0,4 ; portail Pe ≈ 56,6 W, ω ≈ 151,8 rad/s, Pu ≈ 38,0 W, η ≈ 0,67 ; fauteuil I ≈ 8,3 A ; précision 0,08 V ; série du portail x̄ = 14,35 s, somme des carrés 0,175 s², s ≈ 0,19 s, u ≈ 0,08 s ; C = 0,254 N·m avec u = 0,004 N·m ; P ≈ 57 W ; VAE 3,3 % et 13,8 % ; portail 2,5 % et 8,0 % ; drone 42 et 53 min/kg ; trottinette 3,8 %) et sont justes.
