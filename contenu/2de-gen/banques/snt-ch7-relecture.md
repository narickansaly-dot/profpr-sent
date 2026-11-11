# Relecture de la banque du chapitre 7 de SNT (Informatique embarquée et objets connectés)

Banque `snt-ch7.json` : 150 questions (75 / 30 / 30 / 15 ; difficultés 60 / 60 / 30 ; 17 vrais et 13 faux), au statut `a_relire`. Contrôle automatique conforme. Les traces du thermostat à hystérésis (seuils 18,5 et 19,5 °C) et de l'IHM à boutons ont été refaites à la main.

## Corrigées pendant la relecture

| Source | Problème | Décision |
| --- | --- | --- |
| 13 QCM à une réponse | Biais de longueur (48 %). | Distracteurs allongés (24 sur 75 après correction). |
| QCM « Pourquoi l'informatique embarquée améliore-t-elle la sûreté ? » | Une difficulté 3 en trop. | Passée en difficulté 2. |
| 077, 093, 144 | Énoncés trop proches de 076, 090 et 023. | Reformulés. |

## Points de doute

1. **API micro:bit** : les programmes utilisent `temperature()`, `display.read_light_level()`, `display.scroll()`, `pin0.write_digital()`, `button_a.was_pressed()` et `sleep()`, qui existent dans MicroPython pour micro:bit. Le cours ne précise pas la version de la carte (V1 ou V2) ; ces fonctions existent sur les deux.
2. **« Environ 30 mesures par minute »** (QCM de difficulté 3 sur le programme d'acquisition) : en pratique, `display.scroll` prend lui-même une à deux secondes, donc le rythme réel est plus lent. L'explication dit « en négligeant la durée du défilement », mais pas l'énoncé. Reformulation possible : préciser cette hypothèse dans l'énoncé.
3. **Thermostat** : le programme du cours lit `temperature()`, qui mesure la température du processeur de la carte, pas celle de la pièce. C'est un exemple pédagogique.
4. **Repères historiques** (Apollo 1967, Intel 4004 1971, ABS électronique en série 1978) : conformes aux sources courantes. L'ABS électronique de série est celui de Bosch sur la Mercedes Classe S (1978).
5. **Attaques par objets piratés** : le cours décrit un déni de service distribué sans le nommer (exemple réel : le réseau Mirai en 2016).
6. **« Premier smartphone grand public à écran tactile multipoint » en 2007** : formulation choisie pour éviter un nom de marque.
