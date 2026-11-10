# Relecture du chapitre 2 de STSS : « Bien-être, socialisation et cohésion sociale »

Relecture indépendante (task 3, N = 2). Fichier corrigé : `.superpowers/sdd/2027-01-26-etape-6b-stss/stss-ch2.json`.

## Bilan

- **Programme** : les notions N6 à N16 et les capacités C4 à C7 du plan sont toutes traitées, dans les six sections prévues, dans l'ordre. Les objectifs reprennent les six objectifs du plan, sous la même forme qu'au chapitre 1. Rien n'est hors programme : la mesure (chapitre 3), les déterminants sociaux (chapitre 6), l'exclusion et les inégalités qui fragilisent la cohésion (chapitre 7), la protection sociale (chapitre 8) et les modes d'intervention (chapitres 9 et 10) sont seulement annoncés, avec des renvois conformes au plan.
- **Solidarités mécanique et organique (Durkheim)** : leur retrait ne laisse aucune notion du programme sans traitement. « Solidarité » n'est pas une notion du programme. La cohésion sociale (N11) est définie et ses facteurs (C6) sont repérés. En revanche, le mot « solidarité » était employé dans la définition de la cohésion et dans ses facteurs sans être défini : une définition courte a été ajoutée (voir les corrections). Les solidarités de Durkheim n'ont pas été rétablies.
- **Exactitude** :
  - Typologie des liens sociaux de Serge Paugam : les quatre intitulés (lien de filiation, de participation élective, de participation organique, de citoyenneté) sont exacts, ainsi que l'idée que les liens apportent protection et reconnaissance. Le voisinage fait bien partie de la participation élective, et l'école de la participation organique.
  - PCS : la page Insee « La PCS 2020 » (insee.fr/fr/information/6205305) indique que les six groupes socioprofessionnels de la PCS 2003 sont conservés dans la PCS 2020. Les intitulés du chapitre sont donc justes. La PCS 2020 ajoute seulement des formes féminisées (par exemple « Agriculteurs exploitants / Agricultrices exploitantes »).
  - Durkheim : *Les Règles de la méthode sociologique* (1895), définition du fait social correctement paraphrasée, étude du suicide. Loi Évin : 1991 (loi du 10 janvier 1991). Les autres faits (castes, ordres d'Ancien Régime, écart d'espérance de vie entre cadres et ouvriers, féminisation des métiers du soin) sont donnés sans chiffre et sont exacts.
- **Cohérence avec le chapitre 1** : la citation de l'OMS est la même. Pas de contradiction.
- **Format** : uniquement des balises et classes du chapitre 1 (`def`, `warn`, `tbl`, `t`), plus `em` pour un titre d'ouvrage. Il y a de vraies U+00A0, aucune entité `&nbsp;`, et aucune espace ordinaire avant « : ; ! ? ».
- **Validateur** : `analyserImport` (identité de `stss.json` et ce chapitre) ne renvoie aucune erreur après correction. Le script jetable a été supprimé.

## Corrections

| Section | Problème | Correction |
| --- | --- | --- |
| `socialisation` | « normes juridiques » et « normes sociales » étaient opposées. Or une loi est aussi une norme sociale, et la section `normes-sante` range la ceinture de sécurité (obligation légale) parmi les normes sociales. | « Certaines normes sont **juridiques** […]. Les autres **normes sociales** (usages, codes d'un groupe) le sont de façon informelle ». Les normes juridiques deviennent un cas particulier des normes sociales. |
| `identite-stratification` | La mobilité sociale n'était définie que par rapport aux parents. La mobilité au cours de la vie était oubliée. | « Changer de groupe social, au cours de sa vie ou par rapport à ses parents, c'est la mobilité sociale ». |
| `identite-stratification` | Le renvoi « inégalités sociales de santé au chapitre 6 » était incomplet. Selon le plan, les inégalités et le gradient social sont mesurés au chapitre 3, et leurs causes (déterminants sociaux) sont étudiées au chapitre 6. | « Tu apprendras à mesurer ces écarts au chapitre 3, tu en étudieras les causes au chapitre 6, et tu verras les inégalités qui fragilisent la cohésion sociale au chapitre 7. » |
| `liens-cohesion` (définition de la cohésion) | « se sentent solidaires » n'était pas expliqué. | « se sentent solidaires, c'est-à-dire prêts à s'entraider ». |
| `liens-cohesion` (facteurs) | La solidarité était un facteur de cohésion sans être définie. Le retrait des solidarités de Durkheim l'avait laissée sans définition. | Le facteur « solidarité organisée » devient « la **solidarité**, c'est-à-dire l'aide que les membres d'une société s'apportent parce qu'ils dépendent les uns des autres. Elle peut être spontanée (aider un voisin) ou organisée, comme la protection sociale (chapitre 8) ». |

Points vérifiés et laissés tels quels :

- la définition du fait social et ses trois caractéristiques ;
- les groupes primaires et secondaires, sans auteur cité ;
- les intitulés des quatre liens de Paugam ;
- les six groupes de PCS ;
- la loi Évin (1991) et l'interdiction de fumer dans les lieux publics fermés, sans date ;
- l'analyse en quatre étapes de la féminisation des métiers du soin (C4) ;
- le tableau des normes sociales et de leurs effets sur la santé (C7).

## Points de doute pour l'enseignant

1. **Solidarités mécanique et organique** : Durkheim (*De la division du travail social*, 1893) n'est plus présenté. Ce n'est pas exigé par le programme, mais beaucoup de manuels de ST2S l'utilisent pour expliquer la cohésion sociale. Si vous le souhaitez, il suffit d'ajouter deux lignes dans « La cohésion sociale » : la solidarité mécanique repose sur la ressemblance, la solidarité organique sur la complémentarité des rôles.
2. **PCS : forme des intitulés** : le chapitre donne les intitulés au masculin, comme dans la PCS 2003. La PCS 2020 garde les mêmes groupes, mais ajoute les formes féminines (« Agriculteurs exploitants / Agricultrices exploitantes », etc.). Seul l'intitulé du groupe 1 a été lu sur insee.fr. Les groupes 2 à 6 sont confirmés par la page de méthode, qui dit que les groupes n'ont pas changé. À adapter si votre manuel utilise les formes féminisées.
3. **PCS : population classée** : le texte dit que l'Insee classe « les personnes actives » en six groupes. C'est juste dans l'esprit : les chômeurs sont classés selon leur dernière profession. Mais la nomenclature complète prévoit aussi des catégories pour les retraités et les autres inactifs. Cela n'a pas pu être vérifié précisément dans la PCS 2020. La formulation reste prudente.
4. **Définition du bien-être** : il s'agit d'une définition de travail, avec quatre dimensions (physique, psychologique, relationnelle, matérielle et sociale). Il n'existe pas de définition officielle unique. À harmoniser avec votre manuel et avec le chapitre 3 (indicateurs de bien-être).
5. **Intitulés de Paugam** : ils sont exacts. Le tableau simplifie un peu le contenu de chaque lien. Par exemple, Paugam inclut les liens de parenté au-delà des seuls parents et enfants dans la filiation. C'est un niveau suffisant pour la 1re.
6. **Longueur** : le chapitre est un peu plus long que le chapitre 1 (11 notions, 6 sections). Si vous le jugez trop long, le premier passage à raccourcir est le tableau des formes de stratification (castes, ordres, classes), qui n'est pas exigé par le programme.

## Éléments datés à vérifier avant publication

- **Interdiction de fumer dans les lieux publics fermés** : elle est énoncée sans date. Le décret date de 2006, mais il n'est pas cité.
- **PCS 2020** : la page Insee lue a été mise à jour le 16 décembre 2024. Vérifier qu'aucune révision des groupes n'a eu lieu depuis.
