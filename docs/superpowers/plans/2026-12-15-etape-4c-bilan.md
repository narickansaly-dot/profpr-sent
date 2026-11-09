# Étape 4c : bilan et points reportés

État final sur la branche `etape-4c-securite` :
- 366 tests unitaires (Vitest, 39 fichiers) ;
- 752 tests de la base (pgTAP, 25 fichiers) ;
- 42 exécutions de bout en bout (Playwright : 21 parcours, sur mobile et sur ordinateur, avec un build de production) : 39 réussies et 3 ignorées (la revue axe ne tourne que sur mobile), dont les trois nouveaux parcours d'accessibilité ;
- typage, lint et build sans erreur.

## Ce qui a été livré

- **Variables d'environnement vérifiées au démarrage** (`src/lib/env.ts`, `src/instrumentation.ts`) : URL et clé anonyme de Supabase obligatoires, `NEXT_PUBLIC_SITE_URL` en https obligatoire sur Vercel en production, groupe des notifications (clés VAPID, sujet, secret d'envoi) tout ou rien.
- **CSP avec nonce et en-têtes de sécurité** : le proxy crée un nonce par requête (`script-src 'self' 'nonce-…' 'strict-dynamic'`, `frame-ancestors 'none'`) ; `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, `Cross-Origin-Opener-Policy` sur toutes les routes, HSTS seulement en https. La redirection du proxy recopie les cookies et les en-têtes de cache de la session. Zod passe en mode sans `eval` (`zod-sans-eval.ts`) et la page `/hors-ligne` est rendue à la demande pour recevoir un nonce.
- **Service worker versionné au build** : `/sw.js?v=<commit ou horodatage>` ; les caches deviennent `statique-<version>`, `pages-<version>` et `hors-ligne-<version>`, et les anciens sont supprimés.
- **Mise en ligne** : `vercel.json` (région `cdg1`) et guide `docs/mise-en-ligne.md` (projets Vercel et Supabase, import distant, tâche d'envoi, secrets dans un fichier hors dépôt).
- **Dette de la base** : deux migrations. Calendrier et planning : verrou du profil avant le plafond de 500 événements, titre sans caractère de contrôle, code `type_non_modifiable`, plus de tolérance d'une heure dans le passé, `refuser_plan_revision` qui contrôle l'examen, révision générale limitée au cours de l'événement avec départage aléatoire. Notifications : réservation bornée (10 fois au plus, sinon `echec`), notifications devenues sans objet supprimées à la réservation, `echeance_proche` qui attend l'ouverture de l'évaluation, ligne réservée jamais supprimée par un changement de rappel.
- **Générateur de planning (reporté de 4a)** : `d <= apres` corrigé et `examenDebut` invalide qui lève une `RangeError` (deux points de la liste de l'étape 4a, désormais traités).
- **Dette TypeScript et interface** : messages zod en français sur les entrées falsifiées (jours, identifiants), constantes sorties dans des modules sans zod (zod n'est plus dans le bundle client), `hoteDePushAutorise` dans un module sans dépendance, `exigerEleve` qui redirige un visiteur déconnecté, bouton « Plus tard » avec état d'attente.
- **Accessibilité** : voir la section dédiée ci-dessous.

## Écarts au plan et décisions prises pendant l'exécution

Rulings du contrôleur (journal d'exécution) :

- C6/C7 test dette_notifications avec clock_timestamp() ; envoi.test.sql adapté (revision_du_jour) car la migration retire l'inactivité « sans objet » — tests faux sinon — coût nul.
- C8 échéance ouverte dans les 24 dernières heures : alerte envoyée à l'ouverture (greatest(limite-24h, ouverture)) au lieu de rien — plus utile pour l'élève — coût : logique un peu plus longue.
- C1/C4 la vérification des variables agit au démarrage, pas au build (Next n'appelle pas register au build) ; guide reformulé — exactitude — coût : une variable manquante ne bloque pas le déploiement.
- C2 la redirection du proxy recopie les en-têtes de cache de la session — éviter la mise en cache d'une réponse porteuse de cookie — coût nul.
- C12 hoteDePushAutorise extrait dans un module sans dépendance — ne pas embarquer web-push dans les actions — coût nul.
- C13/C14/C15/C16 corrections de prémisses et d'accessibilité (statut admin via cle et ?n=, schéma du prénom dans profil/onboarding.ts, piste à 40 %, aide du mot de passe seulement à l'inscription) — coût nul.
- C3/C5/C9/C10/C11/C17 cohérence, tests et textes — coût nul.
- Task 1 — re-revue du correctif typographique faite par le contrôleur au lieu d'un sous-agent — diff de 9 lignes sans logique — coût si faux : une espace mal placée.
- Task 2 mineurs -> tâche 7 : sortir les constantes (DUREES_EVENEMENT, RAPPELS, DUREES_SESSION, TYPES_NOTIFICATION) dans des modules sans zod pour retirer zod (107 Ko) du bundle client ; garder zod-sans-eval tant qu'un module client importe zod — réduit le bundle et la fragilité — coût faible.
- Task 2 mineurs -> tâche 9 : e2e sécurité attend networkidle sur le chapitre, vérifie COOP/Permissions-Policy et l'absence de HSTS en http, et le test hors connexion suit les violations de CSP — coût faible.
- Task 4 — le guide passe par un fichier hors dépôt `.env.distant` (ignoré par git, droits 600) et `npx tsx --env-file=.env.distant …`, conseille de coller les clés générées directement dans Vercel ; on ajoute aussi les mineurs (supabase login/mot de passe, clé de service obligatoire pour configurer-envoi, NEXT_PUBLIC_* figées au build, échec de chaque instance) — éviter la fuite de secrets — coût nul.
- Task 5 mineurs -> tâche 6 : remettre `if v_id is null then raise exception 'evenement_introuvable'` après l'UPDATE de enregistrer_evenement ; nettoyer les titres de session dans accepter_plan_revision comme ceux du calendrier — durcissement peu coûteux — coût : deux fonctions de plus à recopier.
- Task 6 — on accepte la correction de l'exemple de test de C8 par l'implémenteur (ouverture 9 h 05, limite 13/01 8 h 10) — l'exemple du contrôleur était faux, la règle est inchangée — coût nul.
- Task 6 — correctif : validité echeance_proche exige limite > now() et ouverture <= now() ; validité rappel exige le délai courant de l'événement ; UPDATE echec et DELETE en `for update skip locked` — conséquence de C8 et robustesse concurrente — coût faible.
- Task 8 mineurs -> tâche 9 : remplissage de la barre plus clair en mode sombre ; aria-invalid sur le fieldset (role=radiogroup) au lieu des radios ; détection « déjà inscrit » par code d'erreur Supabase — peu coûteux — coût faible.
- Task 9 — la revue d'accessibilité de fin d'étape se fait par un parcours automatique axe-core (@axe-core/playwright, en devDependency) sur les pages principales en clair et en sombre, à 375 px, plus une lecture manuelle des points que l'outil ne voit pas — un sous-agent n'a pas de navigateur interactif fiable, et le test reste dans le dépôt — coût : une dépendance de test.
- Task 9 — correctifs de revue (barre de progression sombre, radiogroup, code d'erreur Supabase) et durcissement des e2e de sécurité faits avant la vérification complète — peu coûteux — coût faible.
- Task 9 — les contrastes sombres signalés par axe pendant la transition de thème sont un artefact de mesure : le test attend la fin des animations au lieu d'exclure la règle — rester strict sur color-contrast — coût : 1,5 s au plus par page.

Autres écarts :
- `register()` n'est pas appelé pendant `next build` : la vérification des variables agit **au démarrage du serveur**, pas au build (corrections C1 et C4).
- La page `/hors-ligne` n'est plus statique (la CSP exige un nonce par requête) ; zod passe en `jitless` pour éviter `eval`.
- Fin d'étape : le plan prévoyait le skill `design:accessibility-review` interactif ; il est remplacé par un test axe-core dans le dépôt (ruling de la tâche 9).

## Revue d'accessibilité de fin d'étape

Méthode : `e2e/accessibilite.spec.ts` (`@axe-core/playwright`, devDependency), projet « mobile » (Pixel 7, 412 px), un compte élève neuf, en mode clair puis sombre (`page.emulateMedia`), règles WCAG 2.1 A et AA, échec sur tout impact `serious` ou `critical`. Pages : `/connexion`, `/inscription`, `/bienvenue` (et son état d'erreur), `/`, la page d'un cours, un chapitre, `/calendrier/nouveau`, `/calendrier` (semaine et mois, avec un événement), `/notifications`, `/rappels`, `/classes`, le quiz (une question, puis une réponse cochée). La page ordinateur n'est pas passée par axe (mise en page identique en colonnes plus larges ; le test ne tourne que sur le projet mobile).

Constats d'axe et suites :

| Page | Critère WCAG | Gravité | Constat | Suite |
| --- | --- | --- | --- | --- |
| `/connexion`, `/inscription`, `/` (clair et sombre) | 1.4.1 Utilisation de la couleur (A) | grave | Liens dans une phrase sans soulignement (Tailwind le retire), 1,3:1 à 2,6:1 avec le texte voisin | Corrigé : `p a:not([class])` souligné |
| Chapitres (clair et sombre) | 2.1.1 Clavier (A) | grave | Tableaux et schémas défilants (`.tbl`, `.scroll`) sans contenu focalisable | Corrigé : le nettoyage du HTML pose `tabindex="0"` sur ces conteneurs, et seulement sur eux (test ajouté) |
| Chapitre et quiz, mode sombre | 1.4.3 Contraste (AA) | grave | Contrastes de 1,0:1 à 1,2:1 sur des étiquettes et des pastilles | Faux positif de mesure : axe lisait des couleurs intermédiaires pendant la transition de 180 ms après le changement de thème. Le test attend la fin des animations (`document.getAnimations()`) avant de mesurer ; aucune règle n'est exclue |

Après correction, aucune violation grave ou critique sur l'ensemble du parcours, en clair et en sombre.

Autres corrections d'accessibilité de la fin d'étape (revue de la tâche 8) :
- remplissage de la barre de progression éclairci en mode sombre (80 % vers le blanc) : 3,66:1 contre la piste avec l'indigo par défaut, 3,1:1 au pire (couleur de cours noire), contre 1,26:1 auparavant ;
- `aria-invalid` et `aria-describedby` sur le groupe de boutons radio « Ton niveau » (`fieldset` en `role="radiogroup"`) au lieu de chaque bouton ;
- « déjà inscrit » détecté par le code d'erreur Supabase (`user_already_exists`, avec `email_exists` et l'expression sur le message en repli).

Lecture manuelle de ce qu'axe ne vérifie pas (code de `LecteurTentative`, `CompteARebours`, `BarreProgression`) :
- **Focus du quiz** : à chaque changement de question, le focus passe au `fieldset` de la question (`tabIndex=-1`) et la page défile vers lui ; l'ordre du DOM suit l'ordre visuel (position, temps restant, état de l'enregistrement, progression, question, navigation, pastilles, « Terminer maintenant »). Pas de piège au clavier.
- **Annonces** : la position « Question n sur N » est une région `aria-live="polite"` ; l'erreur d'enregistrement et l'échec de fin sont en `role="alert"` ; le temps restant est un `role="timer"` avec une région `aria-live` séparée, qui n'annonce pas chaque seconde ; la barre est un `role="progressbar"` avec `aria-valuetext`. L'état « Réponses enregistrées » n'est pas annoncé (volontaire : seule l'erreur l'est).
- **Mouvement** : `prefers-reduced-motion` désactive transitions et animations.
- **Non vérifié** : lecture avec un vrai lecteur d'écran (VoiceOver, NVDA), zoom à 200 %, navigation au clavier de bout en bout à la main. À faire avant l'ouverture au public.

## Limites connues et acceptées

- **`exigerEleve` redirige désormais un visiteur déconnecté vers `/connexion`** (au lieu d'un 404) : comportement voulu, mais différent de celui de l'étape 4a.
- **Vérification des variables au démarrage, pas au build** : une variable manquante n'empêche pas le déploiement, la première requête échoue. Le guide recommande de lire les journaux après chaque déploiement.
- **`/hors-ligne` est dynamique** : elle passe par le proxy à l'installation du service worker.
- **`style-src 'unsafe-inline'`** : Next.js et les schémas SVG des cours utilisent des styles en ligne ; les scripts, eux, exigent le nonce.
- **Un nouveau déploiement vide le cache hors connexion** : les chapitres en cache sont remis en cache à la prochaine lecture.
- **Ligne de rappel réservée** : elle n'est plus supprimée par le déclencheur. Si l'heure change pendant les 2 minutes de réservation et que l'envoi échoue, le nouvel essai peut partir avec l'ancienne occurrence encore à venir.
- **Contraste de la piste de la barre de progression en mode clair** (1,4:1 pour la piste seule) : la progression est aussi écrite en texte et la barre est décorative (exemption de 1.4.11).
- **Tableaux et schémas défilants** focalisables même quand rien ne défile (léger bruit de tabulation, sans nom accessible propre).

## Points reportés, par étape

**Étape 5 (abonnement, RGPD)**
- Les points des bilans précédents restent ouverts, notamment : vie privée du cache hors connexion sur appareil partagé ; frein global par IP sur les codes d'invitation ; fuseau des élèves des DROM ; version Postgres du projet hébergé (MAINTAIN demande Postgres 17).

**Étape 6 (contenu)**
- Banques de questions et rééquilibrage des QCM BPH (bilan 3b) ; reprendre sur la dernière question quand toutes les réponses sont données ; contraste en mode sombre pour des couleurs de cours très foncées (la pastille est à 10:1 au pire avec les couleurs testées).

**Plus tard (qualité et dette mineure)**

Mineurs de l'étape 4c :
- Variables : `register()` bloque aussi `next dev` quand une variable manque (voulu) ; `NEXT_PUBLIC_SITE_URL` n'est exigée que sur Vercel en production.
- CSP et service worker : `x-nonce` posé mais non lu (réservé) ; pas de test du nettoyage des anciens caches ; repli `'dev'` de la version inutile côté composant.
- Outillage : `db:reset` échoue parfois à l'import juste après la remise à zéro (relancer `npm run import:contenu -- contenu/1re-st2s/bph.json --publier` puis `npm run configurer:envoi`).
- Base : compteur `reservations` jamais remis à zéro (sans effet avec les bornes actuelles).
- TypeScript : tests de la tâche 7 écrits avec la correction (échec préalable non observé) ; deux imports placés après du code.
- Interface : `?n=` reste dans l'URL de `/admin/enseignants` (un rechargement rejoue le message).

Points de l'étape 4b non traités ici :
- **Base, planification** : reprise d'un endpoint par un autre élève (appareil partagé, inexploitable sans l'endpoint) ; `marquer_rappels_lus` marque aussi des lignes `en_attente` échues ; départage aléatoire du plafond de 10 appareils dans une même transaction ; schéma `net` lisible par `anon` (défaut Supabase, non exposé par PostgREST).
- **Envoi** : longueur du secret révélée par le temps de comparaison (négligeable) ; `HTTPS` en majuscules toléré côté TypeScript ; `.env.local` créé en 0644 et clé vide dupliquée par `cles:notifications` ; tests manquants (ordre par lots, appareils mixtes, fin de silence inexistante ou ambiguë au changement d'heure) ; ligne renvoyée sans limite si `envoi_terminer` échoue en continu (la borne de 10 réservations couvre le cas) ; `echeance_proche`, `nouvel_essai` et `inactivite` revalidés par la tâche 6, mais pas lors de l'envoi lui-même ; le délai de `web-push` est un délai d'inactivité, pas une durée totale ; la trace Playwright au réessai pourrait enregistrer le secret Bearer local.
- **Service worker** : libellé d'appareil approximatif pour Chrome et Firefox sur iOS ; badge Android en couleur ; pas de test unitaire.
- **Interface** : contraste de la pastille du compteur en mode sombre à vérifier avec une couleur de cours inhabituelle ; deux appareils de même libellé donnent des boutons « Retirer » identiques ; invitation qui apparaît après coup (décalage) ; « Nouveau » qui disparaît vite et lignes arrivées entre-temps marquées lues ; condition « inactif » de l'invitation qui inclut l'autorisation déjà accordée ; retirer l'appareil courant laisse l'abonnement du navigateur ; hôte non vérifié tôt dans `enregistrerAbonnement` ; échec du réglage de rappel seulement journalisé ; bouton de déconnexion resté désactivé si la déconnexion serveur échoue ; repli `form.submit()` hors action React ; pas de gestion de `pushsubscriptionchange`.

Points de l'étape 4a toujours ouverts :
- **Base** : changement de type refusé avec `evenement_introuvable` (traité par `type_non_modifiable`, à vérifier dans l'interface) ; tests manquants (chemin de mise à jour, limites de 366 jours, durée, fenêtre, plus de 30 chapitres, `reserve_eleves`, cascade de l'examen, changement d'heure d'automne, sessions passées gardées, plafond de 500, refus sans plan).
- **Générateur** : révision générale hors plafond hebdomadaire ; décalage aussi pour la règle des 30 minutes ; tests manquants (22 h, semaine, veille non préférée).
- **Révision générale** : pas de test au-delà de 30 questions (plafond, alternance, priorité).
- **iCal** : jeton non revalidé localement avant la RPC ; `Cache-Control: max-age=300` suit le plan ; jeton conservé si le rôle change.
- **Actions serveur** : `ignorerReorganisation` ignore les erreurs ; `NEXT_PUBLIC_SITE_URL` figé au build.
- **Interface** : colonne horaire large sur l'accueil (`avecJour`) ; `overflow-wrap` manquant sur les titres longs ; hachures des échéances un peu chargées ; `catch {}` muet dans `ProchainsEvenements` ; refus du planning qui envoie les réglages initiaux ; `BanniereReorganiser` sans état `pending` (bouton « Plus tard » traité) ; pas de test unitaire de `tropLoin`.
- **Hors connexion** : double rendu serveur d'un chapitre chargé en page complète ; course entre la déconnexion et une écriture différée.
- **Fonctionnel** : les échéances d'une classe quittée depuis moins de 30 jours ne s'affichent pas dans le calendrier ni dans l'iCal ; modifier un examen ne met pas à jour son plan, et un examen peut être récurrent ; le plan accepté peut différer de l'aperçu sans que l'élève en soit prévenu ; des réglages qui ne peuvent jamais donner de créneau demandent un avertissement plus clair.

Points des bilans 1 à 3b toujours ouverts :
- **Mise en ligne (à faire à la main, voir le guide)** : Google et `NEXT_PUBLIC_SITE_URL` en production ; modèle d'e-mail « Confirm signup », URL de redirection et mot de passe d'au moins 8 caractères sur le projet Supabase hébergé.
- **Bilan 2** : légende flottante à tester sur Safari iOS ; marqueur « lu » trop rapide sur les chapitres courts.
- **Bilan 3a** : frein global par IP sur les codes d'invitation.
- **Bilan 3b** : aperçu de chapitre qui peut réutiliser des identifiants de l'éditeur ; test de contenu qui attend une seconde fixe, et `throw` dans un `finally` ; cache du rendu nettoyé des chapitres.

## Revue finale

Revue de la branche (`etape-4b-notifications..etape-4c-securite`) par Opus : fusion possible après correction des points ci-dessous.

Points forts :
- CSP stricte (nonce, `strict-dynamic`, `frame-ancestors 'none'`) et testée de bout en bout, sans violation sur les pages principales ni hors connexion ;
- session et redirections du proxy cohérentes (cookies et en-têtes de cache recopiés) ;
- migrations fidèles au plan et droits d'exécution vérifiés ;
- coût de `notification_encore_valide` mesuré : 55 ms pour 5 000 lignes ;
- nettoyeur de HTML sans surface XSS.

Correctifs de la vague finale :
- guide de mise en ligne : fichier `.env.distant` au lieu de `.env.production.local` (Next le charge automatiquement, risque d'e2e contre la production), rappel sur les variables déjà exportées dans le shell, URL du site distincte des URL de redirection, note sur les déploiements Preview ;
- `session.ts` : cookies et en-têtes de cache cumulés et réappliqués à chaque reconstruction de la réponse ;
- `env.ts` : URL Supabase en https exigée en production (test ajouté) ;
- connexion : le champ « mot de passe » n'est marqué en erreur que pour des identifiants invalides ;
- migration `20261215000003_verrou_profil.sql` : `for no key update` au lieu de `for update` sur le profil dans `enregistrer_evenement` et `accepter_plan_revision` ;
- `next.config.ts` : version du déploiement normalisée au format du service worker ;
- e2e sécurité : `Permissions-Policy` contient `camera=()`.

Mineurs conservés : ceux de la section « Plus tard » ci-dessus (aucun n'est bloquant).

## Vérification finale

- `npm test` : 366 tests, 39 fichiers ;
- `npm run test:db` : 752 tests, 25 fichiers ;
- `npm run e2e` : 42 exécutions, 39 réussies, 3 ignorées ;
- typage, lint et build sans erreur.
