# Relecture de la banque du chapitre 8 (spécialité maths, 1re) : trigonométrie

Banque : `maths-spe-ch8.json`, 150 questions, sources `maths-spe-1re:ch8:banque:001` à `150`.

## Méthode

1. **Rédaction** : chaque question a une vérification Python ; valeurs numériques recalculées ; pour les QCM, seule la bonne réponse est juste et chaque distracteur est faux ; identités des angles associés testées sur plusieurs réels ; solutions d'équations cherchées sur les multiples de π/12 en respectant les bornes ouvertes ou fermées ; valeurs d'Archimède recalculées par l'algorithme du cours. Une quinzaine de questions de pure définition ont une vérification codée à la main.
2. **Relecture indépendante** : un second agent a reçu les 150 énoncés **sans les réponses ni les explications**, les a résolus en refaisant chaque calcul avec Python, avec une attention particulière aux bornes des intervalles (questions 058 et 127 à 139).
3. **Comparaison automatique** de ses réponses avec les réponses attendues.

## Résultat

- **150 / 150 réponses concordantes**, 0 désaccord.
- 2 doutes signalés malgré l'accord, examinés, sans correction :

| Question | Doute | Décision |
| --- | --- | --- |
| 058 (vrai/faux, « exactement deux réels de [0 ; 4π] ») | Intervalle fermé : I est l'image de trois réels | Maintenue : c'est le piège voulu ; l'explication le dit et précise que l'affirmation serait vraie sur [0 ; 4π[. |
| 149 (vrai/faux, « hexagone inscrit : π ≈ 3,46 ») | Formulation piégeuse | Maintenue : l'hexagone inscrit donne 3, 3,46 = 2√3 vient de l'hexagone circonscrit ; distinction travaillée dans le cours et expliquée. |

## Points de doute du rédacteur

- « Pour aller plus loin » : angle π/2 + x, valeurs de cos(π/12) et sin(π/10) en vérification, et une simple mention des fonctions cosinus et sinus (terminale).
- Le cours présente cos x = cos a ⇔ x = a + 2kπ ou x = −a + 2kπ comme lecture du cercle, non exigée par le programme.
- Le cours signale la perte de précision du programme d'Archimède après une quinzaine de doublements et donne une forme stable.

## Statut

Aucune question douteuse : les 150 questions passent en `valide`.
