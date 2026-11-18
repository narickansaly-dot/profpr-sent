# Validation SVT 1re, chapitre 6 : Les enzymes, des biomolécules aux propriétés catalytiques

## Contrôles automatiques

- Chapitre : 5 sections, 3 figure(s) SVG, 34997 caractères de HTML ; le nettoyage HTML (`nettoyerHtml`) ne retire rien.
- Banque `banques/svt-ch6.json` : conforme à `verifierBanque` (« Banque du chapitre 6 conforme : 150 questions. »), mêmes règles que `npm run banque:verifier`.
- Types : 75 qcm_unique, 30 qcm_multiple, 30 vrai_faux (15 vrais, 15 faux), 15 reponse_courte.
- Difficultés : 60 (1) / 60 (2) / 30 (3). Bonne réponse la plus longue (égalités comprises) dans 23 qcm_unique sur 75.
- Fusion dans `svt.json` (fonction `fusionnerBanque`) et import à blanc (`analyserImport` puis `versDonneesCours`) : sans erreur.

## Relecture indépendante

- Un sous-agent indépendant a résolu les 150 questions avec le seul texte du chapitre, sans voir les réponses attendues : accord 150/150, 15 remarque(s) sur des questions où il était d'accord.
- L'auteur a tranché chaque écart et chaque remarque (détail dans `banques/svt-ch6-relecture.md`) : 9 question(s) modifiée(s) ou revérifiée(s).
- Seconde vérification indépendante des questions modifiées : Les 9 questions modifiées (`ch6-modifiees.txt`) ont été résolues à nouveau par un second relecteur indépendant, sans les réponses : **accord 9/9**. Suite à ses remarques, la 143 accepte aussi la faute fréquente « Fisher » ; les autres variantes demandées (145) étaient déjà acceptées.

## Statuts

- 150 questions `valide`, 0 `a_relire`.
