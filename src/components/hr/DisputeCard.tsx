import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  AlertTriangle, Clock, CheckCircle, User, Calendar,
  ChevronRight, Loader2
} from 'lucide-react';
import { HRDispute, Employee } from '@/hooks/useEmployees';

interface DisputeCardProps {
  dispute: HRDispute;
  employee?: Employee;
  onResolve: (id: string, resolution: string, resolvedBy: string) => Promise<boolean>;
  onUpdate: (id: string, updates: Partial<HRDispute>) => Promise<boolean>;
}

export function DisputeCard({ dispute, employee, onResolve, onUpdate }: DisputeCardProps) {
  const [showResolveDialog, setShowResolveDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [isResolving, setIsResolving] = useState(false);
  const [resolution, setResolution] = useState('');
  const [resolvedBy, setResolvedBy] = useState('');

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-destructive/20 text-destructive border-destructive/30';
      case 'high': return 'bg-orange-500/20 text-orange-500 border-orange-500/30';
      case 'medium': return 'bg-warning/20 text-warning border-warning/30';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-destructive/20 text-destructive border-destructive/30';
      case 'investigating': return 'bg-warning/20 text-warning border-warning/30';
      case 'mediation': return 'bg-primary/20 text-primary border-primary/30';
      case 'resolved': return 'bg-success/20 text-success border-success/30';
      case 'closed': return 'bg-muted text-muted-foreground border-border';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved':
      case 'closed':
        return <CheckCircle className="w-4 h-4" />;
      case 'investigating':
      case 'mediation':
        return <Clock className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      conflict: 'Conflit',
      harassment: 'Harcèlement',
      performance: 'Performance',
      absence: 'Absence',
      insubordination: 'Insubordination',
      discrimination: 'Discrimination',
      other: 'Autre',
    };
    return labels[type] || type;
  };

  const handleResolve = async () => {
    if (!resolution.trim() || !resolvedBy.trim()) return;
    setIsResolving(true);
    await onResolve(dispute.id, resolution, resolvedBy);
    setIsResolving(false);
    setShowResolveDialog(false);
    setResolution('');
    setResolvedBy('');
  };

  const timeline = Array.isArray(dispute.timeline) ? dispute.timeline : [];

  return (
    <>
      <Card className="border-border hover:border-primary/30 transition-all">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                {getStatusIcon(dispute.status)}
                <h4 className="font-medium text-foreground truncate">{dispute.title}</h4>
              </div>
              
              <div className="flex items-center gap-3 text-sm text-muted-foreground flex-wrap">
                {employee && (
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {employee.name}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(dispute.created_at).toLocaleDateString('fr-FR')}
                </span>
              </div>

              <div className="flex items-center gap-2 mt-2">
                <Badge className={getStatusColor(dispute.status)}>
                  {dispute.status}
                </Badge>
                <Badge className={getSeverityColor(dispute.severity)}>
                  {dispute.severity}
                </Badge>
                <Badge variant="outline">
                  {getTypeLabel(dispute.dispute_type)}
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {(dispute.status === 'open' || dispute.status === 'investigating') && (
                <Button variant="outline" size="sm" onClick={() => setShowResolveDialog(true)}>
                  Résoudre
                </Button>
              )}
              <Button variant="ghost" size="icon" onClick={() => setShowDetailsDialog(true)}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resolve Dialog */}
      <Dialog open={showResolveDialog} onOpenChange={setShowResolveDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Résoudre le litige</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="font-medium">{dispute.title}</p>
              <p className="text-sm text-muted-foreground">{dispute.description}</p>
            </div>

            <div className="space-y-2">
              <Label>Résolution</Label>
              <Textarea
                placeholder="Décrivez comment le litige a été résolu..."
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label>Résolu par</Label>
              <Input
                placeholder="Nom de la personne"
                value={resolvedBy}
                onChange={(e) => setResolvedBy(e.target.value)}
              />
            </div>

            <Button 
              onClick={handleResolve} 
              className="w-full bg-success hover:bg-success/90"
              disabled={isResolving || !resolution.trim() || !resolvedBy.trim()}
            >
              {isResolving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <CheckCircle className="w-4 h-4 mr-2" />}
              Marquer comme résolu
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{dispute.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge className={getStatusColor(dispute.status)}>{dispute.status}</Badge>
              <Badge className={getSeverityColor(dispute.severity)}>{dispute.severity}</Badge>
              <Badge variant="outline">{getTypeLabel(dispute.dispute_type)}</Badge>
            </div>

            {employee && (
              <div className="p-3 rounded-lg bg-muted/50 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-blue-400 flex items-center justify-center text-white font-semibold">
                  {employee.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                </div>
                <div>
                  <p className="font-medium">{employee.name}</p>
                  <p className="text-sm text-muted-foreground">{employee.job_title}</p>
                </div>
              </div>
            )}

            {dispute.description && (
              <div>
                <Label className="text-sm font-medium mb-1 block">Description</Label>
                <p className="text-sm text-muted-foreground">{dispute.description}</p>
              </div>
            )}

            {dispute.resolution && (
              <div className="p-3 rounded-lg bg-success/10 border border-success/30">
                <Label className="text-sm font-medium mb-1 block text-success">Résolution</Label>
                <p className="text-sm">{dispute.resolution}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Par {dispute.resolved_by} le {dispute.resolution_date && new Date(dispute.resolution_date).toLocaleDateString('fr-FR')}
                </p>
              </div>
            )}

            {timeline.length > 0 && (
              <div>
                <Label className="text-sm font-medium mb-2 block">Timeline</Label>
                <ScrollArea className="h-40">
                  <div className="space-y-2">
                    {timeline.map((item: any, i: number) => (
                      <div key={i} className="flex items-start gap-2 text-sm">
                        <div className="w-2 h-2 rounded-full bg-primary mt-1.5" />
                        <div>
                          <p className="text-foreground">{item.action}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(item.date).toLocaleString('fr-FR')} - {item.by}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
