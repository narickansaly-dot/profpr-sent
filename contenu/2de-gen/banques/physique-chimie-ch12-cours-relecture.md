# Relecture du chapitre 12 de physique-chimie (2de) : « Signaux et capteurs »

Relecture indépendante (N = 12). Fichier corrigé : `chapitres/ch12.json` dans le répertoire de travail de la session. La version du rédacteur reste dans `chapitres/ch12-redaction.json`.

## Bilan

- **Programme** : les notions [N78] (loi des nœuds, loi des mailles), [N79] (caractéristique tension-courant), [N80] (résistance, comportement de type ohmique, loi d'Ohm) et [N81] (capteurs électriques) sont toutes traitées, dans les cinq sections du plan et dans l'ordre. Les capacités [C110] à [C119] sont couvertes : [C110] par la méthode et l'exemple à deux mailles, [C111] par le tableau des branchements et les règles de sécurité, [C112] et [C114] par le protocole de tracé, le tableau des allures et le point de fonctionnement, [C113] par trois exemples résolus, [C115] par la description du tableur ou du programme Python (entrées, calcul, sortie), [C116] par le tableau du quotient *U* / *I*, [C117] par le tableau des capteurs du quotidien, [C118] par le protocole d'étalonnage d'une thermistance et l'exemple de lecture, [C119] par le paragraphe sur le microcontrôleur. Les notions reprises sont présentes : mesure et incertitude-type ([N1] à [N3]) avec un renvoi au chapitre 1, courbe d'étalonnage ([N12]) avec un renvoi au chapitre 2. Les rappels du collège (circuits série et dérivation, loi d'Ohm) sont signalés comme tels. Rien n'est hors programme. Les six objectifs du plan sont repris, à l'infinitif.
- **Exactitude** : définitions et lois vérifiées (nœud, branche, maille, loi des nœuds, loi des mailles écrite U<sub>AB</sub> + U<sub>BC</sub> + U<sub>CA</sub> = 0, U<sub>BA</sub> = −U<sub>AB</sub>, branchement du voltmètre « V » sur A et « COM » sur B pour U<sub>AB</sub>, loi d'Ohm et unités). Allures des caractéristiques justes : droite par l'origine pour le conducteur ohmique, courbe à pente croissante pour la lampe à filament dans U = f(I), tension seuil pour la DEL, tension décroissante pour la pile. Tous les calculs ont été refaits : U<sub>BN</sub> = 6,0 − 2,5 = 3,5 V et I<sub>2</sub> = 0,25 − 0,10 = 0,15 A ; point de fonctionnement 9,0 × I = 4,5, I = 0,50 A, U = 3,75 V arrondi à 3,8 V ; tableau U / I = 100 Ω ; 220 × 0,025 = 5,5 V ; 4,5 / 1 500 = 3,0 × 10<sup>−3</sup> A ; 6,0 / 0,040 = 150 Ω ; étalonnage 2,7 kΩ pour 10 °C, 1,5 / 0,27 ≈ 5,6 °C, θ ≈ 36 °C. Chiffres significatifs cohérents avec les données (deux chiffres).
- **Format** : classes `def`, `warn`, `tbl`, `t`, `th scope="col"` et `th scope="row"` ; aucune figure ; signe moins U+2212, « × », 176 vraies U+00A0, aucune entité `&nbsp;`. Les champs en texte brut (`titre`, `titre_court`, `resume`, `chapeau`, `objectifs`) ne contiennent aucune balise. HTML des sections : 17 771 caractères au total, chaque section entre 3 200 et 4 000 caractères environ.
- **Validateur** : `pc.ts cours` renvoie « Cours valide » (5 sections, 0 question) et `pc.ts typo` renvoie « Typographie conforme ».

## Corrections

| Section | Problème | Correction |
| --- | --- | --- |
| `caracteristique-dipole` | La modélisation par tableur ou Python cherchait toujours une droite U = a × I + b, sans dire comment interpréter le résultat. L'élève pouvait croire qu'un modèle affine convient à tous les dipôles, et le lien avec la proportionnalité ([C115], [C116]) n'était pas fait. | Ajout : « Pour une résistance, on trouve b proche de 0 : la droite passe par l'origine (voir la loi d'Ohm). Pour une lampe ou une DEL, les points ne sont pas alignés : un modèle affine ne convient pas. » |
| `loi-ohm` | « C'est le coefficient directeur de la droite » : ambigu, car la pente vaut R seulement pour la caractéristique U = f(I) (elle vaut 1/R pour I = g(U)). | « le coefficient directeur de la droite U = f(I) ». |
| `capteurs` | Le protocole plongeait la thermistance dans l'eau sans protection : l'eau conduit un peu le courant et fausse la mesure de résistance. | « on plonge la thermistance, protégée dans un tube étanche, dans un bain d'eau ». |
| `capteurs` | Le mot « ohmmètre » apparaissait sans être défini. | Ajout : « (un multimètre réglé pour mesurer une résistance, en ohm) ». |
| `capteurs` | « 0,27 kΩ par degré » : unité imprécise. | « 0,27 kΩ par degré Celsius ». |
| `capteurs` | « allumer une DEL au-dessus d'une température » : formulation maladroite. | « allumer une DEL quand la température dépasse une valeur choisie ». |

Points vérifiés et laissés tels quels :

- les définitions du dipôle, du branchement en série et en dérivation, de l'intensité (débit de charges) et de la tension (entre deux points) ;
- le choix du calibre et la conversion 1 mA = 10<sup>−3</sup> A ;
- les cinq règles de sécurité, dont le secteur 230 V et le court-circuit ;
- l'exemple à deux mailles indépendantes (générateur, R<sub>1</sub>, lampe et R<sub>2</sub> en dérivation) ;
- les avertissements : intensités qui se partagent et tensions égales en dérivation, conversion en ampère et en ohm, loi d'Ohm réservée aux dipôles ohmiques, courbe d'étalonnage à ne pas prolonger ;
- le tableau des capteurs du quotidien (smartphone, thermostat, lampadaire, balance, voiture) ;
- le sens de variation de la thermistance « la plus courante » et de la photorésistance ;
- l'exemple de lecture de la courbe d'étalonnage, présenté honnêtement comme une interpolation sur un segment ;
- le montage du capteur en série avec une résistance fixe pour le microcontrôleur ;
- les huit points de « À retenir ».

## Points de doute pour l'enseignant

1. **Thermistance CTN** : le chapitre parle de « la thermistance la plus courante », dont la résistance diminue quand la température augmente, sans employer le sigle CTN (coefficient de température négatif) ni citer les CTP. C'est un choix de niveau ; ajoutez le sigle si votre manuel l'utilise.
2. **Valeurs de l'étalonnage** : 8,0 kΩ à 30 °C et 5,3 kΩ à 40 °C sont des données fictives, mais vraisemblables pour une thermistance de 10 kΩ à 25 °C. L'interpolation linéaire entre deux points est une approximation, car la courbe réelle n'est pas une droite.
3. **Loi des mailles** : elle est écrite avec des tensions à double indice (U<sub>AB</sub> + U<sub>BC</sub> + U<sub>CA</sub> = 0), sans flèches de tension, puisque le chapitre ne contient pas de figure. Vérifiez que cette écriture correspond à celle de votre manuel, qui utilise souvent des flèches orientées et des signes + ou −.
4. **Nombre de mailles** : le circuit d'exemple compte trois chemins fermés, dont deux indépendants. Le programme dit « au plus deux mailles » au sens des mailles indépendantes ; on peut le préciser en classe si un élève compte trois mailles.
5. **Intensité comme « débit de charges »** : la définition reste qualitative (pas de relation I = Q / Δt), ce qui est conforme au niveau de 2de.
6. **Microcontrôleur** : le paragraphe ne cite ni le convertisseur analogique-numérique ni de carte précise. Il décrit seulement le principe (diviseur de tension, lecture, calcul, action). À compléter en activité pratique selon le matériel du lycée.
7. **Statut de rappel de la loi d'Ohm** : le chapitre la présente comme un rappel du collège, ce qui correspond au programme de cycle 4. Si vos élèves ne l'ont pas vue, la section reste autonome.
