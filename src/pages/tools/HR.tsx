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
  AlertTriangle, DoorOpen, Calendar, CalendarDays, List, LayoutGrid,
  FileText, Target, Mic, BarChart3, Award, History, Mail, X, MoreHorizontal
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
import { EmployeeStats } from "@/components/hr/EmployeeStats";
import { AddEmployeeDialog } from "@/components/hr/AddEmployeeDialog";
import { DisputeCard } from "@/components/hr/DisputeCard";
import { ConvertCandidateDialog } from "@/components/hr/ConvertCandidateDialog";
import { InterviewCard } from "@/components/hr/InterviewCard";
import { InterviewCalendar } from "@/components/hr/InterviewCalendar";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EmailInbox } from "@/components/hr/email/EmailInbox";
import { EmailAccountConnect } from "@/components/hr/email/EmailAccountConnect";
import { useHREmails } from "@/hooks/useHREmails";
import { Users as UsersIcon } from "lucide-react";
import { MobileTabBar, MobileTabItem } from "@/components/mobile/MobileTabBar";

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
  const { newEmails, loading: emailsLoading } = useHREmails();

  const [mainTab, setMainTab] = useState<"recruitment" | "team">("recruitment");
  
  // Recruitment sub-sections
  const [recruitmentSection, setRecruitmentSection] = useState<"pipeline" | "interviews" | "jobs" | "emails">("pipeline");
  const [pipelineTab, setPipelineTab] = useState<"new" | "analyzed" | "active">("new");
  const [interviewTab, setInterviewTab] = useState<"upcoming" | "completed" | "calendar">("upcoming");
  
  // Team sub-sections
  const [teamSection, setTeamSection] = useState<"employees" | "hr" | "analytics">("employees");
  const [employeeViewMode, setEmployeeViewMode] = useState<"table" | "cards">("table");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [contractFilter, setContractFilter] = useState<string>("all");
  const [hrTab, setHrTab] = useState<"disputes" | "departures">("disputes");
  const [analyticsTab, setAnalyticsTab] = useState<"performance" | "careers">("performance");
  
  const [searchQuery, setSearchQuery] = useState('');
  const [convertCandidate, setConvertCandidate] = useState<any>(null);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

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
    <div className="flex items-center justify-between mb-4 md:mb-6">
      <div className="flex items-center gap-2 md:gap-3 min-w-0">
        <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-agent-hr/10 flex items-center justify-center shrink-0">
          <Icon className="w-4 h-4 md:w-5 md:h-5 text-agent-hr" />
        </div>
        <div className="min-w-0">
          <h2 className="font-semibold text-foreground text-sm md:text-base truncate">{title}</h2>
          <p className="text-xs md:text-sm text-muted-foreground hidden sm:block">{description}</p>
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
      className={`flex items-center gap-1.5 md:gap-2 px-2.5 md:px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-medium transition-colors whitespace-nowrap ${
        active 
          ? 'bg-agent-hr text-white' 
          : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
      }`}
    >
      <Icon className="w-3.5 h-3.5 md:w-4 md:h-4" />
      <span className="hidden xs:inline">{label}</span>
      {count !== undefined && (
        <Badge variant={active ? "secondary" : "outline"} className="ml-0.5 md:ml-1 text-[10px] md:text-xs h-4 md:h-5 px-1 md:px-1.5">
          {count}
        </Badge>
      )}
    </button>
  );

  return (
    <DashboardLayout>
      <div className="h-full flex flex-col overflow-hidden pb-14 md:pb-0">
        {/* Header */}
        <header className="shrink-0 px-4 md:px-6 py-3 md:py-4 border-b border-border bg-card/50 z-10">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <button
                className="md:hidden p-1.5 -ml-1 rounded-lg hover:bg-muted shrink-0"
                onClick={() => setShowMobileSidebar(!showMobileSidebar)}
              >
                {showMobileSidebar ? <X className="w-5 h-5" /> : <List className="w-5 h-5" />}
              </button>
              <div className="w-10 h-10 md:w-11 md:h-11 rounded-2xl bg-agent-hr/10 border border-agent-hr/20 flex items-center justify-center shrink-0">
                <UsersIcon className="w-5 h-5 md:w-6 md:h-6 text-agent-hr" />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg md:text-xl font-bold text-foreground truncate">HR Copilot</h1>
                <p className="text-xs md:text-sm text-muted-foreground hidden md:block">Recrutement et gestion des talents</p>
              </div>
            </div>
            
            {/* Main tab toggle */}
            <Tabs value={mainTab} onValueChange={(v) => setMainTab(v as any)}>
              <TabsList className="grid grid-cols-2 w-40 md:w-64 h-8 md:h-9">
                <TabsTrigger value="recruitment" className="gap-2 text-xs md:text-sm h-7 md:h-8">
                  <UserPlus className="w-4 h-4" />
                  <span className="hidden xs:inline">Recrutement</span>
                </TabsTrigger>
                <TabsTrigger value="team" className="gap-2 text-xs md:text-sm h-7 md:h-8">
                  <UsersRound className="w-4 h-4" />
                  <span className="hidden xs:inline">Équipe</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden relative">
          {/* Mobile overlay */}
          {showMobileSidebar && (
            <div 
              className="fixed inset-0 bg-black/20 z-30 md:hidden"
              onClick={() => setShowMobileSidebar(false)}
            />
          )}

          {/* Left Sidebar - Sections */}
          <aside className={cn(
            "w-48 md:w-52 shrink-0 border-r border-border bg-card/30 p-2 md:p-3 overflow-y-auto",
            "fixed md:relative inset-y-0 left-0 z-40 md:z-auto transition-transform",
            showMobileSidebar ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          )}>
            {mainTab === 'recruitment' ? (
              <>
                <p className="text-[10px] md:text-xs font-medium text-muted-foreground uppercase tracking-wider px-2 md:px-3 mb-1.5 md:mb-2">Sections</p>
                
                <button
                  onClick={() => { setRecruitmentSection('pipeline'); setShowMobileSidebar(false); }}
                  className={cn(
                    "w-full flex items-center gap-2 md:gap-3 px-2 md:px-3 py-2 md:py-2.5 rounded-lg text-xs md:text-sm font-medium transition-colors",
                    recruitmentSection === 'pipeline' 
                      ? 'bg-agent-hr text-white' 
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  <Users className="w-3.5 h-3.5 md:w-4 md:h-4 shrink-0" />
                  <span className="truncate">Pipeline</span>
                  <Badge variant="secondary" className="ml-auto text-[10px] h-4 px-1">{stats.candidates}</Badge>
                </button>
                
                <button
                  onClick={() => { setRecruitmentSection('interviews'); setShowMobileSidebar(false); }}
                  className={cn(
                    "w-full flex items-center gap-2 md:gap-3 px-2 md:px-3 py-2 md:py-2.5 rounded-lg text-xs md:text-sm font-medium transition-colors",
                    recruitmentSection === 'interviews' 
                      ? 'bg-agent-hr text-white' 
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  <Calendar className="w-3.5 h-3.5 md:w-4 md:h-4 shrink-0" />
                  <span className="truncate">Entretiens</span>
                  <Badge variant="secondary" className="ml-auto text-[10px] h-4 px-1">{stats.upcomingInterviews}</Badge>
                </button>
                
                <button
                  onClick={() => { setRecruitmentSection('jobs'); setShowMobileSidebar(false); }}
                  className={cn(
                    "w-full flex items-center gap-2 md:gap-3 px-2 md:px-3 py-2 md:py-2.5 rounded-lg text-xs md:text-sm font-medium transition-colors",
                    recruitmentSection === 'jobs' 
                      ? 'bg-agent-hr text-white' 
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  <Briefcase className="w-3.5 h-3.5 md:w-4 md:h-4 shrink-0" />
                  <span className="truncate">Postes</span>
                  <Badge variant="secondary" className="ml-auto text-[10px] h-4 px-1">{stats.activeJobs}</Badge>
                </button>
                
                <button
                  onClick={() => { setRecruitmentSection('emails'); setShowMobileSidebar(false); }}
                  className={cn(
                    "w-full flex items-center gap-2 md:gap-3 px-2 md:px-3 py-2 md:py-2.5 rounded-lg text-xs md:text-sm font-medium transition-colors",
                    recruitmentSection === 'emails' 
                      ? 'bg-agent-hr text-white' 
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  <Mail className="w-3.5 h-3.5 md:w-4 md:h-4 shrink-0" />
                  <span className="truncate">Messagerie</span>
                  {stats.newEmails > 0 && (
                    <Badge variant="destructive" className="ml-auto text-[10px] h-4 px-1">{stats.newEmails}</Badge>
                  )}
                </button>
                
                <Separator className="my-2 md:my-3" />
                
                {/* Quick Stats */}
                <div className="px-2 md:px-3 space-y-2 md:space-y-3">
                  <p className="text-[10px] md:text-xs font-medium text-muted-foreground uppercase tracking-wider">Résumé</p>
                  <div className="grid grid-cols-2 gap-1.5 md:gap-2">
                    <div className="p-1.5 md:p-2 rounded-lg bg-muted/50 text-center">
                      <div className="text-sm md:text-lg font-bold text-foreground">{stats.newCandidates}</div>
                      <div className="text-[9px] md:text-xs text-muted-foreground">Nouveaux</div>
                    </div>
                    <div className="p-1.5 md:p-2 rounded-lg bg-muted/50 text-center">
                      <div className="text-sm md:text-lg font-bold text-agent-hr">{stats.analyzedCandidates}</div>
                      <div className="text-[9px] md:text-xs text-muted-foreground">Analysés</div>
                    </div>
                    <div className="p-1.5 md:p-2 rounded-lg bg-muted/50 text-center">
                      <div className="text-sm md:text-lg font-bold text-success">{stats.activeCandidates}</div>
                      <div className="text-[9px] md:text-xs text-muted-foreground">Actifs</div>
                    </div>
                    <div className="p-1.5 md:p-2 rounded-lg bg-muted/50 text-center">
                      <div className="text-sm md:text-lg font-bold text-warning">{stats.upcomingInterviews}</div>
                      <div className="text-[9px] md:text-xs text-muted-foreground">Entretiens</div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <p className="text-[10px] md:text-xs font-medium text-muted-foreground uppercase tracking-wider px-2 md:px-3 mb-1.5 md:mb-2">Sections</p>
                
                <button
                  onClick={() => { setTeamSection('employees'); setShowMobileSidebar(false); }}
                  className={cn(
                    "w-full flex items-center gap-2 md:gap-3 px-2 md:px-3 py-2 md:py-2.5 rounded-lg text-xs md:text-sm font-medium transition-colors",
                    teamSection === 'employees' 
                      ? 'bg-agent-hr text-white' 
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  <UsersRound className="w-3.5 h-3.5 md:w-4 md:h-4 shrink-0" />
                  <span className="truncate">Collaborateurs</span>
                  <Badge variant="secondary" className="ml-auto text-[10px] h-4 px-1">{stats.employees}</Badge>
                </button>
                
                <button
                  onClick={() => { setTeamSection('hr'); setShowMobileSidebar(false); }}
                  className={cn(
                    "w-full flex items-center gap-2 md:gap-3 px-2 md:px-3 py-2 md:py-2.5 rounded-lg text-xs md:text-sm font-medium transition-colors",
                    teamSection === 'hr' 
                      ? 'bg-agent-hr text-white' 
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  <AlertTriangle className="w-3.5 h-3.5 md:w-4 md:h-4 shrink-0" />
                  <span className="truncate">Gestion RH</span>
                  <Badge variant="secondary" className="ml-auto text-[10px] h-4 px-1">{stats.openDisputes}</Badge>
                </button>
                
                <button
                  onClick={() => { setTeamSection('analytics'); setShowMobileSidebar(false); }}
                  className={cn(
                    "w-full flex items-center gap-2 md:gap-3 px-2 md:px-3 py-2 md:py-2.5 rounded-lg text-xs md:text-sm font-medium transition-colors",
                    teamSection === 'analytics' 
                      ? 'bg-agent-hr text-white' 
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  <BarChart3 className="w-3.5 h-3.5 md:w-4 md:h-4 shrink-0" />
                  <span className="truncate">Analytics</span>
                </button>
                
                <Separator className="my-2 md:my-3" />
                
                {/* Quick Stats */}
                <div className="px-2 md:px-3 space-y-2 md:space-y-3">
                  <p className="text-[10px] md:text-xs font-medium text-muted-foreground uppercase tracking-wider">Résumé</p>
                  <div className="grid grid-cols-2 gap-1.5 md:gap-2">
                    <div className="p-1.5 md:p-2 rounded-lg bg-muted/50 text-center">
                      <div className="text-sm md:text-lg font-bold text-foreground">{stats.employees}</div>
                      <div className="text-[9px] md:text-xs text-muted-foreground">Actifs</div>
                    </div>
                    <div className="p-1.5 md:p-2 rounded-lg bg-muted/50 text-center">
                      <div className="text-sm md:text-lg font-bold text-warning">{stats.openDisputes}</div>
                      <div className="text-[9px] md:text-xs text-muted-foreground">Litiges</div>
                    </div>
                    <div className="p-1.5 md:p-2 rounded-lg bg-muted/50 text-center">
                      <div className="text-sm md:text-lg font-bold text-muted-foreground">{stats.departures}</div>
                      <div className="text-[9px] md:text-xs text-muted-foreground">Départs</div>
                    </div>
                    <div className="p-1.5 md:p-2 rounded-lg bg-muted/50 text-center">
                      <div className="text-sm md:text-lg font-bold text-[hsl(var(--agent-hr))]">{careerEvents.length}</div>
                      <div className="text-[9px] md:text-xs text-muted-foreground">Événements</div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </aside>

          {/* Main Content Area */}
          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <Loader2 className="w-6 h-6 md:w-8 md:h-8 animate-spin text-[hsl(var(--agent-hr))]" />
            </div>
          ) : (
            <main className="flex-1 p-3 md:p-6 overflow-y-auto">
              {mainTab === 'recruitment' ? (
                <>
                  {recruitmentSection === 'pipeline' && (
                    <>
                      <SectionHeader
                        icon={Users}
                        title="Pipeline Candidats"
                        description="Gérez vos candidatures avec l'IA"
                        action={
                          <AddCandidateDialog onAdd={createCandidate} jobs={jobs}>
                            <Button size="sm" className="gap-1.5">
                              <Plus className="w-4 h-4" />
                              <span className="hidden sm:inline">Ajouter</span>
                            </Button>
                          </AddCandidateDialog>
                        }
                      />
                      
                      {/* Search bar */}
                      <div className="relative mb-3 md:mb-4">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          placeholder="Rechercher un candidat..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-9 h-9 md:h-10 text-sm"
                        />
                      </div>
                      
                      {/* Status tabs */}
                      <div className="flex gap-1.5 md:gap-2 mb-4 md:mb-6 overflow-x-auto pb-1">
                        <SubTabButton active={pipelineTab === 'new'} onClick={() => setPipelineTab('new')} icon={Upload} label="Nouveaux" count={stats.newCandidates} />
                        <SubTabButton active={pipelineTab === 'analyzed'} onClick={() => setPipelineTab('analyzed')} icon={Sparkles} label="Analysés" count={stats.analyzedCandidates} />
                        <SubTabButton active={pipelineTab === 'active'} onClick={() => setPipelineTab('active')} icon={CheckCircle} label="Actifs" count={stats.activeCandidates} />
                      </div>
                      
                      {/* Candidates list */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4">
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
                        {filteredCandidates.length === 0 && (
                          <div className="col-span-full text-center py-8 md:py-12">
                            <Users className="w-10 h-10 md:w-12 md:h-12 text-muted-foreground/30 mx-auto mb-3" />
                            <p className="text-muted-foreground text-sm">Aucun candidat trouvé</p>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                  
                  {recruitmentSection === 'interviews' && (
                    <>
                      <SectionHeader
                        icon={Calendar}
                        title="Entretiens"
                        description="Planifiez et gérez les entretiens"
                      />
                      
                      {/* Interview tabs */}
                      <div className="flex gap-1.5 md:gap-2 mb-4 md:mb-6 overflow-x-auto pb-1">
                        <SubTabButton active={interviewTab === 'upcoming'} onClick={() => setInterviewTab('upcoming')} icon={Clock} label="À venir" count={stats.upcomingInterviews} />
                        <SubTabButton active={interviewTab === 'completed'} onClick={() => setInterviewTab('completed')} icon={CheckCircle} label="Terminés" count={stats.completedInterviews} />
                        <SubTabButton active={interviewTab === 'calendar'} onClick={() => setInterviewTab('calendar')} icon={CalendarDays} label="Calendrier" />
                      </div>
                      
                      {interviewTab === 'calendar' ? (
                        <InterviewCalendar interviews={interviews} />
                      ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
                          {(interviewTab === 'upcoming' ? upcomingInterviews : completedInterviews).map(interview => (
                            <InterviewCard
                              key={interview.id}
                              interview={interview}
                              onAnalysisComplete={refetchInterviews}
                            />
                          ))}
                          {(interviewTab === 'upcoming' ? upcomingInterviews : completedInterviews).length === 0 && (
                            <div className="col-span-full text-center py-8 md:py-12">
                              <Calendar className="w-10 h-10 md:w-12 md:h-12 text-muted-foreground/30 mx-auto mb-3" />
                              <p className="text-muted-foreground text-sm">Aucun entretien</p>
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )}
                  
                  {recruitmentSection === 'jobs' && (
                    <>
                      <SectionHeader
                        icon={Briefcase}
                        title="Postes & Offres"
                        description="Créez et gérez vos offres d'emploi"
                      />
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                        {/* Left column: Job generator */}
                        <div className="space-y-4">
                          <JobPostGenerator onGeneratePost={generateJobPost} onCreateJob={createJob} />
                        </div>
                        
                        {/* Right column: Job list */}
                        <div className="space-y-3 md:space-y-4">
                          <h3 className="font-medium text-sm text-muted-foreground">Postes créés ({jobs.length})</h3>
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
                            <Card className="p-6 text-center">
                              <Briefcase className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                              <p className="text-muted-foreground text-sm">Aucun poste créé</p>
                              <p className="text-xs text-muted-foreground/70 mt-1">Utilisez le générateur IA pour créer votre première offre</p>
                            </Card>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                  
                  {recruitmentSection === 'emails' && (
                    <>
                      <SectionHeader
                        icon={Mail}
                        title="Messagerie RH"
                        description="Gérez vos emails de recrutement"
                        action={<EmailAccountConnect />}
                      />
                      <EmailInbox />
                    </>
                  )}
                </>
              ) : (
                <>
                  {teamSection === 'employees' && (
                    <>
                      <SectionHeader
                        icon={UsersRound}
                        title="Collaborateurs"
                        description="Gérez votre équipe"
                        action={
                          <div className="flex items-center gap-2">
                            <div className="flex border rounded-lg overflow-hidden">
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
                              <Button size="sm" className="gap-1.5">
                                <UserPlus className="w-4 h-4" />
                                <span className="hidden sm:inline">Ajouter</span>
                              </Button>
                            </AddEmployeeDialog>
                          </div>
                        }
                      />
                      
                      {/* Search */}
                      <div className="relative mb-4 md:mb-6">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          placeholder="Rechercher un collaborateur..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-9 h-9 md:h-10 text-sm"
                        />
                      </div>
                      
                      {employeeViewMode === 'table' ? (
                        <div className="overflow-x-auto -mx-3 md:mx-0">
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
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
                      )}
                    </>
                  )}
                  
                  {teamSection === 'hr' && (
                    <>
                      <SectionHeader
                        icon={AlertTriangle}
                        title="Gestion RH"
                        description="Litiges et départs"
                      />
                      
                      {/* HR tabs */}
                      <div className="flex gap-1.5 md:gap-2 mb-4 md:mb-6 overflow-x-auto pb-1">
                        <SubTabButton active={hrTab === 'disputes'} onClick={() => setHrTab('disputes')} icon={AlertTriangle} label="Litiges" count={stats.openDisputes} />
                        <SubTabButton active={hrTab === 'departures'} onClick={() => setHrTab('departures')} icon={DoorOpen} label="Départs" count={stats.departures} />
                      </div>
                      
                      {hrTab === 'disputes' ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
                          {disputes.map(dispute => (
                            <DisputeCard
                              key={dispute.id}
                              dispute={dispute}
                              onUpdate={updateDispute}
                              onResolve={resolveDispute}
                            />
                          ))}
                          {disputes.length === 0 && (
                            <div className="col-span-full text-center py-8 md:py-12">
                              <CheckCircle className="w-10 h-10 md:w-12 md:h-12 text-success/30 mx-auto mb-3" />
                              <p className="text-muted-foreground text-sm">Aucun litige en cours</p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
                          {inactiveEmployees.map(employee => (
                            <Card key={employee.id}>
                              <CardContent className="p-3 md:p-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                                    <DoorOpen className="w-5 h-5 text-muted-foreground" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="font-medium text-foreground truncate">{employee.name}</p>
                                    <p className="text-xs md:text-sm text-muted-foreground truncate">{employee.job_title}</p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                      Départ: {employee.left_date ? new Date(employee.left_date).toLocaleDateString('fr-FR') : 'N/A'}
                                    </p>
                                  </div>
                                  {employee.left_reason && (
                                    <Badge variant="outline" className="text-[10px] md:text-xs shrink-0">{employee.left_reason}</Badge>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                          {inactiveEmployees.length === 0 && (
                            <div className="col-span-full text-center py-8 md:py-12">
                              <UsersRound className="w-10 h-10 md:w-12 md:h-12 text-muted-foreground/30 mx-auto mb-3" />
                              <p className="text-muted-foreground text-sm">Aucun départ enregistré</p>
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )}
                  
                  {teamSection === 'analytics' && (
                    <>
                      <SectionHeader
                        icon={BarChart3}
                        title="Analytics RH"
                        description="Performance et carrières"
                      />
                      <EmployeeStats employees={employees} />
                    </>
                  )}
                </>
              )}
            </main>
          )}
        </div>
      </div>
      
      {/* Mobile Tab Bar */}
      <MobileTabBar
        items={
          mainTab === 'recruitment' 
            ? [
                { id: 'pipeline', label: 'Pipeline', icon: Users, badge: stats.candidates },
                { id: 'interviews', label: 'Entretiens', icon: Calendar, badge: stats.upcomingInterviews },
                { id: 'jobs', label: 'Postes', icon: Briefcase, badge: stats.activeJobs },
                { id: 'emails', label: 'Emails', icon: Mail, badge: stats.newEmails > 0 ? stats.newEmails : undefined },
              ]
            : [
                { id: 'employees', label: 'Équipe', icon: UsersRound, badge: stats.employees },
                { id: 'hr', label: 'Gestion', icon: AlertTriangle, badge: stats.openDisputes },
                { id: 'analytics', label: 'Analytics', icon: BarChart3 },
              ]
        }
        activeTab={mainTab === 'recruitment' ? recruitmentSection : teamSection}
        onTabChange={(id) => {
          if (mainTab === 'recruitment') {
            setRecruitmentSection(id as any);
          } else {
            setTeamSection(id as any);
          }
          setShowMobileSidebar(false);
        }}
        accentColor="bg-agent-hr"
      />
      
      {/* Convert candidate dialog */}
      {convertCandidate && (
        <ConvertCandidateDialog
          candidate={convertCandidate}
          open={!!convertCandidate}
          onOpenChange={(open) => !open && setConvertCandidate(null)}
          onConvert={async (candidateId, employeeData) => {
            await convertCandidateToEmployee(candidateId, employeeData);
            setConvertCandidate(null);
            return null;
          }}
        />
      )}
    </DashboardLayout>
  );
}
