
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  
  "graphql_public": {
          Tables: {
            [_ in never]: never
          }
          Views: {
            [_ in never]: never
          }
          Functions: {
            "graphql":
{ Args: { "extensions"?: Json,"operationName"?: string,"query"?: string,"variables"?: Json }; Returns: Json
                           }
          }
          Enums: {
            [_ in never]: never
          }
          CompositeTypes: {
            [_ in never]: never
          }
        },"public": {
          Tables: {
            "abonnement": {
                  Row: {
                    "cree_le": string,"eleve_id": string,"fin_grace": string | null,"fin_periode": string,"formule": string,"id": string,"maj_le": string,"payeur_id": string | null,"statut": string,"stripe_abonnement_id": string | null,"stripe_client_id": string | null
                  }
                  ComputedFields: never
                  Insert: {
                    "cree_le"?: string,"eleve_id": string,"fin_grace"?: string | null,"fin_periode": string,"formule": string,"id"?: string,"maj_le"?: string,"payeur_id"?: string | null,"statut": string,"stripe_abonnement_id"?: string | null,"stripe_client_id"?: string | null
                  }
                  Update: {
                    "cree_le"?: string,"eleve_id"?: string,"fin_grace"?: string | null,"fin_periode"?: string,"formule"?: string,"id"?: string,"maj_le"?: string,"payeur_id"?: string | null,"statut"?: string,"stripe_abonnement_id"?: string | null,"stripe_client_id"?: string | null
                  }
                  Relationships: [
                    {
      foreignKeyName: "abonnement_eleve_id_fkey"
      columns: ["eleve_id"]
isOneToOne: true
      referencedRelation: "profil"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "abonnement_payeur_id_fkey"
      columns: ["payeur_id"]
isOneToOne: false
      referencedRelation: "profil"
      referencedColumns: ["id"]
    }
                  ]
                },"abonnement_push": {
                  Row: {
                    "appareil": string,"auth": string,"cree_le": string,"eleve_id": string,"endpoint": string,"id": string,"p256dh": string
                  }
                  ComputedFields: never
                  Insert: {
                    "appareil"?: string,"auth": string,"cree_le"?: string,"eleve_id": string,"endpoint": string,"id"?: string,"p256dh": string
                  }
                  Update: {
                    "appareil"?: string,"auth"?: string,"cree_le"?: string,"eleve_id"?: string,"endpoint"?: string,"id"?: string,"p256dh"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "abonnement_push_eleve_id_fkey"
      columns: ["eleve_id"]
isOneToOne: false
      referencedRelation: "profil"
      referencedColumns: ["id"]
    }
                  ]
                },"acces_gratuit": {
                  Row: {
                    "change_utilise": boolean,"choisi_le": string,"cours_id": string,"eleve_id": string,"modifie_le": string | null
                  }
                  ComputedFields: never
                  Insert: {
                    "change_utilise"?: boolean,"choisi_le"?: string,"cours_id": string,"eleve_id": string,"modifie_le"?: string | null
                  }
                  Update: {
                    "change_utilise"?: boolean,"choisi_le"?: string,"cours_id"?: string,"eleve_id"?: string,"modifie_le"?: string | null
                  }
                  Relationships: [
                    {
      foreignKeyName: "acces_gratuit_cours_id_fkey"
      columns: ["cours_id"]
isOneToOne: false
      referencedRelation: "cours"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "acces_gratuit_eleve_id_fkey"
      columns: ["eleve_id"]
isOneToOne: true
      referencedRelation: "profil"
      referencedColumns: ["id"]
    }
                  ]
                },"chapitre": {
                  Row: {
                    "a_retenir": string | null,"chapeau": string | null,"cours_id": string,"duree": string | null,"id": string,"modifie_le": string,"numero": number,"objectifs": (string)[],"publie": boolean,"resume": string | null,"sections": NonNullable<Json>,"slug": string,"titre": string,"titre_court": string | null
                  }
                  ComputedFields: never
                  Insert: {
                    "a_retenir"?: string | null,"chapeau"?: string | null,"cours_id": string,"duree"?: string | null,"id"?: string,"modifie_le"?: string,"numero": number,"objectifs"?: (string)[],"publie"?: boolean,"resume"?: string | null,"sections"?: NonNullable<Json>,"slug": string,"titre": string,"titre_court"?: string | null
                  }
                  Update: {
                    "a_retenir"?: string | null,"chapeau"?: string | null,"cours_id"?: string,"duree"?: string | null,"id"?: string,"modifie_le"?: string,"numero"?: number,"objectifs"?: (string)[],"publie"?: boolean,"resume"?: string | null,"sections"?: NonNullable<Json>,"slug"?: string,"titre"?: string,"titre_court"?: string | null
                  }
                  Relationships: [
                    {
      foreignKeyName: "chapitre_cours_id_fkey"
      columns: ["cours_id"]
isOneToOne: false
      referencedRelation: "cours"
      referencedColumns: ["id"]
    }
                  ]
                },"classe": {
                  Row: {
                    "code": string,"cree_le": string,"enseignant_id": string,"filiere_id": string | null,"id": string,"niveau_code": string | null,"nom": string
                  }
                  ComputedFields: never
                  Insert: {
                    "code": string,"cree_le"?: string,"enseignant_id": string,"filiere_id"?: string | null,"id"?: string,"niveau_code"?: string | null,"nom": string
                  }
                  Update: {
                    "code"?: string,"cree_le"?: string,"enseignant_id"?: string,"filiere_id"?: string | null,"id"?: string,"niveau_code"?: string | null,"nom"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "classe_enseignant_id_fkey"
      columns: ["enseignant_id"]
isOneToOne: false
      referencedRelation: "profil"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "classe_filiere_id_fkey"
      columns: ["filiere_id"]
isOneToOne: false
      referencedRelation: "filiere"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "classe_niveau_code_fkey"
      columns: ["niveau_code"]
isOneToOne: false
      referencedRelation: "niveau"
      referencedColumns: ["code"]
    }
                  ]
                },"classe_cours": {
                  Row: {
                    "classe_id": string,"cours_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "classe_id": string,"cours_id": string
                  }
                  Update: {
                    "classe_id"?: string,"cours_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "classe_cours_classe_id_fkey"
      columns: ["classe_id"]
isOneToOne: false
      referencedRelation: "classe"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "classe_cours_cours_id_fkey"
      columns: ["cours_id"]
isOneToOne: false
      referencedRelation: "cours"
      referencedColumns: ["id"]
    }
                  ]
                },"consentement_parental": {
                  Row: {
                    "demande_le": string,"dernier_envoi_le": string,"donne_le": string | null,"eleve_id": string,"email_parent": string | null,"envois_du_jour": number,"jeton_empreinte": string | null,"jour_envois": string,"retire_le": string | null,"retire_par": string | null
                  }
                  ComputedFields: never
                  Insert: {
                    "demande_le"?: string,"dernier_envoi_le"?: string,"donne_le"?: string | null,"eleve_id": string,"email_parent"?: string | null,"envois_du_jour"?: number,"jeton_empreinte"?: string | null,"jour_envois"?: string,"retire_le"?: string | null,"retire_par"?: string | null
                  }
                  Update: {
                    "demande_le"?: string,"dernier_envoi_le"?: string,"donne_le"?: string | null,"eleve_id"?: string,"email_parent"?: string | null,"envois_du_jour"?: number,"jeton_empreinte"?: string | null,"jour_envois"?: string,"retire_le"?: string | null,"retire_par"?: string | null
                  }
                  Relationships: [
                    {
      foreignKeyName: "consentement_parental_eleve_id_fkey"
      columns: ["eleve_id"]
isOneToOne: true
      referencedRelation: "profil"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "consentement_parental_retire_par_fkey"
      columns: ["retire_par"]
isOneToOne: false
      referencedRelation: "profil"
      referencedColumns: ["id"]
    }
                  ]
                },"cours": {
                  Row: {
                    "couleur": string,"filiere_id": string | null,"id": string,"matiere": string,"modifie_le": string,"niveau_code": string | null,"ordre": number,"publie": boolean,"slug": string,"titre": string
                  }
                  ComputedFields: never
                  Insert: {
                    "couleur"?: string,"filiere_id"?: string | null,"id"?: string,"matiere": string,"modifie_le"?: string,"niveau_code"?: string | null,"ordre"?: number,"publie"?: boolean,"slug": string,"titre": string
                  }
                  Update: {
                    "couleur"?: string,"filiere_id"?: string | null,"id"?: string,"matiere"?: string,"modifie_le"?: string,"niveau_code"?: string | null,"ordre"?: number,"publie"?: boolean,"slug"?: string,"titre"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "cours_filiere_id_fkey"
      columns: ["filiere_id"]
isOneToOne: false
      referencedRelation: "filiere"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "cours_niveau_code_fkey"
      columns: ["niveau_code"]
isOneToOne: false
      referencedRelation: "niveau"
      referencedColumns: ["code"]
    }
                  ]
                },"echeance_evaluation": {
                  Row: {
                    "classe_id": string,"cours_id": string,"limite": string | null,"ouverture": string | null
                  }
                  ComputedFields: never
                  Insert: {
                    "classe_id": string,"cours_id": string,"limite"?: string | null,"ouverture"?: string | null
                  }
                  Update: {
                    "classe_id"?: string,"cours_id"?: string,"limite"?: string | null,"ouverture"?: string | null
                  }
                  Relationships: [
                    {
      foreignKeyName: "echeance_evaluation_classe_id_cours_id_fkey"
      columns: ["classe_id","cours_id"]
isOneToOne: true
      referencedRelation: "classe_cours"
      referencedColumns: ["classe_id","cours_id"]
    }
                  ]
                },"evenement": {
                  Row: {
                    "cours_id": string | null,"cree_le": string,"debut": string,"delai_rappel_minutes": number | null,"duree_minutes": number,"eleve_id": string,"id": string,"jours_semaine": (number)[] | null,"modifie_le": string,"plan_id": string | null,"repeter_jusqu_au": string | null,"repetition": Database["public"]['Enums']["repetition_t"],"revision_generale": boolean,"titre": string,"type": Database["public"]['Enums']["type_evenement_t"]
                  }
                  ComputedFields: never
                  Insert: {
                    "cours_id"?: string | null,"cree_le"?: string,"debut": string,"delai_rappel_minutes"?: number | null,"duree_minutes": number,"eleve_id": string,"id"?: string,"jours_semaine"?: (number)[] | null,"modifie_le"?: string,"plan_id"?: string | null,"repeter_jusqu_au"?: string | null,"repetition"?: Database["public"]['Enums']["repetition_t"],"revision_generale"?: boolean,"titre": string,"type": Database["public"]['Enums']["type_evenement_t"]
                  }
                  Update: {
                    "cours_id"?: string | null,"cree_le"?: string,"debut"?: string,"delai_rappel_minutes"?: number | null,"duree_minutes"?: number,"eleve_id"?: string,"id"?: string,"jours_semaine"?: (number)[] | null,"modifie_le"?: string,"plan_id"?: string | null,"repeter_jusqu_au"?: string | null,"repetition"?: Database["public"]['Enums']["repetition_t"],"revision_generale"?: boolean,"titre"?: string,"type"?: Database["public"]['Enums']["type_evenement_t"]
                  }
                  Relationships: [
                    {
      foreignKeyName: "evenement_cours_id_fkey"
      columns: ["cours_id"]
isOneToOne: false
      referencedRelation: "cours"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "evenement_eleve_id_fkey"
      columns: ["eleve_id"]
isOneToOne: false
      referencedRelation: "profil"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "evenement_plan_fk"
      columns: ["plan_id"]
isOneToOne: false
      referencedRelation: "plan_revision"
      referencedColumns: ["id"]
    }
                  ]
                },"evenement_chapitre": {
                  Row: {
                    "chapitre_id": string,"evenement_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "chapitre_id": string,"evenement_id": string
                  }
                  Update: {
                    "chapitre_id"?: string,"evenement_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "evenement_chapitre_chapitre_id_fkey"
      columns: ["chapitre_id"]
isOneToOne: false
      referencedRelation: "chapitre"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "evenement_chapitre_evenement_id_fkey"
      columns: ["evenement_id"]
isOneToOne: false
      referencedRelation: "evenement"
      referencedColumns: ["id"]
    }
                  ]
                },"filiere": {
                  Row: {
                    "code": string,"id": string,"nom": string,"ordre": number,"voie": Database["public"]['Enums']["voie_t"]
                  }
                  ComputedFields: never
                  Insert: {
                    "code": string,"id"?: string,"nom": string,"ordre"?: number,"voie": Database["public"]['Enums']["voie_t"]
                  }
                  Update: {
                    "code"?: string,"id"?: string,"nom"?: string,"ordre"?: number,"voie"?: Database["public"]['Enums']["voie_t"]
                  }
                  Relationships: [
                    
                  ]
                },"historique_question": {
                  Row: {
                    "derniere_reponse": string | null,"eleve_id": string,"question_id": string,"ratee": number,"vue": number
                  }
                  ComputedFields: never
                  Insert: {
                    "derniere_reponse"?: string | null,"eleve_id": string,"question_id": string,"ratee"?: number,"vue"?: number
                  }
                  Update: {
                    "derniere_reponse"?: string | null,"eleve_id"?: string,"question_id"?: string,"ratee"?: number,"vue"?: number
                  }
                  Relationships: [
                    {
      foreignKeyName: "historique_question_eleve_id_fkey"
      columns: ["eleve_id"]
isOneToOne: false
      referencedRelation: "profil"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "historique_question_question_id_fkey"
      columns: ["question_id"]
isOneToOne: false
      referencedRelation: "question"
      referencedColumns: ["id"]
    }
                  ]
                },"inscription_classe": {
                  Row: {
                    "classe_id": string,"eleve_id": string,"rejoint_le": string
                  }
                  ComputedFields: never
                  Insert: {
                    "classe_id": string,"eleve_id": string,"rejoint_le"?: string
                  }
                  Update: {
                    "classe_id"?: string,"eleve_id"?: string,"rejoint_le"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "inscription_classe_classe_id_fkey"
      columns: ["classe_id"]
isOneToOne: false
      referencedRelation: "classe"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "inscription_classe_eleve_id_fkey"
      columns: ["eleve_id"]
isOneToOne: false
      referencedRelation: "profil"
      referencedColumns: ["id"]
    }
                  ]
                },"lien_parent": {
                  Row: {
                    "cree_le": string,"eleve_id": string,"origine": string,"parent_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "cree_le"?: string,"eleve_id": string,"origine": string,"parent_id": string
                  }
                  Update: {
                    "cree_le"?: string,"eleve_id"?: string,"origine"?: string,"parent_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "lien_parent_eleve_id_fkey"
      columns: ["eleve_id"]
isOneToOne: false
      referencedRelation: "profil"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "lien_parent_parent_id_fkey"
      columns: ["parent_id"]
isOneToOne: false
      referencedRelation: "profil"
      referencedColumns: ["id"]
    }
                  ]
                },"niveau": {
                  Row: {
                    "code": string,"nom": string,"ordre": number
                  }
                  ComputedFields: never
                  Insert: {
                    "code": string,"nom": string,"ordre": number
                  }
                  Update: {
                    "code"?: string,"nom"?: string,"ordre"?: number
                  }
                  Relationships: [
                    
                  ]
                },"notification_planifiee": {
                  Row: {
                    "cle": string,"corps": string,"cree_le": string,"eleve_id": string,"envoi_prevu": string,"envoyee_le": string | null,"essais": number,"evenement_id": string | null,"id": string,"lue_le": string | null,"reservations": number,"reserve_jusqu_au": string | null,"statut": Database["public"]['Enums']["statut_notification_t"],"titre": string,"type": Database["public"]['Enums']["type_notification_t"],"url": string
                  }
                  ComputedFields: never
                  Insert: {
                    "cle": string,"corps": string,"cree_le"?: string,"eleve_id": string,"envoi_prevu": string,"envoyee_le"?: string | null,"essais"?: number,"evenement_id"?: string | null,"id"?: string,"lue_le"?: string | null,"reservations"?: number,"reserve_jusqu_au"?: string | null,"statut"?: Database["public"]['Enums']["statut_notification_t"],"titre": string,"type": Database["public"]['Enums']["type_notification_t"],"url": string
                  }
                  Update: {
                    "cle"?: string,"corps"?: string,"cree_le"?: string,"eleve_id"?: string,"envoi_prevu"?: string,"envoyee_le"?: string | null,"essais"?: number,"evenement_id"?: string | null,"id"?: string,"lue_le"?: string | null,"reservations"?: number,"reserve_jusqu_au"?: string | null,"statut"?: Database["public"]['Enums']["statut_notification_t"],"titre"?: string,"type"?: Database["public"]['Enums']["type_notification_t"],"url"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "notification_planifiee_eleve_id_fkey"
      columns: ["eleve_id"]
isOneToOne: false
      referencedRelation: "profil"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "notification_planifiee_evenement_id_fkey"
      columns: ["evenement_id"]
isOneToOne: false
      referencedRelation: "evenement"
      referencedColumns: ["id"]
    }
                  ]
                },"notion": {
                  Row: {
                    "chapitre_id": string,"id": string,"nom": string
                  }
                  ComputedFields: never
                  Insert: {
                    "chapitre_id": string,"id"?: string,"nom": string
                  }
                  Update: {
                    "chapitre_id"?: string,"id"?: string,"nom"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "notion_chapitre_id_fkey"
      columns: ["chapitre_id"]
isOneToOne: false
      referencedRelation: "chapitre"
      referencedColumns: ["id"]
    }
                  ]
                },"plan_revision": {
                  Row: {
                    "cree_le": string,"duree_minutes": number,"eleve_id": string,"examen_id": string,"heure_debut": string,"id": string,"jours_preferes": (number)[],"reorganisation_vue_le": string | null,"sessions_par_semaine": number,"statut": Database["public"]['Enums']["statut_plan_t"]
                  }
                  ComputedFields: never
                  Insert: {
                    "cree_le"?: string,"duree_minutes": number,"eleve_id": string,"examen_id": string,"heure_debut": string,"id"?: string,"jours_preferes": (number)[],"reorganisation_vue_le"?: string | null,"sessions_par_semaine": number,"statut": Database["public"]['Enums']["statut_plan_t"]
                  }
                  Update: {
                    "cree_le"?: string,"duree_minutes"?: number,"eleve_id"?: string,"examen_id"?: string,"heure_debut"?: string,"id"?: string,"jours_preferes"?: (number)[],"reorganisation_vue_le"?: string | null,"sessions_par_semaine"?: number,"statut"?: Database["public"]['Enums']["statut_plan_t"]
                  }
                  Relationships: [
                    {
      foreignKeyName: "plan_revision_eleve_id_fkey"
      columns: ["eleve_id"]
isOneToOne: false
      referencedRelation: "profil"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "plan_revision_examen_id_fkey"
      columns: ["examen_id"]
isOneToOne: true
      referencedRelation: "evenement"
      referencedColumns: ["id"]
    }
                  ]
                },"preferences_notification": {
                  Row: {
                    "echeance_proche": boolean,"eleve_id": string,"inactivite": boolean,"jours_inactivite": number,"modifie_le": string,"nouvel_essai": boolean,"rappel_evenement": boolean,"revision_du_jour": boolean,"silence_debut": string,"silence_fin": string
                  }
                  ComputedFields: never
                  Insert: {
                    "echeance_proche"?: boolean,"eleve_id": string,"inactivite"?: boolean,"jours_inactivite"?: number,"modifie_le"?: string,"nouvel_essai"?: boolean,"rappel_evenement"?: boolean,"revision_du_jour"?: boolean,"silence_debut"?: string,"silence_fin"?: string
                  }
                  Update: {
                    "echeance_proche"?: boolean,"eleve_id"?: string,"inactivite"?: boolean,"jours_inactivite"?: number,"modifie_le"?: string,"nouvel_essai"?: boolean,"rappel_evenement"?: boolean,"revision_du_jour"?: boolean,"silence_debut"?: string,"silence_fin"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "preferences_notification_eleve_id_fkey"
      columns: ["eleve_id"]
isOneToOne: true
      referencedRelation: "profil"
      referencedColumns: ["id"]
    }
                  ]
                },"profil": {
                  Row: {
                    "demande_enseignant": boolean,"email": string | null,"etablissement": string | null,"filiere_id": string | null,"id": string,"inscrit_le": string,"moins_de_15_ans": boolean | null,"niveau_code": string | null,"nom": string | null,"onboarding_termine": boolean,"role": Database["public"]['Enums']["role_t"],"suppression_demandee_le": string | null,"suppression_imposee": boolean
                  }
                  ComputedFields: never
                  Insert: {
                    "demande_enseignant"?: boolean,"email"?: string | null,"etablissement"?: string | null,"filiere_id"?: string | null,"id": string,"inscrit_le"?: string,"moins_de_15_ans"?: boolean | null,"niveau_code"?: string | null,"nom"?: string | null,"onboarding_termine"?: boolean,"role"?: Database["public"]['Enums']["role_t"],"suppression_demandee_le"?: string | null,"suppression_imposee"?: boolean
                  }
                  Update: {
                    "demande_enseignant"?: boolean,"email"?: string | null,"etablissement"?: string | null,"filiere_id"?: string | null,"id"?: string,"inscrit_le"?: string,"moins_de_15_ans"?: boolean | null,"niveau_code"?: string | null,"nom"?: string | null,"onboarding_termine"?: boolean,"role"?: Database["public"]['Enums']["role_t"],"suppression_demandee_le"?: string | null,"suppression_imposee"?: boolean
                  }
                  Relationships: [
                    {
      foreignKeyName: "profil_filiere_id_fkey"
      columns: ["filiere_id"]
isOneToOne: false
      referencedRelation: "filiere"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "profil_niveau_code_fkey"
      columns: ["niveau_code"]
isOneToOne: false
      referencedRelation: "niveau"
      referencedColumns: ["code"]
    }
                  ]
                },"progression_chapitre": {
                  Row: {
                    "chapitre_id": string,"eleve_id": string,"lu": boolean,"meilleure_note": number | null,"valide": boolean,"valide_le": string | null
                  }
                  ComputedFields: never
                  Insert: {
                    "chapitre_id": string,"eleve_id": string,"lu"?: boolean,"meilleure_note"?: number | null,"valide"?: boolean,"valide_le"?: string | null
                  }
                  Update: {
                    "chapitre_id"?: string,"eleve_id"?: string,"lu"?: boolean,"meilleure_note"?: number | null,"valide"?: boolean,"valide_le"?: string | null
                  }
                  Relationships: [
                    {
      foreignKeyName: "progression_chapitre_chapitre_id_fkey"
      columns: ["chapitre_id"]
isOneToOne: false
      referencedRelation: "chapitre"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "progression_chapitre_eleve_id_fkey"
      columns: ["eleve_id"]
isOneToOne: false
      referencedRelation: "profil"
      referencedColumns: ["id"]
    }
                  ]
                },"progression_cours": {
                  Row: {
                    "cours_id": string,"dernier_essai": string | null,"eleve_id": string,"essais": number,"meilleure_note": number | null,"valide": boolean,"valide_le": string | null
                  }
                  ComputedFields: never
                  Insert: {
                    "cours_id": string,"dernier_essai"?: string | null,"eleve_id": string,"essais"?: number,"meilleure_note"?: number | null,"valide"?: boolean,"valide_le"?: string | null
                  }
                  Update: {
                    "cours_id"?: string,"dernier_essai"?: string | null,"eleve_id"?: string,"essais"?: number,"meilleure_note"?: number | null,"valide"?: boolean,"valide_le"?: string | null
                  }
                  Relationships: [
                    {
      foreignKeyName: "progression_cours_cours_id_fkey"
      columns: ["cours_id"]
isOneToOne: false
      referencedRelation: "cours"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "progression_cours_eleve_id_fkey"
      columns: ["eleve_id"]
isOneToOne: false
      referencedRelation: "profil"
      referencedColumns: ["id"]
    }
                  ]
                },"question": {
                  Row: {
                    "chapitre_id": string,"cree_le": string,"difficulte": number,"enonce": string,"id": string,"modifie_le": string,"notion_id": string | null,"propositions": NonNullable<Json>,"source": string | null,"statut": Database["public"]['Enums']["statut_question_t"],"type": Database["public"]['Enums']["type_question_t"],"version_de": string | null
                  }
                  ComputedFields: never
                  Insert: {
                    "chapitre_id": string,"cree_le"?: string,"difficulte"?: number,"enonce": string,"id"?: string,"modifie_le"?: string,"notion_id"?: string | null,"propositions"?: NonNullable<Json>,"source"?: string | null,"statut"?: Database["public"]['Enums']["statut_question_t"],"type": Database["public"]['Enums']["type_question_t"],"version_de"?: string | null
                  }
                  Update: {
                    "chapitre_id"?: string,"cree_le"?: string,"difficulte"?: number,"enonce"?: string,"id"?: string,"modifie_le"?: string,"notion_id"?: string | null,"propositions"?: NonNullable<Json>,"source"?: string | null,"statut"?: Database["public"]['Enums']["statut_question_t"],"type"?: Database["public"]['Enums']["type_question_t"],"version_de"?: string | null
                  }
                  Relationships: [
                    {
      foreignKeyName: "question_chapitre_id_fkey"
      columns: ["chapitre_id"]
isOneToOne: false
      referencedRelation: "chapitre"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "question_notion_id_fkey"
      columns: ["notion_id"]
isOneToOne: false
      referencedRelation: "notion"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "question_version_de_fkey"
      columns: ["version_de"]
isOneToOne: false
      referencedRelation: "question"
      referencedColumns: ["id"]
    }
                  ]
                },"question_corrige": {
                  Row: {
                    "bonnes_reponses": NonNullable<Json>,"explication": string,"marge": number | null,"marge_relative": boolean,"question_id": string,"reponses_acceptees": (string)[]
                  }
                  ComputedFields: never
                  Insert: {
                    "bonnes_reponses"?: NonNullable<Json>,"explication"?: string,"marge"?: number | null,"marge_relative"?: boolean,"question_id": string,"reponses_acceptees"?: (string)[]
                  }
                  Update: {
                    "bonnes_reponses"?: NonNullable<Json>,"explication"?: string,"marge"?: number | null,"marge_relative"?: boolean,"question_id"?: string,"reponses_acceptees"?: (string)[]
                  }
                  Relationships: [
                    {
      foreignKeyName: "question_corrige_question_id_fkey"
      columns: ["question_id"]
isOneToOne: true
      referencedRelation: "question"
      referencedColumns: ["id"]
    }
                  ]
                },"signalement": {
                  Row: {
                    "auteur_id": string,"commentaire": string,"cree_le": string,"id": string,"question_id": string,"reponse": string | null,"statut": string,"traite_le": string | null,"traite_par": string | null
                  }
                  ComputedFields: never
                  Insert: {
                    "auteur_id": string,"commentaire": string,"cree_le"?: string,"id"?: string,"question_id": string,"reponse"?: string | null,"statut"?: string,"traite_le"?: string | null,"traite_par"?: string | null
                  }
                  Update: {
                    "auteur_id"?: string,"commentaire"?: string,"cree_le"?: string,"id"?: string,"question_id"?: string,"reponse"?: string | null,"statut"?: string,"traite_le"?: string | null,"traite_par"?: string | null
                  }
                  Relationships: [
                    {
      foreignKeyName: "signalement_auteur_id_fkey"
      columns: ["auteur_id"]
isOneToOne: false
      referencedRelation: "profil"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "signalement_question_id_fkey"
      columns: ["question_id"]
isOneToOne: false
      referencedRelation: "question"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "signalement_traite_par_fkey"
      columns: ["traite_par"]
isOneToOne: false
      referencedRelation: "profil"
      referencedColumns: ["id"]
    }
                  ]
                },"tentative": {
                  Row: {
                    "chapitre_id": string | null,"cours_id": string,"date_limite": string | null,"debut": string,"eleve_id": string,"fin": string | null,"id": string,"nb_questions": number,"note": number | null,"reussie": boolean | null,"statut": Database["public"]['Enums']["statut_tentative_t"],"type": Database["public"]['Enums']["type_tentative_t"]
                  }
                  ComputedFields: never
                  Insert: {
                    "chapitre_id"?: string | null,"cours_id": string,"date_limite"?: string | null,"debut"?: string,"eleve_id": string,"fin"?: string | null,"id"?: string,"nb_questions": number,"note"?: number | null,"reussie"?: boolean | null,"statut"?: Database["public"]['Enums']["statut_tentative_t"],"type": Database["public"]['Enums']["type_tentative_t"]
                  }
                  Update: {
                    "chapitre_id"?: string | null,"cours_id"?: string,"date_limite"?: string | null,"debut"?: string,"eleve_id"?: string,"fin"?: string | null,"id"?: string,"nb_questions"?: number,"note"?: number | null,"reussie"?: boolean | null,"statut"?: Database["public"]['Enums']["statut_tentative_t"],"type"?: Database["public"]['Enums']["type_tentative_t"]
                  }
                  Relationships: [
                    {
      foreignKeyName: "tentative_chapitre_id_fkey"
      columns: ["chapitre_id"]
isOneToOne: false
      referencedRelation: "chapitre"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "tentative_cours_id_fkey"
      columns: ["cours_id"]
isOneToOne: false
      referencedRelation: "cours"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "tentative_eleve_id_fkey"
      columns: ["eleve_id"]
isOneToOne: false
      referencedRelation: "profil"
      referencedColumns: ["id"]
    }
                  ]
                },"tentative_question": {
                  Row: {
                    "correcte": boolean | null,"ordre": number,"permutation": (number)[],"question_id": string,"repondu_le": string | null,"reponse": Json | null,"tentative_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "correcte"?: boolean | null,"ordre": number,"permutation"?: (number)[],"question_id": string,"repondu_le"?: string | null,"reponse"?: Json | null,"tentative_id": string
                  }
                  Update: {
                    "correcte"?: boolean | null,"ordre"?: number,"permutation"?: (number)[],"question_id"?: string,"repondu_le"?: string | null,"reponse"?: Json | null,"tentative_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "tentative_question_question_id_fkey"
      columns: ["question_id"]
isOneToOne: false
      referencedRelation: "question"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "tentative_question_tentative_id_fkey"
      columns: ["tentative_id"]
isOneToOne: false
      referencedRelation: "tentative"
      referencedColumns: ["id"]
    }
                  ]
                }
          }
          Views: {
            [_ in never]: never
          }
          Functions: {
            "accepter_plan_revision":
{ Args: { "p_examen": string,"p_reglages": Json,"p_sessions": Json }; Returns: string
                           },
"annuler_retrait_consentement":
{ Args: { "p_eleve": string }; Returns: undefined
                           },
"annuler_suppression_compte":
{ Args: Record<PropertyKey, never>; Returns: undefined
                           },
"calendrier_ical":
{ Args: { "p_jeton": string }; Returns: {
              "debut": string,"fin": string,"titre": string,"uid": string
            }[]
                           },
"changer_statut_question":
{ Args: { "p_question": string,"p_statut": Database["public"]['Enums']["statut_question_t"] }; Returns: undefined
                           },
"changer_statut_questions":
{ Args: { "p_questions": (string)[],"p_statut": Database["public"]['Enums']["statut_question_t"] }; Returns: number
                           },
"choisir_cours_gratuit":
{ Args: { "p_cours": string }; Returns: undefined
                           },
"classes_eleve":
{ Args: Record<PropertyKey, never>; Returns: {
              "enseignant_nom": string,"id": string,"nom": string,"rejoint_le": string
            }[]
                           },
"classes_enseignant":
{ Args: Record<PropertyKey, never>; Returns: {
              "code": string,"cours_ids": (string)[],"cree_le": string,"filiere_id": string,"id": string,"nb_eleves": number,"niveau_code": string,"nom": string
            }[]
                           },
"cloturer_mes_tentatives_expirees":
{ Args: Record<PropertyKey, never>; Returns: number
                           },
"configurer_consentement":
{ Args: { "p_secret": string }; Returns: undefined
                           },
"configurer_envoi":
{ Args: { "p_secret": string,"p_url": string }; Returns: undefined
                           },
"correction_tentative":
{ Args: { "p_tentative": string }; Returns: {
              "bonnes_reponses": Json,"correcte": boolean,"enonce": string,"explication": string,"ordre": number,"propositions": Json,"question_id": string,"reponse": Json,"reponses_acceptees": (string)[],"type": Database["public"]['Enums']["type_question_t"]
            }[]
                           },
"creer_classe":
{ Args: { "p_cours": (string)[],"p_filiere": string,"p_niveau": string,"p_nom": string }; Returns: string
                           },
"creer_jeton_ical":
{ Args: Record<PropertyKey, never>; Returns: string
                           },
"definir_cours_classe":
{ Args: { "p_classe": string,"p_cours": (string)[] }; Returns: undefined
                           },
"definir_echeance":
{ Args: { "p_classe": string,"p_cours": string,"p_limite": string,"p_ouverture": string }; Returns: undefined
                           },
"delier_parent":
{ Args: { "p_autre": string }; Returns: undefined
                           },
"demander_consentement":
{ Args: { "p_email": string }; Returns: undefined
                           },
"demander_suppression_compte":
{ Args: Record<PropertyKey, never>; Returns: string
                           },
"demandes_enseignant":
{ Args: Record<PropertyKey, never>; Returns: {
              "email": string,"etablissement": string,"id": string,"inscrit_le": string,"nom": string
            }[]
                           },
"demarrer_evaluation":
{ Args: { "p_cours": string }; Returns: string
                           },
"demarrer_quiz":
{ Args: { "p_chapitre": string,"p_nb": number,"p_revision"?: boolean }; Returns: string
                           },
"demarrer_revision_generale":
{ Args: { "p_evenement": string }; Returns: string
                           },
"devenir_parent":
{ Args: { "p_nom": string }; Returns: undefined
                           },
"donner_consentement":
{ Args: { "p_jeton": string }; Returns: string
                           },
"echeances_classe":
{ Args: { "p_classe": string }; Returns: {
              "cours_id": string,"limite": string,"ouverture": string
            }[]
                           },
"emettre_jeton_consentement":
{ Args: { "p_eleve": string,"p_secret": string }; Returns: {
              "email": string,"jeton": string,"prenom": string
            }[]
                           },
"en_essai":
{ Args: Record<PropertyKey, never>; Returns: boolean
                           },
"enfants_du_parent":
{ Args: Record<PropertyKey, never>; Returns: {
              "abonnement": Json,"consentement_donne_le": string,"consentement_retire_le": string,"eleve_id": string,"lie_le": string,"moins_de_15_ans": boolean,"niveau": string,"nom": string,"origine": string,"retire_par_moi": boolean,"suppression_prevue_le": string
            }[]
                           },
"enregistrer_abonnement_push":
{ Args: { "p_appareil": string,"p_auth": string,"p_endpoint": string,"p_p256dh": string }; Returns: string
                           },
"enregistrer_chapitre":
{ Args: { "p_chapitre": string,"p_cours": string,"p_donnees": Json }; Returns: string
                           },
"enregistrer_cours":
{ Args: { "p_cours": string,"p_donnees": Json }; Returns: string
                           },
"enregistrer_evenement":
{ Args: { "p": Json,"p_id": string }; Returns: string
                           },
"enregistrer_preferences_notification":
{ Args: { "p": Json }; Returns: undefined
                           },
"enregistrer_question":
{ Args: { "p_chapitre": string,"p_donnees": Json,"p_question": string }; Returns: string
                           },
"envoi_reserver":
{ Args: { "p_limite"?: number,"p_secret": string }; Returns: {
              "abonnements": Json,"corps": string,"eleve_id": string,"envoi_prevu": string,"essais": number,"id": string,"silence_debut": string,"silence_fin": string,"titre": string,"url": string
            }[]
                           },
"envoi_terminer":
{ Args: { "p_expires": (string)[],"p_resultats": Json,"p_secret": string }; Returns: undefined
                           },
"est_eleve_sans_accord":
{ Args: { "p_eleve": string }; Returns: boolean
                           },
"exporter_mes_donnees":
{ Args: Record<PropertyKey, never>; Returns: Json
                           },
"generer_code_parent":
{ Args: Record<PropertyKey, never>; Returns: string
                           },
"ignorer_reorganisation":
{ Args: { "p_plan": string }; Returns: undefined
                           },
"importer_cours":
{ Args: { "p_cours": Json,"p_publier"?: boolean }; Returns: Json
                           },
"lier_par_code":
{ Args: { "p_code": string }; Returns: string
                           },
"lier_par_email":
{ Args: Record<PropertyKey, never>; Returns: number
                           },
"lire_demande_consentement":
{ Args: { "p_jeton": string }; Returns: {
              "deja_donne": boolean,"prenom": string,"retire": boolean
            }[]
                           },
"marquer_chapitre_lu":
{ Args: { "p_chapitre": string }; Returns: undefined
                           },
"marquer_rappels_lus":
{ Args: Record<PropertyKey, never>; Returns: undefined
                           },
"mes_creneaux_occupes":
{ Args: { "p_a": string,"p_de": string }; Returns: {
              "debut": string,"evenement_id": string,"fin": string,"plan_id": string
            }[]
                           },
"mes_echeances":
{ Args: { "p_cours"?: string }; Returns: {
              "classe_nom": string,"cours_id": string,"limite": string,"ouverture": string,"quittee": boolean
            }[]
                           },
"mes_signalements":
{ Args: Record<PropertyKey, never>; Returns: {
              "chapitre_titre": string,"commentaire": string,"cours_titre": string,"cree_le": string,"enonce": string,"id": string,"question_id": string,"reponse": string,"statut": string,"traite_le": string
            }[]
                           },
"mon_acces":
{ Args: Record<PropertyKey, never>; Returns: {
              "abonnement": Json,"changement_possible_jusqu_au": string,"consentement_envoye_le": string,"consentement_requis": boolean,"consentement_retire_le": string,"cours_gratuit_id": string,"email_parent": string,"en_essai": boolean,"fin_essai": string,"role": string,"suppression_prevue_le": string
            }[]
                           },
"mon_calendrier":
{ Args: { "p_a": string,"p_de": string }; Returns: {
              "chapitres": Json,"classe_nom": string,"cle": string,"couleur": string,"cours_id": string,"cours_slug": string,"cours_titre": string,"debut": string,"evenement_id": string,"fin": string,"lecture_seule": boolean,"plan_id": string,"revision_generale": boolean,"titre": string,"type": string
            }[]
                           },
"mon_jeton_ical":
{ Args: Record<PropertyKey, never>; Returns: string
                           },
"notes_classe":
{ Args: { "p_classe": string,"p_cours": string }; Returns: {
              "chapitre_id": string,"chapitre_numero": number,"chapitre_titre": string,"eleve_id": string,"meilleure_note": number,"nom": string,"valide": boolean
            }[]
                           },
"notions_chapitre":
{ Args: { "p_chapitre": string }; Returns: string[]
                           },
"parents_de_l_eleve":
{ Args: Record<PropertyKey, never>; Returns: {
              "lie_le": string,"nom": string,"origine": string,"parent_id": string
            }[]
                           },
"peut_lire_cours":
{ Args: { "p_cours": string }; Returns: boolean
                           },
"plans_a_reorganiser":
{ Args: Record<PropertyKey, never>; Returns: {
              "examen_id": string,"examen_titre": string,"plan_id": string
            }[]
                           },
"points_faibles":
{ Args: { "p_limite"?: number }; Returns: {
              "chapitre_id": string,"chapitre_slug": string,"cours_slug": string,"libelle": string,"reponses": number,"taux_erreur": number
            }[]
                           },
"progression_enfant":
{ Args: { "p_eleve": string }; Returns: {
              "chapitres_total": number,"chapitres_valides": number,"cours_id": string,"cours_valide": boolean,"derniere_activite": string,"meilleure_note": number,"titre": string
            }[]
                           },
"publier_chapitre":
{ Args: { "p_chapitre": string,"p_publie": boolean }; Returns: undefined
                           },
"publier_cours":
{ Args: { "p_cours": string,"p_publie": boolean }; Returns: undefined
                           },
"questions_chapitre_admin":
{ Args: { "p_chapitre": string }; Returns: {
              "bonnes_reponses": Json,"difficulte": number,"enonce": string,"explication": string,"id": string,"marge": number,"marge_relative": boolean,"modifie_le": string,"notion": string,"propositions": Json,"reponses_acceptees": (string)[],"signalements_ouverts": number,"source": string,"statut": Database["public"]['Enums']["statut_question_t"],"type": Database["public"]['Enums']["type_question_t"],"utilisee": boolean,"version_de": string
            }[]
                           },
"questions_ratees_classe":
{ Args: { "p_classe": string,"p_cours": string,"p_limite"?: number }; Returns: {
              "bonnes_reponses": Json,"chapitre_titre": string,"enonce": string,"propositions": Json,"question_id": string,"reponses": number,"reponses_acceptees": (string)[],"taux_erreur": number,"type": Database["public"]['Enums']["type_question_t"]
            }[]
                           },
"questions_tentative":
{ Args: { "p_tentative": string }; Returns: {
              "enonce": string,"ordre": number,"propositions": Json,"question_id": string,"reponse": Json,"type": Database["public"]['Enums']["type_question_t"]
            }[]
                           },
"quitter_classe":
{ Args: { "p_classe": string }; Returns: undefined
                           },
"refuser_plan_revision":
{ Args: { "p_examen": string,"p_reglages": Json }; Returns: undefined
                           },
"regenerer_code_classe":
{ Args: { "p_classe": string }; Returns: string
                           },
"regler_rappel_evenement":
{ Args: { "p_delai": number,"p_id": string }; Returns: undefined
                           },
"rejoindre_classe":
{ Args: { "p_code": string }; Returns: {
              "classe_nom": string,"statut": string
            }[]
                           },
"repondre":
{ Args: { "p_question": string,"p_reponse": Json,"p_tentative": string }; Returns: string
                           },
"retirer_consentement":
{ Args: { "p_eleve": string }; Returns: string
                           },
"retirer_eleve":
{ Args: { "p_classe": string,"p_eleve": string }; Returns: undefined
                           },
"revoquer_jeton_ical":
{ Args: Record<PropertyKey, never>; Returns: undefined
                           },
"role_actuel":
{ Args: Record<PropertyKey, never>; Returns: Database["public"]['Enums']["role_t"]
                           },
"serie_jours":
{ Args: Record<PropertyKey, never>; Returns: number
                           },
"signalements_admin":
{ Args: { "p_statut"?: string }; Returns: {
              "auteur_email": string,"auteur_nom": string,"chapitre_id": string,"chapitre_titre": string,"commentaire": string,"cours_titre": string,"cree_le": string,"enonce": string,"id": string,"question_id": string,"reponse": string,"statut": string,"statut_question": Database["public"]['Enums']["statut_question_t"],"traite_le": string
            }[]
                           },
"signaler_question":
{ Args: { "p_commentaire": string,"p_question": string }; Returns: string
                           },
"suivi_classe":
{ Args: { "p_classe": string }; Returns: {
              "chapitres_total": number,"chapitres_valides": number,"cours_id": string,"cours_titre": string,"derniere_activite": string,"eleve_id": string,"essais_evaluation": number,"evaluation_validee": boolean,"nom": string,"note_evaluation": number
            }[]
                           },
"suivi_contenu":
{ Args: Record<PropertyKey, never>; Returns: {
              "a_relire": number,"brouillons": number,"chapitre_id": string,"chapitre_publie": boolean,"chapitre_titre": string,"cours_id": string,"cours_publie": boolean,"cours_slug": string,"cours_titre": string,"numero": number,"signalements": number,"valides": number
            }[]
                           },
"supprimer_abonnement_push":
{ Args: { "p_id": string }; Returns: undefined
                           },
"supprimer_abonnement_push_endpoint":
{ Args: { "p_endpoint": string }; Returns: undefined
                           },
"supprimer_evenement":
{ Args: { "p_id": string }; Returns: undefined
                           },
"supprimer_question":
{ Args: { "p_question": string }; Returns: undefined
                           },
"terminer_tentative":
{ Args: { "p_tentative": string }; Returns: undefined
                           },
"traiter_demande_enseignant":
{ Args: { "p_accepter": boolean,"p_profil": string }; Returns: undefined
                           },
"traiter_signalement":
{ Args: { "p_decision": string,"p_reponse"?: string,"p_signalement": string }; Returns: undefined
                           }
          }
          Enums: {
            "repetition_t": "aucune"|"quotidienne"|"hebdomadaire"|"jours","role_t": "eleve"|"parent"|"enseignant"|"admin_contenu","statut_notification_t": "en_attente"|"envoyee"|"echec","statut_plan_t": "propose"|"accepte"|"refuse","statut_question_t": "brouillon"|"a_relire"|"valide"|"archivee","statut_tentative_t": "en_cours"|"terminee"|"expiree","type_evenement_t": "revision"|"devoir"|"examen_reel","type_notification_t": "rappel_evenement"|"echeance_proche"|"nouvel_essai"|"revision_du_jour"|"inactivite","type_question_t": "qcm_unique"|"qcm_multiple"|"vrai_faux"|"reponse_courte","type_tentative_t": "quiz_chapitre"|"revision"|"evaluation_cours","voie_t": "generale"|"technologique"|"professionnelle"
          }
          CompositeTypes: {
            [_ in never]: never
          }
        }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
  ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never

export const Constants = {
  "graphql_public": {
          Enums: {
            
          }
        },"public": {
          Enums: {
            "repetition_t": ["aucune", "quotidienne", "hebdomadaire", "jours"],"role_t": ["eleve", "parent", "enseignant", "admin_contenu"],"statut_notification_t": ["en_attente", "envoyee", "echec"],"statut_plan_t": ["propose", "accepte", "refuse"],"statut_question_t": ["brouillon", "a_relire", "valide", "archivee"],"statut_tentative_t": ["en_cours", "terminee", "expiree"],"type_evenement_t": ["revision", "devoir", "examen_reel"],"type_notification_t": ["rappel_evenement", "echeance_proche", "nouvel_essai", "revision_du_jour", "inactivite"],"type_question_t": ["qcm_unique", "qcm_multiple", "vrai_faux", "reponse_courte"],"type_tentative_t": ["quiz_chapitre", "revision", "evaluation_cours"],"voie_t": ["generale", "technologique", "professionnelle"]
          }
        }
} as const
