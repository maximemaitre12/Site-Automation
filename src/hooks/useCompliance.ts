import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import { callAI } from '@/lib/ai';

export interface Risk {
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  description: string;
  recommendation: string;
  article?: string;
}

export interface Recommendation {
  priority: 'low' | 'medium' | 'high';
  action: string;
  impact: string;
}

export interface Audit {
  id: string;
  user_id: string;
  title: string;
  audit_type: string;
  input_text: string | null;
  compliance_score: number | null;
  risks: Risk[] | null;
  recommendations: Recommendation[] | null;
  report_content: string | null;
  status: string | null;
  created_at: string;
}

// Cache audits in memory
let cachedAudits: Audit[] = [];
let lastAuditUserId: string | null = null;
let auditsLoaded = false;

export function useCompliance() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Initialize with cached data
  const [audits, setAudits] = useState<Audit[]>(() => 
    user?.id === lastAuditUserId ? cachedAudits : []
  );
  const [loading, setLoading] = useState(() => 
    !(user?.id === lastAuditUserId && auditsLoaded)
  );
  const [analyzing, setAnalyzing] = useState(false);

  const fetchAudits = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    
    // Use cached data if available
    if (user.id === lastAuditUserId && auditsLoaded) {
      setAudits(cachedAudits);
      setLoading(false);
      return;
    }
    
    const { data, error } = await supabase
      .from('audits')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      const mappedAudits = data.map(audit => ({
        ...audit,
        risks: (audit.risks as unknown) as Risk[] | null,
        recommendations: (audit.recommendations as unknown) as Recommendation[] | null
      }));
      setAudits(mappedAudits);
      cachedAudits = mappedAudits;
      lastAuditUserId = user.id;
      auditsLoaded = true;
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user) fetchAudits();
  }, [user]);

  const runAudit = async (auditType: string, inputText: string, title?: string): Promise<Audit | null> => {
    if (!user || !inputText.trim()) return null;

    setAnalyzing(true);
    
    try {
      // Create audit record first
      const auditTitle = title || `Audit ${auditType} - ${new Date().toLocaleDateString('fr-FR')}`;
      
      const { data: newAudit, error: createError } = await supabase
        .from('audits')
        .insert({
          user_id: user.id,
          title: auditTitle,
          audit_type: auditType,
          input_text: inputText,
          status: 'analyzing'
        })
        .select()
        .single();

      if (createError) throw createError;

      // Run AI analysis
      const auditPrompts: Record<string, string> = {
        'gdpr': `Analyse ce texte pour la conformité RGPD. Évalue:
1. Consentement et base légale du traitement
2. Information des personnes concernées
3. Droits des personnes (accès, rectification, suppression, portabilité)
4. Sécurité des données
5. Transferts hors UE
6. Registre des traitements
7. DPO et gouvernance`,
        'privacy': `Analyse cette politique de confidentialité. Vérifie:
1. Clarté et accessibilité du langage
2. Identification du responsable de traitement
3. Finalités du traitement décrites
4. Base légale mentionnée
5. Durée de conservation
6. Droits des utilisateurs expliqués
7. Contact DPO fourni`,
        'data_processing': `Analyse ce processus de traitement de données. Vérifie:
1. Nécessité et proportionnalité
2. Minimisation des données
3. Exactitude des données
4. Limitation de conservation
5. Mesures de sécurité
6. Traçabilité et documentation`,
        'cookies': `Analyse la conformité cookies/traceurs. Vérifie:
1. Information préalable claire
2. Consentement explicite requis
3. Possibilité de refus simple
4. Liste des cookies exhaustive
5. Finalités détaillées
6. Durée de vie des cookies
7. Tiers destinataires identifiés`
      };

      const prompt = auditPrompts[auditType] || auditPrompts['gdpr'];

      const response = await callAI({
        messages: [{
          role: 'user',
          content: `${prompt}

IMPORTANT: Réponds UNIQUEMENT avec un objet JSON valide (sans markdown, sans backticks) au format suivant:
{
  "score": 75,
  "summary": "Résumé global de l'analyse",
  "risks": [
    {
      "severity": "high",
      "category": "Consentement",
      "description": "Description du risque",
      "recommendation": "Action corrective recommandée",
      "article": "Art. 7 RGPD"
    }
  ],
  "recommendations": [
    {
      "priority": "high",
      "action": "Action à entreprendre",
      "impact": "Impact attendu"
    }
  ],
  "details": "Analyse détaillée point par point"
}

Texte à analyser:
${inputText.slice(0, 8000)}`
        }],
        type: 'analyze'
      });

      if (response.error) throw new Error(response.error);

      // Parse AI response
      let analysis: any = {};
      try {
        // Clean response - remove markdown code blocks if present
        let cleanContent = response.content.trim();
        if (cleanContent.startsWith('```')) {
          cleanContent = cleanContent.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
        }
        analysis = JSON.parse(cleanContent);
      } catch (parseErr) {
        console.error('Failed to parse AI response:', parseErr);
        // Create fallback analysis
        analysis = {
          score: 50,
          summary: response.content.slice(0, 500),
          risks: [{
            severity: 'medium',
            category: 'Analyse',
            description: 'Analyse partielle effectuée',
            recommendation: 'Veuillez relancer l\'audit pour une analyse complète'
          }],
          recommendations: [{
            priority: 'medium',
            action: 'Réviser le contenu analysé',
            impact: 'Amélioration de la conformité'
          }],
          details: response.content
        };
      }

      // Update audit with results
      const { data: updatedAudit, error: updateError } = await supabase
        .from('audits')
        .update({
          compliance_score: analysis.score || 50,
          risks: analysis.risks || [],
          recommendations: analysis.recommendations || [],
          report_content: analysis.details || analysis.summary || '',
          status: 'completed'
        })
        .eq('id', newAudit.id)
        .select()
        .single();

      if (updateError) throw updateError;

      const finalAudit = {
        ...updatedAudit,
        risks: (updatedAudit.risks as unknown) as Risk[] | null,
        recommendations: (updatedAudit.recommendations as unknown) as Recommendation[] | null
      };

      const newAudits = [finalAudit, ...audits.filter(a => a.id !== finalAudit.id)];
      setAudits(newAudits);
      cachedAudits = newAudits;
      toast({ title: 'Succès', description: 'Audit de conformité terminé' });
      return finalAudit;
    } catch (err) {
      console.error('Audit error:', err);
      toast({ 
        title: 'Erreur', 
        description: err instanceof Error ? err.message : 'Erreur lors de l\'audit', 
        variant: 'destructive' 
      });
      return null;
    } finally {
      setAnalyzing(false);
    }
  };

  const deleteAudit = async (id: string): Promise<boolean> => {
    const { error } = await supabase.from('audits').delete().eq('id', id);
    if (error) {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
      return false;
    }
    const newAudits = audits.filter(a => a.id !== id);
    setAudits(newAudits);
    cachedAudits = newAudits;
    toast({ title: 'Succès', description: 'Audit supprimé' });
    return true;
  };

  const generateReport = async (auditId: string): Promise<string | null> => {
    const audit = audits.find(a => a.id === auditId);
    if (!audit) return null;

    const response = await callAI({
      messages: [{
        role: 'user',
        content: `Génère un rapport de conformité professionnel et détaillé en français basé sur cet audit:

Type: ${audit.audit_type}
Score: ${audit.compliance_score}%
Risques identifiés: ${JSON.stringify(audit.risks)}
Recommandations: ${JSON.stringify(audit.recommendations)}
Analyse: ${audit.report_content}

Le rapport doit inclure:
1. Résumé exécutif
2. Méthodologie d'audit
3. Résultats détaillés
4. Risques par ordre de priorité avec articles RGPD concernés
5. Plan d'action recommandé avec échéances
6. Conclusion et prochaines étapes`
      }],
      type: 'generate'
    });

    if (response.error) {
      toast({ title: 'Erreur', description: response.error, variant: 'destructive' });
      return null;
    }

    return response.content;
  };

  const getStats = () => {
    const total = audits.length;
    const avgScore = total > 0 
      ? Math.round(audits.reduce((sum, a) => sum + (a.compliance_score || 0), 0) / total) 
      : 0;
    const highRiskCount = audits.reduce((sum, a) => 
      sum + (a.risks?.filter(r => r.severity === 'high' || r.severity === 'critical').length || 0), 0);
    const completedCount = audits.filter(a => a.status === 'completed').length;

    return { total, avgScore, highRiskCount, completedCount };
  };

  return {
    audits,
    loading,
    analyzing,
    runAudit,
    deleteAudit,
    generateReport,
    getStats,
    refreshAudits: fetchAudits
  };
}
