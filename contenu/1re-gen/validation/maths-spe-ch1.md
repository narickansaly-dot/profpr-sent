# Validation : mathématiques spécialité 1re, chapitre 1

Chapitre : « Suites numériques : modes de génération, variations, limites » (Suites, 3 semaines).
Fichiers : `contenu/1re-gen/maths-spe.json` (chapitre `ch1`) et `contenu/1re-gen/banques/maths-spe-ch1.json`. Relecture : `banques/maths-spe-ch1-relecture.md`.
Date : 18 novembre 2026. Programme de référence : arrêté du 26 février 2026 (NOR MENE2602917A, BO n° 14 du 2 avril 2026).

## Contrôles automatiques

Les scripts `npm run banque:verifier` et `banque:fusionner` ne connaissent que les cours `bph` et `stss`. Les contrôles ont été lancés, sans modifier le dépôt, avec les **mêmes fonctions de la bibliothèque** (`verifierBanque`, `analyserImport`, `fusionnerBanque`, `nettoyerHtml`, `versDonneesCours`) depuis un script externe : préfixe `maths-spe-1re`, 150 questions (quotas 75/30/30/15 et 60/60/30, tolérance ±3).

| Contrôle | Résultat |
| --- | --- |
| `verifierBanque` (règles du guide, partie 7) | Banque du chapitre 1 conforme : 150 questions. |
| Répartition | types U75 M30 V30 R15 ; difficultés 60/60/30 ; vrais 15 faux 15 |
| Position de la bonne réponse (`qcm_unique`) | 19 / 19 / 19 / 18 ; strictement la plus longue dans 11 cas sur 75 |
| Notions (9) | Notations et vocabulaire (16) ; Suite définie explicitement (18) ; Suite définie par récurrence (18) ; Motifs et dénombrements (16) ; Représentation graphique (14) ; Sens de variation (20) ; Limite intuitive (16) ; Listes en Python (17) ; Algorithmes de suites (15) |
| Validateur d'import (`analyserImport`) sur le cours complet | valide |
| Nettoyage HTML (`nettoyerHtml`) | rien n'est retiré ; 9 sections, 36503 caractères de HTML |
| Fusion (`fusionnerBanque`) | 150 questions dans le chapitre |
| Statuts après relecture | valide : 150 |
| Réponses courtes (15) | 0 avec séparateur de milliers ; 0 avec une marge (nombre seul arrondi) |
| Typographie | 0 texte avec une espace ordinaire avant « : ; ! ? » |
| Import à blanc (`versDonneesCours`) | charge utile construite sans erreur pour le cours complet |

## Relecture indépendante

**150 / 150 réponses concordantes**, 0 désaccord. Détail, doutes et corrections : `banques/maths-spe-ch1-relecture.md`.

## Import réel

Non fait : la base Supabase locale est partagée. Commande prévue après validation par l'enseignant :

```bash
npm run import:contenu -- contenu/1re-gen/maths-spe.json
```
