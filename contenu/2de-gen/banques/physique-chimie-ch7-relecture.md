# Relecture de la banque du chapitre 7 de physique-chimie (2de) contre le cours

Relecture des 150 questions de `physique-chimie-ch7.json` contre le texte du chapitre « Les transformations nucléaires » (`pc.ts texte 7`), question par question, sans échantillonnage. Critères : exactitude scientifique et conformité au cours ; chaque calcul refait (nombres de neutrons, conservation de A et de Z, rapports d'énergies, marges) ; lecture unique ; bonne(s) réponse(s) seules justes et distracteurs faux sans ambiguïté ; explication juste et suffisante ; niveau 2de ; aucune donnée extérieure au chapitre hors données fournies dans l'énoncé ; variantes et marges des réponses courtes ; doublons et reformulations proches ; réponse lisible dans l'énoncé ; bonne réponse repérable par sa longueur (contrôlée par script).

## Questions corrigées et remplacées

| Source | Problème | Décision |
|---|---|---|
| physique-chimie-2de:ch7:banque:017 | Distracteur « Ils n'ont pas le même nombre d'électrons » exact pour les atomes neutres (7 et 8 électrons) ; bonne réponse nettement plus longue que les distracteurs. | Corrigée : distracteur remplacé par « L'un des deux est forcément radioactif » ; bonne réponse resserrée. |
| physique-chimie-2de:ch7:banque:023 | Bonne réponse près de quatre fois plus longue que les distracteurs (« Le positon », « Le neutron », « Le proton »). | Corrigée : distracteurs allongés, bonne réponse « Le noyau d'hélium (particule alpha) ». |
| physique-chimie-2de:ch7:banque:026 | Bonne réponse la plus longue (indice de forme). | Corrigée : bonne réponse resserrée, distracteurs allongés. |
| physique-chimie-2de:ch7:banque:036 | Redite de la 031 : même noyau (A = 30, Z = 15) émettant un positon. | Corrigée : noyau A = 22, Z = 11 → Z = 10 ; explication reprise. |
| physique-chimie-2de:ch7:banque:041 | Bonne réponse la plus longue. | Corrigée : distracteurs allongés. |
| physique-chimie-2de:ch7:banque:048 | Bonne réponse la plus longue. | Corrigée : distracteurs allongés. |
| physique-chimie-2de:ch7:banque:054 | Bonne réponse presque deux fois plus longue que les distracteurs. | Corrigée : bonne réponse resserrée (« La fusion de l'hydrogène en hélium »), distracteurs ajustés. |
| physique-chimie-2de:ch7:banque:061 | Bonne réponse nettement plus longue que les distracteurs. | Corrigée : bonne réponse resserrée, distracteurs allongés. |
| physique-chimie-2de:ch7:banque:079 | Explication : charges données dans un ordre qui ne correspond pas aux propositions. | Corrigée : charge associée à chaque particule. |
| physique-chimie-2de:ch7:banque:082 | Explication fausse : elle désigne « la dernière » équation comme mal ajustée, alors que c'est la deuxième (la dernière est juste). | Corrigée : explication désignant la deuxième. |
| physique-chimie-2de:ch7:banque:083 | Explication fausse : « les deux dernières » ne conservent pas Z, alors que ce sont la première et la troisième (la quatrième est juste). | Corrigée : explication reprise, avec la vérification des deux équations justes. |
| physique-chimie-2de:ch7:banque:089 | Explication fausse : « les trois premières » modifient des noyaux, alors que la deuxième est la combustion du méthane. | Corrigée : les trois transformations nucléaires sont nommées. |
| physique-chimie-2de:ch7:banque:092 | Explication incomplète : elle ne justifie que les propositions fausses. | Corrigée : explication des deux bonnes réponses ajoutée. |
| physique-chimie-2de:ch7:banque:095 | Reformulation proche de la 001 (même noyau ¹³₆C, même calcul de neutrons). | Corrigée : noyau ¹⁵₇N (8 neutrons, 15 nucléons, 7 protons). |
| physique-chimie-2de:ch7:banque:144 | Variantes « hydrogène 3 » lisibles dans l'énoncé (« isotope de l'hydrogène dont le noyau ³₁H ») : la question se répondait sans connaître le mot tritium. | Corrigée : énoncé « Quel nom particulier porte… », variantes limitées à tritium (avec article). |
| physique-chimie-2de:ch7:banque:108 | Reformulation de la 010 (isotopes, mêmes propriétés chimiques car même nombre d'électrons), avec sa bonne réponse. | Remplacée : vrai/faux (vrai, difficulté 2, Isotopes) sur l'écriture ¹⁴C sans Z. |
| physique-chimie-2de:ch7:banque:133 | Redite de la 012 et de la 094 (neutrons du deutérium). | Remplacée : vrai/faux (faux, difficulté 1, Isotopes) « deux isotopes portent des symboles différents ». |
| physique-chimie-2de:ch7:banque:148 | Doublon de la 106 (neutrons du carbone 14, même calcul 14 − 6 = 8). | Remplacée : réponse courte (difficulté 2, Isotopes) sur les neutrons de l'oxygène 18 (réponse 10). |

## Totaux

- Gardées sans changement : 132
- Corrigées : 15 (017, 023, 026, 036, 041, 048, 054, 061, 079, 082, 083, 089, 092, 095, 144)
- Remplacées : 3 (108, 133, 148)

Répartition après relecture : types 75 / 30 / 30 / 15 (vrai/faux : 15 vrais, 15 faux ; qcm_multiple : 16 à 2 bonnes réponses, 14 à 3) ; difficultés 62 / 61 / 27 ; bonne réponse des qcm_unique en position 1 à 4 : 19 / 19 / 19 / 18. Bonne réponse strictement la plus longue dans 11 qcm_unique sur 75 (15 %). `PC_CHAPITRE=… npx tsx pc.ts verifier 7` : « Banque du chapitre 7 conforme : 150 questions. »

Tous les calculs ont été refaits : nombres de neutrons (001, 003, 006, 007, 012, 014, 032, 093, 106, 138, 139, 148), équations (028 à 036, 042 à 044, 050 à 053, 082, 083, 103, 104, 120, 131, 140, 141), rapports d'énergies (065 : 3 × 10⁶ ; 145 : 2 millions). Aucune erreur de calcul trouvée.

Points jugés acceptables :

- 065 et 145 donnent des énergies (charbon, bois, « combustible nucléaire ») absentes du cours, mais dans l'énoncé : la question porte sur la méthode du rapport, ce que permet la consigne.
- 006, 028–029, 030, 034, 036, 042, 043, 053, 138, 139 utilisent des noyaux absents du cours, notés X ou avec les données utiles dans l'énoncé.
- 137 accepte « positron », terme absent du cours : une variante en plus ne pénalise personne.
- 147 (marge 0,2 autour de 99,3) et 146 (marge 1 autour de 15) : marges adaptées à des valeurs arrondies du cours.
- 011, 015, 018, 019, 040, 059, 064, 069, 070 : bonne réponse un peu plus longue que les distracteurs, mais l'écart est faible ou tient au contenu.

## Points de doute pour l'enseignant

1. **044 et 103** reprennent exactement l'exemple corrigé du cours (¹⁴¹₅₆Ba, ⁹²₃₆Kr, 3 neutrons) ; un élève qui a lu le cours connaît la réponse. À changer de noyaux si tu veux un vrai exercice d'application.
2. **017** : la bonne réponse reste un peu plus longue que deux distracteurs ; l'énoncé (« alors que leur nombre de masse est le même ») oriente vers Z.
3. **Redites d'idée** (formes différentes, même contenu) : 017, 019 et 121 sur deux noyaux de même A mais de Z différents ; 009, 015, 107 et 096 sur la définition des isotopes ; 010 et 077 sur les propriétés chimiques des isotopes ; 016 et 147 sur la composition de l'uranium naturel ; 020 et 105 sur le neutron ; 054, 114 et 129 sur l'énergie du Soleil ; 055, 128 et 143 sur la fission dans les centrales ; 061 et 115 sur l'absence de combustion ; 059 et 116 sur les produits de fission radioactifs ; 063, 064, 117 et 134 sur le rapport d'énergie de l'ordre du million ; 060 et 146 sur les 15 millions de degrés ; 049 et 118 sur la fusion de la glace ; 072 et 119 sur la conservation des éléments en chimie ; 073 et 132 sur ¹⁴₆C → ¹⁴₇N + ⁰₋₁e (nucléaire malgré le même A) ; 028 et 029 sur le même noyau ²¹⁰₈₄X. Le chapitre offre peu de faits distincts pour 150 questions.
4. **Difficultés** : 092 (affirmations directes sur fission et fusion), 120 et 131 (sommes de A ou de Z sur une équation du cours) et 057 (ordre de la chaîne de conversion) sont cotées 3 pour une lecture presque directe du cours ; gardées pour respecter les quotas (27 questions de niveau 3, limite basse).
5. **149** demande « un adjectif » mais accepte aussi « transformation physique » : sans conséquence pour l'élève, mais la consigne et les variantes pourraient être harmonisées.
