# Relecture de la banque du chapitre 9 (spécialité maths, 1re) : produit scalaire

Banque : `maths-spe-ch9.json`, 150 questions, sources `maths-spe-1re:ch9:banque:001` à `150`.

## Méthode

1. **Rédaction** : questions générées par script Python ; chaque réponse calculée est contrôlée par une assertion sur des vecteurs ou des points explicites, avec vérification que les distracteurs des QCM sont faux ; la formule MA⃗ · MB⃗ = MI² − AB²/4 est testée sur 100 tirages aléatoires.
2. **Relecture indépendante** : un second agent a reçu les 150 énoncés **sans les réponses ni les explications**, les a résolus en refaisant chaque calcul avec Python et a signalé les ambiguïtés.
3. **Comparaison automatique** de ses réponses avec les réponses attendues.

## Résultat

- **150 / 150 réponses concordantes**, 0 désaccord.
- 1 doute signalé malgré l'accord :

| Question | Doute | Décision |
| --- | --- | --- |
| 068 (vrai/faux) | « Le produit de la somme par la différence » : produit scalaire non nommé | **Reformulée** : « Le produit scalaire (u⃗ + v⃗) · (u⃗ − v⃗) vaut toujours ‖u⃗‖² − ‖v⃗‖². » (vrai). |

## Points de doute du rédacteur

- Le produit scalaire est défini par la projection orthogonale, la formule du cosinus en est déduite ; la bilinéarité est admise (justifiée par la projection).
- Notion renommée « Cercle de diamètre [AB] » (l'intitulé initial contenait des flèches combinantes, mal affichées dans les statistiques).
- Réponse courte « plus petit angle du triangle 4, 5, 6 » : 41° (valeur 41,4°), arrondi au degré demandé dans l'énoncé, réponse entière exacte sans marge.
- Question sur l'orthocentre (niveau 3) appuyée sur l'encadré « Pour aller plus loin » (concourance des hauteurs, approfondissement du programme).

## Statut

Après correction, aucune question douteuse restante : les 150 questions passent en `valide`.
