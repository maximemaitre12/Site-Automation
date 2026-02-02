import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { FileText, Trash2, Edit3, Plus, Eye } from 'lucide-react';

interface AuditLog {
  id: string;
  user_id: string | null;
  action: string;
  resource_type: string;
  resource_id: string | null;
  metadata: unknown;
  created_at: string;
}

interface AuditLogsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  companyId: string;
}

const ACTION_ICONS: Record<string, typeof FileText> = {
  INSERT: Plus,
  UPDATE: Edit3,
  DELETE: Trash2,
  SELECT: Eye,
};

const ACTION_COLORS: Record<string, string> = {
  INSERT: 'bg-green-500/20 text-green-400 border-green-500/30',
  UPDATE: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  DELETE: 'bg-red-500/20 text-red-400 border-red-500/30',
  SELECT: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
};

export function AuditLogsDialog({ open, onOpenChange, companyId }: AuditLogsDialogProps) {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (open && companyId) {
      fetchLogs();
    }
  }, [open, companyId]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .eq('company_id', companyId)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setLogs(data || []);
    } catch (error) {
      console.error('Error fetching audit logs:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Audit Logs
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[60vh] pr-4">
          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Aucun log d'audit trouvé</p>
              <p className="text-sm mt-1">Les actions sensibles seront enregistrées ici</p>
            </div>
          ) : (
            <div className="space-y-3">
              {logs.map((log) => {
                const ActionIcon = ACTION_ICONS[log.action] || FileText;
                const colorClass = ACTION_COLORS[log.action] || ACTION_COLORS.SELECT;

                return (
                  <div
                    key={log.id}
                    className="p-4 rounded-lg bg-secondary/50 border border-border"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${colorClass}`}>
                          <ActionIcon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className={colorClass}>
                              {log.action}
                            </Badge>
                            <span className="text-sm font-medium text-foreground">
                              {log.resource_type}
                            </span>
                          </div>
                          {log.resource_id && (
                            <p className="text-xs text-muted-foreground mt-1 font-mono">
                              ID: {log.resource_id.slice(0, 8)}...
                            </p>
                          )}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {format(new Date(log.created_at), 'dd MMM yyyy HH:mm', { locale: fr })}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}