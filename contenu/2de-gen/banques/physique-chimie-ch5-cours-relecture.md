# Relecture du chapitre 5 de physique-chimie (2de) : « Les transformations physiques »

Relecture indépendante (N = 5). Fichier corrigé : `chapitres/ch5.json` (dossier de travail de la session). La version du rédacteur reste dans `chapitres/ch5-redaction.json`.

## Bilan

- **Programme** : les notions N34 (écriture symbolique), N35 (modélisation microscopique), N36 (endothermique et exothermique) et N37 (énergie de changement d'état et applications) sont toutes traitées. Les capacités C42 (exemples de la vie courante et du cycle de l'eau), C43 (équation d'un changement d'état, méthode et cinq exemples), C44 (fusion et dissolution, tableau comparatif et méthode), C45 (sens du transfert thermique, tableau des six changements d'état), C46 et C47 (Q = m × L, trois exemples résolus, proportionnalité à la masse) le sont aussi. Les cinq sections suivent le plan, dans l'ordre. Les notions reprises sont bien présentées comme des rappels : N5 et N6 (corps pur, température fixe de changement d'état, palier, renvoi au chapitre 2, qui annonce bien le chapitre 5), N10 (soluté, solvant, solution). Rien n'est hors programme : la transformation chimique est seulement nommée, avec un renvoi au chapitre 6.
- **Exactitude** : calculs refaits. 0,200 × 3,34 × 10⁵ = 6,68 × 10⁴ J ; 0,250 × (−3,34 × 10⁵) = −8,35 × 10⁴ J ; 1,0 × 10⁵ ÷ 3,34 × 10⁵ = 0,299 kg, arrondi à 0,30 kg avec deux chiffres significatifs ; 2,26 × 10⁶ ÷ 3,34 × 10⁵ ≈ 6,8 (« presque 7 fois ») ; 5 g + 100 g = 105 g. Les valeurs de l'eau sont justes : L(fusion) = 3,34 × 10⁵ J·kg⁻¹ (333,5 kJ·kg⁻¹ en valeur tabulée), L(vaporisation) = 2,26 × 10⁶ J·kg⁻¹ à 100 °C. Les noms des six changements d'état suivent la convention de l'enseignement secondaire français (liquéfaction pour gaz → liquide, condensation pour gaz → solide). Les équations s'écrivent avec la même formule des deux côtés et les symboles (s), (l), (g).
- **Format** : champs en texte brut sans balise (`resume`, `chapeau`, `objectifs`) ; objectifs à l'infinitif, terminés par « ; » et « . » ; classes `def`, `warn`, `tbl`, `t` ; `th scope` ; indices et exposants en `sub`/`sup` ; signe moins U+2212 ; « × » ; aucune figure. Environ 19 800 caractères de HTML pour les cinq sections, dans la fourchette.
- **Validateur** : `pc.ts cours` (« Cours valide ») et `pc.ts typo` (« Typographie conforme ») passent, avant et après correction.

## Corrections

| Section | Problème | Correction |
| --- | --- | --- |
| `changements-etat` | La définition de la transformation physique (« modifie l'état physique ou l'aspect d'une espèce ») ne couvrait pas la dissolution, que la section 3 présente pourtant comme une transformation physique mettant en jeu deux espèces. « L'aspect » était aussi trop vague. | « modifie l'état physique d'une espèce chimique, ou la façon dont des espèces sont mélangées (une dissolution, par exemple), sans créer de nouvelle espèce ». |
| `fusion-dissolution` | Le tableau définit la fusion par « une seule espèce », mais l'exemple donné était le beurre, qui est un mélange. | Exemple remplacé par « un glaçon qui fond sur une assiette ». |
| `fusion-dissolution` | Méthode : « un solide et un liquide différents : c'est sans doute une dissolution ». Faux si le solide est insoluble (sable dans l'eau). | « ce peut être une dissolution, si le solide disparaît dans le liquide ». |
| `endothermique-exothermique` | « Le changement d'état inverse libère la même quantité d'énergie » : il manquait la condition de masse. | « Pour une même masse, le changement d'état inverse libère la même quantité d'énergie ». |
| `energie-changement-etat` | Troisième exemple : l'application numérique « 1,0 × 10⁵ ÷ 3,34 × 10⁵ » se lit, selon les priorités opératoires, comme (1,0 × 10⁵ ÷ 3,34) × 10⁵. | Parenthèses ajoutées autour du dénominateur. |
| `energie-changement-etat` | Troisième exemple : pas de ligne « Données », contrairement aux deux premiers et à la méthode annoncée dans les consignes ; L non indicé (fusion). | Ligne « Données : Q = 1,0 × 10⁵ J ; L(fusion) = 3,34 × 10⁵ J·kg⁻¹ » ajoutée ; formule écrite avec L(fusion). |
| `energie-changement-etat` | Conservation des aliments : « plus la masse est grande, plus c'est long » sautait le lien avec l'énergie, qui est l'objet de la capacité C47. | « plus la masse d'eau est grande, plus l'énergie à retirer est grande, et plus c'est long ». |

Points vérifiés et laissés tels quels :

- le tableau des six changements d'état et l'avertissement sur le mot « condensation » dans la langue courante ;
- évaporation et ébullition, deux formes de la vaporisation ; ébullition de l'eau à 100 °C sous la pression atmosphérique normale ;
- le cycle de l'eau (vaporisation, liquéfaction, condensation, solidification, fusion, sublimation de la neige) ;
- le tableau du modèle microscopique (organisation, distance, agitation ; états compact et dispersé) ;
- la conservation de la masse, la variation du volume et l'exception de l'eau (la glace flotte, la bouteille éclate) ;
- les définitions de système, milieu extérieur, transfert thermique, endothermique, exothermique ;
- les exemples de la transpiration, du givre, du réfrigérateur et de l'arrosage des agrumes ;
- l'avertissement sur le palier de température (énergie reçue sans hausse de température) ;
- l'avertissement sur la conversion des grammes en kilogrammes ;
- la brûlure par la vapeur d'eau et la remarque sur les poches de froid « instantané » (dissolution, pas changement d'état).

## Points de doute pour l'enseignant

1. **Condensation ou liquéfaction** : le chapitre suit la convention de nombreux manuels de 2de (liquéfaction : gaz → liquide ; condensation : gaz → solide). D'autres manuels parlent de « condensation liquide » et de « condensation solide », ou nomment le passage gaz → solide « déposition ». Vérifier le vocabulaire de votre manuel.
2. **Convention de signe** : le chapitre donne L et Q positifs pour un changement d'état endothermique, négatifs pour un changement d'état exothermique (L(solidification) = −L(fusion)). Certains manuels gardent L toujours positif et indiquent le sens du transfert en mots. Harmoniser avec le manuel et avec les futures banques de questions.
3. **Fusion du sucre** : l'exemple du sucre chauffé seul dans une casserole est classique, mais le saccharose se décompose presque en même temps qu'il fond. Le texte le signale (« se transforme ensuite en caramel ») ; un exemple plus propre serait un métal ou la glace.
4. **Mélanges qui changent d'état** : le chocolat (section 1) et le liquide d'un briquet sont des mélanges, alors que la définition parle d'« une espèce ». C'est un choix de vie courante acceptable au niveau 2de, mais un élève attentif peut relever l'écart avec le chapitre 2 (pas de palier pour un mélange).
5. **Route salée** : « la glace fond même un peu en dessous de 0 °C » reste qualitatif. L'abaissement réel dépend de la quantité de sel (jusqu'à environ −20 °C pour une eau saturée). Aucune valeur n'est donnée, volontairement.
6. **Poche de froid** : le plan citait la « poche de froid » parmi les applications de Q = m × L. Le rédacteur l'a traitée par les blocs réfrigérants de glacière et a précisé que les poches de froid « instantané » fonctionnent par dissolution. Ce choix est exact ; vérifier qu'il convient à votre progression.
7. **Valeurs de L** : 3,34 × 10⁵ et 2,26 × 10⁶ J·kg⁻¹ sont des valeurs arrondies courantes ; certains manuels donnent 3,3 × 10⁵ ou 333 kJ·kg⁻¹. Vérifier contre le manuel de la classe.
