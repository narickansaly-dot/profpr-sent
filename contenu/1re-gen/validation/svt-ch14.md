# Validation SVT 1re, chapitre 14 : Cancers et résistance aux antibiotiques

## Contrôles automatiques

- Chapitre : 6 sections, 3 figure(s) SVG, 44992 caractères de HTML ; le nettoyage HTML (`nettoyerHtml`) ne retire rien.
- Banque `banques/svt-ch14.json` : conforme à `verifierBanque` (« Banque du chapitre 14 conforme : 150 questions. »), mêmes règles que `npm run banque:verifier`.
- Types : 75 qcm_unique, 30 qcm_multiple, 30 vrai_faux (15 vrais, 15 faux), 15 reponse_courte.
- Difficultés : 60 (1) / 60 (2) / 30 (3). Bonne réponse la plus longue (égalités comprises) dans 23 qcm_unique sur 75.
- Fusion dans `svt.json` (fonction `fusionnerBanque`) et import à blanc (`analyserImport` puis `versDonneesCours`) : sans erreur.

## Relecture indépendante

- Un sous-agent indépendant a résolu les 150 questions avec le seul texte du chapitre, sans voir les réponses attendues : accord 150/150, 14 remarque(s) sur des questions où il était d'accord.
- L'auteur a tranché chaque écart et chaque remarque (détail dans `banques/svt-ch14-relecture.md`) : 9 question(s) modifiée(s) ou revérifiée(s).
- Seconde vérification indépendante des questions modifiées : Les 9 questions modifiées (`ch14-modifiees.txt`) ont été résolues à nouveau par un second relecteur indépendant, sans les réponses : **accord 9/9**. Il confirme les calculs de la 090 (15 mm est intermédiaire, 6 mm = diamètre du disque, donc aucune inhibition) et de la 131 (10 résistantes) ; les variantes de la 149 étaient déjà acceptées. Aucune modification.

## Statuts

- 150 questions `valide`, 0 `a_relire`.
