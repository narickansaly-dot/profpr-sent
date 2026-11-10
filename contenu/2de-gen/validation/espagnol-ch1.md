# Validation de la banque du chapitre 1 d'espagnol : « Vivir entre generaciones »

Rapport produit le 10 novembre 2026. Contrôles : `verifierBanque` (les 14 règles de `npm run banque:verifier`, partie 7 du guide des auteurs), avec la configuration du cours d'espagnol : préfixe `espagnol`, 150 questions, quotas 75 / 30 / 30 / 15 pour les types et 60 / 60 / 30 pour les difficultés, à plus ou moins 3 près.

- Résultat : **Banque du chapitre 1 conforme : 150 questions.**
- Fusion dans `espagnol.json` : 150 questions au statut `a_relire` dans le chapitre 1. La fusion est rejouable : relancée, elle n'ajoute rien.
- Types : 75 qcm_unique, 30 qcm_multiple, 30 vrai/faux (16 vrais, 14 faux), 15 réponses courtes.
- Difficultés : 60 / 58 / 32.
- Position de la bonne réponse des qcm_unique (1 à 4) : 19 / 18 / 19 / 19 ; bonne réponse la plus longue : 25 sur 75 (33 %, moins de 40 % exigé).
- Texte du chapitre (sortie de `texteChapitre`) : 11 750 octets.

## Notions

| Notion | Questions |
| --- | --- |
| Vocabulaire : la famille | 15 |
| Vocabulaire : âges et vie commune | 14 |
| Grammaire : présent régulier | 18 |
| Grammaire : diphtongues et irréguliers | 32 |
| Grammaire : possessifs | 12 |
| Grammaire : comparatifs | 14 |
| Compréhension de l'écrit | 21 |
| Culture : familles hispaniques | 13 |
| S'exprimer, prononcer, écrire | 11 |

## Réponses courtes et variantes acceptées

La correction ignore la casse, les accents (et le tilde du ñ), la ponctuation de fin et les signes ¿ ¡ du début (guide des auteurs, partie 3). Les variantes ci-dessous couvrent l'article, le pronom sujet, le genre et l'écriture en chiffres ou en lettres.

| Source | Énoncé | Réponses acceptées |
| --- | --- | --- |
| 013 | Traduis en espagnol « la sœur » (avec l'article). | la hermana ; hermana |
| 014 | Comment dit-on en espagnol « les grands-parents » (avec l'article) ? | los abuelos ; abuelos |
| 026 | Traduis le verbe « vivre ensemble » par un seul mot espagnol. | convivir |
| 042 | Conjugue « estudiar » au présent avec « yo ». | estudio ; yo estudio |
| 043 | Écris la forme de « aprender » au présent avec « vosotros ». | aprendéis ; vosotros aprendéis ; vosotras aprendéis |
| 071 | Conjugue « poder » au présent avec « tú ». | puedes ; tú puedes |
| 072 | Écris la forme de « decir » au présent avec « yo ». | digo ; yo digo |
| 073 | Écris la 3e personne du pluriel du présent de « preferir ». | prefieren ; ellos prefieren ; ellas prefieren |
| 084 | Traduis « mes cousines » en espagnol. | mis primas |
| 096 | Traduis « meilleur » (comparatif de « bueno ») en un mot espagnol. | mejor |
| 097 | Complète avec un mot : « Mi hermana es ___ que yo: tiene doce años y yo dieciséis. » | menor |
| 117 | Texte : « Somos catorce en la mesa. » Combien de personnes sont à table ? Réponds en chiffres. | 14 ; catorce |
| 129 | Comment appelle-t-on, en espagnol, la fête des quinze ans d'une jeune fille ? | quinceañera ; la quinceañera ; quinceanera ; los quince ; fiesta de quince años |
| 149 | Traduis « la vieillesse » en espagnol (avec l'article). | la vejez ; vejez |
| 150 | Écris « je fais » en espagnol (verbe hacer). | hago ; yo hago |

Relecture détaillée et points de doute : `banques/espagnol-ch1-relecture.md`.
