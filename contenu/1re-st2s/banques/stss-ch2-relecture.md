# Relecture de la banque du chapitre 2 de STSS contre le cours

Relecture des 150 questions de `stss-ch2.json` contre le texte du chapitre (`npm run banque:texte -- 2 --cours stss`), question par question, sans échantillonnage. Critères : exactitude selon le cours, lecture unique, bonne(s) réponse(s) seules justes, explication, niveau 1re ST2S, aucune donnée extérieure au chapitre, règles du § 3 de la spec adaptées à la STSS (typographie avec espace insécable vérifiée par script, tutoiement).

## Questions corrigées et remplacées

| Source | Problème | Décision |
|---|---|---|
| stss:ch2:banque:012 | Double négation dans un vrai/faux (« sans aucune maladie ne peut pas éprouver de mal-être ») et redite de la 008. | Corrigée : vrai/faux (faux) « une personne atteinte d'une maladie, comme le diabète, est forcément en situation de mal-être » ; explication reprise. |
| stss:ch2:banque:014 | Doublon de la 019 (quel sociologue a défini le fait social) ; distracteurs faibles (« un médecin de l'OMS »). | Remplacée : qcm_unique (difficulté 1) sur la condition « relations durables » de la définition d'une société. |
| stss:ch2:banque:025 | « Publié en » : le cours date l'ouvrage (1895) sans parler de publication. Variante « en 1895 » absente. | Corrigée : énoncé « de quelle année date l'ouvrage » ; variante ajoutée. |
| stss:ch2:banque:028 | Redite de la 031 (la famille, groupe primaire) et de la 034. | Remplacée : qcm_unique (difficulté 1) sur la dimension matérielle et sociale du bien-être, jamais demandée comme bonne réponse. |
| stss:ch2:banque:040 | Redite de la 027 (arrêt de bus, groupe social). | Remplacée : vrai/faux (vrai, difficulté 2) sur le fonctionnement interne du groupe (règles, rôles, conformité). |
| stss:ch2:banque:044 | Doublon de la 043 (« nous » face à « eux ») et négation piège (« ne peut jamais »). | Remplacée : vrai/faux (faux, difficulté 3) sur les ordres d'Ancien Régime, dont la place n'est pas liée à l'économie. |
| stss:ch2:banque:057 | Doublon de la 055 (sanctions positives : compliment, reconnaissance du groupe). | Remplacée : qcm_unique (difficulté 3) sur le couple valeur santé → se laver les mains, avec les autres couples du tableau inversés. |
| stss:ch2:banque:060 | Doublon de la 052 (normes non juridiques sanctionnées de façon informelle). | Remplacée : vrai/faux (vrai, difficulté 3) sur l'identité sociale, qui dépend du regard de la personne et de celui des autres. |
| stss:ch2:banque:069 | Doublon de la 062 (la socialisation dure toute la vie). | Remplacée : vrai/faux (vrai, difficulté 1) sur ce que transmettent les médias et réseaux sociaux. |
| stss:ch2:banque:070 | Triple redite avec la 067 et la 072 (groupe de pairs, codes des personnes du même âge). | Remplacée : vrai/faux (faux, difficulté 1) attribuant à tort à la famille les règles d'un métier. |
| stss:ch2:banque:072 | Triple redite avec la 067 et la 070 (groupe de pairs). | Remplacée : reponse_courte (difficulté 1) sur le terme « instances de socialisation », avec variantes. |
| stss:ch2:banque:078 | Redite des 063 et 064 (socialisation primaire dans la famille et à l'école). | Remplacée : vrai/faux (faux, difficulté 2) sur l'ordre des étapes de la démarche (l'explication vient en dernier). |
| stss:ch2:banque:084 | Négation piège (« n'explique en rien »). | Corrigée : vrai/faux (faux) « s'explique uniquement par des choix isolés » ; explication reprise. |
| stss:ch2:banque:098 | Variantes incomplètes (« six groupes », « 6 grands groupes »…). | Corrigée : variantes ajoutées. |
| stss:ch2:banque:100 | Doublon de la 088 (castes, place fixée par la naissance). | Remplacée : reponse_courte (difficulté 2) sur le terme « identité sociale », avec variantes. |
| stss:ch2:banque:111 | Triple redite avec la 106 et la 112 (protection et reconnaissance). | Remplacée : qcm_multiple (difficulté 1) sur les apports du lien de participation organique (statut, revenu, sentiment d'être utile). |
| stss:ch2:banque:112 | Triple redite avec la 106 et la 111. | Remplacée : vrai/faux (vrai, difficulté 1) sur les instances qui transmettent la norme de la ceinture (loi, campagnes de prévention). |
| stss:ch2:banque:113 | Doublon de la 116 (lien de citoyenneté, droits et devoirs égaux). | Remplacée : qcm_unique (difficulté 2) sur ce qu'apporte le lien de participation élective (soutien, sentiment d'être apprécié). |
| stss:ch2:banque:120 | Redite de la 127 (chômage, isolement fragilisent la cohésion). | Remplacée : vrai/faux (faux, difficulté 1) sur le niveau du centre social dans le tableau des leviers (quartier, pas société). |
| stss:ch2:banque:130 | Négation piège (« ne peut jamais fragiliser »). | Corrigée : vrai/faux (faux) « la perte d'un emploi renforce toujours les liens sociaux » ; explication reprise. |
| stss:ch2:banque:135 | Redite de la 137 (se laver les mains et se brosser les dents, normes favorables). | Remplacée : qcm_unique (difficulté 1) sur les instances qui transmettent cette norme (famille et école). |
| stss:ch2:banque:142 | Doublon de la 150 (définition de la prévention par les pairs). | Remplacée : qcm_unique (difficulté 2) sur l'usage du classement en PCS (comparer conditions de vie et santé des groupes). |

## Totaux

- Gardées sans changement : 128
- Corrigées : 5 (012, 025, 084, 098, 130)
- Remplacées : 17 (014, 028, 040, 044, 057, 060, 069, 070, 072, 078, 100, 111, 112, 113, 120, 135, 142)

Chaque remplacement garde le type et la difficulté de la question libérée. Répartition après relecture : types 75 / 30 / 30 / 15 (vrai/faux : 15 vrais, 15 faux) ; difficultés 60 / 61 / 29 ; bonne réponse des qcm_unique en position 0 / 1 / 2 / 3 : 18 / 21 / 21 / 15. Aucune entité `&nbsp;`, aucune espace ordinaire avant « : ; ? ! » ni à l'intérieur des guillemets, aucun vouvoiement. `npm run banque:verifier -- 2 --cours stss` : « Banque du chapitre 2 conforme : 150 questions. »

## Points de doute pour l'enseignant

1. **025 et 145** : questions de mémorisation d'une date (1895) et d'un nom de loi (loi Évin, 1991). Les deux figurent dans le cours, mais leur intérêt en 1re ST2S est discutable.
2. **Questions inverses** : 061 et 071 (socialisation), 119 et 134 (cohésion sociale), 014/019 et 013 (société, Durkheim), 088 et 101 (formes de stratification) interrogent la même définition dans les deux sens. Gardées car elles ne se ressemblent pas dans la forme, à alléger si tu veux plus de variété.
3. **Redites d'idée gardées** : 005 et 008 (bien-être et santé liés sans être synonymes) ; 033 et 037 (appartenance à plusieurs groupes) ; 081, 083 et 084 (métiers du soin) ; 123, 124 et 132 (rôle des instances dans l'intégration) ; 125 et 127 (ce qui fragilise la cohésion) ; 141 et l'exemple de l'adolescent fumeur.
4. **027** : la justification « ni relations ni conscience d'appartenir » se déduit de la définition du groupe social ; le cours donne l'exemple de l'arrêt de bus sans l'expliquer.
5. **131** : « prêter un livre à un ami » et « rendre un service à sa famille » sont rangés du côté de la solidarité spontanée par analogie avec « aider un voisin », seul exemple donné par le cours.
6. **024** : le distracteur sur le mariage (« dont le taux varie selon les groupes sociaux et les professions ») reprend la forme de la bonne réponse avec un détail absent du cours ; il reste faux (le cours ne dit pas que Durkheim a étudié le mariage), mais il peut troubler.
7. **Difficultés** : 079, 080 et 133 sont cotées 3 pour une lecture directe d'un tableau ou d'une définition ; gardées pour respecter les quotas.
