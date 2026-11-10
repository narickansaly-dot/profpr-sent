# Relecture du chapitre 10 de STSS : « Agir sur les problèmes sociaux : l'intervention sociale »

Relecture indépendante (task 3, N = 10). Fichier corrigé : `.superpowers/sdd/2027-01-26-etape-6b-stss/stss-ch10.json`. La version du rédacteur est conservée dans `stss-ch10-redaction.json`.

## Bilan

- **Programme** : les notions N57 à N61 et les capacités C38 à C42 sont toutes traitées, dans les six sections prévues, dans l'ordre du plan. Les six objectifs reprennent ceux du plan. Les notions reprises (N35 processus d'exclusion, N54 droits de la personne) sont rappelées avec un renvoi aux chapitres 7 et 9, sans être redéfinies. Les renvois vers les chapitres 3, 5, 7, 8 et 9 suivent la numérotation du plan. Rien n'est hors programme.
- **Exactitude** : vérifications faites sur Légifrance et sur le site du Sénat.
  - Article 1er de la loi n° 98-657 du 29 juillet 1998 d'orientation relative à la lutte contre les exclusions : le premier alinéa a été vérifié mot pour mot sur Légifrance (JORFTEXT000000206894) et sur le texte publié par le Sénat. La citation est désormais complète et identique à celle du chapitre 7.
  - Loi n° 2002-2 du 2 janvier 2002 rénovant l'action sociale et médico-sociale : le titre a été vérifié sur Légifrance. Les droits cités correspondent à l'article L. 311-3 du CASF, issu de l'article 7 de la loi : dignité, intégrité, vie privée, intimité (1°), accompagnement individualisé respectant le consentement éclairé (3°), confidentialité (4°), participation à la conception et à la mise en œuvre du projet d'accueil et d'accompagnement (7°). Les outils (livret d'accueil, charte, contrat de séjour ou document individuel de prise en charge, règlement de fonctionnement) relèvent des articles L. 311-4 et L. 311-7. Le conseil de la vie sociale relève de l'article L. 311-6, qui prévoit « soit un conseil de la vie sociale, soit d'autres formes de participation ».
  - CASF, article L. 116-1 (paraphrase des buts de l'action sociale) : conforme.
  - « Intervention sociale d'aide à la personne » et « intervention sociale d'intérêt collectif » : ce sont des expressions du Conseil supérieur du travail social, reprises dans la formation des assistants de service social. Elles sont présentées sans sigle ni date.
  - Ces faits sont exacts et ont été gardés : missions locales pour les 16-25 ans, 115, analyse des besoins sociaux par le CCAS, rôle du département, secret professionnel des assistants de service social, AAH comme minimum social, RSA associant revenu et accompagnement.
- **Niveau** : trois termes n'étaient pas définis. Ils le sont désormais : « bailleur », « chef de file » et « consentement éclairé ».
- **Format** : il y a 86 vraies U+00A0, aucune entité `&nbsp;` et aucune espace ordinaire avant « : ; ! ? » ou à l'intérieur de « ». Les classes sont celles du chapitre 1 : `def`, `t`, `warn` et `tbl`, avec `th scope="row"`.
- **Validateur** : `analyserImport` ne renvoie aucune erreur ni aucun avertissement. Le script jetable a été supprimé.
- **Longueur** : environ 17 100 caractères de texte, contre 16 400 avant la relecture. L'écart vient des précisions ajoutées.

## Corrections

| Section | Problème | Correction |
| --- | --- | --- |
| `insertion-exclusion` | La citation de la loi de 1998 était tronquée. Elle s'arrêtait après « êtres humains », alors que la phrase de l'article 1er continue. Le titre était aussi inexact : « loi d'orientation relative à la lutte contre les exclusions de 1998 ». Enfin, il n'y avait aucun renvoi au chapitre 7, qui cite déjà cette loi. | Le titre exact est rétabli : « loi du 29 juillet 1998 d'orientation relative à la lutte contre les exclusions ». La phrase complète de l'article 1er est citée telle qu'elle figure sur Légifrance. Un renvoi au chapitre 7 est ajouté. La phrase sur les droits fondamentaux suit désormais l'article : « accès effectif de tous aux droits fondamentaux », dans les domaines de l'emploi, du logement et de la protection de la santé. |
| `insertion-exclusion` | Le texte disait que la protection universelle maladie « permet l'accès aux soins des personnes aux faibles revenus ». C'est inexact : elle couvre toute personne qui travaille ou réside en France de façon stable et régulière, comme le dit le chapitre 9. | « Elle garantit à tous l'accès aux soins, y compris aux personnes aux faibles revenus. » |
| `insertion-exclusion` | L'exemple de redistribution parlait de « prestations financées par tous qui profitent surtout aux ménages modestes ». C'est faux pour une partie des prestations, par exemple les retraites. | « des prestations financées par les cotisations et les impôts, dont certaines sont réservées aux ménages modestes ». |
| `accompagnement-developpement` | Les termes ISAP et ISIC étaient glissés entre parenthèses, sans dire d'où ils viennent. ISIC visait « un territoire » plutôt que ses habitants. | Les deux expressions sont mises entre guillemets et présentées comme le vocabulaire des travailleurs sociaux. L'intervention collective vise « un groupe ou les habitants d'un territoire ». |
| `accompagnement-developpement` | « bailleur » n'était pas défini. | Ajout de « c'est-à-dire le propriétaire de son logement ». |
| `acteurs` | « chef de file de l'action sociale » n'était pas expliqué. | Ajout de « c'est-à-dire qu'il l'organise et la coordonne sur son territoire ». |
| `place-personne` | « consentement éclairé » n'était pas défini. La formulation s'éloignait aussi de l'article L. 311-3 (« respectant son consentement éclairé »). | « en respectant son consentement éclairé, c'est-à-dire donné après une information claire ». |
| `place-personne` | « la loi a créé des outils » est trop fort : la charte a été fixée ensuite par arrêté. De plus, le conseil de la vie sociale n'est pas la seule forme prévue, puisque l'article L. 311-6 permet « d'autres formes de participation ». | « la loi prévoit des outils » et « le conseil de la vie sociale (ou une autre forme de participation) ». |
| `place-personne` | Rien n'indiquait que l'échelle information, consultation, concertation, co-construction est une grille de manuel. Un élève pouvait la prendre pour une classification officielle. | Ajout, avant le tableau : « Le tableau ci-dessous est une grille d'analyse utilisée dans les manuels, pas une classification officielle ». |

Points vérifiés et laissés tels quels :

- la paraphrase de l'article L. 116-1 du CASF ;
- la liste des droits issus de la loi du 2 janvier 2002 ;
- le secret professionnel des assistants de service social ;
- l'analyse des besoins sociaux par le CCAS ;
- le public des missions locales, de 16 à 25 ans ;
- le 115 ;
- le soutien de la CAF aux centres sociaux ;
- les rôles des quatre professions ;
- les exemples de Karim, de Lucas et de Mme D. ;
- l'encadré sur le non-recours, qui ne donne aucun chiffre.

## Points de doute pour l'enseignant

1. **Définitions de manuel** : il n'existe pas de définition officielle unique pour l'intervention sociale, le diagnostic social, l'accompagnement social, le développement social local et l'insertion sociale. Les formulations du chapitre suivent l'usage courant des manuels. À aligner sur votre manuel de référence si besoin.
2. **ISAP et ISIC** : ces expressions viennent du Conseil supérieur du travail social. ISIC a été proposée en 1987, et ISAP a été retenue dans un rapport de 2014, qui reprend des travaux plus anciens. Les dates ne figurent pas dans le chapitre, faute de source primaire consultée. Les sigles ne sont pas donnés. Si votre manuel les utilise, vous pouvez les ajouter.
3. **Échelle de participation** : après la revue d'ensemble, les chapitres 9 et 10 utilisent la même grille à cinq degrés (information, consultation, concertation, co-construction, décision et action), avec les mêmes définitions. C'est un outil pédagogique, inspiré notamment de l'échelle d'Arnstein, qui n'est pas nommée. Les deux chapitres précisent que ce n'est pas une classification officielle. Certains manuels emploient d'autres degrés, par exemple « codécision » ou « délégation ».
4. **Titre de la loi de 1998** (résolu) : les titres sont désormais identiques dans les chapitres 7 et 10 (« loi du 29 juillet 1998 d'orientation relative à la lutte contre les exclusions »), comme la citation de l'article 1er. Plus rien à harmoniser.
5. **Associations nommées** : le chapitre cite les Restos du cœur, le Secours populaire, la Croix-Rouge et Emmaüs. Ces noms peuvent être retirés si vous préférez ne pas citer d'organismes privés.
6. **CCAS** : le chapitre présente le CCAS comme l'acteur communal. Dans les petites communes, l'action sociale peut être assurée directement par la commune ou par un centre intercommunal (CIAS). Le chapitre ne le précise pas, pour rester simple.

## Éléments datés à vérifier avant publication

- **RSA** : il est présenté comme un revenu associé à un accompagnement, sans les règles d'activité récentes. La formulation reste juste, mais il faut vérifier qu'elle ne contredit pas une réforme en cours.
- **Complémentaire santé solidaire et protection universelle maladie** : les noms sont en vigueur. Vérifiez qu'ils n'ont pas changé.
- **Opérateur de l'emploi** : le chapitre ne nomme pas France Travail et ne parle pas du service public de l'emploi. Rien n'est donc à mettre à jour sur ce point.
