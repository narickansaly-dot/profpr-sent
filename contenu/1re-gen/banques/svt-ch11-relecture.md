# Relecture de la banque du chapitre 11 de SVT (1re) contre le cours

Banque `svt-ch11.json` : 150 questions sur le chapitre 11 (« Les écosystèmes, des interactions dynamiques »).

## Méthode

1. Rédaction du chapitre puis de la banque, en quatre parties fusionnées par script.
2. Auto-relecture de chaque question contre le texte brut du chapitre : une seule bonne réponse, information présente dans le texte, aucune question qui donne la réponse d'une autre. Une vingtaine de questions ont été remplacées ou reformulées à ce stade.
3. Relecture indépendante : un sous-agent a résolu les 150 questions avec le seul texte du chapitre, sans voir les réponses attendues.
4. Comparaison automatique de ses réponses avec les réponses attendues, puis arbitrage de chaque écart et de chaque remarque.

## Relecture indépendante

Taux d'accord initial : 150/150 (aucun écart). Six remarques ont été traitées.

| Source | Écart ou remarque | Décision |
|---|---|---|
| svt:ch11:banque:018 | Le biais de surestimation, quand les animaux marqués évitent les pièges, se déduit de N ≈ M × C ÷ R mais n'est pas écrit dans le chapitre. | Chapitre complété (section 1) : la méthode suppose que les marques ne changent pas le comportement des animaux ; sinon R est trop petit et l'effectif surestimé. Question inchangée. |
| svt:ch11:banque:052 | Le texte applique les 10 % à « la matière d'un niveau » ; le distracteur « 10 kg » peut piéger un bon élève. | Énoncé précisé : les chenilles sont mangées par des mésanges, et on demande la masse retrouvée chez les mésanges « après ces deux transferts ». Explication détaillée transfert par transfert. |
| svt:ch11:banque:090 | La proposition « les chevreuils disposent de nourriture, ce qui favorise leur reproduction » est ambiguë : une population déjà très abondante peut manquer de nourriture. | Reformulée : « Chaque chevreuil qui broute tire un bénéfice de cette ressource alimentaire », sans équivoque. |
| svt:ch11:banque:141 | Accepter aussi le singulier « hyphe ». | Déjà accepté (variantes : hyphes, hyphe, les hyphes, des hyphes). Aucune modification. |
| svt:ch11:banque:142 | Accepter aussi le singulier « détritivore ». | Déjà accepté. Aucune modification. |
| svt:ch11:banque:148 | Accepter aussi « succession » seul. | Déjà accepté (succession, succession écologique, avec ou sans article, au pluriel). Aucune modification. |
| svt:ch11:banque:065, 104, 147 | Trois calculs de bilan de carbone d'un écosystème ouvert : risque de répétition. | 065 (bilan positif, puits) et 104 (bilan négatif, source) sont gardés : ils couvrent les deux cas. La 147, qui doublait la 065 (autre bilan positif), est devenue un calcul en deux étapes : bilan annuel puis stock gagné en 20 ans (réponse 30). La 130 porte sur le bilan d'eau, pas sur le carbone. |

## Totaux

- 150 questions ; types 75 qcm_unique / 30 qcm_multiple / 30 vrai_faux / 15 reponse_courte.
- Vrai/faux : 15 vrais, 15 faux.
- Difficultés : 61 (niveau 1), 60 (niveau 2), 29 (niveau 3).
- Biais de longueur : la bonne réponse est la plus longue dans 7 qcm_unique sur 75.
- Position de la bonne réponse des qcm_unique : 18 / 17 / 21 / 19.
- Contrôle (`verifierBanque`) : « Banque du chapitre 11 conforme : 150 questions. »


## Seconde vérification indépendante

Les 4 questions modifiées (`ch11-modifiees.txt`) ont été résolues à nouveau par un second relecteur indépendant, sans les réponses : **accord 4/4**. Il jugeait encore discutable la proposition « chaque chevreuil qui broute tire un bénéfice » présentée comme une conséquence de l'abondance : la 090 porte maintenant sur l'interaction elle-même (énoncé « Quelles affirmations sur cette interaction sont exactes ? », propositions et explication reprises, réponses inchangées en position : 1re et 3e), en accord avec le tableau des interactions du chapitre (herbivorie : + / −).

## Questions laissées à relire

Aucune question ne reste douteuse : les trois questions modifiées ont une réponse unique, écrite dans le chapitre (complété pour la 018).

À relire : aucune
