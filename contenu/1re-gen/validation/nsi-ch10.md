# Validation NSI 1re, chapitre 10 : Architecture des machines, systèmes d'exploitation et périphériques

Date : 16 novembre 2026. Fichiers : `contenu/1re-gen/nsi.json` (chapitre `ch10`), `banques/nsi-ch10.json`, `banques/nsi-ch10-relecture.md`.

## Contrôles automatiques

- `verifierBanque` (préfixe `nsi-1re`, 150 questions) : conforme, 150 questions, aucune erreur
- `analyserImport` sur le cours complet : aucune erreur ; `versDonneesCours` (import à blanc) : charge utile construite.
- `nettoyerHtml` : rien n'est retiré des sections ni du « Je retiens » (seul `tabindex="0"` est ajouté aux tableaux et figures défilants, comportement normal).
- Sections : 8 ; « Je retiens » présent.

## Questions

- Types : 75 QCM à une réponse, 30 QCM à plusieurs réponses, 30 vrai/faux (15 vrais, 15 faux), 15 réponses courtes.
- Difficultés : 60 / 60 / 30.
- Position de la bonne réponse des QCM à une réponse : 1re : 19, 2e : 19, 3e : 18, 4e : 19 ; bonne réponse strictement la plus longue : 29 sur 75.
- Réponses courtes : 0 avec marge ; aucune réponse acceptée avec séparateur de milliers.
- Notions (11) : Modèle de von Neumann (12) ; Constituants du processeur (8) ; Cycle et langage machine (28) ; Multicœur et parallélisme (10) ; Rôle du système d'exploitation (10) ; Logiciels libres et propriétaires (8) ; Ligne de commande (18) ; Chemins et arborescence (15) ; Droits et permissions (25) ; Capteurs, actionneurs et IHM (11) ; Repères historiques (5).
- Statuts : valide 150.

## Relecture indépendante

Relecture à l'aveugle par un sous-agent qui a résolu les 150 questions sans voir les réponses et exécuté en Python (et en JavaScript ou en shell selon le chapitre) les extraits et calculs ; détail dans `banques/nsi-ch10-relecture.md`. Les questions passent au statut `valide` après correction des points relevés ; celles qui restent douteuses gardent `a_relire` et sont listées dans `nsi-bilan.md`.
