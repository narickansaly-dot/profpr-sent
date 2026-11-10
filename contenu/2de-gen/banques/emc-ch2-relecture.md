# Relecture de la banque du chapitre 2 d'EMC contre le cours

Relecture des 150 questions de `emc-ch2.json` contre le texte du chapitre 2 (« La laïcité, garante de la liberté de conscience et du pluralisme »), question par question, avec les mêmes critères que pour le chapitre 1 (exactitude selon le cours seul, lecture unique, bonnes réponses seules justes, explication, niveau seconde, interdits du § 3 de la spec 6a, typographie, tutoiement).

Contrôle automatique (`verifierBanque`, préfixe `emc`, 150 questions) : conforme. Répartition finale : types 75 / 30 / 30 / 15 ; difficultés 59 / 61 / 30 ; 15 vrais et 15 faux ; bonne réponse la plus longue dans 33 % des QCM à une réponse.

## Corrections avant fusion

Le premier jet échouait au contrôle sur trois règles. Corrections :

| Règle | Problème | Décision |
|---|---|---|
| Difficultés | 51 / 62 / 37 : plusieurs questions de simple rappel étaient cotées 3. | Recotées : 021, 035, 071, 072, 114, 150 et le vrai/faux devenu 124 (rappels directs, de 3 à 1 ou 2) ; 007, 023, 048, 067, 109 (de 2 à 1). |
| Biais de longueur | La bonne réponse était la plus longue dans 45 % des QCM. | Distracteurs allongés ou bonne réponse resserrée dans 001, 005, 029, 037, 042, 052, 057, 060, 063 (même sens). |
| Énoncés proches | 005 / 108 (0,85) et 087 / 088 (0,82). | 108 cite la phrase complète de l'article 1er ; 088 est reformulée (« Que faut-il retenir de la place de la laïcité face à l'athéisme et aux religions ? »). |

## Questions remplacées à la relecture

| Source | Problème | Décision |
|---|---|---|
| emc:ch2:banque:075 | Énoncé fautif (« Qui l'école publique devient-elle… ») et doublon inverse de la 009 (lois Ferry et Goblet). | Remplacée : QCM sur un cas (un élève abandonne la religion de sa famille : liberté de conscience). |
| emc:ch2:banque:111 | Vrai/faux « La loi de séparation date de 1905 », troisième question sur la même date (013, 137). | Remplacée : vrai/faux (vrai) : un policier en service est soumis à la neutralité. |
| emc:ch2:banque:124 | Vrai/faux « Le blasphème est puni par la loi de 1905 », doublon de la 041. | Remplacée : vrai/faux (faux) : la laïcité est hostile aux religions. |
| emc:ch2:banque:005 | Distracteur « L'article 66 », trop court pour équilibrer les longueurs, remplacé un temps par un article inexistant. | Distracteur final : « L'article 66-1 » (article réel de la Constitution). |

## Points de doute pour l'enseignant

- **Paires proches gardées** : rapporteur de la loi (014 en QCM, 138 en réponse courte) ; loi de 2004 (046 en QCM, 144 en réponse courte) ; Charte de la laïcité à l'École (048, 049, 145).
- **Question 059 (patient aux urgences)** : l'exemple vient de la règle du cours (« il ne peut pas refuser d'être soigné par un médecin de l'autre sexe en cas d'urgence »). Situation sensible ; formulation à vérifier.
- **Question 066 (entreprise de vêtements)** : la conclusion (« ni justifiée ni proportionnée ») découle des deux conditions du cours ; un juge apprécierait au cas par cas.
- **Parents accompagnateurs (052, 093, 128)** : règle présentée sans nuance de jurisprudence ; conforme au cours, à confirmer avec le manuel.
