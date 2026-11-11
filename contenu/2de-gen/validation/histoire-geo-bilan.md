# Bilan : cours d'histoire-géographie, 2de générale

Branche `claude/contenu-2de-histoire-geo-abfe99`, 11 novembre 2026. Tout est commité, sans push ni PR.

## Programme applicable

- **Arrêté en vigueur** : arrêté du 17 janvier 2019, programme d'histoire-géographie de seconde générale et technologique (annexe 1, BO spécial n° 1 du 22 janvier 2019), en vigueur depuis la rentrée 2019.
- **Aucun changement trouvé pour 2026-2027.** Les nouveaux textes de 2026 concernent les cycles 2 et 3 (arrêté du 22 avril 2026, BO n° 22 du 28 mai 2026) et l'adaptation des programmes de première et de terminale. Ils ne touchent pas la seconde.
- **Limite** : Légifrance n'a pas pu être consulté directement. La version consolidée de l'arrêté est à confirmer par l'enseignant (détails dans `programmes/histoire-geo-2de.md`).

## Fichiers

| Fichier | Contenu |
| --- | --- |
| `programmes/histoire-geo-2de.md` | résumé fidèle de l'annexe 1 (lue en entier, 16 pages) et vérification de l'arrêté applicable |
| `programmes/histoire-geo-2de-plan.md` | découpage en 15 chapitres, avec objectifs, sections et notions |
| `histoire-geo.json` | le cours : 15 chapitres rédigés, 2 250 questions au statut `a_relire` |
| `banques/histoire-geo-chN.json` | 15 fichiers de travail de 150 questions |
| `banques/histoire-geo-chN-relecture.md` | 15 relectures, avec les points de doute |
| `validation/histoire-geo-cours.md` | validation du cours (import, HTML, typographie, couleur) |
| `validation/histoire-geo-chN.md` | 15 rapports de contrôle des banques |

## Chapitres

| N° | Chapitre | Programme | Questions |
| --- | --- | --- | --- |
| 1 | La Méditerranée antique : les empreintes grecques et romaines (avec l'introduction sur la périodisation) | H0, H1 | 150 |
| 2 | La Méditerranée médiévale | H2 | 150 |
| 3 | L'ouverture atlantique | H3 | 150 |
| 4 | Renaissance, humanisme et réformes religieuses | H4 | 150 |
| 5 | L'affirmation de l'État dans le royaume de France | H5 | 150 |
| 6 | Le modèle britannique et son influence | H6 | 150 |
| 7 | Les Lumières et le développement des sciences | H7 | 150 |
| 8 | Tensions, mutations et crispations de la société d'ordres | H8 | 150 |
| 9 | Sociétés et environnements : risques et ressources sous pression | G1, G2 | 150 |
| 10 | La France : milieux entre valorisation et protection | G3 | 150 |
| 11 | Trajectoires démographiques ; développement et inégalités | G4, G5 | 150 |
| 12 | La France : dynamiques démographiques, inégalités | G6 | 150 |
| 13 | Migrations et tourisme internationaux | G7, G8 | 150 |
| 14 | La France : mobilités, transports, aménagement | G9 | 150 |
| 15 | L'Afrique australe : un espace en profonde mutation | G10, G11, G12 | 150 |
| | **Total** | | **2 250** |

Les 2 250 questions se répartissent ainsi :

- **par type** : 1 125 QCM à réponse unique, 450 QCM à réponses multiples, 450 vrai/faux et 225 réponses courtes ;
- **par difficulté** : 900 de niveau 1, 900 de niveau 2 et 450 de niveau 3.

## Validation

- **Cours** : `analyserImport` ne renvoie aucune erreur, et la conversion `versDonneesCours` réussit. Le fichier pèse 1,5 Mo, pour une limite de 3 Mo. Le nettoyage HTML ne retire rien. Le contraste de la couleur `#92400e` avec le blanc est de 7,09:1.
- **Banques** : les 15 banques sont conformes à `verifierBanque`. Deux contrôles complémentaires ont été ajoutés :
  - chaque réponse courte doit figurer dans le texte du chapitre ;
  - les doublons entre réponses courtes et autres questions sont recherchés.
- **Import à blanc** : il n'a pas été fait. Le script n'a pas de mode « à blanc », et la commande `supabase` n'est pas installée. Commande à lancer par l'enseignant : `npm run import:contenu -- contenu/2de-gen/histoire-geo.json`.

## À changer dans les scripts (non modifiés, comme demandé)

- `banque:texte`, `banque:verifier` et `banque:fusionner` ne connaissent que `bph` et `stss`. Leurs chemins sont écrits en dur sur `contenu/1re-st2s/` (`src/lib/contenu/banque/cours.ts` et les trois scripts).
- Il faudrait ajouter les cours de 2de à `COURS_BANQUE` (préfixe, fichier, total) et rendre le dossier des banques paramétrable.
- En attendant, les contrôles et la fusion ont été faits en appelant directement les fonctions du dépôt, avec la configuration `{ prefixe: 'histoire-geo', total: 150 }`.

## Points à trancher par l'enseignant

1. **Découpage**. L'introduction sur la périodisation est intégrée au chapitre 1. En géographie, les deux questions générales de chaque thème sont réunies en un chapitre, ce que le programme autorise. On obtient 15 chapitres ; un chapitre par question en donnerait 18.
2. **Relecture des 2 250 questions** : elles sont toutes `a_relire`. Les relectures sont des autorelectures, pas des relectures indépendantes comme pour STSS. Elles signalent les points de doute, mais une validation humaine reste nécessaire avant de passer les questions en `valide`.
3. **Chiffres à actualiser chaque année**, surtout en géographie : population mondiale et française, migrants, réfugiés, tourisme, IDH, Grand Paris Express. Les relectures les listent chapitre par chapitre.
4. **Corrections du cours faites en relisant** :
  - Colomb touche les Bahamas le 12 octobre 1492, pas les Antilles (chapitre 3) ;
  - le lieu du concile de Trente est précisé (chapitre 4).

  À vérifier avec le manuel de la classe :
  - Xynthia, 47 morts (chapitre 10) ;
  - la Lorraine présentée comme un « héritage » (chapitre 5) ;
  - l'entrée de l'Afrique du Sud dans les BRICS en 2010 (chapitre 15).
5. **Paires inverses** : certaines réponses courtes reprennent à l'envers un QCM. Les relectures les signalent. Les doublons directs ont tous été supprimés.
6. **Biais de longueur** : la bonne réponse est la plus longue dans 24 à 36 % des QCM selon les chapitres, sous le seuil de 40 %. Au chapitre 8, un biais inverse (1 %) a été corrigé.
