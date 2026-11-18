# Bilan : cours de mathématiques, spécialité, première générale

Date : 18 novembre 2026. Branche : `claude/contenu-1re-maths-spe-e2fef6`.

## Programme suivi

- **Programme en vigueur** : arrêté du 26 février 2026, NOR **MENE2602917A**, BO n° 14 du 2 avril 2026, applicable à la rentrée 2026-2027. Il remplace l'annexe de l'arrêté du 17 janvier 2019. Annexe PDF (11 pages) lue sur la page du BO avec pdf.js dans le navigateur intégré.
- Résumé codé : `programmes/maths-spe-1re.md` (contenus `[N…]`, capacités `[C…]`, démonstrations `[D…]`, algorithmes `[A…]`, automatismes `[Au…]`).
- Points saillants du texte de 2026 : partie « Automatismes » ; la liste comme seule notion nouvelle d'algorithmique ; logique enrichie (condition nécessaire ou suffisante, statut des égalités et des lettres, négation de propositions quantifiées, contraposée) ; fonctions paires et impaires ; dérivée de l'inverse, du quotient et de xⁿ pour n ∈ ℤ ; somme et produit des racines ; coordonnées par produits scalaires ; formule de König-Huygens ; répétition d'épreuves de Bernoulli limitée à n ⩽ 4 (sans loi binomiale). L'annexe de 2019 n'a pas été comparée ligne à ligne.

## Livrables

| Fichier | Contenu |
| --- | --- |
| `programmes/maths-spe-1re.md` | Résumé codé du programme de 2026 |
| `programmes/maths-spe-1re-plan.md` | Plan en 12 chapitres, correspondance programme → chapitres, points à trancher |
| `maths-spe.json` | Cours `maths-spe-1re-gen`, filière `GEN`, niveau `1re`, matière « Mathématiques », titre « Mathématiques (spécialité), Première générale », couleur `#4338ca` (contraste **7,90:1** avec le blanc, accepté), 12 chapitres, 100 sections, **1 800 questions `valide`**, 1,66 Mo (limite 3 Mo) |
| `banques/maths-spe-chN.json` (12) | 150 questions par chapitre, sources `maths-spe-1re:chN:banque:001` à `150` |
| `banques/maths-spe-chN-relecture.md` (12) | Relecture indépendante, doutes et décisions |
| `validation/maths-spe-chN.md` (12) | Résultats des contrôles automatiques par chapitre |

## Chapitres

| N° | Titre | Durée | Sections | HTML (car.) | Questions |
| --- | --- | --- | --- | --- | --- |
| 1 | Suites numériques : modes de génération, variations, limites | 3 sem. | 9 | 36 503 | 150 |
| 2 | Suites arithmétiques et suites géométriques | 3 sem. | 8 | 30 429 | 150 |
| 3 | Second degré : équations, factorisation et signe | 4 sem. | 8 | 36 128 | 150 |
| 4 | Dérivation : nombre dérivé et tangente | 3 sem. | 8 | 31 103 | 150 |
| 5 | Fonction dérivée et calcul de dérivées | 2 sem. | 7 | 18 780 | 150 |
| 6 | Variations, extremums et courbes | 3 sem. | 9 | 37 670 | 150 |
| 7 | Fonction exponentielle | 3 sem. | 8 | 32 876 | 150 |
| 8 | Trigonométrie | 2 sem. | 8 | 36 288 | 150 |
| 9 | Produit scalaire | 3 sem. | 9 | 26 459 | 150 |
| 10 | Géométrie repérée : droites, projeté orthogonal, cercles | 2 sem. | 9 | 43 258 | 150 |
| 11 | Probabilités conditionnelles et indépendance | 2 sem. | 8 | 41 160 | 150 |
| 12 | Variables aléatoires réelles | 2 sem. | 9 | 31 986 | 150 |
| | **Total** | **32 sem.** | **100** | **402 640** | **1 800** |

Chaque chapitre contient définitions, propriétés, les démonstrations attribuées par le programme, exemples résolus, mises en garde, figures SVG, programmes Python (listes) et un bloc « Je retiens ». Chaque banque : 75 `qcm_unique`, 30 `qcm_multiple`, 30 `vrai_faux` (15 vrais, 15 faux), 15 `reponse_courte` ; difficultés 60 / 60 / 30 ; 8 à 10 notions.

## Méthode de rédaction et de vérification

1. **Rédaction** par un sous-agent par chapitre, banque générée par scripts Python : chaque valeur numérique des exemples du cours et des bonnes réponses recalculée (souvent en fractions exactes, sympy), distracteurs contrôlés comme faux, programmes Python exécutés.
2. **Relecture indépendante** de chaque banque : un autre sous-agent reçoit les 150 énoncés **sans réponses ni explications**, résout chaque question en refaisant les calculs avec Python, et signale toute ambiguïté.
3. **Comparaison automatique** des réponses du relecteur avec les réponses attendues (`comparer.js`), puis arbitrage de chaque désaccord et de chaque doute.

| Chapitre | Concordance | Doutes signalés | Questions modifiées |
| --- | --- | --- | --- |
| 1 | 150/150 | 7 | 0 |
| 2 | 150/150 | 4 | 0 |
| 3 | 150/150 | 0 | 0 |
| 4 | 150/150 | 3 | 2 (045 distracteur non déductible remplacé ; 150 proposition sur `round` reformulée) |
| 5 | 150/150 | 14 | 6 (4 tournures « par quoi dérive-t-on » ; 079 explication ; 120 distracteur ambigu remplacé) |
| 6 | 150/150 | 6 | 3 (092 et 095 « au-dessus » au sens large ; 125 quantification implicite discutable) |
| 7 | 150/150 | 9 | 1 (115 « vitesse de variation constante ») |
| 8 | 150/150 | 2 | 0 |
| 9 | 150/150 | 1 | 1 (068 « produit scalaire » explicité) + intitulé de notion sans flèches combinantes |
| 10 | 149/150 | 0 | 0 (le désaccord, Q148, est une erreur du relecteur : réponse attendue confirmée par le calcul) |
| 11 | 150/150 | 1 | 1 (145 borne de `random()`) |
| 12 | 150/150 | 0 | 0 |
| **Total** | **1 799/1 800** | **47** | **14** |

**Aucune erreur de réponse** n'a été trouvée : le seul désaccord confirme la réponse attendue. Les corrections portent sur des formulations ambiguës ou des distracteurs défendables. La plupart des doutes non suivis de correction demandaient que les variantes de réponse courte soient acceptées (« − » et « - », virgule et point, fraction) : c'était déjà le cas.

## Statut des questions

Conformément à l'usage du dépôt pour le contenu relu (commits 67d1671 et 90bd11c, guide partie 2), les **1 800 questions sont en `valide`**. Aucune n'a été laissée en `a_relire` : tous les doutes ont été tranchés (détail dans chaque `-relecture.md`). L'enseignant peut renvoyer une question en relecture depuis `/admin`.

## Validation

- Les 12 banques passent `verifierBanque` (règles du guide, partie 7) avant fusion.
- Le cours complet passe `analyserImport` ; `nettoyerHtml` ne retire rien (seul ajout du nettoyeur : `tabindex="0"` sur les tableaux et figures défilants) ; `versDonneesCours` (import à blanc) construit la charge utile des 1 800 questions sans erreur.
- Aucune réponse courte avec séparateur de milliers ; marges seulement sur des nombres seuls arrondis ; aucune espace ordinaire avant « : ; ! ? ».
- **Import réel non fait** : la base Supabase locale est partagée (pas de `.env.local` dans le worktree). Commande prévue : `npm run import:contenu -- contenu/1re-gen/maths-spe.json`.

## Limites du HTML autorisé (formules)

Mêmes limites qu'en 2de (`src/lib/contenu/html.ts`) : ni MathML ni LaTeX ; formules avec `sup`, `sub` et caractères Unicode ; fractions en ligne ; vecteurs avec la flèche combinante U+20D7 (rendu variable selon la police) ; code Python dans un `div` avec `<br>` et espaces insécables, sans police à chasse fixe ; énoncés de questions en texte brut (indices `u_n`, `P_A(B)`, code sur une ligne) ; tableaux de signes et de variations en tableaux HTML.

## Scripts du dépôt (non modifiés)

- `banque:verifier`, `banque:fusionner`, `banque:texte` n'acceptent que `--cours bph|stss` (`src/lib/contenu/banque/cours.ts`). Les contrôles ont été faits par un pilote externe qui appelle les mêmes fonctions (dans le dossier de notes partagé, `maths-spe-outils/`). **À faire** : configuration par cours (fichier, dossier des banques, préfixe des sources, total), par exemple `--cours maths-spe-1re`.
- Suggestions d'affichage déjà notées en 2de : classe CSS pour le code, affichage des sauts de ligne dans les énoncés.

## Points à trancher

1. **Ordre et découpage** : dérivation en deux chapitres (4 et 5), suites en deux (1 et 2) ; ordre et durées (32 semaines).
2. **Pas de chapitre « Automatismes » ni « Logique »** : logique répartie aux chapitres 3 et 6, listes Python au chapitre 1, automatismes dans les questions de niveau 1. Faut-il une page d'entraînement dédiée ?
3. **Ajouts hors du texte strict du programme** :
   - chapitre 7 : dérivée de x ↦ f(ax + b), justifiée par le taux de variation, pour dériver exp(−x) et e^(at) ([C35]) ;
   - chapitre 12 : E(X + Y) = E(X) + E(Y) comme lecture de « linéarité de l'espérance » ;
   - chapitre 1 : construction en escalier des suites récurrentes ;
   - chapitre 8 : cos x = cos a ⇔ x = a + 2kπ ou −a + 2kπ (lecture du cercle) ;
   - chapitre 11 : paradoxe des deux enfants en « Pour aller plus loin ».
4. **Approfondissements** traités en « Pour aller plus loin » (avec quelques questions de niveau 3) : emprunt et somme des carrés (ch. 2), degré 3 et somme/produit (ch. 3), loi des sinus et orthocentre (ch. 9), distance point-droite et parabole (ch. 10), marches aléatoires (ch. 11), minimum de E((X − x)²) (ch. 12).
5. **Recouvrement avec le tronc commun** (`maths-tc`, autre session) : suites, exponentielle, probabilités ; aucune coordination de contenu.
6. **Relecture enseignante** recommandée avant import, en priorité sur les questions de logique (ch. 3 et 6) et les pièges assumés listés dans les `-relecture.md` (ch. 1 Q005/009, ch. 8 Q058/149, ch. 10 Q148).
