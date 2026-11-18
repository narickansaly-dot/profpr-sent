# Validation HGGSP, chapitre 2 : Avancées et reculs des démocraties ; l'Union européenne et la démocratie

Rapport produit le 17 novembre 2026 sur `contenu/1re-gen/hggsp.json` et `contenu/1re-gen/banques/hggsp-ch2.json`.

## Cours

- 5 sections (tocqueville, chili, transitions, ue-institutions, ue-contestations), une zone « Je retiens », 5 objectifs, durée indiquée : 12 heures.
- 12777 caractères de HTML ; `nettoyerHtml` ne retire rien (contrôle `cours` du pilote : il ajoute seulement `tabindex="0"` aux tableaux défilants, ce qui est normal).

## Banque

- `verifierBanque` (configuration `{ prefixe: 'hggsp', total: 150 }`, comparée au cours sans les questions du chapitre) : « Banque du chapitre 2 conforme : 150 questions. »
- 150 questions dans le cours, identiques à celles de la banque (type, énoncé, propositions, réponses, explication, difficulté, notion).
- Types : 75 QCM à une réponse, 30 QCM à plusieurs réponses, 30 vrai/faux (16 vrais, 14 faux), 15 réponses courtes.
- Difficultés : 60 / 60 / 30.
- Position de la bonne réponse des QCM à une réponse : 19 / 19 / 19 / 18 ; bonne réponse la plus longue dans 26 cas sur 75 (35 %).
- Notions (9) : Tocqueville et l'égalité des conditions (14); Les dangers de la démocratie (15); Le Chili d'Allende (17); Le coup d'État de 1973 au Chili (17); La révolution des Œillets (17); La transition espagnole (20); Les institutions de l'UE (17); Démocratie représentative et déléguée (13); L'UE remise en question (20).

## Relecture et statut

- Relecture indépendante à l'aveugle : voir `banques/hggsp-ch2-relecture.md`.
- Statuts dans le cours : 150 `valide`.

## Import à blanc

`analyserImport` accepte le cours entier et `versDonneesCours` construit la charge utile `importer_cours` sans erreur (voir `hggsp-bilan.md`). Aucune base n'a été contactée.
