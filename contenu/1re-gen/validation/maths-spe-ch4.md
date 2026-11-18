# Validation : mathématiques spécialité 1re, chapitre 4

Chapitre : « Dérivation : nombre dérivé et tangente » (Nombre dérivé, 3 semaines).
Fichiers : `contenu/1re-gen/maths-spe.json` (chapitre `ch4`) et `contenu/1re-gen/banques/maths-spe-ch4.json`. Relecture : `banques/maths-spe-ch4-relecture.md`.
Date : 18 novembre 2026. Programme de référence : arrêté du 26 février 2026 (NOR MENE2602917A, BO n° 14 du 2 avril 2026).

## Contrôles automatiques

Les scripts `npm run banque:verifier` et `banque:fusionner` ne connaissent que les cours `bph` et `stss`. Les contrôles ont été lancés, sans modifier le dépôt, avec les **mêmes fonctions de la bibliothèque** (`verifierBanque`, `analyserImport`, `fusionnerBanque`, `nettoyerHtml`, `versDonneesCours`) depuis un script externe : préfixe `maths-spe-1re`, 150 questions (quotas 75/30/30/15 et 60/60/30, tolérance ±3).

| Contrôle | Résultat |
| --- | --- |
| `verifierBanque` (règles du guide, partie 7) | Banque du chapitre 4 conforme : 150 questions. |
| Répartition | types U75 M30 V30 R15 ; difficultés 60/60/30 ; vrais 15 faux 15 |
| Position de la bonne réponse (`qcm_unique`) | 19 / 19 / 19 / 18 ; strictement la plus longue dans 8 cas sur 75 |
| Notions (9) | Droites et coefficient directeur (16) ; Taux de variation et sécante (18) ; Nombre dérivé par le calcul (20) ; Lecture graphique et tangente (18) ; Équation de la tangente (20) ; Approximation affine (15) ; Vitesse et coût marginal (15) ; Non-dérivabilité en 0 (14) ; Sécantes en Python (14) |
| Validateur d'import (`analyserImport`) sur le cours complet | valide |
| Nettoyage HTML (`nettoyerHtml`) | rien n'est retiré ; 8 sections, 31103 caractères de HTML |
| Fusion (`fusionnerBanque`) | 150 questions dans le chapitre |
| Statuts après relecture | valide : 150 |
| Réponses courtes (15) | 0 avec séparateur de milliers ; 0 avec une marge (nombre seul arrondi) |
| Typographie | 0 texte avec une espace ordinaire avant « : ; ! ? » |
| Import à blanc (`versDonneesCours`) | charge utile construite sans erreur pour le cours complet |

## Relecture indépendante

**150 / 150 réponses concordantes**, 0 désaccord. Détail, doutes et corrections : `banques/maths-spe-ch4-relecture.md`.

## Import réel

Non fait : la base Supabase locale est partagée. Commande prévue après validation par l'enseignant :

```bash
npm run import:contenu -- contenu/1re-gen/maths-spe.json
```
