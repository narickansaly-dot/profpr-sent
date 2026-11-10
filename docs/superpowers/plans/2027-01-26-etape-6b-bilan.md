# Étape 6b : bilan et points reportés

État final sur la branche `etape-6b-stss` :
- 522 tests unitaires (Vitest, 54 fichiers) ;
- 1094 tests de la base (pgTAP, 39 fichiers) ;
- 86 exécutions de bout en bout (Playwright, mobile et ordinateur, avec un build de production) : 76 réussies et 10 ignorées (la revue axe ne tourne que sur mobile). Les premières exécutions complètes ont vu échouer `e2e/accessibilite.spec.ts` (consentement parental, parfois aussi « espace parent ») sur mobile : `AbortError` dans l'attente des animations (`a.finished` est rejetée quand une navigation annule l'animation). Le test passait seul. Correctif minimal dans son propre commit (`d9439eb`) : l'attente ignore les annulations. Deux exécutions complètes consécutives ensuite : 76 réussies ;
- typage et build sans erreur ; lint sans erreur (le même avertissement `no-unused-vars` dans `src/app/mes-donnees/actions.ts`) ;
- `npm run banque:verifier -- N --cours stss` conforme pour les chapitres 1 à 10 (150 questions chacun) ;
- `npm run db:reset` puis `npm run import:contenu -- contenu/1re-st2s/stss.json --garder-statuts` : 1500 questions créées, cours STSS non publié (jamais de `--publier`).

Commandes : `npm run db:reset`, import de STSS avec `--garder-statuts`, `npm run test:db`, `npm test`, `npm run typecheck`, `npm run lint`, `npm run build`, `npm run e2e`.

## Ce qui a été livré

- **Un second cours complet, STSS de 1re ST2S** : 10 chapitres rédigés d'après le programme officiel, dans `contenu/1re-st2s/stss.json`, importé **non publié**. Le cours reste invisible aux élèves tant que l'enseignant ne le publie pas, chapitre par chapitre.
- **Banques de questions** : 150 questions par chapitre, 1500 au total (STSS n'avait aucune question existante). Elles arrivent en `a_relire` : aucune n'est tirée dans un quiz avant validation. Types 75 / 30 / 30 / 15 et difficultés 60 / 60 / 30 (à plus ou moins 3 près), clé `stss:chN:banque:NNN`.
- **Option `--cours`** pour `banque:texte`, `banque:verifier` et `banque:fusionner` : `bph` par défaut, `stss` pour le nouveau cours (commits de la tâche 1).
- **Test e2e autonome** `e2e/stss.spec.ts` : il crée son propre cours non publié et vérifie que l'admin le voit marqué « Brouillon ».
- **Relecture** de chaque chapitre du cours contre le programme et les sources, puis de chaque banque contre le cours, par un relecteur distinct de l'auteur, sans échantillonnage. Revues d'ensemble du cours (tâche 3) et des banques (tâche 4).

## Source officielle du programme

Arrêté du 17 janvier 2019, NOR MENE1901642A, J.O. du 20 janvier 2019 ; annexe 3, « Programme de sciences et techniques sanitaires et sociales de première ST2S » ; Bulletin officiel spécial n° 1 du 22 janvier 2019. Récupéré le 10 novembre 2026 ; Légifrance : aucun texte modificatif. Référence détaillée et URL : `contenu/1re-st2s/programmes/stss-1re.md`. Couverture : 79 notions sur 79 et 51 capacités sur 51.

Décision de l'enseignant à l'arrêt 1 : 10 chapitres (la question 9 du programme est coupée en deux, « Recherche documentaire » et « Démarche d'étude », placés après le chapitre 3).

## Par chapitre

Longueur : caractères du texte du chapitre tel que `npm run -s banque:texte -- N --cours stss` le sort (`wc -m`). BPH ch1 en fait environ 11 000 : STSS est environ 1,5 fois plus long. « Corrections » : lignes du tableau de corrections de la relecture du cours. Gardées, corrigées et remplacées portent sur les 150 questions de la banque, selon les rapports de relecture.

| Chapitre | Titre court | Sections | Texte (caractères) | Corrections du cours | Gardées | Corrigées | Remplacées |
|---|---|---|---|---|---|---|---|
| 1 | Santé | 5 | 16 639 | 6 | 129 | 13 | 8 |
| 2 | Cohésion sociale | 6 | 18 810 | 5 | 128 | 5 | 17 |
| 3 | Indicateurs | 6 | 17 843 | 11 | 128 | 17 | 5 |
| 4 | Recherche documentaire | 4 | 14 364 | 6 | 131 | 3 | 16 |
| 5 | Démarche d'étude | 7 | 18 138 | 15 | 133 | 10 | 7 |
| 6 | Problèmes de santé | 6 | 18 392 | 13 | 135 | 13 | 2 |
| 7 | Problèmes sociaux | 4 | 17 553 | 7 | 113 | 6 | 31 |
| 8 | Protection sociale | 6 | 18 998 | 12 | 132 | 10 | 8 |
| 9 | Action en santé | 6 | 17 522 | 10 | 122 | 14 | 14 |
| 10 | Intervention sociale | 6 | 18 460 | 9 | 121 | 13 | 16 |
| Total | | 56 | 176 719 | 94 | 1272 | 104 | 124 |

Sur les 1500 questions, 1272 ont été gardées telles quelles, 104 corrigées et 124 remplacées. Le chapitre 7 a le plus de remplacements (31) : le rédacteur avait introduit des notions absentes du cours.

## Revues d'ensemble

- **Cours (tâche 3)** : revue Sonnet des chapitres 2 à 10, un Important (deux grilles de participation différentes aux chapitres 9 et 10) et neuf Mineurs. Tout a été corrigé en une vague (commit `f4d633a`) : grille unique à cinq degrés (information, consultation, concertation, co-construction, décision et action), citation de la Charte d'Ottawa vérifiée sur who.int, prénoms et espaces insécables harmonisés. L'enseignant a validé le cours entier à l'arrêt 3.
- **Banques (tâche 4)** : environ 480 questions relues sur 1500 (20 par chapitre tirées au hasard, plus toutes les questions citées dans les doutes). Un Important, corrigé par le contrôleur (`e75448a`) : la question `stss:ch9:banque:124` était ambiguë (« pèse sur les décisions »), elle est reformulée sur ce que le cours dit explicitement. Aucune bonne réponse fausse trouvée.

## Éléments datés à vérifier avant publication

Relevés dans les rapports de relecture du cours. Le cours ne donne aucun montant ni aucune statistique datée.

- **Chapitre 1** : vaccinations obligatoires des jeunes enfants (11 depuis 2018, mais ni nombre ni date dans le chapitre) ; dépistage organisé de certains cancers (sein, côlon-rectum, col de l'utérus, sans liste dans le chapitre) ; exemples d'actualité (santé mentale des jeunes, vagues de chaleur, surpoids, sommeil et écrans) à vérifier à la date de publication ; citation de Leriche laissée sans date (1936 non confirmée).
- **Chapitre 2** : interdiction de fumer dans les lieux publics fermés, énoncée sans date (décret de 2006, non cité) ; PCS 2020 (page Insee mise à jour le 16 décembre 2024).
- **Chapitre 3** : noms de Drees, Santé publique France, Inserm (CépiDc) et PNUD ; les trois composantes de l'IDH (méthode révisée en 2010) ; fichier d'inscrits sans nom d'organisme.
- **Chapitre 5** : loi Informatique et libertés (6 janvier 1978, modifiée en 2018) et RGPD ; noms français des fonctions du tableur (`NB.SI`, `SOMME`, `MOYENNE`) à comparer au tableur de la classe.
- **Chapitre 6** : interdiction de l'amiante (1er janvier 1997, stable) ; exemples historiques de la canicule de 2003 et du Covid-19, peut-être à remplacer par un exemple plus récent ; le plan canicule a changé de nom.
- **Chapitre 7** : seuil de pauvreté à 60 % comme seuil principal de l'Insee ; indicateur de « privation matérielle et sociale » et ses trois exemples ; quartiers prioritaires de la politique de la ville (2014, géographie révisée régulièrement) ; article 1er de la loi de 1998 devenu L. 115-1 du code de l'action sociale et des familles, avec une formulation un peu différente.
- **Chapitre 8** : France Travail (ex-Pôle emploi depuis 2024) ; Urssaf Caisse nationale (nom d'usage de l'Acoss depuis 2021) ; complémentaire santé solidaire ; participation forfaitaire « en général non remboursée » (dépend des contrats responsables) ; intégration des travailleurs indépendants au régime général ; branche autonomie (loi du 7 août 2020, un manuel peut dire 2021).
- **Chapitre 9** : noms de dispositifs décrits par leur fonction (centre de dépistage gratuit, commission des usagers, dossier médical partagé, plan canicule), à vérifier s'ils sont ajoutés ; complémentaire santé solidaire.
- **Chapitre 10** : RSA (revenu associé à un accompagnement, sans les règles d'activité récentes : vérifier qu'aucune réforme ne contredit la formulation) ; noms de la complémentaire santé solidaire et de la protection universelle maladie ; ISAP et ISIC (expressions du Conseil supérieur du travail social, sans date dans le chapitre).
- **Chapitre 4** : aucun élément daté ; les huit organismes cités (Insee, Drees, Santé publique France, HAS, Service-public.fr, Légifrance, Cairn.info, PubMed) sont à reconfirmer comme pour tout site.

## Rapports de relecture et points de doute pour l'enseignant

Chaque rapport se termine par « Points de doute pour l'enseignant » : à lire avant de publier ou de valider. Les rapports du cours (`stss-chN-cours-relecture.md`) et ceux des banques (`stss-chN-relecture.md`) sont dans `contenu/1re-st2s/banques/`.

- chapitre 1 : [cours](../../../contenu/1re-st2s/banques/stss-ch1-cours-relecture.md), [banque](../../../contenu/1re-st2s/banques/stss-ch1-relecture.md)
- chapitre 2 : [cours](../../../contenu/1re-st2s/banques/stss-ch2-cours-relecture.md), [banque](../../../contenu/1re-st2s/banques/stss-ch2-relecture.md)
- chapitre 3 : [cours](../../../contenu/1re-st2s/banques/stss-ch3-cours-relecture.md), [banque](../../../contenu/1re-st2s/banques/stss-ch3-relecture.md)
- chapitre 4 : [cours](../../../contenu/1re-st2s/banques/stss-ch4-cours-relecture.md), [banque](../../../contenu/1re-st2s/banques/stss-ch4-relecture.md)
- chapitre 5 : [cours](../../../contenu/1re-st2s/banques/stss-ch5-cours-relecture.md), [banque](../../../contenu/1re-st2s/banques/stss-ch5-relecture.md)
- chapitre 6 : [cours](../../../contenu/1re-st2s/banques/stss-ch6-cours-relecture.md), [banque](../../../contenu/1re-st2s/banques/stss-ch6-relecture.md)
- chapitre 7 : [cours](../../../contenu/1re-st2s/banques/stss-ch7-cours-relecture.md), [banque](../../../contenu/1re-st2s/banques/stss-ch7-relecture.md)
- chapitre 8 : [cours](../../../contenu/1re-st2s/banques/stss-ch8-cours-relecture.md), [banque](../../../contenu/1re-st2s/banques/stss-ch8-relecture.md)
- chapitre 9 : [cours](../../../contenu/1re-st2s/banques/stss-ch9-cours-relecture.md), [banque](../../../contenu/1re-st2s/banques/stss-ch9-relecture.md)
- chapitre 10 : [cours](../../../contenu/1re-st2s/banques/stss-ch10-cours-relecture.md), [banque](../../../contenu/1re-st2s/banques/stss-ch10-relecture.md)

## Six Mineurs de la revue des banques, laissés à l'enseignant

Aucune erreur de fond ; à traiter pendant la relecture en lot.

1. **`stss:ch2:banque:013` et `014`** : deux questions de difficulté 1 qui redemandent la définition d'une société. Remplacer la 014 par une question sur un autre point (par exemple le groupe secondaire).
2. **`stss:ch5:banque:125`** : le distracteur « Conserver les données sans limite de temps » relève d'une connaissance hors chapitre ; le remplacer par un distracteur contredit par le texte.
3. **`stss:ch7:banque:033` et `077`** : items d'enquête au vouvoiement dans une proposition et une explication ; les mettre entre « » ou à la troisième personne.
4. **`stss:ch7:banque:086` (variante « CES ») et `stss:ch9:banque:065` (variante « CLS »)** : sigles acceptés mais absents du texte du chapitre ; les retirer ou les garder en connaissance de cause.
5. **`stss:ch8:banque:070`** : `qcm_unique` à trois propositions au lieu de quatre, volontairement, pour n'ajouter aucun pays absent du cours.
6. **`stss:ch8:banque:046` et `047`** : deux questions de difficulté 1 presque identiques (prestation en nature) ; remplacer l'une par une question sur les prestations contributives ou non.

## Décisions prises en cours d'étape

1. Chapitres 2 à 10 rédigés en parallèle dans des fichiers séparés, relus en parallèle, puis intégrés à `stss.json` dans l'ordre par un seul agent (le fichier est unique).
2. Banques rédigées par Sonnet, relues par Opus chapitre par chapitre, puis fusionnées et importées séquentiellement.
3. Le chapitre 1 a servi de modèle : l'enseignant l'a validé sans remarque à l'arrêt 2, donc la spec § 5 est restée inchangée.

## Limites connues et acceptées

Spec § 9 :
- Un cours rédigé par l'IA, même relu deux fois, peut contenir des imprécisions. La publication reste une décision de l'enseignant, chapitre par chapitre.
- Pas de figures dans cette étape.
- La progression du cours suit l'ordre du programme, pas forcément celle de l'enseignant ; le plan validé à l'arrêt 1 l'a adaptée (10 chapitres, méthodologie après le chapitre 3).

Autres :
- La relecture des banques par l'IA réduit les erreurs sans les supprimer : la validation par l'enseignant reste nécessaire avant qu'une question soit tirée.
- Les chapitres de STSS sont environ 1,5 fois plus longs que ceux de BPH, qui passe une partie de son contenu par des figures.

## Mise en ligne

- Aucune migration nouvelle dans cette étape.
- Import de production : `npm run import:contenu -- contenu/1re-st2s/stss.json --garder-statuts --distant`, à lancer volontairement par l'utilisateur. Sans `--publier`, le cours reste non publié.
- Publication de chaque chapitre depuis l'admin, après lecture. Les 1500 questions restent invisibles aux élèves tant que l'enseignant ne les a pas validées (relecture en lot).

## Revue finale

À faire : revue Opus de toute la branche (menée par le contrôleur).
