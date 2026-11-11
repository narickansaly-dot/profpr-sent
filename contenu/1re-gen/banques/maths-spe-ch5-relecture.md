# Relecture de la banque du chapitre 5 (spécialité maths, 1re) : fonction dérivée

Banque : `maths-spe-ch5.json`, 150 questions, sources `maths-spe-1re:ch5:banque:001` à `150`.

## Méthode

1. **Rédaction** : questions générées par script Python, valeurs vérifiées par le calcul.
2. **Relecture indépendante** : un second agent a reçu les 150 énoncés **sans les réponses ni les explications**, les a résolus en refaisant chaque dérivée et chaque valeur avec Python (sympy), et a signalé les ambiguïtés.
3. **Comparaison automatique** de ses réponses avec les réponses attendues.

## Résultat

- **150 / 150 réponses concordantes**, 0 désaccord.
- 14 doutes signalés malgré l'accord :

| Question | Doute | Décision |
| --- | --- | --- |
| 018, 041, 063, 085 | Tournures incorrectes (« par quoi dérive-t-on… ») | **Reformulées** (« quelle est la dérivée de… ») ; réponses inchangées. |
| 021, 035, 055, 068, 103, 114 (réponses courtes) | Accepter fractions, virgule ou point, « − » ou « - » | Déjà le cas : les variantes décimales et fractionnaires sont listées. |
| 079 | « f′(0) = 0 » fausse car 0 hors de l'intervalle d'étude | **Explication complétée** (0 hors de ]0 ; +∞[, f non dérivable en 0). |
| 089 | Écriture « 2u′u » inhabituelle | Maintenue (égale à 2uu′, vrai). |
| 118 | Forme −1/(2x√x) | Maintenue : le calcul −v′/v² = −1/(2x√x) est donné dans l'explication et figure dans le cours. |
| 120 | x/(x + 1) = 1 − 1/(x + 1) pourrait se dériver avec (1/v)′ : « directement » flou | **Corrigée** : proposition remplacée par x ↦ √x/(x + 1), qui exige la formule du quotient. Bonnes réponses inchangées (1, 2). |

## Statut

Après corrections, aucune question douteuse restante : les 150 questions passent en `valide`.
