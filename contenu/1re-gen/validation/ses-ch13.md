# Validation SES 1re, chapitre 13 : « Les outils quantitatifs de la première »

Contrôles automatiques passés le 16/11/2026 sur la branche `claude/contenu-1re-ses-52bb60`, avec les fonctions du dépôt (`analyserImport`, `verifierBanque`, `nettoyerHtml`, `versDonneesCours`), appelées depuis un script externe : les scripts `npm run banque:*` ne connaissent que les cours de 1re ST2S (voir le bilan).

## Résultats

| Contrôle | Résultat |
|---|---|
| Validateur d'import (`analyserImport`) sur `ses.json` | aucune erreur |
| `verifierBanque` (préfixe `ses`, quotas pour 150) sur `banques/ses-ch13.json` | Banque du chapitre 13 conforme : 150 questions. |
| Nettoyage HTML (`nettoyerHtml`) des 6 sections et de « Je retiens » | rien n’est retiré |
| Import à blanc (`versDonneesCours`, sans écriture en base) | données préparées sans erreur |

## Le chapitre

- 6 sections, objectifs : 5, durée indicative : au fil de l'année.

## La banque

- 150 questions : 75 `qcm_unique`, 30 `qcm_multiple`, 30 `vrai_faux` (15 vrais), 15 `reponse_courte`.
- Difficultés : 60 faciles, 60 moyennes, 30 difficiles.
- Relecture indépendante à l'aveugle : `banques/ses-ch13-relecture.md`. Résultat : **150 réponses identiques sur 150**, 0 écart(s), 49 remarques.
- Statuts : 150 `valide`, 0 `a_relire`.

- Relecture indépendante du texte du chapitre : `banques/ses-ch13-cours-relecture.md` (corrections appliquées).

## Import et publication

- Importé en base locale le 16/11/2026 (`npm run import:contenu -- contenu/1re-gen/ses.json`, sans `--publier`) : questions créées puis réimport sans changement (rejouable). Le cours et ses chapitres sont en **brouillon** : il reste à les publier depuis `/admin` (ou à réimporter avec `--publier`).
- Les questions `valide` sont tirées dans les quiz dès la publication.
