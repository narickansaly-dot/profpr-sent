# Validation du cours d'espagnol de seconde générale

Rapport produit le 11 novembre 2026 en appelant les fonctions du dépôt depuis un script placé hors du dépôt : `analyserImport`, `couleurCoursAcceptable`, `nettoyerHtml`, `verifierBanque` et `versDonneesCours`. Les scripts `npm run banque:*` ne peuvent pas être lancés tels quels pour l'espagnol (voir « Scripts à adapter »).

## Le cours (`contenu/2de-gen/espagnol.json`)

- Validateur d'import (`analyserImport`, les mêmes règles que `npm run import:contenu` et que la page `/admin/import`) : **aucune erreur**.
- Cours : `espagnol-2de-gen`, filière `GEN`, niveau `2de`, matière « Espagnol », titre « Espagnol LVB : seconde générale ».
- Couleur `#a16207` : contraste de 4,92:1 avec le blanc, au-dessus du minimum de 4,5:1 (`couleurCoursAcceptable` : acceptée). La couleur demandée a été gardée sans la foncer.
- Taille : 604 610 caractères (617 165 octets), sous la limite de 3 Mo.
- Chapitres : 6 ; questions : 900 ; statuts : a_relire 900.
- Sources uniques dans tout le fichier : oui.
- HTML : 0 section modifiée par le nettoyage (`nettoyerHtml`), hors l'attribut `tabindex="0"` qu'il ajoute toujours aux tableaux.
- Typographie : 0 espace ordinaire avant « : ; ! ? » ou à l'intérieur des guillemets dans tout le fichier.

## Import à blanc

`versDonneesCours` (la conversion que `npm run import:contenu` envoie à la fonction SQL `importer_cours`) s'exécute sans erreur, avec et sans `--garder-statuts` : 6 chapitres et 900 questions préparées (6 chapitres avec `--garder-statuts`).

L'import réel n'a pas été lancé : il écrit dans la base locale, que les autres sessions de contenu utilisent en même temps, et il n'a pas d'option « à blanc ». Commande à lancer pour importer le cours (en brouillon, à publier depuis `/admin`) :

```bash
npm run import:contenu -- contenu/2de-gen/espagnol.json
```

La filière `GEN` et le niveau `2de` existent dans `supabase/seed.sql` : aucune migration n'est nécessaire.

## Les banques

| Chapitre | Questions | Types (U / M / VF / RC) | Vrais / faux | Difficultés (1 / 2 / 3) | Bonne réponse la plus longue | Contrôle |
| --- | --- | --- | --- | --- | --- | --- |
| 1. Vivir entre generaciones | 150 (150 dans le cours) | 75 / 30 / 30 / 15 | 16 / 14 | 60 / 58 / 32 | 25/75 | conforme |
| 2. La imagen de uno mismo y los demás | 150 (150 dans le cours) | 75 / 30 / 30 / 15 | 17 / 13 | 60 / 60 / 30 | 28/75 | conforme |
| 3. España, más allá de los tópicos | 150 (150 dans le cours) | 75 / 30 / 30 / 15 | 15 / 15 | 58 / 60 / 32 | 23/75 | conforme |
| 4. Crear y recrear | 150 (150 dans le cours) | 75 / 30 / 30 / 15 | 15 / 15 | 60 / 59 / 31 | 27/75 | conforme |
| 5. El pasado en el presente | 150 (150 dans le cours) | 75 / 30 / 30 / 15 | 17 / 13 | 60 / 61 / 29 | 18/75 | conforme |
| 6. Desafíos y transiciones | 150 (150 dans le cours) | 75 / 30 / 30 / 15 | 15 / 15 | 60 / 60 / 30 | 23/75 | conforme |

Le détail de chaque banque (notions, réponses courtes et leurs variantes) est dans `espagnol-chN.md`, à côté de ce rapport. Les relectures et les points de doute sont dans `banques/espagnol-chN-relecture.md`.

## Scripts à adapter (non modifiés)

Les contraintes de la commande interdisaient de modifier les scripts. Pour rendre les commandes du guide utilisables avec l'espagnol (et les autres matières de seconde), il faudrait :

1. `src/lib/contenu/banque/cours.ts` : ajouter une entrée `espagnol` à `COURS_BANQUE` (`fichier: 'contenu/2de-gen/espagnol.json'`, `prefixe: 'espagnol'`, `total: 150`), élargir le type `NomCours` et accepter `--cours espagnol` dans `lireCoursArgument`.
2. `scripts/verifier-banque.ts` et `scripts/fusionner-banque.ts` : le chemin du fichier de travail est fixé à `contenu/1re-st2s/banques/` ; il devrait venir de la configuration du cours (par exemple un champ `dossierBanques`).
3. `docs/guide-auteurs.md`, partie 7 : mentionner les cours de seconde et leur dossier.

En attendant, les contrôles ont été lancés avec les mêmes fonctions et une configuration `{ prefixe: 'espagnol', total: 150 }` passée à `verifierBanque`, et la fusion avec `fusionnerBanque` et `serialiserCours`, comme le fait `scripts/fusionner-banque.ts`.
## Bilan

- **Programme** : `programmes/espagnol-2de.md` résume l'annexe 10 de l'arrêté du 5 mai 2025 (BO n° 22 du 29 mai 2025), lue dans le PDF officiel. Ce programme s'applique en seconde depuis la rentrée 2025 et remplace celui de 2019 pour les langues vivantes étrangères. Le niveau visé en LVB en fin de seconde est **A2+**. `programmes/espagnol-2de-plan.md` en tire six chapitres, un par axe.
- **Cours** : 6 chapitres de 6 à 8 sections (lecture, vocabulaire, deux à quatre sections de grammaire, culture, « Para hablar »), une zone « Je retiens » par chapitre. La grammaire est expliquée en français ; les textes, les exemples et le vocabulaire sont en espagnol.
- **Banques** : 6 × 150 = **900 questions**, toutes `a_relire`.

| N° | Chapitre | Axe (programme 2025) | Grammaire | Durée |
| --- | --- | --- | --- | --- |
| 1 | Vivir entre generaciones | A2 Vivre entre générations | présent, possessifs, comparatifs, diminutifs | 5 sem. |
| 2 | La imagen de uno mismo y los demás | A1 Représentation de soi et rapport à autrui | *ser* / *estar*, *gustar*, pronoms et enclise | 5 sem. |
| 3 | España, más allá de los tópicos | A6 L'Espagne au-delà des clichés (obligatoire) | *hay* / *estar*, lieu, impératif, *se* + 3e pers., *-ísimo* | 6 sem. |
| 4 | Crear y recrear | A5 Créer et recréer | passé simple, imparfait, relatifs | 5 sem. |
| 5 | El pasado en el presente | A3 Le passé dans le présent | passé composé, gérondif et périphrases, *hace* / *desde hace* | 5 sem. |
| 6 | Desafíos y transiciones | A4 Défis et transitions | futur, obligation, subjonctif présent, défense | 6 sem. |

### Passage du plan de 2019 (8 chapitres) au plan de 2025 (6 chapitres)

| Ancien chapitre | Devenu |
| --- | --- |
| 1 Vivir entre generaciones | chapitre 1 (inchangé, plus du vocabulaire et les diminutifs) |
| 2 El mundo del trabajo | supprimé ; le futur et l'obligation passent au chapitre 6 (26 questions de grammaire reprises) |
| 3 El pueblo, el barrio, la ciudad | intégré au chapitre 3 (grammaire, vocabulaire de la ville, *plaza mayor*, *España vaciada* ; 73 questions reprises) |
| 4 La imagen de uno mismo | chapitre 2 (plus la langue comme identité) |
| 5 Deporte y sociedad | supprimé ; le passé simple passe au chapitre 4 (26 questions reprises) |
| 6 La creación y las artes | chapitre 4 (plus la réinterprétation, la mode et les légendes) |
| 7 Salvar el planeta | chapitre 6 (plus la ville de demain, le tourisme et l'engagement des jeunes) |
| 8 El pasado en el presente | chapitre 5 (inchangé) |

Les fichiers `espagnol-ch7` et `espagnol-ch8` (banque, relecture, validation) sont supprimés. Les sources des questions suivent le nouveau numéro de chapitre (`espagnol:chN:banque:NNN`). Le cours n'avait jamais été importé : aucune question en base n'est touchée.

## Points à trancher

1. **Axe à laisser de côté** : en voie générale, il faut traiter cinq axes sur six, dont obligatoirement l'axe 6 (chapitre 3). Le cours couvre les six.
2. **Ordre** : les chapitres suivent la progression grammaticale, pas la numérotation des axes, ce que le programme autorise.
3. **Grammaire A2+ non couverte** : subjonctif imparfait, conditionnel (seule la formule *me gustaría* est vue), démonstratifs, *lo* + adjectif, *cualquiera*, apocope, *a* devant un COD de personne, *al* + infinitif, absence de partitif. Voir le plan.
4. **Questions à compléter** : les ajouts des chapitres 1 et 2 (vocabulaire de l'axe, diminutifs, la langue comme identité) n'ont pas encore de questions. Au chapitre 4, les questions sur le passé simple gardent un contexte sportif.
5. **Relecture** : les banques ont été relues par leur auteur, pas par un relecteur indépendant. Une seconde lecture par l'enseignant est nécessaire avant toute validation.
6. **Faits culturels** : les dates et les faits ont été écrits de mémoire (voir les points de doute de chaque relecture). Ils sont stables, mais ils n'ont pas été vérifiés un par un.
7. **Accents et réponses courtes** : la correction ignore les accents ; les oppositions d'accent (*gano* / *ganó*, *que* / *qué*) ne sont évaluées que par des QCM et des vrai/faux.
8. **Scripts** : les commandes `npm run banque:*` ne connaissent que `bph` et `stss` (voir « Scripts à adapter »).
9. **Import** : à lancer, puis publier depuis `/admin` :

```bash
npm run import:contenu -- contenu/2de-gen/espagnol.json
```
