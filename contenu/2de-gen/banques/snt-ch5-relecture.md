# Relecture de la banque du chapitre 5 de SNT (Les données structurées et leur traitement)

Banque `snt-ch5.json` : 150 questions (75 / 30 / 30 / 15 ; difficultés 60 / 60 / 30 ; 16 vrais et 14 faux), au statut `a_relire`. Contrôle automatique conforme. Les calculs sur la table du club (5 membres) et la table des créneaux (3 sports) ont été refaits à la main : âge moyen 15,4, somme 77, trois membres de 15 ans, deux footballeurs, etc.

## Corrigées pendant la relecture

| Source | Problème | Décision |
| --- | --- | --- |
| 8 QCM à une réponse | Biais de longueur (44 %). | Distracteurs allongés (25 sur 75 après correction). |
| QCM « Pourquoi une valeur sans descripteur perd-elle son sens ? » | Une difficulté 3 en trop (31). | Passée en difficulté 2 : c'est un rappel du cours. |
| snt:ch5:banque:142 | Trop proche de la 045 (« Combien de membres du club ont 16 / 15 ans ? »). | Reformulée en opération de filtre. |

## Points de doute

1. **Ordre alphabétique et accents** : la question « membres de 15 ans triés par prénom » attend Inès, Léa, Lina (ordre du dictionnaire, « é » rangé comme « e »). Un tri Python ou un tableur mal réglé mettrait Lina avant Léa, car « é » vient après « i » dans l'ordre des codes. Correct pour la seconde, mais un élève qui vérifie avec Python serait dérouté.
2. **Consommation des centres de données** : « de l'ordre de 1 à 2 % de l'électricité mondiale », « plusieurs centaines de TWh par an », « autant que la France pour certaines estimations ». Ces ordres de grandeur suivent l'AIE (environ 415 TWh en 2024, 1,5 %), mais ils évoluent vite avec l'IA. Une vrai/faux et un QCM s'appuient sur la fourchette.
3. **Premier disque dur** : IBM 350 (RAMAC), 1956, environ 5 millions de caractères (3,75 Mo selon les sources). Le cours dit « environ 5 mégaoctets », la valeur la plus souvent citée.
4. **Bouchon 1725 et Jacquard 1801** : ce sont des repères du programme (reconstitués, voir le point n° 1 du bilan).
5. **Séparateur CSV en France** : le cours dit « souvent le point-virgule ». C'est un usage des tableurs en français, pas une norme.
6. **Adresse IP, donnée personnelle** : position de la CNIL et de la CJUE (arrêt Breyer, 2016). La réponse « Oui, car elle peut permettre d'identifier indirectement une personne » est conforme.
