# Validation du cours d'espagnol de seconde générale

Rapport produit le 10 novembre 2026 en appelant les fonctions du dépôt depuis un script placé hors du dépôt : `analyserImport`, `couleurCoursAcceptable`, `nettoyerHtml`, `verifierBanque` et `versDonneesCours`. Les scripts `npm run banque:*` ne peuvent pas être lancés tels quels pour l'espagnol (voir « Scripts à adapter »).

## Le cours (`contenu/2de-gen/espagnol.json`)

- Validateur d'import (`analyserImport`, les mêmes règles que `npm run import:contenu` et que la page `/admin/import`) : **aucune erreur**.
- Cours : `espagnol-2de-gen`, filière `GEN`, niveau `2de`, matière « Espagnol », titre « Espagnol LVB : l'art de vivre ensemble ».
- Couleur `#a16207` : contraste de 4,92:1 avec le blanc, au-dessus du minimum de 4,5:1 (`couleurCoursAcceptable` : acceptée). La couleur demandée a été gardée sans la foncer.
- Taille : 779 229 caractères (795 224 octets), sous la limite de 3 Mo.
- Chapitres : 8 ; questions : 1200 ; statuts : a_relire 1200.
- Sources uniques dans tout le fichier : oui.
- HTML : 0 section modifiée par le nettoyage (`nettoyerHtml`), hors l'attribut `tabindex="0"` qu'il ajoute toujours aux tableaux.
- Typographie : 0 espace ordinaire avant « : ; ! ? » ou à l'intérieur des guillemets dans tout le fichier.

## Import à blanc

`versDonneesCours` (la conversion que `npm run import:contenu` envoie à la fonction SQL `importer_cours`) s'exécute sans erreur, avec et sans `--garder-statuts` : 8 chapitres et 1200 questions préparées (8 chapitres avec `--garder-statuts`).

L'import réel n'a pas été lancé : il écrit dans la base locale, que les autres sessions de contenu utilisent en même temps, et il n'a pas d'option « à blanc ». Commande à lancer pour importer le cours (en brouillon, à publier depuis `/admin`) :

```bash
npm run import:contenu -- contenu/2de-gen/espagnol.json
```

La filière `GEN` et le niveau `2de` existent dans `supabase/seed.sql` : aucune migration n'est nécessaire.

## Les banques

| Chapitre | Questions | Types (U / M / VF / RC) | Vrais / faux | Difficultés (1 / 2 / 3) | Bonne réponse la plus longue | Contrôle |
| --- | --- | --- | --- | --- | --- | --- |
| 1. Vivir entre generaciones | 150 (150 dans le cours) | 75 / 30 / 30 / 15 | 16 / 14 | 60 / 58 / 32 | 25/75 | conforme |
| 2. El mundo del trabajo | 150 (150 dans le cours) | 75 / 30 / 30 / 15 | 17 / 13 | 60 / 58 / 32 | 27/75 | conforme |
| 3. El pueblo, el barrio, la ciudad | 150 (150 dans le cours) | 75 / 30 / 30 / 15 | 17 / 13 | 60 / 60 / 30 | 27/75 | conforme |
| 4. La imagen de uno mismo y los demás | 150 (150 dans le cours) | 75 / 30 / 30 / 15 | 17 / 13 | 60 / 60 / 30 | 28/75 | conforme |
| 5. Deporte y sociedad | 150 (150 dans le cours) | 75 / 30 / 30 / 15 | 17 / 13 | 60 / 61 / 29 | 15/75 | conforme |
| 6. La creación y las artes | 150 (150 dans le cours) | 75 / 30 / 30 / 15 | 16 / 14 | 60 / 60 / 30 | 26/75 | conforme |
| 7. Salvar el planeta | 150 (150 dans le cours) | 75 / 30 / 30 / 15 | 16 / 14 | 60 / 57 / 33 | 26/75 | conforme |
| 8. El pasado en el presente | 150 (150 dans le cours) | 75 / 30 / 30 / 15 | 17 / 13 | 60 / 61 / 29 | 18/75 | conforme |

Le détail de chaque banque (notions, réponses courtes et leurs variantes) est dans `espagnol-chN.md`, à côté de ce rapport. Les relectures et les points de doute sont dans `banques/espagnol-chN-relecture.md`.

## Scripts à adapter (non modifiés)

Les contraintes de la commande interdisaient de modifier les scripts. Pour rendre les commandes du guide utilisables avec l'espagnol (et les autres matières de seconde), il faudrait :

1. `src/lib/contenu/banque/cours.ts` : ajouter une entrée `espagnol` à `COURS_BANQUE` (`fichier: 'contenu/2de-gen/espagnol.json'`, `prefixe: 'espagnol'`, `total: 150`), élargir le type `NomCours` et accepter `--cours espagnol` dans `lireCoursArgument`.
2. `scripts/verifier-banque.ts` et `scripts/fusionner-banque.ts` : le chemin du fichier de travail est fixé à `contenu/1re-st2s/banques/` ; il devrait venir de la configuration du cours (par exemple un champ `dossierBanques`).
3. `docs/guide-auteurs.md`, partie 7 : mentionner les cours de seconde et leur dossier.

En attendant, les contrôles ont été lancés avec les mêmes fonctions et une configuration `{ prefixe: 'espagnol', total: 150 }` passée à `verifierBanque`, et la fusion avec `fusionnerBanque` et `serialiserCours`, comme le fait `scripts/fusionner-banque.ts`.
## Bilan

- **Programme** : `programmes/espagnol-2de.md` résume l'annexe 1 de l'arrêté du 17 janvier 2019 (BO spécial n° 1 du 22 janvier 2019), lue dans sa version PDF. `programmes/espagnol-2de-plan.md` en tire huit chapitres, un par axe culturel, avec pour chacun le vocabulaire, la grammaire, la culture et les objectifs.
- **Cours** : 8 chapitres de 5 ou 6 sections (lecture, vocabulaire, une ou deux sections de grammaire, culture, « Para hablar »), une zone « Je retiens » par chapitre. La grammaire est expliquée en français ; les textes, les exemples et le vocabulaire sont en espagnol.
- **Banques** : 8 × 150 = **1 200 questions**, toutes `a_relire`, réparties entre vocabulaire, grammaire, compréhension de l'écrit et culture (8 ou 9 notions par chapitre).

| N° | Chapitre | Axe | Grammaire |
| --- | --- | --- | --- |
| 1 | Vivir entre generaciones | Vivre entre générations | présent, possessifs, comparatifs |
| 2 | El mundo del trabajo | Les univers professionnels | futur, obligation, *me gustaría* |
| 3 | El pueblo, el barrio, la ciudad | Le village, le quartier, la ville | *hay* / *estar*, lieu, impératif |
| 4 | La imagen de uno mismo y los demás | Représentation de soi | *ser* / *estar*, *gustar*, pronoms |
| 5 | Deporte y sociedad | Sports et société | passé simple, marqueurs de temps |
| 6 | La creación y las artes | La création et les arts | imparfait, imparfait / passé simple, relatifs |
| 7 | Salvar el planeta | Sauver la planète | subjonctif présent, défense, conseil |
| 8 | El pasado en el presente | Le passé dans le présent | périphrases, gérondif, *hace* / *desde hace*, passé composé |

## Points à trancher

1. **Programme de 2025.** Un nouveau programme de langues vivantes (BO n° 22 du 29 mai 2025) s'applique en seconde depuis la rentrée 2025, d'après l'académie de Bordeaux. Ce cours suit celui de 2019, comme la commande le demandait. Il faut comparer avec le texte de 2025, qui n'a pas pu être lu (erreur 403), et réaffecter les chapitres si les thèmes ont changé.
2. **Six axes sur huit.** Le programme de 2019 demande d'en traiter au moins six. Le cours en couvre huit ; deux chapitres peuvent rester en brouillon.
3. **Relecture.** Les banques ont été relues par leur auteur, pas par un relecteur indépendant. Toutes les questions restent `a_relire` : une seconde lecture par l'enseignant est nécessaire avant de les valider. Les points de doute de chaque chapitre sont dans `banques/espagnol-chN-relecture.md`.
4. **Faits culturels.** Les dates et les faits (sport, arts, histoire) ont été écrits de mémoire, sans source consultée. Ils sont stables et courants, mais ils n'ont pas été vérifiés un par un comme la définition de l'OMS l'avait été pour STSS.
5. **Accents et réponses courtes.** La correction ignore les accents. Aucune réponse courte ne teste donc un accent écrit ; les oppositions *gano* / *ganó* et *que* / *qué* ne sont évaluées que par des QCM et des vrai/faux.
6. **Variété d'espagnol.** Le cours enseigne l'usage d'Espagne (*vosotros*, *coger*, *jugar al*, passé composé pour une période liée au présent) et signale les différences d'Amérique latine dans les relectures.
7. **Scripts.** Les commandes `npm run banque:*` ne connaissent que `bph` et `stss`, avec un dossier fixe (voir « Scripts à adapter »). À adapter avant que d'autres matières de seconde n'en aient besoin.
8. **Import.** Le cours n'a pas été importé dans la base : lance `npm run import:contenu -- contenu/2de-gen/espagnol.json`, puis publie depuis `/admin`.
