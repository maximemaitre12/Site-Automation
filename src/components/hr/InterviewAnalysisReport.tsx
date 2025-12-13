import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Brain, Target, Users, Heart, Mic2, TrendingUp, 
  AlertTriangle, CheckCircle, Lightbulb, FileText
} from 'lucide-react';

interface VoiceAnalysis {
  confidence_score?: number;
  stress_level?: 'low' | 'medium' | 'high';
  fluency_score?: number;
  clarity_score?: number;
  emotional_state?: string;
  hesitation_count?: number;
  speaking_pace?: 'slow' | 'moderate' | 'fast';
  key_insights?: string[];
}

interface Evaluation {
  score?: number;
  details?: Array<{ skill?: string; name?: string; score: number; evidence?: string }>;
  criteria?: Array<{ name: string; score: number; evidence?: string }>;
  alignment_points?: string[];
  concerns?: string[];
}

interface AIReport {
  summary?: string;
  strengths?: string[];
  areas_for_improvement?: string[];
  recommendations?: string[];
  suggested_follow_up_questions?: string[];
  hiring_recommendation?: 'strongly_recommend' | 'recommend' | 'consider' | 'not_recommend';
}

interface MatchBreakdown {
  technical?: { score: number; weight: number };
  behavioral?: { score: number; weight: number };
  cultural?: { score: number; weight: number };
}

interface InterviewData {
  match_score?: number | null;
  match_breakdown?: MatchBreakdown | null;
  voice_analysis?: VoiceAnalysis | null;
  technical_evaluation?: Evaluation | null;
  behavioral_evaluation?: Evaluation | null;
  cultural_fit_evaluation?: Evaluation | null;
  ai_report?: AIReport | null;
  candidate?: {
    name: string;
  };
}

interface InterviewAnalysisReportProps {
  interview: InterviewData;
}

export function InterviewAnalysisReport({ interview }: InterviewAnalysisReportProps) {
  const matchScore = interview.match_score;
  const matchBreakdown = interview.match_breakdown;
  const voiceAnalysis = interview.voice_analysis;
  const technicalEvaluation = interview.technical_evaluation;
  const behavioralEvaluation = interview.behavioral_evaluation;
  const culturalFitEvaluation = interview.cultural_fit_evaluation;
  const aiReport = interview.ai_report;
  const candidateName = interview.candidate?.name;
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    if (score >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getStressLabel = (level: string) => {
    switch (level) {
      case 'low': return { label: 'Faible', color: 'bg-green-100 text-green-800' };
      case 'medium': return { label: 'Modéré', color: 'bg-yellow-100 text-yellow-800' };
      case 'high': return { label: 'Élevé', color: 'bg-red-100 text-red-800' };
      default: return { label: level, color: 'bg-muted' };
    }
  };

  const getRecommendationBadge = (rec: string) => {
    switch (rec) {
      case 'strongly_recommend':
        return <Badge className="bg-green-500">Fortement recommandé</Badge>;
      case 'recommend':
        return <Badge className="bg-blue-500">Recommandé</Badge>;
      case 'consider':
        return <Badge className="bg-yellow-500">À considérer</Badge>;
      case 'not_recommend':
        return <Badge variant="destructive">Non recommandé</Badge>;
      default:
        return null;
    }
  };

  const hasData = matchScore || voiceAnalysis || aiReport;

  if (!hasData) {
    return (
      <Card className="border-dashed">
        <CardContent className="py-12 text-center">
          <Brain className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Aucune analyse disponible</h3>
          <p className="text-sm text-muted-foreground">
            Enregistrez et analysez un entretien pour voir le rapport
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <ScrollArea className="h-[600px]">
      <div className="space-y-6 pr-4">
        {/* Match Score Header */}
        {matchScore && (
          <Card className="bg-gradient-to-r from-primary/10 to-primary/5">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium mb-1">Score de compatibilité</h3>
                  {candidateName && (
                    <p className="text-sm text-muted-foreground">{candidateName}</p>
                  )}
                </div>
                <div className="text-center">
                  <div className={`text-4xl font-bold ${getScoreColor(matchScore)}`}>
                    {Math.round(matchScore)}%
                  </div>
                  {aiReport?.hiring_recommendation && (
                    <div className="mt-2">
                      {getRecommendationBadge(aiReport.hiring_recommendation)}
                    </div>
                  )}
                </div>
              </div>

              {/* Match Breakdown */}
              {matchBreakdown && (
                <div className="grid grid-cols-3 gap-4 mt-6">
                  {matchBreakdown.technical && (
                    <div className="text-center p-3 bg-background rounded-lg">
                      <Target className="h-5 w-5 mx-auto mb-1 text-blue-500" />
                      <div className="font-medium">{Math.round(matchBreakdown.technical.score)}%</div>
                      <div className="text-xs text-muted-foreground">
                        Technique ({matchBreakdown.technical.weight * 100}%)
                      </div>
                    </div>
                  )}
                  {matchBreakdown.behavioral && (
                    <div className="text-center p-3 bg-background rounded-lg">
                      <Users className="h-5 w-5 mx-auto mb-1 text-purple-500" />
                      <div className="font-medium">{Math.round(matchBreakdown.behavioral.score)}%</div>
                      <div className="text-xs text-muted-foreground">
                        Comportement ({matchBreakdown.behavioral.weight * 100}%)
                      </div>
                    </div>
                  )}
                  {matchBreakdown.cultural && (
                    <div className="text-center p-3 bg-background rounded-lg">
                      <Heart className="h-5 w-5 mx-auto mb-1 text-pink-500" />
                      <div className="font-medium">{Math.round(matchBreakdown.cultural.score)}%</div>
                      <div className="text-xs text-muted-foreground">
                        Culturel ({matchBreakdown.cultural.weight * 100}%)
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Voice Analysis */}
        {voiceAnalysis && Object.keys(voiceAnalysis).length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Mic2 className="h-4 w-4 text-primary" />
                Analyse vocale
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {voiceAnalysis.confidence_score !== undefined && (
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Confiance</div>
                    <div className="flex items-center gap-2">
                      <Progress 
                        value={voiceAnalysis.confidence_score} 
                        className={`h-2 flex-1 ${getProgressColor(voiceAnalysis.confidence_score)}`}
                      />
                      <span className="text-sm font-medium">{voiceAnalysis.confidence_score}%</span>
                    </div>
                  </div>
                )}
                {voiceAnalysis.fluency_score !== undefined && (
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Fluidité</div>
                    <div className="flex items-center gap-2">
                      <Progress 
                        value={voiceAnalysis.fluency_score} 
                        className={`h-2 flex-1 ${getProgressColor(voiceAnalysis.fluency_score)}`}
                      />
                      <span className="text-sm font-medium">{voiceAnalysis.fluency_score}%</span>
                    </div>
                  </div>
                )}
                {voiceAnalysis.clarity_score !== undefined && (
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Clarté</div>
                    <div className="flex items-center gap-2">
                      <Progress 
                        value={voiceAnalysis.clarity_score} 
                        className={`h-2 flex-1 ${getProgressColor(voiceAnalysis.clarity_score)}`}
                      />
                      <span className="text-sm font-medium">{voiceAnalysis.clarity_score}%</span>
                    </div>
                  </div>
                )}
                {voiceAnalysis.stress_level && (
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Niveau de stress</div>
                    <Badge className={getStressLabel(voiceAnalysis.stress_level).color}>
                      {getStressLabel(voiceAnalysis.stress_level).label}
                    </Badge>
                  </div>
                )}
              </div>

              {voiceAnalysis.key_insights && voiceAnalysis.key_insights.length > 0 && (
                <div>
                  <div className="text-sm font-medium mb-2">Observations clés</div>
                  <ul className="space-y-1">
                    {voiceAnalysis.key_insights.map((insight, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex gap-2">
                        <span className="text-primary">•</span>
                        {insight}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Technical Evaluation */}
        {technicalEvaluation && technicalEvaluation.score !== undefined && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Target className="h-4 w-4 text-blue-500" />
                Évaluation technique
                <Badge variant="outline" className="ml-auto">
                  {Math.round(technicalEvaluation.score)}%
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {technicalEvaluation.details && technicalEvaluation.details.length > 0 && (
                <div className="space-y-3">
                  {technicalEvaluation.details.map((item, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{item.skill || item.name}</span>
                        <span className={getScoreColor(item.score)}>{item.score}%</span>
                      </div>
                      <Progress value={item.score} className={`h-1.5 ${getProgressColor(item.score)}`} />
                      {item.evidence && (
                        <p className="text-xs text-muted-foreground">{item.evidence}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Behavioral Evaluation */}
        {behavioralEvaluation && behavioralEvaluation.score !== undefined && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="h-4 w-4 text-purple-500" />
                Évaluation comportementale
                <Badge variant="outline" className="ml-auto">
                  {Math.round(behavioralEvaluation.score)}%
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {behavioralEvaluation.criteria && behavioralEvaluation.criteria.length > 0 && (
                <div className="space-y-3">
                  {behavioralEvaluation.criteria.map((item, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{item.name}</span>
                        <span className={getScoreColor(item.score)}>{item.score}%</span>
                      </div>
                      <Progress value={item.score} className={`h-1.5 ${getProgressColor(item.score)}`} />
                      {item.evidence && (
                        <p className="text-xs text-muted-foreground">{item.evidence}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* AI Report Summary */}
        {aiReport && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Brain className="h-4 w-4 text-primary" />
                Rapport d'analyse IA
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {aiReport.summary && (
                <div>
                  <div className="text-sm font-medium mb-1 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Résumé
                  </div>
                  <p className="text-sm text-muted-foreground">{aiReport.summary}</p>
                </div>
              )}

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {aiReport.strengths && aiReport.strengths.length > 0 && (
                  <div>
                    <div className="text-sm font-medium mb-2 flex items-center gap-2 text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      Points forts
                    </div>
                    <ul className="space-y-1">
                      {aiReport.strengths.map((s, i) => (
                        <li key={i} className="text-sm flex gap-2">
                          <span className="text-green-500">+</span>
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {aiReport.areas_for_improvement && aiReport.areas_for_improvement.length > 0 && (
                  <div>
                    <div className="text-sm font-medium mb-2 flex items-center gap-2 text-orange-600">
                      <TrendingUp className="h-4 w-4" />
                      Axes d'amélioration
                    </div>
                    <ul className="space-y-1">
                      {aiReport.areas_for_improvement.map((a, i) => (
                        <li key={i} className="text-sm flex gap-2">
                          <span className="text-orange-500">→</span>
                          {a}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {aiReport.recommendations && aiReport.recommendations.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <div className="text-sm font-medium mb-2 flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-yellow-500" />
                      Recommandations
                    </div>
                    <ul className="space-y-1">
                      {aiReport.recommendations.map((r, i) => (
                        <li key={i} className="text-sm text-muted-foreground flex gap-2">
                          <span className="text-primary">{i + 1}.</span>
                          {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}

              {aiReport.suggested_follow_up_questions && aiReport.suggested_follow_up_questions.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <div className="text-sm font-medium mb-2 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-blue-500" />
                      Questions de suivi suggérées
                    </div>
                    <ul className="space-y-1">
                      {aiReport.suggested_follow_up_questions.map((q, i) => (
                        <li key={i} className="text-sm text-muted-foreground flex gap-2">
                          <span className="text-blue-500">?</span>
                          {q}
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </ScrollArea>
  );
}
