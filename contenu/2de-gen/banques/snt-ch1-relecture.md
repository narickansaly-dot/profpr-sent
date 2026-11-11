# Relecture de la banque du chapitre 1 de SNT (Programmer en Python)

Banque `snt-ch1.json` : 150 questions (75 QCM à une réponse, 30 QCM à plusieurs réponses, 30 vrai/faux, 15 réponses courtes ; difficultés 60 / 60 / 30), toutes au statut `a_relire` après fusion dans `snt.json`. Contrôle automatique : conforme aux règles de `verifierBanque` (configuration « 150 questions », préfixe `snt`). Relecture de l'auteur, question par question, contre le texte du chapitre.

## Corrigées pendant la relecture

| Source | Problème | Décision |
| --- | --- | --- |
| snt:ch1:banque:093 | La bonne réponse « n += 1 » utilisait une écriture absente du cours. | Remplacée par « n = 1 + n ». |
| snt:ch1:banque:101 | Le distracteur « range(4, 8, 2) » utilisait un pas, absent du cours. | Remplacé par « range(3) ». |
| 013, 014, 036, 052, 089, 094, 140, 141, 142 | Énoncés jugés trop proches par le contrôle (la similarité ignore les symboles : « 7 // 2 » et « 7 % 2 » donnent le même texte). | Énoncés reformulés. |

## Points de doute

1. **Code dans les énoncés.** Les énoncés s'affichent en texte brut, sans retour à la ligne : les programmes y sont écrits sur une ligne (« s = 0, puis for i in range(4): s = s + i »). La forme « for … : instruction » sur une ligne est du Python valide, mais les enchaînements « puis » ne le sont pas : ce sont des descriptions. À vérifier en situation, sur mobile notamment.
2. **Espaces insécables dans le code.** La règle typographique impose une espace insécable avant « ! ? : ; ». Dans les énoncés, « a != b » s'écrit donc avec une espace insécable avant « != » : c'est correct à l'affichage, mais ce n'est plus du code copiable tel quel.
3. **Sorties de print.** Des questions disent « affiche S, puis N, puis T » : chaque appel de print va à la ligne, ce que l'énoncé ne montre pas.
4. **prix_taxi(2)** (QCM multiple de difficulté 3) : le cours écrit « if km <= 2 », donc 2 km donne bien le forfait de 7. La question repose sur le détail « inférieur ou égal ».
5. **Réponse courte prix_taxi(10)** : « 19 » et « 19.0 » sont acceptées ; « 19,0 » est aussi reconnue (comparaison numérique).
6. **Difficulté 3** : les traces de boucles (n * 2 jusqu'à 32, n // 2 depuis 100) sont longues pour la seconde, mais restent des calculs mentaux.
