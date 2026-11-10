# Relecture du chapitre 9 de STSS : « Agir en santé »

Relecture indépendante (task 3, step 2, N = 9). Fichier corrigé : `.superpowers/sdd/2027-01-26-etape-6b-stss/stss-ch9.json`.

## Bilan

- **Programme** : les notions N49 à N56 et les capacités C32 à C37 du plan sont toutes traitées, dans les six sections prévues, dans l'ordre. Les objectifs reprennent les six objectifs du plan. Les notions reprises (déterminants N24, alerte N29, crise N30, protection sociale) sont seulement rappelées, avec un renvoi aux chapitres 6 et 8. Rien n'est hors programme.
- **Exactitude** : vérifiés et exacts : la Charte d'Ottawa (1986, première conférence internationale pour la promotion de la santé, organisée par l'OMS), la citation de sa définition (traduction française de l'OMS) et ses cinq axes (formulations simplifiées) ; la définition de la prévention et ses trois niveaux selon l'OMS ; la loi du 4 mars 2002 relative aux droits des malades et à la qualité du système de santé, avec les droits listés (dignité, non-discrimination, information, consentement, secret, accès direct au dossier, personne de confiance) et la démocratie sanitaire ; le médecin traitant à partir de 16 ans ; la protection universelle maladie ; la prise en charge à 100 % des ALD sur la base des tarifs de la Sécurité sociale ; la rougeole maladie à déclaration obligatoire ; la pharmacovigilance ouverte aux patients ; le registre communal en cas de vague de chaleur ; les rôles de Santé publique France, de l'ANSM, des ARS, du conseil départemental (PMI, personnes âgées et handicapées), de l'Assurance maladie et de l'OMS ; le contrat local de santé entre l'ARS et une collectivité. Le chapitre ne contient ni statistique ni montant. Ses seules dates sont 1986 et 4 mars 2002.
- **Cohérence** : pas de contradiction avec le chapitre 1, qui renvoie bien au chapitre 9 pour les modes d'intervention. Le chapitre 6 renvoie au chapitre 9 pour la veille sanitaire, et le chapitre 8 pour l'apport de la protection sociale : les deux renvois sont honorés.
- **Format** : classes `def`, `t`, `tbl` et `warn`, comme au chapitre 1. U+00A0 présentes, aucune entité `&nbsp;`, aucune espace ordinaire avant « : ; ! ? » ni à l'intérieur de « ».
- **Validateur** : `analyserImport` ne renvoie aucune erreur après correction.

## Corrections

| Section | Problème | Correction |
| --- | --- | --- |
| `question-a-action` | « Déterminants territoriaux » est présenté comme un rappel du chapitre 6, qui parle de déterminants sociaux et **environnementaux**. | Ajout : les déterminants territoriaux « prolongent les déterminants environnementaux du chapitre 6 en y ajoutant l'offre de soins et de services ». |
| `question-a-action` | Le chapitre 10 emploie « besoin repéré », le chapitre 9 « besoin identifié » (terme du programme). | Ajout de « (on dit aussi besoin repéré) ». |
| `promotion-education-prevention` | Sigle OMS non développé à sa première apparition dans le chapitre. | « l'Organisation mondiale de la santé (OMS) ». |
| `restauration-parcours` | « comme certains cancers » : tout cancer (tumeur maligne) relève de la liste des ALD. | « comme un cancer ou un diabète ». |
| `restauration-parcours` | Complémentaire santé décrite sans son nom, alors que le chapitre 8 la nomme et renvoie au chapitre 9. | « La complémentaire santé solidaire, gratuite ou à faible coût selon les revenus, aide les personnes aux faibles ressources. » |
| `veille-securite` | Registre canicule : il concerne aussi les personnes handicapées, et l'inscription est volontaire. | « les personnes âgées, handicapées ou isolées qui se sont inscrites sur un registre ». |
| `veille-securite` | Sigle ANSM jamais développé ; son champ dépasse les seuls médicaments. | « L'Agence nationale de sécurité du médicament et des produits de santé (ANSM) surveille la sécurité des médicaments et des autres produits de santé. » |
| `droits-participation` | Personne de confiance : ce n'est pas forcément un proche (le médecin traitant peut l'être), et elle peut aussi accompagner la personne. | « Désigner une personne, souvent un proche ou son médecin, qui peut l'accompagner et qui sera consultée si elle ne peut plus s'exprimer. » |
| `droits-participation` | Mineur : la loi parle du consentement du mineur, recherché s'il est apte à exprimer sa volonté. | « le consentement du mineur doit être recherché s'il est capable d'exprimer sa volonté ». |
| `droits-participation` | Le degré de participation « Association » se confond avec l'association loi 1901 citée juste après dans le même tableau. | Renommé « Co-construction ». |

Points vérifiés et laissés tels quels :

- la définition de la promotion de la santé (citation) et les cinq axes ;
- les exemples de prévention primaire, secondaire et tertiaire ;
- la définition de l'éducation pour la santé et sa place dans la promotion de la santé ;
- les définitions de la veille et de la sécurité sanitaire, et la chaîne en cinq étapes ;
- les représentants des usagers, issus d'associations, dans les établissements de santé (la commission des usagers n'est pas nommée, ce qui est volontaire) ;
- l'accès direct au dossier médical (le dossier médical partagé n'est pas nommé, ce qui évite la confusion entre les deux) ;
- l'exemple de Mme Durand et l'exemple de prévention des IST au lycée.

## Points de doute pour l'enseignant

1. **Définitions de manuel** : les définitions de l'action en santé, de l'éducation pour la santé, de la restauration de la santé, du parcours de santé, de la veille et de la sécurité sanitaire et des acteurs en santé sont des reformulations. Elles sont justes, mais il n'existe pas de texte officiel unique. À aligner sur votre manuel si ses formulations sont attendues à l'examen.
2. **Rééducation après un AVC** : elle sert d'exemple à la fois de prévention tertiaire et de réadaptation (restauration de la santé). C'est conforme au découpage de l'OMS, mais cela peut troubler les élèves. On peut le signaler en classe : la prévention tertiaire et la restauration de la santé se recouvrent en partie.
3. **Tableau comparatif promotion / éducation / prévention** : il simplifie (par exemple, « interdire de fumer dans les lieux publics » classé en promotion de la santé, alors que c'est aussi une mesure de prévention primaire). L'encadré « Attention » rappelle que ces modes se combinent. À garder ou à nuancer selon votre usage.
4. **Degrés de participation** : la grille information, consultation, co-construction, décision et action est une typologie de travail, inspirée de l'échelle d'Arnstein, pas une classification officielle.
5. **Parcours de soins, de santé, de vie** : l'emboîtement suit l'usage des ARS et de la HAS. Ce n'est pas une définition légale.
6. **Noms de dispositifs** : la complémentaire santé solidaire est désormais nommée, par cohérence avec les chapitres 8 et 10. Les autres dispositifs (centre de dépistage gratuit, commission des usagers, dossier médical partagé, plan canicule) restent décrits par leur fonction. Vérifier les noms avant publication s'ils sont ajoutés.
