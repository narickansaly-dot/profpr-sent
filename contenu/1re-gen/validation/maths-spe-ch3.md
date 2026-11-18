# Validation : mathématiques spécialité 1re, chapitre 3

Chapitre : « Second degré : équations, factorisation et signe » (Second degré, 4 semaines).
Fichiers : `contenu/1re-gen/maths-spe.json` (chapitre `ch3`) et `contenu/1re-gen/banques/maths-spe-ch3.json`. Relecture : `banques/maths-spe-ch3-relecture.md`.
Date : 18 novembre 2026. Programme de référence : arrêté du 26 février 2026 (NOR MENE2602917A, BO n° 14 du 2 avril 2026).

## Contrôles automatiques

Les scripts `npm run banque:verifier` et `banque:fusionner` ne connaissent que les cours `bph` et `stss`. Les contrôles ont été lancés, sans modifier le dépôt, avec les **mêmes fonctions de la bibliothèque** (`verifierBanque`, `analyserImport`, `fusionnerBanque`, `nettoyerHtml`, `versDonneesCours`) depuis un script externe : préfixe `maths-spe-1re`, 150 questions (quotas 75/30/30/15 et 60/60/30, tolérance ±3).

| Contrôle | Résultat |
| --- | --- |
| `verifierBanque` (règles du guide, partie 7) | Banque du chapitre 3 conforme : 150 questions. |
| Répartition | types U75 M30 V30 R15 ; difficultés 60/60/30 ; vrais 15 faux 15 |
| Position de la bonne réponse (`qcm_unique`) | 19 / 19 / 19 / 18 ; strictement la plus longue dans 3 cas sur 75 |
| Notions (10) | Parabole, sommet et axe (15) ; Forme factorisée et racines (15) ; Somme et produit des racines (15) ; Forme canonique (15) ; Discriminant et résolution (15) ; Signe et inéquations (15) ; Choisir la forme adaptée (15) ; Factorisation directe (15) ; Vocabulaire logique (15) ; Automatismes de calcul (15) |
| Validateur d'import (`analyserImport`) sur le cours complet | valide |
| Nettoyage HTML (`nettoyerHtml`) | rien n'est retiré ; 8 sections, 36128 caractères de HTML |
| Fusion (`fusionnerBanque`) | 150 questions dans le chapitre |
| Statuts après relecture | valide : 150 |
| Réponses courtes (15) | 0 avec séparateur de milliers ; 0 avec une marge (nombre seul arrondi) |
| Typographie | 0 texte avec une espace ordinaire avant « : ; ! ? » |
| Import à blanc (`versDonneesCours`) | charge utile construite sans erreur pour le cours complet |

## Relecture indépendante

**150 / 150 réponses concordantes**, 0 désaccord, 0 doute signalé. Détail, doutes et corrections : `banques/maths-spe-ch3-relecture.md`.

## Import réel

Non fait : la base Supabase locale est partagée. Commande prévue après validation par l'enseignant :

```bash
npm run import:contenu -- contenu/1re-gen/maths-spe.json
```
