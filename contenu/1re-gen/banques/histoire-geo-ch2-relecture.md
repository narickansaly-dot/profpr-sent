# Relecture de la banque du chapitre 2 d'histoire-géographie (1re)

Banque : `histoire-geo-ch2.json`, 150 questions au statut `a_relire` après fusion. Chapitre : « L'Europe entre restauration et révolution (1814-1848) ».

## Méthode

- Questions rédigées à partir du seul texte du chapitre 2 (sortie de `outil.ts texte 2`).
- Relecture indépendante à l'aveugle : un sous-agent a résolu les 150 questions sans voir les réponses attendues ni les explications.
- Comparaison automatique de ses réponses avec les réponses attendues (`[ECART]` si elles diffèrent, `[REMARQUE]` si la réponse est la même mais commentée).
- Contrôles `verifierBanque` (quotas de 150 questions, positions, biais de longueur, espaces insécables, similarité des énoncés), puis contrôle de la présence de chaque réponse courte dans le texte du chapitre.

## Résultat de la relecture indépendante

Le relecteur a donné la même réponse que l'auteur pour 146 questions sur 150. Il y a 4 écarts et des remarques sur 13 autres questions (le fichier de comparaison compte 15 remarques ; les 17 entrées détaillées sont traitées ci-dessous).

| Source | Constat du relecteur | Décision |
| --- | --- | --- |
| ch2:banque:010 | Bonne réponse nettement plus longue que les distracteurs. | **Corrigée** : propositions de longueurs voisines. |
| ch2:banque:016 | Doublon avec 112 (mode de désignation des députés). | **Remplacée** : quelle dynastie revient au pouvoir en 1814 (les Bourbons). |
| ch2:banque:026 | Le cens de 200 francs vient d'une loi de la monarchie de Juillet (1831), pas directement de la révolution de 1830. | **Corrigée** : « Sous la monarchie de Juillet, quel cens… » (sans citer 1831, réponse de la 148). |
| ch2:banque:067 | Doublon avec 130 (lieu de fondation de la Jeune-Italie). | **Remplacée** : le rôle des artistes romantiques dans le mouvement des nationalités. |
| ch2:banque:068 | Erreur de fait : la vague de 1848 commence à Palerme (janvier), pas à Paris ; le chapitre disait la même chose. | **Corrigée** avec le chapitre : « Quelle ville donne, en février 1848, son élan européen à la vague révolutionnaire ? » (Paris). |
| ch2:banque:073 | Recoupe 103 (l'Autriche reprend l'Italie du Nord). | **Maintenue** ; c'est la 103 qui est corrigée (Venise capitule en août 1849, ajouté au chapitre). |
| ch2:banque:100 (écart) | Les associations d'étudiants allemandes sont d'abord publiques et ne deviennent clandestines qu'après 1819 ; le relecteur a aussi coché la Sainte-Alliance. | **Corrigée** : la proposition devient « Les associations d'étudiants allemands après leur interdiction en 1819 » ; le chapitre précise « interdites en 1819 ». La Sainte-Alliance est un traité entre souverains, pas une association secrète. |
| ch2:banque:102 (écart) | Le relecteur n'a pas retenu « le refus des régimes de s'ouvrir », formule trop vague. | **Corrigée** : « Le refus des régimes d'élargir le droit de vote et les libertés », même formule dans le chapitre. |
| ch2:banque:103 | (voir 073) | **Corrigée** : la seconde bonne réponse devient « Venise, assiégée, doit capituler ». |
| ch2:banque:108 | « Plus de guerre générale avant 1914 » : discutable à cause de la guerre de Crimée. | **Corrigée** avec le chapitre : « pas de guerre générale comparable à celles de 1792-1815 ». |
| ch2:banque:124 | Doublon avec 091 (échec de l'insurrection polonaise). | **Remplacée** : « En 1815, la Pologne retrouve un État indépendant » (faux). La proposition « La Pologne est de nouveau partagée » de la 080 est remplacée par « Le Piémont-Sardaigne récupère Nice et la Savoie » pour éviter un nouveau doublon. |
| ch2:banque:129 (écart) | Le relecteur a répondu « vrai » à « L'indépendance grecque est reconnue dès 1815 par le congrès de Vienne ». | **Maintenue** : l'énoncé est nettement faux (insurrection en 1821, indépendance reconnue en 1830) ; erreur de lecture. |
| ch2:banque:132 | Doublon avec 100 (associations d'étudiants allemandes). | **Remplacée** : « Mazzini crée la Jeune-Europe avant la Jeune-Italie » (faux). |
| ch2:banque:138 | Accepter aussi « Charte octroyée ». | **Corrigée** : variantes ajoutées. |
| ch2:banque:140 (écart) | Accepter « ultra-royalistes ». | **Corrigée** : formes avec trait d'union ajoutées. |
| ch2:banque:145 | Accepter « Scio ». | **Maintenue** : « Scio » était déjà accepté. |
| ch2:banque:146 | Accepter « philhellènes ». | **Maintenue** : la question demande le nom du mouvement ; « philhellènes » désigne ses partisans. |
| ch2:banque:147 | Accepter « charbonnerie ». | **Corrigée** : « charbonnerie » et « la charbonnerie » ajoutés. |

## Corrections du texte du chapitre

- Printemps des peuples : la vague de 1848 est « commencée à Palerme en janvier puis amplifiée par la révolution parisienne de février » (au lieu de « partie de Paris »).
- Causes de 1848 : « refus des régimes d'élargir le droit de vote et les libertés ».
- Fin de l'échec de 1848 : « Venise, assiégée, capitule en août 1849 ».
- Associations d'étudiants en Allemagne : « interdites en 1819 ».
- Concert européen : « l'Europe ne connaît plus, avant 1914, de guerre générale comparable à celles de 1792-1815 ».
- Coupes de quelques mots pour rester sous 14 000 caractères de HTML (13 998).

## Points de doute (à trancher par l'enseignant)

| Source | Doute | Proposition |
| --- | --- | --- |
| ch2:banque:030 | « Environ 240 000 électeurs en 1846 » (et environ 170 000 en 1831 dans le chapitre) : ordres de grandeur usuels, les chiffres varient selon les sources. | Garder ; ne pas exiger le chiffre exact. |
| ch2:banque:056 | Chios : « environ 100 000 habitants » ; la répartition entre tués, esclaves et exilés est très discutée. | Garder : la question ne demande pas de chiffre. |
| ch2:banque:108 | Jugement d'interprétation (absence de guerre générale comparable à 1792-1815), même reformulé. | Garder ; à discuter en classe. |
| ch2:banque:117 | Âge électoral de 25 ans : fixé par la Charte de 1830, le cens de 200 francs par la loi de 1831 ; le tableau du chapitre les regroupe. | Garder. |

## Contrôles

- `verifier 2` : « Banque du chapitre 2 conforme : 150 questions. »
- `cours` : « Nettoyage HTML : rien n'est retiré. »
- Biais de longueur : la bonne réponse est la plus longue dans 29,3 % des `qcm_unique`.
- Positions de la bonne réponse (`qcm_unique`) : 20 / 19 / 19 / 17.
- Réponses courtes : toutes présentes dans le texte du chapitre.
