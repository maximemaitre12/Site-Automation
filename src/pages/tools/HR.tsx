import { useState, useMemo } from 'react';
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, Upload, Sparkles, Briefcase, Plus, Search, Loader2, 
  UserPlus, CheckCircle, Clock, UsersRound, TrendingUp, 
  AlertTriangle, DoorOpen, Calendar, CalendarDays, List
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
  const [recruitmentTab, setRecruitmentTab] = useState<"new" | "analyzed" | "active" | "jobs" | "interviews" | "generator">("new");
  const [teamTab, setTeamTab] = useState<"employees" | "performance" | "careers" | "disputes" | "departures">("employees");
  const [searchQuery, setSearchQuery] = useState('');
  const [convertCandidate, setConvertCandidate] = useState<any>(null);
  const [interviewViewMode, setInterviewViewMode] = useState<"calendar" | "list">("calendar");

  const loading = hrLoading || employeesLoading || interviewsLoading;
  const upcomingInterviews = getUpcomingInterviews();

  // Filter candidates
  const filteredCandidates = useMemo(() => {
    let filtered = candidates.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email?.toLowerCase().includes(searchQuery.toLowerCase());
      if (recruitmentTab === 'new') return matchesSearch && c.status === 'new';
      if (recruitmentTab === 'analyzed') return matchesSearch && c.status === 'analyzed';
      if (recruitmentTab === 'active') return matchesSearch && c.status === 'active';
      return matchesSearch;
    });
    filtered.sort((a, b) => (b.match_score || 0) - (a.match_score || 0));
    return filtered;
  }, [candidates, searchQuery, recruitmentTab]);

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
    activeJobs: jobs.filter(j => j.is_active).length,
    employees: activeEmployees.length,
    openDisputes: openDisputes.length,
    departures: inactiveEmployees.length,
  };

  const recruitmentTabs = [
    { key: "new", label: "Nouveaux", icon: UserPlus, count: stats.newCandidates },
    { key: "analyzed", label: "Analysés", icon: Clock, count: candidates.filter(c => c.status === 'analyzed').length },
    { key: "active", label: "Actifs", icon: CheckCircle, count: candidates.filter(c => c.status === 'active').length },
    { key: "jobs", label: "Postes", icon: Briefcase, count: stats.activeJobs },
    { key: "interviews", label: "Entretiens", icon: Calendar, count: upcomingInterviews.length },
    { key: "generator", label: "Générateur", icon: Sparkles },
  ];

  const teamTabs = [
    { key: "employees", label: "Collaborateurs", icon: UsersRound, count: stats.employees },
    { key: "performance", label: "Performance", icon: TrendingUp },
    { key: "careers", label: "Carrières", icon: Sparkles, count: careerEvents.length },
    { key: "disputes", label: "Litiges", icon: AlertTriangle, count: stats.openDisputes },
    { key: "departures", label: "Départs", icon: DoorOpen, count: stats.departures },
  ];

  return (
    <DashboardLayout>
      <div className="h-full flex flex-col">
        {/* Header */}
        <header className="px-8 py-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-400 flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                HR Copilot
              </h1>
              <p className="text-muted-foreground mt-1">Recrutement et gestion d'équipe</p>
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

          {/* Stats row */}
          <div className="grid grid-cols-6 gap-3 mt-6">
            <div className="p-3 rounded-lg bg-card border border-border">
              <div className="text-2xl font-bold text-foreground">{stats.candidates}</div>
              <div className="text-xs text-muted-foreground">Candidats</div>
            </div>
            <div className="p-3 rounded-lg bg-card border border-border">
              <div className="text-2xl font-bold text-primary">{stats.newCandidates}</div>
              <div className="text-xs text-muted-foreground">À traiter</div>
            </div>
            <div className="p-3 rounded-lg bg-card border border-border">
              <div className="text-2xl font-bold text-indigo-500">{stats.activeJobs}</div>
              <div className="text-xs text-muted-foreground">Postes ouverts</div>
            </div>
            <div className="p-3 rounded-lg bg-card border border-border">
              <div className="text-2xl font-bold text-success">{stats.employees}</div>
              <div className="text-xs text-muted-foreground">Employés actifs</div>
            </div>
            <div className="p-3 rounded-lg bg-card border border-border">
              <div className="text-2xl font-bold text-warning">{stats.openDisputes}</div>
              <div className="text-xs text-muted-foreground">Litiges ouverts</div>
            </div>
            <div className="p-3 rounded-lg bg-card border border-border">
              <div className="text-2xl font-bold text-muted-foreground">{stats.departures}</div>
              <div className="text-xs text-muted-foreground">Départs</div>
            </div>
          </div>

          {/* Sub-tabs */}
          <div className="flex gap-2 mt-6 overflow-x-auto">
            {(mainTab === 'recruitment' ? recruitmentTabs : teamTabs).map((tab) => (
              <Button
                key={tab.key}
                variant={(mainTab === 'recruitment' ? recruitmentTab : teamTab) === tab.key ? "default" : "ghost"}
                onClick={() => mainTab === 'recruitment' ? setRecruitmentTab(tab.key as any) : setTeamTab(tab.key as any)}
                className="gap-2 whitespace-nowrap"
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                {tab.count !== undefined && <Badge variant="secondary" className="ml-1">{tab.count}</Badge>}
              </Button>
            ))}
            
            {/* Action button */}
            <div className="ml-auto">
              {mainTab === 'recruitment' && (
                <AddCandidateDialog onAdd={createCandidate} jobs={jobs}>
                  <Button variant="hero"><Upload className="w-4 h-4 mr-2" />Ajouter un CV</Button>
                </AddCandidateDialog>
              )}
              {mainTab === 'team' && teamTab === 'employees' && (
                <AddEmployeeDialog onAdd={createEmployee}>
                  <Button variant="hero"><Plus className="w-4 h-4 mr-2" />Ajouter un employé</Button>
                </AddEmployeeDialog>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <ScrollArea className="h-full">
              <div className="p-8">
                {/* RECRUITMENT MODULE */}
                {mainTab === 'recruitment' && (
                  <>
                    {(recruitmentTab === "new" || recruitmentTab === "analyzed" || recruitmentTab === "active") && (
                      <div className="space-y-6">
                        <div className="flex items-center gap-4">
                          <div className="relative flex-1 max-w-md">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                            <Input placeholder="Rechercher..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
                          </div>
                        </div>
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
                              <AddCandidateDialog onAdd={createCandidate} jobs={jobs}>
                              <Button><Plus className="w-4 h-4 mr-2" />Ajouter un CV</Button>
                            </AddCandidateDialog>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  )}

                  {recruitmentTab === "interviews" && (
                    <div className="space-y-4">
                      {/* View mode toggle */}
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-lg">Entretiens</h3>
                        <div className="flex gap-1 bg-muted p-1 rounded-lg">
                          <Button 
                            size="sm" 
                            variant={interviewViewMode === "calendar" ? "default" : "ghost"}
                            onClick={() => setInterviewViewMode("calendar")}
                            className="gap-2"
                          >
                            <CalendarDays className="w-4 h-4" />
                            Calendrier
                          </Button>
                          <Button 
                            size="sm" 
                            variant={interviewViewMode === "list" ? "default" : "ghost"}
                            onClick={() => setInterviewViewMode("list")}
                            className="gap-2"
                          >
                            <List className="w-4 h-4" />
                            Liste
                          </Button>
                        </div>
                      </div>

                      {interviewViewMode === "calendar" ? (
                        <InterviewCalendar 
                          interviews={interviews} 
                          onUpdateInterview={updateInterview}
                        />
                      ) : (
                        <>
                          {interviews.length > 0 ? (
                            <div className="space-y-4">
                              {interviews.map((interview) => (
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
                                <h3 className="text-lg font-medium mb-2">Aucun entretien planifié</h3>
                                <p className="text-sm text-muted-foreground">Planifiez des entretiens depuis les fiches candidats</p>
                              </CardContent>
                            </Card>
                          )}
                        </>
                      )}
                    </div>
                  )}

                    {recruitmentTab === "jobs" && (
                      <div className="space-y-4">
                        {jobs.length > 0 ? jobs.map((job) => (
                          <JobCard key={job.id} job={job} candidatesCount={candidates.filter(c => c.job_id === job.id).length} onDelete={deleteJob} />
                        )) : (
                          <Card className="border-dashed">
                            <CardContent className="py-12 text-center">
                              <Briefcase className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                              <h3 className="text-lg font-medium mb-2">Aucun poste</h3>
                              <Button onClick={() => setRecruitmentTab('generator')}><Plus className="w-4 h-4 mr-2" />Créer un poste</Button>
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    )}

                    {recruitmentTab === "generator" && (
                      <div className="max-w-2xl">
                        <JobPostGenerator onGeneratePost={generateJobPost} onCreateJob={createJob} />
                      </div>
                    )}
                  </>
                )}

                {/* TEAM MODULE */}
                {mainTab === 'team' && (
                  <>
                    {teamTab === "employees" && (
                      <div className="space-y-6">
                        <div className="relative max-w-md">
                          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                          <Input placeholder="Rechercher un employé..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
                        </div>
                        {filteredEmployees.length > 0 ? (
                          <div className="space-y-4">
                            {filteredEmployees.map((emp) => (
                              <EmployeeCard key={emp.id} employee={emp} onUpdate={updateEmployee} onTerminate={terminateEmployee} onDelete={deleteEmployee} onAddCareerEvent={addCareerEvent} />
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

                    {teamTab === "disputes" && (
                      <div className="space-y-4">
                        {disputes.length > 0 ? disputes.map((d) => (
                          <DisputeCard key={d.id} dispute={d} employee={employees.find(e => e.id === d.employee_id)} onResolve={resolveDispute} onUpdate={updateDispute} />
                        )) : (
                          <Card className="border-dashed">
                            <CardContent className="py-12 text-center">
                              <AlertTriangle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                              <h3 className="text-lg font-medium mb-2">Aucun litige</h3>
                              <p className="text-sm text-muted-foreground">Les litiges RH apparaîtront ici</p>
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    )}

                    {teamTab === "departures" && (
                      <div className="space-y-4">
                        {inactiveEmployees.length > 0 ? inactiveEmployees.map((emp) => (
                          <EmployeeCard key={emp.id} employee={emp} onUpdate={updateEmployee} onTerminate={terminateEmployee} onDelete={deleteEmployee} onAddCareerEvent={addCareerEvent} />
                        )) : (
                          <Card className="border-dashed">
                            <CardContent className="py-12 text-center">
                              <DoorOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                              <h3 className="text-lg font-medium mb-2">Aucun départ</h3>
                              <p className="text-sm text-muted-foreground">L'historique des départs apparaîtra ici</p>
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    )}

                    {(teamTab === "performance" || teamTab === "careers") && (
                      <Card className="border-dashed">
                        <CardContent className="py-12 text-center">
                          <TrendingUp className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                          <h3 className="text-lg font-medium mb-2">
                            {teamTab === "performance" ? "Dashboard Performance" : "Historique Carrières"}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {teamTab === "performance" 
                              ? "Les métriques de performance des commerciaux seront affichées ici"
                              : "L'historique des augmentations et promotions sera affiché ici"
                            }
                          </p>
                        </CardContent>
                      </Card>
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
