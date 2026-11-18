# Validation EMC 1re générale, chapitre 5

**Une République indivisible à l'organisation décentralisée** (3 heures, 5 sections). Banque : `banques/emc-ch5.json` ; relecture détaillée : `banques/emc-ch5-relecture.md`.

Bilan : 131 gardées, 11 corrigées, 8 remplacées ; statut final : 150 `valide`, 0 `a_relire`.

## Relectures

1. **Relecture à l'aveugle** (sous-agent indépendant, qui a résolu les 150 questions avec le seul texte du chapitre, sans voir les réponses attendues ; comparaison automatique) : 131 accords sans remarque, **0 écart**, 19 remarques (doublons, distracteurs défendables, indices de forme, variantes de réponses courtes). Chaque remarque a été traitée par le rédacteur de la banque : décision par question dans `emc-ch5-relecture.md`.
2. **Vérification factuelle du cours** (sous-agent avec recherche web) puis mise en cohérence de la banque : 20 questions alignées (métropoles 2010, art. 74, acte II avec la loi de 2004, apprentissage, préfets 1800, Bougival).
3. **Seconde relecture à l'aveugle** des 27 questions corrigées ou remplacées (nouveau sous-agent) : 0 écart ; 034 retouchée.

## Contrôles

| Contrôle | Résultat |
| --- | --- |
| `verifierBanque` (préfixe `emc`, 150 questions, quotas 75 / 30 / 30 / 15 et 60 / 60 / 30 ±3) | conforme |
| Types | 75 QCM unique, 30 QCM multiple, 30 vrai/faux (15 vrais), 15 réponses courtes |
| Difficultés 1 / 2 / 3 | 60 / 60 / 30 |
| Fusion dans `emc.json` | 150 questions ajoutées ; second passage : 0 ajoutée (rejouable) |
| Statuts | {'valide': 150} |

## Questions laissées « à relire »

Aucune : toutes les questions sont `valide`.
