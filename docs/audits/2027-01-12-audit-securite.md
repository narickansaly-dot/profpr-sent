# Audit de sécurité et de protection des données — 12 janvier 2027

## Suites données

Branche `correctifs-audit` (bilan : `docs/superpowers/plans/2027-01-19-correctifs-audit-bilan.md`).

| Constat | Suite |
|---|---|
| I1. Moins de 15 ans sans accord ou accord retiré | corrigé (`bb726c2`, `672f832`, migrations `20270119000001` et `20270119000004`) : gardes sur 5 écritures, filtres sur les lectures enseignant, rappels et iCal, notifications déjà en attente retirées. Reste : la politique RLS enseignant « inscriptions visibles » expose encore `eleve_id` et `rejoint_le` d'un élève retiré (ni nom ni résultats) ; les insertions 3 et 4 de la planification des rappels n'ont pas d'assertion dédiée. Reportés |
| I2. Adresse e-mail dans le journal d'audit d'Auth | corrigé (`f420979`, migration `20270119000005`) : purge du journal à la suppression du compte, rétention de 90 jours |
| M1. Mise à jour directe du profil (`onboarding_termine`, `demande_enseignant`) | reporté (demande de passer l'onboarding par une RPC : changement de parcours à concevoir) |
| M2. Droits résiduels sur `niveau`, droits par défaut | corrigé (`f420979`) pour les tables ; reporté pour les fonctions et les séquences (droits par défaut non modifiés) |
| M3. Relais de spam par l'e-mail d'accord | reporté (le CAPTCHA demande le compte du fournisseur de l'utilisateur ; la troncature du prénom n'a pas été faite) |
| M4. `profil.email` jamais mis à jour | corrigé (`f420979`) : déclencheur sur `auth.users` |
| M5. Adresse du parent conservée sans limite | corrigé (`f420979`) : effacée 30 jours après la demande si l'accord n'est pas donné |
| M6. Export incomplet | corrigé (`97d47bd`, `8999fa8`, migration `20270119000006`) |

Reporté aussi : une course très étroite entre la liste des comptes purgés et la suppression du journal (la rétention de 90 jours la rattrape).


Périmètre : branche `etape-6b-matieres` (dernier code), en lecture seule. Migrations `supabase/migrations/*.sql` (état final de chaque fonction, vérifié directement dans la base locale par `pg_get_functiondef`, `pg_policies`, `information_schema.*_privileges`, `pg_constraint`), `src/` (actions serveur, routes, `proxy.ts`, CSP, authentification, e-mails), `scripts/`, `e2e/aide-db.ts`. Les limites acceptées des bilans (`docs/superpowers/plans/*-bilan.md`) ne sont pas reprises, sauf si elles sont plus graves que documenté.

## Résumé

| Gravité | Nombre |
|---|---|
| Critique | 0 |
| Important | 2 |
| Mineur | 6 |

Le socle est solide : RLS activée sur toutes les tables de `public`, schéma `prive` inaccessible aux rôles de l'API, droits par colonne, 100 % des fonctions `security definer` avec `search_path=''` et une garde d'identité ou de rôle, aucune clé de service dans l'application, jetons (accord parental, iCal, code parent) de bonne entropie et stockés en empreinte. Aucune élévation de privilège ni accès croisé entre rôles n'a été trouvé.

Les deux constats importants touchent la protection des mineurs :
1. un élève de moins de 15 ans reste traité hors des cours (classe visible par l'enseignant, notifications, iCal) sans accord parental ou après le retrait de l'accord ;
2. la suppression d'un compte laisse l'adresse e-mail (et l'IP selon la configuration) dans `auth.audit_log_entries`, sans limite de durée.

## Constats

### Important

#### I1. Moins de 15 ans sans accord, ou après retrait de l'accord : données encore partagées avec l'enseignant, rappels et iCal actifs

- **Fichiers** :
  - `supabase/migrations/20261222000004_classes_retour.sql:30` (`rejoindre_classe`, dernière définition) : seules les gardes `role_actuel() = 'eleve'` et `demande_enseignant` ; aucun appel à `prive.consentement_requis`.
  - `supabase/migrations/20261117000004_suivi_enseignant.sql:8` et `:33` (`suivi_classe`, `notes_classe`) : tous les inscrits sont renvoyés, sans filtre sur l'accord ni sur `suppression_imposee`.
  - `supabase/migrations/20261229000003_suivi_parent.sql:88` (`retirer_consentement`) : pose `retire_le` et `suppression_imposee`, mais ne retire ni les inscriptions de classe, ni les abonnements push, ni le jeton iCal.
  - `supabase/migrations/20261215000002_dette_notifications.sql:61` (`prive.planifier_notifications`) : la seule condition sur le profil est `p.role = 'eleve'`.
  - `supabase/migrations/20261201000006_pagination.sql:54` (`calendrier_ical`) : aucune vérification de l'accord.
  - `src/app/(app)/layout.tsx:29` : seul blocage, côté interface (`redirect('/consentement')`), que le commentaire présente lui-même comme non-barrière.
- **Scénarios** :
  1. *Retrait (sans attaquant)* : un parent retire son accord (`retirer_consentement`). Pendant les 30 jours avant la purge, l'enseignant voit toujours le prénom et la progression de l'enfant dans `suivi_classe` et `notes_classe`, et peut les exporter en CSV. La tâche `planifier-notifications` continue de créer des rappels envoyés sur les appareils de l'enfant. Le flux iCal reste servi. Or l'article 7.3 du RGPD exige l'arrêt des traitements fondés sur le consentement retiré : garder les données 30 jours pour une annulation se défend, mais les communiquer à un tiers et notifier l'enfant ne se défend pas.
  2. *Avant l'accord* : un élève de moins de 15 ans, sa session ouverte, appelle directement `POST /rest/v1/rpc/rejoindre_classe` avec le code reçu en classe (la clé anonyme et le jeton de session sont dans le navigateur). Il est inscrit, et l'enseignant reçoit son prénom avant tout accord parental. Il en va de même pour `enregistrer_evenement`, `creer_jeton_ical` et `enregistrer_abonnement_push` : ces traitements ne vérifient que le rôle.
- **Correctif proposé** :
  - dans `rejoindre_classe`, `enregistrer_evenement`, `creer_jeton_ical`, `enregistrer_abonnement_push` et `accepter_plan_revision` : `if prive.consentement_requis(auth.uid()) then raise exception 'consentement_requis'; end if;` ;
  - dans `retirer_consentement` : supprimer les inscriptions de classe (sans noter de départ), les abonnements push et le jeton iCal, ou filtrer `suivi_classe`, `notes_classe`, `questions_ratees_classe`, `planifier_notifications` et `calendrier_ical` sur `not prive.consentement_requis(eleve)` (le filtre est réversible si le retrait est annulé) ;
  - ajouter des tests pgTAP pour les deux cas.
- **Effort** : faible à moyen (une migration qui recopie 5 à 8 corps de fonctions, et des tests).

#### I2. La suppression du compte laisse l'adresse e-mail dans le journal d'audit d'Auth

- **Fichiers** : `supabase/migrations/20261222000005_secrets.sql:195` (corps de la purge, renommée `prive.purges_quotidiennes_5a` par `20261229000003_suivi_parent.sql:167`) : `delete from auth.users u where u.id = any (v_purges);`. Aucune table `auth.*` n'est purgée en plus.
- **Preuve (base locale)** : `auth.audit_log_entries` n'a pas de clé étrangère vers `auth.users`. Sur 1016 lignes, 996 se rapportent à des comptes supprimés, et 684 contiennent une adresse e-mail en clair (`payload->>'actor_username'`, ou `payload->'traits'->>'user_email'` pour `user_deleted`). Le champ `ip_address` est vide en local, mais renseigné en production selon la configuration de GoTrue.
- **Scénario** : un élève de 14 ans supprime son compte, ou un parent retire son accord. Après la purge à J+30, son adresse e-mail, ses dates de connexion et d'inscription (et son IP, si GoTrue la journalise) restent dans la base, sans limite de durée. Elles ne figurent pas non plus dans l'export (`exporter_mes_donnees`). L'effacement n'est donc pas complet (art. 17), et la politique de confidentialité ne mentionne pas de durée de conservation pour ces données.
- **Correctif proposé** :
  - dans `prive.purges_quotidiennes`, avant le `delete from auth.users` : `delete from auth.audit_log_entries where (payload->>'actor_id') = any (v_purges::text[]) or (payload->'traits'->>'user_id') = any (v_purges::text[]);` ;
  - ajouter une rétention glissante : `delete from auth.audit_log_entries where created_at < now() - interval '90 days';` ;
  - en production, sinon, désactiver l'écriture du journal d'audit dans la base (option Auth du projet hébergé) et documenter la durée de conservation des journaux d'Auth et de Vercel (déjà parmi les champs « À compléter » des pages légales) ;
  - vérifier les droits de `postgres` sur `auth.audit_log_entries` dans le projet hébergé.
- **Effort** : faible.

### Mineur

#### M1. Mise à jour directe du profil plus large que nécessaire (`onboarding_termine`, `demande_enseignant`)

- **Fichiers** : `supabase/migrations/20261103000001_socle.sql:178` et `supabase/migrations/20261117000002_role_enseignant.sql:13` donnent `UPDATE` à `authenticated` sur `nom, filiere_id, niveau_code, moins_de_15_ans, onboarding_termine, demande_enseignant, etablissement`. La garde de `devenir_parent` (`20261229000004_deliaison.sql:116`) repose sur `not onboarding_termine`.
- **Scénario** : un élève déjà inscrit envoie `PATCH /rest/v1/profil?id=eq.<lui>` avec `{"onboarding_termine": false}`, puis appelle `rpc/devenir_parent` et devient `parent`, sans nouveau compte (il ne doit avoir ni tentative, ni classe, ni accord, ni cours gratuit, ni lien). Il peut aussi poser `demande_enseignant = true` sans passer par le formulaire. L'impact reste faible : le rôle `parent` n'ouvre aucun cours, et la liaison exige un code ou une adresse confirmée. Mais la règle « l'onboarding se fait une fois » n'est pas tenue par la base.
- **Correctif proposé** : retirer `onboarding_termine` et `demande_enseignant` du `grant update`. Passer l'onboarding élève et enseignant par une RPC `security definer` (comme `devenir_parent`) qui n'accepte `onboarding_termine = true` que si l'onboarding n'est pas terminé.
- **Effort** : moyen (RPC, action `src/app/bienvenue/actions.ts:40-58`, tests).

#### M2. Droits d'écriture résiduels sur `niveau`, et droits par défaut trop larges dans `public`

- **Fichiers** : `supabase/migrations/20261103000001_socle.sql:184` révoque les écritures sur `niveau` pour `anon` seulement. En base : `niveau|{…,authenticated=arwd/postgres}`, avec une seule politique, `SELECT`. `pg_default_acl` pour `postgres` dans `public` : `anon=arwd, authenticated=arwd` sur toute nouvelle table.
- **Scénario** : aujourd'hui, la RLS bloque les écritures sur `niveau` (aucune politique d'écriture), donc rien n'est exploitable. Mais une future table créée sans `enable row level security` serait lisible et modifiable par `anon`, dès la migration appliquée.
- **Correctif proposé** : `revoke insert, update, delete on public.niveau from authenticated;` puis `alter default privileges for role postgres in schema public revoke all on tables from anon, authenticated;` (les `grant` explicites existent déjà table par table). Ajouter un test pgTAP qui vérifie que toutes les tables de `public` ont `relrowsecurity`.
- **Effort** : faible.

#### M3. L'e-mail d'accord parental peut servir de relais de spam avec un texte libre

- **Fichiers** : `src/app/consentement/actions.ts:22-57`, `src/lib/email/modeles.ts:28` et `:44`. Le prénom (`profil.nom`, 2 à 60 caractères, échappé en HTML) est inséré dans le corps, et l'adresse du destinataire est choisie par l'élève.
- **Scénario** : un compte (adresse confirmée en production) se déclare « moins de 15 ans », prend pour prénom `Gagnez 500 € sur exemple.com`, puis envoie l'accord à des adresses tierces. Il peut le faire 5 fois par jour par compte, à 10 minutes d'intervalle, et 3 fois par jour par adresse. Les messages partent du domaine de l'application, et la plupart des messageries rendent `exemple.com` cliquable. Le volume par compte est faible, mais aucun frein global (IP, CAPTCHA) ne limite le nombre de comptes.
- **Correctif proposé** : n'afficher dans l'e-mail que le prénom tronqué au premier mot, sans chiffres ni points (ou ne pas l'afficher du tout). Activer un CAPTCHA (Turnstile ou hCaptcha) à l'inscription en production. Ajouter un plafond global d'envois d'accord par heure.
- **Effort** : faible.

#### M4. `profil.email` n'est jamais mis à jour après un changement d'adresse

- **Fichiers** : `supabase/migrations/20261103000001_socle.sql:96` (`creer_profil`, seul écrivain de `profil.email`, à l'insertion). Il n'existe aucun déclencheur `after update of email on auth.users`.
- **Scénario** : un utilisateur change son adresse avec l'API Auth (`PUT /auth/v1/user`, possible avec sa session même sans écran dédié, et confirmé par les deux adresses). L'ancienne adresse reste dans `profil.email`, affichée à l'administrateur (`demandes_enseignant`, `signalements_admin`) et exportée. C'est une donnée inexacte, conservée sans nécessité (art. 5.1.d). `lier_par_email` n'est pas concerné : il lit `auth.users`.
- **Correctif proposé** : un déclencheur `security definer` sur `auth.users` (`after update of email`) qui recopie l'adresse dans `profil.email`, ou supprimer la colonne et lire `auth.users` dans les RPC d'administration.
- **Effort** : faible.

#### M5. Adresse du parent conservée sans limite quand l'accord n'est jamais donné

- **Fichiers** : `supabase/migrations/20261222000002_consentement.sql:4` (`consentement_parental.email_parent`) ; les purges (`20261229000003_suivi_parent.sql:169`) ne touchent pas aux demandes expirées.
- **Scénario** : un élève saisit l'adresse d'un adulte qui n'ouvre jamais le lien. Au bout de 7 jours, la demande n'est plus utilisable, mais l'adresse de ce tiers, qui n'a pas de compte, reste en base tant que le compte de l'élève existe, potentiellement des années.
- **Correctif proposé** : dans la purge quotidienne, `update public.consentement_parental set email_parent = '[expire]' …` (ou supprimer la ligne) quand `donne_le is null and demande_le < now() - interval '30 days'`. Adapter `email_parent` (contrainte de 3 caractères minimum) ou rendre la colonne nullable.
- **Effort** : faible.

#### M6. Export des données incomplet

- **Fichiers** : `supabase/migrations/20261229000003_suivi_parent.sql:151` (`exporter_mes_donnees`) et le corps hérité `prive.exporter_mes_donnees_5a`.
- **Constat** : l'export n'inclut pas :
  - `prive.deliaison` (déliaisons, côté élève et côté parent) ;
  - l'existence et la date du jeton iCal (`prive.jeton_ical.cree_le`) ;
  - le code parent en cours (`prive.code_parent.expire_le`) ;
  - côté parent, les retraits d'accord qu'il a faits (`consentement_parental.retire_par`) ;
  - les compteurs d'envoi de l'accord (`dernier_envoi_le`, `envois_du_jour`) ;
  - les données d'Auth : fournisseur (Google), dernière connexion, journal d'audit (voir I2).
- **Correctif proposé** : ajouter ces clés à `exporter_mes_donnees` (sans les empreintes), et un test pgTAP sur la liste des clés.
- **Effort** : faible.

## Points vérifiés sans problème

- **RLS et droits** :
  - RLS active sur les 28 tables de `public` ;
  - les 10 tables de `prive` sont inaccessibles (`prive` : `USAGE` réservé à `postgres`) ;
  - lectures limitées par colonne (`question` sans énoncé ni propositions, `tentative_question` sans réponse ni correction, `question_corrige` réservée à l'admin, `consentement_parental` sans empreinte de jeton) ;
  - aucune écriture directe sauf `profil` (voir M1) et la RLS de `storage.objects` (bucket `schemas`, admin seulement, PNG, JPEG et WebP, 2 Mo, sans SVG).
- **Fonctions** :
  - les 120 fonctions de `public` et `prive` ont toutes `search_path=''` ;
  - toutes les fonctions `security definer` exposées vérifient `auth.uid()`, le rôle (`role_actuel`, `exiger_admin`, `est_enseignant_de`, `verifier_lien`) ou un secret ;
  - fonctions exécutables par `anon` : `calendrier_ical`, `lire_demande_consentement` et `donner_consentement` (jeton de 256 bits, empreinte SHA-256), `emettre_jeton_consentement`, `envoi_reserver` et `envoi_terminer` (secret de 32 caractères au moins, comparé par empreinte), et le déclencheur `toucher_modifie_le`, sans effet hors déclencheur ;
  - `configurer_envoi` et `configurer_consentement` sont réservées à `service_role`.
- **Accès croisés** :
  - élève ↔ élève : aucune donnée d'un autre élève lisible ;
  - enseignant → autre classe : `est_enseignant_de` partout, même erreur que pour une classe inexistante ;
  - parent → enfant non relié : `verifier_lien` ;
  - `retirer_consentement` exige un enfant de moins de 15 ans relié, et `annuler_retrait_consentement` exige `retire_par = auth.uid()`.
- **Élévation de privilège** :
  - `role` n'est pas modifiable par l'utilisateur ;
  - `moins_de_15_ans` est verrouillé par `prive.verrouiller_age` une fois renseigné ;
  - `traiter_demande_enseignant` est réservée à l'admin et ne vise que `role = 'eleve'` ;
  - `devenir_parent` refuse tout compte ayant déjà une activité ;
  - le dernier admin ne peut pas être supprimé ;
  - `importer_cours` ne contourne `exiger_admin` que pour `service_role`.
- **Suppression** :
  - toutes les clés étrangères vers `profil` et `auth.users` sont en `ON DELETE CASCADE`, ou en `SET NULL` pour `traite_par`, `retire_par` et `payeur_id` ;
  - la cascade couvre abonnements push, jeton iCal, codes parents, essais, déliaisons, consentement, événements, tentatives et signalements ;
  - aucun objet de stockage n'appartient à un utilisateur ;
  - les compteurs d'envoi par adresse (empreinte) sont purgés chaque jour.
- **XSS** :
  - `nettoyerHtml` (`src/lib/contenu/html.ts`) : liste blanche stricte, `script`, `style` et `foreignObject` coupés en toute casse, schémas `https` et `mailto`, images limitées au bucket `schemas` de l'origine Supabase (URL normalisée), `url()` réduit aux ancres internes, identifiants anti-clobbering ;
  - appliqué au rendu (`ContenuChapitre.tsx`) et à l'enregistrement ;
  - CSP avec nonce et `strict-dynamic`, `object-src 'none'`, `frame-ancestors 'none'`, `base-uri 'self'`.
- **Autres injections** :
  - e-mail : contenu échappé en HTML, lien limité à l'origine du site, destinataire filtré (`,;<>` et espaces) ;
  - CSV : cellules préfixées contre l'injection de formules ;
  - iCal : texte échappé et lignes pliées.
- **Redirections ouvertes** :
  - `cheminSuiteSur` refuse `//`, `\` et les caractères de contrôle ;
  - les autres redirections sont des chemins fixes ou des identifiants validés ;
  - `/auth/callback` et `/auth/confirm` redirigent vers des chemins fixes.
- **CSRF** :
  - les actions serveur bénéficient du contrôle d'origine de Next.js ;
  - les routes GET (`/mes-donnees/export`, export CSV, `/ical`) ne modifient rien et répondent en `no-store` (ou `private` pour l'iCal) ;
  - `POST /api/notifications/envoyer` exige le secret porteur, comparé en temps constant.
- **Secrets** :
  - aucune clé de service dans `src/` ;
  - `ENVOI_SECRET` est rangé dans Vault et lu à l'exécution de la tâche cron ;
  - `CONSENTEMENT_SECRET` est distinct et vérifié par empreinte ;
  - `.env*` est ignoré par git, sauf `.env.example`, qui ne contient aucune valeur ;
  - les scripts et `e2e/aide-db.ts` refusent une base distante, sauf avec un drapeau explicite (`--distant`, `CONFIGURER_PRODUCTION=1`).
- **Freins et énumération** :
  - codes de classe : 10 essais par heure ;
  - codes parent : 5 essais par heure, 31⁸ combinaisons, 48 h ;
  - accord : 10 minutes entre deux envois, 5 par jour, 3 par adresse ;
  - signalements : 20 par jour ;
  - classe d'autrui et classe inexistante renvoient la même erreur ;
  - jetons au format vérifié avant toute requête.
- **Push** : liste blanche des hôtes, en base et en TypeScript, contre la falsification de requête côté serveur.

## Limites de l'audit

- Lecture du code et de la base locale seulement : aucun test d'intrusion dynamique, aucune requête modifiant la base, aucun test lancé.
- Configuration du projet hébergé (Supabase, Vercel) non observée : confirmation d'e-mail, politique de mot de passe, CAPTCHA, journal d'audit d'Auth, schémas exposés et version de Postgres sont supposés conformes à `docs/mise-en-ligne.md`.
- Pas d'`npm audit` (pas de réseau). Versions relevées : `next` 16.4.4, `@supabase/ssr` 0.12.7, `@supabase/supabase-js` 2.118.0, `sanitize-html` 2.18.1, `nodemailer` 10.4.0, `web-push` 4.0.0.
- Le service worker (`public/sw.js`) et le cache hors connexion n'ont été revus que pour la portée du cache (chapitres seulement) ; leurs limites de vie privée sont déjà acceptées (bilan 4a).
- Limites acceptées non reprises : élève qui se crée un compte parent ou saisit sa propre adresse ; jeton d'accord dans le chemin et rejouable ; secret d'envoi visible dans `net.http_request_queue` ; frein global par IP absent pour les codes ; reprise d'un point d'envoi push sur un appareil partagé ; moins de 15 ans dont l'accord est retiré pouvant demander le rôle enseignant ; limite de 4 Mo des actions serveur.
