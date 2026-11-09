# App lycée (nom provisoire)

Cours détaillés, quiz et évaluations pour les lycéens, de la seconde à la terminale.

- Spec : `docs/superpowers/specs/2026-11-03-app-lycee-design.md`
- Feuille de route : `docs/superpowers/plans/2026-11-03-feuille-de-route.md`

## Démarrer en local

Prérequis : Node.js 24 et Docker (Docker Desktop ou OrbStack) lancé.

1. `npm install`
2. `npm run db:start`, puis copier `.env.example` en `.env.local` et y mettre les clés affichées par `npx supabase status` : la clé anon (ou publishable) va dans `NEXT_PUBLIC_SUPABASE_ANON_KEY`, la clé service_role (ou secret) dans `SUPABASE_SERVICE_ROLE_KEY`.
3. `npm run db:reset` (crée la base et importe le cours BPH 1re ST2S).
4. `npm run dev`, puis ouvrir http://localhost:3000.

## Tests

- `npm test` : règles de l'application (Vitest)
- `npm run test:db` : règles d'accès de la base (pgTAP)
- `npm run e2e` : parcours complets (Playwright). Prérequis : base locale démarrée et réinitialisée avec le cours (`npm run db:reset`), `.env.local` rempli, et, la première fois, `npx playwright install chromium`. Les tests construisent et lancent l'application en production (`npm run build && npm run start`). Arrête `npm run dev` avant `npm run e2e` : les tests lancent leur propre build de production sur le port 3000. Les comptes `@test.local` créés par les tests sont supprimés à la fin. Le parcours de gestion du contenu importe son propre cours de test (slug `e2e-…`) et ne modifie jamais BPH ; ce cours est supprimé à la fin.

## Quiz et évaluations

La correction se fait dans la base, jamais dans le navigateur : les corrigés vivent dans le schéma `prive`, et l'application n'appelle que des fonctions `public.*` en RPC (démarrer, enregistrer une réponse, terminer, lire la correction).
Les règles (seuil de réussite, nombre de questions, durée, essais) sont listées dans `src/lib/quiz/regles.ts` pour l'affichage et appliquées par la base.
Les tests de la base sont des fichiers pgTAP dans `supabase/tests/` (`npm run test:db`).

## Rôles

Chaque compte a un rôle : `eleve` (par défaut), `enseignant` ou `admin_contenu`.
À l'inscription, une personne qui choisit « J'enseigne » dépose une demande : elle voit une page d'attente jusqu'à sa validation.

Pour désigner le premier administrateur du contenu, lancer cette commande sur la base (en local : `docker exec supabase_db_app-lycee psql -U postgres`) :

```sql
update public.profil set role = 'admin_contenu' where email = 'ton.adresse@exemple.fr';
```

Cet administrateur valide ensuite les comptes enseignants (ou les refuse) sur `/admin/enseignants`.

### Espace admin du contenu

L'administrateur gère tout le contenu depuis `/admin`, sans jamais écrire dans les tables : chaque modification passe par une fonction de la base qui vérifie son rôle.

- **Suivi** (`/admin`) : pour chaque cours et chaque chapitre, les questions validées (objectif de 150), à relire et en brouillon, les signalements ouverts, et la publication du cours ou du chapitre.
- **Éditeur de chapitre** : titres, objectifs, sections en HTML (modèles, dépôt de schémas, aperçu de ce que le nettoyage retire) et zone « Je retiens ». Le HTML est nettoyé à l'enregistrement et à l'affichage.
- **Éditeur de questions** (`/admin/chapitres/<id>/questions`) : QCM, vrai ou faux, réponse courte, avec filtres. Une nouvelle question commence en brouillon, puis suit le cycle brouillon, à relire, validée : seules les questions validées sont tirées dans les quiz. Modifier la structure d'une question validée ou déjà tirée crée une nouvelle version (l'ancienne reste dans les corrections passées).
- **Import** (`/admin/import`) : on dépose un fichier JSON, on vérifie le résumé, puis on importe (voir « Contenu »).
- **Signalements** (`/admin/signalements`) : les erreurs signalées par les enseignants. L'administrateur marque un signalement comme traité ou le rejette (la question redevient validée), avec une réponse facultative que l'enseignant lit.

Le format du JSON, les statuts, les règles des réponses courtes, le HTML autorisé et le versionnage sont détaillés dans le [guide des auteurs](docs/guide-auteurs.md).

### Parcours enseignant

1. **Demande** : à l'inscription, la personne choisit « J’enseigne » et indique son établissement. Elle voit une page d'attente.
2. **Validation** : l'administrateur du contenu accepte ou refuse la demande sur `/admin/enseignants`. Une fois validé, le compte arrive sur `/enseignant`. Un refus renvoie la personne vers l'accueil, où elle peut continuer comme élève.
3. **Classes** : l'enseignant crée une classe (nom, filière et niveau facultatifs) et choisit ses cours. Les cours restent modifiables ensuite, et chaque cours peut recevoir une ouverture et une date limite de l'évaluation (heure de Paris). Un élève qui quitte lui-même une classe reste soumis à ses échéances pendant 30 jours.
4. **Code** : chaque classe a un code d'invitation de 6 caractères et un lien `/classes?code=…`, à donner aux élèves. Un « Nouveau code » rend l'ancien inutilisable. L'élève saisit le code (majuscules ou minuscules) sur `/classes` ; trop de codes faux bloque les essais pendant une heure.
5. **Suivi** : la page de la classe affiche, pour chaque élève, les chapitres validés, la note d'évaluation, le nombre d'essais et la dernière activité. L'enseignant peut retirer un élève.
6. **Export** : la page « Notes et questions ratées » donne les meilleures notes par chapitre, les questions les plus ratées, et un export CSV (séparateur `;`, virgule décimale, ouvrable dans Excel).
7. **Signalement** : dans la correction d'un quiz qu'il passe lui-même, ou dans « Questions les plus ratées », l'enseignant peut cliquer sur « Signaler une erreur » et décrire le problème (5 à 1000 caractères, 20 signalements par jour au plus). La question passe en relecture et sort des quiz le temps du traitement. Il suit ses signalements sur `/enseignant/signalements`, avec la décision et la réponse de l'administrateur.

**Ce qu'un enseignant voit** : la progression (chapitres validés) et les notes des élèves de ses classes, pour les cours de la classe, y compris leurs résultats antérieurs sur ces cours.

**Ce que l'enseignant ne voit pas** : les réponses détaillées des élèves et leur calendrier de révision. Seules ses propres classes sont visibles.

## Calendrier et hors connexion

L'élève a un calendrier (`/calendrier`) avec un planning de révision proposé avant ses examens, et un lien d'abonnement iCal privé (`/calendrier/partage`).

- Le service worker (`public/sw.js`) n'est actif qu'en production : `npm run build && npm run start`. En développement (`npm run dev`), l'application n'est ni installable ni lisible hors connexion.
- `NEXT_PUBLIC_SITE_URL` sert à construire les liens iCal en production. Cette valeur est figée au build : la définir avant `npm run build`.

## Notifications

L'élève reçoit des rappels (événements du calendrier, évaluation qui ferme, nouvel essai, révision du jour, relance d'inactivité) par notification Web Push, et les retrouve dans la page Rappels.

- `npm run cles:notifications` ajoute à `.env.local` les clés VAPID, le secret et l'adresse d'envoi (sans les afficher). `npm run db:reset` configure ensuite la tâche planifiée locale, qui appelle la route chaque minute.
- Les notifications n'arrivent qu'avec le build de production (`npm run build && npm run start`), car le service worker n'est enregistré qu'en production.
- En production : générer d'autres clés, renseigner les variables sur l'hébergeur, puis lancer `CONFIGURER_PRODUCTION=1 npm run configurer:envoi` avec l'URL publique de la route dans `ENVOI_URL` et les clés du projet hébergé.
- Sur iPhone, l'application doit être ajoutée à l'écran d'accueil (iOS 16.4 ou plus récent).

## Confirmation de l'inscription par e-mail

Sur le projet Supabase hébergé, le modèle d'e-mail « Confirm signup » (Authentication > Email Templates) doit pointer vers :
`{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email`.
Ajouter aussi `<url-du-site>/auth/confirm` aux Redirect URLs. En local, `supabase/config.toml` est déjà réglé.

## E-mails

L'application envoie un seul e-mail, celui de l'accord parental (élève de moins de 15 ans). Variables (voir `.env.example`) : `SMTP_HOTE`, `SMTP_PORT`, `SMTP_UTILISATEUR`, `SMTP_MOT_DE_PASSE`, `EMAIL_EXPEDITEUR`. Sans elles, l'envoi échoue avec un message clair et la vérification au démarrage le signale.

- En local, Mailpit reçoit tout : SMTP sur `127.0.0.1:54325` (réglé dans `supabase/config.toml`, section `[local_smtp]`), boîte de lecture sur http://127.0.0.1:54324. Renseigner `SMTP_HOTE=127.0.0.1`, `SMTP_PORT=54325` et une adresse d'expéditeur, sans identifiants.
- Le lien de l'e-mail se construit uniquement depuis `NEXT_PUBLIC_SITE_URL` (en local, `http://localhost:3000` par défaut en développement ; le build de production l'exige, les tests e2e la fixent dans `playwright.config.ts`).
- En production : un fournisseur SMTP avec TLS (les identifiants imposent `requireTLS`).

## Données personnelles

- **Export** : la page `/mes-donnees` télécharge un fichier JSON (profil, classes, progression, tentatives et réponses, calendrier, plans, préférences, appareils sans clés, consentement, cours gratuit, signalements). Le jeton du lien iCal n'y figure pas (secret, révocable). L'export est refusé pendant une évaluation ouverte.
- **Suppression** : tout compte peut la demander depuis `/mes-donnees`. Une bannière permet d'annuler pendant 30 jours ; ensuite la tâche planifiée `purges-quotidiennes` (chaque jour à 3 h 23, `prive.purges_quotidiennes()`) supprime le compte et tout ce qui en dépend (les classes d'un enseignant sont supprimées avec lui). Le dernier administrateur du contenu est conservé.
- **Purges** : la même tâche supprime après 30 jours les départs et les retraits de classe (qui bloquent un retour pendant 24 heures).
- **Pages légales** : `/mentions-legales`, `/confidentialite`, `/conditions-utilisation` sont des trames à compléter (champs entre crochets) et à faire relire par un juriste avant la mise en vente. Aucune bannière de cookies : seuls des cookies de session sont utilisés.
- **Accès** : essai de 7 jours, puis un cours gratuit au choix (changement possible une fois pendant 48 heures). Un élève de moins de 15 ans n'accède à rien tant qu'un parent n'a pas donné son accord ; l'essai commence à cet accord.

## Contenu

Le contenu entre en base uniquement par des fichiers JSON validés (`src/lib/contenu/format-import.ts`) ou par les éditeurs de l'espace admin, qui appliquent les mêmes règles. Le format est décrit dans le [guide des auteurs](docs/guide-auteurs.md).

```bash
npm run import:contenu -- <fichier.json> [--publier] [--distant]
```

- `npm run import:contenu -- contenu/1re-st2s/bph.json --publier` importe le cours BPH et le publie.
- Sans `--publier`, un cours ou un chapitre nouveau reste en brouillon ; un cours déjà publié le reste.
- Le script refuse toute base qui n'est pas locale, sauf avec `--distant`.
- Un fichier invalide n'écrit rien : toutes les erreurs sont listées avec leur chemin (« Chapitre 2, question 5 : … »).
- Le bilan indique les questions créées, modifiées, en nouvelle version, inchangées, archivées et supprimées. Un import est rejouable : les questions inchangées restent telles quelles.
- Les administrateurs peuvent aussi importer depuis `/admin/import` (vérification du résumé, puis confirmation).

Mise en ligne : voir `docs/mise-en-ligne.md`.

## Sécurité

- **CSP avec nonce** : le proxy (`src/proxy.ts`) crée un nonce aléatoire à chaque requête et pose `Content-Security-Policy` (`script-src 'self' 'nonce-…' 'strict-dynamic'`, `frame-ancestors 'none'`, etc.). La politique est construite par `politiqueContenu` (`src/lib/securite/csp.ts`, testée). Les pages sont donc rendues à la demande. `style-src` garde `'unsafe-inline'` (styles en ligne de Next et des schémas).
- **En-têtes** sur toutes les routes : `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, `Cross-Origin-Opener-Policy`, et `Strict-Transport-Security` seulement en https (jamais sur `http://localhost`).
- **Variables d'environnement** : `src/instrumentation.ts` les vérifie au démarrage du serveur (pas au build). Une variable obligatoire absente arrête le démarrage avec un message clair ; un groupe de notifications incomplet est signalé.
- **Service worker** : sa version est liée au déploiement (commit Vercel, sinon horodatage du build), lue dans `/sw.js?v=…`. Un nouveau déploiement remplace et vide les anciens caches hors connexion.
- **Accessibilité** : `npx playwright test e2e/accessibilite.spec.ts` passe axe-core (WCAG 2.1 A et AA, impacts grave et critique) sur les pages principales, en clair et en sombre.

Mise en ligne (Vercel en région `cdg1`, Supabase en UE) : voir [`docs/mise-en-ligne.md`](docs/mise-en-ligne.md).
