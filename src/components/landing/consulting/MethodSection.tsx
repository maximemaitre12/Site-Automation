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
      setTimeout(() => setActiveStep(i), 400 + i * 600);
    });
  }, [isVisible]);

  // Horizontal layout
  const positions = [
    { x: 80, y: 70 },
    { x: 250, y: 70 },
    { x: 420, y: 70 },
  ];

  const edgePaths = [
    "M 120 70 L 210 70",
    "M 290 70 L 380 70",
  ];

  return (
    <svg viewBox="0 0 500 140" className="w-full max-w-2xl mx-auto hidden sm:block" preserveAspectRatio="xMidYMid meet">
      <defs>
        <marker id="pipeline-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M 0 0 L 8 4 L 0 8 Z" fill="hsl(var(--primary))" opacity="0.7" />
        </marker>
        <filter id="step-glow">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Edges */}
      {edgePaths.map((path, i) => {
        const edgeActive = i < activeStep;
        return (
          <g key={i}>
            {/* Track */}
            <path d={path} fill="none" stroke="hsl(var(--muted-foreground))" strokeWidth="2" opacity="0.1" />
            {/* Active overlay */}
            <path
              d={path} fill="none"
              stroke={edgeActive ? "hsl(var(--primary))" : "transparent"}
              strokeWidth="2.5"
              opacity="0.5"
              className="transition-all duration-700"
              markerEnd={edgeActive ? "url(#pipeline-arrow)" : undefined}
            />
            {/* Particles */}
            {edgeActive && (
              <>
                <circle r="4" fill="hsl(var(--primary))" filter="url(#step-glow)" opacity="0.8">
                  <animateMotion dur="1.8s" repeatCount="indefinite" path={path} />
                </circle>
                <circle r="2.5" fill="hsl(var(--primary))" opacity="0.4">
                  <animateMotion dur="1.8s" repeatCount="indefinite" path={path} begin="0.6s" />
                </circle>
              </>
            )}
          </g>
        );
      })}

      {/* Nodes */}
      {positions.map((pos, i) => {
        const isActive = i <= activeStep;
        return (
          <g key={i}>
            {/* Pulse */}
            {isActive && (
              <circle cx={pos.x} cy={pos.y} r="36" fill="none" stroke="hsl(var(--primary))" strokeWidth="1" opacity="0">
                <animate attributeName="r" values="36;48;36" dur="2.5s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.3;0;0.3" dur="2.5s" repeatCount="indefinite" />
              </circle>
            )}
            {/* Circle */}
            <circle
              cx={pos.x} cy={pos.y} r="36"
              fill={isActive ? "hsl(var(--primary) / 0.1)" : "hsl(var(--muted) / 0.5)"}
              stroke={isActive ? "hsl(var(--primary))" : "hsl(var(--muted-foreground) / 0.12)"}
              strokeWidth={isActive ? 2 : 1}
              className="transition-all duration-500"
              filter={isActive ? "url(#step-glow)" : undefined}
            />
            {/* Number */}
            <text
              x={pos.x} y={pos.y - 4} textAnchor="middle" dominantBaseline="middle"
              className={cn("text-[16px] font-bold transition-colors duration-500 select-none", isActive ? "fill-primary" : "fill-muted-foreground/40")}
            >
              {steps[i].num}
            </text>
            {/* Title below */}
            <text
              x={pos.x} y={pos.y + 14} textAnchor="middle" dominantBaseline="middle"
              className={cn("text-[9px] font-medium transition-colors duration-500 select-none", isActive ? "fill-primary" : "fill-muted-foreground/40")}
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
    <section className="py-20 sm:py-28 bg-secondary/30 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.03),transparent_70%)]" />
      
      <div ref={ref} className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
        <div className={cn(
          "text-center mb-12 sm:mb-16 transition-all duration-500",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        )}>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight text-foreground mb-3">
            Une méthode <span className="text-primary">simple</span> et structurée
          </h2>
        </div>

        {/* SVG Pipeline */}
        <div className={cn(
          "mb-12 transition-all duration-700",
          isVisible ? "opacity-100" : "opacity-0"
        )}>
          <PipelineDiagram isVisible={isVisible} />
        </div>

        {/* Cards */}
        <div className="grid sm:grid-cols-3 gap-5 sm:gap-6">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div
                key={i}
                className={cn(
                  "group rounded-xl border border-border/50 bg-card/60 backdrop-blur-sm p-6 transition-all duration-500 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5",
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                )}
                style={{ transitionDelay: `${i * 200 + 400}ms` }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
                    <Icon className="w-5 h-5 text-primary" strokeWidth={1.5} />
                  </div>
                  <span className="text-xs font-bold text-primary/60">{step.num}</span>
                </div>
                <h3 className="text-base font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
