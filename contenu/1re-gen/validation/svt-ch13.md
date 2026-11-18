# Validation SVT 1re, chapitre 13 : Mutations, patrimoine génétique et santé

## Contrôles automatiques

- Chapitre : 6 sections, 4 figure(s) SVG, 35983 caractères de HTML ; le nettoyage HTML (`nettoyerHtml`) ne retire rien.
- Banque `banques/svt-ch13.json` : conforme à `verifierBanque` (« Banque du chapitre 13 conforme : 150 questions. »), mêmes règles que `npm run banque:verifier`.
- Types : 75 qcm_unique, 30 qcm_multiple, 30 vrai_faux (15 vrais, 15 faux), 15 reponse_courte.
- Difficultés : 60 (1) / 60 (2) / 30 (3). Bonne réponse la plus longue (égalités comprises) dans 15 qcm_unique sur 75.
- Fusion dans `svt.json` (fonction `fusionnerBanque`) et import à blanc (`analyserImport` puis `versDonneesCours`) : sans erreur.

## Relecture indépendante

- Un sous-agent indépendant a résolu les 150 questions avec le seul texte du chapitre, sans voir les réponses attendues : accord 150/150, 11 remarque(s) sur des questions où il était d'accord.
- L'auteur a tranché chaque écart et chaque remarque (détail dans `banques/svt-ch13-relecture.md`) : 7 question(s) modifiée(s) ou revérifiée(s).
- Seconde vérification indépendante des questions modifiées : Les 7 questions modifiées (`ch13-modifiees.txt`) ont été résolues à nouveau par un second relecteur indépendant, sans les réponses : **accord 7/7**. Ses remarques (variantes de 137) portaient sur des variantes déjà acceptées. Aucune modification.

## Statuts

- 150 questions `valide`, 0 `a_relire`.
