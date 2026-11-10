# Étape 4a : calendrier, planning de révision et PWA — plan d'implémentation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal :**
- L'élève organise ses révisions dans un calendrier, en vues jour, semaine et mois, pensées pour le mobile.
  - Il y note ses révisions, ses devoirs et ses examens réels, avec une répétition possible.
  - Il y voit en lecture seule les échéances d'évaluation fixées par ses enseignants.
- Il s'abonne à son calendrier depuis un autre agenda par un lien iCal privé et révocable.
- Quand il crée un examen réel rattaché à un cours, l'application lui propose un planning de révision. Il peut l'accepter, le modifier ou le refuser.
  - Ce planning finit par une session de révision générale la veille de l'examen : un quiz de 30 questions sur tous les chapitres concernés.
  - S'il valide un chapitre prévu plus tard, l'application lui propose de réorganiser le planning.
- L'application s'installe sur l'écran d'accueil (PWA). Les chapitres déjà ouverts restent lisibles hors connexion.

**Architecture :**
- **Les événements sont stockés une fois, avec leur règle de répétition.** Les occurrences sont calculées par une seule fonction SQL, `prive.occurrences`, utilisée à la fois par le calendrier et par le flux iCal. Toutes les heures sont celles de Paris, et les changements d'heure sont gérés par Postgres.
- **Écritures uniquement par RPC `security definer`**, comme pour le contenu. Les tables sont lisibles par leur propriétaire seulement.
- **Les échéances des enseignants ne sont pas recopiées.** Elles sont lues à la volée dans `echeance_evaluation`, pour les classes où l'élève est inscrit.
- **Le planning de révision est calculé en TypeScript**, par une fonction pure et testée (`genererPlanning`). L'action serveur le recalcule au moment de l'acceptation, puis l'envoie à une RPC qui vérifie chaque session et crée les événements dans une seule transaction.
- **La révision générale** est une tentative de type `revision` sans chapitre (`chapitre_id` nul), qui tire dans plusieurs chapitres. Elle ne touche pas la progression des chapitres.
- **Le lien iCal** porte un jeton aléatoire de 256 bits. La base n'en garde que l'empreinte SHA-256. Une route Next.js publique appelle une RPC ouverte à `anon` qui ne répond qu'avec le bon jeton.
- **PWA** :
  - manifeste et icônes générés par Next.js ;
  - service worker écrit à la main (`public/sw.js`), sans dépendance. Il met en cache, réseau d'abord, les pages de chapitre ouvertes, plus une page « hors connexion » ;
  - le cache des pages est vidé à la déconnexion et à l'arrivée sur la page de connexion.

**Tech Stack :** Next.js 16, React 19, TypeScript, Supabase (Postgres 17, plpgsql, pgcrypto), zod 4, Service Worker et Cache API, Vitest, pgTAP, Playwright.

**Spec :** `docs/superpowers/specs/2026-11-03-app-lycee-design.md`. Sections concernées :
- 3 « Calendrier et notifications » et « Sécurité (RLS) » ;
- 5 « Élève » (prochains événements et échéances) ;
- 7 « Calendrier » et « Planning de révision suggéré » ;
- 10 « Gestion des erreurs » (hors connexion).

**Découpage de l'étape 4.** Comme l'étape 3, l'étape 4 est coupée en deux :
- **4a (ce plan)** : calendrier, lien iCal, planning de révision, révision générale, PWA et lecture hors connexion, plus la dette des échéances ;
- **4b (plan suivant)** :
  - notifications Web Push : tâche planifiée chaque minute, préférences, heures de silence, demande d'autorisation à la première création d'un événement, guide iPhone, liste de rappels dans l'application ;
  - en-têtes de sécurité (CSP, `frame-ancestors`), région Vercel en UE et `NEXT_PUBLIC_SITE_URL` en production ;
  - revue d'accessibilité de fin d'étape, et le reste de la dette d'accessibilité et de contraste.

**Bilans précédents (points traités ici) :**
- `2026-11-03-etape-1-bilan.md` : le matcher du proxy doit exclure le manifeste et `robots.txt`.
- `2026-11-17-etape-3a-bilan.md` :
  - une classe quittée *sans* échéance garde l'évaluation ouverte pendant 30 jours ;
  - expliquer la règle des 30 jours dans la confirmation « Quitter » ;
  - ne plus présenter la classe quittée comme une classe actuelle sur la page d'évaluation.
- Tous les autres points marqués « étape 4 » dans les bilans 1, 2, 3a et 3b passent à l'étape 4b. Le bilan de 4a les recopiera.

**Branche :** `etape-4a-calendrier`, créée depuis `etape-3b-contenu`. Sa PR vise `etape-3b-contenu`, puis `main` quand les PR n°2, 3 et 4 sont fusionnées.

## Décisions prises dans ce plan (à valider avec la relecture)

1. **Fuseau horaire.**
   - Toutes les heures du calendrier sont celles de Paris, comme les échéances de l'étape 3a.
   - Les élèves des DROM ne sont pas gérés dans la première version (la spec ne les cite pas).
2. **Répétition.**
   - Quatre valeurs : `aucune`, `quotidienne`, `hebdomadaire` (le même jour que le début), `jours` (certains jours de la semaine, numérotés de 1 = lundi à 7 = dimanche).
   - Toute répétition a une date de fin, au plus 366 jours après le début.
   - Une occurrence garde l'heure de Paris du début, y compris après un changement d'heure.
   - On modifie ou on supprime toute la série, jamais une seule occurrence (pas d'exceptions dans la première version).
3. **Événements.**
   - Seuls les comptes `eleve` ont un calendrier. Les enseignants agissent par les échéances (étape 3a).
   - Le type d'un événement ne change plus après sa création.
   - 500 événements au plus par élève (protection contre l'abus) : chaque session d'un planning compte pour un.
   - Durée : de 5 minutes à 12 heures. Un événement commence au plus un an avant et deux ans après aujourd'hui.
   - Un événement peut être rattaché à un cours que l'élève peut lire, et à des chapitres publiés de ce cours (30 au plus).
4. **Échéances des enseignants.**
   - Calculées à la volée depuis `echeance_evaluation`, pour les classes où l'élève est **actuellement** inscrit, et seulement pour les cours publiés.
   - Ouverture et date limite donnent chacune un repère sans durée, en lecture seule, d'une couleur distincte.
   - Le type `echeance_enseignant` de la spec correspond à ces repères. On ne le stocke pas, pour ne pas dupliquer `echeance_evaluation`.
5. **Lien iCal.**
   - Un seul lien actif par élève. On le crée, on le régénère (l'ancien cesse de fonctionner) ou on le révoque.
   - Le lien n'est affiché qu'une fois, juste après sa création, car la base ne garde que l'empreinte du jeton.
   - Le flux contient les occurrences des 30 derniers jours et des 365 prochains, en UTC, avec seulement le titre et les heures.
   - Le jeton apparaît dans les journaux du serveur, comme pour tout lien d'abonnement iCal. C'est accepté, le jeton étant révocable.
6. **Planning de révision.**
   - Il est proposé après la création d'un examen réel rattaché à un cours, et reste accessible depuis cet examen.
   - Chapitres concernés : ceux de l'examen, sinon tous les chapitres publiés du cours.
   - Priorité : les non validés d'abord, puis la note la plus basse, puis les validés depuis le plus longtemps, puis l'ordre du cours.
   - Créneaux :
     - de aujourd'hui à l'avant-veille de l'examen, seulement les jours préférés, au plus N sessions par semaine (lundi à dimanche) ;
     - les premiers jours préférés de la semaine sont pris en premier ;
     - chaque créneau commence à l'heure choisie. S'il chevauche un événement existant, on essaie 1, 2 puis 3 heures plus tard, sans finir après 22 h. Sinon, le jour est sauté ;
     - aucune session ne commence dans moins de 30 minutes.
   - Répartition :
     - un chapitre par session quand il y a assez de créneaux, en étalant les sessions régulièrement ;
     - sinon, des groupes de chapitres consécutifs dans l'ordre de priorité, avec un avertissement.
   - La veille de l'examen, une session « Révision générale » est prévue à l'heure choisie, même si ce jour n'est pas un jour préféré. Elle porte tous les chapitres concernés.
   - Le planning n'est pas stocké tant qu'il n'est pas accepté.
     - Accepter crée le plan (`accepte`) et ses événements.
     - Refuser enregistre un plan `refuse`, qui sert à ne plus reproposer automatiquement.
     - « Modifier » veut dire changer les réglages et revoir l'aperçu. Après acceptation, chaque session reste modifiable ou supprimable dans le calendrier.
   - Réorganiser remplace le plan : ses sessions à venir sont supprimées, les sessions passées restent (sans plan).
   - **Proposition de réorganisation** : quand un chapitre d'une session à venir (hors révision générale) a été validé après la création du plan, ou après le dernier « Plus tard », une bannière le propose sur l'accueil et dans le calendrier.
   - Supprimer un examen supprime son plan et ses sessions à venir.
   - Un examen ne peut pas être planifié à plus de 365 jours.
7. **Révision générale.**
   - Quiz de 30 questions au plus (au moins 15 questions validées au total), tirées dans les chapitres de la session :
     - d'abord les ratées, puis les jamais vues, puis les autres ;
     - réparties à tour de rôle entre les chapitres ;
     - affichées dans un ordre aléatoire.
   - C'est une tentative `revision` avec `chapitre_id` nul. Elle alimente l'historique des questions (points faibles), mais pas la progression des chapitres.
   - Une seule révision générale ouverte par cours. La relancer renvoie celle qui est ouverte.
   - Elle est fermée pendant une évaluation ouverte du même cours, comme les quiz de chapitre.
8. **PWA et hors connexion.**
   - Le manifeste et les icônes sont générés par Next.js (`app/manifest.ts`, `ImageResponse`), sans fichier binaire dans le dépôt.
   - Le service worker n'est enregistré qu'en production (il gênerait le rechargement à chaud en développement).
   - Seules les pages de chapitre (`/cours/<cours>/<chapitre>`, hors `/evaluation`) sont mises en cache :
     - stratégie réseau d'abord ;
     - au plus 30 pages, les plus anciennes sont retirées.
   - Les fichiers `/_next/static/` sont mis en cache au premier usage (leur nom change à chaque build).
   - Toute autre page hors connexion affiche `/hors-ligne`.
   - Un bandeau indique « Tu es hors connexion » dans l'application. Les quiz et évaluations demandent une connexion.
   - **Vie privée** : le cache des pages est vidé à la déconnexion et à chaque arrivée sur `/connexion`. Ainsi, sur un appareil partagé, les pages d'un élève ne restent pas pour le suivant.
9. **Dette des échéances (3a).**
   - Une classe quittée depuis moins de 30 jours compte seulement par ses échéances. Une classe quittée sans échéance n'ouvre plus la fenêtre.
   - `mes_echeances` ne renvoie une classe quittée que si elle a une échéance, avec `quittee = true`.

## Contraintes globales

- Toute l'interface est **en français**. On tutoie l'élève. Les formulations ne sont pas genrées (pas de « suivi·e »).
- Typographie française : espace insécable (U+00A0) avant « : ; ! ? », comme les textes existants. Le plan écrit une espace ordinaire par lisibilité, mais le code **et** les tests utilisent U+00A0 aux mêmes endroits.
- **Écritures sur `evenement`, `evenement_chapitre`, `plan_revision` et `prive.jeton_ical` uniquement par RPC `security definer`.** `authenticated` et `anon` n'ont que `select` (filtré par RLS) sur les tables publiques, et aucun droit sur `prive`.
- Chaque fonction exposée :
  - a `set search_path = ''` et des noms qualifiés ;
  - reçoit `revoke execute … from public, anon`, puis `grant execute … to authenticated` (et `anon` pour `calendrier_ical` seulement) ;
  - les helpers vont dans `prive`, avec `revoke execute … from public`.
- Les RPC réservées aux élèves vérifient `public.role_actuel() is distinct from 'eleve'` et lèvent `reserve_eleves`.
- Les codes d'erreur levés par la base sont des mots-clés `snake_case`, traduits dans `src/lib/erreurs.ts`, avec un test du texte exact. Aucun nouveau code n'est sous-chaîne d'un code existant, ni l'inverse (`messageErreur` cherche par `includes`).
- Lors d'un `create or replace` sur une fonction existante, on recopie son **corps actuel** depuis la migration la plus récente qui la définit, avec ses attributs actuels (un `alter function` ultérieur compte), et on n'ajoute que le changement décrit.
- Le seuil de réussite et les règles des quiz et des évaluations restent inchangés.
- Dates : on réutilise `heureParisVersIso` et `isoVersHeureParis` (`src/lib/enseignant/dates.ts`). Aucune bibliothèque de dates n'est ajoutée.
- Commandes shell : préfixer par `export PATH="$HOME/.orbstack/bin:$PATH";`. Ne jamais afficher ni commiter `.env.local`. La clé de service n'est utilisée que dans `scripts/` et dans les aides e2e, derrière la garde « base locale ».
- Après chaque migration : `npm run db:reset`, puis `npx supabase gen types typescript --local > src/lib/supabase/types.ts`.
- Avant d'utiliser une API de Next.js (route handlers, `manifest.ts`, `ImageResponse`, `headers`), de supabase-js, de plpgsql ou du Service Worker, consulter sa documentation à jour avec **context7**.
- Toute nouvelle page ou tout nouveau composant d'interface suit le système visuel existant (`globals.css` : `--couleur-cours`, `.carte`, `.bouton`, `.formulaire`, `.message-erreur`, `.message-info`, `.sr-only`). Les formulaires suivent le modèle de `FormulaireEcheance` : `useActionState`, `aria-invalid` sur le seul champ en cause, `aria-describedby` vers l'aide et l'erreur, et valeurs saisies renvoyées dans l'état.
- Messages de commit en français, à l'impératif présent, terminés par la ligne `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Hors périmètre

- Tout ce qui touche aux notifications (étape 4b), y compris le délai de rappel d'un événement : la colonne sera ajoutée en 4b.
- Exceptions dans une série répétée (supprimer une seule occurrence).
- Calendrier des enseignants, des parents et des admins.
- Glisser-déposer dans le calendrier.
- Abonnements (étape 5).

## Répartition des modèles

| Tâche | Implémentation | Revue |
|---|---|---|
| 1 Schéma et RPC des événements | Sonnet | **Opus** |
| 2 Lien iCal | Sonnet | **Opus** |
| 3 Plan de révision côté base | Sonnet | Sonnet |
| 4 Révision générale | Sonnet | **Opus** |
| 5 Dette des échéances | Sonnet | Sonnet |
| 6 Dates et générateur du planning | Haiku (code complet dans le plan) | Sonnet |
| 7 Couche TypeScript du calendrier | Sonnet | Sonnet |
| 8 Interface du calendrier | Sonnet | Sonnet |
| 9 Interface du planning et du partage | Sonnet | Sonnet |
| 10 PWA et hors connexion | Sonnet | **Opus** |
| 11 Bout en bout, bilan, revue finale | Sonnet, puis revue finale **Opus** | — |

Les tâches 1 à 5 touchent la base locale partagée : elles s'exécutent l'une après l'autre. La tâche 6 ne touche pas la base.

## Carte des fichiers

| Fichier | Rôle |
|---|---|
| `supabase/migrations/20261201000001_calendrier.sql` | tables `evenement`, `evenement_chapitre`, `plan_revision` ; `prive.occurrences`, `prive.echeances_eleve` ; RPC des événements et `mon_calendrier` |
| `supabase/migrations/20261201000002_ical.sql` | `prive.jeton_ical` ; RPC du jeton et `calendrier_ical` |
| `supabase/migrations/20261201000003_plan_revision.sql` | RPC du planning, `mes_creneaux_occupes`, `plans_a_reorganiser` |
| `supabase/migrations/20261201000004_revision_generale.sql` | contrainte de `tentative`, `prive.cloturer`, `demarrer_revision_generale` |
| `supabase/migrations/20261201000005_echeances_departs.sql` | `prive.fenetre_evaluation`, `mes_echeances` avec `quittee` |
| `supabase/tests/calendrier.test.sql`, `ical.test.sql`, `plan_revision.test.sql`, `revision_generale.test.sql`, `echeances_departs.test.sql` | pgTAP |
| `src/lib/calendrier/dates.ts` (+ test) | jours de Paris, semaines, grille du mois, vues |
| `src/lib/planning/generer.ts` (+ test) | `trierParPriorite`, `genererPlanning` |
| `src/lib/calendrier/ical.ts` (+ test) | `genererIcal` |
| `src/lib/calendrier/schema-evenement.ts` (+ test) | lecture du formulaire d'événement |
| `src/lib/calendrier/garde.ts`, `requetes.ts` | `exigerEleve`, lectures |
| `src/app/(app)/calendrier/actions.ts` | actions serveur du calendrier, du planning et du partage |
| `src/app/(app)/calendrier/page.tsx`, `nouveau/page.tsx`, `[id]/page.tsx`, `[id]/planning/page.tsx`, `partage/page.tsx` | pages |
| `src/app/ical/[jeton]/route.ts` | flux iCal public |
| `src/components/calendrier/*` | vues, formulaires, bannière |
| `src/styles/calendrier.css` | styles du calendrier |
| `src/app/manifest.ts`, `src/app/icones/[fichier]/route.tsx`, `src/app/apple-icon.tsx`, `src/app/hors-ligne/page.tsx` | PWA |
| `public/sw.js` | service worker |
| `src/components/EnregistrementSW.tsx`, `IndicateurConnexion.tsx`, `BoutonDeconnexion.tsx`, `ViderCachePages.tsx` | PWA côté client |
| `src/proxy.ts`, `src/lib/routes.ts` (+ test), `next.config.ts` | routes publiques, matcher, en-têtes de `sw.js` |
| `e2e/calendrier.spec.ts`, `e2e/hors-ligne.spec.ts` | bout en bout |

---

### Task 1 : schéma du calendrier et RPC des événements

**Files :**
- Create : `supabase/migrations/20261201000001_calendrier.sql`
- Create : `supabase/tests/calendrier.test.sql`
- Modify : `src/lib/supabase/types.ts` (régénéré)

**Interfaces :**
- Consumes : `public.role_actuel()`, `public.peut_lire_cours(uuid)`, `prive.toucher_modifie_le()`, tables `cours`, `chapitre`, `classe`, `inscription_classe`, `echeance_evaluation`.
- Produces :
  - types `public.type_evenement_t` (`revision`, `devoir`, `examen_reel`), `public.repetition_t` (`aucune`, `quotidienne`, `hebdomadaire`, `jours`), `public.statut_plan_t` (`propose`, `accepte`, `refuse`) ;
  - tables `public.evenement`, `public.evenement_chapitre`, `public.plan_revision` (colonnes ci-dessous) ;
  - `prive.occurrences(p_eleve uuid, p_de timestamptz, p_a timestamptz) returns table (evenement_id uuid, debut timestamptz, fin timestamptz)` ;
  - `prive.echeances_eleve(p_eleve uuid, p_de timestamptz, p_a timestamptz) returns table (cle text, titre text, instant timestamptz, cours_id uuid, cours_titre text, couleur text, cours_slug text, classe_nom text)` ;
  - `public.enregistrer_evenement(p_id uuid, p jsonb) returns uuid` ; `p` a les clés `type`, `titre`, `debut` (ISO), `duree_minutes`, `cours_id` (ou null), `chapitres` (tableau d'uuid), `repetition`, `jours_semaine` (tableau ou null), `repeter_jusqu_au` (`AAAA-MM-JJ` ou null) ;
  - `public.supprimer_evenement(p_id uuid) returns void` ;
  - `public.mon_calendrier(p_de timestamptz, p_a timestamptz) returns table (cle text, evenement_id uuid, type text, titre text, debut timestamptz, fin timestamptz, cours_id uuid, cours_titre text, couleur text, cours_slug text, lecture_seule boolean, revision_generale boolean, plan_id uuid, classe_nom text, chapitres jsonb)` ; `type` vaut l'un des trois types, ou `echeance`.
  - codes d'erreur : `reserve_eleves`, `evenement_invalide`, `repetition_invalide`, `cours_indisponible`, `chapitres_invalides`, `evenement_introuvable`, `trop_d_evenements`, `periode_invalide`.

- [ ] **Step 1 : écrire le test pgTAP (il échoue)**

Créer `supabase/tests/calendrier.test.sql` :

```sql
begin;
select plan(20);

insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-0000000000a1', 'eleve-cal@test.local'),
  ('00000000-0000-0000-0000-0000000000a2', 'autre-cal@test.local'),
  ('00000000-0000-0000-0000-0000000000a3', 'prof-cal@test.local');
update public.profil set role = 'enseignant' where id = '00000000-0000-0000-0000-0000000000a3';
insert into public.filiere (id, voie, code, nom) values ('10000000-0000-0000-0000-0000000000a1', 'technologique', 'CAL', 'Filière calendrier');
insert into public.cours (id, slug, filiere_id, niveau_code, matiere, titre, publie) values
  ('20000000-0000-0000-0000-0000000000a1', 'cours-cal', '10000000-0000-0000-0000-0000000000a1', '1re', 'C', 'Cours calendrier', true),
  ('20000000-0000-0000-0000-0000000000a2', 'cours-cal-autre', '10000000-0000-0000-0000-0000000000a1', '1re', 'D', 'Autre cours', true),
  ('20000000-0000-0000-0000-0000000000a3', 'cours-cal-brouillon', '10000000-0000-0000-0000-0000000000a1', '1re', 'E', 'Cours non publié', false);
insert into public.chapitre (id, cours_id, slug, numero, titre, publie) values
  ('30000000-0000-0000-0000-0000000000a1', '20000000-0000-0000-0000-0000000000a1', 'ch1', 1, 'Un', true),
  ('30000000-0000-0000-0000-0000000000a2', '20000000-0000-0000-0000-0000000000a2', 'ch1', 1, 'Autre', true);
insert into public.classe (id, enseignant_id, nom, code) values
  ('60000000-0000-0000-0000-0000000000a1', '00000000-0000-0000-0000-0000000000a3', 'Première ST2S', 'CALBCD');
insert into public.classe_cours values ('60000000-0000-0000-0000-0000000000a1', '20000000-0000-0000-0000-0000000000a1');
insert into public.inscription_classe (classe_id, eleve_id) values ('60000000-0000-0000-0000-0000000000a1', '00000000-0000-0000-0000-0000000000a1');
insert into public.echeance_evaluation (classe_id, cours_id, ouverture, limite) values
  ('60000000-0000-0000-0000-0000000000a1', '20000000-0000-0000-0000-0000000000a1', null, '2027-03-27 18:00+01');
-- Séries insérées directement (sans la RPC) pour tester le calcul des occurrences à dates fixes.
insert into public.evenement (eleve_id, type, titre, debut, duree_minutes, repetition, jours_semaine, repeter_jusqu_au) values
  ('00000000-0000-0000-0000-0000000000a1', 'revision', 'Quotidien', '2027-03-26 17:00+01', 60, 'quotidienne', null, '2027-03-29'),
  ('00000000-0000-0000-0000-0000000000a1', 'revision', 'Hebdo', '2026-12-01 18:00+01', 30, 'hebdomadaire', null, '2026-12-31'),
  ('00000000-0000-0000-0000-0000000000a1', 'revision', 'Lundi mercredi', '2026-12-01 18:00+01', 30, 'jours', '{1,3}', '2026-12-13'),
  ('00000000-0000-0000-0000-0000000000a1', 'devoir', 'Unique', '2026-12-10 10:00+01', 45, 'aucune', null, null);
-- 500 événements pour l'autre élève : la limite est atteinte.
insert into public.evenement (eleve_id, type, titre, debut, duree_minutes)
  select '00000000-0000-0000-0000-0000000000a2', 'devoir', 'Rempli ' || i, '2027-06-01 10:00+02', 30 from generate_series(1, 500) i;
-- Identifiant d'un événement de a1, lu avant le changement de rôle (a2 ne peut pas le lire).
select set_config('test.evenement_a1', (select id::text from public.evenement where titre = 'Unique'), true);

set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000a3","role":"authenticated"}', true);
select throws_ok($$ select public.enregistrer_evenement(null, '{"type":"devoir","titre":"X","debut":"2026-12-07T16:00:00Z","duree_minutes":60}') $$,
  'P0001', 'reserve_eleves', 'un enseignant n''a pas de calendrier');

select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000a1","role":"authenticated"}', true);
select throws_ok($$ select public.enregistrer_evenement(null, '{"type":"devoir","titre":"  ","debut":"2026-12-07T16:00:00Z","duree_minutes":60}') $$,
  'P0001', 'evenement_invalide', 'titre vide refusé');
select throws_ok($$ select public.enregistrer_evenement(null, '{"type":"devoir","titre":"X","debut":"2026-12-07T16:00:00Z","duree_minutes":60,"repetition":"quotidienne"}') $$,
  'P0001', 'repetition_invalide', 'une répétition sans date de fin est refusée');
select throws_ok($$ select public.enregistrer_evenement(null, '{"type":"devoir","titre":"X","debut":"2026-12-07T16:00:00Z","duree_minutes":60,"cours_id":"20000000-0000-0000-0000-0000000000a3"}') $$,
  'P0001', 'cours_indisponible', 'cours non publié refusé');
select throws_ok($$ select public.enregistrer_evenement(null, '{"type":"devoir","titre":"X","debut":"2026-12-07T16:00:00Z","duree_minutes":60,"cours_id":"20000000-0000-0000-0000-0000000000a1","chapitres":["30000000-0000-0000-0000-0000000000a2"]}') $$,
  'P0001', 'chapitres_invalides', 'chapitre d''un autre cours refusé');
select lives_ok($$ select public.enregistrer_evenement(null, '{"type":"revision","titre":"Réviser le chapitre 1","debut":"2026-12-07T16:00:00Z","duree_minutes":60,"cours_id":"20000000-0000-0000-0000-0000000000a1","chapitres":["30000000-0000-0000-0000-0000000000a1"]}') $$,
  'création d''une révision rattachée à un chapitre');
select is((select count(*)::int from public.evenement_chapitre ec join public.evenement e on e.id = ec.evenement_id where e.titre = 'Réviser le chapitre 1'),
  1, 'le chapitre est lié');

select results_eq(
  $$ select debut from public.mon_calendrier('2027-03-20T00:00:00Z', '2027-04-05T00:00:00Z') where titre = 'Quotidien' order by debut $$,
  $$ values ('2027-03-26 16:00+00'::timestamptz), ('2027-03-27 16:00+00'), ('2027-03-28 15:00+00'), ('2027-03-29 15:00+00') $$,
  'une série quotidienne garde 17 h à Paris après le passage à l''heure d''été');
select is((select count(*)::int from public.mon_calendrier('2026-12-01T00:00:00Z', '2027-01-01T00:00:00Z') where titre = 'Hebdo'),
  5, 'série hebdomadaire : les 5 mardis de décembre');
select results_eq(
  $$ select (debut at time zone 'Europe/Paris')::date from public.mon_calendrier('2026-12-01T00:00:00Z', '2027-01-01T00:00:00Z') where titre = 'Lundi mercredi' order by debut $$,
  $$ values ('2026-12-02'::date), ('2026-12-07'), ('2026-12-09') $$,
  'série « certains jours » : seulement les lundis et mercredis, jusqu''à la date de fin');
select is((select count(*)::int from public.mon_calendrier('2026-12-01T00:00:00Z', '2027-01-01T00:00:00Z') where titre = 'Unique'),
  1, 'événement unique dans la période');
select is((select count(*)::int from public.mon_calendrier('2027-01-01T00:00:00Z', '2027-02-01T00:00:00Z') where titre = 'Unique'),
  0, 'événement unique hors de la période');
select results_eq(
  $$ select type, lecture_seule, classe_nom from public.mon_calendrier('2027-03-20T00:00:00Z', '2027-04-05T00:00:00Z') where type = 'echeance' $$,
  $$ values ('echeance'::text, true, 'Première ST2S'::text) $$,
  'la date limite de la classe apparaît en lecture seule');
select throws_ok($$ select * from public.mon_calendrier('2026-12-01T00:00:00Z', '2027-03-01T00:00:00Z') $$,
  'P0001', 'periode_invalide', 'période de plus de 62 jours refusée');

select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000a2","role":"authenticated"}', true);
select is((select count(*)::int from public.evenement where eleve_id = '00000000-0000-0000-0000-0000000000a1'), 0,
  'un élève ne lit pas les événements d''un autre');
select is((select count(*)::int from public.mon_calendrier('2026-12-01T00:00:00Z', '2027-01-01T00:00:00Z')), 0,
  'le calendrier d''un autre élève est vide pour lui');
select throws_ok($$ select public.supprimer_evenement(current_setting('test.evenement_a1')::uuid) $$,
  'P0001', 'evenement_introuvable', 'on ne supprime que ses propres événements');
select throws_ok($$ insert into public.evenement (eleve_id, type, titre, debut, duree_minutes) values ('00000000-0000-0000-0000-0000000000a2', 'devoir', 'Direct', now(), 30) $$,
  '42501', null, 'pas d''écriture directe');
select throws_ok($$ select public.enregistrer_evenement(null, '{"type":"devoir","titre":"Un de trop","debut":"2026-12-07T16:00:00Z","duree_minutes":60}') $$,
  'P0001', 'trop_d_evenements', '500 événements au plus');

select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000a1","role":"authenticated"}', true);
select lives_ok($$ select public.supprimer_evenement(current_setting('test.evenement_a1')::uuid) $$,
  'l''élève supprime son événement');

select * from finish();
rollback;
```

- [ ] **Step 2 : lancer le test pour le voir échouer**

Run : `export PATH="$HOME/.orbstack/bin:$PATH"; npx supabase test db supabase/tests/calendrier.test.sql`
Expected : FAIL, `type "type_evenement_t" does not exist` ou `relation "public.evenement" does not exist`.

- [ ] **Step 3 : écrire la migration**

Créer `supabase/migrations/20261201000001_calendrier.sql` :

```sql
-- Calendrier de l'élève : événements (avec répétition), plans de révision.
-- Lecture : le propriétaire seulement (RLS). Écriture : uniquement par les RPC de ce fichier et de 20261201000003.
-- Toutes les heures sont celles de Paris : une série garde son heure locale après un changement d'heure.

create type public.type_evenement_t as enum ('revision', 'devoir', 'examen_reel');
create type public.repetition_t as enum ('aucune', 'quotidienne', 'hebdomadaire', 'jours');
create type public.statut_plan_t as enum ('propose', 'accepte', 'refuse');

create table public.evenement (
  id uuid primary key default gen_random_uuid(),
  eleve_id uuid not null references public.profil on delete cascade,
  type public.type_evenement_t not null,
  titre text not null check (char_length(titre) between 1 and 120 and titre = btrim(titre)),
  debut timestamptz not null,
  duree_minutes smallint not null check (duree_minutes between 5 and 720),
  cours_id uuid references public.cours on delete restrict,
  repetition public.repetition_t not null default 'aucune',
  -- Jours ISO : 1 = lundi … 7 = dimanche. Seulement pour la répétition « jours ».
  jours_semaine smallint[],
  repeter_jusqu_au date,
  plan_id uuid,
  revision_generale boolean not null default false,
  cree_le timestamptz not null default now(),
  modifie_le timestamptz not null default now(),
  check ((repetition = 'aucune') = (repeter_jusqu_au is null)),
  check ((repetition = 'jours') = (jours_semaine is not null)),
  check (jours_semaine is null or (cardinality(jours_semaine) between 1 and 7 and jours_semaine <@ '{1,2,3,4,5,6,7}'::smallint[])),
  check (not revision_generale or type = 'revision')
);
create index evenement_eleve_debut on public.evenement (eleve_id, debut);
create index evenement_plan on public.evenement (plan_id) where plan_id is not null;
create trigger modifie_le before update on public.evenement for each row execute function prive.toucher_modifie_le();

create table public.evenement_chapitre (
  evenement_id uuid not null references public.evenement on delete cascade,
  chapitre_id uuid not null references public.chapitre on delete restrict,
  primary key (evenement_id, chapitre_id)
);

-- Un plan par examen. Supprimer l'examen supprime le plan ; ses sessions passées restent, sans plan (on delete set null).
create table public.plan_revision (
  id uuid primary key default gen_random_uuid(),
  eleve_id uuid not null references public.profil on delete cascade,
  examen_id uuid not null unique references public.evenement on delete cascade,
  sessions_par_semaine smallint not null check (sessions_par_semaine between 1 and 7),
  duree_minutes smallint not null check (duree_minutes between 15 and 180),
  jours_preferes smallint[] not null check (cardinality(jours_preferes) between 1 and 7 and jours_preferes <@ '{1,2,3,4,5,6,7}'::smallint[]),
  heure_debut time not null check (heure_debut between '06:00' and '21:00'),
  statut public.statut_plan_t not null,
  cree_le timestamptz not null default now(),
  -- Dernier « Plus tard » sur la proposition de réorganisation.
  reorganisation_vue_le timestamptz
);
alter table public.evenement add constraint evenement_plan_fk foreign key (plan_id) references public.plan_revision on delete set null;

alter table public.evenement enable row level security;
alter table public.evenement_chapitre enable row level security;
alter table public.plan_revision enable row level security;
create policy "ses événements" on public.evenement for select to authenticated using (eleve_id = (select auth.uid()));
create policy "chapitres de ses événements" on public.evenement_chapitre for select to authenticated
  using (exists (select 1 from public.evenement e where e.id = evenement_id and e.eleve_id = (select auth.uid())));
create policy "ses plans" on public.plan_revision for select to authenticated using (eleve_id = (select auth.uid()));
revoke all on public.evenement, public.evenement_chapitre, public.plan_revision from anon;
revoke insert, update, delete, truncate, references, trigger, maintain
  on public.evenement, public.evenement_chapitre, public.plan_revision from authenticated;

-- Occurrences d'un élève qui chevauchent [p_de, p_a[. Une série garde l'heure de Paris de son début.
-- Un événement sans répétition garde son instant exact (pas de recalcul dans l'heure ambiguë d'octobre).
create function prive.occurrences(p_eleve uuid, p_de timestamptz, p_a timestamptz)
returns table (evenement_id uuid, debut timestamptz, fin timestamptz)
language sql stable set search_path = '' as $$
  select e.id, o.debut, o.debut + make_interval(mins => e.duree_minutes)
    from public.evenement e
    cross join lateral (
      select case when e.repetition = 'aucune' then e.debut
                  else (j.jour + (e.debut at time zone 'Europe/Paris')::time) at time zone 'Europe/Paris' end as debut
        from generate_series(
               greatest((e.debut at time zone 'Europe/Paris')::date, (p_de at time zone 'Europe/Paris')::date - 1),
               least(coalesce(e.repeter_jusqu_au, (e.debut at time zone 'Europe/Paris')::date), (p_a at time zone 'Europe/Paris')::date),
               interval '1 day') as j(jour)
       where e.repetition = 'quotidienne'
          or (e.repetition = 'aucune' and j.jour::date = (e.debut at time zone 'Europe/Paris')::date)
          or (e.repetition = 'hebdomadaire' and extract(isodow from j.jour) = extract(isodow from e.debut at time zone 'Europe/Paris'))
          or (e.repetition = 'jours' and extract(isodow from j.jour)::smallint = any (e.jours_semaine))
    ) o
   where e.eleve_id = p_eleve
     and o.debut < p_a
     and o.debut + make_interval(mins => e.duree_minutes) > p_de
$$;

-- Repères d'échéance (ouverture, date limite) des classes où l'élève est inscrit aujourd'hui, pour les cours publiés.
create function prive.echeances_eleve(p_eleve uuid, p_de timestamptz, p_a timestamptz)
returns table (cle text, titre text, instant timestamptz, cours_id uuid, cours_titre text, couleur text, cours_slug text, classe_nom text)
language sql stable set search_path = '' as $$
  select 'echeance-' || x.quoi || '-' || ee.classe_id || '-' || ee.cours_id,
         case x.quoi when 'ouverture' then 'Ouverture de l''évaluation · ' else 'Date limite de l''évaluation · ' end || c.titre,
         x.instant, c.id, c.titre, c.couleur, c.slug, cl.nom
    from public.inscription_classe i
    join public.echeance_evaluation ee on ee.classe_id = i.classe_id
    join public.classe cl on cl.id = i.classe_id
    join public.cours c on c.id = ee.cours_id and c.publie
    cross join lateral (values ('ouverture', ee.ouverture), ('limite', ee.limite)) as x(quoi, instant)
   where i.eleve_id = p_eleve and x.instant is not null and x.instant >= p_de and x.instant < p_a
$$;

create function public.enregistrer_evenement(p_id uuid, p jsonb) returns uuid
language plpgsql security definer set search_path = '' as $$
declare
  v_type public.type_evenement_t;
  v_titre text;
  v_debut timestamptz;
  v_duree int;
  v_cours uuid;
  v_chapitres uuid[];
  v_rep public.repetition_t;
  v_jours smallint[];
  v_jusqu date;
  v_jour_debut date;
  v_id uuid;
begin
  if public.role_actuel() is distinct from 'eleve' then
    raise exception 'reserve_eleves';
  end if;
  if jsonb_typeof(p) is distinct from 'object' then
    raise exception 'evenement_invalide';
  end if;
  begin
    v_type := (p->>'type')::public.type_evenement_t;
    v_titre := btrim(p->>'titre');
    v_debut := (p->>'debut')::timestamptz;
    v_duree := (p->>'duree_minutes')::int;
    v_cours := nullif(p->>'cours_id', '')::uuid;
    v_rep := coalesce(p->>'repetition', 'aucune')::public.repetition_t;
    v_jusqu := (p->>'repeter_jusqu_au')::date;
    v_chapitres := array(select distinct x::uuid from jsonb_array_elements_text(coalesce(nullif(p->'chapitres', 'null'::jsonb), '[]')) x);
    v_jours := (select array_agg(distinct x::smallint order by x::smallint)
                  from jsonb_array_elements_text(coalesce(nullif(p->'jours_semaine', 'null'::jsonb), '[]')) x);
  exception when others then
    raise exception 'evenement_invalide';
  end;
  if v_type is null or v_titre is null or char_length(v_titre) not between 1 and 120
     or v_debut is null or v_duree is null or v_duree not between 5 and 720
     or v_debut < now() - interval '1 year' or v_debut > now() + interval '2 years' then
    raise exception 'evenement_invalide';
  end if;

  v_jour_debut := (v_debut at time zone 'Europe/Paris')::date;
  if v_rep = 'aucune' then
    v_jours := null;
    v_jusqu := null;
  else
    if v_jusqu is null or v_jusqu < v_jour_debut or v_jusqu > v_jour_debut + 366 then
      raise exception 'repetition_invalide';
    end if;
    if v_rep = 'jours' then
      if v_jours is null or not v_jours <@ '{1,2,3,4,5,6,7}'::smallint[] then
        raise exception 'repetition_invalide';
      end if;
    else
      v_jours := null;
    end if;
  end if;

  if v_cours is not null and not public.peut_lire_cours(v_cours) then
    raise exception 'cours_indisponible';
  end if;
  if cardinality(v_chapitres) > 30
     or (cardinality(v_chapitres) > 0 and v_cours is null)
     or exists (select 1 from unnest(v_chapitres) c
                 where not exists (select 1 from public.chapitre ch where ch.id = c and ch.cours_id = v_cours and ch.publie)) then
    raise exception 'chapitres_invalides';
  end if;

  if p_id is null then
    if (select count(*) from public.evenement where eleve_id = auth.uid()) >= 500 then
      raise exception 'trop_d_evenements';
    end if;
    insert into public.evenement (eleve_id, type, titre, debut, duree_minutes, cours_id, repetition, jours_semaine, repeter_jusqu_au)
      values (auth.uid(), v_type, v_titre, v_debut, v_duree, v_cours, v_rep, v_jours, v_jusqu)
      returning id into v_id;
  else
    -- Le type ne change pas après la création.
    update public.evenement
       set titre = v_titre, debut = v_debut, duree_minutes = v_duree, cours_id = v_cours,
           repetition = v_rep, jours_semaine = v_jours, repeter_jusqu_au = v_jusqu
     where id = p_id and eleve_id = auth.uid() and type = v_type
     returning id into v_id;
    if v_id is null then
      raise exception 'evenement_introuvable';
    end if;
    delete from public.evenement_chapitre where evenement_id = v_id;
  end if;
  insert into public.evenement_chapitre (evenement_id, chapitre_id) select v_id, unnest(v_chapitres);
  return v_id;
end $$;

create function public.supprimer_evenement(p_id uuid) returns void
language plpgsql security definer set search_path = '' as $$
begin
  if not exists (select 1 from public.evenement where id = p_id and eleve_id = auth.uid()) then
    raise exception 'evenement_introuvable';
  end if;
  -- Un examen emporte les sessions à venir de son plan ; le plan lui-même part en cascade.
  delete from public.evenement
   where debut > now() and plan_id in (select pr.id from public.plan_revision pr where pr.examen_id = p_id);
  delete from public.evenement where id = p_id;
end $$;

create function public.mon_calendrier(p_de timestamptz, p_a timestamptz)
returns table (cle text, evenement_id uuid, type text, titre text, debut timestamptz, fin timestamptz,
               cours_id uuid, cours_titre text, couleur text, cours_slug text, lecture_seule boolean,
               revision_generale boolean, plan_id uuid, classe_nom text, chapitres jsonb)
language plpgsql stable security definer set search_path = '' as $$
#variable_conflict use_column
begin
  if auth.uid() is null then
    raise exception 'non_connecte';
  end if;
  if p_de is null or p_a is null or p_a <= p_de or p_a - p_de > interval '62 days' then
    raise exception 'periode_invalide';
  end if;
  return query
    select * from (
      select e.id::text || '@' || extract(epoch from o.debut)::bigint::text, e.id, e.type::text, e.titre, o.debut, o.fin,
             e.cours_id, c.titre, c.couleur, c.slug, false, e.revision_generale, e.plan_id, null::text,
             coalesce((select jsonb_agg(jsonb_build_object('id', ch.id, 'slug', ch.slug, 'titre', ch.titre, 'numero', ch.numero) order by ch.numero)
                         from public.evenement_chapitre ec join public.chapitre ch on ch.id = ec.chapitre_id
                        where ec.evenement_id = e.id), '[]'::jsonb)
        from prive.occurrences(auth.uid(), p_de, p_a) o
        join public.evenement e on e.id = o.evenement_id
        left join public.cours c on c.id = e.cours_id
      union all
      select x.cle, null::uuid, 'echeance', x.titre, x.instant, x.instant, x.cours_id, x.cours_titre, x.couleur, x.cours_slug,
             true, false, null::uuid, x.classe_nom, '[]'::jsonb
        from prive.echeances_eleve(auth.uid(), p_de, p_a) x
    ) t
    order by 5, 4;
end $$;

revoke execute on function prive.occurrences(uuid, timestamptz, timestamptz), prive.echeances_eleve(uuid, timestamptz, timestamptz) from public;
revoke execute on function public.enregistrer_evenement(uuid, jsonb), public.supprimer_evenement(uuid),
  public.mon_calendrier(timestamptz, timestamptz) from public, anon;
grant execute on function public.enregistrer_evenement(uuid, jsonb), public.supprimer_evenement(uuid),
  public.mon_calendrier(timestamptz, timestamptz) to authenticated;
```

Points à vérifier pendant l'implémentation (context7, documentation de Postgres 17) :
- `generate_series(date, date, interval)` renvoie des `timestamp without time zone` : `j.jour + time` reste un `timestamp`, et `… at time zone 'Europe/Paris'` le convertit en `timestamptz`.
- `order by 5, 4` dans `return query` porte sur la sous-requête `t` : si Postgres refuse les numéros de colonne, nommer les colonnes de `t` et trier par nom.

- [ ] **Step 4 : appliquer, régénérer les types et lancer les tests**

Run : `export PATH="$HOME/.orbstack/bin:$PATH"; npm run db:reset && npx supabase gen types typescript --local > src/lib/supabase/types.ts && npx supabase test db`
Expected : PASS pour `calendrier.test.sql` (20 tests) et pour tous les fichiers existants.

- [ ] **Step 5 : commit**

```bash
git add supabase/migrations/20261201000001_calendrier.sql supabase/tests/calendrier.test.sql src/lib/supabase/types.ts
git commit -m "Ajoute le calendrier de l'élève : événements répétés et échéances des classes

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 2 : lien iCal privé

**Files :**
- Create : `supabase/migrations/20261201000002_ical.sql`
- Create : `supabase/tests/ical.test.sql`
- Create : `src/lib/calendrier/ical.ts`, `src/lib/calendrier/ical.test.ts`
- Create : `src/app/ical/[jeton]/route.ts`
- Modify : `src/lib/routes.ts`, `src/lib/routes.test.ts` (route publique `/ical`)
- Modify : `src/lib/supabase/types.ts` (régénéré)

**Interfaces :**
- Consumes : `prive.occurrences`, `prive.echeances_eleve` (Task 1).
- Produces :
  - `public.creer_jeton_ical() returns text` : le jeton en clair, 43 caractères `[A-Za-z0-9_-]`, renvoyé une seule fois ;
  - `public.revoquer_jeton_ical() returns void` ;
  - `public.mon_jeton_ical() returns timestamptz` : date de création du lien actif, ou null ;
  - `public.calendrier_ical(p_jeton text) returns table (uid text, titre text, debut timestamptz, fin timestamptz)` : ouverte à `anon`, lève `jeton_inconnu` ;
  - `genererIcal(evenements: EvenementIcal[], maintenant: Date): string` et `type EvenementIcal = { uid: string; titre: string; debut: string; fin: string }` ;
  - route `GET /ical/<jeton>.ics`.

- [ ] **Step 1 : écrire le test pgTAP (il échoue)**

Créer `supabase/tests/ical.test.sql` :

```sql
begin;
select plan(10);

insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-0000000000b1', 'eleve-ical@test.local'),
  ('00000000-0000-0000-0000-0000000000b2', 'prof-ical@test.local');
update public.profil set role = 'enseignant' where id = '00000000-0000-0000-0000-0000000000b2';
insert into public.evenement (eleve_id, type, titre, debut, duree_minutes) values
  ('00000000-0000-0000-0000-0000000000b1', 'devoir', 'Exposé', now() + interval '2 days', 60);

set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000b2","role":"authenticated"}', true);
select throws_ok($$ select public.creer_jeton_ical() $$, 'P0001', 'reserve_eleves', 'pas de lien iCal pour un enseignant');

select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000b1","role":"authenticated"}', true);
-- Le jeton en clair est gardé dans un réglage de la transaction (lisible quel que soit le rôle).
select set_config('test.jeton1', public.creer_jeton_ical(), true);
select matches(current_setting('test.jeton1'), '^[A-Za-z0-9_-]{43}$', 'jeton de 43 caractères base64url');
select isnt(public.mon_jeton_ical(), null, 'le lien est actif');

set local role anon;
select set_config('request.jwt.claims', '{"role":"anon"}', true);
select is((select count(*)::int from public.calendrier_ical(current_setting('test.jeton1')) where titre = 'Exposé'), 1,
  'le bon jeton donne les événements, sans connexion');
select throws_ok($$ select * from public.calendrier_ical('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA') $$, 'P0001', 'jeton_inconnu', 'un jeton inconnu est refusé');
select throws_ok($$ select * from public.calendrier_ical('court') $$, 'P0001', 'jeton_inconnu', 'un jeton mal formé est refusé');
select throws_ok($$ select * from prive.jeton_ical $$, '42501', null, 'la table des jetons est inaccessible');

set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000b1","role":"authenticated"}', true);
select set_config('test.jeton2', public.creer_jeton_ical(), true);
set local role anon;
select set_config('request.jwt.claims', '{"role":"anon"}', true);
select throws_ok(format('select * from public.calendrier_ical(%L)', current_setting('test.jeton1')),
  'P0001', 'jeton_inconnu', 'régénérer le lien désactive l''ancien');

set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000b1","role":"authenticated"}', true);
select lives_ok($$ select public.revoquer_jeton_ical() $$, 'révocation');
select is(public.mon_jeton_ical(), null, 'plus de lien actif après la révocation');

select * from finish();
rollback;
```

- [ ] **Step 2 : lancer le test pour le voir échouer**

Run : `export PATH="$HOME/.orbstack/bin:$PATH"; npx supabase test db supabase/tests/ical.test.sql`
Expected : FAIL, `function public.creer_jeton_ical() does not exist`.

- [ ] **Step 3 : écrire la migration**

Créer `supabase/migrations/20261201000002_ical.sql` :

```sql
-- Lien iCal privé : un jeton aléatoire de 256 bits par élève. Seule son empreinte SHA-256 est stockée.

create table prive.jeton_ical (
  eleve_id uuid primary key references public.profil on delete cascade,
  empreinte bytea not null unique,
  cree_le timestamptz not null default now()
);

create function public.creer_jeton_ical() returns text
language plpgsql security definer set search_path = '' as $$
declare
  v_jeton text;
begin
  if public.role_actuel() is distinct from 'eleve' then
    raise exception 'reserve_eleves';
  end if;
  -- base64url sans remplissage : 32 octets donnent 43 caractères.
  v_jeton := translate(encode(extensions.gen_random_bytes(32), 'base64'), '+/=', '-_');
  insert into prive.jeton_ical (eleve_id, empreinte) values (auth.uid(), extensions.digest(v_jeton, 'sha256'))
  on conflict (eleve_id) do update set empreinte = excluded.empreinte, cree_le = now();
  return v_jeton;
end $$;

create function public.revoquer_jeton_ical() returns void
language sql security definer set search_path = '' as $$
  delete from prive.jeton_ical where eleve_id = auth.uid()
$$;

create function public.mon_jeton_ical() returns timestamptz
language sql stable security definer set search_path = '' as $$
  select cree_le from prive.jeton_ical where eleve_id = auth.uid()
$$;

-- Ouverte à anon : le jeton est la seule preuve. Occurrences des 30 derniers jours et des 365 prochains.
create function public.calendrier_ical(p_jeton text)
returns table (uid text, titre text, debut timestamptz, fin timestamptz)
language plpgsql stable security definer set search_path = '' as $$
#variable_conflict use_column
declare
  v_eleve uuid;
begin
  if p_jeton is null or p_jeton !~ '^[A-Za-z0-9_-]{43}$' then
    raise exception 'jeton_inconnu';
  end if;
  select j.eleve_id into v_eleve from prive.jeton_ical j where j.empreinte = extensions.digest(p_jeton, 'sha256');
  if v_eleve is null then
    raise exception 'jeton_inconnu';
  end if;
  return query
    select * from (
      select o.evenement_id::text || '-' || to_char(o.debut at time zone 'UTC', 'YYYYMMDD"T"HH24MISS"Z"'), e.titre, o.debut, o.fin
        from prive.occurrences(v_eleve, now() - interval '30 days', now() + interval '365 days') o
        join public.evenement e on e.id = o.evenement_id
      union all
      select x.cle, x.titre, x.instant, x.instant
        from prive.echeances_eleve(v_eleve, now() - interval '30 days', now() + interval '365 days') x
    ) t
    order by 3;
end $$;

revoke execute on function public.creer_jeton_ical(), public.revoquer_jeton_ical(), public.mon_jeton_ical(),
  public.calendrier_ical(text) from public, anon;
grant execute on function public.creer_jeton_ical(), public.revoquer_jeton_ical(), public.mon_jeton_ical() to authenticated;
grant execute on function public.calendrier_ical(text) to anon, authenticated;
```

Vérifier avec context7 (pgcrypto) que `extensions.digest(text, text)` et `extensions.gen_random_bytes(int)` existent bien dans le schéma `extensions` (déjà utilisé par `prive.nouveau_code_classe`).

- [ ] **Step 4 : appliquer, régénérer les types, lancer les tests de la base**

Run : `export PATH="$HOME/.orbstack/bin:$PATH"; npm run db:reset && npx supabase gen types typescript --local > src/lib/supabase/types.ts && npx supabase test db`
Expected : PASS (10 tests pour `ical.test.sql`).

- [ ] **Step 5 : écrire le test de `genererIcal` (il échoue)**

Créer `src/lib/calendrier/ical.test.ts` :

```ts
import { describe, expect, it } from 'vitest';
import { genererIcal } from './ical';

const maintenant = new Date('2026-12-01T08:00:00Z');

describe('genererIcal', () => {
  it('produit un calendrier valide, en CRLF', () => {
    const ics = genererIcal([{ uid: 'abc-20261207T160000Z', titre: 'Devoir', debut: '2026-12-07T16:00:00Z', fin: '2026-12-07T17:00:00Z' }], maintenant);
    expect(ics.startsWith('BEGIN:VCALENDAR\r\nVERSION:2.0\r\n')).toBe(true);
    expect(ics.endsWith('END:VCALENDAR\r\n')).toBe(true);
    expect(ics).toContain('\r\nBEGIN:VEVENT\r\nUID:abc-20261207T160000Z@app-lycee\r\nDTSTAMP:20261201T080000Z\r\n'
      + 'DTSTART:20261207T160000Z\r\nDTEND:20261207T170000Z\r\nSUMMARY:Devoir\r\nEND:VEVENT\r\n');
    expect(ics.split('\r\n').every((l) => !l.includes('\n'))).toBe(true);
  });

  it('omet DTEND pour un repère sans durée', () => {
    const ics = genererIcal([{ uid: 'e', titre: 'Date limite', debut: '2026-12-07T16:00:00Z', fin: '2026-12-07T16:00:00Z' }], maintenant);
    expect(ics).toContain('DTSTART:20261207T160000Z\r\nSUMMARY:Date limite\r\n');
    expect(ics).not.toContain('DTEND');
  });

  it('échappe les caractères spéciaux du texte', () => {
    const ics = genererIcal([{ uid: 'e', titre: 'Maths; ch. 1, 2\\3\nfin', debut: '2026-12-07T16:00:00Z', fin: '2026-12-07T17:00:00Z' }], maintenant);
    expect(ics).toContain('SUMMARY:Maths\\; ch. 1\\, 2\\\\3\\nfin\r\n');
  });

  it('plie les lignes de plus de 75 octets sans couper un caractère', () => {
    const titre = 'é'.repeat(60);
    const ics = genererIcal([{ uid: 'e', titre, debut: '2026-12-07T16:00:00Z', fin: '2026-12-07T17:00:00Z' }], maintenant);
    const lignes = ics.split('\r\n');
    for (const l of lignes) expect(Buffer.byteLength(l, 'utf8')).toBeLessThanOrEqual(75);
    const depliees = ics.replace(/\r\n /g, '');
    expect(depliees).toContain(`SUMMARY:${titre}\r\n`);
  });
});
```

Run : `npx vitest run src/lib/calendrier/ical.test.ts`
Expected : FAIL, `Failed to resolve import "./ical"`.

- [ ] **Step 6 : écrire `genererIcal`**

Créer `src/lib/calendrier/ical.ts` :

```ts
export type EvenementIcal = { uid: string; titre: string; debut: string; fin: string };

const enUtc = (iso: string) => new Date(iso).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');

function echapper(texte: string) {
  return texte.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');
}

/** Plie une ligne à 75 octets (RFC 5545, 3.1), sans couper un caractère UTF-8. */
function plier(ligne: string): string {
  const morceaux: string[] = [];
  let courant = '';
  let octets = 0;
  for (const car of ligne) {
    const taille = Buffer.byteLength(car, 'utf8');
    // La première ligne a 75 octets ; les suivantes commencent par une espace, donc 74 de contenu.
    const max = morceaux.length === 0 ? 75 : 74;
    if (octets + taille > max) {
      morceaux.push(courant);
      courant = '';
      octets = 0;
    }
    courant += car;
    octets += taille;
  }
  morceaux.push(courant);
  return morceaux.join('\r\n ');
}

export function genererIcal(evenements: EvenementIcal[], maintenant: Date): string {
  const lignes = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//App lycée//Calendrier//FR', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
    'X-WR-CALNAME:App lycée',
  ];
  const stamp = enUtc(maintenant.toISOString());
  for (const e of evenements) {
    lignes.push('BEGIN:VEVENT', `UID:${e.uid}@app-lycee`, `DTSTAMP:${stamp}`, `DTSTART:${enUtc(e.debut)}`);
    if (e.fin !== e.debut && new Date(e.fin).getTime() > new Date(e.debut).getTime()) lignes.push(`DTEND:${enUtc(e.fin)}`);
    lignes.push(`SUMMARY:${echapper(e.titre)}`, 'END:VEVENT');
  }
  lignes.push('END:VCALENDAR');
  return lignes.map(plier).join('\r\n') + '\r\n';
}
```

Run : `npx vitest run src/lib/calendrier/ical.test.ts`
Expected : PASS (4 tests).

- [ ] **Step 7 : route publique**

Ajouter `/ical` à `ROUTES_PUBLIQUES` dans `src/lib/routes.ts` :

```ts
export const ROUTES_PUBLIQUES = ['/connexion', '/inscription', '/auth/callback', '/auth/confirm', '/ical'];
```

Dans `src/lib/routes.test.ts`, ajouter au test « laisse un visiteur non connecté sur les pages publiques » :

```ts
    expect(redirectionPour('/ical/abc.ics', false)).toBeNull();
```

Créer `src/app/ical/[jeton]/route.ts` :

```ts
import { createClient } from '@supabase/supabase-js';
import { genererIcal } from '@/lib/calendrier/ical';
import type { Database } from '@/lib/supabase/types';

export const dynamic = 'force-dynamic';

// Accès sans session : le jeton est la seule preuve, vérifiée par la RPC calendrier_ical (ouverte à anon).
export async function GET(_requete: Request, { params }: { params: Promise<{ jeton: string }> }) {
  const { jeton } = await params;
  const supabase = createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data, error } = await supabase.rpc('calendrier_ical', { p_jeton: jeton.replace(/\.ics$/, '') });
  if (error || !data) return new Response('Calendrier introuvable.', { status: 404, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
  return new Response(genererIcal(data, new Date()), {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': 'inline; filename="calendrier.ics"',
      'Cache-Control': 'private, max-age=300',
      'Referrer-Policy': 'no-referrer',
      'X-Robots-Tag': 'noindex',
    },
  });
}
```

Vérifier avec context7 la signature d'un route handler avec segment dynamique dans Next.js 16 (`params` est une `Promise`).

- [ ] **Step 8 : vérifier**

Run : `npm test && npm run typecheck && npm run lint`
Expected : PASS.

- [ ] **Step 9 : commit**

```bash
git add supabase/migrations/20261201000002_ical.sql supabase/tests/ical.test.sql src/lib/calendrier/ical.ts src/lib/calendrier/ical.test.ts "src/app/ical/[jeton]/route.ts" src/lib/routes.ts src/lib/routes.test.ts src/lib/supabase/types.ts
git commit -m "Ajoute le lien iCal privé et révocable du calendrier

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 3 : plan de révision côté base

**Files :**
- Create : `supabase/migrations/20261201000003_plan_revision.sql`
- Create : `supabase/tests/plan_revision.test.sql`
- Modify : `src/lib/supabase/types.ts` (régénéré)

**Interfaces :**
- Consumes : tables de la Task 1.
- Produces :
  - `public.accepter_plan_revision(p_examen uuid, p_reglages jsonb, p_sessions jsonb) returns uuid` :
    - `p_reglages` : `{ sessions_par_semaine, duree_minutes, jours_preferes: number[], heure_debut: 'HH:MM' }` ;
    - `p_sessions` : tableau de `{ titre, debut (ISO), duree_minutes, chapitres: uuid[], revision_generale: boolean }` ;
  - `public.refuser_plan_revision(p_examen uuid, p_reglages jsonb) returns void` ;
  - `public.mes_creneaux_occupes(p_de timestamptz, p_a timestamptz) returns table (evenement_id uuid, plan_id uuid, debut timestamptz, fin timestamptz)` (366 jours au plus) ;
  - `public.plans_a_reorganiser() returns table (plan_id uuid, examen_id uuid, examen_titre text)` ;
  - `public.ignorer_reorganisation(p_plan uuid) returns void` ;
  - codes d'erreur : `examen_introuvable`, `examen_passe`, `planning_invalide`, `plan_introuvable`.

- [ ] **Step 1 : écrire le test pgTAP (il échoue)**

Créer `supabase/tests/plan_revision.test.sql` :

```sql
begin;
select plan(18);

insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-0000000000d1', 'eleve-plan@test.local'),
  ('00000000-0000-0000-0000-0000000000d2', 'autre-plan@test.local'),
  ('00000000-0000-0000-0000-0000000000d3', 'prof-plan@test.local');
update public.profil set role = 'enseignant' where id = '00000000-0000-0000-0000-0000000000d3';
insert into public.filiere (id, voie, code, nom) values ('10000000-0000-0000-0000-0000000000d1', 'technologique', 'PLA', 'Filière plan');
insert into public.cours (id, slug, filiere_id, niveau_code, matiere, titre, publie) values
  ('20000000-0000-0000-0000-0000000000d1', 'cours-plan', '10000000-0000-0000-0000-0000000000d1', '1re', 'P', 'Cours plan', true),
  ('20000000-0000-0000-0000-0000000000d2', 'cours-plan-autre', '10000000-0000-0000-0000-0000000000d1', '1re', 'Q', 'Autre', true);
insert into public.chapitre (id, cours_id, slug, numero, titre, publie) values
  ('30000000-0000-0000-0000-0000000000d1', '20000000-0000-0000-0000-0000000000d1', 'ch1', 1, 'Un', true),
  ('30000000-0000-0000-0000-0000000000d2', '20000000-0000-0000-0000-0000000000d1', 'ch2', 2, 'Deux', true),
  ('30000000-0000-0000-0000-0000000000d3', '20000000-0000-0000-0000-0000000000d2', 'ch1', 1, 'Ailleurs', true);
insert into public.evenement (id, eleve_id, type, titre, debut, duree_minutes, cours_id) values
  ('40000000-0000-0000-0000-0000000000d1', '00000000-0000-0000-0000-0000000000d1', 'examen_reel', 'Contrôle', now() + interval '10 days', 120, '20000000-0000-0000-0000-0000000000d1');
-- Gabarits JSON réutilisés par les tests.
select set_config('test.reglages', '{"sessions_par_semaine":3,"duree_minutes":60,"jours_preferes":[1,3,5],"heure_debut":"17:00"}', true);
select set_config('test.sessions', jsonb_build_array(
  jsonb_build_object('titre', 'Révision · Ch. 1 Un', 'debut', now() + interval '2 days', 'duree_minutes', 60,
                     'chapitres', jsonb_build_array('30000000-0000-0000-0000-0000000000d1'), 'revision_generale', false),
  jsonb_build_object('titre', 'Révision générale', 'debut', now() + interval '9 days', 'duree_minutes', 60,
                     'chapitres', jsonb_build_array('30000000-0000-0000-0000-0000000000d1', '30000000-0000-0000-0000-0000000000d2'), 'revision_generale', true)
)::text, true);

set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000d3","role":"authenticated"}', true);
select throws_ok($$ select public.accepter_plan_revision('40000000-0000-0000-0000-0000000000d1', current_setting('test.reglages')::jsonb, current_setting('test.sessions')::jsonb) $$,
  'P0001', 'reserve_eleves', 'réservé aux élèves');

select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000d2","role":"authenticated"}', true);
select throws_ok($$ select public.accepter_plan_revision('40000000-0000-0000-0000-0000000000d1', current_setting('test.reglages')::jsonb, current_setting('test.sessions')::jsonb) $$,
  'P0001', 'examen_introuvable', 'on ne planifie que ses propres examens');

select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000d1","role":"authenticated"}', true);
select throws_ok(format('select public.accepter_plan_revision(%L, %L::jsonb, %L::jsonb)', '40000000-0000-0000-0000-0000000000d1', current_setting('test.reglages'),
  jsonb_build_array(jsonb_build_object('titre', 'X', 'debut', now() + interval '2 days', 'duree_minutes', 60,
    'chapitres', jsonb_build_array('30000000-0000-0000-0000-0000000000d3'), 'revision_generale', false))),
  'P0001', 'planning_invalide', 'chapitre d''un autre cours refusé');
select throws_ok(format('select public.accepter_plan_revision(%L, %L::jsonb, %L::jsonb)', '40000000-0000-0000-0000-0000000000d1', current_setting('test.reglages'),
  jsonb_build_array(jsonb_build_object('titre', 'X', 'debut', now() + interval '11 days', 'duree_minutes', 60,
    'chapitres', jsonb_build_array('30000000-0000-0000-0000-0000000000d1'), 'revision_generale', false))),
  'P0001', 'planning_invalide', 'session après l''examen refusée');
select lives_ok($$ select public.accepter_plan_revision('40000000-0000-0000-0000-0000000000d1', current_setting('test.reglages')::jsonb, current_setting('test.sessions')::jsonb) $$,
  'le planning est accepté');
select is((select count(*)::int from public.evenement e join public.plan_revision p on p.id = e.plan_id where p.examen_id = '40000000-0000-0000-0000-0000000000d1'),
  2, 'deux sessions créées');
select is((select statut::text from public.plan_revision where examen_id = '40000000-0000-0000-0000-0000000000d1'), 'accepte', 'plan accepté');
select is((select count(*)::int from public.plans_a_reorganiser()), 0, 'rien à réorganiser au départ');

-- Chapitre 1 validé après la création du plan : la session du chapitre 1 est encore à venir.
reset role;
insert into public.progression_chapitre (eleve_id, chapitre_id, meilleure_note, valide, valide_le)
  values ('00000000-0000-0000-0000-0000000000d1', '30000000-0000-0000-0000-0000000000d1', 90, true, clock_timestamp());
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000d1","role":"authenticated"}', true);
select is((select count(*)::int from public.plans_a_reorganiser()), 1, 'un chapitre prévu plus tard est validé : réorganisation proposée');
select lives_ok($$ select public.ignorer_reorganisation((select id from public.plan_revision limit 1)) $$, '« Plus tard »');
select is((select count(*)::int from public.plans_a_reorganiser()), 0, 'la proposition disparaît après « Plus tard »');

select lives_ok(format('select public.accepter_plan_revision(%L, %L::jsonb, %L::jsonb)', '40000000-0000-0000-0000-0000000000d1', current_setting('test.reglages'),
  jsonb_build_array(jsonb_build_object('titre', 'Révision générale', 'debut', now() + interval '9 days', 'duree_minutes', 60,
    'chapitres', jsonb_build_array('30000000-0000-0000-0000-0000000000d2'), 'revision_generale', true))),
  'réorganiser remplace le planning');
select is((select count(*)::int from public.evenement where type = 'revision'), 1, 'les sessions à venir de l''ancien plan sont supprimées');
select lives_ok($$ select public.refuser_plan_revision('40000000-0000-0000-0000-0000000000d1', current_setting('test.reglages')::jsonb) $$,
  'refuser après acceptation ne fait rien');
select is((select statut::text from public.plan_revision where examen_id = '40000000-0000-0000-0000-0000000000d1'), 'accepte', 'le plan accepté reste en place');
select throws_ok($$ select * from public.mes_creneaux_occupes(now(), now() + interval '400 days') $$,
  'P0001', 'periode_invalide', 'période de plus de 366 jours refusée');

select lives_ok($$ select public.supprimer_evenement('40000000-0000-0000-0000-0000000000d1') $$, 'suppression de l''examen');
select is((select count(*)::int from public.evenement where type = 'revision' and debut > now()), 0,
  'supprimer l''examen supprime les sessions à venir de son plan');

select * from finish();
rollback;
```

- [ ] **Step 2 : lancer le test pour le voir échouer**

Run : `export PATH="$HOME/.orbstack/bin:$PATH"; npx supabase test db supabase/tests/plan_revision.test.sql`
Expected : FAIL, `function public.accepter_plan_revision(...) does not exist`.

- [ ] **Step 3 : écrire la migration**

Créer `supabase/migrations/20261201000003_plan_revision.sql` :

```sql
-- Planning de révision : le calcul se fait en TypeScript (src/lib/planning/generer.ts) ;
-- la base vérifie chaque session et crée les événements dans une seule transaction.

-- Réglages communs à l'acceptation et au refus. Lève planning_invalide si un champ manque ou sort des bornes.
create function prive.lire_reglages_plan(p jsonb, out sessions_par_semaine smallint, out duree_minutes smallint,
                                          out jours_preferes smallint[], out heure_debut time)
language plpgsql immutable set search_path = '' as $$
begin
  begin
    sessions_par_semaine := (p->>'sessions_par_semaine')::smallint;
    duree_minutes := (p->>'duree_minutes')::smallint;
    jours_preferes := array(select distinct x::smallint from jsonb_array_elements_text(p->'jours_preferes') x order by 1);
    heure_debut := (p->>'heure_debut')::time;
  exception when others then
    raise exception 'planning_invalide';
  end;
  if sessions_par_semaine is null or sessions_par_semaine not between 1 and 7
     or duree_minutes is null or duree_minutes not between 15 and 180
     or cardinality(jours_preferes) not between 1 and 7 or not jours_preferes <@ '{1,2,3,4,5,6,7}'::smallint[]
     or heure_debut is null or heure_debut not between '06:00' and '21:00' then
    raise exception 'planning_invalide';
  end if;
end $$;

create function public.accepter_plan_revision(p_examen uuid, p_reglages jsonb, p_sessions jsonb) returns uuid
language plpgsql security definer set search_path = '' as $$
declare
  v_examen public.evenement;
  v_reglages record;
  v_ancien uuid;
  v_plan uuid;
  v_id uuid;
  s jsonb;
  v_titre text;
  v_debut timestamptz;
  v_duree int;
  v_generale boolean;
  v_chapitres uuid[];
begin
  if public.role_actuel() is distinct from 'eleve' then
    raise exception 'reserve_eleves';
  end if;
  select * into v_examen from public.evenement
   where id = p_examen and eleve_id = auth.uid() and type = 'examen_reel' and cours_id is not null
   for update;
  if not found then
    raise exception 'examen_introuvable';
  end if;
  if v_examen.debut <= now() then
    raise exception 'examen_passe';
  end if;
  if v_examen.debut > now() + interval '365 days'
     or jsonb_typeof(p_sessions) is distinct from 'array' or jsonb_array_length(p_sessions) not between 1 and 120 then
    raise exception 'planning_invalide';
  end if;
  select * into v_reglages from prive.lire_reglages_plan(p_reglages);

  -- Réorganisation : les sessions à venir de l'ancien plan disparaissent, les passées restent sans plan.
  select id into v_ancien from public.plan_revision where examen_id = p_examen;
  if v_ancien is not null then
    delete from public.evenement where plan_id = v_ancien and debut > now();
    delete from public.plan_revision where id = v_ancien;
  end if;
  if (select count(*) from public.evenement where eleve_id = auth.uid()) + jsonb_array_length(p_sessions) > 500 then
    raise exception 'trop_d_evenements';
  end if;

  insert into public.plan_revision (eleve_id, examen_id, sessions_par_semaine, duree_minutes, jours_preferes, heure_debut, statut)
    values (auth.uid(), p_examen, v_reglages.sessions_par_semaine, v_reglages.duree_minutes, v_reglages.jours_preferes,
            v_reglages.heure_debut, 'accepte')
    returning id into v_plan;

  for s in select value from jsonb_array_elements(p_sessions) loop
    begin
      v_titre := btrim(s->>'titre');
      v_debut := (s->>'debut')::timestamptz;
      v_duree := (s->>'duree_minutes')::int;
      v_generale := coalesce((s->>'revision_generale')::boolean, false);
      v_chapitres := array(select distinct x::uuid from jsonb_array_elements_text(s->'chapitres') x);
    exception when others then
      raise exception 'planning_invalide';
    end;
    if v_titre is null or char_length(v_titre) not between 1 and 120
       or v_debut is null or v_debut < now() - interval '1 hour' or v_debut >= v_examen.debut
       or v_duree is null or v_duree not between 15 and 180
       or cardinality(v_chapitres) not between 1 and 30
       or exists (select 1 from unnest(v_chapitres) c
                   where not exists (select 1 from public.chapitre ch where ch.id = c and ch.cours_id = v_examen.cours_id and ch.publie)) then
      raise exception 'planning_invalide';
    end if;
    insert into public.evenement (eleve_id, type, titre, debut, duree_minutes, cours_id, plan_id, revision_generale)
      values (auth.uid(), 'revision', v_titre, v_debut, v_duree, v_examen.cours_id, v_plan, v_generale)
      returning id into v_id;
    insert into public.evenement_chapitre (evenement_id, chapitre_id) select v_id, unnest(v_chapitres);
  end loop;
  return v_plan;
end $$;

-- Un refus n'écrase jamais un plan accepté : il sert seulement à ne plus reproposer le planning.
create function public.refuser_plan_revision(p_examen uuid, p_reglages jsonb) returns void
language plpgsql security definer set search_path = '' as $$
declare
  v_reglages record;
begin
  if public.role_actuel() is distinct from 'eleve' then
    raise exception 'reserve_eleves';
  end if;
  if not exists (select 1 from public.evenement where id = p_examen and eleve_id = auth.uid() and type = 'examen_reel') then
    raise exception 'examen_introuvable';
  end if;
  select * into v_reglages from prive.lire_reglages_plan(p_reglages);
  insert into public.plan_revision (eleve_id, examen_id, sessions_par_semaine, duree_minutes, jours_preferes, heure_debut, statut)
    values (auth.uid(), p_examen, v_reglages.sessions_par_semaine, v_reglages.duree_minutes, v_reglages.jours_preferes,
            v_reglages.heure_debut, 'refuse')
  on conflict (examen_id) do nothing;
end $$;

create function public.mes_creneaux_occupes(p_de timestamptz, p_a timestamptz)
returns table (evenement_id uuid, plan_id uuid, debut timestamptz, fin timestamptz)
language plpgsql stable security definer set search_path = '' as $$
#variable_conflict use_column
begin
  if auth.uid() is null then
    raise exception 'non_connecte';
  end if;
  if p_de is null or p_a is null or p_a <= p_de or p_a - p_de > interval '366 days' then
    raise exception 'periode_invalide';
  end if;
  return query
    select o.evenement_id, e.plan_id, o.debut, o.fin
      from prive.occurrences(auth.uid(), p_de, p_a) o
      join public.evenement e on e.id = o.evenement_id
     order by o.debut;
end $$;

-- Plans acceptés dont une session à venir (hors révision générale) porte un chapitre validé
-- après la création du plan ou après le dernier « Plus tard ».
create function public.plans_a_reorganiser()
returns table (plan_id uuid, examen_id uuid, examen_titre text)
language sql stable security definer set search_path = '' as $$
  select p.id, p.examen_id, x.titre
    from public.plan_revision p
    join public.evenement x on x.id = p.examen_id
   where p.eleve_id = auth.uid() and p.statut = 'accepte' and x.debut > now()
     and exists (
       select 1
         from public.evenement s
         join public.evenement_chapitre ec on ec.evenement_id = s.id
         join public.progression_chapitre pc on pc.chapitre_id = ec.chapitre_id and pc.eleve_id = p.eleve_id
        where s.plan_id = p.id and s.debut > now() and not s.revision_generale
          and pc.valide and pc.valide_le > greatest(p.cree_le, coalesce(p.reorganisation_vue_le, p.cree_le)))
$$;

create function public.ignorer_reorganisation(p_plan uuid) returns void
language plpgsql security definer set search_path = '' as $$
begin
  -- clock_timestamp et non now() : une validation enregistrée plus tôt dans la même transaction reste antérieure.
  update public.plan_revision set reorganisation_vue_le = clock_timestamp() where id = p_plan and eleve_id = auth.uid();
  if not found then
    raise exception 'plan_introuvable';
  end if;
end $$;

revoke execute on function prive.lire_reglages_plan(jsonb) from public;
revoke execute on function public.accepter_plan_revision(uuid, jsonb, jsonb), public.refuser_plan_revision(uuid, jsonb),
  public.mes_creneaux_occupes(timestamptz, timestamptz), public.plans_a_reorganiser(), public.ignorer_reorganisation(uuid)
  from public, anon;
grant execute on function public.accepter_plan_revision(uuid, jsonb, jsonb), public.refuser_plan_revision(uuid, jsonb),
  public.mes_creneaux_occupes(timestamptz, timestamptz), public.plans_a_reorganiser(), public.ignorer_reorganisation(uuid)
  to authenticated;
```

- [ ] **Step 4 : appliquer, régénérer les types, lancer les tests**

Run : `export PATH="$HOME/.orbstack/bin:$PATH"; npm run db:reset && npx supabase gen types typescript --local > src/lib/supabase/types.ts && npx supabase test db`
Expected : PASS (18 tests pour `plan_revision.test.sql`, tous les autres fichiers inchangés).

- [ ] **Step 5 : commit**

```bash
git add supabase/migrations/20261201000003_plan_revision.sql supabase/tests/plan_revision.test.sql src/lib/supabase/types.ts
git commit -m "Ajoute l'enregistrement du planning de révision et sa réorganisation

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 4 : révision générale (quiz sur plusieurs chapitres)

**Files :**
- Create : `supabase/migrations/20261201000004_revision_generale.sql`
- Create : `supabase/tests/revision_generale.test.sql`
- Modify : `src/app/(app)/tentative/[id]/page.tsx`, `src/app/(app)/tentative/[id]/resultat/page.tsx`, `src/app/(app)/page.tsx` (titre d'une tentative sans chapitre)
- Modify : `src/lib/supabase/types.ts` (régénéré)

**Interfaces :**
- Consumes : `evenement`, `evenement_chapitre` (Task 1) ; `prive.cloturer`, `prive.cloturer_si_expiree`, `prive.melanger`, `public.peut_lire_cours`.
- Produces :
  - `public.demarrer_revision_generale(p_evenement uuid) returns uuid` (identifiant de la tentative) ;
  - une tentative `type = 'revision'` peut avoir `chapitre_id` nul ;
  - index unique `tentative_une_revision_generale_en_cours` (un démarrage en double lève 23505, comme pour l'évaluation : côté TypeScript, passer par `appelerAvecRelance`).

- [ ] **Step 1 : écrire le test pgTAP (il échoue)**

Créer `supabase/tests/revision_generale.test.sql` :

```sql
begin;
select plan(10);

insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-0000000000e1', 'eleve-rg@test.local'),
  ('00000000-0000-0000-0000-0000000000e2', 'autre-rg@test.local');
insert into public.filiere (id, voie, code, nom) values ('10000000-0000-0000-0000-0000000000e1', 'technologique', 'RGE', 'Filière révision');
insert into public.cours (id, slug, filiere_id, niveau_code, matiere, titre, publie) values
  ('20000000-0000-0000-0000-0000000000e1', 'cours-rg', '10000000-0000-0000-0000-0000000000e1', '1re', 'R', 'Cours révision', true);
insert into public.chapitre (id, cours_id, slug, numero, titre, publie) values
  ('30000000-0000-0000-0000-0000000000e1', '20000000-0000-0000-0000-0000000000e1', 'ch1', 1, 'Un', true),
  ('30000000-0000-0000-0000-0000000000e2', '20000000-0000-0000-0000-0000000000e1', 'ch2', 2, 'Deux', true);
-- 12 questions par chapitre : trop peu pour un quiz de chapitre (15), assez pour une révision générale (24).
insert into public.question (chapitre_id, type, enonce, propositions, statut, source)
  select c.id, 'qcm_unique', 'Q', '["a","b"]', 'valide', 'rg:' || c.slug || ':' || i
    from public.chapitre c cross join generate_series(1, 12) i where c.cours_id = '20000000-0000-0000-0000-0000000000e1';
insert into public.question_corrige (question_id, bonnes_reponses) select id, '[0]' from public.question where source like 'rg:%';
insert into public.evenement (id, eleve_id, type, titre, debut, duree_minutes, cours_id, revision_generale) values
  ('40000000-0000-0000-0000-0000000000e1', '00000000-0000-0000-0000-0000000000e1', 'revision', 'Révision générale', now() + interval '1 day', 60, '20000000-0000-0000-0000-0000000000e1', true),
  ('40000000-0000-0000-0000-0000000000e2', '00000000-0000-0000-0000-0000000000e1', 'revision', 'Révision générale courte', now() + interval '2 days', 60, '20000000-0000-0000-0000-0000000000e1', true);
insert into public.evenement_chapitre values
  ('40000000-0000-0000-0000-0000000000e1', '30000000-0000-0000-0000-0000000000e1'),
  ('40000000-0000-0000-0000-0000000000e1', '30000000-0000-0000-0000-0000000000e2'),
  ('40000000-0000-0000-0000-0000000000e2', '30000000-0000-0000-0000-0000000000e1');

set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000e2","role":"authenticated"}', true);
select throws_ok($$ select public.demarrer_revision_generale('40000000-0000-0000-0000-0000000000e1') $$,
  'P0001', 'evenement_introuvable', 'on ne lance que ses propres révisions générales');

select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000e1","role":"authenticated"}', true);
select throws_ok($$ select public.demarrer_revision_generale('40000000-0000-0000-0000-0000000000e2') $$,
  'P0001', 'quiz_indisponible', 'moins de 15 questions validées au total');
select set_config('test.tentative', public.demarrer_revision_generale('40000000-0000-0000-0000-0000000000e1')::text, true);
select results_eq(
  $$ select type::text, chapitre_id, nb_questions::int from public.tentative where id = current_setting('test.tentative')::uuid $$,
  $$ values ('revision'::text, null::uuid, 24) $$,
  'tentative de révision sans chapitre, 24 questions (toutes celles disponibles)');
select is((select count(distinct q.chapitre_id)::int from public.tentative_question tq join public.question q on q.id = tq.question_id
            where tq.tentative_id = current_setting('test.tentative')::uuid), 2, 'les deux chapitres sont représentés');
select is(public.demarrer_revision_generale('40000000-0000-0000-0000-0000000000e1'), current_setting('test.tentative')::uuid,
  'relancer renvoie la révision générale ouverte');
select lives_ok($$ select public.terminer_tentative(current_setting('test.tentative')::uuid) $$, 'la tentative se termine');
select is((select count(*)::int from public.progression_chapitre where eleve_id = '00000000-0000-0000-0000-0000000000e1'), 0,
  'la progression des chapitres n''est pas touchée');
select is((select count(*)::int from public.historique_question where eleve_id = '00000000-0000-0000-0000-0000000000e1'), 24,
  'l''historique des questions est alimenté');
select is((select statut::text from public.tentative where id = current_setting('test.tentative')::uuid), 'terminee', 'statut terminé');

reset role;
select throws_ok($$ insert into public.tentative (eleve_id, type, cours_id, chapitre_id, nb_questions)
                    values ('00000000-0000-0000-0000-0000000000e1', 'quiz_chapitre', '20000000-0000-0000-0000-0000000000e1', null, 15) $$,
  '23514', null, 'un quiz de chapitre a toujours un chapitre');

select * from finish();
rollback;
```

- [ ] **Step 2 : lancer le test pour le voir échouer**

Run : `export PATH="$HOME/.orbstack/bin:$PATH"; npx supabase test db supabase/tests/revision_generale.test.sql`
Expected : FAIL, `function public.demarrer_revision_generale(uuid) does not exist`.

- [ ] **Step 3 : écrire la migration**

Créer `supabase/migrations/20261201000004_revision_generale.sql`. `prive.cloturer` reprend le corps de `20261110000007_durcissement.sql`, avec l'attribut `security invoker` posé par `20261117000001_dette.sql`. Le seul changement est `elsif t.chapitre_id is not null` à la place de `else`.

```sql
-- Révision générale : une tentative « revision » sans chapitre, qui tire dans plusieurs chapitres d'un cours.

-- 1. Contrainte : seul un quiz de chapitre exige un chapitre ; l'évaluation n'en a jamais.
do $$
declare
  v_nom text;
begin
  select conname into v_nom from pg_constraint
   where conrelid = 'public.tentative'::regclass and contype = 'c'
     and pg_get_constraintdef(oid) like '%evaluation_cours%chapitre_id%';
  execute format('alter table public.tentative drop constraint %I', v_nom);
end $$;
alter table public.tentative add constraint tentative_chapitre_selon_type check (
  (type = 'evaluation_cours' and chapitre_id is null)
  or (type = 'quiz_chapitre' and chapitre_id is not null)
  or type = 'revision'
);
create unique index tentative_une_revision_generale_en_cours on public.tentative (eleve_id, cours_id)
  where type = 'revision' and chapitre_id is null and statut = 'en_cours';

-- 2. cloturer : corps de 20261110000007 ; une révision générale (sans chapitre) ne touche pas progression_chapitre.
create or replace function prive.cloturer(p_tentative uuid, p_statut public.statut_tentative_t) returns void
language plpgsql security invoker set search_path = '' as $$
declare
  t public.tentative;
  v_note numeric(5,2);
  v_fin timestamptz;
begin
  select * into t from public.tentative where id = p_tentative for update;
  if not found or t.statut <> 'en_cours' then
    return;
  end if;
  -- Une tentative expirée se termine à sa date limite, pas au moment (tardif) où on la clôture :
  -- le délai de 24 h entre deux essais part de la vraie fin.
  v_fin := case when p_statut = 'expiree' and t.date_limite is not null then least(now(), t.date_limite) else now() end;

  update public.tentative_question tq
     set correcte = prive.corriger(tq.question_id, tq.reponse)
   where tq.tentative_id = p_tentative;

  select coalesce(round(100.0 * count(*) filter (where correcte) / nullif(count(*), 0), 2), 0) into v_note
    from public.tentative_question where tentative_id = p_tentative;

  update public.tentative
     set statut = p_statut, fin = v_fin, note = v_note, reussie = v_note >= 75
   where id = p_tentative;

  insert into public.historique_question as h (eleve_id, question_id, vue, ratee, derniere_reponse)
    select t.eleve_id, tq.question_id, 1, case when tq.correcte then 0 else 1 end, now()
      from public.tentative_question tq where tq.tentative_id = p_tentative
     order by tq.question_id
  on conflict (eleve_id, question_id) do update
    set vue = h.vue + 1, ratee = h.ratee + excluded.ratee, derniere_reponse = now();

  if t.type = 'evaluation_cours' then
    insert into public.progression_cours as p (eleve_id, cours_id, meilleure_note, valide, valide_le, essais, dernier_essai)
      values (t.eleve_id, t.cours_id, v_note, v_note >= 75, case when v_note >= 75 then v_fin end, 1, v_fin)
    on conflict (eleve_id, cours_id) do update set
      meilleure_note = greatest(p.meilleure_note, excluded.meilleure_note),
      valide = p.valide or excluded.valide,
      valide_le = coalesce(p.valide_le, excluded.valide_le),
      essais = p.essais + 1,
      dernier_essai = v_fin;
  elsif t.chapitre_id is not null then
    insert into public.progression_chapitre as p (eleve_id, chapitre_id, meilleure_note, valide, valide_le)
      values (t.eleve_id, t.chapitre_id, v_note, v_note >= 75, case when v_note >= 75 then v_fin end)
    on conflict (eleve_id, chapitre_id) do update set
      meilleure_note = greatest(p.meilleure_note, excluded.meilleure_note),
      valide = p.valide or excluded.valide,
      valide_le = coalesce(p.valide_le, excluded.valide_le);
  end if;
end $$;

-- 3. Démarrage d'une révision générale depuis une session du calendrier.
create function public.demarrer_revision_generale(p_evenement uuid) returns uuid
language plpgsql security definer set search_path = '' as $$
declare
  v_cours uuid;
  v_chapitres uuid[];
  v_dispo int;
  v_nb int;
  v_id uuid;
  r record;
begin
  if auth.uid() is null then
    raise exception 'non_connecte';
  end if;
  select e.cours_id,
         array(select ec.chapitre_id from public.evenement_chapitre ec
                 join public.chapitre ch on ch.id = ec.chapitre_id and ch.publie
                where ec.evenement_id = e.id)
    into v_cours, v_chapitres
    from public.evenement e
   where e.id = p_evenement and e.eleve_id = auth.uid() and e.revision_generale;
  if v_cours is null then
    raise exception 'evenement_introuvable';
  end if;
  if not public.peut_lire_cours(v_cours) then
    raise exception 'acces_refuse';
  end if;
  -- Même règle que demarrer_quiz : pas de quiz du cours pendant une évaluation ouverte.
  for r in select id from public.tentative
            where eleve_id = auth.uid() and cours_id = v_cours and type = 'evaluation_cours' and statut = 'en_cours' loop
    if not prive.cloturer_si_expiree(r.id) then
      raise exception 'evaluation_en_cours';
    end if;
  end loop;
  select t.id into v_id from public.tentative t
   where t.eleve_id = auth.uid() and t.cours_id = v_cours and t.type = 'revision' and t.chapitre_id is null and t.statut = 'en_cours';
  if v_id is not null then
    return v_id;
  end if;
  select count(*) into v_dispo from public.question q where q.chapitre_id = any (v_chapitres) and q.statut = 'valide';
  if v_dispo < 15 then
    raise exception 'quiz_indisponible';
  end if;
  v_nb := least(30, v_dispo);

  insert into public.tentative (eleve_id, type, cours_id, chapitre_id, nb_questions)
    values (auth.uid(), 'revision', v_cours, null, v_nb)
    returning id into v_id;

  -- À tour de rôle entre les chapitres (rang), et dans chaque chapitre : ratées (0), jamais vues (1), les autres (2).
  -- L'ordre d'affichage est ensuite aléatoire.
  insert into public.tentative_question (tentative_id, ordre, question_id, permutation)
    select v_id, row_number() over (order by random()), s.id, prive.melanger(jsonb_array_length(s.propositions))
      from (
        select q.id, q.propositions,
               row_number() over (partition by q.chapitre_id order by p.priorite, random()) as rang, p.priorite
          from public.question q
          left join public.historique_question h on h.question_id = q.id and h.eleve_id = auth.uid()
          cross join lateral (select case when h.question_id is null then 1 when h.ratee > 0 then 0 else 2 end as priorite) p
         where q.chapitre_id = any (v_chapitres) and q.statut = 'valide'
         order by rang, priorite
         limit v_nb
      ) s;
  return v_id;
end $$;

revoke execute on function public.demarrer_revision_generale(uuid) from public, anon;
grant execute on function public.demarrer_revision_generale(uuid) to authenticated;
```

Avant d'écrire, vérifier dans `20261110000007_durcissement.sql` que le corps de `prive.cloturer` recopié ici est identique, au changement près. Vérifier aussi que `correction_tentative` et `questions_tentative` (corps les plus récents) ne supposent pas un `chapitre_id` non nul pour une tentative `revision`. Si c'est le cas, les corriger dans cette migration, avec un test.

- [ ] **Step 4 : appliquer, régénérer les types, lancer les tests de la base**

Run : `export PATH="$HOME/.orbstack/bin:$PATH"; npm run db:reset && npx supabase gen types typescript --local > src/lib/supabase/types.ts && npx supabase test db`
Expected : PASS (10 tests pour `revision_generale.test.sql`). Les tests des quiz et des évaluations restent verts.

- [ ] **Step 5 : afficher une tentative sans chapitre**

- `src/app/(app)/tentative/[id]/page.tsx`, ligne du titre :

```tsx
  const titre = t.type === 'evaluation_cours' ? `Évaluation · ${t.cours?.titre}`
    : t.chapitre ? `Quiz · ${t.chapitre.titre}` : `Révision générale · ${t.cours?.titre}`;
```

- `src/app/(app)/tentative/[id]/resultat/page.tsx` :
  - même règle pour la pastille ;
  - sous le bloc `!evaluation && correction.chapitre`, ajouter pour une révision générale (`!evaluation && !correction.chapitre`) :

```tsx
            <Link href="/calendrier" className="bouton bouton-secondaire">Retour au calendrier</Link>
```

- `src/app/(app)/page.tsx`, « Mes derniers quiz » : remplacer `t.chapitre?.titre ?? t.cours?.titre ?? 'Quiz'` par :

```tsx
t.chapitre?.titre ?? `Révision générale · ${t.cours?.titre ?? 'cours'}`
```

- Rechercher d'autres usages qui supposent un chapitre pour une tentative non-évaluation : `grep -rn "chapitre!" src` et `grep -rn "\.chapitre\." src/app src/components`. Corriger chaque cas trouvé de la même façon.

- [ ] **Step 6 : vérifier**

Run : `npm test && npm run typecheck && npm run lint`
Expected : PASS.

- [ ] **Step 7 : commit**

```bash
git add supabase/migrations/20261201000004_revision_generale.sql supabase/tests/revision_generale.test.sql src/lib/supabase/types.ts "src/app/(app)/tentative" "src/app/(app)/page.tsx"
git commit -m "Ajoute la révision générale : un quiz de 30 questions sur plusieurs chapitres

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 5 : dette des échéances (classes quittées)

**Files :**
- Create : `supabase/migrations/20261201000005_echeances_departs.sql`
- Create : `supabase/tests/echeances_departs.test.sql`
- Modify : `src/lib/quiz/requetes.ts`, `src/app/(app)/cours/[slug]/evaluation/page.tsx`, `src/components/FormulaireRejoindre.tsx`
- Modify : `src/lib/supabase/types.ts` (régénéré)

**Interfaces :**
- Consumes : `prive.fenetre_evaluation`, `public.mes_echeances` (corps de `20261117000005_echeances.sql`).
- Produces : `public.mes_echeances(p_cours uuid default null) returns table (cours_id uuid, classe_nom text, ouverture timestamptz, limite timestamptz, quittee boolean)`.

- [ ] **Step 1 : écrire le test pgTAP (il échoue)**

Créer `supabase/tests/echeances_departs.test.sql` :

```sql
begin;
select plan(4);

insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-0000000000f1', 'prof-dep@test.local'),
  ('00000000-0000-0000-0000-0000000000f2', 'eleve-dep@test.local');
update public.profil set role = 'enseignant' where id = '00000000-0000-0000-0000-0000000000f1';
insert into public.filiere (id, voie, code, nom) values ('10000000-0000-0000-0000-0000000000f1', 'technologique', 'DEP', 'Filière départs');
insert into public.cours (id, slug, filiere_id, niveau_code, matiere, titre, publie) values
  ('20000000-0000-0000-0000-0000000000f1', 'cours-dep', '10000000-0000-0000-0000-0000000000f1', '1re', 'D', 'D', true);
insert into public.chapitre (id, cours_id, slug, numero, titre, publie) values
  ('30000000-0000-0000-0000-0000000000f1', '20000000-0000-0000-0000-0000000000f1', 'ch1', 1, 'Un', true);
insert into public.question (chapitre_id, type, enonce, propositions, statut, source)
  select '30000000-0000-0000-0000-0000000000f1', 'qcm_unique', 'Q', '["a","b"]', 'valide', 'dep:' || i from generate_series(1, 20) i;
insert into public.question_corrige (question_id, bonnes_reponses) select id, '[0]' from public.question where source like 'dep:%';
insert into public.progression_chapitre (eleve_id, chapitre_id, meilleure_note, valide) values
  ('00000000-0000-0000-0000-0000000000f2', '30000000-0000-0000-0000-0000000000f1', 90, true);
insert into public.classe (id, enseignant_id, nom, code) values
  ('60000000-0000-0000-0000-0000000000f1', '00000000-0000-0000-0000-0000000000f1', 'Classe A', 'DEPBCD'),
  ('60000000-0000-0000-0000-0000000000f2', '00000000-0000-0000-0000-0000000000f1', 'Classe B', 'DEPCDF');
insert into public.classe_cours values
  ('60000000-0000-0000-0000-0000000000f1', '20000000-0000-0000-0000-0000000000f1'),
  ('60000000-0000-0000-0000-0000000000f2', '20000000-0000-0000-0000-0000000000f1');
-- Classe A (actuelle) : date limite passée. Classe B (quittée hier) : pas d'échéance.
insert into public.echeance_evaluation (classe_id, cours_id, ouverture, limite) values
  ('60000000-0000-0000-0000-0000000000f1', '20000000-0000-0000-0000-0000000000f1', null, now() - interval '1 day');
insert into public.inscription_classe (classe_id, eleve_id) values ('60000000-0000-0000-0000-0000000000f1', '00000000-0000-0000-0000-0000000000f2');
insert into prive.depart_classe (classe_id, eleve_id, quitte_le) values
  ('60000000-0000-0000-0000-0000000000f2', '00000000-0000-0000-0000-0000000000f2', now() - interval '1 day');

set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000f2","role":"authenticated"}', true);
select throws_ok($$ select public.demarrer_evaluation('20000000-0000-0000-0000-0000000000f1') $$,
  'P0001', 'evaluation_close', 'une classe quittée sans échéance n''ouvre plus la fenêtre');
select results_eq($$ select classe_nom, quittee from public.mes_echeances('20000000-0000-0000-0000-0000000000f1') $$,
  $$ values ('Classe A'::text, false) $$, 'la classe quittée sans échéance n''est pas listée');

reset role;
insert into public.echeance_evaluation (classe_id, cours_id, ouverture, limite) values
  ('60000000-0000-0000-0000-0000000000f2', '20000000-0000-0000-0000-0000000000f1', null, now() + interval '1 day');
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000f2","role":"authenticated"}', true);
select results_eq($$ select classe_nom, quittee from public.mes_echeances('20000000-0000-0000-0000-0000000000f1') order by classe_nom $$,
  $$ values ('Classe A'::text, false), ('Classe B'::text, true) $$, 'une classe quittée avec échéance est listée comme quittée');
select lives_ok($$ select public.demarrer_evaluation('20000000-0000-0000-0000-0000000000f1') $$,
  'l''échéance ouverte de la classe quittée s''applique encore pendant 30 jours');

select * from finish();
rollback;
```

- [ ] **Step 2 : lancer le test pour le voir échouer**

Run : `export PATH="$HOME/.orbstack/bin:$PATH"; npx supabase test db supabase/tests/echeances_departs.test.sql`
Expected : FAIL. Le premier test échoue (aucune exception : la fenêtre est ouverte), et `quittee` n'existe pas.

- [ ] **Step 3 : écrire la migration**

Créer `supabase/migrations/20261201000005_echeances_departs.sql` :

```sql
-- Classes quittées depuis moins de 30 jours : seules leurs échéances comptent encore.
-- Une classe quittée sans échéance n'ouvre plus la fenêtre d'évaluation (bilan de l'étape 3a).

create or replace function prive.fenetre_evaluation(p_eleve uuid, p_cours uuid) returns text
language sql stable set search_path = '' as $$
  with inscrites as (
    select i.classe_id from public.inscription_classe i where i.eleve_id = p_eleve
  ),
  classes as (
    select classe_id from inscrites
    union
    select d.classe_id from prive.depart_classe d where d.eleve_id = p_eleve and d.quitte_le > now() - interval '30 days'
  ),
  fenetres as (
    select e.ouverture, e.limite
      from classes k
      join public.echeance_evaluation e on e.classe_id = k.classe_id and e.cours_id = p_cours
  )
  select case
    when not exists (select 1 from fenetres) then 'ok'
    -- Une classe actuelle liée au cours sans échéance n'impose rien : la fenêtre est ouverte.
    -- Une classe quittée sans échéance ne compte pas.
    when exists (
      select 1 from inscrites k
        join public.classe_cours cc on cc.classe_id = k.classe_id and cc.cours_id = p_cours
       where not exists (select 1 from public.echeance_evaluation e where e.classe_id = k.classe_id and e.cours_id = p_cours)
    ) then 'ok'
    when exists (select 1 from fenetres where (ouverture is null or ouverture <= now()) and (limite is null or now() <= limite)) then 'ok'
    when exists (select 1 from fenetres where ouverture > now()) then 'pas_ouverte'
    else 'close'
  end
$$;

-- Le type de retour change (colonne quittee) : drop puis create.
drop function public.mes_echeances(uuid);
create function public.mes_echeances(p_cours uuid default null)
returns table (cours_id uuid, classe_nom text, ouverture timestamptz, limite timestamptz, quittee boolean)
language sql stable security definer set search_path = '' as $$
  -- Une ligne par classe actuelle liée au cours (dates nulles : pas d'échéance, fenêtre ouverte),
  -- plus les classes quittées depuis moins de 30 jours qui ont une échéance. Mêmes règles que prive.fenetre_evaluation.
  with classes as (
    select i.classe_id, false as quittee from public.inscription_classe i where i.eleve_id = auth.uid()
    union
    select d.classe_id, true from prive.depart_classe d where d.eleve_id = auth.uid() and d.quitte_le > now() - interval '30 days'
  )
  select cc.cours_id, c.nom, e.ouverture, e.limite, k.quittee
    from classes k
    join public.classe c on c.id = k.classe_id
    join public.classe_cours cc on cc.classe_id = k.classe_id
    left join public.echeance_evaluation e on e.classe_id = cc.classe_id and e.cours_id = cc.cours_id
   where (p_cours is null or cc.cours_id = p_cours)
     and (not k.quittee or e.classe_id is not null)
   order by e.limite nulls last, e.ouverture nulls first
$$;

revoke execute on function public.mes_echeances(uuid) from public, anon;
grant execute on function public.mes_echeances(uuid) to authenticated;
revoke execute on function prive.fenetre_evaluation(uuid, uuid) from public, anon, authenticated;
```

- [ ] **Step 4 : appliquer, régénérer, lancer les tests de la base**

Run : `export PATH="$HOME/.orbstack/bin:$PATH"; npm run db:reset && npx supabase gen types typescript --local > src/lib/supabase/types.ts && npx supabase test db`
Expected : PASS, y compris `echeances.test.sql`. Si un test existant vérifiait qu'une classe quittée *sans* échéance ouvre la fenêtre, il décrit l'ancien comportement : le corriger et le signaler dans le rapport.

- [ ] **Step 5 : interface**

- `src/lib/quiz/requetes.ts` : ajouter `quittee: boolean` au type de `echeancesClasses`.
- `src/app/(app)/cours/[slug]/evaluation/page.tsx` : afficher la classe quittée comme telle :

```tsx
{p.echeances.map((e, i) => (
  <li key={`${e.classe_nom}-${i}`}>
    {e.classe_nom}{e.quittee ? ' (classe quittée, ses dates s’appliquent encore 30 jours)' : ''} : {libelleEcheance(e)}.
  </li>
))}
```

- `src/components/FormulaireRejoindre.tsx`, confirmation de `BoutonQuitter` :

```tsx
if (!window.confirm('Quitter cette classe ? Ton enseignant ou ton enseignante ne verra plus ta progression. Pendant 30 jours, les dates d’évaluation de cette classe continuent de s’appliquer à toi.')) e.preventDefault();
```

- [ ] **Step 6 : vérifier**

Run : `npm test && npm run typecheck && npm run lint`
Expected : PASS.

- [ ] **Step 7 : commit**

```bash
git add supabase/migrations/20261201000005_echeances_departs.sql supabase/tests/echeances_departs.test.sql src/lib/supabase/types.ts src/lib/quiz/requetes.ts "src/app/(app)/cours/[slug]/evaluation/page.tsx" src/components/FormulaireRejoindre.tsx
git commit -m "Ne compte une classe quittée que par ses échéances et l'explique à l'élève

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 6 : dates du calendrier et générateur du planning

Code TypeScript pur, sans base ni React.

**Files :**
- Create : `src/lib/calendrier/dates.ts`, `src/lib/calendrier/dates.test.ts`
- Create : `src/lib/planning/generer.ts`, `src/lib/planning/generer.test.ts`

**Interfaces :**
- Consumes : `heureParisVersIso(valeur: string): string | null` (`src/lib/enseignant/dates.ts`).
- Produces (`src/lib/calendrier/dates.ts`) :
  - `type Vue = 'jour' | 'semaine' | 'mois'`, `VUES` ;
  - `jourParis(instant: Date): string` (`AAAA-MM-JJ`), `heureParis(iso: string): string` (`HH:MM`) ;
  - `estJourValide(jour: string): boolean`, `ajouterJours(jour: string, n: number): string`, `jourSemaineIso(jour: string): number` (1 = lundi) ;
  - `debutSemaine(jour)`, `debutMois(jour)`, `ajouterMois(jour, n)`, `grilleMois(jour): string[]` (42 jours) ;
  - `debutJourParis(jour): string` (ISO UTC de minuit à Paris) ;
  - `periodeVue(vue, jour): { jours: string[]; de: string; a: string }` ;
  - `lireVue(params: { vue?: string; date?: string }, maintenant: Date): { vue: Vue; jour: string }` ;
  - `naviguer(vue, jour, sens: 1 | -1): string` ;
  - `libelleJour(jour: string): string` (« mardi 1 décembre »), `libellePeriode(vue, jour): string`.
- Produces (`src/lib/planning/generer.ts`) :
  - `type ChapitrePlan = { id: string; numero: number; titre: string; valide: boolean; meilleureNote: number | null; valideLe: string | null }` ;
  - `type Reglages = { sessionsParSemaine: number; dureeMinutes: number; joursPreferes: number[]; heureDebut: string }` ;
  - `type Creneau = { debut: string; fin: string }` ;
  - `type SessionPlan = { debut: string; dureeMinutes: number; chapitres: string[]; titre: string; revisionGenerale: boolean }` ;
  - `type Planning = { sessions: SessionPlan[]; regroupe: boolean; avertissements: string[] }` ;
  - `trierParPriorite(chapitres: ChapitrePlan[]): ChapitrePlan[]` ;
  - `genererPlanning(p: { maintenant: Date; examenDebut: string; chapitres: ChapitrePlan[]; reglages: Reglages; occupes: Creneau[] }): Planning`.

- [ ] **Step 1 : écrire les tests des dates (ils échouent)**

Créer `src/lib/calendrier/dates.test.ts` :

```ts
import { describe, expect, it } from 'vitest';
import {
  ajouterJours, ajouterMois, debutJourParis, debutSemaine, estJourValide, grilleMois, heureParis, jourParis,
  jourSemaineIso, libelleJour, libellePeriode, lireVue, naviguer, periodeVue,
} from './dates';

describe('dates du calendrier', () => {
  it('donne le jour de Paris d’un instant', () => {
    expect(jourParis(new Date('2026-12-01T23:30:00Z'))).toBe('2026-12-02');
    expect(jourParis(new Date('2026-07-01T21:59:00Z'))).toBe('2026-07-01');
  });
  it('donne l’heure de Paris', () => {
    expect(heureParis('2026-12-07T16:00:00Z')).toBe('17:00');
    expect(heureParis('2027-03-28T15:00:00Z')).toBe('17:00');
  });
  it('calcule jours et semaines', () => {
    expect(ajouterJours('2026-12-31', 1)).toBe('2027-01-01');
    expect(jourSemaineIso('2026-12-01')).toBe(2);
    expect(jourSemaineIso('2026-12-06')).toBe(7);
    expect(debutSemaine('2026-12-06')).toBe('2026-11-30');
    expect(ajouterMois('2026-12-15', 1)).toBe('2027-01-01');
    expect(estJourValide('2026-02-30')).toBe(false);
    expect(estJourValide('2026-12-01')).toBe(true);
  });
  it('construit une grille de mois de 42 jours qui commence un lundi', () => {
    const g = grilleMois('2026-12-15');
    expect(g).toHaveLength(42);
    expect(g[0]).toBe('2026-11-30');
    expect(g[41]).toBe('2027-01-10');
  });
  it('donne minuit à Paris, changements d’heure compris', () => {
    expect(debutJourParis('2026-12-01')).toBe('2026-11-30T23:00:00.000Z');
    expect(debutJourParis('2027-03-28')).toBe('2027-03-27T23:00:00.000Z');
    expect(debutJourParis('2027-03-29')).toBe('2027-03-28T22:00:00.000Z');
  });
  it('donne la période d’une vue', () => {
    expect(periodeVue('jour', '2026-12-01')).toEqual({ jours: ['2026-12-01'], de: '2026-11-30T23:00:00.000Z', a: '2026-12-01T23:00:00.000Z' });
    const semaine = periodeVue('semaine', '2026-12-03');
    expect(semaine.jours[0]).toBe('2026-11-30');
    expect(semaine.jours).toHaveLength(7);
    expect(semaine.a).toBe('2026-12-06T23:00:00.000Z');
  });
  it('lit la vue demandée, ou la semaine d’aujourd’hui', () => {
    const maintenant = new Date('2026-12-01T08:00:00Z');
    expect(lireVue({ vue: 'mois', date: '2026-12-20' }, maintenant)).toEqual({ vue: 'mois', jour: '2026-12-20' });
    expect(lireVue({ vue: 'annee', date: 'hier' }, maintenant)).toEqual({ vue: 'semaine', jour: '2026-12-01' });
  });
  it('navigue d’une période à l’autre', () => {
    expect(naviguer('jour', '2026-12-01', -1)).toBe('2026-11-30');
    expect(naviguer('semaine', '2026-12-01', 1)).toBe('2026-12-08');
    expect(naviguer('mois', '2026-12-20', 1)).toBe('2027-01-01');
  });
  it('écrit les libellés en français', () => {
    expect(libelleJour('2026-12-01')).toBe('mardi 1 décembre');
    expect(libellePeriode('semaine', '2026-12-03')).toBe('Semaine du 30 novembre');
    expect(libellePeriode('mois', '2026-12-03')).toBe('décembre 2026');
    expect(libellePeriode('jour', '2026-12-03')).toBe('jeudi 3 décembre 2026');
  });
});
```

Run : `npx vitest run src/lib/calendrier/dates.test.ts`
Expected : FAIL, `Failed to resolve import "./dates"`.

- [ ] **Step 2 : écrire les dates**

Créer `src/lib/calendrier/dates.ts` :

```ts
import { heureParisVersIso } from '@/lib/enseignant/dates';

export type Vue = 'jour' | 'semaine' | 'mois';
export const VUES: readonly Vue[] = ['jour', 'semaine', 'mois'];

const JOUR_MS = 86_400_000;
const partiesParis = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Europe/Paris', hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit',
});

function parties(instant: Date) {
  return Object.fromEntries(partiesParis.formatToParts(instant).map((p) => [p.type, p.value]));
}

/** Jour de Paris (AAAA-MM-JJ) d'un instant. */
export function jourParis(instant: Date): string {
  const p = parties(instant);
  return `${p.year}-${p.month}-${p.day}`;
}

/** Heure de Paris (HH:MM) d'une date ISO. */
export function heureParis(iso: string): string {
  const p = parties(new Date(iso));
  return `${p.hour}:${p.minute}`;
}

// Les jours sont manipulés comme des dates UTC à minuit : pas de fuseau, pas de changement d'heure.
const enMs = (jour: string) => {
  const [a, m, j] = jour.split('-').map(Number);
  return Date.UTC(a, m - 1, j);
};
const versJour = (ms: number) => new Date(ms).toISOString().slice(0, 10);

export function estJourValide(jour: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(jour) && versJour(enMs(jour)) === jour;
}
export function ajouterJours(jour: string, n: number): string {
  return versJour(enMs(jour) + n * JOUR_MS);
}
/** 1 = lundi … 7 = dimanche. */
export function jourSemaineIso(jour: string): number {
  const d = new Date(enMs(jour)).getUTCDay();
  return d === 0 ? 7 : d;
}
export function debutSemaine(jour: string): string {
  return ajouterJours(jour, 1 - jourSemaineIso(jour));
}
export function debutMois(jour: string): string {
  return `${jour.slice(0, 7)}-01`;
}
export function ajouterMois(jour: string, n: number): string {
  const [a, m] = jour.split('-').map(Number);
  return versJour(Date.UTC(a, m - 1 + n, 1));
}
/** 6 semaines complètes, du lundi qui précède (ou qui est) le 1er du mois. */
export function grilleMois(jour: string): string[] {
  const premier = debutSemaine(debutMois(jour));
  return Array.from({ length: 42 }, (_, i) => ajouterJours(premier, i));
}

/** Minuit à Paris, en ISO UTC. */
export function debutJourParis(jour: string): string {
  const iso = heureParisVersIso(`${jour}T00:00`);
  if (!iso) throw new Error(`Jour invalide : ${jour}`);
  return iso;
}

export function periodeVue(vue: Vue, jour: string): { jours: string[]; de: string; a: string } {
  const jours = vue === 'jour' ? [jour]
    : vue === 'semaine' ? Array.from({ length: 7 }, (_, i) => ajouterJours(debutSemaine(jour), i))
    : grilleMois(jour);
  return { jours, de: debutJourParis(jours[0]), a: debutJourParis(ajouterJours(jours[jours.length - 1], 1)) };
}

export function lireVue(params: { vue?: string; date?: string }, maintenant: Date): { vue: Vue; jour: string } {
  const vue = VUES.includes(params.vue as Vue) ? (params.vue as Vue) : 'semaine';
  const jour = params.date && estJourValide(params.date) ? params.date : jourParis(maintenant);
  return { vue, jour };
}

export function naviguer(vue: Vue, jour: string, sens: 1 | -1): string {
  if (vue === 'jour') return ajouterJours(jour, sens);
  if (vue === 'semaine') return ajouterJours(jour, 7 * sens);
  return ajouterMois(debutMois(jour), sens);
}

const formatJour = new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' });
const formatJourAnnee = new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
const formatJourMois = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', timeZone: 'UTC' });
const formatMois = new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric', timeZone: 'UTC' });

export function libelleJour(jour: string): string {
  return formatJour.format(enMs(jour));
}
export function libellePeriode(vue: Vue, jour: string): string {
  if (vue === 'jour') return formatJourAnnee.format(enMs(jour));
  if (vue === 'semaine') return `Semaine du ${formatJourMois.format(enMs(debutSemaine(jour)))}`;
  return formatMois.format(enMs(jour));
}
```

Run : `npx vitest run src/lib/calendrier/dates.test.ts`
Expected : PASS (9 tests).

- [ ] **Step 3 : écrire les tests du générateur (ils échouent)**

Créer `src/lib/planning/generer.test.ts` :

```ts
import { describe, expect, it } from 'vitest';
import { genererPlanning, trierParPriorite, type ChapitrePlan, type Reglages } from './generer';

const c1: ChapitrePlan = { id: 'c1', numero: 1, titre: 'Un', valide: true, meilleureNote: 90, valideLe: '2026-11-20T10:00:00Z' };
const c2: ChapitrePlan = { id: 'c2', numero: 2, titre: 'Deux', valide: false, meilleureNote: 40, valideLe: null };
const c3: ChapitrePlan = { id: 'c3', numero: 3, titre: 'Trois', valide: false, meilleureNote: null, valideLe: null };
const reglages: Reglages = { sessionsParSemaine: 3, dureeMinutes: 60, joursPreferes: [1, 3, 5], heureDebut: '17:00' };
const base = { maintenant: new Date('2026-12-01T08:00:00Z'), examenDebut: '2026-12-11T08:00:00Z', chapitres: [c1, c2, c3], reglages, occupes: [] };

describe('trierParPriorite', () => {
  it('met les non validés d’abord, puis la note la plus basse, puis les validés depuis le plus longtemps', () => {
    const ancien = { ...c1, id: 'ancien', numero: 4, meilleureNote: 80, valideLe: '2026-10-01T00:00:00Z' };
    const recent = { ...c1, id: 'recent', numero: 5, meilleureNote: 80, valideLe: '2026-11-01T00:00:00Z' };
    expect(trierParPriorite([c1, recent, c2, ancien, c3]).map((c) => c.id)).toEqual(['c3', 'c2', 'ancien', 'recent', 'c1']);
  });
});

describe('genererPlanning', () => {
  it('répartit un chapitre par session sur les jours préférés, puis prévoit la révision générale la veille', () => {
    const p = genererPlanning(base);
    expect(p.regroupe).toBe(false);
    expect(p.avertissements).toEqual([]);
    expect(p.sessions.map((s) => [s.debut, s.chapitres])).toEqual([
      ['2026-12-02T16:00:00.000Z', ['c3']],
      ['2026-12-04T16:00:00.000Z', ['c2']],
      ['2026-12-07T16:00:00.000Z', ['c1']],
      ['2026-12-10T16:00:00.000Z', ['c1', 'c2', 'c3']],
    ]);
    expect(p.sessions[0].titre).toBe('Révision · Ch. 3 Trois');
    expect(p.sessions[3]).toMatchObject({ titre: 'Révision générale', revisionGenerale: true, dureeMinutes: 60 });
  });

  it('regroupe les chapitres et prévient quand les créneaux manquent', () => {
    const p = genererPlanning({ ...base, reglages: { ...reglages, sessionsParSemaine: 1 } });
    expect(p.regroupe).toBe(true);
    expect(p.avertissements).toEqual(['Pas assez de créneaux : jusqu’à 2 chapitres par session.']);
    expect(p.sessions.map((s) => [s.debut, s.chapitres, s.titre])).toEqual([
      ['2026-12-02T16:00:00.000Z', ['c3', 'c2'], 'Révision · Ch. 2 et 3'],
      ['2026-12-07T16:00:00.000Z', ['c1'], 'Révision · Ch. 1 Un'],
      ['2026-12-10T16:00:00.000Z', ['c1', 'c2', 'c3'], 'Révision générale'],
    ]);
  });

  it('décale une session qui chevauche un événement existant', () => {
    const p = genererPlanning({ ...base, occupes: [{ debut: '2026-12-02T16:00:00Z', fin: '2026-12-02T17:00:00Z' }] });
    expect(p.sessions[0].debut).toBe('2026-12-02T17:00:00.000Z');
  });

  it('ne place pas de session qui commence dans moins de 30 minutes', () => {
    const p = genererPlanning({ ...base, maintenant: new Date('2026-12-02T15:45:00Z') });
    expect(p.sessions[0].debut).toBe('2026-12-02T17:00:00.000Z');
  });

  it('garde l’heure de Paris après le passage à l’heure d’été', () => {
    const p = genererPlanning({
      maintenant: new Date('2027-03-26T06:00:00Z'), examenDebut: '2027-03-31T07:00:00Z', occupes: [],
      chapitres: [{ ...c2, id: 'a', numero: 1, meilleureNote: 30 }, { ...c2, id: 'b', numero: 2, meilleureNote: 50 }],
      reglages: { sessionsParSemaine: 7, dureeMinutes: 60, joursPreferes: [1, 2, 3, 4, 5, 6, 7], heureDebut: '17:00' },
    });
    expect(p.sessions.map((s) => s.debut)).toEqual(['2027-03-26T16:00:00.000Z', '2027-03-28T15:00:00.000Z', '2027-03-30T15:00:00.000Z']);
  });

  it('ne prévoit que la révision générale quand l’examen est demain', () => {
    const p = genererPlanning({ ...base, maintenant: new Date('2026-12-10T08:00:00Z') });
    expect(p.avertissements).toEqual(['Aucun créneau libre avant l’examen : seule la révision générale est prévue.']);
    expect(p.sessions).toHaveLength(1);
    expect(p.sessions[0].revisionGenerale).toBe(true);
  });

  it('ne prévoit rien quand l’examen est aujourd’hui', () => {
    const p = genererPlanning({ ...base, maintenant: new Date('2026-12-11T06:00:00Z') });
    expect(p.sessions).toEqual([]);
    expect(p.avertissements).toEqual([
      'Aucun créneau libre avant l’examen : seule la révision générale est prévue.',
      'Pas de créneau libre la veille de l’examen pour la révision générale.',
    ]);
  });

  it('prévient quand il n’y a aucun chapitre', () => {
    expect(genererPlanning({ ...base, chapitres: [] })).toEqual({ sessions: [], regroupe: false, avertissements: ['Aucun chapitre à réviser.'] });
  });
});
```

Run : `npx vitest run src/lib/planning/generer.test.ts`
Expected : FAIL, `Failed to resolve import "./generer"`.

- [ ] **Step 4 : écrire le générateur**

Créer `src/lib/planning/generer.ts` :

```ts
import { heureParisVersIso } from '@/lib/enseignant/dates';
import { ajouterJours, debutSemaine, jourParis, jourSemaineIso } from '@/lib/calendrier/dates';

export type ChapitrePlan = { id: string; numero: number; titre: string; valide: boolean; meilleureNote: number | null; valideLe: string | null };
export type Reglages = { sessionsParSemaine: number; dureeMinutes: number; joursPreferes: number[]; heureDebut: string };
export type Creneau = { debut: string; fin: string };
export type SessionPlan = { debut: string; dureeMinutes: number; chapitres: string[]; titre: string; revisionGenerale: boolean };
export type Planning = { sessions: SessionPlan[]; regroupe: boolean; avertissements: string[] };

const MINUTE = 60_000;
const FIN_AU_PLUS_TARD = 22 * 60; // une session finit au plus tard à 22 h (heure de Paris)
const DECALAGES = [0, 60, 120, 180]; // en cas de chevauchement : 1, 2 puis 3 heures plus tard
const MARGE = 30 * MINUTE; // pas de session qui commence dans moins de 30 minutes

/** Non validés d'abord, puis note la plus basse, puis validés depuis le plus longtemps, puis l'ordre du cours. */
export function trierParPriorite(chapitres: ChapitrePlan[]): ChapitrePlan[] {
  const temps = (iso: string | null) => (iso ? Date.parse(iso) : -Infinity);
  return [...chapitres].sort((a, b) =>
    Number(a.valide) - Number(b.valide)
    || (a.meilleureNote ?? -1) - (b.meilleureNote ?? -1)
    || temps(a.valideLe) - temps(b.valideLe)
    || a.numero - b.numero);
}

const enMinutes = (hhmm: string) => Number(hhmm.slice(0, 2)) * 60 + Number(hhmm.slice(3, 5));
const enHhmm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;

/** Premier créneau libre du jour à partir de l'heure choisie, ou null. */
function creneauDuJour(jour: string, reglages: Reglages, occupes: { d: number; f: number }[], apres: number): string | null {
  const base = enMinutes(reglages.heureDebut);
  for (const decalage of DECALAGES) {
    const m = base + decalage;
    if (m + reglages.dureeMinutes > FIN_AU_PLUS_TARD) return null;
    const iso = heureParisVersIso(`${jour}T${enHhmm(m)}`);
    if (!iso) continue;
    const d = Date.parse(iso);
    const f = d + reglages.dureeMinutes * MINUTE;
    if (d <= apres) continue;
    if (!occupes.some((o) => d < o.f && o.d < f)) return iso;
  }
  return null;
}

function titreSession(groupe: ChapitrePlan[]): string {
  if (groupe.length === 1) return `Révision · Ch. ${groupe[0].numero} ${groupe[0].titre}`.slice(0, 120);
  const numeros = groupe.map((c) => c.numero).sort((a, b) => a - b);
  return `Révision · Ch. ${numeros.slice(0, -1).join(', ')} et ${numeros[numeros.length - 1]}`.slice(0, 120);
}

export function genererPlanning(p: {
  maintenant: Date; examenDebut: string; chapitres: ChapitrePlan[]; reglages: Reglages; occupes: Creneau[];
}): Planning {
  const { maintenant, reglages } = p;
  if (p.chapitres.length === 0) return { sessions: [], regroupe: false, avertissements: ['Aucun chapitre à réviser.'] };
  const avertissements: string[] = [];
  const examen = Date.parse(p.examenDebut);
  const occupes = p.occupes.map((o) => ({ d: Date.parse(o.debut), f: Date.parse(o.fin) }));
  const apres = maintenant.getTime() + MARGE;
  const aujourdhui = jourParis(maintenant);
  const veille = ajouterJours(jourParis(new Date(examen)), -1);
  const tries = trierParPriorite(p.chapitres);

  // 1. Créneaux : d'aujourd'hui à l'avant-veille, jours préférés, plafond par semaine (lundi à dimanche).
  const creneaux: string[] = [];
  const parSemaine = new Map<string, number>();
  for (let jour = aujourdhui; jour < veille; jour = ajouterJours(jour, 1)) {
    if (!reglages.joursPreferes.includes(jourSemaineIso(jour))) continue;
    const semaine = debutSemaine(jour);
    const deja = parSemaine.get(semaine) ?? 0;
    if (deja >= reglages.sessionsParSemaine) continue;
    const debut = creneauDuJour(jour, reglages, occupes, apres);
    if (!debut) continue;
    creneaux.push(debut);
    parSemaine.set(semaine, deja + 1);
  }

  // 2. Répartition : groupes de chapitres consécutifs dans l'ordre de priorité, étalés régulièrement.
  const sessions: SessionPlan[] = [];
  let regroupe = false;
  if (creneaux.length === 0) {
    avertissements.push('Aucun créneau libre avant l’examen : seule la révision générale est prévue.');
  } else {
    const parSession = Math.ceil(tries.length / creneaux.length);
    regroupe = parSession > 1;
    const groupes: ChapitrePlan[][] = [];
    for (let i = 0; i < tries.length; i += parSession) groupes.push(tries.slice(i, i + parSession));
    groupes.forEach((groupe, i) => {
      sessions.push({
        debut: creneaux[Math.floor((i * creneaux.length) / groupes.length)],
        dureeMinutes: reglages.dureeMinutes,
        chapitres: groupe.map((c) => c.id),
        titre: titreSession(groupe),
        revisionGenerale: false,
      });
    });
    if (regroupe) avertissements.push(`Pas assez de créneaux : jusqu’à ${parSession} chapitres par session.`);
  }

  // 3. La veille : révision générale sur tous les chapitres, même hors des jours préférés.
  const debutVeille = veille >= aujourdhui ? creneauDuJour(veille, reglages, occupes, apres) : null;
  if (debutVeille && Date.parse(debutVeille) + reglages.dureeMinutes * MINUTE <= examen) {
    sessions.push({
      debut: debutVeille,
      dureeMinutes: reglages.dureeMinutes,
      chapitres: [...p.chapitres].sort((a, b) => a.numero - b.numero).map((c) => c.id),
      titre: 'Révision générale',
      revisionGenerale: true,
    });
  } else {
    avertissements.push('Pas de créneau libre la veille de l’examen pour la révision générale.');
  }
  return { sessions, regroupe, avertissements };
}
```

Run : `npx vitest run src/lib/planning/generer.test.ts`
Expected : PASS (9 tests).

- [ ] **Step 5 : vérifier et commiter**

Run : `npm test && npm run typecheck && npm run lint`
Expected : PASS.

```bash
git add src/lib/calendrier/dates.ts src/lib/calendrier/dates.test.ts src/lib/planning/generer.ts src/lib/planning/generer.test.ts
git commit -m "Ajoute les dates du calendrier et le générateur du planning de révision

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 7 : couche TypeScript du calendrier

**Files :**
- Create : `src/lib/calendrier/schema-evenement.ts`, `src/lib/calendrier/schema-evenement.test.ts`
- Create : `src/lib/planning/reglages.ts`, `src/lib/planning/reglages.test.ts`
- Create : `src/lib/calendrier/garde.ts`, `src/lib/calendrier/requetes.ts`, `src/lib/site.ts`
- Create : `src/app/(app)/calendrier/actions.ts`
- Modify : `src/lib/erreurs.ts`, `src/lib/erreurs.test.ts`, `.env.example`

**Interfaces :**
- Consumes : toutes les RPC des Tasks 1 à 4 ; `genererPlanning` (Task 6) ; `heureParisVersIso`, `isoVersHeureParis` ; `appelerAvecRelance` (`src/lib/supabase/rpc.ts`).
- Produces :
  - `lireFormulaireEvenement(form: FormData): { ok: true; donnees: DonneesEvenement; valeurs: ValeursEvenement } | { ok: false; erreur: string; champ: ChampEvenement; valeurs: ValeursEvenement }` ;
  - `type ValeursEvenement = { type: string; titre: string; jour: string; heure: string; duree: string; cours: string; chapitres: string[]; repetition: string; jours: string[]; jusqu: string }` ;
  - `type ChampEvenement = 'type' | 'titre' | 'jour' | 'heure' | 'duree' | 'cours' | 'chapitres' | 'repetition' | 'jours' | 'jusqu'` ;
  - constantes `TYPES_EVENEMENT`, `REPETITIONS`, `DUREES_EVENEMENT` ;
  - `lireReglages(form: FormData)`, `REGLAGES_PAR_DEFAUT`, `DUREES_SESSION`, `versReglagesRpc(r: Reglages)` ;
  - `exigerEleve()` ;
  - lectures : `lireCalendrier(de, a)`, `prochainsEvenements(maintenant, nombre?)`, `lireEvenement(id)`, `chapitresDesCours(coursIds)`, `lirePlanning(examenId, maintenant)`, `plansAReorganiser()`, `dateLienIcal()` ;
  - type `OccurrenceCalendrier` ;
  - `urlDuSite(): Promise<string>` ;
  - actions serveur : `enregistrerEvenement`, `supprimerEvenement`, `apercuPlanning`, `accepterPlanning`, `refuserPlanning`, `ignorerReorganisation`, `lancerRevisionGenerale`, `creerLienIcal`, `revoquerLienIcal`, et leurs types d'état `EtatEvenement`, `EtatPlanning`, `EtatLien`, `EtatSimple`.

- [ ] **Step 1 : tests du formulaire d'événement (ils échouent)**

Créer `src/lib/calendrier/schema-evenement.test.ts` :

```ts
import { describe, expect, it } from 'vitest';
import { lireFormulaireEvenement } from './schema-evenement';

const COURS = '20000000-0000-4000-8000-000000000001';
const CHAP = '30000000-0000-4000-8000-000000000001';

function formulaire(champs: Record<string, string | string[]>) {
  const f = new FormData();
  for (const [cle, valeur] of Object.entries(champs)) for (const v of [valeur].flat()) f.append(cle, v);
  return f;
}
const valide = { type: 'devoir', titre: ' Exposé ', jour: '2026-12-07', heure: '17:00', duree: '60', repetition: 'aucune' };

describe('lireFormulaireEvenement', () => {
  it('convertit l’heure de Paris en ISO UTC', () => {
    const r = lireFormulaireEvenement(formulaire(valide));
    expect(r).toMatchObject({ ok: true, donnees: {
      type: 'devoir', titre: 'Exposé', debut: '2026-12-07T16:00:00.000Z', duree_minutes: 60, cours_id: null, chapitres: [],
      repetition: 'aucune', jours_semaine: null, repeter_jusqu_au: null,
    } });
  });
  it('garde les jours et la date de fin d’une répétition', () => {
    const r = lireFormulaireEvenement(formulaire({ ...valide, repetition: 'jours', jours: ['1', '3'], jusqu: '2027-01-31' }));
    expect(r).toMatchObject({ ok: true, donnees: { repetition: 'jours', jours_semaine: [1, 3], repeter_jusqu_au: '2027-01-31' } });
  });
  it('refuse une répétition sans jour choisi', () => {
    expect(lireFormulaireEvenement(formulaire({ ...valide, repetition: 'jours', jusqu: '2027-01-31' })))
      .toMatchObject({ ok: false, champ: 'jours', erreur: 'Choisis au moins un jour.' });
  });
  it('refuse une date de fin avant le début', () => {
    expect(lireFormulaireEvenement(formulaire({ ...valide, repetition: 'quotidienne', jusqu: '2026-12-01' })))
      .toMatchObject({ ok: false, champ: 'jusqu', erreur: 'La répétition doit finir après le début, dans l’année qui suit.' });
  });
  it('refuse des chapitres sans cours', () => {
    expect(lireFormulaireEvenement(formulaire({ ...valide, chapitres: [CHAP] })))
      .toMatchObject({ ok: false, champ: 'cours', erreur: 'Choisis d’abord le cours de ces chapitres.' });
  });
  it('refuse une heure invalide et renvoie la saisie', () => {
    const r = lireFormulaireEvenement(formulaire({ ...valide, heure: '25:00', cours: COURS }));
    expect(r).toMatchObject({ ok: false, champ: 'heure', valeurs: { titre: ' Exposé ', cours: COURS } });
  });
  it('refuse un titre vide', () => {
    expect(lireFormulaireEvenement(formulaire({ ...valide, titre: '  ' })))
      .toMatchObject({ ok: false, champ: 'titre', erreur: 'Donne un titre à l’événement.' });
  });
});
```

Run : `npx vitest run src/lib/calendrier/schema-evenement.test.ts`
Expected : FAIL, `Failed to resolve import "./schema-evenement"`.

- [ ] **Step 2 : écrire `schema-evenement.ts`**

```ts
import { z } from 'zod';
import { heureParisVersIso } from '@/lib/enseignant/dates';
import { ajouterJours, estJourValide } from './dates';

export const TYPES_EVENEMENT = ['revision', 'devoir', 'examen_reel'] as const;
export const REPETITIONS = ['aucune', 'quotidienne', 'hebdomadaire', 'jours'] as const;
export const DUREES_EVENEMENT = [15, 30, 45, 60, 90, 120, 180] as const;

export type ChampEvenement = 'type' | 'titre' | 'jour' | 'heure' | 'duree' | 'cours' | 'chapitres' | 'repetition' | 'jours' | 'jusqu';
export type ValeursEvenement = {
  type: string; titre: string; jour: string; heure: string; duree: string; cours: string;
  chapitres: string[]; repetition: string; jours: string[]; jusqu: string;
};
/** Objet envoyé tel quel à la RPC enregistrer_evenement. */
export type DonneesEvenement = {
  type: (typeof TYPES_EVENEMENT)[number]; titre: string; debut: string; duree_minutes: number; cours_id: string | null;
  chapitres: string[]; repetition: (typeof REPETITIONS)[number]; jours_semaine: number[] | null; repeter_jusqu_au: string | null;
};

const schema = z.object({
  type: z.enum(TYPES_EVENEMENT, { error: 'Choisis le type d’événement.' }),
  titre: z.string().trim().min(1, 'Donne un titre à l’événement.').max(120, 'Le titre ne doit pas dépasser 120 caractères.'),
  jour: z.string().refine(estJourValide, 'Choisis une date valide.'),
  heure: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Choisis une heure valide.'),
  duree: z.coerce.number().refine((d) => (DUREES_EVENEMENT as readonly number[]).includes(d), 'Choisis une durée dans la liste.'),
  cours: z.string().uuid().optional(),
  chapitres: z.array(z.string().uuid()).max(30),
  repetition: z.enum(REPETITIONS, { error: 'Choisis une répétition dans la liste.' }),
  jours: z.array(z.coerce.number().int().min(1).max(7)),
  jusqu: z.string().optional(),
});

export function lireFormulaireEvenement(form: FormData):
  | { ok: true; donnees: DonneesEvenement; valeurs: ValeursEvenement }
  | { ok: false; erreur: string; champ: ChampEvenement; valeurs: ValeursEvenement } {
  const texte = (cle: string) => String(form.get(cle) ?? '');
  const valeurs: ValeursEvenement = {
    type: texte('type'), titre: texte('titre'), jour: texte('jour'), heure: texte('heure'), duree: texte('duree'),
    cours: texte('cours'), chapitres: form.getAll('chapitres').map(String), repetition: texte('repetition') || 'aucune',
    jours: form.getAll('jours').map(String), jusqu: texte('jusqu'),
  };
  const echec = (champ: ChampEvenement, erreur: string) => ({ ok: false as const, erreur, champ, valeurs });
  const r = schema.safeParse({
    ...valeurs, cours: valeurs.cours || undefined, jusqu: valeurs.jusqu || undefined,
  });
  if (!r.success) {
    const issue = r.error.issues[0];
    return echec((issue?.path[0] as ChampEvenement) ?? 'titre', issue?.message ?? 'Vérifie le formulaire.');
  }
  const d = r.data;
  const debut = heureParisVersIso(`${d.jour}T${d.heure}`);
  if (!debut) return echec('heure', 'Choisis une heure valide.');
  if (d.chapitres.length > 0 && !d.cours) return echec('cours', 'Choisis d’abord le cours de ces chapitres.');
  if (d.repetition !== 'aucune') {
    if (!d.jusqu || !estJourValide(d.jusqu) || d.jusqu < d.jour || d.jusqu > ajouterJours(d.jour, 366)) {
      return echec('jusqu', 'La répétition doit finir après le début, dans l’année qui suit.');
    }
    if (d.repetition === 'jours' && d.jours.length === 0) return echec('jours', 'Choisis au moins un jour.');
  }
  return {
    ok: true,
    valeurs,
    donnees: {
      type: d.type, titre: d.titre, debut, duree_minutes: d.duree, cours_id: d.cours ?? null, chapitres: d.chapitres,
      repetition: d.repetition,
      jours_semaine: d.repetition === 'jours' ? [...new Set(d.jours)].sort((a, b) => a - b) : null,
      repeter_jusqu_au: d.repetition === 'aucune' ? null : d.jusqu ?? null,
    },
  };
}
```

Le test « refuse une heure invalide » attend `champ: 'heure'` : la regex de `heure` le garantit. Vérifier avec context7 la syntaxe zod 4 de `z.enum(valeurs, { error })`.

Run : `npx vitest run src/lib/calendrier/schema-evenement.test.ts`
Expected : PASS (7 tests).

- [ ] **Step 3 : réglages du planning (test puis code)**

Créer `src/lib/planning/reglages.test.ts` :

```ts
import { describe, expect, it } from 'vitest';
import { lireReglages, versReglagesRpc } from './reglages';

function formulaire(champs: Record<string, string | string[]>) {
  const f = new FormData();
  for (const [cle, valeur] of Object.entries(champs)) for (const v of [valeur].flat()) f.append(cle, v);
  return f;
}

describe('lireReglages', () => {
  it('lit des réglages valides', () => {
    const r = lireReglages(formulaire({ sessions: '3', duree: '45', jours: ['1', '3', '3'], heure: '17:30' }));
    expect(r).toEqual({ ok: true, reglages: { sessionsParSemaine: 3, dureeMinutes: 45, joursPreferes: [1, 3], heureDebut: '17:30' } });
  });
  it('exige au moins un jour', () => {
    expect(lireReglages(formulaire({ sessions: '3', duree: '45', heure: '17:30' })))
      .toEqual({ ok: false, champ: 'jours', erreur: 'Choisis au moins un jour.' });
  });
  it('refuse une heure après 21 h', () => {
    expect(lireReglages(formulaire({ sessions: '3', duree: '45', jours: ['1'], heure: '21:30' })))
      .toEqual({ ok: false, champ: 'heure', erreur: 'Choisis une heure de début entre 6 h et 21 h.' });
  });
  it('prépare les réglages pour la base', () => {
    expect(versReglagesRpc({ sessionsParSemaine: 2, dureeMinutes: 60, joursPreferes: [6, 7], heureDebut: '10:00' }))
      .toEqual({ sessions_par_semaine: 2, duree_minutes: 60, jours_preferes: [6, 7], heure_debut: '10:00' });
  });
});
```

Créer `src/lib/planning/reglages.ts` :

```ts
import { z } from 'zod';
import type { Reglages } from './generer';

export const DUREES_SESSION = [30, 45, 60, 90] as const;
export const REGLAGES_PAR_DEFAUT: Reglages = { sessionsParSemaine: 3, dureeMinutes: 45, joursPreferes: [1, 2, 3, 4, 5], heureDebut: '17:30' };
export type ChampReglages = 'sessions' | 'duree' | 'jours' | 'heure';

const schema = z.object({
  sessions: z.coerce.number().int().min(1, 'Choisis entre 1 et 7 sessions par semaine.').max(7, 'Choisis entre 1 et 7 sessions par semaine.'),
  duree: z.coerce.number().refine((d) => (DUREES_SESSION as readonly number[]).includes(d), 'Choisis une durée dans la liste.'),
  jours: z.array(z.coerce.number().int().min(1).max(7)).min(1, 'Choisis au moins un jour.'),
  heure: z.string().regex(/^\d{2}:\d{2}$/, 'Choisis une heure de début entre 6 h et 21 h.')
    .refine((h) => h >= '06:00' && h <= '21:00', 'Choisis une heure de début entre 6 h et 21 h.'),
});

export function lireReglages(form: FormData):
  | { ok: true; reglages: Reglages } | { ok: false; champ: ChampReglages; erreur: string } {
  const r = schema.safeParse({
    sessions: form.get('sessions'), duree: form.get('duree'), jours: form.getAll('jours'), heure: String(form.get('heure') ?? ''),
  });
  if (!r.success) {
    const issue = r.error.issues[0];
    return { ok: false, champ: (issue?.path[0] as ChampReglages) ?? 'sessions', erreur: issue?.message ?? 'Vérifie les réglages.' };
  }
  return {
    ok: true,
    reglages: {
      sessionsParSemaine: r.data.sessions, dureeMinutes: r.data.duree,
      joursPreferes: [...new Set(r.data.jours)].sort((a, b) => a - b), heureDebut: r.data.heure,
    },
  };
}

export function versReglagesRpc(r: Reglages) {
  return { sessions_par_semaine: r.sessionsParSemaine, duree_minutes: r.dureeMinutes, jours_preferes: r.joursPreferes, heure_debut: r.heureDebut };
}
```

Run : `npx vitest run src/lib/planning/reglages.test.ts`
Expected : PASS (4 tests).

- [ ] **Step 4 : messages d'erreur**

Ajouter à `MESSAGES` dans `src/lib/erreurs.ts` :

```ts
  reserve_eleves: 'Le calendrier est réservé aux comptes élèves.',
  evenement_invalide: 'Cet événement est incomplet : vérifie le titre, la date et la durée.',
  repetition_invalide: 'La répétition doit finir après le début, dans l’année qui suit.',
  cours_indisponible: 'Ce cours n’est pas disponible pour toi.',
  chapitres_invalides: 'Choisis des chapitres du cours sélectionné.',
  evenement_introuvable: 'Cet événement n’existe plus.',
  trop_d_evenements: 'Ton calendrier est plein (500 événements). Supprime d’anciens événements.',
  periode_invalide: 'Cette période ne peut pas être affichée.',
  examen_introuvable: 'Cet examen n’existe plus.',
  examen_passe: 'Cet examen est déjà passé.',
  planning_invalide: 'Ce planning n’a pas pu être enregistré. Recalcule l’aperçu et réessaie.',
  plan_introuvable: 'Ce planning n’existe plus.',
```

Dans `src/lib/erreurs.test.ts`, ajouter un `it` qui vérifie le texte exact de chacun de ces douze codes (avec les espaces insécables, voir les contraintes globales). Vérifier qu'aucun nouveau code n'est sous-chaîne d'un code existant, ni l'inverse.

- [ ] **Step 5 : garde, adresse du site, lectures**

`src/lib/calendrier/garde.ts` :

```ts
import { notFound } from 'next/navigation';
import { lireProfil } from '@/lib/supabase/utilisateur';

/** Réserve une page ou une action aux comptes élèves. À appeler hors de tout try/catch (notFound lève une exception). */
export async function exigerEleve() {
  const profil = await lireProfil();
  if (profil?.role !== 'eleve') notFound();
  return profil;
}
```

`src/lib/site.ts` :

```ts
import { headers } from 'next/headers';

/** Adresse publique du site : NEXT_PUBLIC_SITE_URL si elle est définie (production), sinon l'hôte de la requête. */
export async function urlDuSite(): Promise<string> {
  const configuree = process.env.NEXT_PUBLIC_SITE_URL;
  if (configuree) return configuree.replace(/\/$/, '');
  const h = await headers();
  const hote = h.get('x-forwarded-host') ?? h.get('host') ?? 'localhost:3000';
  const protocole = h.get('x-forwarded-proto') ?? (/^(localhost|127\.0\.0\.1)(:|$)/.test(hote) ? 'http' : 'https');
  return `${protocole}://${hote}`;
}
```

Ajouter `NEXT_PUBLIC_SITE_URL=` à `.env.example`, avec un commentaire : `# Adresse publique du site en production (liens iCal) ; vide en local`.

`src/lib/calendrier/requetes.ts` :

```ts
import { cache } from 'react';
import { z } from 'zod';
import { creerClientServeur } from '@/lib/supabase/server';
import type { ChapitrePlan, Creneau } from '@/lib/planning/generer';

export type TypeOccurrence = 'revision' | 'devoir' | 'examen_reel' | 'echeance';
export type ChapitreLie = { id: string; slug: string; titre: string; numero: number };
export type OccurrenceCalendrier = {
  cle: string; evenement_id: string | null; type: TypeOccurrence; titre: string; debut: string; fin: string;
  cours_id: string | null; cours_titre: string | null; couleur: string | null; cours_slug: string | null;
  lecture_seule: boolean; revision_generale: boolean; plan_id: string | null; classe_nom: string | null;
  chapitres: ChapitreLie[];
};

const estUuid = (id: string) => z.string().uuid().safeParse(id).success;

export async function lireCalendrier(de: string, a: string): Promise<OccurrenceCalendrier[]> {
  const supabase = await creerClientServeur();
  const { data, error } = await supabase.rpc('mon_calendrier', { p_de: de, p_a: a });
  if (error) throw new Error('Impossible de charger ton calendrier.');
  // chapitres arrive en Json brut et type en texte : on les type ici, en un seul endroit.
  return (data ?? []) as unknown as OccurrenceCalendrier[];
}

/** Les prochains événements et échéances des 14 jours à venir (ceux en cours compris). */
export async function prochainsEvenements(maintenant: Date, nombre = 5) {
  const a = new Date(maintenant.getTime() + 14 * 86_400_000).toISOString();
  return (await lireCalendrier(maintenant.toISOString(), a)).slice(0, nombre);
}

export const lireEvenement = cache(async (id: string) => {
  if (!estUuid(id)) return null;
  const supabase = await creerClientServeur();
  const { data } = await supabase.from('evenement')
    // Une seule chaîne littérale : supabase-js en déduit le type du résultat.
    .select('id, type, titre, debut, duree_minutes, cours_id, repetition, jours_semaine, repeter_jusqu_au, plan_id, revision_generale, cours(slug, titre, couleur), evenement_chapitre(chapitre(id, slug, titre, numero))')
    .eq('id', id).maybeSingle();
  return data;
});

export async function chapitresDesCours(coursIds: string[]) {
  if (coursIds.length === 0) return [];
  const supabase = await creerClientServeur();
  const { data, error } = await supabase.from('chapitre').select('id, cours_id, numero, titre')
    .in('cours_id', coursIds).eq('publie', true).order('numero');
  if (error) throw new Error('Impossible de charger les chapitres.');
  return data ?? [];
}

/** Tout ce qu'il faut pour calculer un planning : examen, plan existant, chapitres concernés et créneaux occupés. */
export async function lirePlanning(examenId: string, maintenant: Date) {
  const examen = await lireEvenement(examenId);
  if (!examen || examen.type !== 'examen_reel' || !examen.cours_id) return null;
  const passe = Date.parse(examen.debut) <= maintenant.getTime();
  const tropLoin = Date.parse(examen.debut) > maintenant.getTime() + 365 * 86_400_000;
  const supabase = await creerClientServeur();
  const [plan, chapitres, occupes] = await Promise.all([
    supabase.from('plan_revision').select('id, statut, sessions_par_semaine, duree_minutes, jours_preferes, heure_debut')
      .eq('examen_id', examenId).maybeSingle(),
    supabase.from('chapitre').select('id, numero, titre, progression_chapitre(valide, meilleure_note, valide_le)')
      .eq('cours_id', examen.cours_id).eq('publie', true).order('numero'),
    passe || tropLoin
      ? Promise.resolve({ data: [], error: null })
      : supabase.rpc('mes_creneaux_occupes', { p_de: maintenant.toISOString(), p_a: examen.debut }),
  ]);
  if (plan.error || chapitres.error || occupes.error) throw new Error('Impossible de charger ton planning.');
  const sessions = plan.data
    ? await supabase.from('evenement').select('id, titre, debut, duree_minutes, revision_generale')
        .eq('plan_id', plan.data.id).gt('debut', maintenant.toISOString()).order('debut')
    : { data: [], error: null };
  if (sessions.error) throw new Error('Impossible de charger ton planning.');
  const choisis = new Set(examen.evenement_chapitre.map((ec) => ec.chapitre?.id).filter(Boolean));
  const liste: ChapitrePlan[] = (chapitres.data ?? [])
    .filter((c) => choisis.size === 0 || choisis.has(c.id))
    .map((c) => {
      const p = c.progression_chapitre[0];
      return {
        id: c.id, numero: c.numero, titre: c.titre, valide: p?.valide ?? false,
        meilleureNote: p?.meilleure_note == null ? null : Number(p.meilleure_note), valideLe: p?.valide_le ?? null,
      };
    });
  // Les sessions de ce plan ne bloquent pas : une réorganisation les remplace.
  const creneaux: Creneau[] = (occupes.data ?? [])
    .filter((o) => !plan.data || o.plan_id !== plan.data.id)
    .map((o) => ({ debut: o.debut, fin: o.fin }));
  return { examen, plan: plan.data, chapitres: liste, occupes: creneaux, passe, tropLoin, sessionsAVenir: sessions.data ?? [] };
}

export async function plansAReorganiser() {
  const supabase = await creerClientServeur();
  const { data } = await supabase.rpc('plans_a_reorganiser');
  // Au mieux : une erreur ici ne doit pas bloquer la page.
  return data ?? [];
}

export async function dateLienIcal(): Promise<string | null> {
  const supabase = await creerClientServeur();
  const { data } = await supabase.rpc('mon_jeton_ical');
  return data ?? null;
}
```

Vérifier avec context7 la syntaxe des jointures imbriquées de supabase-js (`evenement_chapitre(chapitre(...))`, `progression_chapitre(...)`) et le typage qu'elles produisent.

- [ ] **Step 6 : actions serveur**

Créer `src/app/(app)/calendrier/actions.ts` :

```ts
'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { creerClientServeur } from '@/lib/supabase/server';
import { messageErreur } from '@/lib/erreurs';
import { appelerAvecRelance } from '@/lib/supabase/rpc';
import { exigerEleve } from '@/lib/calendrier/garde';
import { lirePlanning } from '@/lib/calendrier/requetes';
import { lireFormulaireEvenement, type ChampEvenement, type ValeursEvenement } from '@/lib/calendrier/schema-evenement';
import { jourParis } from '@/lib/calendrier/dates';
import { genererPlanning, type Planning, type Reglages } from '@/lib/planning/generer';
import { lireReglages, versReglagesRpc, type ChampReglages } from '@/lib/planning/reglages';
import { urlDuSite } from '@/lib/site';
import type { Json } from '@/lib/supabase/types';

export type EtatEvenement = { erreur?: string; champ?: ChampEvenement; valeurs?: ValeursEvenement };
export type EtatPlanning = { erreur?: string; champ?: ChampReglages; apercu?: Planning; reglages?: Reglages };
export type EtatLien = { erreur?: string; lien?: string };
export type EtatSimple = { erreur?: string };

const uuid = z.string().uuid();

function revaliderCalendrier() {
  revalidatePath('/calendrier', 'layout');
  revalidatePath('/');
}

export async function enregistrerEvenement(_: EtatEvenement, form: FormData): Promise<EtatEvenement> {
  await exigerEleve();
  const idBrut = form.get('id');
  const id = idBrut ? uuid.safeParse(idBrut) : null;
  const lu = lireFormulaireEvenement(form);
  if (id && !id.success) return { erreur: messageErreur(undefined), valeurs: lu.valeurs };
  if (!lu.ok) return { erreur: lu.erreur, champ: lu.champ, valeurs: lu.valeurs };
  const supabase = await creerClientServeur();
  const { data, error } = await supabase.rpc('enregistrer_evenement', {
    // La fonction SQL accepte null (création) ; les types générés l'ignorent.
    p_id: (id?.data ?? null) as string,
    p: lu.donnees as unknown as Json,
  });
  if (error || !data) {
    const champ: ChampEvenement | undefined = error?.message.includes('repetition_invalide') ? 'jusqu'
      : error?.message.includes('cours_indisponible') ? 'cours'
      : error?.message.includes('chapitres_invalides') ? 'chapitres' : undefined;
    return { erreur: messageErreur(error?.message), champ, valeurs: lu.valeurs };
  }
  revaliderCalendrier();
  if (!id && lu.donnees.type === 'examen_reel' && lu.donnees.cours_id) redirect(`/calendrier/${data}/planning`);
  redirect(`/calendrier?vue=semaine&date=${lu.valeurs.jour}`);
}

export async function supprimerEvenement(_: EtatSimple, form: FormData): Promise<EtatSimple> {
  await exigerEleve();
  const id = uuid.safeParse(form.get('id'));
  if (!id.success) return { erreur: messageErreur(undefined) };
  const supabase = await creerClientServeur();
  const { error } = await supabase.rpc('supprimer_evenement', { p_id: id.data });
  if (error) return { erreur: messageErreur(error.message) };
  revaliderCalendrier();
  redirect('/calendrier');
}

/** Recalcule le planning côté serveur : l'aperçu et l'acceptation passent par le même calcul. */
async function calculer(form: FormData): Promise<
  { ok: false; etat: EtatPlanning } | { ok: true; examenId: string; reglages: Reglages; planning: Planning }> {
  const examen = uuid.safeParse(form.get('examen'));
  if (!examen.success) return { ok: false, etat: { erreur: messageErreur('examen_introuvable') } };
  const r = lireReglages(form);
  if (!r.ok) return { ok: false, etat: { erreur: r.erreur, champ: r.champ } };
  const maintenant = new Date();
  const donnees = await lirePlanning(examen.data, maintenant);
  if (!donnees) return { ok: false, etat: { erreur: messageErreur('examen_introuvable') } };
  if (donnees.passe) return { ok: false, etat: { erreur: messageErreur('examen_passe'), reglages: r.reglages } };
  const planning = genererPlanning({
    maintenant, examenDebut: donnees.examen.debut, chapitres: donnees.chapitres, reglages: r.reglages, occupes: donnees.occupes,
  });
  return { ok: true, examenId: examen.data, reglages: r.reglages, planning };
}

export async function apercuPlanning(_: EtatPlanning, form: FormData): Promise<EtatPlanning> {
  await exigerEleve();
  const c = await calculer(form);
  if (!c.ok) return c.etat;
  return { apercu: c.planning, reglages: c.reglages };
}

export async function accepterPlanning(_: EtatPlanning, form: FormData): Promise<EtatPlanning> {
  await exigerEleve();
  const c = await calculer(form);
  if (!c.ok) return c.etat;
  if (c.planning.sessions.length === 0) return { erreur: 'Ce planning ne contient aucune session.', apercu: c.planning, reglages: c.reglages };
  const supabase = await creerClientServeur();
  const { error } = await supabase.rpc('accepter_plan_revision', {
    p_examen: c.examenId,
    p_reglages: versReglagesRpc(c.reglages),
    p_sessions: c.planning.sessions.map((s) => ({
      titre: s.titre, debut: s.debut, duree_minutes: s.dureeMinutes, chapitres: s.chapitres, revision_generale: s.revisionGenerale,
    })),
  });
  if (error) return { erreur: messageErreur(error.message), apercu: c.planning, reglages: c.reglages };
  revaliderCalendrier();
  redirect(`/calendrier?vue=semaine&date=${jourParis(new Date(c.planning.sessions[0].debut))}`);
}

export async function refuserPlanning(_: EtatPlanning, form: FormData): Promise<EtatPlanning> {
  await exigerEleve();
  const examen = uuid.safeParse(form.get('examen'));
  const r = lireReglages(form);
  if (!examen.success || !r.ok) return { erreur: messageErreur(undefined) };
  const supabase = await creerClientServeur();
  const { error } = await supabase.rpc('refuser_plan_revision', { p_examen: examen.data, p_reglages: versReglagesRpc(r.reglages) });
  if (error) return { erreur: messageErreur(error.message) };
  revaliderCalendrier();
  redirect('/calendrier');
}

export async function ignorerReorganisation(form: FormData): Promise<void> {
  await exigerEleve();
  const plan = uuid.safeParse(form.get('plan'));
  if (!plan.success) return;
  const supabase = await creerClientServeur();
  await supabase.rpc('ignorer_reorganisation', { p_plan: plan.data });
  revaliderCalendrier();
}

export async function lancerRevisionGenerale(_: EtatSimple, form: FormData): Promise<EtatSimple> {
  await exigerEleve();
  const id = uuid.safeParse(form.get('evenement'));
  if (!id.success) return { erreur: messageErreur(undefined) };
  const supabase = await creerClientServeur();
  const { data, error } = await appelerAvecRelance(() => supabase.rpc('demarrer_revision_generale', { p_evenement: id.data }));
  if (error || !data) return { erreur: messageErreur(error?.message) };
  redirect(`/tentative/${data}`);
}

export async function creerLienIcal(_: EtatLien): Promise<EtatLien> {
  await exigerEleve();
  const supabase = await creerClientServeur();
  const { data, error } = await supabase.rpc('creer_jeton_ical');
  if (error || !data) return { erreur: messageErreur(error?.message) };
  revalidatePath('/calendrier/partage');
  return { lien: `${await urlDuSite()}/ical/${data}.ics` };
}

export async function revoquerLienIcal(_: EtatLien): Promise<EtatLien> {
  await exigerEleve();
  const supabase = await creerClientServeur();
  const { error } = await supabase.rpc('revoquer_jeton_ical');
  if (error) return { erreur: messageErreur(error.message) };
  revalidatePath('/calendrier/partage');
  return {};
}
```

- [ ] **Step 7 : vérifier et commiter**

Run : `npm test && npm run typecheck && npm run lint`
Expected : PASS.

```bash
git add src/lib/calendrier src/lib/planning/reglages.ts src/lib/planning/reglages.test.ts src/lib/site.ts "src/app/(app)/calendrier/actions.ts" src/lib/erreurs.ts src/lib/erreurs.test.ts .env.example
git commit -m "Ajoute les lectures et les actions serveur du calendrier et du planning

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 8 : interface du calendrier

Avant de commencer, lire les skills `frontend-design` et `ui-ux-pro-max` pour l'écran du calendrier : il doit rester lisible à 375 px, avec des cibles tactiles d'au moins 44 px.

**Files :**
- Create : `src/components/calendrier/ItemCalendrier.tsx`, `VueCalendrier.tsx`, `FormulaireEvenement.tsx`, `BoutonSupprimerEvenement.tsx`, `ProchainsEvenements.tsx`
- Create : `src/app/(app)/calendrier/page.tsx`, `src/app/(app)/calendrier/nouveau/page.tsx`, `src/app/(app)/calendrier/[id]/page.tsx`
- Create : `src/styles/calendrier.css`
- Modify : `src/app/globals.css` (import), `src/components/EnTete.tsx` (lien « Calendrier »), `src/app/(app)/page.tsx` (prochains événements), `src/lib/calendrier/requetes.ts` (`optionsCours`)

**Interfaces :**
- Consumes : Tasks 6 et 7 ; `listerCoursDuProfil()` (`src/lib/contenu/requetes.ts`).
- Produces :
  - `optionsCours(): Promise<CoursOption[]>` dans `requetes.ts`, avec `type CoursOption = { id: string; titre: string; chapitres: { id: string; numero: number; titre: string }[] }` ;
  - composants `ItemCalendrier`, `VueCalendrier`, `FormulaireEvenement`, `ProchainsEvenements` ;
  - pages `/calendrier`, `/calendrier/nouveau`, `/calendrier/[id]`. La Task 9 complète la page `[id]`.

- [ ] **Step 1 : options de cours du formulaire**

Ajouter à `src/lib/calendrier/requetes.ts` :

```ts
import { listerCoursDuProfil } from '@/lib/contenu/requetes';

export type CoursOption = { id: string; titre: string; chapitres: { id: string; numero: number; titre: string }[] };

/** Cours de la filière de l'élève, avec leurs chapitres publiés, pour le formulaire d'événement. */
export async function optionsCours(): Promise<CoursOption[]> {
  const cours = await listerCoursDuProfil();
  const chapitres = await chapitresDesCours(cours.map((c) => c.id));
  return cours.map((c) => ({
    id: c.id, titre: c.titre,
    chapitres: chapitres.filter((ch) => ch.cours_id === c.id).map(({ id, numero, titre }) => ({ id, numero, titre })),
  }));
}
```

- [ ] **Step 2 : élément et vues du calendrier**

`src/components/calendrier/ItemCalendrier.tsx` :

```tsx
import Link from 'next/link';
import type { CSSProperties } from 'react';
import { heureParis, jourParis, libelleJour } from '@/lib/calendrier/dates';
import type { OccurrenceCalendrier } from '@/lib/calendrier/requetes';

const LIBELLES = { revision: 'Révision', devoir: 'Devoir', examen_reel: 'Examen', echeance: 'Échéance de ta classe' } as const;

export function ItemCalendrier({ o, avecJour = false }: { o: OccurrenceCalendrier; avecJour?: boolean }) {
  const style = o.couleur ? ({ '--couleur-cours': o.couleur } as CSSProperties) : undefined;
  const horaire = o.debut === o.fin ? heureParis(o.debut) : `${heureParis(o.debut)} – ${heureParis(o.fin)}`;
  const contenu = (
    <>
      <span className="item-horaire">{avecJour && <span className="item-jour">{libelleJour(jourParis(new Date(o.debut)))} · </span>}{horaire}</span>
      <span className="item-titre">{o.titre}</span>
      <span className="item-type">{LIBELLES[o.type]}{o.classe_nom ? ` · ${o.classe_nom}` : ''}{o.lecture_seule && <span className="sr-only"> (lecture seule)</span>}</span>
    </>
  );
  if (o.type === 'echeance') {
    return (
      <li className="item-calendrier item-echeance" style={style}>
        {o.cours_slug ? <Link href={`/cours/${o.cours_slug}/evaluation`}>{contenu}</Link> : <div>{contenu}</div>}
      </li>
    );
  }
  return (
    <li className={`item-calendrier item-${o.type}`} style={style}>
      <Link href={`/calendrier/${o.evenement_id}`}>{contenu}</Link>
    </li>
  );
}
```

`src/components/calendrier/VueCalendrier.tsx` :

```tsx
import Link from 'next/link';
import type { CSSProperties } from 'react';
import { ItemCalendrier } from './ItemCalendrier';
import { jourParis, libelleJour, type Vue } from '@/lib/calendrier/dates';
import type { OccurrenceCalendrier } from '@/lib/calendrier/requetes';

const JOURS_COURTS = ['lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.', 'dim.'];
const JOURS_LONGS = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];

/** Occurrences rangées par jour de début (heure de Paris). */
function parJour(occurrences: OccurrenceCalendrier[]) {
  const groupes = new Map<string, OccurrenceCalendrier[]>();
  for (const o of occurrences) {
    const jour = jourParis(new Date(o.debut));
    groupes.set(jour, [...(groupes.get(jour) ?? []), o]);
  }
  return groupes;
}

type Props = { vue: Vue; jour: string; jours: string[]; occurrences: OccurrenceCalendrier[]; aujourdhui: string };

export function VueCalendrier({ vue, jour, jours, occurrences, aujourdhui }: Props) {
  const groupes = parJour(occurrences);
  if (vue === 'mois') {
    const mois = jour.slice(0, 7);
    const semaines = Array.from({ length: 6 }, (_, i) => jours.slice(i * 7, i * 7 + 7));
    return (
      <table className="grille-mois">
        <caption className="sr-only">Événements du mois. Choisis un jour pour voir son détail.</caption>
        <thead>
          <tr>{JOURS_COURTS.map((j, i) => <th key={j} scope="col"><abbr title={JOURS_LONGS[i]}>{j}</abbr></th>)}</tr>
        </thead>
        <tbody>
          {semaines.map((semaine) => (
            <tr key={semaine[0]}>
              {semaine.map((d) => {
                const items = groupes.get(d) ?? [];
                const classes = [d.slice(0, 7) !== mois && 'hors-mois', d === aujourdhui && 'aujourdhui'].filter(Boolean).join(' ');
                return (
                  <td key={d} className={classes || undefined}>
                    <Link href={`/calendrier?vue=jour&date=${d}`} aria-current={d === aujourdhui ? 'date' : undefined}
                      aria-label={`${libelleJour(d)}${items.length > 0 ? `, ${items.length} événement${items.length > 1 ? 's' : ''}` : ''}`}>
                      {Number(d.slice(8))}
                    </Link>
                    {items.length > 0 && (
                      <ul className="points-mois" aria-hidden="true">
                        {items.slice(0, 3).map((o) => (
                          <li key={o.cle} className={`point point-${o.type}`}
                            style={o.couleur ? ({ '--couleur-cours': o.couleur } as CSSProperties) : undefined}>
                            <span className="titre-mois">{o.titre}</span>
                          </li>
                        ))}
                        {items.length > 3 && <li className="plus">+{items.length - 3}</li>}
                      </ul>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
  return (
    <ol className="agenda">
      {jours.map((d) => {
        const items = groupes.get(d) ?? [];
        return (
          <li key={d} className={d === aujourdhui ? 'jour-agenda aujourdhui' : 'jour-agenda'}>
            <h3>
              {libelleJour(d)}
              {d === aujourdhui && <span className="badge-aujourdhui"> · aujourd’hui</span>}
            </h3>
            {items.length === 0
              ? <p className="vide">Rien de prévu.</p>
              : <ul className="liste-calendrier">{items.map((o) => <ItemCalendrier key={o.cle} o={o} />)}</ul>}
          </li>
        );
      })}
    </ol>
  );
}
```

- [ ] **Step 3 : page du calendrier**

`src/app/(app)/calendrier/page.tsx` :

```tsx
import Link from 'next/link';
import { exigerEleve } from '@/lib/calendrier/garde';
import { lireCalendrier } from '@/lib/calendrier/requetes';
import { jourParis, libellePeriode, lireVue, naviguer, periodeVue, VUES, type Vue } from '@/lib/calendrier/dates';
import { VueCalendrier } from '@/components/calendrier/VueCalendrier';

export const metadata = { title: 'Calendrier' };

const NOMS: Record<Vue, string> = { jour: 'Jour', semaine: 'Semaine', mois: 'Mois' };
const PRECEDENT: Record<Vue, string> = { jour: 'Jour précédent', semaine: 'Semaine précédente', mois: 'Mois précédent' };
const SUIVANT: Record<Vue, string> = { jour: 'Jour suivant', semaine: 'Semaine suivante', mois: 'Mois suivant' };

export default async function PageCalendrier({ searchParams }: { searchParams: Promise<{ vue?: string; date?: string }> }) {
  await exigerEleve();
  const maintenant = new Date();
  const { vue, jour } = lireVue(await searchParams, maintenant);
  const { jours, de, a } = periodeVue(vue, jour);
  const occurrences = await lireCalendrier(de, a);
  return (
    <div className="calendrier">
      <header className="calendrier-entete">
        <h1>Mon calendrier</h1>
        <Link className="bouton bouton-principal" href={`/calendrier/nouveau?jour=${jour}`}>Ajouter</Link>
      </header>
      <nav aria-label="Vue du calendrier" className="choix-vue">
        {VUES.map((v) => (
          <Link key={v} href={`/calendrier?vue=${v}&date=${jour}`} aria-current={v === vue ? 'page' : undefined}>{NOMS[v]}</Link>
        ))}
      </nav>
      <div className="navigation-periode">
        <Link href={`/calendrier?vue=${vue}&date=${naviguer(vue, jour, -1)}`} aria-label={PRECEDENT[vue]}>←</Link>
        <h2>{libellePeriode(vue, jour)}</h2>
        <Link href={`/calendrier?vue=${vue}&date=${naviguer(vue, jour, 1)}`} aria-label={SUIVANT[vue]}>→</Link>
        <Link href={`/calendrier?vue=${vue}`} className="lien-aujourdhui">Aujourd’hui</Link>
      </div>
      <VueCalendrier vue={vue} jour={jour} jours={jours} occurrences={occurrences} aujourdhui={jourParis(maintenant)} />
      <p className="lien-partage"><Link href="/calendrier/partage">Ajouter mon calendrier à un autre agenda</Link></p>
    </div>
  );
}
```

- [ ] **Step 4 : formulaire d'événement**

`src/components/calendrier/FormulaireEvenement.tsx` :

```tsx
'use client';

import { useActionState, useId, useState } from 'react';
import { enregistrerEvenement, type EtatEvenement } from '@/app/(app)/calendrier/actions';
import { DUREES_EVENEMENT, type ChampEvenement, type ValeursEvenement } from '@/lib/calendrier/schema-evenement';
import type { CoursOption } from '@/lib/calendrier/requetes';

const TYPES = [
  { valeur: 'revision', libelle: 'Révision' },
  { valeur: 'devoir', libelle: 'Devoir' },
  { valeur: 'examen_reel', libelle: 'Examen (contrôle, bac blanc…)' },
];
const JOURS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
const libelleDuree = (d: number) => (d < 60 ? `${d} min` : d % 60 === 0 ? `${d / 60} h` : `${Math.floor(d / 60)} h ${d % 60}`);

type Props = { id?: string; cours: CoursOption[]; initial: ValeursEvenement };

export function FormulaireEvenement({ id, cours, initial }: Props) {
  const [etat, envoyer, enCours] = useActionState<EtatEvenement, FormData>(enregistrerEvenement, {});
  const v = etat.valeurs ?? initial;
  const [type, setType] = useState(v.type);
  const [coursId, setCoursId] = useState(v.cours);
  const [repetition, setRepetition] = useState(v.repetition);
  const uid = useId();
  const erreurId = `${uid}-erreur`;
  const aideHeure = `${uid}-aide-heure`;
  const aideChapitres = `${uid}-aide-chapitres`;
  // Seul le champ en cause est marqué invalide et relié au message d'erreur.
  const decrit = (champ: ChampEvenement, aide?: string) => ({
    'aria-invalid': etat.champ === champ ? true : undefined,
    'aria-describedby': [aide, etat.champ === champ ? erreurId : null].filter(Boolean).join(' ') || undefined,
  });
  const chapitres = cours.find((c) => c.id === coursId)?.chapitres ?? [];
  return (
    // key : React 19 vide les champs non contrôlés après une action ; on les remonte avec les valeurs renvoyées.
    <form action={envoyer} className="formulaire formulaire-evenement" key={JSON.stringify(etat.valeurs ?? null)}>
      {id && <input type="hidden" name="id" value={id} />}
      {id ? <input type="hidden" name="type" value={type} /> : (
        <fieldset aria-describedby={etat.champ === 'type' ? erreurId : undefined}>
          <legend>Type</legend>
          {TYPES.map((t) => (
            <label key={t.valeur} className="choix-radio">
              <input type="radio" name="type" value={t.valeur} checked={type === t.valeur} onChange={() => setType(t.valeur)} required />
              {t.libelle}
            </label>
          ))}
        </fieldset>
      )}
      <label>
        Titre
        <input name="titre" defaultValue={v.titre} maxLength={120} required {...decrit('titre')} />
      </label>
      <div className="ligne-champs">
        <label>Date<input type="date" name="jour" defaultValue={v.jour} required {...decrit('jour')} /></label>
        <label>Heure<input type="time" name="heure" defaultValue={v.heure} required {...decrit('heure', aideHeure)} /></label>
        <label>
          Durée
          <select name="duree" defaultValue={v.duree} {...decrit('duree')}>
            {DUREES_EVENEMENT.map((d) => <option key={d} value={d}>{libelleDuree(d)}</option>)}
          </select>
        </label>
      </div>
      <p id={aideHeure} className="aide-champ">Heure de Paris.</p>
      <label>
        Cours
        <select name="cours" value={coursId} onChange={(e) => setCoursId(e.target.value)} {...decrit('cours')}>
          <option value="">Aucun</option>
          {cours.map((c) => <option key={c.id} value={c.id}>{c.titre}</option>)}
        </select>
      </label>
      {chapitres.length > 0 && (
        <fieldset aria-describedby={[aideChapitres, etat.champ === 'chapitres' ? erreurId : null].filter(Boolean).join(' ')}>
          <legend>Chapitres</legend>
          <p id={aideChapitres} className="aide-champ">
            {type === 'examen_reel' ? 'Les chapitres au programme. Sans choix, le planning prend tout le cours.' : 'Facultatif.'}
          </p>
          {chapitres.map((ch) => (
            <label key={ch.id} className="choix-case">
              <input type="checkbox" name="chapitres" value={ch.id} defaultChecked={v.chapitres.includes(ch.id)} />
              Ch. {ch.numero} · {ch.titre}
            </label>
          ))}
        </fieldset>
      )}
      {!id && type === 'examen_reel' && coursId && (
        <p className="message-info">Après l’enregistrement, on te proposera un planning de révision.</p>
      )}
      <label>
        Répétition
        <select name="repetition" value={repetition} onChange={(e) => setRepetition(e.target.value)} {...decrit('repetition')}>
          <option value="aucune">Aucune</option>
          <option value="quotidienne">Tous les jours</option>
          <option value="hebdomadaire">Toutes les semaines</option>
          <option value="jours">Certains jours de la semaine</option>
        </select>
      </label>
      {repetition === 'jours' && (
        <fieldset aria-describedby={etat.champ === 'jours' ? erreurId : undefined}>
          <legend>Jours</legend>
          {JOURS.map((j, i) => (
            <label key={j} className="choix-case">
              <input type="checkbox" name="jours" value={i + 1} defaultChecked={v.jours.includes(String(i + 1))} />
              {j}
            </label>
          ))}
        </fieldset>
      )}
      {repetition !== 'aucune' && (
        <label>Jusqu’au<input type="date" name="jusqu" defaultValue={v.jusqu} required {...decrit('jusqu')} /></label>
      )}
      {etat.erreur && <p id={erreurId} role="alert" className="message-erreur">{etat.erreur}</p>}
      <button type="submit" className="bouton bouton-principal" disabled={enCours}>
        {enCours ? 'Enregistrement…' : id ? 'Enregistrer les modifications' : 'Ajouter au calendrier'}
      </button>
    </form>
  );
}
```

`src/components/calendrier/BoutonSupprimerEvenement.tsx` :

```tsx
'use client';

import { useActionState } from 'react';
import { supprimerEvenement, type EtatSimple } from '@/app/(app)/calendrier/actions';

export function BoutonSupprimerEvenement({ id, titre, examen }: { id: string; titre: string; examen: boolean }) {
  const [etat, envoyer, enCours] = useActionState<EtatSimple, FormData>(supprimerEvenement, {});
  const question = examen
    ? 'Supprimer cet examen ? Les sessions à venir de son planning seront supprimées aussi.'
    : 'Supprimer cet événement ? S’il se répète, toute la série est supprimée.';
  return (
    <form action={envoyer} onSubmit={(e) => { if (!window.confirm(question)) e.preventDefault(); }}>
      <input type="hidden" name="id" value={id} />
      <button type="submit" className="bouton bouton-secondaire" disabled={enCours}>
        Supprimer<span className="sr-only"> « {titre} »</span>
      </button>
      {etat.erreur && <p role="alert" className="message-erreur">{etat.erreur}</p>}
    </form>
  );
}
```

- [ ] **Step 5 : pages de création et de modification**

`src/app/(app)/calendrier/nouveau/page.tsx` :

```tsx
import Link from 'next/link';
import { exigerEleve } from '@/lib/calendrier/garde';
import { optionsCours } from '@/lib/calendrier/requetes';
import { estJourValide, jourParis } from '@/lib/calendrier/dates';
import { TYPES_EVENEMENT } from '@/lib/calendrier/schema-evenement';
import { FormulaireEvenement } from '@/components/calendrier/FormulaireEvenement';

export const metadata = { title: 'Nouvel événement' };

export default async function PageNouvelEvenement({ searchParams }: { searchParams: Promise<{ jour?: string; type?: string }> }) {
  await exigerEleve();
  const { jour, type } = await searchParams;
  const cours = await optionsCours();
  return (
    <div className="page-evenement">
      <p><Link href="/calendrier">← Mon calendrier</Link></p>
      <h1>Nouvel événement</h1>
      <FormulaireEvenement cours={cours} initial={{
        type: (TYPES_EVENEMENT as readonly string[]).includes(type ?? '') ? type! : 'revision',
        titre: '', jour: jour && estJourValide(jour) ? jour : jourParis(new Date()), heure: '17:00', duree: '60',
        cours: '', chapitres: [], repetition: 'aucune', jours: [], jusqu: '',
      }} />
    </div>
  );
}
```

`src/app/(app)/calendrier/[id]/page.tsx` :

```tsx
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { exigerEleve } from '@/lib/calendrier/garde';
import { lireEvenement, optionsCours } from '@/lib/calendrier/requetes';
import { isoVersHeureParis } from '@/lib/enseignant/dates';
import { FormulaireEvenement } from '@/components/calendrier/FormulaireEvenement';
import { BoutonSupprimerEvenement } from '@/components/calendrier/BoutonSupprimerEvenement';

export const metadata = { title: 'Événement' };

export default async function PageEvenement({ params }: { params: Promise<{ id: string }> }) {
  await exigerEleve();
  const { id } = await params;
  const e = await lireEvenement(id);
  if (!e) notFound();
  const local = isoVersHeureParis(e.debut);
  const chapitres = e.evenement_chapitre.flatMap((ec) => (ec.chapitre ? [ec.chapitre] : [])).sort((a, b) => a.numero - b.numero);
  const cours = await optionsCours();
  return (
    <div className="page-evenement">
      <p><Link href={`/calendrier?vue=semaine&date=${local.slice(0, 10)}`}>← Mon calendrier</Link></p>
      <h1>{e.titre}</h1>
      {e.type === 'revision' && !e.revision_generale && chapitres.length > 0 && e.cours && (
        <section aria-labelledby="titre-reviser">
          <h2 id="titre-reviser">Réviser</h2>
          <ul className="liste-tdb">
            {chapitres.map((ch) => (
              <li key={ch.id} className="carte ligne-tdb">
                <Link href={`/cours/${e.cours!.slug}/${ch.slug}`}>Ch. {ch.numero} · {ch.titre}</Link>
              </li>
            ))}
          </ul>
        </section>
      )}
      <section aria-labelledby="titre-modifier">
        <h2 id="titre-modifier">Modifier</h2>
        <FormulaireEvenement id={e.id} cours={cours} initial={{
          type: e.type, titre: e.titre, jour: local.slice(0, 10), heure: local.slice(11, 16), duree: String(e.duree_minutes),
          cours: e.cours_id ?? '', chapitres: chapitres.map((c) => c.id), repetition: e.repetition,
          jours: (e.jours_semaine ?? []).map(String), jusqu: e.repeter_jusqu_au ?? '',
        }} />
      </section>
      <BoutonSupprimerEvenement id={e.id} titre={e.titre} examen={e.type === 'examen_reel'} />
    </div>
  );
}
```

- [ ] **Step 6 : prochains événements sur l'accueil, lien dans l'en-tête**

`src/components/calendrier/ProchainsEvenements.tsx` :

```tsx
import Link from 'next/link';
import { prochainsEvenements, type OccurrenceCalendrier } from '@/lib/calendrier/requetes';
import { ItemCalendrier } from './ItemCalendrier';

export async function ProchainsEvenements() {
  let liste: OccurrenceCalendrier[] | null;
  try {
    liste = await prochainsEvenements(new Date());
  } catch {
    liste = null;
  }
  return (
    <section aria-labelledby="titre-prochains">
      <h2 id="titre-prochains">Prochains événements</h2>
      {liste === null ? <p className="vide">Ton calendrier n’a pas pu se charger. Recharge la page dans un instant.</p>
        : liste.length === 0 ? <p className="vide">Rien de prévu dans les 14 prochains jours. <Link href="/calendrier/nouveau">Ajoute un devoir ou un examen</Link>.</p>
        : <ul className="liste-calendrier">{liste.map((o) => <ItemCalendrier key={o.cle} o={o} avecJour />)}</ul>}
      <p><Link href="/calendrier">Voir mon calendrier</Link></p>
    </section>
  );
}
```

- `src/app/(app)/page.tsx` : juste après la section « Mes cours », ajouter `{profil?.role === 'eleve' && <ProchainsEvenements />}`.
- `src/components/EnTete.tsx` : liens de l'élève :

```ts
  eleve: [{ href: '/', libelle: 'Mes cours' }, { href: '/calendrier', libelle: 'Calendrier' }, { href: '/classes', libelle: 'Mes classes' }],
```

- [ ] **Step 7 : styles**

Créer `src/styles/calendrier.css` et l'importer dans `src/app/globals.css`, après `admin.css` :

```css
/* Calendrier de l'élève : agenda (jour, semaine), grille du mois, formulaires. Mobile d'abord. */
.calendrier-entete { display: flex; align-items: center; justify-content: space-between; gap: .75rem; flex-wrap: wrap; }
.choix-vue { display: inline-flex; gap: 2px; padding: 3px; margin-block: .75rem; border: 1px solid var(--trait); border-radius: 999px; background: var(--surface); }
.choix-vue a { display: inline-flex; align-items: center; min-height: 44px; padding: 0 1rem; border-radius: 999px; color: var(--encre); font-weight: 700; text-decoration: none; }
.choix-vue a[aria-current="page"] { background: var(--couleur-cours); color: #fff; }
.navigation-periode { display: flex; align-items: center; gap: .25rem; flex-wrap: wrap; margin-block: .5rem 1rem; }
.navigation-periode h2 { flex: 1; min-width: 10rem; margin: 0; font-size: 1.15rem; text-align: center; }
.navigation-periode h2::first-letter { text-transform: uppercase; }
.navigation-periode a { display: inline-flex; align-items: center; justify-content: center; min-width: 44px; min-height: 44px; }
.agenda { display: grid; gap: 1rem; padding: 0; list-style: none; }
.jour-agenda h3 { margin: 0 0 .4rem; font-size: 1rem; }
.jour-agenda h3::first-letter { text-transform: uppercase; }
.jour-agenda.aujourdhui h3 { color: var(--couleur-cours); }
.liste-calendrier { display: grid; gap: .5rem; margin: 0; padding: 0; list-style: none; }
.item-calendrier > a, .item-calendrier > div {
  display: grid; grid-template-columns: auto 1fr; column-gap: .75rem; align-items: baseline;
  padding: .65rem .85rem; border-left: 5px solid var(--couleur-cours); border-radius: var(--rayon);
  background: var(--surface); box-shadow: var(--ombre-carte); color: var(--encre); text-decoration: none;
}
.item-horaire { grid-row: span 2; font-weight: 700; font-variant-numeric: tabular-nums; }
.item-jour { font-weight: 400; }
.item-titre { font-weight: 700; }
.item-type { color: var(--attenue); font-size: .9rem; }
.item-echeance > a, .item-echeance > div { border-left-style: dashed; background: repeating-linear-gradient(135deg, var(--surface) 0 10px, var(--papier) 10px 20px); }
.grille-mois { width: 100%; table-layout: fixed; border-collapse: collapse; }
.grille-mois th { padding: .3rem 0; color: var(--attenue); font-size: .8rem; font-weight: 700; }
.grille-mois abbr { text-decoration: none; }
.grille-mois td { height: 4.5rem; padding: 2px; border: 1px solid var(--trait); vertical-align: top; }
.grille-mois td > a { display: inline-flex; align-items: center; justify-content: center; min-width: 44px; min-height: 44px; border-radius: 999px; color: var(--encre); font-weight: 700; text-decoration: none; }
.grille-mois .hors-mois > a { color: var(--attenue); font-weight: 400; }
.grille-mois .aujourdhui > a { background: var(--couleur-cours); color: #fff; }
.points-mois { display: flex; flex-wrap: wrap; gap: 3px; margin: 0; padding: 0 4px; list-style: none; }
.point { width: 8px; height: 8px; border-radius: 50%; background: var(--couleur-cours); }
.point-echeance { border: 2px solid var(--danger); background: transparent; }
.titre-mois { display: none; }
.plus { color: var(--attenue); font-size: .7rem; line-height: 8px; }
@media (min-width: 768px) {
  .points-mois { display: grid; }
  .point { width: auto; height: auto; padding: 0 4px; border-left: 3px solid var(--couleur-cours); border-radius: 4px;
           background: color-mix(in srgb, var(--couleur-cours) 14%, var(--surface)); }
  .point-echeance { border: 0; border-left: 3px dashed var(--danger); }
  .titre-mois { display: block; overflow: hidden; font-size: .75rem; text-overflow: ellipsis; white-space: nowrap; }
  .plus { line-height: 1.2; }
}
.lien-partage { margin-top: 1.5rem; }
.formulaire-evenement fieldset { display: grid; gap: .4rem; }
.choix-radio, .choix-case { display: flex; align-items: center; gap: .5rem; min-height: 44px; }
.liste-sessions { display: grid; gap: .5rem; padding-left: 1.25rem; }
.actions-planning, .actions-banniere { display: flex; flex-wrap: wrap; gap: .5rem; margin-top: .75rem; }
.banniere-reorganiser { margin-block: 1rem; border-left: 5px solid var(--accent); }
.bandeau-hors-ligne { padding: .6rem 1rem; background: var(--accent); color: #1c1b29; font-weight: 700; text-align: center; }
```

Vérifier les contrastes dans les deux thèmes (texte sur `--couleur-cours`, bandeau ambre) et l'absence de défilement horizontal à 375 px. L'en-tête porte maintenant trois liens : vérifier qu'il tient à 375 px (le bilan 3b signalait un menu coupé).

- [ ] **Step 8 : vérifier et commiter**

Run : `npm test && npm run typecheck && npm run lint && npm run build`
Expected : PASS. Ouvrir `/calendrier` en local (`npm run dev`), dans les trois vues, à 375 px et sur ordinateur, en thème clair et sombre.

```bash
git add src/components/calendrier src/app/\(app\)/calendrier src/styles/calendrier.css src/app/globals.css src/components/EnTete.tsx "src/app/(app)/page.tsx" src/lib/calendrier/requetes.ts
git commit -m "Ajoute le calendrier de l'élève : vues jour, semaine et mois, et ses événements

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 9 : interface du planning, de la révision générale et du partage

**Files :**
- Create : `src/components/calendrier/FormulairePlanning.tsx`, `BanniereReorganiser.tsx`, `FormulaireRevisionGenerale.tsx`, `GestionLienIcal.tsx`
- Create : `src/app/(app)/calendrier/[id]/planning/page.tsx`, `src/app/(app)/calendrier/partage/page.tsx`
- Modify : `src/app/(app)/calendrier/[id]/page.tsx`, `src/app/(app)/calendrier/page.tsx`, `src/app/(app)/page.tsx`

**Interfaces :**
- Consumes : actions et lectures de la Task 7 ; `REGLAGES_PAR_DEFAUT`, `DUREES_SESSION`.
- Produces : pages `/calendrier/[id]/planning` et `/calendrier/partage` ; bannière de réorganisation sur l'accueil et le calendrier.

- [ ] **Step 1 : formulaire du planning**

`src/components/calendrier/FormulairePlanning.tsx` :

```tsx
'use client';

import { useActionState, useId } from 'react';
import { accepterPlanning, apercuPlanning, refuserPlanning, type EtatPlanning } from '@/app/(app)/calendrier/actions';
import { DUREES_SESSION } from '@/lib/planning/reglages';
import type { Reglages } from '@/lib/planning/generer';

const JOURS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
const formatSession = new Intl.DateTimeFormat('fr-FR', {
  weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Paris',
});

/** Champs cachés : l'acceptation et le refus reprennent les réglages de l'aperçu affiché. */
function ReglagesCaches({ examenId, r }: { examenId: string; r: Reglages }) {
  return (
    <>
      <input type="hidden" name="examen" value={examenId} />
      <input type="hidden" name="sessions" value={r.sessionsParSemaine} />
      <input type="hidden" name="duree" value={r.dureeMinutes} />
      {r.joursPreferes.map((j) => <input key={j} type="hidden" name="jours" value={j} />)}
      <input type="hidden" name="heure" value={r.heureDebut} />
    </>
  );
}

export function FormulairePlanning({ examenId, initial, peutRefuser }: { examenId: string; initial: Reglages; peutRefuser: boolean }) {
  const [apercu, demanderApercu, calcul] = useActionState<EtatPlanning, FormData>(apercuPlanning, {});
  const [acceptation, accepter, enregistrement] = useActionState<EtatPlanning, FormData>(accepterPlanning, {});
  const [refus, refuser, refusEnCours] = useActionState<EtatPlanning, FormData>(refuserPlanning, {});
  const r = acceptation.reglages ?? apercu.reglages ?? initial;
  const planning = acceptation.apercu ?? apercu.apercu;
  const erreur = acceptation.erreur ?? refus.erreur ?? apercu.erreur;
  const uid = useId();
  const erreurId = `${uid}-erreur`;
  const invalide = (champ: EtatPlanning['champ']) => (apercu.champ === champ
    ? { 'aria-invalid': true as const, 'aria-describedby': erreurId } : {});
  return (
    <div className="planning">
      <form action={demanderApercu} className="formulaire" key={JSON.stringify(r)}>
        <input type="hidden" name="examen" value={examenId} />
        <div className="ligne-champs">
          <label>
            Sessions par semaine
            <select name="sessions" defaultValue={r.sessionsParSemaine} {...invalide('sessions')}>
              {[1, 2, 3, 4, 5, 6, 7].map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </label>
          <label>
            Durée d’une session
            <select name="duree" defaultValue={r.dureeMinutes} {...invalide('duree')}>
              {DUREES_SESSION.map((d) => <option key={d} value={d}>{d} min</option>)}
            </select>
          </label>
          <label>
            Heure de début
            <input type="time" name="heure" min="06:00" max="21:00" defaultValue={r.heureDebut} {...invalide('heure')} />
          </label>
        </div>
        <fieldset aria-describedby={apercu.champ === 'jours' ? erreurId : undefined}>
          <legend>Jours où tu peux réviser</legend>
          {JOURS.map((j, i) => (
            <label key={j} className="choix-case">
              <input type="checkbox" name="jours" value={i + 1} defaultChecked={r.joursPreferes.includes(i + 1)} />
              {j}
            </label>
          ))}
        </fieldset>
        <button type="submit" className="bouton bouton-secondaire" disabled={calcul}>{calcul ? 'Calcul…' : 'Voir le planning proposé'}</button>
      </form>
      {erreur && <p id={erreurId} role="alert" className="message-erreur">{erreur}</p>}
      {/* Annonce courte : la liste complète n'est pas lue d'un bloc. */}
      <p className="sr-only" aria-live="polite">{planning ? `${planning.sessions.length} session${planning.sessions.length > 1 ? 's' : ''} proposée${planning.sessions.length > 1 ? 's' : ''}.` : ''}</p>
      {planning && (
        <section aria-labelledby={`${uid}-apercu`} className="apercu-planning">
          <h2 id={`${uid}-apercu`}>Planning proposé</h2>
          {planning.avertissements.map((a) => <p key={a} className="message-info">{a}</p>)}
          {planning.sessions.length > 0 && (
            <ol className="liste-sessions">
              {planning.sessions.map((s) => (
                <li key={s.debut} className="carte">
                  <strong>{formatSession.format(new Date(s.debut))}</strong> · {s.dureeMinutes} min
                  <br />{s.titre}
                </li>
              ))}
            </ol>
          )}
          {planning.sessions.length > 0 && (
            <form action={accepter} className="actions-planning">
              <ReglagesCaches examenId={examenId} r={r} />
              <button type="submit" className="bouton bouton-principal" disabled={enregistrement}>
                {enregistrement ? 'Enregistrement…' : 'Accepter ce planning'}
              </button>
            </form>
          )}
        </section>
      )}
      {peutRefuser && (
        <form action={refuser} className="actions-planning">
          <ReglagesCaches examenId={examenId} r={r} />
          <button type="submit" className="bouton bouton-secondaire" disabled={refusEnCours}>Non merci, pas de planning</button>
        </form>
      )}
    </div>
  );
}
```

- [ ] **Step 2 : page du planning**

`src/app/(app)/calendrier/[id]/planning/page.tsx` :

```tsx
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { exigerEleve } from '@/lib/calendrier/garde';
import { lirePlanning } from '@/lib/calendrier/requetes';
import { REGLAGES_PAR_DEFAUT } from '@/lib/planning/reglages';
import type { Reglages } from '@/lib/planning/generer';
import { FormulairePlanning } from '@/components/calendrier/FormulairePlanning';

export const metadata = { title: 'Planning de révision' };
const formatDate = new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Paris' });

export default async function PagePlanning({ params }: { params: Promise<{ id: string }> }) {
  await exigerEleve();
  const { id } = await params;
  const p = await lirePlanning(id, new Date());
  if (!p) notFound();
  const initial: Reglages = p.plan
    ? { sessionsParSemaine: p.plan.sessions_par_semaine, dureeMinutes: p.plan.duree_minutes, joursPreferes: p.plan.jours_preferes, heureDebut: p.plan.heure_debut.slice(0, 5) }
    : REGLAGES_PAR_DEFAUT;
  return (
    <div className="page-planning">
      <p><Link href={`/calendrier/${id}`}>← {p.examen.titre}</Link></p>
      <h1>Planning de révision</h1>
      <p>{p.examen.titre} · {formatDate.format(new Date(p.examen.debut))}{p.examen.cours ? ` · ${p.examen.cours.titre}` : ''}</p>
      {p.passe ? <p className="vide">Cet examen est passé.</p>
        : p.tropLoin ? <p className="vide">Ton examen est dans plus d’un an. Reviens plus tard pour préparer ton planning.</p>
        : (
          <>
            {p.plan?.statut === 'accepte' && (
              <section aria-labelledby="titre-en-place">
                <h2 id="titre-en-place">Ton planning est en place</h2>
                {p.sessionsAVenir.length === 0 ? <p className="vide">Plus de session à venir.</p> : (
                  <ol className="liste-sessions">
                    {p.sessionsAVenir.map((s) => (
                      <li key={s.id} className="carte"><Link href={`/calendrier/${s.id}`}>{formatDate.format(new Date(s.debut))} · {s.titre}</Link></li>
                    ))}
                  </ol>
                )}
                <p>Pour le réorganiser, change les réglages et accepte le nouveau planning : les sessions à venir seront remplacées.</p>
              </section>
            )}
            {p.plan?.statut === 'refuse' && <p className="message-info">Tu as refusé le planning proposé. Tu peux en demander un autre quand tu veux.</p>}
            {!p.plan && <p>On répartit tes chapitres d’ici l’examen, en commençant par ceux que tu maîtrises le moins. La veille, une révision générale te fait réviser tout le programme.</p>}
            <FormulairePlanning examenId={id} initial={initial} peutRefuser={!p.plan} />
          </>
        )}
    </div>
  );
}
```

- [ ] **Step 3 : bannière de réorganisation et révision générale**

`src/components/calendrier/BanniereReorganiser.tsx` :

```tsx
import Link from 'next/link';
import { ignorerReorganisation } from '@/app/(app)/calendrier/actions';

export function BanniereReorganiser({ planId, examenId, examenTitre }: { planId: string; examenId: string; examenTitre: string }) {
  return (
    <section className="banniere-reorganiser carte" aria-label={`Réorganiser le planning de « ${examenTitre} »`}>
      <p>Bravo, tu as validé un chapitre prévu plus tard dans ton planning pour « {examenTitre} ». Veux-tu le réorganiser ?</p>
      <div className="actions-banniere">
        <Link className="bouton bouton-principal" href={`/calendrier/${examenId}/planning`}>Réorganiser</Link>
        <form action={ignorerReorganisation}>
          <input type="hidden" name="plan" value={planId} />
          <button type="submit" className="bouton bouton-secondaire">Plus tard</button>
        </form>
      </div>
    </section>
  );
}
```

Afficher les bannières dans `src/app/(app)/calendrier/page.tsx`. Remplacer la lecture du calendrier par :

```tsx
  const [occurrences, aReorganiser] = await Promise.all([lireCalendrier(de, a), plansAReorganiser()]);
```

puis, juste sous le `</header>` :

```tsx
      {aReorganiser.map((p) => (
        <BanniereReorganiser key={p.plan_id} planId={p.plan_id} examenId={p.examen_id} examenTitre={p.examen_titre} />
      ))}
```

Faire de même en haut du tableau de bord (`src/app/(app)/page.tsx`), pour un élève seulement (`profil?.role === 'eleve'`), en lisant `plansAReorganiser()` dans le `Promise.all` existant.

`src/components/calendrier/FormulaireRevisionGenerale.tsx` :

```tsx
'use client';

import { useActionState } from 'react';
import { lancerRevisionGenerale, type EtatSimple } from '@/app/(app)/calendrier/actions';

export function FormulaireRevisionGenerale({ evenementId }: { evenementId: string }) {
  const [etat, envoyer, enCours] = useActionState<EtatSimple, FormData>(lancerRevisionGenerale, {});
  return (
    <form action={envoyer}>
      <input type="hidden" name="evenement" value={evenementId} />
      <button type="submit" className="bouton bouton-principal" disabled={enCours}>
        {enCours ? 'Préparation…' : 'Lancer la révision générale'}
      </button>
      {etat.erreur && <p role="alert" className="message-erreur">{etat.erreur}</p>}
    </form>
  );
}
```

Dans `src/app/(app)/calendrier/[id]/page.tsx`, importer `FormulaireRevisionGenerale`, puis ajouter juste après le `<h1>` :

```tsx
      {e.revision_generale && (
        <section aria-labelledby="titre-generale">
          <h2 id="titre-generale">Révision générale</h2>
          <p>Un quiz de 30 questions au plus sur tous les chapitres de ton examen.</p>
          <FormulaireRevisionGenerale evenementId={e.id} />
        </section>
      )}
      {e.type === 'examen_reel' && e.cours_id && (
        <p><Link className="bouton bouton-secondaire" href={`/calendrier/${e.id}/planning`}>Planning de révision</Link></p>
      )}
```

- [ ] **Step 4 : partage iCal**

`src/components/calendrier/GestionLienIcal.tsx` :

```tsx
'use client';

import { useActionState, useState } from 'react';
import { creerLienIcal, revoquerLienIcal, type EtatLien } from '@/app/(app)/calendrier/actions';

const formatDate = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Paris' });

export function GestionLienIcal({ actifDepuis }: { actifDepuis: string | null }) {
  const [creation, creer, enCreation] = useActionState<EtatLien, FormData>(creerLienIcal, {});
  const [revocation, revoquer, enRevocation] = useActionState<EtatLien, FormData>(revoquerLienIcal, {});
  const [copie, setCopie] = useState('');
  // actifDepuis vient du serveur (revalidé après chaque action) : après une révocation, le lien affiché disparaît.
  const lien = actifDepuis ? creation.lien : undefined;
  const copier = async (valeur: string) => {
    try {
      await navigator.clipboard.writeText(valeur);
      setCopie('Lien copié.');
    } catch {
      setCopie('Copie impossible : sélectionne le lien et copie-le.');
    }
  };
  return (
    <div className="gestion-ical">
      {lien ? (
        <div className="carte">
          <label>
            Ton lien privé
            <input readOnly value={lien} onFocus={(e) => e.currentTarget.select()} />
          </label>
          <div className="actions-banniere">
            <button type="button" className="bouton bouton-principal" onClick={() => copier(lien)}>Copier le lien</button>
            <a className="bouton bouton-secondaire" href={lien.replace(/^https?:/, 'webcal:')}>Ouvrir dans mon agenda</a>
          </div>
          <p className="aide-champ">Note-le maintenant : pour ta sécurité, il ne sera plus affiché. Tu pourras toujours en créer un nouveau.</p>
        </div>
      ) : actifDepuis ? (
        <p>Un lien est actif depuis le {formatDate.format(new Date(actifDepuis))}. Pour le revoir, crée un nouveau lien : l’ancien cessera de fonctionner.</p>
      ) : (
        <p>Aucun lien actif.</p>
      )}
      <p role="status">{copie}</p>
      <div className="actions-banniere">
        <form action={creer}>
          <button type="submit" className="bouton bouton-principal" disabled={enCreation}>{actifDepuis ? 'Créer un nouveau lien' : 'Créer mon lien'}</button>
        </form>
        {actifDepuis && (
          <form action={revoquer} onSubmit={(e) => { if (!window.confirm('Révoquer le lien ? Les agendas abonnés ne recevront plus tes événements.')) e.preventDefault(); }}>
            <button type="submit" className="bouton bouton-secondaire" disabled={enRevocation}>Révoquer le lien</button>
          </form>
        )}
      </div>
      {(creation.erreur ?? revocation.erreur) && <p role="alert" className="message-erreur">{creation.erreur ?? revocation.erreur}</p>}
    </div>
  );
}
```

`src/app/(app)/calendrier/partage/page.tsx` :

```tsx
import Link from 'next/link';
import { exigerEleve } from '@/lib/calendrier/garde';
import { dateLienIcal } from '@/lib/calendrier/requetes';
import { GestionLienIcal } from '@/components/calendrier/GestionLienIcal';

export const metadata = { title: 'Partager mon calendrier' };

export default async function PagePartage() {
  await exigerEleve();
  const actifDepuis = await dateLienIcal();
  return (
    <div className="page-partage">
      <p><Link href="/calendrier">← Mon calendrier</Link></p>
      <h1>Ajouter mon calendrier à un autre agenda</h1>
      <p>Avec ce lien privé, Google Agenda, le Calendrier d’Apple ou Outlook affichent tes révisions, tes devoirs, tes examens et les échéances de tes classes. Ils se mettent à jour seuls, en général en quelques heures.</p>
      <p className="message-info">Ce lien donne accès à ton calendrier sans mot de passe : ne le partage pas. Tu peux le révoquer à tout moment.</p>
      <GestionLienIcal actifDepuis={actifDepuis} />
      <h2>Comment l’ajouter</h2>
      <ul className="regles">
        <li>Google Agenda, sur ordinateur : « Autres agendas », « + », puis « À partir de l’URL ». Colle le lien.</li>
        <li>iPhone : Réglages, Calendrier, Comptes, Ajouter un compte, Autre, puis « Ajouter un calendrier avec abonnement ».</li>
        <li>Outlook : « Ajouter un calendrier », puis « S’abonner à partir du web ».</li>
      </ul>
    </div>
  );
}
```

- [ ] **Step 5 : vérifier et commiter**

Run : `npm test && npm run typecheck && npm run lint && npm run build`
Expected : PASS. En local, créer un examen réel, demander l'aperçu, accepter, puis valider le chapitre d'une session à venir (en réussissant son quiz) : la bannière doit apparaître.

```bash
git add src/components/calendrier src/app/\(app\)/calendrier "src/app/(app)/page.tsx"
git commit -m "Ajoute le planning de révision, la révision générale et le partage iCal

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 10 : PWA installable et lecture hors connexion

**Files :**
- Create : `src/app/manifest.ts`, `src/app/icones/[fichier]/route.tsx`, `src/app/apple-icon.tsx`, `src/lib/pwa/icone.tsx`
- Create : `public/sw.js`, `src/lib/pwa/cache.ts`
- Create : `src/components/EnregistrementSW.tsx`, `src/components/IndicateurConnexion.tsx`, `src/components/BoutonDeconnexion.tsx`, `src/components/ViderCachePages.tsx`
- Create : `src/app/hors-ligne/page.tsx`
- Create : `e2e/hors-ligne.spec.ts`
- Modify : `src/app/layout.tsx`, `src/app/(app)/layout.tsx`, `src/components/EnTete.tsx`, `src/app/(auth)/connexion/page.tsx`, `src/proxy.ts`, `src/lib/routes.ts`, `src/lib/routes.test.ts`, `next.config.ts`

**Interfaces :**
- Produces : `/manifest.webmanifest`, `/icones/192.png`, `/icones/512.png`, `/icones/maskable-512.png`, `/apple-icon.png`, `/sw.js`, `/hors-ligne` ; `viderCachePages(): Promise<void>`.

Consulter avec context7 le guide PWA de Next.js 16 (`manifest.ts`, en-têtes de `sw.js`), `ImageResponse` (`next/og`) et la spécification Service Worker (`clients.claim`, `Cache.put`).

- [ ] **Step 1 : routes publiques et proxy (test d'abord)**

Dans `src/lib/routes.test.ts`, test « laisse un visiteur non connecté sur les pages publiques » :

```ts
    expect(redirectionPour('/hors-ligne', false)).toBeNull();
```

Run : `npx vitest run src/lib/routes.test.ts` → FAIL.

`src/lib/routes.ts` :

```ts
export const ROUTES_PUBLIQUES = ['/connexion', '/inscription', '/auth/callback', '/auth/confirm', '/ical', '/hors-ligne'];
```

Run : `npx vitest run src/lib/routes.test.ts` → PASS.

`src/proxy.ts`, matcher (bilan de l'étape 1) :

```ts
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|sw\\.js|manifest\\.webmanifest|robots\\.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)'],
};
```

- [ ] **Step 2 : manifeste et icônes**

`src/lib/pwa/icone.tsx` :

```tsx
/** Icône de l'application : un « L » blanc sur fond indigo, avec une pastille ambre. marge : zone de sécurité des icônes « maskable ». */
export function Icone({ taille, marge = 0 }: { taille: number; marge?: number }) {
  const lettre = Math.round(taille * (1 - 2 * marge) * 0.62);
  const decalage = taille * (0.18 + marge);
  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
      background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', color: '#ffffff', fontSize: lettre, fontWeight: 700,
    }}>
      L
      <div style={{ position: 'absolute', top: decalage, right: decalage, width: taille * 0.14, height: taille * 0.14, borderRadius: '50%', background: '#f59e0b' }} />
    </div>
  );
}
```

`src/app/icones/[fichier]/route.tsx` :

```tsx
import { ImageResponse } from 'next/og';
import { Icone } from '@/lib/pwa/icone';

const ICONES: Record<string, { taille: number; marge: number }> = {
  '192.png': { taille: 192, marge: 0 },
  '512.png': { taille: 512, marge: 0 },
  'maskable-512.png': { taille: 512, marge: 0.1 },
};

export const dynamic = 'force-static';
export function generateStaticParams() {
  return Object.keys(ICONES).map((fichier) => ({ fichier }));
}

export async function GET(_requete: Request, { params }: { params: Promise<{ fichier: string }> }) {
  const icone = ICONES[(await params).fichier];
  if (!icone) return new Response('Introuvable.', { status: 404 });
  return new ImageResponse(<Icone taille={icone.taille} marge={icone.marge} />, { width: icone.taille, height: icone.taille });
}
```

`src/app/apple-icon.tsx` :

```tsx
import { ImageResponse } from 'next/og';
import { Icone } from '@/lib/pwa/icone';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(<Icone taille={180} />, size);
}
```

`src/app/manifest.ts` :

```ts
import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'App lycée',
    short_name: 'App lycée',
    description: 'Cours détaillés, quiz et évaluations pour réussir au lycée.',
    lang: 'fr',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#f7f5ff',
    theme_color: '#4f46e5',
    icons: [
      { src: '/icones/192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icones/512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icones/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
```

`src/app/layout.tsx` : ajouter à `metadata` `applicationName: 'App lycée'` et `appleWebApp: { capable: true, title: 'App lycée', statusBarStyle: 'default' }`, exporter `export const viewport: Viewport = { themeColor: '#4f46e5' };` (import `type Viewport` depuis `next`), et rendre `<EnregistrementSW />` dans `<body>`, après `{children}`.

- [ ] **Step 3 : service worker**

Créer `public/sw.js` :

```js
// Service worker : lecture hors connexion des chapitres déjà ouverts.
// Changer VERSION à chaque modification de ce fichier : les caches des autres versions sont supprimés à l'activation.
const VERSION = 'v1';
const CACHE_STATIQUE = `statique-${VERSION}`;
// Préfixe « pages- » : vidé par l'application à la déconnexion (src/lib/pwa/cache.ts).
const CACHE_PAGES = `pages-${VERSION}`;
const HORS_LIGNE = '/hors-ligne';
const MAX_PAGES = 30;
const MAX_STATIQUES = 300;
// Pages de chapitre : /cours/<cours>/<chapitre>, sauf la page d'évaluation.
const CHAPITRE = /^\/cours\/[^/]+\/(?!evaluation$)[^/]+$/;

self.addEventListener('install', (evenement) => {
  evenement.waitUntil((async () => {
    const cache = await caches.open(CACHE_STATIQUE);
    await cache.add(new Request(HORS_LIGNE, { cache: 'reload' }));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (evenement) => {
  evenement.waitUntil((async () => {
    const cles = await caches.keys();
    await Promise.all(cles.filter((c) => !c.endsWith(`-${VERSION}`)).map((c) => caches.delete(c)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (evenement) => {
  const requete = evenement.request;
  if (requete.method !== 'GET') return;
  const url = new URL(requete.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith('/_next/static/')) {
    evenement.respondWith(cacheDAbord(requete));
  } else if (requete.mode === 'navigate') {
    evenement.respondWith(CHAPITRE.test(url.pathname) ? reseauDAbord(requete, url) : reseauOuHorsLigne(requete));
  }
  // Le reste (données RSC, actions serveur, iCal) passe par le réseau, sans cache.
});

// Fichiers de build : leur nom change à chaque version, ils ne changent jamais de contenu.
async function cacheDAbord(requete) {
  const cache = await caches.open(CACHE_STATIQUE);
  const enCache = await cache.match(requete);
  if (enCache) return enCache;
  const reponse = await fetch(requete);
  if (reponse.ok) {
    await cache.put(requete, reponse.clone());
    await limiter(cache, MAX_STATIQUES);
  }
  return reponse;
}

async function reseauDAbord(requete, url) {
  const cle = url.origin + url.pathname;
  const cache = await caches.open(CACHE_PAGES);
  try {
    const reponse = await fetch(requete);
    // Seulement une vraie page de chapitre : pas une redirection vers la connexion, pas une erreur.
    if (reponse.ok && !reponse.redirected) {
      await cache.put(cle, reponse.clone());
      await limiter(cache, MAX_PAGES);
    }
    return reponse;
  } catch {
    return (await cache.match(cle)) ?? (await caches.match(HORS_LIGNE)) ?? Response.error();
  }
}

async function reseauOuHorsLigne(requete) {
  try {
    return await fetch(requete);
  } catch {
    return (await caches.match(HORS_LIGNE)) ?? Response.error();
  }
}

// Les clés sont rendues dans l'ordre d'insertion (une clé réécrite passe à la fin) : on retire les plus anciennes.
async function limiter(cache, max) {
  const cles = await cache.keys();
  await Promise.all(cles.slice(0, Math.max(0, cles.length - max)).map((c) => cache.delete(c)));
}
```

`next.config.ts`, ajouter à `nextConfig` :

```ts
  async headers() {
    return [
      {
        source: '/sw.js',
        headers: [
          { key: 'Content-Type', value: 'application/javascript; charset=utf-8' },
          { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
          { key: 'Content-Security-Policy', value: "default-src 'self'; script-src 'self'" },
        ],
      },
    ];
  },
```

- [ ] **Step 4 : composants côté client et page hors connexion**

`src/lib/pwa/cache.ts` :

```ts
/** Préfixe du cache des pages de chapitre : doit correspondre à CACHE_PAGES dans public/sw.js. */
export const PREFIXE_CACHE_PAGES = 'pages-';

/** Vide les pages de chapitre mises en cache : sur un appareil partagé, rien ne reste après la déconnexion. */
export async function viderCachePages(): Promise<void> {
  if (typeof caches === 'undefined') return;
  try {
    const cles = await caches.keys();
    await Promise.all(cles.filter((c) => c.startsWith(PREFIXE_CACHE_PAGES)).map((c) => caches.delete(c)));
  } catch {
    // Cache API indisponible (navigation privée, stockage bloqué) : rien à vider.
  }
}
```

`src/components/EnregistrementSW.tsx` :

```tsx
'use client';

import { useEffect } from 'react';

/** Enregistre le service worker, en production seulement : en développement, il gênerait le rechargement à chaud. */
export function EnregistrementSW() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production' || !('serviceWorker' in navigator)) return;
    navigator.serviceWorker.register('/sw.js', { scope: '/', updateViaCache: 'none' }).catch(() => {
      // Sans service worker, l'application marche normalement, sans lecture hors connexion.
    });
  }, []);
  return null;
}
```

`src/components/IndicateurConnexion.tsx` :

```tsx
'use client';

import { useSyncExternalStore } from 'react';

function abonner(rappel: () => void) {
  window.addEventListener('online', rappel);
  window.addEventListener('offline', rappel);
  return () => {
    window.removeEventListener('online', rappel);
    window.removeEventListener('offline', rappel);
  };
}

/** Région de statut toujours présente (pour que le changement soit annoncé), visible seulement hors connexion. */
export function IndicateurConnexion() {
  const enLigne = useSyncExternalStore(abonner, () => navigator.onLine, () => true);
  return (
    <div role="status" className={enLigne ? 'sr-only' : 'bandeau-hors-ligne'}>
      {enLigne ? '' : 'Tu es hors connexion. Les chapitres déjà ouverts restent lisibles, les quiz et les évaluations demandent une connexion.'}
    </div>
  );
}
```

`src/components/ViderCachePages.tsx` :

```tsx
'use client';

import { useEffect } from 'react';
import { viderCachePages } from '@/lib/pwa/cache';

/** Sur la page de connexion : aucune page de chapitre d'un compte précédent ne doit rester en cache. */
export function ViderCachePages() {
  useEffect(() => { void viderCachePages(); }, []);
  return null;
}
```

`src/components/BoutonDeconnexion.tsx` (remplace le formulaire de déconnexion de `EnTete`, avec le même balisage) :

```tsx
'use client';

import { deconnecter } from '@/app/(auth)/actions';
import { viderCachePages } from '@/lib/pwa/cache';

export function BoutonDeconnexion({ prenom }: { prenom: string | null }) {
  // L'action reste celle du serveur (elle marche sans JavaScript) ; le cache est vidé juste avant, quand c'est possible.
  return (
    <form action={deconnecter} onSubmit={() => { void viderCachePages(); }}>
      <button type="submit" className="bouton bouton-secondaire bouton-compte">
        <span className="nom-compte">{prenom ?? 'Mon compte'}</span>
        <span aria-hidden="true">·</span>
        <span>Se déconnecter</span>
      </button>
    </form>
  );
}
```

- `src/components/EnTete.tsx` : remplacer le `<form action={deconnecter}>…</form>` par `<BoutonDeconnexion prenom={prenom} />` et retirer l'import de `deconnecter`.
- `src/app/(auth)/connexion/page.tsx` : rendre `<ViderCachePages />` dans `<main>`.
- `src/app/(app)/layout.tsx` : rendre `<IndicateurConnexion />` juste après `<EnTete … />`, dans les deux branches.

`src/app/hors-ligne/page.tsx` :

```tsx
export const metadata = { title: 'Hors connexion' };
export const dynamic = 'force-static';

export default function PageHorsLigne() {
  return (
    <main className="page-auth">
      <h1>Tu es hors connexion</h1>
      <p>Cette page n’a pas encore été ouverte sur cet appareil : elle n’est pas disponible sans réseau.</p>
      <p>Les chapitres que tu as déjà ouverts restent lisibles. Les quiz et les évaluations demandent une connexion.</p>
      {/* Lien classique (pas de navigation côté client) : il recharge vraiment la page. */}
      <p><a href="/" className="bouton bouton-principal">Réessayer</a></p>
    </main>
  );
}
```

ESLint (`@next/next/no-html-link-for-pages`) peut refuser ce `<a>` : dans ce cas, garder `<a>` avec un commentaire `eslint-disable-next-line` justifié (une navigation côté client échouerait hors connexion).

- [ ] **Step 5 : test de bout en bout**

Créer `e2e/hors-ligne.spec.ts` :

```ts
import { expect, test } from '@playwright/test';
import { emailDeTest, inscrireEleve } from './aide-parcours';

const TITRE_CH1 = "Organisation générale de l'organisme humain";

test('le manifeste et les icônes sont publics', async ({ request }) => {
  const reponse = await request.get('/manifest.webmanifest');
  expect(reponse.ok()).toBe(true);
  const manifeste = await reponse.json();
  expect(manifeste).toMatchObject({ name: 'App lycée', display: 'standalone', start_url: '/' });
  for (const icone of manifeste.icons as { src: string }[]) {
    const image = await request.get(icone.src);
    expect(image.headers()['content-type']).toBe('image/png');
  }
});

test('un chapitre déjà ouvert reste lisible hors connexion', async ({ page, context }) => {
  await inscrireEleve(page, emailDeTest('hors-ligne'));
  await page.goto('/cours/bph-1re-st2s/ch1');
  // Au premier chargement, le service worker s'installe ; on recharge pour que la page passe par lui et soit mise en cache.
  await page.evaluate(async () => { await navigator.serviceWorker.ready; });
  await page.reload();
  await expect(page.getByRole('heading', { level: 1, name: TITRE_CH1 })).toBeVisible();

  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('heading', { level: 1, name: TITRE_CH1 })).toBeVisible();
  await expect(page.getByRole('status').filter({ hasText: 'Tu es hors connexion' })).toBeVisible();
  await page.goto('/cours/bph-1re-st2s/ch2');
  await expect(page.getByRole('heading', { level: 1, name: 'Tu es hors connexion' })).toBeVisible();
  await context.setOffline(false);
});

test('la déconnexion vide les pages mises en cache', async ({ page }) => {
  await inscrireEleve(page, emailDeTest('cache'));
  await page.goto('/cours/bph-1re-st2s/ch1');
  await page.evaluate(async () => { await navigator.serviceWorker.ready; });
  await page.reload();
  const pagesEnCache = () => page.evaluate(async () => {
    const noms = (await caches.keys()).filter((c) => c.startsWith('pages-'));
    const tailles = await Promise.all(noms.map(async (n) => (await (await caches.open(n)).keys()).length));
    return tailles.reduce((a, b) => a + b, 0);
  });
  await expect.poll(pagesEnCache).toBeGreaterThan(0);
  await page.getByRole('button', { name: /Se déconnecter/ }).click();
  await expect(page).toHaveURL(/\/connexion$/);
  await expect.poll(pagesEnCache).toBe(0);
});
```

Si `context.setOffline` ne coupe pas le réseau du service worker avec la version de Playwright du projet, chercher la bonne méthode avec context7 (Playwright, « service workers », « offline »). Ne pas désactiver le test sans le signaler dans le rapport.

- [ ] **Step 6 : vérifier et commiter**

Run : `npm test && npm run typecheck && npm run lint && npx playwright test e2e/hors-ligne.spec.ts`
Expected : PASS sur les deux projets (mobile et ordinateur).

Vérifier aussi à la main, sur le build de production (`npm run build && npm run start`) : dans les outils de développement, onglet « Application », le manifeste est valide, l'application est installable et le service worker est actif.

```bash
git add public/sw.js src/app/manifest.ts src/app/icones src/app/apple-icon.tsx src/app/hors-ligne src/lib/pwa src/components/EnregistrementSW.tsx src/components/IndicateurConnexion.tsx src/components/BoutonDeconnexion.tsx src/components/ViderCachePages.tsx src/components/EnTete.tsx src/app/layout.tsx "src/app/(app)/layout.tsx" "src/app/(auth)/connexion/page.tsx" src/proxy.ts src/lib/routes.ts src/lib/routes.test.ts next.config.ts e2e/hors-ligne.spec.ts
git commit -m "Rend l'application installable et garde les chapitres ouverts lisibles hors connexion

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 11 : parcours de bout en bout, bilan et revue finale

**Files :**
- Create : `e2e/calendrier.spec.ts`
- Create : `docs/superpowers/plans/2026-12-01-etape-4a-bilan.md`
- Modify : `docs/superpowers/plans/2026-11-03-feuille-de-route.md`, `README.md`

- [ ] **Step 1 : parcours du calendrier**

Créer `e2e/calendrier.spec.ts` :

```ts
import { expect, test } from '@playwright/test';
import { emailDeTest, inscrireEleve } from './aide-parcours';

/** Jour de Paris (AAAA-MM-JJ) dans n jours. */
function jourDans(n: number) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Paris' }).format(new Date(Date.now() + n * 86_400_000));
}

test('un élève crée un examen, accepte son planning, révise et s’abonne à son calendrier', async ({ page, request }) => {
  await inscrireEleve(page, emailDeTest('calendrier'));
  await page.getByRole('link', { name: 'Calendrier' }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'Mon calendrier' })).toBeVisible();

  // Examen réel sur deux chapitres de BPH, dans 10 jours.
  await page.getByRole('link', { name: 'Ajouter', exact: true }).click();
  await page.getByLabel('Examen (contrôle, bac blanc…)').check();
  await page.getByLabel('Titre').fill('Contrôle de BPH');
  await page.getByLabel('Date', { exact: true }).fill(jourDans(10));
  await page.getByLabel('Heure', { exact: true }).fill('09:00');
  await page.getByLabel('Cours').selectOption({ index: 1 });
  await page.getByLabel(/^Ch\. 1 ·/).check();
  await page.getByLabel(/^Ch\. 2 ·/).check();
  await page.getByRole('button', { name: 'Ajouter au calendrier' }).click();
  await expect(page).toHaveURL(/\/calendrier\/[0-9a-f-]{36}\/planning$/);
  const pageExamen = page.url().replace(/\/planning$/, '');

  // Planning : tous les jours, pour avoir des créneaux quel que soit le jour du test.
  for (const jour of ['Samedi', 'Dimanche']) await page.getByLabel(jour).check();
  await page.getByRole('button', { name: 'Voir le planning proposé' }).click();
  await expect(page.getByRole('heading', { name: 'Planning proposé' })).toBeVisible();
  await page.getByRole('button', { name: 'Accepter ce planning' }).click();
  await expect(page).toHaveURL(/\/calendrier\?vue=semaine&date=\d{4}-\d{2}-\d{2}$/);
  await expect(page.locator('.item-revision').first()).toBeVisible();

  // Accueil : la première session apparaît dans les prochains événements.
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Prochains événements' })).toBeVisible();
  await expect(page.locator('.item-revision').first()).toBeVisible();

  // Révision générale, la veille de l'examen.
  await page.goto(`/calendrier?vue=jour&date=${jourDans(9)}`);
  await page.getByRole('link', { name: /Révision générale/ }).click();
  await page.getByRole('button', { name: 'Lancer la révision générale' }).click();
  await expect(page).toHaveURL(/\/tentative\/[0-9a-f-]{36}$/);
  await expect(page.getByText(/Révision générale ·/)).toBeVisible();

  // Lien iCal : lisible sans session, puis révoqué.
  await page.goto('/calendrier/partage');
  await page.getByRole('button', { name: 'Créer mon lien' }).click();
  const lien = await page.getByLabel('Ton lien privé').inputValue();
  const flux = await request.get(lien);
  expect(flux.status()).toBe(200);
  expect(flux.headers()['content-type']).toContain('text/calendar');
  const texte = await flux.text();
  expect(texte).toContain('BEGIN:VCALENDAR');
  expect(texte).toContain('SUMMARY:Contrôle de BPH');
  page.once('dialog', (d) => d.accept());
  await page.getByRole('button', { name: 'Révoquer le lien' }).click();
  await expect(page.getByText('Aucun lien actif.')).toBeVisible();
  expect((await request.get(lien)).status()).toBe(404);

  // Supprimer l'examen supprime les sessions à venir.
  await page.goto(pageExamen);
  page.once('dialog', (d) => d.accept());
  await page.getByRole('button', { name: /^Supprimer/ }).click();
  await expect(page).toHaveURL(/\/calendrier$/);
  await page.goto(`/calendrier?vue=jour&date=${jourDans(9)}`);
  await expect(page.getByRole('link', { name: /Révision générale/ })).toHaveCount(0);
});
```

La révision générale ouverte par ce test reste `en_cours` : c'est sans effet sur les autres parcours, qui créent chacun leur propre élève.

Run : `npx playwright test e2e/calendrier.spec.ts`
Expected : PASS sur les deux projets.

- [ ] **Step 2 : vérification complète**

Run, dans l'ordre :

```bash
export PATH="$HOME/.orbstack/bin:$PATH"; npm run db:reset
```
```bash
npm test && npm run test:db && npm run typecheck && npm run lint && npm run build
```
```bash
npm run e2e
```

Expected : tout passe. Noter les nombres exacts de tests unitaires, de tests pgTAP (et de fichiers) et de parcours de bout en bout pour le bilan.

- [ ] **Step 3 : README, feuille de route, bilan**

- `README.md` : une section « Calendrier et hors connexion » :
  - le service worker n'est actif qu'en production (`npm run build && npm run start`) ;
  - `NEXT_PUBLIC_SITE_URL` sert aux liens iCal en production.
- `docs/superpowers/plans/2026-11-03-feuille-de-route.md` : la ligne 4a passe à « Terminé (branche etape-4a-calendrier) », avec son bilan.
- Créer `docs/superpowers/plans/2026-12-01-etape-4a-bilan.md`, sur le modèle de `2026-11-24-etape-3b-bilan.md` :
  - état final, avec les nombres de tests ;
  - ce qui a été livré ;
  - failles et défauts trouvés par les revues et corrigés ;
  - décisions prises pendant l'exécution ;
  - points à trancher par l'utilisateur ;
  - points reportés, par étape. Y recopier tous les points « étape 4 » des bilans 1, 2, 3a et 3b qui ne sont pas traités ici, sous « Étape 4b ».

- [ ] **Step 4 : commit**

```bash
git add e2e/calendrier.spec.ts README.md docs/superpowers/plans/2026-11-03-feuille-de-route.md docs/superpowers/plans/2026-12-01-etape-4a-bilan.md
git commit -m "Ajoute le parcours du calendrier et le bilan de l'étape 4a

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

- [ ] **Step 5 : revue finale**

Revue de toute la branche (`etape-3b-contenu..etape-4a-calendrier`) par **Opus**, avec une attention particulière pour :
- RLS et droits sur `evenement`, `evenement_chapitre`, `plan_revision`, `prive.jeton_ical`, et la RPC ouverte à `anon` ;
- les fuseaux et les changements d'heure (SQL et TypeScript) ;
- les pages en cache et la vie privée sur un appareil partagé ;
- la cohérence de `prive.fenetre_evaluation` avec `mes_echeances` ;
- l'accessibilité des vues du calendrier à 375 px.

Ensuite, une seule vague de corrections, une re-revue ciblée, la vérification complète (Step 2), puis la mise à jour du bilan.
