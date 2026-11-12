# Bilan : cours d'espagnol LVB de première générale

Rapport du 12 novembre 2026. Branche `claude/contenu-1re-espagnol-057b7d`.

## Programme suivi

- **Arrêté du 5 mai 2025**, NOR MENE2504621A, **BO n° 22 du 29 mai 2025**, annexe 10 (programme d'espagnol du lycée général et technologique). Il s'applique en première à la **rentrée 2026-2027** (article 4) et abroge, pour les langues vivantes étrangères, le programme du cycle terminal de 2019.
- Niveau visé en fin de première en **LVB : B1** (B1+ en LVA).
- Six axes, dont cinq à traiter en voie générale, l'axe 6 étant obligatoire. Le cours propose les six.
- Résumé : `programmes/espagnol-1re.md` (PDF officiel lu le 11 novembre 2026 ; les points « en bleu », de niveau B1+, ont été repérés par la couleur du texte). Découpage : `programmes/espagnol-1re-plan.md`.

## Chapitres

| N° | Chapitre | Axe | Grammaire principale | Sections | Questions |
| --- | --- | --- | --- | --- | --- |
| 1 | Fronteras, viajes y migraciones | A1 Identités et échanges | passé simple (réguliers, orthographe, *e → i*, irréguliers), imparfait, *hace / desde hace*, *al* + infinitif | 7 | 150 |
| 2 | Diversidad e inclusión | A2 Diversité et inclusion | subjonctif présent (formation, emplois), *a* + COD de personne, *se* + 3e pers., possessifs, *cualquiera*, questions indirectes | 7 | 150 |
| 3 | Arte y poder | A3 Art et pouvoir | impératif, défense, pronoms et enclise, *lo* + adjectif, obligation | 6 | 150 |
| 4 | Ciencia, innovación y responsabilidad | A4 Innovations scientifiques | futur, conditionnel, passé composé, plus-que-parfait, dérivation et composition | 7 | 150 |
| 5 | El ser humano y la naturaleza | A5 L'être humain et la nature | subjonctif imparfait, *si* + subj. imparfait + conditionnel, *cuanto más… más*, comparatifs, connecteurs | 7 | 150 |
| 6 | Los Andes, la columna vertebral de Sudamérica | A6 L'espace andin (obligatoire) | *ser / estar / hay*, lieu, nombres et siècles, apocope, superlatif, périphrases, phrase emphatique | 7 | 150 |

Chaque chapitre : une lecture écrite pour le cours (glossaire et questions de compréhension), le vocabulaire de l'axe (liste officielle B1, B1+ signalé), deux ou trois sections de grammaire, une section culturelle, une section « Para expresarse », puis « Je retiens ».

## Le cours (`contenu/1re-gen/espagnol.json`)

- `espagnol-1re-gen`, filière `GEN`, niveau `1re`, matière « Espagnol », titre « Espagnol LVB : première générale ».
- Couleur `#a16207` : contraste **4,92:1** avec le blanc (`couleurCoursAcceptable` : acceptée).
- Taille : 627 027 octets (limite 3 Mo).
- `analyserImport` : aucune erreur. `nettoyerHtml` : rien n'est retiré (hors `tabindex="0"` ajouté aux tableaux). 900 sources uniques.
- **Import à blanc** : `versDonneesCours` puis `public.importer_cours` dans la base locale (`supabase_db_app-lycee`), dans une transaction annulée (`rollback`) : 6 chapitres, **900 questions créées**, aucune erreur ; rien n'a été écrit.
- Commande d'import réel (cours en brouillon, à publier depuis `/admin`) :

```bash
npm run import:contenu -- contenu/1re-gen/espagnol.json
```

## Les banques et leur relecture

| Chapitre | Questions | Types U / M / VF / RC | Difficultés 1 / 2 / 3 | Écarts du relecteur | Corrigées après relecture | Statut |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 150 | 75 / 30 / 30 / 15 | 60 / 62 / 28 | 0 | 10 | 150 `valide` |
| 2 | 150 | 75 / 30 / 30 / 15 | 60 / 59 / 31 | 0 | 8 | 150 `valide` |
| 3 | 150 | 75 / 30 / 30 / 15 | 60 / 60 / 30 | 0 | 4 | 150 `valide` |
| 4 | 150 | 75 / 30 / 30 / 15 | 60 / 59 / 31 | 0 | 6 | 150 `valide` |
| 5 | 150 | 75 / 30 / 30 / 15 | 60 / 60 / 30 | 0 | 6 | 150 `valide` |
| 6 | 150 | 75 / 30 / 30 / 15 | 60 / 60 / 30 | 0 | 15 | 148 `valide`, 2 `a_relire` |
| **Total** | **900** | | | **0** | **49** | **898 `valide`, 2 `a_relire`** |

- **Méthode de relecture** : pour chaque banque, un sous-agent indépendant a lu le texte du chapitre, puis résolu les 150 questions présentées **sans les réponses** ; ses réponses ont été comparées automatiquement aux réponses attendues. Aucun écart sur 900 questions. Ses commentaires (ambiguïtés, distracteurs défendables, variantes de réponses courtes, français mêlé aux propositions espagnoles) ont conduit à 49 corrections, détaillées dans `banques/espagnol-chN-relecture.md`.
- **Statut** : comme pour BPH et STSS (commits 67d1671 et 90bd11c), les questions relues et retenues sont `valide` ; seules les deux questions réellement discutables restent `a_relire`.
- Avant chaque relecture, `verifierBanque` a imposé : répartition des types et difficultés, énoncés pas trop proches (une trentaine reformulés au total), équilibre des vrai/faux (une vingtaine réécrits à la forme fausse), position et longueur des bonnes réponses, espaces insécables.
- **Réponses courtes** : aucune réponse numérique avec séparateur de milliers, aucune marge (la seule réponse numérique est l'année 1906, exacte). Les accents et la casse sont ignorés par la correction ; les variantes utiles (avec ou sans article, graphies latino-américaines, apostrophe droite et typographique) sont listées. Détail par chapitre : `validation/espagnol-chN.md`.

## Points à trancher

1. **Questions laissées `a_relire`** (chapitre 6) : **038** (*El concierto es en la plaza* : *ser* pour situer un événement ; *está* s'entend aussi) et **114** (phrase emphatique « *fue en Cuzco donde…* » contre « *fue en Cuzco que…* », courant en Amérique latine). La règle enseignée est la norme d'Espagne.
2. **Les six axes sont traités**, alors que le programme en demande cinq : l'enseignant peut ne pas publier un chapitre (sauf le 6, obligatoire).
3. **Points B1+ présents dans le cours** (signalés « B1+ ») et touchés par quelques questions : subjonctif imparfait des irréguliers (*tuviera*), *me gustaría que*, *aunque* + subjonctif, hypothèse dans le passé (*si hubiera llovido*). À retirer des quiz si l'on veut s'en tenir strictement au B1.
4. **Repères factuels à vérifier avec le manuel** : chiffres arrondis ou datés (« plus de 60 millions » d'hispaniques aux États-Unis, longueur de 8 500 km de la cordillère reprise du programme, frontière Mexique–États-Unis « plus de 3 000 km », disparition du glacier de Chacaltaya « vers 2009 »).
5. **Coquille du programme** : « la contesta » (lexique de l'axe 3) ; le cours emploie *la protesta*.
6. **Les notions** des banques contiennent une espace ordinaire avant les deux-points (« Vocabulaire : … »), comme celles des cours de 2de ; la règle des espaces insécables ne s'applique qu'à l'énoncé, aux propositions et à l'explication.

## Scripts à adapter (non modifiés)

Comme pour les cours de 2de : `npm run banque:texte|verifier|fusionner` n'acceptent que `--cours bph|stss` et lisent les banques dans `contenu/1re-st2s/banques/`. Il faudrait ajouter `espagnol-1re` à `COURS_BANQUE` (`src/lib/contenu/banque/cours.ts`, `fichier: 'contenu/1re-gen/espagnol.json'`, `prefixe: 'espagnol'`, `total: 150`) et dériver le dossier des banques du fichier du cours. Les contrôles ont été lancés avec les mêmes fonctions (`verifierBanque`, `fusionnerBanque`, `serialiserCours`, `texteChapitre`, `analyserImport`, `nettoyerHtml`, `versDonneesCours`) depuis un script hors dépôt. Attention : le préfixe `espagnol` est le même que celui du cours de 2de ; les sources sont distinctes par fichier de cours, mais un script commun devra distinguer les deux cours par leur clé, pas par le préfixe.
