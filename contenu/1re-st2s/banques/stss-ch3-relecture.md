# Relecture de la banque du chapitre 3 de STSS contre le cours

Relecture des 150 questions de `stss-ch3.json` contre le texte du chapitre (`npm run banque:texte -- 3 --cours stss`), question par question, sans échantillonnage. Critères : exactitude selon le cours, lecture unique, bonne(s) réponse(s) seules justes, explication, niveau 1re ST2S, aucune donnée extérieure au chapitre, aucune question sur la valeur d'une donnée fictive, variantes des réponses courtes, règles du § 3 de la spec adaptées à la STSS (typographie avec espace insécable et absence de `&nbsp;` vérifiées par script, tutoiement).

## Questions corrigées et remplacées

| Source | Problème | Décision |
|---|---|---|
| stss:ch3:banque:005 | Les trois distracteurs commençaient par « Un indicateur… » : définition circulaire, distracteurs non plausibles, bonne réponse repérable. | Corrigée : distracteurs remplacés par une opinion sans définition, un effectif brut et la définition d'un producteur de données. |
| stss:ch3:banque:015 | « Selon quoi choisit-on de l'exprimer… » : le pronom « l' » ne renvoie à rien dans l'énoncé. | Corrigée : l'énoncé nomme le taux et la base (100, 1 000, 100 000). |
| stss:ch3:banque:016 | L'explication ne justifiait pas le calcul demandé. | Corrigée : explication avec la formule du cours. |
| stss:ch3:banque:024 | Bonne réponse nettement plus longue que les distracteurs (indice de forme). | Corrigée : bonne réponse resserrée, distracteurs allongés. |
| stss:ch3:banque:027 | Notion « Espérance de vie » pour la mortalité prématurée, qui figure dans le tableau des indicateurs par domaine. | Corrigée : notion « Indicateurs par domaine ». |
| stss:ch3:banque:034 | L'explication ne donnait pas la conclusion attendue. | Corrigée : explication reprenant le raisonnement du cours. |
| stss:ch3:banque:040 | Bonne réponse nettement plus longue que les distracteurs. | Corrigée : distracteurs allongés. |
| stss:ch3:banque:049 | Bonne réponse deux fois plus longue que les distracteurs. | Corrigée : bonne réponse resserrée, distracteurs allongés. |
| stss:ch3:banque:069 | Faute : « Que observe-t-on ? ». | Corrigée : « Qu'observe-t-on ? ». |
| stss:ch3:banque:073 | Distracteur non plausible (« n'ont pas le même nom de commune »). | Corrigée : remplacé par « Le taux brut de mortalité ne compte que les décès avant 65 ans ». |
| stss:ch3:banque:090 | « La mortalité infantile est beaucoup plus élevée dans les pays les plus pauvres » était donnée comme inégalité : le cours la range seulement parmi les contrastes à l'international, et un écart entre pays relève aussi de la disparité entre territoires. Deux lectures possibles. | Corrigée : énoncé « inégalités sociales de santé » ; l'item est remplacé par « une différence de santé entre les hommes et les femmes » (disparité selon le cours) ; 2 bonnes réponses ; explication reprise. |
| stss:ch3:banque:094 | Énoncé « les villes A et B » sans contexte : incompréhensible hors de l'exercice du cours. | Corrigée : l'énoncé reprend la situation (ville étudiante, ville de retraités, taux brut seul) ; explication complétée. |
| stss:ch3:banque:102 | « Sans changer l'état de santé réel » : une épidémie change réellement la santé d'une année, la bonne réponse était discutable. | Corrigée : énoncé « peuvent rendre trompeur un taux brut de mortalité, si on ne les vérifie pas » ; explication reprise. |
| stss:ch3:banque:105 | Propositions « À la comparer », « À suivre son évolution » sans antécédent dans l'énoncé. | Corrigée : énoncé « face à une situation sanitaire ou sociale » ; propositions harmonisées. |
| stss:ch3:banque:119 | Explication inexacte : le cours ne qualifie pas l'OCDE d'organisation « de statistiques ». | Corrigée : explication alignée sur le cours (organisations internationales). |
| stss:ch3:banque:137 | Reformulation proche de la 045 (même énoncé : l'Inserm et son CépiDc). | Corrigée : la question demande le centre de l'Inserm (CépiDc), avec ses variantes (sigle, nom développé, avec article). |
| stss:ch3:banque:149 | Variantes incomplètes (pluriels avec article, « un taux standardisé », pluriel de « taux de mortalité standardisé »). | Corrigée : variantes ajoutées. |
| stss:ch3:banque:106 | Reformulation proche de la 010 (définition de l'effectif, mot pour mot sa bonne réponse). | Remplacée : vrai/faux (vrai, difficulté 1) sur l'autre nom de l'espérance de vie sans incapacité (espérance de vie en bonne santé). |
| stss:ch3:banque:108 | Reformulation proche de la 013 (formule de la proportion). | Remplacée : vrai/faux (vrai, difficulté 1) sur les modes de recueil d'un producteur de données (enquêtes, registres, fichiers administratifs). |
| stss:ch3:banque:110 | Reformulation proche de la 019 (chômage rapporté à la population active), déjà reprise par la 081. | Remplacée : vrai/faux (vrai, difficulté 1) sur l'autre nom de l'indicateur composite (indice synthétique). |
| stss:ch3:banque:123 | Reformulation proche de la 057 (grippe → incidence). | Remplacée : vrai/faux (vrai, difficulté 1) sur le calcul du taux d'incidence. |
| stss:ch3:banque:124 | Reformulation proche de la 059 (définition de la disparité, mot pour mot sa bonne réponse). | Remplacée : vrai/faux (vrai, difficulté 1) sur l'exemple de contraste entre territoires (accès aux médecins). |

## Totaux

- Gardées sans changement : 128
- Corrigées : 17 (005, 015, 016, 024, 027, 034, 040, 049, 069, 073, 090, 094, 102, 105, 119, 137, 149)
- Remplacées : 5 (106, 108, 110, 123, 124)

Répartition après relecture : types 75 / 30 / 30 / 15 (vrai/faux : 14 vrais, 16 faux ; qcm_multiple : 7 à 2 bonnes réponses, 23 à 3) ; difficultés 60 / 60 / 30 ; bonne réponse des qcm_unique en position 1 à 4 : 19 / 19 / 19 / 18. `npm run banque:verifier -- 3 --cours stss` : « Banque du chapitre 3 conforme : 150 questions. »

Points jugés acceptables :

- 012, 017, 021, 029 et 150 reprennent des exemples à données fictives, mais l'énoncé donne les données et la question porte sur la méthode de calcul : c'est permis par la consigne.
- 139 accepte « SPF », sigle absent du cours : une variante acceptée en plus ne pénalise personne.
- 026, 038 et 047 : bonne réponse plus longue que les distracteurs, mais la longueur tient au contenu du cours (définition, mesure de l'éducation dans l'IDH, nom de Santé publique France).

## Points de doute pour l'enseignant

1. **064 et 090** : « les personnes peu diplômées déclarent plus souvent une mauvaise santé » est classé comme inégalité sociale de santé. Le cours le donne comme contraste entre groupes sociaux et cite le diplôme parmi les critères de position sociale, sans qualifier lui-même cet exemple d'inégalité.
2. **066** : le distracteur « Les plus pauvres sont en moins bonne santé que tous les autres groupes réunis » n'est pas la définition du gradient, mais c'est un constat compatible avec lui ; à reformuler si tu le juges défendable.
3. **026** : le distracteur « années vécues sans aucune maladie chronique » peut troubler un élève, puisque le cours appelle aussi l'indicateur « espérance de vie en bonne santé ».
4. **Redites d'idée** : 018, 081 et 109 sur le dénominateur de la mortalité infantile ; 011 et 107 sur l'effectif seul ; 058 et 122 sur le diabète ; 009, 097 et 131 sur les lits d'hôpital ; 036 et 141 sur le PNUD ; 043, 046 et 136 sur l'Insee ; 044 et 138 sur la Drees ; 045, 118 et 137 sur l'Inserm et les causes de décès ; 073, 094 et 133 sur les villes A et B ; 040 et 117 sur le même IDH avec des points forts différents. Les formes et les énoncés diffèrent, mais le contenu se répète ; le chapitre offre peu de faits distincts pour 150 questions.
5. **Difficultés** : 121 (incidence, vrai/faux) et 101 (indicateurs d'incapacité et de ressenti) sont cotées 3 pour une lecture directe du cours ; gardées pour respecter les quotas.
