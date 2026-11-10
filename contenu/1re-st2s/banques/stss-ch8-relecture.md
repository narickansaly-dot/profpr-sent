# Relecture de la banque du chapitre 8 de STSS contre le cours

Relecture des 150 questions de `stss-ch8.json` contre le texte du chapitre (`npm run banque:texte -- 8 --cours stss`), question par question, sans échantillonnage. Critères : exactitude selon le cours, lecture unique, bonne(s) réponse(s) seules justes, explication, niveau 1re ST2S, absence de donnée extérieure au chapitre, variantes des réponses courtes, règles du § 3 de la spec adaptées à la STSS (typographie avec espace insécable et tutoiement vérifiés par script).

## Questions corrigées et remplacées

| Source | Problème | Décision |
|---|---|---|
| stss:ch8:banque:011 | Variante « protection universelle maladie (PUMa) » absente. | Corrigée : variante ajoutée. |
| stss:ch8:banque:033 | Variante avec article et sigle entre parenthèses absente. | Corrigée : ajout de « la mutualité sociale agricole (MSA) ». |
| stss:ch8:banque:039 | Réponse lisible dans l'énoncé : « Quelle prestation compense le handicap ? » → « La prestation de compensation du handicap ». | Remplacée : qcm_unique (difficulté 2) sur l'organisme qui verse la pension de retraite et l'ASPA (les caisses de retraite). |
| stss:ch8:banque:048 | Redite de la 045 (PUMa et absence d'emploi, en vrai/faux faux) ; difficulté 3 pour un rappel direct. | Remplacée : vrai/faux (faux, difficulté 3) : la PUMa ne prend pas en charge la totalité des frais (ticket modérateur). |
| stss:ch8:banque:071 | Bonne réponse recopiant la définition de la PUMa, et la plus longue des propositions. | Corrigée : énoncé à compléter (« … de toute personne qui… ») avec quatre conditions de longueur comparable. |
| stss:ch8:banque:073 | Redite de la 058 (définition du non-recours, déjà demandée en réponse courte). | Remplacée : vrai/faux (vrai, difficulté 1) : sans complémentaire santé, on renonce plus souvent à certains soins. |
| stss:ch8:banque:075 | Distracteurs avec des chiffres absents du cours (« plus de 65 ans », « plus de vingt ans »). | Corrigée : « À toutes les personnes retraitées » et « Aux seules personnes qui ont longtemps cotisé ». |
| stss:ch8:banque:085 | Variante « en 1958 » absente. | Corrigée : variante ajoutée. |
| stss:ch8:banque:086 | Réponse lisible dans l'énoncé (« modèle beveridgien » → Beveridge). | Corrigée : l'énoncé décrit le modèle (financé par l'impôt, couvrant toute la population) sans le nommer. |
| stss:ch8:banque:089 | Redite de la 019 (missions des Urssaf) ; bonne réponse recopiant la phrase du cours et la plus longue. | Remplacée : qcm_unique (difficulté 2) sur les caisses de terrain de la branche accidents du travail et maladies professionnelles (CPAM et Carsat). |
| stss:ch8:banque:092 | Redite de la 015 (financement du modèle bismarckien par les cotisations). | Remplacée : vrai/faux (vrai, difficulté 1) sur l'origine du modèle bismarckien (Allemagne, fin du XIXe siècle). |
| stss:ch8:banque:099 | L'énoncé demandait le nom « en toutes lettres » mais acceptait « CSG » : consigne et variantes contradictoires. | Corrigée : consigne retirée (sigle et forme développée acceptés) ; variante « contribution sociale généralisée (CSG) » ajoutée. |
| stss:ch8:banque:100 | Réponse en partie lisible dans l'énoncé (« l'obligation, pour les enfants… » → « obligation alimentaire »). | Corrigée : « le devoir, pour les enfants… » ; variante « une obligation alimentaire » ajoutée. |
| stss:ch8:banque:104 | Variante avec article et sigle entre parenthèses absente. | Corrigée : variante ajoutée. |
| stss:ch8:banque:105 | Redite de la 047 (place en crèche, prestation en nature), elle-même incluse dans la 046. | Remplacée : vrai/faux (vrai, difficulté 1) : les caisses locales du régime général accueillent le public et versent les prestations. |
| stss:ch8:banque:108 | Redite exacte de la 042 (une naissance est un risque social malgré l'événement heureux). | Remplacée : vrai/faux (vrai, difficulté 1) sur les conséquences financières de l'invalidité. |
| stss:ch8:banque:129 | Variante « revenu de solidarité active (RSA) » absente. | Corrigée : variante ajoutée. |
| stss:ch8:banque:140 | Redite de la 148 (organismes de la protection complémentaire), même contenu en qcm_unique. | Remplacée : qcm_unique (difficulté 1) sur la définition d'un régime de sécurité sociale. |

## Totaux

- Gardées sans changement : 132
- Corrigées : 10 (011, 033, 071, 075, 085, 086, 099, 100, 104, 129)
- Remplacées : 8 (039, 048, 073, 089, 092, 105, 108, 140), sur les mêmes sources, avec le même type et la même difficulté

Répartition après relecture : types 75 / 31 / 29 / 15 (vrai/faux : 15 vrais, 14 faux) ; difficultés 61 / 59 / 30 ; `npm run banque:verifier -- 8 --cours stss` : « Banque du chapitre 8 conforme : 150 questions. »

Aucune entité `&nbsp;`, aucune espace ordinaire avant « : ; ! ? » ou à l'intérieur des guillemets, aucun vouvoiement.

## Points de doute pour l'enseignant

1. **070** : trois propositions seulement (Royaume-Uni, Allemagne, France), les trois pays cités par le chapitre ; gardée ainsi plutôt que d'ajouter un pays absent du cours.
2. **099** : la CSG est appelée « impôt » ; le cours la range dans « une part croissante du financement vient de l'impôt, en particulier de la CSG », mais ne la qualifie pas lui-même d'impôt.
3. **036** : « en premier » pour l'allocation chômage se déduit de « puis le RSA » ; l'aide au logement, citée en même temps, n'est pas parmi les propositions.
4. **103** : l'aide sociale à l'enfance comme distracteur non contributif se déduit de « l'aide sociale relève de l'assistance » ; le cours ne la classe pas lui-même.
5. **Bonnes réponses recopiant une définition** : 060, 065, 074, 116, 145 et 147 reprennent presque mot pour mot la définition du cours (souvent la plus longue proposition). Gardées, car ce sont des questions de définition de difficulté 1 ou 2 et `banque:verifier` ne signale aucun biais de longueur.
6. **Redites d'idée gardées** : non-recours (058, 062, 109) ; régime général et indépendants (035, 072, 120) ; Urssaf (019, 135) ; loi de financement (057, 142) ; CAF (087, 107) ; aide sociale et action sociale (095, 110) ; prestations en nature (046, 047) ; assistance (055, 101, 102). Les énoncés diffèrent, mais le contenu se répète.
7. **Difficultés** : 004 (Carsat), 008 et 079 (supplémentaire, complémentaire) et 067 sont cotées 3 pour une lecture directe d'un tableau ou d'un exemple ; gardées pour respecter le quota de 30.
