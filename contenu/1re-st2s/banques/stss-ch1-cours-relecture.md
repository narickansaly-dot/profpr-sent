# Relecture du chapitre 1 de STSS : « La santé, de l'individu à la population »

Relecture indépendante (task 3, step 2, N = 1). Fichier corrigé : `contenu/1re-st2s/stss.json`, chapitre `ch1`.

## Bilan

- **Programme** : les notions N1 à N5 et les capacités C1 à C3 du plan sont toutes traitées, dans les cinq sections prévues, dans l'ordre. Rien n'est hors programme : les notions d'autres chapitres (bien-être, déterminants, indicateurs, problème de santé, modes d'intervention) sont seulement nommées, avec un renvoi au bon chapitre. Les objectifs reprennent les cinq objectifs du plan, sous la forme « tu sais : » utilisée par BPH.
- **Exactitude** : la définition de l'OMS a été vérifiée sur la page officielle de l'OMS (Constitution, version française, who.int). Le texte du chapitre est exact au mot près, y compris la virgule avant « et ne consiste pas ». La Constitution a été adoptée le 22 juillet 1946. La définition figure dans son préambule. L'attribution à René Leriche, chirurgien français, est correcte. La date de 1936, souvent citée, n'a pas pu être confirmée par une source fiable : la citation reste sans date.
- **Format** : balises et classes conformes au guide des auteurs (partie 4). Les `id` de section sont valides. Il y a 118 vraies U+00A0, aucune entité `&nbsp;` et aucune espace ordinaire avant « : ; ! ? » ou à l'intérieur de « ».
- **Validateur** : `analyserImport` ne renvoie aucune erreur après correction.
- **Longueur** : 16 639 octets de sortie pour `banque:texte` (16 543 avant). Le chapitre est environ 1,5 fois plus long que BPH ch1. Une phrase redondante a été retirée, mais la ligne ajoutée au tableau d'Inès compense ce gain. Il n'y a pas eu d'autre coupe : chaque passage sert une notion ou une capacité, et BPH transmet une partie de son contenu par des figures.

## Corrections

| Section | Problème | Correction |
| --- | --- | --- |
| `definir-sante` | « l'institution des Nations unies chargée de la santé » : formulation imprécise, l'OMS est une institution spécialisée. | « l'institution spécialisée des Nations unies pour la santé ». |
| `definir-sante` | La source de la citation est trop vague : « (Constitution de l'OMS, 1946) ». La définition figure dans le préambule. | « Dans le préambule de sa Constitution, adoptée en 1946 » et « (préambule de la Constitution de l'OMS, 1946) ». La citation elle-même est exacte et n'a pas été modifiée. |
| `individuelle-collective` | « se faire vacciner protège […] son entourage » est faux pour une maladie non contagieuse (le tétanos, par exemple). | « se faire vacciner contre une maladie contagieuse protège la personne, mais aussi son entourage ». |
| `sante-publique` | « favorisent le diabète » : c'est le diabète de type 2 qui est lié au surpoids. | « favorisent le diabète de type 2 et les maladies cardiovasculaires ». |
| `sante-publique` | La phrase d'introduction répétait la définition qui la suit immédiatement. | Phrase retirée. La section s'ouvre sur l'encadré de définition. |
| `analyser-question` | Le tableau de l'exemple d'Inès ne suivait pas les cinq étapes de la méthode : l'étape 1 manquait et les lignes n'étaient pas reliées aux étapes. | Ajout de la ligne « 1. Décrire la situation ». Les lignes sont numérotées selon l'étape de la méthode (2 pour les trois approches, puis 3, 4 et 5). |

Points vérifiés et laissés tels quels :

- la citation de l'OMS ;
- la citation de Leriche, sans date ;
- l'hypertension « souvent inaperçue » ;
- la question type de santé perçue ;
- le lien entre logement humide et problèmes respiratoires ;
- les exemples d'actions de santé publique ;
- les vagues de chaleur et le réchauffement climatique ;
- la somnolence et le risque d'accident.

## Points de doute pour l'enseignant

1. **Santé collective et santé publique** : le chapitre définit la santé collective comme un état et la santé publique comme cet état plus les actions organisées. C'est l'usage courant des manuels de ST2S, mais il n'existe pas de définition officielle unique. Certains auteurs emploient « santé collective » comme synonyme de « santé publique ». À confirmer selon votre manuel de référence.
2. **Santé globale** : elle est définie comme une approche holistique (dimensions physique, mentale et sociale, et environnement). En français, l'expression désigne aussi la « santé mondiale » (*global health*). Ce sens n'est pas abordé ici. À signaler aux élèves si votre manuel l'emploie.
3. **Préoccupation de santé publique** : il s'agit d'une définition de travail, avec cinq critères (fréquence, gravité, conséquences, possibilités d'agir, regard de la société). Ce n'est pas une définition officielle. La notion de problème de santé reconnu est renvoyée au chapitre 6. Vérifier la cohérence avec la façon dont vous l'aborderez au chapitre 6.
4. **Citation de Leriche** : elle est attribuée sans date ni source précise. Elle est souvent datée de 1936 (Encyclopédie française), mais cela n'a pas été confirmé par une source fiable pendant la relecture. Ajouter la date seulement si vous pouvez la vérifier.
5. **Question de santé perçue** : la formulation « Comment est votre état de santé en général ? », avec des réponses de « très bon » à « très mauvais », est celle des enquêtes européennes. Le texte la présente comme un exemple (« souvent »), sans citer d'enquête.
6. **Longueur** : le chapitre est environ 1,5 fois plus long que BPH ch1. Si vous le jugez trop long, le premier passage à raccourcir est le tableau des six préoccupations (section `sante-publique`) : en garder quatre suffirait pour C3.

## Éléments datés à vérifier avant publication

- **Vaccinations obligatoires des jeunes enfants** : il y en a 11 depuis 2018, mais le chapitre ne donne ni nombre ni date. Vérifier que la formulation reste vraie si la liste évolue.
- **Dépistage organisé de certains cancers** : il concerne aujourd'hui le sein, le côlon-rectum et le col de l'utérus, sans liste dans le chapitre. La formulation générale reste juste tant qu'au moins un programme existe.
- **Exemples de préoccupations** : la santé mentale des jeunes, les vagues de chaleur et le surpoids sont des sujets d'actualité. Vérifier qu'ils restent pertinents à la date de publication et que l'exemple de sommeil et d'écrans du dernier exemple ne contredit pas une recommandation récente.
- **Institutions** : l'OMS est la seule institution nommée. Sa Constitution et la définition de 1946 n'ont pas changé.
