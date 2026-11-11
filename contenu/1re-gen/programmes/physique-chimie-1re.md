# Programme officiel : physique-chimie, enseignement de spécialité de première générale

## Référence

- **Texte** : annexe « Programme de physique-chimie de première générale » de l'arrêté du 17 janvier 2019 fixant le programme d'enseignement de spécialité de physique-chimie de la classe de première de la voie générale, **NOR MENE1901635A**, JO du 20 janvier 2019, **BO spécial n° 1 du 22 janvier 2019**.
- **Horaire** : 4 heures hebdomadaires (enseignement de spécialité).
- **Application** : depuis la rentrée 2019.
- **En vigueur pour 2026-2027** : oui. Recherche faite le 11 novembre 2026 : la page Éduscol « Programmes et ressources en physique-chimie – voie GT » renvoie toujours à ce texte, et aucun arrêté de 2025 ou de 2026 ne le remplace ni ne le modifie. Les nouveaux textes de 2025-2026 concernent d'autres disciplines (langues vivantes : BO du 29 mai 2025 ; mathématiques : arrêtés du 26 février 2026, BO n° 14 du 2 avril 2026). L'arrêté du 17 juillet 2019 (BO spécial n° 8 du 25 juillet 2019) ajoute le programme de terminale, sans toucher à celui de première.
- **Source lue** : annexe PDF publiée sur education.gouv.fr (« Programme de physique-chimie de première générale »), texte extrait le 11 novembre 2026.

Ce résumé reprend fidèlement les notions et les capacités exigibles. Les notions portent un code [N…] et les capacités un code [C…] ; le plan (`physique-chimie-1re-plan.md`) s'y réfère. Les capacités expérimentales sont reprises à la fin.

## Préambule

- Continuité avec la seconde ; place centrale de la **démarche de modélisation** et de la **pratique expérimentale**.
- Quatre thèmes : « Constitution et transformations de la matière », « Mouvement et interactions », « L'énergie : conversions et transferts », « Ondes et signaux ». L'ordre de mise en œuvre relève de la liberté pédagogique du professeur.
- Compétences de la démarche scientifique : s'approprier, analyser/raisonner, réaliser, valider, communiquer. Développement de l'oral (préparation de l'épreuve orale terminale pour ceux qui poursuivent la spécialité).
- Langage de programmation conseillé : Python. Capacités mathématiques : proportionnalité, grandeurs quotient, puissances de dix, fonctions, vecteurs.

## Mesure et incertitudes

En complément de la seconde : **évaluation de type B** d'une incertitude-type (mesure unique avec un instrument dont les caractéristiques sont données). La comparaison à une valeur de référence reste **qualitative** (critère quantitatif en terminale) ; les incertitudes composées sont vues en terminale.

| Code | Notions et contenus | Capacités exigibles |
| --- | --- | --- |
| N1 | Variabilité de la mesure d'une grandeur physique | C1 Exploiter une série de mesures indépendantes : histogramme, moyenne, écart-type. C2 Discuter de l'influence de l'instrument et du protocole. C3 Évaluer qualitativement la dispersion d'une série de mesures indépendantes. C4 (numérique) Représenter l'histogramme d'une série de mesures avec un tableur. |
| N2 | Incertitude-type | C5 Définir qualitativement une incertitude-type. C6 Évaluer une incertitude-type par une approche statistique (type A). C7 Évaluer une incertitude-type par une autre approche que statistique (type B). |
| N3 | Écriture du résultat. Valeur de référence | C8 Écrire le résultat d'une mesure avec un nombre adapté de chiffres significatifs. C9 Comparer qualitativement un résultat à une valeur de référence. |

## Thème 1 : Constitution et transformations de la matière

### 1. Suivi de l'évolution d'un système, siège d'une transformation

Masse molaire, volume molaire, concentration en quantité de matière (mol·L⁻¹) ; bilans de matière complets avec l'**avancement** (en mol) ; transformations totales et non totales (comparaison de l'avancement final et de l'avancement maximal, **sans** référence à l'équilibre chimique) ; oxydo-réduction, réinvestie dans les titrages. Exemples : combustion, corrosion, détartrage, contrôle qualité, analyses biologiques, surveillance environnementale.

Notions de seconde : quantité de matière, mole, solution, concentration en masse, dosage par étalonnage, équation de réaction, réactif limitant.

**A) Composition du système initial à l'aide de grandeurs physiques**

| Code | Notions et contenus | Capacités exigibles |
| --- | --- | --- |
| N4 | Relation entre masse molaire d'une espèce, masse des entités et constante d'Avogadro. Masse molaire atomique d'un élément. Volume molaire d'un gaz | C10 Déterminer la masse molaire d'une espèce à partir des masses molaires atomiques. C11 Déterminer la quantité de matière d'un échantillon de corps pur à partir de sa masse et du tableau périodique. C12 Utiliser le volume molaire d'un gaz pour déterminer une quantité de matière. C13 Déterminer la quantité de matière de chaque espèce d'un mélange (liquide ou solide) à partir de sa composition. |
| N5 | Concentration en quantité de matière | C14 Déterminer la quantité de matière d'un soluté à partir de sa concentration en masse ou en quantité de matière et du volume de solution. |
| N6 | Absorbance, spectre d'absorption, couleur d'une espèce en solution, loi de Beer-Lambert | C15 Expliquer ou prévoir la couleur d'une espèce en solution à partir de son spectre UV-visible. C16 Déterminer la concentration d'un soluté à partir de mesures d'absorbance de solutions de concentrations connues. C17 (expérimental) Réaliser une gamme étalon et déterminer la concentration d'une espèce colorée par des mesures d'absorbance ; tester les limites du protocole. |

**B) Suivi et modélisation de l'évolution d'un système chimique**

| Code | Notions et contenus | Capacités exigibles |
| --- | --- | --- |
| N7 | Transformation modélisée par une réaction d'oxydo-réduction : oxydant, réducteur, couple oxydant-réducteur, demi-équation électronique | C18 À partir de données expérimentales, identifier le transfert d'électrons entre deux réactifs et le modéliser par des demi-équations et une réaction d'oxydo-réduction. C19 Établir l'équation de la réaction entre un oxydant et un réducteur, les couples étant donnés. C20 (expérimental) Mettre en œuvre des transformations d'oxydo-réduction. |
| N8 | Évolution des quantités de matière. État initial, avancement (mol), tableau d'avancement, état final | C21 Décrire qualitativement l'évolution des quantités de matière lors d'une transformation. C22 Établir le tableau d'avancement à partir de l'équation et des quantités initiales. |
| N9 | Avancement final, avancement maximal. Transformations totale et non totale. Mélanges stœchiométriques | C23 Déterminer la composition de l'état final pour une transformation totale. C24 Déterminer l'avancement final à partir de la description de l'état final et le comparer à l'avancement maximal. C25 Déterminer la composition de l'état final et l'avancement final. C26 (numérique) Déterminer la composition de l'état final d'une transformation totale avec un langage de programmation. C27 (mathématique) Utiliser une équation linéaire du premier degré. |

**C) Détermination d'une quantité de matière grâce à une transformation chimique**

| Code | Notions et contenus | Capacités exigibles |
| --- | --- | --- |
| N10 | Titrage avec suivi colorimétrique. Réaction d'oxydo-réduction support du titrage ; changement de réactif limitant au cours du titrage | C28 Relier qualitativement l'évolution des quantités de matière à l'état final au volume de solution titrante ajouté. |
| N11 | Définition et repérage de l'équivalence | C29 Relier l'équivalence au changement de réactif limitant et à l'introduction des réactifs en proportions stœchiométriques. C30 Établir la relation entre les quantités de matière de réactifs introduites à l'équivalence. C31 Expliquer ou prévoir le changement de couleur à l'équivalence d'un titrage mettant en jeu une espèce colorée. C32 (expérimental) Réaliser un titrage direct avec repérage colorimétrique de l'équivalence. |

### 2. De la structure des entités aux propriétés physiques de la matière

Le schéma de Lewis devient **exigible** ; il conduit à la géométrie des entités, qui, avec l'électronégativité, donne le caractère polaire ou non. Cohésion des solides et des liquides : interactions entre entités, dont le pont hydrogène ; réinvestissement pour la dissolution et l'extraction liquide-liquide.

Notions de seconde : tableau périodique, configuration électronique, électrons de valence, stabilité des gaz nobles, ions monoatomiques, liaison covalente, lecture de schémas de Lewis, solubilité.

**A) De la structure à la polarité d'une entité**

| Code | Notions et contenus | Capacités exigibles |
| --- | --- | --- |
| N12 | Schéma de Lewis d'une molécule, d'un ion mono ou polyatomique. Lacune électronique. Géométrie des entités | C33 Établir le schéma de Lewis de molécules et d'ions à partir du tableau périodique : H₂, O₂, N₂, H₂O, CO₂, NH₃, CH₄, HCl, H⁺, H₃O⁺, Na⁺, NH₄⁺, Cl⁻, OH⁻, O²⁻ (liste du texte officiel, dont l'extraction du PDF est partiellement illisible ; liste usuelle des manuels). C34 Interpréter la géométrie d'une entité à partir de son schéma de Lewis. C35 Utiliser des modèles moléculaires ou des logiciels pour visualiser la géométrie d'une entité. |
| N13 | Électronégativité des atomes, évolution dans le tableau périodique. Polarisation d'une liaison covalente, polarité d'une entité moléculaire | C36 Déterminer le caractère polaire d'une liaison à partir des électronégativités. C37 Déterminer le caractère polaire ou apolaire d'une entité moléculaire à partir de sa géométrie et de la polarité de ses liaisons. |

**B) De la structure des entités à la cohésion et à la solubilité/miscibilité**

| Code | Notions et contenus | Capacités exigibles |
| --- | --- | --- |
| N14 | Cohésion dans un solide. Interactions entre ions, entre entités polaires, entre entités apolaires et/ou par pont hydrogène | C38 Expliquer la cohésion des solides ioniques et moléculaires par l'analyse des interactions entre entités. |
| N15 | Dissolution des solides ioniques dans l'eau. Équation de réaction de dissolution | C39 Expliquer la capacité de l'eau à dissocier une espèce ionique et à solvater les ions. C40 Modéliser la dissolution d'un composé ionique par une équation avec les notations (s) et (aq). C41 Calculer la concentration des ions dans la solution obtenue. |
| N16 | Extraction par un solvant. Solubilité dans un solvant. Miscibilité de deux liquides | C42 Expliquer ou prévoir la solubilité d'une espèce dans un solvant par l'analyse des interactions. C43 Comparer la solubilité d'une espèce solide dans différents solvants. C44 Interpréter un protocole d'extraction liquide-liquide à partir des solubilités dans les deux solvants. C45 (expérimental) Choisir un solvant et réaliser une extraction liquide-liquide. |
| N17 | Hydrophilie, lipophilie, amphiphilie d'une espèce organique | C46 Expliquer le caractère amphiphile et les propriétés lavantes d'un savon à partir de la formule semi-développée de ses entités ; citer des applications usuelles de tensioactifs. C47 (expérimental) Illustrer les propriétés des savons. |

### 3. Propriétés physico-chimiques, synthèses et combustions d'espèces chimiques organiques

Première approche de la chimie organique : chaînes carbonées, groupes caractéristiques, familles. Nomenclature : seulement justifier la relation entre nom et formule semi-développée de molécules à **un seul** groupe caractéristique. Synthèse : rendement ; synthèse d'un solide et d'un liquide recommandée (ester et savon). Énergie des combustions reliée aux ruptures et formations de liaisons. Enjeux : médicaments, eau comme solvant, combustibles fossiles et agro-sourcés, méthanisation.

Notions de seconde : synthèse d'une espèce existant dans la nature, montage à reflux, CCM, combustions, transformations exothermiques et endothermiques.

**A) Structure des entités organiques**

| Code | Notions et contenus | Capacités exigibles |
| --- | --- | --- |
| N18 | Formules brutes et semi-développées. Squelettes carbonés saturés, groupes caractéristiques et familles fonctionnelles | C48 Identifier, à partir d'une formule semi-développée, les groupes caractéristiques des familles alcool, aldéhyde, cétone et acide carboxylique. |
| N19 | Lien entre le nom et la formule semi-développée | C49 Justifier le nom associé à la formule semi-développée de molécules simples à un seul groupe caractéristique, et inversement. |
| N20 | Identification des groupes caractéristiques par spectroscopie infrarouge | C50 Exploiter, à partir de valeurs de référence, un spectre d'absorption infrarouge. C51 Utiliser des modèles moléculaires ou des logiciels pour visualiser la géométrie de molécules organiques. |

**B) Synthèses d'espèces chimiques organiques**

| Code | Notions et contenus | Capacités exigibles |
| --- | --- | --- |
| N21 | Étapes d'un protocole | C52 Identifier dans un protocole les étapes de transformation, d'isolement, de purification et d'analyse (identification, pureté). C53 Justifier, à partir des propriétés physico-chimiques des réactifs et des produits, le choix des méthodes d'isolement, de purification ou d'analyse. |
| N22 | Rendement d'une synthèse | C54 Déterminer le rendement d'une synthèse à partir d'un protocole et de données expérimentales. C55 Schématiser et légender les dispositifs des étapes d'une synthèse. C56 (expérimental) Réaliser un montage à reflux ; isoler, purifier et analyser un produit. |

**C) Conversion de l'énergie stockée dans la matière organique**

| Code | Notions et contenus | Capacités exigibles |
| --- | --- | --- |
| N23 | Combustibles organiques usuels | C57 Citer des exemples de combustibles usuels. |
| N24 | Modélisation d'une combustion par une réaction d'oxydo-réduction | C58 Écrire l'équation de combustion complète d'un alcane et d'un alcool. |
| N25 | Énergie molaire de réaction, pouvoir calorifique massique, énergie libérée lors d'une combustion. Interprétation microscopique en phase gazeuse : modification des structures, énergie de liaison | C59 Estimer l'énergie molaire de réaction d'une transformation en phase gazeuse à partir des énergies de liaison. C60 (expérimental) Estimer le pouvoir calorifique d'un combustible. |
| N26 | Combustions et enjeux de société | C61 Citer des applications usuelles des combustions et leurs risques. C62 Citer des axes d'étude actuels dans une perspective de développement durable. |

## Thème 2 : Mouvement et interactions

Modèles d'interaction ; interactions gravitationnelle et électrostatique comme première approche de la notion de **champ** ; fluide au repos et forces pressantes ; lien quantitatif entre force et variation de vitesse par une **formulation approchée de la deuxième loi de Newton**, puis point de vue énergétique (thème 3). Outils : vidéo, chronophotographie, smartphone, simulation, programmation.

Notions de seconde : référentiel, vecteur position, vecteur vitesse, variation du vecteur vitesse, exemples de forces, principe d'inertie, charge élémentaire.

| Code | Notions et contenus | Capacités exigibles |
| --- | --- | --- |
| N27 | Charge électrique, interaction électrostatique, influence électrostatique. Loi de Coulomb | C63 Interpréter des expériences mettant en jeu l'interaction électrostatique. C64 Utiliser la loi de Coulomb. C65 Citer les analogies entre la loi de Coulomb et la loi d'interaction gravitationnelle. |
| N28 | Force de gravitation et champ de gravitation. Force électrostatique et champ électrostatique | C66 Utiliser les expressions vectorielles de la force de gravitation et du champ de gravitation, de la force électrostatique et du champ électrostatique. C67 Caractériser localement une ligne de champ électrostatique ou de champ de gravitation. C68 (expérimental) Illustrer l'interaction électrostatique ; cartographier un champ électrostatique. |
| N29 | Échelles de description. Grandeurs macroscopiques d'un fluide au repos : masse volumique, pression, température | C69 Expliquer qualitativement le lien entre les grandeurs macroscopiques d'un fluide et le comportement microscopique de ses entités. |
| N30 | Modèle de comportement d'un gaz : loi de Mariotte | C70 Utiliser la loi de Mariotte. C71 (expérimental) Tester la loi de Mariotte, par exemple avec un microcontrôleur. |
| N31 | Actions exercées par un fluide sur une surface : forces pressantes | C72 Exploiter F = P·S pour la force pressante exercée par un fluide sur une surface plane. |
| N32 | Loi fondamentale de la statique des fluides | C73 Pour un fluide incompressible au repos, utiliser la relation fournie P₂ − P₁ = ρg(z₁ − z₂). C74 (expérimental) Tester la loi fondamentale de la statique des fluides. |
| N33 | Vecteur variation de vitesse. Lien entre la variation du vecteur vitesse d'un point matériel entre deux instants voisins et la somme des forces. Rôle de la masse | C75 Utiliser la relation approchée m·Δv⃗/Δt ≈ ΣF⃗ pour estimer la variation de vitesse, les forces étant connues, ou pour estimer les forces, le mouvement étant connu. C76 (expérimental) Construire les vecteurs variation de vitesse sur une vidéo ou une chronophotographie ; tester la relation. C77 (numérique) Étudier cette relation avec un langage de programmation. C78 (mathématique) Sommer et soustraire des vecteurs. |

## Thème 3 : L'énergie : conversions et transferts

### 1. Aspects énergétiques des phénomènes électriques

Dipôles simples pour modéliser générateurs (dont les piles) et capteurs ; bilans énergétiques sans confondre électricité et énergie ; efficacité d'une conversion.

Notions antérieures : énergie, puissance, relation puissance-énergie, conversions, tension, intensité, caractéristique, loi d'Ohm, capteurs.

| Code | Notions et contenus | Capacités exigibles |
| --- | --- | --- |
| N34 | Porteur de charge électrique. Lien entre intensité d'un courant continu et débit de charges | C79 Relier intensité d'un courant continu et débit de charges. |
| N35 | Modèle d'une source réelle de tension continue : source idéale en série avec une résistance | C80 Expliquer des conséquences pratiques de la résistance dans le modèle d'une source réelle. C81 Déterminer la caractéristique d'une source réelle et la modéliser par une source idéale associée à une résistance. |
| N36 | Puissance et énergie. Bilan de puissance dans un circuit. Effet Joule ; cas des dipôles ohmiques. Rendement d'un convertisseur | C82 Citer des ordres de grandeur de puissances fournies ou consommées par des dispositifs courants. C83 Définir le rendement d'un convertisseur. C84 Évaluer le rendement d'un dispositif. |

### 2. Aspects énergétiques des phénomènes mécaniques

Travail des forces comme transfert d'énergie ; théorème de l'énergie cinétique ; énergie potentielle et énergie mécanique ; conservation ou non, phénomènes dissipatifs.

Notions de collège : énergie cinétique, énergie potentielle, bilan énergétique, conversions.

| Code | Notions et contenus | Capacités exigibles |
| --- | --- | --- |
| N37 | Énergie cinétique d'un point matériel. Travail d'une force ; cas d'une force constante. Théorème de l'énergie cinétique | C85 Utiliser l'expression de l'énergie cinétique. C86 Utiliser W_AB(F⃗) = F⃗·AB⃗ pour des forces constantes. C87 Énoncer et exploiter le théorème de l'énergie cinétique. |
| N38 | Forces conservatives. Énergie potentielle. Cas du champ de pesanteur terrestre | C88 Établir et utiliser l'expression de l'énergie potentielle de pesanteur au voisinage de la Terre. |
| N39 | Forces non conservatives : exemple des frottements | C89 Calculer le travail d'une force de frottement d'intensité constante sur une trajectoire rectiligne. |
| N40 | Énergie mécanique. Conservation et non-conservation. Gain ou dissipation d'énergie | C90 Identifier des situations de conservation et de non-conservation de l'énergie mécanique. C91 Exploiter la conservation de l'énergie mécanique dans des cas simples (chute libre, pendule, sans frottement). C92 Utiliser la variation de l'énergie mécanique pour déterminer le travail des forces non conservatives. C93 (expérimental) Étudier l'évolution des énergies cinétique, potentielle et mécanique (chute, rebond, pendule). C94 (numérique) Effectuer le bilan énergétique d'un système en mouvement avec un langage de programmation. C95 (mathématique) Utiliser le produit scalaire de deux vecteurs. |

## Thème 4 : Ondes et signaux

### 1. Ondes mécaniques

Double périodicité, longueur d'onde (dépend de la source et du milieu). Applications : musique, médecine, échographie, géophysique, audiométrie.

Notions de seconde : signal sonore, propagation, vitesse, fréquence, période.

| Code | Notions et contenus | Capacités exigibles |
| --- | --- | --- |
| N41 | Onde mécanique progressive. Grandeurs physiques associées | C96 Décrire la propagation d'une perturbation mécanique dans l'espace et au cours du temps (houle, ondes sismiques, ondes sonores). C97 Expliquer avec un modèle qualitatif la propagation d'une perturbation dans un milieu matériel. C98 (expérimental) Produire une perturbation et visualiser sa propagation (son, corde, ressort, surface de l'eau). |
| N42 | Célérité d'une onde. Retard | C99 Exploiter la relation entre durée de propagation, distance parcourue et célérité, notamment pour localiser une source. C100 (expérimental) Déterminer une distance ou une célérité (microcontrôleur, smartphone) ; illustrer l'influence du milieu sur la célérité. |
| N43 | Ondes mécaniques périodiques. Ondes sinusoïdales. Période. Longueur d'onde. Relation entre période, longueur d'onde et célérité | C101 Distinguer périodicité spatiale et périodicité temporelle. C102 Justifier et exploiter la relation entre période, longueur d'onde et célérité. C103 Déterminer les caractéristiques d'une onde périodique à partir de représentations spatiales ou temporelles. C104 (expérimental) Déterminer période, longueur d'onde et célérité avec une chaîne de mesure. C105 (numérique) Représenter un signal périodique et l'influence de ses caractéristiques ; simuler la propagation d'une onde périodique. C106 (mathématique) Utiliser les représentations graphiques des fonctions sinus et cosinus. |

### 2. La lumière : images et couleurs, modèles ondulatoire et particulaire

Relations algébriques de la lentille mince convergente ; deux modèles de la lumière (ondulatoire et particulaire), approfondis en terminale.

Notions de seconde : lentille mince convergente, image réelle d'un objet réel, distance focale, grandissement, dispersion, spectres, longueur d'onde.

**A) Images et couleurs**

| Code | Notions et contenus | Capacités exigibles |
| --- | --- | --- |
| N44 | Relation de conjugaison d'une lentille mince convergente. Grandissement. Image réelle, image virtuelle, image droite, image renversée | C107 Exploiter les relations de conjugaison et de grandissement fournies pour déterminer la position et la taille de l'image d'un objet-plan réel. C108 Déterminer les caractéristiques de l'image d'un objet-plan réel. C109 (expérimental) Estimer la distance focale ; tester la relation de conjugaison ; réaliser une mise au point en modifiant la distance focale ou la géométrie du montage. C110 (mathématique) Utiliser le théorème de Thalès et des grandeurs algébriques. |
| N45 | Couleur blanche, couleurs complémentaires. Couleur des objets. Synthèse additive, synthèse soustractive. Absorption, diffusion, transmission. Vision des couleurs et trichromie | C111 Choisir le modèle de la synthèse additive ou soustractive selon la situation. C112 Interpréter la couleur perçue d'un objet à partir de la lumière incidente et des phénomènes d'absorption, de diffusion et de transmission. C113 Prévoir le résultat de la superposition de lumières colorées et l'effet de filtres colorés. C114 (expérimental) Illustrer synthèse additive, synthèse soustractive et couleur des objets. |

**B) Modèles ondulatoire et particulaire de la lumière**

| Code | Notions et contenus | Capacités exigibles |
| --- | --- | --- |
| N46 | Domaines des ondes électromagnétiques. Relation entre longueur d'onde, célérité de la lumière et fréquence | C115 Utiliser une échelle de fréquences ou de longueurs d'onde pour identifier un domaine spectral. C116 Citer l'ordre de grandeur des fréquences ou longueurs d'onde des ondes électromagnétiques de divers domaines (imagerie médicale, visible, wifi, micro-ondes). |
| N47 | Le photon. Énergie d'un photon. Interaction lumière-matière : absorption et émission. Quantification des niveaux d'énergie des atomes | C117 Utiliser l'expression de l'énergie d'un photon. C118 Exploiter un diagramme de niveaux d'énergie avec λ = c/ν et ΔE = hν. C119 (expérimental) Obtenir le spectre d'une source spectrale et l'interpréter avec le diagramme de niveaux d'énergie. |

## Capacités expérimentales (liste du programme)

Communes : respecter les règles de sécurité au laboratoire ; mettre en œuvre un logiciel de simulation et de traitement des données.

- **Matière** : préparer une solution par dissolution ou dilution ; réaliser un spectre d'absorption UV-visible ; mesurer une absorbance avec une notice ; test de reconnaissance ; titrage direct avec repérage colorimétrique ; modèles moléculaires et logiciels de visualisation ; extraction liquide-liquide à partir de solubilités et de miscibilités ; chauffage à reflux et distillation fractionnée ; filtration, lavage ; CCM ; estimer une température de changement d'état ; sécurité des produits et de la verrerie ; élimination des déchets.
- **Mouvement et interactions** : illustrer l'interaction électrostatique ; repérer la direction du champ électrique ; mesurer une pression dans un gaz et dans un liquide ; collecter des données sur un mouvement (vidéo, chronophotographie).
- **Énergie** : multimètre et calibre ; montage selon un schéma normalisé ; mesurer et traiter un signal avec une interface ou un microcontrôleur ; commander la production d'un signal avec un microcontrôleur ; estimer une énergie transférée électriquement ou mécaniquement ; sécurité électrique.
- **Ondes et signaux** : illustrer la propagation d'une perturbation ; collecter des données sur cette propagation ; mesurer période, longueur d'onde, célérité ; estimer une distance focale ; visualiser l'image d'un objet avec une lentille ; illustrer synthèses additive et soustractive ; montrer que la couleur apparente dépend de la source ; obtenir un spectre d'émission ; sécurité des sources lumineuses.
