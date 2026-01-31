import { useState, useMemo } from 'react';
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, Upload, Sparkles, Briefcase, Plus, Search, Loader2, 
  UserPlus, CheckCircle, Clock, UsersRound, 
  AlertTriangle, DoorOpen, Calendar, CalendarDays, List, LayoutGrid,
  Mail, BarChart3
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useHR } from "@/hooks/useHR";
import { useEmployees } from "@/hooks/useEmployees";
import { useInterviews } from "@/hooks/useInterviews";
import { CandidateCard } from "@/components/hr/CandidateCard";
import { JobCard } from "@/components/hr/JobCard";
import { AddCandidateDialog } from "@/components/hr/AddCandidateDialog";
import { JobPostGenerator } from "@/components/hr/JobPostGenerator";
import { EmployeeCard } from "@/components/hr/EmployeeCard";
import { EmployeeTable } from "@/components/hr/EmployeeTable";
import { AddEmployeeDialog } from "@/components/hr/AddEmployeeDialog";
import { DisputeCard } from "@/components/hr/DisputeCard";
import { InterviewCard } from "@/components/hr/InterviewCard";
import { InterviewCalendar } from "@/components/hr/InterviewCalendar";
import { EmailInbox } from "@/components/hr/email/EmailInbox";
import { useHREmails } from "@/hooks/useHREmails";
import { 
  AgentLayout, 
  AgentSectionHeader, 
  AgentEmptyState 
} from "@/components/agents/AgentLayout";
import { AgentStats } from "@/components/agents/AgentStats";
import { AgentTabs } from "@/components/agents/AgentTabs";

export default function HR() {
  const { 
    candidates, jobs, loading: hrLoading,
    createCandidate, validateScore, activateCandidate, linkToJob,
    updateDescription, addInterviewNotes, createJob, generateJobPost,
    deleteCandidate, deleteJob
  } = useHR();

  const {
    employees, activeEmployees, inactiveEmployees, disputes, openDisputes,
    careerEvents, loading: employeesLoading,
    createEmployee, updateEmployee, deleteEmployee, terminateEmployee,
    addCareerEvent, updateDispute, resolveDispute
  } = useEmployees();

  const { interviews, loading: interviewsLoading, getUpcomingInterviews, refetch: refetchInterviews } = useInterviews();
  const { newEmails } = useHREmails();

  const [mainTab, setMainTab] = useState<"recruitment" | "team">("recruitment");
  const [recruitmentSection, setRecruitmentSection] = useState<"pipeline" | "interviews" | "jobs" | "emails">("pipeline");
  const [pipelineTab, setPipelineTab] = useState<"new" | "analyzed" | "active">("new");
  const [interviewTab, setInterviewTab] = useState<"upcoming" | "completed" | "calendar">("upcoming");
  const [teamSection, setTeamSection] = useState<"employees" | "hr" | "analytics">("employees");
  const [employeeViewMode, setEmployeeViewMode] = useState<"table" | "cards">("table");
  const [hrTab, setHrTab] = useState<"disputes" | "departures">("disputes");
  const [searchQuery, setSearchQuery] = useState('');

  const loading = hrLoading || employeesLoading || interviewsLoading;
  const upcomingInterviews = getUpcomingInterviews();
  const completedInterviews = interviews.filter(i => i.status === 'completed');

  // Filter candidates
  const filteredCandidates = useMemo(() => {
    let filtered = candidates.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email?.toLowerCase().includes(searchQuery.toLowerCase());
      if (pipelineTab === 'new') return matchesSearch && c.status === 'new';
      if (pipelineTab === 'analyzed') return matchesSearch && c.status === 'analyzed';
      if (pipelineTab === 'active') return matchesSearch && c.status === 'active';
      return matchesSearch;
    });
    filtered.sort((a, b) => (b.match_score || 0) - (a.match_score || 0));
    return filtered;
  }, [candidates, searchQuery, pipelineTab]);

  // Filter employees
  const filteredEmployees = useMemo(() => {
    return activeEmployees.filter(e => 
      e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.job_title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [activeEmployees, searchQuery]);

  // Stats
  const stats = {
    candidates: candidates.length,
    newCandidates: candidates.filter(c => c.status === 'new').length,
    analyzedCandidates: candidates.filter(c => c.status === 'analyzed').length,
    activeCandidates: candidates.filter(c => c.status === 'active').length,
    activeJobs: jobs.filter(j => j.is_active).length,
    employees: activeEmployees.length,
    openDisputes: openDisputes.length,
    departures: inactiveEmployees.length,
    upcomingInterviews: upcomingInterviews.length,
    completedInterviews: completedInterviews.length,
    newEmails: newEmails.length,
  };

  // Sections based on main tab
  const sections = mainTab === 'recruitment' 
    ? [
        { id: 'pipeline', label: 'Pipeline', icon: Users, badge: stats.candidates },
        { id: 'interviews', label: 'Entretiens', icon: Calendar, badge: stats.upcomingInterviews },
        { id: 'jobs', label: 'Postes', icon: Briefcase, badge: stats.activeJobs },
        { id: 'emails', label: 'Emails', icon: Mail, badge: stats.newEmails > 0 ? stats.newEmails : undefined, badgeVariant: 'destructive' as const },
      ]
    : [
        { id: 'employees', label: 'Équipe', icon: UsersRound, badge: stats.employees },
        { id: 'hr', label: 'RH', icon: AlertTriangle, badge: stats.openDisputes },
        { id: 'analytics', label: 'Analytics', icon: BarChart3 },
      ];

  const activeSection = mainTab === 'recruitment' ? recruitmentSection : teamSection;
  const handleSectionChange = (id: string) => {
    if (mainTab === 'recruitment') {
      setRecruitmentSection(id as any);
    } else {
      setTeamSection(id as any);
    }
  };

  // Sidebar stats
  const sidebarStats = mainTab === 'recruitment' ? (
    <div className="grid grid-cols-2 gap-2">
      <div className="p-3 rounded-xl bg-background text-center">
        <p className="text-lg font-bold text-foreground">{stats.newCandidates}</p>
        <p className="text-xs text-muted-foreground">Nouveaux</p>
      </div>
      <div className="p-3 rounded-xl bg-background text-center">
        <p className="text-lg font-bold text-primary">{stats.analyzedCandidates}</p>
        <p className="text-xs text-muted-foreground">Analysés</p>
      </div>
      <div className="p-3 rounded-xl bg-background text-center">
        <p className="text-lg font-bold text-success">{stats.activeCandidates}</p>
        <p className="text-xs text-muted-foreground">Actifs</p>
      </div>
      <div className="p-3 rounded-xl bg-background text-center">
        <p className="text-lg font-bold text-warning">{stats.upcomingInterviews}</p>
        <p className="text-xs text-muted-foreground">Entretiens</p>
      </div>
    </div>
  ) : (
    <div className="grid grid-cols-2 gap-2">
      <div className="p-3 rounded-xl bg-background text-center">
        <p className="text-lg font-bold text-foreground">{stats.employees}</p>
        <p className="text-xs text-muted-foreground">Actifs</p>
      </div>
      <div className="p-3 rounded-xl bg-background text-center">
        <p className="text-lg font-bold text-warning">{stats.openDisputes}</p>
        <p className="text-xs text-muted-foreground">Litiges</p>
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <AgentLayout
        icon={Users}
        title="HR Copilot"
        subtitle="Recrutement et gestion des talents"
        accentColor="agent-hr"
        sections={sections}
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
        sidebarContent={sidebarStats}
        headerActions={
          <Tabs value={mainTab} onValueChange={(v) => setMainTab(v as any)}>
            <TabsList className="h-9">
              <TabsTrigger value="recruitment" className="gap-2 text-xs px-3">
                <UserPlus className="w-4 h-4" />
                <span className="hidden sm:inline">Recrutement</span>
              </TabsTrigger>
              <TabsTrigger value="team" className="gap-2 text-xs px-3">
                <UsersRound className="w-4 h-4" />
                <span className="hidden sm:inline">Équipe</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        }
      >
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {/* RECRUITMENT SECTIONS */}
            {mainTab === 'recruitment' && (
              <>
                {/* Pipeline */}
                {recruitmentSection === 'pipeline' && (
                  <div className="space-y-6">
                    <AgentSectionHeader
                      icon={Users}
                      title="Pipeline Candidats"
                      description="Gérez vos candidatures avec l'IA"
                      action={
                        <AddCandidateDialog onAdd={createCandidate} jobs={jobs}>
                          <Button className="gap-2">
                            <Plus className="w-4 h-4" />
                            <span className="hidden sm:inline">Ajouter</span>
                          </Button>
                        </AddCandidateDialog>
                      }
                    />

                    {/* Search */}
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Rechercher un candidat..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-11 h-11 rounded-xl bg-secondary/50 border-0"
                      />
                    </div>

                    {/* Status tabs */}
                    <AgentTabs
                      tabs={[
                        { id: 'new', label: 'Nouveaux', icon: Upload, count: stats.newCandidates },
                        { id: 'analyzed', label: 'Analysés', icon: Sparkles, count: stats.analyzedCandidates },
                        { id: 'active', label: 'Actifs', icon: CheckCircle, count: stats.activeCandidates },
                      ]}
                      activeTab={pipelineTab}
                      onTabChange={(id) => setPipelineTab(id as any)}
                    />

                    {/* Candidates grid */}
                    {filteredCandidates.length > 0 ? (
                      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                        {filteredCandidates.map(candidate => (
                          <CandidateCard
                            key={candidate.id}
                            candidate={candidate}
                            jobs={jobs}
                            onValidateScore={(id, score) => validateScore(id, score)}
                            onActivate={activateCandidate}
                            onLinkToJob={linkToJob}
                            onUpdateDescription={updateDescription}
                            onAddInterviewNotes={addInterviewNotes}
                            onDelete={deleteCandidate}
                          />
                        ))}
                      </div>
                    ) : (
                      <AgentEmptyState
                        icon={Users}
                        title="Aucun candidat"
                        description="Commencez par ajouter des candidats à votre pipeline"
                        action={
                          <AddCandidateDialog onAdd={createCandidate} jobs={jobs}>
                            <Button>
                              <Plus className="w-4 h-4 mr-2" />
                              Ajouter un candidat
                            </Button>
                          </AddCandidateDialog>
                        }
                      />
                    )}
                  </div>
                )}

                {/* Interviews */}
                {recruitmentSection === 'interviews' && (
                  <div className="space-y-6">
                    <AgentSectionHeader
                      icon={Calendar}
                      title="Entretiens"
                      description="Planifiez et gérez vos entretiens"
                    />

                    <AgentTabs
                      tabs={[
                        { id: 'upcoming', label: 'À venir', icon: Clock, count: stats.upcomingInterviews },
                        { id: 'completed', label: 'Terminés', icon: CheckCircle, count: stats.completedInterviews },
                        { id: 'calendar', label: 'Calendrier', icon: CalendarDays },
                      ]}
                      activeTab={interviewTab}
                      onTabChange={(id) => setInterviewTab(id as any)}
                    />

                    {interviewTab === 'calendar' ? (
                      <InterviewCalendar interviews={interviews} />
                    ) : (
                      <>
                        {(interviewTab === 'upcoming' ? upcomingInterviews : completedInterviews).length > 0 ? (
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {(interviewTab === 'upcoming' ? upcomingInterviews : completedInterviews).map(interview => (
                              <InterviewCard
                                key={interview.id}
                                interview={interview}
                                onAnalysisComplete={refetchInterviews}
                              />
                            ))}
                          </div>
                        ) : (
                          <AgentEmptyState
                            icon={Calendar}
                            title="Aucun entretien"
                            description={interviewTab === 'upcoming' ? "Planifiez vos prochains entretiens" : "Aucun entretien terminé"}
                          />
                        )}
                      </>
                    )}
                  </div>
                )}

                {/* Jobs */}
                {recruitmentSection === 'jobs' && (
                  <div className="space-y-6">
                    <AgentSectionHeader
                      icon={Briefcase}
                      title="Postes & Offres"
                      description="Créez et gérez vos offres d'emploi"
                    />

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <JobPostGenerator onGeneratePost={generateJobPost} onCreateJob={createJob} />
                      
                      <div className="space-y-4">
                        <h3 className="text-sm font-medium text-muted-foreground">
                          Postes créés ({jobs.length})
                        </h3>
                        {jobs.length > 0 ? (
                          <div className="space-y-3">
                            {jobs.map(job => (
                              <JobCard
                                key={job.id}
                                job={job}
                                candidatesCount={candidates.filter(c => c.job_id === job.id).length}
                                onDelete={deleteJob}
                              />
                            ))}
                          </div>
                        ) : (
                          <Card className="p-8 text-center border-dashed">
                            <Briefcase className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                            <p className="text-sm text-muted-foreground">Aucun poste créé</p>
                            <p className="text-xs text-muted-foreground/70 mt-1">
                              Utilisez le générateur IA
                            </p>
                          </Card>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Emails */}
                {recruitmentSection === 'emails' && (
                  <div className="space-y-6">
                    <AgentSectionHeader
                      icon={Mail}
                      title="Messagerie RH"
                      description="Recherchez et gérez vos emails de recrutement"
                    />
                    <EmailInbox 
                      candidates={candidates}
                      jobs={jobs}
                      onCreateCandidate={createCandidate}
                    />
                  </div>
                )}
              </>
            )}

            {/* TEAM SECTIONS */}
            {mainTab === 'team' && (
              <>
                {/* Employees */}
                {teamSection === 'employees' && (
                  <div className="space-y-6">
                    <AgentSectionHeader
                      icon={UsersRound}
                      title="Collaborateurs"
                      description="Gérez votre équipe"
                      action={
                        <div className="flex items-center gap-2">
                          <div className="flex border border-border rounded-lg overflow-hidden">
                            <Button
                              variant={employeeViewMode === 'table' ? 'secondary' : 'ghost'}
                              size="sm"
                              onClick={() => setEmployeeViewMode('table')}
                              className="rounded-none h-8"
                            >
                              <List className="w-4 h-4" />
                            </Button>
                            <Button
                              variant={employeeViewMode === 'cards' ? 'secondary' : 'ghost'}
                              size="sm"
                              onClick={() => setEmployeeViewMode('cards')}
                              className="rounded-none h-8"
                            >
                              <LayoutGrid className="w-4 h-4" />
                            </Button>
                          </div>
                          <AddEmployeeDialog onAdd={createEmployee}>
                            <Button className="gap-2">
                              <UserPlus className="w-4 h-4" />
                              <span className="hidden sm:inline">Ajouter</span>
                            </Button>
                          </AddEmployeeDialog>
                        </div>
                      }
                    />

                    {/* Search */}
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Rechercher un collaborateur..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-11 h-11 rounded-xl bg-secondary/50 border-0"
                      />
                    </div>

                    {filteredEmployees.length > 0 ? (
                      employeeViewMode === 'table' ? (
                        <div className="overflow-x-auto -mx-4 md:mx-0">
                          <EmployeeTable 
                            employees={filteredEmployees}
                            careerEvents={careerEvents}
                            onUpdate={updateEmployee}
                            onTerminate={terminateEmployee}
                            onDelete={deleteEmployee}
                            onAddCareerEvent={addCareerEvent}
                          />
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {filteredEmployees.map(employee => (
                            <EmployeeCard
                              key={employee.id}
                              employee={employee}
                              onUpdate={updateEmployee}
                              onTerminate={terminateEmployee}
                              onDelete={deleteEmployee}
                              onAddCareerEvent={addCareerEvent}
                            />
                          ))}
                        </div>
                      )
                    ) : (
                      <AgentEmptyState
                        icon={UsersRound}
                        title="Aucun collaborateur"
                        description="Ajoutez des membres à votre équipe"
                        action={
                          <AddEmployeeDialog onAdd={createEmployee}>
                            <Button>
                              <UserPlus className="w-4 h-4 mr-2" />
                              Ajouter
                            </Button>
                          </AddEmployeeDialog>
                        }
                      />
                    )}
                  </div>
                )}

                {/* HR Management */}
                {teamSection === 'hr' && (
                  <div className="space-y-6">
                    <AgentSectionHeader
                      icon={AlertTriangle}
                      title="Gestion RH"
                      description="Litiges et départs"
                    />

                    <AgentTabs
                      tabs={[
                        { id: 'disputes', label: 'Litiges', icon: AlertTriangle, count: stats.openDisputes },
                        { id: 'departures', label: 'Départs', icon: DoorOpen, count: stats.departures },
                      ]}
                      activeTab={hrTab}
                      onTabChange={(id) => setHrTab(id as any)}
                    />

                    {hrTab === 'disputes' ? (
                      disputes.length > 0 ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          {disputes.map(dispute => (
                            <DisputeCard
                              key={dispute.id}
                              dispute={dispute}
                              onUpdate={updateDispute}
                              onResolve={resolveDispute}
                            />
                          ))}
                        </div>
                      ) : (
                        <AgentEmptyState
                          icon={CheckCircle}
                          title="Aucun litige"
                          description="Tout va bien !"
                        />
                      )
                    ) : (
                      inactiveEmployees.length > 0 ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          {inactiveEmployees.map(employee => (
                            <Card key={employee.id} className="overflow-hidden">
                              <CardContent className="p-4">
                                <div className="flex items-center gap-4">
                                  <div className="w-11 h-11 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                                    <DoorOpen className="w-5 h-5 text-muted-foreground" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="font-medium text-foreground truncate">{employee.name}</p>
                                    <p className="text-sm text-muted-foreground truncate">{employee.job_title}</p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                      Départ: {employee.left_date ? new Date(employee.left_date).toLocaleDateString('fr-FR') : 'N/A'}
                                    </p>
                                  </div>
                                  {employee.left_reason && (
                                    <Badge variant="outline" className="shrink-0">{employee.left_reason}</Badge>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <AgentEmptyState
                          icon={UsersRound}
                          title="Aucun départ"
                          description="Aucun collaborateur n'a quitté l'équipe"
                        />
                      )
                    )}
                  </div>
                )}

                {/* Analytics */}
                {teamSection === 'analytics' && (
                  <div className="space-y-6">
                    <AgentSectionHeader
                      icon={BarChart3}
                      title="Analytics RH"
                      description="Statistiques et performance"
                    />

                    <AgentStats
                      stats={[
                        { value: stats.employees, label: 'Collaborateurs actifs', icon: UsersRound },
                        { value: stats.candidates, label: 'Candidats totaux', icon: Users },
                        { value: stats.activeJobs, label: 'Postes ouverts', icon: Briefcase },
                        { value: careerEvents.length, label: 'Événements carrière', icon: BarChart3 },
                      ]}
                    />

                    <Card className="p-8 text-center border-dashed">
                      <BarChart3 className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                      <p className="text-sm text-muted-foreground">
                        Tableaux de bord détaillés à venir
                      </p>
                    </Card>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </AgentLayout>
    </DashboardLayout>
  );
}
