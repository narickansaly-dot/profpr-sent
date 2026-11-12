# Relecture de la banque du chapitre 5 d'histoire-géographie (1re)

Banque : `histoire-geo-ch5.json`, 150 questions au statut `a_relire` après fusion. Chapitre : « La France et la construction de nouveaux États par la guerre et la diplomatie ».

## Méthode

- Questions rédigées à partir du seul texte du chapitre 5, puis relues contre ce texte.
- Relecture indépendante à l'aveugle : un sous-agent a résolu les 150 questions sans voir les réponses attendues.
- Comparaison automatique de ses réponses avec les réponses attendues (écarts et remarques).
- Contrôles automatiques : `verifierBanque` (quotas de 150 questions, positions, biais de longueur, espaces insécables) ; présence de chaque réponse courte dans le texte du chapitre ; aucune réponse courte n'apparaît dans l'énoncé ou les propositions d'une autre question.

## Résultat de la relecture indépendante

150 accords sur 150 : 0 écart, 6 remarques.

| Source | Constat du relecteur | Décision |
| --- | --- | --- |
| ch5:banque:030 | « Après 1861 » sans borne : le Trentin, rattaché en 1919, devient défendable. | **Corrigée** : « entre 1861 et 1871 ». |
| ch5:banque:037 | Prévoir « Henri Dunant » et « Dunant ». | **Maintenue** : ces deux variantes étaient déjà acceptées. |
| ch5:banque:053 | « La garnison protège Rome jusqu'en 1866 » : en partie vrai (départ en décembre 1866, retour en 1867 après la convention de septembre 1864). | **Remplacée** (même notion, vrai/faux faux, difficulté 3) : « Les catholiques français poussent Napoléon III à abandonner le pouvoir temporel du pape. » |
| ch5:banque:073 | Définition trop ouverte : « référendum » y répond aussi. | **Corrigée** : énoncé situé « sous le Second Empire » ; « référendum » reste accepté. |
| ch5:banque:121 | Distracteur « Belfort » en partie vrai : la place est rendue le 18 février 1871 sur ordre du gouvernement. | **Corrigée** : « Belfort » remplacé par « Bordeaux » ; explication réécrite. |
| ch5:banque:137 | Quasi-doublon de 062 (consultation des populations à Nice et en Savoie, pas en Alsace-Moselle). | **Remplacée** (même notion, QCM unique, difficulté 3) : statut de « terre d'Empire » gouvernée depuis Berlin. L'énoncé de la réponse courte 150 (Reichsland) a été reformulé pour ne plus donner cette réponse. |

## Corrections du texte du chapitre

- Section « Venise et Rome » : la garnison française est désormais dite « présente presque sans interruption depuis 1849 » (elle a quitté Rome de décembre 1866 à 1867). La question 044 (« depuis 1849 ») reste juste.
- Section « Le Piémont et la France » : « très meurtrières » retiré pour rester sous 14 000 caractères de HTML.

## Points de doute

| Source | Doute | Proposition |
| --- | --- | --- |
| ch5:banque:100 | Le tableau d'Anton von Werner existe en plusieurs versions : Bismarck n'est en uniforme blanc et au centre que dans certaines (version de 1885). | Garder si l'on montre cette version ; sinon rejeter. |
| ch5:banque:110 | Nom du peintre (Anton von Werner) : connaissance pointue pour un élève de 1re. | Garder seulement si le tableau est étudié en classe. |
| ch5:banque:044 | « Depuis 1849 » : simplification (interruption de 1866-1867). | Garder. |
| ch5:banque:121 | Belfort, qui « résiste jusqu'à la fin de la guerre », se rend après l'armistice, sur ordre : le texte du chapitre reste simplifié. | Garder. |

## Contrôles

- `verifier 5` : « Banque du chapitre 5 conforme : 150 questions. »
- Types : 75 / 30 / 30 / 15 ; difficultés : 60 / 60 / 30 ; vrai/faux : 15 vrais, 15 faux.
- Biais de longueur : la bonne réponse est strictement la plus longue dans 24 QCM uniques sur 75 (32 %).
- Positions des bonnes réponses (QCM uniques, après le mélange fait par le coordinateur) : 19 / 19 / 19 / 18.
- Réponses courtes : toutes présentes dans le texte du chapitre.
