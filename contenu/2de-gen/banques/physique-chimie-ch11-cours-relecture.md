# Relecture du chapitre 11 de physique-chimie (2de) : « Vision et image »

Relecture indépendante (N = 11). Fichier corrigé : `chapitres/ch11.json` (scratchpad de la session). La version du rédacteur reste dans `chapitres/ch11-redaction.json`.

## Bilan

- **Programme** : les notions N69 à N77 et les capacités C96 à C109 sont toutes traitées, dans les sept sections du plan, dans l'ordre. Propagation rectiligne et rayon lumineux (N69), vitesse de la lumière comparée au son et à une voiture (N70, C96), lumière blanche et colorée, radiation monochromatique (N71), longueur d'onde dans le vide ou dans l'air (N73, C98), spectre continu d'un corps chaud et spectre de raies (N72, C97, C99), lois de Snell-Descartes et indice (N74, C100, C101), dispersion par un prisme ou un réseau (N75, C102, C103), lentille mince convergente, foyers, distance focale, construction de l'image et grandissement (N76, C104 à C106, C108), théorème de Thalès (C109), œil réduit (N77, C107). Rien n'est hors programme : l'accommodation est une description qualitative du modèle de l'œil ; la vergence et la relation de conjugaison ne sont pas introduites. Le rappel du collège est signalé comme tel ; le son est renvoyé au chapitre 10. Les objectifs reprennent les sept objectifs du plan, à l'infinitif.
- **Exactitude** : calculs refaits. 130 km·h⁻¹ ≈ 36 m·s⁻¹ ; 3,00 × 10⁸ ÷ 340 ≈ 8,8 × 10⁵, soit « environ un million » ; orage : 340 × 3,0 = 1 020 m, arrondi à 1,0 × 10³ m (deux chiffres significatifs), durée de trajet de la lumière 3,4 × 10⁻⁶ s ; vitesse dans l'eau 3,00 × 10⁸ / 1,33 = 2,26 × 10⁸ m·s⁻¹ ; réfraction air-eau à 40° : sin 40° = 0,643, sin i₂ = 0,483, i₂ = 28,9° ≈ 29°. Le tableau fictif air-plexiglas est cohérent avec n = 1,50 (chaque i₂ recalculé arrondi au degré redonne la valeur du tableau ; n calculé point par point entre 1,42 et 1,54). Exemple de lentille : la relation de conjugaison (non donnée aux élèves) confirme OA' = 7,5 cm pour f' = 5,0 cm et OA = 15,0 cm ; γ = 0,50, A'B' = 1,0 cm. Valeurs vérifiées : c = 299 792 458 m·s⁻¹, indices de l'eau (1,33), du verre (environ 1,5) et du diamant (2,42), raies de l'hydrogène (410, 434, 486, 656 nm), doublet du sodium vers 589 nm, domaine visible 400 à 800 nm (valeur du plan), violet plus dévié que le rouge par un prisme, tableau des positions objet-image (plus de 2f', 2f', entre 2f' et F, entre F et O).
- **Format** : classes `def`, `warn`, `tbl`, `t` ; `th scope` ; aucune figure, aucun code ; `sub`/`sup` pour les indices et exposants ; 16 signes moins U+2212, « × » ; 185 vraies U+00A0, aucune entité `&nbsp;`, aucune espace ordinaire avant « : ; ! ? ». Les champs en texte brut (`titre`, `titre_court`, `resume`, `chapeau`, `objectifs`) ne contiennent aucune balise. Longueur du HTML : 21 996 caractères (21 940 avant relecture), dans la fourchette de 15 000 à 22 000.
- **Validateur** : `pc.ts cours` (« Cours valide », 7 sections) et `pc.ts typo` (« Typographie conforme ») passent après correction.

## Corrections

| Section | Problème | Correction |
| --- | --- | --- |
| `lumiere-spectres` | Liste du spectre continu : le dernier point se terminait par « ; ». | Point final. |
| `lumiere-spectres` | « comme une empreinte digitale » : image redondante (supprimée pour rester dans la longueur maximale). | Phrase allégée, sens inchangé. |
| `reflexion-refraction` | La réfraction était définie comme un passage « en changeant de direction » : faux en incidence normale. | « en changeant en général de direction ». |
| `reflexion-refraction` | C101 demande de tester **les** lois de Snell-Descartes : le protocole ne testait que la réfraction. | « On vérifie aussi que r = i₁. » |
| `dispersion` | Le réseau était présenté juste après une explication par la réfraction, sans préciser qu'il disperse par un autre phénomène : un élève pouvait croire que le réseau réfracte. | « mais par un autre phénomène que la réfraction ». |
| `lentille-convergente` | Une lentille était définie par des faces « bombées » : une lentille divergente a des faces creuses. | « dont l'une au moins est courbe (en général sphérique) ». |
| `lentille-convergente` | Protocole du foyer image : avec un objet lointain (un arbre), on obtient une image nette, pas « le point lumineux le plus petit ». | « jusqu'à obtenir une image nette de cet objet lointain ». |
| `image-objet` | Configuration de Thalès incomplète : l'alignement de A, O et A' sur l'axe manquait. | « A, O et A' alignés sur l'axe ; B, O et B' alignés ; AB et A'B' parallèles ». |
| `propagation-lumiere` | Phrase sur la propagation dans le vide plus longue que nécessaire (raccourcie pour la longueur). | « la lumière se propage aussi dans le vide ». |
| `oeil` | Paragraphe « Comment on voit » en trois propositions lourdes. | Une phrase, même contenu. |

Points vérifiés et laissés tels quels :

- les définitions de milieu transparent et homogène, de rayon et de faisceau, et le rayon présenté comme un modèle ;
- la valeur exacte de c suivie de la valeur arrondie à retenir ;
- la radiation définie comme « une lumière d'une seule couleur, qu'on ne peut pas décomposer », avec le laser comme exemple ;
- le spectre continu qui dépend de la température et non de la nature du corps ;
- la méthode d'identification par les raies (toutes les raies de référence doivent être présentes) ;
- les notations i₁, i₂ et r, et l'avertissement sur la mesure des angles par rapport à la normale ;
- les trois rayons particuliers, la représentation de la lentille convergente (flèches vers l'extérieur) et l'avertissement sur F et F' ;
- la méthode de construction de l'image avec deux rayons ;
- la correspondance iris-diaphragme, cristallin-lentille, rétine-écran, et l'avertissement œil / banc d'optique.

## Points de doute pour l'enseignant

1. **Grandissement en longueurs ou en mesures algébriques** : le chapitre définit γ = A'B' / AB avec des longueurs, donc γ est toujours positif et le sens de l'image est donné à part (« renversée »). Beaucoup de manuels de 2de utilisent des mesures algébriques (barres sur A'B' et AB) : γ est alors négatif pour une image renversée. Vérifier la convention du manuel de la classe ; une phrase de mise en garde a été retirée pour respecter la longueur maximale et peut être remise.
2. **Domaine visible 400 à 800 nm** : c'est la valeur du plan. Beaucoup de manuels donnent 400 à 750 nm, ou 380 à 780 nm. À aligner sur le manuel.
3. **Indice du verre « environ 1,5 »** et tableau fictif du plexiglas (n ≈ 1,5) : valeurs usuelles, à vérifier contre le manuel. Le point à 10° donne n ≈ 1,42 à cause de l'arrondi au degré : c'est un bon support pour discuter la précision des mesures, mais un élève peut s'en étonner.
4. **Arc-en-ciel** : les gouttes sont présentées comme « de petits prismes ». C'est une simplification : la lumière y subit deux réfractions et une réflexion à l'intérieur de la goutte.
5. **Réseau** : le chapitre dit seulement qu'il disperse par un autre phénomène que la réfraction (la diffraction, hors programme de 2de), sans le nommer. Avec un réseau, c'est le rouge qui est le plus dévié, contrairement au prisme ; ce point n'est pas mentionné.
6. **Accommodation** : présentée qualitativement (cristallin plus bombé, distance focale plus petite). Elle n'est pas citée explicitement par le programme, mais aide à « modéliser l'œil ». À retirer si l'enseignant la juge hors programme.
7. **Construction de l'image** : la méthode n'utilise que deux rayons (par O et parallèle à l'axe). Le troisième rayon (par F) peut servir de vérification ; il est donné dans le tableau de la section précédente.
8. **Figures** : comme le prévoit le plan (point 4), ce chapitre gagnerait à recevoir des schémas (réfraction, prisme, lentille, construction de l'image, œil réduit) dans une étape ultérieure.
