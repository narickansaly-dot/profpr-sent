# Relecture de la banque du chapitre 9 de NSI (le Web)

**Méthode.** Relecture indépendante à l'aveugle : un sous-agent a reçu les 150 questions **sans les réponses attendues** ni les explications, avec le texte du chapitre, et les a résolues lui-même. Il a **exécuté 22 vérifications** dans deux scripts : en JavaScript avec node (simulation des gestionnaires de clic, URLSearchParams, encodage des formulaires GET, comptage des requêtes) et en Python (urlencode, parse_qs), avec des résultats identiques. Comparaison automatique ensuite.

**Résultat.** 150 réponses identiques sur 150. Quinze remarques ; corrections dans la banque et six ajouts au texte du cours.

## Corrections

| Question | Remarque du relecteur | Décision |
| --- | --- | --- |
| 059, 074 | Rôle de label for et différence input / change absents du cours. | **Cours complété** (section « Description en HTML, comportement en JavaScript »). |
| 062 | Règle « pas d'action destructrice en GET » absente du cours. | **Cours complété** (section « Formulaires »). |
| 066 | Ambiguë : le cookie part aussi avec les requêtes des images, CSS et scripts. | Corrigée : pages « sans image ni autre ressource » ; **cours précisé**. |
| 070, 148 | Les scripts peuvent être écrits dans la page, sans requête. | Corrigées : « fichiers de script externes ». |
| 071, 135 | La visibilité du serveur contacté malgré HTTPS n'était pas dans le cours. | **Cours complété** (section « HTTPS »). |
| 073 | Le non-envoi d'un champ sans name n'était pas écrit. | **Cours complété** (section « Formulaires »). |
| 100 | Une proposition négative vraie ne répondait pas à « Que peut-il apprendre ? ». | Réécrite : le serveur contacté, le moment et la quantité des échanges (vrais) ; paramètres GET, cookies (faux). |
| 145 | Variantes « cookies », « cookie de session ». | Ajoutées. |
| 149 | « URL complète » sans serveur indiqué. | Réécrite : « le chemin suivi des paramètres, sans nom de serveur » ; « calc?a=3&b=4 » accepté. |

## Remarques sans changement

- 091 : une URL avec paramètres peut en théorie servir d'action à un formulaire POST ; dans le cadre du cours, les paramètres dans l'URL sont ceux d'une requête GET. Gardée.
- 138 (« onclick »), 139 (« JS »), 147 (« Berners Lee ») : variantes déjà acceptées.

## Contrôles automatiques

- `verifierBanque` (préfixe `nsi-1re`, 150 questions) : conforme. Types 75 / 30 / 30 (15 vrais, 15 faux) / 15 ; difficultés 60 / 60 / 30 ; positions 19 / 19 / 18 / 19 ; bonne réponse strictement la plus longue dans 27 QCM sur 75 (après allongement de quinze distracteurs).
- Les énoncés et propositions contiennent des balises écrites comme du texte (« <button> ») : les énoncés sont affichés par React comme du texte (`LecteurTentative.tsx`, `ListeCorrection.tsx`), donc tels quels.

## Points restants

Aucun : toutes les questions peuvent passer au statut `valide`.
