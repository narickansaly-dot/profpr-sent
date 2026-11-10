# Relecture du chapitre 4 de STSS : « La recherche documentaire en santé-social »

Relecture indépendante (task 3, N = 4). Fichier corrigé : `.superpowers/sdd/2027-01-26-etape-6b-stss/stss-ch4.json`. `stss.json` n'a pas été modifié.

## Bilan

- **Programme** : les notions N62 à N67 et les capacités C43 et C44 du plan sont toutes traitées, dans les quatre sections prévues, dans l'ordre. Les quatre temps du contenu officiel (questionnement, collecte, analyse critique des sources, synthèse) sont nommés et structurent le chapitre. L'exercice du plan, « comparer plusieurs sources sur un même sujet », est présent (tableau des documents A à D). Rien n'est hors programme : les notions du chapitre 5 (objet d'étude, hypothèses, méthode) et le producteur de données (N19, chapitre 3) sont seulement nommés avec un renvoi. Les objectifs reprennent les cinq objectifs du plan, dans la même forme que le chapitre 1.
- **Exactitude** : les huit organismes et bases cités sont correctement placés dans la typologie. INSEE, DREES et Santé publique France produisent des données statistiques et épidémiologiques. La Haute Autorité de santé est une autorité publique indépendante qui publie des recommandations. Service-public.fr est le site officiel de l'administration française pour les droits et les démarches. Légifrance est le service public de diffusion du droit (lois, décrets, codes). Cairn.info est une plateforme de revues et de livres en sciences humaines et sociales, surtout en français. PubMed est le moteur de recherche de la bibliothèque nationale de médecine des États-Unis : il donne surtout des références et des résumés, en grande majorité en anglais. Trois descriptions ont été précisées (voir le tableau). Le chapitre ne contient aucun chiffre, aucune date et aucune loi.
- **Niveau** : des phrases courtes, le tutoiement, et chaque terme du programme défini dans un encadré à sa première apparition. Les deux sigles INSEE et DREES, qui n'étaient pas développés, le sont maintenant.
- **Cohérence** : les renvois (chapitre 3 pour les indicateurs et les producteurs de données, chapitre 5 pour l'étude, chapitres 6 à 9) suivent la numérotation du plan. Le chapitre 1 ne traite ni des sources ni de la documentation : il n'y a pas de contradiction.
- **Format** : seulement les classes du chapitre 1 (`def`, `t`, `tbl`, `warn`). La balise `em` est autorisée par le guide des auteurs. Le fichier compte 128 vraies U+00A0, aucune entité `&nbsp;` et aucune espace ordinaire avant « : ; ! ? » ou à l'intérieur de « ».
- **Validateur** : `analyserImport` ne renvoie aucune erreur après correction (script jetable supprimé).
- **Longueur** : environ 13 700 caractères de texte après correction (13 200 avant). C'est raisonnable pour une semaine. Aucune coupe : chaque passage sert une notion, une capacité ou l'exercice du plan.

## Corrections

| Section | Problème | Correction |
| --- | --- | --- |
| `questionner-requete` | Les sigles INSEE et DREES n'étaient pas développés. | Ajout des noms complets ; la DREES est présentée comme le service statistique des ministères chargés de la santé et des affaires sociales. |
| `questionner-requete` | PubMed décrit comme une base « d'articles » en « médecine » : PubMed donne surtout des références et des résumés, et couvre aussi la biologie. | « références et résumés d'articles en médecine et en biologie, surtout en anglais ». La colonne « Ce qu'on y trouve » précise « ou seulement leurs références et leurs résumés ». |
| `questionner-requete` | Cairn.info ne propose pas que des articles. | « revues et livres en sciences humaines et sociales, en français ». |
| `evaluer-sources` | « il faut des données sur toute la population » : faux en général, les enquêtes portent le plus souvent sur un échantillon (notion du chapitre 5). | « il faut des données statistiques, recueillies auprès d'un grand nombre de personnes ». |
| `corpus-references` | La définition du corpus affirmait « Il est varié, fiable et organisé » : c'est une qualité attendue, pas une propriété de tout corpus. | « Un bon corpus est varié, fiable et organisé. » |
| `pourquoi-recherche` | « chiffres de cadrage » : expression non définie, peu claire pour un élève de 1re. | « principaux chiffres ». |

Points vérifiés et laissés tels quels :

- la place de la HAS, de Service-public.fr et des sites des ministères parmi les sites institutionnels ;
- Légifrance comme base des lois, des décrets et des codes ;
- les opérateurs ET, OU, SAUF et les guillemets, présentés « selon les outils » ;
- la méthode QQOQCP, présentée comme une aide et non comme une norme ;
- les éléments d'une référence par type de document, sans norme nommée ;
- les quatre documents fictifs de l'exercice et leur verdict.

## Points de doute pour l'enseignant

1. **Opérateurs de recherche** : « SAUF » est la forme française de certains catalogues de CDI. Les moteurs de recherche et PubMed utilisent plutôt AND, OR, NOT ou le signe moins. Le texte reste général (« selon les outils ») ; à montrer en classe sur l'outil réellement utilisé.
2. **Portail du CDI** : le catalogue est désigné comme « le portail documentaire du CDI de ton lycée », sans nommer de logiciel (e-sidoc, PMB…). À préciser selon votre établissement.
3. **Typologie des bases** : il n'existe pas de typologie officielle. Les six types retenus (catalogues, bases statistiques, sites institutionnels, bases juridiques, bases d'articles scientifiques, presse) suivent l'usage courant des manuels. La BDSP, Europresse, Google Scholar, HAL et Persée ne sont pas cités ; à ajouter si vous les utilisez.
4. **Critères de qualité de l'information** : les cinq critères (actualité, exactitude, précision, objectivité, pertinence) sont une grille de travail, pas une liste officielle. Le recoupement sert à vérifier l'exactitude ; certains manuels le présentent comme un critère à part.
5. **Normes de citation** : aucune norme n'est nommée (ISO 690, APA). Le texte renvoie au professeur documentaliste. À harmoniser avec les consignes de l'établissement.
6. **Cairn.info** : l'accès à une partie des contenus est payant, souvent ouvert par l'abonnement d'une bibliothèque. Le chapitre ne le dit pas ; à signaler aux élèves si le lycée n'est pas abonné.
