import { useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  GraduationCap, Briefcase, Code, Users, TrendingUp, 
  ChevronDown, ChevronUp, Star, Award
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ScoreCategory {
  score: number; // 0-100 dans la catégorie
  details: string;
  level: 'excellent' | 'tres_bon' | 'bon' | 'moyen' | 'faible';
}

export interface DetailedScores {
  formation: ScoreCategory;
  experience: ScoreCategory;
  competences_techniques: ScoreCategory;
  soft_skills: ScoreCategory;
  coherence_parcours: ScoreCategory;
}

export interface CVScoringResult {
  scores: DetailedScores;
  total_score: number;
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'E';
  recommendation: string;
}

interface ScoreBreakdownProps {
  scoring: CVScoringResult;
  compact?: boolean;
  showDetails?: boolean;
}

const CATEGORY_CONFIG = {
  formation: {
    label: 'Formation',
    icon: GraduationCap,
    weight: 20,
    color: 'from-blue-500 to-blue-600'
  },
  experience: {
    label: 'Expérience',
    icon: Briefcase,
    weight: 25,
    color: 'from-green-500 to-green-600'
  },
  competences_techniques: {
    label: 'Compétences techniques',
    icon: Code,
    weight: 25,
    color: 'from-purple-500 to-purple-600'
  },
  soft_skills: {
    label: 'Soft Skills',
    icon: Users,
    weight: 15,
    color: 'from-amber-500 to-amber-600'
  },
  coherence_parcours: {
    label: 'Cohérence parcours',
    icon: TrendingUp,
    weight: 15,
    color: 'from-cyan-500 to-cyan-600'
  }
};

const GRADE_CONFIG = {
  'A+': { label: 'Exceptionnel', color: 'bg-emerald-600', textColor: 'text-emerald-600' },
  'A': { label: 'Excellent', color: 'bg-green-500', textColor: 'text-green-500' },
  'B': { label: 'Très bon', color: 'bg-blue-500', textColor: 'text-blue-500' },
  'C': { label: 'Bon', color: 'bg-yellow-500', textColor: 'text-yellow-500' },
  'D': { label: 'Moyen', color: 'bg-orange-500', textColor: 'text-orange-500' },
  'E': { label: 'Insuffisant', color: 'bg-red-500', textColor: 'text-red-500' }
};

const LEVEL_CONFIG = {
  excellent: { label: 'Excellent', color: 'text-emerald-500' },
  tres_bon: { label: 'Très bon', color: 'text-green-500' },
  bon: { label: 'Bon', color: 'text-blue-500' },
  moyen: { label: 'Moyen', color: 'text-yellow-500' },
  faible: { label: 'Faible', color: 'text-red-500' }
};

function getProgressColor(score: number): string {
  if (score >= 80) return 'bg-emerald-500';
  if (score >= 60) return 'bg-green-500';
  if (score >= 40) return 'bg-yellow-500';
  return 'bg-red-500';
}

export function ScoreBreakdown({ scoring, compact = false, showDetails: initialShowDetails = false }: ScoreBreakdownProps) {
  const [showDetails, setShowDetails] = useState(initialShowDetails);
  const gradeConfig = GRADE_CONFIG[scoring.grade];

  if (compact) {
    return (
      <div className="flex items-center gap-3">
        <div className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm",
          gradeConfig.color
        )}>
          {scoring.grade}
        </div>
        <div>
          <div className="text-lg font-semibold">{scoring.total_score}/100</div>
          <div className={cn("text-xs", gradeConfig.textColor)}>{gradeConfig.label}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header avec Grade et Score Total */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-muted/50 to-muted">
        <div className="flex items-center gap-4">
          <div className={cn(
            "w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg",
            gradeConfig.color
          )}>
            {scoring.grade}
          </div>
          <div>
            <div className="text-3xl font-bold">{scoring.total_score}<span className="text-lg text-muted-foreground">/100</span></div>
            <div className={cn("text-sm font-medium", gradeConfig.textColor)}>
              {gradeConfig.label}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {scoring.total_score >= 80 && (
            <Badge className="bg-gradient-to-r from-amber-500 to-yellow-400 text-white border-0">
              <Award className="w-3 h-3 mr-1" />
              Top Profil
            </Badge>
          )}
        </div>
      </div>

      {/* Recommendation */}
      {scoring.recommendation && (
        <p className="text-sm text-muted-foreground italic px-1">
          "{scoring.recommendation}"
        </p>
      )}

      {/* Toggle Details */}
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => setShowDetails(!showDetails)}
        className="w-full justify-between"
      >
        <span className="flex items-center gap-2">
          <Star className="w-4 h-4" />
          Détail par critère
        </span>
        {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </Button>

      {/* Detailed Scores */}
      {showDetails && (
        <div className="space-y-3 pt-2">
          {(Object.entries(scoring.scores) as [keyof DetailedScores, ScoreCategory][]).map(([key, category]) => {
            const config = CATEGORY_CONFIG[key];
            const levelConfig = LEVEL_CONFIG[category.level];
            const Icon = config.icon;
            
            return (
              <div key={key} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "w-6 h-6 rounded-md flex items-center justify-center bg-gradient-to-br text-white",
                      config.color
                    )}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-sm font-medium">{config.label}</span>
                    <span className="text-xs text-muted-foreground">({config.weight}%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={cn("text-xs", levelConfig.color)}>{levelConfig.label}</span>
                    <span className="text-sm font-semibold min-w-[40px] text-right">{category.score}/100</span>
                  </div>
                </div>
                
                <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className={cn("h-full rounded-full transition-all duration-500", getProgressColor(category.score))}
                    style={{ width: `${category.score}%` }}
                  />
                </div>
                
                {category.details && (
                  <p className="text-xs text-muted-foreground pl-8">{category.details}</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Helper pour calculer le score pondéré
export function calculateWeightedScore(scores: DetailedScores): number {
  const weights = {
    formation: 0.20,
    experience: 0.25,
    competences_techniques: 0.25,
    soft_skills: 0.15,
    coherence_parcours: 0.15
  };

  let total = 0;
  for (const [key, category] of Object.entries(scores) as [keyof DetailedScores, ScoreCategory][]) {
    total += category.score * weights[key];
  }
  
  return Math.round(total);
}

// Helper pour déterminer le grade
export function getGradeFromScore(score: number): 'A+' | 'A' | 'B' | 'C' | 'D' | 'E' {
  if (score >= 90) return 'A+';
  if (score >= 80) return 'A';
  if (score >= 70) return 'B';
  if (score >= 60) return 'C';
  if (score >= 50) return 'D';
  return 'E';
}

// Helper pour déterminer le level
export function getLevelFromScore(score: number): ScoreCategory['level'] {
  if (score >= 90) return 'excellent';
  if (score >= 75) return 'tres_bon';
  if (score >= 60) return 'bon';
  if (score >= 40) return 'moyen';
  return 'faible';
}
