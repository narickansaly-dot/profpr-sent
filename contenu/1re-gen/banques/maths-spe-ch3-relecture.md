# Relecture de la banque du chapitre 3 (spécialité maths, 1re) : second degré

Banque : `maths-spe-ch3.json`, 150 questions, sources `maths-spe-1re:ch3:banque:001` à `150`.

## Méthode

1. **Rédaction** : questions générées par script Python ; égalités d'expressions testées en plusieurs points (bonne réponse égale, chaque distracteur différent), racines et discriminants recalculés, vérité de chaque proposition des `qcm_multiple` calculée ; questions de vocabulaire et de logique relues à la main.
2. **Relecture indépendante** : un second agent a reçu les 150 énoncés **sans les réponses ni les explications**, les a résolus en refaisant les calculs avec Python (sympy) et a signalé les ambiguïtés.
3. **Comparaison automatique** de ses réponses avec les réponses attendues.

## Résultat

- **150 / 150 réponses concordantes**, 0 désaccord, 0 doute signalé.

## Points de doute du rédacteur

- Complétion du carré écrite x² + 2kx = (x + k)² − k² (le programme écrit a ; k évite la confusion avec le coefficient a, et le cours le signale).
- Le paramètre m (racine double) et le cas « a et c de signes contraires » sont travaillés dans plusieurs notions.
- La section facultative « Pour aller plus loin » n'a qu'une question (deux nombres de somme 17 et de produit 72).

## Statut

Aucune question douteuse : les 150 questions passent en `valide`.
