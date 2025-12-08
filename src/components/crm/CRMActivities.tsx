import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  Search, 
  Plus, 
  Mail,
  Phone,
  Calendar,
  FileText,
  MessageSquare,
  CheckSquare,
  Filter,
  Clock
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Activity } from '@/hooks/useCRM';

interface CRMActivitiesProps {
  crm: ReturnType<typeof import('@/hooks/useCRM').useCRM>;
}

const activityTypeConfig = {
  email: { icon: Mail, label: 'Email', color: 'bg-blue-500/10 text-blue-500' },
  call: { icon: Phone, label: 'Appel', color: 'bg-green-500/10 text-green-500' },
  meeting: { icon: Calendar, label: 'Réunion', color: 'bg-purple-500/10 text-purple-500' },
  note: { icon: MessageSquare, label: 'Note', color: 'bg-yellow-500/10 text-yellow-500' },
  task: { icon: CheckSquare, label: 'Tâche', color: 'bg-orange-500/10 text-orange-500' },
  document: { icon: FileText, label: 'Document', color: 'bg-gray-500/10 text-gray-500' },
};

export function CRMActivities({ crm }: CRMActivitiesProps) {
  const { activities, companies, contacts, opportunities, createActivity, loading } = crm;
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    activity_type: 'note' as Activity['activity_type'],
    subject: '',
    description: '',
    company_id: '',
    contact_id: '',
    opportunity_id: '',
  });

  const filteredActivities = activities.filter(activity => {
    if (filterType !== 'all' && activity.activity_type !== filterType) return false;
    if (!searchQuery) return true;
    const searchLower = searchQuery.toLowerCase();
    return activity.subject.toLowerCase().includes(searchLower) || 
           activity.description?.toLowerCase().includes(searchLower);
  });

  const handleSubmit = async () => {
    if (!formData.subject) return;
    
    await createActivity({
      ...formData,
      company_id: formData.company_id || null,
      contact_id: formData.contact_id || null,
      opportunity_id: formData.opportunity_id || null,
    });
    
    setIsAddDialogOpen(false);
    setFormData({ activity_type: 'note', subject: '', description: '', company_id: '', contact_id: '', opportunity_id: '' });
  };

  const getSentimentBadge = (sentiment: string | null) => {
    if (!sentiment) return null;
    const variants = {
      positive: 'bg-success/10 text-success',
      neutral: 'bg-muted text-muted-foreground',
      negative: 'bg-destructive/10 text-destructive',
    };
    return (
      <Badge className={variants[sentiment as keyof typeof variants]}>
        {sentiment === 'positive' ? 'Positif' : sentiment === 'negative' ? 'Négatif' : 'Neutre'}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-4 flex-1 w-full sm:w-auto">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Rechercher une activité..." 
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-40">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tout</SelectItem>
              {Object.entries(activityTypeConfig).map(([type, config]) => (
                <SelectItem key={type} value={type}>{config.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nouvelle activité
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Nouvelle activité</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Type d'activité</Label>
                <Select value={formData.activity_type} onValueChange={(value) => setFormData({ ...formData, activity_type: value as Activity['activity_type'] })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(activityTypeConfig).map(([type, config]) => (
                      <SelectItem key={type} value={type}>
                        <div className="flex items-center gap-2">
                          <config.icon className="h-4 w-4" />
                          {config.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Sujet *</Label>
                <Input 
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Sujet de l'activité"
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea 
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Détails..."
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Entreprise</Label>
                  <Select value={formData.company_id} onValueChange={(value) => setFormData({ ...formData, company_id: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Aucune" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Aucune</SelectItem>
                      {companies.map((company) => (
                        <SelectItem key={company.id} value={company.id}>{company.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Contact</Label>
                  <Select value={formData.contact_id} onValueChange={(value) => setFormData({ ...formData, contact_id: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Aucun" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Aucun</SelectItem>
                      {contacts.map((contact) => (
                        <SelectItem key={contact.id} value={contact.id}>
                          {contact.first_name} {contact.last_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Opportunité</Label>
                <Select value={formData.opportunity_id} onValueChange={(value) => setFormData({ ...formData, opportunity_id: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Aucune" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Aucune</SelectItem>
                    {opportunities.map((opp) => (
                      <SelectItem key={opp.id} value={opp.id}>{opp.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Annuler</Button>
                <Button onClick={handleSubmit} disabled={!formData.subject}>Créer</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Activity Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        {Object.entries(activityTypeConfig).map(([type, config]) => {
          const count = activities.filter(a => a.activity_type === type).length;
          return (
            <Card key={type} className="border-border/50 bg-card/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-lg ${config.color}`}>
                    <config.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xl font-bold">{count}</p>
                    <p className="text-xs text-muted-foreground">{config.label}s</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Activity Timeline */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Timeline des activités
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px]">
            {filteredActivities.length === 0 ? (
              <p className="text-center py-12 text-muted-foreground">Aucune activité</p>
            ) : (
              <div className="relative space-y-0">
                {/* Timeline line */}
                <div className="absolute left-6 top-0 bottom-0 w-px bg-border" />
                
                {filteredActivities.map((activity, index) => {
                  const config = activityTypeConfig[activity.activity_type];
                  const Icon = config.icon;
                  
                  return (
                    <div key={activity.id} className="relative pl-14 pb-8 last:pb-0">
                      {/* Timeline dot */}
                      <div className={`absolute left-4 w-5 h-5 rounded-full border-4 border-background ${config.color} flex items-center justify-center`}>
                        <Icon className="h-2.5 w-2.5" />
                      </div>
                      
                      <Card className="border-border/50 bg-card/80 hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <Badge variant="secondary" className="text-xs">{config.label}</Badge>
                                {getSentimentBadge(activity.sentiment)}
                                <span className="text-xs text-muted-foreground">
                                  {format(new Date(activity.activity_date), "dd MMM yyyy 'à' HH:mm", { locale: fr })}
                                </span>
                              </div>
                              <p className="font-medium mt-2">{activity.subject}</p>
                              {activity.description && (
                                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{activity.description}</p>
                              )}
                              {activity.ai_summary && (
                                <div className="mt-3 p-2 rounded bg-primary/5 border border-primary/10">
                                  <p className="text-xs font-medium text-primary mb-1">Résumé IA</p>
                                  <p className="text-sm text-muted-foreground">{activity.ai_summary}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  );
                })}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
