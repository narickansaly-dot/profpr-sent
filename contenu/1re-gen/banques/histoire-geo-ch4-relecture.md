# Relecture de la banque du chapitre 4 d'histoire-géographie (1re)

Banque : `histoire-geo-ch4.json`, 150 questions au statut `a_relire` après fusion. Chapitre : « L'industrialisation et l'accélération des transformations économiques et sociales en France ».

## Méthode

- Questions rédigées à partir du seul texte du chapitre 4, puis relues une à une contre ce texte (doublons entre questions, énoncés qui donnent la réponse d'une autre question, dates citées dans les énoncés).
- Relecture indépendante à l'aveugle : un sous-agent a résolu les 150 questions sans voir les réponses attendues.
- Comparaison automatique de ses réponses avec les réponses attendues (écarts et remarques).
- Contrôles automatiques : `verifierBanque` (quotas de 150 questions, positions, biais de longueur, espaces insécables, similarité des énoncés) ; présence de chaque réponse courte principale dans le texte du chapitre.
- L'ordre des propositions des QCM a été mélangé après la rédaction (contenu inchangé), puis les corrections ont été faites directement dans le JSON.

## Résultat de la relecture indépendante

150 accords sur 150 : 0 écart, 7 remarques.

| Source | Constat du relecteur | Décision |
| --- | --- | --- |
| ch4:banque:039 | Proche doublon de la 035 : les deux questions portent sur la même formule de Jules Ferry, et l'énoncé de l'une aide à répondre à l'autre. | **Remplacée** : nouvelle question sur les percées (le boulevard de Sébastopol, face à trois voies de province), même type, même notion, même difficulté. |
| ch4:banque:046 | La bonne réponse est la plus longue et reprend presque le texte du cours. | **Corrigée** : « Un monde varié aux statuts divers », désormais plus courte que les distracteurs. |
| ch4:banque:080 | Le Crédit foncier (février 1852) est fondé avant la proclamation de l'Empire (2 décembre 1852) : « fondées sous le Second Empire » est discutable. | **Corrigée** : l'énoncé dit « fondées entre 1852 et 1870 ». |
| ch4:banque:089 | Le parc Montsouris, commencé en 1867, est achevé en 1878, après le départ d'Haussmann. | **Corrigée** : Montsouris remplacé par le bois de Vincennes, aménagé sous Haussmann et cité dans le chapitre. |
| ch4:banque:099 | Les propositions « cités ouvrières » et « logements construits par des patrons » se recouvrent. | **Corrigée** : la proposition « cités ouvrières » devient un distracteur (« Les patrons accordent la journée de 8 heures ») ; deux bonnes réponses. |
| ch4:banque:101 | L'encadrement des sociétés de secours mutuels (1852) est autant une mesure de contrôle qu'une initiative en faveur des ouvriers. | **Corrigée** : proposition remplacée par un distracteur net (« La création du Crédit lyonnais ») ; deux bonnes réponses. |
| ch4:banque:140 | Réponse courte un peu ouverte : plusieurs formes du nom doivent être acceptées. | **Maintenue** : « Compagnie des chemins de fer du Midi », « chemins de fer du Midi », « Compagnie du Midi », « Midi », avec et sans article, sont déjà acceptées. |

## Corrections du texte du chapitre

Aucune : les remarques ne relevaient pas d'erreurs du chapitre.

## Points de doute

| Source | Doute | Proposition |
| --- | --- | --- |
| ch4:banque:042, 079 | « L'agriculture emploie environ la moitié des actifs vers 1870 » : ordre de grandeur courant (environ 49 % au recensement de 1866), selon les définitions de la population active. Les distracteurs sont très éloignés. | Garder. |
| ch4:banque:129, 094 | « Trois Français sur quatre à la campagne en 1851 », « plus de deux sur trois en 1872 » : selon la définition statistique de la commune rurale (moins de 2 000 habitants agglomérés). | Garder. |
| ch4:banque:125 | Réseau ferré d'environ 3 000 km en 1850 et 17 000 km en 1870 : arrondis usuels, les chiffres varient selon les sources (lignes concédées ou exploitées). | Garder. |
| ch4:banque:036 | Paris compte environ 1,8 million d'habitants en 1866 (recensement, communes annexées comprises). | Garder. |

## Contrôles

- `verifierBanque` : « Banque du chapitre 4 conforme : 150 questions. »
- Types 75 / 30 / 30 / 15 ; difficultés 60 / 60 / 30 ; vrai/faux 15 vrais et 15 faux ; les 8 notions servent.
- Biais de longueur : la bonne réponse est la plus longue dans 22 QCM à réponse unique sur 75 (29 %).
- Positions de la bonne réponse des QCM à réponse unique : 19 / 19 / 19 / 18.
- Réponses courtes : toutes les réponses principales sont présentes dans le texte du chapitre.
