# Relecture de la banque du chapitre 1 de SVT (1re, spécialité) contre le cours

Relecture des 150 questions de `svt-ch1.json` contre le texte du chapitre 1 (« Les divisions cellulaires des eucaryotes »).

## Méthode

1. **Rédaction** : 150 questions écrites à partir du seul texte du chapitre (75 qcm_unique, 30 qcm_multiple, 30 vrai_faux, 15 réponses courtes), sur les 10 notions du plan.
2. **Auto-relecture** : chaque question relue contre le texte brut du chapitre (une seule bonne réponse ? information présente dans le texte ?) ; corrections faites avant la relecture indépendante (énoncés trop proches 052/053, 066/068, 074/150 ; un distracteur défendable de la 052 remplacé).
3. **Relecture indépendante** : un sous-agent a résolu les 150 questions avec le seul texte du chapitre, sans voir les réponses attendues, et a laissé des remarques.
4. **Comparaison automatique** des réponses attendues et des siennes, puis **arbitrage** de chaque écart et de chaque remarque (ci-dessous).

## Relecture indépendante

Accord initial : **144/150** ; 6 écarts, tous sur des vrai/faux consécutifs (125 à 131), et 15 remarques.

| Source | Écart ou remarque | Décision |
|---|---|---|
| svt:ch1:banque:125 | Écart : attendu vrai (l'enveloppe du noyau disparaît en prophase), relecteur faux. | Gardée : la phrase reprend mot pour mot le texte de la prophase. Les six écarts se suivent et le relecteur est d'accord sur toutes les autres questions des mêmes notions : c'est presque sûrement un décalage dans sa liste de réponses. |
| svt:ch1:banque:126 | Écart : attendu faux (la nouvelle paroi concerne les cellules végétales), relecteur vrai. | Réponse gardée (le texte : étranglement chez les cellules animales). Énoncé réécrit sans le mot « cytodiérèse », qui donnait la réponse de la 145. |
| svt:ch1:banque:127 | Écart : attendu faux (en mitose, ce sont les chromatides sœurs qui se séparent), relecteur vrai. | Gardée : le texte est explicite (anaphase de mitose : chromatides ; méiose I : homologues). |
| svt:ch1:banque:128 | Écart : attendu vrai (le fuseau est formé de fibres de protéines), relecteur faux. | Gardée : définition du fuseau dans le texte. |
| svt:ch1:banque:129 | Écart : attendu faux (les fibres s'attachent aux centromères), relecteur vrai. | Gardée : le texte dit « au niveau des centromères ». |
| svt:ch1:banque:131 | Écart : attendu vrai (la méiose II se déroule comme une mitose), relecteur faux. | Gardée : phrase du texte (« comme dans une mitose : … les chromatides sœurs se séparent »). |
| svt:ch1:banque:003 | Remarque : la bonne proposition « Les histones » donne la réponse de la 138. | Gardée ; c'est la 138 qui est réécrite (nucléosomes). |
| svt:ch1:banque:138 | Remarque : réponse donnée par la 003 ; accepter « histone ». | Réécrite : elle demande le nom des unités en « collier de perles » (nucléosomes, avec variantes), présent dans le texte. |
| svt:ch1:banque:013 | Remarque : nomme la colchicine et son rôle, ce qui donne la 141. | Gardée ; c'est la 141 qui est réécrite. |
| svt:ch1:banque:141 | Remarque : réponse donnée par la 013. | Réécrite : quelles cellules du sang cultive-t-on pour un caryotype (globules blancs, leucocytes, avec variantes), information du texte. |
| svt:ch1:banque:039 | Remarque : le mot « cytodiérèse » donne la réponse de la 145. | Énoncé réécrit (« comment le cytoplasme se partage-t-il »), sans changer les propositions. |
| svt:ch1:banque:145 | Remarque : prévoir « cytodierese », « la cytodiérèse », « cytocinèse ». | Variantes « cytocinèse » et « la cytocinèse » ajoutées (les autres y étaient). |
| svt:ch1:banque:059 | Remarque : nomme la fécondation et son effet, ce qui donne la 149. | Réécrite sans le mot « fécondation » : comment qualifier la cellule formée par l'union d'un spermatozoïde et d'un ovule (diploïde). |
| svt:ch1:banque:149 | Lien avec la 059. | Énoncé raccourci (« l'union d'un spermatozoïde et d'un ovule »), sans « rétablit 2n », qui donnait la réponse de la nouvelle 059. |
| svt:ch1:banque:042 | Vérification des liens : le distracteur « La fécondation de l'ovule » nommait la réponse de la 149. | Distracteur remplacé par « La séparation des chromosomes homologues en méiose I ». |
| svt:ch1:banque:024 | Remarque : l'exposant de 2<sup>k</sup> est perdu dans le texte extrait (« 2k »). | Défaut de l'extraction, pas de la question (l'application affiche l'exposant). Explication réécrite avec des exposants Unicode (2ᵏ, 2⁵). |
| svt:ch1:banque:143 | Même remarque sur 2<sup>k</sup>. | Même décision ; explication avec 2ᵏ et 2³. |
| svt:ch1:banque:047 | Remarque : sans fuseau, les chromosomes ne s'alignent pas vraiment (« pseudo-métaphase »). | Gardée : la formulation suit le texte (« restent bloqués en métaphase ») et le relecteur la juge acceptable à ce niveau. |
| svt:ch1:banque:085 | Remarque : en anaphase, la cellule contient encore 2Q ; à bien expliquer. | Gardée : l'explication le dit déjà (« la cellule n'est pas encore divisée : elle contient toujours 2Q »). |
| svt:ch1:banque:106 | Remarque : certaines cellules eucaryotes perdent leur noyau (globules rouges des mammifères). | Énoncé reformulé au niveau des groupes : « Tous les eucaryotes (animaux, végétaux, champignons) possèdent des chromosomes dans le noyau de leurs cellules. » |
| svt:ch1:banque:137 | Remarque : prévoir « centromere ». | Variante ajoutée (la normalisation ignore déjà les accents). |
| svt:ch1:banque:142 | Remarque : prévoir « cellule-oeuf », « cellule oeuf », « la cellule-œuf », « zygote ». | Déjà présentes, gardée. |
| svt:ch1:banque:150 | Remarque : prévoir « 3 » et « 3h ». | Variantes « 3 h » et « 3h » ajoutées (« 3 » y était, avec une marge de 0,2). |

## Totaux

- 150 questions ; types 75 / 30 / 30 / 15 ; difficultés 60 / 60 / 30.
- Vrai/faux : 16 vrais, 14 faux.
- La bonne réponse des qcm_unique est la plus longue dans 18 cas sur 75.
- Contrôle (`verifierBanque`) : « Banque du chapitre 1 conforme : 150 questions. »

## Seconde vérification indépendante

Les 18 questions modifiées ou contestées lors de la relecture (`ch1-modifiees.txt`) ont été résolues à nouveau par un second relecteur indépendant, sans les réponses : **accord 18/18**. Ses remarques (variantes de 138, 141 et 145) portaient sur des variantes déjà acceptées. Aucune modification.

## Questions laissées à relire

Aucune question ne reste douteuse : les six écarts sont des erreurs du relecteur sur des affirmations écrites telles quelles dans le chapitre, et les remarques ont conduit à corriger ou à confirmer les questions concernées. Les questions modifiées (liste dans `ch1-modifiees.txt`) passeront par la seconde vérification prévue.

Point de doute pour l'enseignant, sans effet sur la validité : le chapitre ne cite pas le mot « zygote » ni « cytocinèse », acceptés comme variantes de réponses courtes (142, 145).

À relire : aucune
