# Validation NSI 1re, chapitre 6 : Traitement de données en tables

Date : 16 novembre 2026. Fichiers : `contenu/1re-gen/nsi.json` (chapitre `ch6`), `banques/nsi-ch6.json`, `banques/nsi-ch6-relecture.md`.

## Contrôles automatiques

- `verifierBanque` (préfixe `nsi-1re`, 150 questions) : conforme, 150 questions, aucune erreur
- `analyserImport` sur le cours complet : aucune erreur ; `versDonneesCours` (import à blanc) : charge utile construite.
- `nettoyerHtml` : rien n'est retiré des sections ni du « Je retiens » (seul `tabindex="0"` est ajouté aux tableaux et figures défilants, comportement normal).
- Sections : 7 ; « Je retiens » présent.

## Questions

- Types : 75 QCM à une réponse, 30 QCM à plusieurs réponses, 30 vrai/faux (15 vrais, 15 faux), 15 réponses courtes.
- Difficultés : 60 / 60 / 30.
- Position de la bonne réponse des QCM à une réponse : 1re : 18, 2e : 19, 3e : 19, 4e : 19 ; bonne réponse strictement la plus longue : 27 sur 75.
- Réponses courtes : 0 avec marge ; aucune réponse acceptée avec séparateur de milliers.
- Notions (9) : Tables, enregistrements, descripteurs (12) ; Fichiers CSV (17) ; Import et conversion des types (23) ; Recherche et sélection (16) ; Projection et agrégats (11) ; Doublons et cohérence (19) ; Tri selon une colonne (24) ; Fusion de tables (19) ; Données ouvertes (9).
- Statuts : valide 150.

## Relecture indépendante

Relecture à l'aveugle par un sous-agent qui a résolu les 150 questions sans voir les réponses et exécuté en Python (et en JavaScript ou en shell selon le chapitre) les extraits et calculs ; détail dans `banques/nsi-ch6-relecture.md`. Les questions passent au statut `valide` après correction des points relevés ; celles qui restent douteuses gardent `a_relire` et sont listées dans `nsi-bilan.md`.
