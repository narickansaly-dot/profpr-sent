# Relecture de la banque du chapitre 6 de NSI (traitement de données en tables)

**Méthode.** Relecture indépendante à l'aveugle : un sous-agent a reçu les 150 questions **sans les réponses attendues** ni les explications, avec le texte du chapitre, et les a résolues lui-même. Il a **exécuté en Python 109 expressions ou programmes**, dont les fonctions `doublons` et la jointure recopiées du cours, les comparaisons de chaînes, les conversions (int, float, ValueError) et les tris avec key et reverse. Comparaison automatique ensuite.

**Résultat.** 150 réponses justes sur 150 (la 140 a été répondue « 5.0 », acceptée par la comparaison numérique avec « 5 »). Quinze remarques ; corrections dans la banque et quatre ajouts au texte du cours.

## Corrections

| Question | Remarque du relecteur | Décision |
| --- | --- | --- |
| 046, 095, 117, 145 | set() et count absents du cours. | **Cours complété** (section « Doublons et tests de cohérence ») : t.count(v), set(t), len(t) != len(set(t)). |
| 073 | Le cours ne disait pas qu'une valeur contenant le séparateur est mise entre guillemets. | **Cours complété** (section « Importer une table »). |
| 103, 119 | int(" 12 ") vaut 12 : absent du cours. | **Cours complété** (même section). |
| 096 | « Majuscules avant minuscules » faux pour les majuscules accentuées. | **Cours précisé** : majuscules non accentuées avant les minuscules ; lettres accentuées après les autres. La proposition reste juste pour les exemples (lettres non accentuées). |
| 060 | « le type de la valeur » alors que la réponse est une valeur. | Corrigée : « Que renvoie … ». |
| 136, 139, 141 | Variantes refusées (« valeurs », « separated values », « ligne », « www.data.gouv.fr »). | Ajoutées. |

## Remarques sans changement

- 146 (« reverse=True ») et 147 (« delimiter=";" ») : variantes déjà acceptées.
- 140 : « 5 » et « 5.0 » sont tous deux acceptés (comparaison numérique).

## Contrôles automatiques

- `verifierBanque` (préfixe `nsi-1re`, 150 questions) : conforme. Types 75 / 30 / 30 (15 vrais, 15 faux) / 15 ; difficultés 60 / 60 / 30 ; positions 18 / 19 / 19 / 19.
- Avant la relecture, le biais de longueur (la bonne réponse était la plus longue dans 40 QCM sur 75) a été corrigé en allongeant des distracteurs : 27 sur 75.

## Points restants

Aucun : toutes les questions peuvent passer au statut `valide`.
