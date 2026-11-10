# Relecture du chapitre 7 de physique-chimie (2de) : « Les transformations nucléaires »

Relecture indépendante (N = 7). Fichier corrigé : `chapitres/ch7.json` (dossier de travail de la session). La version du rédacteur reste dans `chapitres/ch7-redaction.json`.

## Bilan

- **Programme** : les notions N44 (isotopes), N45 (écriture symbolique d'une réaction nucléaire) et N46 (aspects énergétiques : Soleil, centrales) sont traitées, ainsi que les capacités C58 (identifier des isotopes), C59 (relier l'énergie du Soleil et d'une centrale à des réactions nucléaires) et C60 (nature physique, chimique ou nucléaire d'une transformation, à partir d'une description ou d'une écriture symbolique). Les cinq sections du plan sont présentes, dans l'ordre. Les notions reprises N16 à N18 sont rappelées comme telles (« Rappel du chapitre 3 »), N34 et N39 servent dans le tableau comparatif avec renvoi aux chapitres 5 et 6. Rien n'est hors programme : désintégration radioactive, réaction en chaîne, uranium enrichi et barres de contrôle restent au niveau descriptif. Les objectifs reprennent les cinq objectifs du plan, à l'infinitif.
- **Exactitude** : toutes les équations ont été vérifiées (conservation de A et de Z, identité de l'élément produit) : désintégrations de l'uranium 238 (thorium 234), du carbone 14 (azote 14), du fluor 18 (oxygène 18) et du cobalt 60 (nickel 60) ; fissions de l'uranium 235 en xénon 140 + strontium 94 + 2 n, et en baryum 141 + krypton 92 + 3 n (A = 92, Z = 36 retrouvés) ; fusion deutérium-tritium ; bilan solaire 4 ¹H → ⁴He + 2 positons. Nombres de neutrons du tableau des isotopes et de l'exemple de l'oxygène (8, 9, 10) justes. Composition de l'uranium naturel (99,3 % et 0,7 %), température du cœur du Soleil (environ 15 millions de degrés) et enrichissement (quelques pourcents) corrects.
- **Calcul refait** : 1 g d'uranium 235 contient 6,022 × 10²³ ÷ 235 ≈ 2,56 × 10²¹ noyaux ; à environ 200 MeV par fission (3,2 × 10⁻¹¹ J), on obtient 8,2 × 10¹⁰ J. Combustion du méthane : 890 kJ/mol ÷ 16,0 g/mol ≈ 5,6 × 10⁴ J par gramme. Rapport : 8,2 × 10¹⁰ ÷ 5,6 × 10⁴ ≈ 1,46 × 10⁶, arrondi à 1,5 × 10⁶ avec deux chiffres significatifs. Résultat exact.
- **Format** : texte brut sans balise dans `titre`, `titre_court`, `resume`, `chapeau` et `objectifs` ; classes `def`, `warn`, `tbl`, `t` ; `th scope` présents ; écriture conventionnelle des noyaux en `sup`/`sub` ; signe moins U+2212 ; « × » ; pas de figure. Longueurs après correction : 4 426, 4 498, 3 781, 3 276 et 3 876 caractères, 19 857 au total (dans les fourchettes).
- **Validateur** : `pc.ts cours` (« Cours valide », 5 sections) et `pc.ts typo` (« Typographie conforme ») passent après correction.

## Corrections

| Section | Problème | Correction |
| --- | --- | --- |
| `ecrire-reaction-nucleaire` | La loi de conservation parle du « nombre de charge », mais ce terme n'était défini nulle part : le chapitre n'avait parlé que du « numéro atomique ». | Ajout, après le tableau des particules : « Le nombre du bas s'appelle donc le nombre de charge (numéro atomique Z pour un noyau). » |
| `ecrire-reaction-nucleaire` | « les éléments ne se conservent pas » : faux en général (une capture de neutron, ²³⁸U + n → ²³⁹U, garde l'élément). | « les éléments ne se conservent pas forcément ». |
| `ecrire-reaction-nucleaire` | « une transformation chimique, que tu étudies au chapitre 6 » : le chapitre 6 précède le chapitre 7. | « que tu as étudiée au chapitre 6 ». |
| `ecrire-reaction-nucleaire` | Section au-dessus de 4 500 caractères après l'ajout. | Retrait de redites : « écrite sous la forme d'une équation », « (section suivante) », « pas un nombre de protons ». |
| `energie-nucleaire` | Le méthane était présenté comme « le gaz de ville » : le gaz de ville historique était du gaz de houille ; le gaz distribué aujourd'hui est du gaz naturel. | « principal constituant du gaz naturel ». |
| `energie-nucleaire` | « c'est cet isotope qui fissionne » : l'uranium 238 peut aussi fissionner (neutrons rapides) ; c'est l'uranium 235 qui fissionne facilement dans un réacteur. | « c'est cet isotope qui fissionne facilement ». |
| `physique-chimique-nucleaire` | « une nouvelle espèce, la rouille » : la rouille est un mélange d'oxydes et d'hydroxydes de fer, pas une espèce unique. | « de nouvelles espèces chimiques, qui forment la rouille, apparaissent ». |
| `a_retenir` | « environ un million de fois plus » alors que l'exemple donne 1,5 million. | « de l'ordre d'un million de fois plus ». |

Points vérifiés et laissés tels quels :

- la définition des isotopes, la méthode en deux étapes et l'avertissement isotope / ion ;
- le tableau des particules (neutron, proton, électron, positon, noyau d'hélium) et la remarque sur A = 0 pour l'électron et le positon ;
- la méthode d'ajustement en cinq étapes et les deux exemples résolus (uranium 238, carbone 14) ;
- les définitions de la fission et de la fusion, le tableau comparatif et l'avertissement sur les deux sens du mot « fusion » ;
- la chaîne de conversion d'énergie d'une centrale (thermique, mécanique, électrique) et la mention des déchets radioactifs ;
- le tableau « physique, chimique ou nucléaire », la méthode en trois questions et les six exemples.

## Points de doute pour l'enseignant

1. **Écriture du positon** : le cours écrit ⁰₁e. Certains manuels écrivent ⁰₊₁e ou e⁺. Aligner sur le manuel de la classe.
2. **Bilan solaire simplifié** : 4 ¹H → ⁴He + 2 positons, sans neutrinos (hors programme). C'est la présentation habituelle en 2de, mais l'équation n'est qu'un bilan de plusieurs étapes, ce que le cours signale.
3. **Valeurs de l'exemple énergétique** : 8,2 × 10¹⁰ J par gramme d'uranium 235 (fission complète) et 5,6 × 10⁴ J par gramme de méthane (pouvoir calorifique supérieur ; le pouvoir calorifique inférieur donne environ 5,0 × 10⁴ J). Elles sont signalées comme « valeurs arrondies ». À comparer avec les données du manuel.
4. **Température de fusion** : « plusieurs millions de degrés » convient pour le cœur du Soleil (environ 15 millions) ; dans les réacteurs de recherche, la fusion deutérium-tritium demande plutôt une centaine de millions de degrés. Le cours ne donne pas ce chiffre.
5. **Centrale simplifiée** : la chaîne « la chaleur vaporise de l'eau » ne distingue pas circuit primaire et circuit secondaire d'un réacteur à eau pressurisée. C'est un choix de niveau.
6. **Ligne « Énergie mise en jeu »** (faible, moyenne, très grande) : comparaison qualitative, sans valeurs. Elle est juste en ordre de grandeur par unité de masse, mais une transformation physique peut mettre en jeu plus d'énergie qu'une transformation chimique peu énergétique.
7. **Redites dans les questions** : comme le note le plan, le chapitre ne couvre que trois notions ; prévoir une banque de questions variée (isotopes, ajustement, fission / fusion, nature des transformations).
