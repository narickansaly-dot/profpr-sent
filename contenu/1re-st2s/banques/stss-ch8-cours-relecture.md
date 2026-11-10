# Relecture du chapitre 8 de STSS : « La protection sociale »

Relecture indépendante (task 3, step 2, N = 8). Fichier corrigé : `.superpowers/sdd/2027-01-26-etape-6b-stss/stss-ch8.json`.

## Bilan

- **Programme** : les notions N36 à N48 et les capacités C24 à C31 du plan sont toutes traitées, dans les six sections prévues, dans l'ordre. Rien n'est hors programme. Les notions d'autres chapitres sont seulement rappelées, avec des renvois conformes au plan : cohésion sociale (chapitre 2), pauvreté et exclusion (chapitre 7), apport de la protection sociale à la santé (chapitre 9, capacité C35), lutte contre l'exclusion (chapitre 10). Les six objectifs reprennent ceux du plan.
- **Exactitude** : faits vérifiés et laissés tels quels :
  - le préambule de 1946, alinéa 11, cité au mot près ;
  - l'article 22 de la DUDH (1948), non cité textuellement ;
  - la loi de 1898 sur les accidents du travail ;
  - l'assurance chômage (1958), le RMI (1988) devenu RSA, la CMU (1999) et la PUMa (2016) ;
  - la CSG (1991) ;
  - Bismarck (fin du XIX<sup>e</sup> siècle), le rapport Beveridge (1942) et le NHS (1948) ;
  - la branche autonomie (2020) : la loi n° 2020-992 du 7 août 2020 relative à la dette sociale et à l'autonomie crée cette 5<sup>e</sup> branche, et la loi de financement pour 2021 en confie la gestion à la CNSA. Le chapitre dit seulement « branche autonomie (2020) » et « CNSA » : c'est exact ;
  - les branches du régime général et leurs caisses : CNAM et CPAM pour la maladie, CNAM avec les CPAM et les Carsat pour les AT-MP, CNAV et Carsat pour la vieillesse, CNAF et CAF pour la famille, CNSA pour l'autonomie ;
  - les définitions de l'assurance (cotisations, sans condition de ressources), de l'assistance (condition de ressources, impôt) et de la protection universelle ;
  - le financement par les cotisations, la CSG et l'impôt ;
  - les régimes : général, agricole (MSA) et spéciaux.
- **Niveau et ton** : tutoiement, phrases courtes, termes définis à leur première apparition. Aucun montant, taux ni statistique datée.
- **Format** : classes `def`, `warn` et `tbl`, comme au chapitre 1. Le chapitre contient 75 vraies U+00A0, aucune entité `&nbsp;` et aucune espace ordinaire avant « : ; ! ? » ou à l'intérieur de « ».
- **Validateur** : `analyserImport` (cours minimal : identité de `stss.json` et ce chapitre) ne renvoie aucune erreur. Le script jetable a été supprimé.
- **Longueur** : environ 17 000 caractères de texte sans balises (chapeau, sections, « Je retiens »). Je n'ai pas fait de coupe : chaque passage sert une notion ou une capacité, et les corrections de clarté ajoutent quelques mots. Si une coupe est souhaitée, voir le point de doute 6.

## Corrections

| Section | Problème | Correction |
| --- | --- | --- |
| `droits-sociaux` | « Les ordonnances d'octobre 1945 » : la formulation est imprécise. | « Les ordonnances des 4 et 19 octobre 1945 ». |
| `principes-techniques` | « Beveridge résumait son projet par trois "U" » : les trois « U » sont une présentation pédagogique postérieure, pas une formule du rapport. | « On résume souvent le projet de Beveridge par trois "U" ». |
| `principes-techniques` | La protection universelle « financée surtout par l'impôt » : l'exemple donné (la PUMa) est financé par un mélange d'impôts, de CSG et de cotisations. | « financée en grande partie par l'impôt ». |
| `principes-techniques` | « dépend de la résidence en France, plus de l'emploi » est ambigu (on peut lire « davantage de l'emploi »). | « et non plus de l'emploi ». |
| `principes-techniques` | Le NHS « soigne gratuitement » : certains frais restent payants (médicaments sur ordonnance en Angleterre, soins dentaires). | « soigne tous les résidents, avec ou sans emploi, le plus souvent gratuitement ». |
| `prestations` | La liste mêlait deux classements (espèces / nature et contributives / non contributives) sans le dire. | Ajout d'une phrase qui annonce les deux classements. |
| `prestations` | Sarah, avec un seul enfant de 3 ans, ne reçoit pas les allocations familiales (il faut au moins deux enfants). Les « prestations familiales » restaient douteuses. | Les prestations familiales sont retirées de l'exemple. Il reste l'allocation chômage, l'aide au logement, puis le RSA. |
| `composantes-regimes` | « Régimes spéciaux, par exemple les fonctionnaires » : pour les frais de santé, les fonctionnaires relèvent du régime général. Leur régime spécial concerne surtout la retraite. | « par exemple les fonctionnaires pour leur retraite ». |
| `composantes-regimes` | Les Urssaf collectent « la CSG » : la CSG sur les revenus du patrimoine est collectée par l'administration fiscale. La tête de réseau (ex-Acoss, devenue Urssaf Caisse nationale en 2021) n'était pas nommée. | « Les Urssaf, coordonnées par l'Urssaf Caisse nationale, collectent les cotisations sociales et l'essentiel de la CSG ». |
| `universelle-complementaire-aide` | La définition du ticket modérateur (« la part qui reste à payer ») inclut à tort les dépassements et la participation forfaitaire. | « La part du tarif de la Sécurité sociale qui reste à payer après son remboursement ». |
| `risque-social` | « des indemnités » : le terme reste vague, alors que la section `prestations` emploie « indemnités journalières ». | « des indemnités journalières », pour la cohérence. |
| `droits-sociaux` | Formulation lourde : « s'est ensuite construite peu à peu, sous ». | « s'est construite peu à peu sous ». |

## Points de doute pour l'enseignant

1. **Nombre de branches** : le chapitre présente cinq branches (maladie, AT-MP, vieillesse, famille, autonomie) et traite le recouvrement (Urssaf) à part. Les documents officiels récents parlent parfois de six branches, en comptant le recouvrement. Choisissez la présentation de votre manuel.
2. **Branche autonomie** : elle est créée par la loi du 7 août 2020. La CNSA en devient gestionnaire avec la loi de financement pour 2021, puis la branche est mise en œuvre jusqu'à fin 2021. La date « 2020 » du chapitre est juste, mais un manuel peut indiquer 2021.
3. **Réformes récentes** : elles sont seulement évoquées (« les débats sur les retraites »). Il n'y a aucun détail sur les réformes des retraites ou de l'assurance chômage, qui changent souvent. Vous pouvez illustrer ce point en classe avec l'actualité.
4. **Pauvreté comme risque social** : le tableau range « pauvreté, exclusion » parmi les risques sociaux, comme beaucoup de manuels de ST2S. Certains auteurs ne retiennent que les risques de la Sécurité sociale. À ajuster selon votre manuel.
5. **Exemple de Mme Bernard** : le chapitre dit que les enfants sont « d'abord sollicités ». En pratique, le département examine en même temps les ressources de la personne et la participation des obligés alimentaires. La récupération sur succession existe bien pour l'aide sociale à l'hébergement des personnes âgées. La formulation est simplifiée pour la 1re.
6. **Longueur** : environ 17 000 caractères, un peu au-dessus de la cible. Si vous voulez couper, voici les premiers candidats :
   - la ligne « 1945-1975 » du tableau chronologique ;
   - le paragraphe de comparaison avec le NHS, qui recoupe en partie le tableau Bismarck / Beveridge.
7. **Techniques de protection sociale** : le « Je retiens » (point 4) annonce deux techniques, l'assurance et l'assistance, puis mentionne la protection universelle. La section, elle, donne trois définitions au même niveau. Le programme parle de « assurance - assistance », donc le « Je retiens » est fidèle, mais un élève peut hésiter. Si vous voulez lever le doute, présentez dans la section la protection universelle comme une logique qui s'ajoute aux deux techniques.

## Éléments datés à vérifier avant publication

- **France Travail** (ex-Pôle emploi depuis 2024) : c'est l'organisme qui verse l'allocation chômage.
- **Urssaf Caisse nationale** : c'est le nom d'usage de l'Acoss depuis 2021. Le nom juridique reste Acoss.
- **Complémentaire santé solidaire** : elle est gratuite ou à faible coût selon les ressources. Vérifier que le dispositif existe toujours sous ce nom.
- **Participation forfaitaire** : elle est « en général non remboursée » par les complémentaires. Cette règle dépend des contrats responsables.
- **Intégration des travailleurs indépendants** au régime général : la formulation « la plupart » reste prudente.
