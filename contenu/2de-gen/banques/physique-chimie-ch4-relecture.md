# Relecture de la banque du chapitre 4 de physique-chimie (2de) contre le cours

Relecture des 150 questions de `physique-chimie-ch4.json` contre le texte du chapitre « Ions, molécules et quantité de matière » (`pc.ts texte 4`), question par question, sans échantillonnage. Critères : exactitude scientifique et conformité au cours, chaque calcul refait (valeur, puissance de 10, unité, arrondi, marge), lecture unique, bonne(s) réponse(s) seules justes et distracteurs faux sans ambiguïté, explication, niveau 2de, aucune donnée extérieure au chapitre (les données des calculs et les numéros atomiques sont dans l'énoncé), aucune question sur une donnée fictive du cours, variantes des réponses courtes, reformulations proches, réponse lisible dans l'énoncé, bonne réponse repérable par sa longueur. Typographie (espace insécable, Unicode, absence de HTML) contrôlée par script puis par le vérificateur.

## Questions corrigées et remplacées

| Source | Problème | Décision |
|---|---|---|
| physique-chimie-2de:ch4:banque:004 | Charge de Ca²⁺ positive : la réponse « +3,2 » d'un élève qui écrit le signe était refusée. | Corrigée : variante « +3,2 » ajoutée. |
| physique-chimie-2de:ch4:banque:019 | « contient 3,0 × 10²² ions Na⁺ et des ions Cl⁻ seulement » : tournure ambiguë (« seulement » semble porter sur la quantité d'ions Cl⁻). | Corrigée : « Un cristal de sel, formé uniquement d'ions Na⁺ et Cl⁻, contient 3,0 × 10²² ions Na⁺. » |
| physique-chimie-2de:ch4:banque:046 | Distracteur non plausible : « La simple liaison H–H elle-même » est-elle plus difficile à rompre que H–H. | Corrigée : quatre comparaisons tirées du classement du cours (N≡N > H–H, O=O > H–H vraies ; Cl–Cl > H–H, O=O > N≡N fausses) ; explication reprise. |
| physique-chimie-2de:ch4:banque:058 | Bonne réponse nettement plus longue que les distracteurs, seule à parler de neutralité. | Corrigée : distracteurs allongés et construits sur le même modèle. |
| physique-chimie-2de:ch4:banque:068 | Distracteur « Un atome de duet 1s² » mal formulé ; bonne réponse la plus longue. | Corrigée : « Un ion qui a le duet 1s² de l'hélium » et « Un électron seul, sans son noyau ». |
| physique-chimie-2de:ch4:banque:073 | Notion « Noms et formules des ions » pour le nom d'un composé ionique, traité dans la section des composés ioniques. | Corrigée : notion « Composés ioniques ». |
| physique-chimie-2de:ch4:banque:085 | Réponse lisible dans l'énoncé : l'énoncé écrivait « O=C=O », qui montre les deux liaisons doubles. | Corrigée : l'énoncé nomme le dioxyde de carbone CO₂ sans son schéma. |
| physique-chimie-2de:ch4:banque:088 | Bonne réponse deux fois plus longue que les distracteurs. | Corrigée : distracteurs allongés (rupture des liaisons, formation d'ions, départ des atomes H). |
| physique-chimie-2de:ch4:banque:044 | Reformulation proche de la 073 (« Dans le nom d'un composé ionique, on cite l'anion en premier » / « quel ion cite-t-on en premier ? »). | Remplacée : vrai/faux (vrai, difficulté 1, notion « Composés ioniques ») sur l'ordre dans la formule statistique (cation en premier). |
| physique-chimie-2de:ch4:banque:137 | Reformulation proche de la 147 (écriture Ca⁺² contre Ca²⁺). | Remplacée : vrai/faux (faux, difficulté 1) sur le nom d'un anion monoatomique (« -ure », et non « ion » + nom de l'élément). |

## Totaux

- Gardées sans changement : 140
- Corrigées : 8 (004, 019, 046, 058, 068, 073, 085, 088)
- Remplacées : 2 (044, 137)

Répartition après relecture : types 75 / 30 / 30 / 15 (vrai/faux : 15 vrais, 15 faux ; qcm_multiple : 13 à 2 bonnes réponses, 17 à 3) ; difficultés 60 / 60 / 30 ; bonne réponse des qcm_unique en position 1 à 4 : 19 / 19 / 19 / 18. `PC_CHAPITRE=… npx tsx pc.ts verifier 4` : « Banque du chapitre 4 conforme : 150 questions. »

Calculs refaits sans erreur : 004, 012, 018, 054, 070, 077, 091, 097, 100, 101, 110, 115, 116, 121, 130, 148 (masses d'entités, nombres d'entités, quantités de matière, conversions g → kg, charges). Les distracteurs numériques correspondent bien aux erreurs classiques (masse en grammes non convertie, division inversée, puissance de 10 fausse, un seul atome H compté).

Points jugés acceptables :

- 005, 009, 047, 081 utilisent les ions Li⁺ et S²⁻, et 043 l'ion oxyde O²⁻ : ils figurent dans le tableau des charges et l'exemple résolu du cours, même s'ils ne sont pas dans la liste des ions à connaître.
- 125 (chlorométhane CH₃Cl) et 027, 032 (ions X³⁻ et M) portent sur des entités absentes du cours, mais l'énoncé donne la structure ou la formule et la question applique la méthode du cours.
- 116 accepte « 2,66 » avec une marge de 0,01 : la valeur exacte 2,658 est dans la marge.
- 011, 063, 096, 139, 144 : bonne réponse un peu plus longue que les distracteurs, la longueur tenant à la justification demandée ; 8 qcm_unique sur 75 avaient la bonne réponse strictement la plus longue avant relecture, bien en dessous du seuil de 40 %.

## Points de doute pour l'enseignant

1. **Difficultés mal cotées** : 017 (liaison triple plus difficile à rompre), 103 (4 doublets non liants dans CO₂, lu dans le tableau du cours) et 048 (Al₂O₃ inversé) sont cotées 3 pour une lecture directe du cours ; à l'inverse 055 (CH₄ à partir de 4 liaisons C–H) est cotée 2 pour une déduction immédiate. Gardées pour respecter les quotas.
2. **Redites d'idée** : 003 et 020 (identifier les gaz nobles) ; 024, 068 et 071 (l'ion H⁺ sans électron) ; 050 et 124 (H, Li, Be visent un duet) ; 010, 030, 034, 041, 060 et 087 (duet et octet du néon, de l'argon, de l'hélium) ; 025, 098, 122 et 132 (le sodium et la configuration du néon) ; 016 et 150 (électrons de Mg²⁺) ; 029 et 037 (CaCl₂ n'est pas une molécule) ; 033 et 049 (associations ion-formule) ; 017, 039, 046, 114, 129 et 141 (classement des énergies de liaison) ; 088 et 113 (ébullition de l'eau) ; 092 et 126 (masse des électrons négligeable) ; 021 et 093 (n = N / NA) ; 028, 065, 127, 128 et 134 (unités de n, N et NA) ; 147 et l'ancienne 137 (Ca²⁺). Les énoncés diffèrent, mais le chapitre offre peu de faits distincts pour 150 questions.
3. **008** : « Quelles conditions un schéma de Lewis correct doit-il remplir ? » limite l'octet à C, N et O ; un élève peut hésiter à cocher, puisque Cl a aussi un octet. La proposition reste exacte telle qu'écrite.
4. **060** : l'explication définit la couche de valence comme « la dernière couche occupée », définition du chapitre 3 et non du chapitre 4.
5. **137 (nouvelle)** : l'affirmation est fausse pour Cl⁻ et F⁻ ; le cours dit « le plus souvent » pour la terminaison « -ure ». L'exemple « ion chlore » dans l'énoncé lève l'ambiguïté, à vérifier à l'usage.
6. **Variantes** : 090 accepte « magnésium » seul ; 072 et 145 acceptent « Cl- » et « K+ » ; 005 et 083 n'acceptent pas d'écriture avec espaces (« Al2 S3 ») ni avec charges, ce qui est voulu.
