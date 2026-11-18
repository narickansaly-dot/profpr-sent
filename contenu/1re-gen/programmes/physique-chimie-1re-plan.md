# Plan des chapitres : physique-chimie, spécialité de première générale

Plan déduit du programme officiel résumé dans `physique-chimie-1re.md` (arrêté du 17 janvier 2019, NOR MENE1901635A, BO spécial n° 1 du 22 janvier 2019). Les notions sont citées avec leur code [N…], les capacités avec leur code [C…].

**Statut** : plan proposé, **non validé par l'enseignant** : le cours a été rédigé sans arrêt intermédiaire, à la demande de la session de coordination. Les choix à trancher sont listés à la fin.

## Principes du découpage

- Un chapitre par sous-partie du programme (les tableaux A, B, C ou 1, 2, 3 du texte officiel), pour que chaque chapitre porte assez de faits distincts pour une banque de 150 questions.
- « Mesure et incertitudes » devient le chapitre 1, comme en seconde : il sert d'outil à tous les autres, qui le réinvestissent.
- Ordre du programme : matière (chapitres 2 à 9), mouvement et interactions (10 à 12), énergie (13 et 14), ondes et signaux (15 à 17). Le programme laisse l'ordre au professeur.
- Exceptions au « un tableau, un chapitre » : la partie 3-A (structure des entités organiques) et 3-B (synthèses) forment un seul chapitre (8) ; « Images et couleurs » (ondes 2-A) forme un seul chapitre (16).
- Figures : schémas SVG en ligne quand ils aident vraiment (montages, schémas de Lewis, vecteurs, lentilles, ondes, diagrammes d'énergie). Formules en `sub`/`sup` et caractères Unicode.
- Durées indicatives : 4 h par semaine, environ 32 semaines.
- Valeurs de référence communes à tous les chapitres : N<sub>A</sub> = 6,02 × 10<sup>23</sup> mol<sup>−1</sup> ; e = 1,60 × 10<sup>−19</sup> C ; G = 6,67 × 10<sup>−11</sup> N·m<sup>2</sup>·kg<sup>−2</sup> ; k = 9,0 × 10<sup>9</sup> N·m<sup>2</sup>·C<sup>−2</sup> ; g = 9,81 N·kg<sup>−1</sup> ; c = 3,00 × 10<sup>8</sup> m·s<sup>−1</sup> ; h = 6,63 × 10<sup>−34</sup> J·s ; 1 eV = 1,60 × 10<sup>−19</sup> J ; volume molaire des gaz V<sub>m</sub> = 24,0 L·mol<sup>−1</sup> à 20 °C et 1,013 × 10<sup>5</sup> Pa (22,4 L·mol<sup>−1</sup> à 0 °C) ; masses molaires H 1,0 ; C 12,0 ; N 14,0 ; O 16,0 ; Na 23,0 ; Cl 35,5 g·mol<sup>−1</sup>.

## Vue d'ensemble

| N° | Titre | Titre court | Durée | Partie du programme | Notions |
| --- | --- | --- | --- | --- | --- |
| 1 | Mesure et incertitudes | Mesure | 1 semaine | Préambule, « Mesure et incertitudes » | N1 à N3 |
| 2 | Composition d'un système chimique | Composition d'un système | 2 semaines | Matière 1-A | N4 à N6 |
| 3 | Les réactions d'oxydo-réduction | Oxydo-réduction | 2 semaines | Matière 1-B (oxydo-réduction) | N7 |
| 4 | Avancement et bilan de matière | Avancement | 2 semaines | Matière 1-B (avancement) | N8, N9 |
| 5 | Le titrage colorimétrique | Titrage | 2 semaines | Matière 1-C | N10, N11 |
| 6 | Schéma de Lewis, géométrie et polarité | Lewis et polarité | 2 semaines | Matière 2-A | N12, N13 |
| 7 | Cohésion, dissolution et extraction | Cohésion et solubilité | 2 semaines | Matière 2-B | N14 à N17 |
| 8 | Structure et synthèse des espèces organiques | Chimie organique | 3 semaines | Matière 3-A et 3-B | N18 à N22 |
| 9 | Combustions et énergie chimique | Combustions | 2 semaines | Matière 3-C | N23 à N26 |
| 10 | Interactions fondamentales et champs | Interactions et champs | 2 semaines | Mouvement 1 | N27, N28 |
| 11 | Le fluide au repos | Fluides | 2 semaines | Mouvement 2 | N29 à N32 |
| 12 | Mouvement et deuxième loi de Newton | Mouvement et forces | 2 semaines | Mouvement 3 | N33 |
| 13 | Aspects énergétiques des phénomènes électriques | Énergie électrique | 2 semaines | Énergie 1 | N34 à N36 |
| 14 | Aspects énergétiques des phénomènes mécaniques | Énergie mécanique | 2 semaines | Énergie 2 | N37 à N40 |
| 15 | Les ondes mécaniques | Ondes mécaniques | 2 semaines | Ondes 1 | N41 à N43 |
| 16 | Images et couleurs | Images et couleurs | 3 semaines | Ondes 2-A | N44, N45 |
| 17 | Modèles ondulatoire et particulaire de la lumière | Ondes et photons | 2 semaines | Ondes 2-B | N46, N47 |

---

## Chapitre 1 : Mesure et incertitudes

- **Notions** : N1 à N3. **Capacités** : C1 à C9.
- **Objectifs** : exploiter une série de mesures (histogramme, moyenne, écart-type) ; discuter de l'influence de l'instrument et du protocole ; définir une incertitude-type ; l'évaluer par une approche statistique (type A) ; l'évaluer à partir des caractéristiques d'un instrument (type B) ; écrire un résultat avec un nombre adapté de chiffres significatifs ; comparer qualitativement à une valeur de référence.
- **Sections** : 1. Variabilité de la mesure (rappel de seconde). 2. Exploiter une série : histogramme, moyenne, écart-type (tableur). 3. L'incertitude-type et l'évaluation de type A : u = σ<sub>n−1</sub> / √N. 4. L'évaluation de type B : graduation (u = 1 graduation / √12, ou demi-graduation / √3), affichage numérique (u = 1 digit / √12, ou formule constructeur), verrerie (tolérance / √3), double lecture. 5. Écrire le résultat : chiffres significatifs, arrondi de u à un ou deux chiffres significatifs, valeur au même rang. 6. Comparer à une valeur de référence (qualitatif ; le critère quantitatif z-score est réservé à la terminale) ; sources d'erreur.
- **Figures** : histogramme d'une série ; règle graduée et lecture.

## Chapitre 2 : Composition d'un système chimique

- **Notions** : N4 à N6. **Capacités** : C10 à C17.
- **Objectifs** : calculer une masse molaire ; relier masse molaire, masse d'une entité et N<sub>A</sub> ; calculer une quantité de matière à partir d'une masse, d'un volume de gaz (V<sub>m</sub>) ou d'une composition ; utiliser la concentration en quantité de matière et la relier à la concentration en masse ; expliquer la couleur d'une solution à partir de son spectre (couleur complémentaire, cercle chromatique) ; utiliser la loi de Beer-Lambert et une droite d'étalonnage.
- **Sections** : 1. De la mole à la masse molaire (M = N<sub>A</sub> × m<sub>entité</sub>, masse molaire atomique, moléculaire, ionique). 2. Quantité de matière d'un solide ou d'un liquide (n = m/M ; ρ et densité pour un liquide ; mélanges). 3. Quantité de matière d'un gaz (V<sub>m</sub>, conditions). 4. Concentration en quantité de matière (C = n/V ; C<sub>m</sub> = C × M ; dilution C<sub>0</sub>V<sub>0</sub> = C<sub>1</sub>V<sub>1</sub>). 5. Couleur d'une espèce en solution, absorbance et spectre d'absorption (cercle chromatique, couleurs complémentaires). 6. La loi de Beer-Lambert et le dosage spectrophotométrique (A = k × C, gamme étalon, limites).
- **Figures** : cercle chromatique ; spectre d'absorption ; droite d'étalonnage A = f(C).

## Chapitre 3 : Les réactions d'oxydo-réduction

- **Notions** : N7. **Capacités** : C18 à C20.
- **Objectifs** : définir oxydant, réducteur, oxydation, réduction ; écrire un couple et sa demi-équation électronique (avec H<sup>+</sup> et H<sub>2</sub>O en milieu acide) ; identifier un transfert d'électrons à partir d'observations ; établir l'équation d'une réaction d'oxydo-réduction à partir de deux couples ; connaître des couples usuels (métaux, H<sup>+</sup>/H<sub>2</sub>, I<sub>2</sub>/I<sup>−</sup>, S<sub>4</sub>O<sub>6</sub><sup>2−</sup>/S<sub>2</sub>O<sub>3</sub><sup>2−</sup>, MnO<sub>4</sub><sup>−</sup>/Mn<sup>2+</sup>, Fe<sup>3+</sup>/Fe<sup>2+</sup>, Cu<sup>2+</sup>/Cu, Zn<sup>2+</sup>/Zn, O<sub>2</sub>/H<sub>2</sub>O, H<sub>2</sub>O<sub>2</sub>/H<sub>2</sub>O).
- **Sections** : 1. Un transfert d'électrons (expérience du fer dans le sulfate de cuivre ; tests des ions). 2. Oxydant, réducteur, couple. 3. Les demi-équations électroniques (méthode d'ajustement). 4. L'équation de la réaction d'oxydo-réduction (combinaison, électrons qui s'éliminent). 5. Des exemples (corrosion, métaux et acides, détartrage, eau de Javel, iode et thiosulfate, permanganate).
- **Figures** : schéma de la lame de fer dans la solution de sulfate de cuivre.

## Chapitre 4 : Avancement et bilan de matière

- **Notions** : N8, N9. **Capacités** : C21 à C27.
- **Objectifs** : décrire qualitativement l'évolution des quantités de matière ; définir l'avancement x (mol) ; établir un tableau d'avancement ; déterminer x<sub>max</sub> et le réactif limitant ; déterminer la composition de l'état final ; distinguer transformation totale et non totale (x<sub>f</sub> et x<sub>max</sub>) ; reconnaître un mélange stœchiométrique ; comprendre un programme Python de bilan de matière.
- **Sections** : 1. Décrire l'évolution d'un système (état initial, en cours, état final). 2. L'avancement et le tableau d'avancement. 3. Avancement maximal et réactif limitant (méthode des hypothèses ; n<sub>i</sub>/coefficient). 4. Composition de l'état final ; mélange stœchiométrique. 5. Transformations totales et non totales (taux d'avancement x<sub>f</sub>/x<sub>max</sub> présenté comme simple rapport, sans équilibre). 6. Un bilan de matière avec Python (principe d'un programme).
- **Figures** : graphique des quantités de matière en fonction de x (droites).

## Chapitre 5 : Le titrage colorimétrique

- **Notions** : N10, N11. **Capacités** : C28 à C32.
- **Objectifs** : distinguer dosage par étalonnage et titrage ; décrire le montage et le protocole d'un titrage direct ; définir l'équivalence (changement de réactif limitant, proportions stœchiométriques) ; écrire la relation à l'équivalence ; prévoir le changement de couleur (permanganate, diiode) ; exploiter un titrage pour calculer une concentration ou une masse, et un pourcentage massique.
- **Sections** : 1. Titrer : pourquoi et comment (réaction support : rapide, totale, unique). 2. Le montage et le protocole (burette, bécher, agitateur, prise d'essai, sécurité). 3. Avant, à et après l'équivalence (réactif limitant qui change). 4. Repérer l'équivalence par un changement de couleur. 5. Exploiter l'équivalence (n<sub>A</sub>/a = n<sub>B</sub>/b ; C<sub>A</sub>V<sub>A</sub>/a = C<sub>B</sub>V<sub>E</sub>/b). 6. Applications : contrôle qualité (eau oxygénée, vitamine C, ions fer dans un complément).
- **Figures** : montage de titrage légendé ; évolution des quantités de matière avec le volume versé.

## Chapitre 6 : Schéma de Lewis, géométrie et polarité

- **Notions** : N12, N13. **Capacités** : C33 à C37.
- **Objectifs** : établir le schéma de Lewis des entités de la liste du programme ; repérer doublets liants et non liants, lacune électronique, charge formelle simple d'un ion ; prévoir la géométrie (linéaire, coudée, pyramidale, tétraédrique, plane triangulaire) ; utiliser l'électronégativité et son évolution dans le tableau ; déterminer la polarité d'une liaison (charges partielles δ+ et δ−) et d'une molécule.
- **Sections** : 1. Rappels : électrons de valence, duet et octet. 2. Établir un schéma de Lewis (méthode : électrons de valence, doublets, octet). 3. Ions et lacune électronique (H<sup>+</sup>, H<sub>3</sub>O<sup>+</sup>, NH<sub>4</sub><sup>+</sup>, OH<sup>−</sup>, BH<sub>3</sub> comme exemple de lacune). 4. La géométrie des entités (répulsion des doublets, quatre « domaines » et leur disposition ; angles indicatifs). 5. L'électronégativité (échelle de Pauling, évolution). 6. Liaison polarisée et molécule polaire (barycentre des charges partielles ; CO<sub>2</sub> apolaire, H<sub>2</sub>O polaire).
- **Figures** : schémas de Lewis de H<sub>2</sub>O, CO<sub>2</sub>, NH<sub>3</sub> ; géométries ; tableau d'électronégativités.

## Chapitre 7 : Cohésion, dissolution et extraction

- **Notions** : N14 à N17. **Capacités** : C38 à C47.
- **Objectifs** : expliquer la cohésion d'un solide ionique et d'un solide moléculaire (interactions ioniques, de Van der Waals, pont hydrogène) ; expliquer la dissolution d'un solide ionique dans l'eau (dissociation, solvatation, hydratation) et écrire son équation ; calculer la concentration des ions ; prévoir solubilité et miscibilité ; interpréter un protocole d'extraction liquide-liquide (ampoule à décanter, densité) ; expliquer le caractère amphiphile d'un savon et ses propriétés lavantes.
- **Sections** : 1. La cohésion des solides ioniques. 2. La cohésion des solides moléculaires (Van der Waals, pont hydrogène ; températures de changement d'état). 3. La dissolution d'un solide ionique dans l'eau (trois étapes ; équation ; [ion] = coefficient × C). 4. Solubilité et miscibilité (« qui se ressemble s'assemble »). 5. L'extraction liquide-liquide (choix du solvant ; ampoule à décanter ; quelle phase en haut). 6. Savons et tensioactifs (tête hydrophile, chaîne lipophile ; micelles ; usages).
- **Figures** : ions hydratés autour de molécules d'eau ; ampoule à décanter ; micelle.

## Chapitre 8 : Structure et synthèse des espèces organiques

- **Notions** : N18 à N22. **Capacités** : C48 à C56.
- **Objectifs** : écrire formules brute, développée, semi-développée, et lire une formule topologique simple ; reconnaître les squelettes saturés (alcanes, linéaires ou ramifiés) ; identifier les groupes hydroxyle, carbonyle et carboxyle et les familles alcool, aldéhyde, cétone, acide carboxylique ; relier nom et formule (chaîne principale, numérotation, suffixes -ol, -al, -one, acide …-oïque) ; exploiter un spectre IR avec une table ; identifier les étapes d'une synthèse ; justifier les méthodes d'isolement, de purification et d'analyse ; calculer un rendement.
- **Sections** : 1. Les formules des molécules organiques. 2. Squelettes carbonés saturés et nomenclature des alcanes. 3. Groupes caractéristiques et familles. 4. Du nom à la formule. 5. La spectroscopie infrarouge (nombre d'onde, bandes O–H, C=O, C–H ; table). 6. Les étapes d'une synthèse (transformation : reflux ; isolement : filtration sous vide, extraction ; purification : recristallisation, distillation fractionnée, lavage ; analyse : CCM, température de fusion, IR). 7. Le rendement.
- **Figures** : montage à reflux ; spectre IR schématique ; formules semi-développées.

## Chapitre 9 : Combustions et énergie chimique

- **Notions** : N23 à N26. **Capacités** : C57 à C62.
- **Objectifs** : citer des combustibles usuels (fossiles, biosourcés) ; écrire l'équation de combustion complète d'un alcane et d'un alcool ; voir la combustion comme une oxydo-réduction ; définir énergie molaire de réaction et pouvoir calorifique massique ; estimer une énergie molaire de réaction à partir des énergies de liaison ; estimer un pouvoir calorifique par calorimétrie simple (Q = m c Δθ) ; citer risques (CO, incendie) et enjeux (CO<sub>2</sub>, biocarburants, méthanisation).
- **Sections** : 1. Les combustibles. 2. Équations de combustion complète (méthode d'ajustement C, H, O) ; combustion incomplète. 3. L'énergie libérée : énergie molaire de réaction, pouvoir calorifique, Q = n × |E<sub>r</sub>|. 4. Interprétation microscopique : ruptures et formations de liaisons, E<sub>r</sub> ≈ Σ E(rompues) − Σ E(formées). 5. Mesurer un pouvoir calorifique. 6. Combustions et société.
- **Figures** : diagramme énergétique (réactifs, atomes séparés, produits).

## Chapitre 10 : Interactions fondamentales et champs

- **Notions** : N27, N28. **Capacités** : C63 à C68.
- **Objectifs** : interpréter l'électrisation (frottement, contact, influence) ; utiliser la loi de Coulomb ; comparer avec la loi de gravitation (analogies et différences) ; utiliser les expressions vectorielles F = qE et F = mG ; définir un champ et ses lignes ; caractériser le champ électrostatique d'un condensateur plan (E = U/d) et le champ de gravitation de la Terre.
- **Sections** : 1. Charge électrique et électrisation. 2. La loi de Coulomb. 3. Gravitation et Coulomb : analogies. 4. La notion de champ (champ de gravitation, champ électrostatique ; lignes de champ ; champ uniforme). 5. Le champ électrostatique d'un condensateur plan. 6. Ordres de grandeur (atome d'hydrogène, rapport des forces).
- **Figures** : vecteurs forces entre deux charges ; lignes de champ d'une charge ponctuelle et d'un condensateur plan.

## Chapitre 11 : Le fluide au repos

- **Notions** : N29 à N32. **Capacités** : C69 à C74.
- **Objectifs** : décrire un fluide à l'échelle microscopique et macroscopique ; relier pression et chocs des entités, température et agitation ; utiliser F = P × S ; utiliser la loi de Mariotte (P × V = constante à température constante, quantité de gaz fixée) et ses limites ; utiliser la loi fondamentale de la statique des fluides ; convertir les unités de pression (Pa, hPa, bar).
- **Sections** : 1. Échelles de description d'un fluide. 2. Masse volumique, pression, température (interprétation microscopique). 3. La force pressante. 4. La loi de Mariotte. 5. La loi fondamentale de la statique des fluides (plongée, pression atmosphérique, vases communicants). 6. Mesurer une pression (manomètre, capteur, microcontrôleur).
- **Figures** : force pressante sur une paroi ; seringue et manomètre ; pression en fonction de la profondeur.

## Chapitre 12 : Mouvement et deuxième loi de Newton

- **Notions** : N33. **Capacités** : C75 à C78.
- **Objectifs** : rappeler système, référentiel, vecteur position et vecteur vitesse ; construire un vecteur variation de vitesse Δv⃗ = v⃗<sub>i+1</sub> − v⃗<sub>i</sub> ; utiliser la relation approchée m Δv⃗/Δt ≈ ΣF⃗ dans les deux sens ; discuter du rôle de la masse ; retrouver le principe d'inertie comme cas particulier ; étudier une chute libre et un mouvement circulaire ; comprendre un programme Python qui calcule des vecteurs vitesse.
- **Sections** : 1. Rappels de seconde. 2. Le vecteur vitesse à partir d'une chronophotographie (v<sub>i</sub> ≈ M<sub>i</sub>M<sub>i+1</sub>/Δt). 3. Le vecteur variation de vitesse (somme et différence de vecteurs). 4. La relation approchée entre Δv⃗ et ΣF⃗. 5. Le rôle de la masse. 6. Exemples : chute libre, mouvement circulaire uniforme, freinage. 7. Avec Python.
- **Figures** : chronophotographie avec vecteurs vitesse et vecteur variation de vitesse ; différence de vecteurs.

## Chapitre 13 : Aspects énergétiques des phénomènes électriques

- **Notions** : N34 à N36. **Capacités** : C79 à C84.
- **Objectifs** : identifier les porteurs de charge (électrons, ions) ; relier I = Q/Δt ; modéliser une source réelle (U = E − rI) et exploiter sa caractéristique ; expliquer les conséquences de r (chute de tension, échauffement, court-circuit) ; utiliser P = U × I, E = P × Δt et l'effet Joule (P = R I<sup>2</sup>) ; faire un bilan de puissance ; définir et calculer un rendement ; citer des ordres de grandeur de puissances.
- **Sections** : 1. Courant électrique et porteurs de charge. 2. Intensité et débit de charges. 3. Le modèle de la source réelle de tension. 4. Puissance et énergie électriques (unités, kWh). 5. L'effet Joule. 6. Bilan de puissance et rendement d'un convertisseur.
- **Figures** : modèle de Thévenin (source idéale et résistance) ; caractéristique U = f(I) d'une pile ; chaîne énergétique.

## Chapitre 14 : Aspects énergétiques des phénomènes mécaniques

- **Notions** : N37 à N40. **Capacités** : C85 à C95.
- **Objectifs** : calculer une énergie cinétique ; calculer le travail d'une force constante (produit scalaire, F × AB × cos α) ; reconnaître un travail moteur, résistant ou nul ; énoncer et utiliser le théorème de l'énergie cinétique ; établir E<sub>pp</sub> = m g z ; calculer le travail du poids et d'une force de frottement constante ; utiliser la conservation de l'énergie mécanique et sa variation égale au travail des forces non conservatives.
- **Sections** : 1. L'énergie cinétique. 2. Le travail d'une force constante (produit scalaire). 3. Le théorème de l'énergie cinétique. 4. Le travail du poids et l'énergie potentielle de pesanteur (forces conservatives). 5. Les frottements, forces non conservatives. 6. L'énergie mécanique : conservation et dissipation. 7. Exploiter des mesures (vidéo, Python).
- **Figures** : travail d'une force selon l'angle ; courbes E<sub>c</sub>, E<sub>pp</sub>, E<sub>m</sub> d'une chute.

## Chapitre 15 : Les ondes mécaniques

- **Notions** : N41 à N43. **Capacités** : C96 à C106.
- **Objectifs** : définir une onde mécanique progressive (transport d'énergie sans transport de matière) ; distinguer ondes transversales et longitudinales ; utiliser v = d/Δt et le retard τ ; localiser une source (séisme, écho) ; définir une onde périodique et sinusoïdale ; distinguer période T et longueur d'onde λ ; utiliser λ = v × T = v/f ; exploiter des représentations temporelles et spatiales.
- **Sections** : 1. Qu'est-ce qu'une onde mécanique progressive ? 2. Transversale ou longitudinale. 3. Célérité et retard. 4. Ondes périodiques et sinusoïdales. 5. La double périodicité : T et λ. 6. λ = v × T ; mesurer λ et v (deux microphones, échographie, sonar).
- **Figures** : corde à un instant (λ) ; signal en fonction du temps (T) ; deux capteurs décalés (retard).

## Chapitre 16 : Images et couleurs

- **Notions** : N44, N45. **Capacités** : C107 à C114.
- **Objectifs** : utiliser les grandeurs algébriques (OA, OA', OF') ; exploiter la relation de conjugaison 1/OA' − 1/OA = 1/OF' et le grandissement γ = A'B'/AB = OA'/OA ; caractériser une image (réelle ou virtuelle, droite ou renversée, agrandie ou réduite) ; construire une image ; estimer une distance focale ; vergence (C = 1/f') ; expliquer la mise au point (appareil photo, œil) ; synthèses additive et soustractive ; couleurs complémentaires ; couleur d'un objet selon l'éclairage (absorption, diffusion, transmission) ; filtres ; trichromie.
- **Sections** : 1. Rappels : lentille convergente, foyers, rayons particuliers. 2. Grandeurs algébriques et relation de conjugaison. 3. Le grandissement et les caractéristiques d'une image. 4. Image virtuelle : la loupe. 5. Mise au point (œil, appareil photo, lentilles à focale variable). 6. Synthèse additive et vision des couleurs (trichromie). 7. Synthèse soustractive, filtres et couleur des objets.
- **Figures** : construction d'une image réelle ; image virtuelle (loupe) ; disques de synthèse additive et soustractive.

## Chapitre 17 : Modèles ondulatoire et particulaire de la lumière

- **Notions** : N46, N47. **Capacités** : C115 à C119.
- **Objectifs** : situer les domaines des ondes électromagnétiques (radio, micro-ondes, IR, visible, UV, X, γ) ; utiliser λ = c/ν ; citer des ordres de grandeur (wifi 2,4 GHz, four à micro-ondes, radiographie) ; définir le photon et utiliser E = hν = hc/λ ; convertir J et eV ; décrire l'émission et l'absorption ; exploiter un diagramme de niveaux d'énergie (ΔE = hν) ; interpréter un spectre de raies.
- **Sections** : 1. La lumière, onde électromagnétique. 2. Le spectre électromagnétique et ses usages. 3. Le photon et son énergie. 4. Les niveaux d'énergie quantifiés de l'atome. 5. Émission et absorption : diagramme de niveaux. 6. Interpréter un spectre de raies (hydrogène, sodium, lampes spectrales).
- **Figures** : échelle des ondes électromagnétiques ; diagramme de niveaux d'énergie avec transitions.

---

## Table de correspondance

| Notions | Chapitre | Capacités |
| --- | --- | --- |
| N1 à N3 | 1 (repris dans 2, 5, 11, 13, 16) | C1 à C9 |
| N4 à N6 | 2 | C10 à C17 |
| N7 | 3 (repris dans 5, 9) | C18 à C20 |
| N8, N9 | 4 (repris dans 5, 8) | C21 à C27 |
| N10, N11 | 5 | C28 à C32 |
| N12, N13 | 6 (repris dans 7) | C33 à C37 |
| N14 à N17 | 7 (repris dans 8) | C38 à C47 |
| N18 à N22 | 8 | C48 à C56 |
| N23 à N26 | 9 | C57 à C62 |
| N27, N28 | 10 | C63 à C68 |
| N29 à N32 | 11 | C69 à C74 |
| N33 | 12 (repris dans 14) | C75 à C78 |
| N34 à N36 | 13 | C79 à C84 |
| N37 à N40 | 14 | C85 à C95 |
| N41 à N43 | 15 | C96 à C106 |
| N44, N45 | 16 | C107 à C114 |
| N46, N47 | 17 | C115 à C119 |

**Bilan** : 47 notions sur 47 et 119 capacités sur 119 ont un chapitre. Aucun chapitre ne sort du programme ; les rappels de seconde sont présentés comme tels.

## Points à trancher par l'enseignant

1. **Nombre de chapitres** : 17. Regroupements possibles : 3 et 4 (oxydo-réduction et avancement), 4 et 5 (avancement et titrage), 10 et 11, 16 et 17.
2. **Évaluation de type B** (chapitre 1) : le programme ne fixe pas de formule. Le cours retient u = (demi-graduation)/√3 pour une lecture simple sur une graduation, et la tolérance/√3 pour la verrerie et les appareils dont le constructeur donne une précision ; d'autres manuels utilisent 1 graduation/√12 (même résultat) ou 2 lectures. À aligner sur le manuel.
3. **Volume molaire** : 24,0 L·mol<sup>−1</sup> à 20 °C (cours) ; certains manuels prennent 24 ou 22,4 L·mol<sup>−1</sup>. Les questions donnent toujours la valeur à utiliser.
4. **Relation approchée de Newton** (chapitre 12) : écrite m × Δv⃗/Δt ≈ ΣF⃗, avec Δv⃗ calculé entre deux points voisins (v⃗<sub>i+1</sub> − v⃗<sub>i−1</sub> ou v⃗<sub>i+1</sub> − v⃗<sub>i</sub> selon les manuels) ; le cours précise la convention utilisée.
5. **Liste des entités de Lewis** : l'extraction du PDF officiel est partiellement illisible pour cette liste ; le cours suit la liste usuelle des manuels (H₂, O₂, N₂, H₂O, CO₂, NH₃, CH₄, HCl, H⁺, H₃O⁺, Na⁺, NH₄⁺, Cl⁻, OH⁻, O²⁻).
6. **Figures** : schémas SVG simples, à vérifier visuellement dans l'application (rendu et contraste en thème sombre).
