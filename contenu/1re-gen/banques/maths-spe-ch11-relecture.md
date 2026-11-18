# Relecture de la banque du chapitre 11 (spécialité maths, 1re) : probabilités conditionnelles et indépendance

Banque : `maths-spe-ch11.json`, 150 questions, sources `maths-spe-1re:ch11:banque:001` à `150`.

## Méthode

1. **Rédaction** : chaque bonne réponse numérique calculée en fractions exactes, chaque distracteur contrôlé comme différent ; nombres de chemins des épreuves de Bernoulli obtenus par énumération ; indépendances sur un dé testées par ensembles ; exemples du cours recalculés ; valeurs de Monte-Carlo issues d'une vraie exécution (graine 2026).
2. **Relecture indépendante** : un second agent a reçu les 150 énoncés **sans les réponses ni les explications**, les a résolus en refaisant chaque calcul en fractions exactes avec Python et a signalé les ambiguïtés.
3. **Comparaison automatique** de ses réponses avec les réponses attendues.

## Résultat

- **150 / 150 réponses concordantes**, 0 désaccord.
- 1 doute signalé malgré l'accord :

| Question | Doute | Décision |
| --- | --- | --- |
| 145 (QCM multiple, programme `aire_parabole`) | « Chaque point est tiré dans le carré [0 ; 1] × [0 ; 1] » : `random()` tire dans [0 ; 1[ | **Reformulée** : « chaque coordonnée x et y est un nombre aléatoire compris entre 0 et 1 » (vraie sans discussion de borne). Bonnes réponses inchangées (1, 2, 4). |

## Points de doute du rédacteur

- Question 072 (dépistage) : réponse « environ 0,154 » (valeur exacte 2/13), seul arrondi de la banque, en QCM.
- Questions 088 et 096 : événements indépendants sur un dé (« multiple de 3 » et « pair ») ; juste par le calcul, peut surprendre (point travaillé dans le cours).
- Les nombres de chemins 1-3-3-1 et 1-4-6-4-1 sont comptés sur l'arbre, sans nommer de coefficients binomiaux (hors programme de 1re).
- « Pour aller plus loin » : marche aléatoire, épreuves multiples et paradoxe des deux enfants (non cité par le programme). L'aire 1/3 sous la parabole est donnée comme démontrée en terminale.

## Statut

Après correction, aucune question douteuse restante : les 150 questions passent en `valide`.
