# Relecture de la banque du chapitre 10 d'histoire-géographie (1re)

Banque : `histoire-geo-ch10.json`, 150 questions au statut `a_relire` après fusion. Chapitre : « Les sociétés en guerre : des civils acteurs et victimes de la guerre ».

## Méthode

- Questions rédigées à partir du seul texte du chapitre 10 (sortie de `outil.ts texte 10`).
- Relecture indépendante à l'aveugle : un sous-agent a résolu les 150 questions sans voir les réponses attendues ni les explications.
- Comparaison automatique de ses réponses avec les réponses attendues (`[ECART]` si elles diffèrent, `[REMARQUE]` si la réponse est la même mais commentée).
- Contrôles `verifierBanque` (quotas de 150 questions, positions, biais de longueur, espaces insécables, similarité des énoncés), puis contrôle de la présence de chaque réponse courte dans le texte du chapitre.

## Résultat de la relecture indépendante

Le relecteur a donné la même réponse que l'auteur pour 149 questions sur 150. Il y a 1 écart et 8 remarques.

| Source | Constat du relecteur | Décision |
| --- | --- | --- |
| ch10:banque:023 | Le Renault FT est produit dès 1917 ; il est engagé au combat en 1918. | **Corrigée** : « Quel char léger français est engagé au combat en 1918 ? ». |
| ch10:banque:032 | Le distracteur Viviani est en partie défendable : il a lu le message de Poincaré à la Chambre. | **Corrigée** : l'énoncé précise « dans son message au Parlement » et Viviani est remplacé par Jules Guesde. |
| ch10:banque:088 | Les affiches pour les emprunts relèvent aussi du financement ; un élève peut hésiter. | **Corrigée** : la proposition devient « Les affiches de propagande pour les emprunts ». |
| ch10:banque:093 | Il faut nuancer : au Royaume-Uni, seules les femmes de plus de 30 ans votent ; en Allemagne, le droit est accordé en novembre 1918 et exercé en janvier 1919. | **Corrigée** : l'énoncé dit « le droit de vote à des femmes » ; l'explication donne les deux nuances. |
| ch10:banque:111 | Quasi-doublon avec 017 (premier emploi massif du chlore). | **Remplacée** : vrai/faux faux de même difficulté, « La radio ne se développe qu'après la Grande Guerre ». |
| ch10:banque:115 | Erreur de fait : Irène Curie, née le 12 septembre 1897, a 16 ans en août 1914 ; l'erreur est aussi dans le chapitre. | **Corrigée** avec le chapitre : « Irène Curie a 16 ans au début de la guerre » (vrai). L'explication de 139 est aussi corrigée. |
| ch10:banque:125 | Une petite partie de la Belgique, derrière l'Yser, n'a jamais été occupée. | **Corrigée** avec le chapitre : « la plus grande partie de la Belgique » dans l'énoncé, « la quasi-totalité de la Belgique » dans le chapitre. |
| ch10:banque:134 | Environ 550 condamnations à mort et 26 à 49 exécutions selon les décomptes : « une cinquantaine » est une borne haute. | **Corrigée** avec le chapitre : « quelques dizaines d'exécutions seulement ». |
| ch10:banque:140 (écart) | Le relecteur a répondu « Les manipulatrices (en radiologie) », refusé à cause des parenthèses. | **Corrigée** : variantes ajoutées (« les manipulatrices en radiologie », « manipulatrices (en radiologie) », « les manipulatrices (en radiologie) », « manipulatrice en radiologie »). |

## Corrections du texte du chapitre

- Marie Curie : Irène est « âgée de 16 ans en août 1914 » (au lieu de 17 ans en 1914).
- Occupation : « la quasi-totalité de la Belgique et dix départements… ».
- Mutineries : « plus de 500 condamnations à mort, mais quelques dizaines d'exécutions seulement ».
- Travailleurs étrangers : la liste des colonies est supprimée (« des colonies et de Chine ») pour rester sous 14 000 caractères de HTML (13 977). L'explication de 013 est alignée.

## Points de doute (à trancher par l'enseignant)

| Source | Doute | Proposition |
| --- | --- | --- |
| ch10:banque:134 | Nombre d'exécutions après les mutineries : de 26 à 49 selon les décomptes ; l'énoncé reste prudent (« quelques dizaines »). | Garder. |
| ch10:banque:030 et 087 | Chiffres de l'action de Marie Curie (une vingtaine de voitures, environ 200 postes fixes, plus d'un million d'examens) : ordres de grandeur usuels, variables selon les sources. | Garder. |
| ch10:banque:050 | Environ 6 500 civils tués en 1914 (estimation de Horne et Kramer). | Garder. |
| ch10:banque:059 et 063 | Bilans des massacres de 1894-1896 (100 000 à 300 000) et du génocide (1 à 1,5 million) : fourchettes d'historiens. | Garder : les distracteurs sont très éloignés. |

## Contrôles

- `verifier 10` : « Banque du chapitre 10 conforme : 150 questions. »
- `cours 10` : « Nettoyage HTML : rien n'est retiré. » (13 977 caractères de HTML).
- Biais de longueur : la bonne réponse est la plus longue dans 28 % des `qcm_unique` (21 sur 75).
- Positions de la bonne réponse (`qcm_unique`) : 19 / 19 / 19 / 18, tirées au hasard à graine fixe.
- Réponses courtes : toutes présentes dans le texte du chapitre.
