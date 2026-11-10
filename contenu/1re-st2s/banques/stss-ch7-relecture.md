# Relecture de la banque du chapitre 7 de STSS contre le cours

Relecture des 150 questions de `stss-ch7.json` contre le texte du chapitre (`npm run banque:texte -- 7 --cours stss`), question par question, sans échantillonnage. Critères : exactitude selon le cours, lecture unique, bonne(s) réponse(s) seules justes, explication, niveau 1re ST2S, aucune donnée extérieure au chapitre, règles du § 3 de la spec adaptées à la STSS, typographie (U+00A0, sans `&nbsp;`) et tutoiement vérifiés par script.

Constat principal : aucune erreur de fond, mais de nombreux **doublons** (même fait, même angle, souvent une question et sa réponse inversée). Chaque doublon a été remplacé par une question nouvelle, de même type, même difficulté, même position de bonne réponse (ou même valeur de vérité), sur la même clé de source, pour garder les quotas et l'équilibre des positions.

## Questions corrigées et remplacées

| Source | Problème | Décision |
|---|---|---|
| stss:ch7:banque:001 | Doublon de la 040 (le seuil augmente avec le niveau de vie médian), aussi présent en 118. | Remplacée : vrai/faux (vrai, d2) sur le seuil à 50 %, parfois utilisé. |
| stss:ch7:banque:002 | Doublon de la 115 (Paugam et la disqualification sociale). | Remplacée : qcm_unique (d1) sur le mouvement fondé par Wresinski (ATD Quart Monde). |
| stss:ch7:banque:008 | Variante de forme absente. | Corrigée : ajout de « le droit au logement opposable (DALO) ». |
| stss:ch7:banque:010 | Doublon de la 130 (les trois mesures ne désignent pas les mêmes personnes). | Remplacée : vrai/faux (faux, d2) : le niveau de vie médian se repère sur toute la population. |
| stss:ch7:banque:016 | Doublon de la 100 (première phase de Paugam). | Remplacée : qcm_unique (d1) sur ce à quoi une personne exclue n'a plus accès (définition de l'exclusion). |
| stss:ch7:banque:017 | Doublon de la 062 (l'exclusion n'est pas un état qui survient d'un coup). | Remplacée : vrai/faux (faux, d1) sur l'ordre des ruptures chez Karim (emploi avant séparation). |
| stss:ch7:banque:021 | Doublon de la 125 (médian ≠ niveau le plus fréquent). | Remplacée : vrai/faux (faux, d2) : les ressources qui manquent ne sont pas que de l'argent (biens, services). |
| stss:ch7:banque:025 | Doublon de la 007 (définition des inégalités territoriales). | Remplacée : vrai/faux (vrai, d2), application aux quartiers prioritaires de la politique de la ville. |
| stss:ch7:banque:030 | Doublon de la 079 (auteur du rapport de 1987). | Remplacée : qcm_unique (d1) sur le titre du rapport Wresinski. |
| stss:ch7:banque:035 | Propositions au pronom « Elles » sans antécédent dans l'énoncé (« Quelles phrases sur la participation… »). | Corrigée : énoncé « Que dit le cours de la participation des personnes en difficulté ? » et propositions explicites. |
| stss:ch7:banque:037 | Variante de forme absente. | Corrigée : ajout de « l'association Les Enfants de Don Quichotte ». |
| stss:ch7:banque:038 | Doublon de la 132 (seuil le plus utilisé : 60 %). | Remplacée : qcm_unique (d1) sur le rôle des sécurités (obligations et droits fondamentaux). |
| stss:ch7:banque:043 | Doublon de la 008 (la loi de 2007 crée le DALO). | Remplacée : qcm_unique (d1) sur la réaction de la population après l'appel de 1954 (dons). |
| stss:ch7:banque:044 | Doublon de la 039 (appel de l'abbé Pierre en 1954). | Remplacée : vrai/faux (vrai, d1) : le DALO concerne aussi les personnes mal logées. |
| stss:ch7:banque:052 | Doublon de la 144 (les inégalités ne concernent pas que l'argent). | Remplacée : vrai/faux (faux, d1) : une inégalité donne des avantages aux uns, des désavantages aux autres. |
| stss:ch7:banque:056 | Doublon de la 085 (le processus d'exclusion peut s'arrêter). | Remplacée : vrai/faux (vrai, d2) sur l'absence d'accès à Internet comme cause de non-recours. |
| stss:ch7:banque:068 | Doublon de la 066 (nombre de phases de Paugam). | Remplacée : vrai/faux (faux, d1) : réduire les inégalités est un objectif de la protection et de l'intervention sociales. |
| stss:ch7:banque:072 | Doublon de la 019 (définition du taux de pauvreté). | Remplacée : qcm_unique (d1) sur les réponses à un problème social reconnu. |
| stss:ch7:banque:074 | Doublon de la 138 (construction sociale : la situation doit être vue). | Remplacée : vrai/faux (faux, d2) sur ce que désigne le contexte (valeurs et normes qui changent). |
| stss:ch7:banque:079 | Variantes incomplètes. | Corrigée : ajout de « père Joseph Wresinski » et « le père Joseph Wresinski ». |
| stss:ch7:banque:083 | Variantes incomplètes. | Corrigée : ajout de « loi du 29 juillet 1998 » et « la loi du 29 juillet 1998 ». |
| stss:ch7:banque:087 | Doublon de la 051 (définition de la pauvreté, en sens inverse). | Remplacée : qcm_unique (d1), mise en situation (contrats courts, avenir incertain) → précarité. |
| stss:ch7:banque:105 | Doublon de la 050 (travailleurs pauvres). | Remplacée : vrai/faux (vrai, d1) : les élus font partie des porteurs. |
| stss:ch7:banque:107 | Doublon de la 045 (cumul des inégalités, terme ↔ définition). | Remplacée : qcm_unique (d1), classement d'un exemple dans le domaine « revenus et patrimoine ». |
| stss:ch7:banque:108 | Doublon de la 093 (définition du problème social). | Remplacée : vrai/faux (vrai, d1) : une situation qui touche des personnes particulièrement vulnérables. |
| stss:ch7:banque:120 | Doublon de la 112 (Lenoir, Les exclus, 1974). | Remplacée : qcm_unique (d1) sur l'étape « une situation réelle » du tableau des sans-logement. |
| stss:ch7:banque:123 | Variante absente. | Corrigée : ajout de « non-recours aux droits » et « le non-recours aux droits ». |
| stss:ch7:banque:131 | Doublon de la 128 (définition de la précarité de 1987). | Remplacée : vrai/faux (vrai, d1) : une bonne santé fait partie des sécurités. |
| stss:ch7:banque:133 | Doublon de la 004 (précaire sans être pauvre). | Remplacée : qcm_unique (d2), mise en situation (aucun proche sur qui compter) → une sécurité manque. |
| stss:ch7:banque:134 | Doublon de la 013 (déserts médicaux). | Remplacée : qcm_unique (d1) sur les composantes de la cohésion sociale. |
| stss:ch7:banque:137 | Doublon de la 119 (exemples de sécurités). | Remplacée : qcm_unique (d2) sur l'intégration sociale (liens sociaux, chapitre 2). |
| stss:ch7:banque:142 | Doublon de la 067 (raisons du non-recours). | Remplacée : qcm_unique (d2) sur les liens amicaux qui se défont. |
| stss:ch7:banque:143 | Doublon de la 110 (pauvre sans être exclu). | Remplacée : qcm_unique (d3) sur la grille d'analyse (« Pourquoi en parle-t-on maintenant ? » → porteurs et contexte). |
| stss:ch7:banque:146 | Doublon de la 104 (revenu disponible après impôts et prestations). | Remplacée : vrai/faux (faux, d3) : les tentes de 2006-2007 sont une mise en visibilité, pas la reconnaissance. |
| stss:ch7:banque:148 | Doublon de la 084 (un enfant compte moins qu'un adulte). | Remplacée : vrai/faux (vrai, d2) sur la grille d'analyse (« Quels chiffres… ? » → la mesure). |
| stss:ch7:banque:149 | Doublon de la 123 et de la 150 (définition du non-recours). | Remplacée : vrai/faux (vrai, d1) : inégalités sociales selon le sexe ou l'âge. |
| stss:ch7:banque:150 | Doublon de la 123 (définition du non-recours) ; « qu'on vous a proposé » contraire au tutoiement. | Remplacée : qcm_unique (d1) sur la loi de 1998 (priorité de l'ensemble des politiques publiques). |

## Totaux

- Gardées sans changement : 113
- Corrigées : 6 (008, 035, 037, 079, 083, 123)
- Remplacées : 31 (001, 002, 010, 016, 017, 021, 025, 030, 038, 043, 044, 052, 056, 068, 072, 074, 087, 105, 107, 108, 120, 131, 133, 134, 137, 142, 143, 146, 148, 149, 150)

Répartition après relecture : types 75 / 30 / 30 / 15 (vrai/faux : 15 vrais, 15 faux) ; difficultés 60 / 60 / 30 ; positions de la bonne réponse des qcm_unique 18 / 19 / 19 / 19 ; typographie : aucune espace ordinaire avant « : ; ! ? » ni dans « », aucune entité `&nbsp;`. `npm run banque:verifier -- 7 --cours stss` : « Banque du chapitre 7 conforme : 150 questions. »

## Points de doute pour l'enseignant

1. **033 et 077** : les questions d'enquête du cours (« Arrivez-vous à boucler votre budget ? », « Pouvez-vous… ») gardent le vouvoiement, car ce sont des citations du tableau des mesures de la pauvreté.
2. **087 et 133** : mises en situation fictives (Sofia, Léa) qui appliquent les définitions du cours ; pour 133, « il lui manque une sécurité » se déduit de la liste des sécurités (« une famille ou des amis sur qui compter »), le cours ne traite pas ce cas.
3. **060** : la bonne réponse (« touche plusieurs domaines et dure ») omet le troisième critère de Wresinski (réduire fortement les chances de retrouver ses droits) ; gardée car seule juste parmi les propositions.
4. **086** : réponse acceptée « CES », sigle que le cours n'emploie pas ; à retirer si tu veux exiger le nom complet.
5. **083** : la réponse « 1998 » seule est acceptée pour une question qui demande la date ; à resserrer si tu veux le jour et le mois.
6. **Redites d'idée gardées** : 054 et 114 (groupes qui se séparent), 033 et 077 (pauvreté ressentie), 058 et 103 (inégalités qui se renforcent), 116 et 145 (signes de reconnaissance), 064 et 150 (article 1er de la loi de 1998), 013 et 022 (déserts médicaux), 009, 040 et 118 (seuil relatif). Les énoncés et les angles diffèrent, mais le contenu se recoupe.
7. **Difficultés** : 027 (mise à l'agenda) et 110 (pauvre sans être exclu) sont cotées 3 pour une lecture assez directe du cours ; gardées pour respecter les quotas.
