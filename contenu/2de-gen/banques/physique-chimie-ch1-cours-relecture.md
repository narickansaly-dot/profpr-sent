# Relecture du chapitre 1 de physique-chimie (2de) : « Mesure et incertitudes »

Relecture indépendante (N = 1). Fichier corrigé : `chapitres/ch1.json` (dossier de travail de la session). La version du rédacteur reste dans `chapitres/ch1-redaction.json`.

## Bilan

- **Programme** : les notions [N1] (variabilité de la mesure), [N2] (incertitude-type) et [N3] (écriture du résultat, valeur de référence) sont traitées, ainsi que les capacités [C1] à [C7], dans les cinq sections du plan et dans l'ordre : [C1] et [C3] dans `serie-mesures` (histogramme, moyenne, écart-type, dispersion qualitative) ; [C4] dans la méthode du tableur (entrée, calcul avec NB.SI, sortie) ; [C2] et [C5] dans `incertitude-type` ; [C6] dans `ecrire-resultat` ; [C7] dans `valeur-reference`. Rien n'est hors programme : les unités SI sont présentées comme un rappel du collège, la vitesse (chapitre 8) et la masse volumique (chapitre 2) sont seulement nommées avec un renvoi. Les six objectifs du plan sont repris à l'infinitif.
- **Exactitude** : tous les calculs ont été refaits.
  - Série du pendule (10 valeurs) : somme 143,0 s, moyenne 14,30 s ; somme des carrés des écarts 0,30 s² ; σ = √(0,30 / 9) = 0,183 s ; u = 0,183 / √10 = 0,058 s, arrondie à 0,06 s. Effectifs de l'histogramme (1, 1, 2, 2, 2, 1, 1 ; total 10) justes.
  - Vitesse : 12,0 / 4,1 = 2,926 829… m·s⁻¹, arrondie à 2,9 m·s⁻¹ (2 chiffres significatifs) : juste.
  - Compatibilité : écart 0,05 s inférieur à u = 0,06 s ; ébullition : u = 0,13 / √8 = 0,046 °C, arrondie à 0,05 °C, écart 0,6 °C, soit environ 12 incertitudes-types : justes.
  - Définitions vérifiées : chiffres significatifs, écriture scientifique (1 ≤ a < 10), moyenne, écart-type expérimental (division par N − 1), u(x̄) = σ / √N, définition de l'incertitude-type conforme au préambule du programme.
- **Format** : texte brut sans balise dans `titre`, `titre_court`, `resume`, `chapeau` et `objectifs` ; classes `def`, `warn`, `tbl`, `t` ; `th scope` ; `sub`/`sup` ; aucune figure ; signe moins U+2212, « × », U+00A0. Longueur HTML après correction : 17 925 caractères (sections de 3 439 à 3 919).
- **Validateur** : `pc.ts cours` (cours valide, 5 sections) et `pc.ts typo` (typographie conforme) passent après correction.

## Corrections

| Section | Problème | Correction |
| --- | --- | --- |
| `variabilite-mesure` | « Une valeur sans unité est fausse » : formule excessive (une valeur sans unité n'est pas fausse, elle est incomplète), et contredite par les grandeurs sans unité du chapitre (N). | « sans son unité, la valeur est incomplète et ne veut rien dire ». |
| `serie-mesures` | Le texte affirmait que la calculatrice et le tableur utilisent tous deux la formule en N − 1. C'est vrai pour ECARTYPE, mais la plupart des calculatrices affichent deux écarts-types (division par N et par N − 1) : l'élève risquait de prendre le mauvais. | La phrase ne vise plus que le tableur ; ajout : « La calculatrice affiche souvent deux écarts-types : choisis celui qui divise par N − 1 (noté sₓ ou σₙ₋₁ selon les modèles). » |
| `incertitude-type` | L'avertissement disait que l'écart-type « ne diminue pas » quand on fait plus de mesures : il fluctue d'une série à l'autre, il peut diminuer un peu. | « il reste à peu près le même quand on fait plus de mesures ». |
| `incertitude-type` | La phrase « Le temps de réaction pèse sur une seule mesure de 14 s au lieu de peser sur une mesure de 1,4 s » n'expliquait pas pourquoi la dispersion diminue. | Le temps de réaction (quelques dixièmes de seconde) pèse sur une seule mesure de 14 s ; une fois la durée divisée par 10, son effet sur la durée d'une oscillation (environ 1,4 s) est divisé par 10. |
| `valeur-reference` | L'avertissement donnait des écarts et des incertitudes-types sans unité (« 0,5 », « 1 », « 0,01 »), juste après avoir dit qu'une valeur s'écrit avec son unité. | « 0,5 s », « 1 s », « 0,01 s ». |

Points vérifiés et laissés tels quels :

- le tableau des unités SI (kelvin et degré Celsius pour la température) ;
- la définition des mesures indépendantes et les quatre causes de variabilité ;
- la distinction entre variabilité et erreur grossière ;
- la méthode du tableur (NB.SI, diagramme en colonnes) ;
- la règle d'arrondi « valeur et incertitude-type » (u à un chiffre significatif, valeur au même rang) et l'écriture (14,30 ± 0,06) s avec la mention que le nombre après « ± » est l'incertitude-type ;
- la règle du nombre de chiffres significatifs pour un produit ou un quotient ;
- la définition de la valeur de référence et l'exemple de l'ébullition à 100 °C sous la pression atmosphérique normale ;
- le protocole du pendule (matériel, principe, précautions, exploitation) et les consignes de sécurité de l'ébullition ;
- les sources d'erreur (pression, étalonnage, position de la sonde) et les améliorations proposées.

## Points de doute pour l'enseignant

1. **Critère de compatibilité** : le chapitre donne un repère chiffré, « pas plus de deux incertitudes-types environ ». Le programme de 2de demande seulement une comparaison qualitative ; le quotient écart / incertitude-type (z-score) et le seuil de 2 relèvent plutôt de la 1re. Garder ce repère ou le retirer selon votre progression.
2. **u = σ / √N** : la formule de l'incertitude-type sur la moyenne est celle des manuels de 2de usuels, mais certains manuels se contentent en 2de de prendre σ comme incertitude-type d'une mesure unique. Vérifier contre le manuel de la classe.
3. **Arrondi de l'incertitude-type « plutôt vers le haut »** : choix courant, mais non imposé par le programme ; certains manuels arrondissent à deux chiffres significatifs.
4. **Exemple de la vitesse** : il anticipe le chapitre 8 (v = d / t). Il est signalé par un renvoi ; on peut le remplacer par un calcul sans formule nouvelle si vous préférez.
5. **Valeur de référence de l'ébullition** : 100 °C sous la pression atmosphérique normale, valeur scolaire usuelle (la valeur actuelle est très légèrement inférieure, environ 99,97 °C). Sans conséquence au niveau 2de.
6. **Notations de la calculatrice** (sₓ, σₙ₋₁) : elles varient selon les marques ; adapter au modèle utilisé en classe.
