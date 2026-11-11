# Relecture de la banque du chapitre 2 (spécialité maths, 1re) : suites arithmétiques et géométriques

Banque : `maths-spe-ch2.json`, 150 questions, sources `maths-spe-1re:ch2:banque:001` à `150`.

## Méthode

1. **Rédaction** : questions générées par script Python ; chaque valeur numérique (termes, sommes, seuils, intérêts, annuité, croisement linéaire/exponentiel) est recalculée par des assertions ; les programmes de seuil cités sont simulés.
2. **Relecture indépendante** : un second agent a reçu les 150 énoncés **sans les réponses ni les explications**, a résolu chaque question en refaisant les calculs avec Python, et a signalé toute ambiguïté.
3. **Comparaison automatique** de ses réponses avec les réponses attendues (QCM : ensembles d'indices ; vrai/faux ; réponses courtes : comparaison normalisée et numérique).

## Résultat

- **150 / 150 réponses concordantes**, 0 désaccord.
- 4 doutes signalés malgré l'accord, tous examinés :

| Question | Doute | Décision |
| --- | --- | --- |
| 018, 037, 113 (réponses courtes négatives) | Accepter « − » (U+2212) et « - » | Déjà le cas : `reponses_acceptees` liste les deux signes (et la virgule et le point pour 018). Aucun changement. |
| 128 (vrai/faux « raison > 1 donc croissante ») | Question piège | Maintenue : l'affirmation est fausse (contre-exemple uₙ = −2ⁿ donné dans l'explication) ; c'est un point du cours (condition u₀ > 0). |

## Points de doute du rédacteur

- Réponse courte « voiture » (8874 €, arrondie à l'unité) : marge absolue 0,5, adaptée à un arrondi à l'unité.
- Deux seuils serrés mais exacts (placement B > A à 12 ans : 8005 contre 8000 ; ville sous 40 000 habitants à 12 ans, 40 037 à 11 ans) : vérifiés par le script et par le relecteur.

## Statut

Aucune question douteuse restante : les 150 questions passent en `valide`.
