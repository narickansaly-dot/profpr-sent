# Validation HGGSP, chapitre 1 : Les outils de la spécialité ; la démocratie, démocratie directe et démocratie représentative

Rapport produit le 17 novembre 2026 sur `contenu/1re-gen/hggsp.json` et `contenu/1re-gen/banques/hggsp-ch1.json`.

## Cours

- 6 sections (histoire, geographie, politique, democraties, athenes, constant), une zone « Je retiens », 6 objectifs, durée indiquée : 15 heures.
- 17048 caractères de HTML ; `nettoyerHtml` ne retire rien (contrôle `cours` du pilote : il ajoute seulement `tabindex="0"` aux tableaux défilants, ce qui est normal).

## Banque

- `verifierBanque` (configuration `{ prefixe: 'hggsp', total: 150 }`, comparée au cours sans les questions du chapitre) : « Banque du chapitre 1 conforme : 150 questions. »
- 150 questions dans le cours, identiques à celles de la banque (type, énoncé, propositions, réponses, explication, difficulté, notion).
- Types : 75 QCM à une réponse, 30 QCM à plusieurs réponses, 30 vrai/faux (15 vrais, 15 faux), 15 réponses courtes.
- Difficultés : 58 / 62 / 30.
- Position de la bonne réponse des QCM à une réponse : 19 / 19 / 19 / 18 ; bonne réponse la plus longue dans 14 cas sur 75 (19 %).
- Notions (10) : Sources de l'historien (17); Espace, territoire et échelles (10); Cartes et géopolitique (15); Le politique et le pouvoir (11); Caractéristiques des démocraties (17); Régimes autoritaires et totalitaires (14); Citoyenneté à Athènes (15); Institutions athéniennes (19); Constant et les deux libertés (16); Représentation et participation (16).

## Relecture et statut

- Relecture indépendante à l'aveugle : voir `banques/hggsp-ch1-relecture.md`.
- Statuts dans le cours : 150 `valide`.

## Import à blanc

`analyserImport` accepte le cours entier et `versDonneesCours` construit la charge utile `importer_cours` sans erreur (voir `hggsp-bilan.md`). Aucune base n'a été contactée.
