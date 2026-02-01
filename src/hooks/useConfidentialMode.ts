import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

const STORAGE_KEY = 'aether_confidential_mode';
const SESSION_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes d'inactivité max
const MEMORY_WIPE_DELAY_MS = 1000; // Délai avant effacement mémoire

export interface ConfidentialSession {
  messages: Array<{ role: string; content: string }>;
  startedAt: Date;
  lastActivityAt: Date;
}

export function useConfidentialMode() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [confidentialMode, setConfidentialMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored === 'true';
    }
    return false;
  });

  // Session confidentielle en mémoire UNIQUEMENT (jamais persistée)
  const [confidentialSession, setConfidentialSession] = useState<ConfidentialSession | null>(null);
  const sessionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const activityTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  // Effacement mémoire sécurisé
  const wipeConfidentialMemory = useCallback(() => {
    // Effacer la session en mémoire
    setConfidentialSession(null);
    
    // Effacer le streaming content si présent
    if (typeof window !== 'undefined') {
      // Clear any cached data in sessionStorage
      sessionStorage.removeItem('brain_streaming_content');
      sessionStorage.removeItem('brain_current_message');
      
      // Force garbage collection hint
      if ((window as any).gc) {
        (window as any).gc();
      }
    }
    
    console.log('[CONFIDENTIAL] Memory wiped securely');
  }, []);

  // Session timeout handler
  const resetSessionTimeout = useCallback(() => {
    if (!confidentialMode) return;
    
    // Clear existing timeout
    if (sessionTimeoutRef.current) {
      clearTimeout(sessionTimeoutRef.current);
    }
    
    // Set new timeout
    sessionTimeoutRef.current = setTimeout(() => {
      if (confidentialMode) {
        wipeConfidentialMemory();
        toast({
          title: "🔒 Session expirée",
          description: "Inactivité détectée. Mémoire confidentielle effacée.",
          variant: "destructive"
        });
        logAuditEvent('CONFIDENTIAL_SESSION_TIMEOUT', { reason: 'inactivity' });
      }
    }, SESSION_TIMEOUT_MS);
    
    // Update last activity
    setConfidentialSession(prev => prev ? {
      ...prev,
      lastActivityAt: new Date()
    } : null);
  }, [confidentialMode, wipeConfidentialMemory, toast, logAuditEvent]);

  // Activity detector
  useEffect(() => {
    if (!confidentialMode) return;

    const handleActivity = () => {
      resetSessionTimeout();
    };

    // Track user activity
    window.addEventListener('mousemove', handleActivity, { passive: true });
    window.addEventListener('keydown', handleActivity, { passive: true });
    window.addEventListener('click', handleActivity, { passive: true });
    window.addEventListener('scroll', handleActivity, { passive: true });
    window.addEventListener('touchstart', handleActivity, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('scroll', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
    };
  }, [confidentialMode, resetSessionTimeout]);

  // Cleanup on unmount or mode change
  useEffect(() => {
    return () => {
      if (sessionTimeoutRef.current) {
        clearTimeout(sessionTimeoutRef.current);
      }
      if (activityTimeoutRef.current) {
        clearTimeout(activityTimeoutRef.current);
      }
    };
  }, []);

  // Visibility change detection (tab switch = wipe memory)
  useEffect(() => {
    if (!confidentialMode) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // User switched tabs - start wipe countdown
        activityTimeoutRef.current = setTimeout(() => {
          wipeConfidentialMemory();
          logAuditEvent('CONFIDENTIAL_TAB_SWITCH_WIPE', { reason: 'visibility_hidden' });
          toast({
            title: "🔒 Protection activée",
            description: "Changement d'onglet détecté. Mémoire effacée.",
          });
        }, 30000); // 30 seconds grace period
      } else {
        // User came back - cancel wipe
        if (activityTimeoutRef.current) {
          clearTimeout(activityTimeoutRef.current);
          activityTimeoutRef.current = null;
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [confidentialMode, wipeConfidentialMemory, logAuditEvent, toast]);

  // Before unload warning
  useEffect(() => {
    if (!confidentialMode || !confidentialSession?.messages.length) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // Wipe memory before leaving
      wipeConfidentialMemory();
      logAuditEvent('CONFIDENTIAL_PAGE_UNLOAD', { message_count: confidentialSession?.messages.length || 0 });
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [confidentialMode, confidentialSession, wipeConfidentialMemory, logAuditEvent]);

  const toggleConfidentialMode = useCallback(async (enabled: boolean) => {
    // If disabling, wipe memory first
    if (!enabled && confidentialMode) {
      wipeConfidentialMemory();
    }
    
    // If enabling, start fresh session
    if (enabled) {
      setConfidentialSession({
        messages: [],
        startedAt: new Date(),
        lastActivityAt: new Date()
      });
      resetSessionTimeout();
    }
    
    setConfidentialMode(enabled);
    localStorage.setItem(STORAGE_KEY, String(enabled));
    
    // Log the change (silent, no toast)
    await logAuditEvent(
      enabled ? 'CONFIDENTIAL_MODE_ENABLED' : 'CONFIDENTIAL_MODE_DISABLED',
      { confidential_mode: enabled }
    );
  }, [logAuditEvent, confidentialMode, wipeConfidentialMemory, resetSessionTimeout]);

  // Add message to confidential session (memory only)
  const addConfidentialMessage = useCallback((role: 'user' | 'assistant', content: string) => {
    if (!confidentialMode) return;
    
    setConfidentialSession(prev => {
      if (!prev) {
        return {
          messages: [{ role, content }],
          startedAt: new Date(),
          lastActivityAt: new Date()
        };
      }
      return {
        ...prev,
        messages: [...prev.messages, { role, content }],
        lastActivityAt: new Date()
      };
    });
    
    resetSessionTimeout();
  }, [confidentialMode, resetSessionTimeout]);

  // Get session time remaining
  const getSessionTimeRemaining = useCallback((): number => {
    if (!confidentialSession) return SESSION_TIMEOUT_MS;
    const elapsed = Date.now() - confidentialSession.lastActivityAt.getTime();
    return Math.max(0, SESSION_TIMEOUT_MS - elapsed);
  }, [confidentialSession]);

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

  // Manual wipe function
  const manualWipe = useCallback(async () => {
    wipeConfidentialMemory();
    await logAuditEvent('CONFIDENTIAL_MANUAL_WIPE', { triggered_by: 'user' });
    toast({
      title: "🔒 Mémoire effacée",
      description: "Toutes les données confidentielles ont été supprimées.",
    });
  }, [wipeConfidentialMemory, logAuditEvent, toast]);

  return {
    confidentialMode,
    confidentialSession,
    toggleConfidentialMode,
    addConfidentialMessage,
    wipeConfidentialMemory: manualWipe,
    getSessionTimeRemaining,
    logConversationEvent,
    SESSION_TIMEOUT_MS,
  };
}
