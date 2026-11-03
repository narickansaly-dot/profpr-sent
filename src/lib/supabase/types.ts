
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
            "chapitre": {
                  Row: {
                    "a_retenir": string | null,"chapeau": string | null,"cours_id": string,"duree": string | null,"id": string,"numero": number,"objectifs": (string)[],"publie": boolean,"resume": string | null,"sections": NonNullable<Json>,"slug": string,"titre": string,"titre_court": string | null
                  }
                  ComputedFields: never
                  Insert: {
                    "a_retenir"?: string | null,"chapeau"?: string | null,"cours_id": string,"duree"?: string | null,"id"?: string,"numero": number,"objectifs"?: (string)[],"publie"?: boolean,"resume"?: string | null,"sections"?: NonNullable<Json>,"slug": string,"titre": string,"titre_court"?: string | null
                  }
                  Update: {
                    "a_retenir"?: string | null,"chapeau"?: string | null,"cours_id"?: string,"duree"?: string | null,"id"?: string,"numero"?: number,"objectifs"?: (string)[],"publie"?: boolean,"resume"?: string | null,"sections"?: NonNullable<Json>,"slug"?: string,"titre"?: string,"titre_court"?: string | null
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
                },"cours": {
                  Row: {
                    "couleur": string,"filiere_id": string | null,"id": string,"matiere": string,"niveau_code": string | null,"ordre": number,"publie": boolean,"slug": string,"titre": string
                  }
                  ComputedFields: never
                  Insert: {
                    "couleur"?: string,"filiere_id"?: string | null,"id"?: string,"matiere": string,"niveau_code"?: string | null,"ordre"?: number,"publie"?: boolean,"slug": string,"titre": string
                  }
                  Update: {
                    "couleur"?: string,"filiere_id"?: string | null,"id"?: string,"matiere"?: string,"niveau_code"?: string | null,"ordre"?: number,"publie"?: boolean,"slug"?: string,"titre"?: string
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
                },"profil": {
                  Row: {
                    "email": string | null,"filiere_id": string | null,"id": string,"inscrit_le": string,"moins_de_15_ans": boolean | null,"niveau_code": string | null,"nom": string | null,"onboarding_termine": boolean,"role": Database["public"]['Enums']["role_t"]
                  }
                  ComputedFields: never
                  Insert: {
                    "email"?: string | null,"filiere_id"?: string | null,"id": string,"inscrit_le"?: string,"moins_de_15_ans"?: boolean | null,"niveau_code"?: string | null,"nom"?: string | null,"onboarding_termine"?: boolean,"role"?: Database["public"]['Enums']["role_t"]
                  }
                  Update: {
                    "email"?: string | null,"filiere_id"?: string | null,"id"?: string,"inscrit_le"?: string,"moins_de_15_ans"?: boolean | null,"niveau_code"?: string | null,"nom"?: string | null,"onboarding_termine"?: boolean,"role"?: Database["public"]['Enums']["role_t"]
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
                    "chapitre_id": string,"cree_le": string,"difficulte": number,"enonce": string,"id": string,"modifie_le": string,"notion_id": string | null,"propositions": NonNullable<Json>,"source": string | null,"statut": Database["public"]['Enums']["statut_question_t"],"type": Database["public"]['Enums']["type_question_t"]
                  }
                  ComputedFields: never
                  Insert: {
                    "chapitre_id": string,"cree_le"?: string,"difficulte"?: number,"enonce": string,"id"?: string,"modifie_le"?: string,"notion_id"?: string | null,"propositions"?: NonNullable<Json>,"source"?: string | null,"statut"?: Database["public"]['Enums']["statut_question_t"],"type": Database["public"]['Enums']["type_question_t"]
                  }
                  Update: {
                    "chapitre_id"?: string,"cree_le"?: string,"difficulte"?: number,"enonce"?: string,"id"?: string,"modifie_le"?: string,"notion_id"?: string | null,"propositions"?: NonNullable<Json>,"source"?: string | null,"statut"?: Database["public"]['Enums']["statut_question_t"],"type"?: Database["public"]['Enums']["type_question_t"]
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
            "cloturer_mes_tentatives_expirees":
{ Args: Record<PropertyKey, never>; Returns: number
                           },
"correction_tentative":
{ Args: { "p_tentative": string }; Returns: {
              "bonnes_reponses": Json,"correcte": boolean,"enonce": string,"explication": string,"ordre": number,"propositions": Json,"question_id": string,"reponse": Json,"reponses_acceptees": (string)[],"type": Database["public"]['Enums']["type_question_t"]
            }[]
                           },
"demarrer_evaluation":
{ Args: { "p_cours": string }; Returns: string
                           },
"demarrer_quiz":
{ Args: { "p_chapitre": string,"p_nb": number,"p_revision"?: boolean }; Returns: string
                           },
"en_essai":
{ Args: Record<PropertyKey, never>; Returns: boolean
                           },
"marquer_chapitre_lu":
{ Args: { "p_chapitre": string }; Returns: undefined
                           },
"peut_lire_cours":
{ Args: { "p_cours": string }; Returns: boolean
                           },
"questions_tentative":
{ Args: { "p_tentative": string }; Returns: {
              "enonce": string,"ordre": number,"propositions": Json,"question_id": string,"reponse": Json,"type": Database["public"]['Enums']["type_question_t"]
            }[]
                           },
"repondre":
{ Args: { "p_question": string,"p_reponse": Json,"p_tentative": string }; Returns: string
                           },
"role_actuel":
{ Args: Record<PropertyKey, never>; Returns: Database["public"]['Enums']["role_t"]
                           },
"terminer_tentative":
{ Args: { "p_tentative": string }; Returns: undefined
                           }
          }
          Enums: {
            "role_t": "eleve"|"parent"|"enseignant"|"admin_contenu","statut_question_t": "brouillon"|"a_relire"|"valide","statut_tentative_t": "en_cours"|"terminee"|"expiree","type_question_t": "qcm_unique"|"qcm_multiple"|"vrai_faux"|"reponse_courte","type_tentative_t": "quiz_chapitre"|"revision"|"evaluation_cours","voie_t": "generale"|"technologique"|"professionnelle"
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
            "role_t": ["eleve", "parent", "enseignant", "admin_contenu"],"statut_question_t": ["brouillon", "a_relire", "valide"],"statut_tentative_t": ["en_cours", "terminee", "expiree"],"type_question_t": ["qcm_unique", "qcm_multiple", "vrai_faux", "reponse_courte"],"type_tentative_t": ["quiz_chapitre", "revision", "evaluation_cours"],"voie_t": ["generale", "technologique", "professionnelle"]
          }
        }
} as const
