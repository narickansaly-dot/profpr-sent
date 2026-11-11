# Relecture de la banque du chapitre 3 de SNT (Le Web)

Banque `snt-ch3.json` : 150 questions (75 / 30 / 30 / 15 ; difficultés 60 / 60 / 30 ; 15 vrais et 15 faux), au statut `a_relire`. Contrôle automatique conforme. Relecture de l'auteur contre le texte du chapitre.

## Corrigées pendant la relecture

| Source | Problème | Décision |
| --- | --- | --- |
| 22 QCM à une réponse | Biais de longueur : la bonne réponse était la plus longue dans 59 % des QCM. | Un distracteur allongé dans chacune (25 sur 75 après correction, soit 33 %). |
| 048 et 144 | Énoncés trop proches (code 500, langage JavaScript). | Reformulés. |

## Points de doute

1. **Balises écrites dans les énoncés** (« <a> », « </p> », « <img src=…> ») : les énoncés sont du texte brut, et React échappe les chevrons, donc l'affichage est correct. À vérifier qu'aucun traitement en aval (export, notification) n'interprète ce texte comme du HTML.
2. **Code de l'encadré HTML du cours** : il est affiché en texte (chevrons échappés) dans un `div class="def code"`, sans police à chasse fixe ni indentation garantie hors espaces insécables. La lisibilité est correcte mais pas idéale (point à trancher n° 2 du bilan).
3. **Droit à l'oubli** : le cours dit « en France » ; c'est un droit européen (arrêt de la CJUE de 2014, RGPD), applicable en France. Formulation simplifiée.
4. **Codes de requête minimaux** (1 + feuilles de style + images) : on suppose qu'aucune ressource n'est en cache et qu'il n'y a pas de script. L'énoncé dit « au minimum ».
5. **Hameçonnage et domaines** : deux questions de difficulté 3 reposent sur la lecture du nom de domaine de droite à gauche (« exemple.fr.promo-gratuite.com »). Cette règle est enseignée au chapitre 2 et rappelée dans la section « URL et HTTP ».
6. **Creative Commons** : la question « CC BY-NC » attend « en citant l'auteur, sans usage commercial ». Le distracteur « seulement sans la modifier » est faux pour BY-NC (la modification est permise).
