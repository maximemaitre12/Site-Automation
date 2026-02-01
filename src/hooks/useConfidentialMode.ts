import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

const STORAGE_KEY = 'aether_confidential_mode';

export function useConfidentialMode() {
  const { user } = useAuth();
  const [confidentialMode, setConfidentialMode] = useState<boolean>(() => {
    // Initialize from localStorage for instant UI
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored === 'true';
    }
    return false;
  });

  // Log audit event when mode changes
  const logAuditEvent = useCallback(async (action: string, metadata: Record<string, any>) => {
    if (!user) return;
    
    try {
      await supabase.from('audit_logs').insert({
        user_id: user.id,
        action,
        resource_type: 'confidential_mode',
        resource_id: user.id,
        metadata: {
          ...metadata,
          timestamp: new Date().toISOString(),
          user_agent: navigator.userAgent,
        }
      });
    } catch (error) {
      console.error('Failed to log audit event:', error);
    }
  }, [user]);

  const toggleConfidentialMode = useCallback(async (enabled: boolean) => {
    setConfidentialMode(enabled);
    localStorage.setItem(STORAGE_KEY, String(enabled));
    
    // Log the change
    await logAuditEvent(
      enabled ? 'CONFIDENTIAL_MODE_ENABLED' : 'CONFIDENTIAL_MODE_DISABLED',
      { confidential_mode: enabled }
    );
  }, [logAuditEvent]);

  // Log conversation events for audit trail
  const logConversationEvent = useCallback(async (
    action: 'CREATE' | 'DELETE' | 'MESSAGE_SENT',
    conversationId: string,
    metadata?: Record<string, any>
  ) => {
    if (!user) return;
    
    try {
      await supabase.from('audit_logs').insert({
        user_id: user.id,
        action: `BRAIN_CONVERSATION_${action}`,
        resource_type: 'brain_conversation',
        resource_id: conversationId,
        metadata: {
          ...metadata,
          confidential_mode: confidentialMode,
          timestamp: new Date().toISOString(),
        }
      });
    } catch (error) {
      console.error('Failed to log conversation event:', error);
    }
  }, [user, confidentialMode]);

  return {
    confidentialMode,
    toggleConfidentialMode,
    logConversationEvent,
  };
}
