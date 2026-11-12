# Validation SVT 1re, chapitre 2 : La réplication de l'ADN

## Contrôles automatiques

- Chapitre : 8 sections, 4 figure(s) SVG, 30224 caractères de HTML ; le nettoyage HTML (`nettoyerHtml`) ne retire rien.
- Banque `banques/svt-ch2.json` : conforme à `verifierBanque` (« Banque du chapitre 2 conforme : 150 questions. »), mêmes règles que `npm run banque:verifier`.
- Types : 74 qcm_unique, 30 qcm_multiple, 30 vrai_faux (15 vrais, 15 faux), 16 reponse_courte.
- Difficultés : 59 (1) / 62 (2) / 29 (3). Bonne réponse la plus longue (égalités comprises) dans 22 qcm_unique sur 74.
- Fusion dans `svt.json` (fonction `fusionnerBanque`) et import à blanc (`analyserImport` puis `versDonneesCours`) : sans erreur.

## Relecture indépendante

- Un sous-agent indépendant a résolu les 150 questions avec le seul texte du chapitre, sans voir les réponses attendues : accord 150/150, 12 remarque(s) sur des questions où il était d'accord.
- L'auteur a tranché chaque écart et chaque remarque (détail dans `banques/svt-ch2-relecture.md`) : 67 question(s) modifiée(s) ou revérifiée(s).
- Seconde vérification indépendante des questions modifiées : Les 67 questions modifiées (`ch2-modifiees.txt`) ont été résolues à nouveau par un second relecteur indépendant, sans les réponses : **accord 67/67**. Suite à ses remarques :

## Statuts

- 150 questions `valide`, 0 `a_relire`.
