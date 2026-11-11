# Validation du cours de SVT de seconde générale

Rapport des contrôles automatiques passés le 11 novembre 2026 sur `contenu/2de-gen/svt.json` et les douze banques `contenu/2de-gen/banques/svt-chN.json`.

## Outillage utilisé

Les scripts du dépôt (`npm run banque:texte`, `banque:verifier`, `banque:fusionner`) n'acceptent que `--cours bph` ou `--cours stss`, avec des chemins figés sous `contenu/1re-st2s/` (fonction `lireCoursArgument` de `src/lib/contenu/banque/cours.ts`). Ils ne peuvent donc pas viser `contenu/2de-gen/svt.json` sans modification, et la consigne interdisait de modifier les scripts.

Les contrôles ont été faits par un petit pilote externe au dépôt, qui appelle **les mêmes fonctions** que les scripts, sans les modifier :

| Contrôle | Fonction du dépôt appelée | Équivalent npm |
| --- | --- | --- |
| validation du fichier du cours | `analyserImport` (`src/lib/contenu/lire-import.ts`) | début de `import:contenu` |
| contrôle d'une banque (17 règles) | `verifierBanque` avec un total de 150 questions | `banque:verifier -- N --cours stss` |
| fusion d'une banque au statut `a_relire` | `fusionnerBanque`, `serialiserCours` | `banque:fusionner -- N --cours stss` |
| texte brut d'un chapitre (relecture) | `texteChapitre` | `banque:texte -- N` |
| nettoyage HTML | `nettoyerHtml` (`src/lib/contenu/html.ts`) | nettoyage fait à l'enregistrement et à l'affichage |
| contraste de la couleur | `contraste`, `couleurCoursAcceptable` (`src/lib/contenu/couleur.ts`) | règle de l'import |
| import à blanc | `versDonneesCours` (`src/lib/contenu/donnees-question.ts`) | charge utile envoyée à `importer_cours` |

Le pilote est conservé dans le dossier de notes partagé des sessions (`pilote-banques-svt.ts`), pour les autres matières de seconde.

**Évolution de script à proposer** (non faite ici) : ajouter les cours de seconde à `COURS_BANQUE` et dériver le dossier des banques du chemin du fichier du cours, pour que `npm run banque:verifier -- N --cours svt` fonctionne directement.

## Résultats

### Fichier du cours

```text
Cours svt-2de-gen (GEN, 2de, SVT) : 12 chapitres, 1288118 octets (3 Mo au plus).
Couleur #15803d : contraste 5.02:1 avec le blanc, acceptée.
  ch1 Cellules spécialisées : 6 sections, 150 questions {"a_relire":150}
  ch2 Métabolisme : 5 sections, 150 questions {"a_relire":150}
  ch3 Échelles de la biodiversité : 5 sections, 150 questions {"a_relire":150}
  ch4 Biodiversité dans le temps : 5 sections, 150 questions {"a_relire":150}
  ch5 Évolution : 7 sections, 150 questions {"a_relire":150}
  ch6 Érosion : 5 sections, 150 questions {"a_relire":150}
  ch7 Sédimentation : 6 sections, 150 questions {"a_relire":150}
  ch8 Agrosystèmes : 7 sections, 150 questions {"a_relire":150}
  ch9 Sexe et sexualité : 6 sections, 150 questions {"a_relire":150}
  ch10 Procréation : 6 sections, 150 questions {"a_relire":150}
  ch11 Agents pathogènes : 6 sections, 150 questions {"a_relire":150}
  ch12 Microbiote : 6 sections, 150 questions {"a_relire":150}
Nettoyage HTML : rien n'est retiré.
Import à blanc : charge utile importer_cours construite (1088078 octets) ; aucune base contactée.
```

- `analyserImport` accepte le fichier : aucune erreur.
- Couleur `#15803d` : contraste 5,02:1 avec le blanc, au-dessus du minimum de 4,5:1.
- Nettoyage HTML : le nettoyage n'ajoute que `tabindex="0"` sur les blocs défilants (`.tbl`, `.scroll`) et réécrit les balises SVG auto-fermantes ; aucun contenu n'est retiré.
- 1800 questions, sources toutes uniques (`svt:chN:banque:NNN`), toutes au statut `a_relire`.

### Banques

```text
Banque du chapitre 1 conforme : 150 questions.
Banque du chapitre 2 conforme : 150 questions.
…
Banque du chapitre 12 conforme : 150 questions.
```

Les douze banques sont conformes aux 17 règles de `verifierBanque` (validateur d'import, sources, répartitions 75 / 30 / 30 / 15 et 60 / 60 / 30, notions, propositions interdites, qcm_multiple à 2 ou 3 bonnes réponses avec la mention « Coche toutes les réponses exactes. », biais de position et de longueur, énoncés trop proches, équilibre des vrai/faux, espaces insécables).

| Chapitre | Notions | Bonne réponse la plus longue (qcm_unique) | Positions des bonnes réponses | Vrai / faux |
| --- | --- | --- | --- | --- |
| 1 | 9 | 14 / 75 | 19 / 19 / 19 / 18 | 15 / 15 |
| 2 | 9 | 27 / 75 | 19 / 19 / 19 / 18 | 16 / 14 |
| 3 | 10 | 24 / 75 | 19 / 19 / 19 / 18 | 16 / 14 |
| 4 | 9 | 26 / 75 | 19 / 19 / 19 / 18 | 15 / 15 |
| 5 | 9 | 26 / 75 | 19 / 19 / 19 / 18 | 15 / 15 |
| 6 | 9 | 27 / 75 | 19 / 19 / 19 / 18 | 15 / 15 |
| 7 | 9 | 25 / 75 | 19 / 19 / 19 / 18 | 16 / 14 |
| 8 | 9 | 21 / 75 | 19 / 19 / 19 / 18 | 15 / 15 |
| 9 | 9 | 26 / 75 | 19 / 19 / 19 / 18 | 16 / 14 |
| 10 | 9 | 22 / 75 | 19 / 19 / 19 / 18 | 16 / 14 |
| 11 | 9 | 25 / 75 | 19 / 19 / 19 / 18 | 15 / 15 |
| 12 | 9 | 25 / 75 | 19 / 19 / 19 / 18 | 17 / 13 |

### Tests du dépôt

`npx vitest run src/lib/contenu` : 209 tests passés. Aucun fichier de code n'a été modifié.

## Ce qui n'a pas pu être vérifié

- **Import réel en base** : le worktree n'a pas de `.env.local` et aucune base Supabase locale n'a été lancée. L'import à blanc construit la charge utile de `importer_cours` sans l'envoyer. À faire avant publication :

```bash
npm run import:contenu -- contenu/2de-gen/svt.json
```

- **Affichage dans l'application** : le rendu des pages (tableaux, figures SVG) n'a pas été vérifié dans un navigateur.
- **Relecture humaine** : les questions restent `a_relire` ; les points de doute sont listés dans chaque `banques/svt-chN-relecture.md`.
