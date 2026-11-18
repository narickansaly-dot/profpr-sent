# Relecture de la banque du chapitre 11 d'enseignement scientifique (1re)

Relecture indépendante à l'aveugle : un sous-agent a résolu les 150 questions de `ens-sci-ch11.json` (calculs refaits) sans voir les réponses ; ses réponses ont été comparées automatiquement à celles de la banque, puis chaque écart et chaque remarque ont été examinés un par un contre le texte du chapitre 11 (« Son et musique »).

## Résultat de la relecture à l'aveugle

- Concordance initiale : **150/150**.
- Écarts : **0**.
- Remarques (questions concordantes commentées ou à confiance < 3) : **30**.
- Répartition des 30 remarques :
  - erreurs de la banque : 0 ;
  - ambiguïtés de formulation : 5 (070, 115, 132, 135, 144) ;
  - distracteurs défendables ou peu crédibles : 1 (048) ;
  - variantes de réponse courte manquantes : 1 (008) ;
  - erreurs du relecteur ou remarques sans suite : 23. Ce sont des calculs vérifiés et justes (017, 027, 032, 038, 065, 073, 074, 108, 110, 118, 130), des confirmations sans demande (011, 014, 037, 045, 094, 111, 150), des variantes déjà acceptées (046 « le timbre », 059 « 83 dB », 063 « 10⁴ » et « 10^4 », 103 « une octave » et « l'octave » ; quelques variantes de plus ont été ajoutées par prudence), et la 033, où « 1 650 » avec une espace n'est pas ajouté : l'énoncé demande d'écrire le nombre sans espace, conformément au guide des auteurs (partie 3).

## Corrections faites

| Source | Problème | Décision |
|---|---|---|
| ens-sci:ch11:banque:008 | Écritures en puissance de dix refusées. | Ajout de « 2,0 × 10² », « 2 × 10² », « 2,0.10^2 ». |
| ens-sci:ch11:banque:046 | Variantes au pluriel. | Ajout de « timbres », « les timbres » (« le timbre » était déjà accepté). |
| ens-sci:ch11:banque:048 | Distracteur « Les deux, car ils partagent… » peu crédible. | Remplacé par « Aucun : ils ont la même hauteur, car ils ont un pic commun à 600 Hz » ; explication complétée (c'est le premier pic qui compte). |
| ens-sci:ch11:banque:059 | Variante sans espace. | Ajout de « 83dB » (« 83 dB » était déjà accepté). |
| ens-sci:ch11:banque:063 | Variantes écrites en toutes lettres. | Ajout de « 10 puissance 4 » et « 1e4 » ; « 10⁴ » et « 10^4 » étaient déjà acceptés ; pas de variante avec espace de milliers (règle du guide). |
| ens-sci:ch11:banque:070 | « Le niveau atteint le seuil de risque » : un élève peut hésiter entre atteindre et dépasser. | Reformulée : « Le nouveau niveau est égal au seuil de risque indiqué pour une exposition prolongée (80 dB) ». |
| ens-sci:ch11:banque:103 | Variantes. | Ajout de « octaves » et « une octave juste ». |
| ens-sci:ch11:banque:115 | Un élève peut répondre le rapport (8) ou « 3 octaves ». | Énoncé précisé (« Réponds par le nombre d'octaves, pas par le rapport des fréquences ») ; ajout de « 3 octaves », « trois octaves » ; explication détaillée (8 = 2 × 2 × 2). |
| ens-sci:ch11:banque:132 | « Un ré à 594 Hz » défendable : 594 Hz apparaît pendant la construction. | Énoncé précisé : gamme construite dans l'octave de 264 Hz à 528 Hz ; l'explication dit que 594 Hz est une étape du calcul, hors de l'octave. |
| ens-sci:ch11:banque:135 | « Une de ses quintes est fausse » : cause ou conséquence du problème de transposition ? | Énoncé recentré sur le défaut de la gamme (« Quelles affirmations décrivent correctement le défaut… ») ; proposition reformulée : « Une de ses quintes est fausse, ce qui gêne la transposition » (vraie, comme dans le cours). |
| ens-sci:ch11:banque:144 | Attribution à Pythagore lui-même discutable ; le cours dit « Pythagore et son école ». | Énoncé aligné sur le cours : « Pythagore et son école avaient constaté… ». |

Le texte du cours a été raccourci, sans retirer de fait utilisé par les questions, pour passer sous 22 000 caractères de HTML hors SVG (21 970) : suppression d'un exemple redondant (quatre enceintes, calcul déjà donné par les paliers ; corde bloquée en son milieu, résultat intégré au paragraphe sur la longueur), d'une phrase de conclusion historique, de mises en gras dans les sections « gammes » et « histoire », et resserrement de la méthode « deux notes à l'octave ».

## Totaux

- 150 questions, sources `ens-sci:ch11:banque:001` à `150`, sans statut.
- Types : 74 qcm_unique, 30 qcm_multiple, 31 vrai_faux (17 vrais, 14 faux), 15 reponse_courte.
- Difficultés : 60 / 60 / 30.
- Positions des bonnes réponses des qcm_unique : 18 / 19 / 18 / 19 (positions 0 à 3).
- La bonne réponse est la plus longue (égalités comprises) dans 13 cas sur 74 (18 %).
- Contrôle (pilote, mêmes règles que `banque:verifier`) : « Banque du chapitre 11 conforme : 150 questions. » ; nettoyage HTML du cours : rien n'est retiré.

## Questions laissées à relire

Aucune.

## Points de doute pour l'enseignant

1. **Échelle des niveaux sonores** : seuil de douleur 120 dB, conversation 60 dB, chuchotement 30 dB, bruissement de feuilles 20 dB, concert 100 à 110 dB, seuil de risque 80 dB. Ce sont des valeurs approximatives, à aligner sur le manuel de la classe.
2. **Réglementation** : la limite de 102 dB(A) sur 15 minutes (décret de 2017) pour les lieux de musique amplifiée est citée sans détail sur les autres obligations.
3. **Formule de la corde vibrante** : f₁ = (1 / 2L) × √(tension / μ) est donnée « pour information, non exigible » ; ses conséquences (corde deux fois plus courte : f₁ doublée ; tension × 4 : f₁ doublée ; longueur divisée par 3 : f₁ × 3) sont utilisées dans quelques questions de difficulté 3.
4. **Notation des octaves** : convention française, la3 = 440 Hz, donc la0 = 55 Hz.
5. **Tempérament** : le cours présente *Le Clavier bien tempéré* (1722) sans affirmer qu'il s'agit d'un tempérament strictement égal, et situe la description du tempérament égal au XVIIᵉ siècle (Mersenne, 1636).
6. **Logarithme** : la relation L = 10 log(I / I₀) est donnée, mais tous les calculs se font par paliers (× 2 → + 3 dB, × 10 → + 10 dB) ou avec des puissances de 10 exactes.
