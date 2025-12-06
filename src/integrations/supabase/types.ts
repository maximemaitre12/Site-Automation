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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      accounting_entries: {
        Row: {
          account_code: string
          created_at: string
          credit_amount: number | null
          debit_amount: number | null
          description: string | null
          entry_date: string | null
          id: string
          invoice_id: string | null
          is_suggested: boolean | null
          user_id: string
        }
        Insert: {
          account_code: string
          created_at?: string
          credit_amount?: number | null
          debit_amount?: number | null
          description?: string | null
          entry_date?: string | null
          id?: string
          invoice_id?: string | null
          is_suggested?: boolean | null
          user_id: string
        }
        Update: {
          account_code?: string
          created_at?: string
          credit_amount?: number | null
          debit_amount?: number | null
          description?: string | null
          entry_date?: string | null
          id?: string
          invoice_id?: string | null
          is_suggested?: boolean | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "accounting_entries_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          company_id: string | null
          created_at: string
          id: string
          ip_address: string | null
          metadata: Json | null
          resource_id: string | null
          resource_type: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          company_id?: string | null
          created_at?: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          resource_id?: string | null
          resource_type: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          company_id?: string | null
          created_at?: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          resource_id?: string | null
          resource_type?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      audits: {
        Row: {
          audit_type: string
          compliance_score: number | null
          created_at: string
          id: string
          input_text: string | null
          recommendations: Json | null
          report_content: string | null
          risks: Json | null
          status: string | null
          title: string
          user_id: string
        }
        Insert: {
          audit_type: string
          compliance_score?: number | null
          created_at?: string
          id?: string
          input_text?: string | null
          recommendations?: Json | null
          report_content?: string | null
          risks?: Json | null
          status?: string | null
          title: string
          user_id: string
        }
        Update: {
          audit_type?: string
          compliance_score?: number | null
          created_at?: string
          id?: string
          input_text?: string | null
          recommendations?: Json | null
          report_content?: string | null
          risks?: Json | null
          status?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      call_analyses: {
        Row: {
          created_at: string
          id: string
          key_points: Json | null
          next_steps: Json | null
          objections: Json | null
          sentiment: string | null
          summary: string | null
          title: string
          transcript: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          key_points?: Json | null
          next_steps?: Json | null
          objections?: Json | null
          sentiment?: string | null
          summary?: string | null
          title: string
          transcript?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          key_points?: Json | null
          next_steps?: Json | null
          objections?: Json | null
          sentiment?: string | null
          summary?: string | null
          title?: string
          transcript?: string | null
          user_id?: string
        }
        Relationships: []
      }
      candidates: {
        Row: {
          ai_analysis: Json | null
          created_at: string
          cv_text: string | null
          cv_url: string | null
          email: string | null
          experience_years: number | null
          id: string
          interview_notes: string | null
          job_id: string | null
          match_score: number | null
          name: string
          phone: string | null
          skills: Json | null
          status: string | null
          user_id: string
        }
        Insert: {
          ai_analysis?: Json | null
          created_at?: string
          cv_text?: string | null
          cv_url?: string | null
          email?: string | null
          experience_years?: number | null
          id?: string
          interview_notes?: string | null
          job_id?: string | null
          match_score?: number | null
          name: string
          phone?: string | null
          skills?: Json | null
          status?: string | null
          user_id: string
        }
        Update: {
          ai_analysis?: Json | null
          created_at?: string
          cv_text?: string | null
          cv_url?: string | null
          email?: string | null
          experience_years?: number | null
          id?: string
          interview_notes?: string | null
          job_id?: string | null
          match_score?: number | null
          name?: string
          phone?: string | null
          skills?: Json | null
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "candidates_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "job_descriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          created_at: string
          id: string
          logo_url: string | null
          max_storage_mb: number | null
          max_users: number | null
          name: string
          primary_color: string | null
          settings: Json | null
          slug: string
          subscription_tier: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          logo_url?: string | null
          max_storage_mb?: number | null
          max_users?: number | null
          name: string
          primary_color?: string | null
          settings?: Json | null
          slug: string
          subscription_tier?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          logo_url?: string | null
          max_storage_mb?: number | null
          max_users?: number | null
          name?: string
          primary_color?: string | null
          settings?: Json | null
          slug?: string
          subscription_tier?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      conversations: {
        Row: {
          created_at: string
          id: string
          messages: Json | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          messages?: Json | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          messages?: Json | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      datasets: {
        Row: {
          ai_insights: Json | null
          ai_summary: string | null
          anomalies: Json | null
          column_count: number | null
          columns_info: Json | null
          created_at: string
          description: string | null
          file_url: string | null
          id: string
          name: string
          recommendations: Json | null
          row_count: number | null
          user_id: string
        }
        Insert: {
          ai_insights?: Json | null
          ai_summary?: string | null
          anomalies?: Json | null
          column_count?: number | null
          columns_info?: Json | null
          created_at?: string
          description?: string | null
          file_url?: string | null
          id?: string
          name: string
          recommendations?: Json | null
          row_count?: number | null
          user_id: string
        }
        Update: {
          ai_insights?: Json | null
          ai_summary?: string | null
          anomalies?: Json | null
          column_count?: number | null
          columns_info?: Json | null
          created_at?: string
          description?: string | null
          file_url?: string | null
          id?: string
          name?: string
          recommendations?: Json | null
          row_count?: number | null
          user_id?: string
        }
        Relationships: []
      }
      documents: {
        Row: {
          analysis: Json | null
          content: Json | null
          created_at: string
          file_type: string | null
          file_url: string | null
          id: string
          improved_content: string | null
          ocr_text: string | null
          raw_text: string | null
          status: string | null
          summary: string | null
          tags: Json | null
          template_id: string | null
          title: string
          type: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          analysis?: Json | null
          content?: Json | null
          created_at?: string
          file_type?: string | null
          file_url?: string | null
          id?: string
          improved_content?: string | null
          ocr_text?: string | null
          raw_text?: string | null
          status?: string | null
          summary?: string | null
          tags?: Json | null
          template_id?: string | null
          title: string
          type?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          analysis?: Json | null
          content?: Json | null
          created_at?: string
          file_type?: string | null
          file_url?: string | null
          id?: string
          improved_content?: string | null
          ocr_text?: string | null
          raw_text?: string | null
          status?: string | null
          summary?: string | null
          tags?: Json | null
          template_id?: string | null
          title?: string
          type?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "templates"
            referencedColumns: ["id"]
          },
        ]
      }
      internal_docs: {
        Row: {
          content: string | null
          created_at: string
          doc_type: string | null
          file_url: string | null
          id: string
          tags: Json | null
          title: string
          user_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          doc_type?: string | null
          file_url?: string | null
          id?: string
          tags?: Json | null
          title: string
          user_id: string
        }
        Update: {
          content?: string | null
          created_at?: string
          doc_type?: string | null
          file_url?: string | null
          id?: string
          tags?: Json | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      invoices: {
        Row: {
          amount: number | null
          anomaly_notes: string | null
          category: string | null
          created_at: string
          currency: string | null
          due_date: string | null
          file_url: string | null
          id: string
          invoice_date: string | null
          invoice_number: string | null
          ocr_data: Json | null
          status: string | null
          tax_amount: number | null
          user_id: string
          vendor_name: string
        }
        Insert: {
          amount?: number | null
          anomaly_notes?: string | null
          category?: string | null
          created_at?: string
          currency?: string | null
          due_date?: string | null
          file_url?: string | null
          id?: string
          invoice_date?: string | null
          invoice_number?: string | null
          ocr_data?: Json | null
          status?: string | null
          tax_amount?: number | null
          user_id: string
          vendor_name: string
        }
        Update: {
          amount?: number | null
          anomaly_notes?: string | null
          category?: string | null
          created_at?: string
          currency?: string | null
          due_date?: string | null
          file_url?: string | null
          id?: string
          invoice_date?: string | null
          invoice_number?: string | null
          ocr_data?: Json | null
          status?: string | null
          tax_amount?: number | null
          user_id?: string
          vendor_name?: string
        }
        Relationships: []
      }
      job_descriptions: {
        Row: {
          created_at: string
          department: string | null
          description: string | null
          id: string
          is_active: boolean | null
          requirements: Json | null
          salary_range: string | null
          skills: Json | null
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          department?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          requirements?: Json | null
          salary_range?: string | null
          skills?: Json | null
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          department?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          requirements?: Json | null
          salary_range?: string | null
          skills?: Json | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      notes: {
        Row: {
          content: string | null
          created_at: string
          id: string
          is_pinned: boolean | null
          tags: Json | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: string
          is_pinned?: boolean | null
          tags?: Json | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: string
          is_pinned?: boolean | null
          tags?: Json | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          company: string | null
          company_id: string | null
          created_at: string
          full_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          company?: string | null
          company_id?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          company?: string | null
          company_id?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      sales_proposals: {
        Row: {
          created_at: string
          email_draft: string | null
          generated_proposal: string | null
          id: string
          objections: string | null
          persona: string | null
          product_name: string | null
          prospect_name: string | null
          prospect_score: number | null
          score_justification: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email_draft?: string | null
          generated_proposal?: string | null
          id?: string
          objections?: string | null
          persona?: string | null
          product_name?: string | null
          prospect_name?: string | null
          prospect_score?: number | null
          score_justification?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email_draft?: string | null
          generated_proposal?: string | null
          id?: string
          objections?: string | null
          persona?: string | null
          product_name?: string | null
          prospect_name?: string | null
          prospect_score?: number | null
          score_justification?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      support_tickets: {
        Row: {
          actual_response: string | null
          ai_classification: Json | null
          ai_suggested_response: string | null
          category: string | null
          content: string | null
          created_at: string
          customer_email: string | null
          id: string
          priority: string | null
          resolved_at: string | null
          satisfaction_score: number | null
          status: string | null
          subject: string
          ticket_number: string
          user_id: string
        }
        Insert: {
          actual_response?: string | null
          ai_classification?: Json | null
          ai_suggested_response?: string | null
          category?: string | null
          content?: string | null
          created_at?: string
          customer_email?: string | null
          id?: string
          priority?: string | null
          resolved_at?: string | null
          satisfaction_score?: number | null
          status?: string | null
          subject: string
          ticket_number: string
          user_id: string
        }
        Update: {
          actual_response?: string | null
          ai_classification?: Json | null
          ai_suggested_response?: string | null
          category?: string | null
          content?: string | null
          created_at?: string
          customer_email?: string | null
          id?: string
          priority?: string | null
          resolved_at?: string | null
          satisfaction_score?: number | null
          status?: string | null
          subject?: string
          ticket_number?: string
          user_id?: string
        }
        Relationships: []
      }
      templates: {
        Row: {
          content: Json | null
          created_at: string
          description: string | null
          id: string
          is_default: boolean | null
          tags: Json | null
          title: string
          type: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          content?: Json | null
          created_at?: string
          description?: string | null
          id?: string
          is_default?: boolean | null
          tags?: Json | null
          title: string
          type?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: Json | null
          created_at?: string
          description?: string | null
          id?: string
          is_default?: boolean | null
          tags?: Json | null
          title?: string
          type?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          company_id: string
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          company_id: string
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          company_id?: string
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      workflow_runs: {
        Row: {
          completed_at: string | null
          created_at: string
          error_message: string | null
          id: string
          input_data: Json | null
          output_data: Json | null
          started_at: string | null
          status: string | null
          user_id: string
          workflow_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          input_data?: Json | null
          output_data?: Json | null
          started_at?: string | null
          status?: string | null
          user_id: string
          workflow_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          input_data?: Json | null
          output_data?: Json | null
          started_at?: string | null
          status?: string | null
          user_id?: string
          workflow_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workflow_runs_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "workflows"
            referencedColumns: ["id"]
          },
        ]
      }
      workflows: {
        Row: {
          blocks: Json | null
          created_at: string
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          blocks?: Json | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          blocks?: Json | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_company_id: { Args: { _user_id: string }; Returns: string }
      has_min_role: {
        Args: {
          _company_id: string
          _min_role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "owner" | "admin" | "manager" | "editor" | "viewer"
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
      app_role: ["owner", "admin", "manager", "editor", "viewer"],
    },
  },
} as const
