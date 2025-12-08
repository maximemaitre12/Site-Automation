import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Search, 
  Plus, 
  MoreVertical,
  Globe,
  MapPin,
  Users,
  Building2,
  Filter,
  ArrowUpDown,
  Trash2,
  Edit,
  ExternalLink,
  DollarSign
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Company } from '@/hooks/useCRM';

interface CRMCompaniesProps {
  crm: ReturnType<typeof import('@/hooks/useCRM').useCRM>;
}

export function CRMCompanies({ crm }: CRMCompaniesProps) {
  const { companies, contacts, opportunities, createCompany, updateCompany, deleteCompany, loading } = crm;
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    website: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    country: '',
    employees_count: '',
    annual_revenue: '',
    description: '',
  });

  const filteredCompanies = companies.filter(company => {
    const searchLower = searchQuery.toLowerCase();
    return (
      company.name.toLowerCase().includes(searchLower) ||
      company.industry?.toLowerCase().includes(searchLower) ||
      company.city?.toLowerCase().includes(searchLower)
    );
  });

  const getCompanyContacts = (companyId: string) => contacts.filter(c => c.company_id === companyId).length;
  const getCompanyOpportunities = (companyId: string) => opportunities.filter(o => o.company_id === companyId);
  const getCompanyValue = (companyId: string) => {
    return getCompanyOpportunities(companyId)
      .filter(o => o.status === 'open')
      .reduce((sum, o) => sum + (o.value || 0), 0);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value);
  };

  const handleSubmit = async () => {
    if (!formData.name) return;
    
    const data = {
      ...formData,
      employees_count: formData.employees_count ? parseInt(formData.employees_count) : null,
      annual_revenue: formData.annual_revenue ? parseFloat(formData.annual_revenue) : null,
    };
    
    if (selectedCompany) {
      await updateCompany(selectedCompany.id, data);
    } else {
      await createCompany(data);
    }
    
    setIsAddDialogOpen(false);
    setSelectedCompany(null);
    resetForm();
  };

  const handleEdit = (company: Company) => {
    setSelectedCompany(company);
    setFormData({
      name: company.name,
      industry: company.industry || '',
      website: company.website || '',
      phone: company.phone || '',
      email: company.email || '',
      address: company.address || '',
      city: company.city || '',
      country: company.country || '',
      employees_count: company.employees_count?.toString() || '',
      annual_revenue: company.annual_revenue?.toString() || '',
      description: company.description || '',
    });
    setIsAddDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Supprimer cette entreprise ?')) {
      await deleteCompany(id);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', industry: '', website: '', phone: '', email: '', address: '', city: '', country: '', employees_count: '', annual_revenue: '', description: '' });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n.charAt(0)).join('').toUpperCase().slice(0, 2);
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
              placeholder="Rechercher une entreprise..." 
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
          setIsAddDialogOpen(open);
          if (!open) {
            setSelectedCompany(null);
            resetForm();
          }
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nouvelle entreprise
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedCompany ? 'Modifier l\'entreprise' : 'Nouvelle entreprise'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Nom *</Label>
                <Input 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Acme Inc."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Secteur</Label>
                  <Input 
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    placeholder="Technologie"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Site web</Label>
                  <Input 
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    placeholder="https://acme.com"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Téléphone</Label>
                  <Input 
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+33 1 23 45 67 89"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input 
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="contact@acme.com"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Adresse</Label>
                <Input 
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="123 rue de Paris"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Ville</Label>
                  <Input 
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Paris"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Pays</Label>
                  <Input 
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    placeholder="France"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nombre d'employés</Label>
                  <Input 
                    type="number"
                    value={formData.employees_count}
                    onChange={(e) => setFormData({ ...formData, employees_count: e.target.value })}
                    placeholder="50"
                  />
                </div>
                <div className="space-y-2">
                  <Label>CA annuel (€)</Label>
                  <Input 
                    type="number"
                    value={formData.annual_revenue}
                    onChange={(e) => setFormData({ ...formData, annual_revenue: e.target.value })}
                    placeholder="1000000"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea 
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Description de l'entreprise..."
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Annuler</Button>
                <Button onClick={handleSubmit} disabled={!formData.name}>
                  {selectedCompany ? 'Enregistrer' : 'Créer'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-border/50 bg-card/50">
          <CardContent className="p-4">
            <p className="text-2xl font-bold">{companies.length}</p>
            <p className="text-sm text-muted-foreground">Total entreprises</p>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/50">
          <CardContent className="p-4">
            <p className="text-2xl font-bold">{companies.filter(c => getCompanyOpportunities(c.id).length > 0).length}</p>
            <p className="text-sm text-muted-foreground">Avec opportunités</p>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/50">
          <CardContent className="p-4">
            <p className="text-2xl font-bold">{formatCurrency(companies.reduce((sum, c) => sum + getCompanyValue(c.id), 0))}</p>
            <p className="text-sm text-muted-foreground">Pipeline total</p>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/50">
          <CardContent className="p-4">
            <p className="text-2xl font-bold">{new Set(companies.map(c => c.industry).filter(Boolean)).size}</p>
            <p className="text-sm text-muted-foreground">Secteurs</p>
          </CardContent>
        </Card>
      </div>

      {/* Companies Table */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[280px]">
                  <Button variant="ghost" size="sm" className="gap-1 -ml-3 font-medium">
                    Entreprise <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead>Secteur</TableHead>
                <TableHead>Localisation</TableHead>
                <TableHead>Contacts</TableHead>
                <TableHead>Pipeline</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCompanies.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                    {searchQuery ? 'Aucune entreprise trouvée' : 'Aucune entreprise. Créez votre première entreprise !'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredCompanies.map((company) => (
                  <TableRow key={company.id} className="group">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={company.logo_url || undefined} />
                          <AvatarFallback className="bg-primary/10 text-primary font-medium">
                            {getInitials(company.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{company.name}</p>
                          {company.website && (
                            <a href={company.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
                              <Globe className="h-3 w-3" />
                              {company.website.replace(/^https?:\/\//, '')}
                            </a>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {company.industry ? (
                        <Badge variant="secondary">{company.industry}</Badge>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {company.city || company.country ? (
                        <div className="flex items-center gap-1 text-sm">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          {[company.city, company.country].filter(Boolean).join(', ')}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{getCompanyContacts(company.id)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getCompanyValue(company.id) > 0 ? (
                        <div className="flex items-center gap-1 text-primary font-medium">
                          <DollarSign className="h-4 w-4" />
                          {formatCurrency(getCompanyValue(company.id))}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(company)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Modifier
                          </DropdownMenuItem>
                          {company.website && (
                            <DropdownMenuItem asChild>
                              <a href={company.website} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4 mr-2" />
                                Ouvrir le site
                              </a>
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(company.id)}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
