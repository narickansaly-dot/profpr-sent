# Relecture de la banque du chapitre 12 (spécialité maths, 1re) : variables aléatoires réelles

Banque : `maths-spe-ch12.json`, 150 questions, sources `maths-spe-1re:ch12:banque:001` à `150`.

## Méthode

1. **Rédaction** : valeur de chaque bonne réponse numérique, fausseté de chaque distracteur et vérité de chaque proposition calculable des QCM multiples vérifiées par script en fractions exactes ; 8 à 10 `qcm_unique` conceptuels (traduction en symboles) relus à la main ; proportions de simulation du cours issues d'un vrai tirage Python.
2. **Relecture indépendante** : un second agent a reçu les 150 énoncés **sans les réponses ni les explications**, les a résolus en refaisant chaque calcul en fractions exactes et en réexécutant les fonctions Python des énoncés (`esperance`, `frequence`…).
3. **Comparaison automatique** de ses réponses avec les réponses attendues.

## Résultat

- **150 / 150 réponses concordantes**, 0 désaccord, 0 doute signalé.

## Points de doute du rédacteur

- E(X + Y) = E(X) + E(Y) est ajouté et démontré par une somme sur les issues : interprétation de « linéarité de l'espérance » ([N43]).
- Un seul écart type en réponse courte (σ = 1,9, valeur exacte) ; les autres passent par des QCM avec √.
- Quelques énoncés décrivent du code Python sur une seule ligne, en texte brut.
- La loi binomiale n'est pas nommée (hors programme de 1re).

## Statut

Aucune question douteuse : les 150 questions passent en `valide`.
