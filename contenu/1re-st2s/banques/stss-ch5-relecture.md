# Relecture de la banque du chapitre 5 de STSS contre le cours

Relecture des 150 questions de `stss-ch5.json` contre le texte du chapitre (`npm run banque:texte -- 5 --cours stss`), question par question, sans échantillonnage. Critères : exactitude selon le cours, lecture unique, bonne(s) réponse(s) seules justes, explication, niveau 1re ST2S, absence de donnée extérieure au chapitre, pas de question sur la valeur d'une donnée fictive, variantes des réponses courtes, règles du § 3 de la spec adaptées à la STSS (typographie avec espace insécable et tutoiement vérifiés par script).

## Questions corrigées et remplacées

| Source | Problème | Décision |
|---|---|---|
| stss:ch5:banque:020 | Variante « un dépouillement » absente. | Corrigée : variante ajoutée. |
| stss:ch5:banque:021 | L'explication appelait le questionnaire « méthode quantitative » ; le cours en fait un outil. | Corrigée : « outil de la méthode quantitative », lien avec les entretiens ajouté. |
| stss:ch5:banque:031 | Énoncé confus (« la démarche de l'approche qualitative »). | Corrigée : « Quelles affirmations sur la méthode qualitative sont exactes ? ». |
| stss:ch5:banque:046 | Chiffre absent du texte (« cinq élèves »). | Corrigée : « s'entretient longuement avec quelques élèves ». |
| stss:ch5:banque:058 | Bonne réponse nettement plus longue que les distracteurs (indice de forme). | Corrigée : propositions de longueur comparable. |
| stss:ch5:banque:062 | Bonne réponse presque deux fois plus longue que les distracteurs. | Corrigée : bonne réponse raccourcie. |
| stss:ch5:banque:087 | Chiffres inventés, absents du texte (10 sur 40) ; reformulation proche de la 136. | Corrigée : question de méthode sur l'exemple fictif du cours, repris dans l'énoncé (26 sur 104) : quel calcul donne la fréquence ; la réponse est le calcul, pas la valeur fictive. |
| stss:ch5:banque:106 | Variante au pluriel absente. | Corrigée : « effectifs » ajouté. |
| stss:ch5:banque:127 | Énoncé sans point d'interrogation final après la citation. | Corrigée : « quelles précisions répondent aux questions « où ? » et « quand ? » ? ». |
| stss:ch5:banque:143 | Bonne réponse la plus longue, reprenant presque mot pour mot la définition du besoin. | Corrigée : bonne réponse reformulée, distracteurs allongés. |
| stss:ch5:banque:066 | Doublon de la 082 (chiffres de l'Insee = données secondaires). | Remplacée : vrai/faux (faux, difficulté 2) sur la restitution aux personnes interrogées (restitution simple, pas le rapport complet). |
| stss:ch5:banque:092 | Doublon de la 102 (sens de la division pour la fréquence, mêmes termes). | Remplacée : vrai/faux (vrai, difficulté 2) sur les graphiques produits par le tableur. |
| stss:ch5:banque:100 | Doublon de la 050 (accord des parents pour un mineur). | Remplacée : vrai/faux (vrai, difficulté 2) sur le secret professionnel. |
| stss:ch5:banque:104 | Doublon de la 093 (pourcentages calculés par ligne dans le tri croisé). | Remplacée : qcm_unique (difficulté 3) sur la partie du rapport qui signale les limites (l'analyse). |
| stss:ch5:banque:116 | Doublon de la 013 et de la 141 (protocole écrit avant le recueil). | Remplacée : qcm_unique (difficulté 1) sur le rôle du protocole (garantir la cohérence de l'étude). |
| stss:ch5:banque:132 | Doublon de la 079 (définition du commanditaire, mêmes mots), notion déjà interrogée aussi en 006 et 146. | Remplacée : qcm_unique (difficulté 1) sur le contexte institutionnel (missions, moyens, règles de l'établissement demandeur). |
| stss:ch5:banque:136 | Chiffres inventés, absents du texte (35 sur 50) ; même calcul que la 087. | Remplacée : qcm_unique (difficulté 3) sur la notion de variable (la durée du trajet de chaque élève). |

## Totaux

- Gardées sans changement : 133
- Corrigées : 10 (020, 021, 031, 046, 058, 062, 087, 106, 127, 143)
- Remplacées : 7 (066, 092, 100, 104, 116, 132, 136)

Répartition après relecture : types 75 / 30 / 30 / 15 (vrai/faux : 15 vrais, 15 faux) ; difficultés 58 / 60 / 32 ; bonne réponse des qcm_unique en position 0, 1, 2, 3 : 19 / 19 / 18 / 19. `npm run banque:verifier -- 5 --cours stss` : « Banque du chapitre 5 conforme : 150 questions. »

Points vérifiés et jugés acceptables :

- 005, 081, 086 : les chiffres (120 sur 300, B2:B105, 60 %) viennent du texte du chapitre ; 086 porte sur le principe des quotas, pas sur une donnée fictive.
- 048, 064 : les dates 1978, 2016 et 2018 figurent dans le cours.
- 149 : le distracteur « Un écart dû uniquement au hasard » n'est pas dans le cours, mais il est manifestement faux face à « erreur systématique ».

## Points de doute pour l'enseignant

1. **087** : la question s'appuie sur l'exemple fictif du cours (26 sur 104). Elle demande le calcul et non la valeur, mais le résultat (25 %) figure dans le tableau du cours ; à écarter si tu juges qu'elle interroge encore la donnée fictive.
2. **Paires « terme → définition » et « définition → terme »** : 045 et 049 (anonymat), 036 et 128 (CNIL), 095 et 096 (hypothèse), 060 et 149 (biais). Les énoncés diffèrent, mais l'idée se répète.
3. **Redites d'idée** : 015, 075 et 103 sur le diagnostic avant l'action ; 002, 026, 080 et 119 sur confirmée, infirmée, nuancée ; 118, 126 et 019 sur le droit d'arrêter ; 040, 078 et 145 sur le biais des personnes faciles à joindre (dans la 040, les deux bonnes réponses sont l'exemple et le cas général) ; 012 et 077 sur les résultats globaux ; 122 et 138 sur « fille, 15 ans, interne » ; 042, 069 et 082 sur les données primaires et secondaires.
4. **050** : l'explication ajoute « en plus de son propre consentement » ; le cours dit seulement que l'accord des parents peut être nécessaire, ce qui suppose le consentement du mineur sans l'écrire.
5. **054** : l'explication dit qu'une question neutre « porte sur un fait précis » ; le cours le montre par l'exemple « Hier matin… » sans l'énoncer comme règle.
6. **Difficultés** : 039 et 109 sont cotées 3 pour un rappel assez direct du cours ; gardées pour respecter les quotas.
