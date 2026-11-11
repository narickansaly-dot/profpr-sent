# Relecture de la banque du chapitre 2 de mathématiques (2de) contre le cours

Relecture des 150 questions de `maths-ch2.json` contre le texte du chapitre « Multiples, diviseurs et nombres premiers », question par question. Mêmes critères qu'au chapitre 1 (exactitude selon le cours, lecture unique, bonnes réponses seules justes, explication, niveau, variantes des réponses courtes, typographie, tutoiement).

## Répartition

- Types : 75 `qcm_unique`, 30 `qcm_multiple`, 30 `vrai_faux` (15 vrais, 15 faux), 15 `reponse_courte`.
- Difficultés : 60 / 60 / 30.
- Notions (9) : Multiples et diviseurs ; Critères de divisibilité ; Nombres pairs et impairs ; Nombres premiers ; Décomposition en facteurs premiers ; Fractions irréductibles ; Propositions et connecteurs ; Implication et réciproque ; Types de raisonnement.

## Corrections faites pendant la rédaction

| Énoncé | Problème | Décision |
| --- | --- | --- |
| « Quel chiffre placer à la place de ★ pour que 4★2 soit divisible par 3 sans l'être par 9 ? » | Deux bonnes réponses (0 et 6). | Retirée. |
| « Un entier est divisible par 2 et par 3. Par quel autre entier est-il forcément divisible ? » | La justification demande la notion de nombres premiers entre eux, absente du programme. | Retirée. |
| « Si une propriété est vraie pour 100 exemples, elle est démontrée. » | Doublon de la question sur la vérification des entiers de 1 à 1 000. | Retirée. |
| QCM multiple « fractions sous forme irréductible » | Une proposition (« 13/39 simplifiée en 1/3 ») mêlait calcul et réponse. | Remplacée par « 1/3 ». |
| Énoncés jumeaux (« divisible par 9 ⇒ par 3 » / « par 3 ⇒ par 9 », expressions toujours paires / impaires, décompositions de 12, 84, 1 000) | Similarité supérieure à 0,8. | Reformulés ou retirés. |

## Points de doute

| Énoncé | Doute | Proposition |
| --- | --- | --- |
| « On écrit (2k + 1)² = 2K + 1. Exprime K en fonction de k. » (réponse courte, difficulté 3) | Réponse algébrique : six variantes acceptées (2k² + 2k, 2k²+2k, 2k^2 + 2k, 2k(k + 1), 2(k² + k)…) ; une écriture comme « 2k*k+2k » sera refusée. | Garder en signalant la forme attendue, ou transformer en QCM. |
| Critères de divisibilité par 3 et 9 | Admis au collège ; le cours les rappelle sans démonstration. | Garder. |
| « Combien le nombre 2³ × 3² a-t-il de diviseurs positifs ? » (difficulté 3) | Le dénombrement (4 × 3) n'est pas une méthode du cours, qui dit seulement que les exposants sont bornés ; l'explication la détaille. | Garder en difficulté 3, ou retirer si jugée hors programme. |
| Division euclidienne (« 100 = 7 × 14 + 2 », « reste de 250 par 9 ») | Le programme cite « le plus grand multiple de a inférieur ou égal à b » ; le mot « reste » est employé sans définition formelle. | Garder ; vocabulaire du collège. |
| « Quelle est la négation de x > 3 ? » | Négation d'une inégalité : le programme demande la négation de propositions simples, ce qui inclut ce cas. | Garder. |
| Nombres écrits avec espace des milliers dans les énoncés et propositions (« 2 310 », « 1 000 ») | Le guide interdit l'espace des milliers dans les réponses acceptées, pas dans les énoncés. Aucune réponse courte n'en contient. | Conforme. |

## Texte du cours

- La propriété « tout entier n ⩾ 2 se décompose de façon unique » est présentée comme admise.
- L'algorithme `est_premier` est écrit en langage naturel ; il est programmé en Python au chapitre 3.

## Mise à jour d'après le programme de 2026

Le programme de 2026 (arrêté du 26 février 2026) retire les nombres premiers des contenus de seconde et ajoute la contraposée.

- Les 15 questions de la notion « Décomposition en facteurs premiers » ont été retirées et remplacées par 15 questions sur la **contraposée** (même répartition de types et de difficultés). La section du cours sur la décomposition est supprimée ; la contraposée est ajoutée à la section « Propositions, implication et réciproque ».
- Les nombres premiers sont gardés comme **rappels du collège** (section renommée « Nombres premiers (rappels du collège) », 21 questions) : ils servent d'exercices sur les diviseurs et d'exemples Python au chapitre 3. **Point à trancher** : les retirer aussi, ou les garder.
- La méthode de simplification des fractions n'utilise plus la décomposition, mais les critères de divisibilité.
- Les sources ont été renumérotées (rien n'avait encore été importé en base).
