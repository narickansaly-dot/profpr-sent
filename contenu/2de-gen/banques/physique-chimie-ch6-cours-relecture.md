# Relecture du chapitre 6 de physique-chimie (2de) : « Les transformations chimiques »

Relecture indépendante (N = 6). Fichier corrigé : `chapitres/ch6.json` (dossier de travail de la session). La version du rédacteur reste dans `chapitres/ch6-redaction.json`.

## Bilan

- **Programme** : les notions N38 à N43 et les capacités C48 à C57 sont toutes traitées, dans les six sections du plan, dans l'ordre. N38 et C48 (modéliser à partir de données expérimentales) dans `systeme-reaction`, N39, N40 et l'ajustement dans `equation-reaction`, C51 dans `exemples`, N41, C49, C50 et C53 dans `reactif-limitant`, N42, C52 et C53 dans `effets-thermiques`, N43 et C54 à C57 dans `synthese`. Les notions reprises sont bien utilisées avec un renvoi : tests chimiques et CCM (N6, chapitre 2), quantité de matière (N33, chapitre 4). Les changements d'état (chapitre 5) sont seulement nommés. Rien n'est hors programme : la quantité de matière du fer est calculée avec la masse d'un atome et N<sub>A</sub>, sans masse molaire (notion de 1re). Les sept objectifs sont ceux du plan, à l'infinitif.
- **Exactitude** : toutes les équations ont été recomptées (éléments et charges) : combustions du carbone et du méthane, Fe et Zn avec H⁺, CaCO₃ avec H⁺, H⁺ + HO⁻, et l'estérification de l'acétate d'isoamyle (7 C, 16 H, 3 O de chaque côté). Tous les calculs ont été refaits : méthane 0,20 ÷ 1 = 0,20 mol contre 0,50 ÷ 2 = 0,25 mol, consommation 0,40 mol de O₂ et reste 0,10 mol ; fer 2,8 g ÷ 9,27 × 10⁻²³ g = 3,02 × 10²² atomes, soit 0,050 mol, contre 0,080 ÷ 2 = 0,040 mol pour H⁺ (H⁺ limitant) ; masse d'un atome de fer 55,85 ÷ 6,022 × 10²³ = 9,27 × 10⁻²³ g ; proportionnalité 4,0 × 0,125 ÷ 0,100 = 5,0 °C. Chiffres significatifs cohérents. Caractères thermiques vérifiés : combustions, HCl + soude, Mg + HCl exothermiques ; hydrogénocarbonate de sodium + vinaigre endothermique ; chaufferette à poudre de fer exothermique. Conventions françaises respectées : HO⁻, états (s), (l), (g), (aq), nombres stœchiométriques, Δθ = θ<sub>f</sub> − θ<sub>i</sub>.
- **Format** : classes `def`, `warn`, `tbl`, `t` ; `th scope` ; `sub` et `sup` ; aucune figure ; signe moins U+2212, « × », U+00A0. Champs en texte brut sans balise. HTML total : 22 264 caractères (21 970 avant relecture).
- **Validateur** : `pc.ts cours` (« Cours valide ») et `pc.ts typo` (« Typographie conforme ») passent après correction.

## Corrections

| Section | Problème | Correction |
| --- | --- | --- |
| `systeme-reaction` | La méthode de modélisation classait les espèces en réactifs et produits, sans dire quoi faire d'une espèce dont la quantité ne change pas. C'est pourtant le cas du diazote ou des ions spectateurs, traités plus loin. | Ajout : « Celles dont la quantité n'a pas changé sont spectatrices (voir plus loin). » |
| `equation-reaction` | « chaque élément chimique est présent en même nombre » : formulation ambiguë (ce qui se conserve, c'est le nombre d'atomes de chaque élément). | « chaque élément chimique est représenté par le même nombre d'atomes dans les réactifs et dans les produits ». |
| `exemples` | « gaz de ville » pour le méthane : expression ancienne (le gaz de ville historique était un gaz de houille, riche en dihydrogène et en monoxyde de carbone). | « principal constituant du gaz naturel, gazinière ». |
| `exemples` | Tableau bilan : « détonation » pour la corrosion du fer, comme si elle se produisait spontanément. | « détonation à l'approche d'une flamme » (test du dihydrogène). |
| `reactif-limitant` | Exemple résolu 2 : application numérique N = 2,8 ÷ (9,27 × 10⁻²³) sans unités, alors que les consignes demandent l'unité de chaque grandeur. | « 2,8 g ÷ (9,27 × 10⁻²³ g) ». |
| `synthese` | « l'essentiel de la vanilline utilisée est synthétisée » : accord fautif (« l'essentiel » est masculin). | « la plus grande partie de la vanilline utilisée est synthétisée ». |
| `synthese` | Légende du montage à reflux : il manquait la potence et les pinces, attendues dans un schéma légendé (C55). | Ajout : « Le ballon et le réfrigérant sont maintenus par des pinces fixées à une potence. » |
| `synthese` | C54 demande d'établir l'identité « à partir de données expérimentales » ; seule la CCM était citée. | Ajout : « Une mesure physique (chapitre 2) peut le confirmer. » |

Points vérifiés et laissés tels quels :

- les définitions du système chimique, de l'état initial et final, des réactifs, des produits, de la réaction chimique et de l'équation de réaction ;
- l'exemple du carbone dans le dioxygène (dioxygène limitant, carbone restant), et l'avertissement « une espèce présente dans l'état final n'est pas forcément un produit » ;
- l'avertissement sur les indices (H₂O et H₂O₂) ;
- la définition de l'espèce spectatrice, avec Cl⁻, l'eau solvant et le diazote de l'air ;
- la modélisation des solutions acides par H⁺(aq), et la mention de l'ion fer(II) ;
- la méthode du quotient n<sub>i</sub> ÷ a pour le réactif limitant, la notion de transformation totale et l'avertissement « pas forcément la plus petite quantité » ;
- le tableau d'identification du réactif limitant à partir de l'état final (calcaire et acide chlorhydrique) ;
- le protocole de suivi de température (matériel, sécurité, exploitation au tableur) et l'avertissement sur la différence entre température et énergie ;
- le principe du chauffage à reflux, l'ordre de la légende, l'entrée d'eau en bas, le haut du réfrigérant ouvert ;
- le protocole et l'exploitation de la CCM (dépôts A, B, C, éluant sous la ligne de dépôt, révélation UV ou diiode).

## Points de doute pour l'enseignant

1. **État de l'eau dans la combustion du méthane** : le chapitre écrit H₂O(g). C'est juste à la température de la flamme, mais certains manuels écrivent H₂O(l). Aligner sur le manuel de la classe.
2. **Ions hydrogène H⁺(aq)** : le chapitre modélise les solutions acides par H⁺(aq), usage courant en 2de. Si la classe utilise déjà l'ion oxonium H₃O⁺, les équations sont à adapter.
3. **Données fictives du magnésium** : Δθ d'environ 4 °C pour 0,100 g de Mg dans 50 mL. Le calcul théorique, sans pertes, donnerait plutôt 9 °C ; les valeurs sont annoncées comme fictives et restent proportionnelles, mais un manuel ou un relevé réel peut donner des valeurs plus élevées.
4. **Acide et calcaire, état final** : « le papier pH montre que la solution n'est plus acide ». En pratique, le dioxyde de carbone dissous laisse la solution légèrement acide (pH voisin de 5 à 6). La conclusion reste juste à ce niveau, mais on peut préférer « beaucoup moins acide ».
5. **Estérification** : la synthèse de l'acétate d'isoamyle est une transformation non totale (équilibre), alors que la section 4 ne traite que des transformations totales. Le chapitre ne la qualifie pas ; c'est cohérent avec le programme de 2de, mais un élève attentif peut poser la question. Les noms usuels « acide acétique » et « alcool isoamylique » sont gardés ; les noms systématiques (acide éthanoïque, 3-méthylbutan-1-ol) ne sont pas au programme de 2de.
6. **Exemple de transformation endothermique** : hydrogénocarbonate de sodium et vinaigre. L'effet est réel mais faible (quelques degrés) ; l'acide citrique et l'hydrogénocarbonate donnent un effet plus net si vous faites l'expérience.
7. **Longueur** : 22 264 caractères de HTML, un peu au-dessus de la fourchette de 15 000 à 22 000. Si vous voulez raccourcir, retirez d'abord la phrase sur les chaufferettes ou la ligne « magnésium et acide chlorhydrique » du tableau des effets thermiques.
