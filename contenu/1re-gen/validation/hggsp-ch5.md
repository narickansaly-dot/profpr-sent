# Validation HGGSP, chapitre 5 : Les frontières dans le monde ; tracer des frontières

Rapport produit le 17 novembre 2026 sur `contenu/1re-gen/hggsp.json` et `contenu/1re-gen/banques/hggsp-ch5.json`.

## Cours

- 5 sections (definir, aujourdhui, limes, berlin, coree), une zone « Je retiens », 6 objectifs, durée indiquée : 12 heures.
- 19486 caractères de HTML ; `nettoyerHtml` ne retire rien (contrôle `cours` du pilote : il ajoute seulement `tabindex="0"` aux tableaux défilants, ce qui est normal).

## Banque

- `verifierBanque` (configuration `{ prefixe: 'hggsp', total: 150 }`, comparée au cours sans les questions du chapitre) : « Banque du chapitre 5 conforme : 150 questions. »
- 150 questions dans le cours, identiques à celles de la banque (type, énoncé, propositions, réponses, explication, difficulté, notion).
- Types : 75 QCM à une réponse, 30 QCM à plusieurs réponses, 30 vrai/faux (15 vrais, 15 faux), 15 réponses courtes.
- Difficultés : 59 / 61 / 30.
- Position de la bonne réponse des QCM à une réponse : 19 / 19 / 19 / 18 ; bonne réponse la plus longue dans 16 cas sur 75 (21 %).
- Notions (10) : Définir la frontière (15); Le vocabulaire des limites (15); Des frontières plus nombreuses (15); Frontières ouvertes et fermées (15); Les espaces transfrontaliers (15); Le limes rhénan (15); La conférence de Berlin (15); Le partage de l'Afrique et son héritage (15); La Corée coupée en deux (1945-1953) (15); La DMZ et les deux Corées aujourd'hui (15).

## Relecture et statut

- Relecture indépendante à l'aveugle : voir `banques/hggsp-ch5-relecture.md`.
- Statuts dans le cours : 150 `valide`.

## Import à blanc

`analyserImport` accepte le cours entier et `versDonneesCours` construit la charge utile `importer_cours` sans erreur (voir `hggsp-bilan.md`). Aucune base n'a été contactée.
