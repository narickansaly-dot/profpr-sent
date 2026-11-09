# Mise en ligne

Ce guide liste ce qui se règle à la main pour publier l'application. Rien n'est déployé automatiquement.

## 1. Projet Supabase (hébergé)

- Région : **Europe** (Paris `eu-west-3` ou Francfort `eu-central-1`). Les données des élèves restent en Europe (spec, section 9).
- Version de Postgres : **17** (le droit `MAINTAIN` utilisé par les migrations l'exige).
- Appliquer les migrations : `npx supabase link --project-ref <ref>` puis `npx supabase db push`.
- Importer le cours, depuis un poste de confiance, avec l'URL et la clé de service du projet hébergé dans l'environnement du shell (jamais commitées ; `npm run import:contenu` lit aussi `.env.local`, qui ne remplace pas une variable déjà définie dans le shell) :

      npm run import:contenu -- contenu/1re-st2s/bph.json --publier --distant

  Sans `--distant`, le script refuse toute base qui n'est pas locale.
- Authentification :
  - mot de passe d'au moins **8 caractères** ;
  - confirmation de l'adresse e-mail activée, modèle « Confirm signup » en français ;
  - URL du site et URL de redirection : `https://<domaine>/auth/callback` et `https://<domaine>/auth/confirm` ;
  - fournisseur Google : identifiants OAuth du projet Google, URL de redirection fournie par Supabase.
- Extensions `pg_cron` et `pg_net` : activées par les migrations.
- Ne jamais ajouter le schéma `net` ni `prive` aux schémas exposés par l'API.

## 2. Projet Vercel

- Région des fonctions : `cdg1` (fixée par `vercel.json`, clé `regions`).
- Variables d'environnement (Production) :
  - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` ;
  - `NEXT_PUBLIC_SITE_URL=https://<domaine>` — **lue au build** : la changer demande un nouveau déploiement ;
  - `NEXT_PUBLIC_VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_SUJET=mailto:<adresse de contact>`, `ENVOI_SECRET` : générer de **nouvelles** clés, différentes des clés locales (`npx web-push generate-vapid-keys` et `openssl rand -base64 32`) ;
  - ne pas mettre `SUPABASE_SERVICE_ROLE_KEY` dans Vercel : l'application ne l'utilise pas.
- L'application vérifie ces variables **au démarrage du serveur** (`src/instrumentation.ts`), pas pendant le build : une variable obligatoire absente n'empêche pas le déploiement, mais la première requête échoue. Les notifications incomplètes sont signalées dans les journaux (préfixe `[configuration]`). **Consulter les journaux après chaque déploiement.**
- En développement, une variable obligatoire manquante empêche aussi `npm run dev` de démarrer.

## 3. Tâche d'envoi des notifications

Une fois le site en ligne, depuis un poste de confiance, avec les clés du projet hébergé dans l'environnement (jamais commitées) :

    CONFIGURER_PRODUCTION=1 ENVOI_URL=https://<domaine>/api/notifications/envoyer \
      NEXT_PUBLIC_SUPABASE_URL=… SUPABASE_SERVICE_ROLE_KEY=… ENVOI_SECRET=… \
      npx tsx scripts/configurer-envoi.ts

Le script refuse la production si `ENVOI_URL` ne commence pas par `https://` ou vise `localhost`, `127.0.0.1` ou `host.docker.internal`. Sans `ENVOI_SECRET` ou `ENVOI_URL`, il n'écrit rien.

Vérifier ensuite dans Supabase (SQL) : `select jobname, schedule from cron.job;` doit lister `planifier-notifications`, `envoi-notifications` et `purger-historique-cron`.

## 4. Vérifications après la mise en ligne

- Les en-têtes de sécurité sont présents (`curl -sI https://<domaine>/connexion`) : `content-security-policy`, `strict-transport-security`, `x-frame-options: DENY`.
- La console du navigateur ne montre aucune violation de CSP sur l'accueil, un chapitre, le calendrier.
- L'application s'installe et le service worker est actif (outils de développement, onglet « Application »).
- Une notification de test arrive sur un téléphone (créer un événement avec un rappel de 10 minutes).
