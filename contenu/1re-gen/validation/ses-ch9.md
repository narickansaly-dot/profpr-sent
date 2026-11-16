# Validation SES 1re, chapitre 9 : « Comment se forme et s'exprime l'opinion publique ? »

Contrôles automatiques passés le 16/11/2026 sur la branche `claude/contenu-1re-ses-52bb60`, avec les fonctions du dépôt (`analyserImport`, `verifierBanque`, `nettoyerHtml`, `versDonneesCours`), appelées depuis un script externe : les scripts `npm run banque:*` ne connaissent que les cours de 1re ST2S (voir le bilan).

## Résultats

| Contrôle | Résultat |
|---|---|
| Validateur d'import (`analyserImport`) sur `ses.json` | aucune erreur |
| `verifierBanque` (préfixe `ses`, quotas pour 150) sur `banques/ses-ch9.json` | Banque du chapitre 9 conforme : 150 questions. |
| Nettoyage HTML (`nettoyerHtml`) des 4 sections et de « Je retiens » | rien n’est retiré |
| Import à blanc (`versDonneesCours`, sans écriture en base) | données préparées sans erreur |

## Le chapitre

- 4 sections, objectifs : 3, durée indicative : 2 semaines.

## La banque

- 150 questions : 75 `qcm_unique`, 30 `qcm_multiple`, 30 `vrai_faux` (15 vrais), 15 `reponse_courte`.
- Difficultés : 59 faciles, 60 moyennes, 31 difficiles.
- Relecture indépendante à l'aveugle : `banques/ses-ch9-relecture.md`. Résultat : **150 réponses identiques sur 150**, 0 écart(s), 23 remarques.
- Statuts : 150 `valide`, 0 `a_relire`.

## À faire par l'enseignant

1. Importer sans publier (`npm run import:contenu -- contenu/1re-gen/ses.json`) et lire le chapitre dans l'aperçu admin.
2. Parcourir la relecture ; les questions `valide` sont tirées dans les quiz dès la publication.
