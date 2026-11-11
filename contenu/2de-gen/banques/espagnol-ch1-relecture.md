# Relecture de la banque du chapitre 1 d'espagnol contre le cours

J'ai relu les 150 questions de `espagnol-ch1.json` contre le texte du chapitre 1 (« Vivir entre generaciones »), question par question. **Cette relecture a été faite par l'auteur de la banque, pas par un relecteur indépendant** : elle ne remplace pas la seconde lecture de l'enseignant, et toutes les questions restent `a_relire`.

Critères : exactitude de l'espagnol et du français ; une seule lecture possible ; seules les bonnes réponses sont justes ; explication présente ; niveau A2 de LVB ; aucune donnée qui ne soit pas dans le chapitre ; variantes des réponses courtes ; propositions interdites ; typographie (espace insécable avant « : ; ! ? », vérifiée par le script) ; tutoiement.

## Corrections faites pendant la rédaction et la relecture

| Source | Problème | Décision |
| --- | --- | --- |
| espagnol:ch1:banque:063 | Énoncé « Quelles phrases sont correctes ? » trop proche de la 036 (similarité 0,82). | Reformulé : « Repère les phrases où le verbe à diphtongue ou irrégulier est bien conjugué. » |
| espagnol:ch1:banque:147 | Énoncé calqué sur la 064 (« Quelles formes appartiennent au verbe… », similarité 0,90). | Reformulé : « Tener (avoir) : parmi ces formes du présent de l'indicatif, lesquelles existent ? » |
| Compréhension « Somos catorce en la mesa » | Seule la réponse en chiffres était acceptée. | Variante « catorce » ajoutée. |
| 17 qcm_unique | Le premier jet en comptait 92 : trop pour les quotas (75 ± 3), avec des doublons (la nièce et le neveu, deux questions sur l'âge avec *tener*, deux questions sur les raisons du départ tardif). | Supprimés ; 9 qcm_multiple, 1 vrai/faux et 2 réponses courtes ajoutés pour atteindre les quotas. |
| 22 questions | Premier jet trop chargé en difficulté 2 (90). | Rappels simples (une forme, un mot) repassés en difficulté 1. |

## Réponses courtes et accents

La correction ignore les majuscules, les accents (y compris le tilde du ñ, que `unaccent` change en n), la ponctuation de fin et les signes ¿ ¡ du début (`prive.normaliser`, guide des auteurs, partie 3). Conséquences :

- aucune réponse courte ne teste l'accent écrit : « tengo » et « tengó » seraient acceptés de la même façon. Les questions sur l'accent écrit sont des QCM ou des vrai/faux ;
- les variantes prévues sont : avec et sans article (« la hermana » / « hermana »), avec et sans pronom sujet (« puedes » / « tú puedes »), au masculin et au féminin quand le pronom est *vosotros* (« vosotros aprendéis » / « vosotras aprendéis »), en chiffres et en lettres (« 14 » / « catorce »), et pour la *quinceañera* l'expression « fiesta de quince años » et « los quince ».

## Répartition

- Types : 75 qcm_unique, 30 qcm_multiple, 30 vrai/faux (16 vrais, 14 faux), 15 réponses courtes.
- Difficultés : 60 / 58 / 32.
- Bonne réponse la plus longue : 25 qcm_unique sur 75 (33 %). Position de la bonne réponse : répartie en quatre parts égales par le générateur.
- Notions (9) : vocabulaire de la famille (15), âges et vie commune (14), présent régulier (18), diphtongues et irréguliers (32), possessifs (12), comparatifs (14), compréhension de l'écrit (21), culture (13), s'exprimer, prononcer, écrire (11).

Contrôle `verifierBanque` (configuration : préfixe `espagnol`, 150 questions) : « Banque du chapitre 1 conforme : 150 questions. »

## Points de doute pour l'enseignant

1. **« Mi prima es mejor que yo en matemáticas »** (comparatifs, difficulté 3) : la proposition « más buena que yo » est donnée fausse. Elle est grammaticale au sens moral (« plus gentille »), mais le contexte « en matemáticas » appelle « mejor ». Garder seulement si ce point a été vu en classe.
2. **« Los hermanos » = frères et sœurs** : la question précise le contexte (« dos chicos y una chica ») pour éviter la lecture « les frères seulement ».
3. **Tranches d'âge** : le chiffre « vers 30 ans » pour le départ du foyer est arrondi dans le cours ; il varie selon les années et les sources (autour de 30 ans selon Eurostat).
4. **Accent tonique** : deux questions (« juventud », « hablan ») portent sur les règles d'accentuation présentées dans la section « Para hablar » ; elles sont cotées 3.
5. **Possessif de vouvoiement** : la question « Señora, ¿cómo se llama ___ nieto? » suppose que l'élève a retenu que *usted* entraîne *su*.

## Mise à jour : programme de 2025

Le chapitre 1 correspond à l'axe 2 (« Vivre entre générations ») du programme de 2025. La banque est inchangée. Le cours a gagné un tableau de vocabulaire (*los bisabuelos, los ancianos, respetar, la convivencia, la solidaridad, pedir permiso, pedir perdón*) et un encadré sur les diminutifs en *-ito*. **Aucune question ne porte encore sur ces ajouts** ; à compléter si tu veux que la banque couvre toute la liste A2+ de l'axe.
