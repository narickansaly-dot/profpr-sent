# Relecture du chapitre 6 de STSS : « Déterminants de santé et émergence d'un problème de santé »

Relecture indépendante (task 3, N = 6). Fichier corrigé : `.superpowers/sdd/2027-01-26-etape-6b-stss/stss-ch6.json`.

## Bilan

- **Programme** : les notions N23 à N31 et les capacités C13 à C19 du plan sont toutes traitées, dans les six sections prévues, dans l'ordre. Les notions reprises sont seulement rappelées : épidémiologie (N22, renvoi au chapitre 3) et santé publique (N5, rappel du chapitre 1 ajouté à la relecture, il manquait). La veille sanitaire et les institutions de veille sont renvoyées au chapitre 9, le gradient social au chapitre 3. Rien n'est hors programme.
- **Modèle de Lalonde** : son absence ne laissait aucune notion ni capacité sans traitement. C15 et la section 3 du plan (« lire et utiliser un modèle explicatif ») sont couverts par le modèle de Dahlgren et Whitehead. Le programme parle toutefois de « modèles explicatifs » au pluriel. Une phrase sur Lalonde a donc été ajoutée, sans tableau ni exercice.
- **Exactitude** : vérifié sur Légifrance que le décret n° 96-1133 du 24 décembre 1996 relatif à l'interdiction de l'amiante est entré en vigueur le 1er janvier 1997 (article 8). Le modèle de Dahlgren et Whitehead date bien de 1991 (document de base pour la stratégie européenne de l'OMS, Institute for Futures Studies, Stockholm). Ses couches correspondent au tableau du chapitre. Les autres faits signalés par le rédacteur sont exacts et sans chiffre : travaux britanniques des années 1950 sur le tabac (Doll et Hill), saturnisme, mobilisation des associations contre le sida dans les années 1980, canicule de 2003 (alerte tardive, puis plan canicule), pandémie de Covid-19 déclarée par l'OMS en 2020 et confinement au printemps 2020.
- **Cohérence avec le chapitre 1** : la définition de la préoccupation était plus large qu'au chapitre 1. Elle parlait d'une question qui inquiète « des personnes, des groupes ou la société ». Elle reprend maintenant la définition de travail du chapitre 1, puis ajoute ce qui est propre au chapitre 6 : la préoccupation n'est pas encore forcément reconnue. Les critères de reconnaissance renvoient aux critères du chapitre 1.
- **Format** : balises et classes du chapitre 1 (`def`, `warn`, `tbl`, `b.t`, `th scope="row"`). Il y a 106 vraies U+00A0, aucune entité `&nbsp;` et aucune espace ordinaire avant « : ; ! ? » ou à l'intérieur de « ».
- **Validateur** : `analyserImport`, avec le chapitre dans un cours minimal, ne renvoie aucune erreur. Le script jetable a été supprimé.

## Corrections

| Section | Problème | Correction |
| --- | --- | --- |
| `preoccupation-risque` | La définition de la préoccupation ne reprenait pas la définition de travail du chapitre 1 (« question de santé qui inquiète la société et ses responsables parce qu'elle concerne la population »). Elle l'élargissait à des personnes isolées. | La définition reprend celle du chapitre 1, puis précise que la préoccupation n'est pas encore forcément reconnue par la collectivité. |
| `preoccupation-risque` | Le rappel du chapitre 1 ne donnait pas les critères de repérage. | Les cinq critères du chapitre 1 sont rappelés dans la phrase d'introduction. |
| `preoccupation-risque` | Dans l'exemple des écrans, ce sont seulement « des parents » qui s'inquiètent : cela ressemble à une inquiétude privée. La tournure « mesurer ses effets » était aussi ambiguë. | « Des parents, des médecins et des enseignants s'inquiètent du temps que les enfants passent sur les écrans […] avant même qu'on sache bien en mesurer les effets. » |
| `preoccupation-risque` | « Stigmatisation » n'était pas défini. | Ajout de la parenthèse « être mis à l'écart ou jugé à cause de sa maladie ». |
| `reconnaissance` | La santé publique (N5, notion reprise) n'était pas rappelée, contrairement à ce qu'indique le rapport de rédaction. | Ajout d'un rappel de la définition du chapitre 1, au mot près. |
| `reconnaissance` | La phrase « Comptent alors son ampleur… » était elliptique, et « son » ne renvoyait à rien de clair. | Phrase réécrite : « Pour décider d'agir, on tient compte de l'ampleur de la question… » Elle renvoie aussi aux critères du chapitre 1. |
| `modeles-explicatifs` | « Alimentation disponible » ne correspond pas à l'intitulé de cette couche dans le modèle (*agriculture and food production*). | « agriculture et production alimentaire ». |
| `modeles-explicatifs` | Le programme parle de « modèles explicatifs » au pluriel, mais un seul modèle était évoqué. | Une phrase ajoutée sur le modèle de Lalonde (Canada, 1974) et ses quatre grandes familles de déterminants. |
| `sociaux-environnementaux` | « Interdit en France depuis 1997 » est exact, mais on peut le préciser à partir de Légifrance. | « interdit en France depuis le 1er janvier 1997 » (décret du 24 décembre 1996, non cité dans le texte). |
| `alerte-crise` | « Pandémie » n'était pas défini. | Ajout de « Une pandémie est une épidémie qui s'étend à de nombreux pays, sur plusieurs continents. » |
| `alerte-crise` | Dans « révèle la dimension sociale du risque, l'isolement, et conduit… », la syntaxe était confuse. | « La crise révèle la dimension sociale du risque : beaucoup de victimes vivaient seules. Elle conduit à créer un plan canicule. » |
| `alerte-crise` | « Remplis ce tableau » ne convient pas : le tableau ne contient que des questions. | « réponds aux questions de ce tableau ». |
| `a_retenir` | « Une préoccupation inquiète » était trop vague et ne reprenait pas la définition du chapitre 1. | « Une préoccupation de santé publique inquiète la société ». |

Points vérifiés et laissés tels quels :

- la définition du déterminant de santé et celle du facteur de risque (reformulations proches de l'OMS, sans guillemets) ;
- la définition des déterminants sociaux selon l'OMS (paraphrase, sans guillemets) ;
- le modèle de Dahlgren et Whitehead : 1991, nom « arc-en-ciel », couches et sens d'influence ;
- la distinction entre danger et risque, et l'exemple de l'eau de Javel ;
- les exemples de la canicule de 2003 et du Covid-19, sans aucun chiffre ;
- les renvois aux chapitres 1, 3 et 9, conformes au plan.

## Points de doute pour l'enseignant

1. **Modèle de Lalonde** : une seule phrase a été ajoutée pour justifier le pluriel « modèles explicatifs ». Elle peut être retirée sans rien perdre du programme si vous préférez un seul modèle. À l'inverse, elle peut être développée si votre manuel insiste sur ce modèle.
2. **Étapes de la reconnaissance** : signaux, mise en visibilité, objectivation, mise à l'agenda, réponse. C'est un schéma didactique issu de la sociologie des problèmes publics, pas une référence officielle. À adapter au vocabulaire de votre manuel.
3. **Définitions d'alerte et de crise sanitaire** : ce sont des formulations de manuel. Il n'existe pas de définition officielle unique. La phrase « l'alerte se gère avec les moyens habituels » est une simplification.
4. **Préoccupation** : le chapitre 1 parle de « préoccupation de santé publique », et le programme de « préoccupation ». Le chapitre 6 garde la définition de travail du chapitre 1. Ce n'est pas une définition officielle.
5. **« Un facteur de risque est un déterminant défavorable lié à une maladie précise »** : cette distinction est courante dans les manuels de ST2S, mais certains auteurs emploient les deux termes presque comme synonymes. À confirmer selon votre manuel.
6. **Couches de Dahlgren et Whitehead** : le chapitre compte la personne au centre, puis quatre couches. Certains manuels parlent de cinq niveaux. Le contenu est le même, seule la numérotation change.

## Éléments datés à vérifier avant publication

- **Interdiction de l'amiante** : depuis le 1er janvier 1997 (décret n° 96-1133 du 24 décembre 1996, Légifrance). Elle est stable.
- **Covid-19 et canicule de 2003** : ce sont des exemples historiques sans chiffre. Le texte invite l'élève à analyser une crise de l'actualité. Vérifiez qu'un exemple plus récent ne serait pas plus parlant au moment de la publication.
- **Plan canicule** : le texte dit seulement qu'un plan a été créé après 2003. Le dispositif a changé de nom depuis, mais la phrase reste vraie au passé.
