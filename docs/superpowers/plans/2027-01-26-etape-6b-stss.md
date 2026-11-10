# Étape 6b : cours de STSS (programme officiel + IA) — plan d'implémentation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal :** créer le cours de Sciences et techniques sanitaires et sociales (STSS) de 1re ST2S à partir du programme officiel, avec environ 150 questions par chapitre. Le cours est importé non publié, et l'enseignant le valide en trois arrêts.

**Architecture :**
- les outils de banque deviennent multi-cours, avec une configuration par cours ;
- le programme officiel est récupéré et versionné ;
- le plan des chapitres est validé par l'enseignant ;
- chaque chapitre est rédigé par un Opus puis relu par un second Opus ;
- le cours est importé non publié ;
- les banques suivent ensuite la chaîne de l'étape 6a.

**Tech Stack :** TypeScript, zod 4, tsx, Vitest, Supabase local, Playwright.

**Spec :** `docs/superpowers/specs/2027-01-26-etape-6b-stss-design.md`. Les specs 6a et générale et le guide des auteurs restent la référence pour le format.

**Branche :** `etape-6b-stss`, créée depuis `correctifs-audit`. Sa PR visera `correctifs-audit` (PR n° 12).

## Décisions prises dans ce plan

1. **Configuration par cours** dans `src/lib/contenu/banque/cours.ts` :
   - `bph` : `contenu/1re-st2s/bph.json`, préfixe `bph`, 130 nouvelles questions par chapitre ;
   - `stss` : `contenu/1re-st2s/stss.json`, préfixe `stss`, **150** nouvelles questions par chapitre, car il n'existe aucune question pour ce cours.

   Les quotas sont calculés en proportion des parts de la spec 6a :
   - types : 50 % `qcm_unique`, 20 % `qcm_multiple`, 20 % `vrai_faux`, 10 % `reponse_courte` ;
   - difficultés : 40 % facile, 40 % moyenne, 20 % difficile ;
   - tolérance de plus ou moins 3.

   Pour 150 questions, cela donne 75 / 30 / 30 / 15 et 60 / 60 / 30. Pour 130, cela redonne exactement les valeurs actuelles.
2. **Commandes** : `npm run banque:texte|banque:verifier|banque:fusionner -- N [--cours stss]`. Sans `--cours`, c'est `bph`, ce qui garde la compatibilité. Fichiers de travail : `contenu/1re-st2s/banques/<cours>-chN.json`. Sources : `<préfixe>:chN:banque:NNN`.
3. **Identité du cours STSS** :
   - `slug` : `stss-1re-st2s` ;
   - `filiere` : `ST2S` ;
   - `niveau` : `1re` ;
   - `matiere` : `STSS` ;
   - `titre` : « Sciences et techniques sanitaires et sociales » ;
   - `couleur` : `#7c3aed`, à vérifier : au moins 4,5:1 avec le blanc par le validateur, et distincte de `#0f766e` (BPH).
4. **Nombre de chapitres** : inconnu avant l'arrêt 1. Les tâches de rédaction et de banque sont donc écrites **une fois, pour un chapitre N**, et répétées pour chaque chapitre du plan validé, avec une tâche dispatchée et revue par chapitre.
5. **Accès web** : la récupération du programme utilise WebSearch ou WebFetch (sous-agent). Sources acceptées seulement : `education.gouv.fr`, `eduscol.education.fr`, `legifrance.gouv.fr`. Une autre source arrête la tâche.

## Contraintes globales

- **Langue et typographie** : interface et contenu en français. On tutoie l'élève, avec des formulations non genrées. Espace insécable U+00A0 avant « : ; ! ? » et à l'intérieur de « » (vraie espace insécable dans le JSON, pas `&nbsp;` hors HTML).
- **Commandes** : préfixer les commandes shell par `export PATH="$HOME/.orbstack/bin:$PATH";` et les commandes git par `DEVELOPER_DIR=/Library/Developer/CommandLineTools`. Ne jamais afficher `.env.local`.
- **Commits** : messages en français, à l'impératif présent, terminés exactement par `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. Toujours faire un `git add` des chemins exacts.
- **Publication** : le cours STSS n'est **jamais publié** par ce plan. Import sans `--publier`, toujours avec `--garder-statuts`.
- **Format des chapitres** : guide des auteurs, partie 1, et validateur `src/lib/contenu/format-import.ts`. Le HTML des sections se limite aux balises autorisées par le guide.
- **Banques** : règles de rédaction de la spec 6a § 3, appliquées au préfixe et aux quotas du cours (décision 1).
- **Contenu fiable** : aucun chiffre, aucune date, aucune loi ni aucune institution non vérifiable. En cas de doute, la donnée est omise. Rien n'est reconstitué de mémoire comme « programme officiel ».

## Répartition des modèles

| Tâche | Implémentation | Revue |
|---|---|---|
| 1 Outils de banque multi-cours | Sonnet | Sonnet |
| 2 Programme officiel et plan des chapitres, puis **arrêt 1** | **Opus** | **Opus** |
| 3 Chapitre N du cours (rédaction, relecture, import) ; N = 1 puis **arrêt 2**, puis N = 2 à la fin, puis **arrêt 3** | **Opus** rédige, **Opus** relit | Sonnet (cohérence, format, import) |
| 4 Banque du chapitre N (chaîne 6a) | Sonnet rédige, **Opus** relit | Sonnet |
| 5 Bilan, revue finale | Sonnet, puis revue finale **Opus** | — |

---

### Task 1 : outils de banque multi-cours

**Files :**
- Create : `src/lib/contenu/banque/cours.ts`, `src/lib/contenu/banque/cours.test.ts`
- Modify : `src/lib/contenu/banque/verifier.ts` (+ test), `scripts/texte-chapitre.ts`, `scripts/verifier-banque.ts`, `scripts/fusionner-banque.ts`, `docs/guide-auteurs.md` (partie « Banques de questions »)

**Interfaces :**
- Produces :
  - `type ConfigCours = { nom: 'bph' | 'stss'; fichier: string; prefixe: string; total: number }` ;
  - `COURS_BANQUE: Record<'bph' | 'stss', ConfigCours>` ;
  - `quotasPour(total: number): { types: Record<TypeQuestion, number>; difficultes: Record<1 | 2 | 3, number> }` ;
  - `lireCoursArgument(argv: string[]): ConfigCours` : `--cours <nom>`, `bph` par défaut. Une valeur inconnue lève `cours inconnu : <nom> (attendu bph ou stss)` ;
  - `verifierBanque(f, existantes, config?: ConfigCours)` : `bph` par défaut. Le motif des sources et les quotas viennent de `config`.

- [ ] **Step 1 : tests** (`cours.test.ts` et ajouts à `verifier.test.ts`) :

```ts
import { describe, expect, it } from 'vitest';
import { COURS_BANQUE, lireCoursArgument, quotasPour } from './cours';

describe('configuration des cours', () => {
  it('garde les quotas de BPH pour 130 questions', () => {
    expect(quotasPour(130)).toEqual({
      types: { qcm_unique: 65, qcm_multiple: 26, vrai_faux: 26, reponse_courte: 13 },
      difficultes: { 1: 52, 2: 52, 3: 26 },
    });
  });
  it('met les quotas à l’échelle pour 150 questions', () => {
    expect(quotasPour(150)).toEqual({
      types: { qcm_unique: 75, qcm_multiple: 30, vrai_faux: 30, reponse_courte: 15 },
      difficultes: { 1: 60, 2: 60, 3: 30 },
    });
  });
  it('lit --cours, bph par défaut', () => {
    expect(lireCoursArgument(['3'])).toBe(COURS_BANQUE.bph);
    expect(lireCoursArgument(['3', '--cours', 'stss'])).toBe(COURS_BANQUE.stss);
    expect(() => lireCoursArgument(['3', '--cours', 'svt'])).toThrow('cours inconnu : svt (attendu bph ou stss)');
  });
});
```

Dans `verifier.test.ts` :
- une banque `stss` de 150 questions conformes, avec les sources `stss:ch1:banque:001…150` et les quotas de 150, passe avec `COURS_BANQUE.stss` ;
- la même banque est refusée avec la config `bph` (source invalide) ;
- une source `bph:` dans une banque `stss` est refusée : `source invalide : bph:ch1:banque:001 (attendu stss:ch1:banque:NNN)` ;
- tous les tests existants passent sans changement, ce qui prouve la compatibilité.

La fabrique de test reçoit un paramètre `(total, prefixe)`.

- [ ] **Step 2 : vérifier l'échec.** Puis **Step 3 : implémenter.** Les constantes `QUOTAS_TYPES` et `QUOTAS_DIFFICULTE` restent exportées et valent `quotasPour(130)`. Les scripts lisent la config par `lireCoursArgument(process.argv.slice(2))` et utilisent `config.fichier`, `banques/${config.nom}-chN.json` et `config.prefixe`. Les messages d'usage mentionnent `[--cours stss]`.
- [ ] **Step 4 : vérifier.** Lancer `npm test && npm run typecheck && npm run lint`, puis `for n in 1 2 3 4 5 6 7; do npm run banque:verifier -- $n; done` : les 7 banques BPH restent conformes.
- [ ] **Step 5 : commit** « Rend les outils de banque utilisables pour plusieurs cours ».

---

### Task 2 : programme officiel et plan des chapitres (arrêt 1)

**Files :** create `contenu/1re-st2s/programmes/stss-1re.md`, `contenu/1re-st2s/programmes/stss-1re-plan.md`.

- [ ] **Step 1 : récupérer le programme.** Chercher le programme de l'enseignement de spécialité STSS de la classe de 1re, série ST2S (arrêté et Bulletin officiel de la réforme du lycée de 2019). Récupérer la page officielle ou le PDF depuis `eduscol.education.fr`, `education.gouv.fr` ou `legifrance.gouv.fr`. Noter dans `stss-1re.md` :
  - la référence exacte : texte, BO, date, URL ;
  - la **structure** du programme : pôles thématiques, questions, notions, capacités, reprise fidèlement des intitulés officiels ;
  - aucune reformulation qui ajoute du contenu.

  Si aucune source officielle n'est accessible, **arrêter la tâche** avec le statut BLOCKED et dire ce qui a été tenté.
- [ ] **Step 2 : plan des chapitres** (`stss-1re-plan.md`), de 6 à 9 chapitres. Pour chacun :
  - numéro et titre, titre court, durée indicative ;
  - notions du programme couvertes, citées avec leur intitulé officiel ;
  - 3 à 6 objectifs (« Je sais… ») ;
  - 4 à 7 sections prévues, avec leur titre et deux lignes de contenu prévu.
- [ ] **Step 3 : table de correspondance.** Chaque notion du programme renvoie au ou aux chapitres qui la traitent, et chaque chapitre renvoie aux notions qu'il couvre. Les notions non couvertes doivent être en nombre nul. Si une notion est volontairement laissée de côté, le dire et expliquer pourquoi.
- [ ] **Step 4 : commit** « Ajoute le programme officiel de STSS et le plan des chapitres ».
- [ ] **Step 5 : revue Opus**, faite par le contrôleur. Elle contrôle :
  - la fidélité au programme, en comparant avec la source ;
  - la couverture complète ;
  - la progression ;
  - le niveau.
- [ ] **Step 6 : ARRÊT 1.** Le contrôleur présente le plan à l'enseignant et attend sa validation. Les changements demandés sont faits dans `stss-1re-plan.md` (commit), puis on passe à la tâche 3.

---

### Task 3 : chapitre N du cours (N = 1, arrêt 2, puis N = 2 à la fin, arrêt 3)

**Files :**
- `contenu/1re-st2s/stss.json` : créé au chapitre 1, puis complété à chaque chapitre ;
- `contenu/1re-st2s/banques/stss-chN-cours-relecture.md`.

- [ ] **Step 1 : rédaction (sous-agent Opus).** À partir de `stss-1re-plan.md` (chapitre N) et de `stss-1re.md`, rédiger le chapitre N au format JSON du guide :
  - `slug` `chN`, `numero`, `titre`, `titre_court`, `duree`, `resume`, `chapeau`, `objectifs`, `sections` (`id`, `titre`, `html`), `a_retenir`, et `questions: []` ;
  - au chapitre 1, créer `stss.json` avec l'identité de la décision 3 ;
  - suivre les règles de la spec § 5 « Rédaction » : ton, définitions, pas de figure, chiffres et institutions seulement s'ils sont vérifiables ;
  - longueur visée : comparable à un chapitre de BPH (`npm run -s banque:texte -- 1` donne un ordre de grandeur, environ 10 000 caractères).

  Valider le fichier avec le validateur d'import : un script tsx temporaire sous `.superpowers/`, ou `npm run import:contenu -- contenu/1re-st2s/stss.json --garder-statuts` sur la base locale, qui valide avant d'importer.
- [ ] **Step 2 : relecture (second sous-agent Opus, indépendant).** Vérifier :
  - la conformité au programme et au plan : toutes les notions du chapitre traitées, rien hors programme ;
  - l'exactitude : définitions, institutions et dispositifs, en signalant tout ce qui peut avoir changé récemment ;
  - le niveau, la clarté, le format et la typographie.

  Corriger directement. Écrire `stss-chN-cours-relecture.md` avec trois parties : corrections (tableau), points de doute pour l'enseignant, et éléments datés à vérifier avant publication.
- [ ] **Step 3 : import non publié.** Lancer `npm run import:contenu -- contenu/1re-st2s/stss.json --garder-statuts`, **sans** `--publier`. Le bilan attendu au premier import est le cours créé avec ses chapitres. Un second import ne change rien. Le cours reste non publié.
- [ ] **Step 4 : commit** « Rédige le chapitre N du cours de STSS ». Il contient `stss.json` et le rapport de relecture.
- [ ] **Step 5 : revue Sonnet.** Elle vérifie :
  - le format ;
  - la correspondance avec le plan ;
  - l'absence de chiffre non sourcé ;
  - la typographie ;
  - la cohérence du rapport ;
  - que le cours est non publié.
- [ ] **Pour N = 1 : ARRÊT 2.** L'enseignant lit le chapitre 1 dans l'aperçu admin. Ses remarques sont reportées dans la spec § 5 (commit) avant N = 2.
- [ ] **Après le dernier chapitre : ARRÊT 3.** L'enseignant valide le cours entier ou demande des reprises, chapitre par chapitre, avec la même chaîne.
- [ ] **Test e2e**, ajouté une fois au chapitre 1 dans `e2e/stss.spec.ts` : un élève de 1re ST2S ne voit pas le cours de STSS dans sa liste tant qu'il n'est pas publié. L'admin le voit dans le suivi du contenu, avec l'étiquette « Non publié ».

---

### Task 4 : banque du chapitre N (après l'arrêt 3)

On applique la procédure des tâches 5 à 11 du plan 6a (`docs/superpowers/plans/2027-01-05-etape-6a-banques-bph.md`), avec `--cours stss` sur chaque commande :
- **Rédaction Sonnet** : `contenu/1re-st2s/banques/stss-chN.json`, 150 questions, sources `stss:chN:banque:001…150`, quotas de 150 (décision 1), 5 à 12 notions ;
- **Contrôle** : `npm run banque:verifier -- N --cours stss` ;
- **Relecture Opus** contre le texte du chapitre (`npm run -s banque:texte -- N --cours stss`), avec un rapport `stss-chN-relecture.md` ;
- **Fusion et import** : `npm run banque:fusionner -- N --cours stss`, puis `npm run import:contenu -- contenu/1re-st2s/stss.json --garder-statuts`. Bilan attendu : `cree 150`, puis 0 au second import ;
- **Revue Sonnet** : un échantillon de 20 questions, plus tous les points de doute.

Les chapitres peuvent avancer en parallèle pour la rédaction et la relecture. La fusion et l'import restent séquentiels.

---

### Task 5 : bilan et revue finale

- [ ] Vérification complète : `npm run db:reset && npm run test:db && npm test && npm run typecheck && npm run lint && npm run build && npm run e2e`. Après la remise à zéro, réimporter BPH et STSS avec `--garder-statuts`, puis lancer `npm run configurer:envoi`.
- [ ] Rédiger `docs/superpowers/plans/2027-01-26-etape-6b-bilan.md`, sur le modèle du bilan 6a :
  - un tableau par chapitre (taille du texte, corrections à la relecture du cours, questions gardées, corrigées et remplacées) ;
  - la source officielle du programme ;
  - les éléments datés à vérifier avant publication ;
  - les limites (spec § 9).
- [ ] Mettre à jour la feuille de route (6b « Terminé ») et le README (`--cours`).
- [ ] Commit « Ajoute le bilan de l'étape 6b ». Ensuite, revue finale Opus, faite par le contrôleur.
