import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { ArrowRight, User, Star, Target, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const candidates = [
  { name: "Sarah M.", role: "Senior React Dev", score: 94, skills: { react: 95, node: 88, aws: 72 }, avatar: "👩‍💻" },
  { name: "John D.", role: "Full Stack Dev", score: 87, skills: { react: 85, node: 92, aws: 78 }, avatar: "👨‍💻" },
  { name: "Alex K.", role: "Frontend Dev", score: 82, skills: { react: 90, node: 65, aws: 55 }, avatar: "🧑‍💻" },
];

interface AgentHRDemoProps {
  className?: string;
}

export function AgentHRDemo({ className }: AgentHRDemoProps) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.5, triggerOnce: false });
  const [phase, setPhase] = useState(0);
  const [animatedScores, setAnimatedScores] = useState<number[]>([0, 0, 0]);
  const [skillsProgress, setSkillsProgress] = useState(0);

  useEffect(() => {
    if (!isVisible) {
      setPhase(0);
      setAnimatedScores([0, 0, 0]);
      setSkillsProgress(0);
      return;
    }

    const t1 = setTimeout(() => setPhase(1), 500);
    const t2 = setTimeout(() => setPhase(2), 1500);
    const t3 = setTimeout(() => setPhase(3), 3000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [isVisible]);

  // Animate match scores
  useEffect(() => {
    if (phase >= 2) {
      const targets = candidates.map(c => c.score);
      const interval = setInterval(() => {
        setAnimatedScores(prev => {
          const newScores = prev.map((score, i) => {
            if (score >= targets[i]) return targets[i];
            return Math.min(score + 3, targets[i]);
          });
          if (newScores.every((s, i) => s >= targets[i])) {
            clearInterval(interval);
          }
          return newScores;
        });
      }, 30);
      return () => clearInterval(interval);
    }
  }, [phase]);

  // Animate skills progress
  useEffect(() => {
    if (phase >= 3) {
      const interval = setInterval(() => {
        setSkillsProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 2;
        });
      }, 20);
      return () => clearInterval(interval);
    }
  }, [phase]);

  return (
    <div
      ref={ref}
      className={cn(
        "relative p-6 md:p-8 rounded-2xl bg-gradient-to-br from-orange-500/5 via-background to-amber-500/5 border border-orange-500/20 overflow-hidden",
        className
      )}
    >
      {/* Background decoration */}
      <div className="absolute top-0 left-1/4 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: "1s" }} />

      <div className="relative z-10">
        {/* Job posting header */}
        <div className={cn(
          "mb-6 p-4 rounded-xl bg-secondary/50 border border-border/50 transition-all duration-500",
          phase >= 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-foreground">Senior React Developer</h4>
              <p className="text-sm text-muted-foreground">Engineering Team • Remote • Full-time</p>
            </div>
          </div>
        </div>

        {/* Candidates grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {candidates.map((candidate, i) => (
            <div
              key={candidate.name}
              className={cn(
                "p-4 rounded-xl bg-secondary/50 border transition-all duration-700",
                phase >= 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
                animatedScores[i] >= candidate.score && "border-orange-500/30 bg-orange-500/5"
              )}
              style={{ transitionDelay: `${i * 200}ms` }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30 flex items-center justify-center text-2xl">
                  {candidate.avatar}
                </div>
                <div>
                  <h5 className="text-sm font-semibold text-foreground">{candidate.name}</h5>
                  <p className="text-xs text-muted-foreground">{candidate.role}</p>
                </div>
              </div>

              {/* Match score circle */}
              <div className="relative w-24 h-24 mx-auto mb-4">
                <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="hsl(var(--border))"
                    strokeWidth="8"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke={i === 0 ? "#f97316" : i === 1 ? "#f59e0b" : "#fbbf24"}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${(animatedScores[i] / 100) * 251.2} 251.2`}
                    className="transition-all duration-300"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-foreground">{animatedScores[i]}%</span>
                </div>
              </div>

              {/* Stars */}
              <div className="flex items-center justify-center gap-1">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star
                    key={j}
                    className={cn(
                      "w-4 h-4 transition-all duration-500",
                      j < Math.round(animatedScores[i] / 20)
                        ? "text-amber-500 fill-amber-500"
                        : "text-muted-foreground/30"
                    )}
                    style={{ transitionDelay: `${j * 100}ms` }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Skills analysis */}
        <div className={cn(
          "p-4 rounded-xl bg-secondary/50 border border-border/50 mb-6 transition-all duration-700",
          phase >= 3 ? "opacity-100" : "opacity-0"
        )}>
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            <FileText className="w-4 h-4 text-orange-500" />
            Top Candidate Skills Analysis
          </div>
          <div className="space-y-3">
            {Object.entries(candidates[0].skills).map(([skill, value], i) => (
              <div key={skill} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="capitalize text-foreground">{skill}</span>
                  <span className="text-orange-500 font-medium">{Math.round(value * skillsProgress / 100)}%</span>
                </div>
                <div className="h-2 rounded-full bg-secondary overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-500"
                    style={{ 
                      width: `${value * skillsProgress / 100}%`,
                      transitionDelay: `${i * 100}ms`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className={cn(
          "text-center transition-all duration-700",
          phase >= 3 && skillsProgress >= 100 ? "opacity-100" : "opacity-0"
        )}>
          <p className="text-base font-medium text-foreground mb-4">
            Find your perfect candidate 75% faster with AI
          </p>
          <Link to="/signup" onClick={(e) => e.stopPropagation()}>
            <Button size="lg" className="shadow-lg shadow-orange-500/25 bg-orange-500 hover:bg-orange-600">
              Create Your Agent
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
