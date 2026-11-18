# Relecture de la banque du chapitre 1 de NSI (bases 2, 10 et 16)

**Méthode.** Relecture indépendante à l'aveugle : un sous-agent a reçu les 150 questions **sans les réponses attendues** ni les explications, avec le texte du chapitre, et a résolu chaque question lui-même. Il a **exécuté en Python** (python3) toutes les conversions, tous les calculs binaires et hexadécimaux, les nombres de bits, les dépassements et les appels `bin`, `hex`, `int`, ainsi que la fonction `en_binaire` du cours dans sa version normale et dans la version modifiée (questions 073 et 074) ; il a vérifié que `bin(6) + 1` lève `TypeError` (105) et `int('FF', 2)` lève `ValueError` (096). Ses réponses ont ensuite été comparées automatiquement aux réponses attendues.

**Résultat.** 150 réponses identiques sur 150. Aucune erreur de réponse. Six remarques, toutes traitées.

## Corrections

| Question | Remarque du relecteur | Décision |
| --- | --- | --- |
| nsi-1re:ch1:banque:030 | « bit » veut aussi dire « petit morceau » en anglais : le distracteur « Petit morceau » est défendable. | Corrigée : l'énoncé cite l'expression *binary digit* dont « bit » est la contraction. |
| nsi-1re:ch1:banque:049 | Propositions sans unité. | Corrigée : « Quelle est la taille maximale du résultat, en bits ? ». |
| nsi-1re:ch1:banque:087 | « kio » au lieu de « Kio » (cours et norme). | Corrigée (proposition et explication). |
| nsi-1re:ch1:banque:141 | Accepter « 0B ». | Sans changement : la correction ignore la casse, « 0B » est déjà accepté. |
| nsi-1re:ch1:banque:142 | Accepter « fa ». | Sans changement : la casse est ignorée ; « 0xFA » est déjà accepté. |
| nsi-1re:ch1:banque:148 | Accepter « 7e8 » et « 07E8 ». | « 07E8 » ajouté ; « 7e8 » est déjà accepté (casse ignorée). |

## Contrôles automatiques

- `verifierBanque` (préfixe `nsi-1re`, 150 questions) : conforme. Types 75 / 30 / 30 (15 vrais, 15 faux) / 15 ; difficultés 60 / 60 / 30 ; bonnes réponses des QCM réparties sur les quatre positions (19, 18, 19, 19) ; bonne réponse strictement la plus longue dans 6 QCM sur 75.
- Les énoncés trop proches (similarité > 0,8, en particulier les conversions qui ne différaient que par le nombre) ont été reformulés avant la relecture.
- Réponses courtes numériques : aucune marge, aucun séparateur de milliers ; les écritures binaires et hexadécimales sont comparées comme du texte (variantes avec préfixe `0b` / `0x` acceptées).

## Points restants

Aucun : toutes les questions peuvent passer au statut `valide`.
