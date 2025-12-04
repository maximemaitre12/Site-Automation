import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import { callAI } from '@/lib/ai';

export interface Invoice {
  id: string;
  user_id: string;
  vendor_name: string;
  invoice_number: string | null;
  amount: number | null;
  tax_amount: number | null;
  currency: string | null;
  invoice_date: string | null;
  due_date: string | null;
  category: string | null;
  status: string | null;
  anomaly_notes: string | null;
  file_url: string | null;
  ocr_data: any;
  created_at: string;
}

export interface AccountingEntry {
  id: string;
  user_id: string;
  invoice_id: string | null;
  account_code: string;
  description: string | null;
  debit_amount: number | null;
  credit_amount: number | null;
  entry_date: string | null;
  is_suggested: boolean | null;
  created_at: string;
}

export function useFinance() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [entries, setEntries] = useState<AccountingEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchData = async () => {
    if (!user) return;
    
    const [invoicesRes, entriesRes] = await Promise.all([
      supabase.from('invoices').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
      supabase.from('accounting_entries').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
    ]);

    if (!invoicesRes.error) setInvoices(invoicesRes.data || []);
    if (!entriesRes.error) setEntries(entriesRes.data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const createInvoice = async (data: {
    vendorName: string;
    amount: number;
    taxAmount?: number;
    invoiceDate?: string;
    dueDate?: string;
    invoiceNumber?: string;
    category?: string;
  }): Promise<Invoice | null> => {
    if (!user) return null;

    try {
      const { data: invoice, error } = await supabase
        .from('invoices')
        .insert({
          user_id: user.id,
          vendor_name: data.vendorName,
          amount: data.amount,
          tax_amount: data.taxAmount || 0,
          invoice_date: data.invoiceDate || new Date().toISOString().split('T')[0],
          due_date: data.dueDate,
          invoice_number: data.invoiceNumber,
          category: data.category,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;
      
      await fetchData();
      toast({ title: 'Succès', description: 'Facture créée' });
      return invoice;
    } catch (err) {
      toast({ title: 'Erreur', description: 'Erreur lors de la création', variant: 'destructive' });
      return null;
    }
  };

  const analyzeInvoice = async (invoiceId: string, invoiceText: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const response = await callAI({
        messages: [{
          role: 'user',
          content: `Analyse cette facture et extrais les informations en JSON:
{
  "vendor_name": "nom fournisseur",
  "invoice_number": "numéro",
  "amount": number,
  "tax_amount": number,
  "invoice_date": "YYYY-MM-DD",
  "due_date": "YYYY-MM-DD",
  "category": "catégorie (fournitures, services, logiciel, etc.)",
  "anomalies": ["anomalie détectée si présente"]
}

Texte de la facture:
${invoiceText}`
        }],
        type: 'extract'
      });

      let parsed: any = {};
      try {
        parsed = JSON.parse(response.content);
      } catch {}

      const anomalyNotes = parsed.anomalies?.length > 0 ? parsed.anomalies.join(', ') : null;

      await supabase
        .from('invoices')
        .update({
          vendor_name: parsed.vendor_name || 'Fournisseur',
          invoice_number: parsed.invoice_number,
          amount: parsed.amount,
          tax_amount: parsed.tax_amount,
          invoice_date: parsed.invoice_date,
          due_date: parsed.due_date,
          category: parsed.category,
          anomaly_notes: anomalyNotes,
          ocr_data: parsed,
          status: anomalyNotes ? 'anomaly' : 'processed'
        })
        .eq('id', invoiceId);

      await fetchData();
      toast({ title: 'Succès', description: 'Facture analysée' });
      return true;
    } catch (err) {
      toast({ title: 'Erreur', description: 'Erreur lors de l\'analyse', variant: 'destructive' });
      return false;
    }
  };

  const generateAccountingEntries = async (invoiceId: string): Promise<boolean> => {
    if (!user) return false;

    const invoice = invoices.find(i => i.id === invoiceId);
    if (!invoice) return false;

    try {
      const response = await callAI({
        messages: [{
          role: 'user',
          content: `Génère les écritures comptables pour cette facture en JSON (array):
[
  {"account_code": "401", "description": "Fournisseur X", "debit": 0, "credit": 1200},
  {"account_code": "607", "description": "Achats", "debit": 1000, "credit": 0},
  {"account_code": "44566", "description": "TVA déductible", "debit": 200, "credit": 0}
]

Facture:
- Fournisseur: ${invoice.vendor_name}
- Montant HT: ${(invoice.amount || 0) - (invoice.tax_amount || 0)}€
- TVA: ${invoice.tax_amount || 0}€
- Total TTC: ${invoice.amount || 0}€
- Catégorie: ${invoice.category || 'Achat'}`
        }],
        type: 'generate'
      });

      let entries: any[] = [];
      try {
        entries = JSON.parse(response.content);
      } catch {}

      for (const entry of entries) {
        await supabase
          .from('accounting_entries')
          .insert({
            user_id: user.id,
            invoice_id: invoiceId,
            account_code: entry.account_code,
            description: entry.description,
            debit_amount: entry.debit || 0,
            credit_amount: entry.credit || 0,
            entry_date: invoice.invoice_date,
            is_suggested: true
          });
      }

      await fetchData();
      toast({ title: 'Succès', description: 'Écritures générées' });
      return true;
    } catch (err) {
      toast({ title: 'Erreur', description: 'Erreur lors de la génération', variant: 'destructive' });
      return false;
    }
  };

  const deleteInvoice = async (id: string): Promise<boolean> => {
    const { error } = await supabase.from('invoices').delete().eq('id', id);
    if (error) {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
      return false;
    }
    await fetchData();
    toast({ title: 'Succès', description: 'Facture supprimée' });
    return true;
  };

  const getStats = () => {
    const totalAmount = invoices.reduce((sum, inv) => sum + (inv.amount || 0), 0);
    const pendingCount = invoices.filter(inv => inv.status === 'pending').length;
    const anomalyCount = invoices.filter(inv => inv.status === 'anomaly').length;
    return { totalAmount, pendingCount, anomalyCount, totalInvoices: invoices.length };
  };

  return {
    invoices,
    entries,
    loading,
    createInvoice,
    analyzeInvoice,
    generateAccountingEntries,
    deleteInvoice,
    getStats,
    refreshData: fetchData
  };
}
