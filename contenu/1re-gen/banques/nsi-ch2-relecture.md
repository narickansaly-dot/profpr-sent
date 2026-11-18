# Relecture de la banque du chapitre 2 de NSI (relatifs, flottants, textes)

**Méthode.** Relecture indépendante à l'aveugle : un sous-agent a reçu les 150 questions **sans les réponses attendues** ni les explications, avec le texte du chapitre, et les a résolues lui-même. Il a **exécuté en Python** les 91 questions calculables (environ 100 évaluations) : complément à 2, conversions binaires et hexadécimales, nombres à virgule, flottants (0.1 + 0.2, sum([0.1] * 10), 1e16 + 1…), encodages (ord, chr, encode, decode en UTF-8 et Latin-1). Ses réponses ont été comparées automatiquement aux réponses attendues.

**Résultat.** 150 réponses identiques sur 150. Dix remarques ; trois corrections.

## Corrections

| Question | Remarque du relecteur | Décision |
| --- | --- | --- |
| nsi-1re:ch2:banque:086 | « IEEE 754, 2008 » est défendable (révision IEEE 754-2008). | Corrigée : distracteur remplacé par « IEEE 754, 1936 » ; l'explication mentionne la révision de 2008. |
| nsi-1re:ch2:banque:100 | « compris entre −20 et −10 » : bornes incluses ou non ? Les deux bornes sont les bonnes réponses. | Corrigée : « (bornes incluses) ». |
| nsi-1re:ch2:banque:129 | « 0,1 en base 2 vaut 0,1 en base 10 » est ambigu. | Corrigée : « Le nombre binaire 0,1₂ vaut 0,1 en base 10. » (faux). |

## Remarques sans changement

| Question | Remarque | Pourquoi rien ne change |
| --- | --- | --- |
| 139 | « UTF8 » sans tiret | déjà accepté (ainsi que « utf 8 ») |
| 140, 144, 149 | écriture avec un point (0.1, 0.101, 0.8125) | déjà acceptée ; de plus la comparaison numérique accepte virgule et point |
| 141, 143 | signe moins : « -128 » et « −128 » | les deux sont acceptés |
| 147 | « math.isclose » | déjà accepté |

## Contrôles automatiques

- `verifierBanque` (préfixe `nsi-1re`, 150 questions) : conforme. Types 75 / 30 / 30 (15 vrais, 15 faux) / 15 ; difficultés 60 / 60 / 30 ; positions des bonnes réponses 18 / 19 / 19 / 19 ; bonne réponse strictement la plus longue dans 17 QCM sur 75.
- Réponses courtes : aucune marge ; les nombres négatifs sont acceptés avec le tiret et avec le signe moins ; aucune réponse de plus de quatre chiffres.

## Points restants

Aucun : toutes les questions peuvent passer au statut `valide`.
