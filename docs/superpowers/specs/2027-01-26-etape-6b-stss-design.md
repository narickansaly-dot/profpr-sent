# Étape 6b : cours de STSS de 1re ST2S (programme officiel + IA)

Ce document décrit la première matière de l'étape 6b. Il remplace le brouillon `2027-01-19-etape-6b-matieres-design.md` de la branche `etape-6b-matieres`. La physique-chimie pour la santé fera l'objet d'une étape ultérieure, avec la même chaîne.

La spec générale `2026-11-03-app-lycee-design.md`, le guide des auteurs et la spec 6a (`2027-01-05-etape-6a-banques-bph-design.md`) restent la référence pour le format, les statuts, l'import et les banques de questions.

## 1. Décisions prises avec l'enseignant

| Sujet | Décision |
|---|---|
| Matière | Sciences et techniques sanitaires et sociales (STSS), 1re ST2S |
| Source du cours | le **programme officiel**, rédigé par l'IA, puis relu par l'enseignant avant publication |
| Banques de questions | environ 150 par chapitre, avec les règles et les quotas de l'étape 6a |
| Publication | jamais automatique : le cours est importé **non publié**, et c'est l'enseignant qui le publie |

## 2. Différence avec l'étape 6a

En 6a, l'IA n'a rédigé que les questions, à partir d'un cours écrit par l'enseignant. Ici, elle rédige **aussi le texte du cours**. Le risque d'erreur et d'écart avec la progression réelle est donc plus grand. D'où deux points d'arrêt et une relecture indépendante de chaque chapitre.

## 3. Source : le programme officiel

- Le programme de STSS de 1re ST2S (Bulletin officiel, programme d'enseignement de spécialité, voie technologique, série ST2S) est récupéré **depuis le site du ministère** (education.gouv.fr ou eduscol.education.fr). Sa référence exacte (BO, date, URL) est notée.
- Il est conservé dans `contenu/1re-st2s/programmes/stss-1re.md` : structure du programme (pôles, questions, notions, capacités) et référence. Le texte officiel est repris fidèlement pour la structure et les notions ; il n'y a pas de résumé inventé.
- Si le programme ne peut pas être récupéré depuis une source officielle, l'étape **s'arrête** et le demande à l'enseignant. Le programme n'est jamais reconstitué de mémoire.

## 4. Plan des chapitres (1er point d'arrêt)

- Le plan est déduit du programme : de 6 à 9 chapitres. Pour chaque chapitre, il précise :
  - le titre et la durée indicative ;
  - les notions du programme couvertes, citées ;
  - les objectifs, à la manière de BPH (« Je sais… ») ;
  - le découpage en sections.
- Le plan est écrit dans `contenu/1re-st2s/programmes/stss-1re-plan.md`. Une table de correspondance vérifie que **chaque notion du programme est couverte par au moins un chapitre**, et qu'aucun chapitre ne sort du programme.
- **Arrêt** : l'enseignant valide le plan. Il peut regrouper des chapitres, les réordonner ou les renommer. Rien n'est rédigé avant sa validation.

## 5. Rédaction et relecture des chapitres

### Rédaction

- Un sous-agent Opus rédige chaque chapitre au format JSON des chapitres de BPH (guide des auteurs, partie 1) : `chapeau`, `objectifs`, `sections` (HTML autorisé), `a_retenir`, `resume`, `duree`.
- **Ton** : on tutoie l'élève, avec des phrases courtes et des exemples simples tirés du secteur sanitaire et social. Le vocabulaire du programme est défini à sa première apparition.
- **Pas de figures** dans cette étape. On utilise des tableaux et des listes HTML autorisés. Les schémas viendront dans une étape ultérieure.
- **Chiffres, dates, lois, institutions** : seulement s'ils sont stables et vérifiables, par exemple la définition de la santé de l'OMS de 1946 ou les grandes branches de la Sécurité sociale. Pas de statistiques datées sans source. Une donnée incertaine est omise plutôt qu'approximative.
- **Typographie** française : espace insécable U+00A0 avant « : ; ! ? ».

### Relecture

Un **second** sous-agent Opus, indépendant du rédacteur, relit chaque chapitre et vérifie :

- la conformité au programme : notions couvertes, pas de hors-programme ;
- l'exactitude : définitions, institutions, dispositifs, chiffres ;
- le niveau de 1re ST2S ;
- la clarté ;
- le respect du format.

Il corrige directement et écrit un rapport `contenu/1re-st2s/banques/stss-chN-cours-relecture.md` : corrections faites, et « points de doute pour l'enseignant ».

### Import et 2e point d'arrêt

- Le cours `contenu/1re-st2s/stss.json` est importé **non publié**, avec `--garder-statuts`.
- La matière reçoit une couleur conforme à la règle de contraste du guide (au moins 4,5:1 avec le blanc), distincte de celle de BPH.
- **Arrêt** : le chapitre 1 est rédigé, relu et importé en premier. L'enseignant le lit dans l'application (aperçu admin) et donne ses remarques de fond et de style. Celles-ci sont reportées dans cette spec (§ 5) avant la rédaction des autres chapitres.

## 6. Banques de questions

- Même chaîne que l'étape 6a :
  - rédaction Sonnet ;
  - `banque:verifier` (17 règles) ;
  - relecture Opus contre le texte du chapitre ;
  - fusion ;
  - import « à relire » ;
  - relecture en lot par l'enseignant.
- Mêmes quotas et mêmes règles que la spec 6a, § 3 : environ 130 nouvelles questions par chapitre, donc environ 150 par chapitre au total puisqu'il n'y a pas de questions existantes. Le plan précisera le nombre exact, 150 par chapitre (quotas mis à l'échelle).
- **Outillage** : les commandes `banque:texte`, `banque:verifier` et `banque:fusionner` acceptent un paramètre `--cours <fichier>` (`bph.json` par défaut, pour la compatibilité). Les sources des questions sont au format `stss:chN:banque:NNN`. Le vérificateur accepte le préfixe du cours.
- Les banques sont produites **après** la validation du cours entier par l'enseignant, pour ne pas écrire des questions sur un texte qui va changer.

## 7. Découpage

1. **Outillage** : `--cours` pour les outils de banque, avec ses tests.
2. **Programme et plan** : récupération du programme officiel, plan, table de correspondance. **Arrêt 1.**
3. **Chapitre 1 du cours** : rédaction, relecture, import non publié. **Arrêt 2.**
4. **Chapitres 2 à N du cours** : même chaîne, un chapitre par tâche.
5. **Arrêt 3** : l'enseignant valide le cours entier, et peut demander des reprises.
6. **Banques de questions**, chapitre par chapitre (chaîne 6a).
7. **Bilan.**

Les étapes 4 et 6 peuvent avancer en parallèle par chapitre, comme en 6a, une fois le chapitre 1 validé.

## 8. Tests

- **Vitest** : `--cours` pour chaque outil (cours par défaut, autre cours, préfixe des sources).
- **Contenu** :
  - `stss.json` passe le validateur d'import ;
  - la table de correspondance du plan couvre 100 % des notions du programme ;
  - `banque:verifier --cours stss.json` passe pour chaque chapitre.
- **Import** : le cours est créé non publié et invisible des élèves, ce que vérifie un test e2e : un élève de 1re ST2S ne voit pas la STSS tant qu'elle n'est pas publiée. Un réimport ne crée rien.

## 9. Limites acceptées

- Un cours rédigé par l'IA, même relu deux fois, peut contenir des imprécisions. La publication reste une décision de l'enseignant, chapitre par chapitre.
- Pas de figures dans cette étape.
- La progression du cours suit l'ordre du programme, pas forcément celle de l'enseignant ; le plan validé à l'arrêt 1 peut l'adapter.
