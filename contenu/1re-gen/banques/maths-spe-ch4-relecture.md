# Relecture de la banque du chapitre 4 (spécialité maths, 1re) : nombre dérivé et tangente

Banque : `maths-spe-ch4.json`, 150 questions, sources `maths-spe-1re:ch4:banque:001` à `150`.

## Méthode

1. **Rédaction** : questions générées par script Python ; valeurs des bonnes réponses et de la plupart des distracteurs recalculées en fractions exactes par des assertions ; programmes Python des énoncés exécutés.
2. **Relecture indépendante** : un second agent a reçu les 150 énoncés **sans les réponses ni les explications**, les a résolus en refaisant chaque calcul avec Python (sympy, exécution du code des énoncés) et a signalé les ambiguïtés.
3. **Comparaison automatique** de ses réponses avec les réponses attendues.

## Résultat

- **150 / 150 réponses concordantes**, 0 désaccord.
- 3 doutes signalés malgré l'accord :

| Question | Doute | Décision |
| --- | --- | --- |
| 045 (QCM multiple sur (f(2 + h) − f(2))/h = 3 − h) | La proposition « f(2) = 3 » n'est ni confirmée ni infirmée par les données : distracteur défendable seulement comme « non déductible » | **Corrigée** : remplacée par « f′(2) = 2 », fausse sans ambiguïté ; explication mise à jour. Bonnes réponses inchangées (0, 1, 4). |
| 129 (vrai/faux : tangente verticale de la racine carrée en O) | Le cours l'énonce-t-il ? | Maintenue : la section « Points de non-dérivabilité » et sa figure parlent de la tangente verticale en 0. |
| 150 (QCM multiple sur `round` dans le programme des sécantes) | Proposition sur `round` elliptique | **Reformulée** : « round renvoie 10 même si (b - a) / h vaut 9.999999999999998 à cause des arrondis des flottants ». Bonnes réponses inchangées. |

## Points de doute du rédacteur

- Coût marginal défini comme C′(q) ; la question sur C′(20) n'offre pas 51 (valeur de C(21) − C(20)) parmi les propositions, pour éviter une double réponse défendable.
- Question « augmentation de 2 % deux années de suite » (réponse 4 % par l'approximation affine) et question du taux sur [0 ; 1] lu dans la liste des sécantes : confirmées par le relecteur.
- Bonne réponse ex aequo la plus longue dans 41 % des `qcm_unique` (souvent des nombres de même longueur) ; strictement la plus longue dans 8 cas sur 75 : le contrôle automatique passe.

## Statut

Après correction, aucune question douteuse restante : les 150 questions passent en `valide`.
