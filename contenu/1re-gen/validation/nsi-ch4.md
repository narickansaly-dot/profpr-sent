# Validation NSI 1re, chapitre 4 : Programmer en Python : constructions, fonctions, spécification et tests

Date : 16 novembre 2026. Fichiers : `contenu/1re-gen/nsi.json` (chapitre `ch4`), `banques/nsi-ch4.json`, `banques/nsi-ch4-relecture.md`.

## Contrôles automatiques

- `verifierBanque` (préfixe `nsi-1re`, 150 questions) : conforme, 150 questions, aucune erreur
- `analyserImport` sur le cours complet : aucune erreur ; `versDonneesCours` (import à blanc) : charge utile construite.
- `nettoyerHtml` : rien n'est retiré des sections ni du « Je retiens » (seul `tabindex="0"` est ajouté aux tableaux et figures défilants, comportement normal).
- Sections : 7 ; « Je retiens » présent.

## Questions

- Types : 75 QCM à une réponse, 30 QCM à plusieurs réponses, 30 vrai/faux (15 vrais, 15 faux), 15 réponses courtes.
- Difficultés : 60 / 60 / 30.
- Position de la bonne réponse des QCM à une réponse : 1re : 19, 2e : 19, 3e : 18, 4e : 19 ; bonne réponse strictement la plus longue : 26 sur 75.
- Réponses courtes : 0 avec marge ; aucune réponse acceptée avec séparateur de milliers.
- Notions (10) : Constructions élémentaires (13) ; Boucles for et while (28) ; Fonctions et return (25) ; Variables locales et globales (8) ; Spécification et docstring (12) ; Assertions (10) ; Jeux de tests et erreurs (18) ; Bibliothèques (12) ; Diversité des langages (16) ; Repères historiques (8).
- Statuts : valide 150.

## Relecture indépendante

Relecture à l'aveugle par un sous-agent qui a résolu les 150 questions sans voir les réponses et exécuté en Python (et en JavaScript ou en shell selon le chapitre) les extraits et calculs ; détail dans `banques/nsi-ch4-relecture.md`. Les questions passent au statut `valide` après correction des points relevés ; celles qui restent douteuses gardent `a_relire` et sont listées dans `nsi-bilan.md`.
