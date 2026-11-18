# Relecture de la banque du chapitre 4 de NSI (programmer en Python)

**Méthode.** Relecture indépendante à l'aveugle : un sous-agent a reçu les 150 questions **sans les réponses attendues** ni les explications, avec le texte du chapitre, et les a résolues lui-même. Il a reconstitué et **exécuté en Python 74 programmes** (une exécution par proposition quand une question en comporte plusieurs : 091, 094, 105) ; les boucles potentiellement infinies (035, 105, 133) ont tourné avec une limite de 1 000 itérations ; le type exact des exceptions a été vérifié. Comparaison automatique ensuite.

**Résultat.** 150 réponses identiques sur 150. Onze remarques ; corrections dans la banque et trois ajouts au texte du cours.

## Corrections

| Question | Remarque du relecteur | Décision |
| --- | --- | --- |
| nsi-1re:ch4:banque:069 | Deux tests révèlent l'erreur : « assert est_pair(5) == False » est aussi un test légitime qui échoue. | Corrigée : la question demande le test **correctement écrit** qui révèle l'erreur ; les trois distracteurs énoncent un résultat faux. |
| 066 | UnboundLocalError absent du cours. | **Cours complété** (section « Les fonctions ») ; proposition reformulée (« c est locale à ajoute et lue avant d'avoir reçu une valeur »). |
| 064, 119 | Modification d'une liste passée en paramètre non traitée dans le cours. | **Cours complété** : une fonction reçoit le même tableau, pas une copie. |
| 089 | Paramètre par défaut (b=2) et opérateur ** absents du cours. | **Cours complété** (exemple puissance(a, b=2)). |
| 092 | -3 est un cas négatif plutôt qu'un cas limite. | Corrigée : « cas particuliers utiles (zéro, valeurs négatives) ». |
| 103 | Proposition « assert somme(1) == 0, qui teste un résultat faux » confuse (la virgule évoque le message d'assertion). | Corrigée : remplacée par « assert somme(0) >= 0 ». |
| 150 | Récursivité (programme de terminale) et expression conditionnelle absente du cours. | Remplacée : somme des chiffres de 987 par une boucle while (réponse 24). |
| 141, 145, 146 | Variantes « Augusta Ada », « randint() », « doc string ». | Ajoutées. |

## Contrôles automatiques

- `verifierBanque` (préfixe `nsi-1re`, 150 questions) : conforme. Types 75 / 30 / 30 (15 vrais, 15 faux) / 15 ; difficultés 60 / 60 / 30 ; positions 19 / 19 / 18 / 19 ; bonne réponse strictement la plus longue dans 26 QCM sur 75 (35 %, sous le seuil de 40 %).
- Les programmes des énoncés tiennent sur une ligne (« ; ») ou sont décrits en mots ; l'indentation est sans ambiguïté pour tous selon le relecteur.

## Points restants

- 150 a été réécrite après la relecture : la boucle while a été vérifiée en Python (f(987) = 24).
- Toutes les questions peuvent passer au statut `valide`.
