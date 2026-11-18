# Validation NSI 1re, chapitre 1 : Écrire les entiers naturels en base 2, 10 et 16

Date : 16 novembre 2026. Fichiers : `contenu/1re-gen/nsi.json` (chapitre `ch1`), `banques/nsi-ch1.json`, `banques/nsi-ch1-relecture.md`.

## Contrôles automatiques

- `verifierBanque` (préfixe `nsi-1re`, 150 questions) : conforme, 150 questions, aucune erreur
- `analyserImport` sur le cours complet : aucune erreur ; `versDonneesCours` (import à blanc) : charge utile construite.
- `nettoyerHtml` : rien n'est retiré des sections ni du « Je retiens » (seul `tabindex="0"` est ajouté aux tableaux et figures défilants, comportement normal).
- Sections : 8 ; « Je retiens » présent.

## Questions

- Types : 75 QCM à une réponse, 30 QCM à plusieurs réponses, 30 vrai/faux (15 vrais, 15 faux), 15 réponses courtes.
- Difficultés : 60 / 60 / 30.
- Position de la bonne réponse des QCM à une réponse : 1re : 19, 2e : 18, 3e : 19, 4e : 19 ; bonne réponse strictement la plus longue : 6 sur 75.
- Réponses courtes : 0 avec marge ; aucune réponse acceptée avec séparateur de milliers.
- Notions (9) : Bits, octets et nombre de valeurs (11) ; Écriture positionnelle et bases (14) ; Hexadécimal (32) ; Du binaire au décimal (14) ; Du décimal au binaire (17) ; Nombre de bits nécessaires (25) ; Addition binaire et dépassement (15) ; Conversions en Python (18) ; Repères historiques (4).
- Statuts : valide 150.

## Relecture indépendante

Relecture à l'aveugle par un sous-agent qui a résolu les 150 questions sans voir les réponses et exécuté en Python (et en JavaScript ou en shell selon le chapitre) les extraits et calculs ; détail dans `banques/nsi-ch1-relecture.md`. Les questions passent au statut `valide` après correction des points relevés ; celles qui restent douteuses gardent `a_relire` et sont listées dans `nsi-bilan.md`.
