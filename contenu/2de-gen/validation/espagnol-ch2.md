# Validation de la banque du chapitre 2 d'espagnol : « La imagen de uno mismo y los demás »

Rapport produit le 11 novembre 2026. Contrôles : `verifierBanque` (les 14 règles de `npm run banque:verifier`, partie 7 du guide des auteurs), avec la configuration du cours d'espagnol : préfixe `espagnol`, 150 questions, quotas 75 / 30 / 30 / 15 pour les types et 60 / 60 / 30 pour les difficultés, à plus ou moins 3 près.

- Résultat : **Banque du chapitre 2 conforme : 150 questions.**
- Fusion dans `espagnol.json` : 150 questions au statut `a_relire` dans le chapitre 2. La fusion est rejouable : relancée, elle n'ajoute rien.
- Types : 75 qcm_unique, 30 qcm_multiple, 30 vrai/faux (17 vrais, 13 faux), 15 réponses courtes.
- Difficultés : 60 / 60 / 30.
- Position de la bonne réponse des qcm_unique (1 à 4) : 19 / 18 / 19 / 19 ; bonne réponse la plus longue : 28 sur 75 (37 %, moins de 40 % exigé).
- Texte du chapitre (sortie de `texteChapitre`) : 10 647 octets.

## Notions

| Notion | Questions |
| --- | --- |
| Vocabulaire : physique et caractère | 19 |
| Vocabulaire : vêtements et réseaux | 17 |
| Grammaire : ser et estar | 24 |
| Grammaire : gustar et semblables | 21 |
| Grammaire : pronoms compléments | 21 |
| Compréhension de l'écrit | 21 |
| Culture : image de soi et réseaux | 16 |
| S'exprimer : décrire, donner son avis | 11 |

## Réponses courtes et variantes acceptées

La correction ignore la casse, les accents (et le tilde du ñ), la ponctuation de fin et les signes ¿ ¡ du début (guide des auteurs, partie 3). Les variantes ci-dessous couvrent l'article, le pronom sujet, le genre et l'écriture en chiffres ou en lettres.

| Source | Énoncé | Réponses acceptées |
| --- | --- | --- |
| 018 | Traduis l'adjectif « timide » au masculin. | tímido |
| 019 | Traduis « grande » (de taille) au féminin. | alta |
| 035 | Traduis « la jupe » en espagnol (avec l'article). | la falda ; falda |
| 036 | Traduis « les réseaux sociaux » en espagnol (avec l'article). | las redes sociales ; redes sociales |
| 059 | Complète d'un mot (verbe conjugué) : « Mis amigos ___ en el parque. » | están |
| 060 | Traduis « Je suis prêt » (estar) en espagnol. | estoy listo ; estoy lista ; yo estoy listo ; yo estoy lista |
| 079 | Complète d'un mot : « Me ___ los videojuegos. » (gustar) | gustan |
| 080 | Complète d'un mot (pronom) : « A ellos ___ encanta el fútbol. » | les |
| 081 | Traduis « Cela m'intéresse beaucoup » avec le verbe « interesar ». | me interesa mucho ; eso me interesa mucho ; a mí me interesa mucho |
| 100 | Remplace « la camiseta » par un pronom : « Compro la camiseta » → « ___ compro ». | la |
| 101 | Remplace « los vaqueros » par un pronom : « Llevo los vaqueros » → « ___ llevo ». | los |
| 102 | Traduis « Dis-moi » (tú) en un mot. | dime |
| 123 | Texte : « Diego vive en Guadalajara. » Dans quel pays se trouve Guadalajara (ville de Diego) ? | México ; Mexique ; en México |
| 139 | Comment dit-on « le cyberharcèlement » en espagnol (avec l'article) ? | el ciberacoso ; ciberacoso |
| 150 | Traduis « à mon avis » en espagnol. | en mi opinión ; a mi parecer ; para mí |

Relecture détaillée et points de doute : `banques/espagnol-ch2-relecture.md`.
