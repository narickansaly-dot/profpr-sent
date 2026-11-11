# Validation du cours d'histoire-géographie (2de)

Fichier : `contenu/2de-gen/histoire-geo.json`. Rapport produit le 11 novembre 2026.

## Résultat

- **Validateur d'import** (`analyserImport`, celui du script `import:contenu` et de la page `/admin/import`) : aucune erreur. 15 chapitres, 2 250 questions, toutes au statut `a_relire`, 2 250 sources uniques.
- **Conversion pour la base** (`versDonneesCours`) : réussie.
- **Taille** : 1 538 931 octets, sous la limite de 3 Mo.
- **Métadonnées** : slug `histoire-geo-2de-gen`, filière `GEN`, niveau `2de`, matière `Histoire-géographie`, couleur `#92400e`. Son contraste avec le blanc est de 7,09:1, au-dessus du minimum de 4,5:1. La filière `GEN` et le niveau `2de` existent dans `supabase/seed.sql`.
- **HTML** (`nettoyerHtml`, liste blanche du guide des auteurs) : le nettoyage ne retire rien. Il ajoute seulement `tabindex="0"` aux tableaux et ferme explicitement les éléments SVG. Résultat du contrôle : 1 section(s) modifiée(s) par le nettoyage.
- **Typographie** : aucune espace ordinaire avant « : ; ! ? », aucune entité `&nbsp;`, espaces insécables dans les guillemets.

## Chapitres

| N° | Titre | Sections | Questions |
| --- | --- | --- | --- |
| 1 | La Méditerranée antique : les empreintes grecques et romaines | 6 | 150 |
| 2 | La Méditerranée médiévale : espace d'échanges et de conflits à la croisée de trois civilisations | 5 | 150 |
| 3 | L'ouverture atlantique : les conséquences de la découverte du « Nouveau Monde » | 6 | 150 |
| 4 | Renaissance, humanisme et réformes religieuses : les mutations de l'Europe | 5 | 150 |
| 5 | L'affirmation de l'État dans le royaume de France | 6 | 150 |
| 6 | Le modèle britannique et son influence | 6 | 150 |
| 7 | Les Lumières et le développement des sciences | 6 | 150 |
| 8 | Tensions, mutations et crispations de la société d'ordres | 6 | 150 |
| 9 | Sociétés et environnements : risques et ressources sous pression | 6 | 150 |
| 10 | La France : des milieux métropolitains et ultramarins entre valorisation et protection | 5 | 150 |
| 11 | Des trajectoires démographiques différenciées ; développement et inégalités | 6 | 150 |
| 12 | La France : dynamiques démographiques, inégalités socio-économiques | 5 | 150 |
| 13 | Des mobilités généralisées : migrations et tourisme internationaux | 6 | 150 |
| 14 | La France : mobilités, transports et enjeux d'aménagement | 6 | 150 |
| 15 | L'Afrique australe : un espace en profonde mutation | 5 | 150 |

## Import à blanc

Il n'a pas été fait. Le script `import:contenu` n'a pas de mode « à blanc » ; il écrit dans la base locale. De plus, la commande `supabase` n'est pas installée sur la machine de travail. La validation repose donc sur le même validateur que l'import (`analyserImport`) et sur la conversion `versDonneesCours`. Commande à lancer par l'enseignant, sur une base locale :

```bash
npm run import:contenu -- contenu/2de-gen/histoire-geo.json
```

## Méthode : scripts du dépôt non utilisables tels quels

`banque:texte`, `banque:verifier` et `banque:fusionner` n'acceptent que `--cours bph` ou `--cours stss`. Leurs chemins sont écrits en dur sur `contenu/1re-st2s/` (`src/lib/contenu/banque/cours.ts` et les trois scripts). Les banques ont été contrôlées et fusionnées en appelant directement les fonctions du dépôt (`verifierBanque`, `fusionnerBanque`, `serialiserCours`, `texteChapitre`, `analyserImport`), avec la configuration `{ prefixe: 'histoire-geo', total: 150 }`. Aucun fichier du dépôt n'a été modifié. À prévoir dans le code : ajouter les cours de 2de à `COURS_BANQUE` et rendre le dossier `contenu/<niveau>/` paramétrable.

## Sortie du contrôle

```text
Cours valide (analyserImport) : Histoire-géographie, 15 chapitres, 2250 questions ; conversion versDonneesCours : ok
  ch1 : 6 sections, 150 questions, texte 14297 octets
  ch2 : 5 sections, 150 questions, texte 10193 octets
  ch3 : 6 sections, 150 questions, texte 12337 octets
  ch4 : 5 sections, 150 questions, texte 11011 octets
  ch5 : 6 sections, 150 questions, texte 11409 octets
  ch6 : 6 sections, 150 questions, texte 11082 octets
  ch7 : 6 sections, 150 questions, texte 11319 octets
  ch8 : 6 sections, 150 questions, texte 13834 octets
  ch9 : 6 sections, 150 questions, texte 12989 octets
  ch10 : 5 sections, 150 questions, texte 9353 octets
  ch11 : 6 sections, 150 questions, texte 10892 octets
  ch12 : 5 sections, 150 questions, texte 8253 octets
  ch13 : 6 sections, 150 questions, texte 11769 octets
  ch14 : 6 sections, 150 questions, texte 9969 octets
  ch15 : 5 sections, 150 questions, texte 11879 octets
```
