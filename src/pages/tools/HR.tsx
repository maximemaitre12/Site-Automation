import { useState, useMemo } from 'react';
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  Users, Upload, Sparkles, Briefcase, Plus, Search, Loader2, 
  UserPlus, CheckCircle, Clock, UsersRound, TrendingUp, 
  AlertTriangle, DoorOpen, Calendar, CalendarDays, List,
  FileText, Target, Mic, BarChart3, Award, History
} from "lucide-react";
import { useHR } from "@/hooks/useHR";
import { useEmployees } from "@/hooks/useEmployees";
import { useInterviews } from "@/hooks/useInterviews";
import { CandidateCard } from "@/components/hr/CandidateCard";
import { JobCard } from "@/components/hr/JobCard";
import { AddCandidateDialog } from "@/components/hr/AddCandidateDialog";
import { JobPostGenerator } from "@/components/hr/JobPostGenerator";
import { EmployeeCard } from "@/components/hr/EmployeeCard";
import { AddEmployeeDialog } from "@/components/hr/AddEmployeeDialog";
import { DisputeCard } from "@/components/hr/DisputeCard";
import { ConvertCandidateDialog } from "@/components/hr/ConvertCandidateDialog";
import { InterviewCard } from "@/components/hr/InterviewCard";
import { InterviewCalendar } from "@/components/hr/InterviewCalendar";
import { Input } from "@/components/ui/input";

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
    addCareerEvent, createDispute, updateDispute, resolveDispute,
    convertCandidateToEmployee
  } = useEmployees();

  const { interviews, loading: interviewsLoading, getUpcomingInterviews, updateInterview, refetch: refetchInterviews } = useInterviews();

  const [mainTab, setMainTab] = useState<"recruitment" | "team">("recruitment");
  
  // Recruitment sub-sections
  const [recruitmentSection, setRecruitmentSection] = useState<"pipeline" | "interviews" | "jobs">("pipeline");
  const [pipelineTab, setPipelineTab] = useState<"new" | "analyzed" | "active">("new");
  const [interviewTab, setInterviewTab] = useState<"upcoming" | "completed" | "calendar">("upcoming");
  
  // Team sub-sections
  const [teamSection, setTeamSection] = useState<"employees" | "hr" | "analytics">("employees");
  const [hrTab, setHrTab] = useState<"disputes" | "departures">("disputes");
  const [analyticsTab, setAnalyticsTab] = useState<"performance" | "careers">("performance");
  
  const [searchQuery, setSearchQuery] = useState('');
  const [convertCandidate, setConvertCandidate] = useState<any>(null);

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
  };

  // Section Header Component
  const SectionHeader = ({ 
    icon: Icon, 
    title, 
    description,
    action 
  }: { 
    icon: any; 
    title: string; 
    description: string;
    action?: React.ReactNode;
  }) => (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="font-semibold text-foreground">{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      {action}
    </div>
  );

  // Sub-tab Button Component
  const SubTabButton = ({ 
    active, 
    onClick, 
    icon: Icon, 
    label, 
    count 
  }: { 
    active: boolean; 
    onClick: () => void; 
    icon: any; 
    label: string; 
    count?: number;
  }) => (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
        active 
          ? 'bg-primary text-primary-foreground' 
          : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
      {count !== undefined && (
        <Badge variant={active ? "secondary" : "outline"} className="ml-1 text-xs">
          {count}
        </Badge>
      )}
    </button>
  );

  return (
    <DashboardLayout>
      <div className="h-full flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex-shrink-0 px-6 py-4 border-b border-border bg-card/50">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-foreground flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-400 flex items-center justify-center">
                  <Users className="w-4 h-4 text-white" />
                </div>
                HR Copilot
              </h1>
              <p className="text-muted-foreground mt-1">Recrutement intelligent et gestion d'équipe</p>
            </div>
            
            {/* Main tab toggle */}
            <Tabs value={mainTab} onValueChange={(v) => setMainTab(v as any)}>
              <TabsList className="grid grid-cols-2 w-80">
                <TabsTrigger value="recruitment" className="gap-2">
                  <UserPlus className="w-4 h-4" />
                  Recrutement
                </TabsTrigger>
                <TabsTrigger value="team" className="gap-2">
                  <UsersRound className="w-4 h-4" />
                  Équipe
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 min-h-0 flex overflow-hidden">
          {/* Left Sidebar - Sections */}
          <aside className="w-56 flex-shrink-0 border-r border-border bg-card/30 p-3 flex flex-col gap-1 overflow-y-auto">
            {mainTab === 'recruitment' ? (
              <>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-3 mb-2">Sections</p>
                
                <button
                  onClick={() => setRecruitmentSection('pipeline')}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    recruitmentSection === 'pipeline' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  Pipeline Candidats
                  <Badge variant="secondary" className="ml-auto">{stats.candidates}</Badge>
                </button>
                
                <button
                  onClick={() => setRecruitmentSection('interviews')}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    recruitmentSection === 'interviews' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  Entretiens
                  <Badge variant="secondary" className="ml-auto">{stats.upcomingInterviews}</Badge>
                </button>
                
                <button
                  onClick={() => setRecruitmentSection('jobs')}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    recruitmentSection === 'jobs' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <Briefcase className="w-4 h-4" />
                  Postes & Offres
                  <Badge variant="secondary" className="ml-auto">{stats.activeJobs}</Badge>
                </button>
                
                <Separator className="my-3" />
                
                {/* Quick Stats */}
                <div className="px-3 space-y-3">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Résumé</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2 rounded-lg bg-muted/50 text-center">
                      <div className="text-lg font-bold text-foreground">{stats.newCandidates}</div>
                      <div className="text-xs text-muted-foreground">Nouveaux</div>
                    </div>
                    <div className="p-2 rounded-lg bg-muted/50 text-center">
                      <div className="text-lg font-bold text-primary">{stats.analyzedCandidates}</div>
                      <div className="text-xs text-muted-foreground">Analysés</div>
                    </div>
                    <div className="p-2 rounded-lg bg-muted/50 text-center">
                      <div className="text-lg font-bold text-success">{stats.activeCandidates}</div>
                      <div className="text-xs text-muted-foreground">Actifs</div>
                    </div>
                    <div className="p-2 rounded-lg bg-muted/50 text-center">
                      <div className="text-lg font-bold text-warning">{stats.upcomingInterviews}</div>
                      <div className="text-xs text-muted-foreground">Entretiens</div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-3 mb-2">Sections</p>
                
                <button
                  onClick={() => setTeamSection('employees')}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    teamSection === 'employees' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <UsersRound className="w-4 h-4" />
                  Collaborateurs
                  <Badge variant="secondary" className="ml-auto">{stats.employees}</Badge>
                </button>
                
                <button
                  onClick={() => setTeamSection('hr')}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    teamSection === 'hr' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <AlertTriangle className="w-4 h-4" />
                  Gestion RH
                  <Badge variant="secondary" className="ml-auto">{stats.openDisputes}</Badge>
                </button>
                
                <button
                  onClick={() => setTeamSection('analytics')}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    teamSection === 'analytics' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  Analytics
                </button>
                
                <Separator className="my-3" />
                
                {/* Quick Stats */}
                <div className="px-3 space-y-3">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Résumé</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2 rounded-lg bg-muted/50 text-center">
                      <div className="text-lg font-bold text-foreground">{stats.employees}</div>
                      <div className="text-xs text-muted-foreground">Actifs</div>
                    </div>
                    <div className="p-2 rounded-lg bg-muted/50 text-center">
                      <div className="text-lg font-bold text-warning">{stats.openDisputes}</div>
                      <div className="text-xs text-muted-foreground">Litiges</div>
                    </div>
                    <div className="p-2 rounded-lg bg-muted/50 text-center">
                      <div className="text-lg font-bold text-muted-foreground">{stats.departures}</div>
                      <div className="text-xs text-muted-foreground">Départs</div>
                    </div>
                    <div className="p-2 rounded-lg bg-muted/50 text-center">
                      <div className="text-lg font-bold text-primary">{careerEvents.length}</div>
                      <div className="text-xs text-muted-foreground">Événements</div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </aside>

          {/* Main Content Area */}
          {loading ? (
            <div className="flex-1 min-w-0 flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <ScrollArea className="flex-1 min-w-0">
              <div className="p-6">
                {/* RECRUITMENT MODULE */}
                {mainTab === 'recruitment' && (
                  <>
                    {/* Pipeline Section */}
                    {recruitmentSection === 'pipeline' && (
                      <div className="space-y-6">
                        <SectionHeader 
                          icon={Users} 
                          title="Pipeline Candidats" 
                          description="Gérez vos candidats à travers les étapes du recrutement"
                          action={
                            <AddCandidateDialog onAdd={createCandidate} jobs={jobs}>
                              <Button variant="hero"><Upload className="w-4 h-4 mr-2" />Ajouter un CV</Button>
                            </AddCandidateDialog>
                          }
                        />
                        
                        {/* Pipeline Tabs */}
                        <div className="flex items-center gap-3">
                          <SubTabButton 
                            active={pipelineTab === 'new'} 
                            onClick={() => setPipelineTab('new')} 
                            icon={UserPlus} 
                            label="Nouveaux" 
                            count={stats.newCandidates} 
                          />
                          <SubTabButton 
                            active={pipelineTab === 'analyzed'} 
                            onClick={() => setPipelineTab('analyzed')} 
                            icon={Target} 
                            label="Analysés" 
                            count={stats.analyzedCandidates} 
                          />
                          <SubTabButton 
                            active={pipelineTab === 'active'} 
                            onClick={() => setPipelineTab('active')} 
                            icon={CheckCircle} 
                            label="Actifs" 
                            count={stats.activeCandidates} 
                          />
                          
                          <div className="ml-auto relative max-w-xs flex-1">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                            <Input 
                              placeholder="Rechercher un candidat..." 
                              value={searchQuery} 
                              onChange={(e) => setSearchQuery(e.target.value)} 
                              className="pl-10" 
                            />
                          </div>
                        </div>
                        
                        <Separator />
                        
                        {/* Candidates List */}
                        {filteredCandidates.length > 0 ? (
                          <div className="space-y-4">
                            {filteredCandidates.map((candidate) => (
                              <div key={candidate.id} className="relative">
                                <CandidateCard 
                                  candidate={candidate} jobs={jobs}
                                  interviews={interviews}
                                  onValidateScore={validateScore} onActivate={activateCandidate}
                                  onLinkToJob={linkToJob} onUpdateDescription={updateDescription}
                                  onAddInterviewNotes={addInterviewNotes} onDelete={deleteCandidate}
                                />
                                {candidate.status === 'active' && (
                                  <Button 
                                    size="sm" variant="outline" 
                                    className="absolute top-4 right-4 bg-success/10 text-success border-success/30 hover:bg-success/20"
                                    onClick={() => setConvertCandidate(candidate)}
                                  >
                                    <CheckCircle className="w-3 h-3 mr-1" />Embaucher
                                  </Button>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <Card className="border-dashed">
                            <CardContent className="py-12 text-center">
                              <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                              <h3 className="text-lg font-medium mb-2">Aucun candidat</h3>
                              <p className="text-sm text-muted-foreground mb-4">
                                {pipelineTab === 'new' && "Ajoutez des CV pour commencer le processus de recrutement"}
                                {pipelineTab === 'analyzed' && "Les candidats analysés apparaîtront ici"}
                                {pipelineTab === 'active' && "Les candidats actifs apparaîtront ici"}
                              </p>
                              <AddCandidateDialog onAdd={createCandidate} jobs={jobs}>
                                <Button><Plus className="w-4 h-4 mr-2" />Ajouter un CV</Button>
                              </AddCandidateDialog>
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    )}

                    {/* Interviews Section */}
                    {recruitmentSection === 'interviews' && (
                      <div className="space-y-6">
                        <SectionHeader 
                          icon={Calendar} 
                          title="Gestion des Entretiens" 
                          description="Planifiez, suivez et analysez vos entretiens"
                        />
                        
                        {/* Interview Tabs */}
                        <div className="flex items-center gap-3">
                          <SubTabButton 
                            active={interviewTab === 'upcoming'} 
                            onClick={() => setInterviewTab('upcoming')} 
                            icon={Clock} 
                            label="À venir" 
                            count={stats.upcomingInterviews} 
                          />
                          <SubTabButton 
                            active={interviewTab === 'completed'} 
                            onClick={() => setInterviewTab('completed')} 
                            icon={CheckCircle} 
                            label="Terminés" 
                            count={stats.completedInterviews} 
                          />
                          <SubTabButton 
                            active={interviewTab === 'calendar'} 
                            onClick={() => setInterviewTab('calendar')} 
                            icon={CalendarDays} 
                            label="Calendrier" 
                          />
                        </div>
                        
                        <Separator />
                        
                        {/* Interview Content */}
                        {interviewTab === 'calendar' ? (
                          <InterviewCalendar 
                            interviews={interviews} 
                            onUpdateInterview={updateInterview}
                          />
                        ) : (
                          <>
                            {(interviewTab === 'upcoming' ? upcomingInterviews : completedInterviews).length > 0 ? (
                              <div className="space-y-4">
                                {(interviewTab === 'upcoming' ? upcomingInterviews : completedInterviews).map((interview) => (
                                  <InterviewCard 
                                    key={interview.id} 
                                    interview={interview} 
                                    showCandidate 
                                    onAnalysisComplete={refetchInterviews}
                                  />
                                ))}
                              </div>
                            ) : (
                              <Card className="border-dashed">
                                <CardContent className="py-12 text-center">
                                  <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                                  <h3 className="text-lg font-medium mb-2">
                                    {interviewTab === 'upcoming' ? 'Aucun entretien à venir' : 'Aucun entretien terminé'}
                                  </h3>
                                  <p className="text-sm text-muted-foreground">
                                    {interviewTab === 'upcoming' 
                                      ? 'Planifiez des entretiens depuis les fiches candidats'
                                      : "Les entretiens terminés apparaîtront ici avec leurs analyses"
                                    }
                                  </p>
                                </CardContent>
                              </Card>
                            )}
                          </>
                        )}
                      </div>
                    )}

                    {/* Jobs Section */}
                    {recruitmentSection === 'jobs' && (
                      <div className="space-y-6">
                        <SectionHeader 
                          icon={Briefcase} 
                          title="Postes & Offres d'Emploi" 
                          description="Créez et gérez vos offres d'emploi"
                        />
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* Jobs List */}
                          <div className="space-y-4">
                            <h3 className="font-medium text-foreground flex items-center gap-2">
                              <FileText className="w-4 h-4" />
                              Postes ouverts ({stats.activeJobs})
                            </h3>
                            
                            {jobs.length > 0 ? (
                              <div className="space-y-3">
                                {jobs.map((job) => (
                                  <JobCard 
                                    key={job.id} 
                                    job={job} 
                                    candidatesCount={candidates.filter(c => c.job_id === job.id).length} 
                                    onDelete={deleteJob} 
                                  />
                                ))}
                              </div>
                            ) : (
                              <Card className="border-dashed">
                                <CardContent className="py-8 text-center">
                                  <Briefcase className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
                                  <p className="text-sm text-muted-foreground">Aucun poste ouvert</p>
                                </CardContent>
                              </Card>
                            )}
                          </div>
                          
                          {/* Job Generator */}
                          <div className="space-y-4">
                            <h3 className="font-medium text-foreground flex items-center gap-2">
                              <Sparkles className="w-4 h-4" />
                              Générateur IA
                            </h3>
                            <JobPostGenerator onGeneratePost={generateJobPost} onCreateJob={createJob} />
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* TEAM MODULE */}
                {mainTab === 'team' && (
                  <>
                    {/* Employees Section */}
                    {teamSection === 'employees' && (
                      <div className="space-y-6">
                        <SectionHeader 
                          icon={UsersRound} 
                          title="Collaborateurs" 
                          description="Gérez votre équipe et leurs informations"
                          action={
                            <AddEmployeeDialog onAdd={createEmployee}>
                              <Button variant="hero"><Plus className="w-4 h-4 mr-2" />Ajouter un employé</Button>
                            </AddEmployeeDialog>
                          }
                        />
                        
                        <div className="relative max-w-md">
                          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                          <Input 
                            placeholder="Rechercher un employé..." 
                            value={searchQuery} 
                            onChange={(e) => setSearchQuery(e.target.value)} 
                            className="pl-10" 
                          />
                        </div>
                        
                        <Separator />
                        
                        {filteredEmployees.length > 0 ? (
                          <div className="space-y-4">
                            {filteredEmployees.map((emp) => (
                              <EmployeeCard 
                                key={emp.id} 
                                employee={emp} 
                                onUpdate={updateEmployee} 
                                onTerminate={terminateEmployee} 
                                onDelete={deleteEmployee} 
                                onAddCareerEvent={addCareerEvent} 
                              />
                            ))}
                          </div>
                        ) : (
                          <Card className="border-dashed">
                            <CardContent className="py-12 text-center">
                              <UsersRound className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                              <h3 className="text-lg font-medium mb-2">Aucun employé</h3>
                              <AddEmployeeDialog onAdd={createEmployee}>
                                <Button><Plus className="w-4 h-4 mr-2" />Ajouter un employé</Button>
                              </AddEmployeeDialog>
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    )}

                    {/* HR Management Section */}
                    {teamSection === 'hr' && (
                      <div className="space-y-6">
                        <SectionHeader 
                          icon={AlertTriangle} 
                          title="Gestion RH" 
                          description="Litiges, départs et situations particulières"
                        />
                        
                        {/* HR Tabs */}
                        <div className="flex items-center gap-3">
                          <SubTabButton 
                            active={hrTab === 'disputes'} 
                            onClick={() => setHrTab('disputes')} 
                            icon={AlertTriangle} 
                            label="Litiges" 
                            count={stats.openDisputes} 
                          />
                          <SubTabButton 
                            active={hrTab === 'departures'} 
                            onClick={() => setHrTab('departures')} 
                            icon={DoorOpen} 
                            label="Départs" 
                            count={stats.departures} 
                          />
                        </div>
                        
                        <Separator />
                        
                        {hrTab === 'disputes' && (
                          <>
                            {disputes.length > 0 ? (
                              <div className="space-y-4">
                                {disputes.map((d) => (
                                  <DisputeCard 
                                    key={d.id} 
                                    dispute={d} 
                                    employee={employees.find(e => e.id === d.employee_id)} 
                                    onResolve={resolveDispute} 
                                    onUpdate={updateDispute} 
                                  />
                                ))}
                              </div>
                            ) : (
                              <Card className="border-dashed">
                                <CardContent className="py-12 text-center">
                                  <AlertTriangle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                                  <h3 className="text-lg font-medium mb-2">Aucun litige</h3>
                                  <p className="text-sm text-muted-foreground">Les litiges RH apparaîtront ici</p>
                                </CardContent>
                              </Card>
                            )}
                          </>
                        )}
                        
                        {hrTab === 'departures' && (
                          <>
                            {inactiveEmployees.length > 0 ? (
                              <div className="space-y-4">
                                {inactiveEmployees.map((emp) => (
                                  <EmployeeCard 
                                    key={emp.id} 
                                    employee={emp} 
                                    onUpdate={updateEmployee} 
                                    onTerminate={terminateEmployee} 
                                    onDelete={deleteEmployee} 
                                    onAddCareerEvent={addCareerEvent} 
                                  />
                                ))}
                              </div>
                            ) : (
                              <Card className="border-dashed">
                                <CardContent className="py-12 text-center">
                                  <DoorOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                                  <h3 className="text-lg font-medium mb-2">Aucun départ</h3>
                                  <p className="text-sm text-muted-foreground">L'historique des départs apparaîtra ici</p>
                                </CardContent>
                              </Card>
                            )}
                          </>
                        )}
                      </div>
                    )}

                    {/* Analytics Section */}
                    {teamSection === 'analytics' && (
                      <div className="space-y-6">
                        <SectionHeader 
                          icon={BarChart3} 
                          title="Analytics & Performance" 
                          description="Suivez les performances et l'évolution de carrière"
                        />
                        
                        {/* Analytics Tabs */}
                        <div className="flex items-center gap-3">
                          <SubTabButton 
                            active={analyticsTab === 'performance'} 
                            onClick={() => setAnalyticsTab('performance')} 
                            icon={TrendingUp} 
                            label="Performance" 
                          />
                          <SubTabButton 
                            active={analyticsTab === 'careers'} 
                            onClick={() => setAnalyticsTab('careers')} 
                            icon={History} 
                            label="Carrières" 
                            count={careerEvents.length} 
                          />
                        </div>
                        
                        <Separator />
                        
                        <Card className="border-dashed">
                          <CardContent className="py-12 text-center">
                            {analyticsTab === 'performance' ? (
                              <>
                                <TrendingUp className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                                <h3 className="text-lg font-medium mb-2">Dashboard Performance</h3>
                                <p className="text-sm text-muted-foreground">
                                  Les métriques de performance seront affichées ici
                                </p>
                              </>
                            ) : (
                              <>
                                <History className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                                <h3 className="text-lg font-medium mb-2">Historique Carrières</h3>
                                <p className="text-sm text-muted-foreground">
                                  L'historique des promotions, augmentations et événements de carrière
                                </p>
                              </>
                            )}
                          </CardContent>
                        </Card>
                      </div>
                    )}
                  </>
                )}
              </div>
            </ScrollArea>
          )}
        </div>
      </div>

      {/* Convert Candidate Dialog */}
      {convertCandidate && (
        <ConvertCandidateDialog
          open={!!convertCandidate}
          onOpenChange={(open) => !open && setConvertCandidate(null)}
          candidate={convertCandidate}
          onConvert={convertCandidateToEmployee}
        />
      )}
    </DashboardLayout>
  );
}
