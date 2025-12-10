import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export type DataType = 
  | 'document' 
  | 'company' 
  | 'candidate'
  | 'workflow'
  | 'ticket'
  | 'proposal'
  | 'audit'
  | 'call_analysis';

export interface UnifiedDataEntry {
  id: string;
  type: DataType;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  sensitivity: 'public' | 'internal' | 'confidential' | 'restricted';
  tags: string[];
  metadata: Record<string, unknown>;
  source_table: string;
  pii_detected: boolean;
}

interface DataStats {
  total: number;
  byType: Record<DataType, number>;
  piiCount: number;
  recentCount: number; // last 7 days
}

export function useUnifiedDataCatalog() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<UnifiedDataEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DataStats>({
    total: 0,
    byType: {
      document: 0,
      company: 0,
      candidate: 0,
      workflow: 0,
      ticket: 0,
      proposal: 0,
      audit: 0,
      call_analysis: 0
    },
    piiCount: 0,
    recentCount: 0
  });

  const fetchAllData = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    try {
      // Fetch from all tables in parallel
      const [
        documentsRes,
        enrichedCompaniesRes,
        candidatesRes,
        workflowsRes,
        ticketsRes,
        proposalsRes,
        auditsRes,
        callAnalysesRes
      ] = await Promise.all([
        supabase.from('aether_documents').select('*').order('created_at', { ascending: false }),
        supabase.from('enriched_companies').select('*').order('created_at', { ascending: false }),
        supabase.from('candidates').select('*').order('created_at', { ascending: false }),
        supabase.from('workflows').select('*').order('created_at', { ascending: false }),
        supabase.from('support_tickets').select('*').order('created_at', { ascending: false }),
        supabase.from('sales_proposals').select('*').order('created_at', { ascending: false }),
        supabase.from('audits').select('*').order('created_at', { ascending: false }),
        supabase.from('call_analyses').select('*').order('created_at', { ascending: false })
      ]);

      const allEntries: UnifiedDataEntry[] = [];

      // Transform documents
      (documentsRes.data || []).forEach(doc => {
        allEntries.push({
          id: doc.id,
          type: 'document',
          name: doc.title,
          description: doc.description || doc.ai_summary,
          created_at: doc.created_at,
          updated_at: doc.updated_at,
          sensitivity: (doc.access_level as UnifiedDataEntry['sensitivity']) || 'internal',
          tags: Array.isArray(doc.tags) ? doc.tags.map(String) : [],
          metadata: {
            file_type: doc.file_type,
            file_size: doc.file_size,
            status: doc.status,
            folder_id: doc.folder_id,
            ai_keywords: doc.ai_keywords
          },
          source_table: 'aether_documents',
          pii_detected: false
        });
      });

      // Transform enriched companies
      (enrichedCompaniesRes.data || []).forEach(company => {
        allEntries.push({
          id: company.id,
          type: 'company',
          name: company.name,
          description: company.ai_summary,
          created_at: company.created_at,
          updated_at: company.updated_at,
          sensitivity: 'internal',
          tags: Array.isArray(company.ai_keywords) ? company.ai_keywords.map(String) : [],
          metadata: {
            siren: company.siren,
            siret: company.siret,
            city: company.city,
            country: company.country,
            revenue: company.revenue,
            employees_count: company.employees_count,
            naf_code: company.naf_code,
            enrichment_status: company.enrichment_status
          },
          source_table: 'enriched_companies',
          pii_detected: true // Companies may have executive data
        });
      });

      // Transform candidates
      (candidatesRes.data || []).forEach(candidate => {
        allEntries.push({
          id: candidate.id,
          type: 'candidate',
          name: candidate.name,
          description: `${candidate.experience_years || 0} ans d'expérience - Score: ${candidate.match_score || 0}%`,
          created_at: candidate.created_at,
          updated_at: candidate.created_at,
          sensitivity: 'restricted', // HR data is highly sensitive
          tags: Array.isArray(candidate.skills) ? candidate.skills.map(String) : [],
          metadata: {
            email: candidate.email,
            phone: candidate.phone,
            status: candidate.status,
            match_score: candidate.match_score,
            experience_years: candidate.experience_years,
            job_id: candidate.job_id
          },
          source_table: 'candidates',
          pii_detected: true
        });
      });

      // Transform workflows
      (workflowsRes.data || []).forEach(workflow => {
        allEntries.push({
          id: workflow.id,
          type: 'workflow',
          name: workflow.name,
          description: workflow.description,
          created_at: workflow.created_at,
          updated_at: workflow.updated_at,
          sensitivity: 'internal',
          tags: [],
          metadata: {
            is_active: workflow.is_active,
            blocks_count: Array.isArray(workflow.blocks) ? workflow.blocks.length : 0,
            connections_count: Array.isArray(workflow.connections) ? workflow.connections.length : 0
          },
          source_table: 'workflows',
          pii_detected: false
        });
      });

      // Transform tickets
      (ticketsRes.data || []).forEach(ticket => {
        allEntries.push({
          id: ticket.id,
          type: 'ticket',
          name: ticket.subject,
          description: ticket.content,
          created_at: ticket.created_at,
          updated_at: ticket.created_at,
          sensitivity: 'internal',
          tags: [ticket.category, ticket.priority].filter(Boolean) as string[],
          metadata: {
            ticket_number: ticket.ticket_number,
            status: ticket.status,
            priority: ticket.priority,
            category: ticket.category,
            customer_email: ticket.customer_email,
            satisfaction_score: ticket.satisfaction_score
          },
          source_table: 'support_tickets',
          pii_detected: !!ticket.customer_email
        });
      });

      // Transform proposals
      (proposalsRes.data || []).forEach(proposal => {
        allEntries.push({
          id: proposal.id,
          type: 'proposal',
          name: proposal.title,
          description: `Prospect: ${proposal.prospect_name || 'N/A'} - Produit: ${proposal.product_name || 'N/A'}`,
          created_at: proposal.created_at,
          updated_at: proposal.updated_at,
          sensitivity: 'confidential',
          tags: [],
          metadata: {
            prospect_name: proposal.prospect_name,
            product_name: proposal.product_name,
            prospect_score: proposal.prospect_score,
            persona: proposal.persona
          },
          source_table: 'sales_proposals',
          pii_detected: false
        });
      });

      // Transform audits
      (auditsRes.data || []).forEach(audit => {
        allEntries.push({
          id: audit.id,
          type: 'audit',
          name: audit.title,
          description: `Audit ${audit.audit_type} - Score: ${audit.compliance_score || 0}%`,
          created_at: audit.created_at,
          updated_at: audit.created_at,
          sensitivity: 'confidential',
          tags: [audit.audit_type, audit.status].filter(Boolean) as string[],
          metadata: {
            audit_type: audit.audit_type,
            status: audit.status,
            compliance_score: audit.compliance_score,
            risks_count: Array.isArray(audit.risks) ? audit.risks.length : 0,
            recommendations_count: Array.isArray(audit.recommendations) ? audit.recommendations.length : 0
          },
          source_table: 'audits',
          pii_detected: false
        });
      });

      // Transform call analyses
      (callAnalysesRes.data || []).forEach(call => {
        allEntries.push({
          id: call.id,
          type: 'call_analysis',
          name: call.title,
          description: call.summary,
          created_at: call.created_at,
          updated_at: call.created_at,
          sensitivity: 'confidential',
          tags: [call.sentiment].filter(Boolean) as string[],
          metadata: {
            sentiment: call.sentiment,
            key_points_count: Array.isArray(call.key_points) ? call.key_points.length : 0,
            objections_count: Array.isArray(call.objections) ? call.objections.length : 0,
            next_steps_count: Array.isArray(call.next_steps) ? call.next_steps.length : 0
          },
          source_table: 'call_analyses',
          pii_detected: false
        });
      });

      // Sort by date
      allEntries.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      setEntries(allEntries);

      // Calculate stats
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const byType: Record<DataType, number> = {
        document: 0,
        company: 0,
        candidate: 0,
        workflow: 0,
        ticket: 0,
        proposal: 0,
        audit: 0,
        call_analysis: 0
      };

      allEntries.forEach(entry => {
        byType[entry.type]++;
      });

      setStats({
        total: allEntries.length,
        byType,
        piiCount: allEntries.filter(e => e.pii_detected).length,
        recentCount: allEntries.filter(e => new Date(e.created_at) > sevenDaysAgo).length
      });

    } catch (error) {
      console.error('Error fetching unified catalog:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchAllData();
    }
  }, [user, fetchAllData]);

  const deleteEntry = async (entry: UnifiedDataEntry) => {
    // Use type assertion for dynamic table deletion
    const { error } = await supabase
      .from(entry.source_table as 'aether_documents')
      .delete()
      .eq('id', entry.id);
    
    if (error) {
      throw error;
    }
    
    await fetchAllData();
  };

  return {
    entries,
    loading,
    stats,
    refresh: fetchAllData,
    deleteEntry
  };
}
