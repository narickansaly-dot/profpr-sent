# Relecture de la banque du chapitre 1 d'anglais (LVA, 1re)

## Méthode

Un relecteur qui n'a pas écrit la banque a d'abord répondu à l'aveugle aux 150 questions (énoncés et propositions seulement, avec le texte du chapitre), en notant les questions ambiguës. Ses réponses ont ensuite été comparées automatiquement à celles de la banque (`comparer.py`). Pour finir, il a relu toute la banque : énoncés, propositions, réponses, variantes de réponses courtes, explications, typographie et tutoiement.

## Résultat à l'aveugle

- Concordances au premier passage : 150 sur 150.
- Écarts : 0 (aucune erreur de la banque, aucune ambiguïté bloquante, aucune variante manquante décelée par la comparaison, aucune erreur du relecteur).
- Les points notés pendant la résolution (008, 062, 115) ont été traités lors de la relecture complète. Les autres (024, 075, 097, 131) ont été jugés corrects tels quels.

## Questions corrigées

| Source | Problème | Décision |
| --- | --- | --- |
| anglais-1re:ch1:banque:001 | Explication mêlant anglais et français au milieu d'une phrase (« through Pier 21, dans le port d'Halifax »). | Citation anglaise complète du texte, suivie d'une glose française. |
| anglais-1re:ch1:banque:008 | « au minimum » alors que le texte dit « more than 25,000 » (strictement, plus de 25 000). | Énoncé reformulé : « le Canada a accueilli plus de combien de réfugiés syriens… ». Réponse inchangée (25000). |
| anglais-1re:ch1:banque:010 | Explication incorrecte, avec un sujet français suivi d'un verbe anglais (« Le navire et ses 376 passagers… was turned away »). | Citation anglaise complète et correcte du texte, suivie d'une glose française. |
| anglais-1re:ch1:banque:062 | « Quel mot complète » alors que les propositions sont des expressions de deux mots. | « Quelle expression complète ». |
| anglais-1re:ch1:banque:064 | Explication fautive (« On immigrate to un pays »). | « On dit to immigrate to + pays : la préposition to indique la destination. » |
| anglais-1re:ch1:banque:115 | Variante manquante : « had never needed », la forme du texte, est une négation correcte au past perfect. | Variante ajoutée et explication complétée. |

## Texte du cours

- « In 1921, Ireland was divided. Twenty-six counties became the Irish Free State » : la partition prend bien effet en 1921 (Government of Ireland Act de 1920), mais l'État libre d'Irlande n'est créé qu'en décembre 1922. C'est une imprécision mineure, sans conséquence sur les questions 034 et 035.
- Les autres faits vérifiés sont exacts : Pier 21, système à points de 1967, multiculturalisme de 1971, recensement de 2021, head tax, Komagata Maru et excuses de 2006 et 2016, Windrush, British Nationality Act, carnaval de Notting Hill, Sam King, scandale de 2018, Troubles, accord du Vendredi saint, Windsor Framework, Common Travel Area de 1923.

## Questions laissées à relire

Aucune.

## Contrôles

- `npx tsx outils/anglais.ts verifier 1` : « Banque du chapitre 1 conforme : 150 questions. »
- `python3 comparer.py 1` (après correction) : « Chapitre 1 : 150 questions, 150 concordantes, 0 écarts, 0 sans réponse du relecteur. »
