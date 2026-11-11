# Relecture de la banque du chapitre 4 d'enseignement scientifique (1re)

Relecture indépendante à l'aveugle : un sous-agent a résolu les 150 questions de `ens-sci-ch4.json` (calculs refaits) sans voir les réponses ; ses réponses ont été comparées automatiquement à celles de la banque, puis chaque écart et chaque remarque ont été examinés un par un contre le texte du chapitre 4 (« Le rayonnement solaire »).

## Résultat de la relecture à l'aveugle

- Concordance initiale : **150/150**.
- Écarts : **0**.
- Remarques (questions concordantes commentées ou à confiance < 3) : **42**.
- Répartition des 42 remarques :
  - erreurs de la banque : 1 (052, distracteur qui classait 78 µm dans les micro-ondes) ;
  - ambiguïtés de formulation : 5 (025, 038, 071, 116, 127) ;
  - distracteurs défendables : 0 ;
  - variantes de réponse courte manquantes : 10 (029, 030, 061, 062, 063, 078, 108, 120, 134, 150) ;
  - erreurs du relecteur ou remarques sans suite : 26. Ce sont des calculs vérifiés et justes (021, 022, 028, 037, 050, 051, 057, 068, 075, 076, 082, 083, 088, 093, 122, 123), des variantes déjà couvertes par la normalisation ou par la marge (015, 045, 077, 133), des questions faciles mais correctes (008, 023, 104, 117, 139) et la notation ⁰₁e du positon (006), qui est celle des manuels.

## Corrections faites

| Source | Problème | Décision |
|---|---|---|
| ens-sci:ch4:banque:025 | Proposition « Cette perte correspond à l'énergie qu'il rayonne » jugée vague. | Reformulée : « Cette masse perdue est convertie en l'énergie qu'il rayonne ». |
| ens-sci:ch4:banque:029 | Écritures en puissance de dix refusées. | Ajout des variantes « 7 × 10⁻³ », « 7,0 × 10⁻³ », « 7e-3 », « 7.10^-3 » (marge de 0,0005 conservée sur 0,007). |
| ens-sci:ch4:banque:030 | « 4,2 millions » refusé. | Ajout des variantes texte « 4,2 millions » et « 4.2 millions » ; la marge de 0,3 accepte déjà 4. |
| ens-sci:ch4:banque:038 | « les X », abréviation familière. | Remplacé par « les rayons X » ; un distracteur allongé pour que la bonne réponse ne soit pas la plus longue. |
| ens-sci:ch4:banque:052 | Distracteur « 78 µm, dans les micro-ondes » : 78 µm est dans l'infrarouge (moins de 1 mm), le distracteur était faux pour une mauvaise raison. | Remplacé par « Vers 78 µm, dans l'infrarouge lointain » : il n'est plus faux que par l'oubli de la conversion en kelvins. |
| ens-sci:ch4:banque:061 | « 310 K » refusé. | Ajout de la variante « 310 K » ; 310,15 est déjà accepté par la marge de 0,2. |
| ens-sci:ch4:banque:062 | Nombre écrit avec une espace, ou avec l'unité. | Ajout des variantes texte « 5 800 », « 5800 K », « 5 800 K ». |
| ens-sci:ch4:banque:063 | Risque de refus pour 966 ou 970. | La marge relative de 1 % (957 à 977 nm) les accepte déjà ; ajout de « 967 nm ». |
| ens-sci:ch4:banque:071 | « Boltzmann l'a justifiée » : pronom sans antécédent dans la proposition. | Reformulée : « Boltzmann a justifié la loi de Stefan par la théorie en 1884 ». |
| ens-sci:ch4:banque:078 | « 1 000 » avec espace refusé. | Ajout des variantes « 1 000 », « 1000 W », « 1 000 W ». |
| ens-sci:ch4:banque:108 | « 47° » refusé. | Ajout de la variante « 47° ». |
| ens-sci:ch4:banque:116 | Le cours ne disait pas explicitement que le Soleil passe au zénith sur les tropiques eux-mêmes. | Cours complété (section « Variations ») : « un seul jour par an sur les tropiques eux-mêmes ». Question inchangée. |
| ens-sci:ch4:banque:120 | 66,5 (valeur courante des manuels) et « 66,6° » refusés. | Ajout des variantes « 66,5 », « 66.5 », « 66,6° », « 66,6° N » ; la marge de 0,5 reste. |
| ens-sci:ch4:banque:127 | Deux propositions justes disaient la même chose (écart de 16 °C). | La redondante est remplacée par « La moyenne de ces deux mois vaut 24 °C » (fausse) : 2 bonnes réponses au lieu de 3. L'explication est complétée. |
| ens-sci:ch4:banque:134 | Pas de consigne d'arrondi ; le cours donne « environ −2,8 °C » ; signe « − » (U+2212) non reconnu comme nombre. | Variantes « -2,75 », « -2.75 », « −2,75 », « -2,8 », « -2.8 », « −2,8 » ; la marge de 0,06 s'applique aux références écrites avec « - ». L'explication cite −2,8 °C. |
| ens-sci:ch4:banque:150 | « cristallin », réponse plus précise, refusée. | Ajout de « cristallin » et « le cristallin » (« oeil » était déjà accepté). |

## Totaux

- 150 questions, sources `ens-sci:ch4:banque:001` à `150`, sans statut.
- Types : 75 qcm_unique, 30 qcm_multiple, 30 vrai_faux, 15 reponse_courte.
- Difficultés : 60 / 60 / 30.
- Vrai/faux : 16 vrais, 14 faux.
- Positions des bonnes réponses des qcm_unique : 19 / 19 / 19 / 18 (indices 0 à 3).
- La bonne réponse des qcm_unique est la plus longue (ex æquo compris) dans 12 cas sur 75 (16 %).
- Contrôle du pilote : « Banque du chapitre 4 conforme : 150 questions. » ; cours : « Nettoyage HTML : rien n'est retiré. »

## Questions laissées à relire

Aucune.

## Points de doute pour l'enseignant

1. **Valeurs du Soleil** : température de surface 5 800 K (valeur précise 5 772 K), cœur à 15 millions de K, puissance 3,8 × 10²⁶ W, perte de masse 4,2 × 10⁹ kg/s, environ 0,7 % de la masse de l'hydrogène convertie, environ 600 millions de tonnes d'hydrogène fusionnées par seconde. À aligner sur le manuel de la classe.
2. **Domaines du spectre** : visible de 400 à 800 nm (certains manuels donnent 380 à 780 nm). Limites UVA, UVB, UVC : 400, 315, 280 et 100 nm.
3. **Conversion des températures** : T = θ + 273 (273,15 dans certains manuels).
4. **Angle d'incidence** : le cours introduit P = P<sub>max</sub> × cos θ avec un tableau de cosinus (0,87 ; 0,71 ; 0,50). Le programme dit seulement que la puissance « dépend de l'angle » : à garder ou à alléger selon les habitudes de la classe.
5. **Géométrie terrestre** : axe incliné de 23,4° (souvent 23,5° ou 23°26'), cercles polaires à 66,6° (souvent 66,5° ou 66°34'). Hauteurs du Soleil à midi à Paris : environ 18°, 41° et 64°. La règle « 90° − latitude aux équinoxes » est ajoutée au cours.
6. **Midi solaire** : vers 13 h en hiver et 14 h en été à l'heure légale en France (ordre de grandeur, variable selon la longitude).
7. **Données de températures** : les températures mensuelles (moyenne 12,0 °C) et les relevés de la station de montagne sont des données d'exemple, présentées comme telles. Brest et Strasbourg sont citées sans valeur chiffrée.
8. **Santé** : seuil de protection à l'indice UV 3 ; environ +10 % d'UV tous les 1 000 m ; réflexion par la neige jusqu'à 80 % ; classement des cabines de bronzage par le CIRC en 2009 ; interdiction aux mineurs en France.
9. **Longueur du chapitre** : environ 34 000 caractères de HTML, dont environ 10 000 pour les trois figures SVG, au-dessus de la cible de 22 000.
