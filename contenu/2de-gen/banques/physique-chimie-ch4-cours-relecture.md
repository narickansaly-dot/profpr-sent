# Relecture du chapitre 4 de physique-chimie (2de) : « Ions, molécules et quantité de matière »

Relecture indépendante (N = 4). Fichier corrigé : `scratchpad/chapitres/ch4.json`. La version du rédacteur reste dans `scratchpad/chapitres/ch4-redaction.json`.

## Bilan

- **Programme** : les notions [N14] et [N24] à [N33] sont toutes traitées, dans les six sections du plan, dans l'ordre. Les notions reprises [N15], [N21], [N22] et [N23] sont présentées comme des rappels du chapitre 3. Les capacités [C26] et [C35] à [C41] sont couvertes : lien stabilité et configuration de valence (C35), charge des ions par la colonne (C36), noms et formules des sept ions du programme (C37), schémas de Lewis de H₂O, CO₂, CH₄ et NH₃ avec justification de la stabilisation (C38), énergie de liaison qualitative (C39), masse d'une entité (C40), nombre d'entités et quantité de matière (C41), formules statistiques par électroneutralité (C26). Rien n'est hors programme : la dissolution renvoie au chapitre 2, les changements d'état au chapitre 5, les transformations chimiques et leur bilan d'énergie au chapitre 6. K⁺ et Ca²⁺ (Z = 19 et 20) sont au programme, et le texte les rattache aux colonnes 1 et 2 sans écrire leur configuration.
- **Exactitude** : tous les calculs ont été refaits. Masses atomiques arrondies : m(H) = 1,67 × 10⁻²⁷ kg, m(C) = 1,99 × 10⁻²⁶ kg, m(N) = 2,33 × 10⁻²⁶ kg, m(O) = 2,66 × 10⁻²⁶ kg, cohérentes avec les masses molaires et l'unité de masse atomique. m(H₂O) = 2,994 × 10⁻²⁶ kg, arrondie à 2,99 × 10⁻²⁶ kg. N = 0,200 / 2,99 × 10⁻²⁶ = 6,69 × 10²⁴. n = 6,69 × 10²⁴ / 6,02 × 10²³ = 11,1 mol (cohérent avec 200 g / 18 g·mol⁻¹). Carbone : N = 6,03 × 10²³, n = 1,00 mol. Charge de Ca²⁺ : 2 × 1,6 × 10⁻¹⁹ = 3,2 × 10⁻¹⁹ C. Chiffres significatifs cohérents (trois). Configurations électroniques, électrons de valence, nombres de liaisons et de doublets non liants (H, C, N, O, Cl) exacts ; décomptes de doublets des quatre molécules exacts (CO₂ : 4 liants, 4 non liants). Al₂O₃ juste. Classement des énergies de liaison N≡N > O=O > H–H > Cl–Cl conforme aux tables (environ 945, 498, 436 et 243 kJ·mol⁻¹). Définition de la mole conforme au SI depuis 2019, N_A exacte à 6,022 140 76 × 10²³ mol⁻¹. Diazote : environ 78 % de l'air.
- **Format** : texte brut sans balise dans `titre`, `titre_court`, `resume`, `chapeau` et `objectifs`, exposants Unicode (H⁺, Ca²⁺, Cl⁻). Objectifs à l'infinitif, « ; » précédé d'une U+00A0, le dernier finit par « . ». Classes `def`, `warn`, `tbl`, `t` seulement ; pas de figure ; signe moins U+2212 ; « × » ; aucune entité `&nbsp;`. Longueur du HTML : 21 996 caractères (fourchette 15 000 à 22 000), sections entre 2 692 et 4 205 caractères.
- **Validateur** : `pc.ts cours` (« Cours valide », 6 sections) et `pc.ts typo` (« Typographie conforme ») passent après correction.

## Corrections

| Section | Problème | Correction |
| --- | --- | --- |
| `stabilite-gaz-nobles` | « leurs sous-couches de valence s et p sont pleines » est faux pour l'hélium, dont la couche de valence n'a pas de sous-couche p. | « leur couche de valence est pleine (1s² pour l'hélium, ns² np⁶ pour le néon et l'argon) ». |
| `ions-monoatomiques` | L'ion H⁺ était présenté comme un « cas particulier » sans dire en quoi : il n'a plus d'électron, donc pas de duet, alors que la section affirme juste avant que l'ion formé a la configuration de valence d'un gaz noble. | Ajout : « il n'a donc pas le duet de l'hélium. C'est une exception à la règle du duet. » |
| `ions-monoatomiques` | Phrase redondante avec la section 1 (« Les gaz nobles, déjà stables, ne forment pas d'ions »), supprimée pour rester sous 22 000 caractères. | Phrase retirée ; l'idée reste dans la section 1. |
| `composes-ioniques` | La méthode de nommage ne donnait que « de », alors que l'exemple résolu donne « oxyde d'aluminium ». | « nom de l'anion + « de » (« d' » devant une voyelle) + nom de l'élément du cation ». |
| `compter-entites-mole` | « Ce nombre fixe la constante d'Avogadro » inversait la logique du SI : c'est la valeur exacte de N_A qui est fixée et qui définit la mole. | « Ce nombre, fixé exactement par définition, est la valeur numérique de la constante d'Avogadro ». |

Points vérifiés et laissés tels quels :

- la définition de la stabilité chimique et la règle du duet et de l'octet (H, Li, Be vers le duet) ;
- l'avertissement « avoir la configuration d'un gaz noble n'est pas devenir un gaz noble » ;
- le tableau colonne / charge (colonnes 1, 2, 13, 16, 17) et les exemples Cl⁻ et Mg²⁺ ;
- les noms des ions en « -ure » « le plus souvent » (l'oxyde est l'exception) ;
- l'électroneutralité et la formule statistique, avec l'avertissement sur CaCl₂ qui n'est pas une molécule ;
- la définition de la liaison covalente, des doublets liants et non liants, du schéma de Lewis ;
- l'avertissement distinguant rupture de liaison et changement d'état (ébullition de l'eau) ;
- les trois exemples résolus de la mole, au format données, formule, application numérique, résultat ;
- les neuf points de l'`a_retenir`.

## Points de doute pour l'enseignant

1. **Masses atomiques** : les valeurs arrondies (1,67 × 10⁻²⁷ kg pour H, 1,99 × 10⁻²⁶ kg pour C, etc.) sont justes, mais les manuels donnent parfois d'autres arrondis (2,00 × 10⁻²⁶ kg pour C, 2,7 × 10⁻²⁶ kg pour O). Vérifier contre le manuel de la classe.
2. **Règle du duet pour Li et Be** : le texte range le lithium et le béryllium avec l'hydrogène (duet). C'est l'usage courant, mais certains manuels ne citent que l'hydrogène.
3. **Al³⁺, O²⁻, S²⁻, Li⁺** : ces ions ne figurent pas dans la liste [C37]. Ils servent d'exemples d'application (colonnes 13 et 16, oxyde d'aluminium). Les élèves n'ont pas à les connaître par cœur ; à préciser en classe si besoin.
4. **Énergie de liaison** : l'approche est qualitative, comme le demande le programme ; aucune valeur numérique n'est donnée et l'unité citée est le joule. Si le manuel utilise des valeurs en kJ·mol⁻¹ ou en eV, l'enseignant peut les ajouter. Le classement des quatre liaisons a été vérifié.
5. **Schémas de Lewis sans figure** : à cette étape, les schémas sont décrits en mots (H–O–H, O=C=O). Il faudra ajouter de vraies figures avec les doublets non liants, sans quoi la capacité « décrire et exploiter un schéma de Lewis » reste abstraite.
6. **Constante d'Avogadro arrondie** : les calculs utilisent 6,02 × 10²³ mol⁻¹, présentée comme « valeur arrondie » ; la valeur exacte est donnée dans la définition. Choix cohérent avec trois chiffres significatifs.
7. **Longueur** : 21 996 caractères, tout en haut de la fourchette. Pour raccourcir, retirer d'abord le second exemple du carbone (section `compter-entites-mole`) ou le tableau des masses atomiques en le remplaçant par les seules données utiles.
