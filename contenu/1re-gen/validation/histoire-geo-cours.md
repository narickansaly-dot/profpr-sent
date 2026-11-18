# Validation du cours d'histoire-géographie (1re générale)

Fichier `contenu/1re-gen/histoire-geo.json`, contrôlé le 18 novembre 2026 avec les fonctions du dépôt (`analyserImport`, `nettoyerHtml`, `contraste`, `versDonneesCours`), appelées par un script hors dépôt (les scripts `banque:*` ne connaissent que `bph` et `stss`).

## Résultat

| Contrôle | Résultat |
| --- | --- |
| `analyserImport` (schéma d'import) | aucune erreur |
| Identité du cours | slug `histoire-geo-1re-gen`, filière `GEN`, niveau `1re`, matière `Histoire-géographie` |
| Taille | 2 036 939 octets (limite : 3 Mo) |
| Couleur `#92400e` | contraste 7,09:1 avec le blanc (minimum 4,5:1) : acceptée |
| `nettoyerHtml` sur les sections et le « Je retiens » des 18 chapitres | rien n'est retiré |
| Import à blanc (`versDonneesCours`, statuts conservés) | charge utile `importer_cours` construite (1 732 109 octets) ; aucune base contactée |
| Chapitres | 18, numérotés de 1 à 18, slugs `ch1` à `ch18` |
| Questions | 2 700 (150 par chapitre), sources uniques `histoire-geo:chN:banque:NNN` |
| Statuts | 2 644 `valide`, 56 `a_relire` |

## Contrôles complémentaires

- Le HTML des sections fait de 12 461 à 14 000 caractères par chapitre.
- Réponses courtes : aucune réponse acceptée avec séparateur de milliers ; aucune `marge` (les dates se répondent exactement) ; toute réponse attendue sous forme d'année est annoncée par « Réponds par l'année en chiffres. ».
- Espace insécable avant « : ; ! ? » dans les énoncés, propositions et explications (règle 14 de `verifierBanque`).

## Import réel

Non fait : pas de base locale dans ce worktree. Commande à lancer depuis la racine du dépôt :

```bash
npm run import:contenu -- contenu/1re-gen/histoire-geo.json
```
