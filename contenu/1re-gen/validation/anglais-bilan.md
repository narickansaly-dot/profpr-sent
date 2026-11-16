# Bilan : anglais LVA, première générale

Bilan du 16 novembre 2026, branche `claude/contenu-1re-anglais-85bbb9`. Le cours et les six banques passent toutes les validations. Les 900 questions ont été relues de façon indépendante, à l'aveugle, et sont au statut `valide` ; aucune n'est restée douteuse.

## Programme suivi

**Arrêté du 5 mai 2025, NOR MENE2504621A, BO n° 22 du 29 mai 2025, annexe 4** (anglais, lycée général et technologique), partie « Classe de première ». L'article 4 l'applique en première **à la rentrée 2026-2027** ; l'article 3 abroge, pour les langues étrangères, le programme de 2019 (cycle terminal à huit axes communs, « Gestes fondateurs et mondes en mouvement »). Le nouveau programme fixe **six axes propres à la première**, dont cinq à traiter en voie générale, l'axe 6 étant obligatoire. Niveau visé en fin de première : **B1+ en LVA** (B1 en LVB). Résumé et plan : `programmes/anglais-1re.md`, `programmes/anglais-1re-plan.md`. Ce cours est le tronc commun LVA, distinct de la spécialité LLCER anglais.

## Livrables

| Fichier | Contenu |
| --- | --- |
| `programmes/anglais-1re.md` | Résumé fidèle du programme : référence, entrée en vigueur, niveaux, six axes et objets d'étude, activités langagières, lexique et grammaire B1 / B1+. |
| `programmes/anglais-1re-plan.md` | Un chapitre par axe : objets d'étude retenus, sections, grammaire, notions des banques. |
| `anglais.json` | Le cours : slug `anglais-1re-gen`, filière `GEN`, niveau `1re`, matière `Anglais`, couleur `#be185d` (contraste 6,04:1 avec le blanc). 6 chapitres de 7 sections (3 textes de culture, 1 de vocabulaire, 3 de grammaire), 900 questions `valide`. 706 788 octets (limite : 3 Mo). |
| `banques/anglais-chN.json` | Les six banques relues (150 questions chacune, sources `anglais:chN:banque:001` à `150`). |
| `banques/anglais-chN-relecture.md` | La relecture indépendante de chaque banque : résultat à l'aveugle, questions corrigées, remarques sur le cours. |
| `validation/anglais-chN.md` | Les contrôles automatiques de chaque chapitre (répartitions, statuts, notions). |

Langue : textes, exemples et vocabulaire en anglais ; explications de grammaire, méthodes et énoncés des questions en français, avec le tutoiement (comme en seconde et en STSS).

## Chapitres

| N° | Titre | Axe | Objets d'étude | Grammaire | Questions |
| --- | --- | --- | --- | --- | --- |
| 1 | Identities and exchanges | 1. Identités et échanges | immigration au Canada ; Windrush generation ; frontière irlandaise | choix des temps du passé ; *past perfect* ; marqueurs temporels, *used to / would*, futur dans le passé | 150 |
| 2 | Diversity and inclusion | 2. Diversité et inclusion | logement et mixité ; Cour suprême des États-Unis ; Peuples premiers et politique | passif ; relatives (*whose, whom*) ; *want sb to* | 150 |
| 3 | Art and power | 3. Art et pouvoir | portraits officiels ; art de résistance et de reconnaissance ; caricature et photojournalisme | discours rapporté ; questions indirectes ; emphase, adverbes de degré, exclamatives | 150 |
| 4 | Science and responsibility | 4. Innovations scientifiques et responsabilité | à qui appartient l'espace ? ; l'Écosse, du charbon à l'éolien ; quête de l'homme parfait | conditionnelles, *unless* ; inversion et modaux de probabilité ; connecteurs | 150 |
| 5 | Humans and nature | 5. L'être humain et la nature | parcs nationaux ; événements climatiques extrêmes ; nature sacralisée | obligation, permission, capacité ; causatives et résultatives ; *phrasal verbs* et gérondif | 150 |
| 6 | The English-speaking Americas | 6. Les aires anglophones américaines (obligatoire) | Caraïbes ; Porto Rico ; Vancouver et Seattle | adjectifs composés, groupe nominal, distributifs ; *wish* ; questions en *How*, *tags* | 150 |
| | **Total** | | | | **900** |

Chaque banque compte 75 `qcm_unique`, 30 `qcm_multiple`, 30 `vrai_faux` et 15 `reponse_courte`, avec 60 / 60 / 30 questions par niveau de difficulté (60 / 61 / 29 au chapitre 2), 9 ou 10 notions, et quatre familles de questions : culture, compréhension, vocabulaire, grammaire. Vrai/faux : 15 vrais et 15 faux, sauf au chapitre 6 (16 / 14).

## Méthode et vérification des quiz

1. **Rédaction** : un sous-agent par chapitre rédige la banque à partir du seul texte du chapitre (`banque:texte`), selon des consignes communes (quotas, distracteurs, variantes des réponses courtes, règles de `verifierBanque`).
2. **Relecture indépendante** : un **autre** sous-agent, qui n'a pas écrit la banque, reçoit les questions **sans les réponses** (énoncés et propositions seulement) et répond aux 150. Un script compare ensuite ses réponses à la banque, avec la normalisation de la base (casse, accents, espaces, ponctuation). Le relecteur relit enfin toutes les questions et explications, corrige directement la banque et rédige le `-relecture.md`.
3. **Statuts** : comme pour BPH et STSS (commits 67d1671 et 90bd11c), les questions retenues après relecture passent au statut `valide`. Seules les questions jugées réellement douteuses devaient rester `a_relire` ; il n'y en a aucune.

| Chapitre | Concordances à l'aveugle | Questions corrigées | Exemples |
| --- | --- | --- | --- |
| 1 | 150 / 150 | 6 | explications en anglais fautif (010, 064) ; « au minimum » contre « more than 25,000 » (008) ; variante *had never needed* (115) |
| 2 | 150 / 150 | 8 | explication qui inversait partisans et critiques (044) ; quatre énoncés qui donnaient la réponse d'une autre question (021, 082, 087, 095) ; la Voice « à inscrire » dans la Constitution (038) |
| 3 | 150 / 150 | 8 | affirmation absente du texte sur la photo de Lange (127) ; distracteurs défendables *hardly* (134) et *very terrifying* (146) ; variantes *Washington, DC*, *sixty*, *'d taken* |
| 4 | 150 / 150 | 2 | *natural gas* présenté à tort comme cité par le cours (066) ; « expression soulignée » sans soulignement (091) |
| 5 | 150 / 150 | 5 | deux explications qui désignaient les mauvaises phrases (117, 147) ; énoncé qui parlait d'obligation pour une interdiction (085) |
| 6 | 150 / 150 | 9 | *Spanish-speaking* mal analysé (090) ; *question tags* de même polarité défendables, énoncés précisés (134 à 138) ; variantes *3-day*, *6-month-old*, *they've not* |
| **Total** | **900 / 900** | **38** | aucune bonne réponse n'était fausse ; aucune question laissée à relire |

Les corrections portent sur des explications, des énoncés trop indicatifs ou ambigus, des distracteurs défendables et des variantes de réponses courtes manquantes.

### Corrections du cours après relecture

- Chapitre 1 : l'État libre d'Irlande date de 1922 (et non 1921).
- Chapitre 3 : les portraits des Obama sont ceux « d'un président et d'une First Lady » (et non deux « portraits présidentiels ») ; Gillray vient « environ cinquante ans » après Hogarth.
- Chapitre 5 : Banff (1885) est présenté comme le début du premier parc national canadien ; *as far as the lake* remplace *until the lake*.
- Chapitre 6 : *Spanish-speaking* est rangé parmi les composés « nom + participe ».

## Validation

- **Cours** : `analyserImport` (le validateur de l'import et de `/admin/import`) ne renvoie aucune erreur ; `couleurCoursAcceptable('#be185d')` est vrai (6,04:1) ; `nettoyerHtml` ne retire rien (il ajoute seulement `tabindex="0"` aux tableaux défilants) ; les balises employées sont dans la liste blanche (`p`, `h3`, `ul`, `li`, `strong`, `em`, `b`, `div`, `table` et ses éléments).
- **Banques** : les six passent `verifierBanque` (14 règles) avec la configuration `{ prefixe: 'anglais', total: 150 }`, soit les quotas de STSS.
- **Fusion** : `fusionnerBanque` a ajouté les 6 × 150 questions dans `anglais.json`.
- **Import à blanc** : la charge produite par `versDonneesCours` (la conversion de `scripts/importer-contenu.ts`) a été passée à `public.importer_cours` dans la base locale (conteneur `supabase_db_app-lycee`), en rôle `service_role`, dans une transaction terminée par `ROLLBACK`. Bilan renvoyé : `cree: 900, modifiee: 0, versionnee: 0, inchangee: 0, archivee: 0, supprimee: 0, chapitres: 6, chapitres_absents: []` ; 900 questions `valide` ; cours non publié. Après le `ROLLBACK`, aucun cours `anglais-1re-gen` n'existe : rien n'a été écrit.
- La filière `GEN` et le niveau `1re` existent déjà (`supabase/seed.sql`) : aucune migration n'est nécessaire.

## Scripts à faire évoluer (non modifiés, hors périmètre)

1. **`banque:texte`, `banque:verifier`, `banque:fusionner`** ne connaissent que `bph` et `stss` (`src/lib/contenu/banque/cours.ts`) et lisent `contenu/1re-st2s/banques/`. Proposition : ajouter `anglais-1re` (`contenu/1re-gen/anglais.json`, préfixe `anglais`, total 150) et déduire le dossier des banques du fichier du cours. Toutes les matières de 2de et de 1re générales ont le même besoin. En attendant, les contrôles ont été faits avec un banc hors dépôt qui appelle les mêmes fonctions.
2. **Préfixe des sources** : les banques de 2de et de 1re utilisent toutes deux `anglais:chN:banque:NNN`. Les sources ne doivent être uniques que dans un fichier, donc l'import fonctionne ; un préfixe distinct (`anglais-1re`) éviterait toute confusion si un outil croise un jour les deux cours.
3. **`import:contenu`** n'a pas de mode « à blanc » ; une option qui appelle `importer_cours` dans une transaction annulée serait utile.
4. **`db:reset`** ne réimporte que `bph.json`.
5. **Réponses courtes** : `prive.normaliser` ne remplace pas l'apostrophe ’ par ' à l'intérieur d'un mot ; les banques listent donc les deux formes de chaque contraction. Normaliser ’ dans la base allégerait les banques de langues (migration, hors périmètre).

## Points à trancher

1. **Six chapitres pour cinq axes** : en voie générale, le programme demande cinq axes sur six, dont l'axe 6. On garde les six chapitres et l'enseignant en écarte un, ou on en retire un dès maintenant ?
2. **Statut `valide` sans relecture humaine** : la relecture a été faite par des sous-agents indépendants (900 concordances à l'aveugle), selon le même cycle que BPH et STSS. Si tu veux une relecture humaine avant que les questions soient tirées en quiz, réimporte-les en `a_relire`.
3. **Répartition de la grammaire et ordre des chapitres** : chaque point du programme n'est présenté qu'une fois (choix éditorial) ; l'axe 6, obligatoire, pourrait venir plus tôt.
4. **Données datées, à revérifier chaque année** : 23 % d'immigrés au Canada (recensement 2021) ; 7 sièges maoris ; 15 membres de la CARICOM ; environ 3,2 millions d'habitants à Porto Rico et référendums de 2020 et 2024 ; Coupe du monde 2026 à Vancouver et Seattle ; objectif écossais de neutralité carbone en 2045 ; 114 éoliennes à Seagreen.
5. **Faits à confirmer avec le manuel** : « more than a thousand passengers » sur l'*Empire Windrush* ; « nearly three billion animals » (étude du WWF sur le *Black Summer*) ; « about 3,000 » morts de l'ouragan Maria (estimation officielle révisée) ; « more than 110 countries » pour le traité de 1967.
6. **Questions qui débordent un peu du texte** : quelques mots courants absents des textes (*heatwave*, *grow up*, *natural gas*…), gardés par les relecteurs car transparents et expliqués dans la correction.
7. **Objets d'étude non retenus** : mobilité sociale et discrimination positive (seulement évoquée), cinéma et séries politiques, « vivre avec et vivre de la nature » ; le pôle d'attraction nord-américain est traité dans la section Vancouver-Seattle.
8. **Phonologie, interaction et médiation** : présentes dans le cours (encadrés de prononciation, formules utiles), mais peu évaluables par des QCM et presque absentes des banques.
