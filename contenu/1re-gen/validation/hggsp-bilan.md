# Bilan : cours d'HGGSP, première générale

Branche `claude/contenu-1re-hggsp-c8df08`, du 11 au 18 novembre 2026. Tout est commité, sans push ni PR.

## Programme suivi

- **Texte** : arrêté du 17 janvier 2019, programme de spécialité d'histoire-géographie, géopolitique et sciences politiques de première générale. NOR **MENE1901576A**, BO spécial n° 1 du 22 janvier 2019. L'annexe de 8 pages a été lue en entier.
- **En vigueur en 2026-2027** : oui. Aucun arrêté de 2025 ou de 2026 ne modifie le programme de première. L'« allègement » de 2025 (BO n° 33 du 4 septembre 2025) ne concerne que l'épreuve de terminale.
- **Limite** : Légifrance n'a pas été consulté directement ; la version consolidée reste à confirmer.
- Résumé : `programmes/hggsp-1re.md` ; découpage : `programmes/hggsp-1re-plan.md`.

## Le cours

`hggsp.json` : slug `hggsp-1re-gen`, filière `GEN`, niveau `1re`, matière `HGGSP`, couleur `#9a3412` (contraste de 7,31:1 avec le blanc). Il compte **10 chapitres**, chacun coupé en une introduction de thème et un axe 1, ou en un axe 2 et un objet de travail conclusif. Tous les jalons du programme sont traités.

| N° | Chapitre | Programme | Questions |
| --- | --- | --- | --- |
| 1 | Les outils de la spécialité ; démocratie directe et démocratie représentative | introduction générale ; thème 1, introduction et axe 1 | 150 |
| 2 | Avancées et reculs des démocraties ; l'UE et la démocratie | thème 1, axe 2 et OTC | 150 |
| 3 | La puissance internationale ; essor et déclin des puissances | thème 2, introduction et axe 1 | 150 |
| 4 | Formes indirectes de la puissance ; la puissance des États-Unis | thème 2, axe 2 et OTC | 150 |
| 5 | Les frontières dans le monde ; tracer des frontières | thème 3, introduction et axe 1 | 150 |
| 6 | Les frontières en débat ; les frontières de l'UE | thème 3, axe 2 et OTC | 150 |
| 7 | S'informer aujourd'hui ; les révolutions techniques de l'information | thème 4, introduction et axe 1 | 150 |
| 8 | Liberté ou contrôle de l'information ; l'information à l'heure d'Internet | thème 4, axe 2 et OTC | 150 |
| 9 | États et religions aujourd'hui ; pouvoir et religion, des liens historiques | thème 5, introduction et axe 1 | 150 |
| 10 | Une inégale sécularisation ; État et religions en Inde | thème 5, axe 2 et OTC | 150 |
| | **Total** | | **1 500** |

Les 1 500 questions se répartissent ainsi :

- par type : 750 QCM à une réponse, 300 QCM à plusieurs réponses, 300 vrai/faux (150 vrais, 150 faux) et 150 réponses courtes ;
- par difficulté : 599 de niveau 1, 601 de niveau 2 et 300 de niveau 3.

Statut : les **1 500 questions sont `valide`**, comme les questions de BPH et de STSS après leur relecture (commits `67d1671` et `90bd11c`). Aucune question ne reste `a_relire` : la relecture n'a laissé aucune question réellement douteuse.

## Rédaction

- J'ai rédigé moi-même les chapitres 1 et 2 et leurs banques.
- Des sous-agents rédacteurs ont écrit les chapitres 3 à 10 et leurs banques, en suivant les mêmes consignes. Ils avaient pour modèles les chapitres 1 et 2.
- Les données d'actualité sont datées (« en 2024 », « fin 2025 ») et restent factuelles.

## Relecture indépendante de chaque banque

Pour chaque banque, un sous-agent distinct a d'abord lu le texte du chapitre. Il a ensuite résolu les 150 questions **sans voir la clé**, à partir d'un fichier sans réponses, et a écrit ses réponses avant d'ouvrir la clé pour comparer. Les comptes rendus détaillés sont dans `banques/hggsp-chN-relecture.md`.

| Chapitre | Score à l'aveugle | Corrections |
| --- | --- | --- |
| 1 | 150/150 | 4 réponses courtes complétées, 3 précisions du cours (citoyenneté athénienne, Ecclésia, misthos), 1 question retouchée |
| 2 | 150/150 | 2 ambiguïtés levées, 13 indices croisés supprimés, 2 questions remplacées, 2 variantes ajoutées, 1 précision du cours |
| 3 | 150/150 | 8 réponses courtes complétées, 9 indices croisés supprimés, 1 formulation reprise, 1 erreur du cours corrigée (mémorandum de Budapest) |
| 4 | 150/150 | 1 distracteur défendable remplacé (accord de Paris), 1 énoncé complété, 4 indices supprimés, 1 précision du cours (siège de l'ONU) |
| 5 | 150/150 | 2 réponses courtes complétées, 11 indices croisés supprimés |
| 6 | 150/150 | aucune |
| 7 | 150/150 | 1 réponse courte complétée, 2 précisions du cours (Telstar, ORTF) |
| 8 | 150/150 | aucune |
| 9 | 150/150 | 3 recoupements supprimés |
| 10 | 150/150 | 2 énoncés retouchés, 4 précisions du cours |

Aucune clé n'était fausse. Les corrections portent surtout sur les **indices croisés** (une question qui donne la réponse d'une autre), sur les variantes des réponses courtes et sur quelques faits du cours à préciser.

Après les relectures, les propositions des 300 QCM à réponses multiples ont été mélangées de façon déterministe, à l'identique dans les banques et dans le cours. Avant ce mélange, les bonnes réponses étaient toujours en tête. Les lettres citées dans certaines relectures (chapitres 2, 5 et 9) renvoient donc à l'ordre d'avant le mélange.

## Validation

Un rapport par chapitre se trouve dans `validation/hggsp-chN.md`.

- **`verifierBanque`** : les 10 banques sont conformes avec la configuration `{ prefixe: 'hggsp', total: 150 }`. Chacune est comparée au cours privé des questions de son chapitre.
- **Cohérence** : les 1 500 questions du cours sont identiques à celles des banques : type, énoncé, propositions, réponses, explication, difficulté et notion.
- **`analyserImport`** : il accepte le cours entier, qui pèse 1,32 Mo pour une limite de 3 Mo.
- **`nettoyerHtml`** : il ne retire rien des sections ni des zones « Je retiens ».
- **Import à blanc** : `versDonneesCours` (`garderStatuts: true`) construit la charge utile `importer_cours`, d'environ 1,15 Mo, sans contacter de base.
- **Tests** : `npx vitest run src/lib/contenu` donne 209 tests sur 209 au vert.

Commande d'import réelle, à lancer par l'enseignant :

```bash
npm run import:contenu -- contenu/1re-gen/hggsp.json --garder-statuts
```

## À changer dans les scripts (non modifiés, comme demandé)

- `banque:texte`, `banque:verifier` et `banque:fusionner` ne connaissent que `bph` et `stss`, avec des chemins écrits en dur sur `contenu/1re-st2s/` (`src/lib/contenu/banque/cours.ts`).
  - Il faudrait ajouter `hggsp` (fichier `contenu/1re-gen/hggsp.json`, total 150) à `COURS_BANQUE`, et rendre le dossier des banques paramétrable.
  - En attendant, les contrôles ont appelé directement les fonctions du dépôt, depuis un pilote placé hors du dépôt (`hggsp-travail/outils/` dans le dossier de notes partagé).
- `banque:verifier`, relancé après la fusion, compare la banque à ses propres questions déjà fusionnées et signale de faux doublons. Il faudrait exclure les sources identiques de la comparaison.

## Points à trancher par l'enseignant

1. **Le découpage en 10 chapitres** : deux par thème, l'introduction générale étant intégrée au chapitre 1. Un découpage par axe et par objet conclusif donnerait 15 chapitres.
2. **Statut `valide`** : il est appliqué aux 1 500 questions après les relectures indépendantes, comme pour STSS. Si l'enseignant veut sa propre validation avant les tirages, il peut importer sans `--garder-statuts` après avoir remis `a_relire` dans le fichier.
3. **Données d'actualité à revoir chaque année**. Elles sont listées dans chaque relecture :
   - guerre en Ukraine (fin 2025) ;
   - OIF, BRICS, OTAN, droits de douane américains (2025) ;
   - situation coréenne ;
   - espace Schengen (29 États) et pacte sur la migration et l'asile ;
   - DSA et amende infligée à X (décembre 2025) ;
   - Digital News Report, UIT, Insee ;
   - Iran, Saint-Siège ;
   - crise indo-pakistanaise de mai 2025, Pew Research Center.
4. **Sujets sensibles** : Russie et Ukraine, Israël, hindutva et minorités en Inde, théories du complot. Le traitement est factuel et daté, mais une lecture par l'enseignant est conseillée avant publication.
5. **Faits à confirmer avec le manuel de la classe**. Les relecteurs les ont jugés cohérents :
   - la longueur du limes (environ 550 km) ;
   - la création de l'Euregio (1958) ;
   - l'attribution de la photo de Kim Phuc, débattue depuis 2025 ;
   - la simplification sur les îles et la ZEE (chapitre 6).
6. **Recoupements mineurs gardés** : une même notion est interrogée sous deux angles (Brexit, despotisme doux, démocratie déléguée…). Ils ne gênent que si les questions tombent dans le même quiz.
