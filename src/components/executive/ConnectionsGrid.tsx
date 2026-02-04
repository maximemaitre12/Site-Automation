import { ConnectionStatus } from '@/hooks/useExecutiveInsights';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Settings, CheckCircle2, XCircle, AlertCircle, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface ConnectionsGridProps {
  connections: ConnectionStatus[];
}

const typeLabels: Record<string, string> = {
  payment: 'Paiement',
  communication: 'Communication',
  crm: 'CRM',
  erp: 'ERP / Automation',
  productivity: 'Productivité',
  other: 'Autre',
};

export function ConnectionsGrid({ connections }: ConnectionsGridProps) {
  const navigate = useNavigate();

  const getStatusIcon = (status: ConnectionStatus['status']) => {
    switch (status) {
      case 'connected':
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'partial':
        return <AlertCircle className="w-4 h-4 text-amber-500" />;
      case 'disconnected':
        return <XCircle className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusLabel = (status: ConnectionStatus['status']) => {
    switch (status) {
      case 'connected':
        return 'Connecté';
      case 'partial':
        return 'Partiel';
      case 'disconnected':
        return 'Non connecté';
    }
  };

  const connectedCount = connections.filter(c => c.status === 'connected').length;
  const partialCount = connections.filter(c => c.status === 'partial').length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Connexions Actives</h3>
          <p className="text-sm text-muted-foreground">
            {connectedCount} connectée(s), {partialCount} partielle(s) sur {connections.length}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/settings/integrations')}
          className="gap-2"
        >
          <Settings className="w-4 h-4" />
          Gérer
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {connections.map((connection) => (
          <Card
            key={connection.id}
            className={cn(
              "relative overflow-hidden transition-all hover:shadow-md cursor-pointer",
              connection.status === 'connected' && "border-emerald-500/30 bg-emerald-500/5",
              connection.status === 'partial' && "border-amber-500/30 bg-amber-500/5",
              connection.status === 'disconnected' && "border-border bg-muted/30 opacity-60"
            )}
            onClick={() => navigate('/settings/integrations')}
          >
            <CardContent className="p-4 text-center">
              <div className="text-3xl mb-2">{connection.icon}</div>
              <div className="font-medium text-sm truncate">{connection.name}</div>
              <div className="flex items-center justify-center gap-1 mt-2">
                {getStatusIcon(connection.status)}
                <span className="text-xs text-muted-foreground">
                  {getStatusLabel(connection.status)}
                </span>
              </div>
              {connection.metrics && connection.status !== 'disconnected' && (
                <div className="mt-2 text-xs text-muted-foreground">
                  {Object.entries(connection.metrics).slice(0, 2).map(([key, value]) => (
                    <div key={key}>{key}: {value}</div>
                  ))}
                </div>
              )}
              <Badge 
                variant="outline" 
                className="mt-2 text-[10px] px-1.5"
              >
                {typeLabels[connection.type] || connection.type}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
