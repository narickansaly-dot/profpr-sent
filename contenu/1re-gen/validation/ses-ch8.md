# Validation SES 1re, chapitre 8 : « Quels sont les processus sociaux qui contribuent à la déviance ? »

Contrôles automatiques passés le 16/11/2026 sur la branche `claude/contenu-1re-ses-52bb60`, avec les fonctions du dépôt (`analyserImport`, `verifierBanque`, `nettoyerHtml`, `versDonneesCours`), appelées depuis un script externe : les scripts `npm run banque:*` ne connaissent que les cours de 1re ST2S (voir le bilan).

## Résultats

| Contrôle | Résultat |
|---|---|
| Validateur d'import (`analyserImport`) sur `ses.json` | aucune erreur |
| `verifierBanque` (préfixe `ses`, quotas pour 150) sur `banques/ses-ch8.json` | Banque du chapitre 8 conforme : 150 questions. |
| Nettoyage HTML (`nettoyerHtml`) des 6 sections et de « Je retiens » | rien n’est retiré |
| Import à blanc (`versDonneesCours`, sans écriture en base) | données préparées sans erreur |

## Le chapitre

- 6 sections, objectifs : 5, durée indicative : 3 semaines.

## La banque

- 150 questions : 75 `qcm_unique`, 30 `qcm_multiple`, 29 `vrai_faux` (14 vrais), 16 `reponse_courte`.
- Difficultés : 61 faciles, 59 moyennes, 30 difficiles.
- Relecture indépendante à l'aveugle : `banques/ses-ch8-relecture.md`. Résultat : **150 réponses identiques sur 150**, 0 écart(s), 18 remarques.
- Statuts : 150 `valide`, 0 `a_relire`.

- Relecture indépendante du texte du chapitre : `banques/ses-ch8-cours-relecture.md` (corrections appliquées).

## Import et publication

- Importé en base locale le 16/11/2026 (`npm run import:contenu -- contenu/1re-gen/ses.json`, sans `--publier`) : questions créées puis réimport sans changement (rejouable). Le cours et ses chapitres sont en **brouillon** : il reste à les publier depuis `/admin` (ou à réimporter avec `--publier`).
- Les questions `valide` sont tirées dans les quiz dès la publication.
