# Guide des auteurs

Ce guide explique comment écrire, importer et relire le contenu des cours : le format JSON, les statuts des questions, les réponses courtes, le HTML autorisé, le versionnage et l'import.

Le contenu n'entre en base que par deux chemins, tous deux validés par les mêmes règles (`src/lib/contenu/format-import.ts`) :

- l'**import** d'un fichier JSON (script ou page `/admin/import`) ;
- les **éditeurs** de l'espace admin (`/admin`), qui écrivent un chapitre ou une question à la fois.

## 1. Le format JSON d'un cours

Un fichier contient **un seul objet** : le cours, avec ses chapitres, qui portent leurs sections et leurs questions. Taille maximale : 3 Mo. Le fichier de référence est `contenu/1re-st2s/bph.json`.

### Le cours

| Champ | Type | Règle |
| --- | --- | --- |
| `slug` | texte | obligatoire ; minuscules, chiffres et tirets ; 80 caractères au plus |
| `filiere` | texte | obligatoire ; code d'une filière existante (par exemple `ST2S`) |
| `niveau` | texte | `2de`, `1re` ou `Tle` |
| `matiere` | texte | obligatoire, 120 caractères au plus |
| `titre` | texte | obligatoire, 200 caractères au plus |
| `couleur` | texte | `#rrggbb` ; `#2563eb` par défaut ; refusée si son contraste avec le blanc est inférieur à **4,5:1** (elle sert de fond au texte blanc des boutons ; `#0f766e`, la couleur de BPH, passe) |
| `chapitres` | liste | au moins un chapitre |

### Un chapitre

| Champ | Type | Règle |
| --- | --- | --- |
| `slug` | texte | obligatoire ; minuscules, chiffres et tirets ; unique dans le cours |
| `numero` | entier | de 1 à 99 ; unique dans le cours, y compris parmi les chapitres déjà en base mais absents du fichier |
| `titre` | texte | obligatoire, 200 caractères au plus |
| `titre_court`, `duree` | texte | facultatifs (80 et 40 caractères au plus) |
| `resume` | texte | facultatif, 1000 caractères au plus |
| `chapeau` | texte | facultatif, 4000 caractères au plus |
| `objectifs` | liste de textes | facultatif ; 300 caractères au plus par objectif |
| `sections` | liste | 40 au plus ; chacune a un `id` (une lettre minuscule, puis minuscules, chiffres ou tirets, 64 caractères au plus ; unique dans le chapitre ; `a-retenir` est réservé), un `titre` et un `html` |
| `a_retenir` | HTML | facultatif : la zone « Je retiens » |
| `questions` | liste | peut être vide |

L'import, l'éditeur de chapitre et la base appliquent la même règle d'identifiant. `a-retenir` est réservé : c'est l'identifiant du bloc « Je retiens » de la page.

### Une question

Champs communs à tous les types :

| Champ | Type | Règle |
| --- | --- | --- |
| `source` | texte | obligatoire ; **unique dans tout le fichier** ; 120 caractères au plus. C'est la clé qui permet de réimporter sans doublon (par exemple `bph:ch1:quiz:0`) |
| `type` | texte | `qcm_unique`, `qcm_multiple`, `vrai_faux` ou `reponse_courte` |
| `enonce` | texte | obligatoire, 2000 caractères au plus |
| `explication` | texte | facultatif, 4000 caractères au plus ; affichée dans la correction |
| `notion` | texte | facultatif ; les statistiques de l'élève sont regroupées par notion |
| `difficulte` | entier | 1 (facile), 2 (moyenne, par défaut) ou 3 (difficile) |
| `statut` | texte | `brouillon`, `a_relire` (par défaut) ou `valide` (voir la partie 2) |

Champs propres à chaque type :

- **`qcm_unique`** : `propositions` (de 2 à 10 textes distincts après suppression des espaces aux bords, 500 caractères au plus) et `bonnes_reponses`, une liste d'**un seul** indice. Les indices commencent à **0**.
- **`qcm_multiple`** : `propositions` comme ci-dessus et `bonnes_reponses`, une liste d'au moins un indice, sans doublon.
- **`vrai_faux`** : `bonne_reponse`, un booléen (`true` ou `false`).
- **`reponse_courte`** : `reponses_acceptees` (de 1 à 20 textes de 200 caractères au plus ; une réponse faite seulement de ponctuation, comme « … », est refusée), et si besoin `marge` et `marge_relative` (voir la partie 3).

Un indice de bonne réponse qui dépasse la liste des propositions est refusé : l'erreur indique le chapitre et la question concernés.

### Un exemple minimal pour chaque type

Le test `src/lib/contenu/guide-auteurs.test.ts` valide chaque exemple `json` de ce guide avec le schéma d'import. Un exemple qui n'est qu'une question est placé dans un cours minimal avant la validation.

QCM à une seule réponse :

```json
{
  "source": "exemple:qcm-unique",
  "type": "qcm_unique",
  "enonce": "Quel organite produit l'essentiel de l'ATP de la cellule ?",
  "propositions": ["Le ribosome", "La mitochondrie", "Le lysosome"],
  "bonnes_reponses": [1],
  "explication": "La mitochondrie réalise la respiration cellulaire.",
  "statut": "valide"
}
```

QCM à plusieurs réponses :

```json
{
  "source": "exemple:qcm-multiple",
  "type": "qcm_multiple",
  "enonce": "Quels éléments appartiennent à l'appareil respiratoire ?",
  "propositions": ["Les alvéoles", "Le duodénum", "La trachée", "Le rein"],
  "bonnes_reponses": [0, 2],
  "difficulte": 1
}
```

Vrai ou faux :

```json
{
  "source": "exemple:vrai-faux",
  "type": "vrai_faux",
  "enonce": "Le cœur humain comporte quatre cavités.",
  "bonne_reponse": true
}
```

Réponse courte, texte :

```json
{
  "source": "exemple:reponse-courte-texte",
  "type": "reponse_courte",
  "enonce": "Quel est le symbole de l'ion sodium ?",
  "reponses_acceptees": ["Na+", "Na⁺"]
}
```

Réponse courte, nombre avec une marge relative (0,1 signifie 10 %) :

```json
{
  "source": "exemple:reponse-courte-nombre",
  "type": "reponse_courte",
  "enonce": "Quelle est la fréquence cardiaque de repos moyenne d'un adulte, en battements par minute ?",
  "reponses_acceptees": ["70"],
  "marge": 0.1,
  "marge_relative": true
}
```

### Un cours complet minimal

```json
{
  "slug": "exemple-cours",
  "filiere": "ST2S",
  "niveau": "1re",
  "matiere": "Exemple",
  "titre": "Un cours d'exemple",
  "couleur": "#0f766e",
  "chapitres": [
    {
      "slug": "ch1",
      "numero": 1,
      "titre": "Premier chapitre",
      "objectifs": ["Savoir ce qu'est une cellule"],
      "sections": [
        {
          "id": "cellule",
          "titre": "La cellule",
          "html": "<p>La cellule est l'unité de base du vivant.</p><div class=\"def\"><b class=\"t\">Définition</b><p>Un <strong>organite</strong> est une structure spécialisée de la cellule.</p></div>"
        }
      ],
      "a_retenir": "<p>La cellule est l'unité du vivant.</p>",
      "questions": [
        {
          "source": "exemple:ch1:0",
          "type": "vrai_faux",
          "enonce": "La cellule est l'unité de base du vivant.",
          "bonne_reponse": true,
          "statut": "brouillon"
        }
      ]
    }
  ]
}
```

## 2. Les statuts et le cycle de relecture

| Statut | Libellé dans l'espace admin | Sens |
| --- | --- | --- |
| `brouillon` | Brouillon | en cours d'écriture ; jamais tiré dans un quiz |
| `a_relire` | À relire | écrite, en attente d'une seconde lecture ; jamais tirée dans un quiz |
| `valide` | Validée | relue ; **seules les questions validées sont tirées** dans les quiz et les évaluations |
| `archivee` | (invisible) | ancienne version remplacée ; reste dans les corrections passées |

Le cycle suit toujours le même chemin : **brouillon → à relire → validée**. Une question ne passe pas directement de brouillon à validée. Depuis « à relire » ou « validée », on peut revenir à « brouillon » ; depuis « validée », on peut aussi renvoyer en relecture.

Dans l'espace admin, sur la page d'une question, les boutons suivent ce cycle : « Envoyer en relecture », « Valider », « Renvoyer en relecture », « Repasser en brouillon ». **L'éditeur ne laisse jamais choisir le statut dans le formulaire** :

- une nouvelle question commence en **brouillon** ;
- modifier une question sans toucher à sa structure ne change pas son statut ;
- modifier la structure d'une question validée crée une nouvelle version, qui part en **à relire** (partie 5).

**À l'import, le statut du fichier s'applique**, sauf pour une question qui a un signalement ouvert : elle garde son statut actuel (« à relire ») et le signalement reste ouvert, même si le fichier la déclare `valide`. Sans statut, une question importée est `a_relire` : le contenu généré arrive donc en relecture et n'est tiré dans aucun quiz tant qu'une personne ne l'a pas validé. Écris `"statut": "valide"` seulement pour du contenu déjà relu (c'est le cas du cours BPH).

Un enseignant peut signaler une erreur dans une question. La question repasse alors en « à relire » et sort des tirages le temps de la relecture. L'admin traite le signalement sur `/admin/signalements` :

- **Marquer comme traité** : tu as corrigé la question ; elle reste en relecture jusqu'à ce que tu la valides.
- **Rejeter** : la question est juste ; elle redevient « validée » s'il n'y a plus d'autre signalement ouvert **et si elle n'a pas été modifiée depuis le dernier signalement**. Sinon, elle reste « à relire » : valide-la toi-même après avoir relu le nouveau texte.
- **Valider** la question (bouton de la page de la question) clôt d'office tous ses signalements ouverts en « traité », sans réponse écrite.

Une question qui a un signalement ouvert ne peut pas être supprimée : traite d'abord le signalement.

L'enseignant lit la décision et ta réponse sur `/enseignant/signalements`.

## 3. Les réponses courtes

La base compare la réponse de l'élève à chaque entrée de `reponses_acceptees`, dans cet ordre : d'abord comme du texte, puis comme un nombre. Les règles sont celles des fonctions `prive.normaliser` et `prive.en_nombre` ; les exemples ci-dessous ont été vérifiés dans la base locale.

### Ce que la normalisation ignore

Les deux textes (réponse de l'élève et réponse acceptée) sont normalisés avant d'être comparés :

| Règle | Exemple |
| --- | --- |
| les majuscules et les minuscules sont ignorées | « ÉNERGIE » = « énergie » |
| les accents sont ignorés | « Énergie » = « energie » |
| les espaces en trop, au début, à la fin et au milieu, sont ignorés | « l'  eau  » = « l' eau » |
| la ponctuation de fin est ignorée (`. ! ? ; : , …` et les guillemets ou parenthèses fermants) | « énergie. » = « énergie » et « Sodium ! » = « sodium » |
| la ponctuation et les guillemets d'ouverture sont ignorés au début | « « la cellule » » = « la cellule » |
| un trait d'union entre deux caractères de mot devient une espace | « sodium-potassium » = « sodium potassium » |

### Ce qui reste significatif

Ces signes ne sont **jamais** ignorés : `+`, `-` (final), `%`, `°`, `=`, `<`, `>`, ainsi que les chiffres en exposant ou en indice.

| Réponse acceptée | Réponse de l'élève | Résultat |
| --- | --- | --- |
| `Na+` | `Na+` ou `NA+.` | juste |
| `Na+` | `Na` | **faux** (le signe + compte) |
| `Na+` | `na +` | **faux** (l'espace avant le + compte) |
| `Na+` | `Na⁺` | **faux** (le + en exposant est un autre caractère) |
| `37 °C` | `37 °C` | juste |
| `37 °C` | `37°C` | **faux** (l'espace avant ° compte) |
| `70 %` | `70%` | **faux** |

Conséquence : « Na+ », « na + » et « Na⁺ » sont trois réponses différentes. **Ajoute dans `reponses_acceptees` toutes les variantes que tu veux accepter**, par exemple `["Na+", "Na⁺", "Na +"]`. La même règle vaut pour les unités : liste « 37 °C » et « 37°C ».

### Les nombres et les milliers

Un nombre est reconnu seulement s'il est écrit **sans séparateur de milliers** : la virgule ou le point sert uniquement de séparateur décimal, et le signe `+` ou `-` n'est permis qu'au début.

| Réponse acceptée | Réponse de l'élève | Résultat |
| --- | --- | --- |
| `1000` | `1000` | juste |
| `1000` | `1 000` | **faux** (l'espace est comparée comme du texte, et n'est pas un nombre) |
| `1000` | `1000,0` | juste (comparaison numérique) |
| `1,5` | `1.5` | juste (virgule ou point) |

N'écris donc **jamais** de séparateur de milliers dans une réponse acceptée (`1000`, pas `1 000`), et précise dans l'énoncé qu'il ne faut pas en mettre si la réponse est grande.

### La marge de tolérance

La marge ne s'applique qu'aux réponses numériques :

- seules les réponses acceptées qui sont **un nombre seul** servent de valeur de référence. « 37 » en est une ; « 37 °C » ou « 7 à 8 » n'en sont pas, elles sont comparées comme du texte uniquement ;
- la réponse de l'élève doit elle aussi être un nombre seul ;
- il suffit qu'elle soit dans la tolérance d'**une** valeur de référence.

Conseil : demande la réponse « en °C » dans l'énoncé et accepte `37`, plutôt que d'accepter `37 °C` avec une marge.

**`marge_relative` change le sens de `marge`.** Dans le JSON et dans la base :

- `marge_relative: false` (par défaut) : `marge` est une valeur **absolue**, dans la même unité que la réponse. Avec `"reponses_acceptees": ["37"]` et `"marge": 0.5`, `37,4` et `37.5` sont justes ; `36,4` est faux.
- `marge_relative: true` : `marge` est une **fraction** de la valeur de référence : tolérance = `marge` × |référence|. Donc **`0.1` signifie 10 %**, pas 0,1 %. Avec `["70"]` et `"marge": 0.1`, la tolérance est de 7 : `63` et `77` sont justes, `62` et `78` sont faux.

L'**éditeur de question**, lui, affiche et attend un **pourcentage** : tape `10` dans « Marge de tolérance » avec « Marge relative (en %) » cochée, et la base enregistre `0.1`. Une marge relative va de 0 à 100 % (de `0` à `1` dans le fichier) ; une marge absolue va jusqu'à 1 000 000. L'import applique les mêmes plafonds. Une marge relative sans valeur de marge est refusée.

## 4. Le HTML autorisé

Les sections et la zone « Je retiens » sont du HTML. Il passe par un nettoyage (`nettoyerHtml`, dans `src/lib/contenu/html.ts`) **à l'enregistrement et encore à l'affichage** : ce qui n'est pas dans la liste blanche est retiré, sans message d'erreur. L'aperçu de l'éditeur de chapitre indique ce que le nettoyage a retiré.

### Balises permises

- **Texte et structure** : `p`, `br`, `hr`, `strong`, `b`, `em`, `i`, `u`, `sub`, `sup`, `small`, `span`, `div`, `h3`, `h4`, `ul`, `ol`, `li`, `blockquote`.
- **Tableaux** : `table`, `caption`, `thead`, `tbody`, `tfoot`, `tr`, `th`, `td`.
- **Figures et liens** : `figure`, `figcaption`, `img`, `a`.
- **Outils interactifs** : `label`, `input` (types `number`, `range` et `text` seulement), `output`.
- **SVG en ligne** : `svg`, `g`, `defs`, `marker`, `pattern`, `linearGradient`, `radialGradient`, `stop`, `line`, `polyline`, `polygon`, `path`, `rect`, `circle`, `ellipse`, `text`, `tspan`, `title`, `desc`.

Les titres de section sont dans le champ `titre` : dans le HTML, utilise `h3` et `h4` (pas de `h1` ni de `h2`).

### Attributs permis

`class`, `id`, `style` (propriétés de mise en forme seulement), `role`, `aria-label`, `aria-hidden`, `aria-describedby`, `title`, `data-ch`, plus ceux de chaque balise : `href`, `target="_blank"` (le nettoyage ajoute `rel="noopener noreferrer"`) pour `a` ; `src`, `alt`, `width`, `height`, `loading` pour `img` ; `colspan`, `rowspan` pour `td` et `th` ; `scope` pour `th` ; `for` pour `label` et `output` ; les attributs graphiques usuels pour le SVG (`viewBox`, `d`, `fill`, `stroke`…).

### Les classes CSS du cours BPH

Seules ces classes ont une mise en forme dans le contenu actuel :

```text
<div class="def"><b class="t">Définition</b><p>…</p></div>     encadré de définition
<div class="warn"><b class="t">Attention</b><p>…</p></div>     encadré d'avertissement
<div class="tbl"><table>…</table></div>                          tableau (défile s'il est large)
<figure class="fig"><div class="scroll"><svg viewBox="0 0 400 200" role="img" aria-label="…"></svg></div><figcaption>…</figcaption></figure>
                                                                 figure ; .scroll permet de faire défiler un schéma large
```

L'éditeur de chapitre propose ces quatre modèles dans la barre « Insérer ». Une autre classe est conservée, mais sans mise en forme.

### Identifiants

Un `id` dans le HTML doit respecter `^[a-z][a-z0-9-]{0,63}$` : minuscules, chiffres et tirets, une lettre en premier, 64 caractères au plus. Un `id` invalide est retiré (cela évite qu'un identifiant n'écrase une variable de la page). Les valeurs de `for` et de `aria-describedby` suivent la même règle, jeton par jeton.

### Ce qui est retiré, et pourquoi

| Retiré | Pourquoi |
| --- | --- |
| `<script>`, `<style>`, `<foreignObject>` et leur contenu, quelle que soit la casse | un script exécuté dans la page d'un élève pourrait lire sa session ; une feuille de style extérieure pourrait masquer ou détourner l'interface |
| les attributs d'événement (`onclick`, `onerror`…) | ils exécutent du code |
| les liens `javascript:` et les schémas autres que `https` et `mailto` | même raison |
| les `url(…)` qui ne visent pas une ancre interne (`url(#id)`) | ils chargent une ressource extérieure |
| les images dont l'adresse n'est pas dans le bucket `schemas` | une image extérieure peut suivre les élèves (leur adresse IP) ou disparaître |
| les balises hors liste (`iframe`, `form`, `object`, `embed`, `h1`, `h2`…) | non prévues dans le cours |

### Images : le bucket `schemas`

Une image est conservée seulement si son `src` pointe vers le bucket public `schemas` de Supabase (`…/storage/v1/object/public/schemas/…`). Dans l'éditeur de chapitre, le bouton de dépôt de schéma envoie le fichier dans ce bucket et insère la balise correcte. N'écris pas une adresse d'image à la main.

## 5. Le versionnage

Une question qui a déjà servi dans un quiz doit rester exacte dans les corrections passées. Quand tu modifies une question :

| Modification | Effet |
| --- | --- |
| **changement de structure** : type, propositions, bonnes réponses, réponses acceptées, marge ou marge relative, sur une question **validée** ou **déjà tirée** dans un quiz | **nouvelle version** : l'ancienne passe à `archivee`, la nouvelle (reliée à l'ancienne) est créée |
| énoncé, explication, notion ou difficulté | modifié **en place**, même sur une question déjà tirée ; les corrections passées affichent le nouveau texte |
| structure d'une question en brouillon ou à relire **jamais tirée** | modifiée en place |

Détails :

- Dans l'éditeur, la nouvelle version d'une question validée part en **à relire** : valide-la de nouveau pour qu'elle revienne dans les tirages. La page affiche « Nouvelle version créée : l'ancienne reste dans les corrections passées ».
- Un quiz déjà passé, ou en cours, garde ses propres questions : sa correction montre **l'ancienne version**, avec ses anciennes propositions.
- Une question validée versionne même si elle n'a jamais été tirée : cela évite qu'un tirage simultané ne calcule l'ordre des propositions sur l'ancienne structure.
- Les signalements ouverts suivent la question vers sa nouvelle version.
- Une question déjà tirée ne peut pas être supprimée ; repasse-la en brouillon. À l'import, une question retirée du fichier est **supprimée** si elle n'a jamais servi, **archivée** si elle a servi ou si elle a un signalement ouvert (le signalement reste à traiter).
- Les questions créées dans l'éditeur n'ont pas de `source` : un import ne les touche jamais.

## 6. L'import

### Le script

```bash
npm run import:contenu -- <fichier.json> [--publier] [--garder-statuts] [--distant]
```

- Sans `--publier`, le cours et les nouveaux chapitres restent en **brouillon** : tu les publies ensuite depuis `/admin`. Avec `--publier`, ils sont publiés. Un cours ou un chapitre déjà publié le reste.
- Avec `--garder-statuts`, une question déjà `valide` ou `brouillon` en base **garde ce statut** même si le fichier la déclare `a_relire` (ou sans statut) : c'est le mode à utiliser pour réimporter un fichier de travail sans perdre les validations de l'enseignant. Son contenu (énoncé, explication, notion, difficulté) est tout de même mis à jour. Si la **structure** change (type, propositions, bonnes réponses, réponses acceptées, marge), la base crée comme d'habitude une nouvelle version : celle d'une question `valide` repart en `a_relire` pour être relue à nouveau, celle d'un `brouillon` reste `brouillon`. Le script affiche alors une ligne `statuts_conserves: N` : le nombre de questions que le fichier déclare non validées et qui sont `valide` en base après l'import. L'éditeur n'est pas concerné.
- Le script utilise la clé `service_role` de `.env.local` et refuse toute base qui n'est pas locale. `--distant` l'autorise volontairement.
- Rien n'est écrit si le fichier est invalide : le script affiche toutes les erreurs, avec leur chemin (« Chapitre 2, question 5, bonnes réponses : … »).
- Le bilan compte les questions **créées**, **modifiées**, **nouvelles versions**, **inchangées**, **archivées** et **supprimées**, et liste les chapitres présents en base mais absents du fichier (laissés tels quels).

Un import est **rejouable** : réimporter le même fichier ne crée rien et laisse les questions inchangées telles quelles. Attention à deux effets :

- il **réapplique le statut du fichier** : une question que tu as validée dans l'éditeur redevient `a_relire` si le fichier la déclare `a_relire` (sauf une question signalée, qui garde son statut, voir la partie 2) ;
- il **réapplique aussi le contenu du fichier** à une question importée que tu as modifiée dans l'éditeur : elle garde sa `source`, donc son énoncé, son explication et sa structure redeviennent ceux du fichier ;
- il remplace les champs du chapitre (titre, résumé, sections, « Je retiens »…) par ceux du fichier : une modification faite dans l'éditeur de chapitre est donc écrasée, à moins de l'avoir reportée dans le fichier.

### La page `/admin/import`

1. Choisis le fichier JSON, coche « Publier le cours et les nouveaux chapitres » si besoin, puis clique sur « Vérifier ».
2. Lis le résumé : titre, nombre de chapitres, questions par statut, et si le cours existe déjà. Si le fichier est invalide, la liste des erreurs s'affiche et rien n'est écrit.
3. Clique sur « Importer » : le bilan s'affiche (créées, modifiées, nouvelles versions, inchangées, archivées, supprimées).

## 7. Banques de questions

Les banques de questions d'un chapitre se produisent dans un **fichier de travail**, contrôlé par script, puis fusionné dans le fichier du cours (`bph.json`, ou `stss.json` avec `--cours stss`), qui reste la seule source de vérité du cours.

### Le fichier de travail

`contenu/1re-st2s/banques/bph-chN.json` (N = numéro du chapitre ; `stss-chN.json` pour le cours STSS) :

```jsonc
{
  "chapitre": 1,
  "notions": ["Organites", "Tissus", "Homéostasie"],
  "questions": [
    { "source": "bph:ch1:banque:001", "type": "qcm_unique", "enonce": "…", "propositions": ["…", "…", "…", "…"],
      "bonnes_reponses": [2], "difficulte": 1, "explication": "…", "notion": "Tissus" }
  ]
}
```

- `notions` : la liste fermée du chapitre (5 à 12 intitulés de 40 caractères au plus, sans doublon). Chaque question en choisit une.
- `questions` : le même format que dans `bph.json` (les indices commencent à 0 ; `vrai_faux` utilise `bonne_reponse` ; `reponse_courte` utilise `reponses_acceptees`). Pas de champ `statut` : la fusion l'impose à `a_relire`.
- Les sources vont de `bph:chN:banque:001` à `bph:chN:banque:130` (BPH) ou de `stss:chN:banque:001` à `stss:chN:banque:150` (STSS).

### Les trois commandes

```bash
npm run banque:texte -- N [--cours stss]       # texte brut du chapitre (titre, chapeau, objectifs, sections, « Je retiens »)
npm run banque:verifier -- N [--cours stss]    # contrôle le fichier de travail ; code de sortie 1 s'il y a des erreurs
npm run banque:fusionner -- N [--cours stss]   # ajoute les questions au chapitre N du cours
```

Sans `--cours`, c'est `bph`. Le cours STSS compte 150 nouvelles questions par chapitre : les quotas sont proportionnels (75 / 30 / 30 / 15 pour les types, 60 / 60 / 30 pour les difficultés).

- `banque:fusionner` refuse un fichier non conforme, et une source déjà présente avec un contenu différent. Une source déjà présente avec le même contenu est ignorée : la fusion est rejouable. `bph.json` est réécrit avec 2 espaces d'indentation et un saut de ligne final, sans changer le reste.
- Script ponctuel : `npx tsx scripts/typo-anciennes-questions.ts` a remplacé les espaces avant « ? : ; ! » par des espaces insécables dans l'énoncé et l'explication des anciennes questions (`quiz`, `bis`), sans toucher aux propositions ; le rejouer est sans effet.
- Après la fusion, importe le cours avec `npm run import:contenu -- contenu/1re-st2s/bph.json --garder-statuts` (partie 6).

### Les règles contrôlées

`banque:verifier` signale toutes ces erreurs en une fois :

1. chaque question passe le validateur d'import ;
2. les sources sont uniques ;
3. les sources respectent `<préfixe>:chN:banque:NNN` (`bph` ou `stss`), avec le bon numéro de chapitre ;
4. types répartis en 65 `qcm_unique`, 26 `qcm_multiple`, 26 `vrai_faux` et 13 `reponse_courte` (BPH ; 75 / 30 / 30 / 15 pour STSS), à plus ou moins 3 près ;
5. difficultés réparties en 52 (niveau 1), 52 (niveau 2) et 26 (niveau 3) (BPH ; 60 / 60 / 30 pour STSS), à plus ou moins 3 près ;
6. une explication non vide ;
7. une notion présente dans la liste du fichier ;
8. aucune proposition du type « Toutes les réponses ci-dessus », « Toutes ces réponses », « Aucune de ces réponses », « Toutes les propositions » (sans égard à la casse ni aux accents) ;
9. un `qcm_multiple` a 2 ou 3 bonnes réponses, et son énoncé contient « Coche toutes les réponses exactes. » ;
10. aucune position ne porte plus de 40 % des bonnes réponses des `qcm_unique` ;
11. la bonne réponse n'est la plus longue que dans moins de 40 % des `qcm_unique` ;
12. deux énoncés (entre eux, ou avec une question existante du chapitre) ne sont pas trop proches : similarité de 0,8 au plus (trigrammes de caractères, accents et ponctuation ignorés) ;
13. les `vrai_faux` ont au plus 60 % de vrais, et au plus 60 % de faux ;
14. une espace insécable (et non une espace normale) avant « : ; ! ? » dans l'énoncé, les propositions et l'explication.
