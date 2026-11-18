# Relecture de la banque du chapitre 16 de SVT (1re) contre le cours

Banque `svt-ch16.json` (150 questions) du chapitre 16, « L'immunité adaptative et la vaccination ».

## Méthode

1. **Rédaction** du chapitre (8 sections, 5 figures) puis de la banque, en trois parties de 50 questions, à partir du seul texte du chapitre.
2. **Auto-relecture** question par question contre le texte brut du chapitre : une seule bonne réponse, information présente dans le texte, aucune question qui donne la réponse d'une autre (une douzaine de questions réécrites à ce stade).
3. **Relecture indépendante** : un sous-agent a résolu les 150 questions avec le seul texte du chapitre, sans voir les réponses attendues, et a signalé ses doutes.
4. **Comparaison automatique** de ses réponses avec les réponses attendues.
5. **Arbitrage** de chaque écart et de chaque remarque, avec correction de la banque et, si besoin, du texte du chapitre.

## Relecture indépendante

Accord initial : **150/150** (aucun écart, aucune question sans réponse). Le relecteur a fait 10 remarques sur des questions où il était d'accord.

| Source | Écart ou remarque | Décision |
|---|---|---|
| svt-1re:ch16:banque:028 | Le distracteur « mutations provoquées par l'antigène » est défendable (hypermutation somatique, hors programme). | Corrigée : distracteur remplacé par « l'antigène sert de moule pour façonner l'anticorps », sans ambiguïté. |
| svt-1re:ch16:banque:031 | « Produits dans la moelle osseuse rouge » est juste mais peut se lire « mûrissent ». | Corrigée : l'explication précise production dans la moelle osseuse, puis maturation dans le thymus. |
| svt-1re:ch16:banque:034 | Les molécules du soi sont aussi des antigènes : double lecture de « avant toute rencontre avec l'antigène ». | Corrigée : « avant toute rencontre avec l'antigène étranger d'un intrus ». |
| svt-1re:ch16:banque:054 | Le sang débarrassé de ses cellules est le plasma ; le sérum est ce qui reste après coagulation. | Corrigée, ainsi que le chapitre (section 1) et l'explication de la 024 : « partie liquide du sang qui reste après la coagulation ». |
| svt-1re:ch16:banque:092 | Tétanos mal choisi : la protection antitétanique repose largement sur les anticorps circulants. | Corrigée : énoncé général (un virus déjà combattu), réponse « faux » inchangée. Le chapitre (section 6) est nuancé : la mémoire est le socle pour beaucoup d'infections, mais contre une toxine rapide comme celle du tétanos il faut garder des anticorps circulants (rappels). |
| svt-1re:ch16:banque:096 | Accepter le pluriel « complexes immuns ». | Gardée : les variantes au pluriel étaient déjà acceptées. |
| svt-1re:ch16:banque:100 | Accepter « immunité cellulaire », « cellulaire », « réponse cytotoxique ». | Corrigée : « cellulaire » et « réponse cytotoxique » ajoutées (« immunité cellulaire » était déjà acceptée). |
| svt-1re:ch16:banque:130 | « Nourrissons » au lieu de « enfants nés depuis 2018 ». | Corrigée : « enfants nés depuis le 1er janvier 2018 » ; même précision dans la 149 et dans le chapitre (section 7). |
| svt-1re:ch16:banque:138 | « Une personne vaccinée ne transmet pas l'agent » : généralisation fausse. | Corrigée : « pour beaucoup de vaccins, une personne vaccinée transmet beaucoup moins l'agent » ; le chapitre (section 7) dit désormais « le risque de transmission est fortement réduit », avec le contre-exemple du tétanos. |
| svt-1re:ch16:banque:146 | Accepter « Louis Pasteur ». | Gardée : la variante était déjà acceptée. |

## Totaux

- 150 questions ; types 75 qcm_unique / 30 qcm_multiple / 30 vrai_faux / 15 reponse_courte ; difficultés 60 / 60 / 30 ; vrai/faux : 15 vrais, 15 faux.
- La bonne réponse des qcm_unique est la plus longue (ex æquo compris) dans 21 cas sur 75.
- Contrôle (`verifierBanque`) : « Banque du chapitre 16 conforme : 150 questions. »


## Seconde vérification indépendante

Les 10 questions modifiées (`ch16-modifiees.txt`) ont été résolues à nouveau par un second relecteur indépendant, sans les réponses : **accord 10/10**. Il confirme les données sur la vaccination en France (11 vaccinations obligatoires pour les enfants nés depuis le 1er janvier 2018 ; rappels à 25, 45 et 65 ans). Suite à ses remarques : la 092 est reformulée (« n'a plus aucune protection », au lieu de « n'est forcément plus protégée », qui se lisait comme « n'est plus forcément protégée ») ; la réponse reste « faux ». La 054, très facile parce que l'énoncé définit le sérum, est gardée (difficulté 1). Les variantes de la 100 étaient déjà acceptées.

## Questions laissées à relire

Aucune question ne reste douteuse. Points à vérifier pour l'enseignant, sans incidence sur les réponses : les nombres de segments V, D, J (valeurs arrondies, annoncées comme telles dans le cours) et la part de cancers du sein HER2+ (15 à 20 %).

À relire : aucune
