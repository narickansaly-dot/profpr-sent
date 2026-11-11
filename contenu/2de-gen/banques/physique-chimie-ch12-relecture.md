# Relecture de la banque du chapitre 12 de physique-chimie (2de) contre le cours

Relecture des 150 questions de `physique-chimie-ch12.json` (« Signaux et capteurs ») contre le texte du chapitre (`pc.ts texte 12`), question par question, sans échantillonnage. Critères : exactitude scientifique et conformité au cours, avec chaque calcul refait (valeur, unité, arrondi, marge) ; lecture unique ; bonne(s) réponse(s) seules justes et distracteurs faux sans ambiguïté ; explication juste et suffisante ; niveau 2de ; aucune donnée extérieure au chapitre ni question sur une donnée fictive du cours ; variantes des réponses courtes (nombre seul, unité demandée dans l'énoncé) ; redites d'idée, réponse lisible dans l'énoncé, bonne réponse repérable par sa longueur. Typographie (espace insécable, signe moins U+2212) contrôlée par script, puis par le vérificateur.

## Questions corrigées et remplacées

| Source | Problème | Décision |
|---|---|---|
| physique-chimie-2de:ch12:banque:035 | Bonne réponse nettement plus longue que les distracteurs (rapport 1,7). | Corrigée : bonne réponse resserrée (« Une portion de circuit entre deux nœuds consécutifs »), distracteurs allongés. |
| physique-chimie-2de:ch12:banque:037 | Formulation maladroite : « Un point d'un fil relié à deux fils seulement ». | Corrigée : « Un point du circuit relié à deux fils seulement est un nœud. » |
| physique-chimie-2de:ch12:banque:046 | Distracteur « L'intensité dans la lampe est égale à celle dans R2 » : pas faux sans ambiguïté (égalité possible si la lampe et R2 sont identiques). | Corrigée : remplacé par « R2 est traversée par tout le courant du générateur » ; explication complétée (partage du courant au nœud B). |
| physique-chimie-2de:ch12:banque:058 | Bonne réponse deux fois plus longue que les distracteurs. | Corrigée : bonne réponse resserrée, distracteurs allongés ; explication reprenant la définition complète du cours. |
| physique-chimie-2de:ch12:banque:064 | Bonne réponse « La diode électroluminescente (DEL) » 2,6 fois plus longue que la moyenne des distracteurs. | Corrigée : « La DEL » ; distracteur « La résistance (conducteur ohmique) ». |
| physique-chimie-2de:ch12:banque:105 | Valeur « 0,5 V » écrite avec un chiffre significatif de moins que les autres mesures ; explication sans la troisième mesure. | Corrigée : « 0,50 V » ; explication avec les trois quotients. |
| physique-chimie-2de:ch12:banque:120 | « associations objet - grandeur détectée » alors que les items associent un capteur et une grandeur ; tiret simple. | Corrigée : « Quelles associations entre un capteur et la grandeur qu'il détecte sont exactes ? ». |
| physique-chimie-2de:ch12:banque:133 | Bonne réponse nettement plus longue (rapport 1,8). | Corrigée : « Convertir la tension en température par l'étalonnage », distracteurs allongés. |
| physique-chimie-2de:ch12:banque:142 | Bonne réponse nettement plus longue (rapport 1,8). | Corrigée : bonne réponse resserrée, distracteurs allongés. |
| physique-chimie-2de:ch12:banque:146 | Bonne réponse nettement plus longue ; distracteur « La masse du capteur » non plausible. | Corrigée : distracteurs « Directement la température, sans aucune conversion », « La résistance de la thermistance, en ohm », « Le nombre de dipôles branchés sur la carte ». |
| physique-chimie-2de:ch12:banque:148 | Bonne réponse deux fois plus longue que les distracteurs. | Corrigée : distracteurs allongés. |
| physique-chimie-2de:ch12:banque:149 | Bonne réponse nettement plus longue (rapport 1,8). | Corrigée : bonne réponse resserrée, distracteurs allongés. |
| physique-chimie-2de:ch12:banque:050 | Reformulation proche de la 048 (lampe et moteur en dérivation, même tension de 4,5 V). | Remplacée : réponse courte (difficulté 2, loi des mailles) : UAB = 6,0 V, UBC = −2,0 V, calculer UCA ; réponse −4 (variantes « -4 », « -4,0 », « −4 », « −4,0 »). |

## Totaux

- Gardées sans changement : 137
- Corrigées : 12 (035, 037, 046, 058, 064, 105, 120, 133, 142, 146, 148, 149)
- Remplacées : 1 (050)

Répartition après relecture : types 74 qcm_unique / 29 qcm_multiple / 31 vrai_faux / 16 reponse_courte (dans les ± 3) ; vrai/faux : 15 vrais, 16 faux ; qcm_multiple : 18 à 2 bonnes réponses, 11 à 3 ; difficultés 59 / 61 / 30 ; bonne réponse des qcm_unique en position 1 à 4 : 19 / 18 / 18 / 19 ; bonne réponse strictement la plus longue dans 16 qcm_unique sur 74 (22 %, contre 23 avant relecture). `PC_CHAPITRE=… npx tsx pc.ts verifier 12` : « Banque du chapitre 12 conforme : 150 questions. »

Tous les calculs ont été refaits : loi des nœuds (034, 038, 043, 044, 045), loi des mailles (047, 055, 056, 059, 050 nouvelle), points de fonctionnement (079, 080, 081, 082, 083, 086, 088), loi d'Ohm (091, 092, 094, 095, 099, 100, 101, 103, 104, 105, 106, 110, 111, 112), conversions (016, 022, 117), étalonnage (131, 134, 135, 140) : tous justes.

Points jugés acceptables :

- 004 reprend la valeur UAB = −3,2 V de l'exemple du cours, et 094 trouve la même résistance (150 Ω) qu'un exemple résolu : les données sont dans l'énoncé et la question porte sur la méthode, ce qui est permis.
- 024 accepte « multimètre » en plus d'« ampèremètre » : le cours présente l'ampèremètre comme une fonction du multimètre ; une variante de plus ne pénalise personne.
- 063 accepte « seuil » seul, et 077 accepte « R » : réponses sans ambiguïté dans le contexte.
- 131 : marge absolue de 0,5 °C pour une interpolation linéaire, adaptée à un arrondi à l'unité.
- 062 et 107 ont un énoncé à la forme négative (« n'est pas une droite », « ne faut-il pas utiliser ») : la négation est explicite et non piégeuse.
- Bonne réponse encore la plus longue dans 023, 025, 028, 029, 060, 069, 076, 078, 103, 118, 126, 127, 132, 138, 139 et 148 : l'écart est modéré (rapport 1,2 à 1,6) ou tient au contenu (montage complet en 060, conclusion justifiée en 103 et 139).

## Points de doute pour l'enseignant

1. **Redites d'idée** : 002, 004 et 012 sur UBA = −UAB ; 003 et 009 sur la définition du dipôle ; 007 et 010, 108 et 114 sur les unités ; 017, 021 et 023 sur le branchement des appareils ; 052 et 053 sur l'écriture de la loi des mailles ; 048 et 054 sur la même tension en dérivation ; 080, 081, 082, 083, 086 et 088 (six calculs de point de fonctionnement sur le même modèle) ; 084 et 085 sur « même U, même I » ; 119 et 124 sur la thermistance ; 118 et 125 sur la photorésistance ; 123 et 129 sur les capteurs du smartphone ; 137 et 138 sur le prolongement de la courbe d'étalonnage ; 133, 142, 145 et 148 sur les étapes du programme. Les formes diffèrent et le vérificateur ne les signale pas, mais le contenu se répète.
2. **Difficultés surcotées** : 020, 034, 073, 113, 133, 138, 139 et 142 sont cotées 3 pour une lecture directe du cours ou un calcul en une étape ; 061 (résistance de protection en série) aussi. Gardées pour respecter le quota de 30 questions de niveau 3.
3. **146** : le distracteur « La résistance de la thermistance, en ohm » est faux selon le cours (la carte mesure une tension), mais un élève peut objecter que la carte « en déduit » une résistance ; à reformuler si tu le juges discutable.
4. **050 (nouvelle)** : réponse négative (−4). La base reconnaît « -4 » comme nombre ; les variantes avec le signe « − » (U+2212) sont comparées comme du texte. Vérifie qu'un élève qui tape « -4 V » ou « −4,0 V » n'est pas pénalisé à tort, ou ajoute ces variantes.
5. **019** : « Commencer par le plus grand calibre » est présenté comme règle de mesure d'intensité ; le cours la donne pour toute mesure au multimètre. Juste, mais la question 013 traite déjà du choix du calibre.
