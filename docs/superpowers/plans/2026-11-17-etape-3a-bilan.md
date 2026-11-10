# Étape 3a : bilan et points reportés

État final sur la branche `etape-3a-enseignant` :
- 117 tests unitaires (Vitest) ;
- 309 tests de la base (pgTAP, 11 fichiers) ;
- 12 parcours de bout en bout (Playwright, sur mobile et sur ordinateur, avec un build de production), dont le parcours complet de l'enseignant ;
- typage, lint et build sans erreur.

## Ce qui a été livré

- **Rôle enseignant** : à l'inscription, choix « J'enseigne » avec l'établissement. La personne voit une page d'attente jusqu'à ce qu'un admin valide ou refuse sa demande (`/admin/enseignants`). Après un refus, elle repasse par `/bienvenue` pour créer un profil élève.
- **Classes** : création avec un niveau, une filière et des cours publiés. Un code d'invitation de 6 caractères, sans caractères ambigus, peut être régénéré, et un lien `/classes?code=…` le préremplit. L'enseignant peut retirer un élève.
- **Côté élève** : une page « Mes classes » pour rejoindre ou quitter une classe. Un frein limite à 10 codes faux par heure. La mention de confidentialité est placée à côté du bouton.
- **Suivi** :
  - progression par élève ;
  - notes par chapitre et d'évaluation, avec la moyenne de la classe ;
  - questions les plus ratées, avec la bonne réponse. Elles ne s'affichent qu'à partir de 5 réponses venant d'au moins 3 élèves ;
  - export CSV : BOM, `;`, virgule décimale, formules neutralisées, `no-store`.
- **Échéances d'évaluation** :
  - l'ouverture et la date limite sont fixées par classe et par cours, à l'heure de Paris (changements d'heure testés) ;
  - `demarrer_evaluation` refuse hors fenêtre (`evaluation_pas_ouverte`, `evaluation_close`) ;
  - une classe liée sans échéance compte comme une fenêtre ouverte, et une seule fenêtre ouverte suffit.
- **Dette de l'étape 2 réglée** :
  - `cloturer` passe en security invoker ;
  - un démarrage en double (23505) est relancé une fois ;
  - le retour à la page demandée après connexion passe par `?suite=`, en chemin relatif seulement ;
  - un index a été ajouté sur le catalogue.

## Failles trouvées par les revues et corrigées

1. **Sortir de la fenêtre d'évaluation en quittant sa classe.** Sans classe, la fenêtre était ouverte. Un élève pouvait donc quitter sa classe, démarrer l'évaluation avant l'ouverture ou après la limite, puis revenir avec le même code. Désormais, les départs volontaires sont notés dans `prive.depart_classe` et comptent pendant 30 jours. Un retrait par l'enseignant ne compte pas.
2. **Une personne refusée comme enseignant restait bloquée**, avec un tableau de bord vide, sans filière et sans indicateur d'âge.
3. **Un élève devenu enseignant restait inscrit dans ses classes** et apparaissait dans le suivi d'un autre enseignant. Ses inscriptions sont maintenant supprimées à la validation, et seuls les comptes élèves peuvent rejoindre une classe.
4. **Un prénom libre était visible par d'autres comptes.** Une contrainte impose 2 à 60 caractères, sans espace en bord ni caractère de contrôle ou bidi, et la même règle est appliquée côté zod.
5. **Les RPC de classe confirmaient l'existence d'une classe.** Elles renvoient maintenant `classe_introuvable`, que la classe n'existe pas ou qu'elle appartienne à un autre enseignant.
6. **Course sur le frein des codes.** Un verrou consultatif par élève est pris dans la même transaction que le comptage.
7. **Seuil des questions ratées.** Il est passé à 3 élèves distincts, en plus des 5 réponses.

## Décisions prises pendant l'exécution

- Une classe liée sans échéance compte comme une fenêtre ouverte.
- L'historique d'un élève antérieur à son inscription reste visible par l'enseignant, et la mention de confidentialité le dit.
- Retirer un cours d'une classe supprime son échéance (cascade). Un texte d'aide le signale.
- Un départ volontaire garde l'élève soumis aux échéances de l'ancienne classe pendant 30 jours.
- Les enseignants voient les bonnes réponses des questions les plus ratées. La spec est mise à jour.

## À trancher par toi

- **Anonymat du seuil des questions ratées.** Un enseignant qui crée de faux comptes élèves peut isoler les erreurs d'un seul élève. L'impact est faible, puisqu'il voit déjà ses notes. Piste : ne compter que les élèves inscrits depuis plus de 24 h.
- **Confirmation avant de rejoindre.** Le lien préremplit le code, et un clic suffit pour partager sa progression. Une étape « Tu vas rejoindre la classe X de Y » demanderait une RPC d'aperçu, comptée dans le frein.

## Points reportés, par étape

**Étape 3b (gestion du contenu)**
- Les points de l'étape 2 restent ouverts : éditeur en `security definer`, versionner une question déjà utilisée, interdire de déplacer un chapitre qui a des résultats, et HTML nettoyé par liste blanche.

**Étape 4 (PWA, calendrier, accessibilité)**
- Une classe quittée *sans* échéance garde l'évaluation ouverte pendant 30 jours. Ce n'est pas un contournement, mais il faudrait ne compter que les vraies inscriptions dans ce cas (`mes_echeances` et `fenetre_evaluation`).
- Expliquer la règle des 30 jours dans la confirmation « Quitter », et ne plus présenter la classe quittée comme une classe actuelle sur la page d'évaluation.
- Sur `/admin/enseignants`, deux décisions identiques de suite ne sont pas réannoncées par la région de statut.
- zod `min(2)` compte en UTF-16 et la base en points de code : un prénom d'un seul emoji passe zod puis échoue en base, avec un message générique.
- Codes d'invitation : ajouter un frein global par IP, en plus du frein par compte.

**Étape 5 (abonnement, RGPD)**
- Purger les lignes de `prive.depart_classe` de plus de 30 jours.
- Proposer un retour bloqué 24 h après un retrait par l'enseignant (aujourd'hui, l'élève peut revenir avec le même code, et le texte de confirmation le dit).
