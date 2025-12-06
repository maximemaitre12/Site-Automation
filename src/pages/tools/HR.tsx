import { useState } from 'react';
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, Upload, FileText, Sparkles, UserCheck, Briefcase,
  History, Plus, Search, Filter, Loader2
} from "lucide-react";
import { useHR } from "@/hooks/useHR";
import { CandidateCard } from "@/components/hr/CandidateCard";
import { AddCandidateDialog } from "@/components/hr/AddCandidateDialog";
import { JobPostGenerator } from "@/components/hr/JobPostGenerator";
import { Input } from "@/components/ui/input";

export default function HR() {
  const { 
    candidates, 
    jobs, 
    loading,
    createCandidate,
    analyzeCandidate,
    matchCandidateToJob,
    createJob,
    generateJobPost,
    analyzeInterview,
    deleteCandidate
  } = useHR();

  const [activeTab, setActiveTab] = useState<"candidates" | "jobs" | "generator">("candidates");
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Filter candidates
  const filteredCandidates = candidates.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Stats
  const stats = {
    total: candidates.length,
    new: candidates.filter(c => c.status === 'new').length,
    analyzed: candidates.filter(c => c.status === 'analyzed').length,
    interview: candidates.filter(c => c.status === 'interview').length,
    activeJobs: jobs.filter(j => j.is_active).length
  };

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
                Analyse de CV, matching candidats, génération d'offres
              </p>
            </div>
            <AddCandidateDialog onAdd={createCandidate}>
              <Button variant="hero">
                <Upload className="w-4 h-4 mr-2" />
                Ajouter un candidat
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
              <div className="text-2xl font-bold text-success">{stats.analyzed}</div>
              <div className="text-xs text-muted-foreground">Analysés</div>
            </div>
            <div className="p-3 rounded-lg bg-card border border-border">
              <div className="text-2xl font-bold text-warning">{stats.interview}</div>
              <div className="text-xs text-muted-foreground">En entretien</div>
            </div>
            <div className="p-3 rounded-lg bg-card border border-border">
              <div className="text-2xl font-bold text-indigo-500">{stats.activeJobs}</div>
              <div className="text-xs text-muted-foreground">Postes actifs</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mt-6">
            {[
              { key: "candidates", label: "Candidats", icon: Users },
              { key: "jobs", label: "Postes", icon: Briefcase },
              { key: "generator", label: "Générateur", icon: Sparkles },
            ].map((tab) => (
              <Button
                key={tab.key}
                variant={activeTab === tab.key ? "default" : "ghost"}
                onClick={() => setActiveTab(tab.key as typeof activeTab)}
                className="gap-2"
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
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
                {/* Candidates Tab */}
                {activeTab === "candidates" && (
                  <div className="space-y-6">
                    {/* Search & Filter */}
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
                      <select 
                        className="h-10 rounded-lg bg-secondary border border-border px-3 text-sm"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                      >
                        <option value="all">Tous les statuts</option>
                        <option value="new">Nouveau</option>
                        <option value="analyzed">Analysé</option>
                        <option value="screening">Présélection</option>
                        <option value="interview">Entretien</option>
                        <option value="hired">Embauché</option>
                        <option value="rejected">Rejeté</option>
                      </select>
                    </div>

                    {/* Candidates List */}
                    {filteredCandidates.length > 0 ? (
                      <div className="space-y-4">
                        {filteredCandidates.map((candidate) => (
                          <CandidateCard 
                            key={candidate.id}
                            candidate={candidate}
                            jobs={jobs}
                            onAnalyze={analyzeCandidate}
                            onMatch={matchCandidateToJob}
                            onAnalyzeInterview={analyzeInterview}
                            onDelete={deleteCandidate}
                          />
                        ))}
                      </div>
                    ) : (
                      <Card className="border-dashed">
                        <CardContent className="py-12 text-center">
                          <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                          <h3 className="text-lg font-medium text-foreground mb-2">
                            {candidates.length === 0 ? 'Aucun candidat' : 'Aucun résultat'}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            {candidates.length === 0 
                              ? 'Commencez par ajouter votre premier candidat'
                              : 'Modifiez vos critères de recherche'}
                          </p>
                          {candidates.length === 0 && (
                            <AddCandidateDialog onAdd={createCandidate}>
                              <Button>
                                <Plus className="w-4 h-4 mr-2" />
                                Ajouter un candidat
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
                  <div className="space-y-6">
                    {jobs.length > 0 ? (
                      <div className="grid md:grid-cols-2 gap-4">
                        {jobs.map((job) => (
                          <Card key={job.id} className="hover:border-primary/30 transition-all">
                            <CardHeader className="pb-3">
                              <div className="flex items-start justify-between">
                                <div>
                                  <CardTitle className="text-base">{job.title}</CardTitle>
                                  {job.department && (
                                    <p className="text-sm text-muted-foreground">{job.department}</p>
                                  )}
                                </div>
                                <Badge variant={job.is_active ? "default" : "secondary"}>
                                  {job.is_active ? 'Actif' : 'Inactif'}
                                </Badge>
                              </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              {job.salary_range && (
                                <p className="text-sm text-muted-foreground">
                                  💰 {job.salary_range}
                                </p>
                              )}
                              {Array.isArray(job.skills) && job.skills.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                  {(job.skills as string[]).slice(0, 5).map((skill, i) => (
                                    <span key={i} className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary">
                                      {skill}
                                    </span>
                                  ))}
                                </div>
                              )}
                              {job.description && (
                                <p className="text-sm text-muted-foreground line-clamp-3">
                                  {job.description}
                                </p>
                              )}
                              <div className="flex items-center justify-between pt-2 border-t border-border">
                                <span className="text-xs text-muted-foreground">
                                  {new Date(job.created_at).toLocaleDateString('fr-FR')}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {candidates.filter(c => c.job_id === job.id).length} candidats matchés
                                </span>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <Card className="border-dashed">
                        <CardContent className="py-12 text-center">
                          <Briefcase className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                          <h3 className="text-lg font-medium text-foreground mb-2">Aucun poste</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            Créez des postes pour matcher les candidats
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
