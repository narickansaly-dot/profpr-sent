# Relecture de la banque du chapitre 1 d'espagnol de 1re (Fronteras, viajes y migraciones)

## Méthode

- Relecture **indépendante** par un sous-agent (modèle Sonnet) qui n'a vu ni le fichier de banque ni les réponses attendues : il a lu le texte du chapitre (`texteChapitre`), puis les 150 questions sans réponses (propositions numérotées), a résolu chacune et commenté toute ambiguïté, tout distracteur défendable et toute erreur de langue.
- Comparaison automatique de ses réponses aux réponses attendues (normalisation des réponses courtes : casse, accents et ponctuation ignorés, comme `prive.normaliser`).
- Résultat : **150 réponses identiques sur 150, 0 écart**. 18 questions commentées ; les remarques fondées ont été corrigées ci-dessous.

## Questions corrigées

| N° | Remarque du relecteur | Décision |
| --- | --- | --- |
| 011 | « Llegó a la frontera y pidió asilo en Estados Unidos » : arriver à la frontière n'est pas encore arriver dans le pays. | Proposition remplacée par « Se instaló en Argentina en 1950 y nunca volvió » ; explication reprise. |
| 029 | « Contraire » discutable (*sueño* = rêve ou sommeil). | Énoncé : « *La pesadilla* (le cauchemar) s'oppose à *el sueño* (le rêve) ». |
| 031 | « Obligatoire » un peu fort pour le *a* personnel. | Énoncé : « D'après la règle du cours, le *a* est nécessaire… ». |
| 056 | Distracteur « siguió a » hors sujet. | Remplacé par « seguía ». |
| 089 | Distracteurs mal formés, dont un tronqué. | Question réécrite : traduction de « Je dormais quand le train s'est arrêté », trois distracteurs nets (*dormí… paraba*, *dormiba*, *paré*). |
| 094 | Distracteurs artificiels ; critère flou. | Énoncé précisé (décor à l'imparfait, événement au passé simple) ; distracteurs simplifiés. |
| 095 | *Había* est l'imparfait de *haber* impersonnel. | Énoncé : « *Había* (il y avait) correspond à *hay* mis à l'imparfait ». |
| 107 | « Action antérieure » : on ne sait pas laquelle. | Énoncé : préposition + infinitif qui marque un « avant » ou un « après ». |
| 123 | Le texte ne dit pas qu'Adriana part seule. | Énoncé : « une nuit de mars, avec un sac à dos et très peu d'argent » (texte cité). |
| 135 | Le Guatemala aussi a une frontière avec le Mexique. | Énoncé : la frontière franchie « pour entrer aux États-Unis ». |

## Remarques examinées sans correction

- 012 (*cruzar el mar / el desierto*), 108 (*Hace un mes que se fue*) : formes correctes et courantes, compréhensibles au niveau B1 même si le cours ne les cite pas mot pour mot.
- 028 : *Echo de menos mis amigos* existe à l'oral, mais la norme et le cours imposent *a* devant une personne.
- 033, 113, 126, 141 (réponses courtes) : la casse et les accents sont ignorés par la correction ; les variantes utiles sont listées (« la Bestia » / « Bestia » ; « Erasmus », « Erasmus+ », « programa Erasmus », « el programa Erasmus »).
- 071 : le contexte (*Fue un viaje*, sans *a* + lieu) tranche pour *ser*, et l'explication le dit.

## Avant la relecture (contrôle de l'auteur)

Deux corrections faites avant la relecture : 21 questions de rappel pur passées de la difficulté 2 à 1 (répartition imposée 60 / 60 / 30), et cinq énoncés reformulés parce que trop proches (similarité > 0,8 : 042, 053, 055, 063, 073).

## Résultat

- `verifierBanque` : « Banque du chapitre 1 conforme : 150 questions ». Types 75 / 30 / 30 / 15 ; difficultés 60 / 62 / 28 ; vrai/faux 17 vrais, 13 faux ; positions de la bonne réponse 19 / 19 / 19 / 18 ; bonne réponse la plus longue dans 18 QCM sur 75.
- Statut après relecture : les 150 questions sont `valide` ; aucune question n'est restée douteuse.
