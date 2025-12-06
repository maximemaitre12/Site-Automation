import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useCompany, type AppRole } from '@/hooks/useCompany';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Building2, 
  Users, 
  Shield, 
  CreditCard, 
  Settings,
  Crown,
  UserCheck,
  Edit3,
  Eye,
  Trash2,
  Plus,
  Save,
  Palette
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const ROLE_COLORS: Record<AppRole, string> = {
  owner: 'bg-gradient-to-r from-yellow-500 to-amber-500',
  admin: 'bg-gradient-to-r from-purple-500 to-violet-500',
  manager: 'bg-gradient-to-r from-blue-500 to-cyan-500',
  editor: 'bg-gradient-to-r from-green-500 to-emerald-500',
  viewer: 'bg-gradient-to-r from-gray-500 to-slate-500',
};

const ROLE_ICONS: Record<AppRole, typeof Crown> = {
  owner: Crown,
  admin: Shield,
  manager: UserCheck,
  editor: Edit3,
  viewer: Eye,
};

export default function CompanySettings() {
  const { 
    company, 
    userRole, 
    teamMembers, 
    loading, 
    hasMinRole, 
    updateCompany, 
    updateMemberRole,
    removeTeamMember 
  } = useCompany();

  const [companyName, setCompanyName] = useState(company?.name || '');
  const [companySlug, setCompanySlug] = useState(company?.slug || '');
  const [primaryColor, setPrimaryColor] = useState(company?.primary_color || '#3C4DFE');
  const [saving, setSaving] = useState(false);

  const handleSaveCompany = async () => {
    setSaving(true);
    await updateCompany({
      name: companyName,
      slug: companySlug,
      primary_color: primaryColor,
    });
    setSaving(false);
  };

  const handleRoleChange = async (memberId: string, newRole: AppRole) => {
    await updateMemberRole(memberId, newRole);
  };

  const handleRemoveMember = async (memberId: string) => {
    if (confirm('Are you sure you want to remove this team member?')) {
      await removeTeamMember(memberId);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-8 space-y-6">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-96 w-full" />
        </div>
      </DashboardLayout>
    );
  }

  if (!company) {
    return (
      <DashboardLayout>
        <div className="p-8">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle>No Company Found</CardTitle>
              <CardDescription>
                You need to create or join a company to access settings.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  const canEdit = hasMinRole('admin');

  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Company Settings</h1>
          <p className="text-muted-foreground">
            Manage your company, team, and subscription
          </p>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="bg-secondary border border-border">
            <TabsTrigger value="general" className="gap-2">
              <Building2 className="w-4 h-4" />
              General
            </TabsTrigger>
            <TabsTrigger value="team" className="gap-2">
              <Users className="w-4 h-4" />
              Team
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2">
              <Shield className="w-4 h-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="billing" className="gap-2">
              <CreditCard className="w-4 h-4" />
              Billing
            </TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general" className="space-y-6">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-primary" />
                  Company Information
                </CardTitle>
                <CardDescription>
                  Basic company details and branding
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input
                      id="companyName"
                      value={companyName || company.name}
                      onChange={(e) => setCompanyName(e.target.value)}
                      disabled={!canEdit}
                      className="bg-secondary border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companySlug">Company Slug</Label>
                    <Input
                      id="companySlug"
                      value={companySlug || company.slug}
                      onChange={(e) => setCompanySlug(e.target.value)}
                      disabled={!canEdit}
                      className="bg-secondary border-border"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Palette className="w-4 h-4" />
                    Brand Color
                  </Label>
                  <div className="flex items-center gap-4">
                    <Input
                      type="color"
                      value={primaryColor || company.primary_color}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      disabled={!canEdit}
                      className="w-16 h-10 p-1 rounded-lg cursor-pointer"
                    />
                    <Input
                      value={primaryColor || company.primary_color}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      disabled={!canEdit}
                      className="w-32 bg-secondary border-border"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-4 border-t border-border">
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">
                      Subscription: <span className="font-medium text-foreground capitalize">{company.subscription_tier}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {teamMembers.length} / {company.max_users} team members
                    </p>
                  </div>
                  {canEdit && (
                    <Button onClick={handleSaveCompany} disabled={saving}>
                      <Save className="w-4 h-4 mr-2" />
                      {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Team Management */}
          <TabsContent value="team" className="space-y-6">
            <Card className="border-border bg-card">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    Team Members
                  </CardTitle>
                  <CardDescription>
                    Manage your team and their permissions
                  </CardDescription>
                </div>
                {canEdit && (
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Invite Member
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {teamMembers.map((member) => {
                    const RoleIcon = ROLE_ICONS[member.role];
                    const isOwner = member.role === 'owner';
                    
                    return (
                      <div
                        key={member.id}
                        className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 border border-border"
                      >
                        <div className="flex items-center gap-4">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={member.avatar_url || ''} />
                            <AvatarFallback className="bg-primary/20 text-primary">
                              {member.full_name?.charAt(0) || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-foreground">
                              {member.full_name || 'Unknown User'}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Joined {new Date(member.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          {canEdit && !isOwner ? (
                            <Select
                              value={member.role}
                              onValueChange={(value) => handleRoleChange(member.id, value as AppRole)}
                            >
                              <SelectTrigger className="w-32 bg-secondary border-border">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="manager">Manager</SelectItem>
                                <SelectItem value="editor">Editor</SelectItem>
                                <SelectItem value="viewer">Viewer</SelectItem>
                              </SelectContent>
                            </Select>
                          ) : (
                            <Badge className={`${ROLE_COLORS[member.role]} text-white border-0`}>
                              <RoleIcon className="w-3 h-3 mr-1" />
                              {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                            </Badge>
                          )}

                          {canEdit && !isOwner && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => handleRemoveMember(member.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {teamMembers.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No team members found
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security */}
          <TabsContent value="security" className="space-y-6">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  Security Settings
                </CardTitle>
                <CardDescription>
                  Configure security and access controls
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 rounded-xl bg-secondary/50 border border-border">
                  <h4 className="font-medium text-foreground mb-2">Your Role</h4>
                  <Badge className={`${ROLE_COLORS[userRole?.role || 'viewer']} text-white border-0`}>
                    {userRole?.role.charAt(0).toUpperCase()}{userRole?.role.slice(1)}
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-2">
                    {userRole?.role === 'owner' && 'Full access to all company settings and data'}
                    {userRole?.role === 'admin' && 'Can manage team, settings, and all resources'}
                    {userRole?.role === 'manager' && 'Can manage workflows and team assignments'}
                    {userRole?.role === 'editor' && 'Can create and edit documents and workflows'}
                    {userRole?.role === 'viewer' && 'Read-only access to resources'}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-secondary/50 border border-border">
                  <h4 className="font-medium text-foreground mb-2">Audit Logs</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Track all actions and changes in your company
                  </p>
                  <Button variant="outline" size="sm">
                    View Audit Logs
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Billing */}
          <TabsContent value="billing" className="space-y-6">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-primary" />
                  Subscription & Billing
                </CardTitle>
                <CardDescription>
                  Manage your subscription and billing information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-6 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-lg font-semibold text-foreground capitalize">
                        {company.subscription_tier} Plan
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {company.max_users} users • {company.max_storage_mb}MB storage
                      </p>
                    </div>
                    <Badge variant="outline" className="border-primary text-primary">
                      Active
                    </Badge>
                  </div>
                  <Button className="w-full" variant="outline">
                    Upgrade Plan
                  </Button>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-foreground">Usage This Month</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-secondary/50 border border-border">
                      <p className="text-2xl font-bold text-foreground">
                        {teamMembers.length}/{company.max_users}
                      </p>
                      <p className="text-sm text-muted-foreground">Team Members</p>
                    </div>
                    <div className="p-4 rounded-xl bg-secondary/50 border border-border">
                      <p className="text-2xl font-bold text-foreground">0 MB</p>
                      <p className="text-sm text-muted-foreground">Storage Used</p>
                    </div>
                    <div className="p-4 rounded-xl bg-secondary/50 border border-border">
                      <p className="text-2xl font-bold text-foreground">0</p>
                      <p className="text-sm text-muted-foreground">AI Calls</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
