# Relecture du chapitre 3 de physique-chimie (2de) : « De l'atome au tableau périodique »

Relecture indépendante (N = 3). Fichier corrigé : `chapitres/ch3.json` (dossier de travail de la session). La version du rédacteur reste dans `chapitres/ch3-redaction.json`.

## Bilan

- **Programme** : les notions [N13], [N15] à [N23] et les capacités [C25], [C27] à [C34] sont toutes traitées, dans les six sections du plan, dans l'ordre. [N13] et [C25] : section `espece-entite` (changement d'échelle, espèce = collection d'entités identiques). [N15] et [C27] : méthode et tableau pour qualifier atome, molécule, cation, anion. [N16], [N17], [N19] et [C30] : section `noyau` (masses et charges, e, Z, A, <sup>A</sup><sub>Z</sub>X et <sup>A</sup>X, neutralité, deux exemples dans les deux sens). [C28], [C29] et [C31] : section `tailles-masses` (10<sup>−10</sup> m et 10<sup>−15</sup> m, quotients, puissances de 10, écriture scientifique). [N18] : section `element-chimique` (définition par Z, conservation). [N20], [N21], [N22] et [C33] : section `cortege-electronique`. [N21], [N23], [C32] et [C34] : section `tableau-periodique` (périodes, blocs s et p, alcalins, halogènes, gaz nobles). Rien n'est hors programme : la stabilité des gaz nobles, la formation des ions et des liaisons et la mole sont renvoyées au chapitre 4, les transformations chimiques au chapitre 6, les transformations nucléaires au chapitre 7, corps pur et mélange au chapitre 2 ; ces numéros correspondent au plan. Les sept objectifs du plan sont repris à l'infinitif.
- **Exactitude** : tous les calculs ont été refaits. Charge du noyau de <sup>23</sup><sub>11</sub>Na : 11 × 1,6 × 10<sup>−19</sup> = 1,76 × 10<sup>−18</sup> C, arrondi à 1,8 × 10<sup>−18</sup> C (2 chiffres significatifs, comme e). Nombres de neutrons : 23 − 11 = 12, 35 − 17 = 18. 0,000 000 000 15 m = 1,5 × 10<sup>−10</sup> m. Rapport des tailles : 10<sup>5</sup> ; bille de 1 cm → 10<sup>5</sup> cm = 1 km. m<sub>p</sub> / m<sub>e</sub> = 0,1833 × 10<sup>4</sup> = 1,83 × 10<sup>3</sup>. Carbone 12 : 12 × 1,67 × 10<sup>−27</sup> = 2,00 × 10<sup>−26</sup> kg ; 6 × 9,11 × 10<sup>−31</sup> = 5,47 × 10<sup>−30</sup> kg ; quotient 3,66 × 10<sup>3</sup> ≈ 3,7 × 10<sup>3</sup> ; part des électrons 2,7 × 10<sup>−4</sup>, soit 0,03 %. Environ 10<sup>21</sup> molécules dans une goutte d'eau (0,05 g / 18 g·mol<sup>−1</sup> × 6 × 10<sup>23</sup> ≈ 2 × 10<sup>21</sup>) : ordre de grandeur juste. Chapeau : 10<sup>−3</sup> m / 10<sup>−10</sup> m = 10<sup>7</sup>, « dix millions » juste. Valeurs : e = 1,6 × 10<sup>−19</sup> C (valeur exacte 1,602 176 634 × 10<sup>−19</sup> C), m<sub>p</sub> ≈ m<sub>n</sub> ≈ 1,67 × 10<sup>−27</sup> kg, m<sub>e</sub> = 9,11 × 10<sup>−31</sup> kg. Configurations de H, He, C, O, Na, Cl, P, Ar et électrons de valence vérifiés ; règle « colonne = 12 + x » pour le bloc p vérifiée (P en colonne 15, O en 16). Nombres d'électrons des ions Na<sup>+</sup>, Cl<sup>−</sup>, Fe<sup>2+</sup>, Fe<sup>3+</sup>, Cu<sup>2+</sup> justes. Étymologies latines (natrium, kalium, ferrum) justes.
- **Format** : classes `def`, `warn`, `tbl`, `t` ; `th scope="col"` et `th scope="row"` ; `sub` et `sup` ; aucune figure ; signe moins U+2212, « × », U+00A0 partout. Champs en texte brut (`titre`, `titre_court`, `resume`, `chapeau`, `objectifs`) sans balise. Longueur du HTML : 21 995 caractères (entre 3 094 et 4 425 par section), dans la fourchette après correction (22 057 avant les dernières coupes).
- **Validateur** : `pc.ts cours` (« Cours valide », 6 sections) et `pc.ts typo` (« Typographie conforme ») passent.

## Corrections

| Section | Problème | Correction |
| --- | --- | --- |
| `tailles-masses` | « Un proton est environ 1 800 fois plus lourd qu'un électron » : « lourd » renvoie au poids, alors qu'on compare des masses (confusion masse et poids signalée dans les consignes). | « Le proton a une masse environ 1 800 fois plus grande que l'électron. » |
| `tailles-masses` | [C29] demande de comparer la masse de l'atome et celle de son noyau ; l'exemple comparait seulement le noyau aux électrons, sans conclure sur l'atome par un chiffre. | Ajout : « Les électrons font environ 0,03 % de la masse de l'atome. » |
| `cortege-electronique` | Tableau des couches : « n = 3 … nombre maximal d'électrons : 8 » laissait croire que la couche 3 ne peut contenir que 8 électrons (elle en contient 18 avec la sous-couche 3d, hors programme). | « 3s et 3p (seules utilisées si Z ⩽ 18) » et « 2 + 6 = 8 (dans 3s et 3p) ». |
| `tableau-periodique` | Blocs s et p définis par la « dernière sous-couche remplie » : faux pour les configurations qui finissent par une sous-couche incomplète (3p<sup>3</sup> pour P). | « dernière sous-couche occupée » (deux occurrences). |
| `tableau-periodique` | Encadré : « l'hydrogène … c'est un gaz formé de molécules H<sub>2</sub> » mélangeait l'élément et l'espèce chimique, distinction que le chapitre vient d'enseigner. | « le dihydrogène, l'espèce formée de molécules H<sub>2</sub>, est un gaz aux propriétés très différentes ». |
| `a_retenir` | « soit 10<sup>5</sup> fois moins » : formulation imprécise pour comparer des tailles. | « soit 10<sup>5</sup> fois plus petit ». |

Points vérifiés et laissés tels quels :

- la méthode pour qualifier une entité et le tableau He, O<sub>2</sub>, CO<sub>2</sub>, Mg<sup>2+</sup>, F<sup>−</sup>, NH<sub>4</sub><sup>+</sup> ;
- l'avertissement indice et exposant, et espèce et entité ;
- la définition de Z, A et N = A − Z, sans unité ;
- la neutralité de l'atome (charge +Z × e du noyau, Z électrons) ;
- l'avertissement « A n'est pas le nombre de neutrons » ;
- la structure lacunaire et la comparaison bille / 1 km ;
- l'avertissement sur l'écriture scientifique et les exposants négatifs ;
- la définition de l'élément chimique (atomes et ions de même Z), sa conservation et l'exemple du cuivre ;
- l'avertissement élément, entité, espèce, et Co / CO ;
- la définition des électrons de valence (toute la dernière couche) et l'avertissement sur le chlore ;
- l'exception de l'hélium (colonne 18, bloc s, 2 électrons de valence) ;
- la consigne de sécurité pour la réaction des alcalins avec l'eau (expérience de démonstration).

## Points de doute pour l'enseignant

1. **Masses des nucléons** : le chapitre prend m<sub>p</sub> = m<sub>n</sub> = 1,67 × 10<sup>−27</sup> kg (valeurs réelles 1,673 et 1,675 × 10<sup>−27</sup> kg). Vérifier les valeurs données par votre manuel ; certains donnent m<sub>n</sub> = 1,675 × 10<sup>−27</sup> kg.
2. **Taille de l'atome et du noyau** : 10<sup>−10</sup> m et 10<sup>−15</sup> m sont les ordres de grandeur attendus ; certains manuels écrivent 10<sup>−14</sup> à 10<sup>−15</sup> m pour le noyau, d'où un rapport « 10<sup>4</sup> à 10<sup>5</sup> ».
3. **Couche 3** : le chapitre dit seulement que 3s et 3p contiennent au plus 8 électrons pour Z ⩽ 18. Certains manuels parlent encore de « couches K, L, M » ou de la « règle des 8 électrons sur la couche M » ; le vocabulaire retenu (1s, 2s, 2p, 3s, 3p) est celui du programme.
4. **Électrons de valence de l'hélium** : le chapitre retient 2 électrons de valence et range l'hélium dans le bloc s, en colonne 18. C'est la convention habituelle, mais à signaler aux élèves, comme le fait l'encadré.
5. **Halogènes et alcalins hors des trois premières périodes** : Br, I et K sont nommés alors que le tableau du chapitre s'arrête à Ar. C'est un choix pour illustrer les familles ; on peut les retirer si l'on veut s'en tenir à Z ⩽ 18.
6. **Ions du fer et du cuivre** (Z = 26 et 29) dans la section sur l'élément : hors du domaine Z ⩽ 18, mais seulement pour compter des électrons, sans configuration. Choix acceptable, à garder ou à remplacer par Mg<sup>2+</sup> ou Al<sup>3+</sup>.
7. **Structure lacunaire** : « entre le noyau et les électrons, il n'y a que du vide » est la présentation usuelle en 2de ; elle simplifie le modèle quantique.
8. **Longueur** : 21 995 caractères de HTML, à la limite haute de la fourchette (22 000). Tout ajout futur devra être compensé.
