# Relecture de la banque du chapitre 3 de physique-chimie (2de) contre le cours

Relecture des 150 questions de `physique-chimie-ch3.json` contre le texte du chapitre 3 « De l'atome au tableau périodique » (`pc.ts texte 3`), question par question, sans échantillonnage. Critères : exactitude scientifique et conformité au cours, avec chaque calcul refait (valeur, unité, arrondi, marge) ; lecture unique ; bonne(s) réponse(s) seules justes et distracteurs faux sans ambiguïté ; explication juste et suffisante ; niveau 2de ; aucune donnée extérieure au chapitre ni question sur une donnée fictive ; variantes des réponses courtes (nombre seul, signe, marge) ; reformulations proches, réponse lisible dans l'énoncé, bonne réponse repérable par sa longueur. Typographie (espace insécable, Unicode) et quotas contrôlés par script puis par le vérificateur.

## Questions corrigées et remplacées

| Source | Problème | Décision |
|---|---|---|
| physique-chimie-2de:ch3:banque:015 | Bonne réponse nettement plus longue que les trois distracteurs (45 caractères contre 36 au plus). | Corrigée : distracteurs allongés (« … numéro atomique Z », « … neutrons dans le noyau », « … même période du tableau »). |
| physique-chimie-2de:ch3:banque:026 | Énoncé incomplet : « combien de fois la masse du noyau est-elle plus grande ? » ne dit pas par rapport à quoi. | Corrigée : « … plus grande que celle des électrons ? ». Calcul vérifié : 2,67 / 7,29 × 10⁴ ≈ 3 700. |
| physique-chimie-2de:ch3:banque:027 | Bonne réponse beaucoup plus longue que les distracteurs (53 contre 37), distracteur « C'est un halogène » peu plausible. | Corrigée : bonne réponse resserrée (« Il est, comme eux, très peu réactif »), distracteurs étoffés. |
| physique-chimie-2de:ch3:banque:077 | Unité demandée peu lisible (« en unité de 10⁻¹⁹ C ») et réponse 12,8 hors écriture scientifique. | Corrigée : l'élève écrit le résultat sous la forme a × 10⁻¹⁸ C et donne a = 1,28 (marge relative 5 %, qui accepte 1,3) ; explication avec le passage 12,8 × 10⁻¹⁹ = 1,28 × 10⁻¹⁸. |
| physique-chimie-2de:ch3:banque:078 | Variantes incomplètes : « −e » (signe moins Unicode), « -1e », « − 1 » refusés. | Corrigée : variantes ajoutées. |
| physique-chimie-2de:ch3:banque:096 | Formulation maladroite (« combien d'atomes alignés se touchent sur 1 mm »). | Corrigée : « Combien d'atomes peut-on aligner côte à côte sur 1 mm ? ». |
| physique-chimie-2de:ch3:banque:109 | Bonne réponse nettement plus longue (60 contre 42). | Corrigée : bonne réponse resserrée, distracteurs étoffés (dont « les deux écritures désignent le même élément, le cobalt »). |
| physique-chimie-2de:ch3:banque:110 | Bonne réponse nettement plus longue (58 contre 43). | Corrigée : distracteurs allongés à longueur comparable. |
| physique-chimie-2de:ch3:banque:116 | Réponse lisible dans l'énoncé (« atome, molécule, anion ou cation ? » : réponse courte transformée en QCM). | Corrigée : « Mg²⁺ est un ion. Comment appelle-t-on un ion de ce type, d'après le signe de sa charge ? » ; variantes complétées (« cations », « un cation monoatomique »). |
| physique-chimie-2de:ch3:banque:118 | Explication fausse : elle désignait « la quatrième égalité » comme fausse, alors que c'est la deuxième (10⁻⁹ / 10⁻¹² = 10⁻²¹) ; notion « Tailles et masses » pour une question de calcul sur les puissances de 10. | Corrigée : explication qui nomme l'égalité fausse et l'erreur (exposants additionnés) ; notion « Écriture scientifique ». |
| physique-chimie-2de:ch3:banque:127 | Bonne réponse beaucoup plus longue (57 contre 35). | Corrigée : distracteurs étoffés (2 électrons de valence comme l'hélium, période 2 avec le lithium, noyau sans proton). |

## Totaux

- Gardées sans changement : 139
- Corrigées : 11 (015, 026, 027, 077, 078, 096, 109, 110, 116, 118, 127)
- Remplacées : 0

Répartition après relecture : types 74 qcm_unique / 30 qcm_multiple / 31 vrai_faux / 15 reponse_courte (dans la tolérance de ± 3) ; vrai/faux : 15 vrais, 16 faux ; qcm_multiple : 15 à 2 bonnes réponses, 15 à 3 ; difficultés 60 / 60 / 30 ; bonne réponse des qcm_unique en position 0 / 1 / 2 / 3 : 19 / 19 / 18 / 18. Bonne réponse strictement la plus longue dans 8 qcm_unique sur 74 (13 avant relecture). Vérificateur (`pc.ts verifier 3`) : « Banque du chapitre 3 conforme : 150 questions. »

Calculs refaits et justes : 001, 005, 016, 017, 026, 031, 033, 034, 036, 039, 043, 049, 057, 062, 063, 073, 077, 080, 086, 096, 100, 104, 107, 111, 118, 120, 124, 132, 138, 142, 143, 146, 150.

Points jugés acceptables :

- 026, 033, 036 et 138 calculent des masses d'atomes (O, N) absents des exemples chiffrés du cours, mais toutes les données sont dans l'énoncé et la méthode est celle du cours (exemple du carbone 12).
- 096 (nombre d'atomes alignés sur 1 mm) est un quotient de puissances de 10, application directe de la méthode du cours.
- 124 : marge absolue de 50 autour de 1800, qui accepte la valeur non arrondie 1830 ; c'est voulu.
- 019, 095 et 108 ont des distracteurs absents du cours (« non-métaux », « métaux mous », « métaux de transition ») : vocabulaire plausible, faux sans ambiguïté.
- 042, 050, 094, 111, 115, 117, 129 et 130 : bonne réponse un peu plus longue, mais l'écart est faible (1 à 6 caractères) ou tient au contenu de la définition.
- 030 : « un seul type d'entités » se déduit de l'énoncé (« une seule espèce chimique »), mais c'est justement le lien entre espèce et entité qui est demandé.

## Points de doute pour l'enseignant

1. **106** : le distracteur « Ferrate » n'est pas un nom latin ; il reste faux, mais un élève peut l'écarter trop facilement.
2. **062** : la question (ion à 20 protons et 18 électrons) est cotée 3 et rangée sous « Élément chimique » ; elle pourrait être de niveau 2.
3. **041** (vrai/faux, protons de Fe²⁺) et **134** (configuration à 14 électrons) sont cotées 3 pour une application directe ; gardées pour respecter les quotas.
4. **Redites d'idée** : 026, 033 et 036 sur l'atome ¹⁶₈O (masse du noyau, des électrons, quotient) ; 039, 103 et 111 sur le rapport 10⁵ entre atome et noyau ; 084, 098, 102 et 142 sur le soufre ; 143 et 150 (et l'exemple 005) sur 5 électrons de valence en période 3 ; 069, 100 et 112 sur le chlore 35/37 ; 019, 123, 141 et 050 sur les alcalins ; 046, 051, 108 et 147 sur les halogènes ; 079 et 127 sur l'hydrogène hors des alcalins ; 027 et 045 sur l'exception de l'hélium ; 052 et 114/137 sur Z et A. Les énoncés diffèrent, mais le contenu se répète.
5. **078** : la réponse attendue « −1 » (charge en nombre de charges élémentaires) peut surprendre un élève qui écrirait « −e » sans la valeur ; les deux formes sont acceptées, mais pas « moins un » en toutes lettres.
6. **133** : seules « gaz nobles » et ses variantes sont acceptées ; « gaz rares », absent du cours, est refusé.
