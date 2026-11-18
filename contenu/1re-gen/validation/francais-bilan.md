# Bilan : cours de français, première générale

Cours `contenu/1re-gen/francais.json` : slug `francais-1re-gen`, filière `GEN`, niveau `1re`, matière « Français », couleur `#b91c1c` (contraste 6,47:1 avec le blanc, au-dessus du minimum de 4,5:1 ; même couleur que le cours de seconde). 11 chapitres, 77 sections, **1 650 questions, toutes au statut `valide`** après relecture indépendante.

## Programme suivi

Résumé dans `programmes/francais-1re.md`, plan dans `programmes/francais-1re-plan.md`.

- **Programme** : arrêté du 17 janvier 2019 (NOR MENE1901575A, BO spécial n° 1 du 22 janvier 2019, annexe 2), modifié par l'arrêté du 10 avril 2020 (NOR MENE2009427A, BO n° 18 du 30 avril 2020 : œuvres renouvelées « par quart » chaque année). Vérifié le 11 novembre 2026 : aucun nouveau programme de français n'a été publié pour la rentrée 2026 (les textes nouveaux concernent les mathématiques et les langues vivantes).
- **Œuvres 2026-2027** : note de service du 4 juillet 2025 (NOR MENE2518792N, BO n° 30 du 24 juillet 2025), pour l'EAF de la session 2028. Roman renouvelé (Chrétien de Troyes, Zola *Pot-Bouille*, Schwarz-Bart) ; idées (La Boétie, Fontenelle, Graffigny), théâtre (Corneille, Musset, Sarraute) et poésie (Rimbaud, Ponge, Dorion) maintenus.
- **Épreuves** : nouvelle note de service du 11 septembre 2026 (NOR MENE2622658N, BO spécial n° 4 du 17 septembre 2026), applicable dès 2026-2027 (session 2028) : écrit de 4 h (commentaire ou dissertation, choix entre trois sujets de dissertation) ; oral avec lecture notée à part (2 points), explication linéaire (8), grammaire (2), seconde partie (8).

## Chapitres et questions

| N° | Chapitre | Sections | HTML (car.) | Questions | Types (U / M / V / R) | Difficultés (1 / 2 / 3) |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | La poésie du XIXe au XXIe siècle : mouvements et formes | 7 | 16 997 | 150 | 75 / 30 / 30 / 15 | 61 / 62 / 27 |
| 2 | Les œuvres poétiques au programme : Rimbaud, Ponge, Dorion | 7 | 16 978 | 150 | 78 / 27 / 30 / 15 | 61 / 59 / 30 |
| 3 | La littérature d'idées du XVIe au XVIIIe siècle : contextes et formes | 7 | 18 764 | 150 | 77 / 30 / 30 / 13 | 60 / 63 / 27 |
| 4 | Les œuvres d'idées au programme : La Boétie, Fontenelle, Graffigny | 7 | 17 031 | 150 | 75 / 30 / 30 / 15 | 60 / 60 / 30 |
| 5 | Le roman et le récit du Moyen Âge au XXIe siècle : histoire et outils | 7 | 16 977 | 150 | 75 / 30 / 30 / 15 | 60 / 60 / 30 |
| 6 | Les romans au programme : Chrétien de Troyes, Zola, Schwarz-Bart | 7 | 16 695 | 150 | 75 / 30 / 30 / 15 | 60 / 60 / 30 |
| 7 | Le théâtre du XVIIe au XXIe siècle : esthétiques et dramaturgie | 7 | 16 997 | 150 | 75 / 30 / 30 / 15 | 57 / 62 / 31 |
| 8 | Les pièces au programme : Corneille, Musset, Sarraute | 7 | 17 021 | 150 | 75 / 30 / 30 / 15 | 61 / 59 / 30 |
| 9 | Les subordonnées circonstancielles et les relations logiques | 7 | 17 076 | 150 | 75 / 30 / 30 / 15 | 60 / 60 / 30 |
| 10 | L'interrogation, la négation et le lexique | 7 | 16 181 | 150 | 75 / 30 / 30 / 15 | 60 / 60 / 30 |
| 11 | Préparer l'épreuve anticipée : commentaire, dissertation, oral | 7 | 16 983 | 150 | 75 / 30 / 30 / 15 | 62 / 58 / 30 |
| | **Total** | **77** | | **1 650** | | |

Statuts : 1 650 `valide`, 0 `a_relire`, 0 `brouillon`.

## Validation

- **Banques** : les onze `banques/francais-chN.json` sont conformes à `verifierBanque` (quotas de STSS : 150 questions, 75 / 30 / 30 / 15, 60 / 60 / 30, tolérance ± 3), y compris contre le cours final. Les questions du cours sont identiques à celles des banques (seuls ajouts : `statut` et la valeur par défaut `marge_relative`).
- **Cours** : `analyserImport` sans erreur ; 1 330 072 octets (limite 3 Mo) ; `nettoyerHtml` ne retire rien des 77 sections et des 11 « Je retiens » (seul ajout : `tabindex` sur les tableaux) ; import à blanc par `versDonneesCours` (`garderStatuts`) : charge utile de `importer_cours` construite, aucune base contactée. Import réel à faire : `npm run import:contenu -- contenu/1re-gen/francais.json`.
- **Rapports** : `validation/francais-ch1.md` à `francais-ch11.md`.

## Relecture indépendante des quiz

Pour chaque banque, un sous-agent qui ne l'avait pas écrite :
1. a résolu les 150 questions **à l'aveugle** (fichier sans réponses ni explications, produit par script), à partir du seul texte du chapitre ;
2. a comparé ses réponses aux réponses attendues (comparaison automatique) ;
3. a relu toutes les questions avec leurs réponses, corrigé ou remplacé, et consigné le tout dans `banques/francais-chN-relecture.md`.

La session principale a ensuite contrôlé les faits que chaque auteur déclarait incertains (dates, citations, intrigues) et relu les questions modifiées.

| Chapitre | Écarts à l'aveugle | Corrigées | Remplacées |
| --- | --- | --- | --- |
| 1 | 0 | 0 | 3 |
| 2 | 0 | 1 | 3 |
| 3 | 0 | 1 | 0 |
| 4 | 0 | 2 | 0 |
| 5 | 0 | 0 | 0 |
| 6 | 0 | 3 | 0 |
| 7 | 0 | 3 | 0 |
| 8 | 0 | 18 | 5 |
| 9 | 0 | 3 | 1 |
| 10 | 0 | 5 | 2 |
| 11 | 0 | 15 | 0 |
| **Total** | **0** | **51** | **14** |

**Erreurs corrigées, les plus importantes** :
- texte du cours, chapitre 4 : datation du *Discours* de La Boétie par Montaigne inversée (avant dix-huit ans, puis seize ans) ; question 005 corrigée ;
- chapitre 1, 038 : deux bonnes réponses reposaient sur des exemples absents du cours ;
- chapitre 7, 124 : l'aparté compté comme forme qui révèle les pensées, ce que le cours ne dit pas ; 033 et 108 : distracteurs défendables ;
- chapitre 8 : 10 énoncés qui ne nommaient pas la pièce ; 109 ambiguë (Lucrèce et Clarice) ; 003 explication fausse sur les alexandrins ;
- chapitre 10 : 015 explication contraire au cours ; 081 distracteur contraire à la terminologie du cours ; précision du cours sur « quel » attribut ;
- chapitre 11 : 14 conseils de méthode présentés comme des règles officielles ; précision du cours sur le récapitulatif ;
- 14 doublons ou paires inverses remplacés (chapitres 1, 2, 8, 9, 10).

**Limite de la méthode** : les onze résolutions à l'aveugle donnent 0 écart. Les questions sont donc justes et sans ambiguïté pour un lecteur attentif du cours, mais une partie est sans doute **facile** : beaucoup de questions de rappel direct. Les relecteurs sont des modèles de la même famille que les auteurs ; leur indépendance tient à la séparation des tâches, pas à une formation différente.

## Scripts du dépôt : changements à prévoir (non faits)

Comme pour les cours de seconde, `banque:verifier`, `banque:fusionner` et `banque:texte` ne connaissent que `bph` et `stss` (`src/lib/contenu/banque/cours.ts`) et lisent `contenu/1re-st2s/banques/` en dur. Contrôles faits avec un outil hors dépôt qui appelle les mêmes fonctions (`verifierBanque`, `fusionnerBanque`, `texteChapitre`, `analyserImport`, `nettoyerHtml`, `versDonneesCours`). Proposition : ajouter une entrée `francais-1re` (fichier `contenu/1re-gen/francais.json`, préfixe `francais`, total 150) et dériver le dossier des banques du chemin du cours.

## Points à trancher

1. **Statut `valide` pour les 1 650 questions** : appliqué comme dans les validations de BPH et STSS (commits 67d1671, 90bd11c), parce qu'aucune question n'est restée douteuse après relecture. Elles seront donc **tirées dans les quiz dès l'import**. Si tu préfères une validation humaine d'abord, importe sans `--garder-statuts` après avoir passé le fichier en `a_relire`.
2. **Préfixe des sources** : `francais:chN:banque:NNN`, le même que le cours de seconde. Les sources sont uniques dans un fichier de cours, donc pas de collision à l'import ; mais deux cours distincts portent des sources identiques (à changer en `francais1re:` si la base l'exige un jour).
3. **Plan** : deux chapitres par objet d'étude, dont un qui couvre les trois œuvres au programme (l'élève n'en étudie qu'une). Variante : un chapitre par œuvre.
4. **Œuvres protégées** (Ponge, Sarraute, Schwarz-Bart, Dorion) : présentées sans citation au-delà des titres et de formules très brèves.
5. **Renouvellement annuel** : en 2027-2028, la poésie change (Verlaine, Aragon, Chedid ; note MENE2626341N) : le chapitre 2 sera à réécrire.
6. **Voie technologique** (contraction et essai) non traitée.
7. **Taille** : le chapitre 3 dépasse la cible de 17 000 caractères de HTML (18 764), sans conséquence technique.
8. **Choix normatifs et terminologiques** à confirmer avec ton manuel : exclamation à part des trois types de phrase, négative comme « forme » de phrase, « malgré que » déconseillé (chapitres 9 et 10) ; *Le Menteur* classé en comédie d'intrigue (chapitre 7).
9. Points de doute détaillés : fin de chaque `banques/francais-chN-relecture.md` et de chaque `validation/francais-chN.md`.
