import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { User, Star, Target, Mic, Brain, CheckCircle2, TrendingUp, MessageSquare } from "lucide-react";

const candidates = [
  { name: "Sarah M.", role: "Senior React Dev", score: 94, avatar: "👩‍💻" },
  { name: "John D.", role: "Full Stack Dev", score: 87, avatar: "👨‍💻" },
  { name: "Alex K.", role: "Frontend Dev", score: 82, avatar: "🧑‍💻" },
];

const interviewInsights = [
  { label: "Communication", score: 92, icon: MessageSquare },
  { label: "Technical", score: 88, icon: Brain },
  { label: "Problem Solving", score: 95, icon: TrendingUp },
];

interface AgentHRDemoProps {
  className?: string;
}

export function AgentHRDemo({ className }: AgentHRDemoProps) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1, triggerOnce: true });
  const [phase, setPhase] = useState(0);
  const [animatedScores, setAnimatedScores] = useState<number[]>([0, 0, 0]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingProgress, setRecordingProgress] = useState(0);
  const [insightScores, setInsightScores] = useState<number[]>([0, 0, 0]);

  useEffect(() => {
    if (!isVisible) {
      setPhase(0);
      setAnimatedScores([0, 0, 0]);
      setIsRecording(false);
      setRecordingProgress(0);
      setInsightScores([0, 0, 0]);
      return;
    }

    const t1 = setTimeout(() => setPhase(1), 300);
    const t2 = setTimeout(() => setPhase(2), 1200);
    const t3 = setTimeout(() => {
      setPhase(3);
      setIsRecording(true);
    }, 2500);
    const t4 = setTimeout(() => {
      setIsRecording(false);
      setPhase(4);
    }, 4500);
    const t5 = setTimeout(() => setPhase(5), 5500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, [isVisible]);

  useEffect(() => {
    if (phase >= 2) {
      const targets = candidates.map(c => c.score);
      const interval = setInterval(() => {
        setAnimatedScores(prev => {
          const newScores = prev.map((score, i) => {
            if (score >= targets[i]) return targets[i];
            return Math.min(score + 4, targets[i]);
          });
          if (newScores.every((s, i) => s >= targets[i])) clearInterval(interval);
          return newScores;
        });
      }, 30);
      return () => clearInterval(interval);
    }
  }, [phase]);

  useEffect(() => {
    if (isRecording) {
      const interval = setInterval(() => {
        setRecordingProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 2;
        });
      }, 30);
      return () => clearInterval(interval);
    }
  }, [isRecording]);

  useEffect(() => {
    if (phase >= 5) {
      const targets = interviewInsights.map(i => i.score);
      const interval = setInterval(() => {
        setInsightScores(prev => {
          const newScores = prev.map((score, i) => {
            if (score >= targets[i]) return targets[i];
            return Math.min(score + 3, targets[i]);
          });
          if (newScores.every((s, i) => s >= targets[i])) clearInterval(interval);
          return newScores;
        });
      }, 25);
      return () => clearInterval(interval);
    }
  }, [phase]);

  const SoundWave = ({ isActive }: { isActive: boolean }) => (
    <div className="flex items-center justify-center gap-0.5 h-5">
      {Array.from({ length: 16 }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "w-0.5 rounded-full transition-all duration-150",
            isActive ? "bg-violet-500" : "bg-violet-500/30"
          )}
          style={{
            height: isActive ? `${Math.random() * 70 + 30}%` : "20%",
          }}
        />
      ))}
    </div>
  );

  return (
    <div
      ref={ref}
      className={cn(
        "relative p-4 rounded-xl bg-gradient-to-br from-violet-500/5 via-background to-purple-500/5 border border-violet-500/20 overflow-hidden",
        className
      )}
    >
      <div className="absolute top-0 left-1/4 w-24 h-24 bg-violet-500/10 rounded-full blur-2xl animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-20 h-20 bg-purple-500/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: "1s" }} />

      <div className="relative z-10">
        {/* Job posting header */}
        <div className={cn(
          "mb-3 p-2 rounded-lg bg-secondary/50 border border-border/50 transition-all duration-500",
          phase >= 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-secondary/60 border border-border/60 flex items-center justify-center">
              <Target className="w-4 h-4 text-violet-500" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground">Senior React Developer</h4>
              <p className="text-[10px] text-muted-foreground">Engineering • Remote</p>
            </div>
          </div>
        </div>

        {/* Candidates - compact inline view */}
        <div className={cn(
          "flex gap-2 mb-3 overflow-x-auto pb-1",
          phase >= 2 ? "opacity-100" : "opacity-0"
        )}>
          {candidates.map((candidate, i) => (
            <div
              key={candidate.name}
              className={cn(
                "flex-shrink-0 p-2 rounded-lg bg-secondary/50 border transition-all duration-500 min-w-[90px]",
                animatedScores[i] >= candidate.score && "border-violet-500/30 bg-violet-500/5"
              )}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className="text-lg">{candidate.avatar}</span>
                <div>
                  <p className="text-[10px] font-semibold text-foreground">{candidate.name}</p>
                  <p className="text-[8px] text-muted-foreground">{candidate.role}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-violet-500">{animatedScores[i]}%</span>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star
                      key={j}
                      className={cn(
                        "w-2.5 h-2.5",
                        j < Math.round(animatedScores[i] / 20)
                          ? "text-violet-500 fill-violet-500"
                          : "text-muted-foreground/30"
                      )}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Interview Recording - compact */}
        <div className={cn(
          "p-2 rounded-lg bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-500/20 mb-3 transition-all duration-500",
          phase >= 3 ? "opacity-100" : "opacity-0"
        )}>
          <div className="flex items-center gap-2">
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center transition-all relative",
              isRecording 
                ? "bg-violet-600 shadow-lg shadow-violet-500/30" 
                : phase >= 4 
                  ? "bg-primary"
                  : "bg-violet-500"
            )}>
              {phase >= 4 ? (
                <CheckCircle2 className="w-4 h-4 text-white" />
              ) : (
                <Mic className={cn("w-4 h-4 text-white", isRecording && "animate-pulse")} />
              )}
              {isRecording && (
                <div className="absolute inset-0 rounded-full bg-violet-500/30 animate-ping" />
              )}
            </div>
            <div className="flex-1">
              <div className="h-6 rounded bg-secondary/50 overflow-hidden flex items-center px-2">
                <SoundWave isActive={isRecording} />
              </div>
              <div className="h-1 mt-1 rounded-full bg-secondary overflow-hidden">
                <div 
                  className={cn("h-full rounded-full transition-all", isRecording ? "bg-violet-500" : "bg-primary")}
                  style={{ width: `${recordingProgress}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* AI Analysis - compact */}
        <div className={cn(
          "p-2 rounded-lg bg-secondary/50 border border-border/50 transition-all duration-500",
          phase >= 4 ? "opacity-100" : "opacity-0"
        )}>
          <div className="flex items-center gap-1.5 text-[10px] font-semibold text-muted-foreground uppercase mb-2">
            <Brain className="w-3 h-3 text-violet-500" />
            AI Analysis
          </div>

          <div className={cn(
            "grid grid-cols-3 gap-2 transition-all duration-500",
            phase >= 5 ? "opacity-100" : "opacity-0"
          )}>
            {interviewInsights.map((insight, i) => {
              const Icon = insight.icon;
              return (
                <div key={insight.label} className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-0.5">
                    <Icon className="w-2.5 h-2.5 text-violet-500" />
                    <span className="text-[9px] text-muted-foreground">{insight.label}</span>
                  </div>
                  <span className="text-sm font-bold text-violet-500">{insightScores[i]}%</span>
                </div>
              );
            })}
          </div>

          <div className={cn(
            "mt-2 p-1.5 rounded bg-primary/10 border border-primary/20 transition-all duration-500",
            phase >= 5 && insightScores.every(s => s > 80) ? "opacity-100" : "opacity-0"
          )}>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3 h-3 text-primary shrink-0" />
              <p className="text-[10px] text-foreground">Excellent candidate - Recommended</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className={cn(
          "text-center mt-3 transition-all duration-500",
          phase >= 5 && insightScores.every(s => s > 80) ? "opacity-100" : "opacity-0"
        )}>
          <p className="text-xs font-medium text-foreground">
            Hire the best candidates with AI-powered screening
          </p>
        </div>
      </div>
    </div>
  );
}