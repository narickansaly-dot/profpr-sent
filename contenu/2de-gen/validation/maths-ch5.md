# Validation : mathématiques 2de, chapitre 5

Chapitre : « Inégalités, équations et inéquations » (Équations et inéquations, 3 semaines).
Fichiers : `contenu/2de-gen/maths.json` (chapitre `ch5`) et `contenu/2de-gen/banques/maths-ch5.json`. Relecture des questions : `banques/maths-ch5-relecture.md`.
Date : 11 novembre 2026. Programme de référence : arrêté du 26 février 2026 (NOR MENE2602914A).

## Contrôles automatiques

Les scripts `npm run banque:verifier` et `npm run banque:fusionner` ne connaissent que les cours `bph` et `stss` de 1re ST2S (chemin et option `--cours` codés en dur dans `scripts/` et `src/lib/contenu/banque/cours.ts`). Sans modifier le dépôt, les contrôles ont été lancés avec les **mêmes fonctions de la bibliothèque** (`verifierBanque`, `analyserImport`, `fusionnerBanque`, `nettoyerHtml`, `versDonneesCours`) depuis un script externe, avec la configuration : préfixe `maths-2de`, 150 questions (quotas 75/30/30/15 et 60/60/30, tolérance ±3).

| Contrôle | Résultat |
| --- | --- |
| `verifierBanque` (17 règles du guide, partie 7) | conforme — Banque du chapitre 5 conforme : 150 questions. |
| Répartition | 150 questions ; types U75 M30 V30 R15 ; difficultés 60/60/30 ; vrais 15 faux 15 ; bonne réponse la plus longue 15/75 |
| Notions (8) | Ensemble des solutions (16) ; Équations du premier degré (20) ; Équations produit nul (18) ; Équations x² = a (18) ; Opérations sur les inégalités (20) ; Comparer deux nombres (16) ; Inéquations du premier degré (21) ; Modéliser un problème (21) |
| Validateur d'import (`analyserImport`) sur le cours complet | valide |
| Nettoyage HTML (`nettoyerHtml`) | aucun contenu retiré (seuls ajouts du nettoyeur : `tabindex="0"` sur les tableaux et figures défilants) ; 7 sections, 8786 caractères de HTML, 150 questions |
| Fusion (`fusionnerBanque`) | 150 questions ajoutées au chapitre, statut `a_relire` |
| Réponses courtes (15) | aucune réponse avec séparateur de milliers ; aucune marge utilisée (réponses entières ou décimales exactes, variantes « , » et « . » listées) |
| Typographie | 0 texte avec une espace ordinaire avant « : ; ! ? » (espaces insécables U+00A0) |
| Import à blanc (`versDonneesCours`) | charge utile construite sans erreur pour le cours complet (11 chapitres, 1 650 questions) |

## Import réel

Non fait : la base Supabase locale est partagée avec le reste du projet. Commande prévue, après validation par l'enseignant :

```bash
npm run import:contenu -- contenu/2de-gen/maths.json
```
