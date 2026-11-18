# Relecture de la banque du chapitre 9 d'histoire-géographie (1re)

Banque : `histoire-geo-ch9.json`, 150 questions au statut `a_relire` après fusion. Chapitre : « Un embrasement mondial et ses grandes étapes ».

## Méthode

- Questions rédigées à partir du seul texte du chapitre 9 (sortie de `outil.ts texte 9`).
- Relecture indépendante à l'aveugle : un sous-agent a résolu les 150 questions sans voir les réponses attendues ni les explications.
- Comparaison automatique de ses réponses avec les réponses attendues (`[ECART]` si elles diffèrent, `[REMARQUE]` si la réponse est la même mais commentée).
- Contrôles `verifierBanque` (quotas de 150 questions, positions, biais de longueur, espaces insécables, similarité des énoncés), puis contrôle de la présence de chaque réponse courte dans le texte du chapitre.

## Résultat de la relecture indépendante

Le relecteur a donné la même réponse que l'auteur pour 145 questions sur 150. Il y a 5 écarts et 7 remarques sur d'autres questions (les 11 sources concernées sont traitées ci-dessous).

Les 30 vrai/faux (sources 106 à 135) alternaient presque strictement vrai et faux. Ils ont été mélangés au hasard (graine fixe, au plus 3 réponses identiques de suite), sans changer leur contenu. Les sources de cette série ont donc changé : la colonne « Source » donne la source relue, puis la nouvelle source entre parenthèses.

| Source | Constat du relecteur | Décision |
| --- | --- | --- |
| ch9:banque:016 | Doublon avec 138 (Gallieni envoie des renforts sur la Marne). | **Remplacée** : dans quelle direction les armées allemandes obliquent-elles début septembre 1914 (à l'est de Paris). Même type, même difficulté, bonne réponse à la même position. |
| ch9:banque:029 | L'authenticité de la formule « saigner à blanc » (connue par les mémoires de Falkenhayn) est discutée. | **Corrigée** avec le chapitre : « Selon ses mémoires, quel but Falkenhayn donne-t-il à l'offensive de Verdun ? » ; l'explication signale le débat. |
| ch9:banque:073 | Seul Wilson est un président parmi les propositions : l'énoncé donne la réponse. | **Corrigée** : « Qui déclare la guerre à l'Allemagne au nom des États-Unis en avril 1917 ? » ; Churchill est remplacé par Zimmermann. |
| ch9:banque:100 | Le transfert de divisions vers l'Ouest est une déduction, pas un fait énoncé comme conséquence du traité. | **Corrigée** avec le chapitre : « l'Allemagne peut transférer des divisions vers l'Ouest » est ajouté après le traité de Brest-Litovsk. |
| ch9:banque:110 (→ 111) | Les vrai/faux alternent strictement faux/vrai : motif devinable. | **Corrigée** : série des 30 vrai/faux mélangée (voir plus haut). |
| ch9:banque:130 (→ 133) (écart) | Le relecteur a répondu « vrai » à « Le traité de Brest-Litovsk est signé en mars 1917 ». | **Maintenue** : l'énoncé est nettement faux (3 mars 1918) ; erreur probablement due à l'alternance des réponses ou à la confusion avec l'abdication de mars 1917. |
| ch9:banque:131 (→ 117) (écart) | Le relecteur a répondu « faux » à « Les bolcheviks signent un armistice avec l'Allemagne en décembre 1917 ». | **Maintenue** : le chapitre l'indique explicitement ; même cause probable que la 130. |
| ch9:banque:132 (→ 107) (écart) | Le relecteur a répondu « vrai » à « L'offensive Michael est lancée par les Alliés ». | **Maintenue** : l'offensive Michael est l'offensive allemande de Ludendorff ; même cause probable. |
| ch9:banque:133 (→ 127) (écart) | « Aucun soldat allié n'est entré en Allemagne » est faux : les Français occupent depuis 1914 une petite partie de la Haute-Alsace, alors allemande. | **Corrigée** avec le chapitre : l'énoncé devient « En novembre 1918, le front se trouve encore en France et en Belgique » (vrai) ; le chapitre dit « le front est encore en France et en Belgique : l'Allemagne n'est pas envahie ». |
| ch9:banque:137 (écart) | Réponse « L'Alsace-Moselle (Alsace-Lorraine) », refusée par la comparaison. | **Maintenue** : les deux formes sont acceptées séparément ; seule la double réponse entre parenthèses n'est pas reconnue. |
| ch9:banque:138 | Doublon avec 016. | **Maintenue** : c'est la 016 qui est remplacée. |

## Corrections du texte du chapitre

- Verdun : « il dira dans ses mémoires avoir voulu « saigner à blanc » l'armée française » (au lieu de présenter la formule comme un objectif avéré).
- Brest-Litovsk : ajout de « l'Allemagne peut transférer des divisions vers l'Ouest ».
- Encadré sur la légende du « coup de poignard dans le dos » : « le front est encore en France et en Belgique : l'Allemagne n'est pas envahie » (au lieu de « aucun soldat allié n'est entré en Allemagne »).
- Coupes de quelques mots pour rester sous 14 000 caractères de HTML (13 998).

## Points de doute (à trancher par l'enseignant)

| Source | Doute | Proposition |
| --- | --- | --- |
| ch9:banque:029 | La formule « saigner à blanc » n'est connue que par les mémoires de Falkenhayn ; son authenticité est discutée. | Garder sous sa forme « selon ses mémoires ». |
| ch9:banque:052 | « Environ 600 000 soldats coloniaux » mobilisés par la France : ordre de grandeur usuel, les sources varient (de 550 000 à 600 000 environ). | Garder ; ne pas exiger un chiffre exact. |
| ch9:banque:043 | Les Dardanelles font « plus de 100 000 morts » : les estimations des pertes ottomanes varient beaucoup. | Garder (la question demande un bilan qualitatif). |
| ch9:banque:025 et 141 | « Première grande attaque aux gaz toxiques » (Ypres, 22 avril 1915) : les Français ont employé des grenades lacrymogènes dès 1914, d'où la formulation retenue. | Garder la formulation « grande attaque aux gaz toxiques ». |

## Contrôles

- `verifier 9` : « Banque du chapitre 9 conforme : 150 questions. »
- `cours 9` : « Nettoyage HTML : rien n'est retiré. »
- Biais de longueur : la bonne réponse est la plus longue dans 30,7 % des `qcm_unique`.
- Positions de la bonne réponse (`qcm_unique`) : 19 / 19 / 19 / 18.
- Vrai/faux : 15 vrais, 15 faux, mélangés sans motif.
- Réponses courtes : toutes présentes dans le texte du chapitre.
