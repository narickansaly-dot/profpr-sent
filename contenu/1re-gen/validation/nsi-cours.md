# Relecture du texte du cours de NSI de 1re

Date : 16 novembre 2026.

**Méthode.** Un sous-agent indépendant a relu le texte brut des 11 chapitres (titre, objectifs, sections, « Je retiens ») pour y chercher les erreurs factuelles, les exemples faux, les contradictions et les écarts au programme. Il a **exécuté environ 45 extraits de code** (toutes les sessions `>>>` et fonctions Python, le compteur JavaScript avec node, la fonction `somme` en C et en JavaScript) et **environ 130 calculs** (tables de vérité, déroulés des tris et de la dichotomie, gloutons et force brute, k-ppv, programme assembleur simulé, scénario du bit alterné, `chmod` sur un vrai fichier, masques avec `ipaddress`). **Aucune sortie annoncée dans le texte ne diffère de l'exécution réelle.**

Les relecteurs des banques ont aussi signalé des notions utilisées par les questions mais absentes du texte : elles ont été ajoutées au cours (détail dans chaque `banques/nsi-chN-relecture.md`).

## Problèmes relevés et corrections

| Chapitre | Problème | Gravité | Correction |
| --- | --- | --- | --- |
| 11, « Le protocole du bit alterné » | « Il suppose aussi que le réseau ne mélange pas l'ordre des paquets » se rapportait à TCP, alors que TCP remet justement les segments dans l'ordre (contradiction avec le tableau des couches). | **erreur** | Phrase réécrite : c'est le bit alterné qui suppose un réseau qui ne réordonne pas ; TCP sait remettre dans l'ordre. |
| 11, « Découper les données en paquets » | « Chaque paquet porte un numéro d'ordre » : ce sont les segments TCP qui sont numérotés, pas les paquets IP. | imprécision | « Les données envoyées sont numérotées (rôle de TCP, numéro de séquence) ». |
| 11, repères | TCP/IP « publié » en 1974 ; IPv6 daté de 1998. | imprécision | TCP publié en 1974, scindé en TCP et IP en 1978 ; IPv6 spécifié en 1995, révisé en 1998. Questions liées corrigées (ch11 : 028, 084, 094, 147). |
| 11, tableau des constituants | Le commutateur n'envoie vers le seul destinataire qu'une fois l'adresse apprise. | imprécision | Précision ajoutée. |
| 10, « Monoprocesseur et multiprocesseur » | « Exécute une seule instruction à la fois » est faux pour les processeurs réels (pipeline). | imprécision | Limité au modèle de von Neumann simplifié, avec une mention du pipeline. |
| 9, « Description en HTML… » | change « quand on quitte le champ » ne vaut que pour un champ de texte. | imprécision | Précisé (case à cocher, liste : dès le choix). |
| 9, repères | SSL 1.0 (1994) n'a jamais été publié. | imprécision | « 1995 : SSL 2.0, première version publiée ». |
| 7, encadré « Variant » et « Je retiens » | d − g vaut −1 à la sortie : il n'est pas toujours positif. | imprécision | Variant d − g + 1 (taille de la zone) ; questions ch7 : 043 et 115 alignées. |
| 4, encadré « Important » | « Les trois premiers tests passeraient… sauf celui des nombres négatifs » se contredisait (c'est le troisième). | imprécision | « Les tests 1, 2 et 4 passeraient ; seul celui des négatifs révèle l'erreur ; sans ce cas limite, le jeu de tests aurait réussi avec un programme faux. » |
| 2, ISO-8859-1 | « 256 caractères » : les codes 128 à 159 ne sont pas imprimables. | imprécision | « 256 codes (191 caractères imprimables) » (tableau et « Je retiens ») ; explication de la question ch2 : 131 alignée. |

Chapitres 1, 3, 5, 6 et 8 : aucun problème. La légende de la figure du chapitre 8 indique bien que les carrés sont la classe B.

## Écarts avec le programme

Aucune notion importante ne manque. Les éléments hors programme présents (IEEE 754, tranches, lambda, set, JavaScript, NAT) sont signalés comme non exigibles ou comme simples outils.
