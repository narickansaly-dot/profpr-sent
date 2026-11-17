# Relecture indépendante de la banque du chapitre 7 de SI (1re générale)

Méthode : résolution à l'aveugle des 150 questions (énoncés et propositions sans réponses), calculs refaits par script Python (conversions km/h ↔ m/s et tr/min ↔ rad/s, v = R·ω, composition des vitesses, pignon-crémaillère, vis-écrou, bielle-manivelle, profils en trapèze), comparaison automatique avec la banque, puis relecture complète des 150 questions avec leur réponse et leur explication.

Résultat de la phase 1 : 1 désaccord sur 150 (dont 0 erreur de la banque, 0 ambiguïté, 1 erreur du relecteur).

- 144 : j'avais coché « la distance parcourue pendant l'accélération vaut 0,20 m ». Erreur de calcul de ma part : da = ½ × 0,40 × 0,50 = 0,10 m. La banque a raison.

## Questions corrigées

| Source | Problème | Correction |
|---|---|---|
| si-1re:ch7:banque:016 | Doublon de fond de la 007 (nacelle de grande roue : translation circulaire et non rotation). | Nouvel énoncé (faux) : la roue d'un fauteuil roulant serait en translation circulaire par rapport au châssis parce que ses points décrivent des cercles. Explication : changement d'orientation, cercles centrés sur un même axe fixe, donc rotation. |
| si-1re:ch7:banque:046 | Doublon de la 035 et de la 145 (aire sous v(t) = distance). | Nouvel énoncé (vrai) : en mouvement uniformément varié, le graphe x(t) est une parabole. |
| si-1re:ch7:banque:062 | Doublon de la 051 (un tour = 2π rad). | Nouvel énoncé (faux) : l'aiguille des secondes (1 tr/min) tournerait à 1 rad/s ; explication avec ω = 2π × 1 / 60 ≈ 0,105 rad/s. |
| si-1re:ch7:banque:065 | Réponse « 3,14 » sans marge : 3,142 ou 3,1416, valeurs honnêtes de π, étaient refusées. | Marge absolue de 0,005 (accepte 3,14, 3,142, 3,1416). |
| si-1re:ch7:banque:103 | Distracteur mal formulé : un « vérin fixé au bâti par ses deux bouts » ne peut pas bouger, la proposition prête à discussion. | Remplacé par « Un système vis-écrou dont la vis et l'écrou sont guidés par le bâti » (chaîne fermée sans ambiguïté), explication ajustée. |

## Totaux

- Gardées sans changement : 145 ; corrigées : 5 (3 énoncés de vrai/faux remplacés en gardant la même valeur, 1 marge ajoutée, 1 distracteur reformulé).
- Types : 75 QCM à réponse unique, 30 QCM à réponses multiples, 30 vrai/faux, 15 réponses courtes.
- Difficultés : 58 / 60 / 32 (niveaux 1 / 2 / 3).
- Vrai/faux : 15 vrais, 15 faux.
- Position de la bonne réponse des QCM à réponse unique : 19 / 19 / 19 / 18 (positions 0 / 1 / 2 / 3).
- Vérificateur : « Banque du chapitre 7 conforme : 150 questions ; types 75/30/30/15 ; difficultés 58/60/32 ; vrai/faux 15 vrais. »

Les points demandés ont été contrôlés en particulier : les réponses courtes arrondies (066 et 083, « au dixième », marge 0,03) couvrent les arrondis honnêtes ; les conversions tr/min ↔ rad/s (053, 054, 057, 066, 067, 070, 073, 078, 120, 125) et les distracteurs associés (oubli de 2π, de 60, diamètre pris pour rayon) sont justes ; les questions bielle-manivelle (122, 123, 124, 128, 129, 132) sont conformes à la loi x(θ) = R·cos θ + √(L² − R²·sin² θ) et à la course 2R.

## Points de doute

Aucun.

## Cours

Rien à signaler sur le fond : les exemples résolus recalculés (trottinette, fauteuil, drone, hélice, vélo, grue, bras robotisé, portail, vis, bielle-manivelle, articulation) sont justes. Seule remarque de forme : dans l'extrait texte du cours, le programme Python du profil en trapèze apparaît sans indentation (probablement un artefact de l'extraction, à vérifier dans le rendu).
