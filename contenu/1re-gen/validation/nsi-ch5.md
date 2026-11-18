# Validation NSI 1re, chapitre 5 : Types construits : p-uplets, tableaux et dictionnaires

Date : 16 novembre 2026. Fichiers : `contenu/1re-gen/nsi.json` (chapitre `ch5`), `banques/nsi-ch5.json`, `banques/nsi-ch5-relecture.md`.

## Contrôles automatiques

- `verifierBanque` (préfixe `nsi-1re`, 150 questions) : conforme, 150 questions, aucune erreur
- `analyserImport` sur le cours complet : aucune erreur ; `versDonneesCours` (import à blanc) : charge utile construite.
- `nettoyerHtml` : rien n'est retiré des sections ni du « Je retiens » (seul `tabindex="0"` est ajouté aux tableaux et figures défilants, comportement normal).
- Sections : 6 ; « Je retiens » présent.

## Questions

- Types : 75 QCM à une réponse, 30 QCM à plusieurs réponses, 30 vrai/faux (15 vrais, 15 faux), 15 réponses courtes.
- Difficultés : 60 / 60 / 30.
- Position de la bonne réponse des QCM à une réponse : 1re : 19, 2e : 19, 3e : 19, 4e : 18 ; bonne réponse strictement la plus longue : 11 sur 75.
- Réponses courtes : 0 avec marge ; aucune réponse acceptée avec séparateur de milliers.
- Notions (10) : p-uplets (16) ; Fonctions renvoyant un p-uplet (10) ; Tableaux : indices et modification (24) ; Parcours de tableaux (12) ; Construction par compréhension (14) ; Tableaux de tableaux (18) ; Dictionnaires (22) ; Itérer : keys, values, items (15) ; Enregistrements et EXIF (7) ; Copie et alias (12).
- Statuts : valide 150.

## Relecture indépendante

Relecture à l'aveugle par un sous-agent qui a résolu les 150 questions sans voir les réponses et exécuté en Python (et en JavaScript ou en shell selon le chapitre) les extraits et calculs ; détail dans `banques/nsi-ch5-relecture.md`. Les questions passent au statut `valide` après correction des points relevés ; celles qui restent douteuses gardent `a_relire` et sont listées dans `nsi-bilan.md`.
