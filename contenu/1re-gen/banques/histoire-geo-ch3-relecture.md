# Relecture de la banque du chapitre 3 d'histoire-géographie (1re générale)

Banque : `histoire-geo-ch3.json`, 150 questions au statut `a_relire` après fusion. Chapitre : « La difficile entrée dans l'âge démocratique : la Deuxième République et le Second Empire ».

## Méthode

- Questions rédigées à partir du seul texte du chapitre 3 (75 QCM à réponse unique, 30 QCM à réponses multiples, 30 vrai/faux, 15 réponses courtes ; 60 / 60 / 30 par difficulté).
- Relecture indépendante à l'aveugle : un sous-agent a résolu les 150 questions avec le seul texte du chapitre, sans voir les réponses attendues.
- Comparaison automatique de ses réponses avec les réponses attendues, puis examen de chaque écart et de chaque remarque.
- Contrôles `verifierBanque` (quotas, positions, biais de longueur, similarité des énoncés, espaces insécables) et présence de chaque réponse courte dans le texte du chapitre.
- L'ordre des propositions des QCM à réponse unique a été mélangé après la relecture, pour casser un cycle fixe de la position de la bonne réponse.

## Résultat de la relecture indépendante

150 accords sur 150 : 0 écart, 7 remarques.

| Source | Constat du relecteur | Décision |
| --- | --- | --- |
| ch3:banque:082 | « Décidée par le gouvernement provisoire » : exact, mais le texte ne dit pas explicitement qui prend le décret du 27 avril. | Corrigée : le chapitre dit désormais « le décret du gouvernement provisoire du 27 avril 1848 » ; l'explication est précisée. |
| ch3:banque:100 | Le distracteur « Des ministres responsables devant l'Assemblée » est en partie vrai pour l'Empire libéral de 1870. | Corrigée : distracteur remplacé par « Un roi héréditaire issu de la famille des Bourbons ». |
| ch3:banque:138 | Réponse trop ouverte : d'autres militantes (Niboyet, Désirée Gay, Pauline Roland) réclament le vote des femmes en 1848. | Corrigée : l'énoncé vise la militante qui tente en vain d'être candidate en 1849, fait ajouté au chapitre (encadré « Attention »). |
| ch3:banque:140 | Prévoir les graphies « Schoelcher » et « Schœlcher » seul. | Maintenue : ces variantes étaient déjà acceptées ; « Schelcher » est ajoutée. |
| ch3:banque:142 | Formes justes risquant d'être refusées (« Amantine Aurore Lucile Dupin », « Aurore Dudevant »). | Corrigée : variantes ajoutées (Amantine ou Amandine Aurore Lucile Dupin, Aurore Dupin Dudevant…). |
| ch3:banque:143 | Prévoir la variante officielle « Nohant-Vic ». | Maintenue : la variante était déjà acceptée. |
| ch3:banque:144 | Le texte est souvent appelé « Manifeste aux puissances ». | Corrigée : « Manifeste aux puissances » et « le Manifeste aux puissances » ajoutés. |

## Corrections du texte du chapitre

- Section « La révolution de février 1848 et ses conquêtes » : le décret d'abolition est attribué explicitement au gouvernement provisoire.
- Encadré « Attention » : « Jeanne Deroin tente en vain d'être candidate en 1849 ».
- Section « Les oppositions et la répression » : phrase « Il devient le symbole de la résistance républicaine » retirée pour rester sous 14 000 caractères (aucune question ne l'utilisait).
- HTML des sections : 13 968 caractères ; nettoyage HTML : rien n'est retiré.

## Points de doute

| Source | Doute | Proposition |
| --- | --- | --- |
| ch3:banque:012, 013, 015, 019, 073 | Chiffres arrondis classiques (environ 250 000 électeurs en 1846, plus de 9 millions en 1848, environ 3 millions d'exclus en 1850, environ 250 000 esclaves libérés, environ 27 000 arrestations en 1851). Les distracteurs sont d'un ordre de grandeur différent. | Garder. |
| ch3:banque:053, 064, 128 | Questions qui s'appuient sur le tableau des votes (résultats arrondis des plébiscites de 1851, 1852 et 1870). | Garder ; elles demandent de lire le tableau, pas de retenir les chiffres exacts. |
| ch3:banque:027 | « Moins de 18 000 voix » pour Lamartine (17 910 selon les résultats officiels). | Garder. |

## Contrôles

- `verifierBanque` : conforme, 150 questions.
- Biais de longueur : bonne réponse strictement la plus longue dans 29,3 % des QCM à réponse unique (33,3 % en comptant les ex aequo).
- Positions de la bonne réponse : 19 / 19 / 19 / 18.
- Réponses courtes : les 15 réponses principales sont présentes dans le texte du chapitre.
