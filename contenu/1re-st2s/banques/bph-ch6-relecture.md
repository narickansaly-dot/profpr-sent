# Relecture de la banque du chapitre 6 de BPH contre le cours

Relecture des 130 questions de `bph-ch6.json` contre le texte du chapitre (`npm run banque:texte -- 6`), question par question, sans échantillonnage. Critères : exactitude selon le cours, lecture unique, bonne(s) réponse(s) seules justes, explication, niveau 1re ST2S, règles du § 3 de la spec (typographie avec espace insécable et tutoiement vérifiés par script). Les deux calculs de débit ont été refaits : 70 × 70 mL = 4 900 mL/min ≈ 5 L/min (063) ; 75 × 80 mL = 6 000 mL/min = 6 L/min (067).

## Questions corrigées et remplacées

| Source | Problème | Décision |
|---|---|---|
| bph:ch6:banque:013 | Réponse acceptée « numération sanguine » trop large : ce n'est pas le nom donné par le cours. | Corrigée : variante retirée (restent NFS et numération formule sanguine). |
| bph:ch6:banque:016 | Énoncé au singulier (« Quel anticorps ») alors que les propositions sont au pluriel. | Corrigée : « Quels anticorps contient le plasma… ». |
| bph:ch6:banque:029 | Bonne réponse recopiée mot pour mot du cours (« Il propulse le sang dans tout l'organisme, à une pression plus forte ») et nettement la plus longue. | Corrigée : bonne réponse « Il envoie le sang vers tous les organes » ; explication reprise. |
| bph:ch6:banque:051 | Variantes d'écriture manquantes. | Corrigée : ajout de « 0,4s » et « 0.4 s ». |
| bph:ch6:banque:056 | Explication imprécise (« L'ECG montre le signal électrique ») pour justifier « activité électrique ». | Corrigée : explication reformulée à partir de la légende de la figure 6.4. |
| bph:ch6:banque:060 | Doublon de la 052 (le cœur bat seul, même isolé du système nerveux), même fait en vrai/faux. | Remplacée : vrai/faux (faux, difficulté 2) « sur l'ECG, la contraction précède la dépolarisation ». |
| bph:ch6:banque:063 | Difficulté 3 pour un calcul donné tel quel dans le cours (70 × 70 mL ≈ 5 L/min). | Corrigée : difficulté 3 → 2. |
| bph:ch6:banque:067 | Marge relative de 10 % (5,4 à 6,6 acceptés) trop large pour un calcul exact ; variante « 6L/min » absente. | Corrigée : marge absolue de 0,1 L/min ; variante ajoutée. |
| bph:ch6:banque:095 | Variante sans espace absente. | Corrigée : ajout de « 140mmHg ». |
| bph:ch6:banque:101 | Distracteur « La première, avant les cancers » défendable pour les femmes (le cours dit « la première chez les femmes ») ; difficulté 3 pour un rappel direct. | Corrigée : énoncé « Pour l'ensemble de la population française… » ; difficulté 3 → 2. |
| bph:ch6:banque:108 | Variantes sans espace absentes. | Corrigée : ajout de « 5g » et « moins de 5g ». |
| bph:ch6:banque:112 | Explication hors cours (« avant de gêner la circulation »). | Corrigée : explication reprise avec les mots du cours. |
| bph:ch6:banque:114 | Reformulation proche de la 111 (rupture de plaque → caillot qui bouche l'artère). | Remplacée : vrai/faux (vrai, difficulté 2) « la plaque d'athérome épaissit et durcit la paroi de l'artère » (figure 6.6). |
| bph:ch6:banque:127 | L'explication qualifiait la troponine d'« enzyme » (terme du cours, mais inexact : c'est une protéine). | Corrigée : le mot « enzyme » est retiré de l'explication ; voir les points de doute. |
| bph:ch6:banque:128 | Doublon de la 120 (signes de l'infarctus moins typiques chez la femme). | Remplacée : vrai/faux (faux, difficulté 2) « le traitement de l'insuffisance cardiaque comprend un régime riche en sel ». |

## Totaux

- Gardées sans changement : 115
- Corrigées : 12 (013, 016, 029, 051, 056, 063, 067, 095, 101, 108, 112, 127)
- Remplacées : 3 (060, 114, 128)

Répartition après relecture : types 65 / 25 / 27 / 13 (vrai/faux : 15 vrais, 12 faux) ; difficultés 52 / 54 / 24 ; `npm run banque:verifier -- 6` : « Banque du chapitre 6 conforme : 130 questions. »

Points signalés par la rédaction et jugés acceptables :

- 007 : « le reste du volume est formé des cellules » se lit dans le « Je retiens » (sang = plasma 55 % + hématies, leucocytes, plaquettes).
- 017 : le distracteur « O+ » est faux d'après « O− est donneur universel ».
- 077 et 078 : sang pauvre en O2 dans les veines caves, riche dans les veines pulmonaires et l'aorte : déduit du « Je retiens » (double circulation) et de « cœur droit : sang pauvre en O2 ; cœur gauche : sang riche en O2 ».
- 105 : « arrêter les médicaments dès que la pression est normale » est faux d'après « pris tous les jours, souvent à vie ».
- Débit cardiaque (062 à 067) et athérosclérose (109 à 116) : notions minces dans le cours, mais chaque question s'appuie sur une phrase précise.

## Points de doute pour l'enseignant

1. **056** : « l'ECG enregistre l'activité électrique du cœur » n'est pas écrit dans le cours ; il se déduit du nom (électro-cardiogramme), du paragraphe sur le signal électrique et de la légende de la figure 6.4 (dépolarisation). À confirmer.
2. **102** : le distracteur « cholestérol HDL » n'apparaît pas dans le cours, qui ne cite que le LDL. Il est scientifiquement faux comme facteur de risque, mais un élève peut ne pas connaître le terme ; à remplacer si tu préfères des distracteurs tirés du cours.
3. **127 et le cours** : le cours dit « troponine (enzyme libérée par les cellules cardiaques détruites) ». La troponine est une protéine du muscle cardiaque, pas une enzyme ; l'explication de la 127 évite le mot, mais la phrase du cours mérite d'être corrigée.
4. **067** : le calcul donne 6 L/min au repos, alors que le cours donne « environ 5 L/min » au repos ; la situation reste plausible, mais un élève peut être surpris.
5. **069** : « on y prend le pouls » → « paroi pulsatile » : la bonne réponse se rapproche du mot de l'énoncé (pouls/pulsatile) ; gardée car le cours lie explicitement les deux.
6. **Redites d'idée** : 041, 042, 046, 047 et 049 portent toutes sur l'ouverture ou la fermeture des valves pendant la révolution cardiaque ; 100, 103 et 106 sur les facteurs non modifiables (âge, antécédents). Les énoncés diffèrent, mais le contenu se répète.
7. **Difficultés** : 014 (hématopoïèse), 061 (faisceau de His), 110 et 121 sont cotées 3 pour un rappel du cours ; gardées pour respecter le quota de difficulté 3 (24 sur 26 visées), à baisser si la répartition le permet.
