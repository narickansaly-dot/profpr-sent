# Relecture de la banque du chapitre 3 de mathématiques (2de) contre le cours

Relecture des 150 questions de `maths-ch3.json` contre le texte du chapitre « Algorithmique et programmation en Python », question par question. Mêmes critères qu'aux chapitres 1 et 2. Chaque résultat de programme a été recalculé à la main (tableau de suivi).

## Répartition

- Types : 75 `qcm_unique`, 30 `qcm_multiple`, 30 `vrai_faux` (15 vrais, 15 faux), 15 `reponse_courte`.
- Difficultés : 60 / 60 / 30.
- Notions (9) : Algorithmes et programmes ; Variables et types ; Affectation et séquence ; Opérations en Python ; Instruction conditionnelle ; Boucle bornée for ; Boucle non bornée while ; Fonctions ; Hasard et simulation.

## Corrections faites pendant la rédaction

| Énoncé | Problème | Décision |
| --- | --- | --- |
| « On exécute u = 10, puis trois fois de suite u = u / 2 + 1 » | Bonne réponse fausse (2.5 au lieu de 3.0) et explication incohérente. | Retirée. |
| QCM multiple « a = 100, puis while a > 10: a = a // 2 » | 12 était proposé comme valeur jamais prise, alors que a vaut 12 avant 6. | Distracteurs remplacés par 10 et 3. |
| QCM multiple « Quelles expressions valent 3 » | Une proposition contenait sa propre justification (« 9 ** 0.5 arrondi… »). | Remplacée par « 27 // 9 ». |
| Paires d'énoncés (17 % 5 / 17 // 5, type de 7 / type de 3.5, notes 13 / 16…) | Similarité supérieure à 0,8. | Reformulées. |

## Points de doute

| Énoncé | Doute | Proposition |
| --- | --- | --- |
| Programmes écrits sur une ligne dans les énoncés (« if x > 0: y = x, else: y = −x », « while s < 20: n = n + 1, s = s + n ») | L'énoncé d'une question est affiché dans un paragraphe : les retours à la ligne et l'indentation sont perdus. Ces écritures, avec des virgules, ne sont pas du Python exécutable ; elles décrivent le programme. Le cours prévient l'élève (encadré « Attention » de la première section). | Garder ; demander une évolution de l'affichage des énoncés (voir le bilan). |
| Signe moins dans les énoncés (« x = x − 1 ») | Le texte utilise le signe moins typographique (U+2212) ; Python n'accepte que le trait d'union. Les programmes du cours, eux, utilisent le trait d'union. | Garder dans les énoncés (lecture), à harmoniser si l'on veut des programmes copiables. |
| « Que renvoie aire_rectangle(4, 2.5) ? » → « 10.0 » | Exact (produit d'un entier et d'un flottant). | Garder. |
| « Quel type pour… » (questions de choix de type) | Deux questions retirées pour équilibrer les difficultés ; il en reste une sur les flottants et une sur les booléens. | — |
| Réponse courte « float » | Accepte seulement « float » (pas « flottant »). | Ajouter « flottant » si l'enseignant le souhaite. |
| « Combien de valeurs parcourt range(0) ? » → « Aucune » | Juste, mais peu utile. | Garder (difficulté 1). |

## Texte du cours

- Les programmes sont dans des cadres (`div` avec bordure) : le HTML autorisé n'a ni `pre` ni `code`, ni police à chasse fixe. L'indentation est faite avec des espaces insécables.
- La fonction `succes(p)` sert de modèle pour les simulations du chapitre 11.
