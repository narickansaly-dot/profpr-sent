# Bilan : cours d'EMC de première générale

Branche `claude/contenu-1re-emc-0ed1ca`, 16 novembre 2026. Rien n'est poussé ni importé.

## Programme suivi

Arrêté du 29 mai 2024 fixant le programme d'EMC du CP à la terminale (NOR : MENE2413934A, JO du 12 juin 2024, BO n° 24 du 13 juin 2024). Son article 3 le rend applicable **en première depuis la rentrée 2025** ; il a abrogé le programme de 2019 (art. 2). C'est donc lui qui s'applique en 2026-2027, et les élèves l'ont déjà suivi en seconde. Thème de l'année : « Cohésion et diversité dans une société démocratique », en deux axes de 9 heures : « Les valeurs et les principes de la République à l'épreuve de la cohésion sociale » et « La République et la Nation ». Résumé fidèle de l'annexe (pages 24-25, lue dans le navigateur intégré avec pdf.js) dans `programmes/emc-1re.md` ; 10 notions, 12 contenus, 17 démarches codés et tous rattachés à un chapitre (`programmes/emc-1re-plan.md`).

## Chapitres

| N° | Titre | Durée | Axe | Sections | Questions | Statuts |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Fraternité et solidarité : la République, un projet social | 3 h | 1 | 5 | 150 | 150 valide |
| 2 | L'égalité entre les femmes et les hommes, un principe qui transforme la société | 2 h | 1 | 4 | 150 | 150 valide |
| 3 | Lutter contre les discriminations et les haines | 2 h | 1 | 5 | 150 | 150 valide |
| 4 | La laïcité, condition de la coexistence et du pluralisme | 2 h | 1 | 4 | 150 | 150 valide |
| 5 | Une République indivisible à l'organisation décentralisée | 3 h | 2 | 5 | 150 | 150 valide |
| 6 | La communauté nationale : nationalité, citoyenneté et mémoire | 3 h | 2 | 5 | 150 | 150 valide |
| 7 | Défendre la Nation : défense et sécurité nationale | 3 h | 2 | 6 | 150 | 146 valide, 4 a_relire |

Cours `contenu/1re-gen/emc.json` : slug `emc-1re-gen`, filière `GEN`, niveau `1re`, matière `EMC`, couleur `#1d4ed8` (contraste 6,70:1), format STSS (chapeau, objectifs, sections, « Je retiens »), tutoiement. **1 050 questions** : par chapitre 75 QCM unique, 30 QCM multiple, 30 vrai/faux, 15 réponses courtes ; difficultés proches de 60 / 60 / 30.

## Méthode de vérification

1. Chaque banque a été rédigée par un sous-agent, puis **relue à l'aveugle** par un autre sous-agent indépendant qui a résolu les 150 questions avec le seul texte du chapitre ; ses réponses ont été comparées automatiquement aux réponses attendues. Résultat sur les 1 050 questions : **0 écart de réponse**, 158 remarques (doublons, distracteurs défendables, indices de forme, variantes de réponses courtes, faits discutables).
2. Toutes les remarques ont été traitées : **82 questions corrigées et 68 remplacées** (détail par question dans `banques/emc-chN-relecture.md`).
3. Le texte du cours a été soumis à une **vérification factuelle** indépendante (sous-agent avec recherche web), puis corrigé ; les banques ont été réalignées (une trentaine de questions).
4. Les 153 questions corrigées ou remplacées ont été **relues une seconde fois à l'aveugle** par de nouveaux sous-agents : 0 écart ; 7 retouches.
5. Statut : `valide` pour toutes les questions relues (comme pour BPH et STSS après relecture, commits 67d1671 et 90bd11c), `a_relire` pour les 4 questions réellement douteuses ci-dessous.

## Erreurs corrigées dans le cours

- Décision QPC du 6 juillet 2018 : elle s'appuie sur la devise, le Préambule de **1958** et l'article 72-3, pas sur le Préambule de 1946.
- Loi de 2021 : le viol sur mineur de moins de 15 ans suppose un acte de pénétration ou bucco-génital, un auteur majeur et cinq ans d'écart ; régime de l'inceste. Outrage sexiste aggravé devenu un délit en 2023. Parité : élections concernées.
- Préfets créés en 1800 (et non dès 1790) ; collectivités de l'article 74 : spécialité législative seulement en Polynésie française et à Wallis-et-Futuna ; métropoles créées en 2010 (généralisées en 2014) ; acte II = révision de 2003 et loi du 13 août 2004 ; apprentissage retiré des compétences régionales ; Assurance maladie distinguée de l'État ; accord de Bougival (2025) pour la Nouvelle-Calédonie.
- Ploërmel (monument entier déplacé en 2018), Défenseur des droits (autorité constitutionnelle indépendante), nombre de personnes handicapées (fourchette selon la définition), Éboué (le Tchad, premier territoire de l'Afrique française rallié), patriotisme constitutionnel (Sternberger, puis Habermas).
- Chapitre 7, faits devenus faux : le SNU est en extinction depuis 2025-2026 ; nouveau service national volontaire (2026) ; JDC rebaptisée « journée de mobilisation » (loi du 16 août 2026) ; certificat de JDC plus exigé pour le permis de conduire depuis 2024 ; LPM actualisée en août 2026 ; références des articles 34, 35 et 47.
- Données de pauvreté mises à jour (Insee, 2024 : 15,4 %, plus d'un enfant sur cinq).

## Contrôles finaux

| Contrôle | Outil | Résultat |
| --- | --- | --- |
| Schéma d'import | `analyserImport` | valide : 7 chapitres, 34 sections, 1 050 questions |
| Couleur | `contraste`, `couleurCoursAcceptable` | 6,70:1, acceptée |
| HTML | `nettoyerHtml` | rien de retiré (hors `tabindex` ajouté aux tableaux) |
| Banques | `verifierBanque` (préfixe `emc`, 150 questions) | 7 banques conformes |
| Fusion | `fusionnerBanque` | 7 × 150 ajoutées ; second passage : 0 ajoutée |
| Import à blanc | `versDonneesCours` | charge utile de 781 739 octets (fichier : 899 642 octets, limite 3 Mo) ; base non contactée |

## Points à trancher par l'enseignant

1. **Quatre questions `a_relire`** (chapitre 7 : 074, 121, 131, 137) : elles reposent sur le nouveau service national de 2026 et sur le changement de nom de la JDC (loi du 16 août 2026), trouvés par une seule recherche. À confirmer, ainsi que les phrases correspondantes du cours.
2. **Faits récents du cours** à garder ou alléger : données de pauvreté 2024 (publiées en juillet 2026), inscription du non-consentement dans la définition du viol (2025), remplacement annoncé de l'index de l'égalité professionnelle (directive de 2023), LPM actualisée (2026), accord de Bougival.
3. **Plan** : sept chapitres (quatre pour l'axe 1, trois pour l'axe 2) ; pas de point d'arrêt avec l'enseignant.
4. **Modification de l'annexe en 2026** : l'arrêté du 16 février 2026 (BNMA) modifie l'annexe ; détail non lu (Légifrance bloque les requêtes automatiques), a priori sans effet sur la première générale.
5. **Sujets sensibles** (laïcité et arrêts CEDH sur le voile, violences sexuelles, mémoires) : traités de façon factuelle et neutre, sans question d'opinion ; à relire par l'enseignant.
6. **Doublons résiduels** : des faits voisins reviennent parfois sous deux angles (QCM et vrai/faux) ; les doublons francs ont été supprimés.

## Outillage (changements de scripts à prévoir, non faits)

`banque:texte`, `banque:verifier`, `banque:fusionner` ne connaissent que `bph` et `stss` (`src/lib/contenu/banque/cours.ts`) et lisent les banques dans `contenu/1re-st2s/banques/` ; `import:contenu` n'a pas de mode à blanc. La validation a appelé les mêmes fonctions de la bibliothèque depuis un pilote placé hors du dépôt (copie du pilote de la session SVT de 2de). À prévoir : accepter un chemin de cours quelconque et lire les banques à côté du fichier du cours ; ajouter `--a-blanc` à `import:contenu`. Avant l'import réel : `npm run import:contenu -- contenu/1re-gen/emc.json --garder-statuts`.
