# Relecture de la banque du chapitre 6 d'anglais (LVA, 1re)

## Méthode

- Résolution à l'aveugle des 150 questions par un relecteur qui n'a pas écrit la banque, à partir des seuls énoncés et propositions, avec le texte du chapitre.
- Comparaison automatique de ses réponses avec celles de la banque (`comparer.py`).
- Relecture complète de toutes les questions, réponses, variantes acceptées et explications, en portant une attention particulière aux question tags, aux réactions de surprise, aux réponses courtes à plusieurs formes et aux questions de grammaire construites sur le même schéma.

## Résultat à l'aveugle

- 150 concordances sur 150 au premier passage, 0 écart.
- Erreurs de la banque : 0. Erreurs du relecteur : 0.
- Ambiguïtés repérées pendant la résolution malgré la concordance : 5 (questions 090, 134, 136, 137, 138).
- Variantes de réponse courte manquantes : 3 (questions 077, 089, 141).

## Questions corrigées

| Source | Problème | Décision |
|---|---|---|
| anglais-1re:ch6:banque:090 | L'énoncé dit que « Spanish-speaking » est formé « d'un adjectif et d'un participe présent ». Or « Spanish » y est le complément de « speaking » (la langue, donc un nom), comme dans « English-speaking ». La réponse « vrai » suivait le cours mais était linguistiquement fausse. | Énoncé reformulé : le second élément, « speaking », est un participe présent (toujours vrai). Explication réécrite. |
| anglais-1re:ch6:banque:134 | « Your sister is a nurse, is she? » (tag de même polarité, qui exprime l'intérêt ou une déduction) existe en anglais correct : le distracteur était défendable. | Énoncé précisé : « Complète par le question tag qui demande confirmation ». |
| anglais-1re:ch6:banque:135 | Même schéma que 134 ; « haven't you » après une phrase négative est rare mais attesté. | Même précision dans l'énoncé, par cohérence. |
| anglais-1re:ch6:banque:136 | « She speaks Spanish, does she? » (tag de même polarité) est correct en anglais : distracteur défendable. | Même précision dans l'énoncé. |
| anglais-1re:ch6:banque:137 | « They visited Seattle last year, did they? » est correct en anglais (tag de même polarité) : distracteur défendable. | Même précision dans l'énoncé. |
| anglais-1re:ch6:banque:138 | « I'm late, am I? » est marginal mais possible avec le même sens de réaction. | Même précision dans l'énoncé. |
| anglais-1re:ch6:banque:077 | Variante en chiffres non acceptée. | Ajout de « 3-day ». |
| anglais-1re:ch6:banque:089 | Variante en chiffres non acceptée. | Ajout de « 6-month-old ». |
| anglais-1re:ch6:banque:141 | La forme britannique « No, they've not » n'était pas acceptée. | Ajout de « they've not » (apostrophes droite et typographique). |

Les bonnes réponses, les types, les difficultés et les positions des bonnes réponses n'ont pas changé.

Points examinés et laissés en l'état :
- 150 : « Has he? » serait aussi une réaction de surprise possible à « He's never been to Jamaica. », mais il ne figure pas parmi les propositions ; « Hasn't he? » (seule forme proposée, et celle du cours) est juste.
- 142 : « So I do. » est grammatical (acquiescement emphatique) mais ne signifie pas « moi aussi » : l'énoncé exclut bien ce distracteur.
- 094 : « Each state » serait aussi correct, mais n'est pas proposé.
- 127 : « how high » est déjà accepté à côté de « how tall ».
- 096, 097, 140 : la correction ignore la casse et la ponctuation finale, donc « Neither », « Either » et « can he? » sont acceptés.

## Texte du cours

- Dans la partie « Les adjectifs composés », l'exemple « a Spanish-speaking island » est rangé sous « adjectif / adverbe + participe ». Or « Spanish » y est un nom (la langue, complément de speaking) : la catégorie juste serait « nom + participe » (comme English-speaking, record-breaking). Cette imprécision n'a pas été corrigée dans le cours (hors du périmètre de cette relecture).
- Aucune erreur factuelle repérée (CARICOM 1973 et quinze membres, reggae à l'UNESCO en 2018, Walcott Nobel 1992, Barbade république en 2021, Jones Act 1917, Commonwealth 1952, référendums 2020 et 2024, Maria et environ 3 000 morts, Vancouver 1886, Space Needle 1962, Boeing 1916, Peace Arch 1921).

## Questions laissées à relire

Aucune.

## Contrôles

- `npx tsx outils/anglais.ts verifier 6` : « Banque du chapitre 6 conforme : 150 questions. »
- `python3 comparer.py 6` (après correction) : « Chapitre 6 : 150 questions, 150 concordantes, 0 écarts, 0 sans réponse du relecteur. »
