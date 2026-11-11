# Bilan : cours de SES, seconde générale

Session du 10 et 11 novembre 2026, branche `claude/contenu-2de-ses-e65cde` (aucun push, aucune PR).

## Programme

- Programme suivi : arrêté du 17 janvier 2019 (JO du 20 janvier 2019, NOR MENE1901638A, BO spécial n° 1 du 22 janvier 2019). Il est recopié dans `programmes/ses-2de.md` pour les objectifs, avec un résumé du préambule.
- **Applicable en 2026-2027 : oui, aucun changement.** Aucun nouveau programme de SES de seconde n'a été publié depuis 2019. Le livret SES de l'académie de Grenoble mis à jour pour la rentrée 2026 cite toujours cet arrêté. Le document du SNES « arrete_ses_com_2e » est le projet de ce même arrêté. Seul le programme de terminale a été allégé, ce qui ne concerne pas ce cours. (Contrairement aux langues vivantes, la seconde de SES n'a pas changé à la rentrée 2025.)
- Plan : `programmes/ses-2de-plan.md`. Les 36 objectifs du programme sont couverts.

## Cours `ses.json`

Slug `ses-2de-gen`, filière `GEN`, niveau `2de`, matière `SES`, couleur `#0f766e` (contraste de 5,47:1 avec le blanc). Fichier de 906 Ko (limite 3 Mo).

| N° | Chapitre | Durée | Sections | Questions |
|---|---|---|---|---|
| 1 | Économistes, sociologues et politistes : des questions et des méthodes | 2 semaines | 5 | 152 |
| 2 | Les outils des SES : calculer et lire des données | 3 semaines | 6 | 151 |
| 3 | Produire des richesses : les producteurs et les facteurs de production | 3 semaines | 6 | 152 |
| 4 | Mesurer la création de richesses : de l'entreprise à la croissance | 5 semaines | 6 | 148 |
| 5 | Le marché et la formation des prix | 5 semaines | 6 | 148 |
| 6 | La socialisation : comment devenons-nous des acteurs sociaux ? | 4 semaines | 6 | 150 |
| 7 | L'organisation de la vie politique | 5 semaines | 6 | 151 |
| 8 | Diplôme, emploi et salaire | 4 semaines | 6 | 150 |
| | **Total** | 31 semaines | 47 | **1 202** |

Toutes les questions sont au statut `a_relire` : aucune n'est tirée dans un quiz avant validation. Les données chiffrées des exemples de calcul sont fictives et signalées comme telles. Le chapitre 5 contient un graphique SVG d'offre et de demande (conservé intact par le nettoyage HTML) ; les autres chapitres n'ont que des tableaux et des listes, comme STSS.

## Validation

- Validateur d'import : aucune erreur sur `ses.json` complet.
- `verifierBanque` (préfixe `ses`, quotas pour 150) : les huit banques sont conformes.
- Fusion des huit banques dans `ses.json` avec `fusionnerBanque` : rejouable.
- Nettoyage HTML : rien n'est retiré.
- Import à blanc : préparation des données d'import (`versDonneesCours`) sans erreur. **Aucun import réel** en base locale (base partagée avec les autres sessions) : à faire avec `npm run import:contenu -- contenu/2de-gen/ses.json`, sans `--publier`.
- Tests `vitest` de `src/lib/contenu` : 209 réussis (code non modifié).
- Rapports détaillés : `validation/ses-ch1.md` à `ses-ch8.md`.

## Points à trancher par l'enseignant

1. **Plan** : non validé par l'enseignant (arrêt 1 de la chaîne STSS sauté à la demande de la coordination). En particulier : place du chapitre « Outils » (chapitre 2 ou fiche de méthode) et découpage du questionnement « richesses » en deux chapitres (3 et 4).
2. **Relecture** : la relecture des cours et des banques a été faite par la session qui les a rédigés, pas par un relecteur indépendant comme pour STSS. Il n'y a donc pas de fichiers `ses-chN-cours-relecture.md`. Une relecture humaine est indispensable avant de valider.
3. **Points de doute** des banques : 36 au total, listés dans `banques/ses-chN-relecture.md` (variantes acceptées hors cours comme « politologue », « profit », « impôt », « classe sociale » ; distracteurs absents du cours ; filières de production inventées sur le modèle du cours ; une question délicate sur la définition du chômage du BIT).
4. **Faits à confirmer avec un manuel** : ordre de grandeur de 5 % de croissance pendant les Trente Glorieuses ; règle de « moins de la moitié du coût » pour la production non marchande ; prime majoritaire de la moitié des sièges aux municipales (communes de 1 000 habitants et plus) ; seuils de taille d'entreprise de l'Insee simplifiés au nombre de salariés.

## Outillage (à signaler, non modifié)

Les scripts `banque:texte`, `banque:verifier` et `banque:fusionner` ne connaissent que `contenu/1re-st2s/` et les cours `bph` et `stss` (`src/lib/contenu/banque/cours.ts`). Pour SES, leurs fonctions ont été appelées depuis un script externe. Il faudrait généraliser `--cours` (chemin du fichier de cours et du dossier des banques, préfixe) pour les cours de 2de.
