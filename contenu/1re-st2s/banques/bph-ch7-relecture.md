# Relecture de la banque du chapitre 7 de BPH contre le cours

Relecture des 130 questions de `bph-ch7.json` contre le texte du chapitre (`npm run banque:texte -- 7`), question par question, sans échantillonnage. Critères : exactitude selon le cours, lecture unique, bonne(s) réponse(s) seules justes, explication, niveau 1re ST2S, règles du § 3 de la spec (espace insécable vérifiée par `banque:verifier`). Les quatre calculs ont été refaits : 20 × 0,6 = 12 L/min (028) ; 40 × 2,5 = 100 L/min (029) ; 2,5 + 0,5 + 1 = 4 L (030) ; 46 − 40 = 6 mmHg (042).

## Questions corrigées et remplacées

| Source | Problème | Décision |
|---|---|---|
| bph:ch7:banque:006 | L'énoncé situait les divisions « entre la trachée et les alvéoles » ; le cours parle d'un arbre de conduits qui se divise environ 23 fois jusqu'aux alvéoles, sans nommer la trachée. | Corrigée : énoncé « l'arbre de conduits respiratoires se divise-t-il jusqu'aux alvéoles ». |
| bph:ch7:banque:007 | Image de l'éponge forcée et ambiguë (le doigt enfoncé évoque autant le caractère spongieux que l'élasticité) ; analogie absente du cours. | Remplacée : qcm_unique (difficulté 3, notion « Mécanique ventilatoire ») sur l'élasticité des poumons, qui explique la diminution du volume du thorax à l'expiration au repos. |
| bph:ch7:banque:034 | Même contenu que la 031 (le volume résiduel ne fait pas partie de la capacité vitale), repris aussi en distracteur de la 032. | Remplacée : vrai/faux (faux, difficulté 2) « débit ventilatoire au repos d'environ 75 L/min » ; le cours donne 7,5 L/min. |
| bph:ch7:banque:042 | Explication hors cours (« l'écart est faible, mais il suffit ») ; difficulté 3 pour une soustraction dont les deux valeurs sont dans l'énoncé. | Corrigée : explication reprise avec le sens de diffusion du cours ; difficulté 3 → 2. |
| bph:ch7:banque:044 | Même idée que la 089 (destruction des parois alvéolaires → la surface d'échange diminue). | Remplacée : qcm_unique (difficulté 2) sur le rôle de la paroi humide (dissolution des gaz). |
| bph:ch7:banque:064 | Réponse acceptée « carbaminohémoglobine » : terme absent du cours. | Corrigée : variante retirée. |
| bph:ch7:banque:065 | Réponse acceptée « saturomètre » : terme absent du cours. | Corrigée : variante retirée. |
| bph:ch7:banque:068 | Bonne réponse nettement la plus longue (« … tout en apportant plus d'O2 ») ; distracteur « les chémorécepteurs ont besoin de plus de diazote » peu plausible. | Corrigée : bonne réponse « La production de CO2 augmente et doit être éliminée » ; distracteur « Les chémorécepteurs détectent une baisse de la glycémie » (le cours dit CO2 et pH). |
| bph:ch7:banque:113 | Explication hors cours (« on ne peut pas le repérer sans détecteur »). | Corrigée : explication reliée à la combustion incomplète et au détecteur de CO de la prévention. |
| bph:ch7:banque:130 | Réponse acceptée « 39.89 », lue comme le nombre décimal 39,89 par la comparaison numérique. | Corrigée : variante retirée (restent « 39 89 », « 3989 », « 39-89 »). |

## Totaux

- Gardées sans changement : 120
- Corrigées : 7 (006, 042, 064, 065, 068, 113, 130)
- Remplacées : 3 (007, 034, 044)

Répartition après relecture : types 66 / 25 / 26 / 13 (vrai/faux : 13 vrais, 13 faux) ; difficultés 52 / 54 / 24 ; `npm run banque:verifier -- 7` : « Banque du chapitre 7 conforme : 130 questions. »

Points signalés par la rédaction et jugés acceptables :

- 031 (« lequel est exclu de la capacité vitale ») : formulation positive, sans négation piège.
- 105 : les distracteurs 17, 114 et 39 89 sont de vrais numéros, mais aucun n'est donné par le cours pour le CO ; la bonne réponse (15 ou 18) est seule juste.
- 066 à 072 (régulation) : sept questions seulement, en accord avec la brièveté de la section.

## Points de doute pour l'enseignant

1. **124** : « le tabac favorise les infections respiratoires parce qu'il paralyse les cils » relie l'escalator mucociliaire, la phrase « le tabac paralyse ces cils » et les « infections fréquentes » de la BPCO ; le cours ne fait pas lui-même le lien.
2. **107** : « elles respirent toutes l'air du logement contenant le gaz » est déduit de « souvent chez plusieurs personnes d'un même logement ».
3. **064 et 072** : variantes orthographiques gardées hors du cours, « carbohémoglobine » (le cours écrit « carbhémoglobine ») et « chimiorécepteurs » (le cours écrit « chémorécepteurs ») ; à retirer si tu veux exiger l'orthographe du cours.
4. **029** : un volume courant de 2,5 L à l'effort n'est pas une valeur du cours ; il sert seulement de donnée de calcul cohérente avec « peut dépasser 100 L/min ».
5. **079** : le cours n'explique pas le mot « hyperréactives » ; la bonne réponse reprend la suite du texte (« se contractent, s'enflamment et produisent trop de mucus ») et ajoute « en réponse aux facteurs déclenchants », déduit de la liste des facteurs.
6. **Redites d'idée** : 015, 022 et une proposition de la 020 portent sur la pression pulmonaire à l'inspiration ; 052 et 061 sur l'O2 dissous ; 089 et 100 sur l'emphysème ; 119, 125 et 127 sur les goudrons et les cils. Les énoncés diffèrent, mais le contenu se répète (chapitre court).
7. **Difficultés** : 057 (lecture d'une SpO2) et 112 (fixation du CO) sont cotées 3 pour un rappel presque direct du cours ; gardées pour respecter les quotas.
