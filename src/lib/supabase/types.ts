
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
                }
          }
          Views: {
            [_ in never]: never
          }
          Functions: {
            "en_essai":
{ Args: Record<PropertyKey, never>; Returns: boolean
                           },
"peut_lire_cours":
{ Args: { "p_cours": string }; Returns: boolean
                           },
"role_actuel":
{ Args: Record<PropertyKey, never>; Returns: Database["public"]['Enums']["role_t"]
                           }
          }
          Enums: {
            "role_t": "eleve"|"parent"|"enseignant"|"admin_contenu","statut_question_t": "brouillon"|"a_relire"|"valide","type_question_t": "qcm_unique"|"qcm_multiple"|"vrai_faux"|"reponse_courte","voie_t": "generale"|"technologique"|"professionnelle"
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
            "role_t": ["eleve", "parent", "enseignant", "admin_contenu"],"statut_question_t": ["brouillon", "a_relire", "valide"],"type_question_t": ["qcm_unique", "qcm_multiple", "vrai_faux", "reponse_courte"],"voie_t": ["generale", "technologique", "professionnelle"]
          }
        }
} as const
