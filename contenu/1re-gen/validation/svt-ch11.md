# Validation SVT 1re, chapitre 11 : Les écosystèmes, des interactions dynamiques

## Contrôles automatiques

- Chapitre : 5 sections, 5 figure(s) SVG, 37485 caractères de HTML ; le nettoyage HTML (`nettoyerHtml`) ne retire rien.
- Banque `banques/svt-ch11.json` : conforme à `verifierBanque` (« Banque du chapitre 11 conforme : 150 questions. »), mêmes règles que `npm run banque:verifier`.
- Types : 75 qcm_unique, 30 qcm_multiple, 30 vrai_faux (15 vrais, 15 faux), 15 reponse_courte.
- Difficultés : 61 (1) / 60 (2) / 29 (3). Bonne réponse la plus longue (égalités comprises) dans 7 qcm_unique sur 75.
- Fusion dans `svt.json` (fonction `fusionnerBanque`) et import à blanc (`analyserImport` puis `versDonneesCours`) : sans erreur.

## Relecture indépendante

- Un sous-agent indépendant a résolu les 150 questions avec le seul texte du chapitre, sans voir les réponses attendues : accord 150/150, 6 remarque(s) sur des questions où il était d'accord.
- L'auteur a tranché chaque écart et chaque remarque (détail dans `banques/svt-ch11-relecture.md`) : 4 question(s) modifiée(s) ou revérifiée(s).
- Seconde vérification indépendante des questions modifiées : Les 4 questions modifiées (`ch11-modifiees.txt`) ont été résolues à nouveau par un second relecteur indépendant, sans les réponses : **accord 4/4**. Il jugeait encore discutable la proposition « chaque chevreuil qui broute tire un bénéfice » présentée comme une conséquence de l'abondance : la 090 porte maintenant sur l'interaction elle-même (énoncé « Quelles affirmations sur cette interaction sont exactes ? », propositions et explication reprises, réponses inchangées en position : 1re et 3e), en accord avec le tableau des interactions du chapitre (herbivorie : + / −). Cette nouvelle version a été vérifiée à son tour par un troisième relecteur indépendant : accord 1/1 (la proposition « moins de jeunes hêtres atteignent l'âge adulte » se déduit de l'effet − de l'herbivorie sur la plante).

## Statuts

- 150 questions `valide`, 0 `a_relire`.
