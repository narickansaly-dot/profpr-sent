# Validation SVT 1re, chapitre 10 : La dynamique des zones de convergence

## Contrôles automatiques

- Chapitre : 6 sections, 6 figure(s) SVG, 54631 caractères de HTML ; le nettoyage HTML (`nettoyerHtml`) ne retire rien.
- Banque `banques/svt-ch10.json` : conforme à `verifierBanque` (« Banque du chapitre 10 conforme : 150 questions. »), mêmes règles que `npm run banque:verifier`.
- Types : 75 qcm_unique, 30 qcm_multiple, 30 vrai_faux (15 vrais, 15 faux), 15 reponse_courte.
- Difficultés : 60 (1) / 60 (2) / 30 (3). Bonne réponse la plus longue (égalités comprises) dans 30 qcm_unique sur 75.
- Fusion dans `svt.json` (fonction `fusionnerBanque`) et import à blanc (`analyserImport` puis `versDonneesCours`) : sans erreur.

## Relecture indépendante

- Un sous-agent indépendant a résolu les 150 questions avec le seul texte du chapitre, sans voir les réponses attendues : accord 150/150, 8 remarque(s) sur des questions où il était d'accord.
- L'auteur a tranché chaque écart et chaque remarque (détail dans `banques/svt-ch10-relecture.md`) : 8 question(s) modifiée(s) ou revérifiée(s).
- Seconde vérification indépendante des questions modifiées : Les 8 questions modifiées (`ch10-modifiees.txt`) ont été résolues à nouveau par un second relecteur indépendant, sans les réponses : **accord 8/8**. Ses remarques (137 « coin mantellique », 150 « serpentinite ») portaient sur des variantes déjà acceptées. Aucune modification.

## Statuts

- 150 questions `valide`, 0 `a_relire`.
