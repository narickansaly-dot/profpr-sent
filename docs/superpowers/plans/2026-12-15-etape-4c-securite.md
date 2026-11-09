# Étape 4c : en-têtes de sécurité, déploiement, accessibilité et dette — plan d'implémentation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal :**
- L'application est prête à être mise en ligne en Europe :
  - une politique de sécurité du contenu (CSP) stricte, avec un nonce par requête, et les en-têtes de sécurité habituels ;
  - les variables d'environnement sont vérifiées au démarrage ;
  - le service worker change de version à chaque déploiement ;
  - la région de Vercel est en UE, et un guide de mise en ligne liste tout ce qui se règle à la main.
- La dette relevée aux étapes 4a et 4b est soldée là où elle touche la sécurité, l'exactitude ou la vie privée.
- Les points d'accessibilité des bilans 1, 2, 3b et 4b sont corrigés, puis une revue d'accessibilité de fin d'étape est faite.

**Architecture :**
- **CSP** : le proxy (`src/proxy.ts`) crée un nonce aléatoire par requête et pose l'en-tête `Content-Security-Policy` sur la requête (Next.js en extrait le nonce pour ses propres scripts) et sur la réponse. La politique est construite par une fonction pure testée, `politiqueContenu`. Les en-têtes qui ne dépendent pas de la requête (`X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `X-Frame-Options`, `Cross-Origin-Opener-Policy`, HSTS en https) sont posés pour toutes les routes par `next.config.ts`.
- **Variables d'environnement** : un schéma zod (`src/lib/env.ts`) vérifié au démarrage du serveur par `src/instrumentation.ts`. Une variable obligatoire absente arrête le démarrage avec un message clair ; un groupe facultatif incomplet (notifications) est signalé.
- **Version du service worker** : `next.config.ts` calcule une version au build (commit Vercel, sinon horodatage). Le composant d'enregistrement charge `/sw.js?v=<version>` ; le service worker lit sa version dans sa propre URL. Une nouvelle version remplace les caches de l'ancienne.
- **Dette** : deux migrations (calendrier et planning ; notifications), quelques corrections TypeScript, et des corrections d'accessibilité dans le CSS et les composants.

**Tech Stack :** Next.js 16 (proxy, `next.config.ts` `headers()` et `env`, `instrumentation.ts`), React 19, TypeScript, zod 4, Supabase (Postgres 17, plpgsql), Service Worker, Vitest, pgTAP, Playwright.

**Spec :** `docs/superpowers/specs/2026-11-03-app-lycee-design.md`. Sections concernées :
- 2 « Choix techniques » (Vercel, Supabase région Europe) ;
- 3 « Sécurité (RLS) » ;
- 9 « RGPD et mineurs » (données en Europe, aucun traceur) ;
- 10 « Gestion des erreurs » ;
- 11 « Tests ».

**Bilans repris :** `2026-11-03-etape-1-bilan.md`, `2026-11-10-etape-2-bilan.md`, `2026-11-24-etape-3b-bilan.md`, `2026-12-01-etape-4a-bilan.md`, `2026-12-08-etape-4b-bilan.md` (section « Étape 4c »). Les points qui ne sont pas traités ici sont recopiés dans le bilan 4c, sous l'étape où ils passent.

**Branche :** `etape-4c-securite`, créée depuis `etape-4b-notifications`. Sa PR vise `etape-4b-notifications` (PR n° 6).

## Décisions prises dans ce plan (à valider avec la relecture)

1. **CSP.**
   - `script-src 'self' 'nonce-<n>' 'strict-dynamic'` (plus `'unsafe-eval'` en développement seulement, pour React).
   - `style-src 'self' 'unsafe-inline'` : les attributs `style` (couleur du cours) et les styles de Next ne portent pas de nonce. Le risque est limité aux styles ; les scripts restent strictement contrôlés.
   - `img-src 'self' data: blob: <Supabase>` (schémas des chapitres) ; `connect-src 'self' <Supabase>` ; `font-src 'self'` (les polices Google sont auto-hébergées par `next/font`) ; `worker-src 'self'` ; `manifest-src 'self'`.
   - `form-action 'self' <Supabase> https://accounts.google.com` : la connexion Google redirige depuis une action serveur, et Chrome applique `form-action` aux redirections.
   - `frame-ancestors 'none'`, `frame-src 'none'`, `object-src 'none'`, `base-uri 'self'`.
   - `upgrade-insecure-requests` et HSTS seulement quand `NEXT_PUBLIC_SITE_URL` est en `https` (le build local de production est servi en `http`).
   - Toutes les pages sont rendues à la demande (le nonce change à chaque requête) ; c'est déjà le cas des pages qui lisent la session.
2. **Variables d'environnement.**
   - Obligatoires : `NEXT_PUBLIC_SUPABASE_URL` (URL), `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
   - Obligatoire en production (`VERCEL_ENV=production`) : `NEXT_PUBLIC_SITE_URL` en `https`.
   - Groupe des notifications : `NEXT_PUBLIC_VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_SUJET` (mailto: ou https:), `ENVOI_SECRET` (32 caractères au moins) — tous ou aucun. Incomplet : avertissement, l'application démarre sans notifications.
   - `SUPABASE_SERVICE_ROLE_KEY` n'est jamais exigée par l'application (scripts seulement).
3. **Version du service worker** : `VERCEL_GIT_COMMIT_SHA` (8 premiers caractères), sinon l'horodatage du build en base 36. Les noms de cache deviennent `statique-<version>`, `pages-<version>`, `hors-ligne-<version>`. Un nouveau déploiement vide donc les chapitres en cache : c'est le prix d'une page hors connexion toujours à jour.
4. **Déploiement** : `vercel.json` fixe la région `cdg1` (Paris). Rien n'est déployé dans cette étape : le guide `docs/mise-en-ligne.md` liste les réglages du projet Vercel et du projet Supabase hébergé, et la commande de configuration de la tâche d'envoi.
5. **Dette de la base** :
   - calendrier : verrou du profil avant le comptage des 500 événements ; titre refusé s'il contient un caractère de contrôle, espaces de bord retirés ; code `type_non_modifiable` quand on change le type ; seuls les chapitres et cours publiés dans `mon_calendrier` ;
   - planning : plus de tolérance d'une heure dans le passé ; `refuser_plan_revision` vérifie l'examen comme `accepter_plan_revision` ;
   - révision générale : départage aléatoire, chapitres du seul cours de l'événement ;
   - notifications : une notification réservée plus de 10 fois passe en `echec` ; une notification devenue sans objet est supprimée au moment de la réservation ; une ligne réservée n'est plus supprimée par un changement de rappel ; `echeance_proche` attend l'ouverture de l'évaluation.
6. **Accessibilité** : contour de focus sans `border-radius` global ; position « Question n sur N » annoncée ; contrastes en mode sombre corrigés ; `aria-invalid` et `aria-describedby` sur les formulaires d'identification et de bienvenue ; décisions répétées réannoncées sur `/admin/enseignants` ; noms distincts des boutons « Retirer ».

## Contraintes globales

- Toute l'interface est **en français**. On tutoie l'élève. Les formulations ne sont pas genrées.
- Typographie française : espace insécable (U+00A0) avant « : ; ! ? » dans tout texte visible. Dans ce plan, les chaînes TypeScript l'écrivent ` ` et le JSX `&nbsp;`.
- **Écritures en base uniquement par RPC `security definer`** ; `set search_path = ''` et noms qualifiés ; `revoke execute … from public, anon` puis `grant execute … to authenticated` (exceptions déjà en place : `calendrier_ical`, `envoi_reserver`, `envoi_terminer` pour `anon` ; `configurer_envoi` pour `service_role`).
- Lors d'un `create or replace` sur une fonction existante, on recopie son **corps actuel** depuis la migration la plus récente qui la définit, avec ses attributs, ses droits et ses commentaires, et on n'ajoute que le changement décrit.
- Les codes d'erreur levés par la base sont des mots-clés `snake_case`, traduits dans `src/lib/erreurs.ts` avec un test du texte exact ; aucun nouveau code n'est sous-chaîne d'un code existant, ni l'inverse.
- Un test pgTAP ne compte que ses propres lignes (la base locale contient des comptes de démo).
- Commandes shell : préfixer par `export PATH="$HOME/.orbstack/bin:$PATH";`. Ne jamais afficher ni commiter `.env.local`. La clé de service n'est utilisée que dans `scripts/` et les aides e2e, derrière la garde « base locale ».
- Après chaque migration : `npm run db:reset`, puis `npx supabase gen types typescript --local > src/lib/supabase/types.ts`.
- Avant d'utiliser une API de Next.js 16 (proxy, CSP et nonce, `instrumentation.ts`, `headers()`, `env`), de `@supabase/ssr` ou du Service Worker, consulter sa documentation à jour avec **context7**.
- Toute modification d'interface suit le système visuel existant et reste utilisable à 375 px.
- Messages de commit en français, à l'impératif présent, terminés par la ligne `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Hors périmètre

- Le déploiement lui-même (création des projets Vercel et Supabase, DNS) : fait par toi, en suivant `docs/mise-en-ligne.md`.
- Frein global par adresse IP sur les codes d'invitation (étape 5, avec la protection des inscriptions).
- Abonnements Stripe, RGPD, pages légales (étape 5) ; contenu (étape 6).
- Points de détail du bilan 4b listés dans « Points reportés » et non repris ici : ils sont recopiés dans le bilan 4c.

## Répartition des modèles

| Tâche | Implémentation | Revue |
|---|---|---|
| 1 Variables d'environnement | Haiku (code complet) | Sonnet |
| 2 CSP et en-têtes de sécurité | Sonnet | **Opus** |
| 3 Service worker versionné | Sonnet | Sonnet |
| 4 Mise en ligne : région, guide | Sonnet | Sonnet |
| 5 Dette de la base : calendrier, planning, révision | Sonnet | **Opus** |
| 6 Dette de la base : notifications | Sonnet | **Opus** |
| 7 Dette TypeScript et interface | Sonnet | Sonnet |
| 8 Accessibilité | Sonnet | Sonnet |
| 9 Bout en bout, revue d'accessibilité, bilan, revue finale | Sonnet, puis revue finale **Opus** | — |

Les tâches 5 et 6 touchent la base locale partagée : elles s'exécutent l'une après l'autre.

## Carte des fichiers

| Fichier | Rôle |
|---|---|
| `src/lib/env.ts` (+ test), `src/instrumentation.ts` | vérification des variables au démarrage |
| `src/lib/securite/csp.ts` (+ test) | `politiqueContenu`, `ENTETES_SECURITE` |
| `src/proxy.ts`, `src/lib/supabase/session.ts` | nonce, CSP, en-têtes de cache de `setAll` |
| `src/app/layout.tsx` | rendu à la demande |
| `next.config.ts` | en-têtes globaux, `NEXT_PUBLIC_VERSION_APP` |
| `public/sw.js`, `src/components/EnregistrementSW.tsx`, `src/lib/pwa/cache.ts` | version du service worker |
| `vercel.json`, `docs/mise-en-ligne.md`, `README.md` | région, guide |
| `supabase/migrations/20261215000001_dette_calendrier.sql`, `supabase/tests/dette_calendrier.test.sql` | dette calendrier, planning, révision |
| `supabase/migrations/20261215000002_dette_notifications.sql`, `supabase/tests/dette_notifications.test.sql` | dette notifications |
| `src/lib/calendrier/garde.ts`, `schema-evenement.ts`, `src/lib/planning/generer.ts`, `reglages.ts`, `src/components/calendrier/*`, `src/app/(app)/notifications/actions.ts`, `src/components/notifications/ListeAppareils.tsx`, `src/lib/erreurs.ts` | dette TypeScript |
| `src/app/globals.css`, `src/styles/quiz.css`, `src/styles/notifications.css`, `src/components/LecteurTentative.tsx`, `src/app/(auth)/FormulaireIdentifiants.tsx`, `src/app/(auth)/actions.ts`, `src/app/bienvenue/*`, `src/app/(app)/admin/enseignants/FormulaireDemande.tsx` | accessibilité |
| `e2e/securite.spec.ts`, `e2e/hors-ligne.spec.ts`, `e2e/notifications.spec.ts` | bout en bout |

---

### Task 1 : variables d'environnement vérifiées au démarrage

**Files :**
- Create : `src/lib/env.ts`, `src/lib/env.test.ts`, `src/instrumentation.ts`

**Interfaces :**
- Produces : `verifierEnvironnement(env: Record<string, string | undefined>): { erreurs: string[]; avertissements: string[] }` ; `src/instrumentation.ts` `register()`.

- [ ] **Step 1 : écrire le test**

`src/lib/env.test.ts` :

```ts
import { describe, expect, it } from 'vitest';
import { verifierEnvironnement } from './env';

const base = { NEXT_PUBLIC_SUPABASE_URL: 'http://127.0.0.1:54321', NEXT_PUBLIC_SUPABASE_ANON_KEY: 'cle-anon' };
const notifications = {
  NEXT_PUBLIC_VAPID_PUBLIC_KEY: 'BPub', VAPID_PRIVATE_KEY: 'priv', VAPID_SUJET: 'mailto:contact@example.com', ENVOI_SECRET: 's'.repeat(43),
};

describe('verifierEnvironnement', () => {
  it('accepte une configuration locale minimale, avec un avertissement pour les notifications absentes', () => {
    expect(verifierEnvironnement(base)).toEqual({
      erreurs: [], avertissements: ['Notifications désactivées : NEXT_PUBLIC_VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_SUJET, ENVOI_SECRET absentes.'],
    });
  });
  it('accepte une configuration complète', () => {
    expect(verifierEnvironnement({ ...base, ...notifications })).toEqual({ erreurs: [], avertissements: [] });
  });
  it('refuse une URL Supabase absente ou invalide', () => {
    expect(verifierEnvironnement({ ...base, NEXT_PUBLIC_SUPABASE_URL: 'pas une url' }).erreurs)
      .toEqual(['NEXT_PUBLIC_SUPABASE_URL doit être une URL http(s).']);
    expect(verifierEnvironnement({ NEXT_PUBLIC_SUPABASE_ANON_KEY: 'x' }).erreurs)
      .toEqual(['NEXT_PUBLIC_SUPABASE_URL doit être une URL http(s).']);
  });
  it('refuse une clé anonyme absente', () => {
    expect(verifierEnvironnement({ NEXT_PUBLIC_SUPABASE_URL: base.NEXT_PUBLIC_SUPABASE_URL }).erreurs)
      .toEqual(['NEXT_PUBLIC_SUPABASE_ANON_KEY est absente.']);
  });
  it('exige une adresse publique en https en production', () => {
    expect(verifierEnvironnement({ ...base, ...notifications, VERCEL_ENV: 'production' }).erreurs)
      .toEqual(['NEXT_PUBLIC_SITE_URL doit être une adresse https en production.']);
    expect(verifierEnvironnement({ ...base, ...notifications, VERCEL_ENV: 'production', NEXT_PUBLIC_SITE_URL: 'https://app.example.fr' }).erreurs)
      .toEqual([]);
  });
  it('signale un groupe de notifications incomplet ou un secret trop court', () => {
    expect(verifierEnvironnement({ ...base, ...notifications, VAPID_PRIVATE_KEY: undefined }).avertissements)
      .toEqual(['Notifications désactivées : VAPID_PRIVATE_KEY absente.']);
    expect(verifierEnvironnement({ ...base, ...notifications, ENVOI_SECRET: 'court' }).avertissements)
      .toEqual(['Notifications désactivées : ENVOI_SECRET doit compter au moins 32 caractères.']);
    expect(verifierEnvironnement({ ...base, ...notifications, VAPID_SUJET: 'contact' }).avertissements)
      .toEqual(['Notifications désactivées : VAPID_SUJET doit commencer par mailto: ou https:.']);
  });
});
```

- [ ] **Step 2 : vérifier l'échec**

Run : `npx vitest run src/lib/env.test.ts`
Expected : FAIL (module absent).

- [ ] **Step 3 : écrire le code**

`src/lib/env.ts` :

```ts
type Env = Record<string, string | undefined>;

const NOTIFICATIONS = ['NEXT_PUBLIC_VAPID_PUBLIC_KEY', 'VAPID_PRIVATE_KEY', 'VAPID_SUJET', 'ENVOI_SECRET'] as const;

function estUrl(valeur: string | undefined, protocoles: string[]): boolean {
  if (!valeur) return false;
  try {
    return protocoles.includes(new URL(valeur).protocol);
  } catch {
    return false;
  }
}

/** Vérifie les variables d'environnement : erreurs bloquantes et avertissements. Fonction pure, testée. */
export function verifierEnvironnement(env: Env): { erreurs: string[]; avertissements: string[] } {
  const erreurs: string[] = [];
  const avertissements: string[] = [];
  if (!estUrl(env.NEXT_PUBLIC_SUPABASE_URL, ['http:', 'https:'])) erreurs.push('NEXT_PUBLIC_SUPABASE_URL doit être une URL http(s).');
  if (!env.NEXT_PUBLIC_SUPABASE_ANON_KEY) erreurs.push('NEXT_PUBLIC_SUPABASE_ANON_KEY est absente.');
  if (env.VERCEL_ENV === 'production' && !estUrl(env.NEXT_PUBLIC_SITE_URL, ['https:'])) {
    erreurs.push('NEXT_PUBLIC_SITE_URL doit être une adresse https en production.');
  }
  const absentes = NOTIFICATIONS.filter((cle) => !env[cle]);
  if (absentes.length === NOTIFICATIONS.length) {
    avertissements.push(`Notifications désactivées : ${absentes.join(', ')} absentes.`);
  } else if (absentes.length > 0) {
    avertissements.push(`Notifications désactivées : ${absentes.join(', ')} ${absentes.length > 1 ? 'absentes' : 'absente'}.`);
  } else if ((env.ENVOI_SECRET ?? '').length < 32) {
    avertissements.push('Notifications désactivées : ENVOI_SECRET doit compter au moins 32 caractères.');
  } else if (!/^(mailto:|https:)/.test(env.VAPID_SUJET ?? '')) {
    avertissements.push('Notifications désactivées : VAPID_SUJET doit commencer par mailto: ou https:.');
  }
  return { erreurs, avertissements };
}
```

`src/instrumentation.ts` (vérifier avec context7 la convention `register` de Next.js 16) :

```ts
import { verifierEnvironnement } from '@/lib/env';

/** Appelée une fois au démarrage du serveur : une configuration incomplète arrête le démarrage. */
export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return;
  const { erreurs, avertissements } = verifierEnvironnement(process.env);
  for (const a of avertissements) console.warn(`[configuration] ${a}`);
  if (erreurs.length > 0) {
    throw new Error(`Configuration invalide :\n- ${erreurs.join('\n- ')}`);
  }
}
```

- [ ] **Step 4 : vérifier**

Run : `npx vitest run src/lib/env.test.ts && npm run typecheck && npm run lint && npm run build`
Expected : PASS ; le build passe (le `.env.local` local est complet).

- [ ] **Step 5 : commit**

```bash
git add src/lib/env.ts src/lib/env.test.ts src/instrumentation.ts
git commit -m "Vérifie les variables d'environnement au démarrage

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 2 : CSP avec nonce et en-têtes de sécurité

**Files :**
- Create : `src/lib/securite/csp.ts`, `src/lib/securite/csp.test.ts`, `e2e/securite.spec.ts`
- Modify : `src/proxy.ts`, `src/lib/supabase/session.ts`, `src/app/layout.tsx`, `next.config.ts`

**Interfaces :**
- Produces :
  - `politiqueContenu(o: { nonce: string; supabaseUrl: string; developpement: boolean; https: boolean }): string` ;
  - `ENTETES_SECURITE: { key: string; value: string }[]` (en-têtes sans nonce) ;
  - `rafraichirSession(request: NextRequest, enTetesRequete?: Record<string, string>)` (signature étendue, comportement inchangé sans second argument).

- [ ] **Step 1 : consulter la documentation**

Avec context7, lire pour Next.js 16 : « Content Security Policy » (nonce par le proxy, en-tête `x-nonce`, rendu dynamique obligatoire), `NextResponse.next({ request: { headers } })`, `headers()` dans `next.config`. Pour `@supabase/ssr` : la signature de `setAll` (second argument d'en-têtes de cache, s'il existe dans la version installée `^0.12`).

- [ ] **Step 2 : écrire le test de la politique**

`src/lib/securite/csp.test.ts` :

```ts
import { describe, expect, it } from 'vitest';
import { ENTETES_SECURITE, politiqueContenu } from './csp';

const directives = (csp: string) => Object.fromEntries(csp.split('; ').map((d) => { const [nom, ...v] = d.split(' '); return [nom, v]; }));

describe('politiqueContenu', () => {
  const prod = directives(politiqueContenu({ nonce: 'abc', supabaseUrl: 'https://xyz.supabase.co', developpement: false, https: true }));
  it('limite les scripts au nonce', () => {
    expect(prod['script-src']).toEqual(["'self'", "'nonce-abc'", "'strict-dynamic'"]);
  });
  it('autorise Supabase pour les images, les connexions et les formulaires', () => {
    expect(prod['img-src']).toEqual(["'self'", 'data:', 'blob:', 'https://xyz.supabase.co']);
    expect(prod['connect-src']).toEqual(["'self'", 'https://xyz.supabase.co']);
    expect(prod['form-action']).toEqual(["'self'", 'https://xyz.supabase.co', 'https://accounts.google.com']);
  });
  it('interdit l’intégration dans un cadre et les objets', () => {
    expect(prod['frame-ancestors']).toEqual(["'none'"]);
    expect(prod['frame-src']).toEqual(["'none'"]);
    expect(prod['object-src']).toEqual(["'none'"]);
    expect(prod['base-uri']).toEqual(["'self'"]);
  });
  it('force https en production seulement', () => {
    expect(prod['upgrade-insecure-requests']).toEqual([]);
    const local = directives(politiqueContenu({ nonce: 'abc', supabaseUrl: 'http://127.0.0.1:54321', developpement: false, https: false }));
    expect(local['upgrade-insecure-requests']).toBeUndefined();
    expect(local['connect-src']).toEqual(["'self'", 'http://127.0.0.1:54321']);
  });
  it('ajoute unsafe-eval et le websocket en développement', () => {
    const dev = directives(politiqueContenu({ nonce: 'abc', supabaseUrl: 'http://127.0.0.1:54321', developpement: true, https: false }));
    expect(dev['script-src']).toContain("'unsafe-eval'");
    expect(dev['connect-src']).toContain('ws:');
  });
  it('n’accepte qu’une origine pour Supabase (pas de chemin ni de chaîne de requête)', () => {
    const p = directives(politiqueContenu({ nonce: 'n', supabaseUrl: 'https://xyz.supabase.co/rest/v1?x=1', developpement: false, https: true }));
    expect(p['img-src']).toContain('https://xyz.supabase.co');
  });
});

describe('ENTETES_SECURITE', () => {
  it('contient les en-têtes attendus', () => {
    expect(Object.fromEntries(ENTETES_SECURITE.map((e) => [e.key, e.value]))).toEqual({
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'X-Frame-Options': 'DENY',
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()',
    });
  });
});
```

Run : `npx vitest run src/lib/securite/csp.test.ts`
Expected : FAIL (module absent).

- [ ] **Step 3 : écrire la politique**

`src/lib/securite/csp.ts` :

```ts
/** En-têtes de sécurité qui ne dépendent pas de la requête (posés par next.config.ts sur toutes les routes). */
export const ENTETES_SECURITE: { key: string; value: string }[] = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()' },
];

/** Politique de sécurité du contenu d'une page, avec le nonce de la requête. */
export function politiqueContenu(o: { nonce: string; supabaseUrl: string; developpement: boolean; https: boolean }): string {
  const supabase = new URL(o.supabaseUrl).origin;
  const directives: [string, string[]][] = [
    ['default-src', ["'self'"]],
    ['script-src', ["'self'", `'nonce-${o.nonce}'`, "'strict-dynamic'", ...(o.developpement ? ["'unsafe-eval'"] : [])]],
    // Les attributs style (couleur du cours) n'acceptent pas de nonce : styles en ligne permis, scripts non.
    ['style-src', ["'self'", "'unsafe-inline'"]],
    ['img-src', ["'self'", 'data:', 'blob:', supabase]],
    ['font-src', ["'self'"]],
    ['connect-src', ["'self'", supabase, ...(o.developpement ? ['ws:'] : [])]],
    ['worker-src', ["'self'"]],
    ['manifest-src', ["'self'"]],
    ['frame-src', ["'none'"]],
    ['object-src', ["'none'"]],
    ['base-uri', ["'self'"]],
    // Connexion Google : l'action serveur redirige vers Supabase puis Google (Chrome applique form-action aux redirections).
    ['form-action', ["'self'", supabase, 'https://accounts.google.com']],
    ['frame-ancestors', ["'none'"]],
    ...(o.https ? [['upgrade-insecure-requests', []] as [string, string[]]] : []),
  ];
  return directives.map(([nom, valeurs]) => [nom, ...valeurs].join(' ')).join('; ');
}
```

Run : `npx vitest run src/lib/securite/csp.test.ts`
Expected : PASS (7 tests).

- [ ] **Step 4 : brancher le proxy, la session et la mise en page**

`src/lib/supabase/session.ts` :

```ts
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import type { Database } from './types';

/**
 * Rafraîchit les cookies de session et renvoie l'utilisateur connecté (ou null).
 * `enTetesRequete` (nonce, CSP) est ajouté à la requête transmise aux pages, à chaque reconstruction.
 */
export async function rafraichirSession(request: NextRequest, enTetesRequete: Record<string, string> = {}) {
  const suivante = () => {
    const enTetes = new Headers(request.headers);
    for (const [cle, valeur] of Object.entries(enTetesRequete)) enTetes.set(cle, valeur);
    return NextResponse.next({ request: { headers: enTetes } });
  };
  let response = suivante();
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll(liste, enTetesCache) {
          liste.forEach(({ name, value }) => request.cookies.set(name, value));
          response = suivante();
          liste.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
          // Empêche la mise en cache d'une réponse qui pose un cookie de session (si la version de @supabase/ssr les fournit).
          Object.entries(enTetesCache ?? {}).forEach(([cle, valeur]) => response.headers.set(cle, valeur));
        },
      },
    },
  );
  const { data: { user } } = await supabase.auth.getUser();
  return { response, user };
}
```

Si la version installée de `@supabase/ssr` ne passe pas de second argument à `setAll`, retirer `enTetesCache` et sa ligne, et le signaler dans le rapport.

`src/proxy.ts` :

```ts
import { NextResponse, type NextRequest } from 'next/server';
import { rafraichirSession } from '@/lib/supabase/session';
import { cheminSuiteSur, redirectionPour } from '@/lib/routes';
import { politiqueContenu } from '@/lib/securite/csp';

export async function proxy(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  const csp = politiqueContenu({
    nonce,
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    developpement: process.env.NODE_ENV === 'development',
    https: (process.env.NEXT_PUBLIC_SITE_URL ?? '').startsWith('https://'),
  });
  // Next.js lit le nonce dans l'en-tête CSP de la requête pour ses propres scripts.
  const { response, user } = await rafraichirSession(request, { 'x-nonce': nonce, 'Content-Security-Policy': csp });
  const cible = redirectionPour(request.nextUrl.pathname, user !== null);
  if (!cible) {
    response.headers.set('Content-Security-Policy', csp);
    return response;
  }
  const url = request.nextUrl.clone();
  const suite = cible.suite ? cheminSuiteSur(request.nextUrl.pathname + request.nextUrl.search) : null;
  url.pathname = cible.pathname;
  url.search = suite ? '?suite=' + encodeURIComponent(suite) : '';
  const redirection = NextResponse.redirect(url);
  response.cookies.getAll().forEach((c) => redirection.cookies.set(c));
  return redirection;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|sw\\.js$|manifest\\.webmanifest$|robots\\.txt$|apple-icon$|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?)$).*)'],
};
```

(Le matcher garde ses exclusions actuelles et ajoute `woff`/`woff2` : les polices n'ont pas besoin de la session — point « polices » du bilan 1.)

`src/app/layout.tsx` : rendre toutes les pages à la demande, pour que chaque réponse porte le nonce de sa requête. Selon la documentation consultée à l'étape 1, au début de `RootLayout` : `await connection();` (import `connection` depuis `next/server`) — la fonction devient `async`. Vérifier ensuite dans la sortie de `npm run build` qu'aucune page n'est marquée statique (○), hors routes de fichiers (manifeste, icônes).

`next.config.ts`, dans `headers()`, avant l'entrée `/sw.js` :

```ts
      {
        source: '/(.*)',
        headers: [
          ...ENTETES_SECURITE,
          ...((process.env.NEXT_PUBLIC_SITE_URL ?? '').startsWith('https://')
            ? [{ key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' }] : []),
        ],
      },
```

(import `ENTETES_SECURITE` depuis `./src/lib/securite/csp` ; l'entrée `/sw.js` garde sa propre CSP.)

- [ ] **Step 5 : parcours de bout en bout**

`e2e/securite.spec.ts` :

```ts
import { expect, test, type Page } from '@playwright/test';
import { emailDeTest, inscrireEleve } from './aide-parcours';

/** Relève les violations de CSP signalées par le navigateur pendant la visite. */
async function suivreViolations(page: Page) {
  const violations: string[] = [];
  page.on('console', (m) => { if (/Content Security Policy|Content-Security-Policy/i.test(m.text())) violations.push(m.text()); });
  await page.addInitScript(() => {
    document.addEventListener('securitypolicyviolation', (e) => console.error(`Content Security Policy : ${e.violatedDirective} ${e.blockedURI}`));
  });
  return violations;
}

test('les pages portent une CSP avec nonce et les en-têtes de sécurité', async ({ request }) => {
  const r = await request.get('/connexion');
  const csp = r.headers()['content-security-policy'] ?? '';
  expect(csp).toMatch(/script-src 'self' 'nonce-[A-Za-z0-9+/=]+' 'strict-dynamic'/);
  expect(csp).toContain("frame-ancestors 'none'");
  expect(r.headers()['x-content-type-options']).toBe('nosniff');
  expect(r.headers()['x-frame-options']).toBe('DENY');
  expect(r.headers()['referrer-policy']).toBe('strict-origin-when-cross-origin');
  const autre = await request.get('/connexion');
  expect(autre.headers()['content-security-policy']).not.toBe(csp);
});

test('aucune violation de CSP sur les pages principales', async ({ page }) => {
  const violations = await suivreViolations(page);
  await page.goto('/connexion');
  await inscrireEleve(page, emailDeTest('csp'));
  for (const chemin of ['/', '/calendrier', '/calendrier/nouveau', '/notifications', '/rappels', '/classes']) {
    await page.goto(chemin);
    await expect(page.locator('main')).toBeVisible();
  }
  // Une page de chapitre (avec ses schémas) : le premier cours et son premier chapitre depuis l'accueil.
  await page.goto('/');
  await page.getByRole('link', { name: /Biologie et physiopathologie humaines/ }).first().click();
  await page.locator('main a[href^="/cours/"]').first().click();
  await expect(page.locator('main')).toBeVisible();
  expect(violations).toEqual([]);
});
```

Avant d'écrire les sélecteurs de la page de chapitre, vérifier les liens réels de l'accueil et de la page d'un cours ; garder l'intention (ouvrir un chapitre publié de BPH).

- [ ] **Step 6 : vérifier**

Run : `npm test && npm run typecheck && npm run lint && npm run build && npx playwright test e2e/securite.spec.ts e2e/hors-ligne.spec.ts e2e/calendrier.spec.ts`
Expected : PASS. Laisser le port 3000 libre.

- [ ] **Step 7 : commit**

```bash
git add src/lib/securite src/proxy.ts src/lib/supabase/session.ts src/app/layout.tsx next.config.ts e2e/securite.spec.ts
git commit -m "Ajoute une CSP avec nonce et les en-têtes de sécurité

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---
### Task 3 : service worker versionné au build

**Files :**
- Modify : `next.config.ts`, `src/components/EnregistrementSW.tsx`, `public/sw.js`, `e2e/hors-ligne.spec.ts`, `e2e/securite.spec.ts`

**Interfaces :**
- Consumes : enregistrement actuel du service worker (production seulement).
- Produces : `process.env.NEXT_PUBLIC_VERSION_APP` (chaîne `[a-z0-9]{1,16}`) ; caches `statique-<v>`, `pages-<v>`, `hors-ligne-<v>`.

- [ ] **Step 1 : version au build**

`next.config.ts`, dans l'objet de configuration :

```ts
  // Version du déploiement : nomme les caches du service worker (un nouveau déploiement remplace les anciens).
  env: {
    NEXT_PUBLIC_VERSION_APP: (process.env.VERCEL_GIT_COMMIT_SHA ?? '').slice(0, 8).toLowerCase() || Date.now().toString(36),
  },
```

`src/components/EnregistrementSW.tsx` : enregistrer `` `/sw.js?v=${encodeURIComponent(process.env.NEXT_PUBLIC_VERSION_APP ?? 'dev')}` `` au lieu de `/sw.js` (mêmes options `scope: '/'`, `updateViaCache: 'none'`). Une URL de script différente déclenche la mise à jour du service worker.

`public/sw.js` : remplacer `const VERSION = 'v2';` (et le commentaire « Changer VERSION à chaque modification… ») par :

```js
// Version du déploiement, passée dans l'URL d'enregistrement (/sw.js?v=…). Les caches des autres versions sont supprimés à l'activation.
const VERSION = (() => {
  const v = new URL(self.location.href).searchParams.get('v') ?? '';
  return /^[a-z0-9]{1,16}$/.test(v) ? v : 'dev';
})();
```

- [ ] **Step 2 : adapter les parcours**

`e2e/hors-ligne.spec.ts` : partout où le test attend le nom `'hors-ligne-v2'`, attendre un nom qui commence par `'hors-ligne-'`, et vérifier que la version du cache est celle du script enregistré :

```ts
const { cles, script } = await page.evaluate(async () => ({
  cles: await caches.keys(),
  script: (await navigator.serviceWorker.getRegistration())?.active?.scriptURL ?? '',
}));
const version = new URL(script).searchParams.get('v');
expect(version).toMatch(/^[a-z0-9]{1,16}$/);
expect(cles).toContain(`hors-ligne-${version}`);
```

(adapter aux noms de variables du fichier ; ne pas affaiblir les autres assertions).

- [ ] **Step 3 : vérifier**

Run : `npm run lint && npm run build && npx playwright test e2e/hors-ligne.spec.ts`
Expected : PASS. Laisser le port 3000 libre.

- [ ] **Step 4 : commit**

```bash
git add next.config.ts src/components/EnregistrementSW.tsx public/sw.js e2e/hors-ligne.spec.ts
git commit -m "Lie la version du service worker au déploiement

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 4 : mise en ligne — région et guide

**Files :**
- Create : `vercel.json`, `docs/mise-en-ligne.md`
- Modify : `README.md`

- [ ] **Step 1 : région Vercel**

`vercel.json` :

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "regions": ["cdg1"]
}
```

Vérifier avec context7 (documentation Vercel) que `regions` est bien la clé qui fixe la région des fonctions.

- [ ] **Step 2 : guide de mise en ligne**

`docs/mise-en-ligne.md` :

```markdown
# Mise en ligne

Ce guide liste ce qui se règle à la main pour publier l'application. Rien n'est déployé automatiquement.

## 1. Projet Supabase (hébergé)

- Région : **Europe** (Paris `eu-west-3` ou Francfort `eu-central-1`). Les données des élèves restent en Europe (spec, section 9).
- Version de Postgres : **17** (le droit `MAINTAIN` utilisé par les migrations l'exige).
- Appliquer les migrations : `npx supabase link --project-ref <ref>` puis `npx supabase db push`.
- Importer le cours : `npm run import:contenu -- contenu/1re-st2s/bph.json --publier` avec les clés du projet hébergé (le script refuse une base distante sans confirmation explicite : lire `scripts/importer-contenu.ts`).
- Authentification :
  - mot de passe d'au moins **8 caractères** ;
  - confirmation de l'adresse e-mail activée, modèle « Confirm signup » en français ;
  - URL du site et URL de redirection : `https://<domaine>/auth/callback` et `https://<domaine>/auth/confirm` ;
  - fournisseur Google : identifiants OAuth du projet Google, URL de redirection fournie par Supabase.
- Extensions `pg_cron` et `pg_net` : activées par les migrations.
- Ne jamais ajouter le schéma `net` ni `prive` aux schémas exposés par l'API.

## 2. Projet Vercel

- Région des fonctions : `cdg1` (fixée par `vercel.json`).
- Variables d'environnement (Production) :
  - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` ;
  - `NEXT_PUBLIC_SITE_URL=https://<domaine>` — **lue au build** : la changer demande un nouveau déploiement ;
  - `NEXT_PUBLIC_VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_SUJET=mailto:<adresse de contact>`, `ENVOI_SECRET` : générer de **nouvelles** clés, différentes des clés locales (`npx web-push generate-vapid-keys` et `openssl rand -base64 32`) ;
  - ne pas mettre `SUPABASE_SERVICE_ROLE_KEY` dans Vercel : l'application ne l'utilise pas.
- Au démarrage, l'application vérifie ces variables (`src/instrumentation.ts`) : une variable obligatoire absente arrête le démarrage, les notifications incomplètes sont signalées dans les journaux.

## 3. Tâche d'envoi des notifications

Une fois le site en ligne, depuis un poste de confiance, avec les clés du projet hébergé dans l'environnement (jamais commitées) :

    CONFIGURER_PRODUCTION=1 ENVOI_URL=https://<domaine>/api/notifications/envoyer \
      NEXT_PUBLIC_SUPABASE_URL=… SUPABASE_SERVICE_ROLE_KEY=… ENVOI_SECRET=… \
      npx tsx scripts/configurer-envoi.ts

Vérifier ensuite dans Supabase (SQL) : `select jobname, schedule from cron.job;` doit lister `planifier-notifications`, `envoi-notifications` et `purger-historique-cron`.

## 4. Vérifications après la mise en ligne

- Les en-têtes de sécurité sont présents (`curl -sI https://<domaine>/connexion`) : `content-security-policy`, `strict-transport-security`, `x-frame-options: DENY`.
- La console du navigateur ne montre aucune violation de CSP sur l'accueil, un chapitre, le calendrier.
- L'application s'installe et le service worker est actif (outils de développement, onglet « Application »).
- Une notification de test arrive sur un téléphone (créer un événement avec un rappel de 10 minutes).
```

`README.md` : dans la section des commandes ou en fin de fichier, ajouter « Mise en ligne : voir `docs/mise-en-ligne.md`. »

- [ ] **Step 3 : commit**

```bash
git add vercel.json docs/mise-en-ligne.md README.md
git commit -m "Fixe la région européenne et ajoute le guide de mise en ligne

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 5 : dette de la base — calendrier, planning, révision générale

**Files :**
- Create : `supabase/migrations/20261215000001_dette_calendrier.sql`, `supabase/tests/dette_calendrier.test.sql`
- Modify : `src/lib/erreurs.ts`, `src/lib/erreurs.test.ts`, `src/lib/supabase/types.ts` (régénéré)

**Interfaces :**
- Consumes : fonctions actuelles — `public.enregistrer_evenement(uuid, jsonb)` (`20261201000001_calendrier.sql`), `public.mon_calendrier(timestamptz, timestamptz)` (`20261201000006_pagination.sql`), `public.accepter_plan_revision` et `public.refuser_plan_revision` (`20261201000003_plan_revision.sql`), `public.demarrer_revision_generale(uuid)` (`20261201000004_revision_generale.sql`). Vérifier pour chacune la migration la plus récente qui la redéfinit (`grep -rn "function public.<nom>" supabase/migrations`).
- Produces : nouveau code d'erreur `type_non_modifiable` ; comportements ci-dessous.

- [ ] **Step 1 : écrire le test**

`supabase/tests/dette_calendrier.test.sql` :

```sql
begin;
select plan(9);

insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-0000000000e1', 'eleve-dette@test.local');
update public.profil set onboarding_termine = true where id = '00000000-0000-0000-0000-0000000000e1';
insert into public.filiere (id, voie, code, nom) values ('10000000-0000-0000-0000-0000000000e1', 'technologique', 'DET', 'Filière dette');
insert into public.cours (id, slug, filiere_id, niveau_code, matiere, titre, publie) values
  ('20000000-0000-0000-0000-0000000000e1', 'cours-dette', '10000000-0000-0000-0000-0000000000e1', '1re', 'D', 'Cours dette', true),
  ('20000000-0000-0000-0000-0000000000e2', 'cours-dette-2', '10000000-0000-0000-0000-0000000000e1', '1re', 'E', 'Autre cours dette', true);
insert into public.chapitre (id, cours_id, slug, numero, titre, publie) values
  ('30000000-0000-0000-0000-0000000000e1', '20000000-0000-0000-0000-0000000000e1', 'ch1', 1, 'Un', true),
  ('30000000-0000-0000-0000-0000000000e2', '20000000-0000-0000-0000-0000000000e1', 'ch2', 2, 'Deux', true),
  ('30000000-0000-0000-0000-0000000000e3', '20000000-0000-0000-0000-0000000000e2', 'ch1', 1, 'Ailleurs', true);
select set_config('test.debut', to_char(date_trunc('day', now()) + interval '10 days 16 hours', 'YYYY-MM-DD"T"HH24:MI:SS"Z"'), true);

set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000e1","role":"authenticated"}', true);

-- Titres : bords nettoyés, caractères de contrôle refusés.
select throws_ok($$ select public.enregistrer_evenement(null, jsonb_build_object('type','devoir','titre',E'A\tB','debut',current_setting('test.debut'),'duree_minutes',60)) $$,
  'P0001', 'evenement_invalide', 'un titre avec une tabulation est refusé');
select lives_ok($$ select set_config('test.ev', public.enregistrer_evenement(null, jsonb_build_object(
  'type','revision','titre',E'\n  Réviser  \n','debut',current_setting('test.debut'),'duree_minutes',60,
  'cours_id','20000000-0000-0000-0000-0000000000e1',
  'chapitres', jsonb_build_array('30000000-0000-0000-0000-0000000000e1','30000000-0000-0000-0000-0000000000e2')))::text, true) $$,
  'un titre entouré de retours à la ligne est accepté');
select is((select titre from public.evenement where id = current_setting('test.ev')::uuid), 'Réviser', 'les bords du titre sont retirés');

-- Type : code dédié.
select throws_ok($$ select public.enregistrer_evenement(current_setting('test.ev')::uuid, jsonb_build_object(
  'type','devoir','titre','Réviser','debut',current_setting('test.debut'),'duree_minutes',60)) $$,
  'P0001', 'type_non_modifiable', 'changer le type a son propre code');

-- Chapitre dépublié : retiré de mon_calendrier.
reset role;
update public.chapitre set publie = false where id = '30000000-0000-0000-0000-0000000000e2';
set local role authenticated;
select is((select jsonb_array_length(chapitres) from public.mon_calendrier(current_setting('test.debut')::timestamptz - interval '1 day',
                                                                           current_setting('test.debut')::timestamptz + interval '1 day')
            where evenement_id = current_setting('test.ev')::uuid), 1, 'un chapitre dépublié n''apparaît plus');

-- Planning : examen passé refusé aussi au refus ; plus de tolérance dans le passé à l'acceptation.
reset role;
insert into public.evenement (id, eleve_id, type, titre, debut, duree_minutes, cours_id) values
  ('40000000-0000-0000-0000-0000000000e1', '00000000-0000-0000-0000-0000000000e1', 'examen_reel', 'Passé', now() - interval '2 days', 60, '20000000-0000-0000-0000-0000000000e1'),
  ('40000000-0000-0000-0000-0000000000e2', '00000000-0000-0000-0000-0000000000e1', 'examen_reel', 'Futur', now() + interval '10 days', 60, '20000000-0000-0000-0000-0000000000e1');
set local role authenticated;
select throws_ok($$ select public.refuser_plan_revision('40000000-0000-0000-0000-0000000000e1',
  '{"sessions_par_semaine":3,"duree_minutes":45,"jours_preferes":[1,2,3,4,5],"heure_debut":"17:30"}'::jsonb) $$,
  'P0001', 'examen_passe', 'refuser le planning d''un examen passé est refusé');
select throws_ok(format($f$ select public.accepter_plan_revision('40000000-0000-0000-0000-0000000000e2',
  '{"sessions_par_semaine":3,"duree_minutes":45,"jours_preferes":[1,2,3,4,5],"heure_debut":"17:30"}'::jsonb,
  jsonb_build_array(jsonb_build_object('debut', %L, 'duree_minutes', 45, 'titre', 'Révision', 'chapitres',
    jsonb_build_array('30000000-0000-0000-0000-0000000000e1'), 'revision_generale', false))) $f$,
  to_char(now() - interval '30 minutes', 'YYYY-MM-DD"T"HH24:MI:SS"Z"')),
  'P0001', 'planning_invalide', 'une session déjà commencée est refusée');

-- Révision générale : seuls les chapitres du cours de l'événement.
reset role;
insert into public.evenement (id, eleve_id, type, titre, debut, duree_minutes, cours_id, revision_generale) values
  ('40000000-0000-0000-0000-0000000000e3', '00000000-0000-0000-0000-0000000000e1', 'revision', 'Générale', now() + interval '9 days', 60,
   '20000000-0000-0000-0000-0000000000e1', true);
insert into public.evenement_chapitre (evenement_id, chapitre_id) values
  ('40000000-0000-0000-0000-0000000000e3', '30000000-0000-0000-0000-0000000000e1'),
  ('40000000-0000-0000-0000-0000000000e3', '30000000-0000-0000-0000-0000000000e3');
insert into public.question (chapitre_id, type, enonce, propositions, statut, source)
  select ch, 'qcm_unique', 'Q', '["a","b"]', 'valide', 'dette:' || ch || ':' || i
    from unnest(array['30000000-0000-0000-0000-0000000000e1'::uuid, '30000000-0000-0000-0000-0000000000e3'::uuid]) ch,
         generate_series(1, 20) i;
insert into public.question_corrige (question_id, bonnes_reponses) select id, '[0]' from public.question where source like 'dette:%';
set local role authenticated;
select lives_ok($$ select set_config('test.tg', public.demarrer_revision_generale('40000000-0000-0000-0000-0000000000e3')::text, true) $$,
  'la révision générale démarre');
reset role;
select is((select count(*)::int from public.tentative_question tq join public.question q on q.id = tq.question_id
            where tq.tentative_id = current_setting('test.tg')::uuid and q.chapitre_id = '30000000-0000-0000-0000-0000000000e3'), 0,
  'aucune question d''un chapitre d''un autre cours');

select * from finish();
rollback;
```

Les insertions de `question` et `question_corrige` suivent `supabase/tests/echeances.test.sql`. Garder les 9 assertions.

- [ ] **Step 2 : vérifier l'échec**

Run : `export PATH="$HOME/.orbstack/bin:$PATH"; npm run test:db`
Expected : FAIL sur `dette_calendrier.test.sql`.

- [ ] **Step 3 : écrire la migration**

`supabase/migrations/20261215000001_dette_calendrier.sql`. Pour chaque fonction, `create or replace` avec le **corps actuel recopié**, puis seulement les changements suivants :

1. `public.enregistrer_evenement` :
   - lecture du titre : `v_titre := regexp_replace(p->>'titre', '^[[:space:]]+|[[:space:]]+$', '', 'g');` (au lieu de `btrim(p->>'titre')`) ;
   - à la validation, refuser aussi `v_titre ~ '[[:cntrl:]]'` (`evenement_invalide`) ;
   - juste avant le comptage des 500 événements (création) : `perform 1 from public.profil where id = auth.uid() for update;` ;
   - dans la branche de modification, quand l'événement existe mais que le type envoyé diffère : `raise exception 'type_non_modifiable';` — l'événement d'un autre élève ou inexistant garde `evenement_introuvable`. Écrire d'abord la recherche par `id` et `eleve_id = auth.uid()`, puis la comparaison du type.
2. `public.mon_calendrier` : dans le `jsonb_agg` des chapitres, ajouter `and ch.publie` ; et pour le cours, renvoyer `c.titre`, `c.couleur`, `c.slug` seulement si `c.publie` (sinon `null`) — par exemple `left join public.cours c on c.id = e.cours_id and c.publie`.
3. `public.accepter_plan_revision` : remplacer `v_debut < now() - interval '1 hour'` par `v_debut < now()`.
4. `public.refuser_plan_revision` : remplacer la vérification d'existence par la même lecture que `accepter_plan_revision` — examen de l'élève, de type `examen_reel`, avec `cours_id` non nul, sinon `examen_introuvable` ; puis `if v_examen.debut <= now() then raise exception 'examen_passe'; end if;`.
5. `public.demarrer_revision_generale` : dans la liste des chapitres de l'événement, ajouter `and ch.cours_id = e.cours_id` (ou la variable équivalente du corps) ; dans le tirage, `order by rang, priorite, random()` au lieu de `order by rang, priorite`.

Garder pour chaque fonction ses droits (`revoke`/`grant`) tels qu'ils sont.

`src/lib/erreurs.ts` : `type_non_modifiable: 'Le type d’un événement ne change pas après sa création.',` ; `src/lib/erreurs.test.ts` : test du texte exact. Vérifier qu'aucun code existant n'est sous-chaîne de `type_non_modifiable` ni l'inverse.

- [ ] **Step 4 : appliquer et vérifier**

Run : `export PATH="$HOME/.orbstack/bin:$PATH"; npm run db:reset && npx supabase gen types typescript --local > src/lib/supabase/types.ts && npm run test:db && npm test && npm run typecheck`
Expected : PASS, dont `dette_calendrier.test.sql` 9/9 et toute la suite existante (les tests existants qui comptaient sur l'ancien comportement — tolérance d'une heure, `evenement_introuvable` au changement de type — sont adaptés au nouveau comportement, sans retirer d'assertion).

- [ ] **Step 5 : commit**

```bash
git add supabase/migrations/20261215000001_dette_calendrier.sql supabase/tests src/lib/erreurs.ts src/lib/erreurs.test.ts src/lib/supabase/types.ts
git commit -m "Solde la dette du calendrier, du planning et de la révision générale

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 6 : dette de la base — notifications

**Files :**
- Create : `supabase/migrations/20261215000002_dette_notifications.sql`, `supabase/tests/dette_notifications.test.sql`
- Modify : `src/lib/supabase/types.ts` (régénéré)

**Interfaces :**
- Consumes : `public.notification_planifiee`, `prive.planifier_notifications(timestamptz)`, `public.envoi_reserver(text, int)`, `public.regler_rappel_evenement(uuid, int)`, `prive.oublier_rappels_evenement()` (migrations `20261208000001` et `20261208000002`, corps actuels).
- Produces :
  - colonne `notification_planifiee.reservations smallint not null default 0` ;
  - fonction `prive.notification_encore_valide(n public.notification_planifiee) returns boolean` ;
  - comportements ci-dessous.

- [ ] **Step 1 : écrire le test**

`supabase/tests/dette_notifications.test.sql` :

```sql
begin;
select plan(8);

insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-0000000000f1', 'eleve-dette-notif@test.local'),
  ('00000000-0000-0000-0000-0000000000f3', 'prof-dette-notif@test.local');
update public.profil set onboarding_termine = true where id = '00000000-0000-0000-0000-0000000000f1';
update public.profil set role = 'enseignant' where id = '00000000-0000-0000-0000-0000000000f3';
insert into public.filiere (id, voie, code, nom) values ('10000000-0000-0000-0000-0000000000f1', 'technologique', 'DNO', 'Filière dette notif');
insert into public.cours (id, slug, filiere_id, niveau_code, matiere, titre, publie) values
  ('20000000-0000-0000-0000-0000000000f1', 'cours-dette-notif', '10000000-0000-0000-0000-0000000000f1', '1re', 'N', 'Cours notif', true);
insert into public.classe (id, enseignant_id, nom, code) values
  ('60000000-0000-0000-0000-0000000000f1', '00000000-0000-0000-0000-0000000000f3', 'Classe dette', 'DNTBCD');
insert into public.classe_cours values ('60000000-0000-0000-0000-0000000000f1', '20000000-0000-0000-0000-0000000000f1');
insert into public.inscription_classe (classe_id, eleve_id) values ('60000000-0000-0000-0000-0000000000f1', '00000000-0000-0000-0000-0000000000f1');
delete from prive.cle_envoi;
insert into prive.cle_envoi (id, empreinte) values (true, extensions.digest(repeat('s', 43), 'sha256'));
delete from public.notification_planifiee where eleve_id = '00000000-0000-0000-0000-0000000000f1';

-- 1. echeance_proche attend l'ouverture : ouverture après l'instant d'alerte, rien n'est planifié.
insert into public.echeance_evaluation (classe_id, cours_id, ouverture, limite) values
  ('60000000-0000-0000-0000-0000000000f1', '20000000-0000-0000-0000-0000000000f1', '2027-01-12 20:00+01', '2027-01-13 09:10+01');
select prive.planifier_notifications('2027-01-12 09:00+01');
select is((select count(*)::int from public.notification_planifiee
            where eleve_id = '00000000-0000-0000-0000-0000000000f1' and type = 'echeance_proche'), 0,
  'pas d''alerte de fermeture avant l''ouverture de l''évaluation');

-- 2. Une notification devenue sans objet est supprimée à la réservation (cours validé entre-temps).
insert into public.notification_planifiee (id, eleve_id, type, cle, titre, corps, url, envoi_prevu) values
  ('50000000-0000-0000-0000-0000000000f1', '00000000-0000-0000-0000-0000000000f1', 'nouvel_essai', 'essai:test', 'Évaluation', 'Tu peux retenter ton évaluation', '/', now() - interval '1 minute'),
  ('50000000-0000-0000-0000-0000000000f2', '00000000-0000-0000-0000-0000000000f1', 'inactivite', 'inactivite:test', 'On reprend', 'x', '/', now() - interval '1 minute');
-- La notification nouvel_essai porte le cours dans son URL : /cours/<slug>/evaluation.
update public.notification_planifiee set url = '/cours/cours-dette-notif/evaluation' where id = '50000000-0000-0000-0000-0000000000f1';
insert into public.progression_cours (eleve_id, cours_id, meilleure_note, valide, valide_le, essais)
  values ('00000000-0000-0000-0000-0000000000f1', '20000000-0000-0000-0000-0000000000f1', 90, true, now(), 1);
-- Une activité après la création de la relance d'inactivité.
insert into public.tentative (eleve_id, type, cours_id, nb_questions, debut, statut)
  values ('00000000-0000-0000-0000-0000000000f1', 'evaluation_cours', '20000000-0000-0000-0000-0000000000f1', 40, now(), 'terminee');

set local role anon;
select is((select count(*)::int from public.envoi_reserver(repeat('s', 43)) where eleve_id = '00000000-0000-0000-0000-0000000000f1'), 0,
  'les notifications sans objet ne sont pas envoyées');
reset role;
select is((select count(*)::int from public.notification_planifiee where id in
            ('50000000-0000-0000-0000-0000000000f1', '50000000-0000-0000-0000-0000000000f2')), 0,
  'elles sont supprimées');

-- 3. Plus de 10 réservations : échec.
insert into public.notification_planifiee (id, eleve_id, type, cle, titre, corps, url, envoi_prevu, reservations) values
  ('50000000-0000-0000-0000-0000000000f3', '00000000-0000-0000-0000-0000000000f1', 'revision_du_jour', 'jour:test', 'Révisions du jour', 'x', '/', now() - interval '1 minute', 10);
set local role anon;
select is((select count(*)::int from public.envoi_reserver(repeat('s', 43)) where id = '50000000-0000-0000-0000-0000000000f3'), 0,
  'une notification réservée trop souvent n''est plus renvoyée');
reset role;
select is((select statut::text from public.notification_planifiee where id = '50000000-0000-0000-0000-0000000000f3'), 'echec',
  'elle passe en échec');

-- 4. Une réservation compte.
insert into public.notification_planifiee (id, eleve_id, type, cle, titre, corps, url, envoi_prevu) values
  ('50000000-0000-0000-0000-0000000000f4', '00000000-0000-0000-0000-0000000000f1', 'revision_du_jour', 'jour:test2', 'Révisions du jour', 'x', '/', now() - interval '1 minute');
set local role anon;
select is((select count(*)::int from public.envoi_reserver(repeat('s', 43)) where id = '50000000-0000-0000-0000-0000000000f4'), 1,
  'une notification due est réservée');
reset role;
select is((select reservations from public.notification_planifiee where id = '50000000-0000-0000-0000-0000000000f4'), 1::smallint,
  'la réservation est comptée');

-- 5. Changer le rappel ne supprime pas une ligne réservée.
insert into public.evenement (id, eleve_id, type, titre, debut, duree_minutes, delai_rappel_minutes) values
  ('40000000-0000-0000-0000-0000000000f1', '00000000-0000-0000-0000-0000000000f1', 'devoir', 'Devoir', now() + interval '1 day', 60, 60);
insert into public.notification_planifiee (eleve_id, type, cle, evenement_id, titre, corps, url, envoi_prevu, reserve_jusqu_au) values
  ('00000000-0000-0000-0000-0000000000f1', 'rappel_evenement', 'rappel:reserve', '40000000-0000-0000-0000-0000000000f1', 'Devoir', 'x', '/', now() - interval '1 minute', now() + interval '1 minute');
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000f1","role":"authenticated"}', true);
select public.regler_rappel_evenement('40000000-0000-0000-0000-0000000000f1', 10);
reset role;
select is((select count(*)::int from public.notification_planifiee where cle = 'rappel:reserve'), 1,
  'une ligne en cours d''envoi n''est pas supprimée');

select * from finish();
rollback;
```

- [ ] **Step 2 : vérifier l'échec**

Run : `export PATH="$HOME/.orbstack/bin:$PATH"; npm run test:db`
Expected : FAIL sur `dette_notifications.test.sql`.

- [ ] **Step 3 : écrire la migration**

`supabase/migrations/20261215000002_dette_notifications.sql` :

```sql
-- Dette des notifications : réservations comptées, notifications sans objet retirées à l'envoi, ouverture de l'évaluation.

alter table public.notification_planifiee add column reservations smallint not null default 0 check (reservations >= 0);

-- Une notification en attente a-t-elle encore un sens au moment de l'envoi ?
create function prive.notification_encore_valide(n public.notification_planifiee) returns boolean
language sql stable set search_path = '' as $$
  select case n.type
    -- Rappel : l'occurrence (instant dans la clé « rappel:<id>:<epoch>:<délai> ») n'a pas encore commencé.
    when 'rappel_evenement' then coalesce(
      to_timestamp(nullif(split_part(n.cle, ':', 3), '')::bigint) > now(), true)
    -- Échéance : la même date limite existe toujours, l'élève est toujours inscrit, le cours n'est pas validé.
    when 'echeance_proche' then exists (
      select 1 from public.echeance_evaluation ee
        join public.inscription_classe i on i.classe_id = ee.classe_id and i.eleve_id = n.eleve_id
       where ee.classe_id::text = split_part(n.cle, ':', 2) and ee.cours_id::text = split_part(n.cle, ':', 3)
         and extract(epoch from ee.limite)::bigint::text = split_part(n.cle, ':', 4))
      and not exists (
      select 1 from public.progression_cours pc
       where pc.eleve_id = n.eleve_id and pc.cours_id::text = split_part(n.cle, ':', 3) and pc.valide)
    -- Nouvel essai : le cours de l'URL /cours/<slug>/evaluation n'est pas validé.
    when 'nouvel_essai' then not exists (
      select 1 from public.progression_cours pc join public.cours c on c.id = pc.cours_id
       where pc.eleve_id = n.eleve_id and pc.valide and n.url = '/cours/' || c.slug || '/evaluation')
    -- Inactivité : aucune tentative commencée depuis la création de la notification.
    when 'inactivite' then not exists (
      select 1 from public.tentative t where t.eleve_id = n.eleve_id and t.debut > n.cree_le)
    else true
  end
$$;
revoke execute on function prive.notification_encore_valide(public.notification_planifiee) from public;
```

Puis, en recopiant les corps actuels :
- `public.envoi_reserver` : avant la sélection des lignes à réserver, dans la même fonction :

```sql
  -- Réservée plus de 10 fois sans fin d'envoi : abandon.
  update public.notification_planifiee set statut = 'echec', reserve_jusqu_au = null
   where statut = 'en_attente' and envoi_prevu <= now() and reservations >= 10
     and (reserve_jusqu_au is null or reserve_jusqu_au < now());
  -- Sans objet au moment de l'envoi : retirée.
  delete from public.notification_planifiee n
   where n.statut = 'en_attente' and n.envoi_prevu <= now()
     and (n.reserve_jusqu_au is null or n.reserve_jusqu_au < now())
     and not prive.notification_encore_valide(n);
```

  et, dans la mise à jour de réservation, `reservations = n.reservations + 1` en plus de `reserve_jusqu_au`.
- `public.regler_rappel_evenement` et `prive.oublier_rappels_evenement` : la suppression des rappels en attente ajoute `and (reserve_jusqu_au is null or reserve_jusqu_au < now())`.
- `prive.planifier_notifications` : dans le bloc `echeance_proche`, ajouter `and (ee.ouverture is null or ee.ouverture <= ee.limite - interval '24 hours')`.

Garder les droits de chaque fonction.

- [ ] **Step 4 : appliquer et vérifier**

Run : `export PATH="$HOME/.orbstack/bin:$PATH"; npm run db:reset && npx supabase gen types typescript --local > src/lib/supabase/types.ts && npm run test:db && npm test && npm run typecheck`
Expected : PASS, dont `dette_notifications.test.sql` 8/8 et `envoi.test.sql`, `notifications.test.sql` inchangés et verts.

- [ ] **Step 5 : commit**

```bash
git add supabase/migrations/20261215000002_dette_notifications.sql supabase/tests/dette_notifications.test.sql src/lib/supabase/types.ts
git commit -m "Retire les notifications sans objet et borne leurs réservations

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---
### Task 7 : dette TypeScript et interface

**Files :**
- Modify : `src/lib/calendrier/schema-evenement.ts` (+ test), `src/lib/planning/reglages.ts` (+ test), `src/lib/planning/generer.ts` (+ test), `src/lib/calendrier/garde.ts`, `src/components/calendrier/ProchainsEvenements.tsx`, `src/components/calendrier/BanniereReorganiser.tsx`, `src/app/(app)/notifications/actions.ts`, `src/components/notifications/ListeAppareils.tsx`, `e2e/notifications.spec.ts`

**Interfaces :**
- Consumes : `hoteDePushAutorise(endpoint: string): boolean` (`src/lib/notifications/webpush.ts`) ; `lireProfil()`, `lireUtilisateur()` (`src/lib/supabase/utilisateur.ts`).

- [ ] **Step 1 : tests**

`src/lib/calendrier/schema-evenement.test.ts`, ajouter (avec le constructeur de formulaire valide déjà présent dans le fichier) :

```ts
  it('répond en français à un cours ou un chapitre falsifié', () => {
    const f = formulaire({ ...valide, cours: 'pas-un-uuid' });
    expect(lireFormulaireEvenement(f)).toMatchObject({ ok: false, champ: 'cours', erreur: 'Choisis un cours dans la liste.' });
    const g = formulaire({ ...valide, chapitres: ['x'] });
    expect(lireFormulaireEvenement(g)).toMatchObject({ ok: false, champ: 'chapitres', erreur: 'Choisis des chapitres dans la liste.' });
  });
  it('répond en français à un jour de semaine falsifié', () => {
    const f = formulaire({ ...valide, repetition: 'jours', jusqu: valide.jour, jours: ['9'] });
    expect(lireFormulaireEvenement(f)).toMatchObject({ ok: false, champ: 'jours', erreur: 'Choisis des jours entre lundi et dimanche.' });
  });
```

(adapter `formulaire` et `valide` aux noms réels du fichier ; si `jours` est déclaré autrement, garder le message exact).

`src/lib/planning/reglages.test.ts`, ajouter :

```ts
  it('répond en français à un jour falsifié', () => {
    const f = new FormData();
    f.set('sessions', '3'); f.set('duree', '45'); f.append('jours', '0'); f.set('heure', '17:30');
    expect(lireReglages(f)).toMatchObject({ ok: false, champ: 'jours', erreur: 'Choisis des jours entre lundi et dimanche.' });
  });
```

(adapter au nom réel de la fonction de lecture des réglages et à la forme de son résultat).

`src/lib/planning/generer.test.ts`, ajouter :

```ts
  it('accepte une session qui commence exactement 30 minutes après maintenant', () => {
    const p = genererPlanning({
      ...base, maintenant: new Date('2026-12-07T15:30:00Z'), // lundi 16 h 30 à Paris
      reglages: { ...reglages, joursPreferes: [1], heureDebut: '17:00' },
    });
    expect(p.sessions[0].debut).toBe('2026-12-07T16:00:00.000Z');
  });
  it('renvoie un planning vide avec un avertissement pour une date d’examen invalide', () => {
    expect(genererPlanning({ ...base, examenDebut: 'pas une date' })).toEqual({
      sessions: [], regroupe: false, avertissements: ['La date de l’examen est invalide.'],
    });
  });
```

(`base` et `reglages` sont les données de test déjà définies dans ce fichier ; si la session du lundi 7 décembre n'est pas la première, l'assertion porte sur la présence d'une session à `2026-12-07T16:00:00.000Z`).

Run : `npx vitest run src/lib/calendrier/schema-evenement.test.ts src/lib/planning`
Expected : FAIL sur les nouveaux cas.

- [ ] **Step 2 : corrections**

- `schema-evenement.ts` :
  - `cours: z.string().uuid({ error: 'Choisis un cours dans la liste.' }).optional()` ;
  - `chapitres: z.array(z.string().uuid({ error: 'Choisis des chapitres dans la liste.' })).max(30, 'Choisis 30 chapitres au plus.')` ;
  - pour les jours de la semaine : `z.coerce.number().int().min(1, 'Choisis des jours entre lundi et dimanche.').max(7, 'Choisis des jours entre lundi et dimanche.')` (même message pour un nombre invalide).
- `reglages.ts` : même message pour `jours` (`min(1)`, `max(7)` et entier).
- `generer.ts` :
  - dans `creneauDuJour`, `if (d < apres) continue;` (une session à exactement 30 minutes est permise) ;
  - au début de `genererPlanning` : `if (Number.isNaN(Date.parse(p.examenDebut))) return { sessions: [], regroupe: false, avertissements: ['La date de l’examen est invalide.'] };`.
- `garde.ts` :

```ts
import { notFound, redirect } from 'next/navigation';
import { lireProfil, lireUtilisateur } from '@/lib/supabase/utilisateur';

/** Réserve une page ou une action aux comptes élèves. À appeler hors de tout try/catch (redirect et notFound lèvent une exception). */
export async function exigerEleve() {
  if (!(await lireUtilisateur())) redirect('/connexion');
  const profil = await lireProfil();
  if (profil?.role !== 'eleve') notFound();
  return profil;
}
```

- `ProchainsEvenements.tsx` : dans le `catch`, journaliser (`catch (e) { console.error('prochains événements', e); … }`) en gardant l'affichage de repli.
- `BanniereReorganiser.tsx` : le bouton « Plus tard » devient un petit composant client avec `useFormStatus` (désactivé et « Un instant… » pendant l'envoi), placé dans le même formulaire.
- `notifications/actions.ts`, `enregistrerAbonnement` : après la validation zod, `if (!hoteDePushAutorise(a.data.endpoint)) return { erreur: messageErreur('abonnement_invalide') };`.
- `ListeAppareils.tsx` : le nom accessible du bouton inclut la date : `Retirer<span className="sr-only"> {a.appareil}, ajouté le {date}</span>` (deux appareils de même libellé ont alors des boutons distincts).
- `e2e/notifications.spec.ts` : en tête du fichier, `test.use({ trace: 'off' });` (la trace d'un réessai enregistrerait l'en-tête `Authorization` avec le secret local).

- [ ] **Step 3 : vérifier**

Run : `npm test && npm run typecheck && npm run lint`
Expected : PASS.

- [ ] **Step 4 : commit**

```bash
git add src/lib/calendrier src/lib/planning src/components/calendrier "src/app/(app)/notifications/actions.ts" src/components/notifications/ListeAppareils.tsx e2e/notifications.spec.ts
git commit -m "Solde la dette TypeScript du calendrier et des notifications

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 8 : accessibilité

**Files :**
- Modify : `src/app/globals.css`, `src/styles/quiz.css`, `src/styles/notifications.css`, `src/components/LecteurTentative.tsx`, `src/app/(auth)/FormulaireIdentifiants.tsx`, `src/app/(auth)/actions.ts`, `src/app/bienvenue/FormulaireBienvenue.tsx`, `src/app/bienvenue/actions.ts` (+ test si existant), `src/app/(app)/admin/enseignants/FormulaireDemande.tsx`

**Interfaces :**
- Produces : `EtatFormulaire` gagne `champ?: 'email' | 'motDePasse'` ; `EtatBienvenue` gagne `champ?: 'nom' | 'filiere' | 'niveau' | 'etablissement'`.

- [ ] **Step 1 : contour de focus et position dans le quiz**

- `globals.css:34` : `:focus-visible { outline: 3px solid var(--couleur-cours); outline-offset: 2px; }` (sans `border-radius` : le contour suit l'arrondi de l'élément ; un arrondi global déformait les éléments carrés).
- `LecteurTentative.tsx:160` : la position est annoncée à chaque changement de question :

```tsx
<span className="lecteur-position" aria-live="polite" aria-atomic="true">
  Question {index + 1}<span aria-hidden="true"> / </span><span className="sr-only"> sur </span>{questions.length}
</span>
```

- [ ] **Step 2 : contrastes en mode sombre**

- `globals.css`, règle sombre de `.pastille` (ligne ~92) : `.pastille { color: var(--encre); background: color-mix(in srgb, var(--couleur-cours) 30%, var(--surface)); }` — le texte reste à l'encre, le fond porte la couleur du cours : le contraste ne dépend plus d'une couleur de cours très foncée.
- `quiz.css`, `.barre-progression` : en mode sombre, piste `background: color-mix(in srgb, var(--encre) 30%, var(--surface));` pour un contraste d'au moins 3:1 avec la surface.
- `notifications.css`, `.pastille-rappels` : `background: var(--encre); color: var(--surface);` dans les deux modes.

Vérifier chaque paire avec un calcul de contraste (les variables de `globals.css` dans les deux modes) : au moins 4,5:1 pour le texte, 3:1 pour la piste. Noter les rapports dans le rapport de tâche.

- [ ] **Step 3 : formulaires d'identification et de bienvenue**

`src/app/(auth)/actions.ts` : chaque erreur liée à un champ renvoie aussi `champ` (`'email'` pour une adresse invalide ou déjà utilisée, `'motDePasse'` pour un mot de passe trop court ou des identifiants refusés — dans ce dernier cas, `'motDePasse'`).

`FormulaireIdentifiants.tsx` :

```tsx
      <label>
        Adresse e-mail
        <input key={etat.email} name="email" type="email" autoComplete="email" defaultValue={etat.email} required
          aria-invalid={etat.champ === 'email' || undefined}
          aria-describedby={etat.champ === 'email' ? 'identifiants-erreur' : undefined} />
      </label>
      <label>
        Mot de passe
        <input name="motDePasse" type="password" autoComplete={autocompleteMotDePasse} minLength={8} required
          aria-invalid={etat.champ === 'motDePasse' || undefined}
          aria-describedby={['mot-de-passe-aide', etat.champ === 'motDePasse' ? 'identifiants-erreur' : null].filter(Boolean).join(' ')} />
      </label>
      <p id="mot-de-passe-aide" className="aide-champ">8 caractères au moins.</p>
      {etat.erreur && <p id="identifiants-erreur" role="alert" className="message-erreur">{etat.erreur}</p>}
```

`bienvenue/actions.ts` : la validation zod renvoie `champ: r.error.issues[0].path[0]` ; le prénom compte en caractères (points de code) : `z.string().trim().refine((s) => [...s].length >= 2, 'Ton prénom doit compter au moins 2 caractères.')` à la place de `min(2)` (même message que l'actuel s'il diffère : garder le texte existant). `FormulaireBienvenue.tsx` : `aria-invalid` et `aria-describedby` (id `bienvenue-erreur` sur le message) sur le champ en cause, comme ci-dessus.

- [ ] **Step 4 : décisions réannoncées sur `/admin/enseignants`**

`FormulaireDemande.tsx` : après une décision réussie, afficher un message dans une région `role="status"` toujours rendue, dont le texte change à chaque décision (par exemple « Demande de Prénom validée. » / « … refusée. ») ; deux décisions identiques de suite donnent deux textes différents (nom de la personne). Si le composant est démonté après la décision (ligne retirée de la liste), placer la région dans la page parente et lui passer le texte par l'état de l'action.

- [ ] **Step 5 : vérifier**

Run : `npm test && npm run typecheck && npm run lint && npm run build && npx playwright test e2e/parcours-lecture.spec.ts e2e/quiz.spec.ts e2e/enseignant.spec.ts`
Expected : PASS (adapter un sélecteur e2e seulement si un libellé visible a changé, sans affaiblir l'assertion). Laisser le port 3000 libre.

- [ ] **Step 6 : commit**

```bash
git add src/app/globals.css src/styles src/components/LecteurTentative.tsx "src/app/(auth)" src/app/bienvenue "src/app/(app)/admin/enseignants" e2e
git commit -m "Corrige le focus, les contrastes sombres et les erreurs de formulaire annoncées

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 9 : bout en bout, revue d'accessibilité, bilan et revue finale

**Files :**
- Create : `docs/superpowers/plans/2026-12-15-etape-4c-bilan.md`
- Modify : `README.md`, `docs/superpowers/plans/2026-11-03-feuille-de-route.md`

- [ ] **Step 1 : vérification complète**

Run :
```bash
export PATH="$HOME/.orbstack/bin:$PATH"
npm run db:reset
npm test && npm run typecheck && npm run lint && npm run test:db && npm run build && npm run e2e
```
Expected : tout passe. Noter les nombres exacts. Laisser le port 3000 libre.

- [ ] **Step 2 : revue d'accessibilité de fin d'étape**

Avec le skill `design:accessibility-review` (WCAG 2.1 AA), sur le build de production local et un compte élève de test, à 375 px puis à 1280 px, en mode clair puis sombre : accueil, page d'un chapitre, quiz (une question), calendrier (semaine et mois), nouvel événement, notifications, rappels, connexion, bienvenue. Noter chaque problème avec la page, le critère WCAG et la gravité. Corriger les problèmes **bloquants** (critère A ou AA non respecté sur un parcours principal) dans cette tâche, avec un commit à part ; les autres vont dans le bilan.

- [ ] **Step 3 : README, feuille de route, bilan**

- `README.md` : section « Sécurité » (CSP avec nonce, en-têtes ; vérification de l'environnement au démarrage ; version du service worker liée au déploiement) et lien vers `docs/mise-en-ligne.md`.
- Feuille de route : la ligne 4c passe à « Terminé (branche etape-4c-securite) » avec le bilan.
- Bilan `2026-12-15-etape-4c-bilan.md`, sur le modèle du bilan 4b : livré, nombres de tests, écarts et décisions (lignes « Ruling » du registre), résultats de la revue d'accessibilité, limites acceptées, points reportés (étape 5 et suivantes, y compris les points des bilans 4a et 4b non traités ici), et une section « Revue finale » à compléter.

- [ ] **Step 4 : commit**

```bash
git add README.md docs/superpowers/plans/2026-11-03-feuille-de-route.md docs/superpowers/plans/2026-12-15-etape-4c-bilan.md
git commit -m "Ajoute le bilan de l'étape 4c

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

- [ ] **Step 5 : revue finale**

Revue de toute la branche (`etape-4b-notifications..etape-4c-securite`) par **Opus**, avec une attention particulière pour :
- la CSP : aucune page cassée (scripts de Next, polices, images des schémas, connexion Google, service worker, page hors connexion), aucune ouverture inutile, en-têtes présents sur toutes les routes ;
- la session : cookies et en-têtes de cache inchangés dans leur comportement, redirections intactes ;
- la version du service worker et le nettoyage des caches ;
- les migrations de dette : corps recopiés fidèlement, droits conservés, comportement des tests existants ;
- l'accessibilité des corrections.

Ensuite, une seule vague de corrections, une re-revue ciblée, la vérification complète (Step 1), puis la mise à jour du bilan.
