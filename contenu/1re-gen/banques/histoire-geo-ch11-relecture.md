# Relecture de la banque du chapitre 11 d'histoire-géographie (1re)

Banque : `histoire-geo-ch11.json`, 150 questions au statut `a_relire` après fusion. Chapitre : « Sortir de la guerre : la tentative de construction d'un ordre des nations démocratiques ».

## Méthode

- Questions rédigées à partir du seul texte du chapitre 11 (sortie de `outil.ts texte 11`).
- Relecture indépendante à l'aveugle : un sous-agent a résolu les 150 questions sans voir les réponses attendues ni les explications.
- Comparaison automatique de ses réponses avec les réponses attendues (`[ECART]` si elles diffèrent, `[REMARQUE]` si la réponse est la même mais commentée).
- Contrôles `verifierBanque` (quotas de 150 questions, positions, biais de longueur, espaces insécables, similarité des énoncés), puis contrôle de la présence de chaque réponse courte dans le texte du chapitre.
- Corrections faites directement dans le JSON de la banque, sans changer l'ordre des propositions.

## Résultat de la relecture indépendante

Le relecteur a donné la même réponse que l'auteur pour 149 questions sur 150. Il y a 1 écart et 4 remarques.

| Source | Constat du relecteur | Décision |
| --- | --- | --- |
| ch11:banque:038 | (voir 142) La date du 1er décembre 1918, citée dans l'énoncé de la 142, donnait la réponse de la 038. | **Remplacée** (même type, même difficulté) : « Quand le royaume des Serbes, Croates et Slovènes est-il proclamé ? » (le 1er décembre 1918). |
| ch11:banque:049 | Les Américains débarquent aussi dans le Grand Nord : le distracteur « Mourmansk » est en partie défendable. | **Corrigée** : « À Mourmansk » remplacé par « À Moscou » ; explication complétée. |
| ch11:banque:086 | « Le droit d'occuper la Rhénanie » est ambigu : le traité prévoit bien une occupation, par les Alliés. | **Corrigée** : la proposition devient « Le droit de garder des troupes en Rhénanie » (nettement faux : Rhénanie démilitarisée). |
| ch11:banque:110 | Le Nobel de la paix 1919 de Wilson est remis en 1920. | **Corrigée** : « le prix Nobel de la paix de 1919 » ; explication et chapitre précisés. |
| ch11:banque:142 | L'énoncé donnait la date du 1er décembre 1918, donc la réponse de la 038. | **Corrigée** : « Quel nom le royaume des Serbes, Croates et Slovènes prend-il en 1929 ? » ; la 038 est remplacée pour ne plus demander le nom de ce royaume. |
| ch11:banque:143 (écart) | Réponse « Les Allemands des Sudètes » refusée par la liste. | **Corrigée** : « les Allemands des Sudètes » et « des Allemands des Sudètes » ajoutés aux réponses acceptées. La réponse du relecteur était juste. |

## Corrections du texte du chapitre

- Prix Nobel : « Wilson reçoit le prix Nobel de la paix de 1919, le Français Léon Bourgeois celui de 1920 » (au lieu de « en 1919 … en 1920 »). Le HTML compte 13 999 caractères.

## Points de doute (à trancher par l'enseignant)

| Source | Doute | Proposition |
| --- | --- | --- |
| ch11:banque:002, 010, 076, 079 | Pertes par pays : ordres de grandeur usuels (Russie 1,8 million, Royaume-Uni et empire 900 000, États-Unis 115 000, Autriche-Hongrie 1,1 million), qui varient selon les sources. | Garder : les écarts entre propositions sont larges. |
| ch11:banque:128 | Échange gréco-turc : 1,2 million de Grecs orthodoxes et 400 000 musulmans, chiffres usuels mais arrondis. | Garder. |
| ch11:banque:048, 123 | La vrai/faux 123 sur le départ des Japonais de Vladivostok (octobre 1922) donne un léger indice pour la 048 (guerre civile jusqu'en 1922). | Garder ; indice faible. |

## Contrôles

- `verifier 11` : « Banque du chapitre 11 conforme : 150 questions. »
- `cours 11` : « Nettoyage HTML : rien n'est retiré. »
- Biais de longueur : la bonne réponse est la plus longue dans 30,7 % des `qcm_unique`.
- Positions de la bonne réponse (`qcm_unique`) : 19 / 19 / 19 / 18, tirées au hasard (graine fixe).
- Réponses courtes : toutes présentes dans le texte du chapitre.
