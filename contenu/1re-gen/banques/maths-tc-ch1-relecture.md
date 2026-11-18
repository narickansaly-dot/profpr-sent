# Relecture de la banque du chapitre 1 de mathématiques (tronc commun, 1re)

Chapitre : « Pourcentages et taux d'évolution ». Banque : `maths-tc-ch1.json` (150 questions).

## Méthode

1. Résolution à l'aveugle des 150 questions à partir des énoncés et propositions seuls (réponses et explications masquées).
2. Chaque calcul refait dans un script Python avec `fractions.Fraction`, y compris les vrai/faux et chaque proposition des QCM multiples (un calcul commenté par source ; formules testées sur des valeurs numériques).
3. Comparaison automatique de mes réponses avec celles de la banque.
4. Relecture complète des questions, réponses, explications, réponses acceptées et de la typographie, puis du texte du cours (sections, exemples, tableaux, automatismes).

## Résultat de la comparaison à l'aveugle

- Concordances au premier passage : **150 sur 150**.
- Écarts : **0**.

Les pièges sont bien construits et à une seule lecture : division par la valeur d'arrivée, retrait du pourcentage sur la valeur finale, addition des taux successifs, taux réciproque pris égal au taux initial, points de pourcentage confondus avec un taux d'évolution, moyenne non pondérée. Tous les calculs se font sans calculatrice (la seule valeur non décimale, 1/1,1 ≈ 0,909, est donnée dans l'énoncé 100).

## Questions corrigées

| Source | Problème | Décision |
|---|---|---|
| maths-tc:ch1:banque:124 | Doute de l'auteur (masse salariale). Les propositions « entre 2 % et 4 % » et « 3 % exactement » ne se tranchent que si les effectifs sont constants ; sinon (embauches, départs), la masse salariale peut évoluer de n'importe quel taux. L'explication n'écrivait pas la moyenne pondérée. | Énoncé complété : « les effectifs ne changent pas ». Explication réécrite : 1,02 × C + 1,04 × E, moyenne des taux pondérée par les masses, 3 % seulement si C = E, 6 % additionne à tort. Réponse inchangée [0, 2]. Niveau 3 adapté : aucun calcul, raisonnement qualitatif appuyé sur le piège 3 du cours. |
| maths-tc:ch1:banque:112 | « De quel pourcentage doit-il baisser ? » : un élève peut répondre « −60 » (taux réciproque signé). | Ajout des variantes « -60 » et « −60 ». |
| maths-tc:ch1:banque:130 | « De combien de points a-t-il baissé ? » : même cas, « −15 » défendable. | Ajout des variantes « -15 » et « −15 ». |

## Texte du cours

Corrections faites dans `chapitres/ch1.json` et `cours-ch1.json` :

- **Pièges, piège 2** (doute de l'auteur) : l'exemple « 30 % + 20 % = 50 % » est reformulé pour que les deux parts portent explicitement sur le même tout : « si 30 % des élèves sont des filles internes et 20 % des élèves sont des garçons internes, alors 50 % des élèves sont internes », suivi du contre-exemple (30 % des filles et 20 % des garçons : touts différents, on n'additionne pas).
- **Coefficient multiplicateur** : contradiction interne. La section disait « baisse : 0 < CM < 1 » et « le coefficient d'une baisse reste strictement positif », alors que la section Pièges (et la question 129) affirme qu'une baisse de 100 % ramène la quantité à zéro (CM = 0). Corrigé en « 0 ≤ CM < 1, avec CM = 0 pour une baisse de 100 % » et « le coefficient d'une baisse est positif ou nul ».

Autres valeurs vérifiées, sans erreur : tableaux de pourcentages usuels, de coefficients et de taux réciproques, exemples résolus (270 €, 600 €, 90 €, 300 €, 25 %, −15 %, +200 %, 0,96, 1,21, 1,331, 0,25, 2,5 → 0,4), piège 3 (62 %), 12 automatismes.

## Questions laissées à relire

Aucune.

## Contrôles

- `pilote.ts verifier 1` : « Banque du chapitre 1 conforme : 150 questions. »
- `pilote.ts cours` : 1 chapitre, 8 sections, nettoyage HTML sans retrait, import à blanc construit, aucune base contactée.
- `comparer.py 1` après correction : 150 concordantes, 0 écart.
