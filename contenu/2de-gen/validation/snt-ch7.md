# Validation SNT, chapitre 7 : Informatique embarquée et objets connectés

Rapport produit le 10 novembre 2026 par les fonctions de validation du dépôt (`analyserImport`, `verifierBanque`, `fusionnerBanque`, `nettoyerHtml`, `versDonneesCours`), appelées sur `contenu/2de-gen/snt.json` et `contenu/2de-gen/banques/snt-ch7.json`. Les scripts `npm run banque:*` ne connaissent que les cours `bph` et `stss` (voir le bilan).

**Résultat : conforme.**

## Cours

- Validateur d'import : aucune erreur (cours entier, 8 chapitres).
- Sections : 6 (`objets`, `capteurs-actionneurs`, `controle`, `programmer`, `ihm`, `enjeux`), plus « Je retiens ».
- HTML : 0 section dont le nettoyage retire quelque chose (seules différences tolérées : `<br>` en `<br/>`, balises SVG fermées, `tabindex` ajouté aux zones qui défilent).
- Texte du chapitre (`texteChapitre`) : 11406 octets.
- Objectifs : 5.

## Banque

- `verifierBanque` (configuration : 150 questions, préfixe `snt`) : aucune erreur.
- Fusion rejouable : 150 questions dans le fichier de travail, 150 déjà présentes à l'identique dans le cours ; une nouvelle fusion laisse 150 questions (aucun doublon, aucun conflit).
- Types : qcm_unique 75, qcm_multiple 30, vrai_faux 30, reponse_courte 15.
- Difficultés : niveau 1 → 60, niveau 2 → 60, niveau 3 → 30.
- Vrai/faux : 17 vrais, 13 faux.
- Statuts dans le cours : a_relire 150.
- Notions (11) : Systèmes embarqués ; Objets connectés ; Repères historiques ; Capteurs ; Actionneurs ; Microcontrôleur et chaînes ; Algorithme de contrôle ; Seuils et hystérésis ; Programmation sur micro:bit ; Interface homme-machine ; Enjeux des objets connectés.

Points de doute de la relecture : `contenu/2de-gen/banques/snt-ch7-relecture.md`.
