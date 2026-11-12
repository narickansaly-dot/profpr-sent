# Relecture de la banque du chapitre 13 de SVT (1re) contre le cours

Banque `svt-ch13.json` : 150 questions sur le chapitre 13 (« Mutations, patrimoine génétique et santé »).

## Méthode

1. Rédaction du chapitre, puis de la banque en cinq parties fusionnées par script.
2. Auto-relecture de chaque question contre le texte brut du chapitre : une seule bonne réponse, information présente dans le texte, aucune question qui donne la réponse d'une autre (recherche automatique des réponses attendues dans les énoncés et propositions des autres questions, puis lecture). Une vingtaine de questions ont été reformulées ou remplacées à ce stade.
3. Relecture indépendante : un sous-agent a résolu les 150 questions avec le seul texte du chapitre, sans voir les réponses attendues.
4. Comparaison automatique de ses réponses avec les réponses attendues, puis arbitrage de chaque remarque.

## Relecture indépendante

Taux d'accord initial : 150/150 (aucun écart). Onze remarques ont été traitées.

| Source | Écart ou remarque | Décision |
|---|---|---|
| svt:ch13:banque:018 | La bonne réponse ignore le cas d'une mutation nouvelle, que le cours mentionne et que teste la 013. | Corrigée : l'énoncé demande pourquoi l'allèle est « très probablement » récessif, et la bonne réponse précise « sauf mutation nouvelle chez la fille ». Explication complétée. |
| svt:ch13:banque:057 | Un gamète est haploïde : parler de son « génotype » est maladroit. | Corrigée : « Quel allèle de ce gène ses gamètes portent-ils ? » |
| svt:ch13:banque:087 | Distracteur défendable : si le statut des parents est inconnu, la naissance d'un enfant atteint change le risque suivant (elle prouve que les deux parents sont porteurs). | Corrigée : le distracteur porte sur des parents « dont on sait déjà qu'ils sont porteurs » ; explication complétée. |
| svt:ch13:banque:100 | La proposition sur le cadre légal des tests est exacte, mais ne relève pas d'un « esprit critique » : un élève peut hésiter à la cocher. | Corrigée : l'énoncé demande les affirmations exactes « sur les maladies multifactorielles et les tests génétiques ». |
| svt:ch13:banque:137 | Accepter « chlorure », « ions chlorure », « Cl- », « Cl− » (et éventuellement « chlore »). | Variantes avec le signe moins typographique (Cl−) ajoutées ; les autres étaient déjà acceptées. « Chlore » est refusé : c'est un autre corps chimique que l'ion chlorure. |
| svt:ch13:banque:139 | Précision attendue non indiquée : accepter « 6,3 », voire « 6 ». | Énoncé précisé (« Donne la valeur exacte. »). La marge de 0,05 accepte déjà 6,3 ; « 6 » reste refusé, car le calcul exact est simple. |
| svt:ch13:banque:141 | Accepter « CRISPR-Cas9 », « CRISPR Cas9 », « CRISPR/Cas9 », « CRISPR ». | Déjà acceptées. Aucune modification. |
| svt:ch13:banque:144 | Accepter « la prévalence ». | Déjà acceptée. Aucune modification. |
| svt:ch13:banque:146 | Accepter « un facteur de confusion », « confusion », « biais de confusion ». | Les deux premières étaient acceptées ; « biais de confusion » et « un biais de confusion » ajoutés. |
| svt:ch13:banque:149 | Accepter « maladie de Huntington », « Huntington », « chorée de Huntington ». | Déjà acceptées. Aucune modification. |
| svt:ch13:banque:150 | Accepter « échiquier », « un échiquier de croisement », « tableau de croisement ». | Déjà acceptées. Aucune modification. |

## Totaux

- 150 questions ; types 75 qcm_unique / 30 qcm_multiple / 30 vrai_faux / 15 reponse_courte.
- Vrai/faux : 15 vrais, 15 faux.
- Difficultés : 60 (niveau 1), 60 (niveau 2), 30 (niveau 3).
- Biais de longueur : la bonne réponse est la plus longue dans 1 qcm_unique sur 75.
- Position de la bonne réponse des qcm_unique : 19 / 19 / 19 / 18.
- Contrôle (`verifierBanque`) : « Banque du chapitre 13 conforme : 150 questions. »

## Questions laissées à relire

Aucune question ne reste douteuse : les questions modifiées ont une réponse unique, écrite dans le chapitre.

À relire : aucune
