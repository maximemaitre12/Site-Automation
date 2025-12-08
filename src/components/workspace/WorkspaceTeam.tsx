import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { 
  Search, Plus, MoreVertical, Users, Mail, Phone, MapPin, Trash2, Briefcase
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { WorkspaceMember } from '@/hooks/useWorkspace';

interface WorkspaceTeamProps {
  workspace: ReturnType<typeof import('@/hooks/useWorkspace').useWorkspace>;
}

const statusConfig = {
  active: { label: 'Actif', color: 'bg-success' },
  away: { label: 'Absent', color: 'bg-yellow-500' },
  busy: { label: 'Occupé', color: 'bg-destructive' },
  offline: { label: 'Hors ligne', color: 'bg-muted-foreground' },
};

export function WorkspaceTeam({ workspace }: WorkspaceTeamProps) {
  const { members, createMember, deleteMember, loading } = workspace;
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ full_name: '', email: '', role: '', department: '', phone: '', location: '' });

  const filteredMembers = members.filter(m => 
    m.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.role?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const departments = [...new Set(members.map(m => m.department).filter(Boolean))];

  const handleSubmit = async () => {
    if (!formData.full_name) return;
    await createMember(formData);
    setIsAddDialogOpen(false);
    setFormData({ full_name: '', email: '', role: '', department: '', phone: '', location: '' });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Supprimer ce membre ?')) await deleteMember(id);
  };

  const getInitials = (name: string) => name.split(' ').map(n => n.charAt(0)).join('').toUpperCase().slice(0, 2);

  if (loading) return <div className="flex items-center justify-center h-full"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-4 flex-1 w-full sm:w-auto">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Rechercher un membre..." className="pl-9" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild><Button className="gap-2"><Plus className="h-4 w-4" />Ajouter un membre</Button></DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader><DialogTitle>Nouveau membre</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2"><Label>Nom complet *</Label><Input value={formData.full_name} onChange={(e) => setFormData({ ...formData, full_name: e.target.value })} placeholder="Jean Dupont" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Email</Label><Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} /></div>
                <div className="space-y-2"><Label>Téléphone</Label><Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Poste</Label><Input value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} placeholder="Développeur" /></div>
                <div className="space-y-2"><Label>Département</Label><Input value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} placeholder="Tech" /></div>
              </div>
              <div className="space-y-2"><Label>Localisation</Label><Input value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} placeholder="Paris, France" /></div>
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Annuler</Button>
                <Button onClick={handleSubmit} disabled={!formData.full_name}>Ajouter</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-border/50 bg-card/50"><CardContent className="p-4"><p className="text-2xl font-bold">{members.length}</p><p className="text-sm text-muted-foreground">Total membres</p></CardContent></Card>
        <Card className="border-border/50 bg-card/50"><CardContent className="p-4"><p className="text-2xl font-bold">{members.filter(m => m.status === 'active').length}</p><p className="text-sm text-muted-foreground">Actifs</p></CardContent></Card>
        <Card className="border-border/50 bg-card/50"><CardContent className="p-4"><p className="text-2xl font-bold">{departments.length}</p><p className="text-sm text-muted-foreground">Départements</p></CardContent></Card>
        <Card className="border-border/50 bg-card/50"><CardContent className="p-4"><p className="text-2xl font-bold">{new Set(members.map(m => m.role).filter(Boolean)).size}</p><p className="text-sm text-muted-foreground">Rôles</p></CardContent></Card>
      </div>

      {/* Members Grid */}
      {filteredMembers.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Aucun membre. Ajoutez votre premier membre !</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMembers.map((member) => (
            <Card key={member.id} className="border-border/50 bg-card/50 hover:shadow-md transition-shadow group">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Avatar className="h-14 w-14">
                        <AvatarImage src={member.avatar_url || undefined} />
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">{getInitials(member.full_name)}</AvatarFallback>
                      </Avatar>
                      <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-background ${statusConfig[member.status].color}`} />
                    </div>
                    <div>
                      <p className="font-semibold">{member.full_name}</p>
                      {member.role && <p className="text-sm text-muted-foreground">{member.role}</p>}
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100"><MoreVertical className="h-4 w-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(member.id)}><Trash2 className="h-4 w-4 mr-2" />Supprimer</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="space-y-2">
                  {member.department && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Briefcase className="h-4 w-4" />
                      <span>{member.department}</span>
                    </div>
                  )}
                  {member.email && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span className="truncate">{member.email}</span>
                    </div>
                  )}
                  {member.phone && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span>{member.phone}</span>
                    </div>
                  )}
                  {member.location && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{member.location}</span>
                    </div>
                  )}
                </div>
                {member.skills && member.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-4">
                    {member.skills.slice(0, 3).map((skill, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">{skill}</Badge>
                    ))}
                    {member.skills.length > 3 && (
                      <Badge variant="secondary" className="text-xs">+{member.skills.length - 3}</Badge>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
