# Application de cours pour lycéens : spécification de conception

- **Date** : 3 novembre 2026
- **Statut** : validée section par section, en attente de relecture finale
- **Nom provisoire** : `app-lycee` (nom définitif à choisir ; « Lycéa » écarté car les domaines principaux sont pris)

## 1. Objectif

Une application où les lycéens (seconde à terminale, voies générale, technologique et professionnelle) retrouvent des cours détaillés pour chaque matière de leur programme. Ils s'entraînent avec des quiz par chapitre, passent une évaluation par cours, organisent leurs révisions dans un calendrier avec notifications, et suivent leur progression sur un tableau de bord. Les enseignants suivent leurs classes. L'accès complet est payant par abonnement.

### Périmètre de la première version

- Toute la mécanique de l'application (comptes, quiz, évaluations, tableaux de bord, calendrier, notifications, abonnements, outil de gestion du contenu).
- Contenu : **1re ST2S uniquement**. On part du cours BPH existant (dépôt `BPH 1ST` : 7 chapitres, quiz, deuxième série de questions), puis on ajoute les autres matières de 1re ST2S.
- La structure des données accepte toutes les voies, filières et niveaux. Les autres filières seront ajoutées plus tard, seulement en contenu.

### Hors périmètre de la première version

- Publication dans l'App Store et le Play Store (prévue plus tard via Capacitor, sans réécriture).
- Questions « légender un schéma » et « associer / ordonner ».
- Licences par établissement.
- Filières autres que la 1re ST2S.
- Badges, récompenses, moyenne générale.

## 2. Choix techniques

| Élément | Choix |
|---|---|
| Interface | Next.js (App Router), React, TypeScript, PWA installable |
| Base de données, comptes, stockage, tâches planifiées | Supabase (région Europe), Postgres avec règles d'accès par ligne (RLS) |
| Paiements | Stripe Billing (page de paiement hébergée et portail client) |
| Notifications | Web Push (VAPID), envoyées par une tâche planifiée qui tourne chaque minute |
| Hébergement | Vercel |
| Tests | Vitest (règles), tests RLS sur la base, Playwright (parcours de bout en bout) |
| Stores (plus tard) | Capacitor |

Le code est dans un **nouveau dépôt** (`app-lycee`). Le site BPH statique actuel reste en ligne tel quel. Son contenu est importé comme premier cours.

## 3. Modèle de données

### Contenu

```
voie (générale / technologique / professionnelle)
 └─ filiere (ST2S, STMG, Bac pro ASSP…)
     └─ niveau (2de, 1re, Tle)
         └─ cours (une matière à un niveau, ex. « BPH 1re ST2S »)
             └─ chapitre (sections de cours rédigées, schémas, encadrés « à retenir »)
                 └─ question (objectif : ~150 validées par chapitre)
```

- **notion** : rattachée à un chapitre (ex. « débit cardiaque »). Chaque question est liée à une notion, ce qui sert à calculer les points faibles.
- **question** : type (`qcm_unique`, `qcm_multiple`, `vrai_faux`, `reponse_courte`), énoncé, propositions, bonne(s) réponse(s), réponses acceptées et marge d'erreur (pour la réponse courte), explication, notion, difficulté (1 à 3), statut (`brouillon` → `a_relire` → `valide`), signalements.
- Pas de banque de questions propre à l'évaluation de cours : elle tire dans les banques des chapitres du cours.

### Comptes

- **profil** : rôle (`eleve`, `parent`, `enseignant`, `admin_contenu`), nom, e-mail, voie, filière, niveau, indicateur « a moins de 15 ans ».
- **lien_parent** : élève ↔ parent, date du consentement parental.
- **classe** : enseignant, nom, filière, niveau, cours suivis, code d'invitation de 6 caractères (régénérable).
- **inscription_classe** : élève ↔ classe.
- Les comptes enseignants sont validés manuellement par un administrateur dans la première version.

### Abonnement et accès

- **abonnement** : élève bénéficiaire, payeur (élève majeur ou parent), identifiants Stripe (client, abonnement), formule (mensuelle ou annuelle), statut, fin de la période en cours, fin du délai de grâce.
- **acces_gratuit** : élève, cours choisi, date du choix, changement déjà utilisé ou non.
- Pour savoir à quels cours un élève a accès, on applique dans l'ordre :
  1. abonnement actif ou en délai de grâce → tous les cours ;
  2. moins de 7 jours depuis l'inscription (essai) → tous les cours ;
  3. sinon → le seul cours gratuit choisi (l'élève doit le choisir à la fin de l'essai).

### Résultats

- **tentative** : élève, type (`quiz_chapitre` ou `evaluation_cours`), chapitre ou cours, questions tirées (identifiants et ordre des propositions), réponses, note, début, fin, date limite (serveur), statut (`en_cours`, `terminee`, `expiree`).
- **progression_chapitre** : élève, chapitre, meilleure note, validé (oui/non), date de validation, chapitre lu.
- **historique_question** : élève, question, nombre de fois vue, nombre de fois ratée, date de la dernière réponse (sert au tirage prioritaire et aux points faibles).
- **progression_cours** : élève, cours, meilleure note d'évaluation, validé, nombre d'essais utilisés, date du dernier essai.

### Calendrier et notifications

- **evenement** : propriétaire (élève) ou classe (enseignant), type (`revision`, `devoir`, `examen_reel`, `echeance_enseignant`), titre, début, fin, cours et chapitres liés, règle de répétition, délai du rappel, identifiant du plan de révision d'origine.
- **plan_revision** : élève, examen réel concerné, réglages (sessions par semaine, durée, jours préférés), statut (`propose`, `accepte`, `refuse`).
- **abonnement_push** : élève, point d'envoi Web Push, clés, appareil.
- **preferences_notification** : activation par type, heures de silence (par défaut 22 h – 7 h), nombre de jours avant relance d'inactivité.
- **notification_planifiee** : destinataire, type, contenu, date d'envoi prévue, statut (`en_attente`, `envoyee`, `echec`).
- **jeton_ical** : jeton secret et révocable pour le lien iCal privé.

### Sécurité (RLS)

- Un élève ne lit et n'écrit que ses propres tentatives, progressions, événements et préférences.
- Un enseignant ne lit que la progression et les notes des élèves inscrits dans ses classes. Il n'a jamais accès à leurs calendriers personnels ni à leurs abonnements.
- Un parent ne voit que l'abonnement et le consentement des élèves auxquels il est lié.
- Les élèves et les enseignants ne lisent que les questions au statut `valide`, **jamais les bonnes réponses ni les explications** : celles-ci ne sont renvoyées qu'après correction, par une fonction serveur.
  - Seule exception : un enseignant voit la bonne réponse (jamais l'explication) des questions les plus ratées par sa classe, via la fonction serveur `questions_ratees_classe`. Une question n'y figure qu'avec au moins 5 réponses de 3 élèves différents de la classe, sur des tentatives terminées.
- Seul un `admin_contenu` peut écrire du contenu.
- Un élève sans accès à un cours ne peut pas lire ses chapitres ni ses questions.

## 4. Parcours élève et règles

### Inscription

1. Création du compte (e-mail et mot de passe, ou Google), puis choix de la voie, de la filière et du niveau. Possibilité de rejoindre une classe avec un code.
2. Si l'élève a moins de 15 ans : saisie de l'e-mail d'un parent, qui reçoit un lien de consentement. L'accès est bloqué tant que le consentement n'est pas donné.
3. Essai de **7 jours avec accès à tous les cours**.
4. À la fin de l'essai : soit un abonnement (souscrit par un parent ou par l'élève majeur), soit le choix d'**un seul cours gratuit, sans limite de durée**. Ce choix est modifiable une seule fois, dans les 48 heures.

### Lecture d'un chapitre

- Sections et schémas, avec la mise en page du site BPH revue dans un style plus scolaire et ludique (couleur par matière, animations de réussite).
- Recherche dans tout le cours.
- Le chapitre est marqué « lu » à la fin de la lecture (c'est indicatif, rien n'est bloqué).

### Quiz de chapitre

- Longueur au choix : 15, 20 ou 30 questions.
- Tirage parmi les questions `valide` du chapitre : d'abord les jamais vues, puis les ratées, puis les autres. Les questions sont mélangées, ainsi que l'ordre des propositions.
- Pas de limite de temps. La correction détaillée (avec explications) s'affiche à la fin.
- Validé à **75 %** ou plus. Nombre d'essais illimité. On garde la meilleure note et tout l'historique.
- Si le chapitre a moins de 15 questions validées, le quiz n'est pas disponible et un message s'affiche.

### Évaluation du cours

- Se débloque quand **tous** les chapitres du cours sont validés.
- 40 questions, réparties à peu près à égalité entre les chapitres (le reste de la division est réparti au hasard).
- **60 minutes**, avec une date limite enregistrée côté serveur au démarrage. Les réponses sont sauvegardées au fil de l'eau. Si l'élève se reconnecte avant la date limite, il reprend où il en était. Après la date limite, la tentative est clôturée et corrigée avec les réponses déjà données.
- Validée à **75 %**. **3 essais maximum**, avec **24 heures** d'attente entre deux essais.
- L'enseignant peut fixer, pour sa classe, une date d'ouverture et une date limite.
- Toute la correction se fait côté serveur.
- La note s'affiche dans le tableau de bord comme « note d'examen ».

### Correction des réponses courtes

- Comparaison sans tenir compte des majuscules, des accents, des espaces en trop ni de la ponctuation finale.
- Plusieurs réponses acceptées possibles pour une même question.
- Réponses numériques : virgule ou point accepté comme séparateur décimal, marge d'erreur absolue ou relative fixée pour chaque question.

### QCM à plusieurs réponses

- Le point n'est accordé que si l'élève a coché exactement toutes les bonnes réponses (pas de point partiel dans la première version).

## 5. Tableaux de bord

### Élève (page d'accueil)

- Cours suivis, avec une barre de progression (chapitres validés sur le total).
- Notes d'examen : meilleure note, date, réussi ou non.
- Derniers quiz et leurs résultats.
- Prochains événements et échéances.
- Points faibles : les notions avec le plus fort taux d'erreur (au moins 3 réponses), avec un bouton « Réviser » qui lance un quiz ciblé sur ces notions.
- Série de jours consécutifs avec au moins un quiz terminé.

### Enseignant

- Pour chaque classe : la liste des élèves avec leur progression par cours, les notes des quiz et des évaluations.
- Les questions les plus ratées par la classe.
- Export CSV des notes.
- Gestion des dates d'ouverture et des dates limites des évaluations.

## 6. Gestion du contenu

- **Éditeur de chapitre** : sections en texte mis en forme, import de schémas (images ou SVG, stockés dans Supabase), encadrés « à retenir ».
- **Éditeur de questions** : tous les champs de la table `question`. On passe d'un statut à l'autre dans l'ordre `brouillon` → `a_relire` → `valide`.
- **Tableau de suivi** : pour chaque chapitre, le nombre de questions validées sur l'objectif de 150. Un signal apparaît en dessous de 30.
- **Import JSON en masse** (format documenté et validé avant l'import). C'est par là qu'arrive le contenu généré, au statut `a_relire`.
- **Signalement** : un enseignant peut signaler une question. Elle repasse au statut `a_relire` avec le commentaire de l'enseignant.

### Production du contenu de la 1re ST2S

1. Import des 7 chapitres BPH existants et de leurs questions (y compris la deuxième série).
2. Génération de questions supplémentaires pour atteindre environ 150 par chapitre BPH, au statut `a_relire`.
3. Génération des cours et des questions des autres matières de 1re ST2S à partir du programme officiel, au statut `a_relire`.
4. Relecture humaine obligatoire avant le passage au statut `valide`.

## 7. Calendrier, planning de révision et notifications

### Calendrier

- Vues jour, semaine et mois, pensées pour le mobile.
- Événements de l'élève : révision, devoir, examen réel. Répétition possible (quotidienne, hebdomadaire, certains jours de la semaine) jusqu'à une date de fin.
- Échéances fixées par l'enseignant, en lecture seule et d'une couleur distincte.
- Lien iCal privé en lecture seule, que l'élève peut révoquer.

### Planning de révision suggéré

Il est déclenché quand l'élève crée un `examen_reel` rattaché à un cours.

1. On détermine les chapitres concernés (ceux choisis par l'élève, sinon tous les chapitres du cours).
2. On les classe par priorité : non validés, puis note la plus basse, puis validés depuis le plus longtemps.
3. On les répartit sur les jours entre aujourd'hui et la veille de l'examen, selon les réglages de l'élève (sessions par semaine, durée, jours préférés), sans chevaucher les événements existants. S'il n'y a pas assez de créneaux, on regroupe plusieurs chapitres par session et on prévient l'élève.
4. La veille de l'examen : une session de révision générale (quiz de 30 questions sur tous les chapitres concernés).
5. L'élève voit un aperçu, puis accepte, modifie ou refuse. Une fois accepté, le planning crée les événements correspondants.
6. Si l'élève valide un chapitre prévu plus tard, on lui propose de réorganiser le planning.

### Notifications

- L'autorisation est demandée au bon moment (première création d'un événement), jamais dès l'inscription. Sur iPhone, un guide explique comment ajouter l'application à l'écran d'accueil (iOS 16.4 ou plus récent).
- Types : rappel avant un événement (délai réglable : 10 minutes, 1 heure, la veille), échéance d'évaluation qui approche, nouvel essai d'évaluation disponible, session de révision du jour, relance après X jours d'inactivité.
- Chaque type peut être désactivé. Pendant les heures de silence, une notification est **décalée** à la fin de la plage, pas supprimée.
- Une tâche planifiée tourne chaque minute et envoie les `notification_planifiee` arrivées à échéance. Les points d'envoi que le service push déclare expirés sont supprimés.
- Si l'appareil n'a pas autorisé les notifications : liste de rappels dans l'application.

## 8. Abonnements

- Formules mensuelle et annuelle (l'annuelle équivaut à 2 mois offerts). Les prix sont configurés dans Stripe, pas dans le code.
- Paiement sur la page hébergée par Stripe. Résiliation, changement de carte et factures depuis le portail client de Stripe.
- Les changements d'abonnement arrivent par webhook (signature vérifiée, traitement idempotent) et mettent à jour la table `abonnement`.
- Échec de paiement : **7 jours de délai de grâce** avec un message d'alerte, puis retour à la version gratuite (un seul cours). Les résultats sont toujours conservés.
- Enseignants : accès gratuit.

## 9. RGPD et mineurs

- Données hébergées en Europe. On ne collecte que le minimum (pas de date de naissance exacte, seulement l'indicateur « a moins de 15 ans »).
- Consentement parental obligatoire et enregistré avec sa date pour les moins de 15 ans.
- Page « Mes données » : export JSON et suppression du compte (définitive après 30 jours ; les factures Stripe sont conservées selon les obligations légales).
- Aucun traceur publicitaire. Seuls les cookies nécessaires au fonctionnement sont utilisés.
- Mentions légales, politique de confidentialité et conditions générales de vente : une trame est fournie, **une relecture par un juriste est conseillée** avant la mise en vente.

## 10. Gestion des erreurs

- Hors connexion : les chapitres déjà ouverts restent lisibles (mis en cache par la PWA). Les quiz et évaluations demandent une connexion et un message l'indique.
- Les réponses d'une évaluation sont sauvegardées une par une. Si la sauvegarde échoue, l'application réessaie automatiquement et affiche un indicateur à l'élève.
- Les messages d'erreur sont en français et compréhensibles. Les erreurs côté serveur sont enregistrées dans un journal.
- Les webhooks Stripe et l'envoi des notifications réessaient en cas d'échec temporaire.

## 11. Tests

- **Tests unitaires (Vitest)** : tirage prioritaire, correction de chaque type de question (dont les tolérances des réponses courtes), seuil de 75 %, déblocage de l'évaluation, essais et délai de 24 heures, calcul des droits d'accès (abonnement, essai, cours gratuit, délai de grâce), génération du planning, décalage pendant les heures de silence.
- **Tests RLS** : un élève ne peut pas lire les données d'un autre élève ; un enseignant ne voit que ses classes ; les bonnes réponses ne sont pas lisibles par les élèves ; un cours sans accès est bloqué.
- **Tests de bout en bout (Playwright)** : inscription avec consentement parental, quiz de chapitre, évaluation avec reprise après coupure, souscription en mode test de Stripe, création d'un examen réel et acceptation du planning.

## 12. Étapes de construction

Chaque étape donne une version utilisable.

1. **Socle** : projet Next.js et Supabase, comptes et profils, modèle de contenu, import du cours BPH, lecture des chapitres.
2. **Quiz et évaluations** : moteur de quiz côté serveur, progression, évaluation de cours, tableau de bord élève.
3. **Espace enseignant et gestion du contenu** : classes, suivi, éditeurs, statuts, import JSON, signalements.
4. **Calendrier, planning et notifications** : PWA installable, calendrier, planning de révision, Web Push.
5. **Abonnements et RGPD** : Stripe, essai, cours gratuit, consentement parental, page « Mes données », pages légales.
6. **Contenu** : banques BPH complétées à environ 150 questions par chapitre, puis les autres matières de 1re ST2S.
7. **Plus tard** : Capacitor et stores, schémas à légender et associations, licences établissement, autres filières.

## 13. Questions encore ouvertes

- Nom définitif de l'application et nom de domaine (vérification INPI à faire).
- Prix des abonnements (configurés dans Stripe au moment de la mise en vente).
