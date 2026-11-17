# Validation HGGSP, chapitre 8 : Liberté ou contrôle de l'information ; l'information à l'heure d'Internet

Rapport produit le 17 novembre 2026 sur `contenu/1re-gen/hggsp.json` et `contenu/1re-gen/banques/hggsp-ch8.json`.

## Cours

- 6 sections (dreyfus, havas-afp, vietnam, info-horizontale, lanceurs-alerte, complot), une zone « Je retiens », 6 objectifs, durée indiquée : 12 heures.
- 31233 caractères de HTML ; `nettoyerHtml` ne retire rien (contrôle `cours` du pilote : il ajoute seulement `tabindex="0"` aux tableaux défilants, ce qui est normal).

## Banque

- `verifierBanque` (configuration `{ prefixe: 'hggsp', total: 150 }`, comparée au cours sans les questions du chapitre) : « Banque du chapitre 8 conforme : 150 questions. »
- 150 questions dans le cours, identiques à celles de la banque (type, énoncé, propositions, réponses, explication, difficulté, notion).
- Types : 75 QCM à une réponse, 30 QCM à plusieurs réponses, 30 vrai/faux (15 vrais, 15 faux), 15 réponses courtes.
- Difficultés : 60 / 60 / 30.
- Position de la bonne réponse des QCM à une réponse : 19 / 19 / 19 / 18 ; bonne réponse la plus longue dans 20 cas sur 75 (27 %).
- Notions (10) : L'affaire Dreyfus (1894-1906) (15); La presse et l'opinion dans l'affaire (15); Havas et le cartel des agences (15); L'AFP, une agence indépendante (15); Le Vietnam, une guerre télévisée (15); Vietnam : révélations et mythe (15); Une information horizontale (15); Infox, ingérences et régulation (15); Lanceurs d'alerte (15); Théories du complot et EMI (15).

## Relecture et statut

- Relecture indépendante à l'aveugle : voir `banques/hggsp-ch8-relecture.md`.
- Statuts dans le cours : 150 `valide`.

## Import à blanc

`analyserImport` accepte le cours entier et `versDonneesCours` construit la charge utile `importer_cours` sans erreur (voir `hggsp-bilan.md`). Aucune base n'a été contactée.
