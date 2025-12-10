import { useState, useMemo } from 'react';
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Users, Upload, Sparkles, UserCheck, Briefcase,
  Plus, Search, Loader2, UserPlus, CheckCircle, Clock
} from "lucide-react";
import { useHR } from "@/hooks/useHR";
import { CandidateCard } from "@/components/hr/CandidateCard";
import { JobCard } from "@/components/hr/JobCard";
import { AddCandidateDialog } from "@/components/hr/AddCandidateDialog";
import { JobPostGenerator } from "@/components/hr/JobPostGenerator";
import { Input } from "@/components/ui/input";

export default function HR() {
  const { 
    candidates, 
    jobs, 
    loading,
    createCandidate,
    validateScore,
    activateCandidate,
    linkToJob,
    updateDescription,
    addInterviewNotes,
    createJob,
    generateJobPost,
    deleteCandidate,
    deleteJob
  } = useHR();

  const [activeTab, setActiveTab] = useState<"new" | "analyzed" | "active" | "jobs" | "generator">("new");
  const [searchQuery, setSearchQuery] = useState('');

  // Filter and sort candidates by status - ALWAYS sorted by score (best first)
  const filteredCandidates = useMemo(() => {
    let filtered = candidates.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email?.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Filter by active tab status
      if (activeTab === 'new') return matchesSearch && c.status === 'new';
      if (activeTab === 'analyzed') return matchesSearch && c.status === 'analyzed';
      if (activeTab === 'active') return matchesSearch && c.status === 'active';
      return matchesSearch;
    });

    // ALWAYS sort by score (best first), then by date
    filtered.sort((a, b) => {
      const scoreA = a.match_score || 0;
      const scoreB = b.match_score || 0;
      if (scoreB !== scoreA) return scoreB - scoreA;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    return filtered;
  }, [candidates, searchQuery, activeTab]);

  // Stats
  const stats = {
    total: candidates.length,
    new: candidates.filter(c => c.status === 'new').length,
    analyzed: candidates.filter(c => c.status === 'analyzed').length,
    active: candidates.filter(c => c.status === 'active').length,
    activeJobs: jobs.filter(j => j.is_active).length
  };

  const tabs = [
    { key: "new", label: "Nouveaux", icon: UserPlus, count: stats.new },
    { key: "analyzed", label: "Analysés", icon: Clock, count: stats.analyzed },
    { key: "active", label: "Actifs", icon: CheckCircle, count: stats.active },
    { key: "jobs", label: "Postes", icon: Briefcase, count: stats.activeJobs },
    { key: "generator", label: "Générateur", icon: Sparkles },
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
              <p className="text-muted-foreground mt-1">
                Workflow : Nouveau → Analysé (score validé) → Actif (entretiens passés)
              </p>
            </div>
            <AddCandidateDialog onAdd={createCandidate}>
              <Button variant="hero">
                <Upload className="w-4 h-4 mr-2" />
                Ajouter un CV
              </Button>
            </AddCandidateDialog>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-5 gap-4 mt-6">
            <div className="p-3 rounded-lg bg-card border border-border">
              <div className="text-2xl font-bold text-foreground">{stats.total}</div>
              <div className="text-xs text-muted-foreground">Total candidats</div>
            </div>
            <div className="p-3 rounded-lg bg-card border border-border">
              <div className="text-2xl font-bold text-primary">{stats.new}</div>
              <div className="text-xs text-muted-foreground">Nouveaux</div>
            </div>
            <div className="p-3 rounded-lg bg-card border border-border">
              <div className="text-2xl font-bold text-warning">{stats.analyzed}</div>
              <div className="text-xs text-muted-foreground">Analysés</div>
            </div>
            <div className="p-3 rounded-lg bg-card border border-border">
              <div className="text-2xl font-bold text-success">{stats.active}</div>
              <div className="text-xs text-muted-foreground">Actifs</div>
            </div>
            <div className="p-3 rounded-lg bg-card border border-border">
              <div className="text-2xl font-bold text-indigo-500">{stats.activeJobs}</div>
              <div className="text-xs text-muted-foreground">Postes actifs</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mt-6 overflow-x-auto">
            {tabs.map((tab) => (
              <Button
                key={tab.key}
                variant={activeTab === tab.key ? "default" : "ghost"}
                onClick={() => setActiveTab(tab.key as typeof activeTab)}
                className="gap-2 whitespace-nowrap"
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                {tab.count !== undefined && (
                  <Badge variant="secondary" className="ml-1">{tab.count}</Badge>
                )}
              </Button>
            ))}
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
                {/* Candidates Tabs (new, analyzed, active) */}
                {(activeTab === "new" || activeTab === "analyzed" || activeTab === "active") && (
                  <div className="space-y-6">
                    {/* Search */}
                    <div className="flex items-center gap-4">
                      <div className="relative flex-1 max-w-md">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <Input 
                          placeholder="Rechercher un candidat..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Triés par score (meilleur → moins bon)
                      </p>
                    </div>

                    {/* Candidates List */}
                    {filteredCandidates.length > 0 ? (
                      <div className="space-y-4">
                        {filteredCandidates.map((candidate) => (
                          <CandidateCard 
                            key={candidate.id}
                            candidate={candidate}
                            jobs={jobs}
                            onValidateScore={validateScore}
                            onActivate={activateCandidate}
                            onLinkToJob={linkToJob}
                            onUpdateDescription={updateDescription}
                            onAddInterviewNotes={addInterviewNotes}
                            onDelete={deleteCandidate}
                          />
                        ))}
                      </div>
                    ) : (
                      <Card className="border-dashed">
                        <CardContent className="py-12 text-center">
                          <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                          <h3 className="text-lg font-medium text-foreground mb-2">
                            {candidates.length === 0 ? 'Aucun candidat' : `Aucun candidat ${activeTab === 'new' ? 'nouveau' : activeTab === 'analyzed' ? 'analysé' : 'actif'}`}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            {activeTab === 'new' && 'Ajoutez un CV pour commencer'}
                            {activeTab === 'analyzed' && 'Validez le score des nouveaux candidats'}
                            {activeTab === 'active' && 'Validez les candidats après leurs entretiens'}
                          </p>
                          {activeTab === 'new' && (
                            <AddCandidateDialog onAdd={createCandidate}>
                              <Button>
                                <Plus className="w-4 h-4 mr-2" />
                                Ajouter un CV
                              </Button>
                            </AddCandidateDialog>
                          )}
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )}

                {/* Jobs Tab */}
                {activeTab === "jobs" && (
                  <div className="space-y-4">
                    {jobs.length > 0 ? (
                      <>
                        <p className="text-sm text-muted-foreground">
                          Cliquez sur un poste pour voir les détails complets
                        </p>
                        <div className="space-y-4">
                          {jobs.map((job) => (
                            <JobCard 
                              key={job.id}
                              job={job}
                              candidatesCount={candidates.filter(c => c.job_id === job.id).length}
                              onDelete={deleteJob}
                            />
                          ))}
                        </div>
                      </>
                    ) : (
                      <Card className="border-dashed">
                        <CardContent className="py-12 text-center">
                          <Briefcase className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                          <h3 className="text-lg font-medium text-foreground mb-2">Aucun poste</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            Créez des postes pour relier les candidats
                          </p>
                          <Button onClick={() => setActiveTab('generator')}>
                            <Plus className="w-4 h-4 mr-2" />
                            Créer un poste
                          </Button>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )}

                {/* Generator Tab */}
                {activeTab === "generator" && (
                  <div className="max-w-2xl">
                    <JobPostGenerator 
                      onGeneratePost={generateJobPost}
                      onCreateJob={createJob}
                    />
                  </div>
                )}
              </div>
            </ScrollArea>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
