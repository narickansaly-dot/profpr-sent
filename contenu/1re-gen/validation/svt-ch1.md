# Validation SVT 1re, chapitre 1 : Les divisions cellulaires des eucaryotes

## Contrôles automatiques

- Chapitre : 6 sections, 4 figure(s) SVG, 37920 caractères de HTML ; le nettoyage HTML (`nettoyerHtml`) ne retire rien.
- Banque `banques/svt-ch1.json` : conforme à `verifierBanque` (« Banque du chapitre 1 conforme : 150 questions. »), mêmes règles que `npm run banque:verifier`.
- Types : 75 qcm_unique, 30 qcm_multiple, 30 vrai_faux (16 vrais, 14 faux), 15 reponse_courte.
- Difficultés : 60 (1) / 60 (2) / 30 (3). Bonne réponse la plus longue (égalités comprises) dans 34 qcm_unique sur 75.
- Fusion dans `svt.json` (fonction `fusionnerBanque`) et import à blanc (`analyserImport` puis `versDonneesCours`) : sans erreur.

## Relecture indépendante

- Un sous-agent indépendant a résolu les 150 questions avec le seul texte du chapitre, sans voir les réponses attendues : accord 144/150, 15 remarque(s) sur des questions où il était d'accord.
- L'auteur a tranché chaque écart et chaque remarque (détail dans `banques/svt-ch1-relecture.md`) : 18 question(s) modifiée(s) ou revérifiée(s).
- Seconde vérification indépendante des questions modifiées : Les 18 questions modifiées ou contestées lors de la relecture (`ch1-modifiees.txt`) ont été résolues à nouveau par un second relecteur indépendant, sans les réponses : **accord 18/18**. Ses remarques (variantes de 138, 141 et 145) portaient sur des variantes déjà acceptées. Aucune modification.

## Statuts

- 150 questions `valide`, 0 `a_relire`.
