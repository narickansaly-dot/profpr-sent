# Relecture de la banque du chapitre 4 d'anglais (LVA, 1re)

## Méthode

- Résolution à l'aveugle des 150 questions par un relecteur qui n'a pas écrit la banque, à partir des seuls énoncés, propositions et du texte du chapitre (« Science and responsibility »), sans accès aux réponses attendues.
- Comparaison automatique des réponses du relecteur avec celles de la banque (`comparer.py`).
- Relecture complète de toutes les questions, réponses, variantes de réponses courtes et explications : exactitude de l'anglais et des faits, unicité de la lecture, distracteurs, typographie, tutoiement.

## Résultat à l'aveugle

- 150 concordances sur 150 au premier passage, 0 écart.
- Erreurs de la banque : 0 ; ambiguïtés : 0 bloquante ; variantes manquantes : 0 ; erreurs du relecteur : 0.
- Points examinés en particulier :
  - 082 (« Is the mission worth the ___? ») : cost et price sont tous deux acceptés ; aucune autre variante naturelle.
  - 124 (be likely to) : les trois distracteurs (« is likely to », « are like to », « are likely ») sont tous fautifs ; une seule réponse possible.
  - 066 (combustibles fossiles) : natural gas est absent du texte mais est indiscutablement un combustible fossile ; la question est conservée, l'explication le dit désormais clairement.

## Questions corrigées

| Source | Problème | Décision |
| --- | --- | --- |
| anglais:ch4:banque:066 | « natural gas » compte parmi les bonnes réponses alors que le cours ne cite que coal et oil ; l'explication présentait les trois comme s'ils venaient du cours. | Bonne réponse conservée (fait exact, connaissance générale de niveau B1+) ; explication réécrite : le cours cite coal et oil, natural gas en est un aussi car extrait du sous-sol ; tides et wind sont renouvelables. |
| anglais:ch4:banque:091 | L'énoncé parle d'« expression soulignée » alors qu'aucun soulignement n'est affiché. | Énoncé reformulé : que signifie "clinical applications" ? |

## Texte du cours

Aucune erreur factuelle repérée (dates et chiffres vérifiés : traité de 1967, SpaceX 2002 et 2015, vols de juillet 2021, loi américaine de 2015, accords Artemis 2020, Watt 1769, Forties 1970, Longannet 2016, Hywind 2017, Seagreen 114 turbines, objectif 2045, Frankenstein 1818, Brave New World 1932, Galton 1883, Cour suprême 1927, Dolly 1996, génome humain 2003, CRISPR 2023).

## Questions laissées à relire

Aucune.

## Contrôles

- `npx tsx S/outils/anglais.ts verifier 4` : « Banque du chapitre 4 conforme : 150 questions. »
- `python3 S/comparer.py 4` : « Chapitre 4 : 150 questions, 150 concordantes, 0 écarts, 0 sans réponse du relecteur. »
