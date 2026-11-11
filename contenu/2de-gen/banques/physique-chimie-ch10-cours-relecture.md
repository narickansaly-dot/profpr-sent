# Relecture du chapitre 10 de physique-chimie (2de) : « Émission et perception d'un son »

Relecture indépendante (N = 10). Fichier corrigé : `chapitres/ch10.json` (dossier de travail). La version du rédacteur reste dans `chapitres/ch10-redaction.json`.

## Bilan

- **Programme** : les notions N64 à N68 et les capacités C82 à C95 sont toutes traitées, dans les six sections du plan, dans l'ordre. Émission et caisse de résonance (C82), rôle du milieu et vide (C83), vitesse dans l'air comparée à d'autres vitesses (C84), mesure de la vitesse avec deux microphones (C85), période et fréquence à partir d'un oscillogramme (C86, C88), chaîne de mesure (C87), microcontrôleur et buzzer décrits en phrases (C89), fonction périodique s(t + T) = s(t) (C90), domaines de fréquences (C91), hauteur et fréquence (C92), intensité et niveau (C93), échelle et dangers (C94), enregistrement au smartphone (C95). Rien n'est hors programme : les capteurs sont renvoyés au chapitre 12, la lumière au chapitre 11, l'incertitude-type au chapitre 1. La formule reliant L à I n'est pas donnée, comme le veut le « lien qualitatif » du programme. Les sept objectifs reprennent ceux du plan, à l'infinitif.
- **Exactitude** : tous les calculs ont été refaits. Tonnerre : 340 × 3,0 = 1 020 m, arrondi à 1,0 × 10³ m. Mesure de la vitesse : 1,00 / 2,94 × 10⁻³ = 340 m·s⁻¹. Diapason : 1 / 440 = 2,27 ms. Sons A et B : 2,0 × 10² Hz et 5,0 × 10² Hz. Conversions de vitesses : 5 km·h⁻¹ ≈ 1,4 m·s⁻¹, 130 km·h⁻¹ ≈ 36 m·s⁻¹, 900 km·h⁻¹ = 250 m·s⁻¹. Rapport lumière / son ≈ 8,8 × 10⁵, soit « environ un million ». Repères des décibels : × 2 → + 3 dB, × 10 → + 10 dB, × 100 → + 20 dB ; 10¹² entre 0 et 120 dB. Durées d'exposition (85 dB : 8 h, puis division par deux tous les 3 dB, 100 dB : 15 min) cohérentes. Valeurs de référence du plan respectées (340 m·s⁻¹, 3,00 × 10⁸ m·s⁻¹).
- **Format** : classes `def`, `warn`, `tbl`, `t`, `th scope`, sans figure ni balise interdite ; signe moins U+2212, « × », U+00A0 avant la ponctuation haute et entre nombre et unité ; champs en texte brut sans balise.
- **Validateur** : `pc.ts cours` (« Cours valide », 6 sections) et `pc.ts typo` (« Typographie conforme ») passent après correction.

## Corrections

| Section | Problème | Correction |
| --- | --- | --- |
| `periode-et-frequence` | Exemple de lecture d'oscillogramme : la donnée « 8,0 divisions » n'a que deux chiffres significatifs, mais les résultats étaient écrits avec trois (10,0 ms, 2,50 ms, 400 Hz). | Données changées (base de temps 0,50 ms par division) : 8,0 × 0,50 = 4,0 ms, T = 1,0 ms, f = 1,0 × 10³ Hz, soit 1,0 kHz. |
| `periode-et-frequence` | L'encadré « Attention » reprenait les valeurs de l'ancien exemple (2,50 ms, 0,400 kHz). | Aligné sur le nouvel exemple : 1,0 ms = 1,0 × 10⁻³ s ; « 1 / 1,0 = 1,0 kHz, pas des hertz ». |
| `periode-et-frequence` | Méthode « deux sommets successifs » fausse pour un signal dont le motif contient plusieurs sommets (voix, instrument). | « deux instants consécutifs où le motif recommence, par exemple deux plus hauts sommets successifs (un motif complexe peut contenir plusieurs sommets) ». |
| `hauteur-et-timbre` | « Une corde plus courte vibre plus vite » : ambigu (vitesse ou fréquence ?), alors que le chapitre parle aussi de vitesse du son. | « vibre avec une fréquence plus grande ». |
| `emettre-un-son` | Le tympan était présenté comme transformant lui-même la vibration en message nerveux. | « cette vibration est transmise à l'oreille interne, qui la transforme en message nerveux ». |
| `propagation-du-son` | Phrase maladroite sur les astronautes « sans air autour d'eux » (ils sont dans des scaphandres pleins d'air). | « dans l'espace, il n'y a pas d'air entre deux astronautes, donc le son ne passe pas de l'un à l'autre ». |
| `dangers-du-bruit` | Seuil de danger donné à 85 dB seulement, alors que beaucoup de documents le placent à 90 dB (85 dB étant alors le « seuil de risque »). | Ajout de « (certains documents le placent à 90 dB) ». |

Points vérifiés et laissés tels quels :

- la définition du signal sonore et de la caisse de résonance (le son plus fort, la note inchangée) ;
- le tableau émetteur, milieu, récepteur ;
- l'expérience de la cloche à vide, présentée avec une diminution progressive du son ;
- le tableau des vitesses (eau 1 500 m·s⁻¹, acier « de l'ordre de 5 000 m·s⁻¹ ») ;
- le protocole de mesure de la vitesse (principe, matériel, précautions, exploitation) ;
- la description du programme du microcontrôleur (entrées, calcul, sortie), sans bloc de code ;
- les domaines de fréquences et leurs exemples ;
- les avertissements aigu / fort et « les décibels ne s'additionnent pas » ;
- l'échelle des niveaux, les effets du bruit et les conseils de protection ;
- l'encadré `a_retenir` (10 points).

## Points de doute pour l'enseignant

1. **Seuil de danger** : selon les manuels, 85 dB est appelé « seuil de risque » ou « seuil de danger », et 90 dB « seuil de danger ». Le chapitre retient 85 dB avec la mention de 90 dB ; aligner sur le vocabulaire du manuel de la classe.
2. **Repères quantitatifs des décibels** : le programme demande un lien **qualitatif** entre intensité et niveau. Le tableau « × 2 → + 3 dB, × 10 → + 10 dB » et l'exemple des deux aspirateurs vont un peu au-delà, sans formule. C'est un usage courant en 2de, mais on peut le réduire si l'on veut s'en tenir strictement au programme.
3. **Tableau des durées d'exposition** : les durées (85 dB pendant 8 h, division par deux tous les 3 dB) sont des repères de prévention issus de la réglementation du travail ; elles sont présentées comme « repère », pas comme une règle légale. À vérifier contre le manuel.
4. **Vitesse du son dans l'acier** : la valeur réelle dépend de l'acier et du type d'onde (environ 5 000 à 6 000 m·s⁻¹) ; « de l'ordre de 5 000 m·s⁻¹ » est volontairement prudent.
5. **0 dB = seuil d'audibilité** : c'est vrai pour l'intensité de référence (10⁻¹² W·m⁻²), proche du seuil d'audibilité vers 1 000 Hz ; le seuil réel dépend de la fréquence. Le chapitre ne le précise pas, choix de niveau.
6. **Intensité sonore** : définie comme « la puissance transportée à travers une surface de 1 m² », sans la formule I = P / S, qui n'est pas au programme.
