# Étape 6a : banques de questions BPH

Ce document décrit la première partie de l'étape 6 de la feuille de route : compléter les banques de questions du cours **Biologie et physiopathologie humaines** (1re ST2S). Les autres matières de 1re ST2S feront l'objet d'une étape 6b, avec sa propre spec.

La spec générale `2026-11-03-app-lycee-design.md` et le guide des auteurs `docs/guide-auteurs.md` restent la référence pour le format du contenu, les statuts et l'import.

## 1. Point de départ et objectif

- Le cours `contenu/1re-st2s/bph.json` compte 7 chapitres. Chacun a 20 questions validées, toutes de type `qcm_unique`, sans notion.
- **Objectif** : environ **150 questions par chapitre**, soit **130 nouvelles** par chapitre et **910** en tout.
- Les 140 questions existantes ne sont pas modifiées.
- Toutes les nouvelles questions entrent au statut **`a_relire`**. Les élèves ne les voient pas tant que l'enseignant ne les a pas validées.

## 2. Décisions prises avec l'utilisateur

| Sujet | Décision |
|---|---|
| Périmètre | BPH seulement (6a) ; les autres matières viennent en 6b |
| Statut à l'import | `a_relire`, après une relecture par l'IA ; la validation finale est faite par l'enseignant dans l'admin |
| Répartition des types | variée (voir § 3) |
| Rythme | le chapitre 1 d'abord, relu par l'enseignant, puis les six autres |

## 3. Règles de rédaction

### Source

- Une question s'appuie **uniquement** sur le texte du chapitre dans `bph.json` : chapeau, objectifs, sections, « Je retiens ».
- Une notion absente du chapitre ne fait l'objet d'aucune question. Aucune question ne porte sur un autre chapitre.

### Répartition par chapitre (130 nouvelles questions)

Chaque répartition tolère un écart de plus ou moins 3 questions.

| Type | Part | Nombre visé |
|---|---|---|
| `qcm_unique` | 50 % | 65 |
| `qcm_multiple` | 20 % | 26 |
| `vrai_faux` | 20 % | 26 |
| `reponse_courte` | 10 % | 13 |

| Difficulté | Part | Nombre visé |
|---|---|---|
| 1 (facile) | 40 % | 52 |
| 2 (moyenne) | 40 % | 52 |
| 3 (difficile) | 20 % | 26 |

### Forme

- **Clé** : chaque question a la `source` `bph:chN:banque:NNN` (N = numéro du chapitre, NNN de 001 à 130). Cette clé est stable : un réimport ne crée pas de doublon.
- **Explication** : obligatoire. Une à trois phrases qui justifient la bonne réponse avec les mots du cours.
- **Notion** : obligatoire. Un intitulé court, pris dans une liste fermée de 5 à 12 notions par chapitre (par exemple « Organites », « Tissus », « Homéostasie » pour le chapitre 1). La liste est établie à partir des sections avant la rédaction.
- **QCM** : 4 propositions, sauf raison pédagogique. Elles doivent être plausibles et de longueur comparable. Un `qcm_unique` a exactement une bonne réponse. Un `qcm_multiple` a de 2 à 3 bonnes réponses, et son énoncé l'indique (« Coche toutes les réponses exactes. »).
- **Position de la bonne réponse** : répartie à peu près également entre les positions sur l'ensemble du chapitre. L'application mélange déjà l'ordre des propositions au tirage, mais le fichier ne doit pas avoir de biais.
- **Vrai/faux** : environ autant de vrais que de faux. Pas de double négation.
- **Réponse courte** : réservée aux termes précis (organe, hormone, structure, valeur chiffrée du cours). Elle inclut les variantes acceptées : avec ou sans article, singulier ou pluriel, accents, abréviations usuelles. Pour une valeur, utiliser `marge` ou `marge_relative` (guide des auteurs, partie 3).
- **Interdits** :
  - « toutes les réponses ci-dessus » et « aucune des réponses » ;
  - les énoncés à négation piège ;
  - les questions dont la réponse se lit dans l'énoncé ;
  - le copier-coller d'une phrase entière du cours comme bonne réponse.
- **Langue** : on tutoie l'élève. Typographie française : espace insécable avant « : ; ! ? ».
- **Doublons** : aucune nouvelle question n'est une reformulation proche d'une autre question du chapitre, y compris des 20 existantes.

## 4. Chaîne de production

Pour chaque chapitre, dans cet ordre :

1. **Notions** : la liste des notions du chapitre est fixée à partir de ses sections.
2. **Rédaction** : les 130 questions sont écrites dans un fichier de travail `contenu/1re-st2s/banques/bph-chN.json`, qui contient la liste des questions du chapitre et rien d'autre.
3. **Contrôles automatiques** : un script `scripts/verifier-banque.ts` vérifie, et échoue sur la première règle non respectée :
   - chaque question passe le validateur d'import de l'application (`src/lib/contenu/format-import.ts`) ;
   - les sources sont uniques, au format `bph:chN:banque:NNN` ;
   - la répartition des types et des difficultés respecte le § 3, tolérance comprise ;
   - chaque question a une explication et une notion de la liste du chapitre ;
   - aucune proposition interdite (§ 3) ;
   - pas de biais de position de la bonne réponse : aucune position ne dépasse 40 % des QCM à une réponse ;
   - pas de biais de longueur : la bonne réponse n'est la plus longue que dans moins de 40 % des QCM ;
   - doublons proches : la similarité de deux énoncés (normalisés : minuscules, sans accents ni ponctuation) est mesurée par trigrammes. Au-delà de 0,8, le script signale la paire.
4. **Relecture par l'IA contre le cours** : un relecteur (Opus) vérifie chaque question :
   - exactitude au regard du texte du chapitre ;
   - une seule lecture possible ;
   - bonne(s) réponse(s) correcte(s) et seules correctes ;
   - explication juste ;
   - niveau 1re ST2S.

   Chaque question reçoit un verdict : **gardée**, **corrigée** ou **écartée**. Les questions écartées sont remplacées pour revenir à environ 130. Le rapport de relecture est conservé dans `contenu/1re-st2s/banques/bph-chN-relecture.md`.
5. **Fusion** : un script `scripts/fusionner-banque.ts` ajoute les questions du fichier de travail au chapitre N de `bph.json`, au statut `a_relire`. Il refuse une source déjà présente avec un contenu différent.
6. **Import local**, avec l'option `--garder-statuts` (voir § 5), puis contrôle du bilan d'import : 130 questions créées, rien d'autre de modifié.

`bph.json` reste **la seule source de vérité** du cours : les fichiers de travail servent à produire et à relire, puis sont fusionnés.

## 5. Garder les statuts validés au réimport

Aujourd'hui, réimporter `bph.json` réapplique le statut du fichier (guide des auteurs, partie 6). Une question validée dans l'admin repasserait donc à `a_relire` au prochain import du chapitre suivant.

- Le script d'import reçoit l'option **`--garder-statuts`**.
- Avant l'import, le script lit en base le statut des questions de ce cours, par `source`.
- Une question **déjà en base au statut `valide`**, dont le fichier dit `a_relire` ou `brouillon`, est importée avec le statut `valide`. Son contenu suit les règles habituelles : une modification de structure crée toujours une nouvelle version `a_relire`.
- Le bilan indique le nombre de statuts conservés.
- Sans l'option, le comportement actuel ne change pas.

Les imports de BPH de cette étape utilisent toujours `--garder-statuts`. Le guide des auteurs documente l'option.

## 6. Relecture par l'enseignant dans l'admin

La page `/admin/chapitres/[id]/questions` gagne un **mode relecture**.

- **Affichage** : un lien « Relire les questions à relire » filtre les questions `a_relire` et les montre en **cartes complètes** :
  - énoncé et notion ;
  - difficulté ;
  - propositions, avec la ou les bonnes réponses marquées (texte « Bonne réponse », pas seulement une couleur) ;
  - réponses acceptées et marge ;
  - explication.
- **Sélection** : chaque carte a une case à cocher, et un bouton « Tout cocher » s'applique aux cartes affichées.
- **Actions groupées** :
  - « **Valider la sélection** » : passe les questions cochées de `a_relire` à `valide` ;
  - « **Repasser en brouillon** » : passe les questions cochées à `brouillon`.
- **Modification d'une question** : depuis la carte, un lien mène à l'éditeur existant.
- **Fonction serveur** : `public.changer_statut_questions(p_questions uuid[], p_statut statut_question_t) returns int`.
  - Réservée à `admin_contenu`, en `security definer` avec `search_path = ''`.
  - Elle applique à chaque question les règles de `changer_statut_question` : mêmes transitions permises, même traitement des questions signalées.
  - Tout se fait dans une seule transaction, au plus 200 questions par appel.
  - Elle renvoie le nombre de questions modifiées. Une transition impossible fait tout échouer avec le code existant de `changer_statut_question`.
- **Après l'action** : la page affiche « 24 questions validées. » (texte avec le nombre réel), et la liste se met à jour.
- **Contraintes d'interface** : accessible au clavier et au lecteur d'écran, utilisable à 375 px, CSP stricte.

## 7. Découpage et fin de l'étape

1. **Outils** :
   - l'option `--garder-statuts` ;
   - les scripts `verifier-banque` et `fusionner-banque`, avec leurs tests ;
   - la fonction `changer_statut_questions` et le mode relecture, avec leurs tests pgTAP, Vitest et e2e.
2. **Chapitre 1** : production, contrôles, relecture par l'IA, fusion, import local. **Arrêt** : l'enseignant relit le chapitre 1 dans l'admin et donne ses remarques de style. Elles sont reportées dans le § 3 avant la suite.
3. **Chapitres 2 à 7** : même chaîne, un chapitre par tâche.
4. **Fin** :
   - `bph.json` compte environ 1 050 questions, dont 910 `a_relire` ;
   - tous les contrôles passent ;
   - le bilan donne les nombres par chapitre et le taux de questions écartées ou corrigées à la relecture.

   L'étape est terminée sans attendre que l'enseignant ait tout validé : la validation se fait à son rythme.

## 8. Tests

- **Vitest** :
  - chaque règle de `verifier-banque`, avec un fichier valide et un fichier fautif par règle ;
  - `fusionner-banque` : ajout, refus d'une source en conflit, chapitre inconnu ;
  - `--garder-statuts` : statut conservé, contenu modifié versionné, option absente sans effet.
- **pgTAP** sur `changer_statut_questions` :
  - réservée à l'admin ;
  - transitions refusées ;
  - question signalée ;
  - plus de 200 questions refusées ;
  - tout ou rien ;
  - nombre renvoyé.
- **Playwright** : un admin filtre les questions à relire, en coche deux, les valide, et voit le message et les compteurs mis à jour. Le mode relecture est ajouté aux revues axe et CSP.
- **Contenu** : `verifier-banque` passe sur les 7 fichiers de travail. L'import local de `bph.json` passe, et un réimport immédiat ne change rien (« inchangées »).

## 9. Limites acceptées

- La relecture par l'IA réduit les erreurs sans les supprimer : la validation par l'enseignant reste nécessaire avant qu'une question soit tirée.
- La détection des doublons par trigrammes ne repère pas deux questions qui testent la même idée avec des mots différents. La relecture s'en charge.
- Les quiz ne puisent dans les nouvelles questions qu'au fur et à mesure de la validation.
