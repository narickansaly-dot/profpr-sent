# Relecture de la banque du chapitre 10 de STSS contre le cours

Relecture des 150 questions de `stss-ch10.json` contre le texte du chapitre (`npm run banque:texte -- 10 --cours stss`), question par question, sans échantillonnage. Critères : exactitude selon le cours, lecture unique, bonne(s) réponse(s) seules justes, explication, niveau 1re ST2S, absence de donnée extérieure au chapitre, règles du § 3 de la spec adaptées à la STSS, variantes des `reponse_courte`, typographie (U+00A0, sans `&nbsp;`) et tutoiement vérifiés par script.

## Questions corrigées et remplacées

| Source | Problème | Décision |
|---|---|---|
| stss:ch10:banque:001 | Reformulation proche de la 120 (chantiers d'insertion : travail rémunéré et accompagnement). | Remplacée : vrai/faux (faux, difficulté 1) : les associations ne s'appuient pas uniquement sur des bénévoles (salariés et bénévoles). |
| stss:ch10:banque:004 | Deux distracteurs presque identiques (« seul le professionnel constate » et « le professionnel constate sans que la personne le formule »), tous deux la définition du besoin repéré. | Corrigée : distracteur remplacé par « Un besoin défini par la loi pour toutes les personnes ». |
| stss:ch10:banque:006, 036, 040, 096 | Distracteur « La concertation avec la mairie » : l'ajout « avec la mairie » le rend artificiel et plus long que les autres. | Corrigées : distracteur ramené à « La concertation ». |
| stss:ch10:banque:011 | Reformulation proche de la 130 (missions du conseil départemental), déjà couvertes aussi par 018, 046 et 145. | Remplacée : qcm_unique (difficulté 2) sur le sens de « bailleur » dans l'exemple de Karim (le propriétaire de son logement). |
| stss:ch10:banque:017 | Doublon de la 099 (le 115, numéro d'urgence gratuit pour l'hébergement). | Remplacée : vrai/faux (vrai, difficulté 1) : certaines associations gèrent des établissements comme des CHRS. |
| stss:ch10:banque:019 | Bonne réponse recopiée du cours et nettement plus longue que les distracteurs, donc repérable. | Corrigée : propositions de longueur comparable ; bonne réponse « Prendre le temps et utiliser des mots simples ». |
| stss:ch10:banque:042 | Doublon de la 024 (définition du non-recours), thème repris aussi en 027 et 074. | Remplacée : vrai/faux (faux, difficulté 1) : la personne accompagnée n'est pas un simple bénéficiaire, elle est actrice de son parcours. |
| stss:ch10:banque:054 | Doublon de la 140 (définition de la consultation), thème repris aussi en 006. | Remplacée : vrai/faux (vrai, difficulté 2) : le contrat de séjour fait partie des outils de la loi du 2 janvier 2002. |
| stss:ch10:banque:072 | Bonne réponse beaucoup plus longue que les distracteurs (elle reprenait tout le financement). | Corrigée : bonne réponse « Une réduction des écarts de niveau de vie » ; le financement passe dans l'explication. |
| stss:ch10:banque:073 | Doublon de la 050 (bénéfices de la participation), avec une bonne réponse plus longue. | Remplacée : qcm_unique (difficulté 2) sur la rubrique « mode d'intervention » de la grille d'analyse. |
| stss:ch10:banque:077 | Les deux distracteurs commençaient par « Ils », sans antécédent clair (le premier était en position 1). | Corrigée : « Les travailleurs sociaux peuvent divulguer… » et « Les travailleurs sociaux transmettent… ». |
| stss:ch10:banque:078 | Distracteur « Les difficultés pour se nourrir correctement » défendable : l'énoncé cite des repas partagés. | Corrigée : distracteur remplacé par « Le mal-logement », question sociale citée par le cours. |
| stss:ch10:banque:081 | Doublon de la 142 (la grille de participation n'est pas une classification officielle). | Remplacée : vrai/faux (faux, difficulté 3) : dans la concertation, le groupe ne décide pas et ne porte pas seul l'action (degré « décision et action »). |
| stss:ch10:banque:090 | Doublon de la 026 et de la 089 (la CAF soutient les centres sociaux). | Remplacée : vrai/faux (vrai, difficulté 1) : le CCAS attribue des aides aux habitants de sa commune. |
| stss:ch10:banque:100 | Doublon de la 023 et de la 008 (les habitants participent au diagnostic du développement social local). | Remplacée : vrai/faux (vrai, difficulté 1) sur l'étape « Actions » (mettre en œuvre les moyens choisis). |
| stss:ch10:banque:106 | Doublon de la 062 (« faire avec » et non « faire à sa place »). | Remplacée : vrai/faux (vrai, difficulté 1) : l'intervention sociale aide chacun à trouver ou à garder sa place dans la société. |
| stss:ch10:banque:109 | Reformulation proche de la 066 (buts de l'action sociale selon le Code de l'action sociale et des familles), avec une bonne réponse bien plus longue. | Remplacée : qcm_unique (difficulté 3) : l'assistante de service social qui accompagne Karim dépend du département. |
| stss:ch10:banque:114 | Doublon de la 032 (le diagnostic se construit avec la personne). | Remplacée : vrai/faux (vrai, difficulté 2) : la loi du 2 janvier 2002 reconnaît le respect de la vie privée et de l'intimité. |
| stss:ch10:banque:116 | Doublon de la 016 et de la 110 (le RSA associe un revenu et un accompagnement). | Remplacée : vrai/faux (faux, difficulté 2) : l'intervention sociale d'intérêt collectif ne s'adresse pas à une personne ou une famille. |
| stss:ch10:banque:117 | Doublon de la 003 (qui participe au diagnostic de territoire). | Remplacée : qcm_unique (difficulté 2) sur le rôle des associations (défense des droits). |
| stss:ch10:banque:135 | Deux distracteurs quasi identiques (« donné par la famille » et « donné par la famille de la personne concernée »). | Corrigée : distracteur remplacé par « Un consentement donné sans information préalable ». |
| stss:ch10:banque:137 | Doublon de la 127 (dimensions de l'insertion). | Remplacée : qcm_multiple (difficulté 1) sur les interventions face aux difficultés pour se nourrir (épicerie solidaire, distribution alimentaire). |
| stss:ch10:banque:143 | Doublon de la 150 et de la 072 (la redistribution réduit les écarts de niveau de vie). | Remplacée : vrai/faux (vrai, difficulté 2) : certaines prestations sont réservées aux ménages modestes. |
| stss:ch10:banque:021, 091, 138 | Variantes de `reponse_courte` incomplètes (article manquant, singulier ou pluriel). | Corrigées : ajout de « le CESF », « la CESF » ; « le CHRS », « un centre… », « les centres d'hébergement et de réinsertion sociale » ; « le TISF », « la TISF ». |

Chaque remplacement garde la même source, le même type et la même difficulté que la question écartée.

## Totaux

- Gardées sans changement : 121
- Corrigées : 13 (004, 006, 019, 021, 036, 040, 072, 077, 078, 091, 096, 135, 138)
- Remplacées : 16 (001, 011, 017, 042, 054, 073, 081, 090, 100, 106, 109, 114, 116, 117, 137, 143)

Répartition après relecture : types 75 / 30 / 30 / 15 (vrai/faux : 15 vrais, 15 faux) ; difficultés 60 / 60 / 30 ; bonne réponse des qcm_unique en positions 1 à 4 : 19 / 20 / 19 / 17. Aucune entité `&nbsp;`, aucune espace ordinaire avant « : ; ! ? », pas de vouvoiement. `npm run banque:verifier -- 10 --cours stss` : « Banque du chapitre 10 conforme : 150 questions. »

## Points de doute pour l'enseignant

1. **Loi du 29 juillet 1998** : quatre questions (043, 048, 055, 059) portent sur cette loi, et 055 demande l'année. Le cours la cite, mais en renvoyant au chapitre 7 ; à alléger si tu juges la date secondaire ici.
2. **Minima sociaux et RSA** : 016, 045, 065, 092, 097 et 110 tournent autour du RSA et de l'AAH. Les énoncés diffèrent, mais le contenu se répète.
3. **Redites d'idée laissées** : 070 et 084 reprennent le même exemple (aide alimentaire, factures impayées) ; 033 et 148 portent sur le besoin repéré ; 067 et 132 sur le diagnostic comme première étape ; 034, 093 et 129 sur l'exemple de Théo. Gardées car l'angle change.
4. **109 (nouvelle)** : la réponse « le département » s'appuie sur la seule mention « l'assistante de service social du département » dans l'exemple de Karim ; l'explication fait le lien avec le chef de file, que le cours ne fait pas lui-même.
5. **015** : la variante acceptée « DSL » est un sigle que le cours n'emploie pas ; sans risque, mais à retirer si tu veux t'en tenir au texte.
6. **Difficultés** : 061 et 010 sont cotées 3 pour un rappel assez direct du cours ; gardées pour respecter les quotas.
