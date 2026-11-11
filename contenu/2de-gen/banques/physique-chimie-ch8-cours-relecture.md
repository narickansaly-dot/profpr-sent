# Relecture du chapitre 8 de physique-chimie (2de) : « Décrire un mouvement »

Relecture indépendante (N = 8). Fichier corrigé : `chapitres/ch8.json` (dossier de travail de la session). La version du rédacteur reste dans `chapitres/ch8-redaction.json`.

## Bilan

- **Programme** : les notions [N47] à [N55] et les capacités [C61] à [C72] sont toutes traitées, dans les six sections du plan et dans l'ordre : [N47], [N48] et [C61] dans `systeme-echelles` (tableau d'échelles de l'électron à la galaxie, méthode) ; [N49], [C62] et [C63] dans `referentiel` (trois référentiels, relativité, translation et exemple du train) ; [N50], [N51], [C64] et [C65] dans `modele-du-point` (pertes d'informations : rotation, déformation, autres points ; trajectoires rectiligne, circulaire, curviligne) ; [C66] et [C70] dans `chronophotographie` (vidéo, pointage, programme Python à une ou deux dimensions) ; [N52] à [N54], [C67], [C68] et [C71] dans `vecteur-vitesse` ; [N55], [C69] et la variation du vecteur vitesse de [C70] dans `mouvements-rectilignes`. [C72] (vecteurs, grandeurs algébriques) est traité par les coordonnées signées de position et de vitesse. Rien n'est hors programme : la vitesse moyenne du collège est présentée comme un rappel, le lien entre forces et variation de la vitesse est seulement nommé avec un renvoi au chapitre 9, l'incertitude de pointage avec un renvoi au chapitre 1. Les six objectifs du plan sont repris à l'infinitif.
- **Exactitude** : tous les calculs ont été refaits.
  - Échelles : Terre-Lune 3,8 × 10⁸ m ; 27 jours = 27 × 86 400 s = 2,3 × 10⁶ s, et 2,4 × 10⁶ s avec la période sidérale de 27,3 jours : la valeur affichée est juste ; 1 an = 3,16 × 10⁷ s, soit 3,2 × 10⁷ s ; Voie lactée d'environ 10²¹ m (100 000 années de lumière ≈ 9,5 × 10²⁰ m) ; période de révolution du Soleil dans la galaxie supérieure à 100 millions d'années : justes.
  - Ordres de grandeur : 0,065 m de l'ordre de 10⁻¹ m : juste quelle que soit la convention d'arrondi.
  - Train : 20 + 1,5 = 21,5 m·s⁻¹ et 20 − 1,5 = 18,5 m·s⁻¹ : justes.
  - Coureur : 100 / 12,5 = 8,0 m·s⁻¹ ; conversion 8,0 × 3,6 = 28,8 ≈ 29 km·h⁻¹ ; 90 / 3,6 = 25 m·s⁻¹ ; 1 m·s⁻¹ = 3,6 km·h⁻¹ : justes.
  - Représentation : 0,060 / 0,040 = 1,5 m·s⁻¹ ; flèche de 1,5 / 0,50 = 3,0 cm : justes.
  - Chariots : A, écarts de 2,0 cm, 0,020 / 0,10 = 0,20 m·s⁻¹ ; B, écarts 1,0 ; 3,0 ; 5,0 ; 7,0 cm, d'où 0,10 ; 0,30 ; 0,50 ; 0,70 m·s⁻¹, augmentation de 0,20 m·s⁻¹ par intervalle : justes. Vidéo à 25 images par seconde : 1/25 s = 0,040 s, juste.
  - Définitions vérifiées : système, référentiel (objet de référence, repère, horloge), référentiels géocentrique et héliocentrique (centre et axes vers des étoiles lointaines), translation, trajectoire, vecteur déplacement, vecteur vitesse moyenne, vecteur vitesse approché par MM'/Δt (origine M, direction proche de la tangente, sens du mouvement), mouvements rectilignes uniforme, accéléré et ralenti, variation Δ𝑣⃗ = 𝑣⃗₂ − 𝑣⃗₁ et son sens.
- **Format** : classes `def`, `warn`, `tbl`, `t` ; `th scope` ; `sub`/`sup` ; aucune figure ; signe moins U+2212 ; « × » ; vecteur vitesse noté avec la flèche combinante U+20D7 ; champs en texte brut sans balise. Longueur du HTML : 21 870 caractères environ (sections de 3 199 à 4 507 caractères ; `vecteur-vitesse` dépasse de quelques caractères la cible de 4 500).
- **Validateur** : `pc.ts cours` (« Cours valide », 6 sections) et `pc.ts typo` (« Typographie conforme ») passent après correction.

## Corrections

| Section | Problème | Correction |
| --- | --- | --- |
| `systeme-echelles` | Exemple d'ordre de grandeur ambigu : 384 400 km = 3,844 × 10⁸ m donne 10⁸ m avec la règle « mantisse < 5 », mais 10⁹ m avec la règle « mantisse < √10 ≈ 3,16 », toutes deux utilisées dans les manuels. | Exemple remplacé par « 150 millions de kilomètres, soit 1,5 × 10¹¹ m, est de l'ordre de 10¹¹ m », juste avec les deux règles. |
| `systeme-echelles` | Électron : « bien moins d'une nanoseconde (10⁻⁹ s) » laissait croire que l'échelle temporelle est 10⁻⁹ s. | « bien moins d'une nanoseconde (1 ns = 10⁻⁹ s) ». |
| `systeme-echelles` | Voiture : « 10³ à 10⁴ s (quelques heures) » est incohérent, 10³ s valant environ 17 minutes. | « (de quelques dizaines de minutes à quelques heures) ». |
| `systeme-echelles` | « L'unité astronomique » employée sans définition. | Ajout de « (ua, distance moyenne Terre-Soleil) ». |
| `referentiel` | « Les vitesses mesurées dans les deux référentiels diffèrent de la vitesse du train » : phrase ambiguë (on pouvait comprendre « sont différentes de la vitesse du train »). | « la vitesse d'un même objet n'est pas la même dans les deux référentiels : pour un mouvement le long de la voie, on ajoute ou on retranche la vitesse du train ». |
| `referentiel` | La bille « tombe verticalement dans le référentiel du train » : vrai seulement si le train roule en ligne droite à vitesse constante. | Ajout de « dans ce train qui roule en ligne droite à vitesse constante ». |
| `modele-du-point` | La valve d'une roue, située un peu à l'intérieur du pneu, ne décrit pas exactement une cycloïde (courbe d'un point du bord qui roule) ; le mot n'est par ailleurs pas au programme. | « elle décrit une courbe faite d'arceaux successifs ». |
| `chronophotographie` | « L'alignement des points donne la forme de la trajectoire » suggérait une trajectoire toujours droite. | « La disposition des points donne la forme de la trajectoire ». |
| `vecteur-vitesse` | « Norme de la vitesse moyenne » : imprécis à côté d'une définition vectorielle. | « norme du vecteur vitesse moyenne ». |
| `vecteur-vitesse` | Programme des vecteurs vitesse : paragraphe dont le sujet (« il calcule ») n'était pas nommé, et forme différente de celle du premier programme (liste entrées, traitement, sortie). | Mis en liste Entrées, Calcul, Sortie, avec « le programme Python calcule ». |

Points vérifiés et laissés tels quels :

- la définition de l'ordre de grandeur comme « puissance de 10 la plus proche » ;
- le tableau des trois référentiels et la méthode de choix ;
- l'avertissement sur « immobile » et « en mouvement » ;
- la définition de la translation (segment de direction constante) et ses exemples ;
- l'avertissement « le modèle du point ne dit pas que l'objet est petit » ;
- les coordonnées comme grandeurs algébriques (x = −2,0 m, vₓ = −0,30 m·s⁻¹) ;
- le protocole vidéo (matériel, échelle, pointage, précautions) ;
- l'avertissement distance parcourue et distance MM' ;
- l'avertissement sur le mouvement circulaire uniforme ;
- le tableau des trois mouvements rectilignes et le sens de la variation du vecteur vitesse.

## Points de doute pour l'enseignant

1. **Ordre de grandeur** : le chapitre le définit comme « la puissance de 10 la plus proche », sans donner de règle d'arrondi. Les exemples ont été choisis pour être justes avec les deux règles courantes (mantisse < 5 ou < √10). Préciser la règle de votre manuel si nécessaire.
2. **Addition des vitesses** : l'exemple du train (21,5 et 18,5 m·s⁻¹) illustre [C63] par une composition des vitesses sur une même droite. Le programme ne demande pas de loi de composition ; l'exemple reste qualitatif dans son esprit, mais vous pouvez le présenter comme une simple observation.
3. **Notation du vecteur déplacement** : la flèche au-dessus de MM' est décrite en mots (« MM' surmonté d'une flèche ») faute de rendu fiable de la flèche combinante sur deux lettres et une prime. Vérifier le rendu dans l'application.
4. **Échelles temporelles** : l'échelle de l'électron (« bien moins d'une nanoseconde ») et la période du Soleil dans la galaxie (« plus de 100 millions d'années ») sont volontairement vagues. Les manuels donnent souvent 10⁻¹⁶ s et 2 × 10⁸ ans environ.
5. **Δt ou τ** : les deux notations sont introduites pour la durée entre deux images. Vérifier que cela correspond à l'usage de votre manuel.
6. **Longueur** : la section `vecteur-vitesse` (4 507 caractères) dépasse très légèrement la cible de 4 500. Si vous voulez raccourcir, retirez d'abord l'exemple de conversion 8,0 m·s⁻¹ → 29 km·h⁻¹.
