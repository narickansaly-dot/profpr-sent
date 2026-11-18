# Relecture de la banque du chapitre 7 (spécialité maths, 1re) : fonction exponentielle

Banque : `maths-spe-ch7.json`, 150 questions, sources `maths-spe-1re:ch7:banque:001` à `150`.

## Méthode

1. **Rédaction** : questions générées par script Python ; valeurs numériques du cours et réponses courtes recalculées par des assertions ; programmes Python exécutés ; QCM et vrai/faux algébriques vérifiés à la main.
2. **Relecture indépendante** : un second agent a reçu les 150 énoncés **sans les réponses ni les explications**, les a résolus en refaisant chaque calcul avec Python et a signalé les ambiguïtés.
3. **Comparaison automatique** de ses réponses avec les réponses attendues.

## Résultat

- **150 / 150 réponses concordantes**, 0 désaccord.
- 9 doutes signalés malgré l'accord :

| Question | Doute | Décision |
| --- | --- | --- |
| 039, 057, 077, 097, 117, 135, 150 (réponses courtes décimales) | Accepter le point décimal | Déjà le cas (virgule et point listés ; fraction pour 039 et 150). Les arrondis (057, 077, 097, 117, 135) ont une marge absolue d'un demi-dernier chiffre. |
| 012 | « Dérivable sur ℝ » fait partie de la définition | Sans objet : cette proposition est déjà comptée juste (réponses 0, 1, 4). |
| 115 | « Vitesse de variation constante » pouvait se lire comme f′/f constant (vrai) | **Reformulée** : « la dérivée f′ est donc une fonction constante » (faux sans ambiguïté). |

## Points de doute du rédacteur

- La dérivée de x ↦ f(ax + b) n'est pas citée par le programme de 2026 : elle est ajoutée au cours, justifiée par le taux de variation, pour dériver exp(−x) et e^(at) ([C35]). **À trancher par l'enseignant.**
- Pas de logarithme : e^x = 3 et les demi-vies se résolvent par balayage (réponses arrondies avec marge).
- Distracteur « (1 ; 2,7) » proche de (1 ; e) : faux car e ≠ 2,7, maintenu.

## Statut

Après correction, aucune question douteuse restante : les 150 questions passent en `valide`.
