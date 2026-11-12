# Validation SVT 1re, chapitre 12 : L'humanité et les écosystèmes : services et gestion

## Contrôles automatiques

- Chapitre : 5 sections, 4 figure(s) SVG, 33301 caractères de HTML ; le nettoyage HTML (`nettoyerHtml`) ne retire rien.
- Banque `banques/svt-ch12.json` : conforme à `verifierBanque` (« Banque du chapitre 12 conforme : 150 questions. »), mêmes règles que `npm run banque:verifier`.
- Types : 75 qcm_unique, 30 qcm_multiple, 30 vrai_faux (15 vrais, 15 faux), 15 reponse_courte.
- Difficultés : 61 (1) / 62 (2) / 27 (3). Bonne réponse la plus longue (égalités comprises) dans 13 qcm_unique sur 75.
- Fusion dans `svt.json` (fonction `fusionnerBanque`) et import à blanc (`analyserImport` puis `versDonneesCours`) : sans erreur.

## Relecture indépendante

- Un sous-agent indépendant a résolu les 150 questions avec le seul texte du chapitre, sans voir les réponses attendues : accord 150/150, 9 remarque(s) sur des questions où il était d'accord.
- L'auteur a tranché chaque écart et chaque remarque (détail dans `banques/svt-ch12-relecture.md`) : 3 question(s) modifiée(s) ou revérifiée(s).
- Seconde vérification indépendante des questions modifiées : Les 3 questions modifiées ou revérifiées (`ch12-modifiees.txt`) ont été résolues à nouveau par un second relecteur indépendant, sans les réponses : **accord 3/3**. Aucune modification.

## Statuts

- 150 questions `valide`, 0 `a_relire`.
