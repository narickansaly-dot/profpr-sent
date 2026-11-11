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

1. **Programme en vigueur** : pour 2026-2027, c'est l'arrêté du 17 janvier 2019 (NOR MENE1901641A, BO spécial n° 1 du 22 janvier 2019). Aucun nouveau programme de SNT n'a été publié. Une révision est engagée (saisine du CSP le 20 juillet 2026) pour la **rentrée 2027**, avec l'intégration de l'IA et un horaire porté à 2 h : **le cours sera à refaire pour 2027-2028**. Le résumé `snt-2de.md` a été confronté à l'annexe officielle (copie du SNES, extraction lacunaire). Il n'y a pas de changement de programme pour cette année.
   **Écarts du cours avec les repères historiques officiels** (cours non modifié, à trancher) :
   - ch. 2 : ARPANET daté de 1969 dans le cours, de 1970 dans le programme (les questions s'appuient sur 1969) ;
   - ch. 4 : WhatsApp (2009) absent ;
   - ch. 5 : l'Open Government Initiative (2009) absente ; Bouchon, Jacquard, Hollerith et data.gouv.fr ajoutés ;
   - ch. 7 : l'Airbus A320 (1984), Météor (1998) et l'expression « internet des objets » (1999) absents ;
   - ch. 8 : la couleur (1900) et le format 24 × 36 absents.
   Les capacités attendues lisibles concordent avec le cours.
2. **Code sans `pre` ni `code`** : le HTML autorisé ne les accepte pas. Le code est affiché dans un `div class="def code"`, sans police à chasse fixe. Proposition (changement de code, non fait) : ajouter `pre` et `code` à `src/lib/contenu/html.ts` et un style `.code` dans `src/styles/chapitre.css`.
3. **Scripts `banque:*` limités à BPH et STSS** (`src/lib/contenu/banque/cours.ts`, chemin `contenu/1re-st2s/` codé en dur). La validation a appelé directement les mêmes fonctions. Il faudrait ajouter une entrée `snt` et rendre le dossier configurable.
4. **Chapitre 1 consacré à Python** : ce choix de découpage est à valider.
5. **Aucune relecture indépendante** n'a été faite ; les points de doute sont dans `banques/snt-chN-relecture.md`.
