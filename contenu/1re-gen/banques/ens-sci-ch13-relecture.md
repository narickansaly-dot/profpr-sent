# Relecture de la banque du chapitre 13 d'enseignement scientifique (1re)

Relecture indépendante à l'aveugle : un sous-agent a résolu les 150 questions de `ens-sci-ch13.json` (calculs refaits) sans voir les réponses ; ses réponses ont été comparées automatiquement à celles de la banque, puis chaque écart et chaque remarque ont été examinés un par un contre le texte du chapitre 13 (« Entendre et protéger son audition »).

## Résultat de la relecture à l'aveugle

- Concordance initiale : **150/150**.
- Écarts : **0**.
- Remarques (questions concordantes commentées ou à confiance < 3) : **40**.
- Répartition des 40 remarques :
  - erreurs de la banque : 0 ;
  - ambiguïtés : 5 (029, bonne réponse « par 20 » qui coïncide avec le facteur global du cours ; 030, « 22 » calculé contre « environ 20 » dans le cours ; 092, arrondi de 3,75 min ; 126, double vitrage classé « trajet » ; 137, « n'est utile que si… ») ;
  - faits absents du texte du cours : 2 (035, l'air du conduit auditif n'était pas écrit ; 048, repères de fréquence seulement sur la figure 2) ;
  - distracteurs défendables : 0 ;
  - variantes de réponse courte manquantes : 7 (016, 063, 074, 078, 113, 139, 143) ;
  - erreurs du relecteur ou remarques sans suite : 26. Ce sont des calculs vérifiés et justes (057, 077, 081, 082, 084, 093, 094, 095, 096, 117, 118, 124, 144, 148), des lectures directes du cours (075, 080, 107, 108, 109, 114), des questions correctes commentées sans objection (014, 015, 136) et des variantes déjà couvertes par la normalisation ou par l'énoncé, qui demande d'écrire le nombre sans espace (023, 043, 056).

## Corrections faites

| Source | Problème | Décision |
|---|---|---|
| Cours (section « L'oreille interne ») | Les repères de fréquence de la cochlée (question 048) n'existaient que sur la figure 2. | Phrase ajoutée après la tonotopie : « Repères approximatifs : 20 000 Hz à la base, 4 000 Hz vers le premier tiers de la longueur, 1 000 Hz vers 60 %, 200 Hz près du sommet, 20 Hz au sommet. » Légendes des figures 2 et 3 raccourcies pour rester vers 22 000 caractères. |
| Cours (figure 1) | Le cours ne disait pas que le conduit auditif contient de l'air (question 035). | Légende : « Le conduit auditif et l'oreille moyenne contiennent de l'air, l'oreille interne un liquide. » |
| Cours (exemple de l'oreille moyenne) | Le calcul donnait ≈ 22 puis concluait « environ 20 » (question 030). | « 55 / 3,2 × 1,3 ≈ 22. La pression est multipliée par environ 22, soit de l'ordre de 20. » |
| ens-sci:ch13:banque:029 | Bonne réponse « par 20 » identique au facteur global du cours : réponse trouvable sans calcul. | Données changées : 54 mm² et 3 mm², bonne réponse « Par 18 » (distracteurs 3, 51, 162) ; l'explication distingue ce rapport du facteur global du cours. |
| ens-sci:ch13:banque:030 | « 22 » contre « environ 20 » dans le cours. | Cours aligné (voir plus haut) ; explication : 22,3 arrondi à 22, de l'ordre de 20 ; même résultat en arrondissant d'abord 17 × 1,3. Marge absolue de 1 conservée. |
| ens-sci:ch13:banque:035 | Fait non écrit dans le cours. | Cours complété ; explication : « Le cours le précise… ». |
| ens-sci:ch13:banque:048 | Repères seulement sur la figure. | Énoncé : « D'après les repères de fréquence du cours… » ; explication citant les repères du texte. |
| ens-sci:ch13:banque:092 | « Arrondi à l'unité » alors que 3,75 min est la valeur naturelle. | Énoncé : « valeur exacte ou arrondie à l'unité » ; réponses « 3,75 », « 3.75 » et « 4 » avec une marge absolue de 0,3 ; explication avec 3 min 45 s. |
| ens-sci:ch13:banque:126 | Le double vitrage peut sembler protéger « côté auditeur ». | Énoncé : « D'après le classement du cours (source, trajet, auditeur)… » ; explication rappelant ce classement. |
| ens-sci:ch13:banque:137 | « N'est utile que si la cochlée fonctionne encore en partie » semblait exclure une cochlée intacte (surdité de transmission). | « Pour qu'un appareil auditif soit utile, la cochlée doit fonctionner, au moins en partie. » ; explication citant la surdité de transmission. |
| ens-sci:ch13:banque:016 | Unité ajoutée par l'élève. | Ajout de « 20000 Hz ». |
| ens-sci:ch13:banque:063 | Variantes. | Ajout de « la plasticité », « plasticité neuronale », « plasticité du cerveau ». |
| ens-sci:ch13:banque:074 | Variantes du sigle. | Ajout de « l'IRMf », « l'IRM fonctionnelle » (apostrophe typographique) et « fMRI » ; « IRM » seul reste refusé. |
| ens-sci:ch13:banque:078 | Unité ajoutée par l'élève. | Ajout de « 30 min » et « 30 minutes ». |
| ens-sci:ch13:banque:113 | Variantes. | Ajout de « l audiogramme » (les autres étaient déjà acceptées). |
| ens-sci:ch13:banque:139 | Variantes. | Ajout de « le cornet », « un cornet », « cornets ». |
| ens-sci:ch13:banque:143 | Pourcentage écrit avec le signe. | Ajout de « 27 % » et « 27% ». |

## Totaux

- 150 questions, sources `ens-sci:ch13:banque:001` à `150`, sans statut.
- Types : 74 qcm_unique, 28 qcm_multiple (16 à 2 bonnes réponses, 12 à 3), 31 vrai_faux (16 vrais, 15 faux), 17 reponse_courte.
- Difficultés : 61 / 60 / 29.
- Positions des bonnes réponses des qcm_unique : 18 / 19 / 19 / 18 (indices 0 à 3).
- La bonne réponse des qcm_unique est la plus longue (égalités comprises) dans 15 cas sur 74 (20 %), strictement dans 11.
- Contrôle du pilote : « Banque du chapitre 13 conforme : 150 questions. » ; cours : « Nettoyage HTML : rien n'est retiré. »

## Questions laissées à relire

Aucune.

## Points de doute pour l'enseignant

1. **Durée d'exposition** : repère de prévention « 8 h à 80 dB, durée divisée par 2 à chaque + 3 dB », présenté comme repère et non comme frontière. Le seuil de 80 dB est celui du programme ; d'autres repères (85 dB sur 8 h) existent dans des manuels et dans la prévention au travail.
2. **Réglementation datée** (textes en vigueur en 2026) : décret de 2017 (102 dB(A) sur 15 min, 94 dB(A) pour les moins de 6 ans, protections et zones de repos), code du travail (80 et 85 dB(A)), baladeurs limités à 100 dB(A) depuis 2013.
3. **Amplification de l'oreille moyenne** : surfaces 55 mm² et 3,2 mm², levier × 1,3, facteur ≈ 22 « de l'ordre de 20 » ; les manuels donnent de 17 à 25 environ.
4. **Ordres de grandeur variables** : environ 15 000 cellules ciliées par oreille (3 500 internes, 12 000 externes) ; fréquence maximale perçue selon l'âge ; atténuation des protections (25 à 30 dB pour la mousse, 15 à 25 dB pour les bouchons moulés, 20 à 35 dB pour un casque) ; seuils des degrés de surdité ; repères de fréquence de la tonotopie, donnés comme approximatifs.
5. **Données épidémiologiques** : chiffres de l'OMS datés (2021 et 2022) ; l'enquête sur les acouphènes est fictive et présentée comme telle.
