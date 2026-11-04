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
- `npm run e2e` : parcours complets (Playwright). Prérequis : base locale démarrée et réinitialisée avec le cours (`npm run db:reset`), `.env.local` rempli, et, la première fois, `npx playwright install chromium`. Les tests construisent et lancent l'application en production (`npm run build && npm run start`). Arrête `npm run dev` avant `npm run e2e` : les tests lancent leur propre build de production sur le port 3000. Les comptes `@test.local` créés par les tests sont supprimés à la fin.

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

### Parcours enseignant

1. **Demande** : à l'inscription, la personne choisit « J'enseigne » et indique son établissement. Elle voit une page d'attente.
2. **Validation** : l'administrateur du contenu accepte ou refuse la demande sur `/admin/enseignants`. Une fois validé, le compte arrive sur `/enseignant`.
3. **Classes** : l'enseignant crée une classe (nom, filière et niveau facultatifs) et choisit ses cours. Il peut ensuite changer les cours et fixer, pour chaque cours, une ouverture et une date limite de l'évaluation (heure de Paris).
4. **Code** : chaque classe a un code d'invitation de 6 caractères et un lien `/classes?code=…`, à donner aux élèves. Un « Nouveau code » rend l'ancien inutilisable. L'élève saisit le code (majuscules ou minuscules) sur `/classes` ; trop de codes faux bloque les essais pendant une heure.
5. **Suivi** : la page de la classe affiche, pour chaque élève, les chapitres validés, la note d'évaluation, le nombre d'essais et la dernière activité. L'enseignant peut retirer un élève.
6. **Export** : la page « Notes et questions ratées » donne les meilleures notes par chapitre, les questions les plus ratées, et un export CSV (séparateur `;`, virgule décimale, ouvrable dans Excel).

**Ce qu'un enseignant voit** : la progression (chapitres validés) et les notes des élèves de ses classes, pour les cours de la classe, y compris leurs résultats antérieurs sur ces cours.

**Ce qu'il ne voit pas** : les réponses détaillées des élèves, leur calendrier de révision, ni leur abonnement. Il ne voit que ses propres classes.

## Confirmation de l'inscription par e-mail

Sur le projet Supabase hébergé, le modèle d'e-mail « Confirm signup » (Authentication > Email Templates) doit pointer vers :
`{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email`.
Ajouter aussi `<url-du-site>/auth/confirm` aux Redirect URLs. En local, `supabase/config.toml` est déjà réglé.

## Contenu

Le contenu entre en base uniquement par des fichiers JSON validés (`src/lib/contenu/format-import.ts`) :
`npm run import:contenu -- contenu/1re-st2s/bph.json --publier`.
