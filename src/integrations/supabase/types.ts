export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      activity_logs: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          id: string
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          id?: string
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      admin_admissions: {
        Row: {
          admin_notes: string | null
          budget_level: string
          country: string
          country_flag: string
          created_at: string
          description_en: string
          description_fr: string
          external_link: string | null
          id: string
          institution_name: string
          institution_type: string
          intake: string
          is_featured: boolean
          is_published: boolean
          levels: string[]
          programs: string[]
          relevance_tags: string[]
          status: string
          updated_at: string
          why_fit_en: string
          why_fit_fr: string
        }
        Insert: {
          admin_notes?: string | null
          budget_level?: string
          country: string
          country_flag?: string
          created_at?: string
          description_en?: string
          description_fr?: string
          external_link?: string | null
          id?: string
          institution_name: string
          institution_type?: string
          intake?: string
          is_featured?: boolean
          is_published?: boolean
          levels?: string[]
          programs?: string[]
          relevance_tags?: string[]
          status?: string
          updated_at?: string
          why_fit_en?: string
          why_fit_fr?: string
        }
        Update: {
          admin_notes?: string | null
          budget_level?: string
          country?: string
          country_flag?: string
          created_at?: string
          description_en?: string
          description_fr?: string
          external_link?: string | null
          id?: string
          institution_name?: string
          institution_type?: string
          intake?: string
          is_featured?: boolean
          is_published?: boolean
          levels?: string[]
          programs?: string[]
          relevance_tags?: string[]
          status?: string
          updated_at?: string
          why_fit_en?: string
          why_fit_fr?: string
        }
        Relationships: []
      }
      admin_scholarships: {
        Row: {
          admin_notes: string | null
          budget_friendly: boolean
          country: string
          country_flag: string
          created_at: string
          deadline: string
          description_en: string
          description_fr: string
          eligibility_en: string
          eligibility_fr: string
          external_link: string | null
          funding_type: string
          id: string
          is_featured: boolean
          is_published: boolean
          levels: string[]
          name: string
          programs: string[]
          relevance_tags: string[]
          status: string
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          budget_friendly?: boolean
          country: string
          country_flag?: string
          created_at?: string
          deadline?: string
          description_en?: string
          description_fr?: string
          eligibility_en?: string
          eligibility_fr?: string
          external_link?: string | null
          funding_type?: string
          id?: string
          is_featured?: boolean
          is_published?: boolean
          levels?: string[]
          name: string
          programs?: string[]
          relevance_tags?: string[]
          status?: string
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          budget_friendly?: boolean
          country?: string
          country_flag?: string
          created_at?: string
          deadline?: string
          description_en?: string
          description_fr?: string
          eligibility_en?: string
          eligibility_fr?: string
          external_link?: string | null
          funding_type?: string
          id?: string
          is_featured?: boolean
          is_published?: boolean
          levels?: string[]
          name?: string
          programs?: string[]
          relevance_tags?: string[]
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      application_intents: {
        Row: {
          created_at: string
          id: string
          item_id: string
          item_name: string | null
          item_type: string
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          item_id: string
          item_name?: string | null
          item_type: string
          status?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          item_id?: string
          item_name?: string | null
          item_type?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author_name: string
          category: string
          content_en: string
          content_fr: string
          cover_image_url: string | null
          created_at: string
          excerpt_en: string
          excerpt_fr: string
          id: string
          is_published: boolean
          meta_description_en: string
          meta_description_fr: string
          meta_title_en: string
          meta_title_fr: string
          published_at: string | null
          reading_time_minutes: number
          slug: string
          tags: string[]
          title_en: string
          title_fr: string
          updated_at: string
        }
        Insert: {
          author_name?: string
          category?: string
          content_en?: string
          content_fr?: string
          cover_image_url?: string | null
          created_at?: string
          excerpt_en?: string
          excerpt_fr?: string
          id?: string
          is_published?: boolean
          meta_description_en?: string
          meta_description_fr?: string
          meta_title_en?: string
          meta_title_fr?: string
          published_at?: string | null
          reading_time_minutes?: number
          slug: string
          tags?: string[]
          title_en?: string
          title_fr?: string
          updated_at?: string
        }
        Update: {
          author_name?: string
          category?: string
          content_en?: string
          content_fr?: string
          cover_image_url?: string | null
          created_at?: string
          excerpt_en?: string
          excerpt_fr?: string
          id?: string
          is_published?: boolean
          meta_description_en?: string
          meta_description_fr?: string
          meta_title_en?: string
          meta_title_fr?: string
          published_at?: string | null
          reading_time_minutes?: number
          slug?: string
          tags?: string[]
          title_en?: string
          title_fr?: string
          updated_at?: string
        }
        Relationships: []
      }
      consultation_requests: {
        Row: {
          created_at: string
          id: string
          item_id: string | null
          item_name: string | null
          item_type: string | null
          message: string | null
          request_type: string
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          item_id?: string | null
          item_name?: string | null
          item_type?: string | null
          message?: string | null
          request_type?: string
          status?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          item_id?: string | null
          item_name?: string | null
          item_type?: string | null
          message?: string | null
          request_type?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      contact_requests: {
        Row: {
          category: string
          created_at: string
          email: string
          id: string
          message: string
          name: string
          status: string
        }
        Insert: {
          category?: string
          created_at?: string
          email: string
          id?: string
          message?: string
          name: string
          status?: string
        }
        Update: {
          category?: string
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          status?: string
        }
        Relationships: []
      }
      lead_scores: {
        Row: {
          actions_count: number
          admin_notes: string | null
          admin_status: string
          created_at: string
          heat_level: string
          id: string
          last_action: string | null
          last_action_at: string | null
          strong_signals: number
          updated_at: string
          user_id: string
        }
        Insert: {
          actions_count?: number
          admin_notes?: string | null
          admin_status?: string
          created_at?: string
          heat_level?: string
          id?: string
          last_action?: string | null
          last_action_at?: string | null
          strong_signals?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          actions_count?: number
          admin_notes?: string | null
          admin_status?: string
          created_at?: string
          heat_level?: string
          id?: string
          last_action?: string | null
          last_action_at?: string | null
          strong_signals?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      partner_programs: {
        Row: {
          application_intake: string
          application_process: string
          campus_name: string
          city: string
          country: string
          created_at: string
          degree_level: string
          duration: string
          eligibility_academic: string
          eligibility_language: string
          id: string
          is_featured: boolean
          is_published: boolean
          language_of_instruction: string
          notes_internal: string
          partner_status: string
          program_family: string
          program_name: string
          required_documents: string
          scholarship_available: string
          school_name: string
          school_slug: string
          source_url: string
          status: string
          tuition_amount: string
          tuition_currency: string
          tuition_period: string
          updated_at: string
        }
        Insert: {
          application_intake?: string
          application_process?: string
          campus_name?: string
          city?: string
          country: string
          created_at?: string
          degree_level?: string
          duration?: string
          eligibility_academic?: string
          eligibility_language?: string
          id?: string
          is_featured?: boolean
          is_published?: boolean
          language_of_instruction?: string
          notes_internal?: string
          partner_status?: string
          program_family?: string
          program_name: string
          required_documents?: string
          scholarship_available?: string
          school_name: string
          school_slug: string
          source_url?: string
          status?: string
          tuition_amount?: string
          tuition_currency?: string
          tuition_period?: string
          updated_at?: string
        }
        Update: {
          application_intake?: string
          application_process?: string
          campus_name?: string
          city?: string
          country?: string
          created_at?: string
          degree_level?: string
          duration?: string
          eligibility_academic?: string
          eligibility_language?: string
          id?: string
          is_featured?: boolean
          is_published?: boolean
          language_of_instruction?: string
          notes_internal?: string
          partner_status?: string
          program_family?: string
          program_name?: string
          required_documents?: string
          scholarship_available?: string
          school_name?: string
          school_slug?: string
          source_url?: string
          status?: string
          tuition_amount?: string
          tuition_currency?: string
          tuition_period?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          budget_sensitivity: string | null
          country_of_birth: string | null
          country_of_residence: string | null
          created_at: string
          desired_program: string | null
          dont_know_program: boolean | null
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          orientation_result: string | null
          phone_country: string | null
          preferred_destinations: string[] | null
          profile_completed: boolean | null
          scholarship_interest: boolean | null
          study_level: string | null
          updated_at: string
          user_id: string
          whatsapp: string | null
        }
        Insert: {
          budget_sensitivity?: string | null
          country_of_birth?: string | null
          country_of_residence?: string | null
          created_at?: string
          desired_program?: string | null
          dont_know_program?: boolean | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          orientation_result?: string | null
          phone_country?: string | null
          preferred_destinations?: string[] | null
          profile_completed?: boolean | null
          scholarship_interest?: boolean | null
          study_level?: string | null
          updated_at?: string
          user_id: string
          whatsapp?: string | null
        }
        Update: {
          budget_sensitivity?: string | null
          country_of_birth?: string | null
          country_of_residence?: string | null
          created_at?: string
          desired_program?: string | null
          dont_know_program?: boolean | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          orientation_result?: string | null
          phone_country?: string | null
          preferred_destinations?: string[] | null
          profile_completed?: boolean | null
          scholarship_interest?: boolean | null
          study_level?: string | null
          updated_at?: string
          user_id?: string
          whatsapp?: string | null
        }
        Relationships: []
      }
      questionnaire_responses: {
        Row: {
          answers: Json
          created_at: string
          id: string
          needs_advisor: boolean
          user_id: string | null
        }
        Insert: {
          answers?: Json
          created_at?: string
          id?: string
          needs_advisor?: boolean
          user_id?: string | null
        }
        Update: {
          answers?: Json
          created_at?: string
          id?: string
          needs_advisor?: boolean
          user_id?: string | null
        }
        Relationships: []
      }
      saved_items: {
        Row: {
          created_at: string
          id: string
          is_priority: boolean
          item_id: string
          item_type: Database["public"]["Enums"]["saved_item_type"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_priority?: boolean
          item_id: string
          item_type: Database["public"]["Enums"]["saved_item_type"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_priority?: boolean
          item_id?: string
          item_type?: Database["public"]["Enums"]["saved_item_type"]
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      saved_item_type: "scholarship" | "admission" | "destination"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

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
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
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
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
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
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
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
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
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
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
      saved_item_type: ["scholarship", "admission", "destination"],
    },
  },
} as const
