# Relecture de la banque du chapitre 9 de STSS contre le cours

J'ai relu les 150 questions de `stss-ch9.json` une par une, sans échantillonnage, contre le texte du chapitre « Agir en santé » (`npm run banque:texte -- 9 --cours stss`). Les critères sont ceux du § 3 de la spec, adaptés à la STSS :

- exactitude selon le cours ;
- une seule lecture possible ;
- seules les bonnes réponses sont justes ;
- explication juste ;
- niveau de 1re ST2S ;
- aucun chiffre, aucune date ni aucune institution extérieurs au texte ;
- variantes de `reponse_courte` complètes ;
- pas de doublon ;
- typographie U+00A0 vérifiée par script ;
- tutoiement.

## Questions corrigées et remplacées

| Source | Problème | Décision |
|---|---|---|
| stss:ch9:banque:003 | Doublon de la 029 et de la 065 : signature du contrat local de santé par l'ARS et une commune. | Remplacée : vrai/faux (vrai, difficulté 2) sur les représentants des usagers, issus d'associations, dans les établissements de santé. |
| stss:ch9:banque:008 | Le distracteur « plus de 78 ans » reprend l'âge de Mme Durand, un cas d'exemple, hors de son contexte. | Corrigée : le distracteur devient « Uniquement pour les personnes âgées ». |
| stss:ch9:banque:017 | Doublon de la 024 : le secret médical rend les informations confidentielles. | Remplacée : vrai/faux (vrai, difficulté 2) sur le contenu du droit à l'information. |
| stss:ch9:banque:018 | L'explication ne justifiait que le distracteur. | Corrigée : l'explication justifie aussi les trois bonnes réponses. |
| stss:ch9:banque:019 | Doublon de la 014 : le médecin traitant oriente et assure le suivi. | Remplacée : qcm_unique (difficulté 1) sur l'axe « acquérir des aptitudes individuelles », illustré par la lecture d'une étiquette alimentaire. |
| stss:ch9:banque:022 | Distracteurs qui déforment les intitulés des axes de la Charte d'Ottawa, par exemple « Réorienter les services de santé vers le soin ». | Corrigée : les distracteurs reprennent les intitulés exacts du cours. |
| stss:ch9:banque:023 | Variantes incomplètes. | Corrigée : ajout de « en 2002 », « 4 mars 2002 » et « le 4 mars 2002 ». |
| stss:ch9:banque:035 | Variantes au pluriel absentes. | Corrigée : ajout de « affections de longue durée » et « les affections de longue durée ». |
| stss:ch9:banque:040 | Doublon de la 106 : le parcours de santé est plus large que le parcours de soins. | Remplacée : vrai/faux (faux, difficulté 2) ; dans l'exemple des IST, ce ne sont pas les élèves relais qui financent l'action. |
| stss:ch9:banque:053 | Variantes incomplètes. | Corrigée : ajout de « compétence psychosociale » et « des compétences psychosociales ». |
| stss:ch9:banque:054 | La question demande le sigle, mais la forme développée, qui figure déjà dans l'énoncé, était acceptée. | Corrigée : seuls « ARS » et « l'ARS » sont acceptés. |
| stss:ch9:banque:059 | Même défaut que la 054 : la forme développée de l'énoncé était acceptée. | Corrigée : seuls « ANSM » et « l'ANSM » sont acceptés. |
| stss:ch9:banque:061 | Doublon de la 051 : énoncé quasi identique sur la santé communautaire. | Remplacée : qcm_unique (difficulté 2) ; le jardin partagé illustre l'axe « renforcer l'action communautaire ». Le distracteur « Créer des milieux favorables » est écarté, car il serait défendable. |
| stss:ch9:banque:064 | L'explication ne justifiait que le distracteur. | Corrigée : l'explication justifie aussi les trois bonnes réponses. |
| stss:ch9:banque:071 | Doublon de la 008 : l'ALD est prise en charge à 100 %. | Remplacée : vrai/faux (vrai, difficulté 2) ; avec la pharmacovigilance, un médicament dangereux peut être retiré. |
| stss:ch9:banque:073 | Variantes au pluriel absentes. | Corrigée : ajout de « besoins exprimés » et « des besoins exprimés ». |
| stss:ch9:banque:074 | Doublon de la 001 et de la 086 : la PMI relève du conseil départemental. | Remplacée : vrai/faux (vrai, difficulté 1) ; la sécurité sanitaire couvre aussi l'eau et l'environnement. |
| stss:ch9:banque:081 | Deux lectures possibles : « en consultation » peut se comprendre comme une consultation médicale. | Corrigée : l'énoncé précise « Dans la grille des degrés de participation, au degré « consultation » ». |
| stss:ch9:banque:085 | Doublon de la 107 : distance et méconnaissance des droits. Un distracteur était incohérent : « L'obligation de consulter sans médecin traitant ». | Remplacée : qcm_unique (difficulté 3) ; une association d'entraide créée par des patients correspond au degré « décision et action ». |
| stss:ch9:banque:090 | Doublon de la 004 : la complémentaire santé solidaire aide les personnes aux faibles ressources. | Remplacée : vrai/faux (vrai, difficulté 2) sur l'effet de la protection universelle maladie. |
| stss:ch9:banque:095 | Doublon de la 053 : définition des compétences psychosociales. | Remplacée : qcm_unique (difficulté 2) ; dans le parcours de Mme Durand, l'orthophoniste intervient à l'étape de réadaptation. |
| stss:ch9:banque:097 | Distracteurs qui déforment les intitulés des axes : « … vers le soin », « … communautaire locale ». | Corrigée : les distracteurs reprennent les intitulés exacts du cours. |
| stss:ch9:banque:100 | Doublon de la 043 : la vaccination relève de la prévention primaire. | Remplacée : vrai/faux (faux, difficulté 1) ; un cabinet libéral n'est pas un acteur privé à but non lucratif. |
| stss:ch9:banque:101 | Doublon de la 077, avec une difficulté 3 pour une simple reprise de l'« Attention » du cours. | Remplacée : vrai/faux (vrai, difficulté 3) qui relie la santé communautaire, le pouvoir d'agir et la Charte d'Ottawa. |
| stss:ch9:banque:104 | L'explication ne justifiait que le distracteur. | Corrigée : l'explication cite les trois dispositifs de veille. |
| stss:ch9:banque:128 | Doublon de la 073 : un besoin exprimé est formulé par les personnes elles-mêmes. | Remplacée : vrai/faux (vrai, difficulté 2) ; un besoin identifié s'appelle aussi besoin repéré. |
| stss:ch9:banque:138 | Doublon de la 030 et de la 119 : rupture de parcours quand l'aide à domicile n'est pas prête. | Remplacée : vrai/faux (vrai, difficulté 2) ; le parcours de santé s'inscrit dans le parcours de vie. |
| stss:ch9:banque:145 | Distracteur défendable : on doit être soigné avec respect quel que soit son niveau de connaissance du système de santé. | Corrigée : l'énoncé demande les éléments que le cours cite, et l'explication est complétée. |

Les remplacements gardent le type, la difficulté, la position de la bonne réponse des `qcm_unique` et la valeur des vrai/faux de la question d'origine.

## Totaux

- Gardées sans changement : 122.
- Corrigées : 14 (008, 018, 022, 023, 035, 053, 054, 059, 064, 073, 081, 097, 104, 145).
- Remplacées : 14 (003, 017, 019, 040, 061, 071, 074, 085, 090, 095, 100, 101, 128, 138).

Répartition après relecture :

- types : 75 / 30 / 30 / 15 ;
- vrai/faux : 15 vrais et 15 faux ;
- difficultés : 60 / 60 / 30 ;
- position de la bonne réponse des `qcm_unique` : 19 / 19 / 19 / 18.

`npm run banque:verifier -- 9 --cours stss` : « Banque du chapitre 9 conforme : 150 questions. »

## Points de doute pour l'enseignant

1. **007** : l'éducation thérapeutique du patient est comptée dans la restauration de la santé. Le cours la place dans cette sous-partie, à propos des maladies chroniques, mais ne dit pas explicitement que la restauration la « comprend ».
2. **060** : « signer un contrat local de santé » est compté comme un rôle de l'ARS. Le cours dit seulement qu'elle « peut » le signer avec une collectivité.
3. **117** : le cours classe « aider les fumeurs à arrêter » dans la prévention. Un élève pourrait défendre l'éducation pour la santé.
4. **124** : on déduit que la personne pèse sur les décisions en co-construction et en « décision et action ». Le cours ne le dit en toutes lettres que pour la concertation.
5. **125** : l'ARS est comptée comme un acteur de la veille, parce qu'elle reçoit les signalements. Le cours la cite bien dans « Les acteurs de la veille ».
6. **065** : la réponse acceptée « CLS » est un sigle absent du cours. Elle est sans risque, mais tu peux la retirer.
7. **054 et 059** : le sigle se déduit des initiales du nom donné dans l'énoncé. C'est acceptable en difficulté 1 ou 2, mais la réponse se lit presque dans l'énoncé.
8. **Redites d'idée gardées**, car l'angle diffère :
   - 011, 039, 078 et 141 : la promotion ne vise pas une maladie précise ;
   - 034, 096 et 108 : l'éducation pour la santé ne se limite pas à informer ;
   - 012, 107 et 144 : les obstacles qui restent malgré la protection sociale ;
   - 010 et 015 : le consentement du mineur ;
   - 129 et 140 : la pharmacovigilance ;
   - 031 et 130 : la Charte d'Ottawa et 1986 ;
   - 094 et 148 : les déterminants territoriaux ;
   - 001 et 086 : le conseil départemental.
9. **Difficultés** : la 052 (vrai/faux, difficulté 3) se résout facilement, avec « dans tous les cas ». Elle est gardée pour respecter le quota.
