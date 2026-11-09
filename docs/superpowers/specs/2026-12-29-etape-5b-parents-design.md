# Étape 5b : comptes parents, CGV et fondations des abonnements

Ce document décrit l'étape 5b **sans le paiement**. Il complète la spec générale `2026-11-03-app-lycee-design.md`, et ses règles prévalent en cas de conflit. Le branchement de Stripe (page de paiement, webhooks, portail client) fera l'objet d'une étape à part, quand un compte Stripe gratuit existera.

## 1. Objectifs

- Un parent a un vrai compte (rôle `parent`) et suit un ou plusieurs enfants.
- Il voit l'état du consentement, l'abonnement (« Aucun abonnement » pour l'instant) et un résumé de la progression de chaque enfant.
- Un parent peut retirer son consentement (enfant de moins de 15 ans) : le compte de l'enfant est bloqué puis supprimé 30 jours plus tard. Cette fonction remplace la procédure manuelle, notée comme limite dans le bilan 5a.
- La table `abonnement` existe, et la règle d'accès aux cours la prend en compte. Elle est testée avec des abonnements simulés.
- Une trame de conditions générales de vente est publiée, et la politique de confidentialité couvre les comptes parents.

Hors périmètre : Stripe, les prix, l'encaissement, les factures, et les e-mails envoyés aux parents en dehors de la demande d'accord existante.

## 2. Décisions prises avec l'utilisateur

| Sujet | Décision |
|---|---|
| Ce que voit le parent | Consentement, abonnement et résumé de progression. Jamais le calendrier, le détail des réponses ni les classes. |
| Liaison | Enfant de moins de 15 ans : après l'accord, le parent crée son compte avec l'adresse qui a reçu la demande, et le lien se fait automatiquement. Enfant de 15 ans ou plus : par un code à usage unique généré par l'élève. |
| Retrait du consentement | Blocage immédiat, puis suppression définitive à J+30. Le parent peut annuler pendant ce délai. |
| Fondations des abonnements | Oui, sans Stripe. |
| Déliaison par l'élève | Possible à partir de 15 ans. |

## 3. Modèle de données

### `lien_parent`

| Colonne | Type | Règle |
|---|---|---|
| `eleve_id` | uuid → `profil`, cascade | profil au rôle `eleve` |
| `parent_id` | uuid → `profil`, cascade | profil au rôle `parent` |
| `origine` | `'accord'` ou `'code'` | |
| `cree_le` | timestamptz | `now()` |

- Clé primaire : `(eleve_id, parent_id)`.
- **2 parents au plus par élève**. Le contrôle se fait dans les fonctions de liaison, sous verrou de la ligne `profil` de l'élève.
- RLS activée, sans aucun droit direct pour `anon` ni `authenticated` : toutes les lectures et écritures passent par des fonctions `security definer`.

### `prive.code_parent`

Ce code relie un parent à un élève de 15 ans ou plus.

| Colonne | Règle |
|---|---|
| `eleve_id` | clé primaire, donc un seul code actif par élève |
| `empreinte` | bytea unique, SHA-256 du code |
| `expire_le` | `now() + 48 h` |

- Le code fait 8 caractères dans un alphabet sans caractères ambigus (pas de `0/O/1/I/L`).
- Il est affiché une seule fois à l'élève. En générer un nouveau remplace l'ancien.

### `prive.essai_code_parent`

Compteur des essais de code échoués : `parent_id`, `heure` (début de l'heure, `date_trunc('hour', now())`) et `nombre`. Clé primaire `(parent_id, heure)`.

### `abonnement`

| Colonne | Règle |
|---|---|
| `id` | uuid, clé primaire |
| `eleve_id` | uuid → `profil`, cascade, unique : un abonnement courant par élève |
| `payeur_id` | uuid → `profil`, `set null` à la suppression |
| `formule` | `'mensuelle'` ou `'annuelle'` |
| `statut` | `'actif'`, `'impaye'`, `'resilie'` ou `'expire'` |
| `fin_periode` | timestamptz |
| `fin_grace` | timestamptz, nullable |
| `stripe_client_id`, `stripe_abonnement_id` | text, nullables, uniques |
| `cree_le`, `maj_le` | timestamptz |

- RLS : l'élève lit son propre abonnement. Le parent le lit uniquement par la fonction `enfants_du_parent`.
- Seul `service_role` peut écrire. Aucune RPC d'écriture n'est ouverte aux clients.
- Fonction `prive.abonnement_actif(p_eleve)` : vraie si `statut = 'actif'` et `fin_periode > now()`, ou si `statut = 'impaye'` et `fin_grace > now()`.

### Modifications de tables existantes

- `consentement_parental` reçoit la colonne `retire_le timestamptz` (nullable) et `retire_par uuid`.
- `profil.suppression_demandee_le` reste la date de référence de la purge. Une nouvelle colonne `suppression_imposee boolean not null default false` vaut `true` quand la suppression vient d'un retrait de consentement.

## 4. Règle d'accès aux cours

`prive.acces_cours(p_eleve, p_cours, p_reprise)` applique les règles dans cet ordre :

1. Consentement requis, ou consentement retiré : aucun accès, comme aujourd'hui.
2. `prive.abonnement_actif(p_eleve)` : tous les cours.
3. Essai en cours : tous les cours.
4. Sinon : seulement le cours gratuit choisi.

L'exception de reprise d'une tentative (`p_reprise`) reste celle de l'étape 5a.

`mon_acces()` renvoie en plus `abonnement` : `null` ou `{ formule, statut, fin_periode, fin_grace }`.

La bannière d'essai et l'écran « Cours verrouillé » ne s'affichent pas pour un élève abonné. Pendant le délai de grâce, la bannière affiche « Le paiement de ton abonnement a échoué. Tu gardes l'accès à tous les cours jusqu'au <date>. »

## 5. Comptes parents

### Choix du rôle

- Sur `/bienvenue`, un premier choix « Je suis élève » ou « Je suis parent » s'affiche.
- La RPC `devenir_parent()` est acceptée seulement si le profil est au rôle `eleve`, que `onboarding_termine = false`, et qu'il n'existe aucune ligne liée : tentative, classe, consentement, accès gratuit.
- Elle passe le rôle à `parent` et `onboarding_termine` à `true`.
- Un parent n'a ni voie, ni niveau, ni essai, ni accès aux cours. Le groupe `(app)` le redirige vers `/parent`.

### Liaison par l'adresse de l'accord (enfant de moins de 15 ans)

Le parent a prouvé qu'il contrôle l'adresse en ouvrant le lien d'accord. La confirmation d'e-mail de Supabase le prouve une seconde fois à l'inscription. La liaison se fait donc par cette adresse, sans jeton supplémentaire.

1. Après l'accord, la page de confirmation propose « Créer mon compte parent ». Elle précise qu'il faut utiliser l'adresse qui a reçu la demande.
2. À chaque affichage de `/parent`, l'espace appelle `lier_par_email()`. La fonction relie, avec l'origine `accord`, chaque élève dont :
   - le consentement a été donné et n'est pas retiré ;
   - `email_parent` est égale, sans tenir compte de la casse, à l'adresse du compte parent ;
   - l'adresse du compte parent est confirmée (`auth.users.email_confirmed_at` non nul).
3. Un élève déjà relié ou déjà à 2 parents est ignoré sans erreur. La fonction renvoie le nombre de nouveaux liens.
4. Le lien d'accord, le bouton et l'e-mail ne contiennent rien de plus qu'à l'étape 5a.

### Liaison par code (enfant de 15 ans ou plus)

- **Côté élève**, dans « Mes données », section « Parents reliés » : `generer_code_parent()` renvoie le code en clair, une seule fois. Elle est réservée aux élèves qui n'ont pas l'indicateur « moins de 15 ans ».
- **Côté parent** : `lier_par_code(code)`.
  - Codes d'erreur possibles : `code_parent_invalide` (code inconnu ou expiré) et `trop_de_parents`.
  - Au plus **5 essais échoués par parent et par heure**. Au-delà : `essais_code_epuises`.
  - Le code est supprimé dès qu'il a servi.

### Lectures du parent

- `enfants_du_parent()` renvoie, pour chaque enfant relié :
  - le prénom ou le nom affiché, et le niveau ;
  - le consentement : `requis`, `donne_le`, `retire_le`, la date de suppression prévue ;
  - l'abonnement, ou `null`.
- `progression_enfant(p_eleve)` vérifie le lien. Sinon : `acces_refuse`. Elle renvoie :
  - par cours : le titre, le nombre de chapitres validés sur le total, la meilleure note d'évaluation, et si le cours est validé ;
  - la date de la dernière activité, c'est-à-dire la fin de la dernière tentative terminée.
- Un parent ne reçoit jamais : les tentatives, les réponses, `historique_question`, les événements, les classes, les abonnements push.

### Retrait du consentement et déliaison

- **`retirer_consentement(p_eleve)`**
  - Conditions : un parent relié, un enfant de moins de 15 ans dont le consentement a été donné.
  - Effets :
    - `retire_le = now()` et `retire_par = parent` ;
    - `suppression_demandee_le = coalesce(suppression_demandee_le, now())` et `suppression_imposee = true`.
  - La fonction renvoie la date de suppression prévue.
- **`annuler_retrait_consentement(p_eleve)`**
  - Réservée au parent qui a retiré son accord, avant la purge.
  - Elle efface `retire_le`, `retire_par`, `suppression_demandee_le` et `suppression_imposee`.
- **Côté élève, quand le consentement est retiré** :
  - l'élève est redirigé vers `/consentement`, qui affiche « Ton parent a retiré son accord. Ton compte sera supprimé le <date>. » ;
  - `demander_consentement` refuse avec `consentement_retire` : pas de nouvelle demande vers une autre adresse ;
  - `annuler_suppression_compte` refuse avec `suppression_imposee` ;
  - l'export « Mes données » reste disponible.
- **`delier_parent(p_autre)`**, appelée par l'élève ou par le parent, supprime le lien :
  - un parent peut toujours se délier ;
  - un élève de 15 ans ou plus peut délier n'importe quel parent ;
  - un élève de moins de 15 ans ne peut pas délier un parent : code `deliaison_interdite`.
  - Si le dernier parent d'un moins de 15 ans se délie, le consentement reste valable : il a été donné, et seul un retrait l'annule.

### Purge

- `prive.purges_quotidiennes` supprime déjà les comptes 30 jours après `suppression_demandee_le`. Cela couvre le retrait de consentement sans changement.
- Elle supprime aussi les codes expirés et les compteurs d'essais des jours passés.

## 6. Écrans

| Route | Rôle | Contenu |
|---|---|---|
| `/bienvenue` | nouveau compte | choix élève ou parent, puis le parcours actuel pour l'élève |
| `/parent` | parent | liste des enfants (carte par enfant : consentement, abonnement, progression), formulaire « Relier un enfant avec un code », liaison automatique par l'adresse de l'accord |
| `/parent/enfant/[id]` | parent relié | progression détaillée par cours, boutons « Retirer mon accord » (moins de 15 ans), « Annuler le retrait » et « Ne plus suivre cet enfant » |
| `/accord-parental/[jeton]` | public | après l'accord, bouton « Créer mon compte parent » |
| `/mes-donnees` | élève et parent | section « Parents reliés » (élève) ou « Enfants suivis » (parent) ; génération de code (élève de 15 ans ou plus) ; déliaison |
| `/conditions-vente` | public | trame des CGV |

- Les actions irréversibles demandent une confirmation écrite dans la page (pas de `confirm()` du navigateur).
- Les messages sont en français et ne présument pas du genre.

## 7. Pages légales

- **`/conditions-vente`**
  - Objet, formules mensuelle et annuelle (prix « à définir ») ;
  - essai de 7 jours et version gratuite (un cours) ;
  - paiement par un prestataire (nommé quand il sera branché) ;
  - délai de grâce de 7 jours ;
  - résiliation, droit de rétractation pour les contenus numériques, médiateur de la consommation ;
  - champs `[À compléter]` et mention « relecture par un juriste conseillée ».
- **Confidentialité** : catégorie « comptes parents » et données traitées, partage de la progression avec les parents reliés, retrait du consentement et ses effets, déliaison à partir de 15 ans.
- Le pied de page ajoute le lien vers les CGV.

## 8. Export et suppression

- **`exporter_mes_donnees()`** :
  - pour un élève : la liste des parents reliés (nom affiché, origine, date) et l'abonnement ;
  - pour un parent : ses enfants reliés (nom affiché, date de liaison), sans leurs données.
- Un parent supprime son compte comme tout le monde. Ses liens disparaissent en cascade, et le consentement qu'il a donné reste valable.

## 9. Erreurs

Nouveaux codes à ajouter dans `src/lib/erreurs.ts`, avec leur message :

| Code | Message |
|---|---|
| `code_parent_invalide` | Ce code n'est pas valable ou a expiré. Demande un nouveau code à ton enfant. |
| `essais_code_epuises` | Trop d'essais. Réessaie dans une heure. |
| `trop_de_parents` | Ce compte élève est déjà relié à deux parents. |
| `deliaison_interdite` | Avant 15 ans, seul ton parent peut retirer ce lien. |
| `consentement_retire` | Ton parent a retiré son accord : tu ne peux pas faire de nouvelle demande. |
| `suppression_imposee` | La suppression a été demandée par ton parent : seul ton parent peut l'annuler. |
| `deja_inscrit` | Ce compte a déjà commencé comme élève : il ne peut pas devenir un compte parent. |
| `pas_parent` | Cette page est réservée aux comptes parents. |
| `reserve_15_ans` | Avant 15 ans, c'est ton parent qui crée le lien, avec l'adresse qui a reçu la demande d'accord. |
| `lien_introuvable` | Ce lien n'existe pas ou a déjà été retiré. |
| `retrait_impossible` | Ce retrait n'est pas possible pour ce compte. |
| `nom_parent_invalide` | Indiquez votre prénom (60 caractères au plus). |

Les messages adressés au parent le vouvoient (`code_parent_invalide` : « Demandez un nouveau code à votre enfant. », `essais_code_epuises` : « Réessayez dans une heure. »).

## 10. Sécurité

- Toutes les nouvelles fonctions sont `security definer` avec `search_path = ''`, et vérifient `auth.uid()` et le rôle.
- Seules les empreintes des codes sont stockées. La comparaison se fait sur l'empreinte.
- La liaison par adresse exige une adresse confirmée. La confirmation d'e-mail doit donc rester activée en production, comme le prévoit déjà `docs/mise-en-ligne.md`.
- Un parent n'accède aux données d'un élève qu'à travers un lien existant, vérifié dans chaque fonction.
- L'élève ne peut pas écrire dans `abonnement`, ni simuler un abonnement.
- La fin de l'étape passe par `security-review` et par la revue finale Opus.

## 11. Tests

- **pgTAP**
  - Liaison par adresse : adresse non confirmée ignorée, consentement non donné ou retiré ignoré, casse sans effet, rôle parent requis.
  - Liaison par code : expiration, remplacement, 5 essais par heure, réservée aux 15 ans et plus.
  - Limite de 2 parents.
  - `devenir_parent` refusée après une activité d'élève.
  - Retrait, puis annulation, puis purge à J+30.
  - Refus de `demander_consentement` et de `annuler_suppression_compte` après un retrait.
  - Déliaison selon l'âge.
  - Un parent ne lit que ses enfants et jamais les tentatives.
  - Règle d'accès avec un abonnement actif, en délai de grâce, puis expiré.
  - Écriture dans `abonnement` refusée aux clients.
  - Export enrichi.
- **Vitest** : messages d'erreur, formatage des cartes enfant, choix de la bannière (abonné, délai de grâce, essai).
- **Playwright**
  - Accord, puis création du compte parent, puis enfant relié et visible.
  - Code généré par un élève de 15 ans ou plus, puis saisi par le parent.
  - Retrait du consentement, puis écran bloqué côté élève, puis annulation.
  - Déliaison par l'élève.
  - Page des CGV.
  - Revue axe et CSP des nouvelles pages.

## 12. Limites acceptées

- Un élève peut créer lui-même un compte « parent » avec une seconde adresse. Le compte parent rend la fraude plus visible, sans l'empêcher.
- Le parent d'un enfant de moins de 15 ans doit s'inscrire avec l'adresse qui a reçu la demande d'accord. Avec une autre adresse, il n'est pas relié : la page `/parent` le lui indique.
- Les abonnements ne sont pas encore alimentés : aucune interface ne permet d'en créer en dehors des tests.
