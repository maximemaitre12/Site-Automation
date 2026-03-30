import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Search, BarChart3, Rocket } from "lucide-react";

const steps = [
  {
    icon: Search,
    num: "01",
    title: "Analyse",
    desc: "Nous identifions les points de friction dans vos opérations et les sources de perte de performance.",
  },
  {
    icon: BarChart3,
    num: "02",
    title: "Priorisation",
    desc: "Nous évaluons les opportunités à plus fort impact, en fonction de vos enjeux business.",
  },
  {
    icon: Rocket,
    num: "03",
    title: "Déploiement",
    desc: "Nous accompagnons la mise en place de solutions concrètes pour améliorer durablement vos opérations.",
  },
];

function PipelineDiagram({ isVisible }: { isVisible: boolean }) {
  const [activeStep, setActiveStep] = useState(-1);

  useEffect(() => {
    if (!isVisible) return;
    steps.forEach((_, i) => {
      setTimeout(() => setActiveStep(i), 300 + i * 500);
    });
  }, [isVisible]);

  const nodePositions = [
    { x: 60, y: 60 },
    { x: 200, y: 60 },
    { x: 340, y: 60 },
  ];

  const edgePaths = [
    "M 90 60 L 170 60",
    "M 230 60 L 310 60",
  ];

  return (
    <svg viewBox="0 0 400 120" className="w-full max-w-lg mx-auto hidden sm:block" preserveAspectRatio="xMidYMid meet">
      {/* Edges */}
      {edgePaths.map((path, i) => {
        const edgeActive = i < activeStep;
        return (
          <g key={i}>
            <path
              d={path}
              fill="none"
              stroke={edgeActive ? "hsl(var(--primary))" : "hsl(var(--muted-foreground) / 0.15)"}
              strokeWidth="2"
              className="transition-all duration-500"
              markerEnd={edgeActive ? "url(#arrow)" : undefined}
            />
            {edgeActive && (
              <circle r="3" fill="hsl(var(--primary))" opacity="0.7">
                <animateMotion dur="1.5s" repeatCount="indefinite" path={path} />
              </circle>
            )}
          </g>
        );
      })}

      <defs>
        <marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M 0 0 L 6 3 L 0 6 Z" fill="hsl(var(--primary))" />
        </marker>
      </defs>

      {/* Nodes */}
      {nodePositions.map((pos, i) => {
        const isActive = i <= activeStep;
        return (
          <g key={i}>
            <circle
              cx={pos.x} cy={pos.y} r="26"
              fill={isActive ? "hsl(var(--primary) / 0.1)" : "hsl(var(--muted))"}
              stroke={isActive ? "hsl(var(--primary))" : "hsl(var(--muted-foreground) / 0.15)"}
              strokeWidth="1.5"
              className="transition-all duration-500"
            />
            {isActive && (
              <circle cx={pos.x} cy={pos.y} r="26" fill="none" stroke="hsl(var(--primary))" strokeWidth="1" opacity="0">
                <animate attributeName="r" values="26;36;26" dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.3;0;0.3" dur="2s" repeatCount="indefinite" />
              </circle>
            )}
            <text
              x={pos.x} y={pos.y + 1}
              textAnchor="middle" dominantBaseline="middle"
              className={cn(
                "text-[10px] font-semibold transition-colors duration-500",
                isActive ? "fill-primary" : "fill-muted-foreground"
              )}
            >
              {steps[i].num}
            </text>
            <text
              x={pos.x} y={pos.y + 44}
              textAnchor="middle" dominantBaseline="middle"
              className="text-[9px] fill-muted-foreground font-medium"
            >
              {steps[i].title}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function MethodSection() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });

  return (
    <section className="py-16 sm:py-24 bg-secondary/30">
      <div ref={ref} className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className={cn(
          "text-center mb-10 sm:mb-14 transition-all duration-500",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        )}>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight text-foreground mb-3">
            Une méthode simple et structurée
          </h2>
        </div>

        {/* SVG Pipeline (desktop) */}
        <div className={cn(
          "mb-10 transition-all duration-700",
          isVisible ? "opacity-100" : "opacity-0"
        )}>
          <PipelineDiagram isVisible={isVisible} />
        </div>

        {/* Cards */}
        <div className="grid sm:grid-cols-3 gap-6">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div
                key={i}
                className={cn(
                  "rounded-xl border bg-card p-5 sm:p-6 transition-all duration-500",
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                )}
                style={{ transitionDelay: `${i * 150 + 300}ms` }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-primary" strokeWidth={1.5} />
                  </div>
                  <span className="text-xs font-medium text-primary">{step.num}</span>
                </div>
                <h3 className="text-sm font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
