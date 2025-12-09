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
          connections: Json | null
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
          connections?: Json | null
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
          connections?: Json | null
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
