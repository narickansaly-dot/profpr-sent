# Validation SVT 1re, chapitre 8 : La chaleur interne de la Terre et la mobilité des plaques

## Contrôles automatiques

- Chapitre : 6 sections, 3 figure(s) SVG, 35814 caractères de HTML ; le nettoyage HTML (`nettoyerHtml`) ne retire rien.
- Banque `banques/svt-ch8.json` : conforme à `verifierBanque` (« Banque du chapitre 8 conforme : 150 questions. »), mêmes règles que `npm run banque:verifier`.
- Types : 75 qcm_unique, 30 qcm_multiple, 30 vrai_faux (15 vrais, 15 faux), 15 reponse_courte.
- Difficultés : 60 (1) / 62 (2) / 28 (3). Bonne réponse la plus longue (égalités comprises) dans 5 qcm_unique sur 75.
- Fusion dans `svt.json` (fonction `fusionnerBanque`) et import à blanc (`analyserImport` puis `versDonneesCours`) : sans erreur.

## Relecture indépendante

- Un sous-agent indépendant a résolu les 150 questions avec le seul texte du chapitre, sans voir les réponses attendues : accord 150/150, 10 remarque(s) sur des questions où il était d'accord.
- L'auteur a tranché chaque écart et chaque remarque (détail dans `banques/svt-ch8-relecture.md`) : 7 question(s) modifiée(s) ou revérifiée(s).
- Seconde vérification indépendante des questions modifiées : Les 7 questions modifiées (`ch8-modifiees.txt`) ont été résolues à nouveau par un second relecteur indépendant, sans les réponses : **accord 7/7**. Ses remarques (138 : valeurs de la fourchette ; 141 : tiret ou signe moins) portaient sur des cas déjà acceptés (marge de 500 autour de 5500 ; variantes « -2 » et « −2 »). Aucune modification.

## Statuts

- 150 questions `valide`, 0 `a_relire`.
