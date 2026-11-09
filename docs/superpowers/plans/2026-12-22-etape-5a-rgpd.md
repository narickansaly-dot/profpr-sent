# Étape 5a : accès gratuit, consentement parental, « Mes données » et pages légales — plan d'implémentation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal :**
- **Fin de l'essai** : après 7 jours, l'élève choisit **un cours gratuit, sans limite de durée**. Il peut changer ce choix **une seule fois, dans les 48 heures**. Un cours hors de son accès affiche un message clair (plus de page 404). Une tentative commencée pendant l'accès peut être terminée dans les 24 heures.
- **Moins de 15 ans** : l'élève indique l'e-mail d'un parent, qui reçoit un lien. L'accès aux cours est bloqué tant que le parent n'a pas donné son accord. L'indicateur « moins de 15 ans » ne change plus après l'inscription.
- **« Mes données »** : export JSON de toutes les données de l'élève ; suppression du compte, définitive après 30 jours, annulable jusque-là.
- **Pages légales** : mentions légales, politique de confidentialité, conditions d'utilisation, en trame à faire relire par un juriste, accessibles depuis le pied de page.
- **Dette des classes** (bilan 3a) : un élève retiré par l'enseignant ne peut pas revenir avant 24 heures ; les départs de classe de plus de 30 jours sont purgés.

**Architecture :**
- **Accès** : la fonction SQL `public.peut_lire_cours` reste la seule source de vérité. Elle gagne, dans l'ordre : le blocage tant qu'un consentement parental manque, l'essai, le cours gratuit choisi, et une tentative en cours de moins de 24 heures. L'abonnement Stripe s'y ajoutera à l'étape 5b, en tête. Une RPC `mon_acces()` donne à l'interface l'état de l'élève.
- **Consentement** : une table `consentement_parental` garde l'e-mail du parent, l'empreinte SHA-256 d'un jeton aléatoire (le lien), et la date de l'accord. Deux RPC ouvertes à `anon` lisent la demande et enregistrent l'accord à partir du jeton.
- **E-mails** : un module serveur (`nodemailer`, SMTP). En local, Mailpit (déjà fourni par Supabase) reçoit les e-mails ; en production, un fournisseur SMTP européen, configuré par variables d'environnement.
- **Suppression du compte** : une date de demande dans `profil`. Une tâche `pg_cron` quotidienne supprime les comptes demandés depuis plus de 30 jours (`auth.users`, en cascade), purge les départs de classe et les retraits de plus de 30 jours.
- **Export** : une RPC `exporter_mes_donnees()` renvoie un objet JSON ; une route `GET /mes-donnees/export` le sert en pièce jointe.

**Tech Stack :** Next.js 16, React 19, TypeScript, zod 4, Supabase (Postgres 17, plpgsql, pgcrypto, pg_cron), `nodemailer`, Mailpit (local), Vitest, pgTAP, Playwright.

**Spec :** `docs/superpowers/specs/2026-11-03-app-lycee-design.md`. Sections concernées :
- 3 « Comptes » (indicateur « a moins de 15 ans », lien parent et date du consentement) et « Abonnement et accès » (`acces_gratuit`, ordre des règles d'accès) ;
- 4 « Inscription » (consentement, essai, cours gratuit modifiable une fois en 48 heures) ;
- 9 « RGPD et mineurs » ;
- 10 « Gestion des erreurs ».

**Découpage de l'étape 5.**
- **5a (ce plan)** : tout ce qui ne dépend pas de Stripe.
- **5b (plan suivant)** : abonnements Stripe (Checkout, portail, webhooks signés et idempotents, délai de grâce de 7 jours), comptes parents payeurs (`lien_parent`), formules mensuelle et annuelle, accès gratuit des enseignants, CGV définitives, et le frein par adresse IP sur les codes d'invitation. Il demandera tes clés Stripe en mode test.

**Bilans repris :**
- bilan 1 : message clair à la fin de l'essai (au lieu d'une 404) ; verrouiller `moins_de_15_ans` après l'inscription ; bloquer les moins de 15 ans sans consentement ; tests des bornes de l'essai ;
- bilan 2 : une tentative commencée pendant l'essai reste utilisable ; reprise d'une évaluation commencée à la fin de l'essai ;
- bilan 3a : purge des départs de classe de plus de 30 jours ; retour bloqué 24 heures après un retrait.

**Branche :** `etape-5a-rgpd`, créée depuis `etape-4c-securite`. Sa PR vise `etape-4c-securite` (PR n° 7).

## Décisions prises dans ce plan (à valider avec la relecture)

1. **Ordre de l'accès à un cours publié, pour un élève** (dans `peut_lire_cours`) :
   1. moins de 15 ans sans accord parental → **aucun** cours ;
   2. essai (7 jours après l'inscription) → tous les cours ;
   3. cours gratuit choisi → ce cours ;
   4. tentative `en_cours` de ce cours commencée il y a moins de 24 heures → ce cours (pour finir un quiz ou une évaluation commencés pendant l'accès).
   Enseignants et admins : inchangé.
2. **Cours gratuit.**
   - Choix possible seulement après l'essai, parmi les cours publiés.
   - Changement possible **une fois**, dans les 48 heures qui suivent le premier choix. Ensuite, le choix est définitif (l'abonnement de l'étape 5b donnera tous les cours).
   - Tant qu'aucun cours n'est choisi après l'essai, l'accueil affiche une invitation à choisir, et les cartes des cours portent « Verrouillé ».
3. **Consentement parental.**
   - Demandé juste après l'inscription d'un élève qui coche « J'ai moins de 15 ans ». Toutes les pages de l'application le redirigent vers `/consentement` tant que l'accord manque.
   - Le lien envoyé au parent vaut 7 jours. L'élève peut renvoyer l'e-mail (au plus une fois toutes les 10 minutes, 5 fois par jour), ou changer l'adresse.
   - L'accord est donné sur une page publique `/accord-parental/<jeton>` : le parent coche « Je suis son parent ou son représentant légal » et confirme. La date est enregistrée.
   - Pas de compte parent dans cette étape : il arrivera avec le paiement (5b).
   - `moins_de_15_ans` est figé dès que l'inscription est terminée (déclencheur en base) : un élève ne peut pas lever le blocage en modifiant son profil.
4. **E-mails.** Variables `SMTP_HOTE`, `SMTP_PORT`, `SMTP_UTILISATEUR`, `SMTP_MOT_DE_PASSE`, `EMAIL_EXPEDITEUR`. En local, Mailpit écoute en SMTP sur `127.0.0.1:54325` (port à activer dans `supabase/config.toml`) et montre les e-mails sur `http://127.0.0.1:54324`. Si le SMTP n'est pas configuré, l'envoi échoue avec un message clair, et la vérification au démarrage le signale.
5. **Mes données.**
   - L'export contient le profil, les classes, la progression, les tentatives avec les réponses, l'historique des questions, le calendrier, les plans, les préférences et rappels, les appareils (libellé et date seulement), le consentement, le cours gratuit.
   - La suppression peut être demandée par tout compte (élève, enseignant). Pendant 30 jours, une bannière permet d'annuler. Au-delà, la tâche quotidienne supprime le compte et tout ce qui en dépend ; les classes d'un enseignant sont supprimées avec lui.
   - Les factures Stripe (5b) seront conservées hors de l'application, chez Stripe.
6. **Pages légales** : trames rédigées en français clair, avec des champs à compléter entre crochets (éditeur, adresse, hébergeurs, contact) et un avertissement visible « Trame à faire relire par un juriste avant la mise en vente ». Aucune bannière de cookies : seuls des cookies nécessaires sont utilisés (session), ce que la politique explique.
7. **Classes** : un retrait par l'enseignant note la date ; `rejoindre_classe` lève `retour_bloque` pendant 24 heures. Les retraits et départs de plus de 30 jours sont purgés chaque jour.

## Contraintes globales

- Toute l'interface est **en français**. On tutoie l'élève. Le parent est vouvoyé sur la page d'accord et dans l'e-mail. Les formulations ne sont pas genrées.
- Typographie française : espace insécable (U+00A0) avant « : ; ! ? » dans tout texte visible ; dans ce plan, ` ` dans les chaînes TypeScript et `&nbsp;` en JSX. Les textes produits en SQL évitent ces signes.
- **Écritures en base uniquement par RPC `security definer`** ; `set search_path = ''` et noms qualifiés ; `revoke execute … from public, anon` puis `grant execute … to authenticated` ; exceptions ouvertes à `anon` : `lire_demande_consentement` et `donner_consentement` (protégées par le jeton) ; les helpers vont dans `prive`, avec `revoke execute … from public`.
- Les RPC réservées aux élèves vérifient `public.role_actuel() is distinct from 'eleve'` et lèvent `reserve_eleves`.
- Lors d'un `create or replace` sur une fonction existante, on recopie son **corps actuel** depuis la migration la plus récente qui la définit, avec ses attributs et ses droits, et on n'ajoute que le changement décrit.
- Les codes d'erreur sont des mots-clés `snake_case`, traduits dans `src/lib/erreurs.ts` avec un test du texte exact ; aucun nouveau code n'est sous-chaîne d'un code existant, ni l'inverse.
- Un test pgTAP ne compte que ses propres lignes (la base locale contient des comptes de démo).
- Le test `rls_socle.test.sql` « anonyme : aucun EXECUTE » liste les fonctions ouvertes à `anon` : y ajouter les deux nouvelles.
- Commandes shell : préfixer par `export PATH="$HOME/.orbstack/bin:$PATH";`. Ne jamais afficher ni commiter `.env.local`. La clé de service n'est utilisée que dans `scripts/` et les aides e2e, derrière la garde « base locale ».
- Après chaque migration : `npm run db:reset`, puis `npx supabase gen types typescript --local > src/lib/supabase/types.ts`.
- Avant d'utiliser une API (Next.js 16, supabase-js, `nodemailer`, pg_cron), consulter sa documentation à jour avec **context7**.
- La CSP de l'étape 4c reste stricte : aucune page ne doit déclencher de violation (`e2e/securite.spec.ts`), et toute nouvelle page passe la revue axe (`e2e/accessibilite.spec.ts`).
- Les formulaires suivent `FormulaireEcheance` (`useActionState`, `aria-invalid` sur le seul champ en cause, `aria-describedby`, valeurs renvoyées). Utilisable à 375 px.
- Messages de commit en français, à l'impératif présent, terminés par la ligne `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Hors périmètre

- Tout Stripe, les comptes parents, les CGV définitives et le frein par adresse IP : étape 5b.
- Choix du cours gratuit par l'enseignant pour sa classe ; plusieurs cours gratuits.
- Retrait du consentement par le parent après coup (il passe par le contact indiqué dans la politique de confidentialité dans cette étape).

## Répartition des modèles

| Tâche | Implémentation | Revue |
|---|---|---|
| 1 Accès : cours gratuit et règles d'accès | Sonnet | **Opus** |
| 2 Consentement parental côté base | Sonnet | **Opus** |
| 3 Envoi d'e-mails | Sonnet | Sonnet |
| 4 Interface : fin d'essai et cours gratuit | Sonnet | Sonnet |
| 5 Interface : consentement | Sonnet | Sonnet |
| 6 Mes données : export et suppression | Sonnet | **Opus** |
| 7 Classes : retour bloqué et purge | Sonnet | Sonnet |
| 8 Pages légales et pied de page | Sonnet | Sonnet |
| 9 Bout en bout, bilan, revue finale | Sonnet, puis revue finale **Opus** | — |

Les tâches 1, 2, 6 et 7 touchent la base locale partagée : elles s'exécutent l'une après l'autre.

## Carte des fichiers

| Fichier | Rôle |
|---|---|
| `supabase/migrations/20261222000001_acces_gratuit.sql` + `supabase/tests/acces_gratuit.test.sql` | `acces_gratuit`, `choisir_cours_gratuit`, `mon_acces`, `peut_lire_cours` |
| `supabase/migrations/20261222000002_consentement.sql` + test | `consentement_parental`, verrou de l'âge, RPC du consentement, `peut_lire_cours`, `mon_acces` |
| `supabase/migrations/20261222000003_mes_donnees.sql` + test | export, demande et annulation de suppression, tâche quotidienne |
| `supabase/migrations/20261222000004_classes_retour.sql` + test | retrait noté, retour bloqué, purge |
| `supabase/config.toml` | port SMTP de Mailpit |
| `src/lib/email/*` (+ tests) | envoi SMTP, modèle de l'e-mail au parent |
| `src/lib/env.ts` (+ test) | groupe facultatif « e-mails » |
| `src/lib/acces/requetes.ts` | `lireMonAcces()` |
| `src/app/(app)/choisir-cours/*`, `src/components/acces/*` | choix du cours gratuit, cours verrouillé |
| `src/app/(app)/consentement/*`, `src/app/accord-parental/[jeton]/*` | consentement côté élève et côté parent |
| `src/app/(app)/mes-donnees/*`, `src/app/mes-donnees/export/route.ts` | export et suppression |
| `src/app/(legal)/*`, `src/components/PiedDePage.tsx` | pages légales |
| `src/app/(app)/layout.tsx`, `src/components/BanniereEssai.tsx`, `src/app/(app)/page.tsx`, `src/components/CarteCours.tsx`, pages de cours et de chapitre | redirections et états d'accès |
| `src/lib/routes.ts` (+ test) | routes publiques |
| `e2e/acces.spec.ts`, `e2e/consentement.spec.ts`, `e2e/mes-donnees.spec.ts`, `e2e/aide-db.ts`, `e2e/aide-mailpit.ts` | bout en bout |

---
### Task 1 : accès — cours gratuit et règles d'accès

**Files :**
- Create : `supabase/migrations/20261222000001_acces_gratuit.sql`, `supabase/tests/acces_gratuit.test.sql`
- Modify : `src/lib/erreurs.ts`, `src/lib/erreurs.test.ts`, `src/lib/supabase/types.ts` (régénéré)

**Interfaces :**
- Consumes : `public.en_essai()`, `public.role_actuel()`, `public.peut_lire_cours(uuid)` (corps actuel dans `20261103000001_socle.sql` — vérifier qu'aucune migration plus récente ne le redéfinit).
- Produces :
  - table `public.acces_gratuit(eleve_id, cours_id, choisi_le, change_utilise, modifie_le)` ;
  - `public.choisir_cours_gratuit(p_cours uuid) returns void` ;
  - `public.mon_acces() returns table (role text, en_essai boolean, fin_essai timestamptz, cours_gratuit_id uuid, changement_possible_jusqu_au timestamptz)` (la tâche 2 y ajoute trois colonnes) ;
  - codes `essai_en_cours`, `choix_definitif` (plus `cours_indisponible`, `reserve_eleves` existants).

- [ ] **Step 1 : écrire le test**

`supabase/tests/acces_gratuit.test.sql` :

```sql
begin;
select plan(15);

insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-0000000005a1', 'fin-essai@test.local'),
  ('00000000-0000-0000-0000-0000000005a2', 'en-essai@test.local'),
  ('00000000-0000-0000-0000-0000000005a3', 'choix-ancien@test.local'),
  ('00000000-0000-0000-0000-0000000005a4', 'prof-acces@test.local');
update public.profil set onboarding_termine = true, inscrit_le = now() - interval '10 days'
 where id in ('00000000-0000-0000-0000-0000000005a1', '00000000-0000-0000-0000-0000000005a3');
update public.profil set onboarding_termine = true where id = '00000000-0000-0000-0000-0000000005a2';
update public.profil set role = 'enseignant', onboarding_termine = true where id = '00000000-0000-0000-0000-0000000005a4';
insert into public.filiere (id, voie, code, nom) values ('10000000-0000-0000-0000-0000000005a1', 'technologique', 'ACG', 'Filière accès');
insert into public.cours (id, slug, filiere_id, niveau_code, matiere, titre, publie) values
  ('20000000-0000-0000-0000-0000000005a1', 'cours-acces-a', '10000000-0000-0000-0000-0000000005a1', '1re', 'A', 'Cours A', true),
  ('20000000-0000-0000-0000-0000000005a2', 'cours-acces-b', '10000000-0000-0000-0000-0000000005a1', '1re', 'B', 'Cours B', true),
  ('20000000-0000-0000-0000-0000000005a3', 'cours-acces-c', '10000000-0000-0000-0000-0000000005a1', '1re', 'C', 'Cours C', false);
-- a3 a choisi le cours A il y a 3 jours, sans avoir utilisé son changement.
insert into public.acces_gratuit (eleve_id, cours_id, choisi_le) values
  ('00000000-0000-0000-0000-0000000005a3', '20000000-0000-0000-0000-0000000005a1', now() - interval '3 days');

set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000005a2","role":"authenticated"}', true);
select throws_ok($$ select public.choisir_cours_gratuit('20000000-0000-0000-0000-0000000005a1') $$,
  'P0001', 'essai_en_cours', 'pas de choix pendant l''essai');

select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000005a4","role":"authenticated"}', true);
select throws_ok($$ select public.choisir_cours_gratuit('20000000-0000-0000-0000-0000000005a1') $$,
  'P0001', 'reserve_eleves', 'un enseignant ne choisit pas de cours gratuit');

select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000005a1","role":"authenticated"}', true);
select is(public.peut_lire_cours('20000000-0000-0000-0000-0000000005a1'), false, 'après l''essai, sans choix : aucun cours');
select throws_ok($$ select public.choisir_cours_gratuit('20000000-0000-0000-0000-0000000005a3') $$,
  'P0001', 'cours_indisponible', 'un cours non publié ne se choisit pas');
select lives_ok($$ select public.choisir_cours_gratuit('20000000-0000-0000-0000-0000000005a1') $$, 'premier choix');
select is(public.peut_lire_cours('20000000-0000-0000-0000-0000000005a1'), true, 'le cours choisi est ouvert');
select is(public.peut_lire_cours('20000000-0000-0000-0000-0000000005a2'), false, 'les autres restent fermés');
select lives_ok($$ select public.choisir_cours_gratuit('20000000-0000-0000-0000-0000000005a2') $$, 'un changement dans les 48 heures');
select results_eq($$ select public.peut_lire_cours('20000000-0000-0000-0000-0000000005a1'), public.peut_lire_cours('20000000-0000-0000-0000-0000000005a2') $$,
  $$ values (false, true) $$, 'le nouveau cours remplace l''ancien');
select throws_ok($$ select public.choisir_cours_gratuit('20000000-0000-0000-0000-0000000005a1') $$,
  'P0001', 'choix_definitif', 'un seul changement');
select results_eq($$ select cours_gratuit_id, changement_possible_jusqu_au is null, en_essai from public.mon_acces() $$,
  $$ values ('20000000-0000-0000-0000-0000000005a2'::uuid, true, false) $$, 'mon_acces reflète le choix');
select throws_ok($$ insert into public.acces_gratuit (eleve_id, cours_id) values ('00000000-0000-0000-0000-0000000005a1', '20000000-0000-0000-0000-0000000005a1') $$,
  '42501', null, 'pas d''écriture directe');

-- Une tentative commencée il y a moins de 24 heures garde l'accès à son cours.
reset role;
insert into public.tentative (eleve_id, type, cours_id, nb_questions, debut, date_limite, statut) values
  ('00000000-0000-0000-0000-0000000005a1', 'evaluation_cours', '20000000-0000-0000-0000-0000000005a1', 40, now() - interval '1 hour', now() + interval '1 hour', 'en_cours');
set local role authenticated;
select is(public.peut_lire_cours('20000000-0000-0000-0000-0000000005a1'), true, 'une tentative en cours de moins de 24 heures garde l''accès');

select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000005a3","role":"authenticated"}', true);
select throws_ok($$ select public.choisir_cours_gratuit('20000000-0000-0000-0000-0000000005a2') $$,
  'P0001', 'choix_definitif', 'après 48 heures, le choix est définitif');
reset role;
update public.tentative set debut = now() - interval '25 hours' where eleve_id = '00000000-0000-0000-0000-0000000005a1';
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000005a1","role":"authenticated"}', true);
select is(public.peut_lire_cours('20000000-0000-0000-0000-0000000005a1'), false, 'au-delà de 24 heures, plus d''accès');

select * from finish();
rollback;
```

- [ ] **Step 2 : vérifier l'échec**

Run : `export PATH="$HOME/.orbstack/bin:$PATH"; npm run test:db`
Expected : FAIL sur `acces_gratuit.test.sql`.

- [ ] **Step 3 : écrire la migration**

`supabase/migrations/20261222000001_acces_gratuit.sql` :

```sql
-- Accès après l'essai : un cours gratuit, modifiable une fois dans les 48 heures.

create table public.acces_gratuit (
  eleve_id uuid primary key references public.profil on delete cascade,
  cours_id uuid not null references public.cours on delete restrict,
  choisi_le timestamptz not null default now(),
  change_utilise boolean not null default false,
  modifie_le timestamptz
);
alter table public.acces_gratuit enable row level security;
create policy "son cours gratuit" on public.acces_gratuit for select to authenticated using (eleve_id = (select auth.uid()));
revoke all on public.acces_gratuit from anon, authenticated;
grant select on public.acces_gratuit to authenticated;

-- Ordre de l'accès d'un élève : essai, cours gratuit, tentative en cours de moins de 24 heures.
-- (La tâche du consentement ajoute le blocage des moins de 15 ans ; l'étape 5b ajoutera l'abonnement en tête.)
create or replace function public.peut_lire_cours(p_cours uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select case
    when auth.uid() is null then false
    when public.role_actuel() = 'admin_contenu' then true
    when not exists (select 1 from public.cours where id = p_cours and publie) then false
    when public.role_actuel() = 'enseignant' then true
    else public.en_essai()
      or exists (select 1 from public.acces_gratuit a where a.eleve_id = auth.uid() and a.cours_id = p_cours)
      or exists (select 1 from public.tentative t
                  where t.eleve_id = auth.uid() and t.cours_id = p_cours
                    and t.statut = 'en_cours' and t.debut > now() - interval '24 hours')
  end
$$;

create function public.choisir_cours_gratuit(p_cours uuid) returns void
language plpgsql security definer set search_path = '' as $$
declare
  v public.acces_gratuit;
begin
  if public.role_actuel() is distinct from 'eleve' then
    raise exception 'reserve_eleves';
  end if;
  if public.en_essai() then
    raise exception 'essai_en_cours';
  end if;
  if not exists (select 1 from public.cours where id = p_cours and publie) then
    raise exception 'cours_indisponible';
  end if;
  select * into v from public.acces_gratuit where eleve_id = auth.uid() for update;
  if not found then
    insert into public.acces_gratuit (eleve_id, cours_id) values (auth.uid(), p_cours)
    on conflict (eleve_id) do nothing;
    return;
  end if;
  if v.cours_id = p_cours then
    return;
  end if;
  if v.change_utilise or v.choisi_le < now() - interval '48 hours' then
    raise exception 'choix_definitif';
  end if;
  update public.acces_gratuit set cours_id = p_cours, change_utilise = true, modifie_le = now()
   where eleve_id = auth.uid();
end $$;

create function public.mon_acces()
returns table (role text, en_essai boolean, fin_essai timestamptz, cours_gratuit_id uuid, changement_possible_jusqu_au timestamptz)
language sql stable security definer set search_path = '' as $$
  select p.role::text, public.en_essai(), p.inscrit_le + interval '7 days', a.cours_id,
         case when a.cours_id is not null and not a.change_utilise and a.choisi_le > now() - interval '48 hours'
              then a.choisi_le + interval '48 hours' end
    from public.profil p
    left join public.acces_gratuit a on a.eleve_id = p.id
   where p.id = auth.uid()
$$;

revoke execute on function public.choisir_cours_gratuit(uuid), public.mon_acces() from public, anon;
grant execute on function public.choisir_cours_gratuit(uuid), public.mon_acces() to authenticated;
```

Vérifier avant d'écrire : la définition actuelle de `peut_lire_cours` (et ses droits, conservés par `create or replace`) ; que `en_essai()` compte bien 7 jours depuis `profil.inscrit_le`.

`src/lib/erreurs.ts` (avec un test du texte exact pour chacun) :

```ts
  essai_en_cours: 'Ton essai n’est pas terminé : tous les cours sont encore ouverts.',
  choix_definitif: 'Ton choix de cours gratuit est définitif.',
```

(écrire ` ` avant « : » dans le premier message, comme les autres messages du fichier).

- [ ] **Step 4 : appliquer et vérifier**

Run : `export PATH="$HOME/.orbstack/bin:$PATH"; npm run db:reset && npx supabase gen types typescript --local > src/lib/supabase/types.ts && npm run test:db && npm test && npm run typecheck`
Expected : PASS, dont `acces_gratuit.test.sql` 15/15 et toute la suite existante. Si un test existant comptait sur l'absence d'accès après l'essai, il reste valable (aucun cours gratuit choisi) ; ne modifier aucune assertion existante sans le signaler.

- [ ] **Step 5 : commit**

```bash
git add supabase/migrations/20261222000001_acces_gratuit.sql supabase/tests/acces_gratuit.test.sql src/lib/erreurs.ts src/lib/erreurs.test.ts src/lib/supabase/types.ts
git commit -m "Ouvre un cours gratuit après l'essai et garde l'accès aux tentatives en cours

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 2 : consentement parental côté base

**Files :**
- Create : `supabase/migrations/20261222000002_consentement.sql`, `supabase/tests/consentement.test.sql`
- Modify : `supabase/tests/rls_socle.test.sql`, `src/lib/erreurs.ts`, `src/lib/erreurs.test.ts`, `src/lib/supabase/types.ts`

**Interfaces :**
- Consumes : `peut_lire_cours` et `mon_acces` (tâche 1, corps de `20261222000001_acces_gratuit.sql`) ; `public.profil(moins_de_15_ans, onboarding_termine, nom)`.
- Produces :
  - table `public.consentement_parental(eleve_id, email_parent, jeton_empreinte, demande_le, dernier_envoi_le, envois_du_jour, jour_envois, donne_le)` ;
  - `prive.consentement_requis(p_eleve uuid) returns boolean` ;
  - `public.demander_consentement(p_email text) returns text` (le jeton en clair, pour l'e-mail) ;
  - `public.lire_demande_consentement(p_jeton text) returns table (prenom text, deja_donne boolean)` (anon et authenticated) ;
  - `public.donner_consentement(p_jeton text) returns text` (le prénom ; anon et authenticated) ;
  - `public.mon_acces()` recréée avec trois colonnes de plus : `consentement_requis boolean`, `email_parent text`, `consentement_envoye_le timestamptz` ;
  - codes : `age_verrouille`, `consentement_inutile`, `email_parent_invalide`, `consentement_deja_donne`, `envoi_trop_rapproche`, `envois_epuises`, `lien_consentement_invalide`.

- [ ] **Step 1 : écrire le test**

`supabase/tests/consentement.test.sql` :

```sql
begin;
select plan(16);

insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-0000000005b1', 'jeune@test.local'),
  ('00000000-0000-0000-0000-0000000005b2', 'grand@test.local');
update public.profil set onboarding_termine = true, moins_de_15_ans = true, nom = 'Léa'
 where id = '00000000-0000-0000-0000-0000000005b1';
update public.profil set onboarding_termine = true, moins_de_15_ans = false where id = '00000000-0000-0000-0000-0000000005b2';
insert into public.filiere (id, voie, code, nom) values ('10000000-0000-0000-0000-0000000005b1', 'technologique', 'CSP', 'Filière consentement');
insert into public.cours (id, slug, filiere_id, niveau_code, matiere, titre, publie) values
  ('20000000-0000-0000-0000-0000000005b1', 'cours-consentement', '10000000-0000-0000-0000-0000000005b1', '1re', 'C', 'Cours consentement', true);

set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000005b1","role":"authenticated"}', true);
select is(public.peut_lire_cours('20000000-0000-0000-0000-0000000005b1'), false, 'moins de 15 ans sans accord : aucun cours, même pendant l''essai');
select is((select consentement_requis from public.mon_acces()), true, 'mon_acces signale le consentement requis');
select throws_ok($$ update public.profil set moins_de_15_ans = false where id = '00000000-0000-0000-0000-0000000005b1' $$,
  'P0001', 'age_verrouille', 'l''âge ne change plus après l''inscription');
select throws_ok($$ select public.demander_consentement('pas-une-adresse') $$, 'P0001', 'email_parent_invalide', 'adresse refusée');
select lives_ok($$ select set_config('test.jeton', public.demander_consentement('  Parent@Example.FR '), true) $$, 'demande envoyée');
select is((select email_parent from public.consentement_parental), 'parent@example.fr', 'adresse nettoyée et en minuscules');
select throws_ok($$ select public.demander_consentement('parent@example.fr') $$, 'P0001', 'envoi_trop_rapproche', 'pas deux envois en 10 minutes');
select throws_ok($$ select jeton_empreinte from public.consentement_parental $$, '42501', null, 'l''empreinte du jeton n''est pas lisible');

select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000005b2","role":"authenticated"}', true);
select throws_ok($$ select public.demander_consentement('parent@example.fr') $$, 'P0001', 'consentement_inutile', 'pas de demande pour un élève de 15 ans ou plus');

reset role;
set local role anon;
select throws_ok($$ select * from public.lire_demande_consentement('mauvais') $$, 'P0001', 'lien_consentement_invalide', 'jeton mal formé refusé');
select results_eq(format('select prenom, deja_donne from public.lire_demande_consentement(%L)', current_setting('test.jeton')),
  $$ values ('Léa'::text, false) $$, 'le parent voit le prénom');
select is(public.donner_consentement(current_setting('test.jeton')), 'Léa', 'le parent donne son accord');
select results_eq(format('select deja_donne from public.lire_demande_consentement(%L)', current_setting('test.jeton')),
  $$ values (true) $$, 'l''accord est enregistré');

reset role;
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000005b1","role":"authenticated"}', true);
select is(public.peut_lire_cours('20000000-0000-0000-0000-0000000005b1'), true, 'après l''accord, l''essai s''applique');
select throws_ok($$ select public.demander_consentement('autre@example.fr') $$, 'P0001', 'consentement_deja_donne', 'plus de demande après l''accord');

-- Lien expiré : demande de plus de 7 jours, sans accord.
reset role;
update public.consentement_parental set donne_le = null, demande_le = now() - interval '8 days';
set local role anon;
select throws_ok(format('select public.donner_consentement(%L)', current_setting('test.jeton')),
  'P0001', 'lien_consentement_invalide', 'un lien de plus de 7 jours ne vaut plus');

select * from finish();
rollback;
```

- [ ] **Step 2 : vérifier l'échec**

Run : `export PATH="$HOME/.orbstack/bin:$PATH"; npm run test:db`
Expected : FAIL sur `consentement.test.sql`.

- [ ] **Step 3 : écrire la migration**

`supabase/migrations/20261222000002_consentement.sql` :

```sql
-- Consentement parental des moins de 15 ans : demande par e-mail, accord par lien, accès bloqué en attendant.

create table public.consentement_parental (
  eleve_id uuid primary key references public.profil on delete cascade,
  email_parent text not null check (char_length(email_parent) between 3 and 254),
  jeton_empreinte bytea not null unique,
  demande_le timestamptz not null default now(),
  dernier_envoi_le timestamptz not null default now(),
  envois_du_jour smallint not null default 1 check (envois_du_jour >= 0),
  jour_envois date not null default ((now() at time zone 'Europe/Paris')::date),
  donne_le timestamptz
);
alter table public.consentement_parental enable row level security;
create policy "son consentement" on public.consentement_parental for select to authenticated using (eleve_id = (select auth.uid()));
revoke all on public.consentement_parental from anon, authenticated;
grant select (eleve_id, email_parent, demande_le, dernier_envoi_le, donne_le) on public.consentement_parental to authenticated;

-- L'indicateur « moins de 15 ans » est figé une fois l'inscription terminée.
create function prive.verrouiller_age() returns trigger
language plpgsql set search_path = '' as $$
begin
  if old.onboarding_termine and new.moins_de_15_ans is distinct from old.moins_de_15_ans then
    raise exception 'age_verrouille';
  end if;
  return new;
end $$;
revoke execute on function prive.verrouiller_age() from public;
create trigger verrouiller_age before update of moins_de_15_ans on public.profil
  for each row execute function prive.verrouiller_age();

create function prive.consentement_requis(p_eleve uuid) returns boolean
language sql stable set search_path = '' as $$
  select exists (
    select 1 from public.profil p
     where p.id = p_eleve and p.role = 'eleve' and p.moins_de_15_ans
       and not exists (select 1 from public.consentement_parental c where c.eleve_id = p.id and c.donne_le is not null))
$$;
revoke execute on function prive.consentement_requis(uuid) from public;
```

Puis, en recopiant le corps de la tâche 1 :
- `public.peut_lire_cours` : ajouter, juste avant `else public.en_essai() …`, la branche `when prive.consentement_requis(auth.uid()) then false`.
- `public.mon_acces()` : `drop function public.mon_acces();` puis la recréer avec les colonnes de la tâche 1 suivies de `consentement_requis boolean, email_parent text, consentement_envoye_le timestamptz` — valeurs `prive.consentement_requis(p.id)`, `c.email_parent`, `c.dernier_envoi_le` (`left join public.consentement_parental c on c.eleve_id = p.id`) ; mêmes droits qu'avant.

Ensuite :

```sql
create function public.demander_consentement(p_email text) returns text
language plpgsql security definer set search_path = '' as $$
declare
  v public.consentement_parental;
  v_email text := lower(btrim(coalesce(p_email, '')));
  v_jour date := (now() at time zone 'Europe/Paris')::date;
  v_jeton text;
begin
  if public.role_actuel() is distinct from 'eleve' then
    raise exception 'reserve_eleves';
  end if;
  if not exists (select 1 from public.profil where id = auth.uid() and moins_de_15_ans and onboarding_termine) then
    raise exception 'consentement_inutile';
  end if;
  if char_length(v_email) not between 3 and 254 or v_email !~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$' then
    raise exception 'email_parent_invalide';
  end if;
  select * into v from public.consentement_parental where eleve_id = auth.uid() for update;
  if found then
    if v.donne_le is not null then
      raise exception 'consentement_deja_donne';
    end if;
    if v.dernier_envoi_le > now() - interval '10 minutes' then
      raise exception 'envoi_trop_rapproche';
    end if;
    if v.jour_envois = v_jour and v.envois_du_jour >= 5 then
      raise exception 'envois_epuises';
    end if;
  end if;
  -- Jeton de 256 bits en base64url sans remplissage (43 caractères) ; seule l'empreinte est gardée.
  v_jeton := translate(encode(extensions.gen_random_bytes(32), 'base64'), '+/=', '-_');
  insert into public.consentement_parental as c (eleve_id, email_parent, jeton_empreinte)
    values (auth.uid(), v_email, extensions.digest(v_jeton, 'sha256'))
  on conflict (eleve_id) do update set
    email_parent = excluded.email_parent,
    jeton_empreinte = excluded.jeton_empreinte,
    demande_le = now(),
    dernier_envoi_le = now(),
    envois_du_jour = case when c.jour_envois = v_jour then c.envois_du_jour + 1 else 1 end,
    jour_envois = v_jour;
  return v_jeton;
end $$;

create function public.lire_demande_consentement(p_jeton text)
returns table (prenom text, deja_donne boolean)
language plpgsql stable security definer set search_path = '' as $$
#variable_conflict use_column
begin
  if p_jeton is null or p_jeton !~ '^[A-Za-z0-9_-]{43}$' then
    raise exception 'lien_consentement_invalide';
  end if;
  return query
    select coalesce(p.nom, '')::text, c.donne_le is not null
      from public.consentement_parental c join public.profil p on p.id = c.eleve_id
     where c.jeton_empreinte = extensions.digest(p_jeton, 'sha256')
       and (c.donne_le is not null or c.demande_le > now() - interval '7 days');
  if not found then
    raise exception 'lien_consentement_invalide';
  end if;
end $$;

create function public.donner_consentement(p_jeton text) returns text
language plpgsql security definer set search_path = '' as $$
declare
  v_prenom text;
begin
  if p_jeton is null or p_jeton !~ '^[A-Za-z0-9_-]{43}$' then
    raise exception 'lien_consentement_invalide';
  end if;
  update public.consentement_parental c set donne_le = coalesce(c.donne_le, now())
    from public.profil p
   where p.id = c.eleve_id
     and c.jeton_empreinte = extensions.digest(p_jeton, 'sha256')
     and (c.donne_le is not null or c.demande_le > now() - interval '7 days')
  returning coalesce(p.nom, '') into v_prenom;
  if not found then
    raise exception 'lien_consentement_invalide';
  end if;
  return v_prenom;
end $$;

revoke execute on function public.demander_consentement(text) from public, anon;
grant execute on function public.demander_consentement(text) to authenticated;
revoke execute on function public.lire_demande_consentement(text), public.donner_consentement(text) from public;
grant execute on function public.lire_demande_consentement(text), public.donner_consentement(text) to anon, authenticated;
```

`supabase/tests/rls_socle.test.sql`, test « anonyme : aucun EXECUTE » : ajouter `'lire_demande_consentement'` et `'donner_consentement'` à la liste des exceptions, et le préciser dans le libellé.

`src/lib/erreurs.ts` (avec un test du texte exact pour chacun ; ` ` avant « : ; ! ? ») :

```ts
  age_verrouille: 'Ton âge ne peut plus être modifié après l’inscription.',
  consentement_inutile: 'L’accord d’un parent n’est demandé qu’aux élèves de moins de 15 ans.',
  email_parent_invalide: 'Indique une adresse e-mail valide pour ton parent.',
  consentement_deja_donne: 'Ton parent a déjà donné son accord.',
  envoi_trop_rapproche: 'Attends 10 minutes avant d’envoyer un nouvel e-mail.',
  envois_epuises: 'Tu as envoyé 5 e-mails aujourd’hui. Réessaie demain.',
  lien_consentement_invalide: 'Ce lien n’est plus valable. Demandez à votre enfant de vous en envoyer un nouveau.',
```

Vérifier par un court script qu'aucun de ces codes n'est sous-chaîne d'un code existant ni ne le contient (`jeton_inconnu`, `essais_epuises`… compris).

- [ ] **Step 4 : appliquer et vérifier**

Run : `export PATH="$HOME/.orbstack/bin:$PATH"; npm run db:reset && npx supabase gen types typescript --local > src/lib/supabase/types.ts && npm run test:db && npm test && npm run typecheck`
Expected : PASS, dont `consentement.test.sql` 16/16, `acces_gratuit.test.sql` et `rls_socle.test.sql`.

Point d'attention : l'inscription actuelle écrit `moins_de_15_ans` et `onboarding_termine = true` dans la même mise à jour (`src/app/bienvenue/actions.ts`) ; le déclencheur le permet (ancien `onboarding_termine` à faux). Le vérifier avec le parcours d'inscription existant (e2e de la tâche 9).

- [ ] **Step 5 : commit**

```bash
git add supabase/migrations/20261222000002_consentement.sql supabase/tests/consentement.test.sql supabase/tests/rls_socle.test.sql src/lib/erreurs.ts src/lib/erreurs.test.ts src/lib/supabase/types.ts
git commit -m "Bloque l'accès des moins de 15 ans jusqu'à l'accord d'un parent

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 3 : envoi d'e-mails

**Files :**
- Create : `src/lib/email/config.ts`, `src/lib/email/config.test.ts`, `src/lib/email/envoyer.ts`, `src/lib/email/modeles.ts`, `src/lib/email/modeles.test.ts`
- Modify : `package.json` (`nodemailer`, `@types/nodemailer`), `supabase/config.toml`, `.env.example`, `src/lib/env.ts`, `src/lib/env.test.ts`

**Interfaces :**
- Produces :
  - `lireConfigSmtp(env: Record<string, string | undefined>): ConfigSmtp | null` avec `type ConfigSmtp = { hote: string; port: number; utilisateur?: string; motDePasse?: string; expediteur: string }` ;
  - `envoyerEmail(message: { a: string; sujet: string; texte: string; html: string }): Promise<void>` (lève `Error('email_non_configure')` sans configuration, `Error('email_echec')` si l'envoi échoue) ;
  - `emailConsentement(o: { prenom: string; lien: string }): { sujet: string; texte: string; html: string }`.

- [ ] **Step 1 : tests**

`src/lib/email/config.test.ts` :

```ts
import { describe, expect, it } from 'vitest';
import { lireConfigSmtp } from './config';

describe('lireConfigSmtp', () => {
  it('lit une configuration complète', () => {
    expect(lireConfigSmtp({ SMTP_HOTE: 'smtp.example.eu', SMTP_PORT: '587', SMTP_UTILISATEUR: 'u', SMTP_MOT_DE_PASSE: 'p', EMAIL_EXPEDITEUR: 'App lycée <noreply@example.fr>' }))
      .toEqual({ hote: 'smtp.example.eu', port: 587, utilisateur: 'u', motDePasse: 'p', expediteur: 'App lycée <noreply@example.fr>' });
  });
  it('accepte un serveur sans authentification (Mailpit en local)', () => {
    expect(lireConfigSmtp({ SMTP_HOTE: '127.0.0.1', SMTP_PORT: '54325', EMAIL_EXPEDITEUR: 'noreply@app-lycee.local' }))
      .toEqual({ hote: '127.0.0.1', port: 54325, utilisateur: undefined, motDePasse: undefined, expediteur: 'noreply@app-lycee.local' });
  });
  it('renvoie null si l’hôte, le port ou l’expéditeur manque ou si le port est invalide', () => {
    expect(lireConfigSmtp({})).toBeNull();
    expect(lireConfigSmtp({ SMTP_HOTE: 'h', SMTP_PORT: 'abc', EMAIL_EXPEDITEUR: 'e@x.fr' })).toBeNull();
    expect(lireConfigSmtp({ SMTP_HOTE: 'h', SMTP_PORT: '587' })).toBeNull();
  });
});
```

`src/lib/email/modeles.test.ts` :

```ts
import { describe, expect, it } from 'vitest';
import { emailConsentement } from './modeles';

describe('emailConsentement', () => {
  const m = emailConsentement({ prenom: 'Léa', lien: 'https://app.example.fr/accord-parental/abc' });
  it('vouvoie le parent et donne le lien', () => {
    expect(m.sujet).toBe('Léa a besoin de votre accord pour utiliser App lycée');
    expect(m.texte).toContain('https://app.example.fr/accord-parental/abc');
    expect(m.texte).toContain('Ce lien est valable 7 jours.');
    expect(m.html).toContain('href="https://app.example.fr/accord-parental/abc"');
  });
  it('échappe le prénom dans le HTML', () => {
    const x = emailConsentement({ prenom: '<b>Léa</b>', lien: 'https://a.fr/accord-parental/x' });
    expect(x.html).not.toContain('<b>Léa</b>');
    expect(x.html).toContain('&lt;b&gt;Léa&lt;/b&gt;');
  });
  it('n’accepte qu’un lien https ou local', () => {
    expect(() => emailConsentement({ prenom: 'Léa', lien: 'javascript:alert(1)' })).toThrow();
  });
});
```

Run : `npx vitest run src/lib/email`
Expected : FAIL (modules absents).

- [ ] **Step 2 : code**

`src/lib/email/config.ts` :

```ts
export type ConfigSmtp = { hote: string; port: number; utilisateur?: string; motDePasse?: string; expediteur: string };

/** Configuration SMTP lue dans l'environnement ; null si incomplète. */
export function lireConfigSmtp(env: Record<string, string | undefined>): ConfigSmtp | null {
  const port = Number(env.SMTP_PORT);
  if (!env.SMTP_HOTE || !env.EMAIL_EXPEDITEUR || !Number.isInteger(port) || port < 1 || port > 65535) return null;
  return {
    hote: env.SMTP_HOTE, port, utilisateur: env.SMTP_UTILISATEUR || undefined,
    motDePasse: env.SMTP_MOT_DE_PASSE || undefined, expediteur: env.EMAIL_EXPEDITEUR,
  };
}
```

`src/lib/email/envoyer.ts` (vérifier l'API `createTransport` et `sendMail` de `nodemailer` avec context7) :

```ts
import 'server-only';
import nodemailer from 'nodemailer';
import { lireConfigSmtp } from './config';

export type Message = { a: string; sujet: string; texte: string; html: string };

/** Envoie un e-mail par SMTP. Les erreurs ne contiennent ni l'adresse ni le contenu. */
export async function envoyerEmail(m: Message): Promise<void> {
  const config = lireConfigSmtp(process.env);
  if (!config) throw new Error('email_non_configure');
  const transport = nodemailer.createTransport({
    host: config.hote, port: config.port, secure: config.port === 465,
    auth: config.utilisateur ? { user: config.utilisateur, pass: config.motDePasse } : undefined,
    connectionTimeout: 10_000, greetingTimeout: 10_000, socketTimeout: 15_000,
  });
  try {
    await transport.sendMail({ from: config.expediteur, to: m.a, subject: m.sujet, text: m.texte, html: m.html });
  } catch {
    throw new Error('email_echec');
  }
}
```

(Si le paquet `server-only` n'est pas déjà utilisé dans le dépôt, l'ajouter ou retirer cette ligne et le signaler.)

`src/lib/email/modeles.ts` :

```ts
const echapper = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

/** E-mail envoyé au parent d'un élève de moins de 15 ans (vouvoiement). */
export function emailConsentement(o: { prenom: string; lien: string }): { sujet: string; texte: string; html: string } {
  if (!/^https?:\/\//.test(o.lien)) throw new Error('lien invalide');
  const prenom = o.prenom.trim() || 'Votre enfant';
  const sujet = `${prenom} a besoin de votre accord pour utiliser App lycée`;
  const texte = [
    'Bonjour,',
    '',
    `${prenom} s’est inscrit ou inscrite sur App lycée, une application de cours et de quiz pour le lycée.`,
    'Comme il ou elle a moins de 15 ans, nous avons besoin de votre accord avant de lui ouvrir les cours.',
    '',
    `Pour donner votre accord, ouvrez ce lien : ${o.lien}`,
    'Ce lien est valable 7 jours.',
    '',
    'Si vous ne connaissez pas cette demande, ignorez simplement cet e-mail.',
  ].join('\n');
  const lien = echapper(o.lien);
  const html = `<p>Bonjour,</p>
<p>${echapper(prenom)} s’est inscrit ou inscrite sur App lycée, une application de cours et de quiz pour le lycée.
Comme il ou elle a moins de 15 ans, nous avons besoin de votre accord avant de lui ouvrir les cours.</p>
<p><a href="${lien}">Donner mon accord</a></p>
<p>Ce lien est valable 7 jours. Si le bouton ne fonctionne pas, copiez cette adresse dans votre navigateur&nbsp;: ${lien}</p>
<p>Si vous ne connaissez pas cette demande, ignorez simplement cet e-mail.</p>`;
  return { sujet, texte, html };
}
```

`supabase/config.toml`, section `[inbucket]` : activer `smtp_port = 54325`. Redémarrer la base locale (`npx supabase stop && npx supabase start` ; les données sont gardées) et vérifier que le port répond (`nc -z 127.0.0.1 54325`).

`.env.example` :

```
# E-mails (consentement parental). En local, Mailpit reçoit tout : http://127.0.0.1:54324
SMTP_HOTE=127.0.0.1
SMTP_PORT=54325
SMTP_UTILISATEUR=
SMTP_MOT_DE_PASSE=
EMAIL_EXPEDITEUR=App lycée <noreply@app-lycee.local>
```

Ajouter les mêmes lignes à `.env.local` **sans l'afficher** (par exemple avec un court script qui n'ajoute que les clés absentes, comme `scripts/cles-notifications.ts`, ou en étendant ce script).

`src/lib/env.ts` : groupe facultatif « e-mails » — si `lireConfigSmtp(env)` renvoie `null`, avertissement `E-mails désactivés : SMTP_HOTE, SMTP_PORT et EMAIL_EXPEDITEUR sont nécessaires (consentement parental impossible).` ; test correspondant dans `env.test.ts` (adapter les cas existants en y ajoutant une configuration SMTP valide pour qu'ils gardent leurs attentes).

- [ ] **Step 3 : vérifier**

Run : `npx vitest run src/lib/email src/lib/env.test.ts && npm test && npm run typecheck && npm run lint`
Expected : PASS.

Envoi réel vers Mailpit, par un script jetable hors du dépôt (ou `npx tsx -e`), puis lecture de `http://127.0.0.1:54324/api/v1/messages` : le message apparaît avec le bon sujet.

- [ ] **Step 4 : commit**

```bash
git add package.json package-lock.json src/lib/email src/lib/env.ts src/lib/env.test.ts supabase/config.toml .env.example
git commit -m "Ajoute l'envoi d'e-mails par SMTP et le modèle de l'e-mail au parent

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---
### Task 4 : interface — fin de l'essai et cours gratuit

**Files :**
- Create : `src/lib/acces/requetes.ts`, `src/lib/acces/etat.ts`, `src/lib/acces/etat.test.ts`, `src/app/(app)/choisir-cours/page.tsx`, `src/app/(app)/choisir-cours/actions.ts`, `src/components/acces/FormulaireCoursGratuit.tsx`, `src/components/acces/CoursVerrouille.tsx`
- Modify : `src/components/BanniereEssai.tsx`, `src/app/(app)/layout.tsx`, `src/app/(app)/page.tsx`, `src/components/CarteCours.tsx`, `src/app/(app)/cours/[slug]/page.tsx`, `src/app/(app)/cours/[slug]/[chapitre]/page.tsx`, `src/app/(app)/cours/[slug]/evaluation/page.tsx`, `src/lib/erreurs.ts` (si besoin)

**Interfaces :**
- Consumes : RPC `mon_acces()` (tâches 1 et 2), `choisir_cours_gratuit(p_cours)`.
- Produces :
  - `type MonAcces = { role: string; enEssai: boolean; finEssai: string; coursGratuitId: string | null; changementPossibleJusquAu: string | null; consentementRequis: boolean; emailParent: string | null; consentementEnvoyeLe: string | null }` ;
  - `lireMonAcces(): Promise<MonAcces | null>` ;
  - `coursOuvert(acces: MonAcces, coursId: string): boolean` et `doitChoisirCours(acces: MonAcces): boolean` (fonctions pures) ;
  - page `/choisir-cours`, composant `CoursVerrouille`.

- [ ] **Step 1 : tests des fonctions pures**

`src/lib/acces/etat.test.ts` :

```ts
import { describe, expect, it } from 'vitest';
import { coursOuvert, doitChoisirCours, type MonAcces } from './etat';

const base: MonAcces = {
  role: 'eleve', enEssai: false, finEssai: '2026-12-01T10:00:00Z', coursGratuitId: null,
  changementPossibleJusquAu: null, consentementRequis: false, emailParent: null, consentementEnvoyeLe: null,
};

describe('accès', () => {
  it('pendant l’essai, tout est ouvert et rien n’est à choisir', () => {
    const a = { ...base, enEssai: true };
    expect(coursOuvert(a, 'x')).toBe(true);
    expect(doitChoisirCours(a)).toBe(false);
  });
  it('après l’essai sans choix : tout est fermé, il faut choisir', () => {
    expect(coursOuvert(base, 'x')).toBe(false);
    expect(doitChoisirCours(base)).toBe(true);
  });
  it('après le choix : seul le cours gratuit est ouvert', () => {
    const a = { ...base, coursGratuitId: 'x' };
    expect(coursOuvert(a, 'x')).toBe(true);
    expect(coursOuvert(a, 'y')).toBe(false);
    expect(doitChoisirCours(a)).toBe(false);
  });
  it('sans accord parental, rien n’est ouvert', () => {
    expect(coursOuvert({ ...base, enEssai: true, consentementRequis: true }, 'x')).toBe(false);
  });
  it('un enseignant voit tout', () => {
    expect(coursOuvert({ ...base, role: 'enseignant' }, 'x')).toBe(true);
    expect(doitChoisirCours({ ...base, role: 'enseignant' })).toBe(false);
  });
});
```

Run : `npx vitest run src/lib/acces/etat.test.ts` → FAIL (module absent).

- [ ] **Step 2 : code partagé**

`src/lib/acces/etat.ts` :

```ts
export type MonAcces = {
  role: string; enEssai: boolean; finEssai: string; coursGratuitId: string | null;
  changementPossibleJusquAu: string | null; consentementRequis: boolean;
  emailParent: string | null; consentementEnvoyeLe: string | null;
};

/** Même règle que peut_lire_cours côté base (affichage seulement : la base reste la seule à décider). */
export function coursOuvert(a: MonAcces, coursId: string): boolean {
  if (a.role !== 'eleve') return true;
  if (a.consentementRequis) return false;
  return a.enEssai || a.coursGratuitId === coursId;
}

export function doitChoisirCours(a: MonAcces): boolean {
  return a.role === 'eleve' && !a.consentementRequis && !a.enEssai && a.coursGratuitId === null;
}
```

`src/lib/acces/requetes.ts` :

```ts
import { creerClientServeur } from '@/lib/supabase/server';
import type { MonAcces } from './etat';

export async function lireMonAcces(): Promise<MonAcces | null> {
  const supabase = await creerClientServeur();
  const { data, error } = await supabase.rpc('mon_acces');
  const l = data?.[0];
  if (error || !l) return null;
  return {
    role: l.role, enEssai: l.en_essai, finEssai: l.fin_essai, coursGratuitId: l.cours_gratuit_id,
    changementPossibleJusquAu: l.changement_possible_jusqu_au, consentementRequis: l.consentement_requis,
    emailParent: l.email_parent, consentementEnvoyeLe: l.consentement_envoye_le,
  };
}
```

- [ ] **Step 3 : choisir son cours gratuit**

`src/app/(app)/choisir-cours/actions.ts` :

```ts
'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { creerClientServeur } from '@/lib/supabase/server';
import { exigerEleve } from '@/lib/calendrier/garde';
import { messageErreur } from '@/lib/erreurs';

export type EtatChoix = { erreur?: string };

export async function choisirCoursGratuit(_: EtatChoix, form: FormData): Promise<EtatChoix> {
  await exigerEleve();
  const cours = z.string().uuid().safeParse(form.get('cours'));
  if (!cours.success) return { erreur: 'Choisis un cours dans la liste.' };
  const supabase = await creerClientServeur();
  const { error } = await supabase.rpc('choisir_cours_gratuit', { p_cours: cours.data });
  if (error) return { erreur: messageErreur(error.message) };
  revalidatePath('/', 'layout');
  redirect('/');
}
```

`src/app/(app)/choisir-cours/page.tsx` (serveur) :
- `exigerEleve()` ; `lireMonAcces()` ;
- pendant l'essai : message « Ton essai dure jusqu'au {date}. Tous les cours sont ouverts d'ici là. » et lien vers l'accueil ;
- si le choix est définitif (cours choisi et `changementPossibleJusquAu` nul) : « Ton cours gratuit est {titre}. Ce choix est définitif. » ;
- sinon : titre `h1` « Choisis ton cours gratuit », une phrase (« Ce cours reste ouvert sans limite de durée. Tu pourras changer d'avis une seule fois, dans les 48 heures. » ; si un cours est déjà choisi : « Tu peux encore changer une fois, jusqu'au {date et heure}. »), puis `FormulaireCoursGratuit` avec la liste des cours publiés (lire la requête existante qui liste les cours de l'élève, par exemple `listerCoursDuProfil`, et la réutiliser ; à défaut, `cours` publiés triés par `ordre`).

`src/components/acces/FormulaireCoursGratuit.tsx` (client) : `useActionState(choisirCoursGratuit, {})`, un `fieldset` « Cours » avec un bouton radio par cours (titre, matière ; le cours actuel coché), bouton principal « Choisir ce cours » (« Un instant… » pendant l'envoi), message d'erreur `role="alert"` relié au `fieldset` par `aria-describedby` et `aria-invalid` sur le `fieldset`. Si un cours est déjà choisi, une confirmation `window.confirm('Changer de cours gratuit ? Ce sera ton dernier changement.')` avant l'envoi.

- [ ] **Step 4 : états d'accès dans l'application**

- `src/app/(app)/layout.tsx` : lire `lireMonAcces()` pour un élève et passer à `BanniereEssai` l'état complet au lieu du seul nombre de jours. (La redirection vers le consentement est ajoutée par la tâche 5.)
- `src/components/BanniereEssai.tsx` :
  - pendant l'essai : texte actuel ;
  - essai fini sans choix : « Ton essai est terminé. <Link href="/choisir-cours">Choisis ton cours gratuit</Link> pour continuer. » ;
  - essai fini avec un cours choisi et un changement encore possible : « Ton cours gratuit : {titre}. Tu peux encore en changer jusqu'au {date}. » avec un lien ;
  - essai fini avec un choix définitif : rien.
  (Garder `role="status"` et les classes actuelles ; adapter les props et l'appel dans le layout.)
- `src/app/(app)/page.tsx` et `src/components/CarteCours.tsx` : une carte d'un cours fermé (`!coursOuvert(acces, cours.id)`) n'est plus un lien vers le cours ; elle affiche le titre, un badge texte « Verrouillé » et un lien « Choisir ce cours gratuit » vers `/choisir-cours` si `doitChoisirCours(acces)`.
- `src/components/acces/CoursVerrouille.tsx` : `h1` « Ce cours n'est pas ouvert pour toi », une phrase selon l'état (`consentementRequis` → « Ton parent doit d'abord donner son accord. » avec un lien `/consentement` ; `doitChoisirCours` → lien `/choisir-cours` ; sinon « Ton cours gratuit est {titre}. L'abonnement, bientôt disponible, ouvrira tous les cours. ») et un lien vers l'accueil.
- Pages `cours/[slug]`, `cours/[slug]/[chapitre]`, `cours/[slug]/evaluation` : quand la lecture renvoie `null`, regarder si le cours existe et est publié (lecture de `cours` par `slug` — vérifier que la politique RLS de `cours` laisse lire un cours publié sans accès ; sinon, ajouter à la tâche une petite RPC `cours_public_par_slug(p_slug)` qui ne renvoie que `id, titre, couleur`) : s'il existe, rendre `CoursVerrouille` ; sinon `notFound()`.

- [ ] **Step 5 : vérifier**

Run : `npx vitest run src/lib/acces && npm test && npm run typecheck && npm run lint && npm run build`
Expected : PASS.

Contrôle sur le build de production (port 3000, arrêté ensuite) avec un compte élève local dont l'inscription est vieillie de 8 jours par SQL (`update public.profil set inscrit_le = now() - interval '8 days' where email = '…'`, dans le conteneur local) : bannière « Ton essai est terminé », cartes verrouillées, page `/choisir-cours`, choix, puis le cours choisi s'ouvre et un chapitre d'un autre cours affiche `CoursVerrouille` (pas de 404).

- [ ] **Step 6 : commit**

```bash
git add src/lib/acces "src/app/(app)/choisir-cours" src/components/acces src/components/BanniereEssai.tsx "src/app/(app)/layout.tsx" "src/app/(app)/page.tsx" src/components/CarteCours.tsx "src/app/(app)/cours"
git commit -m "Ajoute le choix du cours gratuit et un message clair pour un cours fermé

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 5 : interface — consentement parental

**Files :**
- Create : `src/app/consentement/page.tsx`, `src/app/consentement/actions.ts`, `src/components/consentement/FormulaireDemandeConsentement.tsx`, `src/app/accord-parental/[jeton]/page.tsx`, `src/app/accord-parental/[jeton]/actions.ts`, `src/components/consentement/FormulaireAccord.tsx`
- Modify : `src/app/(app)/layout.tsx`, `src/app/bienvenue/actions.ts`, `src/lib/routes.ts`, `src/lib/routes.test.ts`, `src/lib/erreurs.ts` (+ test)

**Interfaces :**
- Consumes : `demander_consentement`, `lire_demande_consentement`, `donner_consentement` (tâche 2) ; `envoyerEmail`, `emailConsentement` (tâche 3) ; `lireMonAcces` (tâche 4) ; `urlDuSite()` (`src/lib/site.ts`).

- [ ] **Step 1 : redirections**

- `src/app/(app)/layout.tsx` : pour un élève dont `consentementRequis` est vrai, `redirect('/consentement')` (avant tout rendu).
- `src/app/bienvenue/actions.ts` : après l'inscription d'un élève de moins de 15 ans, `redirect('/consentement')` au lieu de l'accueil.
- `src/lib/routes.ts` : ajouter `'/accord-parental'` à `ROUTES_PUBLIQUES` ; test dans `routes.test.ts` (`/accord-parental/xyz` sans session → pas de redirection).
- `/consentement` est hors du groupe `(app)` : la page vérifie elle-même la session (`lireUtilisateur()`, sinon `redirect('/connexion')`) et renvoie à l'accueil un compte qui n'a pas besoin d'accord.

- [ ] **Step 2 : demande côté élève**

`src/app/consentement/actions.ts` :

```ts
'use server';

import { revalidatePath } from 'next/cache';
import { creerClientServeur } from '@/lib/supabase/server';
import { messageErreur } from '@/lib/erreurs';
import { envoyerEmail } from '@/lib/email/envoyer';
import { emailConsentement } from '@/lib/email/modeles';
import { urlDuSite } from '@/lib/site';
import { lireProfil } from '@/lib/supabase/utilisateur';

export type EtatDemande = { erreur?: string; envoye?: boolean; email?: string };

export async function demanderConsentement(_: EtatDemande, form: FormData): Promise<EtatDemande> {
  const email = String(form.get('email') ?? '').trim();
  const supabase = await creerClientServeur();
  const { data: jeton, error } = await supabase.rpc('demander_consentement', { p_email: email });
  if (error || !jeton) return { erreur: messageErreur(error?.message), email };
  const profil = await lireProfil();
  const message = emailConsentement({ prenom: profil?.nom ?? '', lien: `${await urlDuSite()}/accord-parental/${jeton}` });
  try {
    await envoyerEmail({ a: email.toLowerCase(), ...message });
  } catch (e) {
    console.error('consentement : envoi impossible', e instanceof Error ? e.message : 'inconnu');
    return { erreur: 'L’e-mail n’a pas pu partir. Réessaie dans 10 minutes.', email };
  }
  revalidatePath('/consentement');
  return { envoye: true, email: email.toLowerCase() };
}
```

`src/app/consentement/page.tsx` (serveur) : en-tête simple (logo, `BoutonDeconnexion`), `h1` « Il nous faut l'accord d'un parent », texte : « Comme tu as moins de 15 ans, un parent ou ton représentant légal doit accepter que tu utilises App lycée. Indique son adresse e-mail : nous lui envoyons un lien. » Si une demande existe (`emailParent`), afficher « Un e-mail a été envoyé à {email} le {date et heure}. Il est valable 7 jours. » puis le formulaire (pour renvoyer ou changer d'adresse). Liens vers `/confidentialite` et `/mes-donnees`.

`src/components/consentement/FormulaireDemandeConsentement.tsx` (client) : `useActionState`, champ « Adresse e-mail de ton parent » (`type="email"`, `autoComplete="off"`, valeur par défaut = adresse connue), `aria-invalid`/`aria-describedby` sur erreur, bouton « Envoyer la demande » (ou « Renvoyer » si une demande existe), région `role="status"` toujours rendue : « E-mail envoyé à {email}. ».

`src/lib/erreurs.ts` : vérifier que les messages des codes de la tâche 2 conviennent ici (ils s'adressent à l'élève, sauf `lien_consentement_invalide`, qui s'adresse au parent).

- [ ] **Step 3 : accord côté parent**

`src/app/accord-parental/[jeton]/actions.ts` :

```ts
'use server';

import { creerClientServeur } from '@/lib/supabase/server';
import { messageErreur } from '@/lib/erreurs';

export type EtatAccord = { erreur?: string; prenom?: string };

export async function donnerAccord(jeton: string, _: EtatAccord, form: FormData): Promise<EtatAccord> {
  if (form.get('confirme') !== 'on') return { erreur: 'Cochez la case pour confirmer que vous êtes son parent ou son représentant légal.' };
  const supabase = await creerClientServeur();
  const { data, error } = await supabase.rpc('donner_consentement', { p_jeton: jeton });
  if (error) return { erreur: messageErreur(error.message) };
  return { prenom: data ?? '' };
}
```

`src/app/accord-parental/[jeton]/page.tsx` (serveur, public, vouvoiement) :
- `await params` ; RPC `lire_demande_consentement` ; en cas d'erreur : `h1` « Lien expiré ou invalide » et le message de `lien_consentement_invalide` ;
- si `deja_donne` : « Votre accord est déjà enregistré. {Prénom} peut utiliser App lycée. » ;
- sinon : `h1` « Autorisation parentale », paragraphe « {Prénom} souhaite utiliser App lycée, une application de cours et de quiz pour le lycée. Comme il ou elle a moins de 15 ans, votre accord est nécessaire. », une liste courte de ce que l'application garde (prénom, adresse e-mail, filière et niveau, résultats aux quiz, calendrier de révision ; aucune publicité, aucun traceur), un lien vers `/confidentialite`, puis `FormulaireAccord` (bind du jeton : `donnerAccord.bind(null, jeton)`).
- `metadata` : `robots: { index: false }` et `referrer: 'no-referrer'` (le jeton est dans l'URL).

`src/components/consentement/FormulaireAccord.tsx` (client) : case à cocher obligatoire « Je suis son parent ou son représentant légal et j'accepte qu'il ou elle utilise App lycée. », bouton « Je donne mon accord », erreur `role="alert"` reliée à la case, et en cas de succès un message `role="status"` : « Merci, votre accord est enregistré. {Prénom} peut maintenant utiliser l'application. » (le formulaire disparaît).

- [ ] **Step 4 : vérifier**

Run : `npm test && npm run typecheck && npm run lint && npm run build`
Expected : PASS.

Contrôle sur le build de production : un compte de test qui coche « moins de 15 ans » arrive sur `/consentement` ; l'e-mail apparaît dans Mailpit (`http://127.0.0.1:54324`) ; le lien ouvert dans une session privée affiche la page d'accord ; après l'accord, l'élève accède à l'accueil. Aucune violation de CSP sur les deux pages.

- [ ] **Step 5 : commit**

```bash
git add src/app/consentement src/app/accord-parental src/components/consentement "src/app/(app)/layout.tsx" src/app/bienvenue/actions.ts src/lib/routes.ts src/lib/routes.test.ts src/lib/erreurs.ts src/lib/erreurs.test.ts
git commit -m "Demande l'accord d'un parent par e-mail et l'enregistre sur une page dédiée

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 6 : « Mes données » — export et suppression du compte

**Files :**
- Create : `supabase/migrations/20261222000003_mes_donnees.sql`, `supabase/tests/mes_donnees.test.sql`, `src/app/mes-donnees/page.tsx`, `src/app/mes-donnees/actions.ts`, `src/app/mes-donnees/export/route.ts`, `src/components/donnees/SuppressionCompte.tsx`, `src/components/BanniereSuppression.tsx`
- Modify : `src/app/(app)/layout.tsx`, `src/lib/supabase/types.ts`

**Interfaces :**
- Produces :
  - colonne `profil.suppression_demandee_le timestamptz` ;
  - `public.exporter_mes_donnees() returns jsonb` ;
  - `public.demander_suppression_compte() returns timestamptz` (date de suppression prévue) et `public.annuler_suppression_compte() returns void` ;
  - `prive.purges_quotidiennes() returns void` et la tâche `pg_cron` `purges-quotidiennes` (`23 3 * * *`).

- [ ] **Step 1 : écrire le test**

`supabase/tests/mes_donnees.test.sql` — fixtures : un élève (`…5c1`) avec une classe d'un enseignant (`…5c2`), une tentative, un événement, des préférences de notification ; un autre élève (`…5c3`). Assertions (adapter les insertions aux colonnes réelles, en suivant les tests existants) :
1. l'élève 5c1 appelle `exporter_mes_donnees()` : l'objet a les clés `profil`, `classes`, `progression_chapitres`, `progression_cours`, `tentatives`, `historique_questions`, `evenements`, `plans_revision`, `preferences_notification`, `appareils`, `notifications`, `consentement`, `acces_gratuit` (`select array(select jsonb_object_keys(...) order by 1)`) ;
2. l'export contient sa tentative (avec ses réponses) et son événement, et **rien** de l'élève 5c3 (compter les tentatives exportées) ;
3. `appareils` ne contient ni `endpoint` ni clé (`p256dh`, `auth`) ;
4. `demander_suppression_compte()` renvoie une date à 30 jours (± 1 minute) et remplit `suppression_demandee_le` ;
5. `annuler_suppression_compte()` la remet à nul ;
6. après une demande vieillie de 31 jours (mise à jour en `postgres`), `prive.purges_quotidiennes()` supprime l'élève de `auth.users` et de `public.profil`, ainsi que sa tentative et son événement (cascade) ;
7. une demande de 29 jours n'est pas purgée ;
8. un enseignant dont la suppression est échue est purgé avec ses classes (vérifier les clés étrangères de `classe` vers `profil` et supprimer les classes dans la fonction si elles ne sont pas en cascade) ;
9. un départ de classe (`prive.depart_classe`) de plus de 30 jours est purgé, un départ récent est gardé ;
10. `cron.job` contient `purges-quotidiennes`.
`plan(N)` au nombre exact d'assertions.

- [ ] **Step 2 : vérifier l'échec**

Run : `export PATH="$HOME/.orbstack/bin:$PATH"; npm run test:db` → FAIL sur `mes_donnees.test.sql`.

- [ ] **Step 3 : écrire la migration**

`supabase/migrations/20261222000003_mes_donnees.sql` :

```sql
-- Mes données : export JSON, suppression du compte définitive après 30 jours, purges quotidiennes.

alter table public.profil add column suppression_demandee_le timestamptz;

create function public.demander_suppression_compte() returns timestamptz
language plpgsql security definer set search_path = '' as $$
declare
  v timestamptz;
begin
  if auth.uid() is null then
    raise exception 'non_connecte';
  end if;
  update public.profil set suppression_demandee_le = coalesce(suppression_demandee_le, now())
   where id = auth.uid()
  returning suppression_demandee_le + interval '30 days' into v;
  return v;
end $$;

create function public.annuler_suppression_compte() returns void
language plpgsql security definer set search_path = '' as $$
begin
  if auth.uid() is null then
    raise exception 'non_connecte';
  end if;
  update public.profil set suppression_demandee_le = null where id = auth.uid();
end $$;
```

`public.exporter_mes_donnees()` (`language sql stable security definer set search_path = ''`) : un `jsonb_build_object` avec une clé par ensemble listé au Step 1, chacune `coalesce((select jsonb_agg(… order by …) from … where … = auth.uid()), '[]'::jsonb)` (ou un objet pour `profil`, `consentement`, `acces_gratuit`, `preferences_notification`). Lire les colonnes réelles de chaque table et n'exporter que des données de la personne :
- `profil` : nom, e-mail, rôle, filière (nom), niveau, `moins_de_15_ans`, `inscrit_le`, `etablissement`, `suppression_demandee_le` ;
- `classes` : nom de la classe, nom de l'enseignant, date d'arrivée ; pour un enseignant, `classes_creees` (nom, code, date) ;
- `tentatives` : type, cours (titre), chapitre (titre), dates, statut, note, et pour chacune la liste des questions (énoncé), réponses données et justesse ;
- `evenements` (avec les titres des chapitres liés), `plans_revision`, `notifications` (titre, corps, date prévue, statut, date de lecture) ;
- `appareils` : `appareil` et `cree_le` seulement ;
- `consentement` : adresse du parent, dates de demande et d'accord (jamais l'empreinte du jeton).

```sql
-- Chaque nuit : comptes dont la suppression est échue, départs de classe de plus de 30 jours.
create function prive.purges_quotidiennes() returns void
language plpgsql security definer set search_path = '' as $$
begin
  -- Les classes d'un enseignant supprimé partent avec lui (lignes ajoutées si leur clé étrangère n'est pas en cascade).
  delete from auth.users u
   using public.profil p
   where p.id = u.id and p.suppression_demandee_le < now() - interval '30 days';
  delete from prive.depart_classe where quitte_le < now() - interval '30 days';
end $$;
revoke execute on function prive.purges_quotidiennes() from public;

select cron.unschedule(jobid) from cron.job where jobname = 'purges-quotidiennes';
select cron.schedule('purges-quotidiennes', '23 3 * * *', $$select prive.purges_quotidiennes()$$);

revoke execute on function public.exporter_mes_donnees(), public.demander_suppression_compte(), public.annuler_suppression_compte() from public, anon;
grant execute on function public.exporter_mes_donnees(), public.demander_suppression_compte(), public.annuler_suppression_compte() to authenticated;
```

(Vérifier le nom de la colonne de date de `prive.depart_classe` dans `20261117000003_classes.sql` et l'adapter ; vérifier qu'une suppression dans `auth.users` cascade bien jusqu'à `public.profil` puis à toutes les tables de l'élève, et qu'aucune clé étrangère `restrict` ne bloque — `signalement.traite_par` est en `set null`.)

- [ ] **Step 4 : interface**

`src/app/mes-donnees/export/route.ts` :

```ts
import { creerClientServeur } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const supabase = await creerClientServeur();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Response('Connecte-toi pour télécharger tes données.', { status: 401 });
  const { data, error } = await supabase.rpc('exporter_mes_donnees');
  if (error) return new Response('Export impossible pour le moment.', { status: 503 });
  const jour = new Date().toISOString().slice(0, 10);
  return new Response(JSON.stringify(data, null, 2), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Disposition': `attachment; filename="mes-donnees-${jour}.json"`,
      'Cache-Control': 'no-store',
    },
  });
}
```

`src/app/mes-donnees/actions.ts` : `demanderSuppression()` et `annulerSuppression()` (RPC, `revalidatePath('/', 'layout')`).

`src/app/mes-donnees/page.tsx` (hors du groupe `(app)`, pour rester accessible à un élève en attente d'accord parental ; vérifie la session) : `h1` « Mes données » ;
- section « Télécharger mes données » : texte (« Un fichier JSON avec tout ce que l'application garde sur toi. ») et lien bouton `<a href="/mes-donnees/export" download>` ;
- section « Supprimer mon compte » (`SuppressionCompte`) : explication (« Ton compte et tous tes résultats seront supprimés 30 jours après ta demande. Tu peux annuler jusque-là en te reconnectant. »), case à cocher « Je comprends que la suppression sera définitive », bouton « Demander la suppression » ; si une demande existe : « Ton compte sera supprimé le {date}. » et un bouton « Annuler la suppression ».

`src/components/BanniereSuppression.tsx` + `src/app/(app)/layout.tsx` : si `profil.suppression_demandee_le` est rempli, bannière `role="status"` « Ton compte sera supprimé le {date}. <Link href="/mes-donnees">Annuler la suppression</Link> ».

- [ ] **Step 5 : vérifier**

Run : `export PATH="$HOME/.orbstack/bin:$PATH"; npm run db:reset && npx supabase gen types typescript --local > src/lib/supabase/types.ts && npm run test:db && npm test && npm run typecheck && npm run lint && npm run build`
Expected : PASS, dont `mes_donnees.test.sql`.

- [ ] **Step 6 : commit**

```bash
git add supabase/migrations/20261222000003_mes_donnees.sql supabase/tests/mes_donnees.test.sql src/app/mes-donnees src/components/donnees src/components/BanniereSuppression.tsx "src/app/(app)/layout.tsx" src/lib/supabase/types.ts
git commit -m "Ajoute l'export de mes données et la suppression du compte après 30 jours

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 7 : classes — retour bloqué après un retrait

**Files :**
- Create : `supabase/migrations/20261222000004_classes_retour.sql`, `supabase/tests/classes_retour.test.sql`
- Modify : `src/lib/erreurs.ts` (+ test), le texte de confirmation du retrait côté enseignant (le trouver avec `grep -rn "revenir" src`)

**Interfaces :**
- Consumes : `public.retirer_eleve(p_classe, p_eleve)`, `public.rejoindre_classe(...)` (corps actuels : migration la plus récente qui les définit), `prive.purges_quotidiennes()` (tâche 6).
- Produces : table `prive.retrait_classe(classe_id, eleve_id, retire_le)` ; code `retour_bloque`.

- [ ] **Step 1 : test** — `supabase/tests/classes_retour.test.sql` : un enseignant retire un élève (`retirer_eleve`) ; l'élève qui rejoint aussitôt avec le code reçoit `retour_bloque` ; après avoir vieilli le retrait de 25 heures (en `postgres`), il rejoint ; `prive.purges_quotidiennes()` supprime un retrait de 31 jours et garde un retrait de 2 jours. `plan(N)` exact.
- [ ] **Step 2 : migration** — table `prive.retrait_classe` (clé primaire `(classe_id, eleve_id)`, clés étrangères en cascade, `revoke all … from public, anon, authenticated`) ; `retirer_eleve` (corps recopié) ajoute `insert … on conflict (classe_id, eleve_id) do update set retire_le = now()` après la suppression de l'inscription ; `rejoindre_classe` (corps recopié) lève `retour_bloque` si un retrait de cette classe pour l'élève date de moins de 24 heures, juste après avoir trouvé la classe par son code ; `prive.purges_quotidiennes` (corps de la tâche 6 recopié) supprime aussi les retraits de plus de 30 jours.
- [ ] **Step 3 : textes** — `retour_bloque: 'Ton enseignant ou ton enseignante t’a retiré de cette classe. Tu pourras la rejoindre de nouveau dans 24 heures.'` (avec test) ; la confirmation du retrait côté enseignant dit désormais « L'élève ne pourra pas revenir dans la classe avant 24 heures. » (U+00A0 si besoin).
- [ ] **Step 4 : vérifier** — `npm run db:reset`, types régénérés, `npm run test:db`, `npm test`, `npm run typecheck` : PASS.
- [ ] **Step 5 : commit** — « Bloque le retour d'un élève retiré pendant 24 heures et purge les retraits anciens ».

---

### Task 8 : pages légales et pied de page

**Files :**
- Create : `src/app/(legal)/layout.tsx`, `src/app/(legal)/mentions-legales/page.tsx`, `src/app/(legal)/confidentialite/page.tsx`, `src/app/(legal)/conditions-utilisation/page.tsx`, `src/components/PiedDePage.tsx`, `src/styles/legal.css` (importé dans `globals.css`)
- Modify : `src/app/layout.tsx`, `src/lib/routes.ts`, `src/lib/routes.test.ts`

- [ ] **Step 1 : routes publiques** — ajouter `'/mentions-legales'`, `'/confidentialite'`, `'/conditions-utilisation'` à `ROUTES_PUBLIQUES`, avec un test.
- [ ] **Step 2 : pied de page** — `PiedDePage` (dans `src/app/layout.tsx`, après `{children}`) : `<footer>` avec une `nav` « Informations légales » : Mentions légales · Confidentialité · Conditions d'utilisation · Mes données. Lisible à 375 px, liens soulignés, contraste conforme (revue axe).
- [ ] **Step 3 : pages** — chaque page : `h1`, un encadré `role="note"` « Trame à compléter et à faire relire par un juriste avant la mise en vente. », sections `h2`. Les champs à compléter sont entre crochets et en gras.
  - **Mentions légales** : éditeur ([nom ou raison sociale], [adresse], [numéro SIREN], [directeur ou directrice de la publication], [contact]) ; hébergement de l'application (Vercel Inc., région de Paris, [adresse de Vercel]) ; hébergement des données (Supabase, région [Paris ou Francfort]) ; propriété intellectuelle des cours.
  - **Politique de confidentialité** (le texte le plus important, en français clair, adressé à l'élève et à ses parents) :
    - qui est responsable ([éditeur], [contact pour les données]) ;
    - données collectées : adresse e-mail, prénom, filière et niveau, indicateur « moins de 15 ans » (jamais la date de naissance), adresse e-mail d'un parent pour les moins de 15 ans, résultats aux quiz et aux évaluations, calendrier, préférences et appareils pour les notifications, classes rejointes ;
    - à quoi elles servent (fournir les cours et les quiz, suivre la progression, permettre à l'enseignant de suivre sa classe, envoyer les rappels demandés) et sur quelle base (exécution du service ; consentement parental pour les moins de 15 ans) ;
    - qui y a accès (l'élève ; l'enseignant de ses classes pour la progression et les notes, jamais le calendrier ; les sous-traitants techniques : Supabase, Vercel, [fournisseur d'e-mails], services de notification des navigateurs) ;
    - où elles sont hébergées (Union européenne) ;
    - combien de temps (tant que le compte existe ; 30 jours après une demande de suppression ; les résultats ne sont jamais vendus ni utilisés pour de la publicité) ;
    - cookies : seulement les cookies nécessaires à la connexion ; aucun traceur publicitaire ni de mesure d'audience ; c'est pourquoi aucune bannière de cookies n'est affichée ;
    - droits : accès et export (page « Mes données »), rectification, suppression (page « Mes données »), retrait du consentement parental ([contact]), réclamation auprès de la CNIL (cnil.fr).
  - **Conditions d'utilisation** : objet du service, compte personnel, essai de 7 jours puis un cours gratuit, règles de bonne conduite (signalements, codes de classe), contenu et propriété, responsabilité, modification des conditions, droit applicable ; mention « Les conditions générales de vente des abonnements seront ajoutées avec l'abonnement. »
  Typographie française (U+00A0) dans tout le texte.
- [ ] **Step 4 : vérifier** — `npm test`, `npm run typecheck`, `npm run lint`, `npm run build` : PASS ; les trois pages s'ouvrent sans session sur le build de production.
- [ ] **Step 5 : commit** — « Ajoute les pages légales et le pied de page ».

---

### Task 9 : bout en bout, bilan et revue finale

**Files :**
- Create : `e2e/acces.spec.ts`, `e2e/consentement.spec.ts`, `e2e/mes-donnees.spec.ts`, `e2e/aide-mailpit.ts`, `docs/superpowers/plans/2026-12-22-etape-5a-bilan.md`
- Modify : `e2e/aide-db.ts`, `e2e/accessibilite.spec.ts`, `e2e/securite.spec.ts`, `README.md`, `docs/superpowers/plans/2026-11-03-feuille-de-route.md`

- [ ] **Step 1 : aides**
  - `e2e/aide-db.ts` : `vieillirInscription(email: string, jours: number)` (met `inscrit_le` à `now() - jours`) ; `vieillirDemandeSuppression(email, jours)`.
  - `e2e/aide-mailpit.ts` : `dernierEmail(destinataire: string): Promise<{ sujet: string; texte: string }>` qui interroge l'API de Mailpit (`http://127.0.0.1:54324/api/v1/search?query=to:<adresse>` puis `/api/v1/message/<id>` ; vérifier les routes de l'API dans la documentation de Mailpit) avec `expect.poll` ; `lienDansEmail(texte, motif)`.
- [ ] **Step 2 : parcours**
  - `e2e/acces.spec.ts` : un élève inscrit, inscription vieillie de 8 jours ; l'accueil montre « Ton essai est terminé » et des cartes « Verrouillé » ; il choisit BPH sur `/choisir-cours` ; un chapitre de BPH s'ouvre ; un cours non choisi affiche « Ce cours n'est pas ouvert pour toi » (s'il n'y a qu'un cours publié dans la base locale, vérifier à la place que le changement est encore possible puis que le second changement est refusé).
  - `e2e/consentement.spec.ts` : inscription en cochant « moins de 15 ans » → `/consentement` ; l'accueil redirige vers `/consentement` ; demande à `parent-<id>@test.local` ; l'e-mail arrive dans Mailpit ; le lien ouvert dans un **nouveau contexte** (sans session) affiche la page d'accord ; refus si la case n'est pas cochée ; accord ; l'élève accède à l'accueil.
  - `e2e/mes-donnees.spec.ts` : l'export se télécharge (`page.waitForEvent('download')`) et contient les clés attendues ; demande de suppression → bannière ; annulation → la bannière disparaît.
  - `e2e/accessibilite.spec.ts` : ajouter `/choisir-cours`, `/consentement`, `/accord-parental/<jeton>`, `/mes-donnees` et les trois pages légales. `e2e/securite.spec.ts` : aucune violation de CSP sur ces pages.
- [ ] **Step 3 : vérification complète** — `npm run db:reset`, `npm test`, `npm run typecheck`, `npm run lint`, `npm run test:db`, `npm run build`, `npm run e2e` : tout passe ; noter les nombres exacts ; port 3000 libre.
- [ ] **Step 4 : README, feuille de route, bilan** — README : section « E-mails » (Mailpit en local, variables SMTP) et « Données personnelles » (export, suppression, purges) ; feuille de route : ligne 5 coupée en « 5a. Accès gratuit, consentement parental, données personnelles, pages légales » (Terminé, avec le bilan) et « 5b. Abonnements Stripe, comptes parents, CGV » (à rédiger après l'étape 5a) ; bilan sur le modèle du bilan 4c.
- [ ] **Step 5 : commit** — « Ajoute les parcours de l'étape 5a et son bilan ».
- [ ] **Step 6 : revue finale** — toute la branche par **Opus** : règles d'accès (aucun contournement du consentement ni de l'essai, y compris par les RPC de quiz et de calendrier qui appellent `peut_lire_cours`), jeton du consentement (entropie, empreinte, expiration, aucune fuite), e-mails (aucune donnée dans les journaux, échappement), export (aucune donnée d'un tiers, aucune clé), purge (cascades complètes, rien d'autre supprimé), pages légales (exactitude par rapport au code), accessibilité et CSP des nouvelles pages. Puis une seule vague de corrections, une re-revue ciblée, la vérification complète et la mise à jour du bilan.
