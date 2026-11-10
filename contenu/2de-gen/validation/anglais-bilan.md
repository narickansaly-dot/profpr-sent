# Bilan : anglais LVA, seconde générale

Bilan du 10 novembre 2026, branche `claude/contenu-2de-anglais-d06ee3`. Le cours et les six banques passent toutes les validations ; les 900 questions sont au statut `a_relire` et attendent la relecture de l'enseignant.

## Décision préalable : le programme de 2025

La commande visait le programme de langues vivantes de 2019 (BO spécial n° 1 du 22 janvier 2019, 8 axes, « B1 vers B2 »). Ce texte est **abrogé pour les langues étrangères** : l'arrêté du 5 mai 2025 (BO n° 22 du 29 mai 2025, NOR MENE2504621A, article 3) le remplace, en seconde dès la rentrée 2025. La session principale a confirmé le changement le 10 novembre 2026. Le cours suit donc l'annexe 4 (anglais, lycée) : **6 axes**, niveau visé **B1+ en LVA**, listes de lexique et de grammaire du programme. Résumé et plan : `programmes/anglais-2de.md`, `programmes/anglais-2de-plan.md`.

## Livrables

| Fichier | Contenu |
| --- | --- |
| `programmes/anglais-2de.md` | Résumé fidèle du programme (références, niveaux, 6 axes, objets d'étude, activités langagières, lexique et grammaire). |
| `programmes/anglais-2de-plan.md` | Un chapitre par axe, avec objets d'étude retenus, sections, lexique, grammaire, objectifs et notions des banques. |
| `anglais.json` | Le cours : slug `anglais-2de-gen`, filière `GEN`, niveau `2de`, matière `Anglais`, couleur `#be185d` (contraste 6,04:1 avec le blanc). 6 chapitres de 7 sections, 900 questions. 604 078 octets (limite : 3 Mo). |
| `banques/anglais-chN.json` | Les six fichiers de travail (150 questions chacun, sources `anglais:chN:banque:001` à `150`). |
| `banques/anglais-chN-relecture.md` | La relecture de chaque banque : corrections faites, variantes des réponses courtes, points de doute. |
| `validation/anglais-chN.md` | Les contrôles automatiques de chaque chapitre. |

Langue : textes, exemples, vocabulaire et formules utiles en anglais ; explications de grammaire, consignes, encadrés de méthode et énoncés des questions en français (tutoiement, comme STSS).

## Chapitres

| N° | Titre | Axe | Grammaire | Questions |
| --- | --- | --- | --- | --- |
| 1 | Looks, norms and identities | 1. Représentation de soi et rapport à autrui | comparatifs et superlatifs ; *look / seem / appear* ; réfléchis et *each other* ; gérondif | 150 |
| 2 | Living between generations | 2. Vivre entre générations | *present perfect* / prétérit ; *for, since, ago* ; *used to, would* ; possessifs ; quantifieurs | 150 |
| 3 | The past in the present | 3. Le passé dans le présent | prétérit simple et *be + -ing* ; passif ; relatives | 150 |
| 4 | Challenges and transitions | 4. Défis et transitions | futur ; conditionnelles ; modaux de probabilité ; connecteurs | 150 |
| 5 | Creating and recreating | 5. Créer et recréer | discours indirect ; *phrasal verbs* ; but et moyen ; exclamatives et causatives | 150 |
| 6 | The Commonwealth: legacy, unity, diversity | 6. Les pays du Commonwealth (obligatoire) | obligation et capacité ; *wish* ; *question tags* ; groupe nominal | 150 |
| | **Total** | | | **900** |

Chaque banque : 75 `qcm_unique`, 30 `qcm_multiple`, 30 `vrai_faux`, 15 `reponse_courte` ; difficultés 60 / 60 / 30 (58 / 62 / 30 au chapitre 1) ; quatre familles (culture, compréhension, vocabulaire, grammaire), avec 8 à 10 notions par chapitre.

## Validation

- **Cours** : `analyserImport` (le validateur de l'import et de `/admin/import`) ne renvoie aucune erreur ; `couleurCoursAcceptable('#be185d')` est vrai (6,04:1) ; `nettoyerHtml` ne retire rien ; aucune espace ordinaire avant « : ; ! ? » dans le texte du cours.
- **Banques** : les six passent `verifierBanque` (14 règles), avec la configuration `{ prefixe: 'anglais', total: 150 }`, soit les quotas de STSS.
- **Fusion** : `fusionnerBanque` a ajouté les 6 × 150 questions au statut `a_relire` ; une seconde fusion n'ajoute rien.
- **Import à blanc** : la charge produite par `versDonneesCours` (la conversion de `scripts/importer-contenu.ts`) a été passée à `public.importer_cours` dans la base locale (conteneur `supabase_db_app-lycee`), en rôle `service_role`, dans une transaction terminée par `ROLLBACK`. Bilan renvoyé : `cree: 900, modifiee: 0, versionnee: 0, inchangee: 0, archivee: 0, supprimee: 0, chapitres: 6, chapitres_absents: []` ; 900 questions `a_relire`, cours non publié. Après le `ROLLBACK`, aucun cours `anglais-2de-gen` n'existe en base : rien n'a été écrit.
- La filière `GEN` et le niveau `2de` existent déjà (`supabase/seed.sql`) : aucune migration n'est nécessaire.

## Scripts à faire évoluer (non modifiés, hors périmètre de cette session)

1. **`banque:texte`, `banque:verifier`, `banque:fusionner`** ne connaissent que deux cours : `NomCours = 'bph' | 'stss'` et `COURS_BANQUE` dans `src/lib/contenu/banque/cours.ts`, et le chemin `contenu/1re-st2s/banques/` est écrit en dur dans les trois scripts. Proposition : ajouter `anglais: { nom: 'anglais', fichier: 'contenu/2de-gen/anglais.json', prefixe: 'anglais', total: 150 }` et déduire le dossier des banques de `fichier` (`<dossier du cours>/banques/<nom>-chN.json`). Les autres matières de seconde auront le même besoin. En attendant, les contrôles ont été faits avec un banc hors dépôt qui appelle les mêmes fonctions.
2. **`import:contenu`** n'a pas de mode « à blanc » : il écrit toujours en base. Proposition : une option `--a-blanc` qui appelle `importer_cours` dans une transaction annulée (ou qui s'arrête après `analyserImport`). Le bouton « Vérifier » de `/admin/import` couvre ce besoin dans l'application.
3. **`db:reset`** ne réimporte que `bph.json` ; à compléter si le cours d'anglais doit être chargé après une remise à zéro.
4. **Réponses courtes** : `prive.normaliser` ne remplace pas l'apostrophe typographique ’ par ' à l'intérieur d'un mot. Les banques listent donc chaque contraction sous les deux formes (*haven't* et *haven’t*). Normaliser ’ dans la base allégerait toutes les banques de langue (migration, hors périmètre).

## Points à trancher

1. **Six chapitres pour cinq axes** : en voie générale, le programme demande cinq axes sur six, dont l'axe 6. Garder les six chapitres et laisser l'enseignant en écarter un, ou en retirer un dès maintenant ?
2. **Répartition de la grammaire** : chaque point du programme n'est présenté qu'une fois, dans le chapitre dont les actes langagiers en ont besoin (choix éditorial). L'enseignant peut préférer un autre ordre (par exemple le *present perfect* plus tôt).
3. **Ordre des chapitres** : celui du programme ; le Commonwealth (obligatoire) pourrait être placé plus tôt.
4. **Titres de chapitres en anglais** (« Looks, norms and identities ») : à garder, ou à doubler d'un titre français ?
5. **Relecture** : chaque banque a été relue par la session qui l'a rédigée (voir les fichiers `-relecture.md`), pas par une seconde session indépendante comme pour STSS. Une relecture indépendante, ou celle de l'enseignant, reste à faire avant de valider.
6. **Données datées** : 56 États membres, 2,7 milliards d'habitants, 15 *realms* (chapitre 6), interdiction d'escalader Uluru depuis 2019 (chapitre 3) : exactes à la rédaction, à revérifier chaque année.
7. **Faits à confirmer avec le manuel** : « at least 50,000 years » (chapitre 3 ; d'autres sources disent 60 000 ou 65 000 ans) ; « about one cowboy in four was Black » (chapitre 5, estimation) ; « hundreds of passengers » sur l'*Empire Windrush* (chapitre 6, chiffre volontairement non précisé).
8. **Phonologie, médiation, interaction orale** : peu évaluables par QCM ; elles sont présentes dans le cours (encadrés /θ/ /ð/ et *-ate*, formules utiles) mais quasi absentes des banques.
