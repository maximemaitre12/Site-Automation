import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { callAI } from '@/lib/ai';
import { useToast } from '@/hooks/use-toast';

export interface ComplianceRule {
  id: string;
  user_id: string;
  rule_type: 'pricing' | 'discount' | 'claim' | 'legal' | 'competitor' | 'tone';
  rule_name: string;
  rule_description?: string;
  keywords?: string[];
  max_discount_percent?: number;
  forbidden_phrases?: string[];
  required_disclaimers?: string[];
  is_active: boolean;
  severity: 'info' | 'warning' | 'blocker';
  created_at: string;
}

export interface ComplianceIssue {
  type: string;
  severity: 'info' | 'warning' | 'blocker';
  message: string;
  suggestion?: string;
  location?: string;
}

export interface ComplianceResult {
  score: number;
  status: 'approved' | 'review' | 'blocked';
  issues: ComplianceIssue[];
  summary: string;
}

export interface ComplianceCheck {
  id: string;
  user_id: string;
  content_type: string;
  content_id?: string;
  content_preview?: string;
  compliance_score?: number;
  issues: ComplianceIssue[];
  status: string;
  checked_at: string;
}

// Default compliance rules for new users
const DEFAULT_RULES: Omit<ComplianceRule, 'id' | 'user_id' | 'created_at'>[] = [
  {
    rule_type: 'claim',
    rule_name: 'Affirmations exagérées',
    rule_description: 'Éviter les promesses non vérifiables',
    forbidden_phrases: ['100% garanti', 'le meilleur du marché', 'sans aucun risque', 'résultats instantanés', 'leader mondial'],
    is_active: true,
    severity: 'warning'
  },
  {
    rule_type: 'discount',
    rule_name: 'Remise maximale',
    rule_description: 'Les remises ne doivent pas dépasser le seuil autorisé',
    max_discount_percent: 30,
    is_active: true,
    severity: 'blocker'
  },
  {
    rule_type: 'legal',
    rule_name: 'Mentions légales',
    rule_description: 'Certaines mentions sont obligatoires',
    required_disclaimers: ['conditions générales', 'politique de confidentialité'],
    is_active: true,
    severity: 'info'
  },
  {
    rule_type: 'competitor',
    rule_name: 'Comparaison concurrents',
    rule_description: 'Éviter les comparaisons directes dénigrantes',
    forbidden_phrases: ['contrairement à nos concurrents', 'mieux que', 'supérieur à'],
    is_active: true,
    severity: 'warning'
  },
  {
    rule_type: 'tone',
    rule_name: 'Ton professionnel',
    rule_description: 'Maintenir un ton professionnel et respectueux',
    forbidden_phrases: ['vous devez', 'vous êtes obligé', 'dernière chance'],
    is_active: true,
    severity: 'info'
  }
];

export function useSalesCompliance() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [checking, setChecking] = useState(false);

  // Fetch compliance rules
  const { data: rules = [], isLoading: loadingRules } = useQuery({
    queryKey: ['sales-compliance-rules'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('sales_internal_compliance_rules')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return (data || []) as ComplianceRule[];
    }
  });

  // Fetch compliance history
  const { data: complianceHistory = [], isLoading: loadingHistory } = useQuery({
    queryKey: ['sales-compliance-checks'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('sales_compliance_checks')
        .select('*')
        .eq('user_id', user.id)
        .order('checked_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return (data || []) as unknown as ComplianceCheck[];
    }
  });

  const invalidateRules = () => {
    queryClient.invalidateQueries({ queryKey: ['sales-compliance-rules'] });
  };

  const invalidateHistory = () => {
    queryClient.invalidateQueries({ queryKey: ['sales-compliance-checks'] });
  };

  // Initialize default rules for new users
  const initializeDefaultRules = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Check if user already has rules
      const { data: existing } = await supabase
        .from('sales_internal_compliance_rules')
        .select('id')
        .eq('user_id', user.id)
        .limit(1);

      if (existing && existing.length > 0) return;

      // Insert default rules
      const rulesToInsert = DEFAULT_RULES.map(rule => ({
        ...rule,
        user_id: user.id
      }));

      await supabase
        .from('sales_internal_compliance_rules')
        .insert(rulesToInsert as any);

      invalidateRules();
    } catch (error) {
      console.error('Error initializing default rules:', error);
    }
  };

  // Check content compliance
  const checkCompliance = async (
    content: string,
    contentType: string,
    contentId?: string
  ): Promise<ComplianceResult> => {
    setChecking(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non authentifié');

      // Get active rules
      const activeRules = rules.filter(r => r.is_active);
      const issues: ComplianceIssue[] = [];

      // 1. Check against configured rules
      for (const rule of activeRules) {
        // Check forbidden phrases
        if (rule.forbidden_phrases && rule.forbidden_phrases.length > 0) {
          for (const phrase of rule.forbidden_phrases) {
            if (content.toLowerCase().includes(phrase.toLowerCase())) {
              issues.push({
                type: rule.rule_type,
                severity: rule.severity,
                message: `Phrase interdite détectée : "${phrase}"`,
                suggestion: `Reformulez sans utiliser "${phrase}"`,
                location: rule.rule_name
              });
            }
          }
        }

        // Check discount limits
        if (rule.rule_type === 'discount' && rule.max_discount_percent) {
          const discountMatches = content.match(/(\d+)\s*%\s*(de\s*)?(réduction|remise|discount)/gi);
          if (discountMatches) {
            for (const match of discountMatches) {
              const percent = parseInt(match.match(/\d+/)?.[0] || '0');
              if (percent > rule.max_discount_percent) {
                issues.push({
                  type: 'discount',
                  severity: 'blocker',
                  message: `Remise de ${percent}% détectée, dépasse le maximum autorisé (${rule.max_discount_percent}%)`,
                  suggestion: `Limitez la remise à ${rule.max_discount_percent}% maximum`
                });
              }
            }
          }
        }
      }

      // 2. AI-powered compliance check for deeper analysis
      const prompt = `Tu es un expert en conformité commerciale. Analyse ce contenu et identifie les problèmes potentiels.

CONTENU À ANALYSER:
${content.substring(0, 3000)}

Vérifie:
1. Affirmations exagérées ou non vérifiables
2. Promesses irréalistes
3. Comparaisons inappropriées avec la concurrence
4. Ton agressif ou irrespectueux
5. Informations potentiellement trompeuses
6. Manque de clarté sur les conditions

Réponds en JSON:
{
  "ai_issues": [
    {
      "type": "claim|pricing|legal|competitor|tone|other",
      "severity": "info|warning|blocker",
      "message": "Description du problème",
      "suggestion": "Comment corriger"
    }
  ],
  "overall_assessment": "Évaluation globale en une phrase"
}

Si tout est conforme, retourne un tableau ai_issues vide.`;

      const aiResponse = await callAI({
        messages: [{ role: 'user', content: prompt }],
        systemPrompt: 'Tu es un assistant de conformité commerciale. Réponds uniquement en JSON valide.',
        type: 'analyze'
      });

      if (!aiResponse.error && aiResponse.content) {
        try {
          const jsonMatch = aiResponse.content.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const aiResult = JSON.parse(jsonMatch[0]);
            if (aiResult.ai_issues && Array.isArray(aiResult.ai_issues)) {
              issues.push(...aiResult.ai_issues.map((issue: any) => ({
                ...issue,
                severity: issue.severity || 'warning'
              })));
            }
          }
        } catch (e) {
          console.error('Error parsing AI compliance response:', e);
        }
      }

      // Calculate score
      const blockers = issues.filter(i => i.severity === 'blocker').length;
      const warnings = issues.filter(i => i.severity === 'warning').length;
      const infos = issues.filter(i => i.severity === 'info').length;

      let score = 100;
      score -= blockers * 30;
      score -= warnings * 10;
      score -= infos * 2;
      score = Math.max(0, Math.min(100, score));

      let status: 'approved' | 'review' | 'blocked' = 'approved';
      if (blockers > 0) status = 'blocked';
      else if (warnings > 0 || score < 80) status = 'review';

      const result: ComplianceResult = {
        score,
        status,
        issues,
        summary: status === 'approved' 
          ? 'Contenu conforme aux règles internes'
          : status === 'blocked'
          ? `${blockers} problème(s) bloquant(s) détecté(s)`
          : `${warnings} avertissement(s), ${infos} suggestion(s)`
      };

      // Save to history
      await supabase.from('sales_compliance_checks').insert({
        user_id: user.id,
        content_type: contentType,
        content_id: contentId || null,
        content_preview: content.substring(0, 200),
        compliance_score: score,
        issues: issues as any,
        status: status
      });

      invalidateHistory();
      return result;
    } catch (error: any) {
      console.error('Error checking compliance:', error);
      toast({
        title: 'Erreur de vérification',
        description: error.message,
        variant: 'destructive'
      });
      return {
        score: 0,
        status: 'review',
        issues: [{ type: 'error', severity: 'warning', message: 'Erreur lors de la vérification' }],
        summary: 'Vérification incomplète'
      };
    } finally {
      setChecking(false);
    }
  };

  // Add a new rule
  const addRule = async (rule: Omit<ComplianceRule, 'id' | 'user_id' | 'created_at'>): Promise<boolean> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non authentifié');

      const { error } = await supabase
        .from('sales_internal_compliance_rules')
        .insert({ ...rule, user_id: user.id } as any);

      if (error) throw error;

      invalidateRules();
      toast({ title: 'Règle ajoutée' });
      return true;
    } catch (error: any) {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
      return false;
    }
  };

  // Update a rule
  const updateRule = async (id: string, updates: Partial<ComplianceRule>): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('sales_internal_compliance_rules')
        .update(updates as any)
        .eq('id', id);

      if (error) throw error;

      invalidateRules();
      toast({ title: 'Règle mise à jour' });
      return true;
    } catch (error: any) {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
      return false;
    }
  };

  // Delete a rule
  const deleteRule = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('sales_internal_compliance_rules')
        .delete()
        .eq('id', id);

      if (error) throw error;

      invalidateRules();
      toast({ title: 'Règle supprimée' });
      return true;
    } catch (error: any) {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
      return false;
    }
  };

  // Toggle rule active status
  const toggleRule = async (id: string, isActive: boolean): Promise<boolean> => {
    return updateRule(id, { is_active: isActive } as any);
  };

  return {
    rules,
    complianceHistory,
    loadingRules,
    loadingHistory,
    checking,
    checkCompliance,
    addRule,
    updateRule,
    deleteRule,
    toggleRule,
    initializeDefaultRules,
    invalidateRules,
    invalidateHistory
  };
}
