# Validation SVT 1re, chapitre 5 : L'expression du patrimoine génétique

## Contrôles automatiques

- Chapitre : 8 sections, 5 figure(s) SVG, 42286 caractères de HTML ; le nettoyage HTML (`nettoyerHtml`) ne retire rien.
- Banque `banques/svt-ch5.json` : conforme à `verifierBanque` (« Banque du chapitre 5 conforme : 150 questions. »), mêmes règles que `npm run banque:verifier`.
- Types : 75 qcm_unique, 30 qcm_multiple, 30 vrai_faux (15 vrais, 15 faux), 15 reponse_courte.
- Difficultés : 60 (1) / 62 (2) / 28 (3). Bonne réponse la plus longue (égalités comprises) dans 19 qcm_unique sur 75.
- Fusion dans `svt.json` (fonction `fusionnerBanque`) et import à blanc (`analyserImport` puis `versDonneesCours`) : sans erreur.

## Relecture indépendante

- Un sous-agent indépendant a résolu les 150 questions avec le seul texte du chapitre, sans voir les réponses attendues : accord 143/150, 11 remarque(s) sur des questions où il était d'accord.
- L'auteur a tranché chaque écart et chaque remarque (détail dans `banques/svt-ch5-relecture.md`) : 17 question(s) modifiée(s) ou revérifiée(s).
- Seconde vérification indépendante des questions modifiées : Les 17 questions modifiées ou contestées (`ch5-modifiees.txt`) ont été résolues à nouveau par un second relecteur indépendant, sans les réponses : **accord 17/17**. Ses remarques (variantes de 137, 145, 146) portaient sur des variantes déjà acceptées ; la 128 (code binaire) est jugée peu utile en SVT mais juste : gardée.

## Statuts

- 150 questions `valide`, 0 `a_relire`.
