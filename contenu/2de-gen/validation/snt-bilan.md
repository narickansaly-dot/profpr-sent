# Bilan : cours de SNT, Seconde générale

**Fichiers** : `contenu/2de-gen/snt.json` (slug `snt-2de-gen`, filière `GEN`, niveau `2de`, matière `SNT`, couleur `#0e7490`, contraste 5,36:1 sur blanc) ; `programmes/snt-2de.md` et `snt-2de-plan.md` ; `banques/snt-chN.json` avec `snt-chN-relecture.md` ; rapports `validation/snt-chN.md`.

## Chapitres

1. Programmer en Python
2. Internet
3. Le Web
4. Les réseaux sociaux
5. Les données structurées et leur traitement
6. Localisation, cartographie et mobilité
7. Informatique embarquée et objets connectés
8. La photographie numérique

Chaque chapitre compte 5 ou 6 sections et 150 questions, soit 1 200 questions au statut `a_relire`. Chaque banque compte 75 QCM à une réponse, 30 QCM à plusieurs réponses, 30 vrai/faux et 15 réponses courtes, avec des difficultés réparties en 60 / 60 / 30. Le fichier pèse 819 Ko (la limite est de 3 Mo).

## Validation

- `analyserImport` : aucune erreur. `versDonneesCours` : la conversion réussit.
- `verifierBanque` (150 questions, préfixe `snt`) : aucune erreur sur les 8 banques. La fusion est rejouable.
- `nettoyerHtml` ne retire rien.
- **Import réel non fait** : le worktree n'a ni CLI Supabase ni `.env.local`. À faire : `npm run import:contenu -- contenu/2de-gen/snt.json`.

## Points à trancher

1. **Programme non vérifié** : le BO et Eduscol étaient inaccessibles (erreurs 403 et 404, PDF de plus de 10 Mo). Le résumé `snt-2de.md` est reconstitué de mémoire ; il est à vérifier contre le texte officiel.
2. **Code sans `pre` ni `code`** : le HTML autorisé ne les accepte pas. Le code est affiché dans un `div class="def code"`, sans police à chasse fixe. Proposition (changement de code, non fait) : ajouter `pre` et `code` à `src/lib/contenu/html.ts` et un style `.code` dans `src/styles/chapitre.css`.
3. **Scripts `banque:*` limités à BPH et STSS** (`src/lib/contenu/banque/cours.ts`, chemin `contenu/1re-st2s/` codé en dur). La validation a appelé directement les mêmes fonctions. Il faudrait ajouter une entrée `snt` et rendre le dossier configurable.
4. **Chapitre 1 consacré à Python** : ce choix de découpage est à valider.
5. **Aucune relecture indépendante** n'a été faite ; les points de doute sont dans `banques/snt-chN-relecture.md`.
