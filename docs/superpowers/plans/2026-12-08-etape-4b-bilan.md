# Étape 4b : bilan et points reportés

État final sur la branche `etape-4b-notifications` :
- 345 tests unitaires (Vitest, 37 fichiers) ;
- 727 tests de la base (pgTAP, 23 fichiers) ;
- 30 exécutions de bout en bout (Playwright : 15 parcours, sur mobile et sur ordinateur, avec un build de production), dont le nouveau parcours des notifications ;
- typage, lint et build sans erreur.

## Ce qui a été livré

- **Trois tables et leurs RPC** : `abonnement_push` (appareils, 10 au plus par élève, clés illisibles par l'élève), `preferences_notification` (types reçus, heures de silence, jours d'inactivité) et `notification_planifiee` (file d'envoi et liste de rappels). Les écritures passent par des RPC `security definer` ; `anon` n'a aucun droit sur les tables.
- **Planification en base** : cinq types de notifications (rappel d'un événement, échéance proche, nouvel essai, révision du jour, inactivité), planifiés par une tâche `pg_cron` chaque minute, sans doublon (clé unique), avec heures de Paris et changements d'heure.
- **Rappel d'un événement** : champ « Rappel » dans le formulaire de l'événement (aucun, 10 minutes, 1 heure, la veille), réglé par `regler_rappel_evenement`.
- **Route d'envoi** `POST /api/notifications/envoyer` : protégée par un secret (empreinte en base), réservation des lignes par `envoi_reserver` (`skip locked`), envoi Web Push par lots de 10, réessais à 1, 2, 4 puis 8 minutes, suppression des points d'envoi expirés, heures de silence appliquées au moment de l'envoi.
- **Après la contre-revue finale** : chaque ouverture de « Notifications » sur un appareil abonné réécrit son abonnement (la date « ajouté le » devient celle de la dernière visite ; ne réenregistrer que si le propriétaire change) ; un élève dont la session expire sur son propre appareil perd son abonnement en arrivant sur la page de connexion (prix de la protection sur appareil partagé, il doit le réactiver).
- **Service worker** : affichage de la notification et clic vers un lien interne seulement (même origine), sans régression du hors connexion.
- **Interface** :
  - page `/notifications` (réglages, activation de cet appareil, liste des appareils, guide d'installation sur iPhone) ;
  - page `/rappels` (liste, marquage « lu » à l'affichage) et compteur de rappels non lus dans l'en-tête ;
  - carte « Active les rappels » dans le calendrier ;
  - la déconnexion désabonne l'appareil.
- **Outils** : `npm run cles:notifications` (clés VAPID, secret et adresse d'envoi ajoutés à `.env.local` sans les afficher) et `npm run configurer:envoi` (tâche planifiée locale ou de production).

## Écarts au plan et décisions prises pendant l'exécution

Rulings du contrôleur (journal d'exécution) :

- C1 test notifications 14 réécrit sur une ligne revision_du_jour — le test 8 désactive inactivite et supprimait la ligne testée — coût nul.
- C3 la planification passe dans une tâche pg_cron sous postgres ; envoi_reserver ne fait que réserver — statement_timeout de anon = 3 s — coût : une tâche planifiée de plus.
- C4 délai inclus dans la clé d'un rappel — sinon un rappel envoyé masque le suivant après changement de délai (reproduit) — coût nul.
- C5 textes de rappel et d'échéance en date et heure absolues (« Le 12/01 à 10 h 05 ») — un envoi décalé par le silence rendait « Dans 10 minutes » faux — coût : texte moins naturel.
- C6/C7 nouvel_essai pas après la date limite ; inactivité limitée aux comptes finalisés et à 3 relances — éviter des notifications fausses ou sans fin — coût faible.
- C9/C10 envoi par lots de 10 en parallèle, délai de 10 s par envoi, maxDuration 60 — éviter les doublons après la réservation de 2 min — coût faible.
- C12/C13 Uint8Array<ArrayBuffer> ; requestPermission avant tout await, serviceWorker.ready, issue 'ignore' — tsc et Safari — coût faible.
- C18 la déconnexion désabonne l'appareil (au plus 2 s) — appareil partagé — coût : déconnexion un peu plus lente.
- C2/C14 URL avec \ ou caractère de contrôle refusée (SQL et service worker) — durcissement — coût nul.
- C16/C17/C19-C25 corrections de cohérence, d'accessibilité et de texte listées dans corrections.md — coût nul.
- Task 1 — liste blanche des hôtes de push dans enregistrer_abonnement_push (fcm.googleapis.com, *.push.services.mozilla.com, updates.push.services.mozilla.com, *.push.apple.com, *.notify.windows.com) et revérifiée dans l'envoyeur (tâche 4) — un point d'envoi arbitraire ferait poster le serveur n'importe où (SSRF) — coût : un service push inconnu serait refusé (abonnement_invalide).
- Task 1 — on ajoute les tests manquants (déclencheur, plafond de 10, retrait par id/endpoint par un autre élève, type désactivé, privilèges de colonne) et p doit être un objet aux booléens typés — couverture des promesses du plan — coût faible.
- Task 2 — tâche de purge quotidienne de cron.job_run_details (> 7 jours) ; on corrige aussi les mineurs 1 (tests C6/C7), 2 (validation stricte de envoi_terminer) et 5 (pas de nouvel_essai pendant une tentative en cours) — peu coûteux et évite doublons et régressions — coût faible.
- Task 4 — échéance de 40 s dans traiterLot (plus de nouveau lot après), envoi_terminer avec les seules lignes traitées ; VAPID absent → 503 journalisé ; https obligatoire pour ENVOI_URL en production ; commentaire « au moins une fois » — évite des envois en double à des mineurs — coût : un lot non traité attend la minute suivante.
- Task 5 — lienInterne analyse l'URL avec new URL(url, origin) et exige la même origine ; on corrige aussi subscribe qui peut lever (→ 'indisponible') et le clic qui réutilise une fenêtre ouverte de l'application — défense en profondeur et confort — coût faible.
- Task 6 — on corrige l'Important et 5 mineurs peu coûteux (garde de double déconnexion + repli sans requestSubmit, oublierAppareilCourant silencieux pour un non-élève, confirmation d'activation conservée dans l'invitation, CSS limité au formulaire de préférences, erreur de lecture des préférences affichée au lieu des valeurs par défaut) — accessibilité et sûreté des réglages — coût faible.

Autres écarts, à la tâche 7 :
- `supabase/tests/envoi.test.sql` supprime d'abord la ligne de `prive.cle_envoi` : une base locale configurée par `db:reset` (avec `ENVOI_SECRET` dans `.env.local`) en contient déjà une, et le test échouait sur la clé primaire.
- Le parcours de bout en bout insère sa propre notification due et lit son statut par sa clé, car la planification réelle peut ajouter d'autres lignes pour le même élève. Le marqueur « Nouveau » n'est pas vérifié (la page marque les rappels lus à l'affichage) ; le compteur de l'en-tête l'est.
- Le parcours n'envoie aucune notification réelle : sans appareil, le rappel reste dans la liste de rappels. L'envoi vers un service push est couvert par les tests unitaires.
- `.champs-preferences` reçoit `display: grid; gap: 16px;` (le conteneur remonté par `key` avait perdu l'espacement du formulaire).

## Limites connues et acceptées

- **Pas de gestion de `pushsubscriptionchange`** : si le navigateur renouvelle l'abonnement, l'élève doit réactiver les notifications.
- **`VERSION = 'v2'` du service worker** : la mise à jour vide les chapitres en cache `pages-v1` ; ils sont remis en cache à la prochaine lecture.
- **Compteur de l'en-tête** rafraîchi par `router.refresh()` : il peut rester périmé jusqu'à la navigation suivante.
- **Secret d'envoi visible dans les tables internes de `pg_cron` et dans la file `net.http_request_queue` de `pg_net`** (en-tête `Authorization`, pendant le traitement). En base locale, `net.http_request_queue` est lisible par `anon` et `authenticated` au niveau SQL ; elle n'est pas exposée par PostgREST ni GraphQL (seuls `public` et `graphql_public` le sont). Ne jamais exposer le schéma `net`. Si le secret fuit, avec `envoi_reserver` on peut lire les points d'envoi, les clés `p256dh` et `auth`, les titres, les corps et les liens des notifications dues ; avec `envoi_terminer`, marquer comme envoyée ou en échec, ou décaler, toute ligne en attente dont on connaît l'identifiant, et supprimer des abonnements par point d'envoi. On ne peut pas envoyer soi-même une notification sans la clé VAPID privée, ni accéder aux comptes. À régénérer (`cles:notifications` puis `configurer:envoi`) en cas de fuite.
- **Livraison « au moins une fois »** : si la route échoue entre l'envoi et `envoi_terminer`, la ligne est renvoyée après la réservation de 2 minutes ; un doublon est possible, une perte non.
- **Service worker sans test unitaire** : vérifié par des sondes `node` et par le parcours hors connexion.
- **Notifications seulement avec le build de production**, car le service worker n'est enregistré qu'en production.

## À trancher par toi

- **Fuseau des élèves des DROM** : toujours non géré (heures de Paris).
- **Service push inconnu** : la liste blanche d'hôtes (FCM, Mozilla, Apple, Windows) refuse un autre fournisseur (`abonnement_invalide`). À étendre si un navigateur en utilise un autre.

## Revue finale

Revue finale de la branche par Opus : verdict « fusion possible avec corrections », aucun problème critique.

Points forts :
- droits et RLS vérifiés en direct sur la base locale ;
- planification correcte, y compris aux changements d'heure ;
- envoi avec réservation, réessais, échéance et liste blanche d'hôtes ;
- liens du service worker limités à l'origine du site ;
- accessibilité des nouvelles pages.

Corrections appliquées après la revue :
- appareil partagé : `ViderCachePages` désabonne le navigateur sur les pages de connexion et d'inscription ; `ActivationPush` rattache l'abonnement du navigateur à l'élève connecté (ou affiche « inactif » si l'enregistrement échoue) ; la déconnexion lit le point d'envoi puis l'oublie côté serveur en parallèle du désabonnement, dans la limite de 2 s ;
- sans appareil, un rappel est envoyé tout de suite dans la liste, même pendant les heures de silence (test ajouté) ;
- seule la route `/api/notifications/envoyer` est publique (test ajouté) ;
- retirer un appareil rafraîchit aussi `/calendrier`.

Comptes après correction : 345 tests unitaires (37 fichiers), 727 tests pgTAP (23 fichiers), 30 exécutions Playwright, typage, lint et build sans erreur.

## Points reportés, par étape

**Étape 4c (en-têtes de sécurité, déploiement, accessibilité, dette)**

Points de l'étape 4b :
- **Base, planification** : reprise d'un endpoint par un autre élève (appareil partagé, inexploitable sans l'endpoint) ; `marquer_rappels_lus` marque aussi des lignes `en_attente` échues ; départage aléatoire du plafond de 10 appareils dans une même transaction ; schéma `net` lisible par `anon` (défaut Supabase, non exposé par PostgREST) ; `echeance_proche` ignore l'ouverture de l'évaluation.
- **Envoi** : longueur du secret révélée par le temps de comparaison (négligeable) ; `HTTPS` en majuscules toléré côté TypeScript ; `.env.local` créé en 0644 et clé vide dupliquée par `cles:notifications` ; tests manquants (ordre par lots, appareils mixtes, fin de silence inexistante ou ambiguë au changement d'heure).
- **Envoi, à reprendre** : lignes renvoyées toutes les 2 minutes sans limite si `envoi_terminer` échoue en continu (`essais` n'est pas incrémenté à la réservation) ; lignes en attente non revalidées au moment de l'envoi (`echeance_proche` après changement ou validation de l'échéance ou départ de la classe, `nouvel_essai` après validation, `inactivite` après une activité, rappel décalé au-delà de son événement) ; `regler_rappel_evenement` peut supprimer une ligne réservée (doublon possible) ; le délai de `web-push` est un délai d'inactivité de la connexion, pas une durée totale ; la trace Playwright au réessai pourrait enregistrer le secret Bearer local.
- **Service worker** : libellé d'appareil approximatif pour Chrome et Firefox sur iOS ; badge Android en couleur ; pas de test unitaire.
- **Interface, à reprendre** : contraste en mode sombre de la pastille du compteur ; deux appareils de même libellé donnent des boutons « Retirer » identiques.
- **Interface** : invitation qui apparaît après coup (décalage) ; « Nouveau » qui disparaît vite, et lignes arrivées entre-temps marquées lues ; condition « inactif » de l'invitation qui inclut l'autorisation déjà accordée ; retirer l'appareil courant laisse l'abonnement du navigateur ; hôte non vérifié tôt dans `enregistrerAbonnement` ; échec du réglage de rappel seulement journalisé ; bouton de déconnexion resté désactivé si la déconnexion serveur échoue ; repli `form.submit()` hors action React.

Points de l'étape 4a toujours ouverts :
- **Base, étape 1 du calendrier** : verrou `for update` sur le profil avant le comptage des 500 événements (concurrence) ; titre composé de `\n` ou `\t` accepté ; changement de type refusé avec `evenement_introuvable`, trompeur ; `mon_calendrier` montre des chapitres et cours dépubliés après coup ; tests manquants (chemin de mise à jour, limites de 366 jours, durée, fenêtre, plus de 30 chapitres, `reserve_eleves`, cascade de l'examen, changement d'heure d'automne).
- **Planning, base** : tolérance d'une heure dans le passé ; `refuser_plan_revision` sans contrôle du cours ni d'examen passé ; tests manquants (sessions passées gardées, examen passé, plafond de 500, refus sans plan, refus d'une deuxième session générale).
- **Générateur** : révision générale hors plafond hebdomadaire ; `d <= apres` au lieu de `d < apres` ; décalage aussi pour la règle des 30 minutes ; tests manquants (22 h, semaine, veille non préférée) ; `examenDebut` invalide lève une `RangeError`.
- **Révision générale** : pas de test au-delà de 30 questions (plafond, alternance, priorité) ; départage non aléatoire (ajouter `random()`) ; pas de filtre `ch.cours_id = e.cours_id`.
- **iCal** : jeton non revalidé localement avant la RPC ; `Cache-Control: max-age=300` suit le plan ; jeton conservé si le rôle change.
- **Actions serveur** : messages zod en anglais sur des entrées falsifiées (jours, uuid) ; `ignorerReorganisation` ignore les erreurs ; `NEXT_PUBLIC_SITE_URL` figé au build ; `exigerEleve` répond 404 à un visiteur déconnecté.
- **Interface** : colonne horaire large sur l'accueil (`avecJour`) ; `overflow-wrap` manquant sur les titres longs ; hachures des échéances un peu chargées ; `catch {}` muet dans `ProchainsEvenements` ; refus du planning qui envoie les réglages initiaux ; `BanniereReorganiser` sans état `pending` ; pas de test unitaire de `tropLoin`.
- **Hors connexion** : double rendu serveur d'un chapitre chargé en page complète ; course entre la déconnexion et une écriture différée.
- Aussi 4a, non traités : les échéances d'une classe quittée depuis moins de 30 jours ne s'affichent pas dans le calendrier ni dans l'iCal ; modifier un examen ne met pas à jour son plan, et un examen peut être récurrent ; le plan accepté peut différer de l'aperçu sans que l'élève en soit prévenu ; des réglages qui ne peuvent jamais donner de créneau demandent un avertissement plus clair.

Points « étape 4 » des bilans précédents, toujours ouverts :
- **Bilan 1** : région Vercel en UE (`cdg1` ou `fra1`), CSP et `frame-ancestors` ; Google et `NEXT_PUBLIC_SITE_URL` en production ; sur le projet hébergé, modèle d'e-mail « Confirm signup », URL de redirection et mot de passe d'au moins 8 caractères ; recopier les en-têtes de cache de `setAll` ; `aria-invalid` et `aria-describedby` sur les formulaires restants ; `:focus-visible` sans `border-radius` global ; variables d'environnement vérifiées au démarrage ; polices à vérifier dans le matcher du proxy.
- **Bilan 2** : annoncer « Question n / N » aux lecteurs d'écran ; contraste en mode sombre de la pastille de matière et de la piste de la barre ; légende flottante à tester sur Safari iOS ; reprendre sur la dernière question quand toutes les réponses sont données ; marqueur « lu » trop rapide sur les chapitres courts ; version Postgres du projet hébergé (MAINTAIN demande Postgres 17).
- **Bilan 3a** : décisions identiques de suite non réannoncées sur `/admin/enseignants` ; zod `min(2)` en UTF-16 contre points de code en base ; frein global par IP sur les codes d'invitation.
- **Bilan 3b** : contraste en mode sombre pour des couleurs de cours très foncées ; aperçu de chapitre qui peut réutiliser des identifiants de l'éditeur ; test de contenu qui attend une seconde fixe, et `throw` dans un `finally` ; cache du rendu nettoyé des chapitres ; en-têtes de sécurité.
- **Étape 4a** : `VERSION` du service worker non liée au build (page `/hors-ligne` figée entre deux déploiements) ; vie privée du cache hors connexion sur appareil partagé.

**Étape 5 (abonnement, RGPD)** : les points des bilans précédents restent ouverts.

**Étape 6 (contenu)** : banques de questions et rééquilibrage des QCM BPH, comme dans le bilan 3b.
