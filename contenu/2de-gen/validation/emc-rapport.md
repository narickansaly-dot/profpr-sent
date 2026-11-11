# Rapport de validation : cours d'EMC de seconde générale

Date : 10 novembre 2026. Fichiers validés : `contenu/2de-gen/emc.json` et `contenu/2de-gen/banques/emc-ch1.json` à `emc-ch6.json`.

## Résultat

| Contrôle | Outil | Résultat |
| --- | --- | --- |
| Format du cours (schéma d'import de l'application) | `analyserImport` (`src/lib/contenu/lire-import.ts`), le validateur de `npm run import:contenu` et de `/admin/import` | **valide** : 6 chapitres, 30 sections, 900 questions |
| Couleur `#1d4ed8` contre le blanc | `contraste` et `couleurCoursAcceptable` (`src/lib/contenu/couleur.ts`) | **6,70:1** (minimum 4,5:1) |
| HTML des sections et des « Je retiens » | `nettoyerHtml` (`src/lib/contenu/html.ts`) | **rien de retiré** ; le nettoyage ajoute seulement `tabindex="0"` aux tableaux défilants (même effet sur STSS) |
| Banques, 17 règles de `banque:verifier` | `verifierBanque` (`src/lib/contenu/banque/verifier.ts`), préfixe `emc`, 150 questions par chapitre (quotas 75 / 30 / 30 / 15 et 60 / 60 / 30, tolérance 3) | **conformes** : chapitres 1 à 6 |
| Fusion dans le cours | `fusionnerBanque` (`src/lib/contenu/banque/fusionner.ts`) | 6 × 150 questions ajoutées au statut `a_relire` ; un second passage n'ajoute rien (fusion rejouable) |
| Import à blanc | `versDonneesCours` (`src/lib/contenu/donnees-question.ts`), la transformation que fait `npm run import:contenu` avant d'appeler la base | **réussi** : charge utile de 609 686 octets (fichier : 709 395 octets, limite d'import : 3 Mo) |
| Import réel dans la base locale | `npm run import:contenu` | **non lancé** : le script n'a pas de mode à blanc et écrit dans la base (voir plus bas) |
| Typographie et tutoiement | script ponctuel (expressions régulières) | aucune espace ordinaire avant « : ; ! ? » ni après « ; aucune entité `&nbsp;` ; aucun « vous » |

## Répartition des questions

| Chapitre | QCM unique | QCM multiple | Vrai/faux | Réponse courte | Difficulté 1 / 2 / 3 | Vrai / faux |
| --- | --- | --- | --- | --- | --- | --- |
| 1. État de droit | 75 | 30 | 30 | 15 | 59 / 62 / 29 | 15 / 15 |
| 2. Laïcité | 75 | 30 | 30 | 15 | 59 / 61 / 30 | 15 / 15 |
| 3. Nouveaux droits | 75 | 30 | 30 | 15 | 59 / 58 / 33 | 15 / 15 |
| 4. Liberté de la presse | 75 | 30 | 30 | 15 | 58 / 61 / 31 | 16 / 14 |
| 5. Information numérique | 75 | 30 | 30 | 15 | 58 / 62 / 30 | 15 / 15 |
| 6. Environnement | 75 | 30 | 30 | 15 | 57 / 60 / 33 | 17 / 13 |
| **Total** | 450 | 180 | 180 | 90 | 350 / 364 / 186 | 93 / 87 |

Toutes les questions sont au statut `a_relire` : aucune n'est tirée dans un quiz tant que l'enseignant ne l'a pas validée.

## Sortie des contrôles

```text
Cours valide : emc-2de-gen GEN 2de EMC #1d4ed8 contraste 6.70 true
  chapitre 1 État de droit sections 5 questions 150 {"a_relire":150}
  chapitre 2 Laïcité sections 5 questions 150 {"a_relire":150}
  chapitre 3 Nouveaux droits sections 5 questions 150 {"a_relire":150}
  chapitre 4 Liberté de la presse sections 4 questions 150 {"a_relire":150}
  chapitre 5 Information numérique sections 5 questions 150 {"a_relire":150}
  chapitre 6 Environnement sections 6 questions 150 {"a_relire":150}
Import à blanc (versDonneesCours) : slug,filiere,niveau,matiere,titre,couleur,chapitres taille 609686 octets ; fichier 709395 octets
HTML modifié par le nettoyage (hors tabindex ajouté aux tableaux) : 0
Banque du chapitre 1 conforme : 150 questions.
Banque du chapitre 2 conforme : 150 questions.
Banque du chapitre 3 conforme : 150 questions.
Banque du chapitre 4 conforme : 150 questions.
Banque du chapitre 5 conforme : 150 questions.
Banque du chapitre 6 conforme : 150 questions.
Banque du chapitre 1 conforme : 150 questions.
Chapitre 1 : 0 questions ajoutées.
Banque du chapitre 2 conforme : 150 questions.
Chapitre 2 : 0 questions ajoutées.
Banque du chapitre 3 conforme : 150 questions.
Chapitre 3 : 0 questions ajoutées.
Banque du chapitre 4 conforme : 150 questions.
Chapitre 4 : 0 questions ajoutées.
Banque du chapitre 5 conforme : 150 questions.
Chapitre 5 : 0 questions ajoutées.
Banque du chapitre 6 conforme : 150 questions.
Chapitre 6 : 0 questions ajoutées.
```

## Pourquoi pas les commandes `npm run banque:*` ni `import:contenu`

- `banque:texte`, `banque:verifier` et `banque:fusionner` ne connaissent que deux cours, codés en dur dans `src/lib/contenu/banque/cours.ts` (`bph` et `stss`, tous deux dans `contenu/1re-st2s/`), et lisent les banques dans `contenu/1re-st2s/banques/`. La consigne interdisant de modifier le code et les scripts, la validation a appelé **les mêmes fonctions de la bibliothèque** depuis un petit script placé hors du dépôt (recopié ci-dessous), avec la configuration `{ prefixe: 'emc', total: 150, fichier: 'contenu/2de-gen/emc.json' }`. Les règles appliquées sont donc exactement celles de `banque:verifier`.
- `import:contenu` n'a pas d'option « à blanc » : il appelle directement la fonction `importer_cours` de la base. L'import à blanc s'est donc arrêté à la transformation `versDonneesCours`, dernière étape avant la base. Ce qui reste à vérifier en base : l'existence de la filière `GEN` et du niveau `2de` (présents dans `supabase/seed.sql`) et l'unicité du slug `emc-2de-gen`.

### Changements de scripts à prévoir (non faits ici)

1. `src/lib/contenu/banque/cours.ts` : ajouter le cours `emc` (`{ nom: 'emc', fichier: 'contenu/2de-gen/emc.json', prefixe: 'emc', total: 150 }`), ou mieux, accepter un chemin de cours quelconque.
2. `scripts/verifier-banque.ts`, `scripts/fusionner-banque.ts` : lire les banques à côté du fichier du cours (`<dossier du cours>/banques/<nom>-chN.json`) au lieu de `contenu/1re-st2s/banques/`.
3. `scripts/importer-contenu.ts` : une option `--a-blanc` qui valide, transforme et affiche le résumé sans appeler la base.

Ces trois changements concernent aussi les autres matières de seconde produites en parallèle.

### Script de validation utilisé

À lancer depuis la racine du dépôt (`npx tsx <fichier> valider`, `verifier N`, `fusionner N` ou `texte N`) :

```ts
import { readFileSync, writeFileSync } from 'node:fs';
import { analyserImport } from './src/lib/contenu/lire-import';
import { schemaQuestionImport, type CoursImport } from './src/lib/contenu/format-import';
import { schemaFichierBanque } from './src/lib/contenu/banque/format';
import { verifierBanque } from './src/lib/contenu/banque/verifier';
import { fusionnerBanque, serialiserCours } from './src/lib/contenu/banque/fusionner';
import { texteChapitre } from './src/lib/contenu/banque/texte';
import { versDonneesCours } from './src/lib/contenu/donnees-question';
import { contraste, couleurCoursAcceptable } from './src/lib/contenu/couleur';
import { nettoyerHtml } from './src/lib/contenu/html';

const COURS = 'contenu/2de-gen/emc.json';
const config = { nom: 'stss' as const, fichier: COURS, prefixe: 'emc', total: 150 };
const [cmd, nStr] = process.argv.slice(2);
const n = Number(nStr);
const texte = readFileSync(COURS, 'utf8');
const lu = analyserImport(texte);
if ('erreurs' in lu) { for (const e of lu.erreurs) console.error('  ' + e); console.error('Cours invalide'); process.exit(1); }
if (cmd === 'valider') {
  const c = lu.cours;
  console.log('Cours valide :', c.slug, c.filiere, c.niveau, c.matiere, c.couleur, 'contraste', contraste(c.couleur, '#ffffff').toFixed(2), couleurCoursAcceptable(c.couleur));
  let retire = 0;
  for (const ch of c.chapitres) {
    for (const s of ch.sections) { const net = nettoyerHtml(s.html).replaceAll(' tabindex="0"', ''); if (net !== s.html) { retire++; console.log('  nettoyage modifie', ch.numero, s.id); } }
    if (ch.a_retenir && nettoyerHtml(ch.a_retenir).replaceAll(' tabindex="0"', '') !== ch.a_retenir) { retire++; console.log('  nettoyage modifie a_retenir', ch.numero); }
    const st: Record<string, number> = {};
    for (const q of ch.questions) st[q.statut ?? 'a_relire'] = (st[q.statut ?? 'a_relire'] ?? 0) + 1;
    console.log('  chapitre', ch.numero, ch.titre_court, 'sections', ch.sections.length, 'questions', ch.questions.length, JSON.stringify(st));
  }
  const d = versDonneesCours(c, { garderStatuts: true });
  console.log('Import à blanc (versDonneesCours) :', Object.keys(d).join(','), 'taille', Buffer.byteLength(JSON.stringify(d)), 'octets ; fichier', Buffer.byteLength(texte), 'octets');
  console.log('HTML modifié par le nettoyage (hors tabindex ajouté aux tableaux) :', retire);
} else if (cmd === 'texte') {
  process.stdout.write(texteChapitre(lu.cours, n));
} else if (cmd === 'verifier' || cmd === 'fusionner') {
  const chemin = `contenu/2de-gen/banques/emc-ch${n}.json`;
  const f = schemaFichierBanque.safeParse(JSON.parse(readFileSync(chemin, 'utf8')));
  if (!f.success) { console.error(f.error.issues); process.exit(1); }
  const existantes = lu.cours.chapitres.find((c) => c.numero === n)?.questions ?? [];
  const erreurs = verifierBanque(f.data, existantes, config as never);
  if (erreurs.length) { for (const e of erreurs) console.error('  ' + e); console.error(`Banque du chapitre ${n} non conforme : ${erreurs.length} erreurs.`); process.exit(1); }
  console.log(`Banque du chapitre ${n} conforme : ${f.data.questions.length} questions.`);
  if (cmd === 'fusionner') {
    const brut = JSON.parse(texte) as CoursImport;
    const qs = f.data.questions.map((q) => schemaQuestionImport.parse(q));
    const fusion = fusionnerBanque(brut, { ...f.data, questions: qs });
    const avant = brut.chapitres.find((c) => c.numero === n)!.questions.length;
    const apres = fusion.chapitres.find((c) => c.numero === n)!.questions.length;
    writeFileSync(COURS, serialiserCours(fusion));
    console.log(`Chapitre ${n} : ${apres - avant} questions ajoutées.`);
  }
}
```
