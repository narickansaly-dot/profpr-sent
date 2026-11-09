# Étape 5a : bilan et points reportés

État final sur la branche `etape-5a-rgpd` :
- 405 tests unitaires (Vitest, 44 fichiers) ;
- 869 tests de la base (pgTAP, 29 fichiers) ;
- 60 exécutions de bout en bout (Playwright : 30 parcours, sur mobile et sur ordinateur, avec un build de production) : 54 réussies et 6 ignorées (la revue axe ne tourne que sur mobile), dont 9 nouveaux parcours ;
- typage, lint et build sans erreur.

## Ce qui a été livré

- **Accès aux cours** : essai de 7 jours après l'inscription, puis un seul cours gratuit au choix (changement possible une fois, dans les 48 heures ; choix libre si le cours choisi n'est plus publié). Une seule source en base : `prive.fin_essai`, `prive.acces_cours(eleve, cours, reprise)`, `public.peut_lire_cours`, `public.mon_acces`. La reprise de 24 heures d'une tentative ne vaut que pour une tentative commencée pendant l'essai ; les RPC de démarrage (quiz, évaluation, révision générale) exigent l'accès sans reprise. Les pages cours, chapitre et évaluation décident par `peut_lire_cours`.
- **Interface** : bannière d'essai (jours restants), invitation à choisir, page `/choisir-cours`, cartes « Verrouillé », page « Ce cours n'est pas ouvert pour toi ».
- **Consentement parental** : l'élève qui coche « J'ai moins de 15 ans » est redirigé vers `/consentement` (hors du groupe `(app)`) jusqu'à l'accord. Le jeton n'est jamais vu de l'élève : `demander_consentement` n'en renvoie aucun, `emettre_jeton_consentement` (anon, protégée par le secret d'envoi) le remet à l'action serveur qui l'envoie par e-mail ; seule son empreinte est stockée, il vaut 7 jours. Page publique `/accord-parental/<jeton>` (pas d'indexation, pas de Referer, pas de cache). L'âge est figé en base (`age_verrouille`). Pour un moins de 15 ans, l'essai démarre à l'accord (`greatest(inscrit_le, donne_le)`).
- **E-mails** : `src/lib/email` (nodemailer, SMTP avec TLS exigé hors local, lien lié à l'origine du site, échappement), Mailpit en local (`[local_smtp]`, port 54325).
- **Mes données** : export JSON (`exporter_mes_donnees`, uniquement les données de l'appelant, sans clés ni jeton iCal) et suppression du compte après 30 jours avec bannière d'annulation ; purge quotidienne (`purges-quotidiennes`).
- **Classes** : un retrait par l'enseignant bloque le retour 24 heures (`retour_bloque`) ; retraits et départs purgés après 30 jours.
- **Pages légales** : mentions légales, confidentialité, conditions d'utilisation (trames avec avertissement « à faire relire par un juriste ») et pied de page.
- **Parcours de bout en bout** : `acces.spec.ts`, `consentement.spec.ts`, `mes-donnees.spec.ts` ; revue axe et CSP étendues (`/choisir-cours`, cours fermé, `/consentement`, `/accord-parental/<jeton>` valide et invalide, `/mes-donnees`, les trois pages légales). Aides : `vieillirInscription`, `vieillirDemandeSuppression`, `creerCoursPublie` (cours `e2e-…` nettoyé par `nettoyage.ts`), `inscrireEleveMineur`, `aide-mailpit.ts` (API de Mailpit : `/api/v1/search?query=to:…` puis `/api/v1/message/<id>`).

## Écarts au plan et décisions prises pendant l'exécution

- Le jeton du consentement n'est jamais renvoyé à l'élève (correction F1) : RPC supplémentaire `emettre_jeton_consentement`, appelée avec un client anonyme sans session et `ENVOI_SECRET`, sans clé de service.
- Verrou d'âge indépendant de `onboarding_termine` (F2) ; fin d'essai décalée à l'accord parental (F11).
- Reprise de 24 h limitée aux tentatives commencées pendant l'essai (F3).
- Le lien d'accord se construit uniquement depuis `NEXT_PUBLIC_SITE_URL`. Le build de production l'exige : `playwright.config.ts` la fixe à `http://localhost:3000` pour les tests (sans elle, l'envoi échoue avec « origine du site absente »).
- Export refusé (réponse 409 en texte) pendant une évaluation ouverte, pour ne pas révéler les corrections.
- Retrait du consentement parental : demande écrite, suppression manuelle du compte par l'éditeur ; si cette procédure ne convient pas, prévoir une RPC en 5b.
- Tests existants adaptés à l'étape : `parcours-lecture.spec.ts` attendait « Essai gratuit : encore 7 jours » avec une espace ordinaire ; la bannière emploie désormais une espace insécable avant les deux-points (`\s`). Aucun code applicatif modifié.

## Limites connues et acceptées

- Un élève peut saisir sa propre adresse comme adresse du parent : il n'y a pas de compte parent avant l'étape 5b.
- Retrait du consentement parental : demande écrite à l'éditeur, qui supprime le compte à la main.
- Le choix limité à la filière se contourne en changeant de filière avant de choisir (cela n'ouvre pas plus d'un cours). Les pages mises en cache hors connexion restent lisibles après verrouillage (F21).
- Un envoi d'e-mail échoué compte dans les limites (10 minutes entre deux envois, 5 par jour) : l'élève attend 10 minutes avant de réessayer (F22).
- Pendant une reprise de 24 h d'un quiz de chapitre, la page évaluation peut s'afficher « disponible » ; le démarrage est refusé avec un message clair.
- L'export est refusé (409, texte) pendant une évaluation ouverte.
- `correction_tentative` reste libre : elle ne sert qu'à relire l'historique de ses tentatives terminées.
- Les pages légales contiennent 13 champs distincts « À compléter » (16 occurrences) : nom ou raison sociale (éditeur, et dans la politique), adresse de l'éditeur, numéro SIREN, adresse e-mail de contact, adresse e-mail pour les données personnelles, nom, adresse de Vercel, région d'hébergement de la base (Paris ou Francfort), fournisseur d'envoi des e-mails, durée de conservation des journaux, juridiction compétente, date de dernière mise à jour. Tous sont à renseigner, puis les pages à faire relire par un juriste avant la mise en vente.
- Local : la licence Xcode n'est pas acceptée sur la machine de développement ; les commandes git passent par `DEVELOPER_DIR=/Library/Developer/CommandLineTools`.
- Tâche planifiée `envoi-notifications` : vérifier qu'aucun jeton n'est écrit en clair dans `cron.job` (constat hors de cette étape).
- Le test e2e du consentement lève la contrainte `required` du navigateur pour atteindre le contrôle du serveur (case non cochée).

## Revue finale

À compléter par le contrôleur (revue Opus de toute la branche : règles d'accès, jeton du consentement, e-mails, export, purge, pages légales, accessibilité et CSP des nouvelles pages), puis vague de corrections et mise à jour de ce bilan.
