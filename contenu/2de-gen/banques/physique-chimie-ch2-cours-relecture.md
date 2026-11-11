# Relecture du chapitre 2 de physique-chimie (2de) : « Corps purs, mélanges et solutions aqueuses »

Relecture indépendante (N = 2). Fichier corrigé : `chapitres/ch2.json` (dossier de travail de la session). La version du rédacteur reste dans `chapitres/ch2-redaction.json`.

## Bilan

- **Programme** : les notions [N4] à [N12] et les capacités [C8] à [C24] sont traitées, dans les six sections du plan et dans l'ordre. [N4], [N5] et [C8] dans `corps-purs-et-melanges` ; [N6], [C9] à [C13] dans `identifier-une-espece-chimique` (palier, banc Kofler, masse volumique, chromatographie sur couche mince, quatre tests) ; [N7], [N8], [C14] à [C17] dans `composition-d-un-melange` (pourcentages et fractions massiques, air, masse volumique de l'air) ; [N9] à [N11], [C18], [C19] et [C22] dans `les-solutions-aqueuses` ; [C20] et [C21] dans `preparer-une-solution` ; [N12], [C23] et [C24] dans `le-dosage-par-etalonnage`. Les notions reprises [N1] à [N3] apparaissent avec la variabilité du volume mesuré et la comparaison à une valeur de référence, avec renvoi au chapitre 1. Rien n'est hors programme : miscibilité et notions du cycle 4 sont présentées comme des rappels, les entités (chapitres 3 et 4) et les changements d'état (chapitre 5) sont seulement nommés avec un renvoi. Les huit objectifs du plan sont repris à l'infinitif.
- **Exactitude** : tous les calculs ont été refaits. Masse volumique 39,5 / 50,0 = 0,790 g·mL⁻¹ ; laiton 65,0 % et 35,0 % ; 2,0 % de 250 g = 5,0 g ; sable et sel 4,8 g, 24 % et 76,0 % ; dioxygène et diazote d'une salle de 60 m³ : 12,6 et 46,8 m³ ; masse de l'air 1,2 × 60 000 = 72 000 g ; concentration 5,0 / 0,250 = 20 g·L⁻¹ ; concentration maximale 3,10 / 0,0100 = 310 g·L⁻¹ ; dissolution 20,0 × 0,1000 = 2,00 g ; dilution F = 5,00 et V₀ = 20,0 mL ; soda 100 + 50 × 0,002 / 0,019 ≈ 105 g·L⁻¹ ; canette 105 × 0,33 = 34,65 g ≈ 35 g. Chiffres significatifs cohérents. Valeurs de référence vérifiées : eau (0 °C, 100 °C, 1,0 g·mL⁻¹), éthanol (−114 °C, 78 °C, 0,79 g·mL⁻¹), cyclohexane (6,5 °C, 81 °C, 0,78 g·mL⁻¹), air sec (78 % et 21 % en volume, 1,2 g·L⁻¹ à 20 °C). Les quatre tests chimiques sont exacts. La gamme de masses volumiques des solutions de sucre (pente 0,019 g·mL⁻¹ pour 50 g·L⁻¹) est réaliste et signalée comme arrondie.
- **Format** : textes bruts sans balise, classes `def`, `warn`, `tbl`, `t`, `th scope`, aucune figure, signe moins U+2212, « × », U+00A0 partout où il faut, aucune entité `&nbsp;`.
- **Validateur** : `pc.ts cours` (« Cours valide », 6 sections) et `pc.ts typo` (« Typographie conforme ») passent après correction.

## Corrections

| Section | Problème | Correction |
| --- | --- | --- |
| `identifier-une-espece-chimique` | L'exemple concluait à l'éthanol (0,790 g·mL⁻¹) alors que le tableau juste au-dessus donne 0,78 g·mL⁻¹ pour le cyclohexane : la masse volumique seule ne permet pas de trancher, et la conclusion apprenait une mauvaise démarche d'identification. | La phrase signale les deux candidats et indique que la température de fusion (−114 °C ou 6,5 °C) permet de trancher. |
| `identifier-une-espece-chimique` | Le banc Kofler était décrit comme « une plaque chauffante graduée en température », ce qui est inexact (c'est une plaque dont la température varie d'un bout à l'autre). La mesure d'une température de changement d'état d'un liquide ([C13]) n'était pas décrite. | Description corrigée, avec la précaution (plaque très chaude) ; ajout du principe pour un liquide : relevés de température à intervalles réguliers et recherche du palier. |
| `identifier-une-espece-chimique` | Protocole de mesure de la masse volumique ambigu : « après avoir taré la balance » ne disait pas avec quoi. | « On tare la balance avec l'éprouvette graduée vide, puis on y verse un volume V de liquide et on lit sa masse. » |
| `identifier-une-espece-chimique` | « L'huile, moins dense » : le mot « dense » n'est pas défini dans le chapitre, et [C11] demande de comparer la masse volumique de l'eau à celle d'autres corps purs et mélanges. | « de masse volumique plus faible (environ 0,9 g·mL⁻¹) ». |
| `identifier-une-espece-chimique` | Le g·L⁻¹, unité utilisée ensuite pour l'air et les solutions, manquait parmi les unités de masse volumique. | Ajout du g·L⁻¹. |
| `les-solutions-aqueuses` | La fusion était définie comme le passage solide-liquide « d'une seule espèce » : faux, un mélange peut aussi fondre. | « La fusion est le passage de l'état solide à l'état liquide, par exemple d'un glaçon qu'on chauffe : elle ne fait pas intervenir de solvant. » |
| `les-solutions-aqueuses` | Exemple de concentration maximale : conversion du volume et formule absentes, contrairement aux autres exemples résolus. | Ajout de « V = 10,0 mL = 0,0100 L ; Cmax = m / V ». |
| `les-solutions-aqueuses` | L'eau sucrée à 100 g·L⁻¹ avait une masse volumique de 1 040 g·L⁻¹, alors que la gamme de la section 6 donne 1,038 g·mL⁻¹ pour la même concentration. | Harmonisé à 1 038 g (et 1 038 g·L⁻¹). |
| `preparer-une-solution` | [C20] demande de déterminer la concentration à partir du mode opératoire d'une dilution ; le seul exemple calculait le volume à prélever. | Ajout d'un calcul inverse : 10,0 mL à 50,0 g·L⁻¹ complétés à 250,0 mL donnent C₁ = 2,00 g·L⁻¹. |

Points vérifiés et laissés tels quels :

- les définitions d'espèce chimique, de corps pur, de mélange homogène et hétérogène, et les exemples du quotidien (acier et air homogènes, lait hétérogène au microscope) ;
- les deux avertissements sur « pur » et sur « homogène » ;
- le palier « en général » absent pour un mélange (prudence justifiée : il existe des exceptions) ;
- le protocole de chromatographie (trait au crayon, éluant sous la ligne de dépôt, révélation, hotte) ;
- les précautions des tests (sulfate de cuivre à ne pas jeter à l'évier) ;
- « environ 1 000 fois moins que l'eau » pour l'air (rapport réel voisin de 830 : ordre de grandeur correct) ;
- la lecture du ménisque, les étapes de la dissolution, la pipette jaugée avec propipette ;
- les données fictives de variabilité de la verrerie et leur lien avec l'incertitude-type du chapitre 1 ;
- l'avertissement sur la conversion des cL en L.

## Points de doute pour l'enseignant

1. **« Concentration maximale, appelée aussi solubilité »** : le programme ne parle que de concentration maximale. L'équivalence est courante dans les manuels, mais certains réservent « solubilité » à d'autres unités. À garder ou à retirer selon le manuel.
2. **Rapport frontal** : la chromatographie est exploitée par comparaison des hauteurs de taches, sans rapport frontal. Le programme ne l'exige pas ; certains manuels l'introduisent dès la 2de.
3. **Composition de l'air** : le tableau donne l'air sec (78 %, 21 %, 1 %) sans parler de la vapeur d'eau, de teneur variable. C'est le niveau attendu.
4. **Masse volumique de l'huile** (environ 0,9 g·mL⁻¹) : valeur ajoutée en relecture, typique des huiles végétales (0,91 à 0,93 g·mL⁻¹). À vérifier contre le manuel.
5. **Gamme de solutions de sucre** : valeurs arrondies, réalistes pour le saccharose (partant de 1,000 au lieu de 0,998 pour l'eau à 20 °C). Le soda est assimilé à une solution de sucre seul ; ses autres solutés sont négligés.
6. **« Sucre de table » et « morceau de sucre » comme corps purs** : c'est du saccharose presque pur ; acceptable à ce niveau.
7. **Longueur** : environ 22 650 caractères de HTML, un peu au-dessus de la fourchette visée (22 000), et la section `identifier-une-espece-chimique` fait environ 4 530 caractères (cible 4 500). Les ajouts de relecture répondent à des capacités du programme ; pour raccourcir, on peut retirer l'avertissement final de `les-solutions-aqueuses`, qui redit la liste qui le précède.
