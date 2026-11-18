# Validation SVT 1re, chapitre 3 : Mutations de l'ADN et variabilité génétique

## Contrôles automatiques

- Chapitre : 8 sections, 3 figure(s) SVG, 29144 caractères de HTML ; le nettoyage HTML (`nettoyerHtml`) ne retire rien.
- Banque `banques/svt-ch3.json` : conforme à `verifierBanque` (« Banque du chapitre 3 conforme : 150 questions. »), mêmes règles que `npm run banque:verifier`.
- Types : 75 qcm_unique, 30 qcm_multiple, 30 vrai_faux (15 vrais, 15 faux), 15 reponse_courte.
- Difficultés : 62 (1) / 58 (2) / 30 (3). Bonne réponse la plus longue (égalités comprises) dans 12 qcm_unique sur 75.
- Fusion dans `svt.json` (fonction `fusionnerBanque`) et import à blanc (`analyserImport` puis `versDonneesCours`) : sans erreur.

## Relecture indépendante

- Un sous-agent indépendant a résolu les 150 questions avec le seul texte du chapitre, sans voir les réponses attendues : accord 150/150, 15 remarque(s) sur des questions où il était d'accord.
- L'auteur a tranché chaque écart et chaque remarque (détail dans `banques/svt-ch3-relecture.md`) : 4 question(s) modifiée(s) ou revérifiée(s).
- Seconde vérification indépendante des questions modifiées : Les 4 questions modifiées (`ch3-modifiees.txt`) ont été résolues à nouveau par un second relecteur indépendant, sans les réponses : **accord 4/4**, sans remarque.

## Statuts

- 150 questions `valide`, 0 `a_relire`.
