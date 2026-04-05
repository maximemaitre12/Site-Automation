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
      aether_documents: {
        Row: {
          access_level: string | null
          ai_entities: Json | null
          ai_keywords: Json | null
          ai_summary: string | null
          company_id: string | null
          content: string | null
          created_at: string
          description: string | null
          embedding_status: string | null
          extracted_data: Json | null
          file_size: number | null
          file_type: string | null
          file_url: string | null
          folder_id: string | null
          id: string
          is_archived: boolean | null
          is_favorite: boolean | null
          metadata: Json | null
          status: string | null
          tags: Json | null
          template_id: string | null
          title: string
          updated_at: string
          user_id: string
          version: number | null
        }
        Insert: {
          access_level?: string | null
          ai_entities?: Json | null
          ai_keywords?: Json | null
          ai_summary?: string | null
          company_id?: string | null
          content?: string | null
          created_at?: string
          description?: string | null
          embedding_status?: string | null
          extracted_data?: Json | null
          file_size?: number | null
          file_type?: string | null
          file_url?: string | null
          folder_id?: string | null
          id?: string
          is_archived?: boolean | null
          is_favorite?: boolean | null
          metadata?: Json | null
          status?: string | null
          tags?: Json | null
          template_id?: string | null
          title: string
          updated_at?: string
          user_id: string
          version?: number | null
        }
        Update: {
          access_level?: string | null
          ai_entities?: Json | null
          ai_keywords?: Json | null
          ai_summary?: string | null
          company_id?: string | null
          content?: string | null
          created_at?: string
          description?: string | null
          embedding_status?: string | null
          extracted_data?: Json | null
          file_size?: number | null
          file_type?: string | null
          file_url?: string | null
          folder_id?: string | null
          id?: string
          is_archived?: boolean | null
          is_favorite?: boolean | null
          metadata?: Json | null
          status?: string | null
          tags?: Json | null
          template_id?: string | null
          title?: string
          updated_at?: string
          user_id?: string
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "aether_documents_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "aether_documents_folder_id_fkey"
            columns: ["folder_id"]
            isOneToOne: false
            referencedRelation: "doc_folders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "aether_documents_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "doc_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_context: {
        Row: {
          agent_type: string
          created_at: string | null
          entity_id: string
          entity_type: string
          id: string
          metadata: Json | null
          user_id: string
        }
        Insert: {
          agent_type: string
          created_at?: string | null
          entity_id: string
          entity_type: string
          id?: string
          metadata?: Json | null
          user_id: string
        }
        Update: {
          agent_type?: string
          created_at?: string | null
          entity_id?: string
          entity_type?: string
          id?: string
          metadata?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      ai_anomalies: {
        Row: {
          anomaly_type: string
          created_at: string
          description: string | null
          detected_value: number | null
          deviation_percent: number | null
          entity_id: string | null
          entity_type: string | null
          expected_value: number | null
          id: string
          is_resolved: boolean | null
          resolved_at: string | null
          severity: string
          title: string
          user_id: string
        }
        Insert: {
          anomaly_type: string
          created_at?: string
          description?: string | null
          detected_value?: number | null
          deviation_percent?: number | null
          entity_id?: string | null
          entity_type?: string | null
          expected_value?: number | null
          id?: string
          is_resolved?: boolean | null
          resolved_at?: string | null
          severity?: string
          title: string
          user_id: string
        }
        Update: {
          anomaly_type?: string
          created_at?: string
          description?: string | null
          detected_value?: number | null
          deviation_percent?: number | null
          entity_id?: string | null
          entity_type?: string | null
          expected_value?: number | null
          id?: string
          is_resolved?: boolean | null
          resolved_at?: string | null
          severity?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      ai_automation_logs: {
        Row: {
          action_taken: string | null
          created_at: string
          error_message: string | null
          execution_time_ms: number | null
          id: string
          result: string | null
          rule_id: string | null
          rule_name: string | null
          trigger_data: Json | null
          user_id: string
        }
        Insert: {
          action_taken?: string | null
          created_at?: string
          error_message?: string | null
          execution_time_ms?: number | null
          id?: string
          result?: string | null
          rule_id?: string | null
          rule_name?: string | null
          trigger_data?: Json | null
          user_id: string
        }
        Update: {
          action_taken?: string | null
          created_at?: string
          error_message?: string | null
          execution_time_ms?: number | null
          id?: string
          result?: string | null
          rule_id?: string | null
          rule_name?: string | null
          trigger_data?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_automation_logs_rule_id_fkey"
            columns: ["rule_id"]
            isOneToOne: false
            referencedRelation: "ai_automation_rules"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_automation_rules: {
        Row: {
          action_config: Json
          action_type: string
          created_at: string
          description: string | null
          execution_count: number | null
          id: string
          is_active: boolean | null
          last_executed_at: string | null
          name: string
          trigger_conditions: Json
          trigger_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          action_config?: Json
          action_type: string
          created_at?: string
          description?: string | null
          execution_count?: number | null
          id?: string
          is_active?: boolean | null
          last_executed_at?: string | null
          name: string
          trigger_conditions?: Json
          trigger_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          action_config?: Json
          action_type?: string
          created_at?: string
          description?: string | null
          execution_count?: number | null
          id?: string
          is_active?: boolean | null
          last_executed_at?: string | null
          name?: string
          trigger_conditions?: Json
          trigger_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      ai_insights: {
        Row: {
          content: string | null
          created_at: string | null
          expires_at: string | null
          id: string
          insight_type: string
          is_dismissed: boolean | null
          is_read: boolean | null
          priority: number | null
          related_entities: Json | null
          source_agent: string
          title: string
          user_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          insight_type: string
          is_dismissed?: boolean | null
          is_read?: boolean | null
          priority?: number | null
          related_entities?: Json | null
          source_agent: string
          title: string
          user_id: string
        }
        Update: {
          content?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          insight_type?: string
          is_dismissed?: boolean | null
          is_read?: boolean | null
          priority?: number | null
          related_entities?: Json | null
          source_agent?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      ai_predictions: {
        Row: {
          confidence_score: number | null
          created_at: string
          entity_id: string | null
          entity_type: string
          factors: Json | null
          id: string
          model_version: string | null
          prediction_date: string
          prediction_type: string
          prediction_value: number | null
          updated_at: string
          user_id: string
          valid_until: string | null
        }
        Insert: {
          confidence_score?: number | null
          created_at?: string
          entity_id?: string | null
          entity_type: string
          factors?: Json | null
          id?: string
          model_version?: string | null
          prediction_date?: string
          prediction_type: string
          prediction_value?: number | null
          updated_at?: string
          user_id: string
          valid_until?: string | null
        }
        Update: {
          confidence_score?: number | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string
          factors?: Json | null
          id?: string
          model_version?: string | null
          prediction_date?: string
          prediction_type?: string
          prediction_value?: number | null
          updated_at?: string
          user_id?: string
          valid_until?: string | null
        }
        Relationships: []
      }
      ai_segments: {
        Row: {
          avg_score: number | null
          cluster_id: number | null
          created_at: string
          criteria: Json | null
          description: string | null
          id: string
          member_count: number | null
          name: string
          segment_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avg_score?: number | null
          cluster_id?: number | null
          created_at?: string
          criteria?: Json | null
          description?: string | null
          id?: string
          member_count?: number | null
          name: string
          segment_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avg_score?: number | null
          cluster_id?: number | null
          created_at?: string
          criteria?: Json | null
          description?: string | null
          id?: string
          member_count?: number | null
          name?: string
          segment_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      ai_suggested_actions: {
        Row: {
          action_data: Json | null
          action_type: string
          created_at: string | null
          description: string | null
          executed_at: string | null
          id: string
          status: string | null
          target_agent: string
          title: string
          user_id: string
        }
        Insert: {
          action_data?: Json | null
          action_type: string
          created_at?: string | null
          description?: string | null
          executed_at?: string | null
          id?: string
          status?: string | null
          target_agent: string
          title: string
          user_id: string
        }
        Update: {
          action_data?: Json | null
          action_type?: string
          created_at?: string | null
          description?: string | null
          executed_at?: string | null
          id?: string
          status?: string | null
          target_agent?: string
          title?: string
          user_id?: string
        }
        Relationships: []
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
          deal_id: string | null
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
          deal_id?: string | null
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
          deal_id?: string | null
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
        Relationships: [
          {
            foreignKeyName: "call_analyses_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "sales_deals"
            referencedColumns: ["id"]
          },
        ]
      }
      candidate_interviews: {
        Row: {
          ai_report: Json | null
          ai_suggested_questions: Json | null
          audio_duration_seconds: number | null
          audio_recording_url: string | null
          behavioral_evaluation: Json | null
          candidate_id: string
          created_at: string | null
          cultural_fit_evaluation: Json | null
          duration_minutes: number | null
          feedback_rating: number | null
          id: string
          interview_type: string | null
          interviewers: Json | null
          location: string | null
          match_breakdown: Json | null
          match_score: number | null
          notes: string | null
          outcome: string | null
          recruiter_feedback: string | null
          reminder_sent_at: string | null
          scheduled_at: string
          status: string | null
          technical_evaluation: Json | null
          transcript: string | null
          updated_at: string | null
          user_id: string
          voice_analysis: Json | null
        }
        Insert: {
          ai_report?: Json | null
          ai_suggested_questions?: Json | null
          audio_duration_seconds?: number | null
          audio_recording_url?: string | null
          behavioral_evaluation?: Json | null
          candidate_id: string
          created_at?: string | null
          cultural_fit_evaluation?: Json | null
          duration_minutes?: number | null
          feedback_rating?: number | null
          id?: string
          interview_type?: string | null
          interviewers?: Json | null
          location?: string | null
          match_breakdown?: Json | null
          match_score?: number | null
          notes?: string | null
          outcome?: string | null
          recruiter_feedback?: string | null
          reminder_sent_at?: string | null
          scheduled_at: string
          status?: string | null
          technical_evaluation?: Json | null
          transcript?: string | null
          updated_at?: string | null
          user_id: string
          voice_analysis?: Json | null
        }
        Update: {
          ai_report?: Json | null
          ai_suggested_questions?: Json | null
          audio_duration_seconds?: number | null
          audio_recording_url?: string | null
          behavioral_evaluation?: Json | null
          candidate_id?: string
          created_at?: string | null
          cultural_fit_evaluation?: Json | null
          duration_minutes?: number | null
          feedback_rating?: number | null
          id?: string
          interview_type?: string | null
          interviewers?: Json | null
          location?: string | null
          match_breakdown?: Json | null
          match_score?: number | null
          notes?: string | null
          outcome?: string | null
          recruiter_feedback?: string | null
          reminder_sent_at?: string | null
          scheduled_at?: string
          status?: string | null
          technical_evaluation?: Json | null
          transcript?: string | null
          updated_at?: string | null
          user_id?: string
          voice_analysis?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "candidate_interviews_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
        ]
      }
      candidates: {
        Row: {
          ai_analysis: Json | null
          company_id: string | null
          created_at: string
          cv_file_url: string | null
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
          company_id?: string | null
          created_at?: string
          cv_file_url?: string | null
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
          company_id?: string | null
          created_at?: string
          cv_file_url?: string | null
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
            foreignKeyName: "candidates_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "candidates_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "job_descriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      chatbot_knowledge: {
        Row: {
          category: string
          content: string
          created_at: string | null
          id: string
          is_active: boolean | null
          keywords: string[] | null
          language: string | null
          priority: number | null
          search_vector: unknown
          title: string
          updated_at: string | null
        }
        Insert: {
          category: string
          content: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          keywords?: string[] | null
          language?: string | null
          priority?: number | null
          search_vector?: unknown
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          content?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          keywords?: string[] | null
          language?: string | null
          priority?: number | null
          search_vector?: unknown
          title?: string
          updated_at?: string | null
        }
        Relationships: []
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
      company_alerts: {
        Row: {
          alert_type: string
          company_id: string
          content: string | null
          created_at: string
          detected_at: string
          id: string
          is_read: boolean | null
          severity: string | null
          source_name: string | null
          source_url: string | null
          title: string
          user_id: string
        }
        Insert: {
          alert_type: string
          company_id: string
          content?: string | null
          created_at?: string
          detected_at?: string
          id?: string
          is_read?: boolean | null
          severity?: string | null
          source_name?: string | null
          source_url?: string | null
          title: string
          user_id: string
        }
        Update: {
          alert_type?: string
          company_id?: string
          content?: string | null
          created_at?: string
          detected_at?: string
          id?: string
          is_read?: boolean | null
          severity?: string | null
          source_name?: string | null
          source_url?: string | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_alerts_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "enriched_companies"
            referencedColumns: ["id"]
          },
        ]
      }
      company_financials: {
        Row: {
          cash: number | null
          company_id: string
          created_at: string
          current_ratio: number | null
          debt: number | null
          debt_ratio: number | null
          ebitda: number | null
          equity: number | null
          fiscal_year: number
          gross_margin: number | null
          id: string
          is_verified: boolean | null
          net_income: number | null
          operating_income: number | null
          profit_margin: number | null
          revenue: number | null
          roe: number | null
          source: string | null
          source_date: string | null
          total_assets: number | null
          user_id: string
        }
        Insert: {
          cash?: number | null
          company_id: string
          created_at?: string
          current_ratio?: number | null
          debt?: number | null
          debt_ratio?: number | null
          ebitda?: number | null
          equity?: number | null
          fiscal_year: number
          gross_margin?: number | null
          id?: string
          is_verified?: boolean | null
          net_income?: number | null
          operating_income?: number | null
          profit_margin?: number | null
          revenue?: number | null
          roe?: number | null
          source?: string | null
          source_date?: string | null
          total_assets?: number | null
          user_id: string
        }
        Update: {
          cash?: number | null
          company_id?: string
          created_at?: string
          current_ratio?: number | null
          debt?: number | null
          debt_ratio?: number | null
          ebitda?: number | null
          equity?: number | null
          fiscal_year?: number
          gross_margin?: number | null
          id?: string
          is_verified?: boolean | null
          net_income?: number | null
          operating_income?: number | null
          profit_margin?: number | null
          revenue?: number | null
          roe?: number | null
          source?: string | null
          source_date?: string | null
          total_assets?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_financials_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "enriched_companies"
            referencedColumns: ["id"]
          },
        ]
      }
      compliance_alerts: {
        Row: {
          affected_records: number | null
          affected_table: string | null
          alert_type: string
          company_id: string | null
          created_at: string
          description: string | null
          id: string
          is_resolved: boolean | null
          regulation_reference: string | null
          remediation_steps: Json | null
          resolved_at: string | null
          resolved_by: string | null
          scan_id: string | null
          severity: string
          title: string
          user_id: string
        }
        Insert: {
          affected_records?: number | null
          affected_table?: string | null
          alert_type: string
          company_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_resolved?: boolean | null
          regulation_reference?: string | null
          remediation_steps?: Json | null
          resolved_at?: string | null
          resolved_by?: string | null
          scan_id?: string | null
          severity: string
          title: string
          user_id: string
        }
        Update: {
          affected_records?: number | null
          affected_table?: string | null
          alert_type?: string
          company_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_resolved?: boolean | null
          regulation_reference?: string | null
          remediation_steps?: Json | null
          resolved_at?: string | null
          resolved_by?: string | null
          scan_id?: string | null
          severity?: string
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "compliance_alerts_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "compliance_alerts_scan_id_fkey"
            columns: ["scan_id"]
            isOneToOne: false
            referencedRelation: "compliance_scans"
            referencedColumns: ["id"]
          },
        ]
      }
      compliance_scans: {
        Row: {
          company_id: string | null
          completed_at: string | null
          created_at: string
          critical_issues: number | null
          data_sources_scanned: Json | null
          findings: Json | null
          id: string
          issues_found: number | null
          overall_score: number | null
          recommendations: Json | null
          records_analyzed: number | null
          regulations_checked: Json | null
          scan_type: string
          started_at: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          company_id?: string | null
          completed_at?: string | null
          created_at?: string
          critical_issues?: number | null
          data_sources_scanned?: Json | null
          findings?: Json | null
          id?: string
          issues_found?: number | null
          overall_score?: number | null
          recommendations?: Json | null
          records_analyzed?: number | null
          regulations_checked?: Json | null
          scan_type: string
          started_at?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          company_id?: string | null
          completed_at?: string | null
          created_at?: string
          critical_issues?: number | null
          data_sources_scanned?: Json | null
          findings?: Json | null
          id?: string
          issues_found?: number | null
          overall_score?: number | null
          recommendations?: Json | null
          records_analyzed?: number | null
          regulations_checked?: Json | null
          scan_type?: string
          started_at?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "compliance_scans_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
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
      crm_activities: {
        Row: {
          activity_date: string
          activity_type: string
          ai_summary: string | null
          company_id: string | null
          contact_id: string | null
          created_at: string
          description: string | null
          id: string
          metadata: Json | null
          opportunity_id: string | null
          sentiment: string | null
          subject: string
          user_id: string
        }
        Insert: {
          activity_date?: string
          activity_type: string
          ai_summary?: string | null
          company_id?: string | null
          contact_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          opportunity_id?: string | null
          sentiment?: string | null
          subject: string
          user_id: string
        }
        Update: {
          activity_date?: string
          activity_type?: string
          ai_summary?: string | null
          company_id?: string | null
          contact_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          opportunity_id?: string | null
          sentiment?: string | null
          subject?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "crm_activities_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "crm_companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_activities_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "crm_contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_activities_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "crm_opportunities"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_companies: {
        Row: {
          address: string | null
          ai_enrichment: Json | null
          annual_revenue: number | null
          city: string | null
          country: string | null
          created_at: string
          description: string | null
          email: string | null
          employees_count: number | null
          id: string
          industry: string | null
          linkedin_url: string | null
          logo_url: string | null
          name: string
          phone: string | null
          tags: Json | null
          updated_at: string
          user_id: string
          website: string | null
        }
        Insert: {
          address?: string | null
          ai_enrichment?: Json | null
          annual_revenue?: number | null
          city?: string | null
          country?: string | null
          created_at?: string
          description?: string | null
          email?: string | null
          employees_count?: number | null
          id?: string
          industry?: string | null
          linkedin_url?: string | null
          logo_url?: string | null
          name: string
          phone?: string | null
          tags?: Json | null
          updated_at?: string
          user_id: string
          website?: string | null
        }
        Update: {
          address?: string | null
          ai_enrichment?: Json | null
          annual_revenue?: number | null
          city?: string | null
          country?: string | null
          created_at?: string
          description?: string | null
          email?: string | null
          employees_count?: number | null
          id?: string
          industry?: string | null
          linkedin_url?: string | null
          logo_url?: string | null
          name?: string
          phone?: string | null
          tags?: Json | null
          updated_at?: string
          user_id?: string
          website?: string | null
        }
        Relationships: []
      }
      crm_contacts: {
        Row: {
          ai_insights: Json | null
          avatar_url: string | null
          company_id: string | null
          created_at: string
          department: string | null
          email: string | null
          engagement_score: number | null
          first_name: string
          id: string
          job_title: string | null
          last_contacted_at: string | null
          last_name: string
          linkedin_url: string | null
          notes: string | null
          phone: string | null
          tags: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          ai_insights?: Json | null
          avatar_url?: string | null
          company_id?: string | null
          created_at?: string
          department?: string | null
          email?: string | null
          engagement_score?: number | null
          first_name: string
          id?: string
          job_title?: string | null
          last_contacted_at?: string | null
          last_name: string
          linkedin_url?: string | null
          notes?: string | null
          phone?: string | null
          tags?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          ai_insights?: Json | null
          avatar_url?: string | null
          company_id?: string | null
          created_at?: string
          department?: string | null
          email?: string | null
          engagement_score?: number | null
          first_name?: string
          id?: string
          job_title?: string | null
          last_contacted_at?: string | null
          last_name?: string
          linkedin_url?: string | null
          notes?: string | null
          phone?: string | null
          tags?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "crm_contacts_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "crm_companies"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_opportunities: {
        Row: {
          actual_close_date: string | null
          ai_analysis: Json | null
          ai_recommendations: Json | null
          ai_risk_score: number | null
          company_id: string | null
          contact_id: string | null
          created_at: string
          currency: string | null
          description: string | null
          expected_close_date: string | null
          id: string
          loss_reason: string | null
          name: string
          probability: number | null
          stage_id: string | null
          status: string | null
          tags: Json | null
          updated_at: string
          user_id: string
          value: number | null
        }
        Insert: {
          actual_close_date?: string | null
          ai_analysis?: Json | null
          ai_recommendations?: Json | null
          ai_risk_score?: number | null
          company_id?: string | null
          contact_id?: string | null
          created_at?: string
          currency?: string | null
          description?: string | null
          expected_close_date?: string | null
          id?: string
          loss_reason?: string | null
          name: string
          probability?: number | null
          stage_id?: string | null
          status?: string | null
          tags?: Json | null
          updated_at?: string
          user_id: string
          value?: number | null
        }
        Update: {
          actual_close_date?: string | null
          ai_analysis?: Json | null
          ai_recommendations?: Json | null
          ai_risk_score?: number | null
          company_id?: string | null
          contact_id?: string | null
          created_at?: string
          currency?: string | null
          description?: string | null
          expected_close_date?: string | null
          id?: string
          loss_reason?: string | null
          name?: string
          probability?: number | null
          stage_id?: string | null
          status?: string | null
          tags?: Json | null
          updated_at?: string
          user_id?: string
          value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "crm_opportunities_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "crm_companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_opportunities_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "crm_contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_opportunities_stage_id_fkey"
            columns: ["stage_id"]
            isOneToOne: false
            referencedRelation: "crm_pipeline_stages"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_pipeline_stages: {
        Row: {
          color: string | null
          created_at: string
          id: string
          name: string
          position: number
          probability: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          id?: string
          name: string
          position?: number
          probability?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          color?: string | null
          created_at?: string
          id?: string
          name?: string
          position?: number
          probability?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      crm_tasks: {
        Row: {
          ai_reasoning: string | null
          company_id: string | null
          completed_at: string | null
          contact_id: string | null
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          is_ai_generated: boolean | null
          opportunity_id: string | null
          priority: string | null
          status: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          ai_reasoning?: string | null
          company_id?: string | null
          completed_at?: string | null
          contact_id?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          is_ai_generated?: boolean | null
          opportunity_id?: string | null
          priority?: string | null
          status?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          ai_reasoning?: string | null
          company_id?: string | null
          completed_at?: string | null
          contact_id?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          is_ai_generated?: boolean | null
          opportunity_id?: string | null
          priority?: string | null
          status?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "crm_tasks_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "crm_companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_tasks_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "crm_contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_tasks_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "crm_opportunities"
            referencedColumns: ["id"]
          },
        ]
      }
      custom_block_definitions: {
        Row: {
          category: string
          color: string
          created_at: string
          created_by: string | null
          description: string
          icon: string
          id: string
          input_ports: Json | null
          inputs: number
          is_global: boolean
          is_real_action: boolean | null
          is_sub_node: boolean | null
          modification_reason: string | null
          name: string
          output_labels: Json | null
          output_ports: Json | null
          outputs: number
          params: Json
          popular: boolean | null
          requires_auth: boolean | null
          source_block_type: string | null
          sub_node_type: string | null
          subcategory: string | null
          type: string
          updated_at: string
          usage_count: number
        }
        Insert: {
          category?: string
          color?: string
          created_at?: string
          created_by?: string | null
          description: string
          icon?: string
          id?: string
          input_ports?: Json | null
          inputs?: number
          is_global?: boolean
          is_real_action?: boolean | null
          is_sub_node?: boolean | null
          modification_reason?: string | null
          name: string
          output_labels?: Json | null
          output_ports?: Json | null
          outputs?: number
          params?: Json
          popular?: boolean | null
          requires_auth?: boolean | null
          source_block_type?: string | null
          sub_node_type?: string | null
          subcategory?: string | null
          type: string
          updated_at?: string
          usage_count?: number
        }
        Update: {
          category?: string
          color?: string
          created_at?: string
          created_by?: string | null
          description?: string
          icon?: string
          id?: string
          input_ports?: Json | null
          inputs?: number
          is_global?: boolean
          is_real_action?: boolean | null
          is_sub_node?: boolean | null
          modification_reason?: string | null
          name?: string
          output_labels?: Json | null
          output_ports?: Json | null
          outputs?: number
          params?: Json
          popular?: boolean | null
          requires_auth?: boolean | null
          source_block_type?: string | null
          sub_node_type?: string | null
          subcategory?: string | null
          type?: string
          updated_at?: string
          usage_count?: number
        }
        Relationships: []
      }
      data_catalog: {
        Row: {
          column_count: number | null
          created_at: string
          description: string | null
          id: string
          last_updated_at: string | null
          lineage: Json | null
          name: string
          owner: string | null
          pii_detected: boolean | null
          quality_score: number | null
          row_count: number | null
          schema_info: Json | null
          sensitivity_level: string | null
          source_id: string | null
          tags: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          column_count?: number | null
          created_at?: string
          description?: string | null
          id?: string
          last_updated_at?: string | null
          lineage?: Json | null
          name: string
          owner?: string | null
          pii_detected?: boolean | null
          quality_score?: number | null
          row_count?: number | null
          schema_info?: Json | null
          sensitivity_level?: string | null
          source_id?: string | null
          tags?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          column_count?: number | null
          created_at?: string
          description?: string | null
          id?: string
          last_updated_at?: string | null
          lineage?: Json | null
          name?: string
          owner?: string | null
          pii_detected?: boolean | null
          quality_score?: number | null
          row_count?: number | null
          schema_info?: Json | null
          sensitivity_level?: string | null
          source_id?: string | null
          tags?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "data_catalog_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "data_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      data_pipeline_runs: {
        Row: {
          completed_at: string | null
          created_at: string
          duration_ms: number | null
          error_message: string | null
          id: string
          metadata: Json | null
          pipeline_name: string
          records_failed: number | null
          records_processed: number | null
          source_id: string | null
          started_at: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          duration_ms?: number | null
          error_message?: string | null
          id?: string
          metadata?: Json | null
          pipeline_name: string
          records_failed?: number | null
          records_processed?: number | null
          source_id?: string | null
          started_at?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          duration_ms?: number | null
          error_message?: string | null
          id?: string
          metadata?: Json | null
          pipeline_name?: string
          records_failed?: number | null
          records_processed?: number | null
          source_id?: string | null
          started_at?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "data_pipeline_runs_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "data_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      data_quality_checks: {
        Row: {
          catalog_id: string | null
          check_name: string
          check_type: string
          created_at: string
          details: Json | null
          executed_at: string | null
          id: string
          status: string | null
          user_id: string
        }
        Insert: {
          catalog_id?: string | null
          check_name: string
          check_type: string
          created_at?: string
          details?: Json | null
          executed_at?: string | null
          id?: string
          status?: string | null
          user_id: string
        }
        Update: {
          catalog_id?: string | null
          check_name?: string
          check_type?: string
          created_at?: string
          details?: Json | null
          executed_at?: string | null
          id?: string
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "data_quality_checks_catalog_id_fkey"
            columns: ["catalog_id"]
            isOneToOne: false
            referencedRelation: "data_catalog"
            referencedColumns: ["id"]
          },
        ]
      }
      data_sources: {
        Row: {
          config: Json | null
          connector: string
          created_at: string
          error_message: string | null
          id: string
          last_sync_at: string | null
          name: string
          records_count: number | null
          source_type: string
          status: string | null
          sync_frequency: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          config?: Json | null
          connector: string
          created_at?: string
          error_message?: string | null
          id?: string
          last_sync_at?: string | null
          name: string
          records_count?: number | null
          source_type: string
          status?: string | null
          sync_frequency?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          config?: Json | null
          connector?: string
          created_at?: string
          error_message?: string | null
          id?: string
          last_sync_at?: string | null
          name?: string
          records_count?: number | null
          source_type?: string
          status?: string | null
          sync_frequency?: string | null
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
      deal_status_history: {
        Row: {
          ai_triggered: boolean | null
          change_reason: string | null
          changed_by: string | null
          created_at: string
          deal_id: string
          from_status: Database["public"]["Enums"]["sales_status"] | null
          id: string
          to_status: Database["public"]["Enums"]["sales_status"]
          user_id: string
        }
        Insert: {
          ai_triggered?: boolean | null
          change_reason?: string | null
          changed_by?: string | null
          created_at?: string
          deal_id: string
          from_status?: Database["public"]["Enums"]["sales_status"] | null
          id?: string
          to_status: Database["public"]["Enums"]["sales_status"]
          user_id: string
        }
        Update: {
          ai_triggered?: boolean | null
          change_reason?: string | null
          changed_by?: string | null
          created_at?: string
          deal_id?: string
          from_status?: Database["public"]["Enums"]["sales_status"] | null
          id?: string
          to_status?: Database["public"]["Enums"]["sales_status"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "deal_status_history_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "sales_deals"
            referencedColumns: ["id"]
          },
        ]
      }
      dedupe_candidates: {
        Row: {
          created_at: string
          entity_1_id: string
          entity_2_id: string
          entity_type: string
          id: string
          matching_fields: Json | null
          merged_at: string | null
          similarity_score: number
          status: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          entity_1_id: string
          entity_2_id: string
          entity_type: string
          id?: string
          matching_fields?: Json | null
          merged_at?: string | null
          similarity_score: number
          status?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          entity_1_id?: string
          entity_2_id?: string
          entity_type?: string
          id?: string
          matching_fields?: Json | null
          merged_at?: string | null
          similarity_score?: number
          status?: string | null
          user_id?: string
        }
        Relationships: []
      }
      demo_requests: {
        Row: {
          company: string | null
          created_at: string
          email: string
          id: string
          message: string | null
          name: string
          phone: string | null
          processed_at: string | null
          status: string | null
        }
        Insert: {
          company?: string | null
          created_at?: string
          email: string
          id?: string
          message?: string | null
          name: string
          phone?: string | null
          processed_at?: string | null
          status?: string | null
        }
        Update: {
          company?: string | null
          created_at?: string
          email?: string
          id?: string
          message?: string | null
          name?: string
          phone?: string | null
          processed_at?: string | null
          status?: string | null
        }
        Relationships: []
      }
      doc_access_logs: {
        Row: {
          action: string
          created_at: string
          document_id: string
          id: string
          metadata: Json | null
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string
          document_id: string
          id?: string
          metadata?: Json | null
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string
          document_id?: string
          id?: string
          metadata?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "doc_access_logs_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "aether_documents"
            referencedColumns: ["id"]
          },
        ]
      }
      doc_folders: {
        Row: {
          color: string | null
          created_at: string
          icon: string | null
          id: string
          name: string
          parent_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          icon?: string | null
          id?: string
          name: string
          parent_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          color?: string | null
          created_at?: string
          icon?: string | null
          id?: string
          name?: string
          parent_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "doc_folders_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "doc_folders"
            referencedColumns: ["id"]
          },
        ]
      }
      doc_templates: {
        Row: {
          branding: Json | null
          category: string
          content_structure: Json | null
          created_at: string
          description: string | null
          id: string
          is_system: boolean | null
          name: string
          updated_at: string
          user_id: string
          variables: Json | null
        }
        Insert: {
          branding?: Json | null
          category?: string
          content_structure?: Json | null
          created_at?: string
          description?: string | null
          id?: string
          is_system?: boolean | null
          name: string
          updated_at?: string
          user_id: string
          variables?: Json | null
        }
        Update: {
          branding?: Json | null
          category?: string
          content_structure?: Json | null
          created_at?: string
          description?: string | null
          id?: string
          is_system?: boolean | null
          name?: string
          updated_at?: string
          user_id?: string
          variables?: Json | null
        }
        Relationships: []
      }
      doc_versions: {
        Row: {
          changes_summary: string | null
          content: string | null
          created_at: string
          created_by: string
          document_id: string
          file_url: string | null
          id: string
          version_number: number
        }
        Insert: {
          changes_summary?: string | null
          content?: string | null
          created_at?: string
          created_by: string
          document_id: string
          file_url?: string | null
          id?: string
          version_number: number
        }
        Update: {
          changes_summary?: string | null
          content?: string | null
          created_at?: string
          created_by?: string
          document_id?: string
          file_url?: string | null
          id?: string
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "doc_versions_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "aether_documents"
            referencedColumns: ["id"]
          },
        ]
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
      employee_career_events: {
        Row: {
          bonus_amount: number | null
          bonus_reason: string | null
          created_at: string | null
          description: string | null
          employee_id: string
          event_date: string
          event_type: string
          id: string
          new_salary: number | null
          new_title: string | null
          old_salary: number | null
          old_title: string | null
          salary_change_percent: number | null
          user_id: string
          warning_severity: string | null
          warning_type: string | null
        }
        Insert: {
          bonus_amount?: number | null
          bonus_reason?: string | null
          created_at?: string | null
          description?: string | null
          employee_id: string
          event_date: string
          event_type: string
          id?: string
          new_salary?: number | null
          new_title?: string | null
          old_salary?: number | null
          old_title?: string | null
          salary_change_percent?: number | null
          user_id: string
          warning_severity?: string | null
          warning_type?: string | null
        }
        Update: {
          bonus_amount?: number | null
          bonus_reason?: string | null
          created_at?: string | null
          description?: string | null
          employee_id?: string
          event_date?: string
          event_type?: string
          id?: string
          new_salary?: number | null
          new_title?: string | null
          old_salary?: number | null
          old_title?: string | null
          salary_change_percent?: number | null
          user_id?: string
          warning_severity?: string | null
          warning_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employee_career_events_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      employees: {
        Row: {
          avatar_url: string | null
          candidate_id: string | null
          company_id: string | null
          contract_type: string | null
          created_at: string | null
          department: string | null
          email: string | null
          hire_date: string | null
          id: string
          is_active: boolean | null
          job_title: string
          left_date: string | null
          left_details: string | null
          left_reason: string | null
          name: string
          performance_metrics: Json | null
          phone: string | null
          salary_current: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          candidate_id?: string | null
          company_id?: string | null
          contract_type?: string | null
          created_at?: string | null
          department?: string | null
          email?: string | null
          hire_date?: string | null
          id?: string
          is_active?: boolean | null
          job_title: string
          left_date?: string | null
          left_details?: string | null
          left_reason?: string | null
          name: string
          performance_metrics?: Json | null
          phone?: string | null
          salary_current?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          candidate_id?: string | null
          company_id?: string | null
          contract_type?: string | null
          created_at?: string | null
          department?: string | null
          email?: string | null
          hire_date?: string | null
          id?: string
          is_active?: boolean | null
          job_title?: string
          left_date?: string | null
          left_details?: string | null
          left_reason?: string | null
          name?: string
          performance_metrics?: Json | null
          phone?: string | null
          salary_current?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "employees_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employees_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      enriched_companies: {
        Row: {
          address: string | null
          ai_competitive_position: string | null
          ai_industry_analysis: string | null
          ai_keywords: Json | null
          ai_opportunity_score: number | null
          ai_risk_score: number | null
          ai_summary: string | null
          capital: number | null
          city: string | null
          confidence_score: number | null
          country: string | null
          created_at: string
          creation_date: string | null
          data_sources: Json | null
          ebitda: number | null
          employees_count: number | null
          employees_range: string | null
          enrichment_status: string | null
          executives: Json | null
          facebook_url: string | null
          id: string
          last_enriched_at: string | null
          latitude: number | null
          legal_form: string | null
          linkedin_url: string | null
          longitude: number | null
          naf_code: string | null
          naf_label: string | null
          name: string
          net_income: number | null
          postal_code: string | null
          revenue: number | null
          revenue_year: number | null
          siren: string | null
          siret: string | null
          tva_number: string | null
          twitter_url: string | null
          updated_at: string
          user_id: string
          verification_date: string | null
          verification_status: string | null
          website: string | null
        }
        Insert: {
          address?: string | null
          ai_competitive_position?: string | null
          ai_industry_analysis?: string | null
          ai_keywords?: Json | null
          ai_opportunity_score?: number | null
          ai_risk_score?: number | null
          ai_summary?: string | null
          capital?: number | null
          city?: string | null
          confidence_score?: number | null
          country?: string | null
          created_at?: string
          creation_date?: string | null
          data_sources?: Json | null
          ebitda?: number | null
          employees_count?: number | null
          employees_range?: string | null
          enrichment_status?: string | null
          executives?: Json | null
          facebook_url?: string | null
          id?: string
          last_enriched_at?: string | null
          latitude?: number | null
          legal_form?: string | null
          linkedin_url?: string | null
          longitude?: number | null
          naf_code?: string | null
          naf_label?: string | null
          name: string
          net_income?: number | null
          postal_code?: string | null
          revenue?: number | null
          revenue_year?: number | null
          siren?: string | null
          siret?: string | null
          tva_number?: string | null
          twitter_url?: string | null
          updated_at?: string
          user_id: string
          verification_date?: string | null
          verification_status?: string | null
          website?: string | null
        }
        Update: {
          address?: string | null
          ai_competitive_position?: string | null
          ai_industry_analysis?: string | null
          ai_keywords?: Json | null
          ai_opportunity_score?: number | null
          ai_risk_score?: number | null
          ai_summary?: string | null
          capital?: number | null
          city?: string | null
          confidence_score?: number | null
          country?: string | null
          created_at?: string
          creation_date?: string | null
          data_sources?: Json | null
          ebitda?: number | null
          employees_count?: number | null
          employees_range?: string | null
          enrichment_status?: string | null
          executives?: Json | null
          facebook_url?: string | null
          id?: string
          last_enriched_at?: string | null
          latitude?: number | null
          legal_form?: string | null
          linkedin_url?: string | null
          longitude?: number | null
          naf_code?: string | null
          naf_label?: string | null
          name?: string
          net_income?: number | null
          postal_code?: string | null
          revenue?: number | null
          revenue_year?: number | null
          siren?: string | null
          siret?: string | null
          tva_number?: string | null
          twitter_url?: string | null
          updated_at?: string
          user_id?: string
          verification_date?: string | null
          verification_status?: string | null
          website?: string | null
        }
        Relationships: []
      }
      enrichment_requests: {
        Row: {
          completed_at: string | null
          created_at: string
          error_message: string | null
          id: string
          processing_time_ms: number | null
          query_type: string
          query_value: string
          result_company_id: string | null
          sources_checked: Json | null
          status: string | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          processing_time_ms?: number | null
          query_type: string
          query_value: string
          result_company_id?: string | null
          sources_checked?: Json | null
          status?: string | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          processing_time_ms?: number | null
          query_type?: string
          query_value?: string
          result_company_id?: string | null
          sources_checked?: Json | null
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "enrichment_requests_result_company_id_fkey"
            columns: ["result_company_id"]
            isOneToOne: false
            referencedRelation: "enriched_companies"
            referencedColumns: ["id"]
          },
        ]
      }
      esg_emission_categories: {
        Row: {
          category_name: string
          category_type: string
          created_at: string
          data_source: string | null
          id: string
          is_verified: boolean | null
          reporting_year: number
          scope1_emissions: number | null
          scope2_emissions: number | null
          scope3_emissions: number | null
          trend_percentage: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          category_name: string
          category_type?: string
          created_at?: string
          data_source?: string | null
          id?: string
          is_verified?: boolean | null
          reporting_year?: number
          scope1_emissions?: number | null
          scope2_emissions?: number | null
          scope3_emissions?: number | null
          trend_percentage?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          category_name?: string
          category_type?: string
          created_at?: string
          data_source?: string | null
          id?: string
          is_verified?: boolean | null
          reporting_year?: number
          scope1_emissions?: number | null
          scope2_emissions?: number | null
          scope3_emissions?: number | null
          trend_percentage?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      esg_kpis: {
        Row: {
          created_at: string
          data_source: string | null
          description: string | null
          id: string
          is_verified: boolean | null
          kpi_name: string
          kpi_unit: string
          kpi_value: number
          reporting_year: number
          target_value: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          data_source?: string | null
          description?: string | null
          id?: string
          is_verified?: boolean | null
          kpi_name: string
          kpi_unit: string
          kpi_value: number
          reporting_year?: number
          target_value?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          data_source?: string | null
          description?: string | null
          id?: string
          is_verified?: boolean | null
          kpi_name?: string
          kpi_unit?: string
          kpi_value?: number
          reporting_year?: number
          target_value?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      esg_site_emissions: {
        Row: {
          created_at: string
          data_source: string | null
          id: string
          is_verified: boolean | null
          location: string
          notes: string | null
          reporting_period: string | null
          reporting_year: number
          scope1_emissions: number | null
          scope2_emissions: number | null
          scope3_emissions: number | null
          site_name: string
          updated_at: string
          user_id: string
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          created_at?: string
          data_source?: string | null
          id?: string
          is_verified?: boolean | null
          location: string
          notes?: string | null
          reporting_period?: string | null
          reporting_year?: number
          scope1_emissions?: number | null
          scope2_emissions?: number | null
          scope3_emissions?: number | null
          site_name: string
          updated_at?: string
          user_id: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          created_at?: string
          data_source?: string | null
          id?: string
          is_verified?: boolean | null
          location?: string
          notes?: string | null
          reporting_period?: string | null
          reporting_year?: number
          scope1_emissions?: number | null
          scope2_emissions?: number | null
          scope3_emissions?: number | null
          site_name?: string
          updated_at?: string
          user_id?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: []
      }
      esg_targets: {
        Row: {
          baseline_year: number
          created_at: string
          description: string | null
          id: string
          is_achieved: boolean | null
          target_reduction_percent: number
          target_type: string | null
          target_year: number
          user_id: string
        }
        Insert: {
          baseline_year: number
          created_at?: string
          description?: string | null
          id?: string
          is_achieved?: boolean | null
          target_reduction_percent: number
          target_type?: string | null
          target_year: number
          user_id: string
        }
        Update: {
          baseline_year?: number
          created_at?: string
          description?: string | null
          id?: string
          is_achieved?: boolean | null
          target_reduction_percent?: number
          target_type?: string | null
          target_year?: number
          user_id?: string
        }
        Relationships: []
      }
      farmasoft_candidates: {
        Row: {
          contacted_at: string | null
          created_at: string | null
          cv_filename: string | null
          cv_text: string | null
          decision: string | null
          experience_text: string | null
          experience_years: number | null
          id: number
          initials: string | null
          job_id: number | null
          location: string | null
          profile_data: string | null
          profile_url: string | null
          qualification_notes: string | null
          qualification_score: number | null
          rejection_reason: string | null
          role: string | null
          salary_expectation: number | null
          source_platform: string | null
          source_type: string | null
          stage: string | null
          status: string | null
          tags: string | null
          user_id: string
          viewed_at: string | null
        }
        Insert: {
          contacted_at?: string | null
          created_at?: string | null
          cv_filename?: string | null
          cv_text?: string | null
          decision?: string | null
          experience_text?: string | null
          experience_years?: number | null
          id?: never
          initials?: string | null
          job_id?: number | null
          location?: string | null
          profile_data?: string | null
          profile_url?: string | null
          qualification_notes?: string | null
          qualification_score?: number | null
          rejection_reason?: string | null
          role?: string | null
          salary_expectation?: number | null
          source_platform?: string | null
          source_type?: string | null
          stage?: string | null
          status?: string | null
          tags?: string | null
          user_id: string
          viewed_at?: string | null
        }
        Update: {
          contacted_at?: string | null
          created_at?: string | null
          cv_filename?: string | null
          cv_text?: string | null
          decision?: string | null
          experience_text?: string | null
          experience_years?: number | null
          id?: never
          initials?: string | null
          job_id?: number | null
          location?: string | null
          profile_data?: string | null
          profile_url?: string | null
          qualification_notes?: string | null
          qualification_score?: number | null
          rejection_reason?: string | null
          role?: string | null
          salary_expectation?: number | null
          source_platform?: string | null
          source_type?: string | null
          stage?: string | null
          status?: string | null
          tags?: string | null
          user_id?: string
          viewed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "farmasoft_candidates_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "farmasoft_jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      farmasoft_events: {
        Row: {
          candidate_id: number | null
          created_at: string | null
          id: number
          job_id: number | null
          metadata: string | null
          type: string
          user_id: string
        }
        Insert: {
          candidate_id?: number | null
          created_at?: string | null
          id?: never
          job_id?: number | null
          metadata?: string | null
          type: string
          user_id: string
        }
        Update: {
          candidate_id?: number | null
          created_at?: string | null
          id?: never
          job_id?: number | null
          metadata?: string | null
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      farmasoft_interviews: {
        Row: {
          candidate_id: number
          created_at: string | null
          decision: string | null
          id: number
          interviewer: string | null
          job_id: number | null
          notes: string | null
          scheduled_at: string
          type: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          candidate_id: number
          created_at?: string | null
          decision?: string | null
          id?: never
          interviewer?: string | null
          job_id?: number | null
          notes?: string | null
          scheduled_at: string
          type?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          candidate_id?: number
          created_at?: string | null
          decision?: string | null
          id?: never
          interviewer?: string | null
          job_id?: number | null
          notes?: string | null
          scheduled_at?: string
          type?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "farmasoft_interviews_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "farmasoft_candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "farmasoft_interviews_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "farmasoft_jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      farmasoft_jobs: {
        Row: {
          created_at: string | null
          description: string | null
          experience_years: number | null
          id: number
          is_active: number | null
          location: string | null
          requirements: string | null
          salary_currency: string | null
          salary_max: number | null
          salary_min: number | null
          skills: string | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          experience_years?: number | null
          id?: never
          is_active?: number | null
          location?: string | null
          requirements?: string | null
          salary_currency?: string | null
          salary_max?: number | null
          salary_min?: number | null
          skills?: string | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          experience_years?: number | null
          id?: never
          is_active?: number | null
          location?: string | null
          requirements?: string | null
          salary_currency?: string | null
          salary_max?: number | null
          salary_min?: number | null
          skills?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      farmasoft_messages: {
        Row: {
          ai_generated: number | null
          body: string | null
          created_at: string | null
          id: number
          job_id: number | null
          language: string | null
          name: string | null
          subject: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          ai_generated?: number | null
          body?: string | null
          created_at?: string | null
          id?: never
          job_id?: number | null
          language?: string | null
          name?: string | null
          subject?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          ai_generated?: number | null
          body?: string | null
          created_at?: string | null
          id?: never
          job_id?: number | null
          language?: string | null
          name?: string | null
          subject?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "farmasoft_messages_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "farmasoft_jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      farmasoft_settings: {
        Row: {
          key: string
          user_id: string
          value: string | null
        }
        Insert: {
          key: string
          user_id: string
          value?: string | null
        }
        Update: {
          key?: string
          user_id?: string
          value?: string | null
        }
        Relationships: []
      }
      hr_disputes: {
        Row: {
          created_at: string | null
          description: string | null
          dispute_type: string
          documents: Json | null
          employee_id: string
          id: string
          involved_parties: Json | null
          resolution: string | null
          resolution_date: string | null
          resolved_by: string | null
          severity: string | null
          status: string | null
          timeline: Json | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          dispute_type: string
          documents?: Json | null
          employee_id: string
          id?: string
          involved_parties?: Json | null
          resolution?: string | null
          resolution_date?: string | null
          resolved_by?: string | null
          severity?: string | null
          status?: string | null
          timeline?: Json | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          dispute_type?: string
          documents?: Json | null
          employee_id?: string
          id?: string
          involved_parties?: Json | null
          resolution?: string | null
          resolution_date?: string | null
          resolved_by?: string | null
          severity?: string | null
          status?: string | null
          timeline?: Json | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "hr_disputes_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      hr_email_accounts: {
        Row: {
          access_token: string | null
          auto_create_candidate: boolean | null
          auto_parse_cv: boolean | null
          created_at: string | null
          email_address: string
          extraction_enabled: boolean | null
          extraction_interval_minutes: number | null
          id: string
          is_active: boolean | null
          last_extraction_at: string | null
          last_sync_at: string | null
          oauth_access_token: string | null
          oauth_provider_user_id: string | null
          oauth_refresh_token: string | null
          oauth_token_expires_at: string | null
          provider: string
          refresh_token: string | null
          sender_name: string | null
          signature_html: string | null
          sync_folder: string | null
          sync_keywords: Json | null
          token_expires_at: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          access_token?: string | null
          auto_create_candidate?: boolean | null
          auto_parse_cv?: boolean | null
          created_at?: string | null
          email_address: string
          extraction_enabled?: boolean | null
          extraction_interval_minutes?: number | null
          id?: string
          is_active?: boolean | null
          last_extraction_at?: string | null
          last_sync_at?: string | null
          oauth_access_token?: string | null
          oauth_provider_user_id?: string | null
          oauth_refresh_token?: string | null
          oauth_token_expires_at?: string | null
          provider: string
          refresh_token?: string | null
          sender_name?: string | null
          signature_html?: string | null
          sync_folder?: string | null
          sync_keywords?: Json | null
          token_expires_at?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          access_token?: string | null
          auto_create_candidate?: boolean | null
          auto_parse_cv?: boolean | null
          created_at?: string | null
          email_address?: string
          extraction_enabled?: boolean | null
          extraction_interval_minutes?: number | null
          id?: string
          is_active?: boolean | null
          last_extraction_at?: string | null
          last_sync_at?: string | null
          oauth_access_token?: string | null
          oauth_provider_user_id?: string | null
          oauth_refresh_token?: string | null
          oauth_token_expires_at?: string | null
          provider?: string
          refresh_token?: string | null
          sender_name?: string | null
          signature_html?: string | null
          sync_folder?: string | null
          sync_keywords?: Json | null
          token_expires_at?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      hr_emails: {
        Row: {
          account_id: string | null
          ai_analysis: Json | null
          ai_improvements: Json | null
          ai_suggested_response: string | null
          attachments: Json | null
          body_html: string | null
          body_text: string | null
          candidate_id: string | null
          created_at: string | null
          direction: string
          email_date: string | null
          external_id: string | null
          from_email: string
          from_name: string | null
          id: string
          parent_email_id: string | null
          provider: string | null
          read_at: string | null
          replied_at: string | null
          status: string | null
          subject: string
          thread_id: string | null
          to_email: string
          to_name: string | null
          user_id: string
        }
        Insert: {
          account_id?: string | null
          ai_analysis?: Json | null
          ai_improvements?: Json | null
          ai_suggested_response?: string | null
          attachments?: Json | null
          body_html?: string | null
          body_text?: string | null
          candidate_id?: string | null
          created_at?: string | null
          direction: string
          email_date?: string | null
          external_id?: string | null
          from_email: string
          from_name?: string | null
          id?: string
          parent_email_id?: string | null
          provider?: string | null
          read_at?: string | null
          replied_at?: string | null
          status?: string | null
          subject: string
          thread_id?: string | null
          to_email: string
          to_name?: string | null
          user_id: string
        }
        Update: {
          account_id?: string | null
          ai_analysis?: Json | null
          ai_improvements?: Json | null
          ai_suggested_response?: string | null
          attachments?: Json | null
          body_html?: string | null
          body_text?: string | null
          candidate_id?: string | null
          created_at?: string | null
          direction?: string
          email_date?: string | null
          external_id?: string | null
          from_email?: string
          from_name?: string | null
          id?: string
          parent_email_id?: string | null
          provider?: string | null
          read_at?: string | null
          replied_at?: string | null
          status?: string | null
          subject?: string
          thread_id?: string | null
          to_email?: string
          to_name?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "hr_emails_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "hr_email_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hr_emails_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hr_emails_parent_email_id_fkey"
            columns: ["parent_email_id"]
            isOneToOne: false
            referencedRelation: "hr_emails"
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
      interview_date_proposals: {
        Row: {
          candidate_counter_proposal: string | null
          candidate_email_sent_at: string | null
          candidate_id: string
          candidate_response: string | null
          confirmation_email_sent_at: string | null
          confirmation_token: string | null
          created_at: string | null
          id: string
          interview_id: string | null
          message_to_candidate: string | null
          proposed_slots: Json
          selected_slot_index: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          candidate_counter_proposal?: string | null
          candidate_email_sent_at?: string | null
          candidate_id: string
          candidate_response?: string | null
          confirmation_email_sent_at?: string | null
          confirmation_token?: string | null
          created_at?: string | null
          id?: string
          interview_id?: string | null
          message_to_candidate?: string | null
          proposed_slots?: Json
          selected_slot_index?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          candidate_counter_proposal?: string | null
          candidate_email_sent_at?: string | null
          candidate_id?: string
          candidate_response?: string | null
          confirmation_email_sent_at?: string | null
          confirmation_token?: string | null
          created_at?: string | null
          id?: string
          interview_id?: string | null
          message_to_candidate?: string | null
          proposed_slots?: Json
          selected_slot_index?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "interview_date_proposals_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interview_date_proposals_interview_id_fkey"
            columns: ["interview_id"]
            isOneToOne: false
            referencedRelation: "candidate_interviews"
            referencedColumns: ["id"]
          },
        ]
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
      knowledge_articles: {
        Row: {
          ai_summary: string | null
          content: string | null
          content_type: string | null
          cover_url: string | null
          created_at: string
          icon: string | null
          id: string
          is_published: boolean | null
          parent_id: string | null
          tags: Json | null
          title: string
          updated_at: string
          user_id: string
          views_count: number | null
        }
        Insert: {
          ai_summary?: string | null
          content?: string | null
          content_type?: string | null
          cover_url?: string | null
          created_at?: string
          icon?: string | null
          id?: string
          is_published?: boolean | null
          parent_id?: string | null
          tags?: Json | null
          title: string
          updated_at?: string
          user_id: string
          views_count?: number | null
        }
        Update: {
          ai_summary?: string | null
          content?: string | null
          content_type?: string | null
          cover_url?: string | null
          created_at?: string
          icon?: string | null
          id?: string
          is_published?: boolean | null
          parent_id?: string | null
          tags?: Json | null
          title?: string
          updated_at?: string
          user_id?: string
          views_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "knowledge_articles_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "knowledge_articles"
            referencedColumns: ["id"]
          },
        ]
      }
      negotiation_sheets: {
        Row: {
          anticipated_objections: Json | null
          closing_strategies: Json | null
          company_context: string | null
          competitive_advantages: Json | null
          contact_context: string | null
          counter_arguments: Json | null
          created_at: string
          current_situation: string | null
          deal_id: string | null
          follow_up_date: string | null
          follow_up_notes: string | null
          id: string
          key_arguments: Json | null
          negotiation_status: string | null
          next_steps: Json | null
          price_justification: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          anticipated_objections?: Json | null
          closing_strategies?: Json | null
          company_context?: string | null
          competitive_advantages?: Json | null
          contact_context?: string | null
          counter_arguments?: Json | null
          created_at?: string
          current_situation?: string | null
          deal_id?: string | null
          follow_up_date?: string | null
          follow_up_notes?: string | null
          id?: string
          key_arguments?: Json | null
          negotiation_status?: string | null
          next_steps?: Json | null
          price_justification?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          anticipated_objections?: Json | null
          closing_strategies?: Json | null
          company_context?: string | null
          competitive_advantages?: Json | null
          contact_context?: string | null
          counter_arguments?: Json | null
          created_at?: string
          current_situation?: string | null
          deal_id?: string | null
          follow_up_date?: string | null
          follow_up_notes?: string | null
          id?: string
          key_arguments?: Json | null
          negotiation_status?: string | null
          next_steps?: Json | null
          price_justification?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "negotiation_sheets_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "sales_deals"
            referencedColumns: ["id"]
          },
        ]
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
      regulatory_references: {
        Row: {
          article_code: string
          content: string
          created_at: string
          effective_date: string | null
          id: string
          is_current: boolean | null
          last_scraped_at: string | null
          metadata: Json | null
          regulation_type: string
          source_name: string | null
          source_url: string | null
          title: string
          updated_at: string
        }
        Insert: {
          article_code: string
          content: string
          created_at?: string
          effective_date?: string | null
          id?: string
          is_current?: boolean | null
          last_scraped_at?: string | null
          metadata?: Json | null
          regulation_type: string
          source_name?: string | null
          source_url?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          article_code?: string
          content?: string
          created_at?: string
          effective_date?: string | null
          id?: string
          is_current?: boolean | null
          last_scraped_at?: string | null
          metadata?: Json | null
          regulation_type?: string
          source_name?: string | null
          source_url?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      sales_compliance_checks: {
        Row: {
          checked_at: string | null
          compliance_score: number | null
          content_id: string | null
          content_preview: string | null
          content_type: string
          id: string
          issues: Json | null
          status: string | null
          user_id: string
        }
        Insert: {
          checked_at?: string | null
          compliance_score?: number | null
          content_id?: string | null
          content_preview?: string | null
          content_type: string
          id?: string
          issues?: Json | null
          status?: string | null
          user_id: string
        }
        Update: {
          checked_at?: string | null
          compliance_score?: number | null
          content_id?: string | null
          content_preview?: string | null
          content_type?: string
          id?: string
          issues?: Json | null
          status?: string | null
          user_id?: string
        }
        Relationships: []
      }
      sales_compliance_rules: {
        Row: {
          created_at: string | null
          forbidden_phrases: Json | null
          id: string
          is_active: boolean | null
          keywords: Json | null
          max_discount_percent: number | null
          required_disclaimers: Json | null
          rule_description: string | null
          rule_name: string
          rule_type: string
          severity: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          forbidden_phrases?: Json | null
          id?: string
          is_active?: boolean | null
          keywords?: Json | null
          max_discount_percent?: number | null
          required_disclaimers?: Json | null
          rule_description?: string | null
          rule_name: string
          rule_type: string
          severity?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          forbidden_phrases?: Json | null
          id?: string
          is_active?: boolean | null
          keywords?: Json | null
          max_discount_percent?: number | null
          required_disclaimers?: Json | null
          rule_description?: string | null
          rule_name?: string
          rule_type?: string
          severity?: string | null
          user_id?: string
        }
        Relationships: []
      }
      sales_deals: {
        Row: {
          actual_close_date: string | null
          ai_factors: Json | null
          ai_risk_score: number | null
          ai_score: number | null
          assigned_to: string | null
          company_enrichment: Json | null
          company_id: string | null
          contact_email: string | null
          contact_name: string | null
          created_at: string
          currency: string | null
          custom_fields: Json | null
          description: string | null
          expected_close_date: string | null
          id: string
          last_activity_at: string | null
          lost_reason: string | null
          probability: number | null
          salesperson_id: string | null
          source: string | null
          status: Database["public"]["Enums"]["sales_status"]
          tags: Json | null
          title: string
          updated_at: string
          user_id: string
          value: number | null
        }
        Insert: {
          actual_close_date?: string | null
          ai_factors?: Json | null
          ai_risk_score?: number | null
          ai_score?: number | null
          assigned_to?: string | null
          company_enrichment?: Json | null
          company_id?: string | null
          contact_email?: string | null
          contact_name?: string | null
          created_at?: string
          currency?: string | null
          custom_fields?: Json | null
          description?: string | null
          expected_close_date?: string | null
          id?: string
          last_activity_at?: string | null
          lost_reason?: string | null
          probability?: number | null
          salesperson_id?: string | null
          source?: string | null
          status?: Database["public"]["Enums"]["sales_status"]
          tags?: Json | null
          title: string
          updated_at?: string
          user_id: string
          value?: number | null
        }
        Update: {
          actual_close_date?: string | null
          ai_factors?: Json | null
          ai_risk_score?: number | null
          ai_score?: number | null
          assigned_to?: string | null
          company_enrichment?: Json | null
          company_id?: string | null
          contact_email?: string | null
          contact_name?: string | null
          created_at?: string
          currency?: string | null
          custom_fields?: Json | null
          description?: string | null
          expected_close_date?: string | null
          id?: string
          last_activity_at?: string | null
          lost_reason?: string | null
          probability?: number | null
          salesperson_id?: string | null
          source?: string | null
          status?: Database["public"]["Enums"]["sales_status"]
          tags?: Json | null
          title?: string
          updated_at?: string
          user_id?: string
          value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "sales_deals_salesperson_id_fkey"
            columns: ["salesperson_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      sales_forecasts: {
        Row: {
          confidence_interval_high: number | null
          confidence_interval_low: number | null
          created_at: string
          factors: Json | null
          forecast_period: string
          id: string
          model_accuracy: number | null
          period_end: string
          period_start: string
          predicted_deals_lost: number | null
          predicted_deals_won: number | null
          predicted_revenue: number | null
          user_id: string
        }
        Insert: {
          confidence_interval_high?: number | null
          confidence_interval_low?: number | null
          created_at?: string
          factors?: Json | null
          forecast_period: string
          id?: string
          model_accuracy?: number | null
          period_end: string
          period_start: string
          predicted_deals_lost?: number | null
          predicted_deals_won?: number | null
          predicted_revenue?: number | null
          user_id: string
        }
        Update: {
          confidence_interval_high?: number | null
          confidence_interval_low?: number | null
          created_at?: string
          factors?: Json | null
          forecast_period?: string
          id?: string
          model_accuracy?: number | null
          period_end?: string
          period_start?: string
          predicted_deals_lost?: number | null
          predicted_deals_won?: number | null
          predicted_revenue?: number | null
          user_id?: string
        }
        Relationships: []
      }
      sales_internal_compliance_rules: {
        Row: {
          created_at: string | null
          forbidden_phrases: Json | null
          id: string
          is_active: boolean | null
          keywords: Json | null
          max_discount_percent: number | null
          required_disclaimers: Json | null
          rule_description: string | null
          rule_name: string
          rule_type: string
          severity: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          forbidden_phrases?: Json | null
          id?: string
          is_active?: boolean | null
          keywords?: Json | null
          max_discount_percent?: number | null
          required_disclaimers?: Json | null
          rule_description?: string | null
          rule_name: string
          rule_type: string
          severity?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          forbidden_phrases?: Json | null
          id?: string
          is_active?: boolean | null
          keywords?: Json | null
          max_discount_percent?: number | null
          required_disclaimers?: Json | null
          rule_description?: string | null
          rule_name?: string
          rule_type?: string
          severity?: string | null
          user_id?: string
        }
        Relationships: []
      }
      sales_presentations: {
        Row: {
          client_name: string | null
          compliance_issues: Json | null
          compliance_score: number | null
          compliance_status: string | null
          created_at: string | null
          deal_id: string | null
          id: string
          key_points: string | null
          objective: string | null
          presentation_json: Json | null
          product_name: string | null
          slide_count: number | null
          style: string | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          client_name?: string | null
          compliance_issues?: Json | null
          compliance_score?: number | null
          compliance_status?: string | null
          created_at?: string | null
          deal_id?: string | null
          id?: string
          key_points?: string | null
          objective?: string | null
          presentation_json?: Json | null
          product_name?: string | null
          slide_count?: number | null
          style?: string | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          client_name?: string | null
          compliance_issues?: Json | null
          compliance_score?: number | null
          compliance_status?: string | null
          created_at?: string | null
          deal_id?: string | null
          id?: string
          key_points?: string | null
          objective?: string | null
          presentation_json?: Json | null
          product_name?: string | null
          slide_count?: number | null
          style?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sales_presentations_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "sales_deals"
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
      subscriptions: {
        Row: {
          created_at: string | null
          id: string
          plan_id: string
          plan_name: string
          price_monthly: number | null
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          plan_id: string
          plan_name: string
          price_monthly?: number | null
          status?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          plan_id?: string
          plan_name?: string
          price_monthly?: number | null
          status?: string
          updated_at?: string | null
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
      team_members: {
        Row: {
          created_at: string
          id: string
          team_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          team_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          team_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          company_id: string
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "teams_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
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
      user_api_keys: {
        Row: {
          api_key: string
          created_at: string
          id: string
          service_name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          api_key: string
          created_at?: string
          id?: string
          service_name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          api_key?: string
          created_at?: string
          id?: string
          service_name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_favorites: {
        Row: {
          agent_type: string
          created_at: string | null
          entity_id: string
          entity_name: string
          entity_type: string
          id: string
          user_id: string
        }
        Insert: {
          agent_type: string
          created_at?: string | null
          entity_id: string
          entity_name: string
          entity_type: string
          id?: string
          user_id: string
        }
        Update: {
          agent_type?: string
          created_at?: string | null
          entity_id?: string
          entity_name?: string
          entity_type?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      user_oauth_tokens: {
        Row: {
          access_token: string
          client_id: string | null
          client_secret: string | null
          created_at: string
          email: string | null
          expires_at: string | null
          id: string
          provider: string
          refresh_token: string | null
          scope: string | null
          token_type: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          access_token: string
          client_id?: string | null
          client_secret?: string | null
          created_at?: string
          email?: string | null
          expires_at?: string | null
          id?: string
          provider: string
          refresh_token?: string | null
          scope?: string | null
          token_type?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          access_token?: string
          client_id?: string | null
          client_secret?: string | null
          created_at?: string
          email?: string | null
          expires_at?: string | null
          id?: string
          provider?: string
          refresh_token?: string | null
          scope?: string | null
          token_type?: string | null
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
          {
            foreignKeyName: "user_roles_user_id_profiles_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      workflow_distributed_metrics: {
        Row: {
          avg_chunk_size: number | null
          created_at: string | null
          id: string
          parallel_execution_ms: number | null
          parallel_jobs: number | null
          peak_concurrent_jobs: number | null
          run_id: string | null
          sequential_execution_ms: number | null
          sequential_jobs: number | null
          speedup_factor: number | null
          total_chunks: number | null
          total_execution_ms: number | null
          total_jobs: number | null
          user_id: string
          workers_used: number | null
        }
        Insert: {
          avg_chunk_size?: number | null
          created_at?: string | null
          id?: string
          parallel_execution_ms?: number | null
          parallel_jobs?: number | null
          peak_concurrent_jobs?: number | null
          run_id?: string | null
          sequential_execution_ms?: number | null
          sequential_jobs?: number | null
          speedup_factor?: number | null
          total_chunks?: number | null
          total_execution_ms?: number | null
          total_jobs?: number | null
          user_id: string
          workers_used?: number | null
        }
        Update: {
          avg_chunk_size?: number | null
          created_at?: string | null
          id?: string
          parallel_execution_ms?: number | null
          parallel_jobs?: number | null
          peak_concurrent_jobs?: number | null
          run_id?: string | null
          sequential_execution_ms?: number | null
          sequential_jobs?: number | null
          speedup_factor?: number | null
          total_chunks?: number | null
          total_execution_ms?: number | null
          total_jobs?: number | null
          user_id?: string
          workers_used?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "workflow_distributed_metrics_run_id_fkey"
            columns: ["run_id"]
            isOneToOne: false
            referencedRelation: "workflow_runs"
            referencedColumns: ["id"]
          },
        ]
      }
      workflow_job_queue: {
        Row: {
          block_config: Json | null
          block_id: string
          block_type: string
          chunk_index: number | null
          claimed_at: string | null
          completed_at: string | null
          created_at: string | null
          error_message: string | null
          id: string
          input_data: Json | null
          max_retries: number | null
          output_data: Json | null
          priority: number | null
          retry_count: number | null
          run_id: string | null
          started_at: string | null
          status: string | null
          timeout_seconds: number | null
          total_chunks: number | null
          user_id: string
          worker_id: string | null
          workflow_id: string | null
        }
        Insert: {
          block_config?: Json | null
          block_id: string
          block_type: string
          chunk_index?: number | null
          claimed_at?: string | null
          completed_at?: string | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          input_data?: Json | null
          max_retries?: number | null
          output_data?: Json | null
          priority?: number | null
          retry_count?: number | null
          run_id?: string | null
          started_at?: string | null
          status?: string | null
          timeout_seconds?: number | null
          total_chunks?: number | null
          user_id: string
          worker_id?: string | null
          workflow_id?: string | null
        }
        Update: {
          block_config?: Json | null
          block_id?: string
          block_type?: string
          chunk_index?: number | null
          claimed_at?: string | null
          completed_at?: string | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          input_data?: Json | null
          max_retries?: number | null
          output_data?: Json | null
          priority?: number | null
          retry_count?: number | null
          run_id?: string | null
          started_at?: string | null
          status?: string | null
          timeout_seconds?: number | null
          total_chunks?: number | null
          user_id?: string
          worker_id?: string | null
          workflow_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workflow_job_queue_run_id_fkey"
            columns: ["run_id"]
            isOneToOne: false
            referencedRelation: "workflow_runs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workflow_job_queue_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "workflows"
            referencedColumns: ["id"]
          },
        ]
      }
      workflow_runs: {
        Row: {
          blocks_status: Json | null
          completed_at: string | null
          created_at: string
          error_message: string | null
          id: string
          input_data: Json | null
          output_data: Json | null
          parallel_branches: Json | null
          started_at: string | null
          status: string | null
          user_id: string
          workflow_id: string
        }
        Insert: {
          blocks_status?: Json | null
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          input_data?: Json | null
          output_data?: Json | null
          parallel_branches?: Json | null
          started_at?: string | null
          status?: string | null
          user_id: string
          workflow_id: string
        }
        Update: {
          blocks_status?: Json | null
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          input_data?: Json | null
          output_data?: Json | null
          parallel_branches?: Json | null
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
      workflow_secrets: {
        Row: {
          created_at: string | null
          encrypted_value: string
          id: string
          key: string
          user_id: string
          workflow_id: string | null
        }
        Insert: {
          created_at?: string | null
          encrypted_value: string
          id?: string
          key: string
          user_id: string
          workflow_id?: string | null
        }
        Update: {
          created_at?: string | null
          encrypted_value?: string
          id?: string
          key?: string
          user_id?: string
          workflow_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workflow_secrets_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "workflows"
            referencedColumns: ["id"]
          },
        ]
      }
      workflow_workers: {
        Row: {
          avg_execution_ms: number | null
          created_at: string | null
          current_job_id: string | null
          id: string
          jobs_completed: number | null
          jobs_failed: number | null
          last_heartbeat: string | null
          last_job_at: string | null
          max_concurrent_jobs: number | null
          status: string | null
          supported_block_types: string[] | null
          total_execution_ms: number | null
          user_id: string
          worker_id: string
        }
        Insert: {
          avg_execution_ms?: number | null
          created_at?: string | null
          current_job_id?: string | null
          id?: string
          jobs_completed?: number | null
          jobs_failed?: number | null
          last_heartbeat?: string | null
          last_job_at?: string | null
          max_concurrent_jobs?: number | null
          status?: string | null
          supported_block_types?: string[] | null
          total_execution_ms?: number | null
          user_id: string
          worker_id: string
        }
        Update: {
          avg_execution_ms?: number | null
          created_at?: string | null
          current_job_id?: string | null
          id?: string
          jobs_completed?: number | null
          jobs_failed?: number | null
          last_heartbeat?: string | null
          last_job_at?: string | null
          max_concurrent_jobs?: number | null
          status?: string | null
          supported_block_types?: string[] | null
          total_execution_ms?: number | null
          user_id?: string
          worker_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workflow_workers_current_job_id_fkey"
            columns: ["current_job_id"]
            isOneToOne: false
            referencedRelation: "workflow_job_queue"
            referencedColumns: ["id"]
          },
        ]
      }
      workflows: {
        Row: {
          blocks: Json | null
          connections: Json | null
          created_at: string
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          settings: Json | null
          updated_at: string
          user_id: string
          variables: Json | null
        }
        Insert: {
          blocks?: Json | null
          connections?: Json | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          settings?: Json | null
          updated_at?: string
          user_id: string
          variables?: Json | null
        }
        Update: {
          blocks?: Json | null
          connections?: Json | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          settings?: Json | null
          updated_at?: string
          user_id?: string
          variables?: Json | null
        }
        Relationships: []
      }
      workspace_activity: {
        Row: {
          action_type: string
          actor_name: string | null
          created_at: string
          description: string | null
          entity_id: string | null
          entity_name: string | null
          entity_type: string
          id: string
          metadata: Json | null
          user_id: string
        }
        Insert: {
          action_type: string
          actor_name?: string | null
          created_at?: string
          description?: string | null
          entity_id?: string | null
          entity_name?: string | null
          entity_type: string
          id?: string
          metadata?: Json | null
          user_id: string
        }
        Update: {
          action_type?: string
          actor_name?: string | null
          created_at?: string
          description?: string | null
          entity_id?: string | null
          entity_name?: string | null
          entity_type?: string
          id?: string
          metadata?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      workspace_members: {
        Row: {
          avatar_url: string | null
          created_at: string
          department: string | null
          email: string | null
          full_name: string
          id: string
          joined_at: string | null
          last_active_at: string | null
          location: string | null
          metadata: Json | null
          phone: string | null
          role: string | null
          skills: Json | null
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          department?: string | null
          email?: string | null
          full_name: string
          id?: string
          joined_at?: string | null
          last_active_at?: string | null
          location?: string | null
          metadata?: Json | null
          phone?: string | null
          role?: string | null
          skills?: Json | null
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          department?: string | null
          email?: string | null
          full_name?: string
          id?: string
          joined_at?: string | null
          last_active_at?: string | null
          location?: string | null
          metadata?: Json | null
          phone?: string | null
          role?: string | null
          skills?: Json | null
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      workspace_projects: {
        Row: {
          color: string | null
          created_at: string
          description: string | null
          end_date: string | null
          icon: string | null
          id: string
          metadata: Json | null
          name: string
          priority: string | null
          progress: number | null
          start_date: string | null
          status: string | null
          tags: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          icon?: string | null
          id?: string
          metadata?: Json | null
          name: string
          priority?: string | null
          progress?: number | null
          start_date?: string | null
          status?: string | null
          tags?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          icon?: string | null
          id?: string
          metadata?: Json | null
          name?: string
          priority?: string | null
          progress?: number | null
          start_date?: string | null
          status?: string | null
          tags?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      workspace_tasks: {
        Row: {
          actual_hours: number | null
          ai_context: string | null
          assigned_to: string | null
          completed_at: string | null
          created_at: string
          description: string | null
          due_date: string | null
          estimated_hours: number | null
          id: string
          is_ai_generated: boolean | null
          priority: string | null
          project_id: string | null
          status: string | null
          tags: Json | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          actual_hours?: number | null
          ai_context?: string | null
          assigned_to?: string | null
          completed_at?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          estimated_hours?: number | null
          id?: string
          is_ai_generated?: boolean | null
          priority?: string | null
          project_id?: string | null
          status?: string | null
          tags?: Json | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          actual_hours?: number | null
          ai_context?: string | null
          assigned_to?: string | null
          completed_at?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          estimated_hours?: number | null
          id?: string
          is_ai_generated?: boolean | null
          priority?: string | null
          project_id?: string | null
          status?: string | null
          tags?: Json | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workspace_tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "workspace_projects"
            referencedColumns: ["id"]
          },
        ]
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
      is_same_company: {
        Args: { _company_id: string; _user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "owner" | "admin" | "manager" | "editor" | "viewer"
      sales_status:
        | "lead_created"
        | "contacted"
        | "engaged"
        | "qualifying"
        | "qualified"
        | "proposal_sent"
        | "negotiation"
        | "closing_imminent"
        | "won"
        | "lost"
        | "to_recontact"
        | "inactive"
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
      sales_status: [
        "lead_created",
        "contacted",
        "engaged",
        "qualifying",
        "qualified",
        "proposal_sent",
        "negotiation",
        "closing_imminent",
        "won",
        "lost",
        "to_recontact",
        "inactive",
      ],
    },
  },
} as const
