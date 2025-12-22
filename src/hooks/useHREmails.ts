import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export interface HREmail {
  id: string;
  user_id: string;
  account_id?: string;
  candidate_id?: string;
  direction: 'inbound' | 'outbound';
  from_email: string;
  from_name?: string;
  to_email: string;
  to_name?: string;
  subject: string;
  body_html?: string;
  body_text?: string;
  attachments?: any[];
  ai_analysis?: {
    cv_detected?: boolean;
    lm_detected?: boolean;
    summary?: string;
    sentiment?: string;
  };
  ai_suggested_response?: string;
  ai_improvements?: any[];
  status: 'new' | 'read' | 'replied' | 'archived';
  parent_email_id?: string;
  thread_id?: string;
  external_id?: string;
  provider?: string;
  email_date: string;
  created_at: string;
  read_at?: string;
  replied_at?: string;
  candidate?: {
    id: string;
    name: string;
    email?: string;
    status?: string;
  };
}

export interface HREmailAccount {
  id: string;
  user_id: string;
  provider: 'gmail' | 'outlook' | 'manual';
  email_address: string;
  is_active: boolean;
  last_sync_at?: string;
  sync_folder?: string;
  sync_keywords?: string[];
  auto_parse_cv?: boolean;
  auto_create_candidate?: boolean;
  sender_name?: string;
  signature_html?: string;
}

export function useHREmails() {
  const { user } = useAuth();
  const [emails, setEmails] = useState<HREmail[]>([]);
  const [accounts, setAccounts] = useState<HREmailAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [composing, setComposing] = useState(false);

  const fetchEmails = useCallback(async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('hr_emails')
        .select(`
          *,
          candidate:candidates(id, name, email, status)
        `)
        .eq('user_id', user.id)
        .order('email_date', { ascending: false });

      if (error) throw error;
      setEmails(data as HREmail[] || []);
    } catch (error) {
      console.error('Error fetching HR emails:', error);
    }
  }, [user]);

  const fetchAccounts = useCallback(async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('hr_email_accounts')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      setAccounts(data as HREmailAccount[] || []);
    } catch (error) {
      console.error('Error fetching email accounts:', error);
    }
  }, [user]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchEmails(), fetchAccounts()]);
      setLoading(false);
    };
    
    if (user) {
      loadData();
    }
  }, [user, fetchEmails, fetchAccounts]);

  const importEmail = async (emailData: {
    from_email: string;
    from_name?: string;
    subject: string;
    body_text?: string;
    body_html?: string;
    candidate_id?: string;
    attachments?: any[];
  }) => {
    if (!user) return null;

    try {
      const activeAccount = accounts.find(a => a.is_active);
      
      const { data, error } = await supabase
        .from('hr_emails')
        .insert({
          user_id: user.id,
          account_id: activeAccount?.id,
          direction: 'inbound',
          from_email: emailData.from_email,
          from_name: emailData.from_name,
          to_email: activeAccount?.email_address || user.email || '',
          subject: emailData.subject,
          body_text: emailData.body_text,
          body_html: emailData.body_html,
          candidate_id: emailData.candidate_id,
          attachments: emailData.attachments || [],
          status: 'new',
          provider: 'manual',
          email_date: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      
      await fetchEmails();
      toast.success('Email importé avec succès');
      return data;
    } catch (error: any) {
      console.error('Error importing email:', error);
      toast.error('Erreur lors de l\'import');
      return null;
    }
  };

  const updateEmailStatus = async (emailId: string, status: HREmail['status']) => {
    try {
      const updates: any = { status };
      if (status === 'read') updates.read_at = new Date().toISOString();
      if (status === 'replied') updates.replied_at = new Date().toISOString();

      const { error } = await supabase
        .from('hr_emails')
        .update(updates)
        .eq('id', emailId);

      if (error) throw error;
      await fetchEmails();
    } catch (error) {
      console.error('Error updating email status:', error);
    }
  };

  const linkEmailToCandidate = async (emailId: string, candidateId: string) => {
    try {
      const { error } = await supabase
        .from('hr_emails')
        .update({ candidate_id: candidateId })
        .eq('id', emailId);

      if (error) throw error;
      await fetchEmails();
      toast.success('Email lié au candidat');
    } catch (error) {
      console.error('Error linking email to candidate:', error);
      toast.error('Erreur lors de la liaison');
    }
  };

  const deleteEmail = async (emailId: string) => {
    try {
      const { error } = await supabase
        .from('hr_emails')
        .delete()
        .eq('id', emailId);

      if (error) throw error;
      await fetchEmails();
      toast.success('Email supprimé');
    } catch (error) {
      console.error('Error deleting email:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const composeWithAI = async (
    action: 'generate' | 'improve' | 'shorten' | 'check' | 'suggest_improvements' | 'propose_interview',
    options: {
      emailContent?: string;
      context?: {
        originalEmail?: string;
        intent?: string;
      };
      candidateInfo?: any;
      jobInfo?: any;
      tone?: 'professional' | 'formal' | 'friendly' | 'concise';
    }
  ) => {
    setComposing(true);
    try {
      const { data, error } = await supabase.functions.invoke('hr-email-compose', {
        body: {
          action,
          emailContent: options.emailContent,
          context: options.context,
          candidateInfo: options.candidateInfo,
          jobInfo: options.jobInfo,
          tone: options.tone,
        },
      });

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Error composing with AI:', error);
      toast.error('Erreur lors de la génération IA');
      return null;
    } finally {
      setComposing(false);
    }
  };

  const sendEmail = async (emailData: {
    to: string;
    subject: string;
    bodyHtml?: string;
    bodyText?: string;
    candidateId?: string;
    parentEmailId?: string;
    senderName?: string;
  }) => {
    try {
      const { data, error } = await supabase.functions.invoke('hr-email-send', {
        body: emailData,
      });

      if (error) throw error;
      
      await fetchEmails();
      toast.success('Email envoyé avec succès');
      return data;
    } catch (error: any) {
      console.error('Error sending email:', error);
      toast.error('Erreur lors de l\'envoi');
      return null;
    }
  };

  const saveEmailAccount = async (accountData: Partial<HREmailAccount>) => {
    if (!user) return null;

    try {
      const existingAccount = accounts.find(a => a.provider === accountData.provider);

      if (existingAccount) {
        const { data, error } = await supabase
          .from('hr_email_accounts')
          .update(accountData)
          .eq('id', existingAccount.id)
          .select()
          .single();

        if (error) throw error;
        await fetchAccounts();
        toast.success('Configuration mise à jour');
        return data;
      } else {
        const { data, error } = await supabase
          .from('hr_email_accounts')
          .insert({
            user_id: user.id,
            provider: accountData.provider || 'manual',
            email_address: accountData.email_address || user.email || '',
            ...accountData,
          })
          .select()
          .single();

        if (error) throw error;
        await fetchAccounts();
        toast.success('Compte email ajouté');
        return data;
      }
    } catch (error: any) {
      console.error('Error saving email account:', error);
      toast.error('Erreur lors de la sauvegarde');
      return null;
    }
  };

  // Computed values
  const newEmails = emails.filter(e => e.status === 'new' && e.direction === 'inbound');
  const unreadEmails = emails.filter(e => e.status === 'new' || e.status === 'read');
  const inboundEmails = emails.filter(e => e.direction === 'inbound');
  const outboundEmails = emails.filter(e => e.direction === 'outbound');
  const activeAccount = accounts.find(a => a.is_active);

  return {
    emails,
    accounts,
    activeAccount,
    loading,
    composing,
    newEmails,
    unreadEmails,
    inboundEmails,
    outboundEmails,
    fetchEmails,
    fetchAccounts,
    importEmail,
    updateEmailStatus,
    linkEmailToCandidate,
    deleteEmail,
    composeWithAI,
    sendEmail,
    saveEmailAccount,
  };
}
