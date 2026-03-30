import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Search, BarChart3, Rocket } from "lucide-react";

const steps = [
  { icon: Search, num: "01", title: "Analyse", desc: "Nous identifions les points de friction dans vos opérations et les sources de perte de performance.", color: "primary" },
  { icon: BarChart3, num: "02", title: "Priorisation", desc: "Nous évaluons les opportunités à plus fort impact, en fonction de vos enjeux business.", color: "primary" },
  { icon: Rocket, num: "03", title: "Déploiement", desc: "Nous accompagnons la mise en place de solutions concrètes pour améliorer durablement vos opérations.", color: "primary" },
];

function PipelineDiagram({ isVisible }: { isVisible: boolean }) {
  const [activeStep, setActiveStep] = useState(-1);
  const [dataFlowing, setDataFlowing] = useState(false);

  useEffect(() => {
    if (!isVisible) return;
    const timers = [
      setTimeout(() => setActiveStep(0), 400),
      setTimeout(() => setActiveStep(1), 1000),
      setTimeout(() => setActiveStep(2), 1600),
      setTimeout(() => setDataFlowing(true), 2000),
    ];
    return () => timers.forEach(clearTimeout);
  }, [isVisible]);

  // Vertical layout for all sizes
  const nodes = [
    { x: 170, y: 50 },
    { x: 170, y: 140 },
    { x: 170, y: 230 },
  ];

  const paths = [
    "M 170 85 L 170 105",
    "M 170 175 L 170 195",
  ];

  return (
    <svg viewBox="0 0 340 280" className="w-full max-w-[340px] mx-auto" preserveAspectRatio="xMidYMid meet">
      <defs>
        <filter id="pipe-glow">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <marker id="pipe-arrow" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 Z" fill="hsl(var(--primary))" opacity="0.6" />
        </marker>
      </defs>

      {/* Connecting paths */}
      {paths.map((path, i) => {
        const active = i < activeStep;
        return (
          <g key={`path-${i}`}>
            {/* Track */}
            <path d={path} fill="none" stroke="hsl(var(--muted-foreground))" strokeWidth="2" opacity="0.08" />
            {/* Active */}
            <path
              d={path} fill="none"
              stroke={active ? "hsl(var(--primary))" : "transparent"}
              strokeWidth="2.5"
              opacity="0.5"
              className="transition-all duration-700"
              markerEnd={active ? "url(#pipe-arrow)" : undefined}
            />
            {/* Data particles */}
            {dataFlowing && active && (
              <>
                <circle r="4" fill="hsl(var(--primary))" filter="url(#pipe-glow)" opacity="0.8">
                  <animateMotion dur="1.5s" repeatCount="indefinite" path={path} />
                </circle>
                <circle r="2.5" fill="hsl(var(--primary))" opacity="0.4">
                  <animateMotion dur="1.5s" repeatCount="indefinite" path={path} begin="0.5s" />
                </circle>
              </>
            )}
          </g>
        );
      })}

      {/* Step nodes */}
      {nodes.map((pos, i) => {
        const isActive = i <= activeStep;
        return (
          <g key={`node-${i}`}>
            {/* Pulse */}
            {isActive && (
              <circle cx={pos.x} cy={pos.y} r="32" fill="none" stroke="hsl(var(--primary))" strokeWidth="1" opacity="0">
                <animate attributeName="r" values="32;44;32" dur="2.5s" repeatCount="indefinite" begin={`${i * 0.3}s`} />
                <animate attributeName="opacity" values="0.3;0;0.3" dur="2.5s" repeatCount="indefinite" begin={`${i * 0.3}s`} />
              </circle>
            )}

            {/* Circle */}
            <circle
              cx={pos.x} cy={pos.y} r="32"
              fill={isActive ? "hsl(var(--primary) / 0.1)" : "hsl(var(--muted) / 0.5)"}
              stroke={isActive ? "hsl(var(--primary))" : "hsl(var(--muted-foreground) / 0.1)"}
              strokeWidth={isActive ? 2 : 1}
              className="transition-all duration-500"
              filter={isActive ? "url(#pipe-glow)" : undefined}
            />

            {/* Number */}
            <text x={pos.x} y={pos.y - 5} textAnchor="middle" dominantBaseline="middle"
              className={cn("text-[15px] font-bold transition-colors duration-500 select-none", isActive ? "fill-primary" : "fill-muted-foreground/30")}
            >
              {steps[i].num}
            </text>

            {/* Title */}
            <text x={pos.x} y={pos.y + 12} textAnchor="middle" dominantBaseline="middle"
              className={cn("text-[9px] font-semibold transition-colors duration-500 select-none", isActive ? "fill-primary" : "fill-muted-foreground/30")}
            >
              {steps[i].title}
            </text>

            {/* Side label */}
            <text x={pos.x + 50} y={pos.y} dominantBaseline="middle"
              className={cn("text-[9px] font-medium transition-all duration-500 select-none", isActive ? "fill-foreground/60" : "fill-muted-foreground/15")}
            >
              {steps[i].desc.substring(0, 35)}…
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function MethodSection() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.08 });

  return (
    <section className="py-20 sm:py-28 bg-secondary/30 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.03),transparent_70%)]" />

      <div ref={ref} className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
        <div className={cn(
          "text-center mb-10 sm:mb-14 transition-all duration-500",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        )}>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight text-foreground mb-3">
            Une méthode <span className="text-primary">simple</span> et structurée
          </h2>
        </div>

        <div className="grid md:grid-cols-[1fr,1.2fr] gap-8 md:gap-12 items-center">
          {/* Pipeline diagram - always visible */}
          <div className={cn(
            "transition-all duration-700",
            isVisible ? "opacity-100" : "opacity-0"
          )}>
            <PipelineDiagram isVisible={isVisible} />
          </div>

          {/* Cards */}
          <div className="space-y-4">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div
                  key={i}
                  className={cn(
                    "group rounded-xl border border-border/50 bg-card/60 backdrop-blur-sm p-5 transition-all duration-500 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5",
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  )}
                  style={{ transitionDelay: `${i * 200 + 400}ms` }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
                      <Icon className="w-5 h-5 text-primary" strokeWidth={1.5} />
                    </div>
                    <span className="text-xs font-bold text-primary/60">{step.num}</span>
                  </div>
                  <h3 className="text-base font-semibold text-foreground mb-1.5">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
