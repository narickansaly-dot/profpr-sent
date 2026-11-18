# Validation HGGSP, chapitre 9 : États et religions aujourd'hui ; pouvoir et religion, des liens historiques

Rapport produit le 17 novembre 2026 sur `contenu/1re-gen/hggsp.json` et `contenu/1re-gen/banques/hggsp-ch9.json`.

## Cours

- 5 sections (regimes, libertes, charlemagne, basileus, calife), une zone « Je retiens », 6 objectifs, durée indiquée : 12 heures.
- 28366 caractères de HTML ; `nettoyerHtml` ne retire rien (contrôle `cours` du pilote : il ajoute seulement `tabindex="0"` aux tableaux défilants, ce qui est normal).

## Banque

- `verifierBanque` (configuration `{ prefixe: 'hggsp', total: 150 }`, comparée au cours sans les questions du chapitre) : « Banque du chapitre 9 conforme : 150 questions. »
- 150 questions dans le cours, identiques à celles de la banque (type, énoncé, propositions, réponses, explication, difficulté, notion).
- Types : 75 QCM à une réponse, 30 QCM à plusieurs réponses, 30 vrai/faux (15 vrais, 15 faux), 15 réponses courtes.
- Difficultés : 60 / 60 / 30.
- Position de la bonne réponse des QCM à une réponse : 19 / 19 / 19 / 18 ; bonne réponse la plus longue dans 21 cas sur 75 (28 %).
- Notions (9) : Les modèles de relations États-religions (16); Laïcité et séparation (17); Concordat et Églises établies (19); Théocraties et religions officielles (16); Libertés de conscience et de religion (18); Les Carolingiens et la papauté (16); Le couronnement impérial de l'an 800 (16); L'empereur byzantin et l'Église (16); Le calife et la comparaison (16).

## Relecture et statut

- Relecture indépendante à l'aveugle : voir `banques/hggsp-ch9-relecture.md`.
- Statuts dans le cours : 150 `valide`.

## Import à blanc

`analyserImport` accepte le cours entier et `versDonneesCours` construit la charge utile `importer_cours` sans erreur (voir `hggsp-bilan.md`). Aucune base n'a été contactée.
