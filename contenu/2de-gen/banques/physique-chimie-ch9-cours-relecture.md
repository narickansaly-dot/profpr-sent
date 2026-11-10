# Relecture du chapitre 9 de physique-chimie (2de) : « Forces et principe d'inertie »

Relecture indépendante (N = 9). Fichier corrigé : `chapitres/ch9.json` (dossier de travail de la session). La version du rédacteur reste dans `chapitres/ch9-redaction.json`.

## Bilan

- **Programme** : les notions N56 à N63 et les capacités C73 à C81 sont toutes traitées, dans les six sections du plan, dans l'ordre. Modélisation d'une action, caractéristiques d'une force et diagramme objet-interactions (N56, N58, C73) ; actions de contact et à distance (C75) ; actions réciproques (N57, C74) ; force d'interaction gravitationnelle et poids, avec leur expression vectorielle (N59, C77, C78) ; forces connues a priori et forces déduites de la situation (C76) ; réaction d'un support et tension d'un fil dans des cas d'immobilité (N59, C79) ; point matériel, principe d'inertie et contraposée (N60 à N62, C80) ; variation du vecteur vitesse et chute libre à une dimension, avec et sans vitesse initiale (N63, C81). Les notions reprises N47, N54 et N55 (système, vecteur vitesse, mouvement rectiligne) sont seulement rappelées, avec renvoi au chapitre 8. Rien n'est hors programme. Les objectifs reprennent les sept objectifs du plan, à l'infinitif.
- **Exactitude** : tous les calculs ont été refaits. Flèche de 5,0 N à l'échelle 1 cm pour 2,0 N : 2,5 cm. Force Terre-Lune : 1,98 × 10²⁰ N (calcul : 1,985 × 10²⁰). Valeur de g retrouvée par G × m_T / R_T² : 9,81 N·kg⁻¹, donc g ≈ 9,8. Poids de 60 kg : 588 N, écrit 5,9 × 10² N ; sur la Lune 96 N. Lampe de 0,50 kg : 4,9 N, flèche de 2,45 cm, écrite « environ 2,5 cm ». Parachutiste de 80 kg : 784 N, écrit 7,8 × 10² N. Chronophotographie : les positions suivent bien y = ½ × g × t² avec Δt = 0,050 s, et les vitesses 0,24 ; 0,74 ; 1,22 ; 1,72 ; 2,20 m·s⁻¹ sont justes. Expression vectorielle de la force gravitationnelle (signe − avec le vecteur unitaire dirigé de A vers B), énoncé du principe d'inertie et de sa contraposée, sens de Δv⃗ : conformes aux conventions du secondaire.
- **Format** : classes `def`, `warn`, `tbl`, `t` ; `th scope` présents ; aucune figure ; vecteurs écrits avec la flèche combinante U+20D7 et nommés en toutes lettres ; signe moins U+2212 et « × » ; champs en texte brut sans balise. Longueur après correction : 20 993 caractères de HTML (sections de 2 881 à 3 996).
- **Validateur** : `pc.ts cours` (« Cours valide ») et `pc.ts typo` (« Typographie conforme ») passent après correction.

## Corrections

| Section | Problème | Correction |
| --- | --- | --- |
| `actions-reciproques` | Exemple de la nageuse : « le mur pousse la nageuse vers l'arrière » était faux ou ambigu : le mur la pousse dans le sens de son départ, en l'éloignant du mur. | « le mur pousse la nageuse, dans le sens qui l'éloigne du mur » ; réciproque : « dans le sens qui va vers le mur, de même norme ». |
| `actions-reciproques` | L'en-tête « Force exercée sur le premier objet » ne correspondait pas à la ligne Terre-Lune, où la force citée s'exerce sur le second objet (la Lune). | En-tête remplacé par « Une force ». |
| `gravitation-poids` | Définition du poids : « à sa surface » pouvait se lire comme la surface de l'objet. | « lorsque l'objet se trouve à la surface de la planète ou à son voisinage ». |
| `gravitation-poids` | L'expression vectorielle P⃗ = m × g⃗ (capacité C78) était donnée sans définir le vecteur g⃗. | Ajout d'une ligne : vecteur pesanteur, vertical, vers le bas, de norme g ; P⃗ a la même direction et le même sens. |
| `gravitation-poids` | La masse de la Terre était notée m_T dans l'exemple Terre-Lune puis M_T quelques lignes plus bas. | Notation unifiée : m_T. |
| `support-fil` | « Avec des frottements, la force est inclinée » : trop général (un livre sur une table horizontale subit une réaction verticale, même avec un contact rugueux), et en contradiction apparente avec le tableau du plan incliné. | « Quand des frottements interviennent (par exemple un objet retenu sur un plan incliné), la force peut être inclinée par rapport au support. » |
| `support-fil` | Sens de la tension « de l'objet vers le fil » : peu précis. | « de l'objet vers le point d'attache du fil ». |
| `principe-inertie` | « Ce principe vaut aussi dans d'autres référentiels, dits galiléens ; le référentiel terrestre en est un » : phrase logiquement confuse, et notion de référentiel galiléen hors programme de 2de (vue en 1re et en terminale). | « Ce principe n'est pas valable dans n'importe quel référentiel. Le référentiel terrestre convient pour les mouvements de courte durée étudiés dans ce chapitre. » |
| `forces-vitesse` | La conclusion de la chronophotographie disait seulement que la vitesse augmente, sans exploiter la régularité de la variation, utile pour relier Δv⃗ au poids constant (C81). | Ajout : la norme augmente à peu près de la même quantité, environ 0,5 m·s⁻¹, d'un intervalle à l'autre. |

Points vérifiés et laissés tels quels :

- les définitions d'action mécanique, de système extérieur, d'action de contact et à distance ;
- les quatre caractéristiques d'une force (point d'application compris) et le dynamomètre ;
- la méthode du diagramme objet-interactions (trait plein pour le contact, pointillés pour la distance) ;
- les deux avertissements sur les actions réciproques (deux systèmes différents ; « le plus gros attire le plus fort ») ;
- le domaine de validité de la loi de gravitation (répartition sphérique, objets petits devant la distance) ;
- l'avertissement masse et poids ;
- le tableau des cas d'immobilité, dont le plan incliné avec réaction verticale ;
- l'avertissement R⃗ et P⃗ ne sont pas réciproques ;
- le modèle du point matériel, la définition de forces qui se compensent, l'exemple du palet ;
- l'avertissement sur le point le plus haut d'un lancer vertical ;
- la description en phrases de ce que fait le tableur ou le programme Python.

## Points de doute pour l'enseignant

1. **Valeurs numériques** : G = 6,67 × 10⁻¹¹ N·m²·kg⁻², masse de la Terre 5,97 × 10²⁴ kg, de la Lune 7,35 × 10²² kg, distance Terre-Lune 3,84 × 10⁸ m, rayon terrestre 6,37 × 10⁶ m, g ≈ 9,8 N·kg⁻¹ sur Terre et 1,6 N·kg⁻¹ sur la Lune. Toutes justes en valeurs arrondies ; à aligner sur celles du manuel de la classe (certains prennent R_T = 6,38 × 10⁶ m ou 6 400 km).
2. **Point d'application** : le chapitre compte quatre caractéristiques d'une force, alors que le programme (C73) n'en cite que trois (norme, direction, sens). C'est l'usage courant des manuels, mais on peut le discuter.
3. **Effet de la masse** : la phrase « la variation de vitesse est d'autant plus faible que la masse du système est grande » est qualitative et n'est pas une capacité exigible. Elle prépare la deuxième loi de Newton (1re) ; la garder ou la retirer selon votre progression.
4. **Validité du principe d'inertie** : le terme « référentiel galiléen » a été retiré, car il relève de la 1re. Le cours dit seulement que le référentiel terrestre convient pour des mouvements de courte durée. Ajoutez le mot si votre manuel l'emploie dès la 2de.
5. **Contraposée** : le cours énonce le principe d'inertie sous la forme « si, et seulement si », puis donne comme contraposée « si le vecteur vitesse varie, les forces ne se compensent pas ». Certains manuels énoncent aussi la forme « si les forces ne se compensent pas, le vecteur vitesse varie », utilisée au début de la dernière section. Les deux sont justes avec l'énoncé « si, et seulement si ».
6. **Représentation du poids et de la tension** : le cours applique toutes les forces au centre de l'objet (point matériel), sauf la tension, appliquée au point d'attache. Sans figure, l'élève doit se le représenter seul : un schéma serait utile dans une étape ultérieure.
7. **Diagramme objet-interactions** : conventions de tracé (bulle de couleur, traits pleins et pointillés) variables d'un manuel à l'autre ; vérifier qu'elles correspondent à celles de la classe.
