# Plan des chapitres : physique-chimie, 2de générale et technologique

Plan déduit du programme officiel conservé dans `physique-chimie-2de.md` (arrêté du 17 janvier 2019, NOR MENE1901634A, BO spécial n° 1 du 22 janvier 2019). Les notions sont citées avec leur code `[N…]`, les capacités avec leur code `[C…]` (codes définis dans `physique-chimie-2de.md`).

**Statut** : plan proposé, **non encore validé par l'enseignant**. La méthode STSS prévoit un arrêt pour valider le plan ; ici, le cours a été rédigé sans attendre, à la demande de la session de coordination. Les choix à trancher sont listés en fin de document.

## Principes du découpage

- Un chapitre par partie du programme (les tableaux numérotés du texte officiel), avec deux ajustements :
  - la partie « Mesure et incertitudes », placée dans le préambule, devient le chapitre 1 : elle sert d'outil à tous les chapitres suivants, qui la réinvestissent dans leurs activités expérimentales ;
  - la partie « Modélisation de la matière à l'échelle microscopique », très longue, est partagée en deux chapitres : l'atome et le tableau périodique (chapitre 3), puis les ions, les molécules et la quantité de matière (chapitre 4).
- « Mouvement et interactions » donne deux chapitres : « Décrire un mouvement » (chapitre 8), puis « Modéliser une action » et « Principe d'inertie » réunis (chapitre 9), car le principe d'inertie relie directement les forces à la variation du vecteur vitesse.
- Ordre : celui du programme (matière, transformations, mouvement, ondes et signaux). Le programme laisse l'ordre à la liberté pédagogique du professeur.
- Le thème « L'énergie : conversions et transferts » n'a pas de chapitre propre : comme le dit le programme, il est traité avec les transformations (chapitres 5, 6 et 7).
- Durées indicatives : environ 33 semaines au total.
- Les capacités expérimentales (« Mesurer… », « Mettre en œuvre… », « Réaliser… ») sont présentées dans le cours par le principe du protocole, les précautions et l'exploitation des résultats ; elles se pratiquent en classe. Les capacités numériques (Python, tableur) sont présentées par ce que fait le programme ou la feuille de calcul, sans code à recopier.

## Vue d'ensemble

| N° | Titre | Titre court | Durée | Partie du programme |
| --- | --- | --- | --- | --- |
| 1 | Mesure et incertitudes | Mesure | 2 semaines | Préambule, « Mesure et incertitudes » |
| 2 | Corps purs, mélanges et solutions aqueuses | Corps purs et mélanges | 3 semaines | Matière 1-A |
| 3 | De l'atome au tableau périodique | Atome | 3 semaines | Matière 1-B (début) |
| 4 | Ions, molécules et quantité de matière | Entités et mole | 3 semaines | Matière 1-B (suite) |
| 5 | Les transformations physiques | Transformations physiques | 2 semaines | Matière 2-A |
| 6 | Les transformations chimiques | Transformations chimiques | 4 semaines | Matière 2-B |
| 7 | Les transformations nucléaires | Transformations nucléaires | 2 semaines | Matière 2-C |
| 8 | Décrire un mouvement | Mouvement | 3 semaines | Mouvement 1 |
| 9 | Forces et principe d'inertie | Forces et inertie | 3 semaines | Mouvement 2 et 3 |
| 10 | Émission et perception d'un son | Son | 2 semaines | Ondes 1 |
| 11 | Vision et image | Lumière et image | 4 semaines | Ondes 2 |
| 12 | Signaux et capteurs | Circuits et capteurs | 2 semaines | Ondes 3 |

---

## Chapitre 1 : Mesure et incertitudes

- **Titre court** : Mesure
- **Durée indicative** : 2 semaines
- **Partie du programme** : préambule, tableau « Mesure et incertitudes ».
- **Notions couvertes** : [N1] Variabilité de la mesure d'une grandeur physique ; [N2] Incertitude-type ; [N3] Écriture du résultat. Valeur de référence.
- **Capacités** : [C1] à [C7].

**Objectifs**

- Je sais expliquer pourquoi des mesures répétées d'une même grandeur donnent des valeurs différentes.
- Je sais exploiter une série de mesures : histogramme, moyenne, écart-type.
- Je sais discuter de l'influence de l'instrument et du protocole sur la dispersion des mesures.
- Je sais expliquer ce que représente une incertitude-type et l'évaluer par une approche statistique.
- Je sais écrire le résultat d'une mesure avec un nombre adapté de chiffres significatifs.
- Je sais comparer un résultat à une valeur de référence.

**Sections prévues**

1. **Mesurer, c'est obtenir des valeurs qui varient.** Grandeur, valeur, unité ; mesures indépendantes ; causes de la variabilité (expérimentateur, instrument, conditions).
2. **Exploiter une série de mesures.** Tableau de valeurs, histogramme (avec un tableur), moyenne, écart-type ; évaluer la dispersion.
3. **L'incertitude-type.** Sa signification ; approche statistique : u = σ / √N ; influence de l'instrument et du protocole.
4. **Écrire un résultat.** Chiffres significatifs, écriture scientifique, unités ; écriture « valeur et incertitude-type ».
5. **Comparer à une valeur de référence.** Conclure qualitativement à la compatibilité ou non ; repérer des sources d'erreur ; proposer des améliorations.

---

## Chapitre 2 : Corps purs, mélanges et solutions aqueuses

- **Titre court** : Corps purs et mélanges
- **Durée indicative** : 3 semaines
- **Partie du programme** : Constitution de la matière, A) Description et caractérisation de la matière à l'échelle macroscopique.
- **Notions couvertes** : [N4] à [N12].
- **Notions reprises** : [N1] à [N3] (mesures de masse volumique, de volume, de température).
- **Capacités** : [C8] à [C24].

**Objectifs**

- Je sais distinguer espèce chimique, corps pur et mélange, homogène ou hétérogène, et en citer des exemples.
- Je sais identifier une espèce chimique par ses températures de changement d'état, sa masse volumique, une chromatographie ou des tests chimiques.
- Je sais citer les tests de l'eau, du dihydrogène, du dioxygène et du dioxyde de carbone.
- Je sais citer la composition approchée de l'air et calculer la composition d'un mélange.
- Je sais identifier le soluté et le solvant d'une solution et calculer une concentration en masse.
- Je sais distinguer masse volumique et concentration en masse.
- Je sais préparer une solution par dissolution ou par dilution et choisir la verrerie adaptée.
- Je sais déterminer une concentration en masse à l'aide d'une gamme d'étalonnage.

**Sections prévues**

1. **Corps purs et mélanges.** Espèce chimique, corps pur, mélange ; mélanges homogènes et hétérogènes ; exemples du quotidien.
2. **Identifier une espèce chimique.** Températures de changement d'état (palier), masse volumique (ρ = m / V ; eau liquide : 1,0 g·mL<sup>−1</sup>), chromatographie sur couche mince, tests chimiques (sulfate de cuivre anhydre, détonation, bûchette incandescente, eau de chaux) ; distinguer un mélange d'un corps pur.
3. **Composition d'un mélange.** Composition massique (pourcentages, fractions) ; composition volumique de l'air (environ 78 % de diazote, 21 % de dioxygène) et ordre de grandeur de sa masse volumique (environ 1 g·L<sup>−1</sup>, 1,2 g·L<sup>−1</sup> à 20 °C).
4. **Les solutions aqueuses.** Solvant, soluté ; concentration en masse C<sub>m</sub> = m<sub>soluté</sub> / V<sub>solution</sub> ; concentration maximale (solubilité) ; masse volumique et concentration en masse ne sont pas la même grandeur.
5. **Préparer une solution.** Dissolution et dilution (conservation de la masse de soluté, facteur de dilution) ; verrerie jaugée et graduée ; variabilité du volume mesuré par une pièce de verrerie.
6. **Le dosage par étalonnage.** Gamme d'étalonnage, échelle de teinte, mesure de masse volumique ; déterminer une concentration inconnue ; utiliser une grandeur quotient.

---

## Chapitre 3 : De l'atome au tableau périodique

- **Titre court** : Atome
- **Durée indicative** : 3 semaines
- **Partie du programme** : Constitution de la matière, B) Modélisation de la matière à l'échelle microscopique (entités, noyau, cortège électronique).
- **Notions couvertes** : [N13], [N15] à [N23].
- **Capacités** : [C25], [C27] à [C34].

**Objectifs**

- Je sais définir une espèce chimique comme une collection d'un très grand nombre d'entités identiques.
- Je sais qualifier une entité de molécule, d'atome, d'anion ou de cation à partir de sa formule.
- Je sais décrire la composition d'un atome et établir l'écriture conventionnelle d'un noyau.
- Je sais citer l'ordre de grandeur de la taille d'un atome et comparer la taille et la masse d'un atome et de son noyau.
- Je sais définir un élément chimique.
- Je sais écrire la configuration électronique d'un atome (Z ⩽ 18) et en déduire sa position dans le tableau périodique.
- Je sais déterminer les électrons de valence d'un atome et associer une famille chimique à des propriétés communes.

**Sections prévues**

1. **De l'espèce chimique à l'entité.** Changement d'échelle ; entités : atomes, molécules, ions (anions, cations) ; formules chimiques.
2. **Le noyau, siège de la masse et de l'identité de l'atome.** Protons, neutrons, électrons : masses et charges ; charge élémentaire e = 1,6 × 10<sup>−19</sup> C ; neutralité de l'atome ; Z, A, écriture <sup>A</sup><sub>Z</sub>X.
3. **Tailles et masses.** Atome ≈ 10<sup>−10</sup> m, noyau ≈ 10<sup>−15</sup> m ; masse concentrée dans le noyau ; puissances de 10, écriture scientifique, quotients.
4. **L'élément chimique.** Défini par Z ; il se conserve ; atomes et ions d'un même élément.
5. **Le cortège électronique.** Couches et sous-couches 1s, 2s, 2p, 3s, 3p ; remplissage à l'état fondamental ; électrons de valence.
6. **Le tableau périodique.** Lignes (périodes) et colonnes ; blocs s et p ; position et configuration ; familles chimiques : alcalins, halogènes, gaz nobles.

---

## Chapitre 4 : Ions, molécules et quantité de matière

- **Titre court** : Entités et mole
- **Durée indicative** : 3 semaines
- **Partie du programme** : Constitution de la matière, B) Modélisation de la matière à l'échelle microscopique (stabilité, ions, molécules, mole).
- **Notions couvertes** : [N14], [N24] à [N33].
- **Notions reprises** : [N15], [N21], [N22], [N23].
- **Capacités** : [C26], [C35] à [C41].

**Objectifs**

- Je sais relier la stabilité chimique des gaz nobles à leur configuration électronique de valence.
- Je sais déterminer la charge des ions monoatomiques courants à partir du tableau périodique, et nommer H<sup>+</sup>, Na<sup>+</sup>, K<sup>+</sup>, Ca<sup>2+</sup>, Mg<sup>2+</sup>, Cl<sup>−</sup>, F<sup>−</sup>.
- Je sais utiliser l'électroneutralité pour écrire la formule d'un composé ionique.
- Je sais décrire et exploiter un schéma de Lewis : doublets liants et non liants.
- Je sais relier l'énergie d'une liaison à l'énergie nécessaire pour la rompre.
- Je sais calculer la masse d'une entité, le nombre d'entités et la quantité de matière dans un échantillon.

**Sections prévues**

1. **La stabilité des gaz nobles.** Configuration de valence en duet ou en octet ; tendance des autres atomes à l'atteindre.
2. **Les ions monoatomiques.** Gain ou perte d'électrons ; charge prévue par la position dans le tableau ; noms et formules des ions du programme.
3. **Composés ioniques et électroneutralité.** Espèces ioniques et moléculaires ; formules statistiques (NaCl, CaCl<sub>2</sub>, MgF<sub>2</sub>…).
4. **Les molécules et le schéma de Lewis.** Liaison covalente, doublets liants et non liants ; nombre de liaisons des atomes H, C, N, O, Cl ; exemples H<sub>2</sub>O, CO<sub>2</sub>, CH<sub>4</sub>, NH<sub>3</sub>.
5. **L'énergie de liaison.** Énergie à fournir pour rompre une liaison ; approche qualitative.
6. **Compter les entités : la mole.** Masse d'une entité ; nombre d'entités N = m<sub>échantillon</sub> / m<sub>entité</sub> ; définition de la mole et constante d'Avogadro N<sub>A</sub> = 6,022 140 76 × 10<sup>23</sup> mol<sup>−1</sup> ; quantité de matière n = N / N<sub>A</sub>.

---

## Chapitre 5 : Les transformations physiques

- **Titre court** : Transformations physiques
- **Durée indicative** : 2 semaines
- **Partie du programme** : Modélisation des transformations de la matière et transfert d'énergie, A) Transformation physique.
- **Notions couvertes** : [N34] à [N37].
- **Notions reprises** : [N5], [N6] (températures de changement d'état), [N10] (dissolution).
- **Capacités** : [C42] à [C47].

**Objectifs**

- Je sais citer des changements d'état de la vie courante et de l'environnement, et les nommer.
- Je sais écrire l'équation d'un changement d'état.
- Je sais décrire un changement d'état à l'échelle microscopique.
- Je sais distinguer fusion et dissolution.
- Je sais identifier le sens du transfert thermique et qualifier un changement d'état d'endothermique ou d'exothermique.
- Je sais utiliser la relation Q = m × L entre énergie transférée, masse et énergie massique de changement d'état.

**Sections prévues**

1. **Les changements d'état.** Trois états, six changements d'état et leurs noms ; exemples de la vie courante et du cycle de l'eau.
2. **Écrire et modéliser un changement d'état.** Équation avec états physiques, par exemple H<sub>2</sub>O(s) → H<sub>2</sub>O(l) ; modèle microscopique : les entités restent les mêmes, leur organisation et leur agitation changent ; conservation de la masse.
3. **Fusion ou dissolution ?** Deux transformations différentes ; une seule espèce ou deux espèces.
4. **Endothermique ou exothermique.** Sens du transfert thermique ; exemples (transpiration, givre, réfrigérateur).
5. **L'énergie de changement d'état.** Énergie massique L (en J·kg<sup>−1</sup>) ; Q = m × L ; applications (poche de froid, refroidissement, conservation des aliments).

---

## Chapitre 6 : Les transformations chimiques

- **Titre court** : Transformations chimiques
- **Durée indicative** : 4 semaines
- **Partie du programme** : Modélisation des transformations de la matière et transfert d'énergie, B) Transformation chimique.
- **Notions couvertes** : [N38] à [N43].
- **Notions reprises** : [N6] (tests chimiques, CCM), [N33] (quantité de matière).
- **Capacités** : [C48] à [C57].

**Objectifs**

- Je sais décrire un système chimique dans l'état initial et dans l'état final.
- Je sais modéliser une transformation chimique par une réaction et écrire son équation ajustée.
- Je sais repérer une espèce spectatrice.
- Je sais identifier le réactif limitant à partir des quantités de matière ou de l'état final.
- Je sais écrire les équations des combustions du carbone et du méthane, de la corrosion d'un métal par un acide, de l'action d'un acide sur le calcaire et de l'acide chlorhydrique sur l'hydroxyde de sodium.
- Je sais qualifier une transformation chimique d'endothermique ou d'exothermique.
- Je sais expliquer qu'une espèce synthétisée peut être identique à une espèce naturelle, et décrire un montage à reflux et une CCM.

**Sections prévues**

1. **Du système à la réaction chimique.** État initial, état final ; réactifs, produits ; modélisation macroscopique par une réaction.
2. **L'équation de réaction.** Écriture symbolique ; conservation des éléments et des charges ; ajuster une équation ; espèce spectatrice.
3. **Des exemples à connaître.** Combustions du carbone et du méthane ; corrosion d'un métal par un acide ; acide et calcaire ; acide chlorhydrique et hydroxyde de sodium.
4. **Stœchiométrie et réactif limitant.** Proportions de l'équation ; réactif limitant et réactif en excès ; à partir des quantités de matière, ou de l'état final ; proportions stœchiométriques ; utiliser la proportionnalité.
5. **Effets thermiques.** Transformations endothermiques et exothermiques ; suivi de température ; l'énergie transférée dépend de la quantité de réactif limitant.
6. **Synthétiser une espèce présente dans la nature.** Espèces naturelles et synthétiques ; montage à reflux ; CCM pour comparer une espèce synthétisée et une espèce extraite ; exemples d'arômes.

---

## Chapitre 7 : Les transformations nucléaires

- **Titre court** : Transformations nucléaires
- **Durée indicative** : 2 semaines
- **Partie du programme** : Modélisation des transformations de la matière et transfert d'énergie, C) Transformation nucléaire.
- **Notions couvertes** : [N44] à [N46].
- **Notions reprises** : [N16] à [N18] (noyau, écriture conventionnelle, élément), [N34], [N39] (écritures symboliques).
- **Capacités** : [C58] à [C60].

**Objectifs**

- Je sais identifier des isotopes.
- Je sais écrire et ajuster l'équation d'une réaction nucléaire en utilisant les lois de conservation.
- Je sais distinguer fission et fusion.
- Je sais relier l'énergie libérée dans le Soleil et dans une centrale nucléaire à des réactions nucléaires.
- Je sais reconnaître si une transformation est physique, chimique ou nucléaire.

**Sections prévues**

1. **Les isotopes.** Même Z, A différents ; exemples (hydrogène, carbone, uranium) ; même élément.
2. **Écrire une réaction nucléaire.** Les noyaux changent ; conservation du nombre de charge Z et du nombre de masse A ; particules (neutron, proton, électron, positon, noyau d'hélium) ; ajuster une équation.
3. **Fission et fusion.** Noyau lourd qui se scinde ; noyaux légers qui fusionnent.
4. **L'énergie nucléaire.** Le Soleil (fusion de l'hydrogène) ; les centrales nucléaires (fission de l'uranium 235) ; énergie libérée bien plus grande, à masse égale, que lors d'une transformation chimique.
5. **Physique, chimique ou nucléaire ?** Ce qui se conserve dans chaque cas (espèces, éléments, noyaux) ; reconnaître le type d'une transformation à partir d'une description ou d'une équation.

---

## Chapitre 8 : Décrire un mouvement

- **Titre court** : Mouvement
- **Durée indicative** : 3 semaines
- **Partie du programme** : Mouvement et interactions, 1. Décrire un mouvement.
- **Notions couvertes** : [N47] à [N55].
- **Capacités** : [C61] à [C72].

**Objectifs**

- Je sais définir un système et identifier les échelles de temps et d'espace adaptées à son mouvement.
- Je sais choisir un référentiel et expliquer que le mouvement dépend du référentiel.
- Je sais modéliser un système par un point et dire quelles informations sont perdues.
- Je sais caractériser une trajectoire.
- Je sais définir et représenter le vecteur déplacement, le vecteur vitesse moyenne et le vecteur vitesse.
- Je sais caractériser un mouvement rectiligne uniforme ou non uniforme à partir d'une chronophotographie.

**Sections prévues**

1. **Système et échelles.** Système ; échelles spatiales et temporelles d'un mouvement (de l'électron aux galaxies).
2. **Référentiel et relativité du mouvement.** Référentiels terrestre, géocentrique, héliocentrique ; un mouvement dépend du référentiel ; cas de la translation.
3. **Le modèle du point.** Décrire le système par un point ; ce que l'on perd (rotation, déformation) ; position, repère, trajectoire (rectiligne, circulaire, curviligne).
4. **Chronophotographie et positions successives.** Positions à intervalles de temps égaux ; représentation par un programme Python (principe).
5. **Vecteur déplacement et vecteur vitesse.** Vecteur déplacement MM' ; vecteur vitesse moyenne ; vecteur vitesse approché par MM'/Δt ; direction, sens, norme ; unités et conversions (m·s<sup>−1</sup>, km·h<sup>−1</sup>).
6. **Types de mouvements rectilignes.** Uniforme, accéléré, ralenti ; variation du vecteur vitesse.

---

## Chapitre 9 : Forces et principe d'inertie

- **Titre court** : Forces et inertie
- **Durée indicative** : 3 semaines
- **Partie du programme** : Mouvement et interactions, 2. Modéliser une action sur un système ; 3. Principe d'inertie.
- **Notions couvertes** : [N56] à [N63].
- **Notions reprises** : [N47], [N54], [N55] (système, vecteur vitesse, mouvement rectiligne).
- **Capacités** : [C73] à [C81].

**Objectifs**

- Je sais modéliser une action par une force et représenter cette force par un vecteur.
- Je sais distinguer actions de contact et actions à distance.
- Je sais exploiter le principe des actions réciproques.
- Je sais utiliser l'expression de la force d'interaction gravitationnelle et du poids.
- Je sais représenter la force exercée par un support ou un fil dans des cas simples.
- Je sais énoncer et exploiter le principe d'inertie et sa contraposée.
- Je sais relier la variation du vecteur vitesse à une somme de forces non nulle, notamment en chute libre.

**Sections prévues**

1. **Modéliser une action par une force.** Action, système extérieur ; force : point d'application, direction, sens, norme (en N) ; diagramme objet-interactions (inventaire).
2. **Actions réciproques.** Principe des actions réciproques (troisième loi de Newton).
3. **La force d'interaction gravitationnelle et le poids.** F = G × m<sub>A</sub> × m<sub>B</sub> / d<sup>2</sup> ; expression vectorielle ; poids P = m × g ; g ≈ 9,8 N·kg<sup>−1</sup> sur Terre ; poids et masse.
4. **Les forces exercées par un support et par un fil.** Réaction d'un support ; tension d'un fil ; cas d'immobilité.
5. **Le principe d'inertie.** Modèle du point matériel ; énoncé ; immobilité et mouvement rectiligne uniforme ; forces qui se compensent ; contraposée.
6. **Forces et variation de la vitesse.** Somme des forces non nulle et variation du vecteur vitesse ; chute libre à une dimension, avec ou sans vitesse initiale.

---

## Chapitre 10 : Émission et perception d'un son

- **Titre court** : Son
- **Durée indicative** : 2 semaines
- **Partie du programme** : Ondes et signaux, 1. Émission et perception d'un son.
- **Notions couvertes** : [N64] à [N68].
- **Capacités** : [C82] à [C95].

**Objectifs**

- Je sais décrire l'émission d'un son par la vibration d'un objet et le rôle d'une caisse de résonance.
- Je sais expliquer le rôle du milieu matériel dans la propagation d'un son.
- Je sais citer la vitesse du son dans l'air et la comparer à d'autres vitesses.
- Je sais déterminer la période et la fréquence d'un signal périodique, et utiliser f = 1 / T.
- Je sais citer les domaines des sons audibles, des infrasons et des ultrasons.
- Je sais relier hauteur et fréquence, timbre et forme du signal, intensité et niveau d'intensité sonore.
- Je sais exploiter une échelle de niveaux d'intensité sonore et citer les dangers de l'exposition sonore.

**Sections prévues**

1. **Émettre un son.** Vibration d'un objet ; caisse de résonance ; chaîne émetteur-milieu-récepteur.
2. **La propagation d'un son.** Rôle du milieu matériel ; pas de propagation dans le vide ; vitesse dans l'air (environ 340 m·s<sup>−1</sup>), dans l'eau et les solides ; comparaison avec d'autres vitesses ; mesurer la vitesse du son.
3. **Signal périodique : période et fréquence.** Représentation temporelle ; motif, période T, fréquence f = 1 / T ; lecture d'un oscillogramme ; chaîne de mesure, microcontrôleur.
4. **Hauteur et timbre.** Domaines de fréquences (20 Hz à 20 kHz) ; infrasons, ultrasons ; hauteur et fréquence ; timbre et forme du signal.
5. **Intensité et niveau d'intensité sonore.** Amplitude, intensité sonore, niveau d'intensité sonore en décibels ; échelle non linéaire.
6. **Les dangers du bruit.** Échelle des niveaux ; seuils de danger et de douleur ; durée d'exposition ; protection de l'audition.

---

## Chapitre 11 : Vision et image

- **Titre court** : Lumière et image
- **Durée indicative** : 4 semaines
- **Partie du programme** : Ondes et signaux, 2. Vision et image.
- **Notions couvertes** : [N69] à [N77].
- **Capacités** : [C96] à [C109].

**Objectifs**

- Je sais citer la vitesse de la lumière dans le vide et la comparer à d'autres vitesses.
- Je sais distinguer lumière blanche et lumière colorée, spectre continu et spectre de raies.
- Je sais caractériser une radiation monochromatique par sa longueur d'onde.
- Je sais exploiter les lois de Snell-Descartes pour la réflexion et la réfraction.
- Je sais expliquer qualitativement la dispersion de la lumière blanche par un prisme.
- Je sais caractériser les foyers d'une lentille mince convergente et construire l'image d'un objet.
- Je sais déterminer un grandissement et modéliser l'œil.

**Sections prévues**

1. **La propagation de la lumière.** Propagation rectiligne, rayon lumineux ; vitesse dans le vide et dans l'air (3,00 × 10<sup>8</sup> m·s<sup>−1</sup>) ; comparaison avec la vitesse du son.
2. **Lumière blanche, lumière colorée et spectres.** Radiations, longueur d'onde dans le vide (400 à 800 nm pour le visible) ; spectres continus d'origine thermique (corps chaud) ; spectres de raies ; identifier une espèce par son spectre.
3. **Réflexion et réfraction.** Lois de Snell-Descartes ; indice optique n = c / v ; n<sub>1</sub> sin i<sub>1</sub> = n<sub>2</sub> sin i<sub>2</sub> ; déterminer un indice à partir de mesures.
4. **La dispersion de la lumière.** L'indice dépend de la longueur d'onde ; prisme, réseau ; arc-en-ciel.
5. **La lentille mince convergente.** Centre optique, axe optique, foyers, distance focale ; trois rayons particuliers.
6. **L'image d'un objet.** Construction graphique ; position, taille, sens ; grandissement γ = A'B' / AB (théorème de Thalès).
7. **L'œil.** Modèle de l'œil réduit : cristallin (lentille), rétine (écran), iris (diaphragme).

---

## Chapitre 12 : Signaux et capteurs

- **Titre court** : Circuits et capteurs
- **Durée indicative** : 2 semaines
- **Partie du programme** : Ondes et signaux, 3. Signaux et capteurs.
- **Notions couvertes** : [N78] à [N81].
- **Notions reprises** : [N1] à [N3] (mesures), courbe d'étalonnage ([N12]).
- **Capacités** : [C110] à [C119].

**Objectifs**

- Je sais mesurer une tension et une intensité en respectant les règles de sécurité.
- Je sais exploiter la loi des nœuds et la loi des mailles dans un circuit à deux mailles au plus.
- Je sais exploiter la caractéristique tension-courant d'un dipôle et trouver un point de fonctionnement.
- Je sais utiliser la loi d'Ohm.
- Je sais citer des capteurs de la vie quotidienne.
- Je sais utiliser une courbe d'étalonnage d'un capteur résistif.

**Sections prévues**

1. **Tension et intensité.** Voltmètre en dérivation, ampèremètre en série ; unités ; règles de sécurité.
2. **Loi des nœuds et loi des mailles.** Nœud, branche, maille ; circuits à deux mailles au plus ; calculs.
3. **La caractéristique d'un dipôle.** Tracé U = f(I) ou I = g(U) ; nuage de points (tableur ou Python) ; point de fonctionnement.
4. **La loi d'Ohm.** Dipôle ohmique, résistance (Ω) ; U = R × I ; situation de proportionnalité.
5. **Les capteurs.** Capteurs du quotidien ; capteurs résistifs (thermistance, photorésistance) ; courbe d'étalonnage ; microcontrôleur associé à un capteur.

---

## Table de correspondance

### Notions vers chapitres

| Notion | Intitulé abrégé | Chapitre principal | Repris dans |
| --- | --- | --- | --- |
| N1 à N3 | Variabilité, incertitude-type, écriture du résultat | 1 | 2, 12 |
| N4 à N12 | Corps purs, mélanges, identification, composition, solutions, concentration, étalonnage | 2 | 5 (N5, N6, N10), 6 (N6), 12 (N12) |
| N13 | Du macroscopique au microscopique | 3 | |
| N14 | Espèces moléculaires et ioniques, électroneutralité | 4 | |
| N15 | Entités chimiques | 3 | 4 |
| N16 à N19 | Noyau, Z et A, élément, masses et charges | 3 | 7 (N16 à N18) |
| N20 à N23 | Cortège électronique, configuration, valence, familles | 3 | 4 (N21 à N23) |
| N24 à N29 | Stabilité, gaz nobles, ions, molécules, Lewis, énergie de liaison | 4 | |
| N30 à N33 | Compter les entités, mole, quantité de matière | 4 | 6 (N33) |
| N34 à N37 | Transformation physique | 5 | 7 (N34) |
| N38 à N43 | Transformation chimique, synthèse | 6 | 7 (N39) |
| N44 à N46 | Transformation nucléaire | 7 | |
| N47 à N55 | Décrire un mouvement | 8 | 9 (N47, N54, N55) |
| N56 à N59 | Modéliser une action | 9 | |
| N60 à N63 | Principe d'inertie | 9 | |
| N64 à N68 | Son | 10 | |
| N69 à N77 | Vision et image | 11 | |
| N78 à N81 | Signaux et capteurs | 12 | |

**Bilan** : 81 notions sur 81 ont un chapitre principal. Notions non couvertes : **0**.

### Chapitres vers notions et capacités

| Chapitre | Notions (principal) | Notions reprises | Capacités |
| --- | --- | --- | --- |
| 1. Mesure | N1 à N3 | | C1 à C7 |
| 2. Corps purs et mélanges | N4 à N12 | N1 à N3 | C8 à C24 |
| 3. Atome | N13, N15 à N23 | | C25, C27 à C34 |
| 4. Entités et mole | N14, N24 à N33 | N15, N21 à N23 | C26, C35 à C41 |
| 5. Transformations physiques | N34 à N37 | N5, N6, N10 | C42 à C47 |
| 6. Transformations chimiques | N38 à N43 | N6, N33 | C48 à C57 |
| 7. Transformations nucléaires | N44 à N46 | N16 à N18, N34, N39 | C58 à C60 |
| 8. Mouvement | N47 à N55 | | C61 à C72 |
| 9. Forces et inertie | N56 à N63 | N47, N54, N55 | C73 à C81 |
| 10. Son | N64 à N68 | | C82 à C95 |
| 11. Lumière et image | N69 à N77 | | C96 à C109 |
| 12. Circuits et capteurs | N78 à N81 | N1 à N3, N12 | C110 à C119 |

**Bilan** : les 119 capacités [C1] à [C119] sont rattachées à un chapitre. Aucun chapitre ne sort du programme ; les rappels du collège (états de la matière, loi d'Ohm, vitesse du son) sont présentés comme tels.

## Points à trancher par l'enseignant

1. **Nombre de chapitres** : 12, au-delà des 6 à 9 visés pour STSS (qui en compte 10). Regroupements possibles : chapitres 3 et 4 (un seul chapitre « Modélisation de la matière à l'échelle microscopique ») ; chapitres 5 et 7 ; chapitres 8 et 9.
2. **Place de « Mesure et incertitudes »** : en chapitre 1, ou répartie dans les chapitres qui font des mesures.
3. **Chapitre 7 (nucléaire)** : il ne couvre que trois notions du programme ; il est complété par la comparaison des trois types de transformations. Ses 150 questions risquent des redites.
4. **Figures** : comme pour STSS, aucun schéma (pas de figure dans le cours). Les chapitres 8, 9, 11 et 12 (chronophotographies, vecteurs, construction d'images, circuits) gagneraient à recevoir des schémas dans une étape ultérieure.
5. **Valeurs de référence** retenues dans le cours : masse volumique de l'eau 1,0 g·mL<sup>−1</sup>, de l'air environ 1,2 g·L<sup>−1</sup> à 20 °C, vitesse du son dans l'air environ 340 m·s<sup>−1</sup>, vitesse de la lumière 3,00 × 10<sup>8</sup> m·s<sup>−1</sup>, g ≈ 9,8 N·kg<sup>−1</sup>, G = 6,67 × 10<sup>−11</sup> N·m<sup>2</sup>·kg<sup>−2</sup>, e = 1,6 × 10<sup>−19</sup> C : à vérifier contre le manuel de la classe.
