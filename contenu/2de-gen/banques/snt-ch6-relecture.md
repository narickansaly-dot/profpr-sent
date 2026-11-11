# Relecture de la banque du chapitre 6 de SNT (Localisation, cartographie et mobilité)

Banque `snt-ch6.json` : 150 questions (75 / 30 / 30 / 15 ; difficultés 60 / 60 / 30 ; 16 vrais et 14 faux), au statut `a_relire`. Contrôle automatique conforme. Vérifications par programme : plus courts chemins de la figure 2 (algorithme de Dijkstra : A→B 3, A→C 2, A→D 8, A→E 11), conversions de coordonnées, sommes de contrôle des deux trames GGA (`*75` pour celle du cours, `*43` pour celle des questions), rayons des cercles de la figure 1.

## Corrigées pendant la relecture

| Source | Problème | Décision |
| --- | --- | --- |
| Trame des questions (« 4517.250 ») | Somme de contrôle inventée (`*6A`) ; la vraie est `*43`. | Corrigée dans les 6 questions qui citent la trame. |
| snt:ch6:banque:095 | QCM multiple à 4 bonnes réponses (« voisins de C »). | Remplacé par « voisins de D » (B, C, E). |
| 063 et 149 | Trop proches de la 062 (même trame en préfixe). | Reformulées sans la trame complète. |
| 9 QCM | Biais de longueur (41 %). | Distracteurs allongés. |
| Figure 1 du cours | Les trois cercles ne passaient pas exactement par le récepteur. | Rayons recalculés (84,7 ; 92,6 ; 103). |

## Points de doute

1. **Trame GGA** : en NMEA 0183, la virgule finale avant `*` correspond au champ « identifiant de station DGPS », vide ici. Les deux trames sont plausibles ; les questions ne portent pas sur les champs 11 à 14.
2. **Altitudes des constellations** : GPS environ 20 200 km, Galileo environ 23 200 km (23 222 km). « Une trentaine de satellites » pour chacune : 31 GPS opérationnels, environ 28 Galileo en 2026.
3. **Durée du trajet « 0,07 s »** : c'est l'ordre de grandeur pour un satellite au zénith (20 200 km / 300 000 km/s ≈ 0,067 s). Une question en tire 21 000 km.
4. **Trilatération en 3D** : le cours simplifie (deux sphères donnent un cercle, trois donnent deux points). La quatrième mesure corrige l'horloge. C'est l'explication habituelle en seconde.
5. **Dijkstra** : le cours ne donne que le principe. Deux questions de difficulté 3 demandent quel sommet est fixé en premier ; c'est accessible avec le principe, sans déroulé complet.
6. **Opérateur et antenne relais** : la phrase « cette information est protégée par la loi » simplifie le régime de conservation des données de connexion.
