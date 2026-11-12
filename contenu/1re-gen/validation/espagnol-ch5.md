# Validation : espagnol 1re, chapitre 5 (El ser humano y la naturaleza)

Contrôles lancés le 12 novembre 2026 avec les fonctions du dépôt (`verifierBanque`, `analyserImport`, `nettoyerHtml`, `versDonneesCours`), appelées depuis un script hors dépôt (les scripts `npm run banque:*` ne connaissent que `bph` et `stss`).

## Chapitre

- Sections : 7 (lectura, vocabulario, imperfecto-subjuntivo, hipotesis, conectores, cultura, para-expresarse) + « Je retiens ».
- Objectifs : 5. Durée indiquée : 6 semaines.
- Nettoyage HTML : rien n'est retiré (hors `tabindex="0"` ajouté aux tableaux).

## Banque

- `verifierBanque` : conforme, 150 questions (sources `espagnol:ch5:banque:001` à `150`).
- Types : 75 QCM à réponse unique, 30 QCM à plusieurs réponses, 30 vrai/faux (15 vrais, 15 faux), 15 réponses courtes.
- Difficultés : 60 / 60 / 30 (niveaux 1 / 2 / 3).
- Position de la bonne réponse des QCM à réponse unique : 18 / 19 / 19 / 19 ; bonne réponse la plus longue dans 25 QCM sur 75.
- Statuts : valide 150.

## Relecture indépendante

Voir `banques/espagnol-ch5-relecture.md` : un sous-agent sans accès aux réponses a résolu les 150 questions ; 0 écart avec les réponses attendues ; les remarques fondées ont été corrigées avant la fusion.

## Notions

| Notion | Questions |
| --- | --- |
| Vocabulaire : paysages et croyances | 16 |
| Vocabulaire : menaces et solutions | 16 |
| Subjonctif imparfait : formes | 16 |
| Subjonctif imparfait : emplois | 14 |
| Hypothèse avec « si » | 16 |
| Corrélation et comparaison | 14 |
| Connecteurs logiques | 15 |
| Compréhension : Wara | 13 |
| Repères culturels | 16 |
| Argumenter et proposer | 14 |

## Réponses courtes et variantes acceptées

| Source | Énoncé | Réponses acceptées |
| --- | --- | --- |
| 015 | Traduis en espagnol, avec l'article : « la nature ». | la naturaleza |
| 016 | Traduis en espagnol, avec l'article : « l'environnement » (deux mots après l'article). | el medio ambiente ; el medioambiente ; medio ambiente |
| 031 | Traduis en espagnol, avec l'article : « la déforestation ». | la deforestación |
| 032 | Traduis en espagnol, avec l'article : « la sécheresse ». | la sequía |
| 047 | Écris le subjonctif imparfait de « estudiar » à la personne « yo » (forme en -ra). | estudiara |
| 048 | Écris le subjonctif imparfait de « ser » à la personne « nosotros » (forme en -ra). | fuéramos |
| 062 | Complète : « Mis padres querían que yo ___ medicina » (estudiar, forme en -ra). | estudiara ; estudiase |
| 077 | Complète : « Si ___ dinero, compraría un coche eléctrico » (tener, yo, forme en -ra). | tuviera ; tuviese |
| 078 | Complète : « Si fuera ministra, ___ la selva » (proteger, yo, conditionnel). | protegería |
| 092 | Complète : « ___ más estudio, más aprendo » (plus…). | cuanto ; mientras |
| 107 | Complète avec le connecteur d'opposition : « No es un desierto, ___ una selva ». | sino |
| 120 | Comment s'appelle la Terre mère honorée par la famille de Wara ? | Pachamama ; la Pachamama ; Madre Tierra ; la Madre Tierra |
| 135 | Comment s'appelle la lagune salée de la région de Murcie qui a obtenu des droits en 2022 ? | Mar Menor ; el Mar Menor |
| 136 | Écris le titre du roman de José Eustasio Rivera (1924) où la jungle engloutit les hommes. | La vorágine ; vorágine |
| 150 | Complète pour proposer : « ___ que plantar más árboles » (il faudrait). | habría |

Aucune réponse courte n'est un nombre avec séparateur de milliers ; aucune marge n'est utilisée (la seule réponse numérique, une année, est attendue exacte). Les accents et la casse sont ignorés par la correction.
