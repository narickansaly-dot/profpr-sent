# Validation SES, chapitre 7 : « L'organisation de la vie politique »

Contrôles automatiques passés le 11 novembre 2026 sur la branche `claude/contenu-2de-ses-e65cde`, avec les fonctions du dépôt (`analyserImport`, `verifierBanque`, `fusionnerBanque`, `nettoyerHtml`, `versDonneesCours`). Les scripts `npm run banque:*` ne connaissent pas encore le cours SES de 2de (chemin `contenu/1re-st2s/` et cours `bph`/`stss` codés en dur) : les mêmes fonctions ont été appelées depuis un script externe, sans modifier le dépôt.

## Résultats

| Contrôle | Résultat |
|---|---|
| Validateur d'import (`analyserImport`) sur `ses.json` | aucune erreur |
| `verifierBanque` (préfixe `ses`, quotas pour 150 questions) sur `banques/ses-ch7.json` | conforme |
| Fusion dans `ses.json` (`fusionnerBanque`) | 151 questions dans le chapitre ; fusion rejouable sans changement |
| Nettoyage HTML (`nettoyerHtml`) sur les 6 sections et « Je retiens » | rien n'est retiré (seul un `tabindex` est ajouté aux tableaux) |
| Import à blanc (`versDonneesCours`, sans écriture en base) | données préparées sans erreur |

## La banque

- 151 questions, toutes au statut `a_relire` : aucune n'est tirée dans un quiz avant validation par l'enseignant.
- Types : 75 `qcm_unique`, 31 `qcm_multiple`, 30 `vrai_faux`, 15 `reponse_courte`.
- Difficultés : 58 faciles, 61 moyennes, 32 difficiles.
- Relecture et corrections : `banques/ses-ch7-relecture.md` (5 points de doute).

## À faire par l'enseignant

1. Lire le chapitre dans l'aperçu admin après import (non publié).
2. Trancher les points de doute de `ses-ch7-relecture.md`.
3. Valider les questions dans l'admin ; la relecture faite ici n'est pas indépendante (même session que la rédaction).
