import { useState } from 'react';
import { Interview } from '@/hooks/useInterviews';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MatchScoreGauge } from '../MatchScoreGauge';
import { MetricGauge } from './MetricGauge';
import { ScoreCard } from './ScoreCard';
import { SkillsRadarChart } from './SkillsRadarChart';
import { EvaluationCard } from './EvaluationCard';
import { InsightTag } from './InsightTag';
import { 
  LayoutDashboard, Mic2, Code2, Users, Heart, FileText, 
  Clock, MessageSquare, ArrowLeft, Download, CheckCircle2,
  AlertTriangle, Lightbulb, HelpCircle, Volume2, Zap, Target,
  Brain, Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface InterviewAnalysisViewProps {
  interview: Interview;
  candidateName: string;
  onClose: () => void;
}

export function InterviewAnalysisView({ interview, candidateName, onClose }: InterviewAnalysisViewProps) {
  const [activeTab, setActiveTab] = useState('overview');

  const voiceAnalysis = interview.voice_analysis || {};
  const technicalEval = interview.technical_evaluation || {};
  const behavioralEval = interview.behavioral_evaluation || {};
  const culturalFit = interview.cultural_fit_evaluation || {};
  const aiReport = interview.ai_report || {};
  const matchBreakdown = interview.match_breakdown || {};
  const matchScore = interview.match_score || 0;

  const getRecommendationConfig = (recommendation?: string) => {
    switch (recommendation) {
      case 'strongly_recommend':
        return { label: 'Fortement recommandé', color: 'bg-emerald-500', icon: <Sparkles className="w-4 h-4" /> };
      case 'recommend':
        return { label: 'Recommandé', color: 'bg-blue-500', icon: <CheckCircle2 className="w-4 h-4" /> };
      case 'consider':
        return { label: 'À considérer', color: 'bg-amber-500', icon: <HelpCircle className="w-4 h-4" /> };
      case 'not_recommend':
        return { label: 'Non recommandé', color: 'bg-red-500', icon: <AlertTriangle className="w-4 h-4" /> };
      default:
        return { label: 'En attente', color: 'bg-muted', icon: <Clock className="w-4 h-4" /> };
    }
  };

  const recommendation = getRecommendationConfig(aiReport.hiring_recommendation);

  const getStressLabel = (level?: string) => {
    switch (level) {
      case 'low': return { label: 'Faible', color: 'text-emerald-600' };
      case 'medium': return { label: 'Modéré', color: 'text-amber-600' };
      case 'high': return { label: 'Élevé', color: 'text-red-600' };
      default: return { label: 'N/A', color: 'text-muted-foreground' };
    }
  };

  const getPaceLabel = (pace?: string) => {
    switch (pace) {
      case 'slow': return { label: 'Lent', icon: '🐢' };
      case 'moderate': return { label: 'Modéré', icon: '⚡' };
      case 'fast': return { label: 'Rapide', icon: '🚀' };
      default: return { label: 'N/A', icon: '❓' };
    }
  };

  const tabs = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'voice', label: 'Analyse Vocale', icon: <Mic2 className="w-4 h-4" /> },
    { id: 'technical', label: 'Compétences', icon: <Code2 className="w-4 h-4" /> },
    { id: 'behavioral', label: 'Comportement', icon: <Users className="w-4 h-4" /> },
    { id: 'cultural', label: 'Fit Culturel', icon: <Heart className="w-4 h-4" /> },
    { id: 'report', label: 'Rapport IA', icon: <FileText className="w-4 h-4" /> },
  ];

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="border-b px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h2 className="text-xl font-semibold">Analyse de l'entretien</h2>
            <p className="text-sm text-muted-foreground">{candidateName}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className={cn('gap-1.5', recommendation.color, 'text-white')}>
            {recommendation.icon}
            {recommendation.label}
          </Badge>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4" />
            Exporter PDF
          </Button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
        <div className="border-b px-6 shrink-0">
          <TabsList className="h-12 bg-transparent gap-1">
            {tabs.map(tab => (
              <TabsTrigger 
                key={tab.id} 
                value={tab.id}
                className="gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-6">
            {/* Overview Tab */}
            <TabsContent value="overview" className="mt-0 space-y-6">
              {/* Main Score Section */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-1 flex flex-col items-center justify-center p-6 border rounded-xl bg-card">
                  <MatchScoreGauge score={matchScore} size="lg" showLabel />
                  <p className="text-sm text-muted-foreground mt-2">Score Global</p>
                </div>
                
                <div className="lg:col-span-3 grid grid-cols-3 gap-4">
                  <ScoreCard 
                    label="Technique" 
                    score={matchBreakdown.technical?.score || technicalEval.score || 0}
                    icon={<Code2 className="w-4 h-4" />}
                    size="lg"
                  />
                  <ScoreCard 
                    label="Comportement" 
                    score={matchBreakdown.behavioral?.score || behavioralEval.score || 0}
                    icon={<Users className="w-4 h-4" />}
                    size="lg"
                  />
                  <ScoreCard 
                    label="Culture" 
                    score={matchBreakdown.cultural?.score || culturalFit.score || 0}
                    icon={<Heart className="w-4 h-4" />}
                    size="lg"
                  />
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 border rounded-xl bg-card">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">Durée</span>
                  </div>
                  <div className="text-2xl font-bold">{interview.duration_minutes || 0} min</div>
                </div>
                <div className="p-4 border rounded-xl bg-card">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <MessageSquare className="w-4 h-4" />
                    <span className="text-sm">Questions suggérées</span>
                  </div>
                  <div className="text-2xl font-bold">
                    {Object.values(interview.ai_suggested_questions || {}).flat().length}
                  </div>
                </div>
                <div className="p-4 border rounded-xl bg-card">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Volume2 className="w-4 h-4" />
                    <span className="text-sm">Confiance vocale</span>
                  </div>
                  <div className="text-2xl font-bold">{voiceAnalysis.confidence_score || 0}%</div>
                </div>
                <div className="p-4 border rounded-xl bg-card">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Zap className="w-4 h-4" />
                    <span className="text-sm">Stress détecté</span>
                  </div>
                  <div className={cn('text-2xl font-bold', getStressLabel(voiceAnalysis.stress_level).color)}>
                    {getStressLabel(voiceAnalysis.stress_level).label}
                  </div>
                </div>
              </div>

              {/* Summary */}
              {aiReport.summary && (
                <div className="p-6 border rounded-xl bg-card">
                  <div className="flex items-center gap-2 mb-3">
                    <Brain className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold">Résumé de l'IA</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">{aiReport.summary}</p>
                </div>
              )}

              {/* Key Insights */}
              {voiceAnalysis.key_insights && voiceAnalysis.key_insights.length > 0 && (
                <div className="p-6 border rounded-xl bg-card">
                  <div className="flex items-center gap-2 mb-4">
                    <Lightbulb className="w-5 h-5 text-amber-500" />
                    <h3 className="font-semibold">Points clés détectés</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {voiceAnalysis.key_insights.map((insight: string, idx: number) => (
                      <InsightTag key={idx} text={insight} type="insight" />
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            {/* Voice Analysis Tab */}
            <TabsContent value="voice" className="mt-0 space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <MetricGauge 
                  value={voiceAnalysis.confidence_score || 0} 
                  label="Confiance" 
                  description="Assurance dans la voix"
                  size="lg"
                />
                <MetricGauge 
                  value={voiceAnalysis.fluency_score || 0} 
                  label="Fluidité" 
                  description="Clarté du discours"
                  size="lg"
                />
                <MetricGauge 
                  value={voiceAnalysis.clarity_score || 0} 
                  label="Clarté" 
                  description="Articulation"
                  size="lg"
                />
                <MetricGauge 
                  value={100 - (voiceAnalysis.stress_level === 'high' ? 80 : voiceAnalysis.stress_level === 'medium' ? 50 : 20)} 
                  label="Calme" 
                  description="Niveau de stress inversé"
                  size="lg"
                  colorScheme="success"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 border rounded-xl bg-card">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-amber-500" />
                    Niveau de stress
                  </h3>
                  <div className="flex items-center gap-4">
                    <div className={cn('text-4xl font-bold', getStressLabel(voiceAnalysis.stress_level).color)}>
                      {getStressLabel(voiceAnalysis.stress_level).label}
                    </div>
                    <div className="text-muted-foreground">
                      {voiceAnalysis.hesitation_count !== undefined && (
                        <p>{voiceAnalysis.hesitation_count} hésitations détectées</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-6 border rounded-xl bg-card">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Volume2 className="w-5 h-5 text-blue-500" />
                    Rythme de parole
                  </h3>
                  <div className="flex items-center gap-4">
                    <span className="text-4xl">{getPaceLabel(voiceAnalysis.speaking_pace).icon}</span>
                    <div>
                      <div className="text-2xl font-bold">{getPaceLabel(voiceAnalysis.speaking_pace).label}</div>
                      {voiceAnalysis.emotional_state && (
                        <p className="text-muted-foreground">État: {voiceAnalysis.emotional_state}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {voiceAnalysis.key_insights && voiceAnalysis.key_insights.length > 0 && (
                <div className="p-6 border rounded-xl bg-card">
                  <h3 className="font-semibold mb-4">Observations vocales</h3>
                  <div className="space-y-2">
                    {voiceAnalysis.key_insights.map((insight: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                        <Lightbulb className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                        <span className="text-sm">{insight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            {/* Technical Tab */}
            <TabsContent value="technical" className="mt-0 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="p-6 border rounded-xl bg-card">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Target className="w-5 h-5 text-primary" />
                      Radar des compétences
                    </h3>
                    <Badge variant="outline" className="text-lg px-3 py-1">
                      {technicalEval.score || 0}%
                    </Badge>
                  </div>
                  <SkillsRadarChart skills={technicalEval.details || []} />
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Détail par compétence</h3>
                  {technicalEval.details && technicalEval.details.length > 0 ? (
                    technicalEval.details.map((skill: { skill: string; score: number; evidence: string }, idx: number) => (
                      <EvaluationCard
                        key={idx}
                        name={skill.skill}
                        score={skill.score}
                        evidence={skill.evidence}
                        icon={<Code2 className="w-4 h-4" />}
                      />
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      Aucune évaluation technique disponible
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Behavioral Tab */}
            <TabsContent value="behavioral" className="mt-0 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">Évaluation comportementale</h3>
                <Badge variant="outline" className="text-lg px-3 py-1">
                  Score global: {behavioralEval.score || 0}%
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {behavioralEval.criteria && behavioralEval.criteria.length > 0 ? (
                  behavioralEval.criteria.map((criterion: { name: string; score: number; evidence: string }, idx: number) => (
                    <EvaluationCard
                      key={idx}
                      name={criterion.name}
                      score={criterion.score}
                      evidence={criterion.evidence}
                      icon={<Users className="w-4 h-4" />}
                    />
                  ))
                ) : (
                  <div className="col-span-2 text-center py-8 text-muted-foreground">
                    Aucune évaluation comportementale disponible
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Cultural Fit Tab */}
            <TabsContent value="cultural" className="mt-0 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="flex flex-col items-center justify-center p-6 border rounded-xl bg-card">
                  <MetricGauge 
                    value={culturalFit.score || 0} 
                    label="Alignement culturel" 
                    size="lg"
                  />
                </div>

                <div className="p-6 border rounded-xl bg-card">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    Points d'alignement
                  </h3>
                  <div className="space-y-2">
                    {culturalFit.alignment_points && culturalFit.alignment_points.length > 0 ? (
                      culturalFit.alignment_points.map((point: string, idx: number) => (
                        <InsightTag key={idx} text={point} type="success" size="sm" />
                      ))
                    ) : (
                      <p className="text-muted-foreground text-sm">Aucun point d'alignement identifié</p>
                    )}
                  </div>
                </div>

                <div className="p-6 border rounded-xl bg-card">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-500" />
                    Points d'attention
                  </h3>
                  <div className="space-y-2">
                    {culturalFit.concerns && culturalFit.concerns.length > 0 ? (
                      culturalFit.concerns.map((concern: string, idx: number) => (
                        <InsightTag key={idx} text={concern} type="warning" size="sm" />
                      ))
                    ) : (
                      <p className="text-muted-foreground text-sm">Aucune préoccupation identifiée</p>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* AI Report Tab */}
            <TabsContent value="report" className="mt-0 space-y-6">
              {aiReport.summary && (
                <div className="p-6 border rounded-xl bg-card">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Brain className="w-5 h-5 text-primary" />
                    Synthèse
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">{aiReport.summary}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 border rounded-xl bg-emerald-500/5 border-emerald-500/20">
                  <h3 className="font-semibold mb-4 flex items-center gap-2 text-emerald-700">
                    <CheckCircle2 className="w-5 h-5" />
                    Forces identifiées
                  </h3>
                  <div className="space-y-2">
                    {aiReport.strengths && aiReport.strengths.length > 0 ? (
                      aiReport.strengths.map((strength: string, idx: number) => (
                        <div key={idx} className="flex items-start gap-2 text-sm">
                          <span className="text-emerald-500 mt-0.5">✓</span>
                          <span>{strength}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground text-sm">Aucune force identifiée</p>
                    )}
                  </div>
                </div>

                <div className="p-6 border rounded-xl bg-amber-500/5 border-amber-500/20">
                  <h3 className="font-semibold mb-4 flex items-center gap-2 text-amber-700">
                    <AlertTriangle className="w-5 h-5" />
                    Axes d'amélioration
                  </h3>
                  <div className="space-y-2">
                    {aiReport.areas_for_improvement && aiReport.areas_for_improvement.length > 0 ? (
                      aiReport.areas_for_improvement.map((area: string, idx: number) => (
                        <div key={idx} className="flex items-start gap-2 text-sm">
                          <span className="text-amber-500 mt-0.5">→</span>
                          <span>{area}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground text-sm">Aucun axe d'amélioration identifié</p>
                    )}
                  </div>
                </div>
              </div>

              {aiReport.recommendations && aiReport.recommendations.length > 0 && (
                <div className="p-6 border rounded-xl bg-card">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-purple-500" />
                    Recommandations
                  </h3>
                  <div className="space-y-3">
                    {aiReport.recommendations.map((rec: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold shrink-0">
                          {idx + 1}
                        </span>
                        <span className="text-sm">{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {aiReport.suggested_follow_up_questions && aiReport.suggested_follow_up_questions.length > 0 && (
                <div className="p-6 border rounded-xl bg-card">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-blue-500" />
                    Questions de suivi suggérées
                  </h3>
                  <div className="space-y-2">
                    {aiReport.suggested_follow_up_questions.map((question: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group">
                        <MessageSquare className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                        <span className="text-sm flex-1">{question}</span>
                        <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                          Copier
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>
          </div>
        </ScrollArea>
      </Tabs>
    </div>
  );
}
