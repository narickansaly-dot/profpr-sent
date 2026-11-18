# Relecture du texte du chapitre 1 de SES (1re)

Relecture indépendante du texte du chapitre (titre, chapeau, objectifs, sections, « Je retiens ») par un sous-agent relecteur qui n'a pas rédigé le cours : exactitude des faits et des chiffres réels, calculs refaits, couverture des objectifs du programme (`programmes/ses-1re.md`), clarté pour un élève de première, langue.

**Décision** : toutes les corrections proposées ci-dessous ont été appliquées au cours (parfois légèrement adaptées), et les questions des banques qui reprenaient un passage modifié ont été alignées. Rapport du relecteur :

### Bilan : 3 problèmes (gravité : 0 erreur / 1 imprécision / 2 clarté)

Tous les calculs ont été refaits (script verif-ch1-4.py) : tableaux de l'offre et de la demande (Qd = 120 − 10p, Qs = 20p − 60, annulations à 12 € et 3 €), choc de demande (7 €, 80), taxe de 1,50 € (7 €, 50, 7 500 €, partage 1 € / 0,50 €), coûts et profits de la confiturerie, surplus (180, 90, 270) : tout est juste et cohérent avec le « Je retiens ». Objectifs E1.1 à E1.6 tous traités.

#### 1. [imprécision] Aux prix de 8 et 6, le producteur fait des pertes
- Passage : « Si le prix passe à 12, il produit 5 unités ; s'il tombe à 8, 3 unités ; à 6, 2 unités. »
- Problème : avec le tableau des coûts, au prix de 8 le profit est de 24 − 28 = −4, et au prix de 6 de 12 − 20 = −8. Le texte vient de dire que le producteur « cherche à rendre son profit maximal » sans signaler qu'ici il ne fait que limiter sa perte (ne rien produire coûterait −10, le coût fixe). Un élève attentif qui refait le calcul est désorienté.
- Correction proposée : « Si le prix passe à 12, il produit 5 unités ; s'il tombe à 8, 3 unités ; à 6, 2 unités. À ces deux derniers prix, il fait une perte (−4 et −8), mais une perte plus faible que s'il ne produisait rien, car il devrait de toute façon payer son coût fixe de 10 : produire jusqu'à l'égalité du coût marginal et du prix reste le meilleur choix. »

#### 2. [clarté] « Unités » au lieu de « centaines de pots »
- Passage : « la 3e unité coûte 8 et rapporte 10 (gain de 2) ; la 4e coûte 10 et rapporte 10 (ni gain ni perte) ; la 5e coûte 12 et rapporte 10 (perte de 2). Il produit 4 unités »
- Problème : le tableau est en centaines de pots et en centaines d'euros ; parler d'« unités » sans le rappeler peut faire croire qu'un pot coûte 8 €.
- Correction proposée : « la 3e centaine de pots coûte 8 et rapporte 10 (gain de 2) ; la 4e coûte 10 et rapporte 10 (ni gain ni perte) ; la 5e coûte 12 et rapporte 10 (perte de 2). Il produit 4 centaines de pots (on parlera d'« unités » pour simplifier) »

#### 3. [clarté] Sens du déplacement de l'offre avec la taxe
- Passage : « La courbe d'offre se déplace vers le haut (vers la gauche) de 1,50 €. »
- Problème : la courbe se déplace de 1,50 € verticalement ; vers la gauche, le déplacement se mesure en quantités (30 centaines de paniers à chaque prix). La parenthèse placée avant « de 1,50 € » laisse croire que le déplacement vers la gauche vaut aussi 1,50 €.
- Correction proposée : « La courbe d'offre se déplace vers le haut de 1,50 €, ce qui revient à un déplacement vers la gauche : à chaque prix payé par l'acheteur, les producteurs offrent moins. »
