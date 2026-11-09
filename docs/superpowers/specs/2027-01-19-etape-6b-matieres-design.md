# Étape 6b : autres matières de 1re ST2S — brouillon de spec (à valider)

> **Statut : BROUILLON.** Rédigé par Claude pendant la session autonome de nuit, sans échange avec l'enseignant. Les choix marqués **[À valider]** sont des recommandations, pas des décisions. Aucune ligne de code ni aucun contenu de cours ne sera produit avant ta validation.

## 1. Pourquoi une étape à part

Le cours BPH est né de ton propre cours (PDF et site du dossier « BPH 1ST »). L'IA n'a rédigé que les questions, en s'appuyant sur ce texte, que tu avais écrit et validé. Pour les autres matières, ce texte de référence n'existe pas encore dans l'application. C'est la vraie différence avec l'étape 6a, et elle décide de tout le reste.

## 2. Périmètre recommandé [À valider]

En 1re ST2S, les enseignements de spécialité sont au nombre de trois :

| Matière | Recommandation |
|---|---|
| Biologie et physiopathologie humaines (BPH) | déjà faite (étapes 3b et 6a) |
| **Sciences et techniques sanitaires et sociales (STSS)** | **à faire en premier** : spécialité au plus fort coefficient, proche de BPH pour le public visé |
| **Physique-chimie pour la santé** | à faire ensuite |

Le tronc commun (français, histoire-géographie, mathématiques, langues, EMC, EPS) est **hors périmètre** de 6b. Il n'est pas propre à la filière, et son contenu est déjà largement couvert ailleurs.

## 3. D'où vient le texte des cours [À valider : décision principale]

Trois options, de la plus sûre à la plus rapide :

- **A. Ton matériel de cours** (recommandé). Comme pour BPH, tu fournis tes cours de STSS et de physique-chimie : PDF, documents ou notes. Le script de conversion de l'étape 3b est adapté pour les transformer en chapitres. Les banques de questions suivent ensuite exactement la chaîne de l'étape 6a.
- **B. Le programme officiel, rédigé par l'IA.** L'IA rédige les chapitres à partir du programme officiel (Bulletin officiel, programme de 1re ST2S). Le cours est importé **non publié**, et tu le relis chapitre par chapitre avant toute publication. C'est plus rapide, mais tu relis un cours entier et non plus seulement des questions. Le risque d'écart avec ta progression réelle est aussi plus grand.
- **C. Mélange.** Tes plans de chapitres et tes points clés, rédigés et mis en forme par l'IA, puis relus par toi.

Dans tous les cas :

- un cours produit par l'IA n'est **jamais publié automatiquement** ;
- ses questions entrent en « à relire », comme en 6a ;
- les schémas suivent la même règle : soit tes figures, soit des schémas SVG simples relus par toi.

## 4. Ce qui est réutilisé sans changement

- le format d'import JSON et le guide des auteurs ;
- les outils `banque:texte`, `banque:verifier` et `banque:fusionner`. Ils devront accepter un fichier de cours autre que `bph.json` : c'est un petit changement d'outillage, avec un paramètre `--cours` ;
- la relecture en lot dans l'admin, et l'option `--garder-statuts` ;
- la chaîne « rédaction Sonnet, relecture Opus contre le cours, revue, fusion » ;
- les quotas par chapitre (65 / 26 / 26 / 13, difficultés 40 / 40 / 20). Ils sont **[À valider]** pour la physique-chimie, où les questions de calcul justifieraient plus de réponses courtes numériques avec marge.

## 5. Découpage proposé

1. **Outillage**
   - Paramètre `--cours` pour les outils de banque.
   - Couleur et identité des nouvelles matières, avec la règle de contraste du guide.
2. **STSS** : intégration du cours (option A, B ou C), relecture par toi, puis banques de questions chapitre par chapitre (arrêt après le chapitre 1, comme en 6a).
3. **Physique-chimie pour la santé** : même chaîne.
4. **Bilan.**

## 6. Questions pour toi

1. Option A, B ou C pour le texte des cours (§ 3) ? Si A : peux-tu déposer tes cours de STSS et de physique-chimie dans un dossier, et lequel ?
2. Commencer par la STSS, comme recommandé ?
3. Quotas de questions : les mêmes qu'en BPH, ou plus de calculs en physique-chimie ?
4. Le tronc commun reste-t-il bien hors périmètre ?
