# Relecture de la banque du chapitre 3 de SVT (1re spécialité) contre le cours

Relecture des 150 questions de `svt-ch3.json` contre le texte du chapitre 3 (« Mutations de l'ADN et variabilité génétique »).

## Méthode

1. **Rédaction** du chapitre (8 sections, 3 figures) puis de la banque, en s'appuyant uniquement sur le texte du chapitre.
2. **Auto-relecture** des points douteux contre le texte brut du chapitre (celui que produit `banque:texte`, sans le texte des SVG). Trois corrections sont faites à cette étape : un énoncé qui renvoyait au « cours », deux variantes « 20 % » et « 8 % » ajoutées.
3. **Relecture indépendante** : un sous-agent a résolu les 150 questions avec le seul texte du chapitre, sans voir les réponses attendues.
4. **Comparaison automatique** de ses réponses avec les réponses attendues, puis **arbitrage** de chaque écart et de chaque remarque, avec le texte du chapitre et les connaissances scientifiques.

## Relecture indépendante

Accord initial : **150/150** (aucun écart, aucune question sans réponse). Le relecteur a fait 15 remarques sur des questions où il est d'accord.

| Source | Écart ou remarque | Décision |
|---|---|---|
| svt:ch3:banque:006 | 0,64 est cohérent avec « moins d'une à quelques mutations » (borne 10¹⁰). | Gardée : simple confirmation. |
| svt:ch3:banque:073 | Le calcul utilise le génome haploïde ; le texte dit « plusieurs millions ». | Gardée : la taille du génome (3,2 × 10⁹) est donnée dans l'énoncé et le résultat concorde avec le texte. |
| svt:ch3:banque:086 | Deux propositions (40 à 70 ; surtout le père) donnaient les réponses des questions 063 et 065. | Réécrite, même type, même notion, même difficulté : calcul des mutations apparues dans une culture de 10⁹ bactéries (0,004 erreur par réplication, 4 × 10⁶ mutations). |
| svt:ch3:banque:089 | Les calculs (2 %, 7,5 %, 20 %) recoupaient les questions 017 et 019. | Réécrite avec un autre jeu de données (400 levures ; 45 s et 100 s) ; les propositions fausses ne suggèrent plus l'interprétation demandée à la question 019. |
| svt:ch3:banque:102 | Donnait mot pour mot la réponse de la question 027 (xeroderma pigmentosum). | Réécrite : affirmations générales sur la réparation (équilibre dommages / réparation, réparation des dommages dus aux mutagènes) ; le xeroderma n'est plus cité. |
| svt:ch3:banque:127 | Formulation absolue : une petite partie des mutations *de novo* surviennent après la fécondation. | Réécrite : « est le plus souvent apparue dans une cellule germinale d'un de ses parents » (toujours vraie). |
| svt:ch3:banque:136 | Accepter « polymérase », « ADN-polymérase », « l'ADN polymérase ». | Déjà acceptées (le trait d'union est ignoré). |
| svt:ch3:banque:137 | Accepter « rouges ». | Déjà acceptée. |
| svt:ch3:banque:140 | Accepter « Val », « la valine ». | Déjà acceptées. |
| svt:ch3:banque:142 | Accepter « 20 % ». | Déjà acceptées : « 20 % » et « 20% ». |
| svt:ch3:banque:143 | Accepter « 8 % ». | Déjà acceptées : « 8 % » et « 8% ». |
| svt:ch3:banque:146 | Accepter « cellule œuf », « cellule-oeuf », « cellule oeuf », « zygote ». | Déjà acceptées, avec les variantes en « œ » et en « oe » (la normalisation ne les confond pas). |
| svt:ch3:banque:148 | Accepter « U.V. », « ultraviolets », « ultraviolet ». | Déjà acceptées. |
| svt:ch3:banque:149 | Accepter « diversité allélique ». | Gardée sans cette variante : l'énoncé demande un mot pour désigner « la diversité des allèles » ; répondre « diversité allélique », c'est recopier l'énoncé. « polymorphisme » est bien orthographié. |
| svt:ch3:banque:150 | Accepter « Induite » et « mutation induite ». | Déjà acceptées (la casse est ignorée). |

Remarque sur la position des bonnes réponses : dans le fichier, les bonnes réponses des qcm_unique suivent un cycle 0, 1, 2, 3. Ce cycle n'a pas d'effet pour l'élève, car l'application permute les propositions à chaque tirage (`tentative_question.permutation`) ; l'ordre n'a donc pas été changé.

## Totaux

- 150 questions ; types 75 qcm_unique, 30 qcm_multiple, 30 vrai_faux, 15 reponse_courte ; vrai/faux : 15 vrais, 15 faux.
- Difficultés : 62 (niveau 1), 58 (niveau 2), 30 (niveau 3).
- Biais de longueur : la bonne réponse des qcm_unique est strictement la plus longue dans 10 cas sur 75 (12 en comptant les égalités).
- Contrôle (`verifierBanque`) : « Banque du chapitre 3 conforme : 150 questions. »

## Questions laissées à relire

Aucune question ne reste douteuse. Les questions sur des séquences (codons) donnent dans leur énoncé les correspondances codon / acide aminé nécessaires, car le texte des figures SVG n'est pas lu par le relecteur. Les données de l'expérience des levures sont des valeurs indicatives d'une expérience de classe, comme le précise le chapitre.

À relire : aucune
