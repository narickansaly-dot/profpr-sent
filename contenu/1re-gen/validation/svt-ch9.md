# Validation SVT 1re, chapitre 9 : La dynamique des zones de divergence

## Contrôles automatiques

- Chapitre : 6 sections, 5 figure(s) SVG, 44925 caractères de HTML ; le nettoyage HTML (`nettoyerHtml`) ne retire rien.
- Banque `banques/svt-ch9.json` : conforme à `verifierBanque` (« Banque du chapitre 9 conforme : 150 questions. »), mêmes règles que `npm run banque:verifier`.
- Types : 75 qcm_unique, 30 qcm_multiple, 30 vrai_faux (15 vrais, 15 faux), 15 reponse_courte.
- Difficultés : 61 (1) / 62 (2) / 27 (3). Bonne réponse la plus longue (égalités comprises) dans 16 qcm_unique sur 75.
- Fusion dans `svt.json` (fonction `fusionnerBanque`) et import à blanc (`analyserImport` puis `versDonneesCours`) : sans erreur.

## Relecture indépendante

- Un sous-agent indépendant a résolu les 150 questions avec le seul texte du chapitre, sans voir les réponses attendues : accord 150/150, 10 remarque(s) sur des questions où il était d'accord.
- L'auteur a tranché chaque écart et chaque remarque (détail dans `banques/svt-ch9-relecture.md`) : 6 question(s) modifiée(s) ou revérifiée(s).
- Seconde vérification indépendante des questions modifiées : Les 6 questions modifiées (`ch9-modifiees.txt`) ont été résolues à nouveau par un second relecteur indépendant, sans les réponses : **accord 6/6**. Il confirme le calcul de la 127 (densité ≈ 3,1 < 3,25) ; les variantes demandées pour la 149 étaient déjà acceptées. Aucune modification.

## Statuts

- 150 questions `valide`, 0 `a_relire`.
