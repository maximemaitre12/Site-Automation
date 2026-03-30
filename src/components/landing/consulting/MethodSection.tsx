import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const steps = [
  { num: "01", title: "Analyse", desc: "Nous identifions les points de friction dans vos opérations et les sources de perte de performance." },
  { num: "02", title: "Priorisation", desc: "Nous évaluons les opportunités à plus fort impact, en fonction de vos enjeux business." },
  { num: "03", title: "Déploiement", desc: "Nous accompagnons la mise en place de solutions concrètes pour améliorer durablement vos opérations." },
];

function PipelineDiagram({ isVisible }: { isVisible: boolean }) {
  const [activeStep, setActiveStep] = useState(-1);

  useEffect(() => {
    if (!isVisible) return;
    const timers = steps.map((_, i) =>
      setTimeout(() => setActiveStep(i), 400 + i * 600)
    );
    return () => timers.forEach(clearTimeout);
  }, [isVisible]);

  const nodes = [
    { x: 160, y: 50 },
    { x: 160, y: 130 },
    { x: 160, y: 210 },
  ];

  return (
    <svg viewBox="0 0 320 260" className="w-full max-w-[300px] mx-auto" preserveAspectRatio="xMidYMid meet">
      <defs>
        <marker id="method-arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M 0 0 L 6 3 L 0 6 Z" fill="hsl(var(--primary))" opacity="0.5" />
        </marker>
      </defs>

      {/* Connecting lines */}
      {[0, 1].map(i => {
        const active = i < activeStep;
        return (
          <g key={`line-${i}`}>
            <line
              x1="160" y1={nodes[i].y + 28}
              x2="160" y2={nodes[i + 1].y - 28}
              stroke={active ? "hsl(var(--primary))" : "hsl(var(--border))"}
              strokeWidth={active ? 1.5 : 1}
              opacity={active ? 0.4 : 0.15}
              className="transition-all duration-500"
              markerEnd={active ? "url(#method-arrow)" : undefined}
            />
            {active && (
              <circle r="2" fill="hsl(var(--primary))" opacity="0.4">
                <animateMotion dur="2s" repeatCount="indefinite"
                  path={`M 160 ${nodes[i].y + 28} L 160 ${nodes[i + 1].y - 28}`}
                />
              </circle>
            )}
          </g>
        );
      })}

      {/* Step nodes */}
      {nodes.map((pos, i) => {
        const active = i <= activeStep;
        return (
          <g key={`step-${i}`}>
            <circle
              cx={pos.x} cy={pos.y} r="26"
              fill={active ? "hsl(var(--primary) / 0.06)" : "hsl(var(--muted) / 0.4)"}
              stroke={active ? "hsl(var(--primary) / 0.35)" : "hsl(var(--border))"}
              strokeWidth={active ? 1.5 : 0.8}
              className="transition-all duration-500"
            />
            <text x={pos.x} y={pos.y - 4} textAnchor="middle" dominantBaseline="middle"
              className={cn("text-[13px] font-semibold select-none transition-colors duration-500", active ? "fill-primary" : "fill-muted-foreground/25")}
            >{steps[i].num}</text>
            <text x={pos.x} y={pos.y + 10} textAnchor="middle" dominantBaseline="middle"
              className={cn("text-[8px] font-medium select-none transition-colors duration-500", active ? "fill-foreground/60" : "fill-muted-foreground/15")}
            >{steps[i].title}</text>
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
      <div ref={ref} className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
        <div className={cn(
          "text-center mb-10 sm:mb-14 transition-all duration-500",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        )}>
          <p className="text-xs font-medium tracking-[0.2em] uppercase text-muted-foreground mb-3">Méthodologie</p>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight text-foreground">
            Une approche structurée
          </h2>
        </div>

        <div className="grid md:grid-cols-[1fr,1.3fr] gap-8 md:gap-12 items-center">
          <div className={cn("transition-all duration-700", isVisible ? "opacity-100" : "opacity-0")}>
            <PipelineDiagram isVisible={isVisible} />
          </div>

          <div className="space-y-4">
            {steps.map((step, i) => (
              <div
                key={i}
                className={cn(
                  "rounded-lg border border-border/40 p-5 transition-all duration-500 hover:border-primary/20",
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                )}
                style={{ transitionDelay: `${i * 180 + 400}ms` }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-semibold text-primary/50">{step.num}</span>
                  <h3 className="text-sm font-semibold text-foreground">{step.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
