# Relecture de la banque du chapitre 6 de STSS contre le cours

Relecture des 150 questions de `stss-ch6.json` contre le texte du chapitre (`npm run banque:texte -- 6 --cours stss`), question par question, sans échantillonnage. Critères : exactitude selon le cours, lecture unique, bonne(s) réponse(s) seules justes, explication, niveau 1re ST2S, aucune donnée extérieure au chapitre, variantes des réponses courtes, règles du § 3 de la spec adaptées à la STSS (typographie avec espace insécable et tutoiement vérifiés par script).

## Questions corrigées et remplacées

| Source | Problème | Décision |
|---|---|---|
| stss:ch6:banque:006 | Doublon de la 148 : même définition (« ce qui diminue la probabilité… à l'inverse d'un facteur de risque » → facteur de protection), en QCM puis en réponse courte. | Remplacée : qcm_unique (difficulté 1, « Facteur de risque ») sur les « causes des causes », notion du cours absente de la banque. |
| stss:ch6:banque:018 | Énoncé bancal (« Quelle famille de déterminants cela explore-t-il ? ») et formulé comme un fait (« ne peut pas changer de logement ») alors que le cours pose une question. | Corrigée : énoncé repris (« La famille de Noah peut-elle changer de logement ? Quelle famille de déterminants cette question explore-t-elle ? »). |
| stss:ch6:banque:025 | Deux distracteurs quasi identiques (saturnisme, dont l'un rallongé « près des grands axes routiers »). | Corrigée : le second remplacé par « Elle provoque le mal de dos chez les travailleurs de nuit ». |
| stss:ch6:banque:028 | Bonne réponse copiée mot pour mot d'une phrase du cours (interdit du § 3). | Corrigée : reformulée (« Un faible revenu expose plus souvent à un logement dégradé ou à la pollution des grands axes »). |
| stss:ch6:banque:040 | Faute d'élision : « Que illustre ». | Corrigée : « Qu'illustre ». |
| stss:ch6:banque:056 | « La première étape » alors que le cours précise que les étapes ne se succèdent pas toujours dans cet ordre (contradiction avec la 124). | Corrigée : « Dans l'ordre présenté par le cours, quelle est la première étape… ». |
| stss:ch6:banque:063 | Deux distracteurs qui se recouvrent (« Voter la loi… et du budget » et « Décider du budget »). | Corrigée : le premier remplacé par la mise à l'agenda (« Inscrire la question parmi les sujets que les pouvoirs publics doivent traiter »). |
| stss:ch6:banque:069 | Bonne réponse copiée mot pour mot d'une phrase du cours. | Corrigée : reformulée (« L'alerte est traitée avec les moyens ordinaires, la crise demande une organisation hors du commun »). |
| stss:ch6:banque:078 | Explication inexacte : « Seuls l'âge et l'hérédité ne sont pas modifiables », alors que le cours dit « Certains déterminants ne sont pas modifiables (âge, hérédité) ». | Corrigée : explication alignée sur le cours. |
| stss:ch6:banque:116 | Doublon de la 075 et de la 146 : la définition de la pandémie, une troisième fois, en vrai/faux. | Remplacée : vrai/faux (vrai, difficulté 1, « Alerte et crise sanitaire ») sur la dimension médiatique et sociale d'une crise (peur, rumeurs), composante non interrogée ailleurs. |
| stss:ch6:banque:136 | Variantes incomplètes. | Corrigée : ajout de « janvier 1997 », « depuis 1997 », « depuis le 1er janvier 1997 ». |
| stss:ch6:banque:138 | Variante de sigle manquante. | Corrigée : ajout de « O.M.S. ». |
| stss:ch6:banque:139 | Variantes incomplètes. | Corrigée : ajout de « modèles explicatifs » et « un modèle d'explication ». |
| stss:ch6:banque:140 | Variantes incomplètes. | Corrigée : ajout de « modèle Dahlgren et Whitehead », « modèle de Whitehead et Dahlgren », « modèle arc-en-ciel de Dahlgren et Whitehead ». |
| stss:ch6:banque:144 | « Quelle étape suit la mise à l'agenda » : même ambiguïté que la 056 sur l'ordre des étapes ; variante manquante. | Corrigée : « Dans l'ordre présenté par le cours… » ; ajout de « l'étape de la réponse ». |

## Totaux

- Gardées sans changement : 135
- Corrigées : 13 (018, 025, 028, 040, 056, 063, 069, 078, 136, 138, 139, 140, 144)
- Remplacées : 2 (006, 116)

Répartition après relecture : types 75 / 30 / 30 / 15 (vrai/faux : 15 vrais, 15 faux) ; difficultés 60 / 60 / 30 ; bonne réponse des `qcm_unique` en position 0/1/2/3 : 20 / 16 / 18 / 21, la plus longue dans 23 sur 75 ; aucune entité `&nbsp;`, aucun vouvoiement. `npm run banque:verifier -- 6 --cours stss` : « Banque du chapitre 6 conforme : 150 questions. »

## Points de doute pour l'enseignant

1. **Redites d'idée** (énoncés différents, contenu proche) : 047, 126 et 143 sur le danger ; 048, 050, 113 et 150 sur le risque ; 075 et 146 sur la pandémie ; 005, 007, 077, 107 et 121 sur la probabilité « sans certitude » du facteur de risque ; 014, 078 et 109 sur l'âge et l'hérédité non modifiables ; 030, 031 et 131 sur la date du modèle de Dahlgren et Whitehead ; 038, 039, 086, 118 et 141 sur le rapport Lalonde ; 037 et 128 sur les modes de vie « pas de purs choix personnels » ; 069 et 127 sur alerte et crise. Gardées pour tenir les quotas ; à alléger si tu veux une banque plus variée.
2. **Dates et noms propres** : 019, 031, 111, 131, 136, 141 et 147 demandent de retenir une date ou un nom du cours (années 1950, 1974, 1991, 1997, 2003, Marc Lalonde). Tous figurent dans le texte, mais leur poids dans l'évaluation est à juger.
3. **099** : « les choix politiques et économiques » sont comptés comme influençant la reconnaissance ; le cours les rattache à « la décision d'agir », dans la partie sur la place relative de l'épidémiologie.
4. **139** : la réponse « modèle » seule est acceptée ; à retirer si tu veux exiger « modèle explicatif ».
5. **060** : l'explication dit « la dernière étape » ; vrai dans la liste du cours, qui précise toutefois que l'ordre n'est pas toujours suivi.
6. **Définitions en bonne réponse** : 001, 020, 048, 062, 065 et 068 reprennent un fragment de définition du cours (pas une phrase entière) ; jugé conforme, mais la bonne réponse est facile à reconnaître.
