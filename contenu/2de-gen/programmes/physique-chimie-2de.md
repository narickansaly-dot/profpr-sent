# Programme officiel : physique-chimie, classe de seconde générale et technologique

## Référence

- **Texte** : arrêté du 17 janvier 2019, « Programme de l'enseignement de physique-chimie de la classe de seconde générale et technologique », NOR : MENE1901634A, J.O. du 20 janvier 2019. Article 2 : « Les dispositions du présent arrêté entrent en vigueur à la rentrée scolaire 2019. »
- **Bulletin officiel** : Bulletin officiel spécial n° 1 du 22 janvier 2019.
- **Page du BO** (lue dans un navigateur ; elle refuse les requêtes automatiques, réponse HTTP 403) : https://www.education.gouv.fr/bo/19/Special1/MENE1901634A.htm
- **URL de l'annexe (PDF, 13 pages, 469 712 octets)**, liée depuis la page du BO : https://cache.media.education.gouv.fr/file/SP1-MEN-22-1-2019/98/9/spe634_annexe_1062989.pdf
- **Même fichier sur Éduscol** (identique octet pour octet, SHA-1 `aa8d3a1669dcee5f0eaef831bc6d4f8a07f14560`) : https://eduscol.education.fr/document/22663/download
- **Date de récupération** : 10 novembre 2026.
- **Version en vigueur pour 2026-2027** (vérifiée le 10 novembre 2026) : la page Éduscol « Programmes et ressources en physique-chimie - voie GT » (https://eduscol.education.gouv.fr/5829/programmes-et-ressources-en-physique-chimie-voie-gt, mise à jour en mars 2026) range toujours, sous « Programmes en vigueur », le programme de « Seconde générale et technologique (BO spécial n° 1 du 22 janvier 2019) ». Une recherche sur education.gouv.fr n'a trouvé aucun arrêté plus récent qui remplace ou modifie ce programme ; seul un projet de programme de physique-chimie du **cycle 4** (collège), daté de juillet 2025, est paru. Le programme de 2019 est donc celui qui s'applique, sans changement à signaler.

Le texte ci-dessous reprend fidèlement l'annexe pour la structure, les notions et contenus, et les capacités. Ajouts, qui ne figurent pas dans le texte officiel : les codes entre crochets (`[N…]` pour les notions et contenus, `[C…]` pour les capacités), qui servent à la table de correspondance du plan ; les titres « Partie 0 » à « Partie 3 ».

Règles de transcription :

- **Notions et contenus** : chaque phrase (ou groupe nominal terminé par un point) de la colonne « Notions et contenus » donne une notion. Une énumération séparée par des virgules est gardée entière quand elle forme un seul intitulé du texte (par exemple « Espèce chimique, corps pur, mélanges d'espèces chimiques, mélanges homogènes et hétérogènes »). Quelques phrases courtes et liées sont gardées ensemble (« Écriture du résultat. Valeur de référence. »). Le total de 81 notions dépend de cette règle : un autre découpage donnerait un autre total, sans changer le contenu couvert.
- **Capacités** : dans le texte officiel, la deuxième colonne réunit les « Capacités exigibles » et les « Activités expérimentales support de la formation », ainsi que des « capacités mathématiques » et « capacités numériques ». Le PDF les distingue par la mise en forme, que l'extraction du texte ne conserve pas. Elles sont donc listées ensemble, dans l'ordre du texte, avec la mention « Capacité mathématique » ou « Capacité numérique » quand le texte la donne.
- Les exposants et indices du PDF (g.L<sup>-1</sup>, 10<sup>23</sup>, O<sub>2</sub>, charges des ions) sont rétablis.

## Organisation générale

Extraits du préambule (texte officiel) :

> Dans la continuité du collège, le programme de physique-chimie de la classe de seconde vise à faire pratiquer les méthodes et démarches de ces deux sciences en mettant particulièrement en avant la pratique expérimentale et l'activité de modélisation.

> Ainsi, le programme de seconde est-il structuré autour de trois de ces thèmes : « Constitution et transformations de la matière », « Mouvement et interactions » et « Ondes et signaux ». Le quatrième, « L'énergie : conversions et transferts », est abordé dans le cadre de l'étude des transformations de la matière.

> La présentation du programme n'impose pas l'ordre de sa mise en œuvre par le professeur, laquelle relève de sa liberté pédagogique.

Le langage de programmation conseillé est Python.

### Les compétences de la démarche scientifique

| Compétence | Quelques exemples de capacités associées (texte officiel) |
| --- | --- |
| S'approprier | Énoncer une problématique. Rechercher et organiser l'information en lien avec la problématique étudiée. Représenter la situation par un schéma. |
| Analyser / Raisonner | Formuler des hypothèses. Proposer une stratégie de résolution. Planifier des tâches. Évaluer des ordres de grandeur. Choisir un modèle ou des lois pertinentes. Choisir, élaborer, justifier un protocole. Faire des prévisions à l'aide d'un modèle. Procéder à des analogies. |
| Réaliser | Mettre en œuvre les étapes d'une démarche. Utiliser un modèle. Effectuer des procédures courantes (calculs, représentations, collectes de données, etc.). Mettre en œuvre un protocole expérimental en respectant les règles de sécurité. |
| Valider | Faire preuve d'esprit critique, procéder à des tests de vraisemblance. Identifier des sources d'erreur, estimer une incertitude, comparer à une valeur de référence. Confronter un modèle à des résultats expérimentaux. Proposer d'éventuelles améliorations de la démarche ou du modèle. |
| Communiquer | À l'écrit comme à l'oral : présenter une démarche de manière argumentée, synthétique et cohérente ; utiliser un vocabulaire adapté et choisir des modes de représentation appropriés ; échanger entre pairs. |

Le préambule cite aussi : la finalité et le fonctionnement de la physique-chimie, des questions civiques (responsabilité individuelle et collective, sécurité pour soi et pour autrui), l'éducation à l'environnement et au développement durable, la mise en perspective avec l'histoire des sciences et l'actualité scientifique.

---

## Partie 0 : Mesure et incertitudes (préambule)

> En classe de seconde, l'objectif principal est de sensibiliser l'élève, à partir d'exemples simples et démonstratifs, à la variabilité des valeurs obtenues dans le cadre d'une série de mesures indépendantes d'une grandeur physique. L'incertitude-type fournit alors une estimation de l'étendue des valeurs que l'on peut raisonnablement attribuer à la grandeur physique.

> Lorsque cela est pertinent, la valeur mesurée sera comparée avec une valeur de référence afin de conclure qualitativement à la compatibilité ou à la non-compatibilité entre ces deux valeurs.

Notions et contenus :

- [N1] Variabilité de la mesure d'une grandeur physique.
- [N2] Incertitude-type.
- [N3] Écriture du résultat. Valeur de référence.

Capacités exigibles :

- [C1] Exploiter une série de mesures indépendantes d'une grandeur physique : histogramme, moyenne et écart-type.
- [C2] Discuter de l'influence de l'instrument de mesure et du protocole.
- [C3] Évaluer qualitativement la dispersion d'une série de mesures indépendantes.
- [C4] Capacité numérique : représenter l'histogramme associé à une série de mesures à l'aide d'un tableur.
- [C5] Expliquer qualitativement la signification d'une incertitude-type et l'évaluer par une approche statistique.
- [C6] Écrire, avec un nombre adapté de chiffres significatifs, le résultat d'une mesure.
- [C7] Comparer qualitativement un résultat à une valeur de référence.

---

## Partie 1 : Constitution et transformations de la matière

### 1. Constitution de la matière de l'échelle macroscopique à l'échelle microscopique

> L'espèce chimique est au centre de la description macroscopique de la matière et permet de définir et de caractériser les corps purs et les mélanges, dont les solutions aqueuses. Une approche quantitative est abordée avec la notion de composition d'un mélange et de concentration en masse (essentiellement exprimée en g.L<sup>-1</sup>) d'un soluté dans une solution aqueuse.

> Au niveau atomique, la description des entités chimiques est complétée par les ordres de grandeur de taille et de masse de l'atome et du noyau et par le modèle du cortège électronique pour les trois premières lignes de la classification périodique. La stabilité des gaz nobles, associée à leur configuration électronique, permet de rendre compte de l'existence d'ions monoatomiques et de molécules. En seconde, les schémas de Lewis sont fournis et interprétés. Le changement d'échelle entre les niveaux macroscopique et microscopique conduit à une première approche de la quantité de matière (en moles) dans un échantillon de matière en utilisant la définition de la mole, une mole contenant exactement 6,022 140 76 × 10<sup>23</sup> entités élémentaires.

Notions étudiées au collège (cycle 4) : échelle macroscopique (espèce chimique, corps purs, mélanges, composition de l'air, masse volumique, propriétés des changements d'état, solutions : solubilité, miscibilité) ; échelle microscopique (molécules, atomes et ions, constituants de l'atome et du noyau, formule chimique d'une molécule, formules O<sub>2</sub>, H<sub>2</sub>, N<sub>2</sub>, H<sub>2</sub>O, CO<sub>2</sub>).

#### A) Description et caractérisation de la matière à l'échelle macroscopique

Notions et contenus :

- [N4] Corps purs et mélanges au quotidien.
- [N5] Espèce chimique, corps pur, mélanges d'espèces chimiques, mélanges homogènes et hétérogènes.
- [N6] Identification d'espèces chimiques dans un échantillon de matière par des mesures physiques ou des tests chimiques.
- [N7] Composition massique d'un mélange.
- [N8] Composition volumique de l'air.
- [N9] Les solutions aqueuses, un exemple de mélange.
- [N10] Solvant, soluté.
- [N11] Concentration en masse, concentration maximale d'un soluté.
- [N12] Dosage par étalonnage.

Capacités exigibles et activités expérimentales :

- [C8] Citer des exemples courants de corps purs et de mélanges homogènes et hétérogènes.
- [C9] Identifier, à partir de valeurs de référence, une espèce chimique par ses températures de changement d'état, sa masse volumique ou par des tests chimiques.
- [C10] Citer des tests chimiques courants de présence d'eau, de dihydrogène, de dioxygène, de dioxyde de carbone.
- [C11] Citer la valeur de la masse volumique de l'eau liquide et la comparer à celles d'autres corps purs et mélanges.
- [C12] Distinguer un mélange d'un corps pur à partir de données expérimentales.
- [C13] Mesurer une température de changement d'état, déterminer la masse volumique d'un échantillon, réaliser une chromatographie sur couche mince, mettre en œuvre des tests chimiques, pour identifier une espèce chimique et, le cas échéant, qualifier l'échantillon de mélange.
- [C14] Citer la composition approchée de l'air et l'ordre de grandeur de la valeur de sa masse volumique.
- [C15] Établir la composition d'un échantillon à partir de données expérimentales.
- [C16] Mesurer des volumes et des masses pour estimer la composition de mélanges.
- [C17] Capacité mathématique : utiliser les pourcentages et les fractions.
- [C18] Identifier le soluté et le solvant à partir de la composition ou du mode opératoire de préparation d'une solution.
- [C19] Distinguer la masse volumique d'un échantillon et la concentration en masse d'un soluté au sein d'une solution.
- [C20] Déterminer la valeur de la concentration en masse d'un soluté à partir du mode opératoire de préparation d'une solution par dissolution ou par dilution.
- [C21] Mesurer des masses pour étudier la variabilité du volume mesuré par une pièce de verrerie ; choisir et utiliser la verrerie adaptée pour préparer une solution par dissolution ou par dilution.
- [C22] Déterminer la valeur d'une concentration en masse et d'une concentration maximale à partir de résultats expérimentaux.
- [C23] Déterminer la valeur d'une concentration en masse à l'aide d'une gamme d'étalonnage (échelle de teinte ou mesure de masse volumique).
- [C24] Capacité mathématique : utiliser une grandeur quotient pour déterminer le numérateur ou le dénominateur.

#### B) Modélisation de la matière à l'échelle microscopique

Notions et contenus :

- [N13] Du macroscopique au microscopique, de l'espèce chimique à l'entité.
- [N14] Espèces moléculaires, espèces ioniques, électroneutralité de la matière au niveau macroscopique.
- [N15] Entités chimiques : molécules, atomes, ions.
- [N16] Le noyau de l'atome, siège de sa masse et de son identité.
- [N17] Numéro atomique, nombre de masse, écriture conventionnelle : <sup>A</sup><sub>Z</sub>X ou <sup>A</sup>X.
- [N18] Élément chimique.
- [N19] Masse et charge électrique d'un électron, d'un proton et d'un neutron, charge électrique élémentaire, neutralité de l'atome.
- [N20] Le cortège électronique de l'atome définit ses propriétés chimiques.
- [N21] Configuration électronique (1s, 2s, 2p, 3s, 3p) d'un atome à l'état fondamental et position dans le tableau périodique (blocs s et p).
- [N22] Électrons de valence.
- [N23] Familles chimiques.
- [N24] Vers des entités plus stables chimiquement.
- [N25] Stabilité chimique des gaz nobles et configurations électroniques associées.
- [N26] Ions monoatomiques.
- [N27] Molécules.
- [N28] Modèle de Lewis de la liaison de valence, schéma de Lewis, doublets liants et non-liants.
- [N29] Approche de l'énergie de liaison.
- [N30] Compter les entités dans un échantillon de matière.
- [N31] Nombre d'entités dans un échantillon.
- [N32] Définition de la mole.
- [N33] Quantité de matière dans un échantillon.

Capacités exigibles et activités expérimentales :

- [C25] Définir une espèce chimique comme une collection d'un nombre très élevé d'entités identiques.
- [C26] Exploiter l'électroneutralité de la matière pour associer des espèces ioniques et citer des formules de composés ioniques.
- [C27] Utiliser le terme adapté parmi molécule, atome, anion et cation pour qualifier une entité chimique à partir d'une formule chimique donnée.
- [C28] Citer l'ordre de grandeur de la valeur de la taille d'un atome.
- [C29] Comparer la taille et la masse d'un atome et de son noyau.
- [C30] Établir l'écriture conventionnelle d'un noyau à partir de sa composition et inversement.
- [C31] Capacités mathématiques : effectuer le quotient de deux grandeurs pour les comparer. Utiliser les opérations sur les puissances de 10. Exprimer les valeurs des grandeurs en écriture scientifique.
- [C32] Déterminer la position de l'élément dans le tableau périodique à partir de la donnée de la configuration électronique de l'atome à l'état fondamental.
- [C33] Déterminer les électrons de valence d'un atome (Z ⩽ 18) à partir de sa configuration électronique à l'état fondamental ou de sa position dans le tableau périodique.
- [C34] Associer la notion de famille chimique à l'existence de propriétés communes et identifier la famille des gaz nobles.
- [C35] Établir le lien entre stabilité chimique et configuration électronique de valence d'un gaz noble.
- [C36] Déterminer la charge électrique d'ions monoatomiques courants à partir du tableau périodique.
- [C37] Nommer les ions : H<sup>+</sup>, Na<sup>+</sup>, K<sup>+</sup>, Ca<sup>2+</sup>, Mg<sup>2+</sup>, Cl<sup>-</sup>, F<sup>-</sup> ; écrire leur formule à partir de leur nom.
- [C38] Décrire et exploiter le schéma de Lewis d'une molécule pour justifier la stabilisation de cette entité, en référence aux gaz nobles, par rapport aux atomes isolés (Z ⩽ 18).
- [C39] Associer qualitativement l'énergie d'une liaison entre deux atomes à l'énergie nécessaire pour rompre cette liaison.
- [C40] Déterminer la masse d'une entité à partir de sa formule brute et de la masse des atomes qui la composent.
- [C41] Déterminer le nombre d'entités et la quantité de matière (en mol) d'une espèce dans une masse d'échantillon.

### 2. Modélisation des transformations de la matière et transfert d'énergie

> L'objectif de cette partie est d'identifier et de distinguer les trois types de transformation de la matière, de les modéliser par des réactions et d'écrire les équations ajustées en utilisant les lois de conservation appropriées. Une première approche des énergies mises en jeu lors de ces trois types de transformations permet de montrer que l'énergie transférée lors d'une transformation dépend des quantités de matière des espèces mises en jeu.

> L'étude des transformations chimiques, entamée au collège, est complétée par les notions de stœchiométrie, d'espèce spectatrice et de réactif limitant. […] Pour que les transformations soient plus concrètes, des exemples provenant de la vie quotidienne sont proposés : combustions, corrosions, détartrage, synthèses d'arôme ou de parfum, etc.

Notions abordées au collège (cycle 4) : transformations physiques (changement d'état, conservation de la masse, variation du volume, température de changement d'état) ; transformations chimiques (conservation de la masse, redistribution d'atomes, notion d'équation chimique, réactions entre espèces acides et basiques en solution, réactions d'une espèce acide sur un métal, mesure de pH).

#### A) Transformation physique

Notions et contenus :

- [N34] Écriture symbolique d'un changement d'état.
- [N35] Modélisation microscopique d'un changement d'état.
- [N36] Transformations physiques endothermiques et exothermiques.
- [N37] Énergie de changement d'état et applications.

Capacités exigibles et activités expérimentales :

- [C42] Citer des exemples de changements d'état physique de la vie courante et dans l'environnement.
- [C43] Établir l'écriture d'une équation pour un changement d'état.
- [C44] Distinguer fusion et dissolution.
- [C45] Identifier le sens du transfert thermique lors d'un changement d'état et le relier au terme exothermique ou endothermique.
- [C46] Exploiter la relation entre l'énergie transférée lors d'un changement d'état et l'énergie massique de changement d'état de l'espèce.
- [C47] Relier l'énergie échangée à la masse de l'espèce qui change d'état.

#### B) Transformation chimique

Notions et contenus :

- [N38] Modélisation macroscopique d'une transformation par une réaction chimique.
- [N39] Écriture symbolique d'une réaction chimique.
- [N40] Notion d'espèce spectatrice.
- [N41] Stœchiométrie, réactif limitant.
- [N42] Transformations chimiques endothermiques et exothermiques.
- [N43] Synthèse d'une espèce chimique présente dans la nature.

Capacités exigibles et activités expérimentales :

- [C48] Modéliser, à partir de données expérimentales, une transformation par une réaction, établir l'équation de réaction associée et l'ajuster.
- [C49] Identifier le réactif limitant à partir des quantités de matière des réactifs et de l'équation de réaction.
- [C50] Déterminer le réactif limitant lors d'une transformation chimique totale, à partir de l'identification des espèces chimiques présentes dans l'état final.
- [C51] Modéliser, par l'écriture d'une équation de réaction, la combustion du carbone et du méthane, la corrosion d'un métal par un acide, l'action d'un acide sur le calcaire, l'action de l'acide chlorhydrique sur l'hydroxyde de sodium en solution.
- [C52] Suivre l'évolution d'une température pour déterminer le caractère endothermique ou exothermique d'une transformation chimique et étudier l'influence de la masse du réactif limitant.
- [C53] Capacité mathématique : utiliser la proportionnalité.
- [C54] Établir, à partir de données expérimentales, qu'une espèce chimique synthétisée au laboratoire peut être identique à une espèce chimique synthétisée dans la nature.
- [C55] Réaliser le schéma légendé d'un montage à reflux et d'une chromatographie sur couche mince.
- [C56] Mettre en œuvre un montage à reflux pour synthétiser une espèce chimique présente dans la nature.
- [C57] Mettre en œuvre une chromatographie sur couche mince pour comparer une espèce synthétisée et une espèce extraite de la nature.

#### C) Transformation nucléaire

Notions et contenus :

- [N44] Isotopes.
- [N45] Écriture symbolique d'une réaction nucléaire.
- [N46] Aspects énergétiques des transformations nucléaires : Soleil, centrales nucléaires.

Capacités exigibles :

- [C58] Identifier des isotopes.
- [C59] Relier l'énergie convertie dans le Soleil et dans une centrale nucléaire à des réactions nucléaires.
- [C60] Identifier la nature physique, chimique ou nucléaire d'une transformation à partir de sa description ou d'une écriture symbolique modélisant la transformation.

---

## Partie 2 : Mouvement et interactions

> Ce thème prépare la mise en place du principe fondamental de la dynamique ; il s'agit en effet de construire un lien précis entre force appliquée et variation de la vitesse. […] les contextes d'étude ou d'application sont nombreux et variés : transports, aéronautique, exploration spatiale, biophysique, sport, géophysique, planétologie, astrophysique ou encore histoire des sciences.

Notions abordées au collège (cycle 4) : vitesse (direction, sens, valeur), mouvements uniformes, rectilignes, circulaires, relativité des mouvements, interactions, forces, expression scalaire de la loi de gravitation universelle, force de pesanteur.

### 1. Décrire un mouvement

Notions et contenus :

- [N47] Système.
- [N48] Échelles caractéristiques d'un système.
- [N49] Référentiel et relativité du mouvement.
- [N50] Description du mouvement d'un système par celui d'un point.
- [N51] Position. Trajectoire d'un point.
- [N52] Vecteur déplacement d'un point.
- [N53] Vecteur vitesse moyenne d'un point.
- [N54] Vecteur vitesse d'un point.
- [N55] Mouvement rectiligne.

Capacités exigibles et activités expérimentales :

- [C61] Identifier les échelles temporelles et spatiales pertinentes de description d'un mouvement.
- [C62] Choisir un référentiel pour décrire le mouvement d'un système.
- [C63] Expliquer, dans le cas de la translation, l'influence du choix du référentiel sur la description du mouvement d'un système.
- [C64] Décrire le mouvement d'un système par celui d'un point et caractériser cette modélisation en termes de perte d'informations.
- [C65] Caractériser différentes trajectoires.
- [C66] Capacité numérique : représenter les positions successives d'un système modélisé par un point lors d'une évolution unidimensionnelle ou bidimensionnelle à l'aide d'un langage de programmation.
- [C67] Définir le vecteur vitesse moyenne d'un point.
- [C68] Approcher le vecteur vitesse d'un point à l'aide du vecteur déplacement MM', où M et M' sont les positions successives à des instants voisins séparés de Δt ; le représenter.
- [C69] Caractériser un mouvement rectiligne uniforme ou non uniforme.
- [C70] Réaliser et/ou exploiter une vidéo ou une chronophotographie d'un système en mouvement et représenter des vecteurs vitesse ; décrire la variation du vecteur vitesse.
- [C71] Capacité numérique : représenter des vecteurs vitesse d'un système modélisé par un point lors d'un mouvement à l'aide d'un langage de programmation.
- [C72] Capacités mathématiques : représenter des vecteurs. Utiliser des grandeurs algébriques.

### 2. Modéliser une action sur un système

Notions et contenus :

- [N56] Modélisation d'une action par une force.
- [N57] Principe des actions réciproques (troisième loi de Newton).
- [N58] Caractéristiques d'une force.
- [N59] Exemples de forces : force d'interaction gravitationnelle ; poids ; force exercée par un support et par un fil.

Capacités exigibles :

- [C73] Modéliser l'action d'un système extérieur sur le système étudié par une force. Représenter une force par un vecteur ayant une norme, une direction, un sens.
- [C74] Exploiter le principe des actions réciproques.
- [C75] Distinguer actions à distance et actions de contact.
- [C76] Identifier les actions modélisées par des forces dont les expressions mathématiques sont connues a priori.
- [C77] Utiliser l'expression vectorielle de la force d'interaction gravitationnelle.
- [C78] Utiliser l'expression vectorielle du poids d'un objet, approché par la force d'interaction gravitationnelle s'exerçant sur cet objet à la surface d'une planète.
- [C79] Représenter qualitativement la force modélisant l'action d'un support dans des cas simples relevant de la statique.

### 3. Principe d'inertie

Notions et contenus :

- [N60] Modèle du point matériel.
- [N61] Principe d'inertie.
- [N62] Cas de situations d'immobilité et de mouvements rectilignes uniformes.
- [N63] Cas de la chute libre à une dimension.

Capacités exigibles :

- [C80] Exploiter le principe d'inertie ou sa contraposée pour en déduire des informations soit sur la nature du mouvement d'un système modélisé par un point matériel, soit sur les forces.
- [C81] Relier la variation entre deux instants voisins du vecteur vitesse d'un système modélisé par un point matériel à l'existence d'actions extérieures modélisées par des forces dont la somme est non nulle, en particulier dans le cas d'un mouvement de chute libre à une dimension (avec ou sans vitesse initiale).

---

## Partie 3 : Ondes et signaux

### 1. Émission et perception d'un son

> La partie « Acoustique » vise à consolider les connaissances de collège : des schémas explicatifs de l'émission, de la propagation et de la réception sont maintenant proposés. L'étude de la perception d'un son est l'occasion d'initier les élèves à la lecture d'une échelle non linéaire et de les sensibiliser aux dangers liés à l'exposition sonore.

Notions abordées au collège (cycle 4) : vitesse de propagation ; notion de fréquence : sons audibles, infrasons et ultrasons.

Notions et contenus :

- [N64] Émission et propagation d'un signal sonore.
- [N65] Vitesse de propagation d'un signal sonore.
- [N66] Signal sonore périodique, fréquence et période. Relation entre période et fréquence.
- [N67] Perception du son : lien entre fréquence et hauteur ; lien entre forme du signal et timbre ; lien qualitatif entre amplitude, intensité sonore et niveau d'intensité sonore.
- [N68] Échelle de niveaux d'intensité sonore.

Capacités exigibles et activités expérimentales :

- [C82] Décrire le principe de l'émission d'un signal sonore par la mise en vibration d'un objet et l'intérêt de la présence d'une caisse de résonance.
- [C83] Expliquer le rôle joué par le milieu matériel dans le phénomène de propagation d'un signal sonore.
- [C84] Citer une valeur approchée de la vitesse de propagation d'un signal sonore dans l'air et la comparer à d'autres valeurs de vitesses couramment rencontrées.
- [C85] Mesurer la vitesse d'un signal sonore.
- [C86] Définir et déterminer la période et la fréquence d'un signal sonore notamment à partir de sa représentation temporelle.
- [C87] Utiliser une chaîne de mesure pour obtenir des informations sur les vibrations d'un objet émettant un signal sonore.
- [C88] Mesurer la période d'un signal sonore périodique.
- [C89] Utiliser un dispositif comportant un microcontrôleur pour produire un signal sonore.
- [C90] Capacités mathématiques : identifier une fonction périodique et déterminer sa période.
- [C91] Citer les domaines de fréquences des sons audibles, des infrasons et des ultrasons.
- [C92] Relier qualitativement la fréquence à la hauteur d'un son audible.
- [C93] Relier qualitativement intensité sonore et niveau d'intensité sonore.
- [C94] Exploiter une échelle de niveau d'intensité sonore et citer les dangers inhérents à l'exposition sonore.
- [C95] Enregistrer et caractériser un son (hauteur, timbre, niveau d'intensité sonore, etc.) à l'aide d'un dispositif expérimental dédié, d'un smartphone, etc.

### 2. Vision et image

> La partie « Optique » vise à consolider le modèle du rayon lumineux, à introduire la notion de spectre et à montrer que les phénomènes de réflexion et de réfraction sont bien décrits par des relations mathématiques. Le programme propose également une première approche de la notion d'image d'un objet et de sa formation.

Notions abordées au collège (cycle 4) : lumière (sources, propagation, vitesse de propagation) ; modèle du rayon lumineux.

Notions et contenus :

- [N69] Propagation rectiligne de la lumière.
- [N70] Vitesse de propagation de la lumière dans le vide ou dans l'air.
- [N71] Lumière blanche, lumière colorée.
- [N72] Spectres d'émission : spectres continus d'origine thermique, spectres de raies.
- [N73] Longueur d'onde dans le vide ou dans l'air.
- [N74] Lois de Snell-Descartes pour la réflexion et la réfraction. Indice optique d'un milieu matériel.
- [N75] Dispersion de la lumière blanche par un prisme ou un réseau.
- [N76] Lentilles, modèle de la lentille mince convergente : foyers, distance focale. Image réelle d'un objet réel à travers une lentille mince convergente. Grandissement.
- [N77] L'œil, modèle de l'œil réduit.

Capacités exigibles et activités expérimentales :

- [C96] Citer la valeur de la vitesse de la lumière dans le vide ou dans l'air et la comparer à d'autres valeurs de vitesses couramment rencontrées.
- [C97] Caractériser le spectre du rayonnement émis par un corps chaud.
- [C98] Caractériser un rayonnement monochromatique par sa longueur d'onde dans le vide ou dans l'air.
- [C99] Exploiter un spectre de raies.
- [C100] Exploiter les lois de Snell-Descartes pour la réflexion et la réfraction.
- [C101] Tester les lois de Snell-Descartes à partir d'une série de mesures et déterminer l'indice de réfraction d'un milieu.
- [C102] Décrire et expliquer qualitativement le phénomène de dispersion de la lumière par un prisme.
- [C103] Produire et exploiter des spectres d'émission obtenus à l'aide d'un système dispersif et d'un analyseur de spectre.
- [C104] Caractériser les foyers d'une lentille mince convergente à l'aide du modèle du rayon lumineux.
- [C105] Utiliser le modèle du rayon lumineux pour déterminer graphiquement la position, la taille et le sens de l'image réelle d'un objet plan réel donnée par une lentille mince convergente.
- [C106] Définir et déterminer géométriquement un grandissement.
- [C107] Modéliser l'œil.
- [C108] Produire et caractériser l'image réelle d'un objet plan réel formée par une lentille mince convergente.
- [C109] Capacité mathématique : utiliser le théorème de Thalès.

### 3. Signaux et capteurs

> Outre les principales lois, le programme met l'accent sur l'utilisation et le comportement de dipôles couramment utilisés comme capteurs. […] Le volet expérimental de cet enseignement fournira l'occasion de sensibiliser les élèves aux règles de sécurité et de les amener à utiliser des multimètres, des microcontrôleurs associés à des capteurs, des oscilloscopes, etc.

Notions abordées au collège (cycle 4) : circuits électriques, dipôles en série, dipôles en dérivation, boucle, unicité de l'intensité dans un circuit série, loi d'additivité des tensions, loi d'additivité des intensités, loi d'Ohm, règles de sécurité, énergie et puissance électriques.

Notions et contenus :

- [N78] Loi des nœuds. Loi des mailles.
- [N79] Caractéristique tension-courant d'un dipôle.
- [N80] Résistance et systèmes à comportement de type ohmique. Loi d'Ohm.
- [N81] Capteurs électriques.

Capacités exigibles et activités expérimentales :

- [C110] Exploiter la loi des mailles et la loi des nœuds dans un circuit électrique comportant au plus deux mailles.
- [C111] Mesurer une tension et une intensité.
- [C112] Exploiter la caractéristique d'un dipôle électrique : point de fonctionnement, modélisation par une relation U = f(I) ou I = g(U).
- [C113] Utiliser la loi d'Ohm.
- [C114] Représenter et exploiter la caractéristique d'un dipôle.
- [C115] Capacités numériques : représenter un nuage de points associé à la caractéristique d'un dipôle et modéliser la caractéristique de ce dipôle à l'aide d'un langage de programmation.
- [C116] Capacité mathématique : identifier une situation de proportionnalité.
- [C117] Citer des exemples de capteurs présents dans les objets de la vie quotidienne.
- [C118] Mesurer une grandeur physique à l'aide d'un capteur électrique résistif. Produire et utiliser une courbe d'étalonnage reliant la résistance d'un système avec une grandeur d'intérêt (température, pression, intensité lumineuse, etc.).
- [C119] Utiliser un dispositif avec microcontrôleur et capteur.

---

## Totaux

- **Notions et contenus** : 81 ([N1] à [N81]).
- **Capacités** (exigibles, expérimentales, mathématiques et numériques) : 119 ([C1] à [C119]).
