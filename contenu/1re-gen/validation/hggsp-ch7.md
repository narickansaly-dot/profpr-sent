# Validation HGGSP, chapitre 7 : S'informer aujourd'hui ; les révolutions techniques de l'information

Rapport produit le 17 novembre 2026 sur `contenu/1re-gen/hggsp.json` et `contenu/1re-gen/banques/hggsp-ch7.json`.

## Cours

- 6 sections (medias-aujourdhui, notions-cles, pratiques, imprime, son-image, internet), une zone « Je retiens », 6 objectifs, durée indiquée : 12 heures.
- 35838 caractères de HTML ; `nettoyerHtml` ne retire rien (contrôle `cours` du pilote : il ajoute seulement `tabindex="0"` aux tableaux défilants, ce qui est normal).

## Banque

- `verifierBanque` (configuration `{ prefixe: 'hggsp', total: 150 }`, comparée au cours sans les questions du chapitre) : « Banque du chapitre 7 conforme : 150 questions. »
- 150 questions dans le cours, identiques à celles de la banque (type, énoncé, propositions, réponses, explication, difficulté, notion).
- Types : 75 QCM à une réponse, 30 QCM à plusieurs réponses, 30 vrai/faux (15 vrais, 15 faux), 15 réponses courtes.
- Difficultés : 60 / 60 / 30.
- Position de la bonne réponse des QCM à une réponse : 19 / 19 / 19 / 18 ; bonne réponse la plus longue dans 22 cas sur 75 (29 %).
- Notions (10) : Les médias d'information aujourd'hui (15); Fait, opinion, source et EMI (15); Des pratiques différenciées (15); L'imprimerie de Gutenberg (15); De la Gazette à la loi de 1881 (15); La presse à grand tirage (15); La radio au XXe siècle (15); Télévision et information en continu (15); Naissance d'Internet et du Web (15); Réseaux sociaux et algorithmes (15).

## Relecture et statut

- Relecture indépendante à l'aveugle : voir `banques/hggsp-ch7-relecture.md`.
- Statuts dans le cours : 150 `valide`.

## Import à blanc

`analyserImport` accepte le cours entier et `versDonneesCours` construit la charge utile `importer_cours` sans erreur (voir `hggsp-bilan.md`). Aucune base n'a été contactée.
