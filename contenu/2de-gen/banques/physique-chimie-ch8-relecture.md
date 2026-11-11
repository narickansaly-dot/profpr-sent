# Relecture de la banque du chapitre 8 de physique-chimie (2de) contre le cours

Relecture des 150 questions de `physique-chimie-ch8.json` contre le texte du chapitre « Décrire un mouvement » (sortie de `pc.ts texte 8`), une par une, sans échantillonnage. Critères : exactitude scientifique et conformité au cours ; chaque calcul refait (valeur, unité, arrondi, marge) ; lecture unique ; bonnes réponses seules justes et distracteurs faux sans ambiguïté ; explication juste et suffisante ; niveau 2de, aucune donnée extérieure au chapitre, aucune question sur la valeur d'une donnée fictive du cours ; réponses courtes (variantes, nombre seul, marge, unité demandée dans l'énoncé) ; reformulations proches et redites d'idée ; réponse lisible dans l'énoncé ; bonne réponse repérable par sa longueur ou sa forme (contrôlée par script). Typographie (espaces insécables, exposants Unicode) contrôlée par le vérificateur.

## Questions corrigées et remplacées

| Source | Problème | Décision |
|---|---|---|
| physique-chimie-2de:ch8:banque:016 | L'explication donnait 10⁸ m comme ordre de grandeur de la distance Terre-Lune ; or 3,8 × 10⁸ m peut aussi s'arrondir à 10⁹ m, et le cours ne tranche pas. | Corrigée : parenthèse supprimée, l'explication renvoie au tableau du cours. |
| physique-chimie-2de:ch8:banque:044 | Question sur la translation rangée sous la notion « Composition des vitesses » ; la translation est une définition de la section sur le référentiel et la relativité du mouvement. | Corrigée : notion « Relativité du mouvement ». |
| physique-chimie-2de:ch8:banque:048 | Reformulation proche de la 041 (même énoncé, train et passager vers l'avant, seule l'addition change) et mêmes valeurs que la 042 (30 et 1,5 m·s⁻¹). | Remplacée : réponse courte (difficulté 3, même notion) qui combine une soustraction (passager vers l'arrière, 25 − 1,0 = 24 m·s⁻¹) et une conversion en km·h⁻¹ (86,4), marge absolue 0,5. |
| physique-chimie-2de:ch8:banque:053 | Explication confuse (« la valve décrit un cercle autour de l'axe de la roue, pas le centre ») sans référentiel. | Corrigée : « dans le référentiel du vélo, la valve décrit un cercle alors que le centre de la roue reste immobile ». |
| physique-chimie-2de:ch8:banque:059 | Redite de la 054 : même idée (« le modèle du point ne dit pas que l'objet est petit ») et même explication mot pour mot. | Remplacée : vrai/faux (faux, difficulté 2, même notion) sur la perte de la déformation (nageur qui bouge les bras et les jambes, exemple du cours). |
| physique-chimie-2de:ch8:banque:082 | Énoncé « pour réaliser la vidéo » alors que la bonne réponse « pointer toujours le même point » relève de l'exploitation ; l'explication ne justifiait pas « zone dégagée ». | Corrigée : énoncé « pour réaliser et exploiter la vidéo » ; explication reprenant les trois précautions du cours. |
| physique-chimie-2de:ch8:banque:105 | Explication contradictoire : « on passe de m·s⁻¹ à km·h⁻¹ en multipliant par 3,6 : 90 / 3,6 = 25 » (le calcul est une division, dans l'autre sens) ; la fausseté de « 1 km·h⁻¹ = 3,6 m·s⁻¹ » n'était pas justifiée. | Corrigée : explication sur la division par 3,6 et sur l'égalité inversée. |
| physique-chimie-2de:ch8:banque:121 | Réponse lisible dans l'énoncé : « que calcule vx = … ? » avec pour bonne réponse « la coordonnée vx du vecteur vitesse ». | Corrigée : « que calcule l'expression (xᵢ₊₁ − xᵢ) / τ ? ». |
| physique-chimie-2de:ch8:banque:143 | L'explication ne justifiait que deux des trois bonnes réponses (rien sur les flèches ni sur la variation du vecteur vitesse). | Corrigée : explication couvrant les trois bonnes réponses et le distracteur. |

## Totaux

- Gardées sans changement : 141
- Corrigées : 7 (016, 044, 053, 082, 105, 121, 143)
- Remplacées : 2 (048, 059)

Répartition après relecture : types 75 qcm_unique / 30 qcm_multiple / 30 vrai_faux / 15 reponse_courte ; vrai/faux : 15 vrais, 15 faux ; qcm_multiple : 19 à 2 bonnes réponses, 11 à 3 ; difficultés 60 / 60 / 30 ; bonne réponse des qcm_unique en position 0 / 1 / 2 / 3 : 19 / 19 / 19 / 18 ; bonne réponse strictement la plus longue dans 19 qcm_unique sur 75 (25 %). Vérificateur (`PC_CHAPITRE=… npx tsx pc.ts verifier 8`) : « Banque du chapitre 8 conforme : 150 questions. »

Tous les calculs ont été refaits (013, 041 à 043, 046, 048, 076, 079, 080, 087, 091, 092, 096, 098 à 103, 105, 110 à 112, 117 à 120, 128, 129, 135 à 137, 149, 150) : aucune erreur de valeur, d'unité ni d'arrondi ; les marges des réponses courtes numériques sont adaptées.

Points jugés acceptables :

- 129 reprend les valeurs de l'exemple fictif du cours (1,5 m·s⁻¹ et 1 cm pour 0,50 m·s⁻¹), et 150 reprend la méthode du chariot B avec d'autres valeurs : les données sont dans l'énoncé et la question porte sur la méthode, ce que la consigne permet.
- 043 : la bonne réponse (20 m·s⁻¹) est la vitesse du train donnée dans l'énoncé, mais c'est justement le raisonnement attendu (passager assis, immobile dans le train) ; les distracteurs 0 et 40 m·s⁻¹ sont des erreurs classiques.
- 054 et 073 : la bonne réponse reprend presque une phrase du cours ; la reformulation reste courte et les distracteurs sont plausibles.
- 014 (« quelles mesures n'ont aucun sens ? ») reprend la formulation du cours ; ce n'est pas une négation piège.
- 019 bonnes réponses strictement les plus longues sur 75 qcm_unique (002, 003, 010, 011, 012, 035, 052, 053, 054, 062, 066, 073, 075, 078, 080, 104, 121, 130, 134) : en dessous du seuil de 40 %, et l'écart tient souvent au contenu (définition, conditions).

## Points de doute pour l'enseignant

1. **056** : « le trajet d'une voiture entre deux villes » est donné comme un cas où le modèle du point suffit ; le cours ne cite pas cet exemple pour le modèle du point, mais il découle de la règle (système petit devant les distances parcourues).
2. **036 et 039** : le cours dit seulement que la bille « tombe verticalement » dans le référentiel du train ; aucune forme n'est donnée dans le référentiel terrestre, et la banque n'en demande pas, ce qui est prudent.
3. **Redites d'idée** : 033, 034, 037, 040 et 043 sur le passager assis dans le train ; 041, 042 et 046 sur l'addition ou la soustraction des vitesses ; 052, 055 et 057 sur les informations perdues avec le modèle du point ; 065, 066 et 071 sur la valve et l'aiguille ; 074, 077, 084, 131 et 132 sur l'espacement des points ; 090, 094 et 095 sur la norme du vecteur déplacement ; 104 et 106 sur la distance en ligne droite ; 119, 120 et 129 sur l'échelle de représentation ; 123 et 125 sur l'approximation du vecteur vitesse ; 140, 144, 146 et 147 sur le mouvement circulaire uniforme. Les formes diffèrent, mais le chapitre offre peu de faits distincts pour 150 questions.
4. **Difficultés** : 027 (objets de référence du référentiel terrestre, lecture du tableau) et 121 (lecture de la formule du programme) sont cotées 3 pour une lecture assez directe du cours ; 087 (1 / 50) est cotée 3 alors que la 079 (1 / 0,040) est cotée 2 ; 111 (108 / 3,6) est cotée 1 alors que la 099, conversion du même type, est cotée 2. Gardées pour respecter les quotas.
5. **012** : le distracteur « le mètre et le siècle » est peu plausible ; à remplacer par un couple plus proche (par exemple « le mètre et la minute ») si tu le juges utile.
6. **Variantes** : 020 accepte « ua », « unité astronomique » avec ou sans article ; 088 accepte « tau » et « τ » ; 148 accepte « uniforme » et « rectiligne uniforme ». À compléter si les élèves écrivent d'autres formes (par exemple « la lettre tau », « mouvement uniforme »).
