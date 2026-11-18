# Relecture de la banque du chapitre 5 d'anglais (LVA, 1re)

## Méthode

Un relecteur qui n'a pas écrit la banque a d'abord répondu aux 150 questions à l'aveugle, à partir des seuls énoncés et propositions (sans réponses ni explications) et du texte du chapitre « Humans and nature », en notant au passage les points ambigus. Ses réponses ont ensuite été comparées automatiquement à celles de la banque (`comparer.py`). Enfin, toutes les questions, réponses, variantes de réponses courtes et explications ont été relues : exactitude de l'anglais et des faits, lecture unique, distracteurs, doublons, typographie et tutoiement.

## Résultat à l'aveugle

- Concordances au premier passage : 150 sur 150.
- Écarts : 0 (aucune erreur de la banque, aucune ambiguïté ayant conduit à une réponse différente, aucune variante manquante, aucune erreur du relecteur).
- La relecture complète a néanmoins relevé deux explications fausses, une explication incomplète, un énoncé imprécis et une phrase anglaise peu naturelle (voir le tableau).

## Questions corrigées

| Source | Problème | Décision |
| --- | --- | --- |
| anglais:ch5:banque:147 | L'explication désignait « les deux premières phrases » comme gérondifs sujets, alors que ce sont la première et la dernière (« Hiking in the rain… », « Recycling saves energy. »). | Explication corrigée : « Dans la première et la dernière phrase… ; dans les deux autres… ». |
| anglais:ch5:banque:117 | L'explication attribuait la contrainte à « la dernière phrase », qui est en réalité « We were let to camp » ; la phrase de contrainte est « We were made to camp ». Elle ne justifiait pas non plus « be permitted to ». | Explication reformulée : « let » n'a pas de passif, d'où « be allowed to » ou « be permitted to » ; la phrase avec « made » exprime une contrainte. |
| anglais:ch5:banque:099 | Le distracteur « can » n'était pas commenté ; il est faux (présent, alors que la phrase porte sur « last year »), mais l'explication ne le disait pas. | Explication complétée. La question reste sans ambiguïté : « could », qui ne s'emploie pas pour une réussite ponctuelle, ne figure pas parmi les propositions. |
| anglais:ch5:banque:085 | L'énoncé demandait le modal qui « exprime l'obligation » dans une phrase négative qui exprime l'interdiction (« Visitors ___ not enter this area. »). | Énoncé précisé : « quel modal d'obligation, employé ici à la forme négative, exprime l'interdiction ? ». |
| anglais:ch5:banque:134 | « Carry on walking until the lake », repris du cours, est peu idiomatique (« until » introduit un moment ou une proposition, pas un lieu). | Remplacé par « Carry on walking as far as the lake » ; traduction et réponse (vrai) inchangées. |

Aucune position de bonne réponse ni aucun vrai/faux n'a été modifié.

Points examinés et laissés en l'état :

- Vocabulaire absent du texte du chapitre : « a heatwave » (072), « grow up » et « turn off » (132, 135), « turn back » et « pick up » (133), « permitted » (092, 117). Ce sont des mots courants du niveau collège ou transparents (permitted / permis, heat + wave) ; la règle testée en 135 (pronom avant la particule) est dans le cours ; en 133, le contexte (« as they left ») permet de comprendre « turned back ». Les remplacer par des phrasal verbs du cours aurait donné la réponse d'autres questions (123 à 137 testent déjà chacun d'eux). « permitted » est de l'anglais correct et sa présence parmi les bonnes réponses de 117 est justifiée par l'explication.
- 023 : seule « 1800 » est acceptée, conformément à la règle « jamais de séparateur de milliers ».

## Texte du cours

Aucune erreur factuelle repérée : dates (1872, 1916, 1838, 1890, 1892, 1903, 1885, 1932, 1951, 14 avril 1935, 1939, 29 août 2005, 2019-2020, 1807, 1845, 1854, années 1820, 2017), chiffres (80 %, plus de 1 800 morts, près de trois milliards d'animaux) et attributions sont exacts. Imprécisions mineures :

- « Carry on walking until the lake » (tableau des phrasal verbs) est peu idiomatique ; « as far as the lake » ou « until you reach the lake » serait plus naturel.
- « I Wandered Lonely as a Cloud (1807) » : le poème a été écrit en 1804 et publié en 1807 ; la date de publication est acceptable.
- Banff (1885) : la réserve de Banff date de 1885 et le parc national (Rocky Mountains Park) de 1887 ; la date de 1885 est celle que l'on retient couramment.

## Questions laissées à relire

Aucune.

## Contrôles

- `npx tsx outils/anglais.ts verifier 5` : « Banque du chapitre 5 conforme : 150 questions. »
- `python3 comparer.py 5` (après correction) : « Chapitre 5 : 150 questions, 150 concordantes, 0 écarts, 0 sans réponse du relecteur. »
