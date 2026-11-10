# Audit d’accessibilité et d’ergonomie mobile — app-lycee

## Suites données

Branche `correctifs-audit` (bilan : `docs/superpowers/plans/2027-01-19-correctifs-audit-bilan.md`).

| Constat | Suite |
|---|---|
| I1. Page 404 par défaut | corrigé (`a95e71b`) |
| I2. Contraste du message d'erreur | corrigé (`a95e71b`) : `--danger` à 6,00:1 |
| I3. Focus perdu après l'envoi d'un formulaire | reporté (environ 30 formulaires : il faut un composant d'envoi partagé, décision de conception) |
| I4. Liens-texte isolés de 23 px | corrigé (`a95e71b`, `6219fc0`) : classe `.lien-action`, 44 px |
| I5. Bordures de champs à 1,29:1 | corrigé (`a95e71b`) : jeton `--bord-champ` |
| I6. Anneau de focus en mode sombre | corrigé (`a95e71b`) : double anneau. Reporté : le `box-shadow` du focus remplace les ombres propres des éléments |
| M1. Espaces insécables dans l'interface | reporté (texte de l'interface à reprendre écran par écran) |
| M2. Lien d'évitement | corrigé (`a95e71b`) |
| M3. Pas de `loading.tsx` | reporté |
| M4. Textes de 12 à 13 px | reporté |
| M5. Focus à l'arrivée sur la correction | reporté |
| M6. « Tu » et « vous » dans les CGV | reporté (choix éditorial) |


Date : 2027-01-12. Portée : toute l’application, lecture seule sur le code. Méthode : Playwright + axe-core (WCAG 2.0/2.1/2.2 A et AA + bonnes pratiques) sur ~35 écrans, à 375×812 et 1280×800, plus passes en mode sombre et en `prefers-reduced-motion`, parcours clavier (30 tabulations par page), mesures de cibles tactiles, de défilement horizontal, de typographie française et de tutoiement/vouvoiement, lecture du code des composants concernés.

## Résumé

L’application est globalement bien construite : axe ne remonte quasiment rien (1 seule violation sur les pages testées, hors page 404), aucun défilement horizontal même à 320 px, focus visible partout, structure de titres correcte (un `h1`, pas de saut), un `main` par page, formulaires étiquetés, gestion du focus soignée dans le lecteur de quiz et plusieurs formulaires (signalement, décision), `prefers-reduced-motion` respecté, tutoiement/vouvoiement cohérent.

Les points à traiter portent sur : la page 404 par défaut de Next.js (anglais, sans repères), un contraste d’erreur à 4,47:1, le focus perdu après l’envoi de formulaires, des liens-texte isolés de 23 px de haut, le contraste des bordures de champs et de l’anneau de focus en mode sombre, et une typographie française incomplète (espaces insécables).

Décompte : **0 Bloquant, 6 Important, 6 Mineur.**

## Constats

### Bloquant

Aucun.

### Important

**I1. Page 404 par défaut de Next.js : anglais, sans repères, sans chemin de retour**
- Page : toute URL inconnue une fois connecté (ex. `/page-inexistante`), mobile et bureau.
- Élément : `<h1 class="next-error-h1">404</h1>` + « This page could not be found. », sans `main`, sans en-tête, sans lien.
- Constat : axe `landmark-one-main` et `region` (modéré) ; texte en anglais dans une application `lang="fr"` ; aucun lien pour revenir ; titre d’onglet générique.
- WCAG : 1.3.1, 2.4.1, 3.1.2 (langue de passage), 2.4.2.
- Correctif : créer `src/app/not-found.tsx` (et idéalement `src/app/global-error.tsx`) avec un `<main>`, un `h1` français (« Cette page n’existe pas »), le ton « tu » et un lien « Retour à l’accueil ». Aucun fichier `not-found.tsx` n’existe dans `src/`.
- Effort : S.

**I2. Contraste du message d’erreur : 4,47:1 en clair**
- Page : `/connexion` après un mauvais mot de passe (même composant sur `/inscription`, tous les formulaires avec `.message-erreur`).
- Élément : `<p id="identifiants-erreur" role="alert" class="message-erreur">E-mail ou mot de passe incorrect.</p>`, `#dc2626` sur le papier `#f7f5ff`.
- Constat : axe `color-contrast` (grave), 4,47:1 pour du texte de 17 px gras (seuil 4,5:1). Sur fond blanc la valeur est 4,83:1, donc l’erreur passe sur les cartes mais pas sur le fond de page.
- WCAG : 1.4.3.
- Correctif : assombrir `--danger` en clair, par exemple `#b91c1c` (≈ 6,5:1 sur le papier) ; `src/app/globals.css:16`. La valeur sombre `#f87171` (6,18:1) est bonne.
- Effort : XS.

**I3. Focus perdu après l’envoi d’un formulaire (bouton désactivé pendant l’action)**
- Page : `/connexion` (constaté : après une erreur, `document.activeElement` = `BODY`) ; même motif dans ~30 formulaires : inscription, lancement de quiz, création de classe, rejoindre une classe, échéance, code parent, bienvenue, import, etc.
- Élément : `<button type="submit" disabled={enCours}>`. Le bouton qui a le focus est désactivé pendant l’action serveur ; le navigateur rend alors le focus au `body`. Le message `role="alert"` est annoncé aux lecteurs d’écran, mais un utilisateur au clavier doit retabuler depuis le haut de la page (en-tête + 4 liens avant le contenu).
- WCAG : 2.4.3 (ordre du focus), 3.3.1 / 4.1.3 (partiellement couvert par `role="alert"`).
- Correctif : utiliser `aria-disabled={enCours}` (et ignorer le clic pendant l’envoi) au lieu de `disabled`, ou, comme le font déjà `BoutonSignaler.tsx:21`, `FormulaireDecision.tsx:9` et `FormulaireCoursGratuit.tsx:13`, déplacer le focus sur l’erreur (`tabIndex={-1}` + `ref.focus()`) ; idéal : un petit hook `useFocusErreur` partagé. Liste : `grep -rn "disabled={enCours}" src`. Ex. `src/app/(auth)/FormulaireIdentifiants.tsx:34`, `src/components/FormulaireQuiz.tsx:23`.
- Effort : M (transversal, mécanique).

**I4. Liens-texte isolés de 23 px de haut (cible < 44 px, et < 24 px de WCAG 2.5.8)**
- Page : mobile et bureau. Mesurés à 23 px de haut : « ← Biologie et physiopathologie » (chapitre et évaluation), « Voir mon calendrier » et « Ajoute un devoir ou un examen » (accueil), « Ajouter mon calendrier à un autre agenda » et « Notifications » (calendrier), « Régler mes notifications » (rappels), « Retour à l’accueil » (mes données, choix du cours), « ← Mon calendrier » (nouvel événement, partage), « ← {classe} » (suivi enseignant, non mesuré).
- Constat : ce sont des liens posés seuls dans un `<p>`, donc non couverts par l’exception « lien dans une phrase ». Sur téléphone, ce sont les liens de retour principaux. Les boutons, onglets et pastilles de question mesurent ≥ 44 px ; seuls ces liens sont en dessous.
- WCAG : 2.5.8 (AA, minimum 24 px : échec de 1 px) ; critère du projet 44 px.
- Correctif : une classe utilitaire `.lien-action { display:inline-flex; align-items:center; min-height:44px; }` appliquée à ces liens. Fichiers : `src/app/(app)/cours/[slug]/[chapitre]/page.tsx:29`, `.../evaluation/page.tsx:41`, `src/app/(app)/rappels/page.tsx:22`, `src/app/(app)/calendrier/page.tsx:52-54`, `calendrier/nouveau/page.tsx:16`, `calendrier/partage/page.tsx:13`, `src/app/mes-donnees/page.tsx:63`, `src/app/(app)/choisir-cours/page.tsx:24,35`, `src/components/acces/CoursVerrouille.tsx:22`, `src/components/calendrier/ProchainsEvenements.tsx:19`.
- Effort : S.

**I5. Bordures de champs et de boutons secondaires à 1,29:1**
- Page : tous les formulaires (connexion, inscription, calendrier, classes, admin…).
- Élément : `.formulaire input/select` avec `border: 2px solid var(--trait)` (`#e3e1ee` sur `#fff`), `src/app/globals.css:60` ; même jeton pour `.bouton-secondaire` (`globals.css:52`) et `fieldset` (`globals.css:62`).
- Constat : la limite visuelle d’un champ n’est repérable qu’à 1,29:1 en clair ; en sombre `#2f2e44` sur `#1b1a2b` est aussi très bas. Le fond du champ (`#fff`) contre le papier (`#f7f5ff`) n’aide pas non plus (1,07:1).
- WCAG : 1.4.11 (contraste des composants d’interface, 3:1).
- Correctif : introduire un jeton `--bord-champ` à ≥ 3:1 (par exemple `#8b8da3` en clair, `#6b6d85` en sombre) pour les champs, cases et boutons secondaires ; garder `--trait` pour les séparateurs décoratifs.
- Effort : S.

**I6. Anneau de focus basé sur la couleur du cours : insuffisant en mode sombre**
- Page : toutes, en mode sombre ; dépend de `--couleur-cours`.
- Élément : `:focus-visible { outline: 3px solid var(--couleur-cours) }`, `src/app/globals.css:38`.
- Constat : calcul sur le papier sombre `#131222` : indigo par défaut `#4f46e5` = 2,94:1 (< 3:1), vert du cours BPH `#0f766e` = 3,37:1 (limite). Les couleurs de cours sont seulement validées à 4,5:1 contre le **blanc** (`src/lib/contenu/couleur.ts`), donc une couleur foncée valide (par ex. `#1e1b4b`) donnera un anneau quasi invisible en sombre. En clair, tout va bien.
- WCAG : 2.4.7, 1.4.11, 2.4.11/2.4.13.
- Correctif : en sombre, mélanger l’anneau vers l’encre (`outline-color: color-mix(in srgb, var(--couleur-cours) 40%, var(--encre))`) ou utiliser un anneau à double trait (blanc + couleur du cours). Même vérification pour le texte des liens (`globals.css:36`), déjà mélangé à 60 % vers l’encre : conforme sur les pages testées.
- Effort : S.

### Mineur

**M1. Typographie française : espaces insécables absentes presque partout**
- Pages : contenu et interface, ex. « Te revoilà ! », « Pas encore de compte ? » (connexion), « Salut Léa ! », « Tu as déjà un compte ? », « Évaluation : », « Ta réponse : » / « Bonne réponse : » (résultat), « À la fin du chapitre, tu sais : » (chapitre), « section 1 « Introduction » » (admin). Environ 640 occurrences sur la seule page de relecture des questions d’un chapitre, 31 sur un chapitre.
- Constat : espace ordinaire (U+0020) avant `: ; ! ?` et après `«` / avant `»`. Les pages légales et parent utilisent déjà `&nbsp;` : l’usage est donc partiel. Risque : « ? » ou « : » seul en début de ligne sur mobile.
- Correctif : (1) corriger le texte de l’interface en JSX (`Te revoilà&nbsp;!`) ; (2) pour le contenu pédagogique et les questions (données JSON/BD), appliquer un utilitaire `typographieFr(texte)` au rendu ou à l’import (`src/lib/contenu/format-import.ts`) : `/ ([:;!?»])/g → ' $1'`, `/(«) /g → '$1 '`, `/ /` pour `;!?` si tu préfères la fine insécable. Un test lint (`grep -rnE " [:;!?]" src`) évite les rechutes.
- Effort : M.

**M2. Aucun lien d’évitement (« Aller au contenu »)**
- Page : toutes les pages connectées.
- Constat : première tabulation = logo « App lycée » ; 4 à 6 arrêts (navigation, compte) avant le contenu. Atténué par les repères `nav` / `main`, d’où Mineur.
- WCAG : 2.4.1.
- Correctif : lien `.sr-only:focus` en tête de `body` (`src/app/layout.tsx:25`) vers `<main id="contenu" tabIndex={-1}>`.
- Effort : S.

**M3. Aucun état de chargement (`loading.tsx`) ; erreurs limitées à deux segments**
- Constat : aucun `loading.tsx` dans `src/app` ; il n’y a que `(app)/error.tsx` et `(app)/parent/error.tsx` (avec `role="alert"`). Sur réseau lent, la navigation reste figée sans retour visuel. Les pages publiques (`/connexion`, `/inscription`, légales, `/bienvenue`, `/consentement`) n’ont pas de segment d’erreur propre.
- Correctif : `src/app/(app)/loading.tsx` avec squelette + `role="status"` (« Chargement… ») ; `error.tsx` aux autres groupes.
- Effort : S.

**M4. Taille de texte à 12–13 px**
- Pages : chapitre (étiquettes de schémas 11,5–13 px, « Figure 1.5 » 12,5 px, `th`/badge 12 px, exposants/indices 12,75 px), accueil (`.pastille` 13 px). Texte de corps à 16–17 px : correct.
- Constat : lisible mais petit sur téléphone ; cohérent avec la mention en CSS qui garantit le contraste à 13 px.
- Correctif : plancher à 14 px pour les étiquettes et badges (`globals.css:96`, `chapitre.css`) ; les textes de schémas SVG à revoir lors de leur export.
- Effort : S.

**M5. Pas de focus sur le titre à l’arrivée sur la correction**
- Page : `/tentative/[id]/resultat` après « Terminer ».
- Constat : parcours clavier réussi de bout en bout (focus sur la question à chaque « Suivante » : conforme ; fin du quiz sans perte), mais à l’arrivée sur la correction le focus est sur `body` : un lecteur d’écran n’annonce pas le résultat.
- Correctif : `<h1 tabIndex={-1}>` + `autoFocus` via un petit composant client, ou `role="status"` sur la note.
- Effort : XS.

**M6. Mélange « tu » légal : pages légales en double registre**
- Page : `/confidentialite` (31 occurrences de tu pour les élèves, section parents en « vous » : intentionnel et correct), `/conditions-vente` (« tu » + « Vous pouvez résilier »).
- Constat : la section parents est bien en « vous ». Dans les CGV, une phrase isolée passe de « tu » à « vous » sans cadre explicite. Le reste (élève, enseignant, admin en « tu » ; parent en « vous ») est cohérent sur tous les écrans testés.
- Correctif : indiquer en tête des CGV à qui s’adresse chaque registre, ou harmoniser `src/app/(legal)/conditions-vente/page.tsx:47`.
- Effort : XS.

## Points conformes

- axe-core : 0 violation sur accueil, cours, chapitre, quiz (question et correction), évaluation, calendrier (3 pages), rappels, notifications, mes données, parent (liste et fiche enfant), enseignant (accueil, signalements), admin (contenu, cours, chapitre, relecture des questions, question, import, signalements, demandes), connexion, inscription, pages légales, hors ligne ; sauf I1 et I2. Pas de régression en mode sombre (axe) sur 6 pages.
- Aucun défilement horizontal à 375 px ni à 320 px ; aucun débordement de texte problématique (noms de compte tronqués avec ellipse maîtrisée).
- Titres : un `h1` par page, aucun saut de niveau ; un seul `main` ; `lang="fr"` ; titres d’onglet distincts (`Page · App lycée`).
- Formulaires : tous les champs ont un nom accessible, erreurs en `role="alert"` avec `aria-invalid` / `aria-describedby`, aide de champ associée, cases/radios avec zone de clic ≥ 44 px, champs de 48 px de haut.
- Lecteur de quiz : focus déplacé sur la question à chaque changement, position annoncée en `aria-live`, pastilles étiquetées (« Question 3, répondue »), état d’enregistrement annoncé, confirmation avant fin, cibles ≥ 44 px, parcours clavier complet réussi.
- Gestion du focus après action serveur exemplaire pour `BoutonSignaler`, `FormulaireDecision`, `FormulaireCoursGratuit`, `ParentsRelies`, `DepotSchema`.
- Focus visible sur tous les arrêts clavier mesurés (aucun arrêt sans contour ni ombre) ; pas de piège clavier sur 30 tabulations.
- `prefers-reduced-motion` : animations et transitions coupées globalement (`globals.css:85`, `quiz.css:90`), vérifié (`animation-name: none`).
- Couleurs de cours : contrainte 4,5:1 contre le blanc validée à la saisie, côté admin et à l’import ; texte coloré mélangé vers l’encre ; mode sombre qui inverse le schéma des pastilles.
- Tutoiement/vouvoiement : élève, enseignant et admin en « tu », parent en « vous », vérifié sur toutes les pages parent et leurs messages d’action.
- Boutons, onglets, navigation principale et pied de page : ≥ 44 px.

## Limites

- Parcours enseignant « suivi » non audité visuellement : le compte de démo n’a aucune classe et la création d’une classe est une écriture ; seule l’accueil enseignant (état vide), les signalements et le code ont été examinés.
- Non exécuté pour ne pas modifier de données : retrait de consentement, suppression de compte, changements de statut de question, publication, « relecture en lot » (page chargée et auditée, actions non déclenchées), envoi de signalement, création d’événement.
- Mesures faites sur le serveur de développement : les contrôles dont le focus est « `NEXTJS-PORTAL` » (surcouche Next.js de dev) sont exclus ; la page 404 et les pages d’erreur de production peuvent différer.
- Lecteurs d’écran (VoiceOver, TalkBack) non testés : les conclusions sur les annonces viennent du code et d’axe. Aucun test sur appareil réel, à 200 % de zoom texte, ni en contraste élevé forcé (Windows).
- Les contrastes de focus en sombre ont été calculés avec les couleurs de cours présentes (`#0f766e`) et la valeur par défaut (`#4f46e5`) ; les autres couleurs valides n’existent pas dans la base de démo.
- Contraste d’éléments non textuels des schémas SVG du contenu pédagogique non vérifié individuellement.
