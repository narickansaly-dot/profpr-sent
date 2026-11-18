# Relecture de la banque du chapitre 2 de HLP (1re) contre le cours

Relecture des 150 questions de `hlp-ch2.json` contre le texte du chapitre « L'autorité de la parole : qui a le droit de dire vrai ? », question par question. Critères : exactitude selon le cours seul, une seule lecture possible, bonne(s) réponse(s) seules justes, distracteurs de même forme, aucune question qui donne la réponse d'une autre, explication qui justifie, niveau première, variantes des réponses courtes, typographie (espace insécable U+00A0 avant « : ; ! ? » et à l'intérieur des guillemets, posée par script) et tutoiement.

## Corrections faites pendant la rédaction

| Problème | Décision |
| --- | --- |
| Première version déséquilibrée : près de 70 qcm_unique sur les quatre premières sections, presque rien sur les autorités savantes, parole et action, l'essai. | 26 qcm_unique de rappel retirés (dont plusieurs transformés en vrai/faux ou réponses courtes), remplacés par des questions sur la scolastique, Descartes, Pascal, Austin, Bourdieu, Montaigne et les sujets d'essai. |
| Questions inverses : l'énoncé de l'une donnait la réponse d'une autre (Mnémosyne mère des Muses ; ipse dixit ; Hérodote qui se nomme ; Thucydide et l'oraison funèbre ; Pascal histoire/théologie ; Descartes en français ; Austin performatif/constatif). | Une question de chaque paire supprimée ou reformulée ; les distracteurs révélateurs remplacés (« L'apologia », « Thersite, l'homme du peuple », « la civilité enseignée par Érasme »). |
| « Je sais que je ne sais rien » : risque d'attribuer à Socrate une formule que le cours présente comme un résumé traditionnel. | Question qui porte justement sur cette prudence (résumé traditionnel, absent tel quel de l'Apologie). |
| Distracteur « Les Travaux et les Jours » envisagé pour la Théogonie : œuvre réelle d'Hésiode. | Écarté ; aucun distracteur n'est une autre œuvre de l'auteur visé. |
| Distracteur « 43 av. J.-C. » pour la date des Catilinaires : date de la mort de Cicéron, trop proche et ambiguë. | Remplacé par 431, 399 et 120 av. J.-C. |
| Rôle d'Olivier : le cours dit seulement qu'il conseille Roland. | Distracteur rédigé « Olivier, qui conseille Roland », sans qualificatif extérieur au cours. |
| Bonne réponse la plus longue dans 40 % des qcm_unique du premier lot. | Distracteurs allongés ou bonne réponse resserrée : 17 % sur la banque finale. |
| Réponse courte « historia » : « histoire » envisagé parmi les variantes, alors que l'énoncé demande le mot grec. | Variantes limitées à « historia », « l'historia », « istoria ». |

## Totaux

Types 75 / 30 / 30 / 15 (vrai/faux : 15 vrais, 15 faux) ; difficultés 62 / 60 / 28 ; position de la bonne réponse des qcm_unique : 19 / 19 / 19 / 18 ; bonne réponse la plus longue dans 13 qcm_unique sur 75 (17 %). Notions : 9 (de « Définir l'autorité » à « Interprétation et essai »). Vérification : « Banque du chapitre 2 conforme : 150 questions. »

## Relecture indépendante à l'aveugle

Un relecteur distinct, sans accès aux réponses attendues ni aux explications (fichier masqué), a répondu aux 150 questions à partir du seul texte du chapitre et signalé ses doutes ; ses réponses ont ensuite été comparées automatiquement aux réponses attendues (`comparer.py`).

Score : 150 / 150 réponses identiques ; 0 écart ; 35 doutes signalés (dont 9 avec correction proposée).

## Corrections après relecture indépendante

| Source | Problème | Décision |
| --- | --- | --- |
| hlp:ch2:banque:022 | « Hésiode » n'est pas un historien : distracteur trop faible pour « par quel historien ». | Remplacé par « Tite-Live », historien cité par le cours (fable de Ménénius Agrippa) ; explication complétée. |
| hlp:ch2:banque:037 | Bonne réponse nettement la plus courte, reprise mot pour mot du cours. | Remplacée par « À ne pas croire savoir ce qu'il ignore » (formulation du cours sur l'Apologie, longueur comparable aux distracteurs) ; explication ajustée. |
| hlp:ch2:banque:054 | « Invente » trop fort : Faux Semblant reprend une figure traditionnelle. | Énoncé aligné sur le cours corrigé : « Quelle figure Jean de Meun met-il en scène… ». |
| hlp:ch2:banque:074 | La fable de Ménénius Agrippa est rapportée par un historien : exemple juste pour le cours, mais discutable pour « la parole du poète ». | Énoncé rattaché à la piste du cours : « quel exemple le cours propose-t-il pour illustrer… ». |
| hlp:ch2:banque:104 | Xénophane conteste la parole des poètes plus que l'inspiration elle-même. | Énoncé : « …que la parole des poètes, même inspirée, n'est pas une garantie de vérité » ; explication reformulée. |
| hlp:ch2:banque:113 | « Pastiche ironique » présenté comme un fait, alors que le ton du Ménexène est discuté. | Énoncé et explication alignés sur le cours corrigé : Platon imite l'éloge de la cité dans le Ménexène, « sur un ton que beaucoup de lecteurs jugent ironique » (toujours vrai). |
| hlp:ch2:banque:122 | Formulation inexacte : l'Évangile selon saint Jean est écrit en grec. | « Dans la traduction latine de l'Évangile selon saint Jean, le mot verbum traduit le grec logos » (toujours vrai) ; explication précisée. |
| hlp:ch2:banque:140 | Transcription ionienne « historiè ». | « historiè » ajouté. |
| hlp:ch2:banque:141 | Graphie « Thersités ». | « Thersités » ajouté (déjà couvert par la normalisation des accents, ajouté par sûreté). |

## Points gardés sans correction

| Source | Doute du relecteur | Raison |
| --- | --- | --- |
| hlp:ch2:banque:056 | La proposition ne garde que « en marge », le cours dit « en marge ou entre les lignes ». | La proposition reste exacte et aucun distracteur ne lui fait concurrence ; l'allonger en ferait nettement la plus longue. L'explication donne la définition complète. |
| hlp:ch2:banque:136, 137, 139, 142, 143, 144, 146, 147, 149, 150 | Variantes usuelles (aletheia, Mnemosyne, la doxa, Tite Live, Titus Livius, 399 av. J.-C., maieutique, Rutebœuf, Ipse dixit, John Langshaw Austin, Erasme de Rotterdam). | Déjà acceptées, directement ou par la normalisation (casse et accents ignorés). |
| hlp:ch2:banque:145 | Faut-il accepter « apologie » pour le mot grec apologia ? | Gardé : simple francisation du même mot, titre de l'œuvre ; à la différence de « histoire » pour historia (140), ce n'est pas un autre mot. |
| hlp:ch2:banque:007, 013, 031, 073, 077, 082, 084, 093, 100, 107, 129, 131 | Remarques sans correction demandée (avertissement des Muses partiel, but de Xénophane, recoupement 030/031, Socrate et Platon, « un savoir » non proposé, homonymie des Philippiques, iségorie, mot « inutile » repris, distracteurs « la rime » et « lyre d'or », date des universités, piège 1862/1962). | Questions justes et sans ambiguïté selon le cours ; le relecteur lui-même ne demandait pas de correction. |

## Restent à relire

Aucune.

## Faits du cours signalés

Trois phrases signalées ont déjà été corrigées dans le cours, et les questions concernées (054, 087, 113) sont alignées sur le nouveau texte :

- Section « Socrate, une parole sans autorité ? », définition de l'ironie : eirôneia est désormais glosé « dissimulation », « ignorance feinte ». La question 087 (« feindre l'ignorance ») est cohérente avec cette glose ; aucune question ne reprenait « interrogation feinte ».
- Section « La parole religieuse », Le pacte : « Jean de Meun met en scène au contraire Faux Semblant » (au lieu de « invente »). Question 054 alignée.
- Section « La parole politique » : « Platon imitera ce genre d'éloge dans le Ménexène, sur un ton que beaucoup de lecteurs jugent ironique. » Question 113 alignée.

Point vérifié sans correction : l'expression « maître de vérité » figure bien dans le programme officiel (« premier maître de vérité et garant de la mémoire »). Précision facultative, à décider par l'auteur du cours : Marcel Detienne est plus souvent présenté comme helléniste ou historien de la Grèce ancienne. Phrase actuelle : « Le programme reprend une expression de l'historien Marcel Detienne… » ; phrase proposée : « Le programme reprend une expression de l'helléniste Marcel Detienne… ». La question 009 de la banque ne dépend pas de ce mot.

Suggestion facultative pour le cours : la piste « La parole du poète peut-elle dire la vérité ? » pourrait ajouter un exemple proprement poétique de fiction qui dit vrai (une fable de La Fontaine, par exemple), à côté de la fable de Ménénius Agrippa, rapportée par un historien.
