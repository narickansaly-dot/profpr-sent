# Validation EMC 1re générale, chapitre 4

**La laïcité, condition de la coexistence et du pluralisme** (2 heures, 4 sections). Banque : `banques/emc-ch4.json` ; relecture détaillée : `banques/emc-ch4-relecture.md`.

Bilan : 120 gardées, 11 corrigées, 19 remplacées ; statut final : 150 `valide`, 0 `a_relire`.

## Relectures

1. **Relecture à l'aveugle** (sous-agent indépendant, qui a résolu les 150 questions avec le seul texte du chapitre, sans voir les réponses attendues ; comparaison automatique) : 120 accords sans remarque, **0 écart**, 30 remarques (doublons, distracteurs défendables, indices de forme, variantes de réponses courtes). Chaque remarque a été traitée par le rédacteur de la banque : décision par question dans `emc-ch4-relecture.md`.
2. **Vérification factuelle du cours** (sous-agent avec recherche web) puis mise en cohérence de la banque : Ploërmel : 035, 089, 121, 142 alignées (monument vendu et déplacé en 2018).
3. **Seconde relecture à l'aveugle** des 31 questions corrigées ou remplacées (nouveau sous-agent) : 0 écart ; 054, 091 retouchées.

## Contrôles

| Contrôle | Résultat |
| --- | --- |
| `verifierBanque` (préfixe `emc`, 150 questions, quotas 75 / 30 / 30 / 15 et 60 / 60 / 30 ±3) | conforme |
| Types | 75 QCM unique, 30 QCM multiple, 30 vrai/faux (14 vrais), 15 réponses courtes |
| Difficultés 1 / 2 / 3 | 61 / 59 / 30 |
| Fusion dans `emc.json` | 150 questions ajoutées ; second passage : 0 ajoutée (rejouable) |
| Statuts | {'valide': 150} |

## Questions laissées « à relire »

Aucune : toutes les questions sont `valide`.
