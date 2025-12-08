import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CRMDashboard } from '@/components/crm/CRMDashboard';
import { CRMContacts } from '@/components/crm/CRMContacts';
import { CRMCompanies } from '@/components/crm/CRMCompanies';
import { CRMPipeline } from '@/components/crm/CRMPipeline';
import { CRMActivities } from '@/components/crm/CRMActivities';
import { CRMTasks } from '@/components/crm/CRMTasks';
import { CRMSettings } from '@/components/crm/CRMSettings';
import { useCRM } from '@/hooks/useCRM';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  TrendingUp, 
  Activity,
  CheckSquare,
  Settings,
  Brain
} from 'lucide-react';

export default function CRM() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const crm = useCRM();

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full bg-background">
        {/* CRM Header */}
        <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-foreground">AETHER CRM</h1>
                  <p className="text-sm text-muted-foreground">Gestion commerciale intelligente</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm">
                  <Brain className="h-4 w-4" />
                  <span>IA Active</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Navigation Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="px-6">
            <TabsList className="h-12 bg-transparent border-b-0 gap-1 p-0">
              <TabsTrigger 
                value="dashboard" 
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 gap-2"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger 
                value="contacts"
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 gap-2"
              >
                <Users className="h-4 w-4" />
                Contacts
              </TabsTrigger>
              <TabsTrigger 
                value="companies"
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 gap-2"
              >
                <Building2 className="h-4 w-4" />
                Entreprises
              </TabsTrigger>
              <TabsTrigger 
                value="pipeline"
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 gap-2"
              >
                <TrendingUp className="h-4 w-4" />
                Pipeline
              </TabsTrigger>
              <TabsTrigger 
                value="activities"
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 gap-2"
              >
                <Activity className="h-4 w-4" />
                Activité
              </TabsTrigger>
              <TabsTrigger 
                value="tasks"
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 gap-2"
              >
                <CheckSquare className="h-4 w-4" />
                Tâches
              </TabsTrigger>
              <TabsTrigger 
                value="settings"
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 gap-2"
              >
                <Settings className="h-4 w-4" />
                Paramètres
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-auto">
          <Tabs value={activeTab} className="h-full">
            <TabsContent value="dashboard" className="m-0 h-full">
              <CRMDashboard crm={crm} />
            </TabsContent>
            <TabsContent value="contacts" className="m-0 h-full">
              <CRMContacts crm={crm} />
            </TabsContent>
            <TabsContent value="companies" className="m-0 h-full">
              <CRMCompanies crm={crm} />
            </TabsContent>
            <TabsContent value="pipeline" className="m-0 h-full">
              <CRMPipeline crm={crm} />
            </TabsContent>
            <TabsContent value="activities" className="m-0 h-full">
              <CRMActivities crm={crm} />
            </TabsContent>
            <TabsContent value="tasks" className="m-0 h-full">
              <CRMTasks crm={crm} />
            </TabsContent>
            <TabsContent value="settings" className="m-0 h-full">
              <CRMSettings crm={crm} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
}
