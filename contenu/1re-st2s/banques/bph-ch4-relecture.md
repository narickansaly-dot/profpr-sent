# Relecture de la banque du chapitre 4 de BPH contre le cours

Relecture des 130 questions de `bph-ch4.json` contre le texte du chapitre (`npm run banque:texte -- 4`), question par question, sans échantillonnage. Critères : exactitude selon le cours, lecture unique, bonne(s) réponse(s) seules justes, explication, niveau 1re ST2S, règles du § 3 de la spec (typographie avec espace insécable vérifiée par script), doublons avec les 20 questions existantes du chapitre.

## Questions corrigées et remplacées

| Source | Problème | Décision |
|---|---|---|
| bph:ch4:banque:014 | L'énoncé demandait le symbole de l'ion, mais les réponses acceptées comprenaient « potassium ». | Corrigée : « Donne son symbole » retiré ; les réponses K+ et potassium restent acceptées. |
| bph:ch4:banque:035 | Doublon de la 002 (composition de l'encéphale, en qcm_unique au lieu de qcm_multiple). | Remplacée : qcm_unique (difficulté 2) sur une personne qui comprend mais parle mal → lobe frontal (langage parlé), le lobe temporal servant de distracteur. |
| bph:ch4:banque:038 | Doublon de la 014 (beaucoup de K+ à l'intérieur), fait déjà repris en 047. | Remplacée : vrai/faux (vrai, difficulté 2) sur le sens de propagation du potentiel d'action, du corps cellulaire vers les terminaisons, fait que la banque ne testait pas. |
| bph:ch4:banque:046 | Bonne réponse nettement la plus longue, recopiant la phrase du cours ; la fabrication de la myéline est déjà testée en 028. | Corrigée : bonne réponse réduite à « Elles soutiennent et nourrissent les neurones ». |
| bph:ch4:banque:053 | Formulation bancale (« la forme […] est plus ample ») et doublon de la 043 (amplitude et intensité). | Remplacée : vrai/faux (faux, difficulté 3) : pendant le potentiel d'action, l'intérieur ne reste pas négatif, puisque la membrane s'inverse. |
| bph:ch4:banque:057 | Reformulation proche de la 055 (même situation : stimulation plus forte → même amplitude, fréquence plus élevée). | Remplacée : qcm_multiple (difficulté 3, bonnes réponses en positions 3 et 4) sur une stimulation sous le seuil puis au-delà du seuil. |
| bph:ch4:banque:069 | L'explication affirmait que le calcium « déclenche » la migration des vésicules, lien causal que le cours n'énonce pas (il donne une séquence). | Corrigée : explication fondée sur l'ordre des événements du cours. |
| bph:ch4:banque:074 | Énoncé sans « environ », alors que le cours donne une valeur approchée (environ 1 ms). | Corrigée : « Environ combien de temps dure un potentiel d'action, en millisecondes ? ». |
| bph:ch4:banque:099 | Même bonne réponse (hypertension artérielle) qu'une des bonnes réponses de la 092. | Corrigée : bonne réponse « Le diabète » ; explication reprise. |
| bph:ch4:banque:100 | Bonne réponse beaucoup plus longue que les distracteurs et seule à donner une justification ; distracteurs à rallonge (« plaques de démyélinisation », mot absent du cours). | Corrigée : propositions de longueur comparable, distracteurs dans les mots du cours ; l'explication porte le lien avec la thrombolyse. |
| bph:ch4:banque:108 | Reprise mot pour mot d'un distracteur de la 109 (« dès la perte des premiers neurones »), même idée que la 109 et l'ancienne 111. | Remplacée : vrai/faux (faux, difficulté 2) : le tremblement de Parkinson survient au repos, pas pendant les mouvements. |
| bph:ch4:banque:111 | Réponse circulaire (« on ne remarque les signes qu'après la mort de nombreux neurones » → « parce que les signes n'apparaissent qu'à 60-80 % ») et troisième question sur le même fait. | Remplacée : qcm_unique (difficulté 3) reliant Parkinson et synapse : la dopamine est un neurotransmetteur lié au mouvement (l'acétylcholine, pas la dopamine, agit à la jonction neuromusculaire). |
| bph:ch4:banque:125 | Doublon de la 114 (lésion dorsale ou lombaire → paraplégie). La version tétraplégie était exclue, car déjà posée par la question existante bis:9. | Remplacée : qcm_unique (difficulté 2) : la paralysie vient de ce que les ordres du cerveau n'atteignent plus les muscles sous la lésion (moelle = voie de passage). |
| bph:ch4:banque:126 | Doublon de la 117 (perte de sensibilité et de motricité sous la lésion). | Remplacée : qcm_unique (difficulté 1) sur la circonstance fréquente d'une section de la moelle (accident de la route ou de sport), fait jusque-là non testé. |

## Totaux

- Gardées sans changement : 116
- Corrigées : 6 (014, 046, 069, 074, 099, 100)
- Remplacées : 8 (035, 038, 053, 057, 108, 111, 125, 126)

Répartition après relecture : types 65 / 26 / 26 / 13 (vrai/faux : 12 vrais, 14 faux) ; difficultés 53 / 52 / 25 ; `npm run banque:verifier -- 4` : « Banque du chapitre 4 conforme : 130 questions. »

Points signalés par la rédaction et jugés acceptables :

- 124 : calcul recalculé, 5 × 2 millions = 10 millions ; marge 0 justifiée.
- 049, 056 : distracteurs inventés (« relayé par une synapse à chaque nœud de Ranvier », « la myéline compenserait le manque d'énergie ») mais manifestement faux d'après le cours.
- 064 : « 86 » avec une marge de 2, conforme au guide des auteurs.

## Points de doute pour l'enseignant

1. **083** : « au moins deux synapses » entre le cortex moteur et le muscle suppose de compter la jonction neuromusculaire comme une synapse. Le cours le permet (une synapse relie un neurone à une fibre musculaire), mais le rapprochement est implicite.
2. **088 et 089** : le cours énonce le croisement des voies motrices et, séparément, que les signes de l'AVC touchent le côté opposé ; il ne relie pas les deux. Le lien est demandé en 089 (difficulté 3).
3. **130** : « lésion lombaire → motricité des bras conservée » est déduit de « sous la lésion » et de « paraplégie (membres inférieurs) ». Sûr, mais à confirmer si tu veux l'exiger.
4. **056 et 069** : conséquences déduites (manque d'ATP → répartition des ions non maintenue ; calcium bloqué → pas de libération du neurotransmetteur). Le cours donne la séquence, pas la causalité.
5. **053 et 057 (nouvelles)** : « la membrane s'inverse » est lu comme « l'intérieur devient positif » ; le cours ne l'écrit pas en toutes lettres (la figure 4.2 le montre).
6. **111 (nouvelle)** : relie « dopamine (mouvement, motivation) » de la section synapse à la maladie de Parkinson ; le cours ne fait pas ce lien explicitement.
7. **Redites d'idée** laissées faute de matière dans le cours : 008 et 011 (couleur de la myéline) ; 078, 080, 087 et 089 (croisement dans le tronc cérébral) ; 043, 052 et 055 (tout ou rien) ; 128 et 129 (pas de régénération des neurones du SNC) ; 020 et 123 (plaques dans la substance blanche) ; 109 et la question existante quiz:9 restent distinctes de la 111.
8. **014 et 054** : réponses acceptées larges (« K » sans le signe +, « fente » seul) ; à resserrer si tu veux exiger le terme exact.
9. **Difficultés** : 058 (pompe Na+/K+ et ATP) et 123 (plaques dans la substance blanche) sont cotées 3 pour un rappel presque direct ; gardées pour les quotas.
