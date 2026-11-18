# Relecture de la banque du chapitre 2 d'anglais (LVA, 1re)

## Méthode

1. Résolution à l'aveugle des 150 questions par un relecteur qui n'a pas écrit la banque, à partir des seuls énoncés et propositions (réponses masquées) et du texte du chapitre.
2. Comparaison automatique de ces réponses avec la banque (`comparer.py`).
3. Relecture complète de toutes les questions, réponses et explications : exactitude de l'anglais et des faits, lecture unique, distracteurs, variantes des réponses courtes, doublons et questions qui donnent la réponse d'une autre, typographie, tutoiement.

## Résultat à l'aveugle

- 150 concordances sur 150 au premier passage.
- 0 écart : aucune erreur de la banque, aucune ambiguïté ni variante manquante révélée par la comparaison, aucune erreur du relecteur.

La relecture complète a toutefois relevé une explication fausse, quatre questions dont l'énoncé donnait la réponse d'une autre, une formulation imprécise et une variante de réponse courte manquante.

## Questions corrigées

| Source | Problème | Décision |
|---|---|---|
| anglais:ch2:banque:021 | L'énoncé (« Quel Chief Justice présidait… ») donnait la réponse de la question 034 (« Chief Justice »). | Énoncé reformulé : « Qui présidait la Cour suprême… ». |
| anglais:ch2:banque:038 | La bonne réponse « Un organe consultatif inscrit dans la Constitution » laissait croire que la Voice y avait été inscrite, alors que la proposition a été rejetée. | Remplacée par « Un organe consultatif à inscrire dans la Constitution ». |
| anglais:ch2:banque:044 | Explication fausse : elle attribuait aux partisans « les deux dernières propositions », dont l'une (symbolique, sans réel pouvoir) est un argument des critiques. | Explication réécrite en nommant les deux arguments des partisans (propositions 1 et 3). |
| anglais:ch2:banque:068 | Réponse courte : « integrated » (schools were integrated) est de l'anglais juste et naturel dans ce contexte. | Variante « integrated » ajoutée ; explication complétée. |
| anglais:ch2:banque:077 | L'explication présentait « to infringe the law » comme un équivalent soutenu courant ; infringe s'emploie surtout avec a rule, a right, copyright. | Explication nuancée. |
| anglais:ch2:banque:082 | L'énoncé (« Dans the Chief Justice… ») donnait aussi la réponse de 034. | Exemple remplacé par « Nine Justices sit on the Court » ; explication adaptée. |
| anglais:ch2:banque:087 | La phrase « The Justices ___ by the Senate » donnait la réponse de la question 018 (qui confirme les juges ?). | Nouveau contexte : « The new tenants ___ by the council » (are chosen), même position de la bonne réponse. |
| anglais:ch2:banque:095 | La phrase « They gave Māori men the vote in 1867 » donnait une réponse de la question 042. | Nouveau contexte : « They gave the tenants a new contract » (were given), même position de la bonne réponse. |

Aucun changement de position de bonne réponse ni de vrai/faux : les répartitions sont inchangées.

## Texte du cours

- Faits vérifiés : HOLC et cartes des années 1930, Fair Housing Act (avril 1968, une semaine après l'assassinat de Martin Luther King), Right to Buy (1980), Grenfell (juin 2017, 72 morts), Plessy (1896), Brown (1954, Earl Warren, unanimité), Marshall (1967), Loving (1967), Obergefell (2015), Roe (1973, renversé en 2022), fin de la prise en compte de la race dans les admissions (2023), Ginsburg (1993-2020), Sotomayor (2009), Jackson (2022), traité de Waitangi (1840, plus de 500 chefs), quatre sièges maoris (1867), sept circonscriptions aujourd'hui, te reo māori officiel (1987), référendum australien de 1967 (plus de 90 %), Voice rejetée le 14 octobre 2023 (environ 60 % de non, dans tous les États), citoyenneté des Amérindiens (1924), Deb Haaland (2021) : aucune erreur repérée.
- Imprécision mineure : dans le lexique, « to infringe / to break the law » ; « to infringe the law » est peu idiomatique (on dit plutôt to infringe a rule, a right, copyright). Le cours n'a pas été modifié.

## Questions laissées à relire

Aucune.

## Contrôles

- `npx tsx S/outils/anglais.ts verifier 2` : « Banque du chapitre 2 conforme : 150 questions. »
- `python3 S/comparer.py 2` (après correction) : « Chapitre 2 : 150 questions, 150 concordantes, 0 écarts, 0 sans réponse du relecteur. »
