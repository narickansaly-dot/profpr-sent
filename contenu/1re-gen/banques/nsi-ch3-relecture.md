# Relecture de la banque du chapitre 3 de NSI (booléens, expressions logiques et circuits)

**Méthode.** Relecture indépendante à l'aveugle : un sous-agent a reçu les 150 questions **sans les réponses attendues** ni les explications, avec le texte du chapitre, et les a résolues lui-même. Il a lancé **166 évaluations réelles en Python** : toutes les expressions booléennes, les tables de vérité (énumérées avec itertools.product), les équivalences (De Morgan, distributivité), l'évaluation séquentielle (fonctions qui affichent, IndexError, ZeroDivisionError, KeyError), les additionneurs et le calcul binaire. Ses réponses ont été comparées automatiquement aux réponses attendues.

**Résultat.** 150 réponses identiques sur 150. Douze remarques ; corrections dans la banque et deux ajouts au texte du cours.

## Corrections

| Question | Remarque du relecteur | Décision |
| --- | --- | --- |
| nsi-1re:ch3:banque:028 | « 1 bit » attendu, mais un booléen occupe en pratique un octet : le distracteur 8 est défendable. | Corrigée : « au minimum ». |
| 066, 104, 119, 150 | Le cours ne disait pas que and et or renvoient l'un de leurs opérandes (0 or 'NSI', 'NSI' and 0). | **Texte du cours complété** (section « L'évaluation séquentielle ») : règle des valeurs renvoyées, avec ces exemples. Questions inchangées. |
| 070 | « au minimum 8 additionneurs complets » discutable : le rang 0 peut être un demi-additionneur. | Corrigée : « un additionneur (demi ou complet) par rang » ; explication précisée. |
| 074 | Les comparaisons enchaînées (5 > 3 > 1) n'étaient pas dans le cours. | **Texte du cours complété** (section « Les booléens en Python »). |
| 103 | Le rang 0 n'était pas défini comme le bit de poids faible. | Corrigée : « Le rang 0 (bit de poids faible) ». |
| 144 | Variantes « ou », « ∨ » refusées. | Ajoutées aux réponses acceptées. |
| 149 | Variante « 0b10001 ». | Ajoutée. |

## Remarques sans changement

- 141 (« George Boole ») et 145 (« ET », « porte AND ») : variantes déjà acceptées.
- 149 : le résultat tronqué « 0001 » reste refusé : l'énoncé demande le résultat de l'addition, pas un calcul sur 4 bits.

## Contrôles automatiques

- `verifierBanque` (préfixe `nsi-1re`, 150 questions) : conforme. Types 75 / 30 / 30 (15 vrais, 15 faux) / 15 ; difficultés 60 / 60 / 30 ; positions des bonnes réponses 19 / 19 / 19 / 18 ; bonne réponse strictement la plus longue dans 18 QCM sur 75.
- Espaces insécables : le convertisseur traitait par erreur « &lt; … &gt; » comme une balise ; corrigé avant la relecture.

## Points restants

Aucun : toutes les questions peuvent passer au statut `valide`.
