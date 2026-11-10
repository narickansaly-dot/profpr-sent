# Relecture de la banque du chapitre 4 de STSS contre le cours

Relecture des 150 questions de `stss-ch4.json` contre le texte du chapitre (`npm run -s banque:texte -- 4 --cours stss`), question par question, sans échantillonnage. Critères : exactitude selon le cours, lecture unique, bonne(s) réponse(s) seules justes, explication, niveau 1re ST2S, absence de donnée extérieure au chapitre, variantes des `reponse_courte`, règles du § 3 de la spec adaptées à la STSS (typographie avec espace insécable et tutoiement vérifiés par script).

Le chapitre est court et la banque y revenait souvent sur la même idée. La plupart des remplacements suppriment des reformulations proches d'une autre question. Aucune erreur de fond n'a été trouvée : aucune bonne réponse fausse, aucun chiffre ni aucune institution absents du texte.

## Questions corrigées et remplacées

| Source | Problème | Décision |
|---|---|---|
| stss:ch4:banque:007 | Doublon de la 048 (base où chercher une loi → Légifrance) ; la 065 et la 076 portent aussi sur ce point. | Remplacée : qcm_unique (difficulté 1) sur le verdict du document A de l'exercice (« Fiable : à garder »). |
| stss:ch4:banque:020 | Réponse lisible dans l'énoncé : les six questions citées donnent les initiales du sigle QQOQCP. | Corrigée : énoncé « méthode de questionnement qui t'aide à délimiter un sujet sans oublier aucun aspect ». |
| stss:ch4:banque:033 | Doublon de la 027 (nom de la copie sans citer la source → plagiat). Variantes fautives (« la plagiat », « l'plagiat », « une plagiat »). | Remplacée : reponse_courte (difficulté 1) sur le terme « base documentaire », avec ses variantes. |
| stss:ch4:banque:039 | Doublon de la 062 (Insee, producteur de statistiques). | Remplacée : qcm_unique (difficulté 1) sur la question « Qui ? » du QQOQCP (personnes de plus de 75 ans vivant seules à domicile). |
| stss:ch4:banque:042 | Même idée que la 011 (le premier résultat n'est pas forcément le plus fiable). | Remplacée : vrai/faux (faux, difficulté 1) sur l'exemple du cours : le groupe cherche ce qu'on sait déjà avant de questionner des habitants. |
| stss:ch4:banque:054 | Même énoncé que la 040 (« Que fais-tu quand tu tries les documents d'un corpus ? »), même contenu ; la 017 porte aussi sur le tri. | Remplacée : qcm_multiple (difficulté 2) sur l'usage de la recherche documentaire dans les autres chapitres (indicateurs, dispositif de protection sociale, action de prévention). |
| stss:ch4:banque:061 | Doublon de la 110 (« Un bon corpus est varié, fiable et organisé »). | Remplacée : vrai/faux (vrai, difficulté 1) : une requête s'écrit aussi dans un catalogue ou une base de données. |
| stss:ch4:banque:095 | Doublon de la 138 et de la 037 (définition du recoupement). | Remplacée : vrai/faux (vrai, difficulté 2) : l'analyse critique juge la source, puis l'information. |
| stss:ch4:banque:097 | Même idée que la 004 (le témoignage ne dit pas combien de personnes sont concernées). | Remplacée : vrai/faux (faux, difficulté 2) : pour collecter, on interroge plusieurs bases, pas une seule. |
| stss:ch4:banque:100 | Doublon de la 067 (définition d'une source fiable). | Remplacée : vrai/faux (vrai, difficulté 2) : articles de revues spécialisées écrits et relus par des chercheurs. |
| stss:ch4:banque:103 | Troisième question sur la date de consultation d'une page web (019, 049). | Remplacée : vrai/faux (vrai, difficulté 3) : la question « Comment ? » porte aussi sur les actions menées contre l'isolement. |
| stss:ch4:banque:109 | Proposition « isolement ET covid ensemble » mal formulée (le mot « ensemble » n'est pas une syntaxe de requête). | Corrigée : « isolement ET covid ». |
| stss:ch4:banque:118 | Doublon de la 088 (sujet trop large pour être cherché tel quel). | Remplacée : vrai/faux (faux, difficulté 2) : la Haute Autorité de santé est un site institutionnel, pas une base statistique. |
| stss:ch4:banque:119 | Doublon de la 130 (préalable à toute étude). | Remplacée : vrai/faux (vrai, difficulté 3) : une information inadaptée à ton niveau pose un problème de pertinence. |
| stss:ch4:banque:120 | Même idée que la 051 (ne pas refaire une enquête sérieuse existante). | Remplacée : vrai/faux (faux, difficulté 2) : dans le tableau de lecture, le document B est classé dans « actions menées », pas dans « définitions ». |
| stss:ch4:banque:122 | Doublon de la 057 (le QQOQCP sert à délimiter le sujet). | Remplacée : vrai/faux (vrai, difficulté 2) : la Drees, service statistique des ministères de la santé et des affaires sociales. |
| stss:ch4:banque:125 | Variantes fautives (« la corpus », « l'corpus », « une corpus », etc.). | Corrigée : variantes réduites à « corpus », « le corpus », « un corpus », avec ou sans « documentaire ». |
| stss:ch4:banque:132 | Doublon de la 093 (la synthèse reste neutre, sans avis) ; difficulté 3 pour une lecture directe. | Remplacée : qcm_unique (difficulté 3) : pourquoi garder ensemble un rapport public et un article avec témoignages (ils se complètent). |
| stss:ch4:banque:146 | Doublon de la 117 (un chiffre sans origine ne peut pas être vérifié). | Remplacée : vrai/faux (vrai, difficulté 1) : la presse est souvent accessible par le CDI. |

Chaque remplacement garde le type, la difficulté et, pour les vrai/faux, la valeur de la question remplacée ; les quotas et l'équilibre sont donc inchangés. Après remplacement, le vérificateur a signalé un biais de longueur (bonne réponse la plus longue dans 40 % des QCM) : un distracteur de la nouvelle 132 a été allongé.

## Totaux

- Gardées sans changement : 131
- Corrigées : 3 (020, 109, 125)
- Remplacées : 16 (007, 033, 039, 042, 054, 061, 095, 097, 100, 103, 118, 119, 120, 122, 132, 146)

Répartition après relecture : types 75 / 30 / 30 / 15 (vrai/faux : 16 vrais, 14 faux) ; difficultés 60 / 60 / 30 ; position de la bonne réponse des qcm_unique : 19 / 19 / 19 / 18 ; `npm run banque:verifier -- 4 --cours stss` : « Banque du chapitre 4 conforme : 150 questions. »

Typographie : espaces U+00A0 avant « : ; ! ? » et à l'intérieur des guillemets, aucune entité `&nbsp;`, tutoiement partout (vérifié par script).

## Points de doute pour l'enseignant

1. **Redites d'idée restantes** : le chapitre est court, et plusieurs notions reviennent encore sous des formes différentes. Les opérateurs : OU dans 022, 029, 052, 127 et 148 ; ET dans 070 et 144 ; SAUF dans 002, 107 et 109. Les quatre temps de la démarche dans 006, 045, 077 et 101. Le plagiat dans 012 et 027. Les références d'une page web dans 019 et 049. Le tri du corpus dans 017 et 040. Légifrance dans 038, 048, 065 et 076. Le recoupement dans 037, 071 et 138. Le premier résultat d'un moteur dans 011, et l'élargissement ou la précision d'une requête dans 031 et 087. Les énoncés diffèrent, mais un élève en verra plusieurs au cours de l'année.
2. **037** : l'énoncé demande un verbe (« recouper »), mais le nom « recoupement » est aussi accepté. Ces variantes ont été gardées par souplesse ; à retirer si tu veux exiger le verbe.
3. **Difficultés 3 discutables** : 023, 047, 058, 062, 063, 066, 068 et 077 sont cotées 3 pour un rappel direct, avec parfois des distracteurs peu plausibles (« Quelles » en 023 ; « Supprimer l'analyse des sources » et « Remplacer la synthèse » en 058). Elles sont gardées pour respecter le quota de 30. À baisser si la répartition le permet.
4. **056 et 068** : on demande la forme développée exacte des sigles Insee et Drees. C'est exigeant pour une réponse tapée ; le cours la donne bien.
5. **039 (nouvelle)** : « vivant seules à domicile » contient un lieu, mais le tableau du cours range cette réponse sous « Qui ? ». La lecture reste unique, puisque « Où ? » y reçoit « En France, en ville ou à la campagne ».
6. **119 (nouvelle)** : elle relie « adaptée à mon niveau » au critère de pertinence, comme le fait le tableau du cours ; le mot « difficile » vient de la question, pas du cours.
