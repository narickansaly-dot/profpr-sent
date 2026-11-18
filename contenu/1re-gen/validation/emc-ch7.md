# Validation EMC 1re générale, chapitre 7

**Défendre la Nation : défense et sécurité nationale** (3 heures, 6 sections). Banque : `banques/emc-ch7.json` ; relecture détaillée : `banques/emc-ch7-relecture.md`.

Bilan : 137 gardées, 11 corrigées, 2 remplacées ; statut final : 146 `valide`, 4 `a_relire`.

## Relectures

1. **Relecture à l'aveugle** (sous-agent indépendant, qui a résolu les 150 questions avec le seul texte du chapitre, sans voir les réponses attendues ; comparaison automatique) : 136 accords sans remarque, **0 écart**, 14 remarques (doublons, distracteurs défendables, indices de forme, variantes de réponses courtes). Chaque remarque a été traitée par le rédacteur de la banque : décision par question dans `emc-ch7-relecture.md`.
2. **Vérification factuelle du cours** (sous-agent avec recherche web) puis mise en cohérence de la banque : texte mis à jour avant correction (SNU, service national 2026, JDC, LPM, permis).
3. **Seconde relecture à l'aveugle** des 12 questions corrigées ou remplacées (nouveau sous-agent) : 0 écart (10 accords, 2 remarques sans retouche).

## Contrôles

| Contrôle | Résultat |
| --- | --- |
| `verifierBanque` (préfixe `emc`, 150 questions, quotas 75 / 30 / 30 / 15 et 60 / 60 / 30 ±3) | conforme |
| Types | 75 QCM unique, 30 QCM multiple, 30 vrai/faux (15 vrais), 15 réponses courtes |
| Difficultés 1 / 2 / 3 | 61 / 59 / 30 |
| Fusion dans `emc.json` | 150 questions ajoutées ; second passage : 0 ajoutée (rejouable) |
| Statuts | {'valide': 146, 'a_relire': 4} |

## Questions laissées « à relire »

- emc:ch7:banque:074
- emc:ch7:banque:121
- emc:ch7:banque:131
- emc:ch7:banque:137

Ces questions reposent sur des faits de 2026 (service national créé en 2026, JDC rebaptisée « journée de mobilisation » par la loi du 16 août 2026) trouvés par une seule recherche et non recoupés : à confirmer par l'enseignant avant validation.
