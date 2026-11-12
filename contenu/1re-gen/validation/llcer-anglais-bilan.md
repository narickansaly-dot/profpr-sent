# Bilan : LLCER anglais (spécialité), première générale

Bilan du 12 novembre 2026, branche `claude/contenu-1re-llcer-anglais-b16a98`. Le cours et les six banques passent toutes les validations. Les 900 questions ont été relues de façon indépendante et sont au statut `valide`.

## Programme suivi

- **Programme** : arrêté du 17 janvier 2019, NOR **MENE1901590A**, BO spécial n° 1 du 22 janvier 2019, annexe 2 (anglais). Deux thématiques obligatoires, « Imaginaires » et « Rencontres », chacune déclinée en trois axes indicatifs. Niveau visé : B2 en fin de première.
- **Œuvres** : programme limitatif de première pour 2025-2026 et 2026-2027, note de service **MENE2504606N**, BO n° 25 du 19 juin 2025 : *Fahrenheit 451*, *Lord of the Flies*, *To Kill a Mockingbird*, Poe (*The Fall of the House of Usher* et *The Tell-Tale Heart*, comptées pour une œuvre), *The Heart is a Lonely Hunter*, *The Importance of Being Earnest* ; films : *2001: A Space Odyssey*, *West Side Story*, *A.I. Artificial Intelligence*.
- **Vérification du 11 novembre 2026** : l'arrêté du 5 mai 2025 (MENE2504621A) ne remplace que les programmes **communs et optionnels** de langues vivantes. Éduscol (page mise à jour en juin 2026) donne toujours l'arrêté de 2019 comme programme de spécialité en vigueur en première. Aucun nouveau programme de LLCER n'a été trouvé pour 2026-2027.
- Résumé : `programmes/llcer-anglais-1re.md` ; plan : `programmes/llcer-anglais-1re-plan.md`.

## Livrables

| Fichier | Contenu |
| --- | --- |
| `programmes/llcer-anglais-1re.md` | Résumé du programme et du programme limitatif, avec références NOR et BO, et preuve qu'il est en vigueur. |
| `programmes/llcer-anglais-1re-plan.md` | Découpage en six chapitres, un par axe. |
| `llcer-anglais.json` | Le cours : slug `llcer-anglais-1re-gen`, filière `GEN`, niveau `1re`, matière `LLCER anglais`, couleur `#9d174d` (contraste **7,88:1** avec le blanc, accepté). 6 chapitres de 7 sections, 900 questions `valide`. 679 434 octets (limite : 3 Mo). |
| `banques/llcer-anglais-chN.json` | Six fichiers de travail, 150 questions chacun (sources `llcer-anglais:chN:banque:001` à `150`). |
| `banques/llcer-anglais-chN-relecture.md` | Contrôle par l'auteur et relecture indépendante à l'aveugle de chaque banque : concordance, remarques, décisions. |
| `validation/llcer-anglais-chN.md` | Contrôles automatiques et répartitions de chaque chapitre. |

Langue : explications, consignes, méthodes et énoncés en français, avec le tutoiement comme STSS. Extraits, notions, vocabulaire et exemples sont en anglais. Les citations sont courtes et référencées. Elles viennent du domaine public (Shakespeare, Blake, Coleridge, Shelley, Poe, Stevenson, Byron, Austen, Whitman, Wilde, Kipling, Henley). Les œuvres protégées (Bradbury, Golding, Lee, McCullers, Huxley, Atwood, les films) sont résumées et n'apparaissent qu'à travers de très courtes formules célèbres.

## Chapitres

| N° | Titre | Thématique, axe | Œuvres du programme limitatif | Méthode | Grammaire | Questions |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Creative and visionary imagination | Imaginaires, 1 | *2001: A Space Odyssey* | analyse d'image et de film | conditionnels, *wish*, *as if* | 150 |
| 2 | Frightening imaginations | Imaginaires, 2 | Poe, *Usher* et *The Tell-Tale Heart* | narration | temps du récit, modaux de déduction | 150 |
| 3 | Utopias and dystopias | Imaginaires, 3 | *Fahrenheit 451*, *A.I.* | essai argumentatif | passif, causatives | 150 |
| 4 | Love and friendship | Rencontres, 1 | *The Heart is a Lonely Hunter*, *West Side Story* | analyse poétique | verbe + *to* / *-ing*, emphase | 150 |
| 5 | The individual and the group | Rencontres, 2 | *Lord of the Flies*, *The Importance of Being Earnest* | analyse théâtrale | relatives, discours rapporté | 150 |
| 6 | Confronting difference | Rencontres, 3 | *To Kill a Mockingbird* | traduction et médiation | articles, indénombrables, faux amis, *-ing* | 150 |
| | **Total** | | 6 œuvres + 3 films | | | **900** |

Chaque banque compte 75 `qcm_unique`, 30 `qcm_multiple`, 30 `vrai_faux` et 15 `reponse_courte`, réparties sur 8 ou 9 notions. Les difficultés sont réparties à peu près en 60 / 60 / 30.

## Validation

- **Cours** : `analyserImport` ne renvoie aucune erreur ; `couleurCoursAcceptable('#9d174d')` est vrai ; `nettoyerHtml` ne retire rien, il ajoute seulement `tabindex="0"` aux tableaux ; il ne reste aucune espace ordinaire avant « : ; ! ? ». Les seules balises utilisées sont celles de la liste blanche (`p`, `h3`, `ul`, `ol`, `li`, `blockquote`, `small`, `strong`, `em`, `sup`, `br`, `div.def`, `div.warn`, `div.tbl`, tableaux).
- **Banques** : les six passent `verifierBanque` (quotas, sources, notions, positions, biais de longueur, similarité, vrai/faux, typographie) avec la configuration `{ prefixe: 'llcer-anglais', total: 150 }`.
- **Fusion** : `fusionnerBanque` a ajouté 6 × 150 questions. Une seconde fusion n'ajoute rien, même après le passage des statuts à `valide`.
- **Import à blanc** : la charge produite par `versDonneesCours` (la conversion utilisée par `scripts/importer-contenu.ts`) a été passée à `public.importer_cours` dans la base locale (conteneur `supabase_db_app-lycee`), en rôle `service_role`, dans une transaction terminée par `ROLLBACK`. Bilan renvoyé : `cree: 900, modifiee: 0, versionnee: 0, inchangee: 0, archivee: 0, supprimee: 0, chapitres: 6, chapitres_absents: []`. On obtient 900 questions `valide` et un cours non publié. Après le `ROLLBACK`, aucun cours `llcer-anglais-1re-gen` n'existe en base : rien n'a été écrit.
- La filière `GEN` et le niveau `1re` existent déjà : aucune migration n'est nécessaire.

## Vérification des quiz : relecture indépendante

Pour chaque banque, un sous-agent indépendant a reçu le texte du chapitre et les questions **sans les réponses attendues**, avec les propositions déjà mélangées. Il a résolu les 150 questions, puis relevé les ambiguïtés, les distracteurs défendables et les erreurs factuelles. Ses réponses ont été comparées automatiquement aux clés.

| Chapitre | Concordance à l'aveugle | Remarques | Erreurs du cours corrigées (exemples) |
| --- | --- | --- | --- |
| 1 | 150 / 150 | 17 | intrigue de *Frankenstein* (meurtre de William avant la demande d'une compagne) ; fuite des amants dans *A Midsummer Night's Dream* ; définitions de *pan* et *tracking shot* |
| 2 | 150 / 150 | 22 | Mina déjà mariée à Jonathan ; « werecat » de *Thriller* ; figure de cire d'*Udolpho* ; *climax* et *plot twist* distingués |
| 3 | 148 / 150 | 21 | dernière phrase d'*Animal Farm* ; ordre des parties de *Fahrenheit 451* (discours de Beatty) ; Martin en animation suspendue dans *A.I.* |
| 4 | 150 / 150 | 20 | pronom erroné et mensonge d'Anita dans *West Side Story* ; lettres jamais envoyées de Singer ; vers exact de William Sharp (Fiona Macleod) |
| 5 | 149 / 150 | 19 | ordre des événements de *Lord of the Flies* (Ralph et Piggy dans la danse qui tue Simon) ; condamnation de Wilde ; fermetures des puits par le National Coal Board |
| 6 | 150 / 150 | 23 | Boo Radley « jamais vu dehors » ; Fielding directeur du Government College ; loyalistes et républicains comme branches radicales ; exemple de modulation |
| **Total** | **897 / 900** | **122** | |

Les trois écarts (deux au chapitre 3, un au chapitre 5) ont été examinés un par un. Les deux du chapitre 3 révélaient de vrais défauts, qui ont été corrigés. Au chapitre 5, le relecteur reconnaît lui-même dans ses remarques que la clé est juste. En tout, 122 remarques ont été traitées : questions reformulées, distracteurs défendables remplacés, variantes ajoutées aux réponses courtes, une trentaine de passages du cours corrigés. Le détail figure dans chaque `-relecture.md`.

**Statut appliqué** : `valide` pour les 900 questions, comme dans les commits de validation de BPH et STSS (67d1671, 90bd11c). Après correction, aucune question ne reste réellement douteuse : aucune n'est laissée `a_relire`.

## Scripts à faire évoluer (non modifiés, hors périmètre)

1. **`banque:texte`, `banque:verifier`, `banque:fusionner`** ne connaissent que `bph` et `stss` (`src/lib/contenu/banque/cours.ts`), et le dossier `contenu/1re-st2s/banques/` y est écrit en dur. Je propose d'ajouter `llcer-anglais: { nom: 'llcer-anglais', fichier: 'contenu/1re-gen/llcer-anglais.json', prefixe: 'llcer-anglais', total: 150 }` et de déduire le dossier des banques de `fichier`. Les contrôles ont été faits avec un banc hors dépôt qui appelle les mêmes fonctions.
2. **`import:contenu`** n'a pas de mode « à blanc » : je propose une option `--a-blanc`, qui ferait un `importer_cours` dans une transaction annulée.
3. **Réponses courtes** : `prive.normaliser` ne ramène pas l'apostrophe ’ à ' à l'intérieur d'un mot, si bien que les banques listent les deux formes. Les accents et la casse sont déjà ignorés.

## Points à trancher

1. **Six axes pour deux thématiques** : le programme rend obligatoires les deux thématiques, mais ses axes ne sont qu'indicatifs. Le cours couvre les six axes. L'enseignant peut n'en traiter qu'une partie.
2. **Œuvres** : le programme limitatif impose deux œuvres intégrales, une par thématique, et le cours présente les neuf. Faut-il garder tous les résumés ou ne laisser que les deux œuvres choisies par l'enseignant ? Le rattachement de chaque œuvre à un chapitre est un choix du cours : la note de service n'en impose aucun.
3. **Programme limitatif daté** : il vaut pour 2025-2026 et 2026-2027. Un nouveau programme limitatif est attendu pour 2027-2028, et les sections sur les œuvres seront alors à revoir.
4. **Grammaire** : le programme de spécialité ne donne aucune liste. La répartition des points par chapitre est éditoriale ; à harmoniser avec le cours d'anglais LVA de 1re, traité par une autre session, pour éviter les doublons.
5. **QCM multiples** : 150 des 180 `qcm_multiple` (83 %) ont trois bonnes réponses sur quatre. `verifierBanque` l'accepte, mais un élève peut repérer la tendance. Il faudrait rééquilibrer vers davantage de questions à deux bonnes réponses, ou ajouter cette règle au contrôle.
6. **Œuvres protégées** : les résumés de Bradbury, Golding, Lee et McCullers ne citent que de très courtes formules. À confirmer avec la politique du projet sur les citations.
7. **Données datées** : *Black Mirror* (« since 2011 ») et la mention du scandale Windrush (2018) sont à revérifier selon l'actualité.
8. **Titres de chapitres en anglais**, comme dans le cours d'anglais de 2de : faut-il les doubler d'un titre français ?
9. **Phonologie, oral, interaction** : ces compétences sont peu évaluables par QCM. Elles sont présentes dans le cours (prononciation, formules utiles) mais presque absentes des banques.
