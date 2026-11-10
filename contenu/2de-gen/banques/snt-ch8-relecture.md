# Relecture de la banque du chapitre 8 de SNT (La photographie numérique)

Banque `snt-ch8.json` : 150 questions (75 / 30 / 30 / 15 ; difficultés 60 / 60 / 30 ; 17 vrais et 13 faux), au statut `a_relire`. Contrôle automatique conforme. Tous les calculs ont été refaits : nombres de pixels, poids non compressés, conversions pixels vers pouces et centimètres, négatifs, niveaux de gris, répartition du filtre de Bayer.

## Corrigées pendant la relecture

| Source | Problème | Décision |
| --- | --- | --- |
| 017, 018, 019, 044, 061 | Cinq énoncés « Quelle couleur correspond au code RVB (…) ? » jugés identiques par le contrôle, qui ignore les chiffres et la ponctuation. | Reformulés un à un. |
| 130 et 092 | Trop proches de 063 et 085. | Reformulés. |
| QCM « Quel ordre chronologique est exact ? » | Une difficulté 3 en trop. | Passé en difficulté 2. |
| 10 QCM | Biais de longueur (44 %). | Distracteurs allongés (24 sur 75 après correction). |

## Points de doute

1. **Niépce, 1826** : le programme cite 1826 ; les historiens datent le « Point de vue du Gras » de 1826 ou 1827. Une réponse courte et un QCM utilisent 1826.
2. **Kirsch, 176 × 176 pixels** : valeur la plus citée pour l'image de 1957.
3. **Sasson, « 0,01 mégapixel, 23 secondes »** : chiffres de la description de Kodak (100 × 100 pixels, enregistrement sur cassette).
4. **Regroupement des photosites par quatre** (« pixel binning ») : présenté simplement. Le capteur de 48 Mpx utilise souvent un filtre « Quad Bayer », que le cours ne détaille pas.
5. **Niveaux de gris par moyenne** : le cours utilise `(r + v + b) // 3` ; la luminance pondérée (0,299 R + 0,587 V + 0,114 B) est plus juste mais hors programme. Les questions disent « avec la méthode du cours ».
6. **Seuil du noir et blanc** : « si g est supérieur à 127, blanc ». Une question de difficulté 3 porte sur g = 127 (donne noir).
7. **Mo** : les poids sont calculés avec 1 Mo = 1 000 000 octets, comme dans le cours. Un élève qui connaît 1 Mio = 1 048 576 octets pourrait hésiter.
8. **Figure 1 du cours** : la mosaïque de Bayer utilise des couleurs fixes (`fill="#4caf50"`…), sans les classes de thème. Elle reste lisible en mode sombre, mais ne suit pas la couleur du cours.
