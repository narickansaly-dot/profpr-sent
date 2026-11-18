# Validation : mathématiques spécialité 1re, chapitre 6

Chapitre : « Variations, extremums et courbes » (Variations, 3 semaines).
Fichiers : `contenu/1re-gen/maths-spe.json` (chapitre `ch6`) et `contenu/1re-gen/banques/maths-spe-ch6.json`. Relecture : `banques/maths-spe-ch6-relecture.md`.
Date : 18 novembre 2026. Programme de référence : arrêté du 26 février 2026 (NOR MENE2602917A, BO n° 14 du 2 avril 2026).

## Contrôles automatiques

Les scripts `npm run banque:verifier` et `banque:fusionner` ne connaissent que les cours `bph` et `stss`. Les contrôles ont été lancés, sans modifier le dépôt, avec les **mêmes fonctions de la bibliothèque** (`verifierBanque`, `analyserImport`, `fusionnerBanque`, `nettoyerHtml`, `versDonneesCours`) depuis un script externe : préfixe `maths-spe-1re`, 150 questions (quotas 75/30/30/15 et 60/60/30, tolérance ±3).

| Contrôle | Résultat |
| --- | --- |
| `verifierBanque` (règles du guide, partie 7) | Banque du chapitre 6 conforme : 150 questions. |
| Répartition | types U75 M30 V30 R15 ; difficultés 60/60/30 ; vrais 15 faux 15 |
| Position de la bonne réponse (`qcm_unique`) | 19 / 19 / 19 / 18 ; strictement la plus longue dans 18 cas sur 75 |
| Notions (9) | Signe de f′ et variations (15) ; Tableau de variations (17) ; Extremums et tangente horizontale (17) ; Second degré et dérivation (18) ; Optimisation (16) ; Inégalités et position de courbes (16) ; Fonctions paires et impaires (16) ; Quantificateurs et raisonnements (17) ; Méthode de Newton (18) |
| Validateur d'import (`analyserImport`) sur le cours complet | valide |
| Nettoyage HTML (`nettoyerHtml`) | rien n'est retiré ; 9 sections, 37670 caractères de HTML |
| Fusion (`fusionnerBanque`) | 150 questions dans le chapitre |
| Statuts après relecture | valide : 150 |
| Réponses courtes (15) | 0 avec séparateur de milliers ; 0 avec une marge (nombre seul arrondi) |
| Typographie | 0 texte avec une espace ordinaire avant « : ; ! ? » |
| Import à blanc (`versDonneesCours`) | charge utile construite sans erreur pour le cours complet |

## Relecture indépendante

**150 / 150 réponses concordantes**, 0 désaccord. Détail, doutes et corrections : `banques/maths-spe-ch6-relecture.md`.

## Import réel

Non fait : la base Supabase locale est partagée. Commande prévue après validation par l'enseignant :

```bash
npm run import:contenu -- contenu/1re-gen/maths-spe.json
```
