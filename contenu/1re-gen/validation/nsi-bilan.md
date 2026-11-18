# Bilan : cours de NSI (spécialité), première générale

Date : 16 novembre 2026. Branche : `claude/contenu-1re-nsi-476c7a`.

## Programme suivi

- **Arrêté du 17 janvier 2019**, NOR **MENE1901633A**, JO du 20 janvier 2019, **BO spécial n° 1 du 22 janvier 2019**, en vigueur depuis la rentrée 2019.
- **Toujours en vigueur en 2026-2027** (vérifié le 11 novembre 2026) : le BO n° 14 du 2 avril 2026 remplace les programmes de mathématiques mais pas celui de NSI, et aucun arrêté de 2025 ou 2026 ne touche la NSI de première. La note de service du 11 septembre 2026 (NOR MENE2622643N, BO spécial n° 4 du 17 septembre 2026) ne change que l'épreuve terminale (session 2027) ; elle rappelle que les notions de première doivent être connues.
- Annexe lue dans le PDF du BO (texte extrait avec PDFKit) ; résumé codé dans `programmes/nsi-1re.md`, plan dans `programmes/nsi-1re-plan.md`.

## Livrables

| Fichier | Contenu |
| --- | --- |
| `programmes/nsi-1re.md` | Résumé du programme (8 rubriques, capacités codées [D1]…[G5]) |
| `programmes/nsi-1re-plan.md` | Plan en 11 chapitres, durées, correspondance programme → chapitres |
| `nsi.json` | Cours `nsi-1re-gen`, filière `GEN`, niveau `1re`, matière `NSI`, couleur `#0369a1` (**contraste 5,93:1** avec le blanc, accepté), 11 chapitres, 78 sections, **1 650 questions `valide`**, 1,13 Mo (3 Mo au plus) |
| `banques/nsi-chN.json` (11) | 150 questions par chapitre, sources `nsi-1re:chN:banque:001` à `150` |
| `banques/nsi-chN-relecture.md` (11) | Relecture indépendante de chaque banque et corrections |
| `validation/nsi-chN.md` (11) | Contrôles automatiques et statistiques de chaque chapitre |
| `validation/nsi-cours.md` | Relecture indépendante du texte du cours et corrections |

Préfixe des sources : `nsi-1re` (et non `nsi`), car la colonne `source` est unique dans toute la base (`supabase/migrations/20261103000001_socle.sql`) : cela évite toute collision avec un futur cours de NSI de terminale.

## Chapitres

| N° | Titre | Sections | Questions |
| --- | --- | --- | --- |
| 1 | Écrire les entiers naturels en base 2, 10 et 16 | 8 | 150 |
| 2 | Entiers relatifs, nombres flottants et textes | 8 | 150 |
| 3 | Booléens, expressions logiques et circuits | 7 | 150 |
| 4 | Programmer en Python : constructions, fonctions, spécification et tests | 7 | 150 |
| 5 | Types construits : p-uplets, tableaux et dictionnaires | 6 | 150 |
| 6 | Traitement de données en tables | 7 | 150 |
| 7 | Parcours, tris et recherche dichotomique | 6 | 150 |
| 8 | Algorithmes gloutons et k plus proches voisins | 7 | 150 |
| 9 | Le Web : interactions, client-serveur et formulaires | 7 | 150 |
| 10 | Architecture des machines, systèmes d'exploitation et périphériques | 8 | 150 |
| 11 | Transmission de données dans un réseau | 7 | 150 |
| | **Total** | **78** | **1 650** |

Chaque banque : 75 `qcm_unique`, 30 `qcm_multiple`, 30 `vrai_faux` (15 vrais, 15 faux), 15 `reponse_courte` ; difficultés 60 / 60 / 30 ; 9 à 11 notions ; bonne réponse strictement la plus longue dans 6 à 29 QCM sur 75 (seuil : moins de 40 %).

## Validation

- `verifierBanque` (préfixe `nsi-1re`, 150 questions) : les 11 banques sont conformes, y compris les espaces insécables et la similarité des énoncés (contrôlée aussi contre les questions déjà fusionnées).
- `analyserImport` sur `nsi.json` : aucune erreur. `nettoyerHtml` : rien n'est retiré (78 sections et 11 « Je retiens », schémas SVG compris). `versDonneesCours` (import à blanc) : charge utile de 1 650 questions construite.
- Réponses courtes : aucune marge, aucun séparateur de milliers ; écritures binaires, hexadécimales et négatives avec leurs variantes (préfixes 0b / 0x, tiret et signe moins).
- **Import réel non fait** : le worktree n'a ni `.env.local` ni base locale. Commande prévue : `npm run import:contenu -- contenu/1re-gen/nsi.json` (ajouter `--publier` pour publier).
- Outillage : les scripts `banque:*` n'acceptent que `bph` et `stss` ; la validation a appelé directement les mêmes fonctions (`verifierBanque`, `fusionnerBanque`, `texteChapitre`, `analyserImport`, `nettoyerHtml`, `versDonneesCours`) avec un pilote hors dépôt (adapté de `pilote-banques-svt.ts`, avec un préfixe de fichier `nsi` distinct du préfixe de source `nsi-1re`).

## Relecture indépendante et erreurs corrigées

Chaque banque a été relue **à l'aveugle** par un sous-agent distinct, qui a reçu les questions sans les réponses ni les explications, les a résolues, et a **exécuté réellement** les extraits et calculs : Python pour tous les chapitres (simulateurs instrumentés des tris, de la dichotomie, du langage machine du cours et du bit alterné ; `ipaddress` ; force brute pour le sac à dos), JavaScript avec node (chapitre 9), commandes shell réelles dans un dossier temporaire (chapitre 10). Ses réponses ont été comparées automatiquement aux réponses attendues.

- **Concordance : 1 650 réponses sur 1 650** (trois réponses courtes données sous forme de flottant, 5.0, 7.0, sont acceptées par la comparaison numérique).
- **Erreurs de fond corrigées** :
  - ch8 : **ex aequo dans le sac à dos** X, Y, Z (deux rapports valeur/masse égaux) qui rendait deux réponses défendables dans 4 questions ; données changées et revérifiées par force brute ;
  - ch8 : une proposition « 9, rendu 4 + 4 + 1 » marquée fausse alors que ce rendu est optimal (corrigée avant relecture) ;
  - ch4 : deux tests légitimes révélaient l'erreur dans la question 069 ;
  - ch2 : un distracteur défendable (IEEE 754 révisée en 2008), une borne ambiguë ;
  - ch11 (texte du cours) : contradiction sur TCP et l'ordre des paquets.
- **Ambiguïtés et distracteurs défendables corrigés** : environ 70 questions reformulées (unités manquantes, « comparaisons » ou « tours de boucle », bornes incluses, fichiers de script externes, flottants égaux à un entier…), et des variantes ajoutées aux réponses courtes.
- **Notions utilisées par les questions mais absentes du cours** : ajoutées au texte (une trentaine de compléments : and/or renvoient un opérande, comparaisons enchaînées, UnboundLocalError, paramètre par défaut, set et count, copie superficielle, sum/min/max, cookies et ressources, label, input/change, adresses réservées d'un /24, rôle des ports…).
- **Relecture du texte du cours** (`validation/nsi-cours.md`) : 45 extraits de code et 130 calculs exécutés, tous conformes ; 1 erreur et 9 imprécisions corrigées.
- Questions écrites ou réécrites **après** leur relecture (vérifiées par exécution en Python, sans seconde relecture indépendante) : ch4 : 150 ; ch7 : 043, 115 ; ch8 : 064, 100, 115, 133, 148 ; ch9 : 100, 149 ; ch10 : 062 ; ch11 : 028, 084, 094, 147.

## Statuts

Le dépôt valide après relecture (commits 67d1671 et 90bd11c, partie 2 du guide) : **les 1 650 questions sont `valide`**. Aucune n'est laissée `a_relire` : les points douteux ont tous été corrigés. Les seules nuances restantes sont des cas limites hors programme, gardés volontairement : ch9 : 091 (une URL avec paramètres pourrait en théorie servir d'action à un formulaire POST) ; ch11 : 068 et 134 (traduction d'adresses et pare-feu, mentionnés en une phrase dans le cours).

## Limites du HTML autorisé

- Pas de `pre` ni de `code`, ni `font-family` ou `white-space` en style : les programmes sont dans un `div class="code"` encadré, une ligne par `br`, indentation en espaces insécables, sans police à chasse fixe. Les sessions `>>>` et le code HTML ou JavaScript montrés sont échappés (`&lt;`).
- Énoncés des questions en texte brut sur une ligne : programmes écrits avec des « ; » ou décrits en mots (« on exécute …, puis … »). Les balises écrites dans les énoncés (« <button> ») s'affichent telles quelles, car les énoncés sont rendus comme du texte par React (`LecteurTentative.tsx`, `ListeCorrection.tsx`).
- Exposants et indices en `sup`/`sub` dans le cours, en caractères Unicode dans les questions (2⁸, 1011₂).

## Points à trancher

1. **Ordre des chapitres** : le programme n'impose pas de progression. Le plan commence par la représentation des données ; beaucoup d'enseignants commencent par Python (chapitre 4).
2. **Projets** : au moins un quart de l'horaire ; ils ne sont pas couverts par le cours (idées d'activités seulement).
3. **JavaScript (chapitre 9)** et **langage machine simplifié (chapitre 10)** : le cours définit son propre jeu d'instructions (LOAD, STORE, ADD, SUB, MOV, JUMP, JUMPZ, HALT) ; à harmoniser avec celui utilisé en classe (simulateur choisi par l'enseignant).
4. **Notions au-delà du strict programme**, utilisées comme outils et signalées : lambda et tranches (tri, k-ppv), set et count (doublons), cookies et RGPD, NAT, pipeline.
5. **Questions renvoyant à un exemple du cours** (« la fonction rendu_monnaie du cours », « la page du cours ») : utiles en révision, à éviter en évaluation hors contexte.
6. **Proposition d'évolution des scripts** (non faite, hors périmètre) : ajouter une configuration par cours dans `src/lib/contenu/banque/cours.ts` (fichier, dossier des banques, préfixe de fichier et préfixe de source distincts, total), par exemple `--cours nsi-1re` → `contenu/1re-gen/nsi.json`, banques `contenu/1re-gen/banques/nsi-chN.json`, sources `nsi-1re:chN:banque:NNN`. Proposer aussi `pre`/`code` dans la liste blanche et une classe `.code` en chasse fixe.
7. **Relecture enseignante** recommandée avant import, en particulier pour les questions réécrites après relecture (liste ci-dessus).
