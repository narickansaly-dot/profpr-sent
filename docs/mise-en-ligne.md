# Mise en ligne

Ce guide liste ce qui se règle à la main pour publier l'application. Rien n'est déployé automatiquement.

## 1. Projet Supabase (hébergé)

- Région : **Europe** (Paris `eu-west-3` ou Francfort `eu-central-1`). Les données des élèves restent en Europe (spec, section 9).
- Version de Postgres : **17** (le droit `MAINTAIN` utilisé par les migrations l'exige).
- Appliquer les migrations : `npx supabase login`, puis `npx supabase link --project-ref <ref>` (le mot de passe de la base est demandé), puis `npx supabase db push` (le mot de passe est redemandé si besoin).
- Importer le cours, depuis un poste de confiance. Ne jamais taper de secret en préfixe de commande (il resterait dans l'historique du shell). Créer à la racine du dépôt un fichier `.env.distant` (ignoré par git grâce à `.gitignore`), protégé par `chmod 600 .env.distant`, contenant `NEXT_PUBLIC_SUPABASE_URL` et `SUPABASE_SERVICE_ROLE_KEY` du projet hébergé, puis :

      npx tsx --env-file=.env.distant scripts/importer-contenu.ts contenu/1re-st2s/bph.json --publier --distant

  Ce fichier ne s'appelle pas `.env.production.local` à dessein : Next charge automatiquement `.env.production.local` pour `next build` et `next start`, et un fichier oublié ferait tourner `npm run e2e` contre la base de production. Ouvre un nouveau terminal sans variable Supabase exportée : une variable déjà définie dans le shell l'emporte sur `--env-file`.

  C'est la commande du script `import:contenu` de `package.json`, avec le fichier d'environnement de production à la place de `.env.local`. Sans `--distant`, le script refuse toute base qui n'est pas locale. Supprimer le fichier ensuite (ou ne le garder que sur un poste de confiance).
- Authentification :
  - mot de passe d'au moins **8 caractères** ;
  - confirmation de l'adresse e-mail activée, modèle « Confirm signup » en français ;
  - URL du site : `https://<domaine>` ;
  - URL de redirection autorisées : `https://<domaine>/auth/callback` et `https://<domaine>/auth/confirm` ;
  - fournisseur Google : identifiants OAuth du projet Google, URL de redirection fournie par Supabase.
- Extensions `pg_cron` et `pg_net` : activées par les migrations.
- Ne jamais ajouter le schéma `net` ni `prive` aux schémas exposés par l'API.

## 2. Projet Vercel

- Région des fonctions : `cdg1` (fixée par `vercel.json`, clé `regions`).
- Variables d'environnement (Production) :
  - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` ;
  - `NEXT_PUBLIC_SITE_URL=https://<domaine>` ;
  - `NEXT_PUBLIC_VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_SUJET=mailto:<adresse de contact>`, `ENVOI_SECRET` : générer de **nouvelles** clés, différentes des clés locales (`npx web-push generate-vapid-keys` et `openssl rand -base64 32`). Coller les clés générées directement dans le tableau de bord Vercel (et dans le fichier privé de la section 3 si besoin), jamais dans un fichier suivi par git, puis effacer le terminal (`clear`) ;
  - ne pas mettre `SUPABASE_SERVICE_ROLE_KEY` dans Vercel : l'application ne l'utilise pas.
- Déploiements Preview de Vercel : les désactiver, ou leur donner un projet Supabase séparé et leurs propres variables (sinon chaque instance échoue au démarrage faute de variables de production).
- Toutes les variables `NEXT_PUBLIC_*` (pas seulement `NEXT_PUBLIC_SITE_URL`) sont figées au build : les changer demande un nouveau déploiement.
- L'application vérifie ces variables **au démarrage du serveur** (`src/instrumentation.ts`), pas pendant le build : une variable obligatoire absente n'empêche pas le déploiement, mais chaque instance du serveur échoue au démarrage : toutes les requêtes échouent tant que la variable n'est pas corrigée. Les notifications incomplètes sont signalées dans les journaux (préfixe `[configuration]`). **Consulter les journaux après chaque déploiement.**
- En développement, une variable obligatoire manquante empêche aussi `npm run dev` de démarrer.

## 3. Tâche d'envoi des notifications

Une fois le site en ligne, depuis un poste de confiance. Ne jamais taper de secret en préfixe de commande. Créer (ou compléter) le fichier `.env.distant` à la racine du dépôt (ignoré par git), protégé par `chmod 600 .env.distant`, avec `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` (obligatoire aussi pour ce script), `ENVOI_SECRET` (le même que dans Vercel), `ENVOI_URL=https://<domaine>/api/notifications/envoyer` et `CONFIGURER_PRODUCTION=1`, puis :

    npx tsx --env-file=.env.distant scripts/configurer-envoi.ts

Supprimer ensuite le fichier (ou ne le garder que sur un poste de confiance).

Le script refuse la production si `ENVOI_URL` ne commence pas par `https://` ou vise `localhost`, `127.0.0.1` ou `host.docker.internal`. Sans `ENVOI_SECRET` ou `ENVOI_URL`, il n'écrit rien.

Vérifier ensuite dans Supabase (SQL) : `select jobname, schedule from cron.job;` doit lister `planifier-notifications`, `envoi-notifications` et `purger-historique-cron`.

## 4. Vérifications après la mise en ligne

- Les en-têtes de sécurité sont présents (`curl -sI https://<domaine>/connexion`) : `content-security-policy`, `strict-transport-security`, `x-frame-options: DENY`.
- La console du navigateur ne montre aucune violation de CSP sur l'accueil, un chapitre, le calendrier.
- L'application s'installe et le service worker est actif (outils de développement, onglet « Application »).
- Une notification de test arrive sur un téléphone (créer un événement avec un rappel de 10 minutes).
