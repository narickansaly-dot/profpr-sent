# Relecture du chapitre 5 de STSS : « La démarche d'étude en santé-social »

Relecture indépendante (task 3, step 2, N = 5). Fichier corrigé : `.superpowers/sdd/2027-01-26-etape-6b-stss/stss-ch5.json`.

## Bilan

- **Programme** : les notions N68 à N79 (avec N19 repris) et les capacités C45 à C51 sont toutes traitées, dans les sept sections du plan et dans l'ordre. Les six objectifs du plan sont repris. Rien n'est hors programme. Les notions d'autres chapitres sont seulement rappelées avec un renvoi : indicateurs, proportion et producteurs de données au chapitre 3, recherche documentaire au chapitre 4, diagnostic et évaluation aux chapitres 9 et 10. La définition du producteur de données est cohérente avec celle du chapitre 3.
- **Exactitude** : les faits signalés par le rédacteur ont été vérifiés sur cnil.fr (« Le RGPD, c'est quoi », tables Informatique et libertés). La loi n° 78-17 du 6 janvier 1978, dite loi Informatique et libertés, a institué la CNIL, autorité administrative indépendante. Le RGPD est le règlement (UE) 2016/679 du 27 avril 2016. Il s'applique depuis le 25 mai 2018. Les données de santé font partie des données sensibles. L'Insee est correctement développé.
- **Calculs** : tous les calculs des tableaux fictifs ont été refaits. Tri à plat : 78 ÷ 104 = 75 % et 26 ÷ 104 = 25 %. Tri croisé, en pourcentages par ligne : 54 ÷ 63 = 85,7 %, arrondi à 86 % ; 9 ÷ 63 = 14,3 %, arrondi à 14 % ; 24 ÷ 41 = 58,5 %, arrondi à 59 % ; 17 ÷ 41 = 41,5 %, arrondi à 41 %. Chaque ligne fait bien 100 %. Les totaux de lignes et de colonnes sont justes : 63 + 41 = 104, 54 + 24 = 78 et 9 + 17 = 26. La plage `B2:B105` correspond à 104 réponses sous une ligne d'en-tête. Le nombre de répondants (104 sur 120 tirés au sort) est cohérent d'une section à l'autre. Les deux tableaux portent « (données fictives) » dans leur titre.
- **Format** : les classes sont celles du chapitre 1 (`def`, `t`, `tbl`, `warn`). `caption` et `th scope="row"` sont autorisés par le guide et par `html.ts`. Le fichier contient 117 U+00A0 et aucune entité `&nbsp;`. Il n'y a aucune espace ordinaire avant « : ; ? ! % » ni à l'intérieur de « ».
- **Validateur** : `analyserImport` ne renvoie aucune erreur. `nettoyerHtml` ne retire rien : il ajoute seulement `tabindex="0"` aux `div.tbl`, comme pour les autres chapitres.
- **Longueur** : le texte passe de 16 176 à 16 580 caractères (mesure : texte sans balises du chapeau, des objectifs, des sections et de « À retenir »). La courte définition de « variable » et celle de « moyenne » font l'essentiel de la hausse. Une phrase d'introduction redondante avec le chapeau et une phrase vide (« ont des particularités ») ont été retirées.

## Corrections

| Section | Problème | Correction |
| --- | --- | --- |
| `etude-action` | La première phrase répétait presque mot pour mot le chapeau. | Elle a été réduite aux trois questions (combien, lesquelles, de quoi ont-elles besoin ?). |
| `objet-etude` | Définition de la commande : une phrase lourde, ambiguë et au futur (« souvent la finance et en utilisera les résultats »). | Elle est coupée en deux phrases. Le commanditaire est défini à part : l'institution qui demande l'étude, souvent la finance et en utilise les résultats. |
| `objet-etude` | La ligne « Demande » de l'exemple décrivait un simple constat de l'infirmière, pas une demande. | Ajout de « Elle demande qu'on étudie la question. » |
| `methodes-recueil` | « juger leur fiabilité » : « leur » ne renvoyait clairement à rien. | « juger la fiabilité des données ». |
| `methodes-recueil` | La phrase « Les données sanitaires et sociales ont des particularités : » répétait le titre. | Phrase retirée : la liste suit directement le titre. |
| `echantillon` | L'exemple du tirage au sort (« cent élèves dans la liste du lycée ») contredisait l'exemple suivi (120 élèves de seconde sur 300). | « tirer au sort 120 élèves dans la liste des 300 élèves de seconde ». |
| `echantillon` | Exemple des quotas trop elliptique (« 60 % de filles dans la population, donc 60 % dans l'échantillon »). | « si la population compte 60 % de filles, l'échantillon en compte aussi 60 % ». |
| `echantillon` | « des élèves qui déjeunent le matin » est ambigu : en France, « déjeuner » désigne le repas de midi. | « des élèves qui prennent un petit-déjeuner ». |
| `echantillon` | La phrase d'exemple « 120 élèves… 104 ont répondu » n'était pas signalée comme fictive. | « Exemple fictif : ». |
| `ethique-protection` | La loi n'était datée que de l'année. | « du 6 janvier 1978 », date vérifiée sur cnil.fr. |
| `ethique-protection` | « correction » n'est pas le terme juridique. | Formulation « accès à leurs données, rectification des erreurs, effacement » : le terme juridique est expliqué dans la phrase. |
| `ethique-protection` | La définition de la protection de l'information était mal construite (« empêchent […] de laisser des personnes non autorisées voir »). | « les mesures qui empêchent d'identifier les personnes interrogées et qui réservent l'accès à leurs données aux seules personnes autorisées ». |
| `traiter-donnees` | La notion de **variable** n'était jamais nommée, alors que le tri à plat et le tri croisé reposent sur elle. | Elle est définie au dépouillement (une colonne = une question = une variable), puis reprise dans le tri à plat (« une seule variable ») et dans le tri croisé (« deux variables »). |
| `traiter-donnees` | La phrase « fréquence en pourcentage : effectif ÷ effectif total × 100 » confondait la fréquence (un rapport) et le pourcentage (la fréquence × 100). Le lien avec la proportion du chapitre 3 manquait aussi. | Le texte dit maintenant que la fréquence est l'effectif de la réponse ÷ l'effectif total, le plus souvent exprimée en pourcentage (× 100), comme la proportion du chapitre 3. Un calcul modèle est ajouté : 78 ÷ 104 × 100 = 75 %. |
| `traiter-donnees` | « =MOYENNE une moyenne » : le terme n'était pas défini. | « calcule une moyenne (somme des valeurs ÷ nombre de valeurs), par exemple la durée moyenne du trajet ». |

Points vérifiés et laissés tels quels :

- les six étapes de la démarche et l'exigence de cohérence et d'adaptation ;
- les définitions de demande, besoin, objet d'étude, hypothèse et protocole ;
- le tableau quantitatif / qualitatif et la complémentarité des méthodes ;
- les outils (questionnaire avec questions fermées et ouvertes, guide d'entretien directif, semi-directif ou libre, grille d'observation) ;
- l'encadré sur la question orientée ;
- les définitions de population étudiée, échantillon, enquête exhaustive, représentativité, tirage au sort, quotas et biais ;
- les principes éthiques ;
- la formule `=NB.SI(B2:B105;1)`, juste dans un tableur en français ;
- la mise en garde « lien n'est pas cause » ;
- le plan du rapport et les raisons de la diffusion.

## Points de doute pour l'enseignant

1. **Demande, besoin, commande** : ces définitions suivent l'usage courant des manuels de ST2S. Il n'existe pas de définition officielle unique. À aligner sur votre manuel si les nuances diffèrent, par exemple pour « besoin ressenti » et « besoin objectivé ».
2. **Consentement d'un mineur** : le texte dit prudemment que « l'accord des parents peut être nécessaire ». Les règles réelles dépendent du type d'étude (enquête scolaire, recherche impliquant la personne humaine, traitement de données). La formulation est volontairement générale ; à préciser seulement si vous suivez un cadre précis, par exemple le règlement intérieur ou les consignes académiques sur les enquêtes en établissement.
3. **« Hypothèse 1 confirmée »** : dans l'exemple fictif, l'hypothèse est dite « confirmée pour cet échantillon ». L'encadré suivant rappelle qu'un lien n'est pas une cause. Une classe exigeante pourrait préférer « semble confirmée », car l'échantillon est petit et aucun test statistique n'est au programme.
4. **Fréquence et pourcentage** : le texte distingue désormais la fréquence (rapport) et son expression en pourcentage, en cohérence avec la « proportion » du chapitre 3. Vérifiez que cela correspond au vocabulaire employé en mathématiques dans vos classes.
5. **Variable** : la notion a été ajoutée en une phrase pour rendre le tri à plat et le tri croisé compréhensibles. Elle ne figure pas parmi les notions du programme ; elle reste un outil de lecture, sans distinction entre variable qualitative et variable quantitative.
6. **Longueur** : le chapitre fait environ 16 600 caractères, un peu plus que le chapitre 1, avec sept sections et douze notions. Pour raccourcir, coupez d'abord la liste « Pourquoi la présentation et la diffusion comptent » (garder deux raisons suffit pour C51) ou l'encadré final de la section `presenter-diffuser`.

## Éléments datés à vérifier avant publication

- **Cadre légal** : la loi Informatique et libertés a été modifiée à plusieurs reprises, notamment en 2018 pour l'adapter au RGPD. Le chapitre ne cite que sa date de création et l'entrée en application du RGPD, deux faits stables.
- **Institutions** : seules l'Insee et la CNIL sont nommées, et leur nom n'a pas changé.
- **Syntaxe du tableur** : `NB.SI`, `SOMME` et `MOYENNE` sont les noms français dans Excel et LibreOffice Calc. Vérifiez qu'ils correspondent au tableur utilisé en classe (dans Google Sheets en français, le séparateur peut être une virgule selon les réglages).

Sources consultées : [cnil.fr, « Le RGPD, c'est quoi »](https://www.cnil.fr/fr/cnil-direct/question/2564) ; [cnil.fr, création de la CNIL et loi de 1978](https://www.cnil.fr/fr/loi-informatique-et-libertes-creation-mandat-valery-giscard-destaing) ; [Tables Informatique et libertés, édition 2026](https://www.cnil.fr/sites/default/files/2026-03/tables_il.pdf).
