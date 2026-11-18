# Relecture de la banque du chapitre 12 d'enseignement scientifique (1re)

Relecture indépendante à l'aveugle : un sous-agent a résolu les 150 questions de `ens-sci-ch12.json` (calculs refaits) sans voir les réponses ; ses réponses ont été comparées automatiquement à celles de la banque, puis chaque écart et chaque remarque ont été examinés un par un contre le texte du chapitre 12 (« Le son, une information à coder »).

## Résultat de la relecture à l'aveugle

- Concordance initiale : **150/150**.
- Écarts : **0**.
- Remarques (questions concordantes commentées ou à confiance < 3) : **34**.
- Répartition des 34 remarques :
  - erreurs de la banque : 0 ;
  - ambiguïtés : 6 (009 et 085, incohérence du cours sur le critère de Shannon ; 030 et 130, listes de propositions incomplètes ; 134, formulation inhabituelle ; 135, ZIP d'un WAV) ;
  - distracteurs défendables : 0 ;
  - variantes de réponse courte manquantes : 8 (047, 049, 050, 097, 098, 100, 146, 150) ;
  - erreurs du relecteur ou remarques sans suite : 20. Ce sont des calculs vérifiés et justes (057, 058, 064, 067, 068, 078, 079, 083, 108, 113, 114, 120, 121, 129, 131, 149) et des variantes déjà acceptées, directement ou par la normalisation qui ignore la casse et les accents (048, 099, 147, 148).

## Corrections faites

| Source | Problème | Décision |
|---|---|---|
| Cours (section « Échantillonnage ») | Le critère de Shannon était écrit avec une inégalité stricte (fe > 2 × fmax), mais le tableau donnait « fréquence maximale reproduite = fe / 2 » et le téléphone (8 kHz) reproduisait « 4 kHz ». | Ajout de « on reproduit les fréquences jusqu'à un peu moins de fe / 2 » ; tableau : colonne « Fréquences reproduites (jusqu'à un peu moins de fe / 2) », téléphone « environ 3,4 kHz », CD « près de 22 kHz », 48 kHz « près de 24 kHz », 96 kHz « près de 48 kHz ». Section « Choisir les paramètres » alignée (3,4 kHz pour la voix au téléphone). |
| Cours (figure 2) | Le cours ne disait pas explicitement que les tensions du microphone et du haut-parleur sont analogiques (question 134). | Légende complétée : « la tension du microphone et celle envoyée au haut-parleur sont analogiques ». Deux phrases secondaires retirées pour rester sous 22 000 caractères. |
| ens-sci:ch12:banque:009 | L'explication citait le téléphone « 8 kHz pour une voix limitée à 4 kHz », en contradiction avec fe > 2 × fmax. | Explication réécrite : il faut fe strictement supérieure à 8 kHz ; le téléphone à 8 kHz ne reproduit la voix que jusqu'à environ 3,4 kHz. |
| ens-sci:ch12:banque:085 | « Les fréquences jusqu'à 24 kHz peuvent être reproduites » : discutable à la limite avec l'inégalité stricte. | Proposition reformulée : « jusqu'à un peu moins de 24 kHz » ; explication alignée. |
| ens-sci:ch12:banque:031, 063, 114 | Mêmes valeurs limites (4 kHz, 11,025 kHz) que le cours corrigé. | Explications alignées (environ 3,4 kHz ; un peu moins de 11 kHz) ; dans la 063, la bonne réponse devient « La voix reste compréhensible sous 3,4 kHz environ ». |
| ens-sci:ch12:banque:030 | La durée, qui intervient dans la formule, n'était pas proposée. | Énoncé : « En plus de la durée, quelles grandeurs interviennent… ». |
| ens-sci:ch12:banque:130 | Pas de proposition « 8 bits » pour le message téléphonique. | Ajout de « Une quantification sur 8 bits » (juste) : 3 bonnes réponses sur 5 propositions ; explication alignée sur 3,4 kHz. |
| ens-sci:ch12:banque:134 | « L'entrée du convertisseur analogique-numérique » : élément absent tel quel du cours. | Question réécrite : « quels signaux sont analogiques ? » avec la tension du microphone, la tension envoyée au haut-parleur, la vibration de l'air (justes) et les nombres stockés dans le fichier (faux). |
| ens-sci:ch12:banque:135 | « Une archive ZIP du fichier WAV » : juste selon le cours mais peu pertinent pour du son. | Remplacée par « Une compression sans perte » ; ajout du distracteur « Le fichier WAV laissé tel quel » (aucun gain de place). Bonnes réponses : FLAC et compression sans perte. |
| ens-sci:ch12:banque:047 | Variantes collées refusées. | Ajout de « 44100Hz », « 44,1kHz », « 44.1kHz ». |
| ens-sci:ch12:banque:049 | Pluriel anglais. | Ajout de « bytes », « un byte ». |
| ens-sci:ch12:banque:050 | Sigle anglais. | Ajout de « ADC » (« can » était déjà accepté, la casse est ignorée). |
| ens-sci:ch12:banque:097 | Arrondi non précisé ; « 5,8 » refusé. | Énoncé : « au centième près » ; marge absolue portée à 0,05 (5,8 accepté) ; explication complétée. |
| ens-sci:ch12:banque:098 | Variantes du pourcentage. | Ajout de « 40 % » avec espace insécable, « 40,0 », « 40 pour cent ». |
| ens-sci:ch12:banque:100 | Réponse donnée en Hz. | Ajout de « 30 000 Hz » et « 30000 Hz ». |
| ens-sci:ch12:banque:146 | Variante sans accent. | Ajout de « echantillon » (déjà couverte par la normalisation, ajoutée par sécurité). |
| ens-sci:ch12:banque:150 | Variantes de l'unité. | Ajout de « 72Mo » et « 72 mégaoctets » (« 72 Mo » était déjà accepté). |

## Totaux

- 150 questions, sources `ens-sci:ch12:banque:001` à `150`, sans statut.
- Types : 75 qcm_unique, 30 qcm_multiple (14 à 2 bonnes réponses, 16 à 3), 30 vrai_faux (15 vrais, 15 faux), 15 reponse_courte.
- Difficultés : 59 / 62 / 29.
- Positions des bonnes réponses des qcm_unique : 19 / 19 / 19 / 18 (indices 0 à 3).
- La bonne réponse des qcm_unique est la plus longue (égalités comprises) dans 14 cas sur 75 (19 %), jamais strictement.
- Contrôle du pilote : « Banque du chapitre 12 conforme : 150 questions. » ; cours : « Nettoyage HTML : rien n'est retiré. »

## Questions laissées à relire

Aucune.

## Points de doute pour l'enseignant

1. **Taux de compression** : le cours le définit comme la part supprimée, (taille initiale − taille compressée) / taille initiale. Certains manuels utilisent la part conservée ou le quotient ; un encadré le signale et les énoncés précisent « au sens du cours ». À aligner sur le manuel de la classe.
2. **Critère de Shannon** : présenté en mention simple, avec une inégalité stricte (fe > 2 × fmax) et « jusqu'à un peu moins de fe / 2 » ; la bande téléphonique est donnée à « environ 3,4 kHz ».
3. **Capacité d'un CD** : « environ 700 à 800 Mo » et « 74 min ≈ 783 Mo de son ». Le chiffre courant de 700 Mo est la capacité en données.
4. **Valeurs approchées** : réduction de 40 à 50 % pour le FLAC ; numérique responsable de « quelques pourcents » des émissions de gaz à effet de serre ; vidéo « majeure partie » du trafic. Ces estimations varient selon les sources.
5. **Convention d'unités** : préfixes décimaux uniquement (1 ko = 1 000 octets) ; le kibioctet (1 024 octets) est seulement mentionné.
6. **Signal analogique** : la vibration de l'air est traitée comme un signal analogique (variation continue), au même titre que la tension du microphone.
