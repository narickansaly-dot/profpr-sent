# Relecture du chapitre 7 de STSS : « Inégalités, précarité, exclusion : l'émergence d'un problème social »

Relecture indépendante (task 3, N = 7). Fichier corrigé : `.superpowers/sdd/2027-01-26-etape-6b-stss/stss-ch7.json`.

## Bilan

- **Programme** : les notions N32 à N35 et les capacités C20 à C23 du plan sont toutes traitées, dans les quatre sections prévues, dans l'ordre. Les notions reprises (N11 cohésion sociale, N12 intégration sociale, N15 liens sociaux, N21 inégalités) sont rappelées avec un renvoi aux chapitres 2 et 3, sans être redéfinies longuement. Rien n'est hors programme : protection sociale (ch. 8), insertion et intervention sociale (ch. 10), problème de santé (ch. 6) sont seulement nommés. Les quatre objectifs reprennent ceux du plan, à l'infinitif comme au chapitre 1.
- **Exactitude** : les faits signalés par le rédacteur ont été vérifiés.
  - **Définition de Wresinski** : elle a été vérifiée sur le texte du rapport et de l'avis publié au *Journal officiel* du 28 février 1987 (PDF du CESE, lecese.fr). La citation du chapitre est exacte au mot et à la virgule près. C'est le texte de l'**avis** adopté par le Conseil économique et social, partie « I. Définition de la grande pauvreté ». Le corps du rapport en donne une version un peu différente (« responsabilités élémentaires », sans « notamment celle de l'emploi »). C'est cette autre version que cite le site du ministère des Solidarités (CNLE).
  - **Loi n° 98-657 du 29 juillet 1998 d'orientation relative à la lutte contre les exclusions** : l'article 1er, dans sa version initiale sur Légifrance, commence par « La lutte contre les exclusions est un impératif national fondé sur le respect de l'égale dignité de tous les êtres humains et une priorité de l'ensemble des politiques publiques de la nation. » Le passage cité est exact.
  - **Appel de l'abbé Pierre** : il a eu lieu le 1er février 1954 sur Radio Luxembourg, pendant un hiver très froid, après la mort dans la rue d'une femme expulsée de son logement. Le texte est correct.
  - **Les Enfants de Don Quichotte** : leur campement du canal Saint-Martin a commencé le 16 décembre 2006 et a pris fin en janvier 2007. Le texte est correct.
  - **Loi n° 2007-290 du 5 mars 2007** : elle institue le droit au logement opposable (DALO). Le texte est correct.
  - **René Lenoir** : son livre *Les exclus* (1974) a popularisé le mot. Le texte est correct.
  - **Serge Paugam** : la disqualification sociale comprend trois phases, fragilité, dépendance (à l'aide sociale) et rupture. Le texte est correct.
  - **Seuil de pauvreté** : selon l'Insee (définition « Seuil de pauvreté »), il est « le plus souvent fixé à 60 % du niveau de vie médian ». La France publie aussi des taux à 40 %, 50 % et 70 %. Le texte est correct.
- **Niveau** : le texte tutoie l'élève et utilise des phrases courtes. Les termes sont définis à leur première apparition. Une seule définition manquait, celle de « disqualification sociale », qui a été ajoutée.
- **Cohérence** : les renvois (ch. 2, 3, 6, 8, 10) suivent la numérotation du plan. Rien ne contredit le chapitre 1, qui ne traite ni les inégalités ni la pauvreté.
- **Format** : le chapitre n'utilise que les classes du chapitre 1 (`def`, `t`, `tbl`, `warn`). Il contient 124 vraies U+00A0, aucune entité `&nbsp;` et aucune espace ordinaire avant « : ; ! ? » ou à l'intérieur de « ».
- **Validateur** : `analyserImport` ne renvoie aucune erreur après correction.

## Corrections

| Section | Problème | Correction |
| --- | --- | --- |
| `precarite-pauvrete` | La source était imprécise. Le chapitre parlait d'« un rapport au Conseil économique et social » et attribuait la citation à « Joseph Wresinski, 1987 ». Or le texte cité est celui de l'avis adopté par le Conseil, et le corps du rapport en donne une autre version. | Le chapitre donne maintenant le titre du rapport (« Grande pauvreté et précarité économique et sociale ») et précise que le Conseil a adopté la définition. La source devient « Conseil économique et social, rapport Wresinski, 1987 ». La citation elle-même n'a pas changé. |
| `precarite-pauvrete` | La paraphrase disait que la précarité mène à la grande pauvreté quand la personne « ne peut plus s'en sortir seule ». C'est trop absolu : le texte dit qu'elle « compromet les chances » de reconquérir ses droits par soi-même. | La phrase devient : « qu'elle réduit fortement les chances de la personne de retrouver ses droits par elle-même ». |
| `precarite-pauvrete` | Le niveau de vie était le revenu disponible « divisé selon le nombre de personnes ». Cette formulation est vague et laisse croire à une division simple par personne. | Le revenu est « divisé en tenant compte du nombre de personnes qui vivent dans le ménage et de leur âge (un enfant compte moins qu'un adulte) ». C'est le principe des unités de consommation, sans le terme technique. |
| `exclusion-processus` | Le tableau de Paugam illustrait la phase de dépendance par « les aides au revenu et les rendez-vous avec une assistante sociale ». Mais l'histoire de Karim ne mentionnait aucune aide ni aucun suivi social. | L'étape 4 de l'histoire de Karim mentionne maintenant qu'il vit surtout des aides sociales et voit une assistante sociale. La cellule du tableau devient « la vie grâce aux aides sociales et le suivi par une assistante sociale ». |
| `exclusion-processus` | Le terme « disqualification sociale » n'était pas défini. | Ajout d'une définition simple : « la personne perd peu à peu sa place et la reconnaissance des autres dans la société ». |
| `exclusion-processus` | La phrase « Ce dernier point s'appelle le non-recours » assimilait toute la rupture du lien de citoyenneté au non-recours. | Elle devient « Un signe fréquent de cette rupture est le non-recours ». |
| `probleme-social` | Pour le DALO, le texte ne disait pas qui reconnaît une personne comme « prioritaire ». | Ajout de « reconnue prioritaire par une commission ». La commission de médiation n'est pas détaillée, car elle relève de l'accès aux droits. |

Points vérifiés et laissés tels quels :

- la définition de la pauvreté, qui est une définition de travail ;
- les trois approches de la mesure (monétaire, conditions de vie, pauvreté ressentie) et les exemples de privations, présentés comme des exemples ;
- les travailleurs pauvres ;
- les quartiers prioritaires de la politique de la ville et les outre-mer, décrits sans chiffres ;
- les six conditions d'émergence et les signes de reconnaissance ;
- la méthode d'analyse en quatre questions ;
- le tableau comparatif précarité, pauvreté, exclusion.

## Points de doute pour l'enseignant

1. **Deux versions de la définition de Wresinski** : le chapitre cite la version de l'avis du CES, avec « notamment celle de l'emploi » et « obligations professionnelles, familiales et sociales ». Beaucoup de manuels et le site du CNLE citent la version du corps du rapport, avec « responsabilités élémentaires ». Les deux sont authentiques. Si votre manuel cite l'autre version, signalez-le aux élèves pour éviter une confusion.
2. **Article 1er de la loi de 1998** : la citation reprend le texte de 1998. L'article a été abrogé en 2000, puis repris dans le code de l'action sociale et des familles (article L. 115-1). Ce texte parle aujourd'hui de « la lutte contre la pauvreté et les exclusions » (à vérifier sur Légifrance). Le chapitre date bien la citation de 1998 : il est donc exact. Mais un élève qui consulte le code trouvera une formulation un peu différente.
3. **Phases de Paugam** : fragilité, dépendance et rupture est la présentation courante dans les manuels. Chez Paugam, ces phases correspondent aussi à des types de publics de l'action sociale (« fragiles », « assistés », « marginaux »). La description de chaque phase dans le tableau est simplifiée. À confirmer selon votre manuel.
4. **Définitions de la pauvreté et de l'exclusion** : ce sont des définitions de travail, et il n'en existe pas d'officielle unique. Le site du CNLE cite par exemple une définition du dictionnaire (« manque de ressources […] pour mener une vie décente »). La formulation du chapitre est compatible avec elle.
5. **Paraphrase « divisé en tenant compte du nombre de personnes et de leur âge »** : c'est une simplification volontaire des unités de consommation. Si vous voulez le terme, ajoutez « unités de consommation » en une phrase.
6. **Pauvreté ressentie** : la question « Arrivez-vous à boucler votre budget ? » est un exemple. Ce n'est pas la question exacte d'une enquête officielle.

## Éléments datés à vérifier avant publication

- **Seuil et taux de pauvreté** : le chapitre ne donne aucun chiffre et renvoie aux dernières publications de l'Insee. Vérifier que l'Insee retient toujours 60 % comme seuil principal.
- **Pauvreté en conditions de vie** : l'Insee a fait évoluer cet indicateur, qui s'appelle aujourd'hui « privation matérielle et sociale ». Les trois exemples du tableau (chauffer son logement, faire face à une dépense imprévue, partir une semaine en vacances) font partie de la liste actuelle. Vérifier qu'ils y figurent toujours.
- **Quartiers prioritaires de la politique de la ville** : l'appellation date de 2014 et la géographie prioritaire est révisée régulièrement. Vérifier que le nom est toujours en usage.
