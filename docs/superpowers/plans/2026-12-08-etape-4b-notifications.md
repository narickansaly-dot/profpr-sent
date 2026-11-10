# Étape 4b : notifications Web Push — plan d'implémentation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal :**
- L'élève reçoit des notifications sur son téléphone ou son ordinateur :
  - rappel avant un événement de son calendrier (10 minutes, 1 heure ou la veille, au choix pour chaque événement) ;
  - échéance d'évaluation qui approche (24 heures avant la date limite fixée par l'enseignant) ;
  - nouvel essai d'évaluation disponible (24 heures après un essai raté) ;
  - séances de révision du jour (le matin à 7 h 30) ;
  - relance après quelques jours sans activité (17 h).
- Il règle chaque type, ses heures de silence (par défaut 22 h – 7 h) et le nombre de jours avant la relance. Pendant le silence, une notification est décalée à la fin de la plage, jamais supprimée.
- L'autorisation est demandée au bon moment : une invitation apparaît dans le calendrier une fois qu'il contient un événement, jamais à l'inscription. Sur iPhone, un guide explique l'ajout à l'écran d'accueil (iOS 16.4 ou plus récent).
- Sans autorisation, les rappels restent visibles dans l'application, sur une page « Rappels » signalée dans l'en-tête.

**Architecture :**
- **Les notifications sont matérialisées en base** dans `notification_planifiee`, avec une clé unique par élève (`rappel:<événement>:<instant>`, `jour:<date>`…). La fonction `prive.planifier_notifications(p_maintenant)` crée les notifications dont l'envoi tombe dans les 15 prochaines minutes (et les 5 dernières, pour rattraper une minute manquée). Elle respecte les types désactivés.
- **Une tâche planifiée Supabase (`pg_cron`) appelle chaque minute** la route Next.js `POST /api/notifications/envoyer` par `pg_net`, avec un secret partagé. La route :
  1. appelle la RPC `envoi_reserver(secret)`, qui planifie puis réserve les notifications arrivées à échéance (verrou de 2 minutes, `for update skip locked`) et renvoie, pour chacune, les heures de silence et les abonnements push de l'élève ;
  2. décide en TypeScript (fonctions pures testées) : décaler pendant le silence, envoyer, réessayer plus tard, abandonner ;
  3. envoie avec la bibliothèque `web-push` (VAPID) ;
  4. renvoie les issues à la RPC `envoi_terminer(secret, …)`, qui met à jour les statuts et supprime les abonnements expirés (404 et 410).
- **Pas de clé de service dans l'application.** Les deux RPC d'envoi sont ouvertes à `anon` mais vérifient le secret : la base n'en garde que l'empreinte SHA-256 (`prive.cle_envoi`). Le secret est aussi dans la commande de la tâche `pg_cron`, que seul `postgres` lit.
- **Abonnement push côté client** : le service worker (déjà enregistré en production) reçoit `push` et `notificationclick`. L'élève active les notifications sur chaque appareil. L'abonnement est enregistré par une RPC ; un même point d'envoi passe au dernier élève qui l'a enregistré (appareil partagé).
- **Liste de rappels dans l'application** : toute notification arrivée à échéance y apparaît, envoyée en push ou non. La page la marque comme lue.

**Tech Stack :** Next.js 16, React 19, TypeScript, Supabase (Postgres 17, plpgsql, pgcrypto, pg_cron, pg_net), `web-push` (Node), Service Worker, Push API, Notifications API, zod 4, Vitest, pgTAP, Playwright.

**Spec :** `docs/superpowers/specs/2026-11-03-app-lycee-design.md`. Sections concernées :
- 2 « Choix techniques » (Web Push VAPID, tâche planifiée chaque minute) ;
- 3 « Calendrier et notifications » (`abonnement_push`, `preferences_notification`, `notification_planifiee`, délai du rappel) et « Sécurité (RLS) » ;
- 7 « Notifications » ;
- 10 « Gestion des erreurs » (réessai de l'envoi) ;
- 11 « Tests » (décalage pendant les heures de silence).

**Découpage de la fin de l'étape 4.** L'étape 4b du plan précédent est coupée en deux :
- **4b (ce plan)** : les notifications, de la base au téléphone.
- **4c (plan suivant)** :
  - en-têtes de sécurité (CSP avec nonce, `frame-ancestors`, HSTS…) et vérification des variables d'environnement au démarrage ;
  - configuration du déploiement (région Vercel en UE, `NEXT_PUBLIC_SITE_URL`, réglages du projet Supabase hébergé) ;
  - revue d'accessibilité de fin d'étape et dette d'accessibilité et de contraste des bilans 1, 2 et 3b ;
  - dette technique listée dans le bilan 4a.

**Branche :** `etape-4b-notifications`, créée depuis `etape-4a-calendrier`. Sa PR vise `etape-4a-calendrier` (PR n° 5), puis `main` quand les PR précédentes sont fusionnées.

## Décisions prises dans ce plan (à valider avec la relecture)

1. **Délai du rappel d'un événement.**
   - Colonne `evenement.delai_rappel_minutes` : `null` (pas de rappel), 10, 60 ou 1440. « La veille » veut dire 24 heures avant.
   - Le rappel se règle dans le formulaire de l'événement, par une RPC à part (`regler_rappel_evenement`), appelée juste après l'enregistrement. Les sessions créées par un planning n'ont pas de rappel au départ.
   - Changer l'heure, la répétition ou le rappel d'un événement supprime ses rappels déjà planifiés et pas encore envoyés. Supprimer l'événement les supprime aussi (clé étrangère en cascade).
2. **Les cinq types**, et leur moment d'envoi (heure de Paris) :
   - `rappel_evenement` : début de l'occurrence moins le délai ;
   - `echeance_proche` : date limite moins 24 heures, pour une classe où l'élève est inscrit, un cours publié, si l'évaluation du cours n'est pas encore validée ;
   - `nouvel_essai` : fin du dernier essai raté plus 24 heures, s'il reste un essai (moins de 3) et que le cours n'est pas validé ;
   - `revision_du_jour` : 7 h 30, s'il y a au moins une séance de type `revision` ce jour-là ;
   - `inactivite` : 17 h, si la dernière activité (dernier début de tentative, sinon l'inscription) date de plus de N jours (3 par défaut), et pas plus d'une relance par période de N jours.
3. **Heures de silence.**
   - Par défaut 22 h – 7 h, réglables. Une plage dont le début égale la fin veut dire « pas de silence ».
   - Le décalage est décidé au moment de l'envoi, en TypeScript (`decalerSilence`), pas à la planification : changer ses heures de silence s'applique aux notifications déjà planifiées.
4. **Envoi et réessai.**
   - Au plus 200 notifications par minute.
   - Un envoi réussi vers au moins un appareil vaut `envoyee`.
   - Un échec temporaire (réseau, 429, 5xx) est réessayé après 1, 2, 4 puis 8 minutes ; au 5e échec, la notification passe à `echec`.
   - Un point d'envoi expiré (404, 410) est supprimé. Si l'élève n'a plus aucun appareil valide, la notification vaut `envoyee` : elle reste dans la liste de rappels.
   - Sans aucun abonnement, la notification vaut aussi `envoyee` (liste de rappels seulement).
5. **Abonnements.**
   - 10 appareils au plus par élève : au-delà, le plus ancien est retiré.
   - Seuls `id`, `appareil` et `cree_le` sont lisibles par l'élève ; les clés ne sortent de la base que vers la route d'envoi.
6. **Invitation.**
   - Dans le calendrier, si l'élève a au moins un événement, aucun appareil enregistré, et que le navigateur n'a ni accordé ni refusé l'autorisation : carte « Active les rappels ». « Plus tard » la masque sur cet appareil (`localStorage`).
   - Sur iPhone hors écran d'accueil, la carte affiche le guide d'installation au lieu du bouton.
   - Le service worker n'est enregistré qu'en production : les notifications ne fonctionnent pas avec `npm run dev`.
7. **Tâche planifiée.**
   - `pg_cron` + `pg_net` dans le projet Supabase. Une fonction `configurer_envoi(url, secret)`, réservée à `service_role`, enregistre l'empreinte du secret et (re)crée la tâche `envoi-notifications`.
   - En local, `npm run db:reset` la configure vers `http://host.docker.internal:3000/api/notifications/envoyer` si `.env.local` contient `ENVOI_SECRET` ; sinon il ne fait rien.
   - Clés VAPID et secret générés par `npm run cles:notifications`, qui les ajoute à `.env.local` sans les afficher.

## Contraintes globales

- Toute l'interface est **en français**. On tutoie l'élève. Les formulations ne sont pas genrées.
- Typographie française : espace insécable (U+00A0) avant « : ; ! ? » dans tout texte visible. **Dans ce plan, les chaînes TypeScript l'écrivent ` `** ; dans le JSX, `&nbsp;`. Les textes produits en SQL évitent ces signes.
- **Écritures sur `abonnement_push`, `preferences_notification`, `notification_planifiee` et `prive.cle_envoi` uniquement par RPC `security definer`.** `authenticated` n'a que `select` (filtré par RLS, et seulement certaines colonnes pour `abonnement_push`) ; `anon` n'a aucun droit sur les tables.
- Chaque fonction exposée :
  - a `set search_path = ''` et des noms qualifiés ;
  - reçoit `revoke execute … from public, anon`, puis `grant execute … to authenticated` ;
  - exceptions : `envoi_reserver` et `envoi_terminer` sont accordées à `anon` (protégées par le secret), `configurer_envoi` seulement à `service_role` ;
  - les helpers vont dans `prive`, avec `revoke execute … from public`.
- Les RPC réservées aux élèves vérifient `public.role_actuel() is distinct from 'eleve'` et lèvent `reserve_eleves`.
- Les codes d'erreur levés par la base sont des mots-clés `snake_case`. Ceux qui peuvent atteindre l'interface sont traduits dans `src/lib/erreurs.ts`, avec un test du texte exact. Aucun nouveau code n'est sous-chaîne d'un code existant, ni l'inverse (`messageErreur` cherche par `includes`).
- Lors d'un `create or replace` sur une fonction existante, on recopie son **corps actuel** depuis la migration la plus récente qui la définit, avec ses attributs actuels, et on n'ajoute que le changement décrit.
- Les fonctions SQL qui renvoient un ensemble lu par l'application ont un ordre total : PostgREST coupe à 1000 lignes (voir `src/lib/supabase/toutesLesLignes.ts`).
- Dates : heure de Paris partout ; on réutilise `jourParis`, `heureParis`, `ajouterJours` (`src/lib/calendrier/dates.ts`) et `heureParisVersIso` (`src/lib/enseignant/dates.ts`). Aucune bibliothèque de dates.
- Commandes shell : préfixer par `export PATH="$HOME/.orbstack/bin:$PATH";`. Ne jamais afficher ni commiter `.env.local`. La clé de service n'est utilisée que dans `scripts/` et dans les aides e2e, derrière la garde « base locale ».
- Après chaque migration : `npm run db:reset`, puis `npx supabase gen types typescript --local > src/lib/supabase/types.ts`.
- Avant d'utiliser une API de Next.js (route handlers), de supabase-js, de `web-push`, de `pg_cron`/`pg_net` ou de la Push API, consulter sa documentation à jour avec **context7**.
- Toute nouvelle page ou tout nouveau composant suit le système visuel existant (`globals.css` : `.carte`, `.bouton`, `.bouton-principal`, `.bouton-secondaire`, `.formulaire`, `.message-erreur`, `.message-info`, `.aide-champ`, `.sr-only`). Les formulaires suivent `FormulaireEcheance` : `useActionState`, `aria-invalid` sur le seul champ en cause, `aria-describedby`, valeurs saisies renvoyées dans l'état. Utilisable à 375 px de large.
- Messages de commit en français, à l'impératif présent, terminés par la ligne `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Hors périmètre

- Tout ce qui est listé pour l'étape 4c ci-dessus.
- Notifications aux enseignants et aux parents.
- Choix du délai de rappel par défaut, et rappels sur les sessions d'un planning au moment de l'acceptation.
- Envoi par e-mail ou SMS.

## Répartition des modèles

| Tâche | Implémentation | Revue |
|---|---|---|
| 1 Schéma et RPC de l'élève | Sonnet | **Opus** |
| 2 Planification et envoi côté base | Sonnet | **Opus** |
| 3 Silence et traitement d'un lot | Haiku (code complet dans le plan) | Sonnet |
| 4 Route d'envoi, web-push et scripts | Sonnet | **Opus** |
| 5 Service worker et abonnement côté client | Sonnet | Sonnet |
| 6 Interface : réglages, invitation, rappels | Sonnet | Sonnet |
| 7 Bout en bout, bilan, revue finale | Sonnet, puis revue finale **Opus** | — |

Les tâches 1 et 2 touchent la base locale partagée : elles s'exécutent l'une après l'autre. La tâche 3 ne touche pas la base.

## Carte des fichiers

| Fichier | Rôle |
|---|---|
| `supabase/migrations/20261208000001_notifications.sql` | types, `evenement.delai_rappel_minutes`, tables `abonnement_push`, `preferences_notification`, `notification_planifiee` ; RPC de l'élève |
| `supabase/migrations/20261208000002_envoi.sql` | `pg_cron`, `pg_net`, `prive.cle_envoi`, `prive.planifier_notifications`, `envoi_reserver`, `envoi_terminer`, `configurer_envoi` |
| `supabase/tests/notifications.test.sql`, `envoi.test.sql` | pgTAP |
| `supabase/tests/rls_socle.test.sql` | exception `anon` étendue aux deux RPC d'envoi |
| `src/lib/notifications/silence.ts` (+ test) | `decalerSilence` |
| `src/lib/notifications/envoi.ts` (+ test) | `traiterLot`, `delaiRelance` |
| `src/lib/notifications/webpush.ts` | envoi réel avec `web-push` |
| `src/app/api/notifications/envoyer/route.ts` | route appelée chaque minute |
| `scripts/cles-notifications.ts`, `scripts/configurer-envoi.ts` | clés VAPID et secret ; configuration de la tâche planifiée |
| `public/sw.js` | événements `push` et `notificationclick`, `VERSION = 'v2'` |
| `src/lib/notifications/client.ts` (+ test) | abonnement côté navigateur, détection iPhone |
| `src/lib/notifications/preferences.ts` (+ test) | lecture du formulaire de réglages |
| `src/app/(app)/notifications/page.tsx`, `actions.ts` | réglages et appareils |
| `src/app/(app)/rappels/page.tsx` | liste des rappels |
| `src/components/notifications/*` | `ActivationPush`, `InvitationRappels`, `GuideIphone`, `FormulairePreferences`, `ListeAppareils` |
| `src/components/calendrier/FormulaireEvenement.tsx`, `src/lib/calendrier/schema-evenement.ts`, `src/app/(app)/calendrier/actions.ts`, `src/app/(app)/calendrier/page.tsx`, `[id]/page.tsx` | champ « Rappel », invitation |
| `src/components/EnTete.tsx`, `src/app/(app)/layout.tsx` | lien « Rappels » et nombre de non lus |
| `src/lib/routes.ts` (+ test) | `/api/notifications` public |
| `e2e/notifications.spec.ts`, `e2e/hors-ligne.spec.ts` | bout en bout ; nom du cache `hors-ligne-v2` |

---

### Task 1 : schéma des notifications et RPC de l'élève

**Files :**
- Create : `supabase/migrations/20261208000001_notifications.sql`
- Create : `supabase/tests/notifications.test.sql`
- Modify : `src/lib/supabase/types.ts` (régénéré)

**Interfaces :**
- Consumes : `public.evenement`, `public.profil`, `public.role_actuel()`, `prive.toucher_modifie_le()` (migrations existantes).
- Produces :
  - types `public.type_notification_t` (`rappel_evenement`, `echeance_proche`, `nouvel_essai`, `revision_du_jour`, `inactivite`) et `public.statut_notification_t` (`en_attente`, `envoyee`, `echec`) ;
  - colonne `evenement.delai_rappel_minutes smallint` (null, 10, 60, 1440) ;
  - tables `public.abonnement_push(id, eleve_id, endpoint, p256dh, auth, appareil, cree_le)`, `public.preferences_notification(eleve_id, rappel_evenement, echeance_proche, nouvel_essai, revision_du_jour, inactivite, silence_debut, silence_fin, jours_inactivite, modifie_le)`, `public.notification_planifiee(id, eleve_id, type, cle, evenement_id, titre, corps, url, envoi_prevu, statut, essais, reserve_jusqu_au, envoyee_le, lue_le, cree_le)` ;
  - RPC : `enregistrer_abonnement_push(p_endpoint text, p_p256dh text, p_auth text, p_appareil text) returns uuid`, `supprimer_abonnement_push(p_id uuid) returns void`, `supprimer_abonnement_push_endpoint(p_endpoint text) returns void`, `enregistrer_preferences_notification(p jsonb) returns void`, `regler_rappel_evenement(p_id uuid, p_delai int) returns void`, `marquer_rappels_lus() returns void` ;
  - codes d'erreur : `abonnement_invalide`, `preferences_invalides`, `rappel_invalide` (plus `reserve_eleves`, `evenement_introuvable` existants).

- [ ] **Step 1 : écrire le test pgTAP**

`supabase/tests/notifications.test.sql` :

```sql
begin;
select plan(16);

insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-0000000000b1', 'eleve-notif@test.local'),
  ('00000000-0000-0000-0000-0000000000b2', 'autre-notif@test.local'),
  ('00000000-0000-0000-0000-0000000000b3', 'prof-notif@test.local');
update public.profil set role = 'enseignant' where id = '00000000-0000-0000-0000-0000000000b3';
insert into public.evenement (id, eleve_id, type, titre, debut, duree_minutes) values
  ('40000000-0000-0000-0000-0000000000b1', '00000000-0000-0000-0000-0000000000b1', 'devoir', 'Devoir notif', '2027-01-12 18:00+01', 60);
insert into public.notification_planifiee (eleve_id, type, cle, evenement_id, titre, corps, url, envoi_prevu) values
  ('00000000-0000-0000-0000-0000000000b1', 'rappel_evenement', 'rappel:test', '40000000-0000-0000-0000-0000000000b1',
   'Devoir notif', 'Dans 1 heure', '/calendrier', '2027-01-12 17:00+01'),
  ('00000000-0000-0000-0000-0000000000b1', 'inactivite', 'inactivite:2020-01-01', null,
   'On reprend', 'Ton dernier quiz date de 3 jours', '/', '2020-01-01 17:00+01');

set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000b3","role":"authenticated"}', true);
select throws_ok($$ select public.enregistrer_abonnement_push('https://push.example/a', repeat('k', 87), repeat('a', 22), 'Test') $$,
  'P0001', 'reserve_eleves', 'un enseignant n''enregistre pas d''appareil');

select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000b1","role":"authenticated"}', true);
select throws_ok($$ select public.enregistrer_abonnement_push('http://push.example/a', repeat('k', 87), repeat('a', 22), 'Test') $$,
  'P0001', 'abonnement_invalide', 'un point d''envoi non https est refusé');
select lives_ok($$ select public.enregistrer_abonnement_push('https://push.example/a', repeat('k', 87), repeat('a', 22), 'Firefox sur Linux') $$,
  'l''élève enregistre un appareil');
select results_eq($$ select appareil from public.abonnement_push $$, $$ values ('Firefox sur Linux') $$,
  'l''élève voit son appareil');
select throws_ok($$ select endpoint from public.abonnement_push $$, '42501', null,
  'le point d''envoi et les clés ne sont pas lisibles');
select throws_ok($$ insert into public.preferences_notification (eleve_id) values ('00000000-0000-0000-0000-0000000000b1') $$,
  '42501', null, 'pas d''écriture directe sur les préférences');
select throws_ok($$ select public.enregistrer_preferences_notification('{"silence_debut":"25:00"}'::jsonb) $$,
  'P0001', 'preferences_invalides', 'une heure invalide est refusée');
select lives_ok($$ select public.enregistrer_preferences_notification(
  '{"rappel_evenement":true,"echeance_proche":false,"nouvel_essai":true,"revision_du_jour":true,"inactivite":false,"silence_debut":"21:30","silence_fin":"07:15","jours_inactivite":5}'::jsonb) $$,
  'l''élève enregistre ses préférences');
select results_eq($$ select echeance_proche, inactivite, silence_debut, silence_fin, jours_inactivite from public.preferences_notification $$,
  $$ values (false, false, '21:30'::time, '07:15'::time, 5::smallint) $$, 'préférences relues');
select throws_ok($$ select public.regler_rappel_evenement('40000000-0000-0000-0000-0000000000b1', 30) $$,
  'P0001', 'rappel_invalide', 'un délai hors liste est refusé');
select lives_ok($$ select public.regler_rappel_evenement('40000000-0000-0000-0000-0000000000b1', 60) $$,
  'l''élève règle le rappel de son événement');
select is((select count(*)::int from public.notification_planifiee where cle = 'rappel:test'), 0,
  'changer le rappel supprime les rappels planifiés non envoyés');
select lives_ok($$ select public.marquer_rappels_lus() $$, 'l''élève marque ses rappels comme lus');
select is((select lue_le is not null from public.notification_planifiee where cle = 'inactivite:2020-01-01'), true,
  'le rappel arrivé à échéance est lu');

select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000b2","role":"authenticated"}', true);
select throws_ok($$ select public.regler_rappel_evenement('40000000-0000-0000-0000-0000000000b1', 10) $$,
  'P0001', 'evenement_introuvable', 'un autre élève ne règle pas ce rappel');
select is((select count(*)::int from public.notification_planifiee), 0, 'un autre élève ne lit pas ces rappels');

select * from finish();
rollback;
```

- [ ] **Step 2 : vérifier que le test échoue**

Run : `export PATH="$HOME/.orbstack/bin:$PATH"; npm run test:db`
Expected : FAIL sur `notifications.test.sql` (type ou fonction inexistant).

- [ ] **Step 3 : écrire la migration**

`supabase/migrations/20261208000001_notifications.sql` :

```sql
-- Notifications : abonnements Web Push, préférences, notifications planifiées, délai du rappel d'un événement.

create type public.type_notification_t as enum ('rappel_evenement', 'echeance_proche', 'nouvel_essai', 'revision_du_jour', 'inactivite');
create type public.statut_notification_t as enum ('en_attente', 'envoyee', 'echec');

-- Délai du rappel avant chaque occurrence : 10 minutes, 1 heure ou la veille (24 heures).
alter table public.evenement add column delai_rappel_minutes smallint
  check (delai_rappel_minutes is null or delai_rappel_minutes in (10, 60, 1440));

create table public.abonnement_push (
  id uuid primary key default gen_random_uuid(),
  eleve_id uuid not null references public.profil on delete cascade,
  endpoint text not null unique check (endpoint ~ '^https://' and char_length(endpoint) <= 1000),
  p256dh text not null check (char_length(p256dh) between 20 and 200),
  auth text not null check (char_length(auth) between 10 and 100),
  appareil text not null default '' check (char_length(appareil) <= 80),
  cree_le timestamptz not null default now()
);
create index abonnement_push_eleve on public.abonnement_push (eleve_id, cree_le);

create table public.preferences_notification (
  eleve_id uuid primary key references public.profil on delete cascade,
  rappel_evenement boolean not null default true,
  echeance_proche boolean not null default true,
  nouvel_essai boolean not null default true,
  revision_du_jour boolean not null default true,
  inactivite boolean not null default true,
  silence_debut time not null default '22:00',
  silence_fin time not null default '07:00',
  jours_inactivite smallint not null default 3 check (jours_inactivite between 1 and 14),
  modifie_le timestamptz not null default now()
);
create trigger modifie_le before update on public.preferences_notification for each row execute function prive.toucher_modifie_le();

create table public.notification_planifiee (
  id uuid primary key default gen_random_uuid(),
  eleve_id uuid not null references public.profil on delete cascade,
  type public.type_notification_t not null,
  cle text not null check (char_length(cle) <= 200),
  -- Rappels d'un événement : supprimés avec lui.
  evenement_id uuid references public.evenement on delete cascade,
  titre text not null check (char_length(titre) between 1 and 120),
  corps text not null check (char_length(corps) <= 240),
  url text not null check (url ~ '^/' and url !~ '^//'),
  envoi_prevu timestamptz not null,
  statut public.statut_notification_t not null default 'en_attente',
  essais smallint not null default 0 check (essais >= 0),
  reserve_jusqu_au timestamptz,
  envoyee_le timestamptz,
  lue_le timestamptz,
  cree_le timestamptz not null default now(),
  unique (eleve_id, cle)
);
create index notification_a_envoyer on public.notification_planifiee (envoi_prevu) where statut = 'en_attente';
create index notification_eleve on public.notification_planifiee (eleve_id, envoi_prevu desc);
create index notification_evenement on public.notification_planifiee (evenement_id) where evenement_id is not null;

alter table public.abonnement_push enable row level security;
alter table public.preferences_notification enable row level security;
alter table public.notification_planifiee enable row level security;
create policy "ses appareils" on public.abonnement_push for select to authenticated using (eleve_id = (select auth.uid()));
create policy "ses préférences" on public.preferences_notification for select to authenticated using (eleve_id = (select auth.uid()));
create policy "ses notifications" on public.notification_planifiee for select to authenticated using (eleve_id = (select auth.uid()));
revoke all on public.abonnement_push, public.preferences_notification, public.notification_planifiee from anon, authenticated;
-- Les clés et le point d'envoi ne sortent de la base que vers la route d'envoi.
grant select (id, eleve_id, appareil, cree_le) on public.abonnement_push to authenticated;
grant select on public.preferences_notification, public.notification_planifiee to authenticated;

-- Changer l'heure, la répétition ou le rappel d'un événement : ses rappels non envoyés sont replanifiés.
create function prive.oublier_rappels_evenement() returns trigger
language plpgsql set search_path = '' as $$
begin
  if (new.debut, new.duree_minutes, new.repetition, new.jours_semaine, new.repeter_jusqu_au, new.delai_rappel_minutes)
     is distinct from (old.debut, old.duree_minutes, old.repetition, old.jours_semaine, old.repeter_jusqu_au, old.delai_rappel_minutes) then
    delete from public.notification_planifiee where evenement_id = new.id and statut = 'en_attente';
  end if;
  return new;
end $$;
revoke execute on function prive.oublier_rappels_evenement() from public;
create trigger oublier_rappels after update on public.evenement for each row execute function prive.oublier_rappels_evenement();

create function public.enregistrer_abonnement_push(p_endpoint text, p_p256dh text, p_auth text, p_appareil text) returns uuid
language plpgsql security definer set search_path = '' as $$
declare
  v_id uuid;
begin
  if public.role_actuel() is distinct from 'eleve' then
    raise exception 'reserve_eleves';
  end if;
  if p_endpoint is null or p_endpoint !~ '^https://' or char_length(p_endpoint) > 1000
     or char_length(coalesce(p_p256dh, '')) not between 20 and 200
     or char_length(coalesce(p_auth, '')) not between 10 and 100 then
    raise exception 'abonnement_invalide';
  end if;
  -- Un même appareil passe au dernier élève qui l'a enregistré (appareil partagé).
  insert into public.abonnement_push (eleve_id, endpoint, p256dh, auth, appareil)
    values (auth.uid(), p_endpoint, p_p256dh, p_auth, left(btrim(coalesce(p_appareil, '')), 80))
  on conflict (endpoint) do update
    set eleve_id = excluded.eleve_id, p256dh = excluded.p256dh, auth = excluded.auth,
        appareil = excluded.appareil, cree_le = now()
  returning id into v_id;
  -- 10 appareils au plus : on retire les plus anciens.
  delete from public.abonnement_push a
   where a.eleve_id = auth.uid()
     and a.id not in (select b.id from public.abonnement_push b where b.eleve_id = auth.uid()
                       order by b.cree_le desc, b.id limit 10);
  return v_id;
end $$;

create function public.supprimer_abonnement_push(p_id uuid) returns void
language plpgsql security definer set search_path = '' as $$
begin
  if public.role_actuel() is distinct from 'eleve' then
    raise exception 'reserve_eleves';
  end if;
  delete from public.abonnement_push where id = p_id and eleve_id = auth.uid();
end $$;

-- Désactivation depuis l'appareil lui-même : le navigateur ne connaît que son point d'envoi.
create function public.supprimer_abonnement_push_endpoint(p_endpoint text) returns void
language plpgsql security definer set search_path = '' as $$
begin
  if public.role_actuel() is distinct from 'eleve' then
    raise exception 'reserve_eleves';
  end if;
  delete from public.abonnement_push where endpoint = p_endpoint and eleve_id = auth.uid();
end $$;

create function public.enregistrer_preferences_notification(p jsonb) returns void
language plpgsql security definer set search_path = '' as $$
declare
  v public.preferences_notification;
begin
  if public.role_actuel() is distinct from 'eleve' then
    raise exception 'reserve_eleves';
  end if;
  begin
    v.rappel_evenement := coalesce((p->>'rappel_evenement')::boolean, true);
    v.echeance_proche := coalesce((p->>'echeance_proche')::boolean, true);
    v.nouvel_essai := coalesce((p->>'nouvel_essai')::boolean, true);
    v.revision_du_jour := coalesce((p->>'revision_du_jour')::boolean, true);
    v.inactivite := coalesce((p->>'inactivite')::boolean, true);
    v.silence_debut := coalesce((p->>'silence_debut')::time, time '22:00');
    v.silence_fin := coalesce((p->>'silence_fin')::time, time '07:00');
    v.jours_inactivite := coalesce((p->>'jours_inactivite')::smallint, 3);
  exception when others then
    raise exception 'preferences_invalides';
  end;
  if (p->>'silence_debut') is not null and (p->>'silence_debut') !~ '^([01][0-9]|2[0-3]):[0-5][0-9]$'
     or (p->>'silence_fin') is not null and (p->>'silence_fin') !~ '^([01][0-9]|2[0-3]):[0-5][0-9]$'
     or v.jours_inactivite not between 1 and 14 then
    raise exception 'preferences_invalides';
  end if;
  insert into public.preferences_notification as pr (eleve_id, rappel_evenement, echeance_proche, nouvel_essai, revision_du_jour,
                                                     inactivite, silence_debut, silence_fin, jours_inactivite)
    values (auth.uid(), v.rappel_evenement, v.echeance_proche, v.nouvel_essai, v.revision_du_jour,
            v.inactivite, v.silence_debut, v.silence_fin, v.jours_inactivite)
  on conflict (eleve_id) do update set
    rappel_evenement = excluded.rappel_evenement, echeance_proche = excluded.echeance_proche,
    nouvel_essai = excluded.nouvel_essai, revision_du_jour = excluded.revision_du_jour,
    inactivite = excluded.inactivite, silence_debut = excluded.silence_debut,
    silence_fin = excluded.silence_fin, jours_inactivite = excluded.jours_inactivite;
  -- Un type désactivé : ses notifications pas encore envoyées disparaissent.
  delete from public.notification_planifiee n
   where n.eleve_id = auth.uid() and n.statut = 'en_attente'
     and ((n.type = 'rappel_evenement' and not v.rappel_evenement)
       or (n.type = 'echeance_proche' and not v.echeance_proche)
       or (n.type = 'nouvel_essai' and not v.nouvel_essai)
       or (n.type = 'revision_du_jour' and not v.revision_du_jour)
       or (n.type = 'inactivite' and not v.inactivite));
end $$;

create function public.regler_rappel_evenement(p_id uuid, p_delai int) returns void
language plpgsql security definer set search_path = '' as $$
begin
  if public.role_actuel() is distinct from 'eleve' then
    raise exception 'reserve_eleves';
  end if;
  if p_delai is not null and p_delai not in (10, 60, 1440) then
    raise exception 'rappel_invalide';
  end if;
  update public.evenement set delai_rappel_minutes = p_delai::smallint
   where id = p_id and eleve_id = auth.uid();
  if not found then
    raise exception 'evenement_introuvable';
  end if;
  -- Le déclencheur ne voit rien si le délai ne change pas : on nettoie ici aussi.
  delete from public.notification_planifiee where evenement_id = p_id and statut = 'en_attente';
end $$;

create function public.marquer_rappels_lus() returns void
language plpgsql security definer set search_path = '' as $$
begin
  if public.role_actuel() is distinct from 'eleve' then
    raise exception 'reserve_eleves';
  end if;
  update public.notification_planifiee set lue_le = now()
   where eleve_id = auth.uid() and lue_le is null and envoi_prevu <= now();
end $$;

revoke execute on function public.enregistrer_abonnement_push(text, text, text, text), public.supprimer_abonnement_push(uuid),
  public.supprimer_abonnement_push_endpoint(text), public.enregistrer_preferences_notification(jsonb),
  public.regler_rappel_evenement(uuid, int), public.marquer_rappels_lus() from public, anon;
grant execute on function public.enregistrer_abonnement_push(text, text, text, text), public.supprimer_abonnement_push(uuid),
  public.supprimer_abonnement_push_endpoint(text), public.enregistrer_preferences_notification(jsonb),
  public.regler_rappel_evenement(uuid, int), public.marquer_rappels_lus() to authenticated;
```

Note : vérifier d'abord le nom exact du helper de trigger `prive.toucher_modifie_le()` (`grep -rn "toucher_modifie_le" supabase/migrations`) et la façon dont le schéma existant retire les droits par défaut sur une nouvelle table (si un `alter default privileges` existe, garder le `revoke all` explicite ci-dessus).

- [ ] **Step 4 : appliquer et vérifier**

Run : `export PATH="$HOME/.orbstack/bin:$PATH"; npm run db:reset && npx supabase gen types typescript --local > src/lib/supabase/types.ts && npm run test:db && npm run typecheck`
Expected : PASS, dont `notifications.test.sql` 16/16, et toute la suite existante.

- [ ] **Step 5 : commit**

```bash
git add supabase/migrations/20261208000001_notifications.sql supabase/tests/notifications.test.sql src/lib/supabase/types.ts
git commit -m "Ajoute les abonnements push, les préférences et les notifications planifiées

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 2 : planification et envoi côté base

**Files :**
- Create : `supabase/migrations/20261208000002_envoi.sql`
- Create : `supabase/tests/envoi.test.sql`
- Modify : `supabase/tests/rls_socle.test.sql` (test « anonyme : aucun EXECUTE », ligne ~93)
- Modify : `src/lib/supabase/types.ts` (régénéré)

**Interfaces :**
- Consumes : tables et types de la tâche 1 ; `prive.occurrences(p_eleve uuid, p_de timestamptz, p_a timestamptz) returns table (evenement_id uuid, debut timestamptz, fin timestamptz)` ; `public.inscription_classe(classe_id, eleve_id)`, `public.echeance_evaluation(classe_id, cours_id, ouverture, limite)`, `public.cours(id, slug, titre, publie)`, `public.progression_cours(eleve_id, cours_id, valide)`, `public.tentative(id, eleve_id, type, cours_id, debut, fin, reussie)`, `public.profil(id, role, inscrit_le)`.
- Produces :
  - `prive.planifier_notifications(p_maintenant timestamptz) returns int` (nombre de notifications créées) ;
  - `public.envoi_reserver(p_secret text, p_limite int default 200) returns table (id uuid, eleve_id uuid, titre text, corps text, url text, envoi_prevu timestamptz, essais smallint, silence_debut time, silence_fin time, abonnements jsonb)` — `abonnements` : tableau `[{endpoint, p256dh, auth}]` ;
  - `public.envoi_terminer(p_secret text, p_resultats jsonb, p_expires text[]) returns void` — `p_resultats` : tableau `[{id, issue: 'envoyee'|'decaler'|'reessayer'|'echec', a?: iso}]` ;
  - `public.configurer_envoi(p_url text, p_secret text) returns void` (service_role) ;
  - codes : `cle_envoi_invalide`, `resultat_invalide`, `configuration_invalide` (côté serveur seulement, non traduits).

- [ ] **Step 1 : écrire le test pgTAP**

`supabase/tests/envoi.test.sql`. L'instant de référence est fixe : mardi 12 janvier 2027, 9 h à Paris (`2027-01-12 09:00+01`). La planification est appelée directement avec cet instant ; les RPC d'envoi utilisent `now()`, donc leurs données sont datées par rapport à `now()`.

```sql
begin;
select plan(17);

insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-0000000000c1', 'eleve-envoi@test.local'),
  ('00000000-0000-0000-0000-0000000000c2', 'sans-pref@test.local'),
  ('00000000-0000-0000-0000-0000000000c3', 'prof-envoi@test.local');
update public.profil set role = 'enseignant' where id = '00000000-0000-0000-0000-0000000000c3';
-- c2 inscrit depuis longtemps, sans aucune activité : relance d'inactivité.
update public.profil set inscrit_le = '2027-01-01 10:00+01' where id = '00000000-0000-0000-0000-0000000000c2';
update public.profil set inscrit_le = '2027-01-11 10:00+01' where id = '00000000-0000-0000-0000-0000000000c1';
insert into public.filiere (id, voie, code, nom) values ('10000000-0000-0000-0000-0000000000c1', 'technologique', 'ENV', 'Filière envoi');
insert into public.cours (id, slug, filiere_id, niveau_code, matiere, titre, publie) values
  ('20000000-0000-0000-0000-0000000000c1', 'cours-envoi', '10000000-0000-0000-0000-0000000000c1', '1re', 'E', 'Cours envoi', true);
insert into public.classe (id, enseignant_id, nom, code) values
  ('60000000-0000-0000-0000-0000000000c1', '00000000-0000-0000-0000-0000000000c3', 'Classe envoi', 'ENVBCD');
insert into public.classe_cours values ('60000000-0000-0000-0000-0000000000c1', '20000000-0000-0000-0000-0000000000c1');
insert into public.inscription_classe (classe_id, eleve_id) values ('60000000-0000-0000-0000-0000000000c1', '00000000-0000-0000-0000-0000000000c1');
-- Date limite le 13 janvier à 9 h 10 : l'alerte tombe le 12 à 9 h 10, dans la fenêtre.
insert into public.echeance_evaluation (classe_id, cours_id, ouverture, limite) values
  ('60000000-0000-0000-0000-0000000000c1', '20000000-0000-0000-0000-0000000000c1', null, '2027-01-13 09:10+01');
insert into public.evenement (id, eleve_id, type, titre, debut, duree_minutes, delai_rappel_minutes) values
  -- Rappel 1 h avant 10 h 05 : 9 h 05, dans la fenêtre.
  ('40000000-0000-0000-0000-0000000000c1', '00000000-0000-0000-0000-0000000000c1', 'devoir', 'Devoir de maths', '2027-01-12 10:05+01', 60, 60),
  -- Rappel 10 min avant 18 h : hors fenêtre.
  ('40000000-0000-0000-0000-0000000000c2', '00000000-0000-0000-0000-0000000000c1', 'revision', 'Révision du soir', '2027-01-12 18:00+01', 30, 10);
-- Un essai d'évaluation raté hier à 9 h 02 : nouvel essai à 9 h 02 aujourd'hui.
insert into public.tentative (eleve_id, type, cours_id, nb_questions, debut, fin, statut, note, reussie) values
  ('00000000-0000-0000-0000-0000000000c1', 'evaluation_cours', '20000000-0000-0000-0000-0000000000c1', 40,
   '2027-01-11 08:00+01', '2027-01-11 09:02+01', 'terminee', 40, false);

-- La base locale peut contenir d'autres comptes (démo, e2e) : chaque assertion ne compte que c1 et c2.
select prive.planifier_notifications('2027-01-12 09:00+01');
select is((select count(*)::int from public.notification_planifiee
            where eleve_id in ('00000000-0000-0000-0000-0000000000c1', '00000000-0000-0000-0000-0000000000c2')), 3,
  'trois notifications à 9 h : rappel, échéance, nouvel essai');
select results_eq(
  $$ select type::text, titre, corps, url, envoi_prevu from public.notification_planifiee
      where eleve_id = '00000000-0000-0000-0000-0000000000c1' order by envoi_prevu $$,
  $$ values ('nouvel_essai', 'Évaluation Cours envoi', 'Tu peux retenter ton évaluation', '/cours/cours-envoi/evaluation', '2027-01-12 09:02+01'::timestamptz),
            ('rappel_evenement', 'Devoir de maths', 'Dans 1 heure', '/calendrier/40000000-0000-0000-0000-0000000000c1', '2027-01-12 09:05+01'::timestamptz),
            ('echeance_proche', 'Évaluation Cours envoi', 'Elle ferme demain à 09 h 10', '/cours/cours-envoi/evaluation', '2027-01-12 09:10+01'::timestamptz) $$,
  'contenu et heure de chaque notification');
select prive.planifier_notifications('2027-01-12 09:01+01');
select is((select count(*)::int from public.notification_planifiee
            where eleve_id in ('00000000-0000-0000-0000-0000000000c1', '00000000-0000-0000-0000-0000000000c2')), 3,
  'une deuxième planification ne crée pas de doublon');

-- 7 h 30 : séance de révision du jour pour c1 (la révision du soir).
select prive.planifier_notifications('2027-01-12 07:20+01');
select is((select count(*)::int from public.notification_planifiee
            where type = 'revision_du_jour' and eleve_id = '00000000-0000-0000-0000-0000000000c1'), 1,
  'révision du jour planifiée le matin');
select results_eq($$ select corps, url from public.notification_planifiee
                    where type = 'revision_du_jour' and eleve_id = '00000000-0000-0000-0000-0000000000c1' $$,
  $$ values ('1 séance prévue aujourd’hui', '/calendrier?vue=jour&date=2027-01-12') $$, 'texte de la révision du jour');

-- 17 h : c2 sans activité depuis 11 jours ; c1 actif hier, pas de relance.
select prive.planifier_notifications('2027-01-12 16:50+01');
select is((select count(*)::int from public.notification_planifiee where type = 'inactivite'
            and eleve_id in ('00000000-0000-0000-0000-0000000000c1', '00000000-0000-0000-0000-0000000000c2')), 1,
  'une seule relance d''inactivité');
select is((select eleve_id from public.notification_planifiee where type = 'inactivite'
            and eleve_id in ('00000000-0000-0000-0000-0000000000c1', '00000000-0000-0000-0000-0000000000c2')),
  '00000000-0000-0000-0000-0000000000c2'::uuid, 'la relance va à l''élève inactif');
select prive.planifier_notifications('2027-01-13 16:50+01');
select is((select count(*)::int from public.notification_planifiee where type = 'inactivite'
            and eleve_id in ('00000000-0000-0000-0000-0000000000c1', '00000000-0000-0000-0000-0000000000c2')), 1,
  'pas de deuxième relance avant 3 jours');

-- Type désactivé : le rappel de 17 h 50 (révision du soir) n'est pas planifié.
insert into public.preferences_notification (eleve_id, rappel_evenement) values ('00000000-0000-0000-0000-0000000000c1', false);
select prive.planifier_notifications('2027-01-12 17:45+01');
select is((select count(*)::int from public.notification_planifiee where evenement_id = '40000000-0000-0000-0000-0000000000c2'), 0,
  'un type désactivé n''est pas planifié');

-- Envoi : une notification due maintenant, un appareil.
delete from public.notification_planifiee;
insert into public.abonnement_push (eleve_id, endpoint, p256dh, auth, appareil) values
  ('00000000-0000-0000-0000-0000000000c1', 'https://push.example/c1', repeat('k', 87), repeat('a', 22), 'Test');
insert into public.notification_planifiee (id, eleve_id, type, cle, titre, corps, url, envoi_prevu) values
  ('50000000-0000-0000-0000-0000000000c1', '00000000-0000-0000-0000-0000000000c1', 'inactivite', 'test:1', 'On reprend', 'Corps', '/', now() - interval '1 minute'),
  ('50000000-0000-0000-0000-0000000000c2', '00000000-0000-0000-0000-0000000000c1', 'inactivite', 'test:2', 'Plus tard', 'Corps', '/', now() + interval '1 hour');
-- Le test écrit directement l'empreinte du secret (transaction annulée à la fin).
insert into prive.cle_envoi (id, empreinte) values (true, extensions.digest(repeat('s', 43), 'sha256'));
-- c1 a désactivé les rappels d'événements plus haut : on remet des préférences par défaut pour le silence.
delete from public.preferences_notification;

set local role anon;
select throws_ok($$ select * from public.envoi_reserver('mauvais-secret') $$, 'P0001', 'cle_envoi_invalide', 'secret refusé');
-- envoi_reserver planifie aussi à l'instant réel : d'autres comptes locaux peuvent sortir, on ne garde que c1.
select results_eq($$ select id, jsonb_array_length(abonnements), silence_debut from public.envoi_reserver(repeat('s', 43))
                    where eleve_id = '00000000-0000-0000-0000-0000000000c1' $$,
  $$ values ('50000000-0000-0000-0000-0000000000c1'::uuid, 1, '22:00'::time) $$,
  'seule la notification due est réservée, avec l''appareil et le silence par défaut');
select is((select count(*)::int from public.envoi_reserver(repeat('s', 43)) where eleve_id = '00000000-0000-0000-0000-0000000000c1'), 0,
  'une notification réservée ne l''est pas deux fois');
select throws_ok($$ select public.envoi_terminer(repeat('s', 43), '[{"id":"50000000-0000-0000-0000-0000000000c1","issue":"perdue"}]'::jsonb, '{}') $$,
  'P0001', 'resultat_invalide', 'une issue inconnue est refusée');
select lives_ok($$ select public.envoi_terminer(repeat('s', 43),
  '[{"id":"50000000-0000-0000-0000-0000000000c1","issue":"envoyee"}]'::jsonb, array['https://push.example/c1']) $$,
  'les issues sont enregistrées');
select throws_ok($$ select count(*) from public.notification_planifiee $$, '42501', null, 'anon ne lit pas les notifications');
reset role;
select results_eq($$ select statut::text, envoyee_le is not null, reserve_jusqu_au is null from public.notification_planifiee
                    where id = '50000000-0000-0000-0000-0000000000c1' $$,
  $$ values ('envoyee', true, true) $$, 'notification marquée envoyée');
select is((select count(*)::int from public.abonnement_push where eleve_id = '00000000-0000-0000-0000-0000000000c1'), 0,
  'le point d''envoi expiré est supprimé');

select * from finish();
rollback;
```

17 assertions. Les dates de 2027 sont fixes : la planification reçoit l'instant en paramètre, elle ne dépend pas de `now()`. Les inscriptions de c1 et c2 sont en 2027, donc dans le futur par rapport à l'instant réel : aucune relance d'inactivité réelle ne les touche pendant la partie « envoi ».

- [ ] **Step 2 : vérifier que le test échoue**

Run : `export PATH="$HOME/.orbstack/bin:$PATH"; npm run test:db`
Expected : FAIL sur `envoi.test.sql` (fonction inexistante).

- [ ] **Step 3 : écrire la migration**

`supabase/migrations/20261208000002_envoi.sql` :

```sql
-- Envoi des notifications : planification, réservation par la route d'envoi, tâche planifiée chaque minute.
-- Vérifier avec context7 la signature de net.http_post (pg_net) et de cron.schedule / cron.unschedule (pg_cron).

create extension if not exists pg_net with schema extensions;
create extension if not exists pg_cron;

-- Empreinte du secret partagé avec la route d'envoi : une seule ligne.
create table prive.cle_envoi (
  id boolean primary key default true check (id),
  empreinte bytea not null
);

create function prive.verifier_cle_envoi(p_secret text) returns void
language plpgsql stable set search_path = '' as $$
begin
  if p_secret is null or not exists (
    select 1 from prive.cle_envoi where empreinte = extensions.digest(p_secret, 'sha256')) then
    raise exception 'cle_envoi_invalide';
  end if;
end $$;

-- Crée les notifications dont l'envoi tombe entre p_maintenant - 5 min et p_maintenant + 15 min.
-- Idempotente : la clé (élève, cle) est unique.
create function prive.planifier_notifications(p_maintenant timestamptz) returns int
language plpgsql set search_path = '' as $$
declare
  v_de constant timestamptz := p_maintenant - interval '5 minutes';
  v_a constant timestamptz := p_maintenant + interval '15 minutes';
  v_jour date := (p_maintenant at time zone 'Europe/Paris')::date;
  v_matin timestamptz := (v_jour + time '07:30') at time zone 'Europe/Paris';
  v_soir timestamptz := (v_jour + time '17:00') at time zone 'Europe/Paris';
  v_debut_jour timestamptz := v_jour::timestamp at time zone 'Europe/Paris';
  v_fin_jour timestamptz := (v_jour + 1)::timestamp at time zone 'Europe/Paris';
  v_total int := 0;
  v_n int;
begin
  -- 1. Rappels avant les occurrences d'événements.
  insert into public.notification_planifiee (eleve_id, type, cle, evenement_id, titre, corps, url, envoi_prevu)
  select e.eleve_id, 'rappel_evenement', 'rappel:' || e.id || ':' || extract(epoch from o.debut)::bigint, e.id,
         left(e.titre, 120),
         case e.delai_rappel_minutes
           when 10 then 'Dans 10 minutes'
           when 60 then 'Dans 1 heure'
           else 'Demain à ' || to_char(o.debut at time zone 'Europe/Paris', 'HH24" h "MI') end,
         '/calendrier/' || e.id,
         o.debut - make_interval(mins => e.delai_rappel_minutes)
    from (select distinct ev.eleve_id from public.evenement ev where ev.delai_rappel_minutes is not null) x
    join public.profil p on p.id = x.eleve_id and p.role = 'eleve'
    left join public.preferences_notification pr on pr.eleve_id = x.eleve_id
    cross join lateral prive.occurrences(x.eleve_id, v_de, v_a + interval '1 day') o
    join public.evenement e on e.id = o.evenement_id and e.delai_rappel_minutes is not null
   where coalesce(pr.rappel_evenement, true)
     and o.debut - make_interval(mins => e.delai_rappel_minutes) >= v_de
     and o.debut - make_interval(mins => e.delai_rappel_minutes) < v_a
  on conflict (eleve_id, cle) do nothing;
  get diagnostics v_n = row_count; v_total := v_total + v_n;

  -- 2. Échéance d'évaluation qui approche : 24 h avant la date limite, cours non validé.
  insert into public.notification_planifiee (eleve_id, type, cle, titre, corps, url, envoi_prevu)
  select i.eleve_id, 'echeance_proche',
         'echeance:' || ee.classe_id || ':' || ee.cours_id || ':' || extract(epoch from ee.limite)::bigint,
         left('Évaluation ' || c.titre, 120),
         'Elle ferme demain à ' || to_char(ee.limite at time zone 'Europe/Paris', 'HH24" h "MI'),
         '/cours/' || c.slug || '/evaluation',
         ee.limite - interval '24 hours'
    from public.inscription_classe i
    join public.profil p on p.id = i.eleve_id and p.role = 'eleve'
    join public.echeance_evaluation ee on ee.classe_id = i.classe_id and ee.limite is not null
    join public.cours c on c.id = ee.cours_id and c.publie
    left join public.progression_cours pc on pc.eleve_id = i.eleve_id and pc.cours_id = ee.cours_id
    left join public.preferences_notification pr on pr.eleve_id = i.eleve_id
   where coalesce(pr.echeance_proche, true)
     and not coalesce(pc.valide, false)
     and ee.limite - interval '24 hours' >= v_de
     and ee.limite - interval '24 hours' < v_a
  on conflict (eleve_id, cle) do nothing;
  get diagnostics v_n = row_count; v_total := v_total + v_n;

  -- 3. Nouvel essai : 24 h après le dernier essai raté, s'il en reste un.
  insert into public.notification_planifiee (eleve_id, type, cle, titre, corps, url, envoi_prevu)
  select t.eleve_id, 'nouvel_essai', 'essai:' || t.id,
         left('Évaluation ' || c.titre, 120), 'Tu peux retenter ton évaluation',
         '/cours/' || c.slug || '/evaluation', t.fin + interval '24 hours'
    from public.tentative t
    join public.profil p on p.id = t.eleve_id and p.role = 'eleve'
    join public.cours c on c.id = t.cours_id and c.publie
    left join public.progression_cours pc on pc.eleve_id = t.eleve_id and pc.cours_id = t.cours_id
    left join public.preferences_notification pr on pr.eleve_id = t.eleve_id
   where t.type = 'evaluation_cours' and t.fin is not null and not coalesce(t.reussie, false)
     and coalesce(pr.nouvel_essai, true)
     and not coalesce(pc.valide, false)
     and t.fin + interval '24 hours' >= v_de
     and t.fin + interval '24 hours' < v_a
     and t.fin = (select max(t2.fin) from public.tentative t2
                   where t2.eleve_id = t.eleve_id and t2.cours_id = t.cours_id and t2.type = 'evaluation_cours')
     and (select count(*) from public.tentative t3
           where t3.eleve_id = t.eleve_id and t3.cours_id = t.cours_id and t3.type = 'evaluation_cours') < 3
  on conflict (eleve_id, cle) do nothing;
  get diagnostics v_n = row_count; v_total := v_total + v_n;

  -- 4. Séances de révision du jour, à 7 h 30.
  if v_matin >= v_de and v_matin < v_a then
    insert into public.notification_planifiee (eleve_id, type, cle, titre, corps, url, envoi_prevu)
    select x.eleve_id, 'revision_du_jour', 'jour:' || v_jour, 'Révisions du jour',
           case when s.n = 1 then '1 séance prévue aujourd’hui' else s.n || ' séances prévues aujourd’hui' end,
           '/calendrier?vue=jour&date=' || v_jour, v_matin
      from (select distinct ev.eleve_id from public.evenement ev where ev.type = 'revision') x
      join public.profil p on p.id = x.eleve_id and p.role = 'eleve'
      left join public.preferences_notification pr on pr.eleve_id = x.eleve_id
      cross join lateral (
        select count(*)::int as n
          from prive.occurrences(x.eleve_id, v_debut_jour, v_fin_jour) o
          join public.evenement e on e.id = o.evenement_id and e.type = 'revision'
         where o.debut >= v_debut_jour and o.debut < v_fin_jour) s
     where coalesce(pr.revision_du_jour, true) and s.n > 0
    on conflict (eleve_id, cle) do nothing;
    get diagnostics v_n = row_count; v_total := v_total + v_n;
  end if;

  -- 5. Relance d'inactivité, à 17 h, au plus une par période de N jours.
  if v_soir >= v_de and v_soir < v_a then
    insert into public.notification_planifiee (eleve_id, type, cle, titre, corps, url, envoi_prevu)
    select p.id, 'inactivite', 'inactivite:' || v_jour, 'On reprend',
           'Une petite révision de 10 minutes, ça te dit', '/', v_soir
      from public.profil p
      left join public.preferences_notification pr on pr.eleve_id = p.id
     where p.role = 'eleve'
       and coalesce(pr.inactivite, true)
       and greatest(p.inscrit_le, (select max(t.debut) from public.tentative t where t.eleve_id = p.id))
           < v_soir - make_interval(days => coalesce(pr.jours_inactivite, 3))
       and not exists (select 1 from public.notification_planifiee n
                        where n.eleve_id = p.id and n.type = 'inactivite'
                          and n.envoi_prevu > v_soir - make_interval(days => coalesce(pr.jours_inactivite, 3)))
    on conflict (eleve_id, cle) do nothing;
    get diagnostics v_n = row_count; v_total := v_total + v_n;
  end if;

  return v_total;
end $$;

create function public.envoi_reserver(p_secret text, p_limite int default 200)
returns table (id uuid, eleve_id uuid, titre text, corps text, url text, envoi_prevu timestamptz, essais smallint,
               silence_debut time, silence_fin time, abonnements jsonb)
language plpgsql security definer set search_path = '' as $$
#variable_conflict use_column
begin
  perform prive.verifier_cle_envoi(p_secret);
  perform prive.planifier_notifications(now());
  return query
  with choisies as (
    select n.id from public.notification_planifiee n
     where n.statut = 'en_attente' and n.envoi_prevu <= now()
       and (n.reserve_jusqu_au is null or n.reserve_jusqu_au < now())
     order by n.envoi_prevu, n.id
     limit least(greatest(coalesce(p_limite, 200), 1), 500)
     for update skip locked
  ), reservees as (
    update public.notification_planifiee n set reserve_jusqu_au = now() + interval '2 minutes'
      from choisies c where n.id = c.id
    returning n.id, n.eleve_id, n.titre, n.corps, n.url, n.envoi_prevu, n.essais
  )
  select r.id, r.eleve_id, r.titre, r.corps, r.url, r.envoi_prevu, r.essais,
         coalesce(pr.silence_debut, time '22:00'), coalesce(pr.silence_fin, time '07:00'),
         coalesce((select jsonb_agg(jsonb_build_object('endpoint', a.endpoint, 'p256dh', a.p256dh, 'auth', a.auth) order by a.cree_le)
                     from public.abonnement_push a where a.eleve_id = r.eleve_id), '[]'::jsonb)
    from reservees r
    left join public.preferences_notification pr on pr.eleve_id = r.eleve_id
   order by r.envoi_prevu, r.id;
end $$;

create function public.envoi_terminer(p_secret text, p_resultats jsonb, p_expires text[]) returns void
language plpgsql security definer set search_path = '' as $$
declare
  r jsonb;
  v_issue text;
begin
  perform prive.verifier_cle_envoi(p_secret);
  for r in select * from jsonb_array_elements(coalesce(p_resultats, '[]'::jsonb)) loop
    v_issue := r->>'issue';
    if v_issue is null or v_issue not in ('envoyee', 'decaler', 'reessayer', 'echec')
       or (v_issue in ('decaler', 'reessayer') and (r->>'a') is null) then
      raise exception 'resultat_invalide';
    end if;
    update public.notification_planifiee n set
      statut = case v_issue when 'envoyee' then 'envoyee'::public.statut_notification_t
                            when 'echec' then 'echec'::public.statut_notification_t
                            else 'en_attente'::public.statut_notification_t end,
      envoyee_le = case when v_issue = 'envoyee' then now() else n.envoyee_le end,
      envoi_prevu = case when v_issue in ('decaler', 'reessayer') then (r->>'a')::timestamptz else n.envoi_prevu end,
      essais = n.essais + case when v_issue in ('reessayer', 'echec') then 1 else 0 end,
      reserve_jusqu_au = null
     where n.id = (r->>'id')::uuid and n.statut = 'en_attente';
  end loop;
  delete from public.abonnement_push where endpoint = any (coalesce(p_expires, '{}'::text[]));
end $$;

-- Réservée à service_role (scripts/configurer-envoi.ts) : enregistre l'empreinte du secret et (re)crée la tâche.
create function public.configurer_envoi(p_url text, p_secret text) returns void
language plpgsql security definer set search_path = '' as $$
begin
  if p_url is null or p_url !~ '^https?://[^ ]+$' or char_length(coalesce(p_secret, '')) < 32 then
    raise exception 'configuration_invalide';
  end if;
  insert into prive.cle_envoi (id, empreinte) values (true, extensions.digest(p_secret, 'sha256'))
  on conflict (id) do update set empreinte = excluded.empreinte;
  perform cron.unschedule(j.jobid) from cron.job j where j.jobname = 'envoi-notifications';
  perform cron.schedule('envoi-notifications', '* * * * *', format(
    $c$select net.http_post(url := %L, body := '{}'::jsonb, headers := jsonb_build_object('Authorization', %L, 'Content-Type', 'application/json'), timeout_milliseconds := 50000)$c$,
    p_url, 'Bearer ' || p_secret));
end $$;

revoke execute on function prive.verifier_cle_envoi(text), prive.planifier_notifications(timestamptz) from public;
revoke execute on function public.envoi_reserver(text, int), public.envoi_terminer(text, jsonb, text[]) from public, authenticated;
grant execute on function public.envoi_reserver(text, int), public.envoi_terminer(text, jsonb, text[]) to anon;
revoke execute on function public.configurer_envoi(text, text) from public, anon, authenticated;
grant execute on function public.configurer_envoi(text, text) to service_role;
```

Points à vérifier par l'exécutant avant d'écrire (context7 et base locale) :
- `create extension pg_cron` fonctionne dans la base locale Supabase (sinon, l'activer comme le recommande la documentation Supabase, par exemple dans `config.toml`) ;
- la signature de `net.http_post` (`url`, `body`, `params`, `headers`, `timeout_milliseconds`) ;
- qu'une fonction `security definer` appartenant à `postgres` peut appeler `cron.schedule` ;
- `prive.occurrences` est `stable` et accessible au propriétaire de `planifier_notifications`.

`supabase/tests/rls_socle.test.sql`, test « anonyme : aucun EXECUTE » : remplacer `p.proname <> 'calendrier_ical'` par `p.proname not in ('calendrier_ical', 'envoi_reserver', 'envoi_terminer')` et compléter le libellé : `(sauf calendrier_ical, ouverte par jeton, et les RPC d'envoi, protégées par secret)`.

- [ ] **Step 4 : appliquer et vérifier**

Run : `export PATH="$HOME/.orbstack/bin:$PATH"; npm run db:reset && npx supabase gen types typescript --local > src/lib/supabase/types.ts && npm run test:db && npm run typecheck`
Expected : PASS, dont `envoi.test.sql` 17/17 et `rls_socle.test.sql`.

- [ ] **Step 5 : commit**

```bash
git add supabase/migrations/20261208000002_envoi.sql supabase/tests/envoi.test.sql supabase/tests/rls_socle.test.sql src/lib/supabase/types.ts
git commit -m "Planifie les notifications et ouvre leur envoi à la tâche planifiée

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---
### Task 3 : heures de silence et traitement d'un lot

**Files :**
- Create : `src/lib/notifications/silence.ts`, `src/lib/notifications/silence.test.ts`
- Create : `src/lib/notifications/envoi.ts`, `src/lib/notifications/envoi.test.ts`

**Interfaces :**
- Consumes : `jourParis(instant: Date): string`, `heureParis(iso: string): string` (`HH:MM`), `ajouterJours(jour: string, n: number): string` de `src/lib/calendrier/dates.ts` ; `heureParisVersIso(valeur: string): string | null` (valeur `AAAA-MM-JJTHH:MM`) de `src/lib/enseignant/dates.ts`.
- Produces :
  - `type Silence = { debut: string; fin: string }` (`HH:MM` ou `HH:MM:SS`) ;
  - `decalerSilence(instant: Date, silence: Silence): Date` ;
  - `type Abonnement = { endpoint: string; p256dh: string; auth: string }` ;
  - `type LigneEnvoi = { id: string; eleve_id: string; titre: string; corps: string; url: string; envoi_prevu: string; essais: number; silence_debut: string; silence_fin: string; abonnements: Abonnement[] }` ;
  - `type IssueEnvoi = { ok: true } | { ok: false; expire: boolean; temporaire: boolean }` ;
  - `type Envoyer = (abonnement: Abonnement, charge: string) => Promise<IssueEnvoi>` ;
  - `type Resultat = { id: string; issue: 'envoyee' | 'decaler' | 'reessayer' | 'echec'; a?: string }` ;
  - `MAX_ESSAIS = 5`, `delaiRelance(essais: number): number` (minutes) ;
  - `traiterLot(lignes: LigneEnvoi[], envoyer: Envoyer, maintenant: Date): Promise<{ resultats: Resultat[]; expires: string[] }>`.

- [ ] **Step 1 : écrire les tests**

`src/lib/notifications/silence.test.ts` :

```ts
import { describe, expect, it } from 'vitest';
import { decalerSilence } from './silence';

const nuit = { debut: '22:00', fin: '07:00' };

describe('decalerSilence', () => {
  it('laisse passer une heure hors silence', () => {
    const midi = new Date('2026-12-10T11:00:00Z'); // 12 h à Paris
    expect(decalerSilence(midi, nuit)).toEqual(midi);
  });
  it('décale une notification du soir au lendemain 7 h', () => {
    expect(decalerSilence(new Date('2026-12-10T22:00:00Z'), nuit).toISOString()).toBe('2026-12-11T06:00:00.000Z');
  });
  it('décale une notification de la nuit au matin du même jour', () => {
    expect(decalerSilence(new Date('2026-12-11T04:00:00Z'), nuit).toISOString()).toBe('2026-12-11T06:00:00.000Z');
  });
  it('le début de la plage est silencieux, la fin ne l’est pas', () => {
    expect(decalerSilence(new Date('2026-12-10T21:00:00Z'), nuit).toISOString()).toBe('2026-12-11T06:00:00.000Z');
    const septHeures = new Date('2026-12-11T06:00:00Z');
    expect(decalerSilence(septHeures, nuit)).toEqual(septHeures);
  });
  it('gère une plage dans la journée', () => {
    const plage = { debut: '13:00', fin: '14:00' };
    expect(decalerSilence(new Date('2026-12-10T12:30:00Z'), plage).toISOString()).toBe('2026-12-10T13:00:00.000Z');
  });
  it('une plage vide ne décale rien', () => {
    const t = new Date('2026-12-10T23:00:00Z');
    expect(decalerSilence(t, { debut: '00:00', fin: '00:00' })).toEqual(t);
  });
  it('accepte les heures renvoyées par la base (HH:MM:SS)', () => {
    expect(decalerSilence(new Date('2026-12-10T22:00:00Z'), { debut: '22:00:00', fin: '07:00:00' }).toISOString())
      .toBe('2026-12-11T06:00:00.000Z');
  });
  it('tient compte du passage à l’heure d’été', () => {
    // Samedi 27 mars 2027, 23 h 30 à Paris → dimanche 28 mars, 7 h (heure d’été, UTC+2).
    expect(decalerSilence(new Date('2027-03-27T22:30:00Z'), nuit).toISOString()).toBe('2027-03-28T05:00:00.000Z');
  });
});
```

`src/lib/notifications/envoi.test.ts` :

```ts
import { describe, expect, it, vi } from 'vitest';
import { delaiRelance, MAX_ESSAIS, traiterLot, type Envoyer, type LigneEnvoi } from './envoi';

const maintenant = new Date('2026-12-10T12:00:00Z'); // 13 h à Paris
const abo = (n: number) => ({ endpoint: `https://push.example/${n}`, p256dh: 'p'.repeat(87), auth: 'a'.repeat(22) });
const ligne = (autres: Partial<LigneEnvoi> = {}): LigneEnvoi => ({
  id: 'n1', eleve_id: 'e1', titre: 'Devoir', corps: 'Dans 1 heure', url: '/calendrier', envoi_prevu: '2026-12-10T11:59:00Z',
  essais: 0, silence_debut: '22:00:00', silence_fin: '07:00:00', abonnements: [abo(1)], ...autres,
});
const ok: Envoyer = async () => ({ ok: true });

describe('delaiRelance', () => {
  it('double à chaque essai', () => {
    expect([0, 1, 2, 3].map(delaiRelance)).toEqual([1, 2, 4, 8]);
    expect(MAX_ESSAIS).toBe(5);
  });
});

describe('traiterLot', () => {
  it('envoie et passe la notification à envoyée, avec une charge complète', async () => {
    const envoyer = vi.fn(ok);
    const r = await traiterLot([ligne()], envoyer, maintenant);
    expect(r).toEqual({ resultats: [{ id: 'n1', issue: 'envoyee' }], expires: [] });
    expect(JSON.parse(envoyer.mock.calls[0][1])).toEqual({ id: 'n1', titre: 'Devoir', corps: 'Dans 1 heure', url: '/calendrier' });
  });
  it('décale pendant les heures de silence sans rien envoyer', async () => {
    const envoyer = vi.fn(ok);
    const nuit = new Date('2026-12-10T22:30:00Z');
    const r = await traiterLot([ligne()], envoyer, nuit);
    expect(r.resultats).toEqual([{ id: 'n1', issue: 'decaler', a: '2026-12-11T06:00:00.000Z' }]);
    expect(envoyer).not.toHaveBeenCalled();
  });
  it('sans appareil, la notification reste dans la liste de rappels', async () => {
    const envoyer = vi.fn(ok);
    const r = await traiterLot([ligne({ abonnements: [] })], envoyer, maintenant);
    expect(r.resultats).toEqual([{ id: 'n1', issue: 'envoyee' }]);
    expect(envoyer).not.toHaveBeenCalled();
  });
  it('un appareil qui répond suffit, l’appareil expiré est signalé', async () => {
    const envoyer: Envoyer = async (a) => (a.endpoint.endsWith('/1') ? { ok: false, expire: true, temporaire: false } : { ok: true });
    const r = await traiterLot([ligne({ abonnements: [abo(1), abo(2)] })], envoyer, maintenant);
    expect(r).toEqual({ resultats: [{ id: 'n1', issue: 'envoyee' }], expires: ['https://push.example/1'] });
  });
  it('tous les appareils expirés : envoyée (liste de rappels), appareils retirés', async () => {
    const envoyer: Envoyer = async () => ({ ok: false, expire: true, temporaire: false });
    const r = await traiterLot([ligne()], envoyer, maintenant);
    expect(r).toEqual({ resultats: [{ id: 'n1', issue: 'envoyee' }], expires: ['https://push.example/1'] });
  });
  it('échec temporaire : nouvel essai plus tard', async () => {
    const envoyer: Envoyer = async () => ({ ok: false, expire: false, temporaire: true });
    const r = await traiterLot([ligne({ essais: 2 })], envoyer, maintenant);
    expect(r.resultats).toEqual([{ id: 'n1', issue: 'reessayer', a: '2026-12-10T12:04:00.000Z' }]);
  });
  it('échec temporaire au dernier essai : échec', async () => {
    const envoyer: Envoyer = async () => ({ ok: false, expire: false, temporaire: true });
    const r = await traiterLot([ligne({ essais: MAX_ESSAIS - 1 })], envoyer, maintenant);
    expect(r.resultats).toEqual([{ id: 'n1', issue: 'echec' }]);
  });
  it('échec définitif : échec', async () => {
    const envoyer: Envoyer = async () => ({ ok: false, expire: false, temporaire: false });
    const r = await traiterLot([ligne()], envoyer, maintenant);
    expect(r.resultats).toEqual([{ id: 'n1', issue: 'echec' }]);
  });
  it('une exception de l’envoyeur compte comme un échec temporaire', async () => {
    const envoyer: Envoyer = async () => { throw new Error('réseau'); };
    const r = await traiterLot([ligne()], envoyer, maintenant);
    expect(r.resultats).toEqual([{ id: 'n1', issue: 'reessayer', a: '2026-12-10T12:01:00.000Z' }]);
  });
});
```

- [ ] **Step 2 : vérifier que les tests échouent**

Run : `npx vitest run src/lib/notifications`
Expected : FAIL (« Cannot find module './silence' » et « './envoi' »).

- [ ] **Step 3 : écrire le code**

`src/lib/notifications/silence.ts` :

```ts
import { ajouterJours, heureParis, jourParis } from '@/lib/calendrier/dates';
import { heureParisVersIso } from '@/lib/enseignant/dates';

/** Plage de silence, à l'heure de Paris (`HH:MM` ou `HH:MM:SS`). Début égal à la fin : pas de silence. */
export type Silence = { debut: string; fin: string };

const minutes = (heure: string) => {
  const [h, m] = heure.slice(0, 5).split(':').map(Number);
  return h * 60 + m;
};

/**
 * Une notification qui tombe pendant le silence est décalée à la fin de la plage, jamais supprimée.
 * Le début de la plage est silencieux, la fin ne l'est pas.
 */
export function decalerSilence(instant: Date, silence: Silence): Date {
  const debut = minutes(silence.debut);
  const fin = minutes(silence.fin);
  if (debut === fin) return instant;
  const m = minutes(heureParis(instant.toISOString()));
  const dedans = debut < fin ? m >= debut && m < fin : m >= debut || m < fin;
  if (!dedans) return instant;
  const jour = jourParis(instant);
  // Plage à cheval sur minuit, notification avant minuit : la fin est le lendemain.
  const jourFin = debut > fin && m >= debut ? ajouterJours(jour, 1) : jour;
  const iso = heureParisVersIso(`${jourFin}T${silence.fin.slice(0, 5)}`);
  return iso ? new Date(iso) : instant;
}
```

`src/lib/notifications/envoi.ts` :

```ts
import { decalerSilence } from './silence';

export type Abonnement = { endpoint: string; p256dh: string; auth: string };
/** Une ligne renvoyée par la RPC `envoi_reserver`. */
export type LigneEnvoi = {
  id: string; eleve_id: string; titre: string; corps: string; url: string; envoi_prevu: string; essais: number;
  silence_debut: string; silence_fin: string; abonnements: Abonnement[];
};
export type IssueEnvoi = { ok: true } | { ok: false; expire: boolean; temporaire: boolean };
export type Envoyer = (abonnement: Abonnement, charge: string) => Promise<IssueEnvoi>;
export type Resultat = { id: string; issue: 'envoyee' | 'decaler' | 'reessayer' | 'echec'; a?: string };

export const MAX_ESSAIS = 5;

/** Attente avant un nouvel essai, en minutes : 1, 2, 4, 8. */
export function delaiRelance(essais: number): number {
  return 2 ** essais;
}

async function envoyerSansException(envoyer: Envoyer, a: Abonnement, charge: string): Promise<IssueEnvoi> {
  try {
    return await envoyer(a, charge);
  } catch {
    return { ok: false, expire: false, temporaire: true };
  }
}

/** Décide du sort de chaque notification réservée : décaler, envoyer, réessayer ou abandonner. */
export async function traiterLot(
  lignes: LigneEnvoi[], envoyer: Envoyer, maintenant: Date,
): Promise<{ resultats: Resultat[]; expires: string[] }> {
  const resultats: Resultat[] = [];
  const expires: string[] = [];
  for (const l of lignes) {
    const apresSilence = decalerSilence(maintenant, { debut: l.silence_debut, fin: l.silence_fin });
    if (apresSilence.getTime() > maintenant.getTime()) {
      resultats.push({ id: l.id, issue: 'decaler', a: apresSilence.toISOString() });
      continue;
    }
    if (l.abonnements.length === 0) {
      resultats.push({ id: l.id, issue: 'envoyee' });
      continue;
    }
    const charge = JSON.stringify({ id: l.id, titre: l.titre, corps: l.corps, url: l.url });
    const issues = await Promise.all(l.abonnements.map((a) => envoyerSansException(envoyer, a, charge)));
    issues.forEach((issue, i) => { if (!issue.ok && issue.expire) expires.push(l.abonnements[i].endpoint); });
    const echecs = issues.filter((i): i is Extract<IssueEnvoi, { ok: false }> => !i.ok);
    if (echecs.length < issues.length || echecs.every((e) => e.expire)) {
      resultats.push({ id: l.id, issue: 'envoyee' });
    } else if (echecs.some((e) => e.temporaire) && l.essais + 1 < MAX_ESSAIS) {
      const a = new Date(maintenant.getTime() + delaiRelance(l.essais) * 60_000).toISOString();
      resultats.push({ id: l.id, issue: 'reessayer', a });
    } else {
      resultats.push({ id: l.id, issue: 'echec' });
    }
  }
  return { resultats, expires };
}
```

- [ ] **Step 4 : vérifier que les tests passent**

Run : `npx vitest run src/lib/notifications && npm run typecheck && npm run lint`
Expected : PASS (8 + 10 tests).

- [ ] **Step 5 : commit**

```bash
git add src/lib/notifications/silence.ts src/lib/notifications/silence.test.ts src/lib/notifications/envoi.ts src/lib/notifications/envoi.test.ts
git commit -m "Ajoute le décalage pendant les heures de silence et le traitement d'un lot d'envoi

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 4 : route d'envoi, web-push et scripts

**Files :**
- Create : `src/lib/notifications/webpush.ts`
- Create : `src/lib/notifications/secret.ts`, `src/lib/notifications/secret.test.ts`
- Create : `src/app/api/notifications/envoyer/route.ts`
- Create : `scripts/cles-notifications.ts`, `scripts/configurer-envoi.ts`
- Modify : `package.json` (dépendances `web-push`, `@types/web-push` ; scripts `cles:notifications`, `configurer:envoi`, `db:reset`)
- Modify : `.env.example`
- Modify : `src/lib/routes.ts`, `src/lib/routes.test.ts`

**Interfaces :**
- Consumes : `traiterLot`, `Envoyer`, `LigneEnvoi` (tâche 3) ; RPC `envoi_reserver(p_secret, p_limite)`, `envoi_terminer(p_secret, p_resultats, p_expires)`, `configurer_envoi(p_url, p_secret)` (tâche 2) ; `ROUTES_PUBLIQUES` de `src/lib/routes.ts`.
- Produces :
  - `secretValide(recu: string | null, attendu: string | undefined): boolean` ;
  - `creerEnvoyeur(): Envoyer` ;
  - `POST /api/notifications/envoyer` : 401 sans le bon secret ; 503 si la base ne répond pas ; sinon `{ traitees: number }` ;
  - variables d'environnement : `NEXT_PUBLIC_VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_SUJET`, `ENVOI_SECRET`, `ENVOI_URL` (adresse appelée par la tâche planifiée).

- [ ] **Step 1 : installer web-push et consulter sa documentation**

Run : `npm install web-push && npm install -D @types/web-push`

Consulter avec context7 la documentation de `web-push` (`setVapidDetails`, `sendNotification`, `WebPushError.statusCode`, `generateVAPIDKeys`) et des route handlers de Next.js 16 (`export async function POST(request: Request)`, `export const dynamic`).

- [ ] **Step 2 : écrire les tests du secret et des routes publiques**

`src/lib/notifications/secret.test.ts` :

```ts
import { describe, expect, it } from 'vitest';
import { secretValide } from './secret';

const s = 'x'.repeat(43);

describe('secretValide', () => {
  it('accepte le bon secret', () => expect(secretValide(`Bearer ${s}`, s)).toBe(true));
  it('refuse un secret faux ou de longueur différente', () => {
    expect(secretValide(`Bearer ${'y'.repeat(43)}`, s)).toBe(false);
    expect(secretValide('Bearer court', s)).toBe(false);
  });
  it('refuse sans en-tête ou sans secret configuré', () => {
    expect(secretValide(null, s)).toBe(false);
    expect(secretValide(`Bearer ${s}`, undefined)).toBe(false);
    expect(secretValide('Bearer ', '')).toBe(false);
  });
  it('refuse un secret configuré trop court', () => expect(secretValide('Bearer abc', 'abc')).toBe(false));
});
```

`src/lib/routes.test.ts` : ajouter dans le `describe` de `redirectionPour` :

```ts
  it('laisse la tâche planifiée appeler la route d’envoi sans session', () => {
    expect(redirectionPour('/api/notifications/envoyer', false)).toBeNull();
  });
```

Run : `npx vitest run src/lib/notifications/secret.test.ts src/lib/routes.test.ts`
Expected : FAIL (module `./secret` absent ; la route redirige vers `/connexion`).

- [ ] **Step 3 : écrire le code**

`src/lib/notifications/secret.ts` :

```ts
import { timingSafeEqual } from 'node:crypto';

/** Compare l'en-tête `Authorization: Bearer <secret>` au secret attendu, en temps constant. */
export function secretValide(recu: string | null, attendu: string | undefined): boolean {
  if (!attendu || attendu.length < 32 || !recu?.startsWith('Bearer ')) return false;
  const a = Buffer.from(recu.slice('Bearer '.length));
  const b = Buffer.from(attendu);
  return a.length === b.length && timingSafeEqual(a, b);
}
```

`src/lib/notifications/webpush.ts` :

```ts
import webpush from 'web-push';
import type { Envoyer } from './envoi';

/** Envoi réel (serveur seulement) : clés VAPID lues dans l'environnement. */
export function creerEnvoyeur(): Envoyer {
  webpush.setVapidDetails(process.env.VAPID_SUJET!, process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!, process.env.VAPID_PRIVATE_KEY!);
  return async (a, charge) => {
    try {
      await webpush.sendNotification({ endpoint: a.endpoint, keys: { p256dh: a.p256dh, auth: a.auth } }, charge,
        { TTL: 60 * 60, urgency: 'normal' });
      return { ok: true };
    } catch (e) {
      const statut = (e as { statusCode?: number }).statusCode;
      return {
        ok: false,
        expire: statut === 404 || statut === 410,
        temporaire: statut === undefined || statut === 429 || statut >= 500,
      };
    }
  };
}
```

`src/app/api/notifications/envoyer/route.ts` :

```ts
import { createClient } from '@supabase/supabase-js';
import type { Database, Json } from '@/lib/supabase/types';
import { secretValide } from '@/lib/notifications/secret';
import { traiterLot, type LigneEnvoi } from '@/lib/notifications/envoi';
import { creerEnvoyeur } from '@/lib/notifications/webpush';

export const dynamic = 'force-dynamic';

/** Appelée chaque minute par la tâche planifiée de Supabase (pg_cron + pg_net). */
export async function POST(request: Request) {
  const secret = process.env.ENVOI_SECRET;
  if (!secretValide(request.headers.get('authorization'), secret)) {
    return new Response('Non autorisé', { status: 401 });
  }
  // Client anonyme : les RPC d'envoi vérifient elles-mêmes le secret. Pas de clé de service ici.
  const supabase = createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const reserve = await supabase.rpc('envoi_reserver', { p_secret: secret!, p_limite: 200 });
  if (reserve.error) {
    console.error('envoi_reserver', reserve.error.message);
    return new Response('Service indisponible', { status: 503 });
  }
  const lignes = (reserve.data ?? []) as unknown as LigneEnvoi[];
  if (lignes.length === 0) return Response.json({ traitees: 0 });
  const { resultats, expires } = await traiterLot(lignes, creerEnvoyeur(), new Date());
  const fin = await supabase.rpc('envoi_terminer', {
    p_secret: secret!, p_resultats: resultats as unknown as Json, p_expires: expires,
  });
  if (fin.error) {
    // Les notifications restent réservées 2 minutes, puis repartent : rien n'est perdu.
    console.error('envoi_terminer', fin.error.message);
    return new Response('Service indisponible', { status: 503 });
  }
  return Response.json({ traitees: resultats.length });
}
```

`src/lib/routes.ts` : ajouter `'/api/notifications'` à `ROUTES_PUBLIQUES` (la route vérifie son secret elle-même).

`scripts/cles-notifications.ts` :

```ts
// Ajoute à .env.local les clés VAPID et le secret d'envoi s'ils manquent, sans jamais les afficher.
import { appendFileSync, existsSync, readFileSync } from 'node:fs';
import { randomBytes } from 'node:crypto';
import webpush from 'web-push';

const FICHIER = '.env.local';
const contenu = existsSync(FICHIER) ? readFileSync(FICHIER, 'utf8') : '';
const present = (cle: string) => new RegExp(`^${cle}=.+$`, 'm').test(contenu);

const ajouts: string[] = [];
if (!present('NEXT_PUBLIC_VAPID_PUBLIC_KEY') || !present('VAPID_PRIVATE_KEY')) {
  const cles = webpush.generateVAPIDKeys();
  ajouts.push(`NEXT_PUBLIC_VAPID_PUBLIC_KEY=${cles.publicKey}`, `VAPID_PRIVATE_KEY=${cles.privateKey}`);
}
if (!present('VAPID_SUJET')) ajouts.push('VAPID_SUJET=mailto:contact@example.com');
if (!present('ENVOI_SECRET')) ajouts.push(`ENVOI_SECRET=${randomBytes(32).toString('base64url')}`);
if (!present('ENVOI_URL')) ajouts.push('ENVOI_URL=http://host.docker.internal:3000/api/notifications/envoyer');

if (ajouts.length === 0) {
  console.log('Clés des notifications déjà présentes dans .env.local.');
} else {
  appendFileSync(FICHIER, (contenu.endsWith('\n') || contenu === '' ? '' : '\n') + '\n# Notifications\n' + ajouts.join('\n') + '\n');
  console.log(`${ajouts.length} variable(s) ajoutée(s) à .env.local (valeurs non affichées).`);
}
```

`scripts/configurer-envoi.ts` :

```ts
// Enregistre l'empreinte du secret d'envoi et (re)crée la tâche planifiée qui appelle la route chaque minute.
// Utilise la clé de service : base locale seulement, sauf si CONFIGURER_PRODUCTION=1 est fixé explicitement.
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../src/lib/supabase/types';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const secret = process.env.ENVOI_SECRET;
const cible = process.env.ENVOI_URL;

if (!secret || !cible) {
  console.log('ENVOI_SECRET ou ENVOI_URL absent de .env.local : tâche d’envoi non configurée (npm run cles:notifications).');
  process.exit(0);
}
let hote = '';
try { hote = new URL(url).hostname; } catch { /* vérifié ci-dessous */ }
if (!['localhost', '127.0.0.1', '[::1]'].includes(hote) && process.env.CONFIGURER_PRODUCTION !== '1') {
  console.error('Refusé : NEXT_PUBLIC_SUPABASE_URL ne pointe pas vers la base locale (fixer CONFIGURER_PRODUCTION=1 pour la production).');
  process.exit(1);
}
// Pas d'await au niveau du module : les scripts sont exécutés en CommonJS par tsx (voir importer-contenu.ts).
async function main() {
  const db = createClient<Database>(url, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false } });
  const { error } = await db.rpc('configurer_envoi', { p_url: cible!, p_secret: secret! });
  if (error) throw new Error(error.message);
  console.log('Tâche d’envoi configurée (chaque minute).');
}

main().catch((e) => {
  console.error('Configuration de la tâche d’envoi impossible :', e instanceof Error ? e.message : String(e));
  process.exit(1);
});
```

`package.json`, scripts :

```json
"cles:notifications": "tsx scripts/cles-notifications.ts",
"configurer:envoi": "tsx --env-file=.env.local scripts/configurer-envoi.ts",
"db:reset": "supabase db reset && npm run import:contenu -- contenu/1re-st2s/bph.json --publier && npm run configurer:envoi"
```

`.env.example`, à la fin :

```
# Notifications Web Push : npm run cles:notifications remplit ces valeurs dans .env.local
NEXT_PUBLIC_VAPID_PUBLIC_KEY=
VAPID_PRIVATE_KEY=
# Adresse de contact exigée par les services push (mailto: ou https:)
VAPID_SUJET=mailto:contact@example.com
# Secret partagé entre la tâche planifiée Supabase et la route d'envoi (32 caractères au moins)
ENVOI_SECRET=
# Adresse appelée chaque minute par la tâche planifiée ; en local, le conteneur joint l'hôte par host.docker.internal
ENVOI_URL=http://host.docker.internal:3000/api/notifications/envoyer
```

- [ ] **Step 4 : vérifier**

Run :
```bash
npx vitest run src/lib/notifications src/lib/routes.test.ts && npm run typecheck && npm run lint
npm run cles:notifications
export PATH="$HOME/.orbstack/bin:$PATH"; npm run db:reset
```
Expected : tests PASS ; `cles:notifications` annonce les variables ajoutées sans les afficher ; `db:reset` se termine par « Tâche d'envoi configurée (chaque minute). ».

Puis, sur le build de production (`npm run build && npm run start`, arrêté ensuite) :
```bash
curl -s -o /dev/null -w '%{http_code}\n' -X POST http://localhost:3000/api/notifications/envoyer
```
Expected : `401`. Et, une à deux minutes après le démarrage, la base montre des appels réussis de la tâche :
```bash
docker exec supabase_db_app-lycee psql -U postgres -Atc "select status_code, count(*) from net._http_response group by 1"
```
Expected : des lignes `200` (aucune notification à envoyer, réponse `{"traitees":0}`).

- [ ] **Step 5 : commit**

```bash
git add package.json package-lock.json .env.example src/lib/notifications/secret.ts src/lib/notifications/secret.test.ts src/lib/notifications/webpush.ts "src/app/api/notifications/envoyer/route.ts" scripts/cles-notifications.ts scripts/configurer-envoi.ts src/lib/routes.ts src/lib/routes.test.ts
git commit -m "Ajoute la route d'envoi des notifications et la tâche planifiée qui l'appelle

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---
### Task 5 : service worker et abonnement côté navigateur

**Files :**
- Modify : `public/sw.js`
- Modify : `e2e/hors-ligne.spec.ts` (nom du cache de repli)
- Create : `src/lib/notifications/client.ts`, `src/lib/notifications/client.test.ts`

**Interfaces :**
- Consumes : enregistrement du service worker existant (`src/components/EnregistrementSW.tsx`, production seulement).
- Produces :
  - `base64UrlVersOctets(base64: string): Uint8Array` ;
  - `estIphoneHorsEcranAccueil(userAgent: string, autonome: boolean, pointsTactiles: number): boolean` ;
  - `nomAppareil(userAgent: string): string` ;
  - `type EtatPush = 'non_supporte' | 'iphone_installer' | 'refuse' | 'actif' | 'inactif'` ;
  - `lireEtatPush(): Promise<EtatPush>` ;
  - `activerPush(clePublique: string): Promise<{ endpoint: string; p256dh: string; auth: string } | 'refuse' | 'indisponible'>` ;
  - `desactiverPush(): Promise<string | null>` (renvoie le point d'envoi retiré) ;
  - charge reçue par le service worker : JSON `{ id, titre, corps, url }` (tâche 3).

- [ ] **Step 1 : écrire les tests des fonctions pures**

`src/lib/notifications/client.test.ts` :

```ts
import { describe, expect, it } from 'vitest';
import { base64UrlVersOctets, estIphoneHorsEcranAccueil, nomAppareil } from './client';

const IPHONE = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1';
const IPAD = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15';
const ANDROID = 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36';
const FIREFOX = 'Mozilla/5.0 (X11; Linux x86_64; rv:128.0) Gecko/20100101 Firefox/128.0';

describe('base64UrlVersOctets', () => {
  it('décode le base64 URL sans remplissage', () => {
    expect([...base64UrlVersOctets('AQID')]).toEqual([1, 2, 3]);
    expect([...base64UrlVersOctets('AQIDBA')]).toEqual([1, 2, 3, 4]);
    expect([...base64UrlVersOctets('-_8')]).toEqual([251, 255]);
  });
});

describe('estIphoneHorsEcranAccueil', () => {
  it('repère un iPhone dans Safari', () => expect(estIphoneHorsEcranAccueil(IPHONE, false, 5)).toBe(true));
  it('pas de guide une fois sur l’écran d’accueil', () => expect(estIphoneHorsEcranAccueil(IPHONE, true, 5)).toBe(false));
  it('repère un iPad qui se présente comme un Mac', () => expect(estIphoneHorsEcranAccueil(IPAD, false, 5)).toBe(true));
  it('un vrai Mac n’est pas concerné', () => expect(estIphoneHorsEcranAccueil(IPAD, false, 0)).toBe(false));
  it('Android n’est pas concerné', () => expect(estIphoneHorsEcranAccueil(ANDROID, false, 5)).toBe(false));
});

describe('nomAppareil', () => {
  it('nomme l’appareil sans détail identifiant', () => {
    expect(nomAppareil(IPHONE)).toBe('Safari sur iPhone');
    expect(nomAppareil(ANDROID)).toBe('Chrome sur Android');
    expect(nomAppareil(FIREFOX)).toBe('Firefox sur ordinateur');
  });
});
```

Run : `npx vitest run src/lib/notifications/client.test.ts`
Expected : FAIL (module absent).

- [ ] **Step 2 : écrire `client.ts`**

Consulter d'abord avec context7 (ou MDN) : `PushManager.subscribe` (`userVisibleOnly`, `applicationServerKey`), `PushSubscription.toJSON`, `Notification.requestPermission`, `navigator.serviceWorker.getRegistration`.

`src/lib/notifications/client.ts` :

```ts
// Abonnement Web Push côté navigateur. Le service worker n'est enregistré qu'en production.

export type EtatPush = 'non_supporte' | 'iphone_installer' | 'refuse' | 'actif' | 'inactif';
export type AbonnementNavigateur = { endpoint: string; p256dh: string; auth: string };

/** Clé VAPID publique (base64 URL) → octets attendus par `applicationServerKey`. */
export function base64UrlVersOctets(base64: string): Uint8Array {
  const rembourre = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
  const brut = atob(rembourre.replace(/-/g, '+').replace(/_/g, '/'));
  return Uint8Array.from(brut, (c) => c.charCodeAt(0));
}

/** iPhone ou iPad hors écran d'accueil : le Web Push n'y est possible qu'après installation (iOS 16.4+). */
export function estIphoneHorsEcranAccueil(userAgent: string, autonome: boolean, pointsTactiles: number): boolean {
  // iPadOS se présente comme un Mac : on le reconnaît à l'écran tactile.
  const ios = /iPhone|iPad|iPod/.test(userAgent) || (/Macintosh/.test(userAgent) && pointsTactiles > 1);
  return ios && !autonome;
}

/** Libellé lisible de l'appareil, sans version ni détail identifiant. */
export function nomAppareil(userAgent: string): string {
  const navigateur = /Edg\//.test(userAgent) ? 'Edge' : /Firefox\//.test(userAgent) ? 'Firefox'
    : /Chrome\//.test(userAgent) ? 'Chrome' : /Safari\//.test(userAgent) ? 'Safari' : 'Navigateur';
  const systeme = /iPhone/.test(userAgent) ? 'iPhone' : /iPad/.test(userAgent) ? 'iPad' : /Android/.test(userAgent) ? 'Android' : 'ordinateur';
  return `${navigateur} sur ${systeme}`;
}

function autonome(): boolean {
  return window.matchMedia('(display-mode: standalone)').matches
    || (navigator as Navigator & { standalone?: boolean }).standalone === true;
}

async function abonnementActuel(): Promise<PushSubscription | null> {
  const reg = await navigator.serviceWorker.getRegistration();
  return (await reg?.pushManager.getSubscription()) ?? null;
}

export async function lireEtatPush(): Promise<EtatPush> {
  if (estIphoneHorsEcranAccueil(navigator.userAgent, autonome(), navigator.maxTouchPoints ?? 0)) return 'iphone_installer';
  if (!('serviceWorker' in navigator) || !('PushManager' in window) || !('Notification' in window)) return 'non_supporte';
  if (Notification.permission === 'denied') return 'refuse';
  return (await abonnementActuel()) ? 'actif' : 'inactif';
}

export async function activerPush(clePublique: string): Promise<AbonnementNavigateur | 'refuse' | 'indisponible'> {
  const reg = await navigator.serviceWorker.getRegistration();
  if (!reg || !clePublique) return 'indisponible';
  const permission = await Notification.requestPermission();
  if (permission !== 'granted') return 'refuse';
  const abonnement = await reg.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: base64UrlVersOctets(clePublique),
  });
  const json = abonnement.toJSON();
  if (!json.endpoint || !json.keys?.p256dh || !json.keys.auth) return 'indisponible';
  return { endpoint: json.endpoint, p256dh: json.keys.p256dh, auth: json.keys.auth };
}

export async function desactiverPush(): Promise<string | null> {
  const abonnement = await abonnementActuel();
  if (!abonnement) return null;
  const endpoint = abonnement.endpoint;
  await abonnement.unsubscribe();
  return endpoint;
}
```

Run : `npx vitest run src/lib/notifications/client.test.ts`
Expected : PASS (8 tests).

- [ ] **Step 3 : recevoir les notifications dans le service worker**

`public/sw.js` :
- `const VERSION = 'v1';` devient `const VERSION = 'v2';` (le fichier change ; les caches `-v1` sont supprimés à l'activation, la page de repli est remise en cache dans `hors-ligne-v2`).
- Ajouter à la fin du fichier :

```js
// Notifications Web Push. Charge envoyée par la route d'envoi : { id, titre, corps, url }.
function lienInterne(url) {
  return typeof url === 'string' && url.startsWith('/') && !url.startsWith('//') ? url : '/';
}

self.addEventListener('push', (evenement) => {
  let donnees = {};
  try {
    donnees = evenement.data ? evenement.data.json() : {};
  } catch {
    donnees = {};
  }
  const titre = typeof donnees.titre === 'string' && donnees.titre ? donnees.titre : 'App lycée';
  evenement.waitUntil(self.registration.showNotification(titre, {
    body: typeof donnees.corps === 'string' ? donnees.corps : '',
    icon: '/icones/192.png',
    badge: '/icones/192.png',
    lang: 'fr',
    tag: typeof donnees.id === 'string' ? donnees.id : undefined,
    data: { url: lienInterne(donnees.url) },
  }));
});

self.addEventListener('notificationclick', (evenement) => {
  evenement.notification.close();
  const cible = new URL(lienInterne(evenement.notification.data && evenement.notification.data.url), self.location.origin).href;
  evenement.waitUntil((async () => {
    const fenetres = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const fenetre of fenetres) {
      if (fenetre.url === cible && 'focus' in fenetre) return fenetre.focus();
    }
    return self.clients.openWindow(cible);
  })());
});
```

`e2e/hors-ligne.spec.ts` : remplacer `'hors-ligne-v1'` par `'hors-ligne-v2'`.

- [ ] **Step 4 : vérifier**

Run : `npm test && npm run typecheck && npm run lint && npx playwright test e2e/hors-ligne.spec.ts`
Expected : PASS (le parcours hors connexion passe avec la version `v2`). Laisser le port 3000 libre à la fin.

- [ ] **Step 5 : commit**

```bash
git add public/sw.js e2e/hors-ligne.spec.ts src/lib/notifications/client.ts src/lib/notifications/client.test.ts
git commit -m "Affiche les notifications reçues et prépare l'abonnement côté navigateur

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 6 : interface — réglages, invitation, rappel d'un événement et liste de rappels

**Files :**
- Create : `src/lib/notifications/preferences.ts`, `src/lib/notifications/preferences.test.ts`, `src/lib/notifications/requetes.ts`
- Create : `src/app/(app)/notifications/page.tsx`, `src/app/(app)/notifications/actions.ts`
- Create : `src/app/(app)/rappels/page.tsx`
- Create : `src/components/notifications/ActivationPush.tsx`, `GuideIphone.tsx`, `InvitationRappels.tsx`, `FormulairePreferences.tsx`, `ListeAppareils.tsx`, `MarquerRappelsLus.tsx`
- Create : `src/styles/notifications.css` (importé dans `src/app/globals.css`)
- Modify : `src/lib/erreurs.ts`, `src/lib/erreurs.test.ts`
- Modify : `src/lib/calendrier/schema-evenement.ts` (+ test), `src/components/calendrier/FormulaireEvenement.tsx`, `src/app/(app)/calendrier/actions.ts`, `src/lib/calendrier/requetes.ts` (`lireEvenement`), `src/app/(app)/calendrier/[id]/page.tsx`, `src/app/(app)/calendrier/page.tsx`
- Modify : `src/components/EnTete.tsx`, `src/app/(app)/layout.tsx`

**Interfaces :**
- Consumes : RPC de la tâche 1 ; `lireEtatPush`, `activerPush`, `desactiverPush`, `nomAppareil` (tâche 5) ; `exigerEleve()` (`src/lib/calendrier/garde.ts`) ; `creerClientServeur()` ; `messageErreur()` ; `libelleJour(jour)`, `jourParis`, `heureParis` (`src/lib/calendrier/dates.ts`).
- Produces :
  - `TYPES_NOTIFICATION`, `type Preferences`, `type ValeursPreferences`, `type ChampPreferences`, `PREFERENCES_PAR_DEFAUT`, `versValeurs(p)`, `lireFormulairePreferences(form)` ;
  - actions `enregistrerAbonnement(abonnement, appareil)`, `oublierAppareilCourant(endpoint)`, `retirerAppareil(form)`, `enregistrerPreferences(etat, form)`, `marquerRappelsLus()` ;
  - pages `/notifications` et `/rappels` ; lien « Rappels » de l'en-tête élève avec le nombre de non lus ;
  - champ `rappel` du formulaire d'événement (`''`, `'10'`, `'60'`, `'1440'`), et `rappel: 10 | 60 | 1440 | null` dans le résultat `ok` de `lireFormulaireEvenement`.

- [ ] **Step 1 : tests de la lecture des réglages, du champ « Rappel » et des messages**

`src/lib/notifications/preferences.test.ts` :

```ts
import { describe, expect, it } from 'vitest';
import { lireFormulairePreferences, PREFERENCES_PAR_DEFAUT, versValeurs } from './preferences';

function formulaire(valeurs: Record<string, string | string[]>) {
  const f = new FormData();
  for (const [cle, v] of Object.entries(valeurs)) (Array.isArray(v) ? v : [v]).forEach((x) => f.append(cle, x));
  return f;
}

describe('lireFormulairePreferences', () => {
  it('lit les types cochés, le silence et les jours', () => {
    const r = lireFormulairePreferences(formulaire({
      types: ['rappel_evenement', 'nouvel_essai'], silence_debut: '21:30', silence_fin: '07:15', jours_inactivite: '5',
    }));
    expect(r).toEqual({
      ok: true,
      donnees: {
        rappel_evenement: true, echeance_proche: false, nouvel_essai: true, revision_du_jour: false, inactivite: false,
        silence_debut: '21:30', silence_fin: '07:15', jours_inactivite: 5,
      },
      valeurs: { types: ['rappel_evenement', 'nouvel_essai'], silence_debut: '21:30', silence_fin: '07:15', jours_inactivite: '5' },
    });
  });
  it('refuse une heure invalide, sur le bon champ', () => {
    const r = lireFormulairePreferences(formulaire({ silence_debut: '25:00', silence_fin: '07:00', jours_inactivite: '3' }));
    expect(r).toMatchObject({ ok: false, champ: 'silence_debut', erreur: 'Indique une heure valide, par exemple 22:00.' });
  });
  it('refuse un nombre de jours hors de 1 à 14', () => {
    const r = lireFormulairePreferences(formulaire({ silence_debut: '22:00', silence_fin: '07:00', jours_inactivite: '30' }));
    expect(r).toMatchObject({ ok: false, champ: 'jours_inactivite', erreur: 'Choisis entre 1 et 14 jours.' });
  });
  it('ignore un type inconnu', () => {
    const r = lireFormulairePreferences(formulaire({ types: ['espion'], silence_debut: '22:00', silence_fin: '07:00', jours_inactivite: '3' }));
    expect(r.ok && Object.values(r.donnees).filter((v) => v === true)).toEqual([]);
  });
});

describe('versValeurs', () => {
  it('prépare le formulaire depuis les réglages lus en base', () => {
    expect(versValeurs({ ...PREFERENCES_PAR_DEFAUT, silence_debut: '22:00:00', inactivite: false })).toEqual({
      types: ['rappel_evenement', 'echeance_proche', 'nouvel_essai', 'revision_du_jour'],
      silence_debut: '22:00', silence_fin: '07:00', jours_inactivite: '3',
    });
  });
});
```

`src/lib/calendrier/schema-evenement.test.ts` : ajouter

```ts
  it('lit le rappel choisi', () => {
    const f = formulaireValide(); // reprendre le constructeur de formulaire valide déjà utilisé dans ce fichier
    f.set('rappel', '60');
    const r = lireFormulaireEvenement(f);
    expect(r.ok && r.rappel).toBe(60);
  });
  it('sans rappel, renvoie null', () => {
    const r = lireFormulaireEvenement(formulaireValide());
    expect(r.ok && r.rappel).toBeNull();
  });
  it('refuse un rappel hors liste', () => {
    const f = formulaireValide();
    f.set('rappel', '30');
    expect(lireFormulaireEvenement(f)).toMatchObject({ ok: false, champ: 'rappel', erreur: 'Choisis un rappel dans la liste.' });
  });
```

(Si le fichier de test n'a pas de constructeur `formulaireValide`, l'écrire en haut du fichier à partir du premier cas valide existant : `type=devoir`, `titre=Devoir`, `jour` dans 7 jours, `heure=17:00`, `duree=60`.)

`src/lib/erreurs.test.ts` : ajouter

```ts
  it('traduit les erreurs des notifications', () => {
    expect(messageErreur('abonnement_invalide')).toBe('Cet appareil n’a pas pu être enregistré. Réessaie.');
    expect(messageErreur('preferences_invalides')).toBe('Tes réglages n’ont pas pu être lus. Vérifie les heures et réessaie.');
    expect(messageErreur('rappel_invalide')).toBe('Choisis un rappel dans la liste.');
  });
```

Run : `npx vitest run src/lib/notifications/preferences.test.ts src/lib/calendrier/schema-evenement.test.ts src/lib/erreurs.test.ts`
Expected : FAIL.

- [ ] **Step 2 : code partagé**

`src/lib/notifications/preferences.ts` :

```ts
import { z } from 'zod';

export const TYPES_NOTIFICATION = [
  { cle: 'rappel_evenement', libelle: 'Rappels avant tes événements' },
  { cle: 'echeance_proche', libelle: 'Évaluation qui ferme bientôt' },
  { cle: 'nouvel_essai', libelle: 'Nouvel essai d’évaluation disponible' },
  { cle: 'revision_du_jour', libelle: 'Séances de révision du jour (7 h 30)' },
  { cle: 'inactivite', libelle: 'Relance après quelques jours sans réviser (17 h)' },
] as const;
export type TypeNotification = (typeof TYPES_NOTIFICATION)[number]['cle'];

export type Preferences = Record<TypeNotification, boolean> & {
  silence_debut: string; silence_fin: string; jours_inactivite: number;
};
export type ValeursPreferences = { types: string[]; silence_debut: string; silence_fin: string; jours_inactivite: string };
export type ChampPreferences = 'silence_debut' | 'silence_fin' | 'jours_inactivite';

export const PREFERENCES_PAR_DEFAUT: Preferences = {
  rappel_evenement: true, echeance_proche: true, nouvel_essai: true, revision_du_jour: true, inactivite: true,
  silence_debut: '22:00', silence_fin: '07:00', jours_inactivite: 3,
};

const HEURE = /^([01]\d|2[0-3]):[0-5]\d$/;
const schema = z.object({
  silence_debut: z.string().regex(HEURE, 'Indique une heure valide, par exemple 22:00.'),
  silence_fin: z.string().regex(HEURE, 'Indique une heure valide, par exemple 7:00.'),
  jours_inactivite: z.coerce.number().int('Choisis entre 1 et 14 jours.').min(1, 'Choisis entre 1 et 14 jours.')
    .max(14, 'Choisis entre 1 et 14 jours.'),
});

export function versValeurs(p: Preferences): ValeursPreferences {
  return {
    types: TYPES_NOTIFICATION.filter((t) => p[t.cle]).map((t) => t.cle),
    silence_debut: p.silence_debut.slice(0, 5), silence_fin: p.silence_fin.slice(0, 5),
    jours_inactivite: String(p.jours_inactivite),
  };
}

export function lireFormulairePreferences(form: FormData):
  | { ok: true; donnees: Preferences; valeurs: ValeursPreferences }
  | { ok: false; erreur: string; champ: ChampPreferences; valeurs: ValeursPreferences } {
  const valeurs: ValeursPreferences = {
    types: form.getAll('types').map(String),
    silence_debut: String(form.get('silence_debut') ?? ''), silence_fin: String(form.get('silence_fin') ?? ''),
    jours_inactivite: String(form.get('jours_inactivite') ?? ''),
  };
  const r = schema.safeParse(valeurs);
  if (!r.success) {
    const issue = r.error.issues[0];
    return { ok: false, erreur: issue?.message ?? 'Vérifie tes réglages.', champ: (issue?.path[0] as ChampPreferences) ?? 'silence_debut', valeurs };
  }
  const coches = new Set(valeurs.types);
  const types = Object.fromEntries(TYPES_NOTIFICATION.map((t) => [t.cle, coches.has(t.cle)])) as Record<TypeNotification, boolean>;
  return { ok: true, donnees: { ...types, ...r.data }, valeurs };
}
```

Le message de `silence_fin` dit « 7:00 » : le test de `silence_debut` attend « 22:00 » ; garder les deux textes tels quels.

`src/lib/erreurs.ts` : ajouter dans `MESSAGES` :

```ts
  abonnement_invalide: 'Cet appareil n’a pas pu être enregistré. Réessaie.',
  preferences_invalides: 'Tes réglages n’ont pas pu être lus. Vérifie les heures et réessaie.',
  rappel_invalide: 'Choisis un rappel dans la liste.',
```

Vérifier avec un court script qu'aucun de ces trois codes n'est sous-chaîne d'un code existant ni ne le contient.

`src/lib/calendrier/schema-evenement.ts` :
- `ChampEvenement` gagne `'rappel'` ; `ValeursEvenement` gagne `rappel: string` (lu par `texte('rappel')`) ;
- exporter `export const RAPPELS = [{ valeur: '', libelle: 'Aucun rappel' }, { valeur: '10', libelle: '10 minutes avant' }, { valeur: '60', libelle: '1 heure avant' }, { valeur: '1440', libelle: 'La veille (24 heures avant)' }] as const;` ;
- dans le schéma zod : `rappel: z.enum(['', '10', '60', '1440'], { error: 'Choisis un rappel dans la liste.' })` ;
- le résultat `ok` gagne `rappel: 10 | 60 | 1440 | null` (`d.rappel ? (Number(d.rappel) as 10 | 60 | 1440) : null`) ; `donnees`, envoyé à `enregistrer_evenement`, ne change pas.

- [ ] **Step 3 : rappel dans le formulaire et la page d'un événement**

`src/components/calendrier/FormulaireEvenement.tsx` : après le champ « Durée », ajouter un `<select name="rappel" id="rappel">` libellé « Rappel », options `RAPPELS`, `defaultValue={v.rappel}`, aide (`.aide-champ`, id `rappel-aide`) : « Une notification sur tes appareils, ou dans la page Rappels. », avec `aria-invalid` et `aria-describedby` comme les autres champs.

`src/app/(app)/calendrier/actions.ts`, dans `enregistrerEvenement`, juste avant `revaliderCalendrier()` :

```ts
  // Le rappel se règle à part ; l'événement est déjà enregistré, un échec ici n'est pas bloquant.
  const rappel = await supabase.rpc('regler_rappel_evenement', { p_id: data, p_delai: lu.rappel as number });
  if (rappel.error) console.error('regler_rappel_evenement', rappel.error.message);
```

(`p_delai` accepte `null` en SQL ; les types générés l'ignorent, d'où le transtypage, comme `p_id` plus haut.)

`src/lib/calendrier/requetes.ts`, `lireEvenement` : ajouter `delai_rappel_minutes` aux colonnes lues. Page de modification (`[id]/page.tsx` ou le composant qui construit les valeurs initiales) : `rappel: String(ev.delai_rappel_minutes ?? '')`. Sur la fiche de l'événement, sous la date : `Rappel&nbsp;: {libellé de RAPPELS en minuscules sans « (24 heures avant) »}` si un rappel est réglé — par exemple « Rappel : 1 heure avant », « Rappel : la veille ».

- [ ] **Step 4 : actions serveur des notifications**

`src/app/(app)/notifications/actions.ts` :

```ts
'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { creerClientServeur } from '@/lib/supabase/server';
import { messageErreur } from '@/lib/erreurs';
import { exigerEleve } from '@/lib/calendrier/garde';
import { lireFormulairePreferences, type ChampPreferences, type ValeursPreferences } from '@/lib/notifications/preferences';
import type { Json } from '@/lib/supabase/types';

export type EtatPreferences = { erreur?: string; champ?: ChampPreferences; valeurs?: ValeursPreferences; ok?: boolean };

const abonnementSchema = z.object({
  endpoint: z.string().url().startsWith('https://').max(1000),
  p256dh: z.string().min(20).max(200),
  auth: z.string().min(10).max(100),
});

export async function enregistrerAbonnement(abonnement: unknown, appareil: string): Promise<{ erreur?: string }> {
  await exigerEleve();
  const a = abonnementSchema.safeParse(abonnement);
  if (!a.success) return { erreur: messageErreur('abonnement_invalide') };
  const supabase = await creerClientServeur();
  const { error } = await supabase.rpc('enregistrer_abonnement_push', {
    p_endpoint: a.data.endpoint, p_p256dh: a.data.p256dh, p_auth: a.data.auth, p_appareil: String(appareil).slice(0, 80),
  });
  if (error) return { erreur: messageErreur(error.message) };
  revalidatePath('/notifications');
  revalidatePath('/calendrier');
  return {};
}

export async function oublierAppareilCourant(endpoint: string): Promise<void> {
  await exigerEleve();
  if (typeof endpoint !== 'string' || endpoint.length > 1000) return;
  const supabase = await creerClientServeur();
  await supabase.rpc('supprimer_abonnement_push_endpoint', { p_endpoint: endpoint });
  revalidatePath('/notifications');
}

export async function retirerAppareil(form: FormData): Promise<void> {
  await exigerEleve();
  const id = z.string().uuid().safeParse(form.get('id'));
  if (!id.success) return;
  const supabase = await creerClientServeur();
  await supabase.rpc('supprimer_abonnement_push', { p_id: id.data });
  revalidatePath('/notifications');
}

export async function enregistrerPreferences(_: EtatPreferences, form: FormData): Promise<EtatPreferences> {
  await exigerEleve();
  const lu = lireFormulairePreferences(form);
  if (!lu.ok) return { erreur: lu.erreur, champ: lu.champ, valeurs: lu.valeurs };
  const supabase = await creerClientServeur();
  const { error } = await supabase.rpc('enregistrer_preferences_notification', { p: lu.donnees as unknown as Json });
  if (error) return { erreur: messageErreur(error.message), valeurs: lu.valeurs };
  revalidatePath('/notifications');
  return { ok: true, valeurs: lu.valeurs };
}

export async function marquerRappelsLus(): Promise<void> {
  await exigerEleve();
  const supabase = await creerClientServeur();
  await supabase.rpc('marquer_rappels_lus');
  revalidatePath('/', 'layout');
}
```

- [ ] **Step 5 : composants**

`src/components/notifications/GuideIphone.tsx` :

```tsx
export function GuideIphone() {
  return (
    <div className="guide-iphone">
      <p>Sur iPhone, les notifications arrivent seulement dans l’application installée sur l’écran d’accueil (iOS 16.4 ou plus récent).</p>
      <ol>
        <li>Ouvre ce site dans Safari.</li>
        <li>Touche le bouton Partager (le carré avec une flèche vers le haut).</li>
        <li>Choisis «&nbsp;Sur l’écran d’accueil&nbsp;», puis «&nbsp;Ajouter&nbsp;».</li>
        <li>Ouvre l’application depuis l’écran d’accueil et reviens sur cette page pour activer les notifications.</li>
      </ol>
    </div>
  );
}
```

`src/components/notifications/ActivationPush.tsx` :

```tsx
'use client';

import { useEffect, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { activerPush, desactiverPush, lireEtatPush, nomAppareil, type EtatPush } from '@/lib/notifications/client';
import { enregistrerAbonnement, oublierAppareilCourant } from '@/app/(app)/notifications/actions';
import { GuideIphone } from './GuideIphone';

export function ActivationPush({ clePublique, onActive }: { clePublique: string; onActive?: () => void }) {
  const router = useRouter();
  const [etat, setEtat] = useState<EtatPush | 'chargement'>('chargement');
  const [message, setMessage] = useState('');
  const [enCours, demarrer] = useTransition();

  useEffect(() => {
    lireEtatPush().then(setEtat).catch(() => setEtat('non_supporte'));
  }, []);

  function activer() {
    setMessage('');
    demarrer(async () => {
      try {
        const r = await activerPush(clePublique);
        if (r === 'refuse') { setEtat('refuse'); return; }
        if (r === 'indisponible') {
          setMessage('Les notifications ne sont pas disponibles sur cette version de l’application.');
          return;
        }
        const enregistre = await enregistrerAbonnement(r, nomAppareil(navigator.userAgent));
        if (enregistre.erreur) { setMessage(enregistre.erreur); return; }
        setEtat('actif');
        setMessage('Notifications activées sur cet appareil.');
        onActive?.();
        router.refresh();
      } catch {
        setMessage('L’activation a échoué. Réessaie dans un instant.');
      }
    });
  }

  function desactiver() {
    setMessage('');
    demarrer(async () => {
      const endpoint = await desactiverPush();
      if (endpoint) await oublierAppareilCourant(endpoint);
      setEtat('inactif');
      setMessage('Notifications désactivées sur cet appareil.');
      router.refresh();
    });
  }

  return (
    <div className="activation-push">
      {etat === 'chargement' && <p>Vérification de cet appareil…</p>}
      {etat === 'iphone_installer' && <GuideIphone />}
      {etat === 'non_supporte' && <p>Ce navigateur ne reçoit pas de notifications. Tes rappels restent visibles dans la page Rappels.</p>}
      {etat === 'refuse' && (
        <p>Tu as bloqué les notifications pour ce site. Pour les réactiver, change l’autorisation dans les réglages de ton navigateur. Tes rappels restent visibles dans la page Rappels.</p>
      )}
      {etat === 'inactif' && (
        <button type="button" className="bouton bouton-principal" onClick={activer} disabled={enCours}>
          {enCours ? 'Activation…' : 'Activer les notifications'}
        </button>
      )}
      {etat === 'actif' && (
        <button type="button" className="bouton bouton-secondaire" onClick={desactiver} disabled={enCours}>
          {enCours ? 'Désactivation…' : 'Désactiver sur cet appareil'}
        </button>
      )}
      <p role="status" className="message-info" hidden={!message}>{message}</p>
    </div>
  );
}
```

`src/components/notifications/InvitationRappels.tsx` :

```tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { lireEtatPush } from '@/lib/notifications/client';
import { ActivationPush } from './ActivationPush';

const CLE = 'rappels-invitation-masquee';

/** Invitation au bon moment : le calendrier contient un événement et cet appareil n'a encore rien décidé. */
export function InvitationRappels({ clePublique }: { clePublique: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let masquee = false;
    try { masquee = localStorage.getItem(CLE) === '1'; } catch { /* stockage indisponible : on affiche */ }
    if (masquee) return;
    lireEtatPush().then((e) => setVisible(e === 'inactif' || e === 'iphone_installer')).catch(() => {});
  }, []);

  if (!visible) return null;
  function plusTard() {
    try { localStorage.setItem(CLE, '1'); } catch { /* rien */ }
    setVisible(false);
  }
  return (
    <section className="carte invitation-rappels" aria-labelledby="invitation-rappels-titre">
      <h2 id="invitation-rappels-titre">Active les rappels</h2>
      <p>Reçois un rappel avant tes révisions et tes devoirs, même quand l’application est fermée. Tu choisis ce que tu reçois dans <Link href="/notifications">tes réglages</Link>.</p>
      <ActivationPush clePublique={clePublique} onActive={() => setVisible(false)} />
      <button type="button" className="bouton bouton-secondaire" onClick={plusTard}>Plus tard</button>
    </section>
  );
}
```

`src/components/notifications/FormulairePreferences.tsx` :

```tsx
'use client';

import { useActionState } from 'react';
import { enregistrerPreferences, type EtatPreferences } from '@/app/(app)/notifications/actions';
import { TYPES_NOTIFICATION, type ValeursPreferences } from '@/lib/notifications/preferences';

export function FormulairePreferences({ initial }: { initial: ValeursPreferences }) {
  const [etat, envoyer, enCours] = useActionState<EtatPreferences, FormData>(enregistrerPreferences, {});
  const v = etat.valeurs ?? initial;
  const aria = (champ: string, aide?: string) => ({
    'aria-invalid': etat.champ === champ || undefined,
    'aria-describedby': [aide, etat.champ === champ ? 'preferences-erreur' : null].filter(Boolean).join(' ') || undefined,
  });
  return (
    <form action={envoyer} className="formulaire" key={JSON.stringify(v)}>
      <fieldset>
        <legend>Notifications à recevoir</legend>
        {TYPES_NOTIFICATION.map((t) => (
          <label key={t.cle} className="case">
            <input type="checkbox" name="types" value={t.cle} defaultChecked={v.types.includes(t.cle)} /> {t.libelle}
          </label>
        ))}
      </fieldset>
      <fieldset>
        <legend>Heures de silence</legend>
        <p id="silence-aide" className="aide-champ">Pendant le silence, les notifications attendent la fin de la plage. Mets la même heure deux fois pour ne jamais être en silence.</p>
        <div className="ligne-champs">
          <label>Début du silence
            <input type="time" name="silence_debut" defaultValue={v.silence_debut} required {...aria('silence_debut', 'silence-aide')} />
          </label>
          <label>Fin du silence
            <input type="time" name="silence_fin" defaultValue={v.silence_fin} required {...aria('silence_fin', 'silence-aide')} />
          </label>
        </div>
      </fieldset>
      <label>Relance après
        <select name="jours_inactivite" defaultValue={v.jours_inactivite} {...aria('jours_inactivite')}>
          {Array.from({ length: 14 }, (_, i) => i + 1).map((n) => <option key={n} value={n}>{n} {n === 1 ? 'jour' : 'jours'} sans réviser</option>)}
        </select>
      </label>
      {etat.erreur && <p id="preferences-erreur" className="message-erreur" role="alert">{etat.erreur}</p>}
      <p role="status" className="message-info" hidden={!etat.ok}>{etat.ok ? 'Réglages enregistrés.' : ''}</p>
      <button type="submit" className="bouton bouton-principal" disabled={enCours}>
        {enCours ? 'Enregistrement…' : 'Enregistrer mes réglages'}
      </button>
    </form>
  );
}
```

`src/components/notifications/ListeAppareils.tsx` :

```tsx
import { retirerAppareil } from '@/app/(app)/notifications/actions';
import { jourParis, libelleJour } from '@/lib/calendrier/dates';

export type Appareil = { id: string; appareil: string; cree_le: string };

export function ListeAppareils({ appareils }: { appareils: Appareil[] }) {
  if (appareils.length === 0) return <p>Aucun appareil ne reçoit tes notifications pour l’instant.</p>;
  return (
    <ul className="liste-appareils">
      {appareils.map((a) => (
        <li key={a.id}>
          <span>{a.appareil || 'Appareil'}<span className="aide-champ"> · ajouté le {libelleJour(jourParis(new Date(a.cree_le)))}</span></span>
          <form action={retirerAppareil}>
            <input type="hidden" name="id" value={a.id} />
            <button type="submit" className="bouton bouton-secondaire">Retirer<span className="sr-only"> {a.appareil}</span></button>
          </form>
        </li>
      ))}
    </ul>
  );
}
```

`src/components/notifications/MarquerRappelsLus.tsx` :

```tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { marquerRappelsLus } from '@/app/(app)/notifications/actions';

/** Marque les rappels comme lus après l'affichage, puis met à jour le compteur de l'en-tête. */
export function MarquerRappelsLus({ nonLus }: { nonLus: number }) {
  const router = useRouter();
  useEffect(() => {
    if (nonLus === 0) return;
    marquerRappelsLus().then(() => router.refresh()).catch(() => {});
  }, [nonLus, router]);
  return null;
}
```

- [ ] **Step 6 : pages, en-tête, calendrier**

`src/app/(app)/notifications/page.tsx` :

```tsx
import Link from 'next/link';
import { exigerEleve } from '@/lib/calendrier/garde';
import { creerClientServeur } from '@/lib/supabase/server';
import { PREFERENCES_PAR_DEFAUT, versValeurs, type Preferences } from '@/lib/notifications/preferences';
import { ActivationPush } from '@/components/notifications/ActivationPush';
import { FormulairePreferences } from '@/components/notifications/FormulairePreferences';
import { ListeAppareils } from '@/components/notifications/ListeAppareils';

export const metadata = { title: 'Notifications' };

export default async function PageNotifications() {
  await exigerEleve();
  const supabase = await creerClientServeur();
  const [prefs, appareils] = await Promise.all([
    supabase.from('preferences_notification')
      .select('rappel_evenement, echeance_proche, nouvel_essai, revision_du_jour, inactivite, silence_debut, silence_fin, jours_inactivite')
      .maybeSingle(),
    supabase.from('abonnement_push').select('id, appareil, cree_le').order('cree_le', { ascending: false }).order('id'),
  ]);
  const preferences: Preferences = prefs.data ?? PREFERENCES_PAR_DEFAUT;
  return (
    <div className="page-notifications">
      <p><Link href="/rappels">← Mes rappels</Link></p>
      <h1>Notifications</h1>
      <section className="carte" aria-labelledby="appareil-titre">
        <h2 id="appareil-titre">Sur cet appareil</h2>
        <ActivationPush clePublique={process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? ''} />
      </section>
      <section className="carte" aria-labelledby="reglages-titre">
        <h2 id="reglages-titre">Ce que tu reçois</h2>
        <FormulairePreferences initial={versValeurs(preferences)} />
      </section>
      <section className="carte" aria-labelledby="appareils-titre">
        <h2 id="appareils-titre">Tes appareils</h2>
        <ListeAppareils appareils={appareils.data ?? []} />
      </section>
    </div>
  );
}
```

`src/app/(app)/rappels/page.tsx` :

```tsx
import Link from 'next/link';
import { exigerEleve } from '@/lib/calendrier/garde';
import { creerClientServeur } from '@/lib/supabase/server';
import { heureParis, jourParis, libelleJour } from '@/lib/calendrier/dates';
import { MarquerRappelsLus } from '@/components/notifications/MarquerRappelsLus';

export const metadata = { title: 'Rappels' };

export default async function PageRappels() {
  await exigerEleve();
  const supabase = await creerClientServeur();
  const { data } = await supabase.from('notification_planifiee')
    .select('id, titre, corps, url, envoi_prevu, lue_le')
    .lte('envoi_prevu', new Date().toISOString())
    .order('envoi_prevu', { ascending: false }).order('id')
    .limit(50);
  const rappels = data ?? [];
  const nonLus = rappels.filter((r) => !r.lue_le).length;
  return (
    <div className="page-rappels">
      <h1>Rappels</h1>
      <p><Link href="/notifications">Régler mes notifications</Link></p>
      {rappels.length === 0 ? <p>Aucun rappel pour l’instant.</p> : (
        <ul className="liste-rappels">
          {rappels.map((r) => (
            <li key={r.id} className={r.lue_le ? 'carte' : 'carte rappel-nouveau'}>
              {!r.lue_le && <span className="pastille-nouveau">Nouveau</span>}
              <Link href={r.url}><strong>{r.titre}</strong></Link>
              <p>{r.corps}</p>
              <p className="aide-champ">{libelleJour(jourParis(new Date(r.envoi_prevu)))} à {heureParis(r.envoi_prevu)}</p>
            </li>
          ))}
        </ul>
      )}
      <MarquerRappelsLus nonLus={nonLus} />
    </div>
  );
}
```

`src/components/EnTete.tsx` :
- ajouter `{ href: '/rappels', libelle: 'Rappels' }` à la fin des liens `eleve` ;
- nouvelle prop facultative `rappelsNonLus?: number` ; dans le `map`, pour `/rappels` quand `rappelsNonLus > 0`, ajouter après le libellé : `<span className="pastille-rappels" aria-hidden="true">{rappelsNonLus}</span><span className="sr-only"> ({rappelsNonLus} non lus)</span>`.

`src/app/(app)/layout.tsx` : pour un élève (branche `eleve`), compter les rappels non lus et les passer à l'en-tête :

```tsx
  const rappelsNonLus = eleve ? await compterRappelsNonLus() : 0;
  // …
  <EnTete prenom={profil.nom} role={profil.role} rappelsNonLus={rappelsNonLus} />
```

avec, dans `src/lib/notifications/requetes.ts` (nouveau fichier) :

```ts
import { creerClientServeur } from '@/lib/supabase/server';

export async function compterRappelsNonLus(): Promise<number> {
  const supabase = await creerClientServeur();
  const { count } = await supabase.from('notification_planifiee')
    .select('id', { count: 'exact', head: true })
    .is('lue_le', null)
    .lte('envoi_prevu', new Date().toISOString());
  return count ?? 0;
}
```


`src/app/(app)/calendrier/page.tsx` : lire en parallèle des requêtes existantes s'il y a au moins un événement et au moins un appareil :

```ts
supabase.from('evenement').select('id', { count: 'exact', head: true }),
supabase.from('abonnement_push').select('id', { count: 'exact', head: true }),
```

puis, sous l'en-tête de la page et la bannière de réorganisation : `{nbEvenements > 0 && nbAppareils === 0 && <InvitationRappels clePublique={process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? ''} />}`, et un lien « Notifications » à côté du lien « Partager » existant.

`src/styles/notifications.css` (et `@import "../styles/notifications.css";` dans `globals.css`, après `calendrier.css`) :

```css
.pastille-rappels {
  display: inline-block; min-width: 1.4em; margin-left: 4px; padding: 0 6px; border-radius: 999px;
  background: var(--couleur-cours); color: #fff; font-size: 0.8em; line-height: 1.4em; text-align: center;
}
.liste-rappels, .liste-appareils { list-style: none; margin: 0; padding: 0; display: grid; gap: 12px; }
.liste-rappels li { overflow-wrap: anywhere; }
.rappel-nouveau { border-left: 4px solid var(--couleur-cours); }
.pastille-nouveau { display: inline-block; margin-bottom: 4px; font-size: 0.8em; font-weight: 600; text-transform: uppercase; letter-spacing: 0.03em; }
.liste-appareils li { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; justify-content: space-between; }
.invitation-rappels { display: grid; gap: 12px; }
.guide-iphone ol { padding-left: 1.4em; display: grid; gap: 6px; }
@media (max-width: 520px) { .en-tete nav { flex-wrap: wrap; row-gap: 4px; } }
```

(`.formulaire .case` existe déjà dans `globals.css` : les cases à cocher l'utilisent tel quel.)

- [ ] **Step 7 : vérifier**

Run : `npm test && npm run typecheck && npm run lint`
Expected : PASS.

Contrôle à la main sur le build de production (`npm run build && npm run start`, port 3000, arrêté ensuite), avec un compte élève local et la largeur 375 px :
- `/notifications` s'affiche, enregistre les réglages (« Réglages enregistrés. ») et les relit après rechargement ;
- un événement créé avec « 1 heure avant » montre « Rappel : 1 heure avant » sur sa fiche ;
- l'en-tête tient sur 375 px sans défilement horizontal, avec le lien « Rappels ».

- [ ] **Step 8 : commit**

```bash
git add src/lib/notifications/preferences.ts src/lib/notifications/preferences.test.ts src/lib/notifications/requetes.ts "src/app/(app)/notifications" "src/app/(app)/rappels" src/components/notifications src/styles/notifications.css src/app/globals.css src/lib/erreurs.ts src/lib/erreurs.test.ts src/lib/calendrier/schema-evenement.ts src/lib/calendrier/schema-evenement.test.ts src/components/calendrier/FormulaireEvenement.tsx "src/app/(app)/calendrier" src/lib/calendrier/requetes.ts src/components/EnTete.tsx "src/app/(app)/layout.tsx"
git commit -m "Ajoute les réglages des notifications, l'invitation et la liste de rappels

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 7 : parcours de bout en bout, bilan et revue finale

**Files :**
- Create : `e2e/notifications.spec.ts`
- Create : `docs/superpowers/plans/2026-12-08-etape-4b-bilan.md`
- Modify : `README.md`, `docs/superpowers/plans/2026-11-03-feuille-de-route.md`

**Interfaces :**
- Consumes : `db`, `idProfil(email)` (`e2e/aide-db.ts`) ; `emailDeTest`, `inscrireEleve` (`e2e/aide-parcours.ts`) ; route `POST /api/notifications/envoyer` ; pages `/notifications`, `/rappels`, `/calendrier/nouveau`.

- [ ] **Step 1 : parcours**

`e2e/notifications.spec.ts` :

```ts
import { expect, test } from '@playwright/test';
import { db, idProfil } from './aide-db';
import { emailDeTest, inscrireEleve } from './aide-parcours';

const secret = process.env.ENVOI_SECRET ?? '';

test('la route d’envoi refuse un appel sans le bon secret', async ({ request }) => {
  expect((await request.post('/api/notifications/envoyer')).status()).toBe(401);
  const faux = await request.post('/api/notifications/envoyer', { headers: { Authorization: `Bearer ${'x'.repeat(43)}` } });
  expect(faux.status()).toBe(401);
});

test('réglages, rappel d’un événement et liste de rappels', async ({ page, request }) => {
  test.skip(!secret, 'ENVOI_SECRET absent de .env.local : lancer npm run cles:notifications');
  const email = emailDeTest('notif');
  await inscrireEleve(page, email);

  // Réglages : pas de relance d'inactivité, pas de silence (l'envoi ne doit pas être décalé pendant le test).
  await page.goto('/notifications');
  await page.getByLabel('Relance après quelques jours sans réviser (17 h)').uncheck();
  await page.getByLabel('Début du silence').fill('00:00');
  await page.getByLabel('Fin du silence').fill('00:00');
  await page.getByRole('button', { name: 'Enregistrer mes réglages' }).click();
  await expect(page.getByText('Réglages enregistrés.')).toBeVisible();
  await page.reload();
  await expect(page.getByLabel('Relance après quelques jours sans réviser (17 h)')).not.toBeChecked();
  await expect(page.getByLabel('Début du silence')).toHaveValue('00:00');

  // Un devoir dans deux jours, rappel 1 heure avant.
  // Jour de Paris dans deux jours (les alias « @/ » ne sont pas résolus dans les tests e2e).
  const jour = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Paris' }).format(new Date(Date.now() + 2 * 86_400_000));
  await page.goto('/calendrier/nouveau');
  await page.getByLabel('Devoir').check();
  await page.getByLabel('Titre').fill('Exposé de BPH');
  await page.getByLabel('Date').fill(jour);
  await page.getByLabel('Heure', { exact: true }).fill('18:00');
  await page.getByLabel('Rappel').selectOption('60');
  await page.getByRole('button', { name: 'Ajouter au calendrier' }).click();
  await expect(page).toHaveURL(/\/calendrier\?vue=semaine/);

  const eleve = await idProfil(email);
  const { data: ev } = await db.from('evenement').select('id, delai_rappel_minutes').eq('eleve_id', eleve).single();
  expect(ev?.delai_rappel_minutes).toBe(60);

  // Le rappel arrive à échéance (la planification elle-même est couverte par pgTAP).
  await db.from('notification_planifiee').insert({
    eleve_id: eleve, type: 'rappel_evenement', cle: `rappel:${ev!.id}:test`, evenement_id: ev!.id,
    titre: 'Exposé de BPH', corps: 'Dans 1 heure', url: `/calendrier/${ev!.id}`,
    envoi_prevu: new Date(Date.now() - 60_000).toISOString(),
  });
  const reponse = await request.post('/api/notifications/envoyer', { headers: { Authorization: `Bearer ${secret}` } });
  expect(reponse.status()).toBe(200);
  // La tâche planifiée locale peut aussi l'avoir traitée : on attend seulement le statut.
  await expect.poll(async () => (await db.from('notification_planifiee').select('statut').eq('eleve_id', eleve).single()).data?.statut)
    .toBe('envoyee');

  // Sans appareil, le rappel est dans l'application : compteur dans l'en-tête, puis liste.
  await page.goto('/calendrier');
  const lien = page.getByRole('link', { name: /^Rappels/ });
  await expect(lien).toContainText('1');
  await lien.click();
  await expect(page.getByRole('heading', { level: 1, name: 'Rappels' })).toBeVisible();
  await expect(page.getByText('Exposé de BPH')).toBeVisible();
  await expect(page.getByRole('link', { name: /^Rappels/ })).not.toContainText('1');
});
```

Avant d'écrire les sélecteurs, relire les libellés réels de `FormulaireEvenement.tsx` (type « Devoir », « Titre », « Date », « Heure ») et les adapter si besoin, sans affaiblir les assertions.

- [ ] **Step 2 : vérification complète**

Run :
```bash
export PATH="$HOME/.orbstack/bin:$PATH"
npm run db:reset
npm test && npm run typecheck && npm run lint && npm run test:db && npm run build && npm run e2e
```
Expected : tout passe. Noter les nombres exacts (tests unitaires et fichiers, tests pgTAP et fichiers, parcours de bout en bout) pour le bilan. Laisser le port 3000 libre.

- [ ] **Step 3 : README, feuille de route, bilan**

- `README.md`, section « Notifications » :
  - `npm run cles:notifications` ajoute à `.env.local` les clés VAPID, le secret et l'adresse d'envoi (sans les afficher) ; `npm run db:reset` configure ensuite la tâche planifiée locale ;
  - les notifications n'arrivent qu'avec le build de production (`npm run build && npm run start`), car le service worker n'est enregistré qu'en production ;
  - en production : générer d'autres clés, renseigner les variables sur l'hébergeur, puis lancer `CONFIGURER_PRODUCTION=1 npm run configurer:envoi` avec l'URL publique de la route dans `ENVOI_URL` et les clés du projet hébergé ;
  - sur iPhone, l'application doit être ajoutée à l'écran d'accueil (iOS 16.4 ou plus récent).
- `docs/superpowers/plans/2026-11-03-feuille-de-route.md` : la ligne 4b devient « 4b. Notifications Web Push » → « Terminé (branche etape-4b-notifications) », avec son bilan ; ajouter une ligne « 4c. En-têtes de sécurité, déploiement, accessibilité, dette » → « à rédiger après l'étape 4b ».
- Créer `docs/superpowers/plans/2026-12-08-etape-4b-bilan.md`, sur le modèle de `2026-12-01-etape-4a-bilan.md` : ce qui est livré, les nombres de tests, les écarts au plan et les décisions prises pendant l'exécution (lignes « Ruling » du registre), les limites acceptées, les points reportés (étape 4c, et ceux de l'étape 4a toujours ouverts), et une section « Revue finale » à compléter.

- [ ] **Step 4 : commit**

```bash
git add e2e/notifications.spec.ts README.md docs/superpowers/plans/2026-11-03-feuille-de-route.md docs/superpowers/plans/2026-12-08-etape-4b-bilan.md
git commit -m "Ajoute le parcours des notifications et le bilan de l'étape 4b

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

- [ ] **Step 5 : revue finale**

Revue de toute la branche (`etape-4a-calendrier..etape-4b-notifications`) par **Opus**, avec une attention particulière pour :
- les droits : RLS des trois tables, colonnes de `abonnement_push` lisibles, RPC ouvertes à `anon` protégées par le secret, `configurer_envoi` réservée à `service_role` ;
- la planification : doublons impossibles, types désactivés, fenêtre et rattrapage, heures de Paris et changements d'heure ;
- l'envoi : réservation concurrente (`skip locked`), réessais, suppression des points d'envoi expirés, rien de perdu si la route échoue entre réservation et fin ;
- le service worker : liens internes seulement, pas de régression du hors connexion ;
- la vie privée sur un appareil partagé (abonnement qui change d'élève, notifications d'un autre élève) ;
- l'accessibilité des nouvelles pages à 375 px.

Ensuite, une seule vague de corrections, une re-revue ciblée, la vérification complète (Step 2), puis la mise à jour du bilan.
