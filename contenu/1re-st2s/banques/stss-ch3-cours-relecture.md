# Relecture du chapitre 3 de STSS : « Mesurer la santé, le bien-être et la cohésion sociale »

Relecture indépendante (task 3, N = 3). Fichier corrigé : `.superpowers/sdd/2027-01-26-etape-6b-stss/stss-ch3.json`. La version du rédacteur reste dans `stss-ch3-redaction.json`.

## Bilan

- **Programme** : les notions N17 à N22 et les capacités C8 à C12 sont toutes traitées, dans les six sections du plan, dans l'ordre. Le plan ne prévoit aucune notion reprise pour ce chapitre. Rien n'est hors programme : pauvreté (ch. 7), déterminants et facteurs de risque (ch. 6), évaluation des sources (ch. 4) et recueil de données (ch. 5) sont seulement nommés, avec un renvoi au bon chapitre. Les objectifs reprennent les six objectifs du plan, à l'infinitif comme le chapitre 1.
- **Exactitude** : formules et définitions vérifiées. Taux de natalité et taux brut de mortalité pour 1 000 habitants, sur la population moyenne. Mortalité infantile : décès avant un an pour 1 000 naissances vivantes. Taux de chômage : chômeurs ÷ population active. Mortalité prématurée : décès avant 65 ans, convention française. Prévalence et incidence sont exactes, tout comme le taux standardisé (standardisation directe sur une population de référence). Tous les calculs d'exemple sont justes : 15 %, 8 ‰, +15 %, puis 11, 8 et 13 ‰ dans le tableur. L'IDH est bien calculé par le PNUD, de 0 à 1, avec trois dimensions. Les noms développés et la casse de l'Insee, de la Drees et de l'Inserm sont corrects.
- **Données fictives** : toutes les valeurs sont des données d'exercice, sans aucune statistique réelle ni date. La mention « données fictives » figurait seulement en tête de la section `construire-indicateur`. Elle est maintenant répétée pour le tableur et pour l'exercice des villes A et B.
- **Format** : classes `def`, `t`, `tbl`, `warn` et `th scope="row"`, les mêmes que dans le chapitre 1. Il y a 114 vraies U+00A0, aucune entité `&nbsp;` et aucune espace ordinaire avant « : ; ! ? » ou à l'intérieur de « ».
- **Cohésion avec le chapitre 1** : le chapitre 1 annonce que les indicateurs sont étudiés au chapitre 3, et le chapitre 3 y renvoie correctement. Il n'y a pas de contradiction.
- **Validateur** : `analyserImport` ne renvoie aucune erreur après correction. Le script jetable a été supprimé.

## Corrections

| Section | Problème | Correction |
| --- | --- | --- |
| `construire-indicateur` | L'espérance de vie était définie à partir d'une « génération de nouveau-nés ». Le mot clé de la définition de l'Insee manquait : la génération est **fictive**. | « une génération fictive de nouveau-nés ». |
| `construire-indicateur` | Les communes du tableur n'étaient pas signalées comme fictives à cet endroit. | « Exemple, avec des données fictives : … ». |
| `diversite-indicateurs` | L'espérance de vie sans incapacité n'était pas reliée à son autre nom, « espérance de vie en bonne santé », que les élèves rencontrent dans les documents de l'Insee, de la Drees et d'Eurostat. | Ajout de « aussi appelée espérance de vie en bonne santé », et de « activités de la vie quotidienne ». |
| `diversite-indicateurs` | IDH « publié par » le PNUD : il fallait dire que le PNUD le **calcule**, et qu'il le publie chaque année. | « calculé et publié chaque année par le PNUD ». |
| `diversite-indicateurs` | Pour l'éducation, « durée de scolarisation » était une formulation trop vague. L'IDH combine deux mesures : la durée moyenne de scolarisation des adultes et la durée attendue pour les enfants. | « le nombre moyen d'années d'études des adultes et le nombre d'années d'études attendu pour les enfants ». La mention « revenu par habitant », qui simplifie le revenu national brut par habitant, est gardée. |
| `producteurs-epidemiologie` | Ligne de la Drees : « statistiques des ministères » décrivait mal son rôle. La Drees produit des études et des statistiques pour les ministères sociaux. | « études et statistiques sur la santé, les soins, la protection sociale et l'action sociale, pour les ministères chargés de ces domaines ». |
| `producteurs-epidemiologie` | Ligne de Santé publique France : son rôle de producteur de données d'enquête n'apparaissait pas. | Ajout de « enquêtes sur les comportements de santé », en plus de la surveillance de l'état de santé et des épidémies. |
| `producteurs-epidemiologie` | L'Inserm produit les causes médicales de décès par l'intermédiaire de son CépiDc, qui n'était pas nommé. | « statistiques des causes médicales de décès, établies par son Centre d'épidémiologie sur les causes médicales de décès (CépiDc) ». |
| `producteurs-epidemiologie` | Le sigle « OCDE » n'était pas développé. Les autres sigles du chapitre l'étaient, ou l'avaient été au chapitre 1. | « Organisation de coopération et de développement économiques (OCDE) ». |
| `contrastes-inegalites` | L'exemple ouvriers et cadres justifiait l'inégalité par les seules conditions de vie, sans la relier à la **position sociale**, critère de la définition donnée juste avant. | « car l'écart est lié à la position sociale, à travers les conditions de vie et de travail ». |
| `regard-critique` | L'exercice des villes A et B n'était pas signalé comme fictif. L'étape 2 affirmait aussi une cause (« surtout parce que ») que l'énoncé ne permet pas d'établir. | « Situation fictive : un article affirme… ». À l'étape 2 : « la ville B peut avoir plus de décès simplement parce que sa population est plus âgée ». |

Points vérifiés et laissés tels quels :

- les définitions de la proportion, du taux, de l'effectif et du taux d'évolution ;
- l'avertissement sur le dénominateur ;
- la morbidité, définie comme « les maladies d'une population » ;
- la satisfaction dans la vie, notée de 0 à 10 ;
- le taux de pauvreté, avec son renvoi au chapitre 7 ;
- les trois types d'épidémiologie ;
- les exemples du diabète et de la grippe ;
- les critères du chômage, qui diffèrent entre une enquête et un fichier d'inscrits ;
- les six points de vigilance et l'avertissement sur la moyenne.

## Points de doute pour l'enseignant

1. **Disparité, inégalité, gradient social** : ce sont des formulations de manuel, sans définition officielle unique. La distinction retenue oppose une différence observée à une différence d'avantages liée à la position sociale, jugée injuste et évitable. Elle suit l'usage courant en ST2S. Vérifier qu'elle correspond à votre manuel. Certains manuels appellent « disparités » les seuls écarts territoriaux.
2. **Exemple des disparités** : l'exemple « hommes et femmes » est donné comme une disparité. Une partie des écarts de santé entre hommes et femmes tient aussi à des comportements et à des rôles sociaux. On peut donc en discuter en classe.
3. **Espérance de vie sans incapacité ou en bonne santé** : les deux expressions sont présentées comme synonymes. C'est l'usage de l'Insee et de la Drees pour l'indicateur européen. Des nuances existent selon les enquêtes : la définition de l'incapacité n'est pas toujours la même.
4. **Mortalité prématurée avant 65 ans** : c'est la convention française habituelle. Certaines publications internationales (OMS, objectifs de développement durable) retiennent un autre seuil, par exemple de 30 à 70 ans pour les maladies non transmissibles. Le chapitre ne mentionne que la convention française.
5. **IDH simplifié** : le texte ne dit ni que le revenu est mesuré en parité de pouvoir d'achat, ni comment les trois dimensions sont combinées (moyenne géométrique). C'est un choix de niveau.
6. **Producteurs** : le tableau ne cite ni les ARS, ni les observatoires régionaux de la santé, ni l'Assurance maladie. Le rédacteur a fait ce choix volontairement, puisque les institutions relèvent des chapitres 8 et 9. Ajoutez-les si vous voulez montrer des producteurs régionaux.
7. **Longueur** : environ 16 500 caractères de texte, en haut de la fourchette. Si vous voulez raccourcir, retirez d'abord la ligne « La période » du tableau `regard-critique`, comme le suggérait le rédacteur.

## Éléments datés à vérifier avant publication

- **Noms d'institutions** : Drees, Santé publique France, Inserm et son CépiDc, PNUD. Vérifier qu'aucune n'a été renommée ou fusionnée à la date de publication.
- **Composantes de l'IDH** : le PNUD a déjà révisé sa méthode (en 2010). Vérifier que les trois indicateurs cités sont toujours ceux du dernier rapport.
- **Fichier d'inscrits** : le chapitre parle d'un fichier d'inscrits, sans nommer France Travail. La formulation reste juste même si l'organisme change.
