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
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      consultations: {
        Row: {
          academic_level: string | null
          created_at: string
          description: string | null
          field_slug: string | null
          full_name: string
          id: string
          mobile: string
          service_slug: string | null
          status: string
        }
        Insert: {
          academic_level?: string | null
          created_at?: string
          description?: string | null
          field_slug?: string | null
          full_name: string
          id?: string
          mobile: string
          service_slug?: string | null
          status?: string
        }
        Update: {
          academic_level?: string | null
          created_at?: string
          description?: string | null
          field_slug?: string | null
          full_name?: string
          id?: string
          mobile?: string
          service_slug?: string | null
          status?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          body: string
          created_at: string
          id: string
          request_id: string
          sender_id: string
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          request_id: string
          sender_id: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          request_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "thesis_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          id: string
          invoice_number: string | null
          milestone: string
          request_id: string
          status: string
          student_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          invoice_number?: string | null
          milestone: string
          request_id: string
          status?: string
          student_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          invoice_number?: string | null
          milestone?: string
          request_id?: string
          status?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "thesis_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          academic_level: string | null
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string
          id: string
          major: string | null
          mobile: string | null
          university: string | null
          updated_at: string
        }
        Insert: {
          academic_level?: string | null
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string
          id: string
          major?: string | null
          mobile?: string | null
          university?: string | null
          updated_at?: string
        }
        Update: {
          academic_level?: string | null
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          major?: string | null
          mobile?: string | null
          university?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      proposals: {
        Row: {
          created_at: string
          delivery_days: number
          id: string
          message: string | null
          price: number
          request_id: string
          researcher_id: string
          status: string
        }
        Insert: {
          created_at?: string
          delivery_days: number
          id?: string
          message?: string | null
          price: number
          request_id: string
          researcher_id: string
          status?: string
        }
        Update: {
          created_at?: string
          delivery_days?: number
          id?: string
          message?: string | null
          price?: number
          request_id?: string
          researcher_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "proposals_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "thesis_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      researcher_profiles: {
        Row: {
          approved: boolean
          avatar_url: string | null
          bio: string | null
          created_at: string
          degree: string
          display_name: string
          experience_years: number
          field_slug: string
          hourly_price: number
          id: string
          major: string | null
          portfolio: string[]
          project_price_max: number | null
          project_price_min: number | null
          projects_count: number
          publications: string[]
          rating: number
          research_interests: string | null
          reviews_count: number
          skills: string[]
          slug: string
          specialties: string[]
          university: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          approved?: boolean
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          degree?: string
          display_name: string
          experience_years?: number
          field_slug?: string
          hourly_price?: number
          id?: string
          major?: string | null
          portfolio?: string[]
          project_price_max?: number | null
          project_price_min?: number | null
          projects_count?: number
          publications?: string[]
          rating?: number
          research_interests?: string | null
          reviews_count?: number
          skills?: string[]
          slug: string
          specialties?: string[]
          university?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          approved?: boolean
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          degree?: string
          display_name?: string
          experience_years?: number
          field_slug?: string
          hourly_price?: number
          id?: string
          major?: string | null
          portfolio?: string[]
          project_price_max?: number | null
          project_price_min?: number | null
          projects_count?: number
          publications?: string[]
          rating?: number
          research_interests?: string | null
          reviews_count?: number
          skills?: string[]
          slug?: string
          specialties?: string[]
          university?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      thesis_requests: {
        Row: {
          academic_level: string
          budget: string | null
          complexity: string
          created_at: string
          deadline: string | null
          description: string | null
          estimate_max: number | null
          estimate_min: number | null
          field_slug: string
          id: string
          major: string | null
          research_method: string | null
          selected_researcher_id: string | null
          service_slug: string
          status: string
          student_id: string
          topic: string
          university: string | null
          updated_at: string
          urgency: string
        }
        Insert: {
          academic_level: string
          budget?: string | null
          complexity: string
          created_at?: string
          deadline?: string | null
          description?: string | null
          estimate_max?: number | null
          estimate_min?: number | null
          field_slug: string
          id?: string
          major?: string | null
          research_method?: string | null
          selected_researcher_id?: string | null
          service_slug: string
          status?: string
          student_id: string
          topic: string
          university?: string | null
          updated_at?: string
          urgency: string
        }
        Update: {
          academic_level?: string
          budget?: string | null
          complexity?: string
          created_at?: string
          deadline?: string | null
          description?: string | null
          estimate_max?: number | null
          estimate_min?: number | null
          field_slug?: string
          id?: string
          major?: string | null
          research_method?: string | null
          selected_researcher_id?: string | null
          service_slug?: string
          status?: string
          student_id?: string
          topic?: string
          university?: string | null
          updated_at?: string
          urgency?: string
        }
        Relationships: [
          {
            foreignKeyName: "thesis_requests_selected_researcher_id_fkey"
            columns: ["selected_researcher_id"]
            isOneToOne: false
            referencedRelation: "researcher_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
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
      app_role: "student" | "researcher" | "admin"
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
      app_role: ["student", "researcher", "admin"],
    },
  },
} as const
