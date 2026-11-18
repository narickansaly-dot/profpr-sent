# Validation HGGSP, chapitre 10 : Une inégale sécularisation ; État et religions en Inde

Rapport produit le 17 novembre 2026 sur `contenu/1re-gen/hggsp.json` et `contenu/1re-gen/banques/hggsp-ch10.json`.

## Cours

- 6 sections (secularisation, turquie, etats-unis, secularisme-inde, minorites, inde-pakistan), une zone « Je retiens », 6 objectifs, durée indiquée : 12 heures.
- 34189 caractères de HTML ; `nettoyerHtml` ne retire rien (contrôle `cours` du pilote : il ajoute seulement `tabindex="0"` aux tableaux défilants, ce qui est normal).

## Banque

- `verifierBanque` (configuration `{ prefixe: 'hggsp', total: 150 }`, comparée au cours sans les questions du chapitre) : « Banque du chapitre 10 conforme : 150 questions. »
- 150 questions dans le cours, identiques à celles de la banque (type, énoncé, propositions, réponses, explication, difficulté, notion).
- Types : 75 QCM à une réponse, 30 QCM à plusieurs réponses, 30 vrai/faux (15 vrais, 15 faux), 15 réponses courtes.
- Difficultés : 60 / 60 / 30.
- Position de la bonne réponse des QCM à une réponse : 19 / 19 / 19 / 18 ; bonne réponse la plus longue dans 13 cas sur 75 (17 %).
- Notions (9) : Sécularisation et laïcité (13); La fin du califat ottoman (18); La laïcité kémaliste et ses évolutions (18); Le cadre constitutionnel américain (16); Religion et vie politique américaine (19); Le sécularisme indien (17); Le nationalisme hindou (16); Les minorités religieuses en Inde (19); L'Inde et le Pakistan (14).

## Relecture et statut

- Relecture indépendante à l'aveugle : voir `banques/hggsp-ch10-relecture.md`.
- Statuts dans le cours : 150 `valide`.

## Import à blanc

`analyserImport` accepte le cours entier et `versDonneesCours` construit la charge utile `importer_cours` sans erreur (voir `hggsp-bilan.md`). Aucune base n'a été contactée.
