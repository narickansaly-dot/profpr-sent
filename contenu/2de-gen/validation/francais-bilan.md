# Bilan : cours de français, seconde générale

Cours `contenu/2de-gen/francais.json` : slug `francais-2de-gen`, filière `GEN`, niveau `2de`, matière « Français », couleur `#b91c1c` (contraste 6,47:1 avec le blanc, au-dessus du minimum de 4,5:1). Programme : arrêté du 17 janvier 2019, annexe 1, BO spécial n° 1 du 22 janvier 2019 (`programmes/francais-2de.md`) ; plan en 9 chapitres (`programmes/francais-2de-plan.md`).

## Programme en vigueur

Vérifié le 11 novembre 2026 : aucun nouveau programme de français de seconde n'a été publié pour 2026-2027. Les textes nouveaux de seconde concernent les mathématiques (arrêté du 26 février 2026), les langues vivantes étrangères (arrêté du 5 mai 2025) et régionales (BO n° 21 du 21 mai 2026). Le programme de 2019 reste donc la référence. **Aucun changement à signaler**, sous une réserve : une source secondaire évoque une modification de 2020 de la partie « langue », non lue ici (voir les points à trancher).

## Chapitres et questions

| N° | Chapitre | Sections | Questions | Types (U / M / V / R) | Difficultés (1 / 2 / 3) |
| --- | --- | --- | --- | --- | --- |
| 1 | La poésie du Moyen Âge au XVIIIe siècle | 6 | 150 | 75 / 30 / 30 / 15 | 59 / 59 / 32 |
| 2 | Le langage poétique : vers, rimes et figures | 7 | 150 | 75 / 30 / 30 / 15 | 60 / 60 / 30 |
| 3 | La littérature d'idées et la presse du XIXe au XXIe siècle | 6 | 150 | 75 / 30 / 30 / 15 | 59 / 63 / 28 |
| 4 | Le roman et le récit du XVIIIe au XXIe siècle | 7 | 150 | 75 / 30 / 30 / 15 | 58 / 61 / 31 |
| 5 | Le théâtre du XVIIe au XXIe siècle | 6 | 148 | 72 / 31 / 30 / 15 | 61 / 60 / 27 |
| 6 | Classes, fonctions, accords et lexique | 6 | 150 | 75 / 30 / 30 / 15 | 58 / 61 / 31 |
| 7 | Le verbe : temps, aspects, modes et concordance | 6 | 149 | 74 / 30 / 30 / 15 | 58 / 61 / 30 |
| 8 | La phrase complexe et les propositions relatives | 6 | 149 | 74 / 30 / 30 / 15 | 58 / 59 / 32 |
| 9 | Commentaire, contraction de texte et essai | 6 | 149 | 74 / 30 / 30 / 15 | 59 / 59 / 31 |
| | **Total** | **56** | **1 344** | | |

Toutes les questions sont au statut `a_relire` : aucune n'est tirée dans un quiz avant validation.

## Validation

- **Banques** : les neuf fichiers `banques/francais-chN.json` sont conformes (`verifierBanque`, quotas de STSS : 150 questions, 75 / 30 / 30 / 15, 60 / 60 / 30, tolérance ± 3) ; rapports détaillés dans `validation/francais-chN.md`.
- **Cours** : `analyserImport` ne renvoie aucune erreur ; l'import à blanc (`versDonneesCours`) produit les données de `importer_cours`. L'import réel n'a pas été lancé (base Supabase locale non démarrée) : à faire avec `npm run import:contenu -- contenu/2de-gen/francais.json`.
- **HTML** : `nettoyerHtml` ne retire rien des 56 sections et des 9 « Je retiens » (seul ajout : `tabindex` sur les tableaux, prévu par le nettoyeur).
- **Relecture** : un fichier `banques/francais-chN-relecture.md` par chapitre liste les corrections faites et les points de doute.

## Scripts du dépôt : changements à prévoir (non faits)

Les commandes `banque:verifier`, `banque:fusionner` et `banque:texte` ne fonctionnent pas pour ce cours :

- `src/lib/contenu/banque/cours.ts` : `NomCours` et `COURS_BANQUE` ne connaissent que `bph` et `stss` ; `lireCoursArgument` refuse tout autre nom ;
- `scripts/verifier-banque.ts`, `scripts/fusionner-banque.ts` : chemin des banques codé en dur (`contenu/1re-st2s/banques/`).

Proposition : ajouter une entrée `francais` (fichier `contenu/2de-gen/francais.json`, préfixe `francais`, total 150) et dériver le dossier des banques du chemin du cours. Les autres matières de seconde ont le même besoin. En attendant, les contrôles ont été faits avec un petit outil hors dépôt qui appelle exactement les mêmes fonctions.

## Points à trancher

1. **Plan** (`francais-2de-plan.md`, fin du fichier) : poésie en deux chapitres ; langue en trois chapitres et méthodes à part ; pas d'œuvre intégrale imposée ; contraction et essai gardés bien qu'ils relèvent de l'épreuve de la voie technologique.
2. **Modification de 2020** du programme (partie langue) signalée par une source secondaire : à vérifier sur Légifrance ; si elle change les points de grammaire de seconde, les chapitres 6 à 8 seront à revoir.
3. **Banques incomplètes de une ou deux questions** (ch. 5 : 148 ; ch. 7, 8, 9 : 149), dans la tolérance du vérificateur.
4. **Exemples d'application hors cours** dans les chapitres 2 et 6 (phrases inventées pour reconnaître une figure ou un accord) : voulus, mais contraires à la règle stricte suivie pour STSS.
5. **Questions de date et de fait** nombreuses dans les chapitres de culture (1, 3, 4, 5) ; à réduire si tu préfères l'analyse.
6. **Rectifications orthographiques de 1990** non appliquées (ch. 6) ; réponses courtes en orthographe traditionnelle.
7. Les points de doute détaillés de chaque chapitre sont dans les fichiers `-relecture.md`.
