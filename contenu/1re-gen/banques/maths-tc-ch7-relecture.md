# Relecture de la banque du chapitre 7 de mathématiques (tronc commun, 1re)

Chapitre : « Variation linéaire : suites arithmétiques et fonctions affines ».

## Méthode

1. Résolution à l'aveugle des 150 questions (énoncés et propositions seuls, sans réponses ni explications), y compris les vrai/faux et les QCM à réponses multiples.
2. Calculs refaits dans un script Python (`fractions.Fraction`), un calcul commenté par source : termes de suites arithmétiques, raisons, coefficients directeurs, conversions Celsius-Fahrenheit, intérêts simples, équilibres offre-demande, barèmes par tranches, seuils (recherche du plus petit rang par boucle).
3. Comparaison automatique avec la banque, puis relecture complète des énoncés, réponses, explications et du texte du cours.

Points vérifiés en particulier : premier rang (u(0) ou u(1)) précisé chaque fois qu'il intervient ; problèmes de seuil sans ambiguïté (inégalité large ou stricte, année de départ) ; barème d'impôt inventé présenté comme tel ; réponses courtes (variantes suffisantes, aucun séparateur de milliers).

## Résultat de la comparaison à l'aveugle

150 concordances sur 150 au premier passage, 0 écart.

Notes prises à l'aveugle : 132 (la proposition « u(n) ⩾ 60 dès n = 12 » est littéralement vraie), 022 et 124 (vérifiés, bien posés), 026 et 049 (réponses négatives : les variantes « -3 » et « −3 » sont présentes).

## Questions corrigées

| Source | Problème | Décision |
|---|---|---|
| maths-tc:ch7:banque:132 | Le distracteur « u(n) ⩾ 60 dès n = 12 » est vrai à la lettre (u(12) = 70 ⩾ 60) : défendable. | Remplacé par « u(n) ⩾ 60 seulement à partir de n = 12 » (faux) ; explication ajustée. Bonnes réponses inchangées. |
| maths-tc:ch7:banque:129 | Les propositions parlent de u(22) et u(23) sans que la suite u soit définie dans l'énoncé. | Énoncé réécrit : « On considère la suite u définie pour n ⩾ 0 par u(n) = 120 + 8n… ». |
| maths-tc:ch7:banque:110, 113, 117, 118, 122 | Barème inventé non présenté comme tel. | « Barème : » devient « Barème fictif : ». |
| maths-tc:ch7:banque:115, 120 | Idem. | « Un barème fictif taxe… ». |
| maths-tc:ch7:banque:111 | Idem (« Un pays prélève… »). | « Un pays imaginaire prélève… ». |
| maths-tc:ch7:banque:108 | « Croissance linéaire » alors qu'une des bonnes réponses (bougie qui raccourcit) décroît. | « évolution linéaire continue ». |
| maths-tc:ch7:banque:085 | Formulation impropre « ont le même nuage » (une fonction n'a pas de nuage de points). | « sont liées : les points (n ; u(n)) sont sur la droite représentant f ». |
| maths-tc:ch7:banque:133 | « 2 150 » écrit avec une espace ordinaire (proposition et explication). | Espace insécable. |

## Texte du cours

Aucune erreur mathématique. Une correction de formulation, dans `chapitres/ch7.json` et `cours-ch7.json` (section barème) : « pour un revenu R entre 30 000 € et plus » devient « pour un revenu R supérieur ou égal à 30 000 € ». Tous les exemples chiffrés du cours ont été recalculés (club 2048, réservoir 12 jours, forfaits 6 mois, tableau du barème, 37 °C = 98,6 °F, programme Python affichant 23) : justes.

## Questions laissées à relire

Aucune.

## Contrôles

- `pilote.ts verifier 7` : « Banque du chapitre 7 conforme : 150 questions. »
- `pilote.ts cours` : 1 chapitre, 29 869 octets ; contraste 9,93:1 accepté ; ch7 : 8 sections ; nettoyage HTML : rien n'est retiré ; import à blanc construit, aucune base contactée.
- `comparer.py 7` après correction : 150 concordantes, 0 écart.
