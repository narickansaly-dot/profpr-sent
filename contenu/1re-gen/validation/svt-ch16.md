# Validation SVT 1re, chapitre 16 : L'immunité adaptative et la vaccination

## Contrôles automatiques

- Chapitre : 8 sections, 5 figure(s) SVG, 47981 caractères de HTML ; le nettoyage HTML (`nettoyerHtml`) ne retire rien.
- Banque `banques/svt-ch16.json` : conforme à `verifierBanque` (« Banque du chapitre 16 conforme : 150 questions. »), mêmes règles que `npm run banque:verifier`.
- Types : 75 qcm_unique, 30 qcm_multiple, 30 vrai_faux (15 vrais, 15 faux), 15 reponse_courte.
- Difficultés : 60 (1) / 60 (2) / 30 (3). Bonne réponse la plus longue (égalités comprises) dans 21 qcm_unique sur 75.
- Fusion dans `svt.json` (fonction `fusionnerBanque`) et import à blanc (`analyserImport` puis `versDonneesCours`) : sans erreur.

## Relecture indépendante

- Un sous-agent indépendant a résolu les 150 questions avec le seul texte du chapitre, sans voir les réponses attendues : accord 150/150, 10 remarque(s) sur des questions où il était d'accord.
- L'auteur a tranché chaque écart et chaque remarque (détail dans `banques/svt-ch16-relecture.md`) : 10 question(s) modifiée(s) ou revérifiée(s).
- Seconde vérification indépendante des questions modifiées : Les 10 questions modifiées (`ch16-modifiees.txt`) ont été résolues à nouveau par un second relecteur indépendant, sans les réponses : **accord 10/10**. Il confirme les données sur la vaccination en France (11 vaccinations obligatoires pour les enfants nés depuis le 1er janvier 2018 ; rappels à 25, 45 et 65 ans). Suite à ses remarques : la 092 est reformulée (« n'a plus aucune protection », au lieu de « n'est forcément plus protégée », qui se lisait comme « n'est plus forcément protégée ») ; la réponse reste « faux ». La 054, très facile parce que l'énoncé définit le sérum, est gardée (difficulté 1). Les variantes de la 100 étaient déjà acceptées.

## Statuts

- 150 questions `valide`, 0 `a_relire`.
