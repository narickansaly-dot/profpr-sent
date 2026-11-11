# Relecture de la banque du chapitre 1 d'EMC contre le cours

Relecture des 150 questions de `emc-ch1.json` contre le texte du chapitre 1 (« L'État de droit, garant des libertés »), question par question. Critères : exactitude selon le cours seul, lecture unique, bonne(s) réponse(s) seules justes, explication, niveau seconde, aucune donnée extérieure au chapitre, variantes des réponses courtes, interdits du § 3 de la spec 6a (formules « toutes / aucune », négation piège, réponse lue dans l'énoncé, phrase du cours recopiée), typographie (espace insécable U+00A0 vérifiée par le script) et tutoiement.

Contrôle automatique : `verifierBanque` (les 17 règles de `banque:verifier`, préfixe `emc`, quotas 75 / 30 / 30 / 15 et 60 / 60 / 30) : conforme. Répartition finale : types 75 / 30 / 30 / 15 ; difficultés 59 / 62 / 29 ; 15 vrais et 15 faux ; bonne réponse la plus longue dans 31 % des QCM à une réponse.

## Questions corrigées et remplacées

| Source | Problème | Décision |
|---|---|---|
| emc:ch1:banque:029 | Portait sur le bloc de constitutionnalité « au sommet », déjà demandé en 034 et dans un QCM multiple ; de plus, le tableau du cours disait que le bloc était « adopté » par référendum ou par le Congrès, ce qui est faux pour la DDHC (adoptée en 1789 par l'Assemblée constituante). | Remplacée : qui peut réviser la Constitution (référendum ou Congrès). Le tableau du cours est corrigé en conséquence (« Qui peut les adopter ou les modifier ? », « révision de la Constitution »). |
| emc:ch1:banque:034 | Énoncé à négation (« Quel texte ne fait pas partie… ? »), proche d'une négation piège. | Corrigée : « Lequel de ces textes est une loi ordinaire, placée sous le bloc de constitutionnalité ? ». |
| emc:ch1:banque:112 | Vrai/faux « La DDHC date de 1789 », doublon de la réponse courte sur la même date. | Remplacée : vrai/faux (vrai) sur la création de l'Union européenne en 1992. |
| emc:ch1:banque:126 | Vrai/faux « La Cour européenne des droits de l'homme siège à Strasbourg », doublon du QCM 060. | Remplacée : vrai/faux (vrai) : le Conseil de l'Europe a été créé avant l'Union européenne. |
| emc:ch1:banque:145 | Réponse courte « Strasbourg », troisième question sur le siège de la Cour. | Remplacée : réponse courte sur la ville du sacre des rois (Reims). |
| emc:ch1:banque:147 | Réponse courte « Luxembourg », doublon du QCM 067. | Remplacée : réponse courte « juge des référés » (décision du 26 août 2016). |
| (151e question) | Le premier jet comptait 76 QCM à une réponse, dont une question sur le nombre d'États de l'UE, doublon d'un vrai/faux. | Supprimée. |

## Points de doute pour l'enseignant

- **Paires proches gardées** : sommet de l'ordre judiciaire (040, 120 en vrai/faux inverse, 142 en QCM multiple) ; article 16 de la DDHC (024 et 025 sont deux QCM, 105 un QCM multiple sur les mêmes conditions que 025) ; QPC (038, 041, 042, 088, 119, 141) ; Kelsen (028 et 140). Elles sont justes ; à écarter à la validation si deux d'entre elles tombent dans le même quiz.
- **Décision « burkini »** (questions 048 à 058, 089 à 092, 122 à 125, 143, 144 et 147) : le sujet est sensible. Les questions s'en tiennent au raisonnement juridique (ordre public, nécessité, proportionnalité). Si l'enseignant change l'étude de cas du chapitre, ces questions sont à remplacer.
- **Chiffres susceptibles de changer** : 46 États au Conseil de l'Europe, 27 à l'Union européenne (061, 093, 095, 116, 130). Justes au 10 novembre 2026.
