# Validation HGGSP, chapitre 6 : Les frontières en débat ; les frontières de l'Union européenne

Rapport produit le 17 novembre 2026 sur `contenu/1re-gen/hggsp.json` et `contenu/1re-gen/banques/hggsp-ch6.json`.

## Cours

- 7 sections (pologne-guerre, pologne-diplomatie, droit-mer, mers-litiges, schengen, pologne-ue, transfrontalier), une zone « Je retiens », 6 objectifs, durée indiquée : 12 heures.
- 29675 caractères de HTML ; `nettoyerHtml` ne retire rien (contrôle `cours` du pilote : il ajoute seulement `tabindex="0"` aux tableaux défilants, ce qui est normal).

## Banque

- `verifierBanque` (configuration `{ prefixe: 'hggsp', total: 150 }`, comparée au cours sans les questions du chapitre) : « Banque du chapitre 6 conforme : 150 questions. »
- 150 questions dans le cours, identiques à celles de la banque (type, énoncé, propositions, réponses, explication, difficulté, notion).
- Types : 75 QCM à une réponse, 30 QCM à plusieurs réponses, 30 vrai/faux (15 vrais, 15 faux), 15 réponses courtes.
- Difficultés : 60 / 60 / 30.
- Position de la bonne réponse des QCM à une réponse : 19 / 19 / 19 / 18 ; bonne réponse la plus longue dans 19 cas sur 75 (25 %).
- Notions (10) : Le partage de la Pologne en 1939 (13); Le déplacement de la Pologne (1945) (16); Les déplacements de populations (10); La reconnaissance de la frontière (20); Les espaces maritimes (20); Litiges et protection de la haute mer (15); L'espace Schengen (15); Migrations et frontières extérieures (16); Les frontières de la Pologne (13); Les espaces transfrontaliers (12).

## Relecture et statut

- Relecture indépendante à l'aveugle : voir `banques/hggsp-ch6-relecture.md`.
- Statuts dans le cours : 150 `valide`.

## Import à blanc

`analyserImport` accepte le cours entier et `versDonneesCours` construit la charge utile `importer_cours` sans erreur (voir `hggsp-bilan.md`). Aucune base n'a été contactée.
