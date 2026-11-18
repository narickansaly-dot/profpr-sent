# Relecture de la banque du chapitre 4 de SVT (1re) contre le cours

Relecture des 150 questions de `svt-ch4.json` contre le texte du chapitre 4 (« L'histoire humaine lue dans son génome »).

## Méthode

1. **Rédaction** : questions écrites à partir du seul texte du chapitre, en trois parties (qcm_unique ; qcm_multiple ; vrai_faux et réponses courtes), puis fusionnées.
2. **Auto-relecture** : chaque question relue contre le texte brut du chapitre (une seule bonne réponse, information présente dans le texte). Une vingtaine de questions ou de distracteurs ont été réécrits ou retirés pour qu'aucune question ne donne la réponse d'une autre (par exemple un distracteur « 99,9 % », « 20 000 » ou « 3,2 milliards » qui nommait la réponse d'une autre question).
3. **Relecture indépendante** : un sous-agent a résolu les 150 questions sans voir les réponses, avec le seul texte du chapitre.
4. **Comparaison automatique** de ses réponses avec les réponses attendues, puis **arbitrage** de chaque remarque.

## Relecture indépendante

Accord initial : **150/150** (aucun écart, aucune question sans réponse). Le relecteur a fait 8 remarques sur des questions où il était d'accord. Toutes ont été traitées.

| Source | Écart ou remarque | Décision |
|---|---|---|
| svt-1re:ch4:banque:116 | 2²⁰ = 1 048 576 « dépasse » à peine le million que le cours arrondit à « environ 1 million » : un élève peut hésiter. | Reformulée : « dépasse 500 000 » (vrai sans ambiguïté) ; l'explication donne 2²⁰ = 1 048 576. |
| svt-1re:ch4:banque:117 | Le plus ancien ADN humain (400 000 ans) n'est pas de l'Homo sapiens : la comparaison avec les fossiles de sapiens (300 000 ans) peut induire en erreur. | Remplacée (même type, même difficulté, même vrai) : un fossile d'un million d'années a très peu de chances de livrer un ADN lisible. |
| svt-1re:ch4:banque:119 | « Une grande partie » de l'ADN venant des bactéries n'est pas dans le cours, qui dit seulement « mêlé ». | Reformulée selon le texte : l'ADN extrait d'os anciens est mêlé à l'ADN de bactéries. |
| svt-1re:ch4:banque:135 | « Sans aucune lacune » en 2022 est trop fort : le chromosome Y n'a été achevé qu'en 2023. | Chapitre nuancé (« séquence presque complète » en 2022, chromosome Y achevé en 2023, aussi dans « Je retiens ») ; question reformulée : année du séquençage des régions très répétées restées illisibles en 2003 (2022). |
| svt-1re:ch4:banque:138 | Variantes décimales. | Ajout de « 6.25 % » et « 6.25% » (« 6,25 », « 6.25 », « 6,25 % » étaient déjà acceptés). |
| svt-1re:ch4:banque:144 | Variantes sans accent ou avec article. | Ajout de « la paleogenetique » et de « paléogénomique » ; la casse et les accents sont déjà ignorés par la normalisation. |
| svt-1re:ch4:banque:147 | « Dérive génétique » est défendable, car le texte relie l'effet fondateur à la dérive. | Rendue univoque : l'énoncé décrit le cas des populations hors d'Afrique et présente le phénomène comme une « conséquence de la dérive génétique » ; la réponse attendue est « effet fondateur » (avec ses variantes). |
| svt-1re:ch4:banque:148 | Nom difficile à taper. | Ajout de « Y.pestis » et « la bactérie Yersinia pestis » (« Yersinia pestis », « Yersinia », « Y. pestis », « Y pestis » étaient déjà acceptés). |
| svt-1re:ch4:banque:104 | Doute de l'auteur : « XIVe siècle » n'était pas écrit dans le cours (seulement 1347-1352). | Chapitre complété : « (1347-1352, au XIVe siècle) ». Question inchangée. |
| svt-1re:ch4:banque:092 | Doute de l'auteur : il faut savoir que des cousins germains ont des grands-parents en commun. | Gardée : l'énoncé le dit explicitement (« ils ont deux grands-parents en commun »). |

## Totaux

- 150 questions ; types : 75 qcm_unique, 29 qcm_multiple, 30 vrai_faux, 16 réponses courtes.
- Vrai/faux : 15 vrais, 15 faux.
- Difficultés : 57 (niveau 1), 63 (niveau 2), 30 (niveau 3).
- Biais de longueur : la bonne réponse est la plus longue dans 22 qcm_unique sur 75.
- Contrôle (`verifierBanque`) : « Banque du chapitre 4 conforme : 150 questions. »

## Modifications du chapitre

- Section « Le génome humain séquencé » et « Je retiens » : séquence de 2022 dite « presque complète », chromosome Y achevé en 2023.
- Section « Des traces de sélection naturelle » : la peste noire est datée « 1347-1352, au XIVe siècle ».
- Contrôle `cours` relancé : le nettoyage HTML ne retire rien.


## Seconde vérification indépendante

Les 8 questions modifiées (`ch4-modifiees.txt`) ont été résolues à nouveau par un second relecteur indépendant, sans les réponses et avec le texte complété du chapitre : **accord 8/8**. Ses remarques portaient sur des variantes déjà acceptées. Aucune modification.

## Questions laissées à relire

Aucune question ne reste douteuse après arbitrage.

À relire : aucune
