# Relecture de la banque du chapitre 2 de mathématiques (tronc commun, 1re)

## Méthode

- Résolution à l'aveugle des 150 questions à partir des énoncés masqués (sans réponses ni explications), avant toute lecture de la banque ou du chapitre.
- Recalcul de chaque question calculatoire dans un script Python (sympy pour développer, factoriser, résoudre équations et inéquations ; `fractions.Fraction` pour les fractions et décimaux), y compris les vrai/faux et chaque proposition des QCM multiples.
- Comparaison automatique de mes réponses avec la banque, puis relecture complète des 150 questions (énoncé, réponse, distracteurs, explication, conformité au cours et au programme, faisabilité sans calculatrice, typographie) et du texte du chapitre.

## Résultat de la comparaison à l'aveugle

150 concordances sur 150 au premier passage, aucun écart. Les notes prises à l'aveugle ne signalaient aucune erreur de réponse, seulement deux distracteurs artificiels (038, 101) et la notation des réunions d'intervalles (103 à 105).

## Questions corrigées

| Source | Problème | Décision |
|---|---|---|
| maths-tc:ch2:banque:038 | Distracteur « (4,5x − 1)(4,5x + 1) » artificiel, aucun élève ne l'écrit. | Remplacé par « 9(x − 1)(x + 1) » (erreur plausible : sortir le 9 en facteur) ; phrase ajoutée à l'explication. |
| maths-tc:ch2:banque:101 | Distracteur « −7, 0 puis 2 » artificiel. | Remplacé par « −2 puis 7 » (erreur de signe en lisant les parenthèses) ; phrase ajoutée à l'explication. |
| maths-tc:ch2:banque:103 | Réunion écrite « ]−∞ ; −3[ et ]5 ; +∞[ » ; énoncé « Sur quel intervalle » alors qu'une proposition est une réunion. | Proposition réécrite avec ∪ ; énoncé : « Sur quel ensemble ». |
| maths-tc:ch2:banque:104 | Réunion écrite avec « et ». | « ]−∞ ; 1[ ∪ ]4 ; +∞[ ». |
| maths-tc:ch2:banque:105 | Ensemble de solutions écrit avec « et ». | « ]−∞ ; −1] ∪ [3 ; +∞[ ». |
| maths-tc:ch2:banque:100 | Réponse acceptée « 2.5 » (point décimal, affiché tel quel à la correction). | Réponses acceptées « 2,5 » et « 5/2 » (la correction numérique accepte toujours 2.5). |
| maths-tc:ch2:banque:066 | Explication trop forte : diviser par x « fait perdre » des solutions (pas toujours). | « peut faire perdre des solutions ». |

Bonnes réponses inchangées, aucune position déplacée.

## Texte du cours

Aucune erreur mathématique (tous les exemples recalculés). Harmonisation de notation dans la section « Tableau de signes d'un produit » (`chapitres/ch2.json` et `cours-ch2.json`) :

- conclusion de l'exemple résolu : « P(x) < 0 sur ]−∞ ; −2[ ∪ ]3 ; +∞[ (le symbole ∪, « union », réunit les deux intervalles) » au lieu de « … et sur … » ;
- exemple 2(x − 1)(x − 5) : « Positif sur ]−∞ ; 1[ ∪ ]5 ; +∞[ ».

Notation alignée sur celle du chapitre 3 et des banques 3 et 5, qui utilisent déjà ∪.

## Questions laissées à relire

Aucune.

## Contrôles

- `pilote.ts verifier 2` : « Banque du chapitre 2 conforme : 150 questions. »
- `pilote.ts cours` : 1 chapitre, 25 281 octets ; nettoyage HTML : rien n'est retiré ; import à blanc construit, aucune base contactée.
- `comparer.py 2` après correction : 150 concordantes, 0 écart.
