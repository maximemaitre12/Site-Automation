import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';
import { useQueryClient } from '@tanstack/react-query';

export type ActionType = 
  | 'create_candidate' 
  | 'create_deal' 
  | 'create_document' 
  | 'create_ticket'
  | 'create_contact'
  | 'update_candidate'
  | 'update_deal'
  | 'update_ticket'
  | 'delete_candidate'
  | 'delete_deal'
  | 'analyze_cv';

export interface ActionResult {
  success: boolean;
  action: ActionType;
  message: string;
  createdId?: string;
  data?: any;
}

export interface DetectedAction {
  action: ActionType;
  confidence: number;
  data: Record<string, any>;
  requiresFile?: boolean;
}

// Keywords for action detection
const ACTION_PATTERNS: Record<ActionType, { keywords: string[]; extractors: RegExp[] }> = {
  create_candidate: {
    keywords: ['ajoute candidat', 'créer candidat', 'nouveau candidat', 'importer cv', 'enregistrer cv', 'ajouter ce cv', 'inclure dans hr', 'ajouter dans rh'],
    extractors: [
      /candidat\s+(?:nommé|appelé)?\s*"?([^"]+)"?/i,
      /cv\s+de\s+"?([^"]+)"?/i,
    ]
  },
  analyze_cv: {
    keywords: ['analyser cv', 'analyse ce cv', 'évaluer cv', 'parser cv', 'lire cv'],
    extractors: []
  },
  create_deal: {
    keywords: ['créer deal', 'nouveau deal', 'ajouter opportunité', 'créer opportunité', 'nouvelle vente'],
    extractors: [
      /deal\s+(?:pour|avec)?\s*"?([^"]+)"?/i,
      /opportunité\s+(?:pour|avec)?\s*"?([^"]+)"?/i,
      /(\d+)\s*€/i,
    ]
  },
  create_document: {
    keywords: ['créer document', 'nouveau document', 'sauvegarder document', 'enregistrer comme document'],
    extractors: [
      /document\s+(?:intitulé|nommé)?\s*"?([^"]+)"?/i,
    ]
  },
  create_ticket: {
    keywords: ['créer ticket', 'nouveau ticket', 'ouvrir ticket', 'signaler problème'],
    extractors: [
      /ticket\s+(?:pour|concernant)?\s*"?([^"]+)"?/i,
    ]
  },
  create_contact: {
    keywords: ['créer contact', 'nouveau contact', 'ajouter contact'],
    extractors: [
      /contact\s+(?:nommé|appelé)?\s*"?([^"]+)"?/i,
    ]
  },
  update_candidate: {
    keywords: ['modifier candidat', 'mettre à jour candidat', 'changer status candidat'],
    extractors: []
  },
  update_deal: {
    keywords: ['modifier deal', 'mettre à jour deal', 'changer status deal', 'marquer deal'],
    extractors: []
  },
  update_ticket: {
    keywords: ['modifier ticket', 'mettre à jour ticket', 'fermer ticket', 'résoudre ticket'],
    extractors: []
  },
  delete_candidate: {
    keywords: ['supprimer candidat', 'effacer candidat', 'retirer candidat'],
    extractors: []
  },
  delete_deal: {
    keywords: ['supprimer deal', 'effacer deal', 'annuler deal'],
    extractors: []
  }
};

// Detect if message contains a file attachment (CV)
function hasFileAttachment(attachments?: Array<{ type: string; mimeType?: string; name?: string }>): boolean {
  if (!attachments || attachments.length === 0) return false;
  return attachments.some(a => 
    a.type === 'document' || 
    a.mimeType?.includes('pdf') || 
    a.mimeType?.includes('word') ||
    a.name?.toLowerCase().includes('cv') ||
    a.name?.toLowerCase().includes('resume')
  );
}

// Detect action from user message
export function detectAction(
  message: string, 
  attachments?: Array<{ type: string; mimeType?: string; name?: string; content?: string }>
): DetectedAction | null {
  const msgLower = message.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  
  // Check for CV with HR intent
  const hasCVFile = hasFileAttachment(attachments);
  const hasHRIntent = /(hr|rh|candidat|recrutement|talent|embauche|cv)/i.test(msgLower);
  
  if (hasCVFile && hasHRIntent) {
    return {
      action: 'create_candidate',
      confidence: 0.95,
      data: {},
      requiresFile: true
    };
  }
  
  // Check for explicit actions
  for (const [action, patterns] of Object.entries(ACTION_PATTERNS)) {
    for (const keyword of patterns.keywords) {
      const keywordNorm = keyword.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      if (msgLower.includes(keywordNorm)) {
        const data: Record<string, any> = {};
        
        // Try to extract data using patterns
        for (const extractor of patterns.extractors) {
          const match = message.match(extractor);
          if (match) {
            if (action === 'create_deal' && match[1] && /\d+/.test(match[1])) {
              data.value = parseInt(match[1], 10);
            } else if (match[1]) {
              data.name = match[1];
            }
          }
        }
        
        return {
          action: action as ActionType,
          confidence: 0.85,
          data,
          requiresFile: action === 'create_candidate' || action === 'analyze_cv'
        };
      }
    }
  }
  
  return null;
}

export function useBrainActions() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const executeAction = useCallback(async (
    action: ActionType,
    data: Record<string, any>,
    fileBase64?: string,
    fileName?: string,
    mimeType?: string
  ): Promise<ActionResult> => {
    try {
      console.log(`Executing brain action: ${action}`, data);
      
      const { data: result, error } = await supabase.functions.invoke('brain-execute-action', {
        body: {
          action,
          data,
          fileBase64,
          fileName,
          mimeType
        }
      });

      if (error) {
        console.error('Action execution error:', error);
        return {
          success: false,
          action,
          message: `Erreur: ${error.message}`
        };
      }

      // Invalidate relevant queries based on action
      if (result?.success) {
        switch (action) {
          case 'create_candidate':
          case 'update_candidate':
          case 'delete_candidate':
            queryClient.invalidateQueries({ queryKey: ['candidates'] });
            break;
          case 'create_deal':
          case 'update_deal':
          case 'delete_deal':
            queryClient.invalidateQueries({ queryKey: ['sales-deals'] });
            break;
          case 'create_document':
            queryClient.invalidateQueries({ queryKey: ['brain-documents'] });
            queryClient.invalidateQueries({ queryKey: ['aether-documents'] });
            break;
          case 'create_ticket':
          case 'update_ticket':
            queryClient.invalidateQueries({ queryKey: ['support-tickets'] });
            break;
          case 'create_contact':
            queryClient.invalidateQueries({ queryKey: ['crm-contacts'] });
            break;
        }
        
        toast({
          title: 'Action réalisée',
          description: result.message,
        });
      }

      return result as ActionResult;
    } catch (err) {
      console.error('Action error:', err);
      return {
        success: false,
        action,
        message: err instanceof Error ? err.message : 'Erreur inconnue'
      };
    }
  }, [queryClient, toast]);

  return {
    executeAction,
    detectAction
  };
}
