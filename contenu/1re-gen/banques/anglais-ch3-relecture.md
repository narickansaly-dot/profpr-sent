# Relecture de la banque du chapitre 3 d'anglais (LVA, 1re)

## Méthode

Un relecteur qui n'a pas écrit la banque a d'abord répondu aux 150 questions à l'aveugle, à partir des seuls énoncés et propositions (sans réponses ni explications) et du texte du chapitre « Art and power », en notant au passage les points ambigus. Ses réponses ont ensuite été comparées automatiquement à celles de la banque (`comparer.py`). Enfin, toutes les questions, réponses, variantes de réponses courtes et explications ont été relues : exactitude de l'anglais et des faits, lecture unique, distracteurs, doublons, typographie et tutoiement.

## Résultat à l'aveugle

- Concordances au premier passage : 150 sur 150.
- Écarts : 0 (aucune erreur de la banque, aucune ambiguïté ayant conduit à une réponse différente, aucune erreur du relecteur).
- La relecture complète a néanmoins relevé des variantes de réponses courtes manquantes, un distracteur défendable, une règle de cours présentée comme une vérité générale, un fait absent du texte et un indice donné par une autre question (voir le tableau).

## Questions corrigées

| Source | Problème | Décision |
| --- | --- | --- |
| anglais:ch3:banque:012 | Variantes manquantes avec virgule (« Washington, D.C. », « Washington, DC »), que la normalisation ne ramène pas aux formes déjà acceptées. | Ajout des deux variantes. |
| anglais:ch3:banque:019 | Le nombre écrit en lettres (« sixty ») n'était pas accepté. | Ajout de « sixty ». |
| anglais:ch3:banque:114 | Forme contractée du past perfect non acceptée. | Ajout de « 'd taken » et « ’d taken » (« took » reste accepté, comme dans la banque). |
| anglais:ch3:banque:127 | L'énoncé affirmait que la photo de Lange avait « changé l'opinion publique en 1936 », ce que le texte ne dit pas. | Phrase remplacée par « Lange's photo ___ encourage the government to send help. », conforme au texte ; explication ajustée. |
| anglais:ch3:banque:134 | Le distracteur « hardly » est défendable : « The portrait was hardly amazing » est un anglais correct (ironique). | « hardly » remplacé par « much », incorrect devant un adjectif seul ; explication complétée. |
| anglais:ch3:banque:146 | « very terrifying » et « very ridiculous » se rencontrent en anglais courant ; la règle n'est vraie que comme norme scolaire du cours. | Énoncé précisé : « Selon le cours, quels adverbes accompagnent… ». |
| anglais:ch3:banque:066 | La proposition « He witnessed the Soweto uprising. » donnait mot pour mot la réponse de la question 078. | Exemples remplacés par « Lange witnessed (to) the crisis. » ; bonnes réponses inchangées. |
| anglais:ch3:banque:032 | Explication maladroite (« célèbrent le pouvoir ou le reconnaissent ») qui ne rendait pas compte des fresques du Federal Art Project. | Explication reformulée. |

Aucune position de bonne réponse ni aucun vrai/faux n'a été modifié.

## Texte du cours

Aucune erreur factuelle repérée : dates (1558-1603, vers 1588, 2018, 1935-1943, 1940-1941, 1939, 1964 et 1960, 1897, 2022 et 72 objets, 1751, 1805, 1841 et 1843, 1936, 1942, 1976), attributions et descriptions sont exactes. Deux imprécisions mineures, sans conséquence pour la banque :

- « the first Black artists chosen by the gallery for an official presidential portrait » : Amy Sherald a peint le portrait de la Première dame, qui n'est pas à proprement parler un portrait présidentiel.
- « Fifty years later, James Gillray… » : environ cinquante ans séparent 1751 de 1805 (54 ans) ; l'approximation est acceptable.

## Questions laissées à relire

Aucune.

## Contrôles

- `npx tsx outils/anglais.ts verifier 3` : « Banque du chapitre 3 conforme : 150 questions. »
- `python3 comparer.py 3` (après correction) : « Chapitre 3 : 150 questions, 150 concordantes, 0 écarts, 0 sans réponse du relecteur. »
