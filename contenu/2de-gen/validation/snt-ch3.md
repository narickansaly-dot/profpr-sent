# Validation SNT, chapitre 3 : Le Web

Rapport produit le 10 novembre 2026 par les fonctions de validation du dépôt (`analyserImport`, `verifierBanque`, `fusionnerBanque`, `nettoyerHtml`, `versDonneesCours`), appelées sur `contenu/2de-gen/snt.json` et `contenu/2de-gen/banques/snt-ch3.json`. Les scripts `npm run banque:*` ne connaissent que les cours `bph` et `stss` (voir le bilan).

**Résultat : conforme.**

## Cours

- Validateur d'import : aucune erreur (cours entier, 8 chapitres).
- Sections : 6 (`histoire`, `html-css`, `url-http`, `client-serveur`, `moteurs`, `securite-droit`), plus « Je retiens ».
- HTML : 0 section dont le nettoyage retire quelque chose (seules différences tolérées : `<br>` en `<br/>`, balises SVG fermées, `tabindex` ajouté aux zones qui défilent).
- Texte du chapitre (`texteChapitre`) : 15055 octets.
- Objectifs : 7.

## Banque

- `verifierBanque` (configuration : 150 questions, préfixe `snt`) : aucune erreur.
- Fusion rejouable : 150 questions dans le fichier de travail, 150 déjà présentes à l'identique dans le cours ; une nouvelle fusion laisse 150 questions (aucun doublon, aucun conflit).
- Types : qcm_unique 75, qcm_multiple 30, vrai_faux 30, reponse_courte 15.
- Difficultés : niveau 1 → 60, niveau 2 → 60, niveau 3 → 30.
- Vrai/faux : 15 vrais, 15 faux.
- Statuts dans le cours : a_relire 150.
- Notions (9) : Histoire du Web ; Hypertexte et HTML ; Feuilles de style CSS ; URL ; Requêtes HTTP et HTTPS ; Client et serveur ; Moteurs de recherche ; Cookies et réglages ; Notions juridiques.

Points de doute de la relecture : `contenu/2de-gen/banques/snt-ch3-relecture.md`.
