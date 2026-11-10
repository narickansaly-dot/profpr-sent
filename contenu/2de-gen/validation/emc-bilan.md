# Bilan : cours d'EMC de seconde générale

Branche `claude/contenu-2de-emc-89b137`, 10 novembre 2026. Rien n'est poussé ni importé.

## Changement de programme

Le programme d'EMC de seconde a changé : l'ancien programme (arrêté du 17 janvier 2019) a été **abrogé** par l'arrêté du 29 mai 2024 (NOR : MENE2413934A, JO du 12 juin 2024, BO n° 24 du 13 juin 2024). Selon son article 3, ce nouveau programme s'applique en seconde générale et technologique depuis la rentrée 2024. C'est donc lui qui est applicable en 2026-2027, et c'est lui que suit le cours. Le thème de l'année devient « Droits, libertés et responsabilité », en trois axes : État de droit et laïcité ; information ; environnement. Seule modification ultérieure signalée par Légifrance : l'arrêté du 16 février 2026, lié au BNMA (voir le point 3 de « Points à trancher »).

## Ce qui a été fait

1. **Programme officiel** (`programmes/emc-2de.md`) : arrêté du 29 mai 2024 (BO n° 24 du 13 juin 2024), en vigueur en seconde depuis la rentrée 2024 ; il a abrogé le programme de 2019. Partie « Seconde : Droits, libertés et responsabilité » transcrite fidèlement depuis l'annexe (PDF du ministère, pages 22 et 23) : 3 axes de 6 heures, 14 notions, 12 contenus, 16 démarches, codés `[N…]`, `[C…]`, `[D…]`.
2. **Plan** (`programmes/emc-2de-plan.md`) : 6 chapitres, table de correspondance complète (toutes les notions, tous les contenus et toutes les démarches couverts).
3. **Cours** (`emc.json`) : slug `emc-2de-gen`, filière `GEN`, niveau `2de`, matière `EMC`, couleur `#1d4ed8` (contraste 6,70:1). Six chapitres rédigés au format STSS (chapeau, objectifs, sections HTML, « Je retiens », résumé, durée), tutoiement, sans figure.
4. **Banques** (`banques/emc-ch1.json` à `emc-ch6.json`) : 150 questions par chapitre, 900 au total, fusionnées dans `emc.json` au statut `a_relire`, avec un rapport de relecture par chapitre (`emc-chN-relecture.md`) et une relecture du cours (`emc-cours-relecture.md`).
5. **Validation** (`validation/emc-rapport.md`) : cours valide pour l'import, HTML intact, 6 banques conformes aux 17 règles de `banque:verifier`, fusion rejouable, import à blanc réussi jusqu'à la base.

## Chapitres

| N° | Titre | Durée | Axe | Sections | Questions |
| --- | --- | --- | --- | --- | --- |
| 1 | L'État de droit, garant des libertés | 2 h | 1 | 5 | 150 |
| 2 | La laïcité, garante de la liberté de conscience et du pluralisme | 2 h | 1 | 5 | 150 |
| 3 | Créer de nouveaux droits, encadrer les libertés | 2 h | 1 | 5 | 150 |
| 4 | La liberté de la presse, pilier de la démocratie | 3 h | 2 | 4 | 150 |
| 5 | S'exprimer et s'informer à l'ère numérique | 3 h | 2 | 5 | 150 |
| 6 | Protéger l'environnement : droits et responsabilités | 6 h | 3 | 6 | 150 |

Par chapitre : 75 QCM à une réponse, 30 QCM multiples, 30 vrai/faux, 15 réponses courtes ; difficultés autour de 60 / 60 / 30.

## Points à trancher

1. **Validation du plan** : six chapitres (axe 1 en trois, axe 2 en deux, axe 3 en un). Le plan n'a pas eu de point d'arrêt avec l'enseignant, contrairement à STSS.
2. **Étude de cas du chapitre 1** : la décision « anti-burkini » du Conseil d'État (2016) est pertinente mais sensible ; une vingtaine de questions en dépendent.
3. **Modification de 2026** : Légifrance indique que l'annexe a été modifiée par l'arrêté du 16 février 2026 (brevet national des métiers d'art). Le détail n'a pas pu être lu (vérification anti-robot) ; a priori sans effet sur la seconde générale, à confirmer.
4. **Faits récents** à garder ou retirer : C8 et la décision du Conseil d'État de 2024 sur le pluralisme (chapitre 4), règlement européen sur l'IA (chapitre 5), décisions du Conseil constitutionnel de 2020 et 2023 (chapitre 6).
5. **SNU** : cité par le programme, volontairement absent du cours.
6. **Doublons proches** : chaque relecture liste les grappes de questions sur un même fait (par exemple 13 questions sur l'arrêt J.M.B. au chapitre 3). Elles sont justes ; à écarter au cas par cas à la validation.
7. **Longueur** : chapitres plus courts que STSS (9 000 à 14 000 caractères), en rapport avec l'horaire (18 heures sur l'année).
8. **Outillage** : `banque:*` et `import:contenu` ne savent pas traiter ce cours sans changement de code (détail et propositions dans `emc-rapport.md`). Avant l'import réel : `npm run import:contenu -- contenu/2de-gen/emc.json --garder-statuts`, sur une base où la filière `GEN` et le niveau `2de` existent.
